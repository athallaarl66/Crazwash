# Spec Delta

## Purpose

Defines where the public price list comes from, so what a customer is quoted on the landing page matches what the ordering flow charges.

## ADDED Requirements

### Requirement: Public prices derive from the product catalogue
The system SHALL render public price information from the same product records that the services page and the order flow use, and SHALL not maintain a separate hardcoded copy of names or prices in page code.

#### Scenario: Admin edits a price
- **WHEN** an operator changes the price of a service in the admin console
- **THEN** the public landing price list shows the updated price on the next request

#### Scenario: Admin adds a service
- **WHEN** an operator creates a new active service
- **THEN** the public landing price list includes that service without a code change

#### Scenario: Service is deactivated or deleted
- **WHEN** a service is inactive or has been deleted
- **THEN** the public landing price list does not present it as an orderable item
