# Spec Delta

## Purpose

Enables customers to select cleaning treatments, configure quantities cleanly, sanitize contact information, and submit pickup orders without AI template slop.

## ADDED Requirements

### Requirement: Segmented category navigation
The ordering interface SHALL present services grouped by category using text-based segmented controls without raw emoji characters.

#### Scenario: Customer selects service category
- **WHEN** customer views the order selection step
- **THEN** category tabs display textual names and item counts with standard vector styling and zero emoji glyphs

### Requirement: Compact service card presentation
Each service offering SHALL display clear pricing and duration without floating single-letter badges or overlapping floating indicator icons.

#### Scenario: Viewing service details
- **WHEN** customer browses services in a category
- **THEN** each card displays name, description, unit price, and duration with clean border highlights and no initial badges

### Requirement: Stable quantity adjustment
The quantity stepper SHALL use compact buttons and fixed-scale text without animated scale-bounce effects during increment and decrement.

#### Scenario: Adjusting service quantity
- **WHEN** customer taps plus or minus on a service
- **THEN** quantity updates immediately without resizing, scale-bouncing, or layout shifting

### Requirement: Mobile progress step layout
The progress step indicator SHALL maintain coherent alignment on mobile screens without misaligned horizontal divider bars.

#### Scenario: Viewing progress on mobile viewport
- **WHEN** customer navigates order steps on a small screen
- **THEN** progress displays step indicators without broken or misplaced horizontal rule dividers

### Requirement: Phone number input sanitization
The checkout form SHALL automatically strip leading zeroes when customers provide an Indonesian phone number with the +62 prefix.

#### Scenario: Customer enters number with leading zero
- **WHEN** customer enters a phone number starting with "08" into the prefixed input
- **THEN** system automatically normalizes the stored and transmitted number to start with "8"
