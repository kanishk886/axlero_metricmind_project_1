Welcome to your new dbt project!

### Using the starter project

Try running the following commands:
- dbt run
- dbt test


### Resources:
- Learn more about dbt [in the docs](https://docs.getdbt.com/docs/introduction)
- Check out [Discourse](https://discourse.getdbt.com/) for commonly asked questions and answers
- Join the [chat](https://community.getdbt.com/) on Slack for live discussions and support
- Find [dbt events](https://events.getdbt.com) near you
- Check out [the blog](https://blog.getdbt.com/) for the latest news on dbt's development and best practices
# axlero_metricmind_project_1
# MetricMind – Agentic Semantic BI Engine

## Overview

MetricMind is an AI-powered Conversational Business Intelligence (BI) platform that enables users to interact with enterprise data using natural language. Instead of directly generating SQL queries, the system leverages a Semantic Layer to provide governed, accurate, and consistent business metrics.

The project follows a modern enterprise analytics architecture by integrating a Data Warehouse, Semantic Layer, Large Language Model (LLM), and an interactive dashboard for real-time business insights.

---

## Problem Statement

Traditional Text-to-SQL systems often generate incorrect SQL queries, inconsistent business metrics, and unreliable analytical results.

MetricMind addresses this challenge by introducing a Semantic Layer that defines standardized business metrics, ensuring consistent and trustworthy analytics across the organization.

---

## Objectives

- Build an enterprise-grade Conversational BI platform.
- Implement a governed Semantic Layer using Cube.dev.
- Enable natural language business queries through LangChain and Llama 3.
- Ensure consistent business metrics without SQL hallucinations.
- Visualize insights using interactive dashboards.

---

## Dataset

**Dataset Used:** Global Superstore Dataset

The dataset contains information related to:

- Orders
- Customers
- Products
- Categories
- Sales
- Profit
- Discount
- Shipping Cost
- Country
- Region
- Market
- Order Date

---

## Technology Stack

### Programming Language
- Python
- SQL

### Data Warehouse
- Snowflake

### Data Modeling
- dbt

### Semantic Layer
- Cube.dev

### AI Framework
- LangChain

### Large Language Model
- Llama 3

### Frontend
- Next.js
- Tremor

### Visualization
- Apache ECharts

### Data Format
- JSON
- YAML

---

## Project Architecture

Global Superstore Dataset
        ↓
Snowflake Data Warehouse
        ↓
dbt Data Modeling
        ↓
Cube.dev Semantic Layer
        ↓
LangChain + Llama 3
        ↓
Next.js + Tremor
        ↓
Apache ECharts Dashboard

---

## Features

- Conversational Business Intelligence
- Natural Language Query Processing
- Semantic Layer Governance
- AI-powered Business Insights
- Dynamic Dashboard
- Interactive Visualizations
- View SQL
- View API Calls
- Multi-step Reasoning
- Query Governance
- Hallucination-Free Analytics

---

## Project Structure

```text
MetricMind/
│
├── data/
├── snowflake/
├── dbt/
├── cube/
├── langchain/
├── api/
├── frontend/
├── visualizations/
├── tests/
├── docs/
├── assets/
├── requirements.txt
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
```

### Install Python Dependencies

```bash
pip install -r requirements.txt
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Configure Environment Variables

Create a `.env` file and add your Snowflake and LLM credentials.

---

## Workflow

1. Import Global Superstore Dataset into Snowflake.
2. Transform data using dbt.
3. Define business metrics in Cube.dev.
4. Connect LangChain with Llama 3.
5. Convert user queries into Semantic Layer API requests.
6. Retrieve governed business metrics.
7. Display AI-generated insights and visualizations.

---

## Sample Queries

- Show me European Sales.
- Compare APAC and US revenue.
- Which category generated the highest profit?
- What are the top 10 customers by sales?
- Show quarterly sales trends.
- Why did profits decrease last quarter?
- Compare Technology and Furniture performance.

---
