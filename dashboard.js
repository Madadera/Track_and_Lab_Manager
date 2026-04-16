/* ============================================================
   DASHBOARD — Logique JavaScript
   ============================================================ */
   
fetch('data/datas.csv') // "Va chercher ce fichier"
  .then(res => res.text()) // "Quand tu l'as, convertis-le en texte"
  .then(texte => { // "Quand c'est du texte, fais quelque chose avec"
    const lignes = texte.trim().split('\n'); // .trim() supprime les espaces/sauts de ligne en début et fin de texte et .split('\n') découpe le texte à chaque retour à la ligne → on obtient un tableau où chaque case est une ligne du CSV
    const entetes = lignes[0].split(','); // const entetes = lignes[0].split(',') lignes[0] c'est la première ligne (index 0, JS commence toujours à 0). On la découpe par les virgules pour obtenir les noms de colonnes

    // Trouver les indices des colonnes qui nous intéressent
    const colonnes = ['Prénom', 'Nom', 'épreuve', 'Perf'];
    const indices = colonnes.map(col => entetes.indexOf(col));

    // Construire le tableau HTML
    let html = '<table><thead><tr>';
    colonnes.forEach(col => html += `<th>${col}</th>`);
    html += '</tr></thead><tbody>';

    for (let i = 1; i < lignes.length; i++) {
      const cellules = lignes[i].split(',');
      html += '<tr>';
      indices.forEach(idx => html += `<td>${cellules[idx] ?? '—'}</td>`);
      html += '</tr>';
    }

    html += '</tbody></table>';
    document.getElementById('output').innerHTML = html;
  });