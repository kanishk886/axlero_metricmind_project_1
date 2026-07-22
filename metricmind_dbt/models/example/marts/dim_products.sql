select distinct
    product_id,
    product_name,
    category,
    sub_category
from {{ ref('int_superstore_enriched') }}