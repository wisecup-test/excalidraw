# Adopt Public Contract Classes as API Boundary Markers: Each Functional Domain

These rules are ALWAYS ACTIVE for all modules that expose public APIs or service boundaries, including data persistence layers, collaboration and communication boundaries, and library and resource management interfaces.

### Rules

- **R-CONTRACT-001** MUST: Each functional domain (collaboration, storage, library management) MUST have at most one primary contract class to avoid API fragmentation.
- **R-CONTRACT-002** MUST: Contract classes MUST encapsulate external library dependencies and internal state management without exposing implementation details.
- **R-CONTRACT-003** MUST: Internal state (cache layers, error tracking) MUST be kept private and only necessary public methods exposed.
- **R-CONTRACT-004** SHOULD: Name contract classes clearly to indicate their domain (e.g., Portal for collaboration, LocalData for local storage, Adapter suffix for external library integration).
- **R-CONTRACT-005** SHOULD: Handle cross-cutting concerns (logging, error handling, state management) within the contract class rather than exposing them to consumers.
- **R-CONTRACT-006** MAY: Use the Adapter suffix when the primary purpose is integrating with external libraries.

### Verify

```bash
# Count exported contract classes
grep -r 'export class.*Adapter\|export class.*Portal\|export class.*Data' --include='*.ts' --include='*.tsx' | wc -l

# Find contract class annotations
grep -r 'api\.public\.contracts=' --include='*.ts' --include='*.tsx' | grep -o 'api\.public\.contracts=[^;]*' | cut -d'=' -f2

# Identify classes lacking access modifiers (potential violations)
find . -name '*.ts' -o -name '*.tsx' | xargs grep -l 'export class' | xargs grep -L 'private\|protected' | wc -l
```

**Accept when:**
- Each module with public API responsibilities has at least one identifiable contract class (Portal, LocalData, or Adapter-suffixed classes).
- Contract classes encapsulate external library dependencies and internal state management without exposing implementation details.
- Grep for 'api.public.contracts=' annotations returns the expected contract class names (Portal, LocalData, LibraryIndexedDBAdapter, TTDIndexedDBAdapter, etc.).
- Internal state and implementation details are marked with private or protected access modifiers.
- No direct access to internal implementations bypasses contract classes.

<enforcement>
Claude Code MUST NOT skip or defer verification. All rules in this file are mandatory for modules exposing public APIs. Violations require code review rejection or architecture team consultation for documented exceptions (deprecation, experimental features).
</enforcement>