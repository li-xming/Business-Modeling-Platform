from app import app

print("All registered routes:")
for rule in app.url_map.iter_rules():
    print(f"Rule: {rule}")
    print(f"  Endpoint: {rule.endpoint}")
    print(f"  Methods: {rule.methods}")
    print(f"  Arguments: {rule.arguments}")
    print()
