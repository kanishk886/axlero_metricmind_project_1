with source_data as (

    select *
    from {{ source('global_superstore_source', 'GLOBAL_SUPERSTORE') }}

)

select *
from source_data