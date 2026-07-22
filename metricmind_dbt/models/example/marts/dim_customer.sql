--Unique Columns From Customer 

select distinct
    customer_id,
    customer_name,
    segment
from {{ ref('int_superstore_enriched') }}