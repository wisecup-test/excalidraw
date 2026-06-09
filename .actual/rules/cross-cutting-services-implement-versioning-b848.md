# Adopt In-Memory Map-Based Caching for Service State Management: Services Implement Versioning

These rules are ALWAYS ACTIVE for all service classes and modules implementing in-memory caching for transient state, computed values, session data, and collaboration state management.

### Rules

- **R-CACHE-001** MUST: Encapsulate Map instances as private class members or module-scoped constants to maintain clear service boundaries.
- **R-CACHE-002** MUST: Use Map objects for in-memory caching of transient state, computed values, and session data instead of plain objects or external datastores.
- **R-CACHE-003** MUST: Implement explicit cache invalidation logic on data mutations and document cache lifecycle and invalidation triggers for each cache instance.
- **R-CACHE-004** SHOULD: Use TypeScript generics to enforce key and value types for cache instances to prevent type mismatches and key collisions.
- **R-CACHE-005** SHOULD: Implement cache wrapper classes with type-safe interfaces rather than exposing raw Map instances.
- **R-CACHE-006** SHOULD: Use optional chaining for cache lookups to handle missing keys gracefully (e.g., `DARK_MODE_COLORS_CACHE?.get(color)`).
- **R-CACHE-007** SHOULD: Consider using WeakMap for caches keyed by objects to enable automatic garbage collection when keys are no longer referenced.
- **R-CACHE-008** SHOULD: Implement monitoring for cache sizes and add eviction policies or TTL mechanisms for caches showing unbounded growth patterns.
- **R-CACHE-009** SHOULD: Document cache purpose, key types, value types, and invalidation strategy in code comments for each cache instance.
- **R-CACHE-010** MAY: Services MAY implement versioning or timestamps in cached values to support staleness detection.
- **R-CACHE-011** MAY: Implement explicit cleanup methods for caches tied to component lifecycle (e.g., `this.savingFiles.delete(fileId)` in FileManager).

### Verify

```bash
# Count Map-based cache instances in service files
grep -r "new Map<" --include="*.ts" --include="*.tsx" | wc -l

# Verify cache access patterns use get(), set(), delete() methods
grep -r "\.get(\|\.set(\|\.delete(" --include="*.ts" --include="*.tsx" | grep -v node_modules | head -20

# Count CACHE constants using Map
grep -r "CACHE" --include="*.ts" --include="*.tsx" | grep "Map" | wc -l

# Verify Map instances are private or module-scoped
grep -r "private.*Map<\|const.*Map<" --include="*.ts" --include="*.tsx" | wc -l

# Check for TypeScript generic type annotations on Map instances
grep -r "Map<.*,.*>" --include="*.ts" --include="*.tsx" | wc -l
```

**Accept when:**
- Map-based cache instances are found in service classes for transient state management
- Cache access patterns use get(), set(), and delete() methods consistently
- Cache instances are encapsulated within service boundaries (private members or module scope)
- No persistent data is stored exclusively in Map-based caches without durable backup
- TypeScript generics are used to enforce cache key and value types
- Cache invalidation logic is explicitly implemented and documented
- Caches are not used for data requiring ACID guarantees, cross-process access, or persistence across restarts

<enforcement>
Claude Code MUST NOT skip or defer verification. All cache implementations MUST be reviewed against R-CACHE-001 through R-CACHE-011. Violations require code review feedback and architecture review for alternative caching mechanisms. Exception requests must include justification, evidence of Map limitations, and trade-off analysis.
</enforcement>