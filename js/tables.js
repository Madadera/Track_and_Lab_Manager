/* ============================================================
  Tables — Logique JavaScript
   ============================================================ */

// ---------------------------------------------------------------------
// Fonctions utilitaires
// ---------------------------------------------------------------------

function parseCSV(texte) {                                          // Transforme un texte CSV en tableau de tableaux (lignes x colonnes)
  return texte                                                      // Renvoie la variable texte
    .replace(/^\uFEFF/, "")                                         // Supprime un caractère spécial appelé BOM (Byte Order Mark) s’il est présent au début
    .trim()                                                         // Surpprime les espaces superflus
    .split(/\r?\n/)                                                 // Découpe le texte en ligne
    .map(ligne => ligne.split(";").map(cellule => cellule.trim())); // le .map(ligne => [...] permet d'appliquer une transformation à chaque ligne. Donc le .map(cellule [...] applique une transformation à chaque cellule
}

// ---------------------------------------------------------------------
// Fonctions Médailles et Titres
// ---------------------------------------------------------------------
async function medailles() {
    
    try {

        const res = await fetch('../../datas/datas_club.csv'); // Charge le fichier CSV de toutes mes données
        if (!res.ok) throw new Error(`Fichier introuvable : ../../datas/datas_club.csv`); // Vérifie si le fichier CSV a été chargé correctement, sinon lance une erreur
        const texte = await res.text(); // Récupère le contenu du fichier CSV sous forme de texte
        
        const table = parseCSV(texte);  // Transforme le texte CSV en tableau de tableaux (lignes x colonnes)
        const entetes = table[0];       // Récupère la première ligne du tableau qui contient les entêtes de colonnes
        const donnees = table.slice(1); // Récupère toutes les lignes du tableau sauf la première (les données)

        const colonnes = ['Nom', 'Prénom', 'Date', 'Épreuve', 'Performance', 'Médaille', 'Titre']; // On crée une constante avec les noms des colonnes qu'on veut afficher
        const indices = colonnes.map(col => entetes.indexOf(col)); // Pour chaque nom de colonne, on cherche son index dans le tableau des entêtes. On obtient un tableau d'indices correspondant à nos colonnes d'intérêt

        const idxEpreuve = entetes.indexOf('Épreuve'); // On mémorise spécifiquement l'index de la colonne "Épreuve" pour pouvoir faire le tri plus tard
        const idxmedailles = entetes.indexOf('Médaille');
        const idxSexe = entetes.indexOf('Sexe');
        const idxCategorie = entetes.indexOf('Code');

        const filtreMedailles = document.getElementById('filtre-medailles').value;
        const filtreEpreuve = document.getElementById('filtre-epreuve').value;
        const filtreSexe = document.getElementById('filtre-sexe').value;
        const filtreCategorie = document.getElementById('filtre-categorie').value;

        document.getElementById('valeur-medailles').textContent = filtreMedailles === '' ? '-' : filtreMedailles;
        document.getElementById('valeur-sexe').textContent = filtreSexe === '' ? '-' : filtreSexe;
        document.getElementById('valeur-categorie').textContent = filtreCategorie === '' ? '-' : filtreCategorie;
        document.getElementById('valeur-epreuve').textContent = filtreEpreuve === '' ? '-' : filtreEpreuve;

        const filtreMedaillesMin = filtreMedailles.toLowerCase();
        const filtreEpreuveMin = filtreEpreuve.toLowerCase();
        const filtreSexeMin = filtreSexe.toLowerCase();
        const filtreCategorieMin = filtreCategorie.toLowerCase();

         // Cas normal : Épreuve, sexe et catégorie tous remplis
        const filtresPrincipauxComplets = filtreEpreuveMin.trim() !== '' && filtreSexeMin.trim() !== '' && filtreCategorieMin.trim() !== '';
        // Cas particulier demandé : Médailles rempli fait afficher le tableau quoi qu'il arrive
        const medailleRenseignee = filtreMedaillesMin.trim() !== '';
 
        if (!filtresPrincipauxComplets && !medailleRenseignee) {
            document.getElementById('output').innerHTML = '';
            return;
        }
 
        const lignesFiltrees = donnees.filter(ligne => {
        const cellules = ligne;
        const medailles = (cellules[idxmedailles] ?? '').toLowerCase();
        const epreuve = (cellules[idxEpreuve] ?? '').toLowerCase();
        const sexe = (cellules[idxSexe] ?? '').toLowerCase();
        const categorie = (cellules[idxCategorie] ?? '').toLowerCase();

        const matchEpreuve = filtreEpreuveMin === '' || epreuve === filtreEpreuveMin;
        const matchSexe = filtreSexeMin === '' || sexe === filtreSexeMin;
        const matchCategorie = filtreCategorieMin === '' || categorie === filtreCategorieMin;
        const matchMedailles = filtreMedaillesMin === '' || medailles === filtreMedaillesMin;

        return matchEpreuve && matchSexe && matchCategorie && matchMedailles;
    });
    
        let html = '<table><thead><tr>';
        colonnes.forEach(col => html += `<th>${col}</th>`);
        html += '</tr></thead><tbody>';

      // On boucle sur lignesFiltrees plutôt que sur toutes les lignes
        lignesFiltrees.forEach(ligne => {
            const cellules = ligne;
            html += '<tr>';
            indices.forEach(idx => html += `<td>${cellules[idx] ?? '—'}</td>`);
            html += '</tr>';
        });

      html += '</tbody></table>';
      document.getElementById('output').innerHTML = html;
      
    } catch (err) {
        console.error(err);
        document.getElementById('output').innerHTML = `<p>Erreur : ${err.message}</p>`;
    }
}