/* ============================================================
   DASHBOARD — Logique JavaScript
   ============================================================ */
   
fetch('data/datas.csv')
  .then(res => res.text())
  .then(texte => {
    document.getElementById('output').innerText = texte;
  });