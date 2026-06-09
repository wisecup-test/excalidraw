# Adopt Public Contract Classes as API Boundary Markers: Public Exposed Through

These rules are ALWAYS ACTIVE for all modules that expose public APIs or service boundaries, including data persistence layers, collaboration boundaries, and library/resource management interfaces.

### Rules

- **R-API-001** MUST: Public APIs MUST be exposed through dedicated contract classes that serve as explicit boundary markers (e.g., Portal, LocalData, TTDIndexedDBAdapter, LibraryIndexedDBAdapter).
- **R-API-002** MUST: Contract classes MUST encapsulate external library dependencies and internal state management without exposing implementation details to consumers.
- **R-API-003** MUST: Contract classes MUST use clear naming conventions: use domain-specific names (Portal for collaboration, LocalData for local storage) and Adapter suffix when integrating external libraries.
- **R-API-004** MUST: Internal state (cache layers, error tracking) MUST be kept private and only necessary public methods MUST be exposed.
- **R-API-005** SHOULD: Cross-cutting concerns (logging, error handling, state management) SHOULD be handled within the contract class rather than exposed to consumers.
- **R-API-006** SHOULD: Contract classes SHOULD be documented clearly, distinguishing between public contract methods and internal implementation details.

### Verify

```bash
# Count exported contract classes matching the pattern
grep -r 'export class.*Adapter\|export class.*Portal\|export class.*Data' --include='*.ts' --include='*.tsx' | wc -l

# Find contract class annotations
grep -r 'api\.public\.contracts=' --include='*.ts' --include='*.tsx' | grep -o 'api\.public\.contracts=[^;]*' | cut -d'=' -f2

# Identify exported classes lacking access modifiers (potential violations)
find . -name '*.ts' -o -name '*.tsx' | xargs grep -l 'export class' | xargs grep -L 'private\|protected' | wc -l
```

**Accept when:**
- Each module with public API responsibilities has at least one identifiable contract class (Portal, LocalData, or Adapter-suffixed classes).
- Contract classes encapsulate external library dependencies and internal state management without exposing implementation details.
- Grep for 'api.public.contracts=' annotations returns the expected contract class names (Portal, LocalData, LibraryIndexedDBAdapter, TTDIndexedDBAdapter, etc.).
- Internal state and helper methods use TypeScript private/protected modifiers to prevent direct access.
- Public API surface is clearly documented and distinguishable from internal implementation.

<enforcement>
Claude Code MUST NOT skip or defer verification. All rules in this file are mandatory for modules exposing public APIs. Violations require code review rejection or architecture team consultation for documented exceptions (deprecation, experimental features).
</enforcement>