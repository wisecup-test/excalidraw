# Adopt In-Memory Map-Based Caching for Service State Management: Cache Implementations Check

These rules are ALWAYS ACTIVE for all TypeScript and TSX files implementing in-memory caching for service state management, including color palettes, file metadata, collaboration state, user sessions, and transient UI state.

### Rules

- **R-CACHE-001** SHOULD: Cache implementations SHOULD check for existence using get() before performing operations to avoid undefined behavior.

### Verify

```bash
# Count Map-based cache instances in the codebase
grep -r "new Map<" --include="*.ts" --include="*.tsx" | wc -l

# Verify cache access patterns use get(), set(), delete() methods
grep -r "\.get(\|\.set(\|\.delete(" --include="*.ts" --include="*.tsx" | grep -v node_modules | head -20

# Count cache instances with Map keyword
grep -r "CACHE" --include="*.ts" --include="*.tsx" | grep "Map" | wc -l
```

**Accept when:**
- Map-based cache instances are found in service classes for transient state management
- Cache access patterns use get(), set(), and delete() methods consistently
- Cache instances are encapsulated within service boundaries (private members or module scope)
- No persistent data is stored exclusively in Map-based caches without durable backup
- Cache lookups check for existence before performing operations to prevent undefined behavior

<enforcement>
Claude Code MUST NOT skip or defer verification of cache implementation patterns. All new cache implementations MUST be reviewed for proper get() existence checks and encapsulation within service boundaries.
</enforcement>