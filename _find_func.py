with open('index.html', 'r') as f:
    content = f.read()
idx = content.find('handleFormSubmit')
if idx >= 0:
    start = max(0, idx - 100)
    end = min(len(content), idx + 300)
    print(content[start:end])
else:
    print('NOT FOUND')
