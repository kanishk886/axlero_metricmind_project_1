import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from config import SemanticQuery
from query_planner import apply_query_rules, plan_query


def test_total_revenue_alias_is_supported() -> None:
    query = plan_query("Show total revenue by region.")

    assert query.measure == "total_sales"
    assert query.dimensions == ["region"]
    assert query.filters == []


def test_malformed_dimension_assignment_is_normalized() -> None:
    bad_query = SemanticQuery(
        measure="total_sales",
        dimensions=["region='Europe'"],
        filters=[],
        order=None,
        limit=100,
    )

    fixed_query = apply_query_rules("Show sales in Europe", bad_query)

    assert fixed_query.dimensions == []
    assert fixed_query.filters[0].member == "region"
    assert fixed_query.filters[0].values == ["Europe"]


def test_top_5_regions_by_profit_is_normalized() -> None:
    query = plan_query("show top 5 regions by profit")

    assert query.measure == "total_profit"
    assert query.dimensions == ["region"]
    assert query.order == "desc"
    assert query.limit == 5
    assert query.filters == []
