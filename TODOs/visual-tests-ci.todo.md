# Visual Tests in CI

Tracked in GitHub issue #18. Low priority: parked until screenshot tests matter more.

## Goal
Run the Playwright visual suite on a PR when a label is added, and let CI regenerate the baselines so nobody has to update them by hand on their own machine.

## Scope In
- GitHub Actions workflow on `pull_request` (`labeled`, `synchronize`) that runs only when the PR has one of these labels:
  - `visual-tests`: run `npm run test:visual` and upload the report and diff images.
  - `update-snapshots`: run `npm run test:visual:update` and commit the new baselines to the PR branch.
- Move the baselines from `*-win32.png` to Linux (`*-linux.png`), generated in CI.

## Scope Out
- Running on every push (label-triggered only).
- Lighthouse or accessibility CI.

## Dependencies
- None.

## Tasks
- [ ] Add the label-triggered workflow
- [ ] Generate Linux baselines in CI and delete the `-win32` ones
- [ ] Fix the `home` test, which looks for a "Noah Wright" heading (the page's heading is "👋 I'm Noah")
- [ ] Add `/resume` (scroll-and-sample, not full-page) and the 404 page to the suite

## Verification
- Adding `visual-tests` to a PR runs the suite and reports pass or fail.
- Adding `update-snapshots` commits refreshed baselines that then pass.

## Done When
Visual tests can be run and re-baselined from a PR without a local run.
