# Adopt Public Contract Classes as API Boundary Markers: Contract Classes Manage

These rules are ALWAYS ACTIVE for all modules that expose public APIs or service boundaries, including data persistence layers, collaboration boundaries, and library/resource management interfaces.

### Rules

- **R-CONTRACT-001** SHOULD: Contract classes SHOULD manage cross-cutting concerns such as caching, error handling, and logging internally without exposing these mechanisms.

### Verify

```bash
# Count contract class exports (Portal, *Data, *Adapter patterns)
grep -r 'export class.*Adapter\|export class.*Portal\|export class.*Data' --include='*.ts' --include='*.tsx' | wc -l

# Verify contract classes encapsulate external dependencies
grep -r 'private\|protected' --include='*.ts' --include='*.tsx' | grep -E '(cache|error|log)' | wc -l

# Check for direct access to internal implementations (should be minimal)
find . -name '*.ts' -o -name '*.tsx' | xargs grep -l 'export class' | xargs grep -L 'private\|protected' | wc -l
```

**Accept when:**
- Each module with public API responsibilities has at least one identifiable contract class (Portal, LocalData, or Adapter-suffixed classes)
- Contract classes encapsulate external library dependencies and internal state management without exposing implementation details
- Cross-cutting concerns (caching, error handling, logging) are managed within contract classes rather than exposed to consumers
- Internal state and helper methods use TypeScript private/protected modifiers

<enforcement>
Claude Code MUST NOT skip or defer verification of contract class patterns during code review and architecture validation.
</enforcement>