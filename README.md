# Paraswap Rewards Automation Research

## Project Overview

This research project aims to validate the architectural decisions for the ParaSwap Rewards Automation. The project includes several Proof of Concepts (POCs) that test specific components of the system.

## POCs

### 1. **paraswap-augustus-subgraph**

Queries swap orders filled from a subgraph to:

- Validate querying events over a specific time period.
- Assess the number of orders returned.

#### Key Features:

- Uses the ParaSwap Augustus Subgraph.
- Focuses on optimizing query efficiency and data accuracy.

### 2. **paraswap-event-processor**

Similar to `paraswap-augustus-subgraph`, but queries contract events directly using chain block numbers. This POC evaluates:

- The feasibility of bypassing subgraphs for event data.
- The accuracy and performance of contract-level event queries.

#### Key Features:

- Interacts directly with the blockchain.
- Processes events using specific block ranges.

### 3. **paraswap-snapshot-proposal-creator**

A script to create a proposal in Snapshot including a transfer funds transaction for execution upon proposal approval through the oSnap framework.

#### Key Features:

- Automates proposal creation.
- Ensures compatibility with the oSnap framework for governance.

## Setup Instructions

### Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### Install Dependencies:

```bash
npm install
```

### Configure Environment Variables

Create a .env file with the necessary configuration parameters (use .env.example files as reference).

### Run POCs

- paraswap-augustus-subgraph

```bash
npm run paraswap-subgraph
```

- paraswap-event-processor

```bash
npm run paraswap-event-processor
```

- paraswap-snapshot-proposal-creator

```bash
npm run paraswap-create-snapshot-proposal
```
