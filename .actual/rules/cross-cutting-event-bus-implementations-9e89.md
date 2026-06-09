# Adopt Event Bus Pattern with Once and Stream Event Semantics for Application Integration: Event Bus Implementations

These rules are ALWAYS ACTIVE for all application-level event bus implementations, store increment emitters in collaborative features, initialization events, and stream events for continuous user interactions.

### Rules

- **R-EVENTBUS-001** MUST: Event bus implementations MUST support two distinct event types: once events that replay to late subscribers and stream events that do not replay.

### Verify

```bash
# Verify event bus replay semantics are implemented
grep -r "bus\.on\|bus\.emit" --include="*.ts" --include="*.tsx" | grep -E "(initialize|pointerUp)"

# Verify store increment durable/ephemeral distinction
grep -r "StoreIncrement\.isDurable" --include="*.ts" --include="*.tsx"

# Run event bus and collaboration tests
npm test -- --testNamePattern="(replays once events|does not replay stream events|ephemeral increments)"
```

**Accept when:**
- Event bus tests pass for both replay and non-replay scenarios
- All once events (like 'initialize') demonstrate replay to late subscribers in tests
- All stream events (like 'pointerUp') demonstrate no replay to late subscribers in tests
- Store increment emitters correctly distinguish between durable and ephemeral increments
- TypeScript type checking enforces correct event classification at compile time

<enforcement>
Claude Code MUST NOT skip or defer verification. All event bus implementations MUST be validated against both replay and non-replay test scenarios before acceptance. Code review MUST require event type classification justification. CI pipeline MUST fail if event bus tests do not cover both scenarios.
</enforcement>