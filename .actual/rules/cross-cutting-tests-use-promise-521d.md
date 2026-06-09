# Adopt Event-Driven Testing Pattern with Increment Listeners for Collaboration Features: Tests Use Promise

These rules are ALWAYS ACTIVE for all test files in the codebase that exercise event-driven collaboration features, store increment emitters, AppEventBus implementations, undo/redo operations, and batched update scenarios.

### Rules

- **R-EVDT-001** MAY: Tests MAY use Promise-based subscribers in addition to callback-based subscribers to verify event bus behavior with different subscription patterns.
- **R-EVDT-002** MUST: Tests for event-driven features MUST use `.on()` callbacks to capture events into arrays for later assertion.
- **R-EVDT-003** MUST: Tests MUST distinguish between durable and ephemeral increments using appropriate type guards such as `StoreIncrement.isDurable()`.
- **R-EVDT-004** MUST: Tests MUST verify both early and late subscriber behavior for event replay scenarios, explicitly testing that 'once' events replay to late subscribers while 'stream' events do not.
- **R-EVDT-005** SHOULD: Tests SHOULD create test-scoped arrays (e.g., `durableIncrements`, `ephemeralIncrements`, `calls`) at the beginning of each test to capture events.
- **R-EVDT-006** SHOULD: Tests SHOULD consider creating helper functions or test utilities to reduce boilerplate for common event capture patterns.

### Verify

```bash
# Verify event listener patterns with array capture
grep -r '\.on(' excalidraw-app/tests/ packages/common/src/*.test.ts | grep -E '(durableIncrements|ephemeralIncrements|calls)\.push'

# Verify type guards for distinguishing event types
grep -r 'StoreIncrement\.isDurable' excalidraw-app/tests/ packages/common/src/*.test.ts

# Verify event-driven test patterns exist
grep -r 'describe.*it.*emit.*on' excalidraw-app/tests/ packages/common/src/*.test.ts
```

**Accept when:**
- Tests for event-driven features use `.on()` callbacks to capture events into arrays
- Tests distinguish between durable and ephemeral increments using appropriate type guards
- Tests verify both early and late subscriber behavior for event replay scenarios
- Event listener arrays are properly scoped to individual test cases
- Tests explicitly verify the distinction between 'once' events (replay) and 'stream' events (no replay)

<enforcement>
Claude Code MUST NOT skip or defer verification of event-driven test patterns. All collaboration feature tests MUST follow the event listener capture pattern with proper event type distinction. Code review MUST check for `.on()` callback usage and type guard application in event-driven tests.
</enforcement>