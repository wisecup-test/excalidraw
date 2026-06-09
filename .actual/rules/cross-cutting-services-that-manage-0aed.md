# Establish Service Boundary Pattern with Cache-Backed API Contracts: Services That Manage

These rules are ALWAYS ACTIVE for all service modules that expose functionality to other parts of the application, stateful services that manage data requiring repeated access or coordination, modules that integrate external libraries or frameworks, event-driven components that coordinate across service boundaries, and API layers that define contracts between frontend and backend or between major subsystems.

### Rules

- **R-SVC-001** MUST: Services that manage stateful data MUST implement cache layers using Map-based data structures (or equivalent) at the service boundary to optimize repeated access patterns.

### Verify

```bash
# Verify explicit TypeScript API contracts are exported
grep -r 'export.*interface\|export.*type' packages/ excalidraw-app/ | grep -E '(API|Contract|Public)' | wc -l

# Verify Map-based cache layers with cache-related names
grep -r 'new Map<' packages/ excalidraw-app/ | grep -E '(cache|Cache|saved|Saved)' | wc -l

# Verify event-driven communication patterns
grep -r '\.on(\|\.emit(' packages/ excalidraw-app/ | wc -l
```

**Accept when:**
- Services export explicit TypeScript interface or type definitions for their public API contracts (grep finds exported types)
- Stateful services implement Map-based cache layers with get/set operations (grep finds Map instantiations with cache-related names)
- Event-driven communication patterns are present for cross-boundary coordination (grep finds .on( or .emit( patterns)

<enforcement>
Clause Code MUST NOT skip or defer verification. TypeScript compiler enforces API contract boundaries at build time. Code review checklist includes verification of service boundary patterns for new services. Automated linting rules detect missing export declarations for service modules. Architecture review is required for new service introductions or boundary changes. TypeScript compilation failures block PR merges when API contracts are violated. Code review feedback requires revision before approval if service boundaries are unclear or missing. Architecture review escalation is required for repeated violations or unclear boundary cases. Refactoring tasks must be created for legacy code that does not conform to pattern.
</enforcement>