# Establish Typed Public API Contracts with Explicit Export Boundaries: Service Boundaries Separate

These rules are ALWAYS ACTIVE for all TypeScript modules that provide functionality to other modules or external consumers, including service classes, shared libraries, common packages, event bus implementations, file managers, collaboration services, and other architectural components.

### Rules

- **R-API-001** SHOULD: Service boundaries SHOULD separate concerns by defining distinct contracts for different functional areas (e.g., ColorPalette for color operations, FileManager for file operations, AppEventBus for event handling).
- **R-API-002** MUST: All service modules MUST contain at least one exported type, interface, or class representing their public API contract.
- **R-API-003** SHOULD: Public API contracts SHOULD be defined in dedicated type files or at the top of module entry points using clear naming conventions (e.g., <ServiceName>API, <Domain>Contract).
- **R-API-004** SHOULD: Use TypeScript's 'export type' for pure type exports and 'export' for runtime values to make the distinction clear in code.
- **R-API-005** SHOULD: Leverage TypeScript utility types (Pick, Omit, Readonly) to derive public contracts from internal types while hiding implementation details.
- **R-API-006** SHOULD: Document API contracts with JSDoc comments explaining purpose, usage examples, and any important constraints or invariants.
- **R-API-007** SHOULD: Consider using barrel exports (index.ts) to create a single entry point that explicitly controls what is exposed from a module.
- **R-API-008** MUST: Internal implementation details (cache layers, private methods, data access patterns) MUST NOT be exposed through public exports.
- **R-API-009** MAY: Modules MAY expose lower-level APIs when abstraction overhead is measurable and significant in performance-critical paths (EX-002).
- **R-API-010** MAY: Legacy modules undergoing migration MAY temporarily expose broader interfaces during refactoring (EX-001).

### Verify

```bash
# Count exported types, interfaces, and classes
grep -r "export type\|export interface\|export class" packages/*/src/*.ts excalidraw-app/**/*.ts | wc -l

# Verify TypeScript compilation with strict mode
tsc --noEmit --strict && echo 'Type checking passed'

# Check for public API contract definitions
grep -r "api\.public\.contracts=" . | cut -d'=' -f2 | tr ',' '\n' | sort -u
```

**Accept when:**
- All service modules contain at least one exported type, interface, or class representing their public API contract
- TypeScript compilation succeeds with strict mode enabled, confirming all type contracts are internally consistent
- Code review confirms that internal implementation details (cache layers, private methods) are not exposed through public exports
- No modules expose more than 10 public types without architectural review justification

<enforcement>
Claude Code MUST NOT skip or defer verification. TypeScript strict mode compilation MUST pass in CI pipeline. Code review MUST confirm proper API boundary definition for new services. Pull requests MUST be blocked until verification passes.
</enforcement>