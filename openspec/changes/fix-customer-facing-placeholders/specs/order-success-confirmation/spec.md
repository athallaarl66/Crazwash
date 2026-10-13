# Spec Delta

## Purpose

Defines what the post-checkout confirmation shows, so the confirmation reflects a real stored order rather than data supplied by the browser.

## ADDED Requirements

### Requirement: Order confirmation resolves the order on the server
The system SHALL resolve the order being confirmed from stored order data on the server using the order identifier produced at checkout, and SHALL render the confirmation from that stored record.

#### Scenario: Customer arrives after a successful order
- **WHEN** the confirmation view is requested with the identifier of an order that exists
- **THEN** the view shows the stored order number, stored total, and stored payment method

#### Scenario: Confirmation is re-requested later
- **WHEN** the confirmation view for an existing order is opened again, directly or after a refresh
- **THEN** the view shows the same stored values as the first time

### Requirement: Confirmation is not derived from client-supplied display values
The system SHALL not treat customer name, total, payment method, or order number passed in the request URL as authoritative for what the confirmation displays.

#### Scenario: Request parameters are altered
- **WHEN** the confirmation view is requested with an identifier of an order that does not exist
- **THEN** the view reports that the order could not be found and does not display a success state
