# Adopt Event-Driven Testing Pattern with Increment Listeners for Collaboration Features: Tests Verify Event

These rules are ALWAYS ACTIVE for all tests in collaboration features and event-driven systems that emit store increments or use AppEventBus implementations.

### Rules

- **R-EVDT-001** MUST: Tests MUST verify event replay behavior by registering late subscribers after events have been emitted and asserting on the received events.

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
- Event listener arrays are created at test scope and populated via callbacks for later assertion
- Late subscriber tests emit events first, then register listeners, and assert on replay behavior

<enforcement>
Claude Code MUST NOT skip or defer verification of event-driven test patterns. All collaboration features and event-driven systems MUST include tests that capture and verify event emissions through listener callbacks, with explicit verification of replay behavior for late subscribers.
</enforcement>