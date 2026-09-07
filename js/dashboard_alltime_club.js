
  /* ============================================================
   Bilans — Club
   ============================================================ */

fetch('../../datas/datas_club.csv')
  .then(res => res.text())
  .then(texte => {
    const lignes = texte.trim().split('\n');
    const entetes = lignes[0].split(';');

    const colonnes = ['Ranking_Cat', 'Nom', 'Prénom', 'Performance', 'Chronomètre', 'Vent', 'Date'];
    const indices = colonnes.map(col => entetes.indexOf(col));
    const idxEpreuve = entetes.indexOf('Épreuve');
    const idxSexe = entetes.indexOf('Sexe');
    const idxCategorie = entetes.indexOf('Code');
    const idxRanking = entetes.indexOf('Ranking_Cat');
    const donnees = lignes.slice(1);
    const rename = { 'Ranking_Cat': 'Ranking'};

     // On emballe la construction du tableau dans une fonction réutilisable
    function afficherTableau(filtreEpreuve = '', filtreSexe = '', filtreCategorie = '') {
      const filtreEpreuveMin = filtreEpreuve.toLowerCase();
      const filtreSexeMin = filtreSexe.toLowerCase();
      const filtreCategorieMin = filtreCategorie.toLowerCase();

      if (filtreEpreuveMin.trim() === '' || filtreSexeMin.trim() === '' || filtreCategorieMin.trim() === '') {
        document.getElementById('output').innerHTML = '';
        return;
      }

      // On ne garde que les lignes dont le Nom contient la saisie
      const lignesFiltrees = donnees.filter(ligne => {
        const cellules = ligne.split(';');
        const epreuve = (cellules[idxEpreuve] ?? '').toLowerCase();
        const sexe = (cellules[idxSexe] ?? '').toLowerCase();
        const categorie = (cellules[idxCategorie] ?? '').toLowerCase();

        const matchEpreuve = filtreEpreuveMin === '' || epreuve === filtreEpreuveMin;
        const matchSexe = filtreSexeMin === '' || sexe === filtreSexeMin;
        const matchCategorie = filtreCategorieMin === '' || categorie === filtreCategorieMin;

        return matchEpreuve && matchSexe && matchCategorie;
      });

      lignesFiltrees.sort((ligneA, ligneB) => {
        const rankA = Number(ligneA.split(';')[idxRanking]);
        const rankB = Number(ligneB.split(';')[idxRanking]);
        return rankA - rankB;
      });

      let html = '<table><thead><tr>';
      colonnes.forEach(col => html += `<th>${rename[col] ?? col}</th>`);
      html += '</tr></thead><tbody>';

      // On boucle sur lignesFiltrees plutôt que sur toutes les lignes
      lignesFiltrees.forEach(ligne => {
        const cellules = ligne.split(';');
        html += '<tr>';
        indices.forEach(idx => html += `<td>${cellules[idx] ?? '—'}</td>`);
        html += '</tr>';
      });

      html += '</tbody></table>';
      document.getElementById('output').innerHTML = html;
    }

    afficherTableau();

    // À chaque frappe dans l'input, on relance afficherTableau() avec la valeur saisie
    function lireFiltresEtAfficher() {
      const epreuve = document.getElementById('filtre-epreuve').value;
      const sexe = document.getElementById('filtre-sexe').value;
      const categorie = document.getElementById('filtre-categorie').value;

      document.getElementById('valeur-sexe').textContent = sexe === '' ? '-' : sexe;
      document.getElementById('valeur-categorie').textContent = categorie === '' ? '-' : categorie;
      document.getElementById('valeur-epreuve').textContent = epreuve === '' ? '-' : epreuve;

      afficherTableau(epreuve, sexe, categorie);
    }

    document.getElementById('filtre-epreuve').addEventListener('input', lireFiltresEtAfficher);
    document.getElementById('filtre-sexe').addEventListener('input', lireFiltresEtAfficher);
    document.getElementById('filtre-categorie').addEventListener('input', lireFiltresEtAfficher);
  });