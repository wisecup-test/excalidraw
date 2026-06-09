# Establish Service Boundary Pattern with Cache-Backed API Contracts: Services Define Explicit

These rules are ALWAYS ACTIVE for all service modules that expose functionality to other parts of the application, stateful services that manage data requiring repeated access or coordination, modules that integrate external libraries or frameworks, event-driven components that coordinate across service boundaries, and API layers that define contracts between frontend and backend or between major subsystems.

### Rules

- **R-SVC-001** MUST: Services MUST define explicit public API contracts using TypeScript types or interfaces that declare all externally accessible functions, types, and constants.
- **R-SVC-002** MUST: Stateful services MUST implement cache layers using Map-based data structures with explicit get/set/delete operations, ensuring cache keys are stable and deterministic.
- **R-SVC-003** MUST: Services MUST document cache invalidation strategies in service module comments, particularly for complex scenarios like collaborative editing.
- **R-SVC-004** SHOULD: Services SHOULD use event emitters or callback patterns for cross-boundary communication, avoiding direct imports of service internals.
- **R-SVC-005** SHOULD: Services SHOULD consider using WeakMap for caches keyed by objects to enable automatic garbage collection when keys are no longer referenced.
- **R-SVC-006** MAY: Services MAY request exceptions for performance-critical paths where cache overhead exceeds benefits (measured via profiling) or for prototype/experimental features not yet stabilized for production.

### Verify

```bash
# Check for exported API contract types
grep -r 'export.*interface\|export.*type' packages/ excalidraw-app/ | grep -E '(API|Contract|Public)' | wc -l

# Check for Map-based cache implementations
grep -r 'new Map<' packages/ excalidraw-app/ | grep -E '(cache|Cache|saved|Saved)' | wc -l

# Check for event-driven communication patterns
grep -r '\.on(\|\.emit(' packages/ excalidraw-app/ | wc -l
```

**Accept when:**
- Services export explicit TypeScript interface or type definitions for their public API contracts (grep finds exported types)
- Stateful services implement Map-based cache layers with get/set operations (grep finds Map instantiations with cache-related names)
- Event-driven communication patterns are present for cross-boundary coordination (grep finds .on( or .emit( patterns)
- Cache invalidation strategies are documented in service module comments
- Service boundaries are clearly separated with no direct imports of service internals

<enforcement>
Claude Code MUST NOT skip or defer verification. TypeScript compiler MUST enforce API contract boundaries at build time. Code review MUST include verification of service boundary patterns for new services. Architecture review is REQUIRED for new service introductions or boundary changes. Violations block PR merges when API contracts are violated or service boundaries are unclear.
</enforcement>