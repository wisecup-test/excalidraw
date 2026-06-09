# Adopt Map-Based Cache Layer for Event Bus and Collaboration State Management: Collaboration Portals Maintain

These rules are ALWAYS ACTIVE for all event bus implementations, collaboration portal components, and collaboration orchestration files that manage real-time state synchronization and element version tracking.

### Rules

- **R-COLLAB-001** MUST: Collaboration portals MUST maintain a cache of broadcasted element versions to prevent redundant transmissions (e.g., `this.broadcastedElementVersions.get(element.id)`, `this.broadcastedElementVersions.set(syncableElement.id, syncableElement.version)`).
- **R-COLLAB-002** MUST: Initialize Map-based cache structures in component constructors (e.g., `this.emitters = new Map()`, `this.lastPayload = new Map()`, `this.broadcastedElementVersions = new Map()`).
- **R-COLLAB-003** MUST: Always check cache existence with `.get()` before performing expensive operations like network broadcasts or event emissions to avoid redundant work.
- **R-COLLAB-004** MUST: Update cache entries atomically using `.set()` immediately after successful state changes to maintain consistency between cache and actual state.
- **R-COLLAB-005** MUST: Implement cleanup logic to remove cache entries when elements are deleted or users disconnect, using `.delete()` method to prevent memory leaks.
- **R-COLLAB-006** SHOULD: Consider implementing cache size monitoring and LRU eviction for long-running sessions to prevent unbounded memory growth.

### Verify

```bash
# Verify Map-based cache structures for emitters and last payload storage
grep -r 'this\.[a-zA-Z]*\.get(' packages/common/src/ excalidraw-app/collab/ --include='*.ts' --include='*.tsx' | grep -E '(emitters|lastPayload|broadcastedElementVersions|addedFiles)\.get'

# Verify cache update operations using .set()
grep -r 'this\.[a-zA-Z]*\.set(' packages/common/src/ excalidraw-app/collab/ --include='*.ts' --include='*.tsx' | grep -E '(emitters|lastPayload|broadcastedElementVersions|addedFiles)\.set'

# Verify Map declarations in integration layer
grep -r 'new Map<' packages/common/src/ excalidraw-app/collab/ --include='*.ts' --include='*.tsx'
```

**Accept when:**
- Event bus implementations contain Map-based cache structures for emitters and last payload storage with corresponding `.get()` and `.set()` operations
- Collaboration portal components cache broadcasted element versions using Map structures and check cache before broadcasting updates
- All integration components use Map data structures (not plain objects) for cache layer implementation as verified by `new Map` declarations
- Cache cleanup logic is present for element deletion and user disconnection scenarios

<enforcement>
Claude Code MUST NOT skip or defer verification. All new event bus and collaboration integration components MUST use Map-based cache structures. Code review MUST block merges that use plain objects instead of Map structures for caching without architectural justification. CI pipeline MUST fail if integration components deviate from this pattern.
</enforcement>