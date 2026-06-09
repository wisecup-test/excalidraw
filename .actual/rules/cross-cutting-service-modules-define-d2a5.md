# Establish Typed Public API Contracts with Explicit Export Boundaries: Service Modules Define

These rules are ALWAYS ACTIVE for all TypeScript service modules, shared libraries, and architectural components that provide functionality to other modules or external consumers.

### Rules

- **R-API-001** MUST: All service modules MUST define explicit public API contracts using TypeScript type exports that represent the complete external interface.
- **R-API-002** MUST: Public API contracts MUST be defined in dedicated type files or at the top of module entry points using clear naming conventions (e.g., `<ServiceName>API`, `<Domain>Contract`).
- **R-API-003** MUST: Use TypeScript's `export type` for pure type exports and `export` for runtime values, making the distinction clear in code.
- **R-API-004** SHOULD: Leverage TypeScript utility types (Pick, Omit, Readonly) to derive public contracts from internal types while hiding implementation details.
- **R-API-005** SHOULD: Document API contracts with JSDoc comments explaining purpose, usage examples, and any important constraints or invariants.
- **R-API-006** SHOULD: Consider using barrel exports (index.ts) to create a single entry point that explicitly controls what is exposed from a module.
- **R-API-007** MUST: Internal implementation details (cache layers, private methods, data access patterns) MUST NOT be exposed through public exports.

### Verify

```bash
# Count exported types, interfaces, and classes across service modules
grep -r "export type\|export interface\|export class" packages/*/src/*.ts excalidraw-app/**/*.ts | wc -l

# Verify TypeScript compilation with strict mode
tsc --noEmit --strict && echo 'Type checking passed'

# Check for proper API contract definitions
grep -r "export type\|export interface" packages/*/src/index.ts excalidraw-app/**/index.ts | head -20
```

**Accept when:**
- All service modules contain at least one exported type, interface, or class representing their public API contract
- TypeScript compilation succeeds with strict mode enabled, confirming all type contracts are internally consistent
- Code review confirms that internal implementation details (cache layers, private methods) are not exposed through public exports
- No implementation-specific types (private classes, internal utilities) are exported from module entry points

<enforcement>
Claude Code MUST NOT skip or defer verification. TypeScript strict mode compilation MUST pass in CI. Code review MUST confirm proper API boundary definition before merge.
</enforcement>