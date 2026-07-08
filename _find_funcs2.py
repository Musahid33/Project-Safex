with open('index.html','r') as f:
    content = f.read()

targets = ['function fetchLoggedReports', 'function toggleReportsLog', 'function fetchDashboardMetrics', 'function nearMissCount']
for t in targets:
    idx = content.find(t)
    if idx >= 0:
        # Find the end of the function (next function or end of file)
        end_idx = len(content)
        for next_func in ['function ', '// 🔒', '// 📊', '// 🚨', '// 🌐']:
            ni = content.find(next_func, idx + len(t))
            if ni > idx and ni < end_idx:
                end_idx = ni
        snippet = content[idx:min(idx+1500, end_idx)]
        print(f'=== {t} at byte {idx} ===')
        print(snippet)
        print()
    else:
        print(f'=== {t} NOT FOUND ===')
        print()
