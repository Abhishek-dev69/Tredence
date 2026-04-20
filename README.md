# HR Workflow Designer

A browser-based frontend prototype for designing, validating, and simulating internal HR workflows such as onboarding, leave approval, and document verification.

This project was built as a case-study style submission for the Tredence Full Stack Engineering Intern assignment. The focus is on clean frontend architecture, strong TypeScript typing, modular workflow logic, and a review-friendly user experience.

## Project Overview

The application lets an HR admin:

- assemble workflows visually on a React Flow canvas
- configure each workflow step through a live inspector panel
- validate structural workflow rules before simulation
- run a mock end-to-end simulation against a local API layer
- export, import, and restore workflow drafts for easier review

The main UI is organized into four areas:

- left sidebar: workflow block palette and validation summary
- center canvas: workflow graph design surface
- right panel: node configuration inspector
- bottom section: simulation lab with serialized graph and execution log

## Tech Stack

- `Vite`
- `React`
- `TypeScript`
- `Tailwind CSS`
- `@xyflow/react`
- `Zustand`
- `Vitest`

## Scope Covered

This implementation covers the core case-study requirements from the PDF:

- React application using `Vite + React + TypeScript`
- workflow canvas built with `React Flow`
- five custom node types:
  - Start
  - Task
  - Approval
  - Automated Step
  - End
- live node editing forms for each node type
- local mock API abstraction for `GET /automations` and `POST /simulate`
- workflow validation and simulation sandbox
- preloaded sample onboarding workflow
- README with architecture decisions, assumptions, and run instructions

It also includes a few lightweight bonus features that help reviewers test the app more easily:

- JSON export
- JSON import
- local draft autosave and restore
- MiniMap and zoom controls
- node-level validation badges
- automated tests for validation and serialization logic

## Key Features

### 1. Workflow Canvas

- drag nodes from the left palette onto the canvas
- connect nodes using React Flow edges
- pan, zoom, fit view, and inspect a minimap
- select nodes to edit them in the right-side inspector
- delete selected nodes with keyboard or action button
- remove edges with edge double-click
- prevent obvious invalid connections such as:
  - connecting into Start
  - connecting out of End
  - self-referencing edges
  - duplicate source-target edges

### 2. Node Configuration Panel

Each node type has a dedicated, controlled form:

- Start Node
  - `startTitle`
  - optional metadata key/value pairs
- Task Node
  - `title`
  - `description`
  - `assignee`
  - `dueDate`
  - optional custom fields
- Approval Node
  - `title`
  - `approverRole`
  - `autoApproveThreshold`
- Automated Step Node
  - `title`
  - `actionId`
  - `actionParams` rendered dynamically from mock automation metadata
- End Node
  - `endMessage`
  - `summaryFlag`

Forms update node state live through the central Zustand store.

### 3. Validation

The workflow validator checks:

- exactly one Start node exists
- at least one End node exists
- Start has no incoming edges
- End has no outgoing edges
- disconnected nodes are flagged
- non-start nodes must be reachable from Start
- at least one Start-to-End path must exist
- self-loops are rejected
- cycles are rejected
- key required node fields are present

Validation feedback appears in:

- the left validation summary
- node-level issue badges on the canvas
- the simulation lab when a run is blocked

### 4. Mock API Layer

The app uses a typed local API abstraction instead of inline fake data calls.

Implemented mock endpoints:

- `GET /automations`
- `POST /simulate`

The simulation layer is intentionally lightweight and deterministic. It is designed to demonstrate workflow reasoning and API integration, not to behave like a complete BPMN engine.

### 5. Simulation Lab

The bottom simulation section shows:

- the serialized workflow graph
- loading, success, and error states
- readable validation blockers
- step-by-step execution results returned by the mock simulation API

This makes the workflow easier to inspect during review and mirrors the “test/sandbox panel” requested in the brief.

## Architecture Decisions

### 1. Centralized workflow store with Zustand

The Zustand store owns:

- nodes and edges
- node selection state
- validation results
- automation catalog
- simulation results
- sandbox UI state
- draft metadata

This keeps workflow behavior centralized and avoids prop drilling across the app shell.

### 2. Strongly typed workflow domain model

Each node uses a discriminated union for its `data` shape. This makes it easier to:

- render type-specific nodes
- render type-specific forms
- validate required fields safely
- serialize and deserialize workflow data
- extend the system with new node types later

### 3. Separation of concerns

The codebase separates:

- UI components
- workflow store/state
- workflow types
- validation logic
- serialization logic
- mock API client
- mock API implementations

This keeps React components focused on presentation and interaction, while domain logic stays in feature modules.

### 4. Reviewer-friendly extras

To make the assignment easier to demo and evaluate, the project includes:

- a preloaded sample workflow
- local autosave and draft restore
- JSON import/export
- a persistent bottom simulation lab
- automated tests for the highest-signal workflow logic

These are intentionally lightweight additions that improve usability without over-engineering the assignment.

## Folder Structure

```text
src/
  app/
    App.tsx
  components/
    canvas/
    common/
    forms/
    layout/
    nodes/
    sandbox/
    sidebar/
  features/
    workflow/
      hooks/
      serializers/
      store/
      types/
      utils/
      validation/
  lib/
  services/
    api/
    mocks/
  styles/
```

## Folder Responsibilities

- `src/app`
  - application bootstrap and provider composition
- `src/components/canvas`
  - React Flow integration and canvas-specific UI
- `src/components/forms`
  - node inspector and reusable form helpers
- `src/components/nodes`
  - custom React Flow node UIs
- `src/components/sandbox`
  - simulation lab UI
- `src/components/sidebar`
  - node palette and validation summary
- `src/features/workflow/store`
  - Zustand store and workflow actions
- `src/features/workflow/types`
  - core domain and API typing
- `src/features/workflow/validation`
  - graph validation rules
- `src/features/workflow/serializers`
  - workflow import/export helpers
- `src/features/workflow/hooks`
  - startup and persistence hooks
- `src/services/api`
  - API boundary used by the UI
- `src/services/mocks`
  - local mock data and simulated API responses

## Data Model Summary

Important types include:

- `WorkflowNodeType`
- `StartNodeData`
- `TaskNodeData`
- `ApprovalNodeData`
- `AutomationNodeData`
- `EndNodeData`
- `WorkflowNode`
- `WorkflowEdge`
- `AutomationAction`
- `SerializedWorkflowGraph`
- `SimulateWorkflowRequest`
- `SimulateWorkflowResponse`
- `ValidationIssue`
- `ValidationResult`

React Flow provides the graph primitives, while the node `data` remains strongly typed by workflow node kind.

## How the App Works

### App startup

On load, the app:

1. fetches available automation actions from the mock API
2. hydrates any saved workflow draft from local storage
3. renders the sample or restored workflow into the canvas

### Editing flow

1. a user drags or adds a node
2. the store updates graph state
3. validation runs automatically
4. selecting a node opens its type-specific form
5. form edits write directly back into the typed node state

### Simulation flow

1. the current graph is validated
2. if invalid, readable issues are shown
3. if valid, the graph is serialized
4. the serialized graph is sent to the local mock `POST /simulate`
5. the returned execution steps are shown in the simulation lab

## Sample Workflow

The app preloads a sample onboarding flow so the reviewer immediately sees a working scenario:

`Start -> Task(Collect Documents) -> Approval(Manager Approval) -> Automated Step(Send Welcome Email) -> End`

The sample graph is defined in `src/features/workflow/utils/nodeFactory.ts`.

## How to Run Locally

### Prerequisites

- Node.js 18+
- npm 9+

### Install and run

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

### Run tests

```bash
npm test
```

## Testing

The repository includes focused automated tests for:

- workflow validation rules
- workflow serialization and import/deserialization

These tests are intended to verify the most important graph behaviors for the assignment without introducing unnecessary test complexity.

## Main Tradeoffs

- The simulation engine models a simple linear execution path, not a full workflow rules engine.
- The validator focuses on structural correctness and required field presence, not advanced business-policy validation.
- The node set intentionally avoids deeper branching/gateway behavior because the assignment did not require decision nodes.
- JSON import/export is lightweight and pragmatic rather than a versioned schema system.

## Assumptions

- only one Start node should exist at a time
- the workflow should remain acyclic
- an Automated Step is not simulation-ready until an action is selected
- no backend persistence or authentication is required
- clean architecture and working functionality matter more than pixel-perfect styling

## What Was Completed vs. What Could Be Added Later

### Completed

- modular workflow editor
- custom React Flow nodes
- dynamic node forms
- typed mock API layer
- structural workflow validation
- simulation lab
- sample workflow
- JSON import/export
- draft autosave/restore
- tests for core workflow logic

### With more time

- undo/redo history
- auto-layout support
- richer branching simulation
- accessibility improvements for keyboard-only editing
- stronger connect-time constraint messaging
- CI workflow with automated build and test checks

## Screenshots

Suggested screenshots for submission:

- designer overview
- node configuration panel
- simulation lab

If screenshots are added later, place them under:

- `docs/screenshots/designer-overview.png`
- `docs/screenshots/node-config-panel.png`
- `docs/screenshots/simulation-lab.png`

## Submission Notes

This repository is intentionally frontend-only and uses local mocks in place of a backend. That matches the case-study brief, which explicitly does not require authentication or backend persistence.

The implementation prioritizes:

- architectural clarity
- typed workflow state
- reviewable code organization
- working end-to-end functionality
- a polished but practical UI

## Final Status

This project is ready to run with:

```bash
npm install
npm run dev
```

It also passes:

- `npm test`
- `npm run build`
