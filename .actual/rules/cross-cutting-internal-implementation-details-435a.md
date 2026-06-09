# Establish Typed Public API Contracts with Explicit Export Boundaries: Internal Implementation Details

These rules are ALWAYS ACTIVE for all TypeScript modules that provide functionality to other modules or external consumers, including service classes, shared libraries, common packages, event bus implementations, file managers, collaboration services, and other architectural components.

### Rules

- **R-API-001** MUST: Internal implementation details (cache layers, private methods, data access patterns) MUST be encapsulated and not exposed through public API contracts.
- **R-API-002** MUST: All service modules that cross module boundaries MUST contain at least one exported type, interface, or class representing their public API contract.
- **R-API-003** SHOULD: Use TypeScript's 'export type' for pure type exports and 'export' for runtime values, making the distinction clear in code.
- **R-API-004** SHOULD: Define public API contracts in dedicated type files or at the top of module entry points, using clear naming conventions (e.g., <ServiceName>API, <Domain>Contract).
- **R-API-005** SHOULD: Leverage TypeScript utility types (Pick, Omit, Readonly) to derive public contracts from internal types while hiding implementation details.
- **R-API-006** SHOULD: Document API contracts with JSDoc comments explaining purpose, usage examples, and any important constraints or invariants.
- **R-API-007** SHOULD: Consider using barrel exports (index.ts) to create a single entry point that explicitly controls what is exposed from a module.
- **R-API-008** MAY: Legacy modules undergoing migration may temporarily expose broader interfaces during refactoring (EX-001).
- **R-API-009** MAY: Performance-critical paths may expose lower-level APIs when abstraction overhead is measurable and significant (EX-002).

### Verify

```bash
# Count exported types, interfaces, and classes
grep -r "export type\|export interface\|export class" packages/*/src/*.ts excalidraw-app/**/*.ts | wc -l

# Verify TypeScript strict mode compilation
tsc --noEmit --strict && echo 'Type checking passed'

# Check for public API contract definitions
grep -r "export type\|export interface" packages/*/src/*.ts excalidraw-app/**/*.ts | head -20
```

**Accept when:**
- All service modules contain at least one exported type, interface, or class representing their public API contract
- TypeScript compilation succeeds with strict mode enabled, confirming all type contracts are internally consistent
- Code review confirms that internal implementation details (cache layers, private methods) are not exposed through public exports
- Modules exposing public APIs do not exceed 10 public types without architectural review justification

<enforcement>
Claude Code MUST NOT skip or defer verification. TypeScript strict mode compilation MUST pass in CI. Code review MUST confirm proper API boundary definition before merge. Architectural review is required for modules that expose more than 10 public types.
</enforcement>