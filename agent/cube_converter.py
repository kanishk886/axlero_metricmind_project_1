from config import SemanticQuery


def semantic_to_cube(query: SemanticQuery) -> dict:
    """
    Convert SemanticQuery into Cube-compatible JSON.
    """

    cube_query = {
        "measures": [
            f"sales.{query.measure}"
        ]
    }

    # Dimensions
    if query.dimensions:
        cube_query["dimensions"] = [
            f"sales.{dimension}"
            for dimension in query.dimensions
        ]

    # Filters
    filters = query.filters or []

    if filters:
        cube_query["filters"] = [
            {
                "member": f"sales.{semantic_filter.member}",
                "operator": semantic_filter.operator,
                "values": semantic_filter.values,
            }
            for semantic_filter in filters
        ]

    # Time dimension
    if query.time_dimension:
        time_dimension = {
            "dimension": f"sales.{query.time_dimension}"
        }

        if query.time_granularity:
            time_dimension["granularity"] = (
                query.time_granularity
            )

        cube_query["timeDimensions"] = [
            time_dimension
        ]

    # Order
    if query.order:
        cube_query["order"] = {
            f"sales.{query.measure}": query.order
        }

    # Limit
    cube_query["limit"] = (
        query.limit
        if query.limit is not None
        else 100
    )

    return cube_query