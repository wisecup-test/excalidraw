# Establish Service Boundary Pattern with Cache-Backed API Contracts: Cache Implementations Provide

These rules are ALWAYS ACTIVE for all service modules that expose functionality to other parts of the application, stateful services that manage data requiring repeated access or coordination, modules that integrate external libraries or frameworks, event-driven components that coordinate across service boundaries, and API layers that define contracts between frontend and backend or between major subsystems.

### Rules

- **R-CACHE-001** SHOULD: Cache implementations SHOULD provide standard operations (get, set, delete, has) and handle cache invalidation explicitly when data changes.

### Verify

```bash
# Verify exported API contracts
grep -r 'export.*interface\|export.*type' packages/ excalidraw-app/ | grep -E '(API|Contract|Public)' | wc -l

# Verify Map-based cache implementations
grep -r 'new Map<' packages/ excalidraw-app/ | grep -E '(cache|Cache|saved|Saved)' | wc -l

# Verify event-driven communication patterns
grep -r '\.on(\|\.emit(' packages/ excalidraw-app/ | wc -l
```

**Accept when:**
- Services export explicit TypeScript interface or type definitions for their public API contracts
- Stateful services implement Map-based cache layers with get/set/delete/has operations
- Event-driven communication patterns are present for cross-boundary coordination using .on() or .emit() patterns
- Cache invalidation logic is explicitly documented and implemented in service modules

<enforcement>
Clause Code MUST NOT skip or defer verification of cache implementation patterns. TypeScript compiler enforcement at build time, code review checklist verification, and architecture review are mandatory before approval.
</enforcement>