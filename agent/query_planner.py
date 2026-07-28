import json

from langchain_ollama import ChatOllama

from config import SemanticFilter, SemanticQuery
from cube_converter import semantic_to_cube
from prompts import build_system_prompt
from semantic_schema import (
    APPROVED_DIMENSIONS,
    APPROVED_MEASURES,
)


MODEL_NAME = "llama3.2:3b"


def validate_semantic_query(query: SemanticQuery) -> None:
    """
    Validate that the generated semantic query uses only
    approved measures and dimensions.
    """

    if query.measure not in APPROVED_MEASURES:
        raise ValueError(
            f"Unsupported measure: {query.measure}"
        )

    for dimension in query.dimensions:
        if dimension not in APPROVED_DIMENSIONS:
            raise ValueError(
                f"Unsupported dimension: {dimension}"
            )

    if (
        query.time_dimension is not None
        and query.time_dimension not in APPROVED_DIMENSIONS
    ):
        raise ValueError(
            f"Unsupported time dimension: "
            f"{query.time_dimension}"
        )

    for semantic_filter in query.filters:
        if semantic_filter.member not in APPROVED_DIMENSIONS:
            raise ValueError(
                f"Unsupported filter member: "
                f"{semantic_filter.member}"
            )


def create_query_planner():
    """
    Connect LangChain with the local Ollama model
    and force structured SemanticQuery output.
    """

    model = ChatOllama(
        model=MODEL_NAME,
        temperature=0,
    )

    return model.with_structured_output(SemanticQuery)


def apply_query_rules(
    question: str,
    query: SemanticQuery,
) -> SemanticQuery:
    """
    Apply deterministic corrections after the LLM response.
    """

    normalized_question = question.lower().strip()

    simple_total_sales_questions = {
        "total sales",
        "show total sales",
        "what are the total sales",
        "what is total sales",
        "what is the total sales",
        "overall sales",
        "show sales by europe",
        "show overall sales",
        "show me total sales",
    }

    if normalized_question in simple_total_sales_questions:
        query.measure = "total_sales"
        query.dimensions = []
        query.filters = []
        query.time_dimension = None
        query.time_granularity = None
        query.order = None
        query.limit = 100

        return query

    clean_dimensions = []

    for dimension in query.dimensions:
        dimension = dimension.strip()

        if ":" in dimension:
            member, value = dimension.split(":", 1)

            member = member.strip().lower()
            value = value.strip()

            if member in APPROVED_DIMENSIONS:
                filter_exists = any(
                    semantic_filter.member == member
                    for semantic_filter in query.filters
                )

                if not filter_exists:
                    query.filters.append(
                        SemanticFilter(
                            member=member,
                            operator="equals",
                            values=[value],
                        )
                    )
            else:
                clean_dimensions.append(dimension)

        else:
            clean_dimensions.append(dimension)

    query.dimensions = clean_dimensions

    # Explicit Europe rule in case the model does not create
    # a correct region filter.
    if "europe" in normalized_question:
        query.dimensions = [
            dimension
            for dimension in query.dimensions
            if dimension != "europe"
            and not dimension.startswith("region:")
        ]

        region_filter_exists = any(
            semantic_filter.member == "region"
            for semantic_filter in query.filters
        )

        if not region_filter_exists:
            query.filters.append(
                SemanticFilter(
                    member="region",
                    operator="equals",
                    values=["Europe"],
                )
            )

    if query.limit is None:
        query.limit = 100

    return query


def plan_query(question: str) -> SemanticQuery:
    """
    Convert the user's natural-language question
    into a governed semantic query.
    """

    if not question.strip():
        raise ValueError("Question cannot be empty.")

    planner = create_query_planner()

    messages = [
        {
            "role": "system",
            "content": build_system_prompt(),
        },
        {
            "role": "user",
            "content": question,
        },
    ]

    result = planner.invoke(messages)

    if result is None:
        raise ValueError(
            "The model did not return a semantic query."
        )

    # First correct the LLM output.
    result = apply_query_rules(question, result)

    # Then validate the corrected result.
    validate_semantic_query(result)

    return result


def main() -> None:
    """
    Run the query planner from the terminal.
    """

    user_question = input("Ask MetricMind: ")

    try:
        semantic_query = plan_query(user_question)

        cube_query = semantic_to_cube(
            semantic_query
        )

        print("\nGenerated Semantic Query:\n")

        print(
            json.dumps(
                semantic_query.model_dump(),
                indent=2,
            )
        )

        print("\nConverted Cube Query:\n")

        print(
            json.dumps(
                cube_query,
                indent=2,
            )
        )

    except Exception as error:
        print(f"\nError: {error}")


if __name__ == "__main__":
    main()