# Adopt Event Bus Pattern with Once and Stream Event Semantics for Application Integration: Stream Events Pointerup

These rules are ALWAYS ACTIVE for all application-level event buses used for component integration, store increment emitters in collaborative features, initialization events, and stream events for continuous user interactions.

### Rules

- **R-EVENTBUS-001** MUST NOT: Stream events (e.g., 'pointerUp') MUST NOT be replayed to late subscribers.
- **R-EVENTBUS-002** MUST: Once events (e.g., 'initialize') MUST be replayed to late subscribers to ensure guaranteed delivery.
- **R-EVENTBUS-003** MUST: Event bus implementations MUST use explicit type discrimination (e.g., OnceEvent vs StreamEvent interfaces) to make replay semantics clear at compile time.
- **R-EVENTBUS-004** MUST: Store increment emitters MUST correctly distinguish between durable and ephemeral increments using the StoreIncrement.isDurable() pattern.
- **R-EVENTBUS-005** SHOULD: Developers SHOULD classify events according to guidelines: initialization and configuration events as once events; continuous user interactions as stream events.
- **R-EVENTBUS-006** SHOULD: Test suites SHOULD validate both callback and Promise subscription patterns for once events and non-replay scenarios for stream events.
- **R-EVENTBUS-007** MAY: Legacy code paths that predate the event bus pattern may use direct callback mechanisms (EXC-001).

### Verify

```bash
# Verify stream events are not replayed to late subscribers
grep -r "bus\.on\|bus\.emit" --include="*.ts" --include="*.tsx" | grep -E "(initialize|pointerUp)"

# Verify store increment durable/ephemeral distinction
grep -r "StoreIncrement\.isDurable" --include="*.ts" --include="*.tsx"

# Run event bus semantic tests
npm test -- --testNamePattern="(replays once events|does not replay stream events|ephemeral increments)"
```

**Accept when:**
- Event bus tests pass for both replay and non-replay scenarios
- All once events (like 'initialize') demonstrate replay to late subscribers in tests
- All stream events (like 'pointerUp') demonstrate no replay to late subscribers in tests
- Store increment emitters correctly distinguish between durable and ephemeral increments
- TypeScript type checking enforces event bus API usage with explicit type discrimination
- Code review checklist requires event type classification justification for new events

<enforcement>
Claude Code MUST NOT skip or defer verification. CI pipeline MUST fail if event bus tests do not cover both replay and non-replay scenarios. Code review MUST block merges that introduce new event types without documented replay semantics. Runtime warnings MUST be enabled in development mode when event classification appears inconsistent with usage patterns.
</enforcement>