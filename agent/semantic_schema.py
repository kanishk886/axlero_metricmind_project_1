APPROVED_MEASURES = {
    "total_sales": "Total revenue generated from sales",
    "total_profit": "Total profit earned",
    "estimated_cost": "Estimated cost calculated as sales minus profit",
    "total_shipping_cost": "Total shipping cost",
    "total_quantity": "Total quantity sold",
    "average_discount": "Average discount applied",
    "order_count": "Distinct number of orders",
    "customer_count": "Distinct number of customers",
    "profit_margin_percentage": "Profit as a percentage of sales",
}


APPROVED_DIMENSIONS = {
    "order_date": "Date on which an order was placed",
    "region": "Sales region",
    "market": "Sales market",
    "country": "Customer country",
    "state": "Customer state",
    "city": "Customer city",
    "category": "Product category",
    "sub_category": "Product sub-category",
    "customer_id": "Unique customer identifier",
    "customer_name": "Customer name",
    "product_id": "Unique product identifier",
    "product_name": "Product name",
}


APPROVED_TIME_GRANULARITIES = {
    "day",
    "week",
    "month",
    "quarter",
    "year",
}


APPROVED_FILTER_OPERATORS = {
    "equals",
    "not_equals",
    "contains",
    "gt",
    "gte",
    "lt",
    "lte",
}