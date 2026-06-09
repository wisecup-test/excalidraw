# Adopt Event-Driven Testing Pattern with Increment Listeners for Collaboration Features: Tests Event Driven

These rules are ALWAYS ACTIVE for all tests of event-driven collaboration features that emit store increments (durable and ephemeral) and require verification of event listener behavior, event replay semantics, and batched update scenarios.

### Rules

- **R-EVDT-001** MUST: Tests for event-driven features MUST register event listeners using `.on()` callbacks to capture emitted events into test-scoped arrays or collections.
- **R-EVDT-002** MUST: Tests for store increment emitters MUST distinguish between durable and ephemeral increments using `StoreIncrement.isDurable()` or equivalent type guards when capturing events.
- **R-EVDT-003** MUST: Tests for AppEventBus implementations MUST verify both 'once' event replay behavior (events replayed to late subscribers) and 'stream' event non-replay behavior (events not replayed to late subscribers).
- **R-EVDT-004** MUST: Tests for event-driven collaboration features MUST verify event listener behavior under batched updates and undo/redo operations.
- **R-EVDT-005** SHOULD: Tests for late subscriber scenarios SHOULD emit events first, then register listeners, and assert on what was or was not replayed to verify timing-dependent behavior.
- **R-EVDT-006** SHOULD: Tests SHOULD create helper functions or test utilities to reduce boilerplate for common event capture patterns across multiple test cases.

### Verify

```bash
# Verify event listener registration with .on() callbacks capturing into arrays
grep -r '\.on(' excalidraw-app/tests/ packages/common/src/*.test.ts | grep -E '(durableIncrements|ephemeralIncrements|calls)\.push'

# Verify type guards for distinguishing durable vs ephemeral increments
grep -r 'StoreIncrement\.isDurable' excalidraw-app/tests/ packages/common/src/*.test.ts

# Verify event-driven test patterns in collaboration and event bus tests
grep -r 'describe.*it.*emit.*on' excalidraw-app/tests/ packages/common/src/*.test.ts
```

**Accept when:**
- Tests for event-driven features use `.on()` callbacks to capture events into arrays
- Tests distinguish between durable and ephemeral increments using appropriate type guards
- Tests verify both early and late subscriber behavior for event replay scenarios
- Tests for collaboration features verify behavior under batched updates and undo/redo operations
- Event listener arrays are properly scoped to individual test cases with fresh initialization

<enforcement>
Clause MUST NOT skip or defer verification of event-driven test patterns. All event-driven collaboration features and AppEventBus implementations MUST follow the event listener capture pattern. Code review and CI pipeline checks are mandatory.
</enforcement>