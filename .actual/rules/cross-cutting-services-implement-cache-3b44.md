# Adopt In-Memory Map-Based Caching for Service State Management: Services Implement Cache

These rules are ALWAYS ACTIVE for all service classes and modules implementing in-memory caching for transient state, computed values, session data, and collaboration state.

### Rules

- **R-CACHE-001** MUST: Services MUST implement cache access through get(), set(), and delete() operations on Map instances.
- **R-CACHE-002** MUST: Cache instances MUST be encapsulated as private class members or module-scoped constants.
- **R-CACHE-003** MUST: Cache instances MUST NOT be used for persistent data storage requiring durability across application restarts.
- **R-CACHE-004** SHOULD: Use TypeScript generics to enforce cache key and value types for type safety.
- **R-CACHE-005** SHOULD: Implement explicit cache invalidation on data mutations and document cache lifecycle for each instance.
- **R-CACHE-006** SHOULD: Consider using WeakMap for caches keyed by objects to enable automatic garbage collection.
- **R-CACHE-007** MAY: Implement monitoring for cache sizes and add eviction policies or TTL mechanisms when memory growth patterns are observed.

### Verify

```bash
# Count Map-based cache instances in service files
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
- TypeScript type checking confirms cache key and value type safety
- Cache invalidation logic is documented and tested

<enforcement>
Claude Code MUST NOT skip or defer verification. All new cache implementations MUST be reviewed for Map-based patterns, encapsulation, and proper type safety before acceptance.
</enforcement>