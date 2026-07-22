-- Total Sales
SELECT SUM(sales) AS total_sales
FROM METRICMIND_DB.PUBLIC.FCT_SALES;

-- Total Profit
SELECT SUM(profit) AS total_profit
FROM METRICMIND_DB.PUBLIC.FCT_SALES;

-- Profit Margin
SELECT
    SUM(profit) / NULLIF(SUM(sales), 0) * 100
    AS profit_margin_percentage
FROM METRICMIND_DB.PUBLIC.FCT_SALES;

-- Sales by Region
SELECT
    region,
    SUM(sales) AS total_sales
FROM METRICMIND_DB.PUBLIC.FCT_SALES
GROUP BY region
ORDER BY total_sales DESC;

-- Quarterly Sales
SELECT
    YEAR(order_date) AS year,
    QUARTER(order_date) AS quarter,
    SUM(sales) AS total_sales
FROM METRICMIND_DB.PUBLIC.FCT_SALES
GROUP BY year, quarter
ORDER BY year, quarter;