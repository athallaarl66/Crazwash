# Spec Delta

## Purpose

Defines where console navigation controls lead and what an operator sees when an action or a session fails, so that no control in the console is a dead end.

## ADDED Requirements

### Requirement: Every navigation control resolves to an implemented destination
The system SHALL route every console navigation control to a destination the application implements, and SHALL NOT present a control that leads to a non-existent route.

#### Scenario: Operator uses the header search
- **WHEN** an operator submits a search from the console header
- **THEN** the operator arrives at a page that performs and displays that search

#### Scenario: Destination is not implemented
- **WHEN** a console control has no implemented destination
- **THEN** the control is removed rather than left pointing at a missing route

#### Scenario: Sidebar navigation
- **WHEN** an operator selects an item in the console navigation
- **THEN** the destination page loads and marks that item as active

### Requirement: Expired sessions return the operator to sign-in
The system SHALL send an operator whose session is missing or expired to the sign-in page, and SHALL NOT navigate to an API endpoint in place of a page.

#### Scenario: Session expires while using the console
- **WHEN** a console request is refused because the session is missing or expired
- **THEN** the operator is taken to the sign-in page and can authenticate again

#### Scenario: Refused request on an API-backed console page
- **WHEN** a console page's data request is refused
- **THEN** the page informs the operator that the session expired and offers the sign-in destination
