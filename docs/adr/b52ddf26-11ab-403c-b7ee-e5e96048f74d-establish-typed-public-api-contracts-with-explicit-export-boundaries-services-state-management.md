# Establish Typed Public API Contracts with Explicit Export Boundaries: Services State Management

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Context

- The codebase exhibits a consistent pattern of defining explicit public API contracts through TypeScript type exports across 11 files with 90.43% confidence
- Services expose well-defined interfaces (ColorTuple, ColorPaletteCustom, Key, KEYS, AppEventBus, Portal, FileManager, Locker, CollabAPI) that establish clear boundaries between internal implementation and external consumers
- Multiple modules demonstrate separation between service definitions (cache operations, event handling, file management) and their public-facing contracts
- The pattern appears in both core packages (@excalidraw/excalidraw, @excalidraw/common, @excalidraw/element) and application-level modules (excalidraw-app), indicating architectural consistency
- Evidence shows deliberate API surface management where internal operations (cache layers, data access patterns) are encapsulated behind typed interfaces

## Problem Statement

Without explicit public API contracts and clear service boundaries, codebases suffer from tight coupling, unclear dependencies, and difficulty in maintaining backward compatibility. Internal implementation details leak into consumer code, making refactoring risky and evolution of services difficult. The lack of typed boundaries prevents compile-time verification of API usage and increases the likelihood of runtime errors.

## Decision

1. SHOULD: Services with state management (caches, stores) SHOULD expose only the operational interface, not the underlying storage mechanism

## Policy Block

- SHOULD Services with state management (caches, stores) SHOULD expose only the operational interface, not the underlying storage mechanism

In scope:
- All TypeScript modules that provide functionality to other modules or external consumers
- Service classes and functions that manage state, coordinate operations, or provide domain logic
- Shared libraries and common packages intended for reuse across multiple consumers
- Event bus implementations, file managers, collaboration services, and other architectural components
- Type definitions for data structures that cross module boundaries

Out of scope:
- Pure internal utility functions with no external consumers
- Private implementation classes not exposed through module exports
- Test fixtures and mock implementations
- Build configuration and tooling scripts
- Temporary or experimental code not yet stabilized for public use

Exceptions:
- EX-001: Legacy modules undergoing migration may temporarily expose broader interfaces during refactoring
- EX-002: Performance-critical paths may expose lower-level APIs when abstraction overhead is measurable and significant

## Rationale

- The evidence shows 11 files consistently implementing this pattern with 90.43% confidence, demonstrating proven architectural value across the codebase
- Explicit API contracts enable compile-time verification of service usage, catching integration errors early in development rather than at runtime
- Clear boundaries between public contracts and internal implementation facilitate independent evolution of services without breaking consumers
- TypeScript's type system provides strong guarantees when contracts are properly defined, reducing the need for runtime validation and improving developer experience
- The pattern supports modular architecture by making dependencies explicit and preventing accidental coupling to implementation details

## Consequences

Positive:
- Improved maintainability through clear separation of concerns and explicit dependency contracts
- Enhanced type safety with compile-time verification of API usage across module boundaries
- Better developer experience with IDE autocomplete, inline documentation, and refactoring support
- Reduced coupling enabling independent service evolution and easier testing through interface mocking
- Clearer architectural boundaries making onboarding and code navigation more intuitive

Negative:
- Additional upfront effort required to design and document public API contracts
- Potential for over-abstraction if boundaries are drawn too finely, creating unnecessary indirection
- Breaking changes to public contracts require coordination across all consumers and careful versioning
- Learning curve for developers unfamiliar with strict boundary enforcement and TypeScript advanced types

## Alternatives

- Implicit API boundaries with no formal type contracts, relying on documentation and convention (rejected)
  Rejected because: Lacks compile-time verification, makes refactoring risky, and provides no enforcement mechanism for boundary violations. Evidence shows the codebase has moved away from this approach.
  When valid: Only appropriate for small, single-developer projects with minimal module interaction
- Runtime API validation using schema libraries (Zod, Yup) instead of TypeScript types (rejected)
  Rejected because: Adds runtime overhead, catches errors later in the development cycle, and doesn't provide IDE integration benefits. TypeScript types offer zero-cost abstraction.
  When valid: Useful as a complement for external API boundaries where data comes from untrusted sources
- Monolithic service design with shared internal state and no formal boundaries (rejected)
  Rejected because: Creates tight coupling, makes testing difficult, and prevents independent evolution of components. Evidence shows clear preference for bounded services.
  When valid: May be acceptable for very small applications with simple requirements and no growth expectations

## Risks

- API contracts may become stale if not updated when implementation changes, leading to type-reality mismatches
  Mitigation: Implement automated tests that verify runtime behavior matches type contracts. Use strict TypeScript compiler settings to catch inconsistencies.
  Owner: Engineering team
- Over-engineering boundaries in simple modules may create unnecessary complexity and maintenance burden
  Mitigation: Apply pattern judiciously based on module complexity and consumer count. Start simple and refine boundaries as usage patterns emerge.
  Owner: Architecture review team
- Breaking changes to established API contracts can cascade across many consumers, requiring coordinated updates
  Mitigation: Use semantic versioning, maintain backward compatibility where possible, provide deprecation warnings, and document migration paths clearly.
  Owner: Engineering team and release management

## Implementation Notes

- Start by identifying module boundaries: examine import/export patterns to understand current dependencies and consumer relationships
- Define public API contracts in dedicated type files or at the top of module entry points, using clear naming conventions (e.g., <ServiceName>API, <Domain>Contract)
- Use TypeScript's 'export type' for pure type exports and 'export' for runtime values, making the distinction clear in code
- Leverage TypeScript utility types (Pick, Omit, Readonly) to derive public contracts from internal types while hiding implementation details
- Document API contracts with JSDoc comments explaining purpose, usage examples, and any important constraints or invariants
- Consider using barrel exports (index.ts) to create a single entry point that explicitly controls what is exposed from a module

## Continuation Context


Verify commands:
- grep -r "export type\|export interface\|export class" packages/*/src/*.ts excalidraw-app/**/*.ts | wc -l
- tsc --noEmit --strict && echo 'Type checking passed'
- grep -r "api\.public\.contracts=" . | cut -d'=' -f2 | tr ',' '\n' | sort -u

Accept when:
- All service modules contain at least one exported type, interface, or class representing their public API contract
- TypeScript compilation succeeds with strict mode enabled, confirming all type contracts are internally consistent
- Code review confirms that internal implementation details (cache layers, private methods) are not exposed through public exports

## Enforcement

- Verified by: TypeScript compiler strict mode checks in CI pipeline
- Verified by: Code review checklist requiring explicit API contract definition for new services
- Verified by: Automated linting rules detecting exports of implementation-specific types
- Verified by: Architecture decision review for new module boundaries and service definitions
- Violation handling: CI build fails if TypeScript strict mode compilation errors occur
- Violation handling: Pull requests blocked until code review confirms proper API boundary definition
- Violation handling: Architectural review required for modules that expose more than 10 public types (potential over-exposure)
- Violation handling: Deprecation warnings and migration guides provided for any necessary breaking changes to established contracts
- Exception process: Submit exception request with technical justification to architecture review team
- Exception process: Provide evidence of why standard approach is not feasible (performance data, technical constraints)
- Exception process: Document the exception in code comments and architecture decision log
- Exception process: Set review date for re-evaluating exception (typically 6 months) to ensure it remains necessary