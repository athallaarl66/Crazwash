# Spec Delta

## Purpose

Defines how the console reports aggregate figures next to a list, so an operator reading summary numbers is reading the business, not the current page.

## ADDED Requirements

### Requirement: Summary figures describe the whole filtered result set
The system SHALL compute the summary figures shown with an order list over the entire result set the active filters produce, not over the rows of the page currently displayed.

#### Scenario: Operator moves to a later page
- **WHEN** an operator views page two of an order list
- **THEN** the summary figures are identical to those shown on page one for the same filters

#### Scenario: Operator applies a filter
- **WHEN** an operator filters the list by payment state or order status
- **THEN** the summary figures describe exactly the orders matching that filter

#### Scenario: No orders match
- **WHEN** the active filters match no orders
- **THEN** the summary figures show zero rather than a value derived from an empty page

### Requirement: Summary labels match what they count
The system SHALL label each summary figure so that the label states the population it covers, and SHALL not present a per-page count under a total-sounding label.

#### Scenario: Reading the summary row
- **WHEN** an operator reads the summary figures above an order list
- **THEN** each figure is presented as covering the filtered result set, and the count of rows currently displayed is not presented as a total
