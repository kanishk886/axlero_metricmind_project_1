from config import SemanticQuery


TABLE_NAME = "METRICMIND_DB.PUBLIC.FCT_SALES"


MEASURE_SQL = {
    "total_sales": "SUM(SALES)",
    "total_profit": "SUM(PROFIT)",
    "total_quantity": "SUM(QUANTITY)",
    "average_sales": "AVG(SALES)",
    "estimated_cost": "SUM(SALES) - SUM(PROFIT)",
    "total_shipping_cost": 'SUM("Shipping.Cost")',
    "average_discount": "AVG(DISCOUNT)",
    "order_count": 'COUNT(DISTINCT "Order.ID")',
    "customer_count": 'COUNT(DISTINCT "Customer.ID")',
    "profit_margin_percentage": (
        "100.0 * SUM(PROFIT) / NULLIF(SUM(SALES), 0)"
    ),
}


DIMENSION_SQL = {
    "region": "REGION",
    "country": "COUNTRY",
    "market": "MARKET",
    "category": "CATEGORY",
    "sub_category": "SUB_CATEGORY",
    "segment": "SEGMENT",
    "ship_mode": '"Ship.Mode"',
    "order_date": '"Order.Date"',
    "state": "STATE",
    "city": "CITY",
    "customer_id": '"Customer.ID"',
    "customer_name": '"Customer.Name"',
    "product_id": '"Product.ID"',
    "product_name": '"Product.Name"',
}


SUPPORTED_OPERATORS = {
    "equals": "=",
    "not_equals": "!=",
    "contains": "LIKE",
    "greater_than": ">",
    "less_than": "<",
    "greater_than_or_equal": ">=",
    "less_than_or_equal": "<=",
}


OPERATOR_ALIASES = {
    "gt": "greater_than",
    "gte": "greater_than_or_equal",
    "lt": "less_than",
    "lte": "less_than_or_equal",
}


def build_sql(query: SemanticQuery) -> tuple[str, list]:
    """
    Convert a validated SemanticQuery into safe SQL.

    Returns:
        SQL query and parameter values.
    """

    if query.measure not in MEASURE_SQL:
        raise ValueError(
            f"Unsupported SQL measure: {query.measure}"
        )

    select_parts = []
    group_by_parts = []
    where_parts = []
    parameters = []

    # Add dimensions
    for dimension in query.dimensions:
        if dimension not in DIMENSION_SQL:
            raise ValueError(
                f"Unsupported SQL dimension: {dimension}"
            )

        column = DIMENSION_SQL[dimension]

        if (
            dimension == query.time_dimension
            and query.time_granularity is not None
        ):
            column = (
                f"DATE_TRUNC('{query.time_granularity.upper()}', "
                f"{column})"
            )

        select_parts.append(
            f"{column} AS {dimension}"
        )

        group_by_parts.append(column)

    # Add measure
    measure_expression = MEASURE_SQL[query.measure]

    select_parts.append(
        f"{measure_expression} AS {query.measure}"
    )

    # Add filters safely
    for semantic_filter in query.filters:
        member = semantic_filter.member
        operator = OPERATOR_ALIASES.get(
            semantic_filter.operator,
            semantic_filter.operator,
        )
        values = semantic_filter.values

        if member not in DIMENSION_SQL:
            raise ValueError(
                f"Unsupported filter member: {member}"
            )

        if operator not in SUPPORTED_OPERATORS:
            raise ValueError(
                f"Unsupported filter operator: {operator}"
            )

        if not values:
            raise ValueError(
                f"No filter value supplied for {member}"
            )

        column = DIMENSION_SQL[member]
        sql_operator = SUPPORTED_OPERATORS[operator]

        if operator == "contains":
            where_parts.append(f"{column} LIKE %s")
            parameters.append(f"%{values[0]}%")
        elif operator == "equals" and len(values) > 1:
            placeholders = ", ".join(["%s"] * len(values))
            where_parts.append(f"{column} IN ({placeholders})")
            parameters.extend(values)
        elif operator == "not_equals" and len(values) > 1:
            placeholders = ", ".join(["%s"] * len(values))
            where_parts.append(f"{column} NOT IN ({placeholders})")
            parameters.extend(values)
        else:
            where_parts.append(
                f"{column} {sql_operator} %s"
            )
            parameters.append(values[0])

    sql = (
        f"SELECT {', '.join(select_parts)} "
        f"FROM {TABLE_NAME}"
    )

    if where_parts:
        sql += " WHERE " + " AND ".join(where_parts)

    if group_by_parts:
        sql += " GROUP BY " + ", ".join(group_by_parts)

    # Add ordering
    if query.order:
        direction = query.order.upper()

        if direction not in {"ASC", "DESC"}:
            raise ValueError(
                f"Unsupported order: {query.order}"
            )

        sql += (
            f" ORDER BY {query.measure} {direction}"
        )

    # Add limit
    limit = query.limit or 100
    limit = min(limit, 1000)

    sql += f" LIMIT {limit}"

    return sql, parameters