# Adopt Event Bus Pattern with Once and Stream Event Semantics for Application Integration: Event Emitters Batch

These rules are ALWAYS ACTIVE for all application-level event buses used for component integration, store increment emitters in collaborative features, initialization events, and stream events for continuous user interactions.

### Rules

- **R-EVENTBUS-001** SHOULD: Event emitters SHOULD batch updates when appropriate while maintaining correct increment emission counts for ephemeral events.

### Verify

```bash
# Verify event bus replay semantics
grep -r "bus\.on\|bus\.emit" --include="*.ts" --include="*.tsx" | grep -E "(initialize|pointerUp)"

# Verify store increment durable/ephemeral distinction
grep -r "StoreIncrement\.isDurable" --include="*.ts" --include="*.tsx"

# Run event bus and increment tests
npm test -- --testNamePattern="(replays once events|does not replay stream events|ephemeral increments)"
```

**Accept when:**
- Event bus tests pass for both replay and non-replay scenarios
- All once events (like 'initialize') demonstrate replay to late subscribers in tests
- All stream events (like 'pointerUp') demonstrate no replay to late subscribers in tests
- Store increment emitters correctly distinguish between durable and ephemeral increments
- Event batching maintains correct increment emission counts for ephemeral events

<enforcement>
Claude Code MUST NOT skip or defer verification. CI pipeline MUST fail if event bus tests do not cover both replay and non-replay scenarios. Code review MUST block merges that introduce new event types without documented replay semantics. Runtime warnings MUST be enabled in development mode when event classification appears inconsistent with usage patterns.
</enforcement>