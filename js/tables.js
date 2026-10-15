/* ============================================================
  Tables — Logique JavaScript
   ============================================================ */

// ---------------------------------------------------------------------
// Chargement des fichiers CSV
// ---------------------------------------------------------------------

const datas_club = '../../datas/datas_club.csv'; // Chemin vers le fichier CSV contenant les données du club
const datas_groupe = '../../datas/datas.csv';    // Chemin vers le fichier CSV contenant les données des groupes

const record = {                                               // Je crée un objet pour associer chaque combinaison de catégorie, sexe et groupe à un fichier CSV spécifique.
  'BE|M|Team VA': '../../datas/BE_M_2026_Team_VA_Records.csv', // Fichier CSV des records de la Team VA Benjamins
  'BE|F|Team VA': '../../datas/BE_F_2026_Team_VA_Records.csv', // Fichier CSV des records de la Team VA Benjamines
  'MI|M|Team VA': '../../datas/MI_M_2026_Team_VA_Records.csv', // Fichier CSV des records de la Team VA Minimes Hommes
  'MI|F|Team VA': '../../datas/MI_F_2026_Team_VA_Records.csv', // Fichier CSV des records de la Team VA Minimes Femmes
  'BE|M|Club': '../../datas/BE_M_2026_Club_Records.csv',       // Fichier CSV des records du club Benjamins
  'BE|F|Club': '../../datas/BE_F_2026_Club_Records.csv',       // Fichier CSV des records du club Benjamines
  'MI|M|Club': '../../datas/MI_M_2026_Club_Records.csv',       // Fichier CSV des records du club Minimes Hommes
  'MI|F|Club': '../../datas/MI_F_2026_Club_Records.csv',       // Fichier CSV des records du club Minimes Femmes
  'CA|M|Club': '../../datas/CA_M_2026_Club_Records.csv',       // Fichier CSV des records du club Cadets
  'CA|F|Club': '../../datas/CA_F_2026_Club_Records.csv',       // Fichier CSV des records du club Cadettes
  'JU|M|Club': '../../datas/JU_M_2026_Club_Records.csv',       // Fichier CSV des records du club Juniors Hommes
  'JU|F|Club': '../../datas/JU_F_2026_Club_Records.csv',       // Fichier CSV des records du club Juniors Femmes
  'ES|M|Club': '../../datas/ES_M_2026_Club_Records.csv',       // Fichier CSV des records du club Espoirs Hommes
  'ES|F|Club': '../../datas/ES_F_2026_Club_Records.csv',       // Fichier CSV des records du club Espoirs Femmes
  'SE|M|Club': '../../datas/SE_M_2026_Club_Records.csv',       // Fichier CSV des records du club Séniors Hommes
  'SE|F|Club': '../../datas/SE_F_2026_Club_Records.csv',       // Fichier CSV des records du club Séniors Femmes
  'MA|M|Club': '../../datas/MA_M_2026_Club_Records.csv',       // Fichier CSV des records du club Masters Hommes
  'MA|F|Club': '../../datas/MA_F_2026_Club_Records.csv',       // Fichier CSV des records du club Masters Femmes
  'TC|M|Club': '../../datas/TC_M_2026_Club_Records.csv',       // Fichier CSV des records du club Toutes Catégories Hommes
  'TC|F|Club': '../../datas/TC_F_2026_Club_Records.csv',       // Fichier CSV des records du club Toutes Catégories Femmes
};

// ---------------------------------------------------------------------
// Fonctions utilitaires
// ---------------------------------------------------------------------

// ---- Fonction de transformation de mes CSV ----

function parseCSV(texte) {                                          // Transforme un texte CSV en tableau de tableaux (lignes x colonnes)
  return texte                                                      // Renvoie la variable texte
    .replace(/^\uFEFF/, "")                                         // Supprime un caractère spécial appelé BOM (Byte Order Mark) s’il est présent au début
    .trim()                                                         // Surpprime les espaces superflus
    .split(/\r?\n/)                                                 // Découpe le texte en ligne
    .map(ligne => ligne.split(";").map(cellule => cellule.trim())); // le .map(ligne => [...] permet d'appliquer une transformation à chaque ligne. Donc le .map(cellule [...] applique une transformation à chaque cellule
} // "=>" = fonction fléchée // Imbriquer 2 .map = chaînage de méthode = utiliser directement un résultat dans une autre fonction

// ---- Fonction pour obtenir une liste en fonction des variables présentes dans un colonne ----

function datalist(idDatalist, donnees, idx) {        // Fonction pour créer une liste de valeurs uniques à partir d'une colonne spécifique du tableau de données
    const valeursUniques = [...new Set(              // On utilise un Set pour obtenir des valeurs uniques
        donnees                                      // On parcourt toutes les lignes de données
            .map(ligne => (ligne[idx] ?? '').trim()) // On récupère la valeur de la cellule à l'index spécifié, ou une chaîne vide si elle est undefined, puis on supprime les espaces superflus
            .filter(valeur => valeur !== '')         // On filtre pour ne garder que les valeurs non vides
    )].sort((a, b) => a.localeCompare(b, 'fr'));     // On trie les valeurs uniques par ordre alphabétique en utilisant la locale française pour gérer correctement les accents

    document.getElementById(idDatalist).innerHTML = valeursUniques // On sélectionne l'élément HTML correspondant à l'id fourni et on remplace son contenu par les options générées à partir des valeurs uniques
        .map(valeur => `<option value="${valeur}"></option>`)      // On crée une option HTML pour chaque valeur unique
        .join('');                                                 // On joint toutes les options en une seule chaîne de caractères pour les insérer dans le datalist
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

        const medailles = ['Or', 'Argent', 'Bronze'];
        const donneesMedailles = donnees.filter(ligne =>
            medailles.includes((ligne[idxmedailles] ?? '').trim())
        );

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

        if (filtreMedailles === '' && filtreEpreuve === '' && filtreSexe === '' && filtreCategorie === '') {
            document.getElementById('output').innerHTML = '';
            return;
        }
 
        const lignesFiltrees = donneesMedailles.filter(ligne => {
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

        lignesFiltrees.forEach(ligne => {  // On boucle sur lignesFiltrees plutôt que sur toutes les lignes
            const cellules = ligne;
            const style = String(cellules[idxmedailles] ?? '').trim();
            const classe = { Or: 'or', Argent: 'argent', Bronze: 'bronze'}[style] ?? '';
            html += `<tr${classe ? ` class="${classe}"` : ''}>`;
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

        const cle = `${categorie}|${sexe}|${groupe}`; // Clé = "Catégorie|Sexe|Groupe" → chemin du CSV correspondant
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
        const saisonsRecentes = ['2025', '2026', '2027']; // Années à mettre en évidence

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

// ---------------------------------------------------------------------
// Fonction de recherche dans les bilans par saison de la Team VA
// ---------------------------------------------------------------------

async function recherche_bilans_saison_teamva() {
        
    try {

        const res = await fetch(datas_groupe);                                 // Je récupère le chemin du fichier CSV des datas de la Team VA
        if (!res.ok) throw new Error(`Fichier introuvable : ${datas_groupe}`); // Vérifie si le fichier CSV a été chargé correctement, sinon lance une erreur
        const texte = await res.text();                                        // Récupère le contenu du fichier CSV sous forme de texte

        const table = parseCSV(texte);  // Transforme le texte CSV en tableau de tableaux (lignes x colonnes)
        const entetes = table[0];       // Récupère la première ligne du tableau qui contient les entêtes de colonnes
        const donnees = table.slice(1); // Récupère toutes les lignes du tableau sauf la première (les données)

        const colonnes = ['Ranking_Saison','Nom', 'Prénom', 'Performance', 'Validation', 'Date']; // On crée une constante avec les noms des colonnes qu'on veut afficher
        const indices = colonnes.map(col => entetes.indexOf(col));                                // Pour chaque nom de colonne, on cherche son index dans le tableau des entêtes. On obtient un tableau d'indices correspondant à nos colonnes d'intérêt

        const idxRanking_Saison = entetes.indexOf('Ranking_Saison'); // On mémorise spécifiquement l'index de la colonne "Ranking_Saison" pour pouvoir faire le tri plus tard
        const idxSaison = entetes.indexOf('Saison');                 // On mémorise spécifiquement l'index de la colonne "Saison" pour pouvoir faire le tri plus tard
        const idxSexe = entetes.indexOf('Sexe');                     // On mémorise spécifiquement l'index de la colonne "Sexe" pour pouvoir faire le tri plus tard
        const idxCategorie = entetes.indexOf('Code');                // On mémorise spécifiquement l'index de la colonne "Code" pour pouvoir faire le tri plus tard
        const idxEpreuve = entetes.indexOf('Épreuve');               // On mémorise spécifiquement l'index de la colonne "Épreuve" pour pouvoir faire le tri plus tard
        const idxGroupe = entetes.indexOf('Groupe');                 // On mémorise spécifiquement l'index de la colonne "Groupe" pour pouvoir faire le tri plus tard

        const rename = { 'Ranking_Saison': 'Ranking'};      // On crée un objet pour renommer la colonne "Ranking_Saison" en "Ranking" dans l'affichage du tableau

        datalist('liste-epreuve', donnees, idxEpreuve);     // On crée une liste déroulante pour les épreuves à partir des données du CSV

        const filtreSaison = document.getElementById('filtre-saison').value;       // On récupère la valeur du filtre saison
        const filtreSexe = document.getElementById('filtre-sexe').value;           // On récupère la valeur du filtre sexe
        const filtreCategorie = document.getElementById('filtre-categorie').value; // On récupère la valeur du filtre catégorie
        const filtreEpreuve = document.getElementById('filtre-epreuve').value;     // On récupère la valeur du filtre épreuve
        const filtreGroupe = 'Team VA';

        document.getElementById('valeur-saison').textContent = filtreSaison === '' ? '-' : filtreSaison;         // On met à jour l'affichage des valeurs des filtres
        document.getElementById('valeur-sexe').textContent = filtreSexe === '' ? '-' : filtreSexe;                // On met à jour l'affichage des valeurs des filtres
        document.getElementById('valeur-categorie').textContent = filtreCategorie === '' ? '-' : filtreCategorie; // On met à jour l'affichage des valeurs des filtres
        document.getElementById('valeur-epreuve').textContent = filtreEpreuve === '' ? '-' : filtreEpreuve;       // On met à jour l'affichage des valeurs des filtres

        if (filtreSaison === '' || filtreSexe === '' || filtreCategorie === '' || filtreEpreuve === '') { // Si l'un des filtres principaux n'est pas rempli, on vide l'affichage
            document.getElementById('output').innerHTML = '';                                             // Si l'un des filtres principaux n'est pas rempli, on vide l'affichage
            return;                                                                                       // On arrête l'exécution de la fonction
        }

        const filtreSaisonMin = filtreSaison.toLowerCase();       // On met toutes les valeurs des filtres en minuscules pour éviter les problèmes de casse
        const filtreSexeMin = filtreSexe.toLowerCase();           // On met toutes les valeurs des filtres en minuscules pour éviter les problèmes de casse
        const filtreCategorieMin = filtreCategorie.toLowerCase(); // On met toutes les valeurs des filtres en minuscules pour éviter les problèmes de casse
        const filtreEpreuveMin = filtreEpreuve.toLowerCase();     // On met toutes les valeurs des filtres en minuscules pour éviter les problèmes de casse
        const filtreGroupeMin = filtreGroupe.toLowerCase();       // On met toutes les valeurs des filtres en minuscules pour éviter les problèmes de casse

        const lignesFiltrees = donnees.filter(ligne => {                    // On filtre les lignes du tableau en fonction des valeurs des filtres
            const cellules = ligne;                                         // On récupère les cellules de la ligne courante
            const saison = (cellules[idxSaison] ?? '').toLowerCase();       // On récupère la valeur de la cellule correspondant à la saison et on la met en minuscules
            const sexe = (cellules[idxSexe] ?? '').toLowerCase();           // On récupère la valeur de la cellule correspondant au sexe et on la met en minuscules
            const categorie = (cellules[idxCategorie] ?? '').toLowerCase(); // On récupère la valeur de la cellule correspondant à la catégorie et on la met en minuscules
            const epreuve = (cellules[idxEpreuve] ?? '').toLowerCase();     // On récupère la valeur de la cellule correspondant à l'épreuve et on la met en minuscules
            const groupe = (cellules[idxGroupe] ?? '').toLowerCase();       // On récupère la valeur de la cellule correspondant au groupe et on la met en minuscules

            const matchSaison = filtreSaisonMin === '' || saison === filtreSaisonMin;             // On vérifie si la valeur de la saison correspond à celle du filtre ou si le filtre est vide
            const matchSexe = filtreSexeMin === '' || sexe === filtreSexeMin;                     // On vérifie si la valeur du sexe correspond à celle du filtre ou si le filtre est vide
            const matchCategorie = filtreCategorieMin === '' || categorie === filtreCategorieMin; // On vérifie si la valeur de la catégorie correspond à celle du filtre ou si le filtre est vide
            const matchEpreuve = filtreEpreuveMin === '' || epreuve === filtreEpreuveMin;         // On vérifie si la valeur de l'épreuve correspond à celle du filtre ou si le filtre est vide
            const matchGroupe = filtreGroupeMin === '' || groupe === filtreGroupeMin;             // On vérifie si la valeur du groupe correspond à celle du filtre ou si le filtre est vide

            return matchSaison && matchSexe && matchCategorie && matchEpreuve && matchGroupe;     // On ne garde que les lignes qui correspondent à tous les filtres
        });

        lignesFiltrees.sort((ligneA, ligneB) => {            // On trie les lignes filtrées en fonction du ranking de la saison
            const rankA = Number(ligneA[idxRanking_Saison]); // On convertit la valeur du ranking en nombre pour pouvoir trier correctement
            const rankB = Number(ligneB[idxRanking_Saison]); // On convertit la valeur du ranking en nombre pour pouvoir trier correctement
            return rankA - rankB;                            // On retourne la différence entre les deux rankings pour trier par ordre croissant
        });

        let html = '<table><thead><tr>';                                   // On commence à construire le tableau HTML avec les entêtes de colonnes
        colonnes.forEach(col => html += `<th>${rename[col] ?? col}</th>`); // On utilise l'objet rename pour renommer les colonnes si nécessaire, sinon on garde le nom original
        html += '</tr></thead><tbody>';                                    // On ouvre le corps du tableau HTML

        lignesFiltrees.forEach(ligne => {                                       // On boucle sur les lignes filtrées pour construire les lignes du tableau HTML
            const cellules = ligne;                                             // On récupère les cellules de la ligne courante
            html += '<tr>';                                                     // On ouvre une nouvelle ligne du tableau HTML
            indices.forEach(idx => html += `<td>${cellules[idx] ?? '—'}</td>`); // On ajoute une cellule pour chaque colonne en utilisant l'index correspondant, ou un tiret si la cellule est vide
            html += '</tr>';                                                    // On ferme la ligne du tableau HTML
        });

        html += '</tbody></table>';                         // On ferme le corps du tableau HTML
        document.getElementById('output').innerHTML = html; //  On insère le tableau HTML dans l'élément avec l'id "output"

    } catch (err) {                                                                     // On capture les erreurs éventuelles lors de l'exécution de la fonction
        console.error(err);                                                             // On affiche l'erreur dans la console pour le débogage
        document.getElementById('output').innerHTML = `<p>Erreur : ${err.message}</p>`; // On affiche un message d'erreur dans l'élément avec l'id "output"
    }

}

// ---------------------------------------------------------------------
// Fonction de recherche dans les bilans all-time de la Team VA
// ---------------------------------------------------------------------

async function recherche_bilans_alltime_teamva() {
        
    try {

        const res = await fetch(datas_groupe);                                 // Je récupère le chemin du fichier CSV des datas de la Team VA
        if (!res.ok) throw new Error(`Fichier introuvable : ${datas_groupe}`); // Vérifie si le fichier CSV a été chargé correctement, sinon lance une erreur
        const texte = await res.text();                                        // Récupère le contenu du fichier CSV sous forme de texte

        const table = parseCSV(texte);  // Transforme le texte CSV en tableau de tableaux (lignes x colonnes)
        const entetes = table[0];       // Récupère la première ligne du tableau qui contient les entêtes de colonnes
        const donnees = table.slice(1); // Récupère toutes les lignes du tableau sauf la première (les données)

        const colonnes = ['Ranking_Groupe','Nom', 'Prénom', 'Performance', 'Validation', 'Date']; // On crée une constante avec les noms des colonnes qu'on veut afficher
        const indices = colonnes.map(col => entetes.indexOf(col));                                // Pour chaque nom de colonne, on cherche son index dans le tableau des entêtes. On obtient un tableau d'indices correspondant à nos colonnes d'intérêt

        const idxRanking = entetes.indexOf('Ranking_Groupe'); // On mémorise spécifiquement l'index de la colonne "Ranking_Saison" pour pouvoir faire le tri plus tard
        const idxSexe = entetes.indexOf('Sexe');              // On mémorise spécifiquement l'index de la colonne "Sexe" pour pouvoir faire le tri plus tard
        const idxCategorie = entetes.indexOf('Code');         // On mémorise spécifiquement l'index de la colonne "Code" pour pouvoir faire le tri plus tard
        const idxEpreuve = entetes.indexOf('Épreuve');        // On mémorise spécifiquement l'index de la colonne "Épreuve" pour pouvoir faire le tri plus tard
        const idxGroupe = entetes.indexOf('Groupe');          // On mémorise spécifiquement l'index de la colonne "Groupe" pour pouvoir faire le tri plus tard

        const rename = { 'Ranking_Groupe': 'Ranking'};        // On crée un objet pour renommer la colonne "Ranking_Saison" en "Ranking" dans l'affichage du tableau

        datalist('liste-epreuve', donnees, idxEpreuve);       // On crée une liste déroulante pour les épreuves à partir des données du CSV

        const filtreSexe = document.getElementById('filtre-sexe').value;           // On récupère la valeur du filtre sexe
        const filtreCategorie = document.getElementById('filtre-categorie').value; // On récupère la valeur du filtre catégorie
        const filtreEpreuve = document.getElementById('filtre-epreuve').value;     // On récupère la valeur du filtre épreuve
        const filtreGroupe = 'Team VA';

        document.getElementById('valeur-sexe').textContent = filtreSexe === '' ? '-' : filtreSexe;                // On met à jour l'affichage des valeurs des filtres
        document.getElementById('valeur-categorie').textContent = filtreCategorie === '' ? '-' : filtreCategorie; // On met à jour l'affichage des valeurs des filtres
        document.getElementById('valeur-epreuve').textContent = filtreEpreuve === '' ? '-' : filtreEpreuve;       // On met à jour l'affichage des valeurs des filtres

        if (filtreSexe === '' || filtreCategorie === '' || filtreEpreuve === '') { // Si l'un des filtres principaux n'est pas rempli, on vide l'affichage
            document.getElementById('output').innerHTML = '';                      // Si l'un des filtres principaux n'est pas rempli, on vide l'affichage
            return;                                                                // On arrête l'exécution de la fonction
        }

        const filtreSexeMin = filtreSexe.toLowerCase();           // On met toutes les valeurs des filtres en minuscules pour éviter les problèmes de casse
        const filtreCategorieMin = filtreCategorie.toLowerCase(); // On met toutes les valeurs des filtres en minuscules pour éviter les problèmes de casse
        const filtreEpreuveMin = filtreEpreuve.toLowerCase();     // On met toutes les valeurs des filtres en minuscules pour éviter les problèmes de casse
        const filtreGroupeMin = filtreGroupe.toLowerCase();       // On met toutes les valeurs des filtres en minuscules pour éviter les problèmes de casse

        const lignesFiltrees = donnees.filter(ligne => {                    // On filtre les lignes du tableau en fonction des valeurs des filtres
            const cellules = ligne;                                         // On récupère les cellules de la ligne courante
            const sexe = (cellules[idxSexe] ?? '').toLowerCase();           // On récupère la valeur de la cellule correspondant au sexe et on la met en minuscules
            const categorie = (cellules[idxCategorie] ?? '').toLowerCase(); // On récupère la valeur de la cellule correspondant à la catégorie et on la met en minuscules
            const epreuve = (cellules[idxEpreuve] ?? '').toLowerCase();     // On récupère la valeur de la cellule correspondant à l'épreuve et on la met en minuscules
            const groupe = (cellules[idxGroupe] ?? '').toLowerCase();       // On récupère la valeur de la cellule correspondant au groupe et on la met en minuscules

            const matchSexe = filtreSexeMin === '' || sexe === filtreSexeMin;                     // On vérifie si la valeur du sexe correspond à celle du filtre ou si le filtre est vide
            const matchCategorie = filtreCategorieMin === '' || categorie === filtreCategorieMin; // On vérifie si la valeur de la catégorie correspond à celle du filtre ou si le filtre est vide
            const matchEpreuve = filtreEpreuveMin === '' || epreuve === filtreEpreuveMin;         // On vérifie si la valeur de l'épreuve correspond à celle du filtre ou si le filtre est vide
            const matchGroupe = filtreGroupeMin === '' || groupe === filtreGroupeMin;             // On vérifie si la valeur du groupe correspond à celle du filtre ou si le filtre est vide

            return matchSexe && matchCategorie && matchEpreuve && matchGroupe;                    // On ne garde que les lignes qui correspondent à tous les filtres
        });

        lignesFiltrees.sort((ligneA, ligneB) => {            // On trie les lignes filtrées en fonction du ranking de la saison
            const rankA = Number(ligneA[idxRanking]); // On convertit la valeur du ranking en nombre pour pouvoir trier correctement
            const rankB = Number(ligneB[idxRanking]); // On convertit la valeur du ranking en nombre pour pouvoir trier correctement
            return rankA - rankB;                            // On retourne la différence entre les deux rankings pour trier par ordre croissant
        });

        let html = '<table><thead><tr>';                                   // On commence à construire le tableau HTML avec les entêtes de colonnes
        colonnes.forEach(col => html += `<th>${rename[col] ?? col}</th>`); // On utilise l'objet rename pour renommer les colonnes si nécessaire, sinon on garde le nom original
        html += '</tr></thead><tbody>';                                    // On ouvre le corps du tableau HTML

        lignesFiltrees.forEach(ligne => {                                       // On boucle sur les lignes filtrées pour construire les lignes du tableau HTML
            const cellules = ligne;                                             // On récupère les cellules de la ligne courante
            html += '<tr>';                                                     // On ouvre une nouvelle ligne du tableau HTML
            indices.forEach(idx => html += `<td>${cellules[idx] ?? '—'}</td>`); // On ajoute une cellule pour chaque colonne en utilisant l'index correspondant, ou un tiret si la cellule est vide
            html += '</tr>';                                                    // On ferme la ligne du tableau HTML
        });

        html += '</tbody></table>';                         // On ferme le corps du tableau HTML
        document.getElementById('output').innerHTML = html; //  On insère le tableau HTML dans l'élément avec l'id "output"

    } catch (err) {                                                                     // On capture les erreurs éventuelles lors de l'exécution de la fonction
        console.error(err);                                                             // On affiche l'erreur dans la console pour le débogage
        document.getElementById('output').innerHTML = `<p>Erreur : ${err.message}</p>`; // On affiche un message d'erreur dans l'élément avec l'id "output"
    }

}

// ---------------------------------------------------------------------
// Fonction de recherche dans les bilans par saison du club
// ---------------------------------------------------------------------

async function recherche_bilans_saison_club() {
        
    try {

        const res = await fetch(datas_club);                                 // Je récupère le chemin du fichier CSV des datas du club
        if (!res.ok) throw new Error(`Fichier introuvable : ${datas_club}`); // Vérifie si le fichier CSV a été chargé correctement, sinon lance une erreur
        const texte = await res.text();                                      // Récupère le contenu du fichier CSV sous forme de texte

        const table = parseCSV(texte);  // Transforme le texte CSV en tableau de tableaux (lignes x colonnes)
        const entetes = table[0];       // Récupère la première ligne du tableau qui contient les entêtes de colonnes
        const donnees = table.slice(1); // Récupère toutes les lignes du tableau sauf la première (les données)

        const colonnes = ['Ranking_Saison','Nom', 'Prénom', 'Performance', 'Validation', 'Date']; // On crée une constante avec les noms des colonnes qu'on veut afficher
        const indices = colonnes.map(col => entetes.indexOf(col));                                // Pour chaque nom de colonne, on cherche son index dans le tableau des entêtes. On obtient un tableau d'indices correspondant à nos colonnes d'intérêt

        const idxRanking_Saison = entetes.indexOf('Ranking_Saison'); // On mémorise spécifiquement l'index de la colonne "Ranking_Saison" pour pouvoir faire le tri plus tard
        const idxSaison = entetes.indexOf('Saison');                 // On mémorise spécifiquement l'index de la colonne "Saison" pour pouvoir faire le tri plus tard
        const idxSexe = entetes.indexOf('Sexe');                     // On mémorise spécifiquement l'index de la colonne "Sexe" pour pouvoir faire le tri plus tard
        const idxCategorie = entetes.indexOf('Code');                // On mémorise spécifiquement l'index de la colonne "Code" pour pouvoir faire le tri plus tard
        const idxEpreuve = entetes.indexOf('Épreuve');               // On mémorise spécifiquement l'index de la colonne "Épreuve" pour pouvoir faire le tri plus tard

        const rename = { 'Ranking_Saison': 'Ranking'};      // On crée un objet pour renommer la colonne "Ranking_Saison" en "Ranking" dans l'affichage du tableau

        datalist('liste-epreuve', donnees, idxEpreuve);     // On crée une liste déroulante pour les épreuves à partir des données du CSV

        const filtreSaison = document.getElementById('filtre-saison').value;       // On récupère la valeur du filtre saison
        const filtreSexe = document.getElementById('filtre-sexe').value;           // On récupère la valeur du filtre sexe
        const filtreCategorie = document.getElementById('filtre-categorie').value; // On récupère la valeur du filtre catégorie
        const filtreEpreuve = document.getElementById('filtre-epreuve').value;     // On récupère la valeur du filtre épreuve

        document.getElementById('valeur-saison').textContent = filtreSaison === '' ? '-' : filtreSaison;         // On met à jour l'affichage des valeurs des filtres
        document.getElementById('valeur-sexe').textContent = filtreSexe === '' ? '-' : filtreSexe;                // On met à jour l'affichage des valeurs des filtres
        document.getElementById('valeur-categorie').textContent = filtreCategorie === '' ? '-' : filtreCategorie; // On met à jour l'affichage des valeurs des filtres
        document.getElementById('valeur-epreuve').textContent = filtreEpreuve === '' ? '-' : filtreEpreuve;       // On met à jour l'affichage des valeurs des filtres

        if (filtreSaison === '' || filtreSexe === '' || filtreCategorie === '' || filtreEpreuve === '') { // Si l'un des filtres principaux n'est pas rempli, on vide l'affichage
            document.getElementById('output').innerHTML = '';                                             // Si l'un des filtres principaux n'est pas rempli, on vide l'affichage
            return;                                                                                       // On arrête l'exécution de la fonction
        }

        const filtreSaisonMin = filtreSaison.toLowerCase();       // On met toutes les valeurs des filtres en minuscules pour éviter les problèmes de casse
        const filtreSexeMin = filtreSexe.toLowerCase();           // On met toutes les valeurs des filtres en minuscules pour éviter les problèmes de casse
        const filtreCategorieMin = filtreCategorie.toLowerCase(); // On met toutes les valeurs des filtres en minuscules pour éviter les problèmes de casse
        const filtreEpreuveMin = filtreEpreuve.toLowerCase();     // On met toutes les valeurs des filtres en minuscules pour éviter les problèmes de casse

        const lignesFiltrees = donnees.filter(ligne => {                    // On filtre les lignes du tableau en fonction des valeurs des filtres
            const cellules = ligne;                                         // On récupère les cellules de la ligne courante
            const saison = (cellules[idxSaison] ?? '').toLowerCase();       // On récupère la valeur de la cellule correspondant à la saison et on la met en minuscules
            const sexe = (cellules[idxSexe] ?? '').toLowerCase();           // On récupère la valeur de la cellule correspondant au sexe et on la met en minuscules
            const categorie = (cellules[idxCategorie] ?? '').toLowerCase(); // On récupère la valeur de la cellule correspondant à la catégorie et on la met en minuscules
            const epreuve = (cellules[idxEpreuve] ?? '').toLowerCase();     // On récupère la valeur de la cellule correspondant à l'épreuve et on la met en minuscules

            const matchSaison = filtreSaisonMin === '' || saison === filtreSaisonMin;             // On vérifie si la valeur de la saison correspond à celle du filtre ou si le filtre est vide
            const matchSexe = filtreSexeMin === '' || sexe === filtreSexeMin;                     // On vérifie si la valeur du sexe correspond à celle du filtre ou si le filtre est vide
            const matchCategorie = filtreCategorieMin === '' || categorie === filtreCategorieMin; // On vérifie si la valeur de la catégorie correspond à celle du filtre ou si le filtre est vide
            const matchEpreuve = filtreEpreuveMin === '' || epreuve === filtreEpreuveMin;         // On vérifie si la valeur de l'épreuve correspond à celle du filtre ou si le filtre est vide

            return matchSaison && matchSexe && matchCategorie && matchEpreuve;                    // On ne garde que les lignes qui correspondent à tous les filtres
        });

        lignesFiltrees.sort((ligneA, ligneB) => {            // On trie les lignes filtrées en fonction du ranking de la saison
            const rankA = Number(ligneA[idxRanking_Saison]); // On convertit la valeur du ranking en nombre pour pouvoir trier correctement
            const rankB = Number(ligneB[idxRanking_Saison]); // On convertit la valeur du ranking en nombre pour pouvoir trier correctement
            return rankA - rankB;                            // On retourne la différence entre les deux rankings pour trier par ordre croissant
        });

        let html = '<table><thead><tr>';                                   // On commence à construire le tableau HTML avec les entêtes de colonnes
        colonnes.forEach(col => html += `<th>${rename[col] ?? col}</th>`); // On utilise l'objet rename pour renommer les colonnes si nécessaire, sinon on garde le nom original
        html += '</tr></thead><tbody>';                                    // On ouvre le corps du tableau HTML

        lignesFiltrees.forEach(ligne => {                                       // On boucle sur les lignes filtrées pour construire les lignes du tableau HTML
            const cellules = ligne;                                             // On récupère les cellules de la ligne courante
            html += '<tr>';                                                     // On ouvre une nouvelle ligne du tableau HTML
            indices.forEach(idx => html += `<td>${cellules[idx] ?? '—'}</td>`); // On ajoute une cellule pour chaque colonne en utilisant l'index correspondant, ou un tiret si la cellule est vide
            html += '</tr>';                                                    // On ferme la ligne du tableau HTML
        });

        html += '</tbody></table>';                         // On ferme le corps du tableau HTML
        document.getElementById('output').innerHTML = html; //  On insère le tableau HTML dans l'élément avec l'id "output"

    } catch (err) {                                                                     // On capture les erreurs éventuelles lors de l'exécution de la fonction
        console.error(err);                                                             // On affiche l'erreur dans la console pour le débogage
        document.getElementById('output').innerHTML = `<p>Erreur : ${err.message}</p>`; // On affiche un message d'erreur dans l'élément avec l'id "output"
    }

}

// ---------------------------------------------------------------------
// Fonction de recherche dans les bilans all-time du club
// ---------------------------------------------------------------------

async function recherche_bilans_alltime_club() {
        
    try {

        const res = await fetch(datas_club);                                 // Je récupère le chemin du fichier CSV des datas du club
        if (!res.ok) throw new Error(`Fichier introuvable : ${datas_club}`); // Vérifie si le fichier CSV a été chargé correctement, sinon lance une erreur
        const texte = await res.text();                                      // Récupère le contenu du fichier CSV sous forme de texte

        const table = parseCSV(texte);  // Transforme le texte CSV en tableau de tableaux (lignes x colonnes)
        const entetes = table[0];       // Récupère la première ligne du tableau qui contient les entêtes de colonnes
        const donnees = table.slice(1); // Récupère toutes les lignes du tableau sauf la première (les données)

        const colonnes = ['Ranking_Cat','Nom', 'Prénom', 'Performance', 'Validation', 'Date']; // On crée une constante avec les noms des colonnes qu'on veut afficher
        const indices = colonnes.map(col => entetes.indexOf(col));                                // Pour chaque nom de colonne, on cherche son index dans le tableau des entêtes. On obtient un tableau d'indices correspondant à nos colonnes d'intérêt

        const idxRanking = entetes.indexOf('Ranking_Cat'); // On mémorise spécifiquement l'index de la colonne "Ranking_Saison" pour pouvoir faire le tri plus tard
        const idxSexe = entetes.indexOf('Sexe');           // On mémorise spécifiquement l'index de la colonne "Sexe" pour pouvoir faire le tri plus tard
        const idxCategorie = entetes.indexOf('Code');      // On mémorise spécifiquement l'index de la colonne "Code" pour pouvoir faire le tri plus tard
        const idxEpreuve = entetes.indexOf('Épreuve');     // On mémorise spécifiquement l'index de la colonne "Épreuve" pour pouvoir faire le tri plus tard

        const rename = { 'Ranking_Cat': 'Ranking'};        // On crée un objet pour renommer la colonne "Ranking_Saison" en "Ranking" dans l'affichage du tableau

        datalist('liste-epreuve', donnees, idxEpreuve);    // On crée une liste déroulante pour les épreuves à partir des données du CSV

        const filtreSexe = document.getElementById('filtre-sexe').value;           // On récupère la valeur du filtre sexe
        const filtreCategorie = document.getElementById('filtre-categorie').value; // On récupère la valeur du filtre catégorie
        const filtreEpreuve = document.getElementById('filtre-epreuve').value;     // On récupère la valeur du filtre épreuve

        document.getElementById('valeur-sexe').textContent = filtreSexe === '' ? '-' : filtreSexe;                // On met à jour l'affichage des valeurs des filtres
        document.getElementById('valeur-categorie').textContent = filtreCategorie === '' ? '-' : filtreCategorie; // On met à jour l'affichage des valeurs des filtres
        document.getElementById('valeur-epreuve').textContent = filtreEpreuve === '' ? '-' : filtreEpreuve;       // On met à jour l'affichage des valeurs des filtres

        if (filtreSexe === '' || filtreCategorie === '' || filtreEpreuve === '') { // Si l'un des filtres principaux n'est pas rempli, on vide l'affichage
            document.getElementById('output').innerHTML = '';                      // Si l'un des filtres principaux n'est pas rempli, on vide l'affichage
            return;                                                                // On arrête l'exécution de la fonction
        }

        const filtreSexeMin = filtreSexe.toLowerCase();           // On met toutes les valeurs des filtres en minuscules pour éviter les problèmes de casse
        const filtreCategorieMin = filtreCategorie.toLowerCase(); // On met toutes les valeurs des filtres en minuscules pour éviter les problèmes de casse
        const filtreEpreuveMin = filtreEpreuve.toLowerCase();     // On met toutes les valeurs des filtres en minuscules pour éviter les problèmes de casse

        const lignesFiltrees = donnees.filter(ligne => {                    // On filtre les lignes du tableau en fonction des valeurs des filtres
            const cellules = ligne;                                         // On récupère les cellules de la ligne courante
            const sexe = (cellules[idxSexe] ?? '').toLowerCase();           // On récupère la valeur de la cellule correspondant au sexe et on la met en minuscules
            const categorie = (cellules[idxCategorie] ?? '').toLowerCase(); // On récupère la valeur de la cellule correspondant à la catégorie et on la met en minuscules
            const epreuve = (cellules[idxEpreuve] ?? '').toLowerCase();     // On récupère la valeur de la cellule correspondant à l'épreuve et on la met en minuscules

            const matchSexe = filtreSexeMin === '' || sexe === filtreSexeMin;                     // On vérifie si la valeur du sexe correspond à celle du filtre ou si le filtre est vide
            const matchCategorie = filtreCategorieMin === '' || categorie === filtreCategorieMin; // On vérifie si la valeur de la catégorie correspond à celle du filtre ou si le filtre est vide
            const matchEpreuve = filtreEpreuveMin === '' || epreuve === filtreEpreuveMin;         // On vérifie si la valeur de l'épreuve correspond à celle du filtre ou si le filtre est vide

            return matchSexe && matchCategorie && matchEpreuve;                                   // On ne garde que les lignes qui correspondent à tous les filtres
        });

        lignesFiltrees.sort((ligneA, ligneB) => {     // On trie les lignes filtrées en fonction du ranking de la saison
            const rankA = Number(ligneA[idxRanking]); // On convertit la valeur du ranking en nombre pour pouvoir trier correctement
            const rankB = Number(ligneB[idxRanking]); // On convertit la valeur du ranking en nombre pour pouvoir trier correctement
            return rankA - rankB;                     // On retourne la différence entre les deux rankings pour trier par ordre croissant
        });

        let html = '<table><thead><tr>';                                   // On commence à construire le tableau HTML avec les entêtes de colonnes
        colonnes.forEach(col => html += `<th>${rename[col] ?? col}</th>`); // On utilise l'objet rename pour renommer les colonnes si nécessaire, sinon on garde le nom original
        html += '</tr></thead><tbody>';                                    // On ouvre le corps du tableau HTML

        lignesFiltrees.forEach(ligne => {                                       // On boucle sur les lignes filtrées pour construire les lignes du tableau HTML
            const cellules = ligne;                                             // On récupère les cellules de la ligne courante
            html += '<tr>';                                                     // On ouvre une nouvelle ligne du tableau HTML
            indices.forEach(idx => html += `<td>${cellules[idx] ?? '—'}</td>`); // On ajoute une cellule pour chaque colonne en utilisant l'index correspondant, ou un tiret si la cellule est vide
            html += '</tr>';                                                    // On ferme la ligne du tableau HTML
        });

        html += '</tbody></table>';                         // On ferme le corps du tableau HTML
        document.getElementById('output').innerHTML = html; //  On insère le tableau HTML dans l'élément avec l'id "output"

    } catch (err) {                                                                     // On capture les erreurs éventuelles lors de l'exécution de la fonction
        console.error(err);                                                             // On affiche l'erreur dans la console pour le débogage
        document.getElementById('output').innerHTML = `<p>Erreur : ${err.message}</p>`; // On affiche un message d'erreur dans l'élément avec l'id "output"
    }

}