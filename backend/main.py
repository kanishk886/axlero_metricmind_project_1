"""
backend/main.py

FastAPI wrapper around the existing MetricMind agent.
Runs from the project root:
    uvicorn backend.main:app --reload --port 8000
"""

import sys
import os
from pathlib import Path

# ---------------------------------------------------------------------------
# Add the agent/ directory to sys.path so that the agent modules can use
# their bare imports (e.g.  "from config import ..."  "from sql_builder import ...")
# ---------------------------------------------------------------------------
AGENT_DIR = Path(__file__).resolve().parent.parent / "agent"
sys.path.insert(0, str(AGENT_DIR))

# ---------------------------------------------------------------------------
# Now import the existing agent functions.  Nothing in these files is changed.
# ---------------------------------------------------------------------------
from query_planner import plan_query          # noqa: E402
from cube_converter import semantic_to_cube  # noqa: E402
from sql_builder import build_sql            # noqa: E402
from snowflake_executor import execute_query # noqa: E402

# ---------------------------------------------------------------------------
# FastAPI setup
# ---------------------------------------------------------------------------
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="MetricMind API")

# Allow the Next.js dev server to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------
class QueryRequest(BaseModel):
    question: str


class QueryResponse(BaseModel):
    semantic_query: dict
    cube_query: dict
    sql: str
    parameters: list
    results: list


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/health")
def health():
    """Simple health check."""
    return {"status": "ok"}


@app.post("/query", response_model=QueryResponse)
def run_query(body: QueryRequest):
    """
    Main endpoint.  Receives a plain-English question,
    runs it through the MetricMind pipeline, and returns
    the semantic query, Cube query, SQL, and Snowflake results.
    """

    # 1. Validate input
    if not body.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty.",
        )

    try:
        # 2. Turn the question into a SemanticQuery
        semantic_query = plan_query(body.question)

        # 3. Convert to Cube-compatible JSON
        cube_query = semantic_to_cube(semantic_query)

        # 4. Build the SQL string and parameter list
        sql, parameters = build_sql(semantic_query)

        # 5. Run the SQL against Snowflake
        results = execute_query(sql, parameters)

    except ValueError as exc:
        # Validation or unsupported-query errors from the agent
        raise HTTPException(status_code=400, detail=str(exc))

    except Exception as exc:
        # Any other error (Snowflake connection, LLM timeout, etc.)
        raise HTTPException(
            status_code=500,
            detail=f"Backend error: {str(exc)}",
        )

    return QueryResponse(
        semantic_query=semantic_query.model_dump(),
        cube_query=cube_query,
        sql=sql,
        parameters=parameters,
        results=results,
    )
