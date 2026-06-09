# Adopt Cache-Backed Service Boundary Pattern with Get/Set/Delete Operations: Service Boundaries Not

These rules are ALWAYS ACTIVE for all service boundary implementations that manage stateful data, including cache layers for external system integrations (Firebase, socket.io, IndexedDB), color palette services, file management services, collaboration state services, local data persistence services, lock management services, and event bus implementations.

### Rules

- **R-CACHE-001** MUST_NOT: Service boundaries MUST NOT bypass cache layers when accessing frequently-used data that has been cached.

### Verify

```bash
# Verify Map-based cache usage across service boundaries
grep -r 'Map<.*>\.get\|Map<.*>\.set\|Map<.*>\.delete' --include='*.ts' --include='*.tsx' packages/ excalidraw-app/ | wc -l

# Identify cache operations in service implementations
grep -r 'CACHE.*\.get\|CACHE.*\.set' --include='*.ts' --include='*.tsx' packages/ excalidraw-app/

# Run tests for cache-backed services
npm test -- --testPathPattern='(FileManager|Portal|Collab|LocalData)' --coverage
```

**Accept when:**
- All service boundaries that manage stateful data use Map-based cache structures with get/set/delete operations
- Grep commands identify consistent usage of Map cache operations across service boundary files
- Unit tests verify cache hit/miss scenarios and proper invalidation for all cache-backed services
- Code review confirms that new service boundaries follow the cache-backed pattern or document exceptions
- Cache invalidation rules are documented in code comments for services interacting with external systems
- Cache lifecycle (get/set/delete) is fully implemented even if delete is not immediately needed

<enforcement>
Claude Code MUST NOT skip or defer verification of cache-backed service boundary patterns. All service boundaries managing stateful data MUST use Map-based caching with get/set/delete operations unless an approved exception (EXC-001 or EXC-002) is documented. Code review MUST block merges that violate this pattern without documented exceptions.
</enforcement>