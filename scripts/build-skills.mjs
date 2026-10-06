#!/usr/bin/env node
// Build the two flavours of every skill from one source.
//
//   src/skills/<name>/**        the source, written once
//   plugins/clickraft/skills/   CLI flavour (what `npx skills add` and the plugin manifests install)
//   mcp/skills/ + mcp/bundle.json  MCP flavour (vendored into the Clickraft MCP server)
//
// Flavour-specific text is wrapped in <cli>…</cli> or <mcp>…</mcp>, either as a block (the tags on
// their own lines) or inline within one line. Everything outside the tags is shared. A SKILL.md lists
// the flavours it ships in with `surfaces: [cli, mcp]` (default: cli only); the line is dropped from
// the output. A file whose rendered content is empty is not written for that flavour.
//
//   node scripts/build-skills.mjs          write both outputs
//   node scripts/build-skills.mjs --check  exit 1 if either output differs from the source (CI)
//   node scripts/build-skills.mjs --validate        render and validate only; write nothing
//   node scripts/build-skills.mjs --out <dir>       write <dir>/cli, <dir>/mcp and <dir>/bundle.json instead
//
// No dependencies: Node 20+ only.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src', 'skills');
const OUT = {
  cli: join(ROOT, 'plugins', 'clickraft', 'skills'),
  mcp: join(ROOT, 'mcp', 'skills'),
};
const BUNDLE = join(ROOT, 'mcp', 'bundle.json');
const FLAVOURS = ['cli', 'mcp'];
const check = process.argv.includes('--check');
const validateOnly = process.argv.includes('--validate');
const outIdx = process.argv.indexOf('--out');
const outDir = outIdx !== -1 ? process.argv[outIdx + 1] : null;
if (outIdx !== -1 && !outDir) {
  console.error('--out needs a directory');
  process.exit(2);
}

const errors = [];
const fail = (msg) => errors.push(msg);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir).sort()) {
    if (entry === '.DS_Store') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const posix = (p) => p.split(sep).join('/');

/** Keep the parts of `text` that belong to `flavour`. */
export function render(text, flavour, where) {
  // Block form: the opening and closing tags each sit alone on a line.
  let out = text.replace(/^<(cli|mcp)>\n([\s\S]*?)^<\/\1>\n/gm, (_, f, body) => {
    if (/<\/?(cli|mcp)>/.test(body)) fail(`${where}: nested <${f}> block`);
    return f === flavour ? body : '';
  });
  // Inline form: within a single line.
  out = out.replace(/<(cli|mcp)>(.*?)<\/\1>/g, (_, f, body) => (f === flavour ? body : ''));
  const left = out.match(/<\/?(cli|mcp)>/);
  if (left) fail(`${where}: unbalanced or misplaced ${left[0]}`);
  return out;
}

function surfacesOf(skillMd, where) {
  const fm = skillMd.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) {
    fail(`${where}: no frontmatter`);
    return ['cli'];
  }
  const line = fm[1].match(/^surfaces:\s*\[([^\]]*)\]\s*$/m);
  if (!line) return ['cli'];
  const list = line[1].split(',').map((s) => s.trim()).filter(Boolean);
  for (const s of list) if (!FLAVOURS.includes(s)) fail(`${where}: unknown surface "${s}"`);
  return list;
}

const dropSurfaces = (text) => text.replace(/^surfaces:\s*\[[^\]]*\]\s*\n/m, '');

/** Minimal frontmatter reader for name, version and the `description: |` block. */
function frontmatter(text, where) {
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) return fail(`${where}: no frontmatter`), {};
  const body = fm[1];
  const scalar = (key) => body.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1].trim();
  const lines = body.split('\n');
  const i = lines.findIndex((l) => /^description:\s*\|\s*$/.test(l));
  let description = scalar('description') ?? '';
  if (i !== -1) {
    const block = [];
    for (const l of lines.slice(i + 1)) {
      if (l !== '' && !l.startsWith('  ')) break;
      block.push(l.slice(2));
    }
    description = block.join('\n').trim();
  }
  return { name: scalar('name'), version: scalar('version'), description };
}

function validate(flavour, name, files) {
  const where = `${flavour}:${name}`;
  const skill = files.get('SKILL.md');
  if (!skill) return fail(`${where}: no SKILL.md`);
  const fm = frontmatter(skill, where);
  if (fm.name !== name) fail(`${where}: name "${fm.name}" != directory`);
  if (!fm.version) fail(`${where}: version missing`);
  if (fm.description.length > 1024) fail(`${where}: description is ${fm.description.length} chars (max 1024)`);
  if (!fm.description.includes('Use when:')) fail(`${where}: description lacks "Use when:"`);
  if (!fm.description.includes('NOT for:')) fail(`${where}: description lacks "NOT for:"`);
  const refs = [...files.keys()].filter((p) => p.startsWith('references/'));
  for (const m of new Set(skill.match(/references\/[A-Za-z0-9_./-]+\.md/g) ?? [])) {
    if (!files.has(m)) fail(`${where}: SKILL.md mentions ${m}, which this flavour does not ship`);
  }
  for (const r of refs) {
    const base = r.split('/').pop();
    if (r.endsWith('.md') && !skill.includes(base)) fail(`${where}: ${r} is not linked from SKILL.md`);
  }
  for (const [p, text] of files) {
    if (/(^|[^./])\.\.\//.test(text)) fail(`${where}: ${p} contains a ../ reference`);
  }
}

function build() {
  const outputs = { cli: new Map(), mcp: new Map() }; // flavour -> Map(relPath -> content)
  const bundleSkills = [];
  const version = readFileSync(join(ROOT, 'VERSION'), 'utf8').trim();

  for (const name of readdirSync(SRC).sort()) {
    const dir = join(SRC, name);
    if (!statSync(dir).isDirectory()) continue;
    const sources = walk(dir).map((f) => [posix(relative(dir, f)), readFileSync(f, 'utf8')]);
    const skillSrc = sources.find(([p]) => p === 'SKILL.md')?.[1] ?? '';
    const surfaces = surfacesOf(skillSrc, `src/skills/${name}/SKILL.md`);

    for (const flavour of surfaces) {
      const files = new Map();
      for (const [p, text] of sources) {
        let out = render(text, flavour, `src/skills/${name}/${p}`);
        if (p === 'SKILL.md') out = dropSurfaces(out);
        if (out.trim() === '') continue;
        files.set(p, out);
        outputs[flavour].set(`${name}/${p}`, out);
      }
      validate(flavour, name, files);
      if (flavour === 'mcp') {
        const fm = frontmatter(files.get('SKILL.md') ?? '', `mcp:${name}`);
        const paths = ['SKILL.md', ...[...files.keys()].filter((p) => p !== 'SKILL.md').sort()];
        bundleSkills.push({
          name,
          version: fm.version,
          description: fm.description,
          files: paths.map((p) => ({ path: p, content: files.get(p) })),
        });
      }
    }
  }

  const bundle = { schemaVersion: 1, skillsVersion: version, skills: bundleSkills };
  const bundleText = `${JSON.stringify(bundle, null, 2)}\n`;
  return { outputs, bundleText };
}

function onDisk(root) {
  const m = new Map();
  if (!existsSync(root)) return m;
  for (const f of walk(root)) m.set(posix(relative(root, f)), readFileSync(f, 'utf8'));
  return m;
}

const { outputs, bundleText } = build();
if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}

if (validateOnly) {
  console.log(`OK rendered and validated (cli: ${outputs.cli.size} files, mcp: ${outputs.mcp.size} files)`);
} else if (check) {
  const drift = [];
  for (const flavour of FLAVOURS) {
    const disk = onDisk(OUT[flavour]);
    for (const [p, text] of outputs[flavour]) {
      if (disk.get(p) !== text) drift.push(`${flavour}: ${p} ${disk.has(p) ? 'differs' : 'missing'}`);
    }
    for (const p of disk.keys()) if (!outputs[flavour].has(p)) drift.push(`${flavour}: ${p} is stale`);
  }
  const diskBundle = existsSync(BUNDLE) ? readFileSync(BUNDLE, 'utf8') : null;
  if (diskBundle !== bundleText) drift.push('mcp/bundle.json differs');
  if (drift.length) {
    for (const d of drift) console.error(`drift: ${d}`);
    console.error('Generated skills are out of date. Run: node scripts/build-skills.mjs');
    process.exit(1);
  }
  console.log('OK generated skills match src/skills');
} else {
  const dest = outDir
    ? { cli: join(outDir, 'cli'), mcp: join(outDir, 'mcp'), bundle: join(outDir, 'bundle.json') }
    : { ...OUT, bundle: BUNDLE };
  for (const flavour of FLAVOURS) {
    rmSync(dest[flavour], { recursive: true, force: true });
    for (const [p, text] of outputs[flavour]) {
      const target = join(dest[flavour], p);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, text);
    }
  }
  mkdirSync(dirname(dest.bundle), { recursive: true });
  writeFileSync(dest.bundle, bundleText);
  const sha = createHash('sha256').update(bundleText).digest('hex').slice(0, 12);
  console.log(
    `built cli: ${outputs.cli.size} files, mcp: ${outputs.mcp.size} files, bundle sha256 ${sha}`,
  );
}
