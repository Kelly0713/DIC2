import sys, io, pandas as pd, numpy as np, requests, json
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Fetch GaneshSparkz dataset
url = 'https://gist.githubusercontent.com/GaneshSparkz/b5662effbdae8746f7f7d8ed70c42b2d/raw/faf8b1a0d58e251f48a647d3881e7a960c3f0925/50_Startups.csv'
response = requests.get(url, timeout=15)
print('Status:', response.status_code)
data = pd.read_csv(io.StringIO(response.text))
print('Columns:', data.columns.tolist())
print(data.head())

X = data.drop('Profit', axis=1)
y = data['Profit']
X_encoded = pd.get_dummies(X, columns=['State'], drop_first=True)
print('Encoded columns:', X_encoded.columns.tolist())

X_train, X_test, y_train, y_test = train_test_split(X_encoded, y, test_size=0.2, random_state=0)

def evaluate_performance(y_true, y_pred):
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
    r2 = float(r2_score(y_true, y_pred))
    return rmse, r2

def forward_selection(X_train, X_test, y_train, y_test, max_features):
    selected_features = []
    results = []
    for i in range(1, max_features + 1):
        feature_names = list(X_train.columns.difference(selected_features))
        candidate_rmse = np.inf
        candidate_r2 = -np.inf
        candidate_feature = None
        for feature in feature_names:
            features_to_use = selected_features + [feature]
            model = LinearRegression()
            model.fit(X_train[features_to_use], y_train)
            y_pred = model.predict(X_test[features_to_use])
            current_rmse, current_r2 = evaluate_performance(y_test, y_pred)
            if current_rmse < candidate_rmse:
                candidate_rmse = current_rmse
                candidate_r2 = current_r2
                candidate_feature = feature
        selected_features.append(candidate_feature)
        results.append({
            'numFeatures': i,
            'selectedFeatures': selected_features.copy(),
            'addedFeature': candidate_feature,
            'rmse': round(candidate_rmse, 2),
            'r2': round(candidate_r2, 4)
        })
    return results

results = forward_selection(X_train, X_test, y_train, y_test, max_features=5)
print('\nForward Selection Results:')
print(json.dumps(results, indent=2))

# Also save to JSON
with open('forward_selection_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)
print('\nSaved to forward_selection_results.json')

# Also get the GaneshSparkz dataset as list
ganesh_data = data.to_dict(orient='records')
for i, row in enumerate(ganesh_data):
    row['id'] = i + 1
with open('ganesh_data.json', 'w', encoding='utf-8') as f:
    json.dump(ganesh_data, f, indent=2, ensure_ascii=False)
print('Saved to ganesh_data.json')
