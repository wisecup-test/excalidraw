# Adopt Public Contract Classes as API Boundary Markers: Contract Classes Encapsulate

These rules are ALWAYS ACTIVE for all modules that expose public APIs or service boundaries, particularly data persistence layers, collaboration boundaries, and library/resource management interfaces.

### Rules

- **R-CONTRACT-001** MUST: Contract classes MUST encapsulate integration with external libraries and frameworks, preventing direct dependencies from leaking to consumers.

### Verify

```bash
# Count contract class exports (Portal, *Data, *Adapter patterns)
grep -r 'export class.*Adapter\|export class.*Portal\|export class.*Data' --include='*.ts' --include='*.tsx' | wc -l

# Verify contract class annotations are present
grep -r 'api\.public\.contracts=' --include='*.ts' --include='*.tsx' | grep -o 'api\.public\.contracts=[^;]*' | cut -d'=' -f2

# Check for modules with public classes lacking access modifiers (potential violations)
find . -name '*.ts' -o -name '*.tsx' | xargs grep -l 'export class' | xargs grep -L 'private\|protected' | wc -l
```

**Accept when:**
- Each module with public API responsibilities has at least one identifiable contract class (Portal, LocalData, or Adapter-suffixed classes)
- Contract classes encapsulate external library dependencies and internal state management without exposing implementation details
- Grep for 'api.public.contracts=' annotations returns the expected contract class names (Portal, LocalData, LibraryIndexedDBAdapter, TTDIndexedDBAdapter, etc.)
- Internal state (cache layers, error tracking) remains private and only necessary public methods are exposed
- Cross-cutting concerns (logging, error handling, state management) are handled within the contract class

<enforcement>
Claude Code MUST NOT skip or defer verification of contract class encapsulation. All public API modules MUST have identifiable contract classes that encapsulate external dependencies. Code review rejection is required for PRs that expose internal implementations without proper contract classes.
</enforcement>