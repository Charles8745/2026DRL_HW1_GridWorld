# 🗺 GridWorld — Value Iteration (DIC2)

<div align="center">

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Render.com-5865F2?style=for-the-badge)](https://drl-dic2.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Charles8745-181717?style=for-the-badge&logo=github)](https://github.com/Charles8745/2026DRL_DIC2)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.x-000000?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com)

**互動式 GridWorld · Value Iteration · 最佳路徑追蹤與視覺化**

</div>

---

## 🎯 作業說明 (DIC2)

本專案實作《Deep Reinforcement Learning》課堂作業 DIC2 的要求：

1. **5x5 GridWorld**
2. **Start cell** at `(0,0)`, **Ending cell** at `(4,4)`
3. **Block/Obstacle cells** at `(1,1)`, `(2,2)`, `(3,3)`
4. **Use Value Iteration** to find the path and **show arrows**

進入網頁後，已經預設載入上述 1~3 項配置。點擊 `▶ Run Value Iteration` 即可完成第 4 項要求。

---

## 📸 介面與結果

> Value Iteration 執行後，V(s) 矩陣會顯示各狀態收斂後的最大價值，而 Policy π(s) 矩陣會顯示最佳動作方向（箭頭），並**以紫色高亮標示從起點 (0,0) 到終點 (4,4) 的最佳路徑**。

---

## 🧮 演算法說明：Value Iteration

依照 Bellman Optimality Equation 進行迭代：

```
V(s) = max_a [R + γ * V(s')]
```
- **γ（折扣因子）** = 0.9
- **θ（收斂閾值）** = 1×10⁻⁶  
- **R（每步報酬）** = −1（終點為 0）

演算法收斂後，我們會透過貪婪策略（Greedy Policy）萃取出確定性最佳策略（Deterministic Policy）：
```
π(s) = argmax_a [R + γ * V(s')]
```

---

## 📝 開發紀錄與對話歷史

> 完整開發過程、演算法修改細節與**本次作業的對話紀錄**請參閱 [`DEVLOG.md`](DEVLOG.md)（供作業評分與老師檢視）。

---

## 🚀 本機執行

```bash
# 安裝依賴
pip install -r requirements.txt

# 啟動伺服器
python app.py

# 開啟瀏覽器
open http://127.0.0.1:5000
```

---

**後端：** Python 3.11 + Flask  
**前端：** 原生 HTML / CSS / JavaScript（無框架）  
**倉庫：** [https://github.com/Charles8745/2026DRL_DIC2.git](https://github.com/Charles8745/2026DRL_DIC2.git)
