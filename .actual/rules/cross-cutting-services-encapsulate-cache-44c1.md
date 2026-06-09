# Adopt In-Memory Map-Based Caching for Service State Management: Services Encapsulate Cache

These rules are ALWAYS ACTIVE for all service classes and modules implementing in-memory caching for transient state, computed values, session data, and collaboration state management.

### Rules

- **R-CACHE-001** SHOULD: Services SHOULD encapsulate cache instances as private class members or module-scoped variables to enforce service boundaries.
- **R-CACHE-002** SHOULD: Use Map objects for in-memory caching of transient state, computed values, and session data to achieve O(1) lookup performance.
- **R-CACHE-003** SHOULD: Implement explicit cache invalidation on data mutations and document cache lifecycle and invalidation triggers for each cache instance.
- **R-CACHE-004** SHOULD: Use TypeScript generics to enforce key and value types in cache implementations and implement cache wrapper classes with type-safe interfaces.
- **R-CACHE-005** SHOULD: Consider using WeakMap for caches keyed by objects to enable automatic garbage collection when keys are no longer referenced.
- **R-CACHE-006** SHOULD: Implement explicit cleanup methods for caches tied to component lifecycle (e.g., `this.savingFiles.delete(fileId)` in FileManager).
- **R-CACHE-007** SHOULD: Document cache purpose, key types, value types, and invalidation strategy in code comments for each cache instance.
- **R-CACHE-008** MUST NOT: Store persistent data requiring durability across application restarts exclusively in Map-based caches without durable backup mechanisms.
- **R-CACHE-009** MUST NOT: Use Map-based caching for data requiring ACID transaction guarantees or cross-process distributed access.
- **R-CACHE-010** MAY: Implement LRU cache with eviction policies or TTL mechanisms when memory profiling reveals unbounded cache growth or when caching large datasets with predictable access patterns.

### Verify

```bash
# Count Map-based cache instances in service files
grep -r "new Map<" --include="*.ts" --include="*.tsx" | wc -l

# Verify cache access patterns use get(), set(), delete() methods
grep -r "\.get(\|\.set(\|\.delete(" --include="*.ts" --include="*.tsx" | grep -v node_modules | head -20

# Count CACHE constants using Map
grep -r "CACHE" --include="*.ts" --include="*.tsx" | grep "Map" | wc -l

# Verify encapsulation: check for private cache members
grep -r "private.*Map<" --include="*.ts" --include="*.tsx" | wc -l

# Verify cache cleanup methods exist
grep -r "\.delete(" --include="*.ts" --include="*.tsx" | grep -E "(savingFiles|broadcastedElement|collaborator)" | head -10
```

**Accept when:**
- Map-based cache instances are found in service classes for transient state management
- Cache access patterns use get(), set(), and delete() methods consistently
- Cache instances are encapsulated within service boundaries (private members or module scope)
- No persistent data is stored exclusively in Map-based caches without durable backup
- Cache invalidation logic is explicitly implemented and documented
- TypeScript generics enforce cache key and value type safety
- Cleanup methods are implemented for caches tied to component lifecycle

<enforcement>
Claude Code MUST NOT skip or defer verification. All cache implementations MUST be reviewed against these rules during code review and static analysis. Violations require architecture review and documented exceptions.
</enforcement>