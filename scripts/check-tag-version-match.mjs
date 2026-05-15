#!/usr/bin/env node

/**
 * Verify that a release tag's version matches the version recorded in
 * package.json.
 *
 * Used by the tag-triggered publish workflow (see ADR 001). The workflow
 * passes the expected tag prefix; this script reads the tag from
 * `GITHUB_REF_NAME` (with a CLI-arg fallback for local testing) and the
 * package.json version, then asserts they match. Fails loudly on mismatch
 * so a half-published release cannot proceed.
 *
 * Usage:
 *   node scripts/check-tag-version-match.mjs <tagPrefix> [refName]
 *
 * Example:
 *   node scripts/check-tag-version-match.mjs v
 *
 * The tag name is read from `process.env.GITHUB_REF_NAME` first; falls
 * back to `process.argv[3]` if the env var is empty.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { exit } from 'node:process';

const [, , tagPrefix, refNameArg] = process.argv;

if (!tagPrefix) {
  console.error(
    'Usage: node scripts/check-tag-version-match.mjs <tagPrefix> [refName]',
  );
  exit(2);
}

const refName = process.env.GITHUB_REF_NAME || refNameArg;
if (!refName) {
  console.error(
    'No tag name supplied. Set GITHUB_REF_NAME or pass it as the second argument.',
  );
  exit(2);
}

if (!refName.startsWith(tagPrefix)) {
  console.error(
    `Tag "${refName}" does not start with the expected prefix "${tagPrefix}".`,
  );
  exit(1);
}

const tagVersion = refName.slice(tagPrefix.length);
if (!tagVersion) {
  console.error(
    `Tag "${refName}" has no version segment after prefix "${tagPrefix}".`,
  );
  exit(1);
}

const packageJsonPath = resolve('package.json');
let pkg;
try {
  pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
} catch (err) {
  console.error(`Could not read ${packageJsonPath}: ${err.message}`);
  exit(2);
}

const pkgVersion = pkg.version;
if (!pkgVersion) {
  console.error(`${packageJsonPath} has no "version" field.`);
  exit(2);
}

if (pkgVersion !== tagVersion) {
  console.error(
    `Tag/package mismatch. Tag "${refName}" implies version "${tagVersion}" but ${packageJsonPath} declares "${pkgVersion}".\n` +
      `Bump the version in package.json to match the tag (or retag the commit) and re-run.`,
  );
  exit(1);
}

console.log(`OK: tag "${refName}" matches ${pkg.name}@${pkgVersion}.`);
