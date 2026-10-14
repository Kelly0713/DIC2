/**
 * 50 Startups Multiple Linear Regression Interactive Web Application
 * Application Logic & Visualizations
 */

// =====================================================================
// Forward Selection Results (computed from Python, GaneshSparkz dataset)
// =====================================================================
const FORWARD_SELECTION_RESULTS = [
  { numFeatures: 1, addedFeature: 'R&D Spend',      selectedFeatures: ['R&D Spend'],                                               rmse: 8274.87, r2: 0.9465 },
  { numFeatures: 2, addedFeature: 'Marketing Spend', selectedFeatures: ['R&D Spend','Marketing Spend'],                             rmse: 8198.80, r2: 0.9474 },
  { numFeatures: 3, addedFeature: 'State_New York',  selectedFeatures: ['R&D Spend','Marketing Spend','State_New York'],            rmse: 8309.06, r2: 0.9460 },
  { numFeatures: 4, addedFeature: 'State_Florida',   selectedFeatures: ['R&D Spend','Marketing Spend','State_New York','State_Florida'], rmse: 8409.92, r2: 0.9447 },
  { numFeatures: 5, addedFeature: 'Administration',  selectedFeatures: ['R&D Spend','Marketing Spend','State_New York','State_Florida','Administration'], rmse: 9137.99, r2: 0.9347 }
];

// Dataset mode info
const DATASET_MODES = {
  ds1: {
    badge: 'Kaggle 經典題目實作 • CRISP-DM 框架示範',
    title: '50 Startups <span class="gradient-text">多元線性迴歸</span> 實戰分析平台',
    subtitle: '探索 50 家美國新創公司的研發、行政、行銷開銷與所在地，建立 Multiple Linear Regression 機器學習模型預測 Profit，並掌握避開虛擬變數陷阱 (Dummy Variable Trap) 的關鍵技巧。',
    source: '來源: github.com/harimittapalli',
    kpi: 'kpi-grid-ds1'
  },
  ds2: {
    badge: 'Dataset 2 — GaneshSparkz • Forward Selection 前向特徵選擇',
    title: '50 Startups <span class="gradient-text">Forward Selection</span> 特徵逐步優化',
    subtitle: '使用 GaneshSparkz 版本資料集，以前向逐步選擇法 (Forward Selection) 迭代地從 5 個候選特徵中挑選使 RMSE 最小、R² 最大的最佳特徵組合，並輸出 Markdown 表格格式結果。',
    source: '來源: gist.github.com/GaneshSparkz',
    kpi: 'kpi-grid-ds2'
  },
  custom: {
    badge: '自訂資料輸入模式 • 即時 OLS 訓練與預測',
    title: '自訂資料集 <span class="gradient-text">線性迴歸</span> 即時訓練平台',
    subtitle: '手動輸入或載入新創公司資料，系統將以瀏覽器端 OLS 最小平方法即時訓練多元線性迴歸模型並預測新公司利潤，無需後端伺服器。',
    source: '來源: 自訂輸入資料',
    kpi: 'kpi-grid-custom'
  }
};

// Custom dataset store
let customDataset = [];


const MODEL = {
  intercept: 54028.03959405855,
  coefficients: {
    State_Florida: 938.7930061484353,
    State_New_York: 6.987759966961395,
    RD_Spend: 0.805630063716976,
    Administration: -0.06878788228041097,
    Marketing_Spend: 0.029855442922038025
  },
  metrics: {
    r2: 0.8987266414319833,
    mae: 6961.477813275563,
    mse: 82010363.04501392,
    rmse: 9055.957323497827
  },
  test_samples: [
    { index: 13, rd: 91992.39, admin: 135495.07, marketing: 252664.93, state: 'California', actual: 134307.35, predicted: 126362.88, abs_error: 7944.47 },
    { index: 39, rd: 38558.51, admin: 82982.09, marketing: 174999.30, state: 'California', actual: 81005.76, predicted: 84608.45, abs_error: 3602.69 },
    { index: 30, rd: 61994.48, admin: 115641.28, marketing: 91131.24, state: 'Florida', actual: 99937.59, predicted: 99677.49, abs_error: 260.10 },
    { index: 45, rd: 1000.23, admin: 124153.04, marketing: 1903.93, state: 'New York', actual: 64926.08, predicted: 46357.46, abs_error: 18568.62 },
    { index: 17, rd: 94657.16, admin: 145077.58, marketing: 282574.31, state: 'New York', actual: 125370.37, predicted: 128750.48, abs_error: 3380.11 },
    { index: 48, rd: 542.05, admin: 51743.15, marketing: 0.00, state: 'New York', actual: 35673.41, predicted: 50912.42, abs_error: 15239.01 },
    { index: 26, rd: 75328.87, admin: 144135.98, marketing: 134050.07, state: 'Florida', actual: 105733.54, predicted: 109741.35, abs_error: 4007.81 },
    { index: 25, rd: 64664.71, admin: 139553.16, marketing: 137962.62, state: 'California', actual: 107404.34, predicted: 100643.24, abs_error: 6761.10 },
    { index: 32, rd: 63408.86, admin: 129219.61, marketing: 46085.25, state: 'California', actual: 97427.84, predicted: 97599.28, abs_error: 171.44 },
    { index: 19, rd: 86419.70, admin: 153514.11, marketing: 0.00, state: 'New York', actual: 122776.86, predicted: 113097.43, abs_error: 9679.43 }
  ]
};

// --- Embedded 50 Startups Dataset ---
let startupsData = [
  {"id":1,"R&D Spend":165349.2,"Administration":136897.8,"Marketing Spend":471784.1,"State":"New York","Profit":192261.83},
  {"id":2,"R&D Spend":162597.7,"Administration":151377.59,"Marketing Spend":443898.53,"State":"California","Profit":191792.06},
  {"id":3,"R&D Spend":153441.51,"Administration":101145.55,"Marketing Spend":407934.54,"State":"Florida","Profit":191050.39},
  {"id":4,"R&D Spend":144372.41,"Administration":118671.85,"Marketing Spend":383199.62,"State":"New York","Profit":182901.99},
  {"id":5,"R&D Spend":142107.34,"Administration":91391.77,"Marketing Spend":366168.42,"State":"Florida","Profit":166187.94},
  {"id":6,"R&D Spend":131876.9,"Administration":99814.71,"Marketing Spend":362861.36,"State":"New York","Profit":156991.12},
  {"id":7,"R&D Spend":134615.46,"Administration":147198.87,"Marketing Spend":127716.82,"State":"California","Profit":156122.51},
  {"id":8,"R&D Spend":130298.13,"Administration":145530.06,"Marketing Spend":323876.68,"State":"Florida","Profit":155752.6},
  {"id":9,"R&D Spend":120542.52,"Administration":148718.95,"Marketing Spend":311613.29,"State":"New York","Profit":152211.77},
  {"id":10,"R&D Spend":123334.88,"Administration":108679.17,"Marketing Spend":304981.62,"State":"California","Profit":149759.96},
  {"id":11,"R&D Spend":101913.08,"Administration":110594.11,"Marketing Spend":229160.95,"State":"Florida","Profit":146121.95},
  {"id":12,"R&D Spend":100671.96,"Administration":91790.61,"Marketing Spend":249744.55,"State":"California","Profit":144259.4},
  {"id":13,"R&D Spend":93863.75,"Administration":127320.38,"Marketing Spend":249839.44,"State":"Florida","Profit":141585.52},
  {"id":14,"R&D Spend":91992.39,"Administration":135495.07,"Marketing Spend":252664.93,"State":"California","Profit":134307.35},
  {"id":15,"R&D Spend":119943.24,"Administration":156547.42,"Marketing Spend":256512.92,"State":"Florida","Profit":132602.65},
  {"id":16,"R&D Spend":114523.61,"Administration":122616.84,"Marketing Spend":261776.23,"State":"New York","Profit":129917.04},
  {"id":17,"R&D Spend":78013.11,"Administration":121597.55,"Marketing Spend":264346.06,"State":"California","Profit":126992.93},
  {"id":18,"R&D Spend":94657.16,"Administration":145077.58,"Marketing Spend":282574.31,"State":"New York","Profit":125370.37},
  {"id":19,"R&D Spend":91749.16,"Administration":114175.79,"Marketing Spend":294919.57,"State":"Florida","Profit":124266.9},
  {"id":20,"R&D Spend":86419.7,"Administration":153514.11,"Marketing Spend":0.0,"State":"New York","Profit":122776.86},
  {"id":21,"R&D Spend":76253.86,"Administration":113867.3,"Marketing Spend":298664.47,"State":"California","Profit":118474.03},
  {"id":22,"R&D Spend":78389.47,"Administration":153773.43,"Marketing Spend":299737.29,"State":"New York","Profit":111313.02},
  {"id":23,"R&D Spend":73994.56,"Administration":122782.75,"Marketing Spend":303319.26,"State":"Florida","Profit":110352.25},
  {"id":24,"R&D Spend":67532.53,"Administration":105751.03,"Marketing Spend":304768.73,"State":"Florida","Profit":108733.99},
  {"id":25,"R&D Spend":77044.01,"Administration":99281.34,"Marketing Spend":140574.81,"State":"New York","Profit":108552.04},
  {"id":26,"R&D Spend":64664.71,"Administration":139553.16,"Marketing Spend":137962.62,"State":"California","Profit":107404.34},
  {"id":27,"R&D Spend":75328.87,"Administration":144135.98,"Marketing Spend":134050.07,"State":"Florida","Profit":105733.54},
  {"id":28,"R&D Spend":72107.6,"Administration":127864.55,"Marketing Spend":353183.81,"State":"New York","Profit":105008.31},
  {"id":29,"R&D Spend":66051.52,"Administration":182645.56,"Marketing Spend":118148.2,"State":"Florida","Profit":103282.38},
  {"id":30,"R&D Spend":65605.48,"Administration":153032.06,"Marketing Spend":107138.38,"State":"New York","Profit":101004.64},
  {"id":31,"R&D Spend":61994.48,"Administration":115641.28,"Marketing Spend":91131.24,"State":"Florida","Profit":99937.59},
  {"id":32,"R&D Spend":61136.38,"Administration":152701.92,"Marketing Spend":88218.23,"State":"New York","Profit":97483.56},
  {"id":33,"R&D Spend":63408.86,"Administration":129219.61,"Marketing Spend":46085.25,"State":"California","Profit":97427.84},
  {"id":34,"R&D Spend":55493.95,"Administration":103057.49,"Marketing Spend":214634.81,"State":"Florida","Profit":96778.92},
  {"id":35,"R&D Spend":46426.07,"Administration":157693.92,"Marketing Spend":210797.67,"State":"California","Profit":96712.8},
  {"id":36,"R&D Spend":46014.02,"Administration":85047.44,"Marketing Spend":205517.64,"State":"New York","Profit":96479.51},
  {"id":37,"R&D Spend":28663.76,"Administration":127056.21,"Marketing Spend":201126.82,"State":"Florida","Profit":90708.19},
  {"id":38,"R&D Spend":44069.95,"Administration":51283.14,"Marketing Spend":197029.42,"State":"California","Profit":89949.14},
  {"id":39,"R&D Spend":20229.59,"Administration":65947.93,"Marketing Spend":185265.1,"State":"New York","Profit":81229.06},
  {"id":40,"R&D Spend":38558.51,"Administration":82982.09,"Marketing Spend":174999.3,"State":"California","Profit":81005.76},
  {"id":41,"R&D Spend":28754.33,"Administration":118546.05,"Marketing Spend":172795.67,"State":"California","Profit":78239.91},
  {"id":42,"R&D Spend":27892.92,"Administration":84710.77,"Marketing Spend":164470.71,"State":"Florida","Profit":77798.83},
  {"id":43,"R&D Spend":23640.93,"Administration":96189.63,"Marketing Spend":148001.11,"State":"California","Profit":71498.49},
  {"id":44,"R&D Spend":15505.73,"Administration":127382.3,"Marketing Spend":35534.17,"State":"New York","Profit":69758.98},
  {"id":45,"R&D Spend":22177.74,"Administration":154806.14,"Marketing Spend":28334.72,"State":"California","Profit":65200.33},
  {"id":46,"R&D Spend":1000.23,"Administration":124153.04,"Marketing Spend":1903.93,"State":"New York","Profit":64926.08},
  {"id":47,"R&D Spend":1315.46,"Administration":115816.21,"Marketing Spend":297114.46,"State":"Florida","Profit":49490.75},
  {"id":48,"R&D Spend":0.0,"Administration":135426.92,"Marketing Spend":0.0,"State":"California","Profit":42559.73},
  {"id":49,"R&D Spend":542.05,"Administration":51743.15,"Marketing Spend":0.0,"State":"New York","Profit":35673.41},
  {"id":50,"R&D Spend":0.0,"Administration":116983.8,"Marketing Spend":45173.06,"State":"California","Profit":14681.4}
];

// Active Chart Instances
let charts = {};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavTabs();
  initPredictor();
  initTestTable();
  initDatasetTable();
  initCharts();
  initCodeViewer();
  initGitHubFetcher();
  initCsvExport();
});

// --- Theme Management ---
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const iconMoon = document.getElementById('theme-icon-moon');
  const iconSun = document.getElementById('theme-icon-sun');
  const savedTheme = localStorage.getItem('theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
    refreshChartsTheme();
  });

  function updateThemeIcons(theme) {
    if (theme === 'dark') {
      iconMoon.classList.remove('hidden');
      iconSun.classList.add('hidden');
    } else {
      iconMoon.classList.add('hidden');
      iconSun.classList.remove('hidden');
    }
  }
}

// --- Navigation Tabs ---
function initNavTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  const panes = document.querySelectorAll('.tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }

      // Re-render charts when switching to charts tab to fix canvas resize
      if (targetId === 'tab-charts') {
        setTimeout(renderAllCharts, 100);
      }
    });
  });
}

// --- Interactive Predictor Simulator ---
function initPredictor() {
  const inputRd = document.getElementById('input-rd');
  const sliderRd = document.getElementById('slider-rd');
  const inputAdmin = document.getElementById('input-admin');
  const sliderAdmin = document.getElementById('slider-admin');
  const inputMarketing = document.getElementById('input-marketing');
  const sliderMarketing = document.getElementById('slider-marketing');
  const stateOptions = document.querySelectorAll('.state-option');
  const presetSelect = document.getElementById('preset-select');

  // Sync inputs and sliders
  function bindSync(input, slider) {
    slider.addEventListener('input', () => {
      input.value = slider.value;
      calculateProfit();
    });
    input.addEventListener('input', () => {
      slider.value = input.value;
      calculateProfit();
    });
  }

  bindSync(inputRd, sliderRd);
  bindSync(inputAdmin, sliderAdmin);
  bindSync(inputMarketing, sliderMarketing);

  // State radio selection
  stateOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      stateOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      calculateProfit();
    });
  });

  // Presets
  presetSelect.addEventListener('change', () => {
    const val = presetSelect.value;
    if (val === 'high-tech') {
      setValues(180000, 120000, 350000, 'California');
    } else if (val === 'balanced') {
      setValues(90000, 115000, 220000, 'New York');
    } else if (val === 'marketing-heavy') {
      setValues(50000, 100000, 420000, 'Florida');
    } else if (val === 'lean') {
      setValues(25000, 75000, 50000, 'California');
    }
  });

  function setValues(rd, admin, marketing, state) {
    inputRd.value = rd; sliderRd.value = rd;
    inputAdmin.value = admin; sliderAdmin.value = admin;
    inputMarketing.value = marketing; sliderMarketing.value = marketing;

    stateOptions.forEach(opt => {
      const radio = opt.querySelector('input[type="radio"]');
      if (radio && radio.value === state) {
        opt.classList.add('active');
        radio.checked = true;
      } else {
        opt.classList.remove('active');
      }
    });
    calculateProfit();
  }

  // Initial calculation
  calculateProfit();
}

function calculateProfit() {
  const rd = parseFloat(document.getElementById('input-rd').value) || 0;
  const admin = parseFloat(document.getElementById('input-admin').value) || 0;
  const marketing = parseFloat(document.getElementById('input-marketing').value) || 0;

  const stateChecked = document.querySelector('input[name="state-choice"]:checked');
  const state = stateChecked ? stateChecked.value : 'California';

  let stateVal = 0;
  let stateLabel = 'California (基準組)';
  if (state === 'Florida') {
    stateVal = MODEL.coefficients.State_Florida;
    stateLabel = 'Florida (+ $938.79)';
  } else if (state === 'New York') {
    stateVal = MODEL.coefficients.State_New_York;
    stateLabel = 'New York (+ $6.99)';
  }

  const rdImpact = rd * MODEL.coefficients.RD_Spend;
  const adminImpact = admin * MODEL.coefficients.Administration;
  const marketingImpact = marketing * MODEL.coefficients.Marketing_Spend;

  const totalProfit = MODEL.intercept + stateVal + rdImpact + adminImpact + marketingImpact;

  // Update UI amounts
  const profitElem = document.getElementById('predicted-profit-val');
  profitElem.textContent = formatCurrency(totalProfit);

  // Confidence interval: Profit +- 1.96 * RMSE
  const margin = 1.96 * MODEL.metrics.rmse;
  const lowerBound = Math.max(0, totalProfit - margin);
  const upperBound = totalProfit + margin;
  document.getElementById('pred-interval').textContent = `${formatCurrency(lowerBound)} ~ ${formatCurrency(upperBound)}`;

  // Update Waterfall breakdown
  document.getElementById('wf-rd-calc').textContent = `$${formatNumber(rd)} × 0.8056`;
  document.getElementById('wf-rd-val').textContent = `+${formatCurrency(rdImpact)}`;

  document.getElementById('wf-admin-calc').textContent = `$${formatNumber(admin)} × -0.0688`;
  document.getElementById('wf-admin-val').textContent = formatCurrency(adminImpact);

  document.getElementById('wf-marketing-calc').textContent = `$${formatNumber(marketing)} × 0.0299`;
  document.getElementById('wf-marketing-val').textContent = `+${formatCurrency(marketingImpact)}`;

  document.getElementById('wf-state-calc').textContent = stateLabel;
  document.getElementById('wf-state-val').textContent = (stateVal >= 0 ? '+' : '') + formatCurrency(stateVal);
}

// --- Test Set Comparison Table ---
function initTestTable() {
  const tbody = document.getElementById('test-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  MODEL.test_samples.forEach(s => {
    const errorPct = ((s.abs_error / s.actual) * 100).toFixed(1);
    let badgeClass = 'badge-success';
    let badgeText = `優秀 (誤差 ${errorPct}%)`;

    if (errorPct > 15) {
      badgeClass = 'badge-warning';
      badgeText = `偏高 (誤差 ${errorPct}%)`;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>#${s.index + 1}</strong></td>
      <td><span class="state-tag state-${s.state.toLowerCase().replace(' ', '-')}">${s.state}</span></td>
      <td>$${formatNumber(s.rd)}</td>
      <td>$${formatNumber(s.admin)}</td>
      <td>$${formatNumber(s.marketing)}</td>
      <td><strong>${formatCurrency(s.actual)}</strong></td>
      <td><strong style="color: var(--secondary);">${formatCurrency(s.predicted)}</strong></td>
      <td>${formatCurrency(s.abs_error)}</td>
      <td><span class="badge ${badgeClass}">${badgeText}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// --- 50 Startups Dataset Table ---
function initDatasetTable() {
  const tbody = document.getElementById('dataset-tbody');
  const searchInput = document.getElementById('dataset-search');
  const chips = document.querySelectorAll('.filter-chips .chip');

  let activeFilter = 'ALL';
  let searchTerm = '';

  function renderTable() {
    tbody.innerHTML = '';
    const filtered = startupsData.filter(item => {
      const matchState = (activeFilter === 'ALL' || item.State === activeFilter);
      const matchSearch = searchTerm === '' || 
        item.State.toLowerCase().includes(searchTerm) ||
        item['R&D Spend'].toString().includes(searchTerm) ||
        item['Profit'].toString().includes(searchTerm);
      return matchState && matchSearch;
    });

    filtered.forEach((row, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.id || idx + 1}</td>
        <td>$${formatNumber(row['R&D Spend'])}</td>
        <td>$${formatNumber(row['Administration'])}</td>
        <td>$${formatNumber(row['Marketing Spend'])}</td>
        <td><span class="state-tag state-${row.State.toLowerCase().replace(' ', '-')}">${row.State}</span></td>
        <td><strong>$${formatNumber(row['Profit'])}</strong></td>
      `;
      tbody.appendChild(tr);
    });
  }

  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.trim().toLowerCase();
    renderTable();
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.getAttribute('data-state');
      renderTable();
    });
  });

  renderTable();
}

// --- Charts Rendering via Chart.js ---
function initCharts() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded. Will retry...');
    return;
  }
  renderAllCharts();
}

function renderAllCharts() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const textColor = isDark ? '#94a3b8' : '#475569';

  // 1. Actual vs Predicted Scatter Chart
  const ctxScatter = document.getElementById('actualVsPredChart');
  if (ctxScatter) {
    if (charts.scatter) charts.scatter.destroy();

    const scatterPoints = MODEL.test_samples.map(s => ({
      x: s.actual,
      y: s.predicted,
      state: s.state,
      idx: s.index + 1
    }));

    charts.scatter = new Chart(ctxScatter, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: '測試集新創公司 (Test Startups)',
            data: scatterPoints,
            backgroundColor: '#6366f1',
            borderColor: '#ffffff',
            borderWidth: 1.5,
            pointRadius: 6,
            pointHoverRadius: 9
          },
          {
            label: '完美預測線 (y = x)',
            data: [
              { x: 30000, y: 30000 },
              { x: 150000, y: 150000 }
            ],
            type: 'line',
            borderColor: '#ef4444',
            borderWidth: 2,
            borderDash: [6, 4],
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: textColor } },
          tooltip: {
            callbacks: {
              label: function(ctx) {
                const pt = ctx.raw;
                if (!pt.idx) return ctx.dataset.label;
                return `#${pt.idx} (${pt.state}): 實際 $${formatNumber(pt.x)} | 預測 $${formatNumber(pt.y)}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Actual Profit (實際利潤 $)', color: textColor },
            grid: { color: gridColor },
            ticks: { color: textColor, callback: val => `$${val/1000}k` }
          },
          y: {
            title: { display: true, text: 'Predicted Profit (預測利潤 $)', color: textColor },
            grid: { color: gridColor },
            ticks: { color: textColor, callback: val => `$${val/1000}k` }
          }
        }
      }
    });
  }

  // 2. Feature Correlation Bar Chart
  const ctxCorr = document.getElementById('featureImportanceChart');
  if (ctxCorr) {
    if (charts.corr) charts.corr.destroy();
    charts.corr = new Chart(ctxCorr, {
      type: 'bar',
      data: {
        labels: ['研發支出 (R&D)', '行銷支出 (Marketing)', '行政支出 (Admin)', '佛州 (Florida)', '紐約 (New York)'],
        datasets: [{
          label: '與利潤之皮爾森相關係數 (r)',
          data: [0.9729, 0.7478, 0.2007, 0.1162, 0.0314],
          backgroundColor: [
            'rgba(99, 102, 241, 0.85)',
            'rgba(6, 182, 212, 0.85)',
            'rgba(245, 158, 11, 0.85)',
            'rgba(16, 185, 129, 0.85)',
            'rgba(236, 72, 153, 0.85)'
          ],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor } },
          y: {
            min: 0,
            max: 1.0,
            grid: { color: gridColor },
            ticks: { color: textColor }
          }
        }
      }
    });
  }

  // 3. State Analysis Chart
  const ctxState = document.getElementById('stateAnalysisChart');
  if (ctxState) {
    if (charts.state) charts.state.destroy();
    charts.state = new Chart(ctxState, {
      type: 'bar',
      data: {
        labels: ['California (17家)', 'Florida (16家)', 'New York (17家)'],
        datasets: [
          {
            label: '平均利潤 (Avg Profit)',
            data: [103905, 118774, 113756],
            backgroundColor: 'rgba(16, 185, 129, 0.85)',
            borderRadius: 6
          },
          {
            label: '平均研發支出 (Avg R&D)',
            data: [64657, 80724, 76195],
            backgroundColor: 'rgba(99, 102, 241, 0.85)',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: textColor } } },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor } },
          y: {
            grid: { color: gridColor },
            ticks: { color: textColor, callback: val => `$${val/1000}k` }
          }
        }
      }
    });
  }

  // 4. Residuals Chart
  const ctxResiduals = document.getElementById('residualsChart');
  if (ctxResiduals) {
    if (charts.residuals) charts.residuals.destroy();
    charts.residuals = new Chart(ctxResiduals, {
      type: 'bar',
      data: {
        labels: MODEL.test_samples.map(s => `#${s.index + 1}`),
        datasets: [{
          label: '殘差 (Actual - Predicted)',
          data: MODEL.test_samples.map(s => s.actual - s.predicted),
          backgroundColor: MODEL.test_samples.map(s => (s.actual - s.predicted) >= 0 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(244, 63, 94, 0.8)'),
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `殘差: $${formatNumber(ctx.raw)}`
            }
          }
        },
        scales: {
          x: { title: { display: true, text: '測試樣本編號', color: textColor }, grid: { color: gridColor }, ticks: { color: textColor } },
          y: {
            title: { display: true, text: '預測誤差 ($)', color: textColor },
            grid: { color: gridColor },
            ticks: { color: textColor, callback: val => `$${val/1000}k` }
          }
        }
      }
    });
  }
}

function refreshChartsTheme() {
  renderAllCharts();
}

// --- Python Code Viewer & Copy ---
function initCodeViewer() {
  const codeElem = document.getElementById('python-code-display');
  const copyBtn = document.getElementById('btn-copy-code');
  const copyText = document.getElementById('copy-text');

  fetch('startup_regression.py')
    .then(res => res.text())
    .then(text => {
      codeElem.textContent = text;
    })
    .catch(() => {
      codeElem.textContent = '# 無法從本地讀取檔案，請直接從頂部按鈕下載 startup_regression.py';
    });

  copyBtn.addEventListener('click', () => {
    const code = codeElem.textContent;
    navigator.clipboard.writeText(code).then(() => {
      copyText.textContent = '已複製！';
      showToast('✓ 完整 Python 程式碼已成功複製到剪貼簿！');
      setTimeout(() => {
        copyText.textContent = '複製代碼';
      }, 2500);
    }).catch(() => {
      showToast('複製失敗，請手動全選複製。');
    });
  });
}

// --- Live GitHub Fetcher ---
function initGitHubFetcher() {
  const btn = document.getElementById('btn-refetch-github');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span class="loading-spin"></span> 正在連線 GitHub...`;

    const url = 'https://raw.githubusercontent.com/harimittapalli/Mulitple-Linear-Reggression/master/50_Startups.csv';
    try {
      const response = await fetch(url);
      if (response.ok) {
        const csvText = await response.text();
        parseAndLoadCsv(csvText);
        showToast('✓ 成功從 GitHub 擷取最新 50_Startups.csv (HTTP 200 OK)');
      } else {
        showToast(`❌ 擷取失敗，HTTP 狀態碼: ${response.status}`);
      }
    } catch (err) {
      showToast(`⚠️ 連線錯誤 (可能受限於瀏覽器 CORS)，已維持本地資料庫`);
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  });

  function parseAndLoadCsv(csvText) {
    const lines = csvText.trim().split('\n');
    const header = lines[0].split(',').map(h => h.trim());
    const newData = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const parts = lines[i].split(',').map(p => p.trim());
      newData.push({
        id: i,
        'R&D Spend': parseFloat(parts[0]) || 0,
        'Administration': parseFloat(parts[1]) || 0,
        'Marketing Spend': parseFloat(parts[2]) || 0,
        'State': parts[3],
        'Profit': parseFloat(parts[4]) || 0
      });
    }

    if (newData.length > 0) {
      startupsData = newData;
      initDatasetTable();
    }
  }
}

// --- CSV Export ---
function initCsvExport() {
  const btn = document.getElementById('btn-export-csv');
  if (!btn) return;

  btn.addEventListener('click', () => {
    let csvContent = "data:text/csv;charset=utf-8,R&D Spend,Administration,Marketing Spend,State,Profit\n";
    startupsData.forEach(row => {
      csvContent += `${row['R&D Spend']},${row['Administration']},${row['Marketing Spend']},${row['State']},${row['Profit']}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "50_Startups_Export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✓ 已將 50 家新創公司資料匯出為 CSV 檔');
  });
}

// --- Toast Feedback ---
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}

// --- Formatting Helpers ---
function formatNumber(num) {
  if (isNaN(num)) return '0';
  return Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatCurrency(num) {
  if (isNaN(num)) return '$0.00';
  const prefix = num < 0 ? '-$' : '$';
  return prefix + Math.abs(Number(num)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
