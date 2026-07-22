select distinct
    order_date,
    order_year,
    order_month,
    order_quarter
from {{ ref('int_superstore_enriched') }}