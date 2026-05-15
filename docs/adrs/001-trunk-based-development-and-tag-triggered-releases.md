# ADR 001: Trunk-based development and tag-triggered npm releases

- Status: Accepted
- Date: 2026-05-15

## Context

The repository previously used a two-branch model (`next` for integration, `main` for released code) with `release-please` driving version bumps and changelogs via bot-authored PRs. The flow was:

1. Feature PRs target `next`.
2. A `release/X.Y.Z` branch is cut from `next`.
3. `release-please` opens a PR on that branch bumping `package.json`, `.release-please-manifest.json`, and `CHANGELOG.md`.
4. That PR merges into the release branch.
5. A second PR merges the release branch into `main`.
6. A workflow on `main` tags the commit and publishes to npm.
7. A manual merge of `main` back into `next` is required to keep version files in sync.

This model has several recurring failure modes in practice:

- The post-release merge from `main` into `next` is easy to forget or to resolve incorrectly. In the 2.0.0 release, `next`'s `.release-please-manifest.json` and `package.json` ended up out of sync with `main`, which would have caused `release-please` to attempt a duplicate `2.0.0` bump on the next release attempt.
- Every release goes through at least two PRs and one bot-authored intermediate state. The cognitive overhead per release is high relative to the actual change being shipped.
- `release-please` infers the version bump from conventional commits. When the inference disagrees with intent (e.g. a `feat!` that the team would rather treat as a minor), there is no clean override path.
- The version recorded in `package.json` is decoupled from the tag that triggers publication. Mismatches are possible and have to be caught by reading workflow logs.

A simpler model already exists in `tests-untp` (see that repo's `docs/adrs/031-per-package-tag-triggered-npm-release.md`): a single trunk (`main`), tag-triggered publishes, hand-curated changelog and release notes, and a pipeline-side check that asserts the tag's version matches `package.json` before publishing. Disaster recovery is handled by a separate manually-triggered workflow that can either `npm unpublish` (within the 72-hour window) or `npm deprecate` (outside it).

## Decision

Adopt the `tests-untp` release model in this repository, with adjustments for the single-package layout.

1. **Trunk-based development on `main`.** Feature branches PR directly into `main`. The `next` branch is retired.
2. **Tag-triggered npm publish.** Pushing a tag of the form `v<X.Y.Z>` (e.g. `v2.1.0`) triggers a workflow that builds and publishes the tagged commit. Pre-release tags `v<X.Y.Z>-rc.N`, `-alpha.N`, `-beta.N`, `-pre.N` publish under the `rc` npm dist-tag; everything else publishes under `latest`.
3. **Pipeline-side version match check.** Before publishing, the workflow runs `scripts/check-tag-version-match.mjs`, which reads the tag from `GITHUB_REF_NAME` and asserts that the version segment matches `package.json`'s `version`. Mismatches fail loudly so a half-published release cannot proceed.
4. **OIDC Trusted Publishing.** Authentication to npm uses npm's OIDC Trusted Publishing flow. The npmjs.com Trusted Publisher for `@pyx-industries/vc-render-template-utils` is configured to trust the release workflow in this repository. No long-lived `NPM_TOKEN` secret is required.
5. **Hand-curated `CHANGELOG.md` and `RELEASE_NOTES.md`.** Each PR that lands a user-visible change is responsible for updating both files: `CHANGELOG.md` follows [Keep a Changelog](https://keepachangelog.com/) and is the per-change technical record; `RELEASE_NOTES.md` is a user-facing narrative per version. No bot generates them.
6. **Version bump in-PR.** The PR that introduces the change for a release bumps `package.json` to the target version. The release happens by tagging the resulting merge commit on `main`.
7. **Disaster recovery via a manual workflow.** A separate `workflow_dispatch` workflow can `npm unpublish` (if within the 72-hour window and no published package depends on the version) or `npm deprecate` (the fallback for older versions). The workflow records the chosen reason in its logs.

## Consequences

### Positive

- Releasing is one tag push. No bot-authored PRs, no two-branch sync, no `release-please-manifest.json` to maintain.
- The published version is impossible to disagree with the tag, because the pipeline refuses to publish on mismatch.
- The changelog is the human view of the release rather than a generated digest of commit messages.
- OIDC eliminates the long-lived npm token, which is the most sensitive secret in the repo today.
- A failed or wrong release has a documented, testable recovery path that does not require revoking tokens or contacting npm.

### Negative

- Every PR author has to update the changelog and release notes themselves when their change is user-visible. The bot-authored convenience is gone.
- The version bump is a manual judgment instead of being inferred from commit prefixes. PR review must catch wrong bumps.
- Pre-release dist-tag routing is decided by tag-name pattern only. There is no way to manually override the dist-tag for a stable-looking tag.
- The pre-release detector is strict about its shape: only `-(rc|alpha|beta|pre).N` suffixes route to the `rc` dist-tag. A tag like `v2.1.0-rc1` (no dot, no integer) falls through to `latest`. The version-match script rejects such tags up-front so a wrongly-shaped pre-release tag fails fast rather than publishing to the wrong dist-tag.

### Migration

This PR (infrastructure only):

- Adds `docs/adrs/001-...md` (this ADR), `.github/workflows/release.yml`, `.github/workflows/unpublish-or-deprecate.yml`, `scripts/check-tag-version-match.mjs` and tests.
- Rewrites `CHANGELOG.md` to Keep-a-Changelog format (preserving prior version entries) and adds `RELEASE_NOTES.md`.
- Retargets `.github/workflows/test-and-build.yml` from PRs against `next` to PRs against `main`.
- Removes `.github/workflows/release-please-config.json`, `.github/workflows/.release-please-manifest.json`, `.github/workflows/changelog.yml`, and `.github/workflows/release-and-publish.yml`.

A follow-up PR will:

- Bring the digest-multibase work from `next` onto `main`, bump the version to `2.1.0`, and add a `2.1.0` section to both changelog files. After it merges, pushing `v2.1.0` performs the first tag-triggered release.

Operator actions outside the PR diff:

- Configure the npmjs.com Trusted Publisher for `@pyx-industries/vc-render-template-utils` to trust the `Release` workflow in this repository.
- Delete (or archive) `origin/next` once `main` is at parity.
- Update branch protection: protect `main`; remove protection from `next`.
