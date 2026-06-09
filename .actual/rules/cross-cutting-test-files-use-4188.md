# Adopt Describe-It Test Structure with Event-Driven Testing Patterns: Test Files Use

These rules are ALWAYS ACTIVE for all test files in excalidraw-app/tests directory, all test files in packages/*/src with .test.ts or .test.tsx extensions, unit tests for collaboration features, UI components, utilities, and event systems, and integration tests that verify event-driven behavior and state management.

### Rules

- **R-EX-001** MUST: All test files MUST use describe-it block structure to organize test suites and individual test cases.
- **R-EX-002** MUST: Test files with event-driven behavior MUST use explicit event listener registration and tracking arrays (e.g., durableIncrements, ephemeralIncrements, calls) before registering event listeners.
- **R-EX-003** SHOULD: Test files SHOULD import test utilities from @excalidraw/excalidraw/tests/helpers/ui and @excalidraw/excalidraw/tests/test-utils rather than creating local test helpers.
- **R-EX-004** SHOULD: Test names SHOULD be descriptive and explain the expected behavior (e.g., 'should allow to undo / redo even on force-deleted elements').
- **R-EX-005** SHOULD: When testing event buses or emitters, developers SHOULD register listeners before emitting events and verify the captured events/increments in assertions.

### Verify

```bash
# Count describe blocks in test files
grep -r "describe(" excalidraw-app/tests/ packages/*/src/*.test.ts* | wc -l

# Count it blocks in test files
grep -r "it(" excalidraw-app/tests/ packages/*/src/*.test.ts* | wc -l

# Find test files importing shared test utilities
find . -name '*.test.ts*' -exec grep -l '@excalidraw/excalidraw/tests/' {} \;
```

**Accept when:**
- All test files contain at least one describe block organizing test cases.
- Test files with event-driven behavior use explicit event listener registration and tracking arrays.
- Test files import from shared test utilities (@excalidraw/excalidraw/tests/helpers/ui or test-utils) where applicable.
- Test names are descriptive and explain expected behavior.
- Event listeners are registered before events are emitted in tests.

<enforcement>
Claude Code MUST NOT skip or defer verification. All new and modified test files MUST be checked against these rules during code review and CI pipeline execution.
</enforcement>