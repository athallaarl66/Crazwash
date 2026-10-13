# Spec Delta

## Purpose

Defines the contact destination customers are sent to after ordering, so payment proof reaches the business and the destination can be changed by an operator without editing code.

## ADDED Requirements

### Requirement: Customer-facing contact destination is configuration-driven
The system SHALL use a single operator-controlled configuration value as the contact destination (messaging/WhatsApp number) for customer-facing flows that hand an order off to the business.

#### Scenario: Customer sends payment proof after ordering
- **WHEN** the customer activates the send-payment-proof action on the order success view
- **THEN** the resulting conversation is addressed to the configured business contact

#### Scenario: Operator changes the contact number
- **WHEN** an operator updates the configured contact destination
- **THEN** subsequently rendered customer-facing links use the new destination without a code change

#### Scenario: Contact destination is absent in a deployed environment
- **WHEN** the contact destination configuration is missing or empty in a deployed environment
- **THEN** the system surfaces an operational error and does not produce a link to an unconfigured or example number
