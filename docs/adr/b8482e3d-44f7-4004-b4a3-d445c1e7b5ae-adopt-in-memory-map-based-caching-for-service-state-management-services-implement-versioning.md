# Adopt In-Memory Map-Based Caching for Service State Management: Services Implement Versioning

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Context

- The application requires fast, in-process access to frequently accessed state data including color palettes, file metadata, collaboration state, and user session information
- Service boundaries need to maintain local caches of computed values and transient state without external datastore dependencies
- Real-time collaboration features require low-latency access to broadcasted element versions, socket connections, and user presence data
- The codebase demonstrates consistent use of JavaScript Map objects for cache layers across 11 files with 90.43% confidence
- Cache invalidation and lifecycle management must be handled within service boundaries to maintain consistency

## Problem Statement

Services need a lightweight, in-process caching mechanism to store transient state, computed values, and session data without introducing external datastore dependencies or network latency. The pattern must support fast lookups, updates, and deletions while maintaining clear service boundaries and enabling efficient memory management.

## Decision

1. MAY: Services MAY implement versioning or timestamps in cached values to support staleness detection

## Policy Block

- MAY Services MAY implement versioning or timestamps in cached values to support staleness detection

In scope:
- In-memory caching of computed values (e.g., DARK_MODE_COLORS_CACHE for color transformations)
- Session state management (e.g., broadcasted element versions, socket connections)
- Transient file metadata (e.g., saving/fetching file status in FileManager)
- User presence and collaboration state (e.g., collaborator tracking in Portal)
- Event emitter registration and last payload tracking (e.g., AppEventBus)
- Lock state management for concurrency control (e.g., Locker)
- UI state caching (e.g., file loading status in FileStatusStore)

Out of scope:
- Persistent data storage requiring durability across application restarts
- Data requiring ACID transaction guarantees
- Large datasets exceeding reasonable memory limits
- Data requiring cross-process or distributed access
- Long-term audit logs or historical records
- Data requiring backup and recovery mechanisms

Exceptions:
- EXC-001: Cache data must be persisted for offline-first scenarios
- EXC-002: Memory constraints require alternative caching strategies

## Rationale

- The evidence shows consistent adoption of Map-based caching across 11 files including critical paths like colors.ts, Portal.tsx, FileManager.ts, and firebase.ts with 90.43% confidence
- Map objects provide O(1) lookup performance for cache access patterns observed in the codebase (get, set, delete operations)
- In-memory caching eliminates network latency for frequently accessed transient state, critical for real-time collaboration features
- The pattern maintains clear service boundaries by encapsulating cache instances within service classes (Portal, FileManager, Locker, AppEventBus)
- JavaScript Map provides native support for any key type and maintains insertion order, supporting the diverse caching needs observed (strings, objects, IDs)

## Consequences

Positive:
- Fast O(1) access time for cached data improves application responsiveness, particularly for real-time collaboration features
- No external datastore dependencies reduce system complexity and deployment requirements
- Memory-efficient storage for transient state with automatic garbage collection when references are released
- Clear service boundaries through encapsulated cache instances improve code maintainability
- Native JavaScript Map API provides consistent interface across all cache implementations

Negative:
- Cache data is lost on application restart, requiring recomputation or refetching
- No built-in memory limits or eviction policies may lead to unbounded memory growth
- Lack of persistence mechanisms requires separate solutions for offline-first scenarios
- No cross-tab or cross-process cache sharing capabilities
- Manual cache invalidation logic increases complexity and risk of stale data bugs

## Alternatives

- Use IndexedDB for all caching needs (rejected)
  Rejected because: IndexedDB introduces asynchronous API overhead and persistence complexity for transient state that doesn't require durability. Evidence shows Map-based caching is preferred for hot paths requiring synchronous access.
  When valid: When cache data must survive page reloads or support offline-first scenarios (as seen in LocalData.ts which uses idb-keyval for persistent storage)
- Use plain JavaScript objects with bracket notation (rejected)
  Rejected because: Plain objects lack proper key type support, have prototype chain pollution risks, and don't provide native size tracking or iteration methods. Map objects offer superior API and type safety.
  When valid: When serialization to JSON is required or when working with legacy code expecting object notation
- Implement LRU cache with eviction policies (deferred)
  Rejected because: Current evidence doesn't show memory pressure issues requiring eviction. Simple Map-based caching meets current needs with lower complexity.
  When valid: When memory profiling reveals unbounded cache growth or when caching large datasets with predictable access patterns

## Risks

- Unbounded cache growth leading to memory exhaustion in long-running sessions
  Mitigation: Implement monitoring for cache sizes and add eviction policies or TTL mechanisms for caches showing growth patterns. Consider WeakMap for object-keyed caches where appropriate.
  Owner: Engineering team
- Stale cache data causing inconsistencies when underlying data changes
  Mitigation: Implement explicit cache invalidation on data mutations. Document cache lifecycle and invalidation triggers for each cache instance. Add cache versioning where appropriate.
  Owner: Engineering team
- Cache key collisions or type mismatches causing incorrect lookups
  Mitigation: Use TypeScript generics to enforce key and value types. Implement cache wrapper classes with type-safe interfaces. Add runtime validation in development mode.
  Owner: Engineering team

## Implementation Notes

- Encapsulate Map instances as private class members or module-scoped constants (e.g., `private broadcastedElementVersions = new Map<string, number>()`)
- Use optional chaining for cache lookups to handle missing keys gracefully (e.g., `DARK_MODE_COLORS_CACHE?.get(color)`)
- Implement explicit cleanup methods for caches tied to component lifecycle (e.g., `this.savingFiles.delete(fileId)` in FileManager)
- Consider using WeakMap for caches keyed by objects to enable automatic garbage collection when keys are no longer referenced
- Document cache purpose, key types, value types, and invalidation strategy in code comments for each cache instance
- For caches requiring persistence, use separate storage mechanisms like IndexedDB (as seen in LocalData.ts) rather than extending Map-based caches

## Continuation Context


Verify commands:
- grep -r "new Map<" --include="*.ts" --include="*.tsx" | wc -l
- grep -r "\.get(\|\.set(\|\.delete(" --include="*.ts" --include="*.tsx" | grep -v node_modules | head -20
- grep -r "CACHE" --include="*.ts" --include="*.tsx" | grep "Map" | wc -l

Accept when:
- Map-based cache instances are found in service classes for transient state management
- Cache access patterns use get(), set(), and delete() methods consistently
- Cache instances are encapsulated within service boundaries (private members or module scope)
- No persistent data is stored exclusively in Map-based caches without durable backup

## Enforcement

- Verified by: Code review checking for Map usage patterns in new cache implementations
- Verified by: Static analysis tools scanning for cache access patterns and encapsulation
- Verified by: TypeScript type checking ensuring cache key and value type safety
- Verified by: Unit tests validating cache behavior including invalidation logic
- Violation handling: Code review feedback requesting refactoring to Map-based caching for transient state
- Violation handling: Architecture review for cases proposing alternative caching mechanisms
- Violation handling: Documentation updates required for any approved exceptions
- Violation handling: Performance testing required for caches showing unbounded growth patterns
- Exception process: Submit exception request with justification to architecture team
- Exception process: Provide evidence of Map limitations for specific use case (memory profiling, performance benchmarks)
- Exception process: Document alternative approach with clear trade-off analysis
- Exception process: Obtain approval from architecture team and document in ADR amendments