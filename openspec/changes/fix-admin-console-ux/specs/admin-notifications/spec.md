# Spec Delta

## Purpose

Defines what the operator notification bell may claim, so that an operator who is told about incoming orders is told about real ones and can rely on the indicator.

## ADDED Requirements

### Requirement: Advertised notification events produce notifications
The system SHALL create a notification for each event the console advertises to operators, and SHALL NOT present a notification area that no event can populate.

#### Scenario: Customer places an order
- **WHEN** a customer completes checkout and an order is created
- **THEN** an unread notification for that event exists for the operator who should act on it

#### Scenario: No event has occurred
- **WHEN** no notifiable event has occurred since the console was last cleared
- **THEN** the notification indicator shows no unread items

### Requirement: Notification state refreshes without operator action
The system SHALL surface notification changes to an open console session without requiring the operator to reload the page, and SHALL persist read state across sessions.

#### Scenario: Order arrives while the console is open
- **WHEN** an order is created while an operator has the console open
- **THEN** the unread indicator updates without a manual reload

#### Scenario: Operator marks an item read
- **WHEN** an operator marks a notification, or all notifications, as read
- **THEN** the change is stored and the indicator reflects it after a page reload

### Requirement: Notification removal is complete when the feature is dropped
If the console does not provide notifications, the system SHALL remove the notification indicator and the documentation that advertises it, so no surface claims a capability that does not exist.

#### Scenario: Feature dropped instead of implemented
- **WHEN** the project chooses not to implement notifications
- **THEN** the indicator is absent from the console and no documentation advertises notifications
