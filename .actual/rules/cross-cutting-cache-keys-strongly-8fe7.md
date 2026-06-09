# Adopt In-Memory Map-Based Caching for Service State Management: Cache Keys Strongly

These rules are ALWAYS ACTIVE for all TypeScript and TSX files implementing in-memory caching for service state management, transient data, and computed values.

### Rules

- **R-CACHE-001** MUST: Cache keys MUST be strongly typed and semantically meaningful (e.g., element IDs, socket IDs, file IDs, color values).
- **R-CACHE-002** MUST: Encapsulate Map instances as private class members or module-scoped constants.
- **R-CACHE-003** MUST: Use TypeScript generics to enforce cache key and value types.
- **R-CACHE-004** SHOULD: Implement explicit cache invalidation on data mutations and document cache lifecycle for each cache instance.
- **R-CACHE-005** SHOULD: Use optional chaining for cache lookups to handle missing keys gracefully.
- **R-CACHE-006** SHOULD: Consider using WeakMap for caches keyed by objects to enable automatic garbage collection.
- **R-CACHE-007** SHOULD: Document cache purpose, key types, value types, and invalidation strategy in code comments.
- **R-CACHE-008** MAY: Implement monitoring for cache sizes and add eviction policies or TTL mechanisms for caches showing growth patterns.

### Verify

```bash
# Count Map-based cache instances
grep -r "new Map<" --include="*.ts" --include="*.tsx" | wc -l

# Verify cache access patterns (get, set, delete)
grep -r "\.get(\|\.set(\|\.delete(" --include="*.ts" --include="*.tsx" | grep -v node_modules | head -20

# Count CACHE constants using Map
grep -r "CACHE" --include="*.ts" --include="*.tsx" | grep "Map" | wc -l
```

**Accept when:**
- Map-based cache instances are found in service classes for transient state management
- Cache access patterns use get(), set(), and delete() methods consistently
- Cache instances are encapsulated within service boundaries (private members or module scope)
- Cache keys are strongly typed via TypeScript generics or type annotations
- No persistent data is stored exclusively in Map-based caches without durable backup
- Cache invalidation logic is explicitly implemented and documented

<enforcement>
Claude Code MUST NOT skip or defer verification. All cache implementations MUST satisfy R-CACHE-001 through R-CACHE-007 before acceptance. Violations require code review feedback and refactoring to comply with Map-based caching patterns for transient state.
</enforcement>