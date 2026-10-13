# Spec Delta

## Purpose

Defines abuse limits on the public sign-in and order-creation entry points, so that repeated automated attempts cannot exhaust the business's data or accounts.

## ADDED Requirements

### Requirement: Repeated failed sign-in attempts are limited
The system SHALL limit repeated failed sign-in attempts for the same account or client, and SHALL refuse further attempts for a period once the limit is reached.

#### Scenario: Limit reached on one account
- **WHEN** failed sign-in attempts for an account exceed the configured threshold within the configured window
- **THEN** subsequent attempts for that account are refused until the window expires, even if the correct credential is supplied

#### Scenario: Limit window expires
- **WHEN** the configured window has elapsed since the attempts that reached the limit
- **THEN** sign-in for that account is accepted again with the correct credential

### Requirement: Public order creation is rate limited per client
The system SHALL limit order creation from the same client within a configured window, and SHALL return a defined refusal response once the limit is reached.

#### Scenario: Client exceeds the order limit
- **WHEN** a client submits more order creations than the configured threshold within the window
- **THEN** further submissions are refused with a defined response and no order is created

#### Scenario: Legitimate customer submits one order
- **WHEN** a customer submits a single order
- **THEN** the order is created and the refusal path is not triggered

### Requirement: Limit accounting survives multiple instances
The system SHALL account for limit counters in storage shared by all deployed instances, so the limit holds regardless of which instance receives the request.

#### Scenario: Requests distributed across instances
- **WHEN** a client's requests are served by different application instances
- **THEN** the total counted attempts for that client equal the number of attempts made
