import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const SCRIPT = resolve(__dirname, '..', 'check-tag-version-match.mjs');

interface RunOptions {
  args?: string[];
  env?: Record<string, string | undefined>;
  pkgVersion?: string;
  omitVersionField?: boolean;
  omitPackageJson?: boolean;
}

interface RunResult {
  status: number | null;
  stdout: string;
  stderr: string;
}

function runScript(opts: RunOptions = {}): RunResult {
  const dir = mkdtempSync(join(tmpdir(), 'tag-version-match-'));
  try {
    if (!opts.omitPackageJson) {
      const pkg: Record<string, unknown> = { name: '@scope/pkg' };
      if (!opts.omitVersionField) {
        pkg.version = opts.pkgVersion ?? '1.2.3';
      }
      writeFileSync(join(dir, 'package.json'), JSON.stringify(pkg));
    }

    const result = spawnSync('node', [SCRIPT, ...(opts.args ?? [])], {
      cwd: dir,
      env: { ...process.env, GITHUB_REF_NAME: '', ...opts.env },
      encoding: 'utf8',
    });

    return {
      status: result.status,
      stdout: result.stdout,
      stderr: result.stderr,
    };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe('check-tag-version-match', () => {
  it('exits 0 when GITHUB_REF_NAME matches package.json version', () => {
    const result = runScript({
      args: ['v'],
      env: { GITHUB_REF_NAME: 'v1.2.3' },
      pkgVersion: '1.2.3',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/OK:/);
  });

  it('exits 1 when the tag and package.json versions differ', () => {
    const result = runScript({
      args: ['v'],
      env: { GITHUB_REF_NAME: 'v1.2.3' },
      pkgVersion: '1.2.4',
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/mismatch/i);
  });

  it('exits 1 when the tag does not start with the prefix', () => {
    const result = runScript({
      args: ['v'],
      env: { GITHUB_REF_NAME: 'release-1.2.3' },
      pkgVersion: '1.2.3',
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/does not start with/i);
  });

  it('exits 1 when the suffix is not a supported SemVer form', () => {
    const result = runScript({
      args: ['v'],
      env: { GITHUB_REF_NAME: 'vendor-snapshot-2026-05' },
      pkgVersion: 'endor-snapshot-2026-05',
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/not a supported SemVer form/);
  });

  it('accepts the pre-release SemVer forms used by the release workflow', () => {
    for (const tail of ['rc.1', 'alpha.2', 'beta.10', 'pre.42']) {
      const result = runScript({
        args: ['v'],
        env: { GITHUB_REF_NAME: `v1.2.3-${tail}` },
        pkgVersion: `1.2.3-${tail}`,
      });

      expect(result.status).toBe(0);
    }
  });

  it('prefers GITHUB_REF_NAME over the CLI fallback', () => {
    const result = runScript({
      args: ['v', 'v9.9.9'],
      env: { GITHUB_REF_NAME: 'v1.2.3' },
      pkgVersion: '1.2.3',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/v1\.2\.3/);
  });

  it('exits 2 when package.json has no version field', () => {
    const result = runScript({
      args: ['v'],
      env: { GITHUB_REF_NAME: 'v1.2.3' },
      omitVersionField: true,
    });

    expect(result.status).toBe(2);
    expect(result.stderr).toMatch(/no "version" field/);
  });
});
