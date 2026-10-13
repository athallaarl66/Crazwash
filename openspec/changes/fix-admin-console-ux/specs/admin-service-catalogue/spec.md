# Spec Delta

## Purpose

Defines how a service's processing duration is expressed, so that the number an operator enters, the number an operator reads back, and the time a customer is promised all mean the same thing.

## ADDED Requirements

### Requirement: Service duration uses one declared unit
The system SHALL store and present a service's duration in a single unit, and SHALL state that unit wherever the value is entered or displayed.

#### Scenario: Operator enters a duration
- **WHEN** an operator creates or edits a service
- **THEN** the input states the unit that will be stored, and the submitted value is interpreted in that unit

#### Scenario: Operator reads a duration in the console
- **WHEN** a duration is displayed in the service list or on the service detail page
- **THEN** it is shown with the same unit used at input

#### Scenario: Customer reads a duration
- **WHEN** a duration is displayed in the customer-facing catalogue
- **THEN** it is shown with the same unit used at input

### Requirement: Duration input is validated against its unit
The system SHALL reject duration values outside the range the declared unit supports and SHALL report the rejection to the operator.

#### Scenario: Value out of range
- **WHEN** an operator submits a duration outside the accepted range for the declared unit
- **THEN** the service is not created or updated and the operator sees a message naming the accepted range

#### Scenario: Missing duration
- **WHEN** an operator submits a service without a duration
- **THEN** the service is not created or updated and the operator sees which field is required
