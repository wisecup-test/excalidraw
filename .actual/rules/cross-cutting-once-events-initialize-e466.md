# Adopt Event Bus Pattern with Once and Stream Event Semantics for Application Integration: Once Events Initialize

These rules are ALWAYS ACTIVE for all application-level event buses used for component integration, store increment emitters in collaborative features, and initialization events that require guaranteed delivery to all subscribers.

### Rules

- **R-EVENTBUS-001** MUST: Once events (e.g., 'initialize') MUST be replayed to callbacks and Promise subscribers that register after the event has been emitted.

### Verify

```bash
# Verify once events replay to late subscribers
grep -r "bus\.on\|bus\.emit" --include="*.ts" --include="*.tsx" | grep -E "(initialize|pointerUp)"

# Verify store increment durable/ephemeral distinction
grep -r "StoreIncrement\.isDurable" --include="*.ts" --include="*.tsx"

# Run event bus replay semantics tests
npm test -- --testNamePattern="(replays once events|does not replay stream events|ephemeral increments)"
```

**Accept when:**
- Event bus tests pass for both replay and non-replay scenarios
- All once events (like 'initialize') demonstrate replay to late subscribers in tests
- All stream events (like 'pointerUp') demonstrate no replay to late subscribers in tests
- Store increment emitters correctly distinguish between durable and ephemeral increments
- TypeScript type checking enforces event bus API usage with explicit type discrimination (OnceEvent vs StreamEvent)

<enforcement>
Claude Code MUST NOT skip or defer verification. All event bus implementations MUST pass the replay semantics test suite before merge. Code review MUST require event type classification justification for new event types. CI pipeline MUST fail if event bus tests do not cover both replay and non-replay scenarios.
</enforcement>