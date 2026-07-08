with open('index.html', 'r') as f:
    content = f.read()
idx = content.find('handleFormSubmit')
if idx >= 0:
    start = max(0, idx - 100)
    end = min(len(content), idx + 300)
    result = content[start:end]
    with open('_result.txt', 'w') as out:
        out.write(result)
    print('Written to _result.txt')
else:
    print('NOT FOUND')
