# Adopt Map-Based Cache Layer for Event Bus and Collaboration State Management: Cache Layer Implementations

These rules are ALWAYS ACTIVE for all event bus implementations, collaboration portal components, and integration layer files that manage real-time collaboration state, event caching, and element version tracking.

### Rules

- **R-CACHE-001** SHOULD: Cache layer implementations SHOULD use Map data structures for key-value storage to ensure O(1) lookup performance on frequently accessed entries.

### Verify

```bash
# Verify Map-based cache structures are used for emitters and payload storage
grep -r 'this\.[a-zA-Z]*\.get(' packages/common/src/ excalidraw-app/collab/ --include='*.ts' --include='*.tsx' | grep -E '(emitters|lastPayload|broadcastedElementVersions|addedFiles)\.get'

# Verify Map.set() operations are used for cache updates
grep -r 'this\.[a-zA-Z]*\.set(' packages/common/src/ excalidraw-app/collab/ --include='*.ts' --include='*.tsx' | grep -E '(emitters|lastPayload|broadcastedElementVersions|addedFiles)\.set'

# Verify Map data structures are initialized
grep -r 'new Map<' packages/common/src/ excalidraw-app/collab/ --include='*.ts' --include='*.tsx'
```

**Accept when:**
- Event bus implementations contain Map-based cache structures for emitters and last payload storage with corresponding .get() and .set() operations
- Collaboration portal components cache broadcasted element versions using Map structures and check cache before broadcasting updates
- All integration components use Map data structures (not plain objects) for cache layer implementation as verified by 'new Map' declarations
- Cache entries are initialized in component constructors using `new Map()` syntax
- Cache lookups use `.get()` method before performing expensive operations
- Cache updates use `.set()` method immediately after successful state changes
- Cleanup logic uses `.delete()` method to prevent memory leaks on element deletion or user disconnection

<enforcement>
Claude Code MUST NOT skip or defer verification. All new event bus and collaboration integration components MUST use Map-based cache structures. Code review MUST block merges that use plain objects instead of Map structures for caching without architectural justification. CI pipeline MUST fail if integration components deviate from this pattern.
</enforcement>