import os
from pathlib import Path

import snowflake.connector
from dotenv import load_dotenv


ENV_PATH = Path(__file__).resolve().parent / ".env"

load_dotenv(dotenv_path=ENV_PATH)


def get_snowflake_connection():
    required_variables = [
        "SNOWFLAKE_ACCOUNT",
        "SNOWFLAKE_USER",
        "SNOWFLAKE_PASSWORD",
        "SNOWFLAKE_WAREHOUSE",
        "SNOWFLAKE_DATABASE",
        "SNOWFLAKE_SCHEMA",
    ]

    missing_variables = [
        variable
        for variable in required_variables
        if not os.getenv(variable)
    ]

    if missing_variables:
        raise ValueError(
            "Missing environment variables: "
            + ", ".join(missing_variables)
        )

    connection = snowflake.connector.connect(
        account=os.getenv("SNOWFLAKE_ACCOUNT"),
        user=os.getenv("SNOWFLAKE_USER"),
        password=os.getenv("SNOWFLAKE_PASSWORD"),
        warehouse=os.getenv("SNOWFLAKE_WAREHOUSE"),
        database=os.getenv("SNOWFLAKE_DATABASE"),
        schema=os.getenv("SNOWFLAKE_SCHEMA"),
        role=os.getenv("SNOWFLAKE_ROLE"),
    )

    return connection


def execute_query(
    sql: str,
    parameters: list | None = None,
) -> list[dict]:
    """
    Execute SQL in Snowflake and return rows
    as a list of dictionaries.
    """

    connection = None
    cursor = None

    try:
        connection = get_snowflake_connection()
        cursor = connection.cursor()

        cursor.execute(
            sql,
            parameters or [],
        )

        column_names = [
            column[0].lower()
            for column in cursor.description
        ]

        rows = cursor.fetchall()

        return [
            dict(zip(column_names, row))
            for row in rows
        ]

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None:
            connection.close()