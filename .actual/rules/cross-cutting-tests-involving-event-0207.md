# Adopt Describe-It Test Structure with Event-Driven Testing Patterns: Tests Involving Event

These rules are ALWAYS ACTIVE for all test files in excalidraw-app/tests directory, all test files in packages/*/src with .test.ts or .test.tsx extensions, unit tests for collaboration features, UI components, utilities, and event systems, and integration tests that verify event-driven behavior and state management.

### Rules

- **R-EX-001** MUST: Tests involving event-driven behavior MUST use event emitters and listeners with explicit increment/event tracking arrays.

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
- All test files contain at least one describe block organizing test cases
- Test files with event-driven behavior use explicit event listener registration and tracking arrays
- Test files import from shared test utilities (@excalidraw/excalidraw/tests/helpers/ui or test-utils) where applicable

<enforcement>
Claude Code MUST NOT skip or defer verification. All new and modified test files must be checked for compliance with R-EX-001 before acceptance.
</enforcement>