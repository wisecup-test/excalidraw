# Adopt Cache-Backed Service Boundary Pattern with Get/Set/Delete Operations: Service Boundaries Not

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Context

- The codebase exhibits a consistent pattern of using Map-based caching at service boundaries across 11 files with 90.43% confidence, indicating an established architectural approach
- Service definitions frequently implement cache layers using get/set/delete operations on Map structures (e.g., DARK_MODE_COLORS_CACHE, broadcastedElementVersions, savedFiles, locks) to manage state and optimize performance
- Multiple service boundaries integrate cache layers with external systems including Firebase (transaction.get/set), socket.io event handling, and IndexedDB storage, requiring consistent cache management patterns
- The pattern appears in critical paths including color palette management, file storage, collaboration state, and local data persistence, suggesting cache-backed boundaries are fundamental to the application architecture
- Libraries detected include @excalidraw/excalidraw, @excalidraw/common, @excalidraw/element, tinycolor2, lodash.throttle, and idb-keyval, which rely on consistent service boundary definitions for integration

## Problem Statement

Service boundaries in the application lack standardized cache management patterns, leading to inconsistent implementations of get/set/delete operations across different modules. Without clear rules for cache-backed service definitions, developers may implement ad-hoc caching strategies that create maintenance burden, introduce bugs, and reduce system predictability. The pattern detected across 11 files demonstrates an emergent solution that needs formalization to ensure consistency, testability, and maintainability.

## Decision

1. MUST_NOT: Service boundaries MUST NOT bypass cache layers when accessing frequently-used data that has been cached

## Policy Block

- MUST_NOT Service boundaries MUST NOT bypass cache layers when accessing frequently-used data that has been cached

In scope:
- All service boundary implementations that manage stateful data
- Cache layers for external system integrations (Firebase, socket.io, IndexedDB)
- Color palette services (DARK_MODE_COLORS_CACHE)
- File management services (FileManager, FileStatusStore)
- Collaboration state services (Portal, Collab)
- Local data persistence services (LocalData)
- Lock management services (Locker)
- Event bus implementations (AppEventBus)

Out of scope:
- Pure computational functions without state
- Simple data transformations that do not require caching
- One-time initialization code
- Logging and monitoring utilities
- UI component state managed by React hooks (useState, useEffect)

Exceptions:
- EXC-001: Performance profiling demonstrates that caching provides negligible benefit (< 5% improvement) for a specific service boundary
- EXC-002: External library or framework imposes incompatible state management patterns that cannot be adapted to Map-based caching

## Rationale

- The pattern appears consistently across 11 files with 90.43% confidence, indicating it is an established and proven architectural approach within the codebase
- Map-based caching provides O(1) lookup performance for get/set/delete operations, which is critical for service boundaries that are accessed frequently in hot paths
- Standardizing on Map structures ensures predictable behavior, simplifies testing, and reduces cognitive load for developers working across different service boundaries
- The pattern integrates well with TypeScript's type system and modern JavaScript features like optional chaining, making it both type-safe and ergonomic

## Consequences

Positive:
- Consistent cache management patterns across all service boundaries reduce maintenance burden and improve code readability
- Map-based caching provides predictable O(1) performance characteristics for state lookups, improving application responsiveness
- Type-safe cache keys and public contracts reduce runtime errors and improve developer experience through better IDE support
- Standardized cache lifecycle (get/set/delete) makes it easier to reason about state management and debug issues

Negative:
- Map-based caching increases memory usage compared to stateless service implementations, requiring careful monitoring of cache sizes
- Developers must implement cache invalidation logic correctly to avoid stale data issues, adding complexity to service implementations
- The pattern may be over-applied to services where caching provides minimal benefit, leading to unnecessary code complexity
- Cache-backed boundaries require additional testing to verify cache hit/miss scenarios and invalidation logic

## Alternatives

- Use WeakMap instead of Map for automatic garbage collection of cached entries (rejected)
  Rejected because: WeakMap only supports object keys and does not allow iteration or size inspection, which are needed for cache management and debugging in the detected pattern
  When valid: Consider WeakMap for caches where keys are objects and automatic cleanup is more important than cache introspection
- Adopt a third-party caching library (e.g., lru-cache, node-cache) for standardized cache management (rejected)
  Rejected because: The existing Map-based pattern is already established across 11 files and provides sufficient functionality without additional dependencies; introducing a library would require significant refactoring
  When valid: Consider for new projects or when advanced features like TTL, LRU eviction, or cache statistics are required
- Implement stateless service boundaries with no caching, relying on external systems for state (rejected)
  Rejected because: Performance requirements necessitate caching at service boundaries to reduce latency from external calls to Firebase, IndexedDB, and socket.io
  When valid: Valid for services where state is infrequently accessed or where external system performance is acceptable

## Risks

- Memory leaks from unbounded cache growth if entries are not properly deleted or evicted
  Mitigation: Implement cache size monitoring, add automated tests for cache cleanup, and document cache lifecycle in service contracts
  Owner: Engineering team
- Cache inconsistency between service boundaries and external systems (Firebase, IndexedDB) leading to stale data
  Mitigation: Implement cache invalidation strategies, use versioning (e.g., FirebaseSceneVersionCache), and add integration tests for cache synchronization
  Owner: Engineering team
- Over-application of caching pattern to services where it provides minimal benefit, increasing code complexity unnecessarily
  Mitigation: Require performance justification for new cache-backed services, conduct code reviews focusing on cache necessity, and document exception process
  Owner: Architecture review team

## Implementation Notes

- When implementing a new cache-backed service boundary, start by defining the cache key type and ensure it is strongly typed (e.g., type FileId = string & { __brand: 'FileId' })
- Always implement all three cache operations (get, set, delete) even if delete is not immediately needed, to ensure complete lifecycle management
- Use optional chaining for cache lookups (cache?.get(key)) to handle cases where the cache may not be initialized
- Document cache invalidation rules in code comments, especially for services that interact with external systems
- Consider implementing cache statistics (hit rate, size) for monitoring and debugging in development environments
- For services with high cache churn, implement periodic cleanup or size limits to prevent unbounded memory growth

## Continuation Context


Verify commands:
- grep -r 'Map<.*>\.get\|Map<.*>\.set\|Map<.*>\.delete' --include='*.ts' --include='*.tsx' packages/ excalidraw-app/ | wc -l
- grep -r 'CACHE.*\.get\|CACHE.*\.set' --include='*.ts' --include='*.tsx' packages/ excalidraw-app/
- npm test -- --testPathPattern='(FileManager|Portal|Collab|LocalData)' --coverage

Accept when:
- All service boundaries that manage stateful data use Map-based cache structures with get/set/delete operations
- Grep commands identify consistent usage of Map cache operations across service boundary files
- Unit tests verify cache hit/miss scenarios and proper invalidation for all cache-backed services
- Code review confirms that new service boundaries follow the cache-backed pattern or document exceptions

## Enforcement

- Verified by: Code review process checks for Map-based cache usage in service boundary implementations
- Verified by: Automated grep-based checks in CI pipeline verify presence of cache operations (get/set/delete)
- Verified by: Unit test coverage requirements ensure cache lifecycle is tested for all cache-backed services
- Verified by: Architecture review for new service boundaries validates cache necessity and implementation
- Violation handling: Code review blocks merge if service boundaries do not follow cache pattern without documented exception
- Violation handling: CI pipeline warnings for services missing cache operations when caching is detected
- Violation handling: Architecture team reviews violations and determines if exception is warranted or refactoring is required
- Violation handling: Quarterly audits identify inconsistent cache implementations for remediation
- Exception process: Developer submits exception request with performance profiling data or technical justification
- Exception process: Technical lead or architect reviews the request and validates the rationale
- Exception process: If approved, exception is documented in code comments and tracked in architecture decision log
- Exception process: Exceptions are reviewed annually to determine if they should be revoked or made permanent