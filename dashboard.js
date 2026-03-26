/* ============================================================
   DASHBOARD — Logique JavaScript
   ============================================================ */

// --- État ---
let allRows    = [];   // toutes les lignes du fichier
let headers    = [];   // en-têtes de colonnes
let filtered   = [];   // lignes après filtre de recherche
let currentPage = 1;
const ROWS_PER_PAGE = 20;

// --- Import fichier ---
document.getElementById('fileInput').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (evt) {
    const wb   = XLSX.read(evt.target.result, { type: 'array' });
    const ws   = wb.Sheets[wb.SheetNames[0]];
    const raw  = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

    headers  = raw[0].map(String);
    allRows  = raw.slice(1).filter(r => r.some(c => c !== ''));
    filtered = [...allRows];
    currentPage = 1;

    updateKPIs(file.name);
    renderTable();
  };
  reader.readAsArrayBuffer(file);
  this.value = '';
});

// --- KPIs ---
function updateKPIs(fileName) {
  document.getElementById('kpi-rows').textContent = allRows.length.toLocaleString('fr');
  document.getElementById('kpi-cols').textContent  = headers.length;
  document.getElementById('kpi-file').textContent  = fileName;
}

// --- Rendu du tableau ---
function renderTable() {
  const start = (currentPage - 1) * ROWS_PER_PAGE;
  const slice = filtered.slice(start, start + ROWS_PER_PAGE);

  if (!slice.length) {
    document.getElementById('table-wrapper').innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">&#9783;</div>
        <div class="empty-state__text">Aucun résultat.</div>
      </div>`;
    document.getElementById('pagination').style.display = 'none';
    return;
  }

  // Construction du tableau HTML
  let html = '<table><thead><tr>';
  headers.forEach((h, i) => {
    html += `<th onclick="sortBy(${i})">${h} &#8597;</th>`;
  });
  html += '</tr></thead><tbody>';

  slice.forEach(row => {
    html += '<tr>';
    headers.forEach((_, i) => {
      html += `<td>${row[i] !== undefined ? row[i] : ''}</td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  document.getElementById('table-wrapper').innerHTML = html;

  renderPagination();
}

// --- Pagination ---
function renderPagination() {
  const total = filtered.length;
  const pages = Math.ceil(total / ROWS_PER_PAGE);
  const start = (currentPage - 1) * ROWS_PER_PAGE + 1;
  const end   = Math.min(currentPage * ROWS_PER_PAGE, total);

  document.getElementById('pagination').style.display = 'flex';
  document.getElementById('pagination-info').textContent = `${start}–${end} sur ${total.toLocaleString('fr')} lignes`;

  let btns = `<button class="pagination__btn" ${currentPage === 1 ? 'disabled' : ''} onclick="goPage(${currentPage - 1})">&#8249;</button>`;
  for (let p = Math.max(1, currentPage - 2); p <= Math.min(pages, currentPage + 2); p++) {
    btns += `<button class="pagination__btn ${p === currentPage ? 'pagination__btn--active' : ''}" onclick="goPage(${p})">${p}</button>`;
  }
  btns += `<button class="pagination__btn" ${currentPage === pages ? 'disabled' : ''} onclick="goPage(${currentPage + 1})">&#8250;</button>`;

  document.getElementById('pagination-btns').innerHTML = btns;
}

function goPage(p) {
  currentPage = p;
  renderTable();
}

// --- Recherche ---
function filterTable() {
  const q = document.getElementById('search').value.toLowerCase();
  filtered = q
    ? allRows.filter(row => row.some(c => String(c).toLowerCase().includes(q)))
    : [...allRows];
  currentPage = 1;
  renderTable();
}

// --- Tri ---
let sortDirection = 1;
function sortBy(colIndex) {
  sortDirection *= -1;
  filtered.sort((a, b) => {
    const av = isNaN(a[colIndex]) ? String(a[colIndex]) : parseFloat(a[colIndex]);
    const bv = isNaN(b[colIndex]) ? String(b[colIndex]) : parseFloat(b[colIndex]);
    return av < bv ? -sortDirection : av > bv ? sortDirection : 0;
  });
  renderTable();
}