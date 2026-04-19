# HR Workflow Designer

A browser-based frontend prototype for visually designing and testing internal HR workflows such as onboarding, leave approval, and document verification.

This project is intentionally built as a frontend-only case-study style app with:

- `Vite + React + TypeScript`
- `@xyflow/react` for the workflow canvas
- `Tailwind CSS` for styling
- `Zustand` for graph and UI state
- a local typed mock API layer for automation metadata and workflow simulation

## Project Overview

The app gives an HR admin three core surfaces:

- a left node palette for adding workflow steps
- a central React Flow canvas for connecting and arranging nodes
- a right configuration panel for editing the selected node

It also includes a bottom sandbox drawer that validates and simulates the current workflow using a local mock API.

## What’s Completed

- 3-panel workflow designer layout
- draggable palette for creating nodes on the canvas
- custom node types:
  - Start
  - Task
  - Approval
  - Automated Step
  - End
- typed node configuration forms with live updates
- dynamic automation parameter rendering from mock API metadata
- core canvas interactions:
  - drag/drop
  - connect edges
  - select nodes
  - delete nodes
  - delete edges with keyboard or edge double-click
  - pan/zoom
  - fit view
  - MiniMap and Controls
- workflow validation with readable issue reporting
- mock simulation flow with loading, success, and error states
- preloaded sample onboarding workflow
- JSON export for reviewer convenience

## Architecture Decisions

### 1. Zustand for workflow state

Zustand keeps the graph state, selected node, validation result, automation catalog, and sandbox simulation state in one explicit store. This keeps React Flow controlled while avoiding prop drilling across the layout.

### 2. Discriminated union for node data

Each node type has its own strongly typed data interface. This makes rendering, form updates, serialization, and validation predictable and easy to review.

### 3. Separate domain logic from UI

The project separates:

- workflow types
- graph state/store
- validation engine
- serialization
- mock API behavior
- UI components

That helps keep the React components fairly lean and prevents business logic from drifting into the canvas layer.

### 4. Mock API layer instead of inline fake calls

Even though there is no backend, the app uses a proper `services/api` and `services/mocks` split so the transport boundary is clear. That makes it easy to replace mocks with real endpoints later.

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

### Folder Notes

- `components/nodes`: custom React Flow node UIs
- `components/forms`: dynamic node editing panel and reusable key/value editor
- `features/workflow/store`: Zustand store and app-level workflow actions
- `features/workflow/validation`: centralized workflow validation rules
- `features/workflow/serializers`: graph serialization for export and simulation
- `services/mocks`: local mock API responses and simulation behavior

## Data Model Summary

Key TypeScript types include:

- `WorkflowNodeType`
- `StartNodeData`
- `TaskNodeData`
- `ApprovalNodeData`
- `AutomationNodeData`
- `EndNodeData`
- `AutomationAction`
- `SimulateWorkflowRequest`
- `SimulateWorkflowResponse`
- `ValidationIssue`
- `ValidationResult`

The graph uses React Flow node/edge primitives, but the node `data` is kept strongly typed by workflow node kind.

## Validation Rules

The validator currently checks:

- exactly one Start node
- Start node has no incoming edges
- End node has no outgoing edges
- non-start nodes are reachable from Start
- isolated/disconnected nodes are flagged
- self-loops are rejected
- simple cycles are detected
- at least one path exists from Start to End
- required node-level data for key fields

Validation results are shown in the left panel and reflected visually on nodes.

## Simulation Strategy

When the user runs a simulation:

1. the current graph is serialized
2. validation runs first
3. if invalid, the sandbox drawer shows readable errors
4. if valid, the app calls the local mock `POST /simulate`
5. the response returns a step-by-step execution log

The simulation is intentionally simple and deterministic for demo/review purposes.

## How to Run Locally

### Prerequisites

- Node.js 18+ recommended
- npm 9+ recommended

### Commands

```bash
npm install
npm run dev
```

To create a production build:

```bash
npm run build
```

## Sample Workflow

The app preloads this example so the reviewer immediately sees a meaningful flow:

`Start -> Task(Collect Documents) -> Approval(Manager Approval) -> Automated Step(Send Email) -> End`

You can also clear the canvas and build from scratch.

## Main Tradeoffs

- The simulation engine is intentionally lightweight. It is designed to show workflow execution flow, not to model a full BPMN-style rules engine.
- Validation focuses on structural correctness and a few important field requirements. It does not attempt full business-rule validation.
- Branching logic is not deeply modeled because the requested node set does not include decision/gateway nodes.
- Import is not implemented; export is included as a quick bonus because it adds review value with low complexity.

## What I’d Add With More Time

- import from JSON
- undo/redo history
- better edge validation constraints during connect-time
- auto-layout helpers
- richer simulation branching behavior
- persistent local storage
- unit tests for validation and serialization
- accessibility pass for keyboard-only workflow editing

## Assumptions Made

- only one Start node should exist at any time
- Automated Step requires selecting one mock action before the workflow is simulation-ready
- a simple acyclic graph is sufficient for this prototype
- no backend persistence or authentication is required
- demo polish matters, but architectural clarity is the higher priority

## Screenshots

Add screenshots here if needed for submission:

- `docs/screenshots/designer-overview.png`
- `docs/screenshots/node-config-panel.png`
- `docs/screenshots/simulation-drawer.png`

## Review Notes

This project is structured to be easy to review quickly:

- workflow logic is centralized
- node-specific UI is isolated by type
- form updates are live and typed
- mock services are separate from the React components
- validation and simulation are readable without hunting through the app shell
