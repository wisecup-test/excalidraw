# Adopt Event-Driven Testing Pattern with Increment Listeners for Collaboration Features: Tests Separate Verification

These rules are ALWAYS ACTIVE for all tests in collaboration features using store increment emitters, AppEventBus implementations with once and stream events, tests verifying event replay behavior to late subscribers, tests for undo/redo operations on event-driven state, and tests for batched update scenarios in event-driven systems.

### Rules

- **R-EVDT-001** SHOULD: Tests SHOULD separate verification of 'once' events (which replay to late subscribers) from 'stream' events (which do not replay) using distinct test cases.

### Verify

```bash
# Verify event listener patterns with increment capture
grep -r '\.on(' excalidraw-app/tests/ packages/common/src/*.test.ts | grep -E '(durableIncrements|ephemeralIncrements|calls)\.push'

# Verify type guards for distinguishing increment types
grep -r 'StoreIncrement\.isDurable' excalidraw-app/tests/ packages/common/src/*.test.ts

# Verify event emission and listener registration patterns
grep -r 'describe.*it.*emit.*on' excalidraw-app/tests/ packages/common/src/*.test.ts
```

**Accept when:**
- Tests for event-driven features use `.on()` callbacks to capture events into arrays
- Tests distinguish between durable and ephemeral increments using appropriate type guards like `StoreIncrement.isDurable()`
- Tests verify both early and late subscriber behavior for event replay scenarios
- Test cases explicitly separate verification of 'once' events from 'stream' events
- Event listener arrays are created at test scope and populated via callbacks for later assertion

<enforcement>
Clause Code MUST NOT skip or defer verification of event-driven test patterns. All collaboration feature tests MUST follow the event listener capture pattern with proper separation of once vs stream event verification.
</enforcement>