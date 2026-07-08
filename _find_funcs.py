with open('index.html','r') as f:
    content = f.read()

targets = ['function fetchLoggedReports', 'function toggleReportsLog', 'function fetchDashboardMetrics', 'function nearMissCount', 'function handleFormSubmit']
for t in targets:
    idx = content.find(t)
    if idx >= 0:
        print(f'=== {t} at byte {idx} ===')
        print(content[idx:idx+1200])
        print()
    else:
        print(f'=== {t} NOT FOUND ===')
        print()
