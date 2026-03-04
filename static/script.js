// ===== script.js — GridWorld HW1 =====

// ---------- State ----------
let n = 0;
let mode = 'start';           // 'start' | 'end' | 'obstacle'
let startCell = null;         // { row, col }
let endCell = null;         // { row, col }
let obstacles = new Set();    // Set of "row,col" strings

// ---------- DOM refs ----------
const inputN = document.getElementById('input-n');
const btnGenerate = document.getElementById('btn-generate');
const gridWrapper = document.getElementById('grid-wrapper');
const gridSection = document.getElementById('grid-section');
const resultsSection = document.getElementById('results-section');

const modeBtns = {
  start: document.getElementById('btn-mode-start'),
  end: document.getElementById('btn-mode-end'),
  obstacle: document.getElementById('btn-mode-obs'),
};

const statusStart = document.getElementById('status-start');
const statusEnd = document.getElementById('status-end');
const statusObs = document.getElementById('status-obs');
const btnEval = document.getElementById('btn-evaluate');
const btnReset = document.getElementById('btn-reset');
const alertBox = document.getElementById('alert-box');

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
        showAlert(`最多只能設置 ${n - 2} 個障礙物（n=${n}，n-2=${n - 2}）。`, 'warn');
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
  endCell = null;
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
        n: n,
        start: [startCell.row, startCell.col],
        end: [endCell.row, endCell.col],
        obstacles: obstacleList,
      }),
    });

    if (!resp.ok) throw new Error(`Server error: ${resp.status}`);
    const data = await resp.json();
    renderResults(data.policy, data.values, data.iterations);
  } catch (err) {
    showAlert('計算失敗：' + err.message, 'error');
  } finally {
    btnEval.disabled = false;
    btnEval.textContent = '🔍 Evaluate Policy';
  }
});

// ---------- Render Results ----------
function renderResults(policy, values, iterations) {

  // Dynamic cell size based on grid size
  const cellSize = n <= 6 ? 62 : n <= 7 ? 54 : n <= 8 ? 48 : 44;
  const fontSize = n <= 6 ? '0.82rem' : n <= 7 ? '0.74rem' : '0.68rem';
  const arrowSize = n <= 6 ? '1.1rem' : n <= 7 ? '0.95rem' : '0.82rem';

  // Compute value range for color scaling using only non-trivial non-null values
  const nums = Object.values(values).filter(v => v !== null && v !== 0);
  const nonObsCount = nums.length;
  const uniqueVals = [...new Set(nums.map(v => v.toFixed(2)))];
  const allSame = uniqueVals.length <= 1;
  const minV = allSame ? Math.min(...nums) - 1 : Math.min(...nums);
  const maxV = allSame ? Math.max(...nums) + 1 : Math.max(...nums);

  function valueClass(v) {
    if (v === null) return '';
    const norm = maxV > minV ? (v - minV) / (maxV - minV) : 0.5;
    if (norm >= 0.66) return 'val-high';
    if (norm >= 0.33) return 'val-mid';
    return 'val-low';
  }

  // ---------- Compass builder ----------
  // Renders a 3×3 directional mini-grid for the policy matrix.
  // 'actions' is an array like ['up','left'] from the backend.
  function buildCompassDiv(actions, isStart) {
    const actionSet = new Set(Array.isArray(actions) ? actions : []);

    //  Layout: [ NW | N  | NE ]
    //          [ W  | ·  | E  ]
    //          [ SW | S  | SE ]
    const layout = [
      [null, 'up', null],
      ['left', null, 'right'],
      [null, 'down', null],
    ];
    const arrows = { up: '↑', down: '↓', left: '←', right: '→' };

    const compass = document.createElement('div');
    compass.className = 'arrow-compass';

    for (let gr = 0; gr < 3; gr++) {
      for (let gc = 0; gc < 3; gc++) {
        const cell = document.createElement('div');
        const action = layout[gr][gc];

        if (action === null) {
          // corner or center
          if (gr === 1 && gc === 1) {
            cell.className = 'compass-cell center-dot';
            cell.textContent = '·';
          } else {
            cell.className = 'compass-cell inactive';
            cell.textContent = ' ';
          }
        } else if (actionSet.has(action)) {
          cell.className = 'compass-cell';
          cell.textContent = arrows[action];
        } else {
          cell.className = 'compass-cell inactive';
          cell.textContent = arrows[action]; // present but invisible
        }
        compass.appendChild(cell);
      }
    }
    return compass;
  }

  function buildMatrix(type) {
    const table = document.createElement('table');
    table.className = 'result-grid';

    // --- Header row: corner + column indices ---
    const headerTr = document.createElement('tr');
    // corner cell
    const corner = document.createElement('td');
    corner.className = 'coord-cell';
    corner.style.cssText = `width:${cellSize * 0.55}px; height:${cellSize * 0.55}px;`;
    headerTr.appendChild(corner);
    // col indices
    for (let c = 0; c < n; c++) {
      const th = document.createElement('td');
      th.className = 'coord-cell';
      th.textContent = c;
      th.style.cssText = `width:${cellSize}px; height:${cellSize * 0.55}px; font-size:0.75rem;`;
      headerTr.appendChild(th);
    }
    table.appendChild(headerTr);

    // --- Data rows ---
    for (let r = 0; r < n; r++) {
      const tr = document.createElement('tr');

      // Row index label
      const rowLabel = document.createElement('td');
      rowLabel.className = 'coord-cell';
      rowLabel.textContent = r;
      rowLabel.style.cssText = `width:${cellSize * 0.55}px; height:${cellSize}px; font-size:0.75rem;`;
      tr.appendChild(rowLabel);

      // Data cells
      for (let c = 0; c < n; c++) {
        const td = document.createElement('td');
        td.style.cssText = `width:${cellSize}px; height:${cellSize}px;`;
        const key = `${r},${c}`;
        const p = policy[key];
        const v = values[key];

        if (p === 'obstacle') {
          td.className = 'r-obs';
        } else if (p === 'goal') {
          td.className = 'r-end';
          if (type === 'value') {
            td.innerHTML = `<span style="font-size:${fontSize}">0.00</span>`;
          } else {
            td.innerHTML = `<span style="font-size:1.1rem">★</span>`;
          }
        } else if (startCell && startCell.row === r && startCell.col === c) {
          td.className = 'r-start';
          if (type === 'value') {
            td.innerHTML = `<span style="font-size:${fontSize}">${v !== null ? parseFloat(v).toFixed(2) : ''}</span>`;
          } else {
            // compass for start cell
            td.appendChild(buildCompassDiv(p, true));
          }
        } else {
          if (type === 'value') {
            td.className = `r-val ${valueClass(v)}`;
            td.style.fontSize = fontSize;
            td.textContent = v !== null ? parseFloat(v).toFixed(2) : '';
          } else {
            td.className = 'r-arrow';
            td.appendChild(buildCompassDiv(p, false));
          }
        }

        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    return table;
  }

  // Render matrices
  const valueContainer = document.getElementById('value-matrix');
  const policyContainer = document.getElementById('policy-matrix');
  valueContainer.innerHTML = '';
  policyContainer.innerHTML = '';
  valueContainer.appendChild(buildMatrix('value'));
  policyContainer.appendChild(buildMatrix('policy'));

  // Show convergence stats
  const statsEl = document.getElementById('convergence-stats');
  if (statsEl) {
    statsEl.innerHTML =
      `✅ 收斂完成 &nbsp;|&nbsp; 迭代次數：<strong>${iterations}</strong> sweeps &nbsp;|&nbsp;` +
      ` γ = 0.9 &nbsp;|&nbsp; θ = 1×10⁻⁶ &nbsp;|&nbsp; R = −1`;
    statsEl.style.display = 'block';
  }

  resultsSection.style.display = 'block';
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---------- Init ----------
// Set initial active mode button
modeBtns.start.classList.add('active-mode');
