# Adopt Describe-It Test Structure with Event-Driven Testing Patterns: Tests Involving Event

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Context

- The codebase contains multiple test files using describe-it test structure across different packages including excalidraw-app/tests and packages/common/src
- Tests cover collaboration features, mobile UI components, color utilities, and event bus functionality with consistent structural patterns
- Event-driven testing patterns are present in collaboration and event bus tests, using event emitters and listeners to validate asynchronous behavior
- Test files import from @excalidraw/excalidraw test utilities and helpers, indicating a shared testing infrastructure
- The pattern appears in 4 files with 92.90% confidence, suggesting an established and consistent testing approach

## Problem Statement

The codebase requires a consistent testing strategy that can handle both synchronous component testing and asynchronous event-driven scenarios. Without standardized test structure and patterns, tests become difficult to maintain, understand, and extend across different modules and packages.

## Decision

1. MUST: Tests involving event-driven behavior MUST use event emitters and listeners with explicit increment/event tracking arrays

## Policy Block

- MUST Tests involving event-driven behavior MUST use event emitters and listeners with explicit increment/event tracking arrays

In scope:
- All test files in excalidraw-app/tests directory
- All test files in packages/*/src with .test.ts or .test.tsx extensions
- Unit tests for collaboration features, UI components, utilities, and event systems
- Integration tests that verify event-driven behavior and state management

Out of scope:
- End-to-end tests that may use different testing frameworks
- Performance benchmarks that require specialized test structures
- Manual testing procedures and exploratory testing
- Third-party library tests outside the @excalidraw namespace

Exceptions:
- EXC-001: Legacy test files that predate this standard and are scheduled for refactoring
- EXC-002: Specialized testing scenarios requiring alternative frameworks (e.g., visual regression, accessibility audits)

## Rationale

- The describe-it pattern provides clear test organization that is widely understood and supported by modern JavaScript/TypeScript testing frameworks
- Event-driven testing patterns with explicit tracking arrays enable verification of asynchronous behavior and state transitions in collaboration and event bus scenarios
- Shared test utilities (@excalidraw/excalidraw/tests/helpers/ui, test-utils) reduce duplication and ensure consistent test setup across the codebase
- The pattern's presence in 4 files with 92.90% confidence indicates this is an established practice that should be formalized and extended

## Consequences

Positive:
- Consistent test structure improves readability and maintainability across all test files
- Event-driven testing patterns enable reliable verification of asynchronous collaboration and state management features
- Shared test utilities reduce code duplication and setup complexity
- Clear test descriptions serve as living documentation of expected behavior

Negative:
- Requires refactoring of any existing tests that don't follow the describe-it structure
- Event-driven testing patterns add complexity for developers unfamiliar with event emitter testing
- Shared test utilities create coupling between test files and the test infrastructure
- May require additional training for developers new to the codebase or testing patterns

## Alternatives

- Use flat test structure without describe blocks, relying only on individual test functions (rejected)
  Rejected because: Flat structure lacks organization for complex feature domains like collaboration and event systems, making tests harder to navigate and understand
  When valid: May be acceptable for very simple utility functions with only 1-2 test cases
- Use synchronous mocking for all event-driven tests instead of actual event emitters (rejected)
  Rejected because: Synchronous mocks would not accurately test the asynchronous event-driven behavior critical to collaboration features and state management
  When valid: Acceptable for unit tests of pure functions that don't involve actual event handling
- Allow each package to define its own test structure and patterns independently (rejected)
  Rejected because: Inconsistent test patterns across packages would increase cognitive load and make it harder to contribute across the codebase
  When valid: Only when a package has fundamentally different testing requirements that cannot be met by the standard approach

## Risks

- Event-driven tests may become flaky if timing issues or race conditions are not properly handled
  Mitigation: Use proper async/await patterns, ensure event listeners are registered before emitting events, and implement timeout guards in test utilities
  Owner: Engineering team
- Shared test utilities may become a bottleneck if changes require updating many test files
  Mitigation: Keep test utilities focused and stable, version them appropriately, and provide deprecation warnings before breaking changes
  Owner: Engineering team
- Developers may write overly complex nested describe blocks that reduce test clarity
  Mitigation: Establish code review guidelines for test structure, limit nesting depth to 2-3 levels, and provide examples of well-structured tests
  Owner: Engineering team

## Implementation Notes

- Start by ensuring all new test files follow the describe-it structure with clear, behavior-focused descriptions
- For event-driven tests, create tracking arrays (e.g., durableIncrements, ephemeralIncrements, calls) before registering event listeners
- Import test utilities from @excalidraw/excalidraw/tests/helpers/ui and @excalidraw/excalidraw/tests/test-utils rather than creating local test helpers
- Use descriptive test names that explain the expected behavior (e.g., 'should allow to undo / redo even on force-deleted elements')
- When testing event buses or emitters, register listeners before emitting events and verify the captured events/increments in assertions

## Continuation Context


Verify commands:
- grep -r "describe(" excalidraw-app/tests/ packages/*/src/*.test.ts* | wc -l
- grep -r "it(" excalidraw-app/tests/ packages/*/src/*.test.ts* | wc -l
- find . -name '*.test.ts*' -exec grep -l '@excalidraw/excalidraw/tests/' {} \;

Accept when:
- All test files contain at least one describe block organizing test cases
- Test files with event-driven behavior use explicit event listener registration and tracking arrays
- Test files import from shared test utilities (@excalidraw/excalidraw/tests/helpers/ui or test-utils) where applicable

## Enforcement

- Verified by: Code review process checks for describe-it structure in all new test files
- Verified by: CI pipeline runs all tests to ensure they execute successfully with the standard structure
- Verified by: Linting rules or custom scripts detect test files without describe blocks
- Violation handling: Pull requests with non-compliant test structure receive review comments requesting updates
- Violation handling: Existing non-compliant tests are flagged for refactoring in technical debt backlog
- Violation handling: Repeated violations trigger discussion with developer about testing best practices
- Exception process: Developer documents rationale for exception in test file header or PR description
- Exception process: Tech lead or architect reviews exception request and approves if justified
- Exception process: Approved exceptions are tracked in testing documentation with review date for future reconsideration