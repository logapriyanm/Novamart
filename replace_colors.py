import os

colors = {
    '#1243B2': '#10367D',
    '#A9CDE5': '#74B4DA',
    '#F8FAFC': '#EBEBEB'
}

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for old, new in colors.items():
            new_content = new_content.replace(old, new)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated: {filepath}")
    except Exception as e:
        pass

for root, dirs, files in os.walk('.'):
    if any(d in root for d in ['node_modules', '.next', '.git']):
        continue
    
    for file in files:
        if file.endswith(('.tsx', '.ts', '.css', '.js', '.mjs')):
            replace_in_file(os.path.join(root, file))
