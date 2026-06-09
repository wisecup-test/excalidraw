# Adopt Event Bus Pattern with Once and Stream Event Semantics for Application Integration: Store Increment Emitters

These rules are ALWAYS ACTIVE for all application-level event buses, store increment emitters in collaborative features, initialization events, and stream events for continuous user interactions.

### Rules

- **R-EVENTBUS-001** MUST: Store increment emitters MUST distinguish between durable increments and ephemeral increments through type checking (e.g., StoreIncrement.isDurable)
- **R-EVENTBUS-002** MUST: Event bus implementations MUST support explicit type discrimination (e.g., OnceEvent vs StreamEvent interfaces) to make replay semantics clear at compile time
- **R-EVENTBUS-003** MUST: Once events (like 'initialize') MUST replay to late subscribers; stream events (like 'pointerUp') MUST NOT replay to late subscribers
- **R-EVENTBUS-004** MUST: Test suites MUST validate both callback and Promise subscription patterns for once events
- **R-EVENTBUS-005** SHOULD: Event classification guidelines SHOULD designate initialization and configuration events as once events; continuous user interactions SHOULD be stream events
- **R-EVENTBUS-006** SHOULD: Developers SHOULD provide explicit state synchronization APIs alongside stream event subscriptions and document that late subscribers need to query current state

### Verify

```bash
# Verify event bus usage patterns
grep -r "bus\.on\|bus\.emit" --include="*.ts" --include="*.tsx" | grep -E "(initialize|pointerUp)"

# Verify store increment durable/ephemeral distinction
grep -r "StoreIncrement\.isDurable" --include="*.ts" --include="*.tsx"

# Verify event replay semantics in tests
npm test -- --testNamePattern="(replays once events|does not replay stream events|ephemeral increments)"
```

**Accept when:**
- Event bus tests pass for both replay and non-replay scenarios
- All once events (like 'initialize') demonstrate replay to late subscribers in tests
- All stream events (like 'pointerUp') demonstrate no replay to late subscribers in tests
- Store increment emitters correctly distinguish between durable and ephemeral increments
- TypeScript type checking enforces correct event classification
- Code review checklist requires event type classification justification for new events

<enforcement>
Claude Code MUST NOT skip or defer verification. CI pipeline MUST fail if event bus tests do not cover both replay and non-replay scenarios. Code review MUST block merges that introduce new event types without documented replay semantics. Runtime warnings MUST be enabled in development mode when event classification appears inconsistent with usage patterns.
</enforcement>