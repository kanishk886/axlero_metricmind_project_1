select
    row_id,
    order_id,
    order_date,
    ship_date,
    customer_id,
    product_id,

    city,
    state,
    country,
    region,
    market,

    sales,
    profit,
    estimated_cost,
    shipping_cost,
    quantity,
    discount,
    profit_margin_percentage

from {{ ref('int_superstore_enriched') }}