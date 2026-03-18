# 🗺 GridWorld (Value Iteration) — Deep Reinforcement Learning HW1

> **🚀 Live Demo (線上展示)：[https://2026drlhw1gridworldversal.vercel.app/](https://2026drlhw1gridworldversal.vercel.app/)**  
> **📝 AI 對話紀錄與開發歷程：[AI_CONVERSATION.md](AI_CONVERSATION.md)** （供老師檢閱與評分參考）

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-Charles8745-181717?style=for-the-badge&logo=github)](https://github.com/Charles8745/2026DRL_HW1_GridWorld)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.x-000000?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com)

**互動式 GridWorld 網格地圖 · Value Iteration 最佳解搜尋 · 價值函數視覺化**

</div>

---

## 🎯 專案說明

本專案實作《Deep Reinforcement Learning》課程 HW1，並進階升級至 **Value Iteration** 以求得最佳策略：

| 核心模組 | 內容 |
|-------|------|
| **Interactive Grid** | 網頁互動式 n×n GridWorld 建立（自由設定大小、起點、終點、障礙物） |
| **Value Iteration** | 套用 Bellman Optimality Equation，迭代收斂求解最佳 V(s) 與確定性策略 $\pi(s)$ |

*(若欲查看本專案從 Policy Evaluation 到 Value Iteration 的**完整 AI 輔助對話紀錄與問題發現過程**，請參閱 [`AI_CONVERSATION.md`](AI_CONVERSATION.md))*

---

## ✨ 功能特色

### Phase 1：互動式網格地圖

| 功能 | 說明 |
|------|------|
| 網格生成 | 輸入 n（5～9），動態生成 n×n 互動網格 |
| 座標顯示 | 每格顯示 `row,col` 座標（0 起始） |
| 模式切換 | 🟢 起點 / 🔴 終點 / ⬛ 障礙物 三種模式按鈕 |
| 起點設定 | 點擊格子 → 綠色，再次點擊其他格可移動 |
| 終點設定 | 點擊格子 → 紅色，再次點擊其他格可移動 |
| 障礙物設定 | 最多 n−2 個；條紋樣式顯示；再次點擊已設格子可移除 |
| 狀態列 | 即時顯示起點座標、終點座標、障礙物數量 |
| 自適應提示 | 起終點皆設定後按鈕解鎖，提示文字自動隱藏 |

### Phase 2：Value Iteration 策略評估

| 功能 | 說明 |
|------|------|
| Value Iteration | $V(s) \leftarrow \max_a [R + \gamma V(s')]$，找出全域最佳價值函數 |
| 確定性策略提取 | 收斂後套用 Greedy Policy 提取單一最佳方向以形成明確路徑 |
| 最佳路徑追蹤 | $\pi(s)$ 矩陣會只顯示最佳箭頭，並**以紫色發光高亮出從起點至終點的 Optimal Path** |
| Value Matrix | 每格顯示 V(s) 數值，含三段色階（高/中/低） |
| 羅盤圖示 | $\pi(s)$ 矩陣由 3×3 羅盤佈局顯示最佳路線方向 |

---

## 🧮 演算法參數

- **γ（折扣因子）** = 0.9
- **θ（收斂閾值）** = 1×10⁻⁶  
- **R（每步報酬）** = −1（終點為 0）
- **環境規則**：若動作使 Agent 越界或撞入障礙物，則留在原地。障礙物格不參與價值計算。

---

## 🚀 本機執行

```bash
# 安裝環境依賴
pip install -r requirements.txt

# 啟動 Flask 應用伺服器
python app.py

# 取出瀏覽器開啟
open http://127.0.0.1:5000
```
