with staging as (

    select *
    from {{ ref('stg_global_superstore') }}

)

select
    *,
    year(order_date) as order_year,
    month(order_date) as order_month,
    quarter(order_date) as order_quarter,

    sales - profit as estimated_cost,

    case
        when sales = 0 then 0
        else (profit / sales) * 100
    end as profit_margin_percentage

from staging