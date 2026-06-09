# Adopt Event Bus Pattern with Once and Stream Event Semantics for Application Integration: Event Bus Implementations

These rules are ALWAYS ACTIVE for all application-level event buses used for component integration, store increment emitters in collaborative features, initialization events, and stream events for continuous user interactions.

### Rules

- **R-EBUS-001** MUST: Event bus implementations MUST provide both .on() callback registration and Promise-based subscription mechanisms.
- **R-EBUS-002** MUST: Once events (like 'initialize') MUST replay to late subscribers via both callback and Promise-based subscriptions.
- **R-EBUS-003** MUST: Stream events (like 'pointerUp') MUST NOT replay to late subscribers.
- **R-EBUS-004** MUST: Event bus implementations MUST use explicit type discrimination (e.g., OnceEvent vs StreamEvent interfaces) to make replay semantics clear at compile time.
- **R-EBUS-005** MUST: Store increment emitters MUST correctly distinguish between durable and ephemeral increments using StoreIncrement.isDurable() pattern.
- **R-EBUS-006** SHOULD: Event classification guidelines SHOULD designate initialization and configuration events as once events; continuous user interactions SHOULD be stream events.
- **R-EBUS-007** SHOULD: Implement lifecycle management for once event replay buffers with explicit cleanup or timeout mechanisms to prevent memory leaks.
- **R-EBUS-008** SHOULD: Provide explicit state synchronization APIs alongside stream event subscriptions and document that late subscribers need to query current state.

### Verify

```bash
# Verify event bus callback and Promise subscription patterns
grep -r "bus\.on\|bus\.emit" --include="*.ts" --include="*.tsx" | grep -E "(initialize|pointerUp)"

# Verify durable vs ephemeral increment tracking
grep -r "StoreIncrement\.isDurable" --include="*.ts" --include="*.tsx"

# Run event bus semantic tests
npm test -- --testNamePattern="(replays once events|does not replay stream events|ephemeral increments)"
```

**Accept when:**
- Event bus tests pass for both replay and non-replay scenarios
- All once events (like 'initialize') demonstrate replay to late subscribers in tests
- All stream events (like 'pointerUp') demonstrate no replay to late subscribers in tests
- Store increment emitters correctly distinguish between durable and ephemeral increments
- TypeScript type checking confirms event bus API usage matches OnceEvent vs StreamEvent interfaces
- Code review confirms all new event types have documented replay semantics

<enforcement>
Claude Code MUST NOT skip or defer verification. CI pipeline MUST fail if event bus tests do not cover both replay and non-replay scenarios. Code review MUST block merges that introduce new event types without documented replay semantics. Runtime warnings MUST be enabled in development mode when event classification appears inconsistent with usage patterns.
</enforcement>