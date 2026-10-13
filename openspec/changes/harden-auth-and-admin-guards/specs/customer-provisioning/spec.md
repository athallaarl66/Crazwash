# Spec Delta

## Purpose

Defines what happens to customer identity when an order is placed, so that the public ordering flow can record who ordered without creating sign-in-capable accounts or altering accounts it does not own.

## ADDED Requirements

### Requirement: Checkout links customers without altering their privilege
The system SHALL associate an order with an existing customer record without changing that record's role or elevating its privileges.

#### Scenario: Existing administrator places an order as a customer
- **WHEN** an order is placed using contact details that match an account holding administrative privileges
- **THEN** the order is associated with that account when contact details match, and the account's stored role is unchanged

#### Scenario: Repeat order from the same contact details
- **WHEN** the same contact details place a second order
- **THEN** the existing customer record is reused and no duplicate account is created for the same contact details

### Requirement: Checkout-created customer records are not sign-in capable
A customer record created as part of checkout SHALL NOT share a credential with any other record, and SHALL NOT be usable for sign-in until the business explicitly sets a credential for it.

#### Scenario: New customer record after checkout
- **WHEN** checkout creates a customer record because no matching account exists
- **THEN** the new record has no reusable credential shared with other records and credential sign-in for it fails

#### Scenario: Two customers order on the same day
- **WHEN** two different customers each place an order that creates a customer record
- **THEN** neither record can authenticate with a credential derived from the other

### Requirement: Checkout does not invent customer contact details
The system SHALL NOT store generated placeholder contact values, such as fabricated email addresses, on customer records or orders.

#### Scenario: Customer provides no email address
- **WHEN** a customer completes checkout without providing an email address
- **THEN** the stored contact data contains no generated substitute email address
