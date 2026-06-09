# Establish Service Boundary Pattern with Cache-Backed API Contracts: Services Implement Additional

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Context

- The codebase exhibits a consistent pattern of service boundaries defined through explicit API contracts (ColorTuple, ColorPaletteCustom, Key, CODES, AppEventBus, Portal, FileManager, etc.) that expose public interfaces while encapsulating internal implementation details
- Services consistently implement cache layers using Map-based data structures (DARK_MODE_COLORS_CACHE, broadcastedElementVersions, savedFiles, savingFiles, FirebaseSceneVersionCache) to optimize performance and manage state at service boundaries
- Core library dependencies are explicitly declared and isolated (@excalidraw/excalidraw, @excalidraw/common, @excalidraw/element, tinycolor2, idb-keyval, lodash.throttle) establishing clear dependency boundaries between services
- Event-driven communication patterns (socket.on, socket.emit, emitter.on) are used to decouple services while maintaining coordination across boundaries
- The pattern appears across 10 files with 90.35% confidence, indicating an established architectural convention rather than isolated implementation choices

## Problem Statement

Without clearly defined service boundaries and API contracts, codebases suffer from tight coupling, unclear dependencies, and difficulty in testing, scaling, and maintaining individual components. The challenge is to establish a consistent pattern that separates concerns, manages state efficiently at boundaries, and enables independent evolution of services while maintaining system coherence.

## Decision

1. MAY: Services MAY implement additional access patterns (delete, update, clear) beyond basic cache operations based on specific domain requirements

## Policy Block

- MAY Services MAY implement additional access patterns (delete, update, clear) beyond basic cache operations based on specific domain requirements

In scope:
- All service modules that expose functionality to other parts of the application
- Stateful services that manage data requiring repeated access or coordination
- Modules that integrate external libraries or frameworks
- Event-driven components that coordinate across service boundaries
- API layers that define contracts between frontend and backend or between major subsystems

Out of scope:
- Pure utility functions with no state or external dependencies
- Internal helper functions not exposed outside a single module
- Simple data transformation functions that don't define service boundaries
- Configuration constants that don't represent service interfaces

Exceptions:
- EXC-001: Performance-critical paths where cache overhead exceeds benefits (measured via profiling)
- EXC-002: Prototype or experimental features not yet stabilized for production

## Rationale

- The pattern is detected across 10 diverse files (colors, keys, events, collaboration, file management) with 90.35% confidence, indicating this is an established architectural convention that has proven effective across multiple domains
- Cache-backed service boundaries provide measurable performance benefits by reducing redundant computations and I/O operations while maintaining clear separation of concerns
- Explicit API contracts enable independent testing, parallel development, and safe refactoring of service internals without breaking consumers
- Event-driven communication at boundaries prevents tight coupling while enabling complex coordination patterns (real-time collaboration, file synchronization) as evidenced in Portal.tsx and Collab.tsx

## Consequences

Positive:
- Clear service boundaries enable independent testing, mocking, and evolution of components without cascading changes
- Cache layers at boundaries significantly reduce redundant operations (color calculations, file lookups, element version checks) improving application performance
- Explicit API contracts serve as living documentation and enable TypeScript to catch boundary violations at compile time
- Event-driven patterns enable complex real-time features (collaboration, synchronization) while maintaining loose coupling between services

Negative:
- Additional complexity in service design requiring upfront planning of API contracts and cache strategies
- Cache management introduces potential for stale data bugs if invalidation logic is incorrect or incomplete
- Event-driven patterns can make control flow harder to trace and debug compared to direct function calls
- Memory overhead from cache layers, particularly for services with large state spaces or many instances

## Alternatives

- Direct function calls without service boundaries or caching (rejected)
  Rejected because: Leads to tight coupling, makes testing difficult, and results in redundant computations as evidenced by the need for DARK_MODE_COLORS_CACHE and similar optimizations in the current codebase
  When valid: Only appropriate for simple utility functions with no state and minimal computational cost
- Global state management (Redux, MobX) instead of service-level caching (rejected)
  Rejected because: Centralizes all state management creating a bottleneck, reduces encapsulation, and makes it harder to reason about service-specific concerns like file upload status or color palette caching
  When valid: May be appropriate for truly global application state (user preferences, theme) but not for service-specific caching
- Microservices architecture with network boundaries (rejected)
  Rejected because: Excessive for a frontend application, introduces network latency and complexity without corresponding benefits for the use case
  When valid: Appropriate for backend services requiring independent scaling, deployment, and technology stacks

## Risks

- Cache invalidation bugs leading to stale data being served to users, particularly in real-time collaboration scenarios
  Mitigation: Implement comprehensive cache invalidation tests, use versioning strategies (as seen in broadcastedElementVersions), and add cache monitoring/debugging tools
  Owner: Engineering team with architecture review
- Memory leaks from unbounded cache growth in long-running sessions
  Mitigation: Implement cache size limits, LRU eviction policies, and memory monitoring. Review cache usage patterns in performance testing
  Owner: Engineering team with performance testing validation
- Inconsistent application of pattern leading to architectural drift over time
  Mitigation: Establish linting rules to detect missing API contracts, conduct architecture reviews for new services, and document pattern in team guidelines
  Owner: Architecture team with automated tooling support

## Implementation Notes

- Start by identifying service boundaries based on functional domains (file management, collaboration, UI state) rather than technical layers
- Define TypeScript interfaces for public API contracts before implementing service logic, exporting only the contract types and factory functions
- Implement cache layers using Map<K, V> with explicit get/set/delete operations, ensuring cache keys are stable and deterministic
- Use event emitters or callback patterns for cross-boundary communication, avoiding direct imports of service internals
- Document cache invalidation strategies in service module comments, particularly for complex scenarios like collaborative editing
- Consider using WeakMap for caches keyed by objects to enable automatic garbage collection when keys are no longer referenced

## Continuation Context


Verify commands:
- grep -r 'export.*interface\|export.*type' packages/ excalidraw-app/ | grep -E '(API|Contract|Public)' | wc -l
- grep -r 'new Map<' packages/ excalidraw-app/ | grep -E '(cache|Cache|saved|Saved)' | wc -l
- grep -r '\.on\(\|\.emit\(' packages/ excalidraw-app/ | wc -l

Accept when:
- Services export explicit TypeScript interface or type definitions for their public API contracts (grep finds exported types)
- Stateful services implement Map-based cache layers with get/set operations (grep finds Map instantiations with cache-related names)
- Event-driven communication patterns are present for cross-boundary coordination (grep finds .on( or .emit( patterns)

## Enforcement

- Verified by: TypeScript compiler enforces API contract boundaries at build time
- Verified by: Code review checklist includes verification of service boundary patterns for new services
- Verified by: Automated linting rules detect missing export declarations for service modules
- Verified by: Architecture review required for new service introductions or boundary changes
- Violation handling: TypeScript compilation failures block PR merges when API contracts are violated
- Violation handling: Code review feedback requires revision before approval if service boundaries are unclear or missing
- Violation handling: Architecture review escalation for repeated violations or unclear boundary cases
- Violation handling: Refactoring tasks created for legacy code that doesn't conform to pattern
- Exception process: Request exception via architecture review meeting with justification and evidence
- Exception process: Provide performance benchmarks if claiming cache overhead exceeds benefits
- Exception process: Document approved exceptions in service module comments with expiration date for temporary exceptions
- Exception process: Quarterly review of all active exceptions to assess if they can be resolved