# Establish Service Boundary Pattern with Cache-Backed API Contracts: Service Boundaries Align

These rules are ALWAYS ACTIVE for all service modules that expose functionality to other parts of the application, stateful services that manage data requiring repeated access or coordination, modules that integrate external libraries or frameworks, event-driven components that coordinate across service boundaries, and API layers that define contracts between frontend and backend or between major subsystems.

### Rules

- **R-SB-001** SHOULD: Service boundaries SHOULD align with functional domains (colors, keys, events, file management, collaboration) rather than technical layers.

### Verify

```bash
# Verify explicit TypeScript interface/type definitions for public API contracts
grep -r 'export.*interface\|export.*type' packages/ excalidraw-app/ | grep -E '(API|Contract|Public)' | wc -l

# Verify Map-based cache layers with cache-related naming
grep -r 'new Map<' packages/ excalidraw-app/ | grep -E '(cache|Cache|saved|Saved)' | wc -l

# Verify event-driven communication patterns
grep -r '\.on(\|\.emit(' packages/ excalidraw-app/ | wc -l
```

**Accept when:**
- Services export explicit TypeScript interface or type definitions for their public API contracts (grep finds exported types)
- Stateful services implement Map-based cache layers with get/set operations (grep finds Map instantiations with cache-related names)
- Event-driven communication patterns are present for cross-boundary coordination (grep finds .on( or .emit( patterns)

<enforcement>
Verification via TypeScript compiler enforcement of API contract boundaries at build time, code review checklist validation of service boundary patterns, automated linting rules detection of missing export declarations, and architecture review requirements for new service introductions or boundary changes. Claude Code MUST NOT skip or defer verification.
</enforcement>