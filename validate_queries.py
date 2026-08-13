import sys
sys.path.insert(0, r'E:\Axlero MetricMind Project\axlero_metricmind_project_1\agent')
from query_planner import plan_query

measure_names = ['total sales', 'total revenue', 'profit', 'shipping cost', 'quantity', 'average discount', 'customer count', 'order count', 'profit margin percentage', 'average sales']
dimension_names = ['region', 'country', 'market', 'category', 'sub category', 'segment', 'ship mode', 'order date', 'state', 'city', 'customer name', 'product name']
questions = [f'Show {m}.' for m in measure_names]
questions += [f'Show {m} by {d}.' for m in measure_names for d in dimension_names]
questions += [f'Show {m} for {d}.' for m in measure_names for d in dimension_names]
questions += [f'Show {m} in {d}.' for m in measure_names for d in dimension_names]
failed = []
for q in questions:
    try:
        plan_query(q)
    except Exception as e:
        failed.append((q, type(e).__name__, str(e)))
print(f'TOTAL_QUESTIONS={len(questions)}')
print(f'FAILED_COUNT={len(failed)}')
if failed:
    for q, et, msg in failed[:10]:
        print(f'FAIL: {q} -> {et}: {msg}')
