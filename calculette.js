/* ============================================================
   CALCULETTE — Logique JavaScript
   ============================================================ */

// Table de correspondance : catégorie → points de base
// TODO : remplacer par vos vraies valeurs
const SCORE_TABLE = {
  A: 100,
  B: 75,
  C: 50,
  D: 25,
};

// Historique des calculs (session en cours)
let history = [];

// --- Calcul principal ---
function calculate() {
  const cat   = document.getElementById('cat').value;
  const perf  = parseFloat(document.getElementById('perf').value)  || 0;
  const coeff = parseFloat(document.getElementById('coeff').value) || 1;
  const bonus = parseFloat(document.getElementById('bonus').value) || 0;

  const base  = SCORE_TABLE[cat] || 0;

  // Formule : (base × performance/100 × coefficient) + bonus
  // TODO : adapter cette formule à votre logique réelle
  const score = Math.round((base * (perf / 100) * coeff) + bonus);

  // Affichage du résultat
  document.getElementById('result-value').textContent = score;
  document.getElementById('result-formula').textContent =
    `(${base} × ${perf}/100 × ${coeff}) + ${bonus} = ${score} pts`;

  // Ajout à l'historique
  addToHistory({ cat, perf, coeff, bonus, score });
}

// --- Historique ---
function addToHistory(entry) {
  entry.time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  history.unshift(entry);
  if (history.length > 10) history.pop();
  renderHistory();
}

function renderHistory() {
  if (!history.length) return;

  let html = '<table><thead><tr><th>Heure</th><th>Catégorie</th><th>Performance</th><th>Coefficient</th><th>Bonus</th><th>Score</th></tr></thead><tbody>';
  history.forEach(h => {
    html += `<tr>
      <td>${h.time}</td>
      <td>${h.cat}</td>
      <td>${h.perf}</td>
      <td>${h.coeff}</td>
      <td>${h.bonus}</td>
      <td style="font-weight:700;color:var(--accent)">${h.score}</td>
    </tr>`;
  });
  html += '</tbody></table>';

  document.getElementById('history').innerHTML = html;
}

// --- Init ---
calculate();
