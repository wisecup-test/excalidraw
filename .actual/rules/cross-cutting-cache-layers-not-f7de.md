# Adopt In-Memory Map-Based Caching for Service State Management: Cache Layers Not

These rules are ALWAYS ACTIVE for all TypeScript and TypeScript React files implementing service state management, caching layers, and transient data storage within service boundaries.

### Rules

- **R-CACHE-001** MUST NOT: Cache layers MUST NOT be used for persistent data that requires durability guarantees across application restarts.
- **R-CACHE-002** MUST: Encapsulate Map instances as private class members or module-scoped constants (e.g., `private broadcastedElementVersions = new Map<string, number>()`).
- **R-CACHE-003** SHOULD: Use optional chaining for cache lookups to handle missing keys gracefully (e.g., `DARK_MODE_COLORS_CACHE?.get(color)`).
- **R-CACHE-004** SHOULD: Implement explicit cleanup methods for caches tied to component lifecycle (e.g., `this.savingFiles.delete(fileId)` in FileManager).
- **R-CACHE-005** SHOULD: Consider using WeakMap for caches keyed by objects to enable automatic garbage collection when keys are no longer referenced.
- **R-CACHE-006** MUST: Document cache purpose, key types, value types, and invalidation strategy in code comments for each cache instance.
- **R-CACHE-007** SHOULD: For caches requiring persistence, use separate storage mechanisms like IndexedDB rather than extending Map-based caches.
- **R-CACHE-008** MUST: Implement explicit cache invalidation on data mutations and document cache lifecycle and invalidation triggers for each cache instance.
- **R-CACHE-009** SHOULD: Use TypeScript generics to enforce key and value types in cache implementations.
- **R-CACHE-010** SHOULD: Implement monitoring for cache sizes and add eviction policies or TTL mechanisms for caches showing growth patterns.

### Verify

```bash
# Count Map-based cache instances in the codebase
grep -r "new Map<" --include="*.ts" --include="*.tsx" | wc -l

# Verify cache access patterns use get(), set(), and delete() methods
grep -r "\.get(\|\.set(\|\.delete(" --include="*.ts" --include="*.tsx" | grep -v node_modules | head -20

# Count CACHE constants using Map
grep -r "CACHE" --include="*.ts" --include="*.tsx" | grep "Map" | wc -l
```

**Accept when:**
- Map-based cache instances are found in service classes for transient state management
- Cache access patterns use get(), set(), and delete() methods consistently
- Cache instances are encapsulated within service boundaries (private members or module scope)
- No persistent data is stored exclusively in Map-based caches without durable backup
- Cache invalidation logic is explicitly implemented and documented
- TypeScript type safety is enforced for cache keys and values

<enforcement>
Claude Code MUST NOT skip or defer verification. All cache implementations MUST be reviewed against R-CACHE-001 through R-CACHE-010. Violations of R-CACHE-001 (persistent data in Map caches) are blocking. Other rules are subject to code review feedback and architecture team approval for exceptions.
</enforcement>