# Adopt Event-Driven Testing Pattern with Increment Listeners for Collaboration Features: Tests Distinguish Between

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Context

- The codebase contains collaboration features that emit store increments (both durable and ephemeral) which need to be tested for correct behavior during batched updates and undo/redo operations
- Event-driven architectures require testing patterns that can capture and verify event emissions, including distinguishing between different event types (durable vs ephemeral increments, once vs stream events)
- The AppEventBus implementation supports both 'once' events that replay to late subscribers and 'stream' events that do not replay, requiring specific test patterns to verify this behavior
- Tests need to verify that event listeners correctly receive events in the proper order and with the correct data, especially when subscribers register at different times (early vs late callbacks)

## Problem Statement

Testing event-driven collaboration features requires a consistent pattern for capturing emitted events, distinguishing between event types (durable/ephemeral, once/stream), and verifying that event listeners receive the correct sequence of events regardless of subscription timing. Without a standardized approach, tests may miss critical edge cases around event replay behavior, batching, and late subscriber handling.

## Decision

1. MUST: Tests MUST distinguish between durable and ephemeral increments when testing store increment emitters, using appropriate type guards (e.g., StoreIncrement.isDurable())

## Policy Block

- MUST Tests MUST distinguish between durable and ephemeral increments when testing store increment emitters, using appropriate type guards (e.g., StoreIncrement.isDurable())

In scope:
- Tests for collaboration features using store increment emitters
- Tests for AppEventBus implementations with once and stream events
- Tests verifying event replay behavior to late subscribers
- Tests for undo/redo operations on event-driven state
- Tests for batched update scenarios in event-driven systems

Out of scope:
- Non-event-driven testing patterns (e.g., synchronous API tests)
- Unit tests that do not involve event emission or subscription
- Integration tests that mock event buses entirely
- Performance testing of event throughput

## Rationale

- The IR evidence shows consistent use of event listener patterns with .on() callbacks capturing events into arrays (durableIncrements, ephemeralIncrements, calls arrays) across multiple test files
- The pattern explicitly distinguishes between durable and ephemeral increments using StoreIncrement.isDurable(), indicating this distinction is architecturally significant and must be tested
- Test cases specifically verify replay behavior for 'once' events versus non-replay for 'stream' events, demonstrating this is a critical behavioral contract of the event bus
- The collaboration test verifies behavior under batched updates and force-deleted elements, showing these edge cases are important for correctness in event-driven collaboration features

## Consequences

Positive:
- Consistent test patterns across event-driven features improve maintainability and make it easier for developers to write correct tests
- Explicit verification of event replay behavior prevents regressions in critical event bus contracts
- Distinguishing between durable and ephemeral increments in tests ensures the collaboration system's state management is correctly tested
- Testing late subscriber scenarios catches timing-related bugs that could occur in production when components initialize at different times

Negative:
- Event listener-based tests can be more verbose than simple assertion-based tests, requiring setup of arrays and callbacks
- Tests that verify timing-dependent behavior (late subscribers) may be more complex to understand and maintain
- Distinguishing between multiple event types increases test complexity and requires developers to understand the event taxonomy
- Asynchronous event testing may require additional test utilities or helpers to handle timing and Promise resolution

## Alternatives

- Mock the event bus entirely and verify only that emit() was called with correct parameters (rejected)
  Rejected because: Mocking the event bus would not verify critical replay behavior, event type distinctions, or late subscriber handling that are core to the system's correctness
  When valid: Only appropriate for isolated unit tests where event bus behavior is not the focus of the test
- Use synchronous testing patterns without event listeners, polling state instead (rejected)
  Rejected because: Polling state does not verify the event-driven contract, misses timing issues, and cannot distinguish between durable/ephemeral increments or once/stream events
  When valid: May be appropriate for end-to-end tests where only final state matters, not the event sequence
- Create a test-specific event recorder utility that automatically captures all events (deferred)
  Rejected because: Not rejected, but not yet implemented; could reduce boilerplate in the future
  When valid: Would be valuable if the pattern becomes more widespread and the boilerplate becomes a maintenance burden

## Risks

- Tests may become flaky if event timing is not properly handled, especially with asynchronous event emissions
  Mitigation: Use proper async/await patterns, test utilities that wait for events, and clear test lifecycle management to ensure events are captured before assertions
  Owner: engineering team
- Developers unfamiliar with the event bus contracts (once vs stream, durable vs ephemeral) may write incorrect tests
  Mitigation: Document the event taxonomy clearly, provide test examples and templates, and include code review checks for event-driven test patterns
  Owner: engineering team
- Event listener arrays may accumulate unexpected events if test isolation is not properly maintained
  Mitigation: Ensure proper test setup and teardown, use fresh arrays for each test case, and consider unsubscribing listeners in cleanup hooks
  Owner: engineering team

## Implementation Notes

- Create test-scoped arrays (e.g., durableIncrements, ephemeralIncrements, calls) at the beginning of each test to capture events
- Register event listeners using .on() callbacks that push received events into the test arrays for later assertion
- Use type guards like StoreIncrement.isDurable() to separate events into appropriate categories when testing store increments
- For late subscriber tests, emit events first, then register listeners, and assert on what was or was not replayed
- Consider creating helper functions or test utilities to reduce boilerplate for common event capture patterns

## Continuation Context


Verify commands:
- grep -r '\.on(' excalidraw-app/tests/ packages/common/src/*.test.ts | grep -E '(durableIncrements|ephemeralIncrements|calls)\.push'
- grep -r 'StoreIncrement\.isDurable' excalidraw-app/tests/ packages/common/src/*.test.ts
- grep -r 'describe.*it.*emit.*on' excalidraw-app/tests/ packages/common/src/*.test.ts

Accept when:
- Tests for event-driven features use .on() callbacks to capture events into arrays
- Tests distinguish between durable and ephemeral increments using appropriate type guards
- Tests verify both early and late subscriber behavior for event replay scenarios

## Enforcement

- Verified by: Code review checks for event-driven test patterns
- Verified by: Automated grep-based verification in CI pipeline
- Verified by: Test coverage reports showing event listener registration in collaboration tests
- Violation handling: Code review feedback requesting addition of event listener-based tests
- Violation handling: CI warnings when event-driven features lack tests with .on() callbacks
- Violation handling: Documentation updates to clarify the required testing pattern
- Exception process: Exceptions may be granted for simple unit tests where event bus behavior is mocked
- Exception process: Exception requests should be documented in test file comments explaining why the pattern is not applicable
- Exception process: Architectural review required for new event-driven features that propose alternative testing patterns