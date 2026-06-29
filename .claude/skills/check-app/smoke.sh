#!/usr/bin/env bash
# check-app/smoke.sh — runs all static checks on ngx-dock-layout
# Usage: bash .claude/skills/check-app/smoke.sh
# Exit code: 0 = clean, 1 = issues found

set -euo pipefail
ERRORS=0
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$ROOT"

pass() { echo "  ✔ $1"; }
fail() { echo "  ✘ $1"; ERRORS=$((ERRORS + 1)); }
section() { echo; echo "── $1 ──"; }

# ── 1. Library build (catches template + type errors in lib source) ──
section "Library build (ng-packagr)"
if ng build ngx-dock-layout 2>&1 | tee /tmp/ndl-build.log | grep -qE "^(Error|✘ \[ERROR\])"; then
  fail "Build errors — see /tmp/ndl-build.log"
  cat /tmp/ndl-build.log | grep -E "^(Error|✘)" | head -20
else
  pass "Library builds clean"
fi

# ── 2. Full TypeScript check (catches errors in tests + demo app too) ──
section "TypeScript (tsc --noEmit)"
TSC_OUT=$(npx tsc --noEmit -p tsconfig.json 2>&1 || true)
if [ -n "$TSC_OUT" ]; then
  fail "TypeScript errors:"
  echo "$TSC_OUT" | head -30
else
  pass "No TypeScript errors"
fi

# ── 3. ESLint ──
section "ESLint"
LINT_OUT=$(npm run lint 2>&1 | tail -n +3 || true)
if echo "$LINT_OUT" | grep -qE "^\s+[0-9]+:[0-9]+\s+(error|warning)"; then
  fail "ESLint issues:"
  echo "$LINT_OUT" | grep -E "^\s+[0-9]+:[0-9]+\s+(error|warning)" | head -20
else
  pass "ESLint clean"
fi

# ── 4. Unit tests ──
section "Unit tests (vitest)"
if npm run test:unit 2>&1 | tee /tmp/ndl-vitest.log | grep -qE "^(FAIL|Tests\s+[0-9]+ failed)"; then
  fail "Unit test failures — see /tmp/ndl-vitest.log"
else
  PASSED=$(grep -oP 'Tests\s+\K[0-9]+ passed' /tmp/ndl-vitest.log || echo "?")
  pass "Unit tests: $PASSED"
fi

# ── 5. Naming conventions ──
section "Naming conventions"

# Angular selectors in lib must be ndl-*
BAD_SELECTORS=$(grep -rn "selector:" projects/ngx-dock-layout/src/lib/ \
  | grep -v "ndl-\|spec" || true)
if [ -n "$BAD_SELECTORS" ]; then
  fail "Selectors without 'ndl-' prefix:"
  echo "$BAD_SELECTORS"
else
  pass "All lib selectors use ndl- prefix"
fi

# CSS classes in SCSS must follow ndl- BEM
BAD_CLASSES=$(grep -rn "^\s*\." projects/ngx-dock-layout/src/lib/ --include="*.scss" \
  | grep -v "ndl-\|:host\|:not\|::after\|::before\|:hover\|:focus\|:active\|:first\|:last\|^\s*//" || true)
if [ -n "$BAD_CLASSES" ]; then
  fail "CSS classes not following ndl- BEM convention:"
  echo "$BAD_CLASSES" | head -10
else
  pass "SCSS class names follow ndl- BEM convention"
fi

# ── Summary ──
echo
if [ "$ERRORS" -eq 0 ]; then
  echo "All checks passed."
  exit 0
else
  echo "$ERRORS check(s) failed."
  exit 1
fi
