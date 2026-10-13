# Spec Delta

## Purpose

Defines the path-level protection of the administrative area, so that navigating to an administrative URL without a session cannot render administrative content.

## ADDED Requirements

### Requirement: Administrative paths require a session at the path level
The system SHALL guard every administrative path so that a request without an authenticated session is redirected to the sign-in page instead of rendering administrative content.

#### Scenario: Direct navigation without a session
- **WHEN** an unauthenticated client requests an administrative path
- **THEN** the response redirects to the sign-in page

#### Scenario: Direct navigation with a session
- **WHEN** an authenticated client requests an administrative path
- **THEN** the request proceeds to the administrative page

### Requirement: Path guard configuration matches the mechanism the framework executes
The system SHALL implement path-level protection using the file and export convention of the installed framework version, and its configuration SHALL cover exactly the paths the guard logic branches on.

#### Scenario: Guard file convention on the installed version
- **WHEN** the project's installed framework version deprecates or renames the guard entry point
- **THEN** protection is implemented with the convention that version executes, and the guard is proven active by observing a redirect on a protected path

#### Scenario: Guard branches and matcher agree
- **WHEN** the guard contains a branch for a path pattern
- **THEN** that pattern is included in the guard's matcher configuration, or the branch is removed
