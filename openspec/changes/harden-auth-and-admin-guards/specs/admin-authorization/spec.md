# Spec Delta

## Purpose

Defines who may reach administrative resources, so that administrative data and operations are available only to accounts the business has actually designated as administrators.

## ADDED Requirements

### Requirement: Authorization uses the account's stored role
The system SHALL derive a session's administrative authority from the role stored on the authenticated account record, and SHALL NOT assign or assume any role that is not present in storage.

#### Scenario: Customer account signs in
- **WHEN** an account whose stored role is not administrator authenticates successfully
- **THEN** the resulting session identifies that account's stored role and is refused by administrative resources

#### Scenario: Administrator account signs in
- **WHEN** an account whose stored role is administrator authenticates successfully
- **THEN** the resulting session is accepted by administrative resources

#### Scenario: Stored role changes while a session exists
- **WHEN** an account's stored role is changed after a session was issued
- **THEN** authorization decisions use the stored role rather than any value cached from sign-in time

### Requirement: Administrative request handlers reject non-administrators
Every administrative request handler SHALL verify the caller's session and role before reading or mutating data, and SHALL reject unauthenticated callers and callers whose stored role is not administrator.

#### Scenario: Unauthenticated dashboard request
- **WHEN** an unauthenticated client requests administrative dashboard data
- **THEN** the system responds with an authorization error and returns no business data

#### Scenario: Non-administrator order mutation request
- **WHEN** an authenticated non-administrator requests a change to an order's payment or status state
- **THEN** the system responds with an authorization error and the order remains unchanged

#### Scenario: Administrative action invoked directly
- **WHEN** an administrative state-changing action is invoked without an administrator session
- **THEN** the action performs no mutation and reports failure to the caller
