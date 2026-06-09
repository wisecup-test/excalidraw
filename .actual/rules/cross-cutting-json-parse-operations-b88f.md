# Validate JSON Input from External Sources Before Parsing: Json Parse Operations

These rules are ALWAYS ACTIVE for all TypeScript and TSX files that parse JSON from external sources including localStorage, environment variables, network responses, decoded buffers, and WebSocket payloads.

### Rules

- **R-JSON-001** MUST: JSON.parse() operations on external data sources MUST be wrapped in try-catch blocks or use safe parsing utilities to provide fallback values or default behavior when parsing fails and prevent application crashes.

### Verify

```bash
# Find JSON.parse() calls not wrapped in try-catch blocks
grep -n 'JSON\.parse' --include='*.ts' --include='*.tsx' -r . | grep -v 'try' | grep -v '//' | head -20

# Count JSON.parse() operations on localStorage
grep -rn 'JSON\.parse.*localStorage' --include='*.ts' --include='*.tsx' . | wc -l

# Count JSON-related error handling patterns
grep -rn 'console\.error.*JSON\|console\.warn.*JSON' --include='*.ts' --include='*.tsx' . | wc -l
```

**Accept when:**
- All JSON.parse() operations on external data sources are wrapped in try-catch blocks or use safe parsing utilities
- Grep search for unprotected JSON.parse() calls returns zero results in production code paths
- All parsing error cases include appropriate logging with console.error() or console.warn() and context information
- Code review checklist includes verification of JSON parsing error handling for all new code
- Exceptions are documented with EXC-001 or EXC-002 references in code comments

<enforcement>
Claude Code MUST NOT skip or defer verification of JSON.parse() operations on external data sources. All violations must be remediated or explicitly documented as exceptions before code review approval.
</enforcement>