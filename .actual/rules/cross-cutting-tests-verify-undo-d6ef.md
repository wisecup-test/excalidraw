# Adopt Event-Driven Testing Pattern with Increment Listeners for Collaboration Features: Tests Verify Undo

These rules are ALWAYS ACTIVE for all test files in the codebase that implement event-driven collaboration features, store increment emitters, AppEventBus implementations, and undo/redo operations.

### Rules

- **R-EVDT-001** SHOULD: Tests SHOULD verify undo/redo functionality on force-deleted elements to ensure event-driven state management handles edge cases correctly.
- **R-EVDT-002** MUST: Tests for event-driven features MUST use `.on()` callbacks to capture events into test-scoped arrays (e.g., `durableIncrements`, `ephemeralIncrements`, `calls`) for later assertion.
- **R-EVDT-003** MUST: Tests MUST distinguish between durable and ephemeral increments using type guards like `StoreIncrement.isDurable()` when testing store increments.
- **R-EVDT-004** SHOULD: Tests SHOULD verify both early and late subscriber behavior for event replay scenarios to catch timing-related bugs.
- **R-EVDT-005** MUST: Tests MUST ensure proper test setup and teardown with fresh arrays for each test case and unsubscribe listeners in cleanup hooks to prevent event listener array accumulation.

### Verify

```bash
# Verify event listener patterns with increment capture
grep -r '\.on(' excalidraw-app/tests/ packages/common/src/*.test.ts | grep -E '(durableIncrements|ephemeralIncrements|calls)\.push'

# Verify type guard usage for distinguishing increment types
grep -r 'StoreIncrement\.isDurable' excalidraw-app/tests/ packages/common/src/*.test.ts

# Verify event-driven test patterns exist
grep -r 'describe.*it.*emit.*on' excalidraw-app/tests/ packages/common/src/*.test.ts
```

**Accept when:**
- Tests for event-driven features use `.on()` callbacks to capture events into arrays
- Tests distinguish between durable and ephemeral increments using appropriate type guards
- Tests verify both early and late subscriber behavior for event replay scenarios
- Test arrays are created fresh at the beginning of each test case
- Event listeners are properly unsubscribed in test cleanup hooks
- Undo/redo functionality is explicitly tested on force-deleted elements

<enforcement>
Claude Code MUST NOT skip or defer verification of event-driven test patterns. All event-driven collaboration features MUST follow the increment listener testing pattern with proper event capture, type distinction, and replay behavior verification.
</enforcement>