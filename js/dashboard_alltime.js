/* ============================================================
   DASHBOARD — Logique JavaScript
   ============================================================ */
   
/* ============================================================
   Bilans — Team VA
   ============================================================ */

fetch('../../datas/datas.csv') // Je récupère le fichier CSV
  .then(res => res.text()) // "Quand tu l'as, convertis-le en texte"
  .then(texte => { // "Quand c'est du texte, fais quelque chose avec, on a une sorte de fonction"
    const lignes = texte.trim().split('\n'); // .trim() supprime les espaces/sauts de ligne en début et fin de texte et .split('\n') découpe le texte à chaque retour à la ligne → on obtient un tableau où chaque case est une ligne du CSV
    const entetes = lignes[0].split(';'); // lignes[0] c'est la première ligne (index 0, JS commence toujours à 0). On la découpe par les points.virgules pour obtenir les noms de colonnes

    // Trouver les indices des colonnes qui nous intéressent
    const colonnes = ['Ranking_Groupe','Nom', 'Prénom', 'Performance', 'Validation', 'Date']; // On crée une constante avec les noms des colonnes qu'on veut afficher
    const indices = colonnes.map(col => entetes.indexOf(col)); // Pour chaque nom de colonne, on cherche son index dans le tableau des entêtes. On obtient un tableau d'indices correspondant à nos colonnes d'intérêt
    const idxEpreuve = entetes.indexOf('Épreuve'); // On mémorise spécifiquement l'index de la colonne "Épreuve" pour pouvoir faire le tri plus tard
    const idxSexe = entetes.indexOf('Sexe');
    const idxCategorie = entetes.indexOf('Code');
    const idxGroupe = entetes.indexOf('Groupe');
    const idxRanking = entetes.indexOf('Ranking_Groupe');
    const donnees = lignes.slice(1); // On isole les lignes de données (sans la ligne d'entête)
    const rename = { 'Ranking_Groupe': 'Ranking'};

     // On emballe la construction du tableau dans une fonction réutilisable
    function afficherTableau(filtreEpreuve = '', filtreSexe = '', filtreCategorie = '', filtreGroupe = '') {
      const filtreEpreuveMin = filtreEpreuve.toLowerCase();
      const filtreSexeMin = filtreSexe.toLowerCase();
      const filtreCategorieMin = filtreCategorie.toLowerCase();
      const filtreGroupeMin = filtreGroupe.toLowerCase();

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
        const groupe = (cellules[idxGroupe] ?? '').toLowerCase();

        const matchEpreuve = filtreEpreuveMin === '' || epreuve === filtreEpreuveMin;
        const matchSexe = filtreSexeMin === '' || sexe === filtreSexeMin;
        const matchCategorie = filtreCategorieMin === '' || categorie === filtreCategorieMin;
        const matchGroupe = filtreGroupeMin === '' || groupe === filtreGroupeMin;

        return matchEpreuve && matchSexe && matchCategorie && matchGroupe;
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
      const groupe = 'Team VA'; // Valeur fixe pour le groupe

      document.getElementById('valeur-sexe').textContent = sexe === '' ? '-' : sexe;
      document.getElementById('valeur-categorie').textContent = categorie === '' ? '-' : categorie;
      document.getElementById('valeur-epreuve').textContent = epreuve === '' ? '-' : epreuve;

      afficherTableau(epreuve, sexe, categorie, groupe);
    }

    document.getElementById('filtre-epreuve').addEventListener('input', lireFiltresEtAfficher);
    document.getElementById('filtre-sexe').addEventListener('input', lireFiltresEtAfficher);
    document.getElementById('filtre-categorie').addEventListener('input', lireFiltresEtAfficher);
  });