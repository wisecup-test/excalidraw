# Adopt In-Memory Map-Based Caching for Service State Management: Cache Implementations Provide

These rules are ALWAYS ACTIVE for all service classes, utility modules, and components that implement in-memory caching for transient state, computed values, session data, and collaboration state.

### Rules

- **R-CACHE-001** SHOULD: Cache implementations SHOULD provide explicit invalidation methods (delete, clear) for lifecycle management.
- **R-CACHE-002** MUST: Encapsulate Map instances as private class members or module-scoped constants.
- **R-CACHE-003** SHOULD: Use optional chaining for cache lookups to handle missing keys gracefully.
- **R-CACHE-004** SHOULD: Implement explicit cleanup methods for caches tied to component lifecycle.
- **R-CACHE-005** MAY: Consider using WeakMap for caches keyed by objects to enable automatic garbage collection.
- **R-CACHE-006** MUST: Document cache purpose, key types, value types, and invalidation strategy in code comments.
- **R-CACHE-007** MUST: Use separate storage mechanisms like IndexedDB for caches requiring persistence rather than extending Map-based caches.
- **R-CACHE-008** MUST: Use TypeScript generics to enforce key and value types in cache implementations.

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
- No persistent data is stored exclusively in Map-based caches without durable backup
- Cache implementations include explicit invalidation methods (delete, clear)
- TypeScript generics enforce cache key and value type safety
- Code comments document cache purpose, key types, values types, and invalidation strategy

<enforcement>
Clause Code MUST NOT skip or defer verification. All cache implementations MUST be reviewed for compliance with R-CACHE-001 through R-CACHE-008 before merge.
</enforcement>