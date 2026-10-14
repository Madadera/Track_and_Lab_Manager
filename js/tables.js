/* ============================================================
  Tables — Logique JavaScript
   ============================================================ */

// ---------------------------------------------------------------------
// Chargement des fichiers CSV
// ---------------------------------------------------------------------

const datas_club = '../../datas/datas_club.csv';
const datas_groupe = '../../datas/datas.csv';

// Clé = "Catégorie|Sexe|Groupe" → chemin du CSV correspondant
const record = { /* Je crée un objet pour associer chaque combinaison de catégorie, sexe et groupe à un fichier CSV spécifique. */
  'BE|M|Team VA': '../../datas/BE_M_2026_Team_VA_Records.csv',
  'BE|F|Team VA': '../../datas/BE_F_2026_Team_VA_Records.csv',
  'MI|M|Team VA': '../../datas/MI_M_2026_Team_VA_Records.csv',
  'MI|F|Team VA': '../../datas/MI_F_2026_Team_VA_Records.csv',
  'BE|M|Club': '../../datas/BE_M_2026_Club_Records.csv',
  'BE|F|Club': '../../datas/BE_F_2026_Club_Records.csv',
  'MI|M|Club': '../../datas/MI_M_2026_Club_Records.csv',
  'MI|F|Club': '../../datas/MI_F_2026_Club_Records.csv',
  'CA|M|Club': '../../datas/CA_M_2026_Club_Records.csv',
  'CA|F|Club': '../../datas/CA_F_2026_Club_Records.csv',
  'JU|M|Club': '../../datas/JU_M_2026_Club_Records.csv',
  'JU|F|Club': '../../datas/JU_F_2026_Club_Records.csv',
  'ES|M|Club': '../../datas/ES_M_2026_Club_Records.csv',
  'ES|F|Club': '../../datas/ES_F_2026_Club_Records.csv',
  'SE|M|Club': '../../datas/SE_M_2026_Club_Records.csv',
  'SE|F|Club': '../../datas/SE_F_2026_Club_Records.csv',
  'MA|M|Club': '../../datas/MA_M_2026_Club_Records.csv',
  'MA|F|Club': '../../datas/MA_F_2026_Club_Records.csv',
  'TC|M|Club': '../../datas/TC_M_2026_Club_Records.csv',
  'TC|F|Club': '../../datas/TC_F_2026_Club_Records.csv',
};

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

function datalist(idDatalist, donnees, idx) {
    const valeursUniques = [...new Set(
        donnees
            .map(ligne => (ligne[idx] ?? '').trim())
            .filter(valeur => valeur !== '')
    )].sort((a, b) => a.localeCompare(b, 'fr'));

    document.getElementById(idDatalist).innerHTML = valeursUniques
        .map(valeur => `<option value="${valeur}"></option>`)
        .join('');
}

// ---------------------------------------------------------------------
// Fonctions Médailles et Titres
// ---------------------------------------------------------------------

async function medailles() {
    
    try {

        const res = await fetch(datas_club); // Charge le fichier CSV de toutes mes données
        if (!res.ok) throw new Error(`Fichier introuvable : ${datas_club}`); // Vérifie si le fichier CSV a été chargé correctement, sinon lance une erreur
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

// ---------------------------------------------------------------------
// Fonctions Résultats par athlètes
// ---------------------------------------------------------------------

async function athletes() {
    
    try {

        const res = await fetch(datas_club); // Charge le fichier CSV de toutes mes données
        if (!res.ok) throw new Error(`Fichier introuvable : ${datas_club}`); // Vérifie si le fichier CSV a été chargé correctement, sinon lance une erreur
        const texte = await res.text(); // Récupère le contenu du fichier CSV sous forme de texte
        
        const table = parseCSV(texte);  // Transforme le texte CSV en tableau de tableaux (lignes x colonnes)
        const entetes = table[0];       // Récupère la première ligne du tableau qui contient les entêtes de colonnes
        const donnees = table.slice(1); // Récupère toutes les lignes du tableau sauf la première (les données)

        const colonnes = ['Nom', 'Prénom', 'Date', 'Épreuve', 'Performance']; // On crée une constante avec les noms des colonnes qu'on veut afficher
        const indices = colonnes.map(col => entetes.indexOf(col)); // Pour chaque nom de colonne, on cherche son index dans le tableau des entêtes. On obtient un tableau d'indices correspondant à nos colonnes d'intérêt

        const idxEpreuve = entetes.indexOf('Épreuve'); // On mémorise spécifiquement l'index de la colonne "Épreuve" pour pouvoir faire le tri plus tard
        const idxLicence = entetes.indexOf('Licence');
        const idxNom = entetes.indexOf('Nom');
        const idxPrenom = entetes.indexOf('Prénom');

        datalist('liste-licence', donnees, idxLicence);
        datalist('liste-nom', donnees, idxNom);
        datalist('liste-prenom', donnees, idxPrenom);

        const filtreEpreuve = document.getElementById('filtre-epreuve').value;
        const filtreLicence = document.getElementById('filtre-licence').value;
        const filtreNom = document.getElementById('filtre-nom').value;
        const filtrePrenom = document.getElementById('filtre-prenom').value;

        document.getElementById('valeur-epreuve').textContent = filtreEpreuve === '' ? '-' : filtreEpreuve;
        document.getElementById('valeur-licence').textContent = filtreLicence === '' ? '-' : filtreLicence;
        document.getElementById('valeur-nom').textContent = filtreNom === '' ? '-' : filtreNom;
        document.getElementById('valeur-prenom').textContent = filtrePrenom === '' ? '-' : filtrePrenom;

        if (filtreEpreuve === '' && filtreLicence === '' && filtreNom === '' && filtrePrenom === '') {
            document.getElementById('output').innerHTML = '';
            return;
        }

        const filtreEpreuveMin = filtreEpreuve.toLowerCase();
        const filtreLicenceMin = filtreLicence.toLowerCase();
        const filtreNomMin = filtreNom.toLowerCase();
        const filtrePrenomMin = filtrePrenom.toLowerCase();
 
        const lignesFiltrees = donnees.filter(ligne => {
        const cellules = ligne;
        const epreuve = (cellules[idxEpreuve] ?? '').toLowerCase();
        const licence = (cellules[idxLicence] ?? '').toLowerCase();
        const nom = (cellules[idxNom] ?? '').toLowerCase();
        const prenom = (cellules[idxPrenom] ?? '').toLowerCase();

        const matchEpreuve = filtreEpreuveMin === '' || epreuve === filtreEpreuveMin;
        const matchLicence = filtreLicenceMin === '' || licence === filtreLicenceMin;
        const matchNom = filtreNomMin === '' || nom === filtreNomMin;
        const matchPrenom = filtrePrenomMin === '' || prenom === filtrePrenomMin;

        return matchEpreuve && matchLicence && matchNom && matchPrenom;
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

// ---------------------------------------------------------------------
// Fonctions Derniers Résultats
// ---------------------------------------------------------------------

async function results() {

    try {

        const res = await fetch(datas_club); // Charge le fichier CSV de toutes mes données
        if (!res.ok) throw new Error(`Fichier introuvable : ${datas_club}`); // Vérifie si le fichier CSV a été chargé correctement, sinon lance une erreur
        const texte = await res.text(); // Récupère le contenu du fichier CSV sous forme de texte
        
        const table = parseCSV(texte);  // Transforme le texte CSV en tableau de tableaux (lignes x colonnes)
        const entetes = table[0];       // Récupère la première ligne du tableau qui contient les entêtes de colonnes
        const donnees = table.slice(1, 51); // Récupère toutes les lignes du tableau sauf la première (les données)

        const colonnes = ['Nom', 'Prénom', 'Date', 'Épreuve', 'Performance']; // On crée une constante avec les noms des colonnes qu'on veut afficher
        const indices = colonnes.map(col => entetes.indexOf(col)); // Pour chaque nom de colonne, on cherche son index dans le tableau des entêtes. On obtient un tableau d'indices correspondant à nos colonnes d'intérêt

        const idxEpreuve = entetes.indexOf('Épreuve'); // On mémorise spécifiquement l'index de la colonne "Épreuve" pour pouvoir faire le tri plus tard
        const idxNom = entetes.indexOf('Nom');
        const idxPrenom = entetes.indexOf('Prénom');

        datalist('liste-nom', donnees, idxNom);
        datalist('liste-prenom', donnees, idxPrenom);

        const filtreEpreuve = document.getElementById('filtre-epreuve').value;
        const filtreNom = document.getElementById('filtre-nom').value;
        const filtrePrenom = document.getElementById('filtre-prenom').value;

        document.getElementById('valeur-epreuve').textContent = filtreEpreuve === '' ? '-' : filtreEpreuve;
        document.getElementById('valeur-nom').textContent = filtreNom === '' ? '-' : filtreNom;
        document.getElementById('valeur-prenom').textContent = filtrePrenom === '' ? '-' : filtrePrenom;

        const filtreEpreuveMin = filtreEpreuve.toLowerCase();
        const filtreNomMin = filtreNom.toLowerCase();
        const filtrePrenomMin = filtrePrenom.toLowerCase();
 
        const lignesFiltrees = donnees.filter(ligne => {
        const epreuve = (ligne[idxEpreuve] ?? '').toLowerCase();
        const nom = (ligne[idxNom] ?? '').toLowerCase();
        const prenom = (ligne[idxPrenom] ?? '').toLowerCase();

        const matchEpreuve = filtreEpreuveMin === '' || epreuve === filtreEpreuveMin;
        const matchNom = filtreNomMin === '' || nom === filtreNomMin;
        const matchPrenom = filtrePrenomMin === '' || prenom === filtrePrenomMin;

        return matchEpreuve && matchNom && matchPrenom;
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

// ---------------------------------------------------------------------
// Fonctions Records
// ---------------------------------------------------------------------

async function records() {

    const cacheRecords = {};

    try {

        const groupe = document.getElementById('filtre-groupe').value;
        const sexe = document.getElementById('filtre-sexe').value;
        const categorie = document.getElementById('filtre-categorie').value;

        if (!groupe || !sexe || !categorie) { // Tant que les trois filtres ne sont pas choisis, on vide l'affichage
            document.getElementById('output').innerHTML = '';
            return;
        }

        const cle = `${categorie}|${sexe}|${groupe}`; // Clé qui permet de retrouver le bon fichier CSV
        const chemin = record[cle];              // fichiersCSV doit être défini ailleurs dans ton fichier

        if (!chemin) {
            document.getElementById('output').innerHTML = '<p>Aucune donnée disponible pour cette sélection.</p>';
            return;
        }

        // Si le fichier a déjà été chargé, on réutilise le tableau en cache, sinon on le télécharge
        if (!cacheRecords[chemin]) {
            const res = await fetch(chemin);
            if (!res.ok) throw new Error(`Fichier introuvable : ${chemin}`);
            const texte = await res.text();
            cacheRecords[chemin] = parseCSV(texte); // On stocke directement le résultat parsé
        }

        const table = cacheRecords[chemin];
        const entetes = table[0];
        const donnees = table.slice(1);

        const colonnes = ['Épreuve', 'Performance', 'Nom', 'Prénom', 'Date', 'Lieu'];
        const indices = colonnes.map(col => entetes.indexOf(col));

        const idxDate = entetes.indexOf('Date');
        const saisonsRecentes = ['2026', '2027']; // Années à mettre en évidence

        const filtreGroupe = document.getElementById('filtre-groupe').value;
        const filtreSexe = document.getElementById('filtre-sexe').value;
        const filtreCategorie = document.getElementById('filtre-categorie').value;

        document.getElementById('valeur-groupe').textContent = filtreGroupe === '' ? '-' : filtreGroupe;
        document.getElementById('valeur-sexe').textContent = filtreSexe === '' ? '-' : filtreSexe;
        document.getElementById('valeur-categorie').textContent = filtreCategorie === '' ? '-' : filtreCategorie;

        let html = '<table><thead><tr>';
        colonnes.forEach(col => html += `<th>${col}</th>`);
        html += '</tr></thead><tbody>';

        donnees.forEach(ligne => {
            const anneeMatch = (ligne[idxDate] ?? '').match(/\d{4}/);
            const estRecent = anneeMatch && saisonsRecentes.includes(anneeMatch[0]);
            const classeRecente = estRecent ? ' class="ligne-recente"' : '';

            html += `<tr${classeRecente}>`;
            indices.forEach(idx => html += `<td>${ligne[idx] ?? '—'}</td>`);
            html += '</tr>';
        });

        html += '</tbody></table>';
        document.getElementById('output').innerHTML = html;

    } catch (err) {
        console.error(err);
        document.getElementById('output').innerHTML = `<p>Erreur : ${err.message}</p>`;
    }
}