# Adopt Describe-It Test Structure with Event-Driven Testing Patterns: Test Descriptions Clear

These rules are ALWAYS ACTIVE for all test files in the excalidraw-app/tests directory and all test files in packages/*/src with .test.ts or .test.tsx extensions, covering unit tests for collaboration features, UI components, utilities, and event systems.

### Rules

- **R-TEST-001** MUST: Test descriptions MUST be clear and descriptive, explaining what behavior is being tested (e.g., 'should emit two ephemeral increments even though updates get batched').
- **R-TEST-002** MUST: All test files MUST use describe-it test structure with at least one describe block organizing test cases.
- **R-TEST-003** MUST: Event-driven tests MUST use explicit event listener registration and tracking arrays (e.g., durableIncrements, ephemeralIncrements, calls) before registering event listeners.
- **R-TEST-004** SHOULD: Test files with event-driven behavior SHOULD import from shared test utilities (@excalidraw/excalidraw/tests/helpers/ui or @excalidraw/excalidraw/tests/test-utils) rather than creating local test helpers.
- **R-TEST-005** SHOULD: Test names SHOULD explain the expected behavior using descriptive language (e.g., 'should allow to undo / redo even on force-deleted elements').
- **R-TEST-006** SHOULD: Nested describe blocks SHOULD be limited to 2-3 levels to maintain test clarity.

### Verify

```bash
# Count describe blocks in test files
grep -r "describe(" excalidraw-app/tests/ packages/*/src/*.test.ts* | wc -l

# Count it blocks in test files
grep -r "it(" excalidraw-app/tests/ packages/*/src/*.test.ts* | wc -l

# Find test files using shared test utilities
find . -name '*.test.ts*' -exec grep -l '@excalidraw/excalidraw/tests/' {} \;

# Verify test descriptions are present and non-empty
grep -r "it(\s*['\"]" excalidraw-app/tests/ packages/*/src/*.test.ts* | grep -v "it(\s*['\"]\s*['\"]" | wc -l
```

**Accept when:**
- All test files contain at least one describe block organizing test cases
- Test files with event-driven behavior use explicit event listener registration and tracking arrays
- Test files import from shared test utilities (@excalidraw/excalidraw/tests/helpers/ui or test-utils) where applicable
- All test descriptions are clear, descriptive, and explain the behavior being tested
- Test names follow the pattern 'should [expected behavior]' or similar descriptive format

<enforcement>
Claude Code MUST NOT skip or defer verification of test descriptions and describe-it structure compliance. All new test files and modifications to existing test files MUST be checked against these rules before approval.
</enforcement>