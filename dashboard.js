/* ============================================================
   DASHBOARD — Logique JavaScript
   ============================================================ */
   
fetch('datas/datas.csv') // "Va chercher ce fichier"
  .then(res => res.text()) // "Quand tu l'as, convertis-le en texte"
  .then(texte => { // "Quand c'est du texte, fais quelque chose avec, on a une sorte de fonction"
    const lignes = texte.trim().split('\n'); // .trim() supprime les espaces/sauts de ligne en début et fin de texte et .split('\n') découpe le texte à chaque retour à la ligne → on obtient un tableau où chaque case est une ligne du CSV
    const entetes = lignes[0].split(';'); // lignes[0] c'est la première ligne (index 0, JS commence toujours à 0). On la découpe par les virgules pour obtenir les noms de colonnes

    // Trouver les indices des colonnes qui nous intéressent
    const colonnes = ['Nom', 'Épreuve', 'Performance', 'Points Jeunes', 'Points Hongrois', 'Lieu', 'Compétition', 'Record', 'Date']; // On crée une constante avec les noms des colonnes qu'on veut afficher
    const indices = colonnes.map(col => entetes.indexOf(col)); // Pour chaque nom de colonne, on cherche son index dans le tableau des entêtes. On obtient un tableau d'indices correspondant à nos colonnes d'intérêt
    const idxNom = entetes.indexOf('Nom'); // On mémorise spécifiquement l'index de la colonne "Nom" pour pouvoir faire le tri plus tard
    const donnees = lignes.slice(1); // On isole les lignes de données (sans la ligne d'entête)

     // 🆕 On emballe la construction du tableau dans une fonction réutilisable
    function afficherTableau(filtre = '') {
      const filtreMin = filtre.toLowerCase(); // 🆕 On met le filtre en minuscules pour comparer sans tenir compte de la casse

      // 🆕 On ne garde que les lignes dont le Nom contient la saisie
      const lignesFiltrees = donnees.filter(ligne => {
        const cellules = ligne.split(';');
        const nom = (cellules[idxNom] ?? '').toLowerCase();
        return nom.includes(filtreMin);
      });

      let html = '<table><thead><tr>';
      colonnes.forEach(col => html += `<th>${col}</th>`);
      html += '</tr></thead><tbody>';

      // 🆕 On boucle sur lignesFiltrees plutôt que sur toutes les lignes
      lignesFiltrees.forEach(ligne => {
        const cellules = ligne.split(';');
        html += '<tr>';
        indices.forEach(idx => html += `<td>${cellules[idx] ?? '—'}</td>`);
        html += '</tr>';
      });

      html += '</tbody></table>';
      document.getElementById('output').innerHTML = html;
    }

    afficherTableau(); // 🆕 Premier affichage : filtre vide = tout le tableau

    // 🆕 À chaque frappe dans l'input, on relance afficherTableau() avec la valeur saisie
    document.getElementById('filtre-nom').addEventListener('input', e => {
      afficherTableau(e.target.value);
    });
  });