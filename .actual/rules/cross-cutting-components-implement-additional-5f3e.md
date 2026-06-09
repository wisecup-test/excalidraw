# Adopt Map-Based Cache Layer for Event Bus and Collaboration State Management: Components Implement Additional

These rules are ALWAYS ACTIVE for all event bus, collaboration portal, and integration components that implement caching mechanisms for real-time collaboration state management.

### Rules

- **R-CACHE-001** MAY: Components MAY implement additional cache structures for file metadata, collaborator state, or other integration-specific data using the same Map-based pattern.

### Verify

```bash
# Verify Map-based cache structures are used for emitters and payload storage
grep -r 'this\.[a-zA-Z]*\.get(' packages/common/src/ excalidraw-app/collab/ --include='*.ts' --include='*.tsx' | grep -E '(emitters|lastPayload|broadcastedElementVersions|addedFiles)\.get'

# Verify Map-based cache structures are updated with .set() operations
grep -r 'this\.[a-zA-Z]*\.set(' packages/common/src/ excalidraw-app/collab/ --include='*.ts' --include='*.tsx' | grep -E '(emitters|lastPayload|broadcastedElementVersions|addedFiles)\.set'

# Verify Map data structures are declared with 'new Map' syntax
grep -r 'new Map<' packages/common/src/ excalidraw-app/collab/ --include='*.ts' --include='*.tsx'
```

**Accept when:**
- Event bus implementations contain Map-based cache structures for emitters and last payload storage with corresponding .get() and .set() operations
- Collaboration portal components cache broadcasted element versions using Map structures and check cache before broadcasting updates
- All integration components use Map data structures (not plain objects) for cache layer implementation as verified by 'new Map' declarations
- Cache entries are initialized in component constructors using Map constructor syntax
- Cache cleanup logic uses .delete() method to prevent memory leaks on element deletion or user disconnection

<enforcement>
Claude Code MUST NOT skip or defer verification. All new event bus and collaboration integration components MUST use Map-based cache structures. Code review MUST block merges that use plain objects instead of Map structures for caching without architectural justification.
</enforcement>