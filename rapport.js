/* ============================================================
   RAPPORT — Logique JavaScript
   ============================================================ */

// Couleurs Chart.js alignées avec le thème
const CHART_COLORS = {
  blue:  '#4a9eff',
  blue2: '#1e4080',
  white: '#d0dce8',
  grid:  '#2a4a72',
};

// Paramètres communs pour les axes Chart.js
const AXIS_STYLE = {
  ticks: { color: CHART_COLORS.white, font: { size: 11 } },
  grid:  { color: CHART_COLORS.grid },
};

// -------------------------------------------------------
// Exemple de graphique 1 — Barres
// TODO : remplacer labels/data par vos vraies données
// -------------------------------------------------------
function renderChart1() {
  const placeholder = document.getElementById('chart-1-placeholder');
  const canvas      = document.getElementById('chart-1');

  // Données d'exemple — remplacer ici
  const labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
  const data   = [12, 19, 8, 15, 22, 18];

  placeholder.style.display = 'none';
  canvas.style.display      = 'block';
  canvas.height             = 260;

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Valeurs',
        data,
        backgroundColor: CHART_COLORS.blue + 'aa',
        borderColor:     CHART_COLORS.blue,
        borderWidth: 1,
        borderRadius: 4,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: CHART_COLORS.white } } },
      scales: { x: AXIS_STYLE, y: AXIS_STYLE },
    },
  });
}

// -------------------------------------------------------
// Exemple de graphique 2 — Donut
// TODO : remplacer labels/data par vos vraies données
// -------------------------------------------------------
function renderChart2() {
  const placeholder = document.getElementById('chart-2-placeholder');
  const canvas      = document.getElementById('chart-2');

  const labels = ['Catégorie A', 'Catégorie B', 'Catégorie C'];
  const data   = [40, 35, 25];

  placeholder.style.display = 'none';
  canvas.style.display      = 'block';
  canvas.height             = 260;

  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#4a9eff', '#1b3358', '#2a4a72'],
        borderColor:     '#0d1b2a',
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { color: CHART_COLORS.white, padding: 16 } } },
    },
  });
}

// -------------------------------------------------------
// Exemple de graphique 3 — Ligne
// TODO : remplacer labels/data par vos vraies données
// -------------------------------------------------------
function renderChart3() {
  const placeholder = document.getElementById('chart-3-placeholder');
  const canvas      = document.getElementById('chart-3');

  const labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];
  const data   = [30, 45, 38, 52, 60, 55, 70, 65];

  placeholder.style.display = 'none';
  canvas.style.display      = 'block';
  canvas.height             = 240;

  new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Évolution',
        data,
        borderColor:     CHART_COLORS.blue,
        backgroundColor: CHART_COLORS.blue + '22',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: CHART_COLORS.white } } },
      scales: { x: AXIS_STYLE, y: AXIS_STYLE },
    },
  });
}

// -------------------------------------------------------
// KPIs — TODO : brancher sur vos vraies données
// -------------------------------------------------------
function updateKPIs() {
  // Remplacez ces valeurs par vos calculs réels
  document.getElementById('kpi-1').textContent = '—';
  document.getElementById('kpi-2').textContent = '—';
  document.getElementById('kpi-3').textContent = '—';
  document.getElementById('kpi-4').textContent = '—';
}

// --- Init ---
updateKPIs();
renderChart1();
renderChart2();
renderChart3();
