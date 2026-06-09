# Adopt Public Contract Classes as API Boundary Markers: Contract Classes Named

These rules are ALWAYS ACTIVE for all modules that expose public APIs or service boundaries, including data persistence layers, collaboration and communication boundaries, and library and resource management interfaces.

### Rules

- **R-CONTRACT-001** SHOULD: Contract classes SHOULD be named to clearly indicate their domain responsibility and API nature (e.g., suffixes like 'Adapter', 'Portal', or domain names like 'LocalData').

### Verify

```bash
# Count contract classes matching naming patterns
grep -r 'export class.*Adapter\|export class.*Portal\|export class.*Data' --include='*.ts' --include='*.tsx' | wc -l

# Verify contract class annotations are present
grep -r 'api\.public\.contracts=' --include='*.ts' --include='*.tsx' | grep -o 'api\.public\.contracts=[^;]*' | cut -d'=' -f2

# Check for contract classes with proper encapsulation (private/protected members)
find . -name '*.ts' -o -name '*.tsx' | xargs grep -l 'export class' | xargs grep -L 'private\|protected' | wc -l
```

**Accept when:**
- Each module with public API responsibilities has at least one identifiable contract class (Portal, LocalData, or Adapter-suffixed classes)
- Contract classes encapsulate external library dependencies and internal state management without exposing implementation details
- Grep for 'api.public.contracts=' annotations returns the expected contract class names (Portal, LocalData, LibraryIndexedDBAdapter, TTDIndexedDBAdapter, etc.)
- Contract classes use TypeScript private/protected modifiers to enforce encapsulation boundaries

<enforcement>
Clause Code MUST NOT skip or defer verification of contract class naming conventions and encapsulation patterns during code review and architecture validation.
</enforcement>