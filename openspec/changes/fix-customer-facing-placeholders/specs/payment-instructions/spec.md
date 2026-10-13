# Spec Delta

## Purpose

Defines where the business tells customers to send money, so that every payment destination shown during checkout is a real, operator-controlled account rather than placeholder data.

## ADDED Requirements

### Requirement: Payment instructions come from a single configurable source
The system SHALL obtain the payment destinations shown during checkout (bank accounts, e-wallets, and any other accepted method) from one configuration source that operators control, not from values written into component code.

#### Scenario: Operator changes a bank account number
- **WHEN** an operator updates the configured destination for a payment method
- **THEN** the checkout payment step shows the updated destination without a code change

#### Scenario: Multiple methods are configured
- **WHEN** the customer selects a payment method that has one or more configured destinations
- **THEN** the system shows the destinations configured for exactly that method

#### Scenario: Method has no configured destination
- **WHEN** the customer selects a payment method for which no destination is configured
- **THEN** the system does not present that method as selectable and does not display an empty or invented account

### Requirement: Placeholder payment destinations are never presented to customers
The system SHALL not render example, dummy, or randomly generated account numbers, phone numbers, or account holder names in any customer-facing payment instruction.

#### Scenario: Default checkout environment
- **WHEN** a customer reaches the payment step of the order flow
- **THEN** every displayed destination matches an operator-configured value, and no value originating from placeholder content appears

#### Scenario: Configured value is absent in a deployed environment
- **WHEN** the payment destination configuration is missing or empty in a deployed environment
- **THEN** the system fails the checkout step visibly with an operational error instead of displaying fallback account details
