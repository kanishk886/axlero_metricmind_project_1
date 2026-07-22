with source_data as (

    select *
    from {{ source('global_superstore_source', 'GLOBAL_SUPERSTORE') }}

),

cleaned_data as (

    select
        "Row.ID" as row_id,
        "Order.ID" as order_id,
        cast("Order.Date" as date) as order_date,
        cast("Ship.Date" as date) as ship_date,

        trim("Ship.Mode") as ship_mode,
        trim("Customer.ID") as customer_id,
        trim("Customer.Name") as customer_name,
        trim("SEGMENT") as segment,

        trim("CITY") as city,
        trim("STATE") as state,
        trim("COUNTRY") as country,
        trim("REGION") as region,
        trim("MARKET") as market,

        trim("Product.ID") as product_id,
        trim("CATEGORY") as category,
        trim("Sub.Category") as sub_category,
        trim("Product.Name") as product_name,

        cast("SALES" as number(18,2)) as sales,
        cast("QUANTITY" as integer) as quantity,
        cast("DISCOUNT" as number(10,4)) as discount,
        cast("PROFIT" as number(18,2)) as profit,
        cast("Shipping.Cost" as number(18,2)) as shipping_cost

    from source_data

)

select *
from cleaned_data