# 📓 DEVLOG — GridWorld HW1 開發記錄

> 本文件記錄 GridWorld HW1 的完整開發過程，包含設計決策、Bug 修復、UI 優化等對話紀錄摘要，供作業評分參考。

---

## 開發環境

| 項目 | 內容 |
|------|------|
| 語言 | Python 3.11 / HTML / CSS / JavaScript |
| 後端框架 | Flask 2.x |
| 部署平台 | Render.com（免費方案） |
| 版本控制 | Git + GitHub |
| 開發期間 | 2026-03-04 ～ 2026-03-11 |

---

## Session 1 — Phase 1：互動式 GridWorld 建立

**日期：** 2026-03-04  
**目標：** 建立具備互動功能的 n×n GridWorld

### 實作內容

**後端（`app.py`）**
- Flask 應用初始化，提供 `GET /`（主頁面）和 `POST /evaluate`（策略評估 API）

**前端互動（`script.js`）**
- 狀態機設計：`mode ∈ { 'start', 'end', 'obstacle' }`
- `buildGrid()` — 動態建立 HTML `<table>` 作為互動網格
- `handleCellClick(row, col)` — 依照當前模式設定格子狀態
- `updateStatus()` — 即時更新狀態列與按鈕可用性
- 障礙物數量限制：最多 n−2 個，點擊已設格子可移除

**CSS 樣式（`style.css`）**
- 起點：綠色邊框發光效果
- 終點：紅色邊框發光效果
- 障礙物：深灰色
- 模式指示：active 狀態樣式

### 設計決策

- Grid 使用原生 HTML `<table>` 而非 canvas，便於 CSS 樣式控制
- 狀態使用 JavaScript 全域變數管理（n, mode, startCell, endCell, obstacles）
- 障礙物上限設為 n−2（確保路徑可到達性的保守估計）

---

## Session 2 — Phase 2：策略評估演算法

**日期：** 2026-03-04  
**目標：** 實作 Bellman 迭代策略評估並可視化結果

### 核心演算法（`gridworld.py`）

#### 隨機策略生成
```python
def generate_random_policy(n, obstacle_set, end_state):
    # 每個非終止格子隨機分配 1~4 個動作
    num_actions = random.randint(1, 4)
    chosen = random.sample(ALL_ACTIONS, num_actions)
    policy[state] = chosen
```

#### Bellman 迭代策略評估
```python
def policy_evaluation(n, policy, obstacle_set, end_state, gamma=0.9, theta=1e-6):
    # V(s) = Σ_a π(a|s) · [R + γ · V(s')]
    while True:
        delta = 0
        for each state s:
            v = V[s]
            actions = policy[s]
            prob = 1.0 / len(actions)
            V[s] = sum(prob * (-1 + gamma * V[next_state(s,a)]) for a in actions)
            delta = max(delta, abs(v - V[s]))
        if delta < theta:
            break
    return V, iterations
```

**超參數：** γ = 0.9，θ = 1×10⁻⁶，R = −1（終點 V = 0）

### 結果視覺化

- **Value Matrix：** 三段色階（val-high / val-mid / val-low）+ 數值文字
- **Policy Matrix：** 3×3 羅盤佈局，依動作位置排列箭頭
  - ↑ 顯示在格子上方中央
  - ↓ 顯示在格子下方中央
  - ← 顯示在格子左側中央
  - → 顯示在格子右側中央
- **座標軸：** 矩陣邊緣加入 row/col 數字標籤
- **收斂統計：** 顯示迭代次數、γ、θ、R

### 細節優化

- `valueClass(v)` 函數依線性正規化決定色階（min/max 之間的比例）
- 動態格子大小依 n 調整：n≤6: 62px、n=7: 54px、n=8: 48px、n=9: 44px
- `buildCompassDiv(actions, arrowSize)` — 建立 3×3 grid 的羅盤箭頭顯示

---

## Session 3 — Render.com 部署

**日期：** 2026-03-04  
**目標：** 將應用部署到線上

### 部署設定

**`requirements.txt`**
```
flask
gunicorn
```

**`Procfile`**
```
web: gunicorn app:app
```

**`render.yaml`**
```yaml
services:
  - type: web
    name: drl-hw1-gridworld
    runtime: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app:app
    plan: free
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

**Live URL：** https://two026drl-hw1-gridworld.onrender.com

---

## Session 4 — Glassmorphism UI 重設計（v2）

**日期：** 2026-03-05  
**目標：** 全面升級 UI 為毛玻璃（Glassmorphism）設計語言

### 建立新分支
```bash
git checkout -b GridWorld_v2
```

### CSS 改寫重點（`style.css`）

**動態漸層背景**
```css
body {
  background: linear-gradient(-45deg, #07071a, #0f0f2d, #12122a, #0a0a20);
  background-size: 400% 400%;
  animation: gradientDrift 18s ease infinite;
}
```

**浮動光球**
```css
.orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  animation: orbDrift 12s ease-in-out infinite alternate;
}
.orb-1 { width: 450px; height: 450px; background: rgba(99, 102, 241, 0.18); }
.orb-2 { width: 320px; height: 320px; background: rgba(139, 92, 246, 0.15); }
.orb-3 { width: 280px; height: 280px; background: rgba(6,  182, 212, 0.13); }
```

**毛玻璃卡片**
```css
.card {
  background: rgba(17, 24, 39, 0.55);
  backdrop-filter: blur(28px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.45);
  animation: fadeUp 0.6s ease both;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.60);
}
```

**入場動畫（Stagger）**
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
.container > .card:nth-child(1) { animation-delay: 0.08s; }
.container > .card:nth-child(2) { animation-delay: 0.18s; }
.container > .card:nth-child(3) { animation-delay: 0.28s; }
```

**字型**
```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### HTML 更新（`index.html`）

- 新增 3 個 `.orb` div（浮動光球）
- Header 加入 `.card` class（毛玻璃效果）
- Badge 顯示版本資訊
- 全站字型切換為 Outfit + Inter

---

## Session 5 — Bug 修復

**日期：** 2026-03-05

### Bug 1：障礙物不清晰

**問題：** 障礙物顏色 `rgba(51,65,85,0.70)` 與深色背景太相似，難以識別

**修復：** 改為 45° 斜線條紋圖案

```css
.grid-table td.obs {
  background: repeating-linear-gradient(
    45deg,
    rgba(100, 116, 139, 0.85) 0px,
    rgba(100, 116, 139, 0.85) 5px,
    rgba(15,  23,  42,  0.90) 5px,
    rgba(15,  23,  42,  0.90) 13px
  ) !important;
  border-color: rgba(148, 163, 184, 0.50) !important;
}
```

### Bug 2：Value Matrix 數值幾乎全為 −10

**問題：** 純隨機策略（`random.sample(ALL_ACTIONS, num_actions)`）導致大多數格子的有效通道機率過低，V(s) 趨近理論最小值 R/(1−γ) = −10

**根因分析：**
- 棋盤上距終點 d 步的格子，需要每步都「碰巧」選到正確方向
- 完全隨機策略平均只有 25% 機率選到有效方向
- 大多數格子收斂到 V(s) ≈ −10

**修復：** Goal-Biased Policy Generation

```python
def generate_random_policy(n, obstacle_set, end_state):
    end_row, end_col = end_state
    for row in range(n):
        for col in range(n):
            # 計算指向終點的有效方向
            useful = []
            if row > end_row: useful.append('up')
            elif row < end_row: useful.append('down')
            if col > end_col: useful.append('left')
            elif col < end_col: useful.append('right')
            
            # 至少包含 1 個有效方向動作
            core = [random.choice(useful)]
            
            # 隨機附加 0~3 個其他動作
            remaining = [a for a in ALL_ACTIONS if a not in core]
            extra = random.sample(remaining, random.randint(0, min(3, len(remaining))))
            policy[state] = core + extra
```

**效果：** Value Matrix 出現清楚梯度（例：−9.58 → −7.34 → −4.60 → −1.00 → 0.00）

---

## Session 6 — UX 全面改善

**日期：** 2026-03-05

### 問題清單（Audit 後發現 10 項問題）

| # | 問題 | 原因 | 解法 |
|---|------|------|------|
| 1 | 格子顯示流水號 1-49 | `r * n + c + 1` | 改為 `(row,col)` 座標 |
| 2 | Active 模式視覺不明顯 | 只有小黃點 indicator | 改為白色 ring + brightness |
| 3 | 提示文字永遠顯示 | JS 未隱藏 | 起終點設定後自動隱藏 |
| 4 | 圖例顏色與主題不符 | 用舊淺色 `#f0fff4` | 改為 `rgba(16,185,129,0.25)` |
| 5 | Evaluate 按鈕不突出 | 與重置按鈕同樣樣式 | 改為大紫色漸層 CTA |
| 6 | 矩陣標題無識別性 | 純文字 + emoji | 加上 V / π 彩色 badge |
| 7 | 語義不清晰 | 無流程引導 | 加入 ①→②→③→④ 步驟 Pill |
| 8 | 章節標題無層次 | 無視覺區分 | 加入彩色序號圓點 |
| 9 | 兩矩陣邊界模糊 | 緊靠在一起 | 加入半透明垂直分隔線 |
| 10 | 結果 Card 無特色 | 與其他 Card 外觀相同 | 加入 indigo 邊框 tint |

### JS 修改

```javascript
// Before: 流水號
td.innerHTML = `<span class="cell-label">${r * n + c + 1}</span>`;

// After: 座標
td.innerHTML = `<span class="cell-label">${r},${c}</span>`;

// 提示文字自動隱藏
if (hintText) hintText.style.display = canEval ? 'none' : 'inline';
```

### CSS 新增

```css
/* Active 模式按鈕 */
.mode-btn.active-mode {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.55) !important;
  box-shadow: 0 0 0 3px rgba(255,255,255,0.12), 0 6px 20px rgba(0,0,0,0.5) !important;
  filter: brightness(1.15);
}

/* 主 CTA 按鈕 */
.btn-eval {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  font-size: 0.95rem;
  padding: 12px 28px;
  box-shadow: 0 4px 20px rgba(124,58,237,0.45);
}
```

---

## 部署歷程

| 操作 | 指令 |
|------|------|
| 建立 v2 分支 | `git checkout -b GridWorld_v2` |
| 推送 v2 | `git push origin GridWorld_v2` |
| 合併到 main | `git checkout main && git merge GridWorld_v2` |
| 推送 main（觸發 Render 重新部署） | `git push origin main` |

---

## Git 提交記錄

```
6c68e52  ux: comprehensive UI/UX polish — step-pills, coord labels, mode highlight, eval CTA, dark legend, matrix icons, divider
66c28db  fix: obstacle stripe pattern for contrast, goal-biased policy for value gradient
093f018  feat(v2): Glassmorphism UI redesign — dark gradient bg, floating orbs, glass cards, staggered animations, Outfit+Inter fonts
7aa8963  docs: update README with v1 feature table and development history
999ffc3  Arrow compass: replace concatenated arrows with 3x3 directional mini-grid in Policy Matrix
548cca2  Detail optimization: coord labels, convergence stats, dynamic cell size, value color scale, cache-busting
e8ac63b  Add README with live demo URL
cee92ff  HW1 GridWorld: Phase 1 (interactive grid) + Phase 2 (policy evaluation) + Phase 3 (Render deployment)
```

---

## 學習重點

### 1. Bellman 方程式實作

理解到迭代策略評估的收斂性質：當策略無法有效到達終點時，V(s) 趨近 R/(1−γ)。這驗證了 γ 的重要性：γ 越大，遠離終點的格子價值越低。

### 2. 策略的重要性

Pure random policy vs. goal-biased policy 的差異在視覺化時非常明顯：前者的 Value Matrix 幾乎全紅（全為最低值），後者呈現清楚梯度，更能反映「距離終點的代價」直覺。

### 3. 前端狀態機設計

使用 `mode` 變數管理三種互動模式（起點/終點/障礙物），搭配 CSS class 切換實現即時視覺反饋，避免複雜的事件監聽器嵌套。

### 4. UX 細節的重要性

- 流水號（1-49）vs 座標（0,0）：後者讓使用者立即理解狀態空間索引
- 模式高亮（黃點 vs 白色 ring）：使用者實際操作時才意識到視覺反饋的重要性
- Hint text 自動消失：避免 UI 雜訊，讓使用者聚焦在可完成的動作上

---

*本 DEVLOG 由開發過程的 AI 輔助對話紀錄整理而成，記錄時間：2026-03-11*
