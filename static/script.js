// ===== script.js — GridWorld HW1 =====

// ---------- State ----------
let n = 0;
let mode = 'start';           // 'start' | 'end' | 'obstacle'
let startCell = null;         // { row, col }
let endCell   = null;         // { row, col }
let obstacles = new Set();    // Set of "row,col" strings

// ---------- DOM refs ----------
const inputN       = document.getElementById('input-n');
const btnGenerate  = document.getElementById('btn-generate');
const gridWrapper  = document.getElementById('grid-wrapper');
const gridSection  = document.getElementById('grid-section');
const resultsSection = document.getElementById('results-section');

const modeBtns = {
  start:    document.getElementById('btn-mode-start'),
  end:      document.getElementById('btn-mode-end'),
  obstacle: document.getElementById('btn-mode-obs'),
};

const statusStart = document.getElementById('status-start');
const statusEnd   = document.getElementById('status-end');
const statusObs   = document.getElementById('status-obs');
const btnEval     = document.getElementById('btn-evaluate');
const btnReset    = document.getElementById('btn-reset');
const alertBox    = document.getElementById('alert-box');

// ---------- Generate Grid ----------
btnGenerate.addEventListener('click', () => {
  const val = parseInt(inputN.value, 10);
  if (isNaN(val) || val < 5 || val > 9) {
    showAlert('請輸入 5 到 9 之間的數字！', 'error');
    return;
  }
  n = val;
  resetState();
  buildGrid();
  gridSection.style.display = 'block';
  resultsSection.style.display = 'none';
  hideAlert();
});

// ---------- Build Grid ----------
function buildGrid() {
  // Build HTML table
  const table = document.createElement('table');
  table.className = 'grid-table';
  table.setAttribute('id', 'main-grid');

  for (let r = 0; r < n; r++) {
    const tr = document.createElement('tr');
    for (let c = 0; c < n; c++) {
      const td = document.createElement('td');
      td.id = `cell-${r}-${c}`;
      const cellNum = r * n + c + 1;
      td.innerHTML = `<span class="cell-label">${cellNum}</span>`;
      td.addEventListener('click', () => handleCellClick(r, c));
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  gridWrapper.innerHTML = '';
  gridWrapper.appendChild(table);
  updateStatus();
}

// ---------- Cell Click Handler ----------
function handleCellClick(row, col) {
  const key = `${row},${col}`;

  if (mode === 'start') {
    // Cannot set start on existing end or obstacle
    if (endCell && endCell.row === row && endCell.col === col) {
      showAlert('該格已設為終點，請選擇其他格子。', 'warn');
      return;
    }
    if (obstacles.has(key)) {
      showAlert('該格是障礙物，請先移除障礙物後再設定起點。', 'warn');
      return;
    }
    // Deselect previous start
    if (startCell) {
      setCellClass(startCell.row, startCell.col, '');
    }
    startCell = { row, col };
    setCellClass(row, col, 'start');

  } else if (mode === 'end') {
    if (startCell && startCell.row === row && startCell.col === col) {
      showAlert('該格已設為起點，請選擇其他格子。', 'warn');
      return;
    }
    if (obstacles.has(key)) {
      showAlert('該格是障礙物，請先移除障礙物後再設定終點。', 'warn');
      return;
    }
    if (endCell) {
      setCellClass(endCell.row, endCell.col, '');
    }
    endCell = { row, col };
    setCellClass(row, col, 'end');

  } else if (mode === 'obstacle') {
    // Cannot overwrite start or end
    if (startCell && startCell.row === row && startCell.col === col) {
      showAlert('該格是起點，無法設為障礙物。', 'warn');
      return;
    }
    if (endCell && endCell.row === row && endCell.col === col) {
      showAlert('該格是終點，無法設為障礙物。', 'warn');
      return;
    }

    if (obstacles.has(key)) {
      // Toggle off
      obstacles.delete(key);
      setCellClass(row, col, '');
    } else {
      // Max n-2 obstacles
      if (obstacles.size >= n - 2) {
        showAlert(`最多只能設置 ${n - 2} 個障礙物（n-2=${n}-2）。`, 'warn');
        return;
      }
      obstacles.add(key);
      setCellClass(row, col, 'obs');
    }
  }

  hideAlert();
  updateStatus();
}

// ---------- Mode Switching ----------
Object.entries(modeBtns).forEach(([m, btn]) => {
  btn.addEventListener('click', () => {
    mode = m;
    Object.entries(modeBtns).forEach(([k, b]) => {
      b.classList.toggle('active-mode', k === m);
    });
    hideAlert();
  });
});

// ---------- Reset ----------
btnReset.addEventListener('click', () => {
  resetState();
  buildGrid();
  resultsSection.style.display = 'none';
  hideAlert();
});

function resetState() {
  startCell = null;
  endCell   = null;
  obstacles.clear();
  mode = 'start';
  Object.entries(modeBtns).forEach(([k, b]) => {
    b.classList.toggle('active-mode', k === 'start');
  });
}

// ---------- Status Update ----------
function updateStatus() {
  statusStart.textContent = startCell
    ? `(${startCell.row}, ${startCell.col})`
    : '未設定';

  statusEnd.textContent = endCell
    ? `(${endCell.row}, ${endCell.col})`
    : '未設定';

  statusObs.textContent = `${obstacles.size} / ${n > 0 ? n - 2 : '?'}`;

  const canEval = startCell && endCell;
  btnEval.disabled = !canEval;
}

// ---------- Cell Class Helper ----------
function setCellClass(row, col, cls) {
  const td = document.getElementById(`cell-${row}-${col}`);
  if (!td) return;
  td.className = cls;
  const label = td.querySelector('.cell-label');
  if (label) {
    label.className = (cls === 'start' || cls === 'end' || cls === 'obs')
      ? 'cell-label light'
      : 'cell-label';
  }
}

// ---------- Alert ----------
function showAlert(msg, type = 'warn') {
  alertBox.textContent = msg;
  alertBox.className = `alert alert-${type}`;
  alertBox.style.display = 'block';
}
function hideAlert() {
  alertBox.style.display = 'none';
}

// ---------- Evaluate ----------
btnEval.addEventListener('click', async () => {
  if (!startCell || !endCell) {
    showAlert('請先設定起點和終點！', 'error');
    return;
  }

  btnEval.disabled = true;
  btnEval.textContent = '⏳ 計算中...';

  const obstacleList = [...obstacles].map(k => k.split(',').map(Number));

  try {
    const resp = await fetch('/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        n:         n,
        start:     [startCell.row, startCell.col],
        end:       [endCell.row,   endCell.col],
        obstacles: obstacleList,
      }),
    });

    if (!resp.ok) throw new Error(`Server error: ${resp.status}`);
    const data = await resp.json();
    renderResults(data.policy, data.values);
  } catch (err) {
    showAlert('計算失敗：' + err.message, 'error');
  } finally {
    btnEval.disabled = false;
    btnEval.textContent = '🔍 Evaluate Policy';
  }
});

// ---------- Render Results ----------
function renderResults(policy, values) {
  const obstacleSet = new Set(obstacles);

  // Compute value range for color scaling
  const nums = Object.values(values).filter(v => v !== null);
  const minV = Math.min(...nums);
  const maxV = Math.max(...nums);

  function valueClass(v) {
    if (v === null) return '';
    const norm = maxV > minV ? (v - minV) / (maxV - minV) : 0.5;
    if (norm >= 0.66) return 'val-high';
    if (norm >= 0.33) return 'val-mid';
    return 'val-low';
  }

  function buildMatrix(type) {
    const table = document.createElement('table');
    table.className = 'result-grid';

    for (let r = 0; r < n; r++) {
      const tr = document.createElement('tr');
      for (let c = 0; c < n; c++) {
        const td = document.createElement('td');
        const key = `${r},${c}`;
        const p = policy[key];
        const v = values[key];

        if (p === 'obstacle') {
          td.className = 'r-obs';
        } else if (p === 'goal') {
          td.className = 'r-end';
          td.textContent = type === 'value' ? '0.00' : '★';
        } else if (startCell && startCell.row === r && startCell.col === c) {
          td.className = 'r-start';
          td.textContent = type === 'value' ? v : p;
        } else {
          if (type === 'value') {
            td.className = `r-val ${valueClass(v)}`;
            td.textContent = v !== null ? v.toFixed(2) : '';
          } else {
            td.className = 'r-arrow';
            td.textContent = p || '';
          }
        }

        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    return table;
  }

  // Value Matrix
  const valueContainer  = document.getElementById('value-matrix');
  const policyContainer = document.getElementById('policy-matrix');
  valueContainer.innerHTML  = '';
  policyContainer.innerHTML = '';
  valueContainer.appendChild(buildMatrix('value'));
  policyContainer.appendChild(buildMatrix('policy'));

  resultsSection.style.display = 'block';
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---------- Init ----------
// Set initial active mode button
modeBtns.start.classList.add('active-mode');
