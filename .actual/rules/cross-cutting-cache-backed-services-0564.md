# Adopt Cache-Backed Service Boundary Pattern with Get/Set/Delete Operations: Cache Backed Services

These rules are ALWAYS ACTIVE for all service boundary implementations that manage stateful data, including cache layers for external system integrations (Firebase, socket.io, IndexedDB), color palette services, file management services, collaboration state services, local data persistence services, lock management services, and event bus implementations.

### Rules

- **R-CBS-001** SHOULD: Cache-backed services SHOULD expose public contracts through TypeScript interfaces or type definitions to ensure type safety at boundaries.

### Verify

```bash
# Verify Map-based cache usage across service boundaries
grep -r 'Map<.*>\.get\|Map<.*>\.set\|Map<.*>\.delete' --include='*.ts' --include='*.tsx' packages/ excalidraw-app/ | wc -l

# Identify specific cache implementations
grep -r 'CACHE.*\.get\|CACHE.*\.set' --include='*.ts' --include='*.tsx' packages/ excalidraw-app/

# Run tests for cache-backed services
npm test -- --testPathPattern='(FileManager|Portal|Collab|LocalData)' --coverage
```

**Accept when:**
- All service boundaries that manage stateful data use Map-based cache structures with get/set/delete operations
- Grep commands identify consistent usage of Map cache operations across service boundary files
- Unit tests verify cache hit/miss scenarios and proper invalidation for all cache-backed services
- Code review confirms that new service boundaries follow the cache-backed pattern or document exceptions
- Service boundaries expose public contracts through TypeScript interfaces or type definitions

<enforcement>
Claude Code MUST NOT skip or defer verification. All service boundary implementations must be reviewed for compliance with cache-backed patterns and type-safe contracts before approval.
</enforcement>