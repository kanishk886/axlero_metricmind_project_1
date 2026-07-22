select distinct
    city,
    state,
    country,
    region,
    market
from {{ ref('int_superstore_enriched') }}