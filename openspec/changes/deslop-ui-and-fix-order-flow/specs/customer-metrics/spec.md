# Spec Delta

## Purpose

Aggregates customer lifetime activity across all active orders and computes consistent status classifications without contradictory date fallbacks.

## ADDED Requirements

### Requirement: Active customer order inclusion
Customer order summaries SHALL include all non-cancelled orders when computing order count, spending, and most recent order activity.

#### Scenario: Customer has in-progress orders
- **WHEN** customer has orders in PENDING, CONFIRMED, or IN_PROGRESS status
- **THEN** customer summary includes those orders in total order count and derives last order date from them

### Requirement: Coherent customer activity status
The customer summary SHALL not display a current timestamp alongside a DORMANT status when no orders exist.

#### Scenario: Customer with zero orders
- **WHEN** customer record has no associated orders
- **THEN** lastOrderDate remains null or empty, and status reflects the absence of activity without contradictory current-day timestamps
