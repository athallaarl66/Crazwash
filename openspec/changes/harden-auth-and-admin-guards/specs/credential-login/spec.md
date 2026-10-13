# Spec Delta

## Purpose

Defines the behaviour of credential sign-in, so that only accounts the business intends to be usable can obtain a session and the session carries trustworthy account facts.

## ADDED Requirements

### Requirement: Sign-in requires an active, existing account
The system SHALL authenticate credentials only against accounts that exist, are enabled, and have not been removed, and SHALL refuse sign-in for any account failing those conditions.

#### Scenario: Removed account attempts sign-in
- **WHEN** credentials are submitted for an account that has been marked as removed
- **THEN** authentication fails and no session is issued

#### Scenario: Disabled account attempts sign-in
- **WHEN** credentials are submitted for an existing account that is not enabled
- **THEN** authentication fails and no session is issued

#### Scenario: Wrong password
- **WHEN** a correct identifier is submitted with an incorrect password
- **THEN** authentication fails without revealing whether the account exists

### Requirement: Session carries stored account identity and role
The system SHALL populate the session with the authenticated account's identifier and stored role.

#### Scenario: Session contents after sign-in
- **WHEN** an account signs in successfully
- **THEN** the session's user identifier equals that account's stored identifier and the session's role equals that account's stored role
