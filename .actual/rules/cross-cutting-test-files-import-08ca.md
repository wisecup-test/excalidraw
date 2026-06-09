# Adopt Describe-It Test Structure with Event-Driven Testing Patterns: Test Files Import

These rules are ALWAYS ACTIVE for all test files in excalidraw-app/tests directory, all test files in packages/*/src with .test.ts or .test.tsx extensions, unit tests for collaboration features, UI components, utilities, and event systems, and integration tests that verify event-driven behavior and state management.

### Rules

- **R-TEST-001** SHOULD: Test files SHOULD import from shared test utilities (@excalidraw/excalidraw/tests/helpers/ui, @excalidraw/excalidraw/tests/test-utils) rather than duplicating test infrastructure.
- **R-TEST-002** SHOULD: Test files SHOULD use describe-it test structure with clear, behavior-focused descriptions to organize test cases.
- **R-TEST-003** SHOULD: Event-driven tests SHOULD create tracking arrays (e.g., durableIncrements, ephemeralIncrements, calls) before registering event listeners.
- **R-TEST-004** SHOULD: Event-driven tests SHOULD register listeners before emitting events and verify the captured events/increments in assertions.
- **R-TEST-005** SHOULD: Test names SHOULD be descriptive and explain the expected behavior (e.g., 'should allow to undo / redo even on force-deleted elements').

### Verify

```bash
# Count describe blocks in test files
grep -r "describe(" excalidraw-app/tests/ packages/*/src/*.test.ts* | wc -l

# Count it blocks in test files
grep -r "it(" excalidraw-app/tests/ packages/*/src/*.test.ts* | wc -l

# Find test files importing from shared test utilities
find . -name '*.test.ts*' -exec grep -l '@excalidraw/excalidraw/tests/' {} \;
```

**Accept when:**
- All test files contain at least one describe block organizing test cases
- Test files with event-driven behavior use explicit event listener registration and tracking arrays
- Test files import from shared test utilities (@excalidraw/excalidraw/tests/helpers/ui or test-utils) where applicable
- Test names are descriptive and explain expected behavior

<enforcement>
Claude Code MUST NOT skip or defer verification of test file structure, event-driven patterns, and shared utility imports.
</enforcement>