# Adopt Public Contract Classes as API Boundary Markers: Contract Classes Use

These rules are ALWAYS ACTIVE for all modules that expose public APIs or service boundaries, including data persistence layers, collaboration and communication boundaries, and library and resource management interfaces.

### Rules

- **R-CONTRACT-001** MAY: Contract classes MAY use adapter patterns when integrating with third-party storage or communication libraries (as seen with LibraryIndexedDBAdapter, TTDIndexedDBAdapter).

### Verify

```bash
# Count contract classes and adapter patterns
grep -r 'export class.*Adapter\|export class.*Portal\|export class.*Data' --include='*.ts' --include='*.tsx' | wc -l

# Verify contract class annotations
grep -r 'api\.public\.contracts=' --include='*.ts' --include='*.tsx' | grep -o 'api\.public\.contracts=[^;]*' | cut -d'=' -f2

# Check for proper encapsulation (private/protected modifiers)
find . -name '*.ts' -o -name '*.tsx' | xargs grep -l 'export class' | xargs grep -L 'private\|protected' | wc -l
```

**Accept when:**
- Each module with public API responsibilities has at least one identifiable contract class (Portal, LocalData, or Adapter-suffixed classes)
- Contract classes encapsulate external library dependencies and internal state management without exposing implementation details
- Grep for 'api.public.contracts=' annotations returns the expected contract class names (Portal, LocalData, LibraryIndexedDBAdapter, TTDIndexedDBAdapter, etc.)
- Contract classes use private/protected modifiers to hide internal state and implementation details

<enforcement>
Claude Code MUST NOT skip or defer verification of contract class patterns. Code review rejection is required for PRs that expose internal implementations without contract classes. Refactoring tickets must be created for existing violations discovered during audits.
</enforcement>