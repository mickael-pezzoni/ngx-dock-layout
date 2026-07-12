#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PKG_PATH = path.join(__dirname, '..', 'projects', 'ngx-dock-layout', 'package.json');

function run(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}

function fail(message) {
  console.error(`\n✖ ${message}`);
  process.exit(1);
}

const rawVersion = process.argv[2];
if (!rawVersion) {
  fail('Usage: npm run release -- <version>  (ex: npm run release -- 1.1.0)');
}

const version = rawVersion.replace(/^v/, '');
if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version)) {
  fail(`"${rawVersion}" n'est pas un semver valide (attendu : X.Y.Z ou X.Y.Z-suffixe)`);
}

const tag = `v${version}`;

const existingTags = execSync('git tag').toString().split('\n');
if (existingTags.includes(tag)) {
  fail(`Le tag ${tag} existe déjà.`);
}

const status = execSync('git status --porcelain').toString().trim();
if (status) {
  fail(
    'Le working tree contient des changements non commités.\n  Commit ou stash-les avant de lancer la release.',
  );
}

const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
console.log(`→ Bump version : ${pkg.version} → ${version}`);
pkg.version = version;
fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2) + '\n');

console.log('→ Génération du CHANGELOG.md');
run('npm run changelog');

console.log('→ Commit + tag');
run(`git add "${PKG_PATH}" CHANGELOG.md`);
run(`git commit -m "release: ${tag}"`);
run(`git tag ${tag}`);

console.log(`\n✔ Release ${tag} prête localement.`);
console.log(`  Vérifie le résultat (git show, CHANGELOG.md) puis :`);
console.log(`  git push && git push origin ${tag}`);
