# Adopt Public Contract Classes as API Boundary Markers: Internal Implementation Details

These rules are ALWAYS ACTIVE for all modules that expose public APIs or service boundaries, including data persistence layers, collaboration and communication boundaries, library and resource management interfaces, and any component that integrates external libraries or frameworks.

### Rules

- **R-CONTRACT-001** MUST: Internal implementation details (cache layers, event handlers, storage mechanisms) MUST NOT be directly accessible outside the contract class.

### Verify

```bash
# Count exported contract classes matching the pattern
grep -r 'export class.*Adapter\|export class.*Portal\|export class.*Data' --include='*.ts' --include='*.tsx' | wc -l

# Verify contract class annotations are present
grep -r 'api\.public\.contracts=' --include='*.ts' --include='*.tsx' | grep -o 'api\.public\.contracts=[^;]*' | cut -d'=' -f2

# Count files with public classes lacking access modifiers (potential violations)
find . -name '*.ts' -o -name '*.tsx' | xargs grep -l 'export class' | xargs grep -L 'private\|protected' | wc -l
```

**Accept when:**
- Each module with public API responsibilities has at least one identifiable contract class (Portal, LocalData, or Adapter-suffixed classes)
- Contract classes encapsulate external library dependencies and internal state management without exposing implementation details
- Grep for 'api.public.contracts=' annotations returns the expected contract class names (Portal, LocalData, LibraryIndexedDBAdapter, TTDIndexedDBAdapter, etc.)
- Internal state (cache layers, event handlers) is marked private or protected and not directly exported

<enforcement>
Clause Code MUST NOT skip or defer verification of R-CONTRACT-001. Contract class boundaries are architectural seams critical to maintainability and testability.
</enforcement>