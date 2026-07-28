from typing import Any, Literal

from pydantic import BaseModel, Field


class SemanticFilter(BaseModel):
    member: str

    operator: Literal[
        "equals",
        "not_equals",
        "contains",
        "gt",
        "gte",
        "lt",
        "lte",
    ]

    values: list[Any]


class SemanticQuery(BaseModel):
    measure: str = Field(
        description="One approved semantic measure"
    )

    dimensions: list[str] = Field(
        default_factory=list,
        description="Approved dimensions used for grouping",
    )

    filters: list[SemanticFilter] = Field(
        default_factory=list,
        description="Filters requested by the user",
    )

    time_dimension: str | None = Field(
        default=None,
        description="Time dimension such as order_date",
    )

    time_granularity: Literal[
        "day",
        "week",
        "month",
        "quarter",
        "year",
    ] | None = None

    order: Literal["asc", "desc"] | None = None

    limit: int = Field(
        default=100,
        ge=1,
        le=1000,
    )