"""
=============================================================================
50 Startups Multiple Linear Regression Analysis using CRISP-DM Framework
=============================================================================
CRISP-DM 6 大步驟實作：
  1. Business Understanding (商業理解)
  2. Data Understanding (資料理解)
  3. Data Preparation (資料準備 - OneHotEncoding & 避開虛擬變數陷阱)
  4. Modeling (模型建置 - Multiple Linear Regression)
  5. Evaluation (模型評估 - R2, MAE, MSE, RMSE, 實際 vs 預測散佈圖)
  6. Deployment (模型部署 / 預測範例)
=============================================================================
"""

import sys
import io

# 確保 Windows 終端機能正確印出 UTF-8 繁體中文字元
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

import requests
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error


def step1_business_understanding():
    print("=" * 70)
    print("【CRISP-DM 步驟 1: Business Understanding (商業理解)】")
    print("=" * 70)
    print("目標：分析 50 家新創公司的各項支出 (研發、行政、行銷) 與所在州別 (State)，")
    print("      建立多元線性迴歸模型以預測新創公司的『利潤 (Profit)』，")
    print("      協助創投 (VC) 與創辦人找出影響獲利最關鍵的因素與最佳資金配置。")
    print("-" * 70)


def step2_data_acquisition_and_understanding(url: str) -> pd.DataFrame:
    print("\n" + "=" * 70)
    print("【CRISP-DM 步驟 2: Data Acquisition & Understanding (資料擷取與理解)】")
    print("=" * 70)
    print(f"正在從網址擷取資料: {url}")
    
    try:
        response = requests.get(url, timeout=15)
        # 驗證 HTTP 狀態碼是否為 200
        if response.status_code == 200:
            print("[成功] 資料擷取成功！HTTP Status Code: 200 OK")
            data = pd.read_csv(io.StringIO(response.text))
            
            print("\n[資料集前 5 筆資料 (head)]:")
            print(data.head())
            
            print("\n[欄位名稱列表 (Columns)]:")
            print(data.columns.tolist())
            
            print("\n[資料集基本資訊 (Summary)]:")
            print(f"- 總樣本數: {len(data)} 家新創公司")
            print(f"- 缺失值 (NaN) 檢查:")
            print(data.isnull().sum())
            print(f"- 各州分佈 (State count):")
            print(data['State'].value_counts())
            
            return data
        else:
            print(f"[錯誤] 資料擷取失敗，HTTP 狀態碼為: {response.status_code}")
            sys.exit(1)
            
    except requests.exceptions.RequestException as e:
        print(f"[錯誤] 網路連線異常: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"[錯誤] 讀取資料異常: {e}")
        sys.exit(1)


def step3_data_preparation(data: pd.DataFrame):
    print("\n" + "=" * 70)
    print("【CRISP-DM 步驟 3: Data Preparation (資料準備)】")
    print("=" * 70)
    
    # 1. 分離特徵 (X) 與目標變數 (y)
    X = data.drop('Profit', axis=1)
    y = data['Profit']
    print("1. 特徵與目標分離完成:")
    print(f"   - 特徵 X 形狀: {X.shape} (欄位: {list(X.columns)})")
    print(f"   - 目標 y 形狀: {y.shape} (預測欄位: Profit)")

    # 2. 類別資料編碼 (OneHotEncoder) 並避免虛擬變數陷阱 (drop='first')
    # State 是在第 3 欄索引 (0: R&D, 1: Administration, 2: Marketing Spend, 3: State)
    # drop='first' 會自動丟棄第一個類別欄位以避免共線性 (Dummy Variable Trap)
    print("\n2. 使用 ColumnTransformer 進行 OneHotEncoding (drop='first' 避免虛擬變數陷阱):")
    ct = ColumnTransformer(
        transformers=[
            ('encoder', OneHotEncoder(drop='first'), [3])
        ],
        remainder='passthrough'
    )
    X_encoded = ct.fit_transform(X)
    
    # 取得轉換後的欄位名稱
    ohe_categories = ct.named_transformers_['encoder'].categories_[0]
    dropped_category = ohe_categories[0]
    encoded_categories = [f"State_{cat}" for cat in ohe_categories[1:]]
    passthrough_cols = ['R&D Spend', 'Administration', 'Marketing Spend']
    new_columns = encoded_categories + passthrough_cols
    
    print(f"   - 原始 State 類別: {list(ohe_categories)}")
    print(f"   - 被 drop 的基準類別 (避免 Dummy Variable Trap): {dropped_category}")
    print(f"   - 編碼後的新欄位: {new_columns}")
    print(f"   - 編碼後的特徵矩陣維度: {X_encoded.shape}")

    # 3. 切分訓練集與測試集 (80% 訓練, 20% 測試)
    print("\n3. 使用 train_test_split 切分資料集 (80% 訓練, 20% 測試, random_state=42):")
    X_train, X_test, y_train, y_test = train_test_split(
        X_encoded, y, test_size=0.2, random_state=42
    )
    print(f"   - 訓練集大小: X_train={X_train.shape}, y_train={y_train.shape}")
    print(f"   - 測試集大小: X_test={X_test.shape}, y_test={y_test.shape}")

    return X_train, X_test, y_train, y_test, ct, new_columns


def step4_modeling(X_train, y_train, feature_names):
    print("\n" + "=" * 70)
    print("【CRISP-DM 步驟 4: Modeling (模型建置)】")
    print("=" * 70)
    print("建立 Multiple Linear Regression (多元線性迴歸) 模型並進行擬合...")
    
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    print("[成功] 模型訓練完成！")
    print(f"截距項 (Intercept, beta_0): {model.intercept_:.4f}")
    print("各特徵迴歸係數 (Coefficients, beta):")
    for name, coef in zip(feature_names, model.coef_):
        print(f"   - {name:20s}: {coef:12.4f}")
        
    return model


def step5_evaluation(model, X_test, y_test, save_plot=True):
    print("\n" + "=" * 70)
    print("【CRISP-DM 步驟 5: Evaluation (模型評估)】")
    print("=" * 70)
    
    # 進行測試集預測
    y_pred = model.predict(X_test)
    
    # 計算各項評估指標
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    
    print("【模型成效評估指標】:")
    print(f"  1. 判定係數 R-squared (R2):           {r2:.4f} (代表模型可解釋 {r2*100:.2f}% 的利潤變異)")
    print(f"  2. 平均絕對誤差 (MAE):                 ${mae:,.2f}")
    print(f"  3. 均方誤差 (MSE):                     ${mse:,.2f}")
    print(f"  4. 均方根誤差 (RMSE):                  ${rmse:,.2f}")
    
    # 打印實際值 vs 預測值對照表
    print("\n[測試集 Actual vs Predicted Profit 對照表]:")
    comparison_df = pd.DataFrame({
        'Actual Profit': y_test.values,
        'Predicted Profit': y_pred,
        'Absolute Error': np.abs(y_test.values - y_pred)
    })
    print(comparison_df.round(2).to_string(index=False))
    
    # Optional Visualization: Matplotlib 繪製實際值 vs 預測值散佈圖
    if save_plot:
        print("\n繪製 Actual vs Predicted Profit 散佈圖...")
        plt.figure(figsize=(9, 6), dpi=120)
        
        # 散佈點
        plt.scatter(y_test, y_pred, color='#2563eb', edgecolors='black', s=90, alpha=0.85, label='Startups (Test set)')
        
        # 理想參考線 (y = x, 代表完美預測)
        min_val = min(y_test.min(), y_pred.min()) - 5000
        max_val = max(y_test.max(), y_pred.max()) + 5000
        plt.plot([min_val, max_val], [min_val, max_val], color='#ef4444', linestyle='--', linewidth=2, label='Perfect Fit (y = x)')
        
        plt.title('Actual vs. Predicted Profit', fontsize=15, fontweight='bold', pad=12)
        plt.xlabel('Actual Profit ($)', fontsize=12, labelpad=8)
        plt.ylabel('Predicted Profit ($)', fontsize=12, labelpad=8)
        plt.grid(True, linestyle=':', alpha=0.6)
        plt.legend(frameon=True, facecolor='#f8fafc', edgecolor='#cbd5e1')
        plt.tight_layout()
        
        plot_path = 'actual_vs_predicted.png'
        plt.savefig(plot_path)
        print(f"[成功] 視覺化圖表已成功儲存至: {plot_path}")
        
    return r2, mae, mse, rmse, y_pred


def step6_deployment(model, ct):
    print("\n" + "=" * 70)
    print("【CRISP-DM 步驟 6: Deployment (部署與實際應用)】")
    print("=" * 70)
    print("提供快速預測函式，輸入新創公司的各項支出即可預估利潤：")
    
    # 範例預測：一家位於 California 的新創公司
    sample_startup = pd.DataFrame({
        'R&D Spend': [160000.0],
        'Administration': [130000.0],
        'Marketing Spend': [300000.0],
        'State': ['California']
    })
    
    sample_encoded = ct.transform(sample_startup)
    predicted_profit = model.predict(sample_encoded)[0]
    
    print("\n[範例預測]:")
    print(f"  - 研發支出 (R&D Spend):         ${sample_startup['R&D Spend'][0]:,.2f}")
    print(f"  - 行政管理支出 (Administration):  ${sample_startup['Administration'][0]:,.2f}")
    print(f"  - 行銷支出 (Marketing Spend):   ${sample_startup['Marketing Spend'][0]:,.2f}")
    print(f"  - 所在州別 (State):             {sample_startup['State'][0]}")
    print(f"  ==> 預測利潤 (Predicted Profit): ${predicted_profit:,.2f}")
    print("=" * 70)


def main():
    # 資料來源 URL
    csv_url = 'https://raw.githubusercontent.com/harimittapalli/Mulitple-Linear-Reggression/master/50_Startups.csv'
    
    # 執行 CRISP-DM 流程
    step1_business_understanding()
    data = step2_data_acquisition_and_understanding(csv_url)
    X_train, X_test, y_train, y_test, ct, feature_names = step3_data_preparation(data)
    model = step4_modeling(X_train, y_train, feature_names)
    step5_evaluation(model, X_test, y_test, save_plot=True)
    step6_deployment(model, ct)
    print("\n[完成] 所有 CRISP-DM 步驟執行完成！")


if __name__ == '__main__':
    main()
