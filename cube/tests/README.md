# MetricMind Semantic Layer

This folder contains the manually defined Cube semantic model for the
MetricMind Agentic Semantic BI Engine.

## Data Source

The semantic model uses the dbt mart:

`METRICMIND_DB.PUBLIC.FCT_SALES`

## Governed Measures

- Total Sales
- Total Profit
- Estimated Cost
- Total Shipping Cost
- Total Quantity
- Average Discount
- Distinct Order Count
- Distinct Customer Count
- Profit Margin Percentage

## Dimensions

- Order Date
- Ship Date
- Customer
- Product
- City
- State
- Country
- Region
- Market
- Category
- Sub-Category

## Important Rule

The AI agent must use only approved semantic-layer measures and dimensions.
It must not generate or execute raw SQL against Snowflake.

## Current Status

The semantic model is defined manually. A Cube runtime will be connected
later for live API execution and validation.