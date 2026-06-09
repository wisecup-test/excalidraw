# Establish Service Boundary Pattern with Cache-Backed API Contracts: Core Library Dependencies

These rules are ALWAYS ACTIVE for all service modules that expose functionality to other parts of the application, stateful services that manage data requiring repeated access or coordination, modules that integrate external libraries or frameworks, event-driven components that coordinate across service boundaries, and API layers that define contracts between frontend and backend or between major subsystems.

### Rules

- **R-SVC-001** MUST: Core library dependencies MUST be explicitly declared in import statements and isolated to specific service boundaries to prevent unintended coupling.

### Verify

```bash
# Verify explicit TypeScript interface or type definitions for public API contracts
grep -r 'export.*interface\|export.*type' packages/ excalidraw-app/ | grep -E '(API|Contract|Public)' | wc -l

# Verify stateful services implement Map-based cache layers
grep -r 'new Map<' packages/ excalidraw-app/ | grep -E '(cache|Cache|saved|Saved)' | wc -l

# Verify event-driven communication patterns for cross-boundary coordination
grep -r '\.on(\|\.emit(' packages/ excalidraw-app/ | wc -l
```

**Accept when:**
- Services export explicit TypeScript interface or type definitions for their public API contracts (grep finds exported types)
- Stateful services implement Map-based cache layers with get/set operations (grep finds Map instantiations with cache-related names)
- Event-driven communication patterns are present for cross-boundary coordination (grep finds .on( or .emit( patterns)

<enforcement>
Clause R-SVC-001 verification is mandatory. TypeScript compiler enforces API contract boundaries at build time. Code review checklist must include verification of service boundary patterns for new services. Automated linting rules must detect missing export declarations for service modules. Architecture review is required for new service introductions or boundary changes. Violations block PR merges when API contracts are violated or service boundaries are unclear.
</enforcement>