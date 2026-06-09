# Adopt Jotai Store Pattern for Service-Level State Management: Service Definitions Use

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Context

- The codebase uses @excalidraw/excalidraw libraries with distributed state management requirements across collaboration (Portal.tsx) and local data persistence (LocalData.ts) layers
- Service boundaries require coordinated access to shared state atoms (localStorageQuotaExceededAtom) through a centralized store pattern (appJotaiStore)
- Event-driven socket communication (this.socket.on/emit) and cache layer operations (broadcastedElementVersions Map) need consistent state access patterns
- The application manages both volatile real-time collaboration state and persistent local storage state, requiring a unified state management approach

## Problem Statement

Services and boundaries in the application need a consistent pattern for accessing and mutating shared state atoms. Without a standardized approach, state management becomes fragmented across different service definitions, leading to inconsistent patterns for cache layers, event handlers, and data persistence operations.

## Decision

1. MUST: Service definitions MUST use appJotaiStore.get() and appJotaiStore.set() for accessing and mutating shared state atoms

## Policy Block

- MUST Service definitions MUST use appJotaiStore.get() and appJotaiStore.set() for accessing and mutating shared state atoms

In scope:
- Service definitions accessing shared application state
- Cache layer implementations for element versioning
- Event-driven socket communication handlers
- Local data persistence operations
- Collaboration state management

Out of scope:
- Component-level local state (React useState)
- Transient UI state not shared across services
- Third-party library internal state
- Browser native storage APIs used directly

## Rationale

- The pattern provides a consistent interface (appJotaiStore.get/set) for state access across service boundaries, as evidenced by localStorageQuotaExceededAtom usage in LocalData.ts
- Map-based caching (broadcastedElementVersions) enables efficient element version tracking in the collaboration layer without polluting the global state store
- Socket-based event patterns (socket.on/emit) align with the event-driven architecture required for real-time collaboration features
- The separation between store-managed atoms and local Map caches provides clear boundaries between shared state and service-specific optimizations

## Consequences

Positive:
- Consistent state access patterns across all service definitions improve code maintainability and reduce cognitive load
- Centralized store management (appJotaiStore) enables better debugging and state inspection capabilities
- Map-based caching provides O(1) lookup performance for element versioning without additional dependencies
- Clear separation between shared state atoms and local caches prevents state synchronization issues

Negative:
- Developers must learn and follow the Jotai store pattern conventions, increasing onboarding complexity
- Mixed state management approaches (store atoms + Map caches) require understanding when to use each pattern
- Potential for inconsistency if developers bypass the store pattern and access state directly
- Additional abstraction layer may obscure state flow for developers unfamiliar with Jotai

## Alternatives

- Use React Context API for all service-level state management (rejected)
  Rejected because: Context API requires component tree coupling and does not provide the atomic state management needed for service boundaries that operate outside the React lifecycle
  When valid: For component-scoped state that naturally follows the component hierarchy
- Use Redux with thunks for all state management including caches (rejected)
  Rejected because: Redux introduces significant boilerplate and the store would become bloated with cache data that doesn't need global state management or time-travel debugging
  When valid: For applications requiring comprehensive state history and debugging capabilities across all state
- Use plain module-level variables for service state (rejected)
  Rejected because: Module-level variables lack reactivity, testability, and the ability to subscribe to changes, making them unsuitable for state that needs to trigger updates
  When valid: For truly static configuration values that never change during runtime

## Risks

- Inconsistent adoption of the pattern across the codebase leading to mixed state management approaches
  Mitigation: Establish linting rules to detect direct state access patterns and require code review approval for deviations from the store pattern
  Owner: Engineering team
- Performance degradation if Map caches are replaced with store atoms, causing unnecessary re-renders
  Mitigation: Document clear guidelines on when to use store atoms (shared reactive state) vs Map caches (service-local optimization)
  Owner: Architecture team
- Memory leaks if Map-based caches grow unbounded without cleanup strategies
  Mitigation: Implement cache size limits and LRU eviction policies for long-lived Map structures like broadcastedElementVersions
  Owner: Engineering team

## Implementation Notes

- Import appJotaiStore from the appropriate module and use .get(atom) and .set(atom, value) for all shared state access in service definitions
- Use Map structures (new Map()) for service-local caches that need fast lookups but don't require reactivity or cross-service visibility
- For event-driven boundaries, establish socket event handlers using socket.on(eventName, handler) and emit events using socket.emit(eventName, data)
- When implementing new services, identify which state needs to be shared (use store atoms) vs service-local (use Map or class properties)

## Continuation Context


Verify commands:
- grep -r 'appJotaiStore\.get\|appJotaiStore\.set' --include='*.ts' --include='*.tsx' excalidraw-app/
- grep -r 'new Map()' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -E '(broadcastedElementVersions|cache|Cache)'
- grep -r 'socket\.on\|socket\.emit' --include='*.ts' --include='*.tsx' excalidraw-app/

Accept when:
- All service definitions use appJotaiStore.get/set for shared state atom access
- Cache layers use Map-based storage for element versioning and local optimization
- Event-driven boundaries consistently use socket.on/emit patterns for communication

## Enforcement

- Verified by: Code review checklist verifying store pattern usage in service definitions
- Verified by: Automated grep-based checks in CI pipeline for appJotaiStore usage patterns
- Verified by: Architecture review for new service boundaries to ensure pattern compliance
- Violation handling: CI pipeline warnings for service files that don't use appJotaiStore for state access
- Violation handling: Code review rejection for direct state mutations outside the store pattern
- Violation handling: Refactoring tickets created for legacy code that violates the pattern
- Exception process: Document the specific reason why the store pattern cannot be used in the service
- Exception process: Obtain architecture team approval for alternative state management approach
- Exception process: Add inline comments explaining the exception and linking to approval discussion