# Adopt Describe-It Test Structure with Event-Driven Testing Patterns: Tests Organized Feature

These rules are ALWAYS ACTIVE for all test files in the excalidraw-app/tests directory and packages/*/src with .test.ts or .test.tsx extensions, covering unit tests for collaboration features, UI components, utilities, and event systems.

### Rules

- **R-TEST-001** MUST: Organize tests by feature domain with one primary describe block per test file.
- **R-TEST-002** MUST: Use describe-it test structure for all test files in scope.
- **R-TEST-003** MUST: For event-driven tests, create tracking arrays (e.g., durableIncrements, ephemeralIncrements, calls) before registering event listeners.
- **R-TEST-004** MUST: Register event listeners before emitting events in event-driven tests.
- **R-TEST-005** SHOULD: Import test utilities from @excalidraw/excalidraw/tests/helpers/ui and @excalidraw/excalidraw/tests/test-utils rather than creating local test helpers.
- **R-TEST-006** SHOULD: Use descriptive test names that explain the expected behavior.
- **R-TEST-007** SHOULD: Limit describe block nesting depth to 2-3 levels to maintain test clarity.

### Verify

```bash
# Count describe blocks in test files
grep -r "describe(" excalidraw-app/tests/ packages/*/src/*.test.ts* | wc -l

# Count it blocks in test files
grep -r "it(" excalidraw-app/tests/ packages/*/src/*.test.ts* | wc -l

# Find test files using shared test utilities
find . -name '*.test.ts*' -exec grep -l '@excalidraw/excalidraw/tests/' {} \;

# Verify event-driven tests have tracking arrays
grep -r "\(durableIncrements\|ephemeralIncrements\|calls\)" excalidraw-app/tests/ packages/*/src/*.test.ts*
```

**Accept when:**
- All test files contain at least one describe block organizing test cases
- Test files with event-driven behavior use explicit event listener registration and tracking arrays
- Test files import from shared test utilities (@excalidraw/excalidraw/tests/helpers/ui or test-utils) where applicable
- Event listeners are registered before events are emitted in event-driven tests
- Test descriptions are behavior-focused and explain expected outcomes

<enforcement>
Claude Code MUST NOT skip or defer verification. All new and modified test files MUST be checked against these rules during code review and CI pipeline execution.
</enforcement>