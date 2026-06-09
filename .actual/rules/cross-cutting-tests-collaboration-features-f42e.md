# Adopt Event-Driven Testing Pattern with Increment Listeners for Collaboration Features: Tests Collaboration Features

These rules are ALWAYS ACTIVE for all tests of event-driven collaboration features that emit store increments (durable and ephemeral) and require verification of event listener behavior, batched updates, and undo/redo operations.

### Rules

- **R-COLLAB-001** SHOULD: Tests for collaboration features SHOULD verify behavior under batched updates to ensure event emissions are correct even when operations are batched.
- **R-COLLAB-002** SHOULD: Tests for event-driven features SHOULD use `.on()` callbacks to capture events into test-scoped arrays (e.g., `durableIncrements`, `ephemeralIncrements`, `calls`) for later assertion.
- **R-COLLAB-003** SHOULD: Tests SHOULD distinguish between durable and ephemeral increments using type guards like `StoreIncrement.isDurable()` when testing store increments.
- **R-COLLAB-004** SHOULD: Tests SHOULD verify both early and late subscriber behavior for event replay scenarios, emitting events first then registering listeners to assert on replay behavior.
- **R-COLLAB-005** SHOULD: Tests SHOULD verify that event listeners correctly receive events in the proper order and with the correct data, especially when subscribers register at different times.

### Verify

```bash
# Verify event listener patterns with increment capture
grep -r '\.on(' excalidraw-app/tests/ packages/common/src/*.test.ts | grep -E '(durableIncrements|ephemeralIncrements|calls)\.push'

# Verify type guards for distinguishing increment types
grep -r 'StoreIncrement\.isDurable' excalidraw-app/tests/ packages/common/src/*.test.ts

# Verify event-driven test patterns exist
grep -r 'describe.*it.*emit.*on' excalidraw-app/tests/ packages/common/src/*.test.ts
```

**Accept when:**
- Tests for event-driven features use `.on()` callbacks to capture events into arrays
- Tests distinguish between durable and ephemeral increments using appropriate type guards
- Tests verify both early and late subscriber behavior for event replay scenarios
- Tests verify behavior under batched updates and edge cases like force-deleted elements
- Event listener arrays are properly isolated per test case with fresh initialization

<enforcement>
Clause Code MUST NOT skip or defer verification of event-driven collaboration feature tests. All collaboration features using store increment emitters MUST follow this pattern. Exceptions require architectural review and must be documented in test file comments.
</enforcement>