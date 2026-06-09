# Establish Service Boundary Pattern with Cache-Backed API Contracts: Services Implement Additional

These rules are ALWAYS ACTIVE for all service modules that expose functionality to other parts of the application, stateful services that manage data requiring repeated access or coordination, modules that integrate external libraries or frameworks, event-driven components that coordinate across service boundaries, and API layers that define contracts between frontend and backend or between major subsystems.

### Rules

- **R-SVC-001** MAY: Services MAY implement additional access patterns (delete, update, clear) beyond basic cache operations based on specific domain requirements.

### Verify

```bash
# Verify explicit TypeScript interface or type definitions for public API contracts
grep -r 'export.*interface\|export.*type' packages/ excalidraw-app/ | grep -E '(API|Contract|Public)' | wc -l

# Verify stateful services implement Map-based cache layers with get/set operations
grep -r 'new Map<' packages/ excalidraw-app/ | grep -E '(cache|Cache|saved|Saved)' | wc -l

# Verify event-driven communication patterns are present for cross-boundary coordination
grep -r '\.on(\|\.emit(' packages/ excalidraw-app/ | wc -l
```

**Accept when:**
- Services export explicit TypeScript interface or type definitions for their public API contracts (grep finds exported types)
- Stateful services implement Map-based cache layers with get/set operations (grep finds Map instantiations with cache-related names)
- Event-driven communication patterns are present for cross-boundary coordination (grep finds .on( or .emit( patterns)

<enforcement>
Verification via TypeScript compiler, code review checklist, automated linting rules, and architecture review is mandatory. Violations block PR merges or require revision before approval. Exceptions require architecture review meeting with justification and performance benchmarks.
</enforcement>