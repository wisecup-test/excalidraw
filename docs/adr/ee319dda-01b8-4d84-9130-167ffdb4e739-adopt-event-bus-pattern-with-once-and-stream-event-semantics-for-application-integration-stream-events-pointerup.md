# Adopt Event Bus Pattern with Once and Stream Event Semantics for Application Integration: Stream Events Pointerup

Status: proposed
Date: 2024-01-20
Deciders: Detection Pipeline (automated)

## Context

- Event-driven architectures require clear semantics for event replay and subscription timing to prevent race conditions and ensure consistent behavior across components
- The codebase demonstrates two distinct event patterns: once events (like 'initialize') that replay to late subscribers, and stream events (like 'pointerUp') that do not replay, indicating a need for differentiated event handling
- Collaboration features require tracking both durable and ephemeral state increments through event emitters, with different persistence and replay characteristics
- Test frameworks (describe/it patterns) are used extensively to validate event bus behavior, indicating this is a critical integration pattern requiring formal specification

## Problem Statement

Applications need a standardized event bus mechanism that supports both replay-once events for initialization and non-replaying stream events for continuous updates, while distinguishing between durable and ephemeral state changes in collaborative contexts. Without clear rules, developers may incorrectly assume all events replay or fail to handle late subscriber scenarios.

## Decision

1. MUST_NOT: Stream events (e.g., 'pointerUp') MUST NOT be replayed to late subscribers

## Policy Block

- MUST_NOT Stream events (e.g., 'pointerUp') MUST NOT be replayed to late subscribers

In scope:
- Application-level event buses used for component integration
- Store increment emitters in collaborative features
- Initialization events that require guaranteed delivery to all subscribers
- Stream events for continuous user interactions (pointer events, updates)

Out of scope:
- Low-level DOM event handling
- Third-party event bus libraries that do not support replay semantics
- Synchronous function calls that do not require event-driven patterns
- Server-side event streams (SSE, WebSockets) with different replay requirements

Exceptions:
- EXC-001: Legacy code paths that predate the event bus pattern may use direct callback mechanisms

## Rationale

- The IR evidence shows explicit implementation of replay semantics in appEventBus.test.ts with tests validating 'replays once events to late callback and Promise subscribers' and 'does not replay stream events to late subscribers', demonstrating intentional design
- The collaboration test (collab.test.tsx) shows sophisticated event handling with durable vs ephemeral increment tracking, indicating this pattern is critical for state management in collaborative features
- The pattern appears in 2 files with 93.30% confidence, suggesting consistent application across integration boundaries
- Test-driven validation of event semantics indicates this is a mature, well-understood pattern requiring formal documentation

## Consequences

Positive:
- Clear semantics prevent race conditions and missed initialization events for late-subscribing components
- Separation of once and stream events enables efficient memory usage by not storing all historical stream events
- Durable vs ephemeral increment distinction enables proper state persistence and undo/redo functionality
- Promise-based subscription alongside callback registration provides flexible integration patterns

Negative:
- Developers must understand two different event types and their replay semantics, increasing cognitive load
- Late subscribers to stream events will miss historical events, requiring alternative state synchronization mechanisms
- Event bus implementation complexity increases to support replay buffering for once events
- Testing requirements increase to validate both replay and non-replay scenarios

## Alternatives

- Use a single event type with configurable replay behavior per event instance (rejected)
  Rejected because: Increases runtime complexity and makes event semantics less predictable; the two-type system provides clearer contracts
  When valid: When event replay requirements are highly dynamic and cannot be determined at design time
- Replay all events to late subscribers with a configurable buffer size (rejected)
  Rejected because: Memory overhead for high-frequency stream events (like pointer movements) would be prohibitive; does not match the observed pattern
  When valid: For low-frequency event systems where complete history is required
- Use separate event bus instances for once events vs stream events (deferred)
  Rejected because: null
  When valid: Could be considered if type safety and separation of concerns outweigh the convenience of a unified bus

## Risks

- Developers may incorrectly classify events as once or stream, leading to unexpected replay behavior
  Mitigation: Provide clear documentation and naming conventions; implement TypeScript types to enforce correct event classification
  Owner: Engineering team
- Memory leaks if once event replay buffers are not properly cleaned up after all expected subscribers have registered
  Mitigation: Implement lifecycle management for once events with explicit cleanup or timeout mechanisms
  Owner: Platform team
- Late subscribers to stream events may receive incomplete state, causing UI inconsistencies
  Mitigation: Provide explicit state synchronization APIs alongside stream event subscriptions; document that late subscribers need to query current state
  Owner: Engineering team

## Implementation Notes

- Implement event bus with explicit type discrimination (e.g., OnceEvent vs StreamEvent interfaces) to make replay semantics clear at compile time
- Use StoreIncrement.isDurable() pattern for type checking durable vs ephemeral increments in store emitters
- Ensure test suites validate both callback and Promise subscription patterns for once events
- Document event classification guidelines: initialization and configuration events should be once events; continuous user interactions should be stream events
- Consider implementing a registry of event types with their replay semantics to prevent misclassification

## Continuation Context


Verify commands:
- grep -r "bus\.on\|bus\.emit" --include="*.ts" --include="*.tsx" | grep -E "(initialize|pointerUp)"
- grep -r "StoreIncrement\.isDurable" --include="*.ts" --include="*.tsx"
- npm test -- --testNamePattern="(replays once events|does not replay stream events|ephemeral increments)"

Accept when:
- Event bus tests pass for both replay and non-replay scenarios
- All once events (like 'initialize') demonstrate replay to late subscribers in tests
- All stream events (like 'pointerUp') demonstrate no replay to late subscribers in tests
- Store increment emitters correctly distinguish between durable and ephemeral increments

## Enforcement

- Verified by: Automated test suite validating event replay semantics
- Verified by: Code review checklist requiring event type classification justification
- Verified by: TypeScript type checking for event bus API usage
- Violation handling: CI pipeline fails if event bus tests do not cover both replay and non-replay scenarios
- Violation handling: Code review blocks merges that introduce new event types without documented replay semantics
- Violation handling: Runtime warnings in development mode when event classification appears inconsistent with usage patterns
- Exception process: Document exception rationale in ADR amendment or code comments
- Exception process: Obtain architecture review approval for alternative event patterns
- Exception process: Create tracking issue for technical debt if temporary deviation is required