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
| **HW1-1** | 網頁互動式 n×n GridWorld 建立（自由設定大小、起點、終點、障礙物） |
| **HW1-2** | 策略顯示與價值評估（Policy Evaluation 機制與視覺化） |
| **HW1-3** | 使用 Value Iteration 推導與顯示全域最佳策略 $\pi^*(s)$ 與 $V^*(s)$ |

*(若欲查看本專案從 Policy Evaluation 到 Value Iteration 的**完整 AI 輔助對話紀錄與問題發現過程**，請參閱 [`AI_CONVERSATION.md`](AI_CONVERSATION.md))*

---

### HW1-1 網格地圖開發 (功能完整/介面/結構/流暢度)

| 評分項目 | 實作細節 |
|------|------|
| **互動網格生成** | 輸入 n（5～9），動態生成 n×n 互動網格，支援視窗尺寸自適應 |
| **座標與標示** | 每格顯示 `row,col` 座標（0 起始），幫助快速對照狀態空間 |
| **狀態設定** | 🟢 起點 / 🔴 終點 / ⬛ 障礙物 三種模式按鈕，支援動態點擊更改位置 |
| **障礙物機制** | 最多支援 n−2 個障礙物；採用 45° 條紋樣式區分；防呆機制支援點擊移除 |
| **UX 流暢度** | Glassmorphism 卡片動畫、即時狀態列提示、防呆鎖定機制與視覺高亮 |

### HW1-2 策略顯示與價值評估

| 評分項目 | 實作細節 |
|------|------|
| **隨機策略生成** | 在尚未進行 Value Iteration 前，提供目標導向的隨機行動作為初始策略 |
| **策略評估正確性** | 完全遵守 Bellman 方程式 $V(s) = \sum_a \pi(a|s)[R + \gamma V(s')]$ 進行價值估算 |
| **動態矩陣視覺化** | Value Matrix 支援動態漸層色階（高/中/低）；Policy Matrix 支援 3×3 羅盤圖示 |

### HW1-3 使用價值迭代算法推導最佳政策

| 評分項目 | 實作細節 |
|------|------|
| **價值迭代演算法** | 實作 $V(s) \leftarrow \max_a [R + \gamma V(s')]$，取代先前的純評估機制，求得最佳解 |
| **最佳政策顯示** | 成功推導每個格子的最佳行動，並透過前端 BFS 追蹤，**以紫色發光高亮出 Optimal Path**，取代顯示隨機行動 |
| **顯示價值函數** | 收斂後，更新格子顯示每個狀態在最佳政策下的期望回報 $V(s)$ |

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
