# HW1 GridWorld — Deep Reinforcement Learning

**🌐 Live Demo：[https://two026drl-hw1-gridworld.onrender.com](https://two026drl-hw1-gridworld.onrender.com)**

---

## 功能說明

### Phase 1：互動式網格地圖
- 輸入 n（5～9）生成 n×n 網格
- 模式切換按鈕：設定**起點**（綠色）、**終點**（紅色）、**障礙物**（灰色，最多 n-2 個）
- 障礙物可再次點擊移除

### Phase 2：策略評估
- 隨機生成策略：每格 1~4 個行動（↑↓←→）
- 迭代策略評估（Bellman 方程式）：V(s) = Σ π(a|s)[R + γV(s')]
- 參數：γ=0.9，θ=1×10⁻⁶，R=−1
- 顯示 **Value Matrix** 與 **Policy Matrix**

## 專案結構

```
├── app.py            # Flask 主程式
├── gridworld.py      # 策略生成 & 策略評估演算法
├── templates/
│   └── index.html    # 前端頁面
├── static/
│   ├── style.css
│   └── script.js
├── requirements.txt
├── Procfile          # Render 部署
└── render.yaml
```

## 本機執行

```bash
pip install -r requirements.txt
python app.py
# 開啟 http://127.0.0.1:5000
```
