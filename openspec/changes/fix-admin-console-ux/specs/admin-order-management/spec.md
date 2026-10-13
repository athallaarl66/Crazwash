# Spec Delta

## Purpose

Defines what an operator can see and change about an order while fulfilling it, so the console reflects the order's real state and supports the work of getting shoes back to the customer.

## ADDED Requirements

### Requirement: Every stored order status is visible and selectable
The system SHALL represent every order status the data model defines as its own value in the console, both when displaying an order's status and when offering the statuses an operator may move it to.

#### Scenario: Order is being worked on
- **WHEN** an order's stored status is the in-progress value
- **THEN** the console displays that value and does not display a different status in its place

#### Scenario: Order has been picked up
- **WHEN** an order's stored status is the picked-up value
- **THEN** the console displays that value and offers the transitions valid from it

#### Scenario: Operator moves an order through processing
- **WHEN** an operator selects a transition into a processing status
- **THEN** the stored status becomes that value and the console shows it afterwards

### Requirement: Order detail presents the fields needed to fulfil the order
The order detail view SHALL show, for the order being viewed, the pickup address, pickup date, customer phone number, payment method, customer notes, internal notes, payment-proof reference when present, and the recorded status history.

#### Scenario: Operator prepares a pickup
- **WHEN** an operator opens an order that has a scheduled pickup
- **THEN** the address and scheduled date are visible on that page without navigating elsewhere

#### Scenario: Operator contacts the customer
- **WHEN** an operator opens any order
- **THEN** the customer's phone number is visible on that page

#### Scenario: Order carries notes or history
- **WHEN** an order has customer notes, internal notes, or prior status entries
- **THEN** the detail view displays them

### Requirement: Status and payment changes report their outcome
The system SHALL report to the operator whether a status or payment change succeeded or failed, and SHALL reflect the stored state after a successful change without requiring a manual page reload.

#### Scenario: Change fails
- **WHEN** a status or payment change is rejected or errors
- **THEN** the operator sees a failure message naming the operation, and the displayed state still matches the stored state

#### Scenario: Change succeeds
- **WHEN** a status or payment change is applied successfully
- **THEN** the operator sees a confirmation and the list and detail views show the new stored value
