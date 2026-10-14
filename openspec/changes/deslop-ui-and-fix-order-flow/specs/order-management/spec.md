# Spec Delta

## Purpose

Provides administrative order status transitions that persistently record chronological status history, completion timestamps, and full inspection actions.

## ADDED Requirements

### Requirement: Persistent status history on transition
Every administrative status change SHALL append a new entry to the order status history array recording the status, timestamp, and optional notes.

#### Scenario: Operator changes order status
- **WHEN** operator updates an order status from the admin console
- **THEN** system appends an entry to statusHistory containing the target status, current ISO timestamp, and audit message

### Requirement: Completion timestamp recording
When an order transitions to COMPLETED, the system SHALL record the current timestamp into the completedDate field.

#### Scenario: Order marked as completed
- **WHEN** operator transitions an order to COMPLETED
- **THEN** completedDate is populated with the transition timestamp and saved to storage

### Requirement: Order detail interactive status actions
The order detail view at /admin/orders/[id] SHALL provide interactive controls to transition status and navigate back to the orders list.

#### Scenario: Operator manages order from detail view
- **WHEN** operator views an order detail page
- **THEN** page renders interactive status controls, payment status actions, and a back link to the order list
