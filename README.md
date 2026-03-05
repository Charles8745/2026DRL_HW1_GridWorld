# HW1 GridWorld — Deep Reinforcement Learning

**🌐 Live Demo：[https://two026drl-hw1-gridworld.onrender.com](https://two026drl-hw1-gridworld.onrender.com)**
**📦 GitHub：[Charles8745/2026DRL_HW1_GridWorld](https://github.com/Charles8745/2026DRL_HW1_GridWorld)**

---

## 版本說明

### `GridWorld_v1`（當前穩定版）
本版本完整實作作業 Phase 1～2 所有功能，並完成部署。

---

## 功能說明

### Phase 1：互動式網格地圖

| 功能 | 說明 |
|------|------|
| 網格生成 | 輸入 n（5～9），動態生成 n×n 互動網格 |
| 模式切換 | 綠色「設定起點」/ 紅色「設定終點」/ 灰色「設定障礙物」按鈕 |
| 起點設定 | 點擊格子 → 綠色，再次點擊其他格可移動 |
| 終點設定 | 點擊格子 → 紅色，再次點擊其他格可移動 |
| 障礙物設定 | 最多 n-2 個，再次點擊已設格子可移除 |
| 狀態列 | 即時顯示起點座標、終點座標、障礙物數量 |
| 錯誤提示 | 超出障礙物限制、衝突設定等均有警告說明 |

### Phase 2：策略評估

| 功能 | 說明 |
|------|------|
| 隨機策略生成 | 每格隨機分配 1～4 個動作（↑↓←→），均勻機率 |
| 迭代策略評估 | Bellman 方程式：V(s) = Σ π(a\|s)[R + γ·V(s')]，γ=0.9，θ=1×10⁻⁶，R=−1 |
| Value Matrix | 每格顯示 V(s) 數值，含三段色階（高/中/低） |
| Policy Matrix | 每格以**羅盤佈局**顯示方向箭頭（↑在上、↓在下、←在左、→在右） |
| 座標軸標籤 | 兩個矩陣均有 row/col 編號（0 起始） |
| 收斂統計列 | 顯示迭代次數、γ、θ、R 參數 |
| 重新評估 | 按鈕可對同一網格重新隨機生成策略並再次評估 |
| 動態格子大小 | 格子大小依 n 自動調整（n≤6: 62px，n=9: 44px） |

---

## 技術架構

```
HW1_GridWorld/
├── app.py            # Flask 路由（/ 及 /evaluate）
├── gridworld.py      # Policy Generation & Policy Evaluation 演算法
├── templates/
│   └── index.html    # Jinja2 前端頁面
├── static/
│   ├── style.css     # CSS（CSS Variables、響應式、羅盤樣式）
│   └── script.js     # 互動邏輯（狀態機、AJAX、羅盤建構器）
├── requirements.txt  # flask, gunicorn
├── Procfile          # Render 部署啟動指令
└── render.yaml       # Render.com 部署設定
```

**後端：** Python 3 + Flask
**前端：** 原生 HTML / CSS / JavaScript（無框架）
**部署：** Render.com 免費方案（gunicorn WSGI）

---

## 開發歷程

| 日期 | 里程碑 |
|------|--------|
| 2026-03-04 | Phase 1 完成：Flask 互動網格、模式按鈕、障礙物限制 |
| 2026-03-04 | Phase 2 完成：隨機策略生成、Policy Evaluation（Bellman）、Value/Policy Matrix |
| 2026-03-04 | Phase 3 完成：推送 GitHub、Render.com 線上部署 |
| 2026-03-04 | 細節優化：座標軸標籤、收斂統計列、動態格子大小、色階強化 |
| 2026-03-04 | 羅盤箭頭：Policy Matrix 從拼接字串改為 3×3 方位羅盤顯示 |
| 2026-03-05 | 建立穩定版本 tag：`GridWorld_v1` |

---

## 本機執行

```bash
pip install -r requirements.txt
python app.py
# 開啟 http://127.0.0.1:5000
```

> ⚠️ Render 免費方案冷啟動約需 30 秒，稍候即可正常使用。
