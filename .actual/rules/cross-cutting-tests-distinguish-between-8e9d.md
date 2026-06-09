# Adopt Event-Driven Testing Pattern with Increment Listeners for Collaboration Features: Tests Distinguish Between

These rules are ALWAYS ACTIVE for all tests of collaboration features that emit store increments (durable and ephemeral) and for tests of AppEventBus implementations with once and stream events.

### Rules

- **R-EVDT-001** MUST: Tests MUST distinguish between durable and ephemeral increments when testing store increment emitters, using appropriate type guards (e.g., `StoreIncrement.isDurable()`).
- **R-EVDT-002** MUST: Tests for event-driven collaboration features MUST use `.on()` callbacks to capture events into test-scoped arrays (e.g., `durableIncrements`, `ephemeralIncrements`, `calls`) for later assertion.
- **R-EVDT-003** MUST: Tests MUST verify both early and late subscriber behavior for event replay scenarios, explicitly testing that 'once' events replay to late subscribers while 'stream' events do not.
- **R-EVDT-004** SHOULD: Tests SHOULD use helper functions or test utilities to reduce boilerplate for common event capture patterns across multiple test cases.
- **R-EVDT-005** SHOULD: Tests SHOULD ensure proper test setup and teardown with fresh arrays for each test case and unsubscribe listeners in cleanup hooks to prevent event listener accumulation.

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
- Event listener arrays are properly isolated per test case with fresh initialization
- Tests verify the correct sequence of events regardless of subscription timing

<enforcement>
Claude Code MUST NOT skip or defer verification of these rules. All event-driven collaboration feature tests MUST follow the event listener capture pattern with explicit increment type distinction. Code review and CI verification are mandatory before merge.
</enforcement>