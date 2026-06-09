# Adopt Describe-It Test Structure with Event-Driven Testing Patterns: Tests Use Nested

These rules are ALWAYS ACTIVE for all test files in excalidraw-app/tests and packages/*/src with .test.ts or .test.tsx extensions, covering unit tests for collaboration features, UI components, utilities, and event systems.

### Rules

- **R-TEST-001** MAY: Tests MAY use nested describe blocks to group related test cases within a feature domain.
- **R-TEST-002** SHOULD: Event-driven tests SHOULD use explicit event listener registration and tracking arrays (e.g., durableIncrements, ephemeralIncrements, calls) before emitting events.
- **R-TEST-003** SHOULD: Test files SHOULD import test utilities from @excalidraw/excalidraw/tests/helpers/ui and @excalidraw/excalidraw/tests/test-utils rather than creating local test helpers.
- **R-TEST-004** SHOULD: Test names SHOULD be descriptive and explain the expected behavior (e.g., 'should allow to undo / redo even on force-deleted elements').
- **R-TEST-005** SHOULD: Nested describe blocks SHOULD be limited to 2-3 levels of nesting to maintain test clarity.

### Verify

```bash
# Count describe blocks in test files
grep -r "describe(" excalidraw-app/tests/ packages/*/src/*.test.ts* | wc -l

# Count it blocks in test files
grep -r "it(" excalidraw-app/tests/ packages/*/src/*.test.ts* | wc -l

# Find test files importing shared test utilities
find . -name '*.test.ts*' -exec grep -l '@excalidraw/excalidraw/tests/' {} \;

# Verify event-driven tests use tracking arrays
grep -r "durableIncrements\|ephemeralIncrements\|calls" excalidraw-app/tests/ packages/*/src/*.test.ts* | wc -l
```

**Accept when:**
- All test files contain at least one describe block organizing test cases
- Test files with event-driven behavior use explicit event listener registration and tracking arrays
- Test files import from shared test utilities (@excalidraw/excalidraw/tests/helpers/ui or test-utils) where applicable
- Test descriptions are behavior-focused and explain expected outcomes
- Nested describe blocks do not exceed 3 levels of depth

<enforcement>
Claude Code MUST NOT skip or defer verification of test structure compliance. All new test files MUST be reviewed for adherence to describe-it structure and event-driven testing patterns before acceptance.
</enforcement>