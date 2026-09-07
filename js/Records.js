/* ============================================================
   Records
   ============================================================ */

// Clé = "Catégorie|Sexe|Groupe" → chemin du CSV correspondant
const fichiersCSV = { /* Je crée un objet pour associer chaque combinaison de catégorie, sexe et groupe à un fichier CSV spécifique. */
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
};

const colonnes = ['Épreuve', 'Performance', 'Nom', 'Prénom', 'Date', 'Lieu']; /* Je crée un tableau pour définir l'ordre des colonnes et les titres à afficher dans le tableau HTML */
const cache = {}; /* Je crée un objet pour stocker les données CSV déjà chargées afin d'éviter de les recharger à chaque fois que l'utilisateur change de filtre. */

/* ------------------------------------------------------------ */
function construireTableau(texte) {                          /* Je crée une fonction pour construire le tableau HTML à partir du texte CSV. */
  const lignes = texte.trim().split(/\r?\n/);                /* Je divise le texte CSV en lignes en utilisant une expression régulière pour gérer les différentes fins de ligne. */
  const entetes = lignes[0].split(';').map(e => e.trim());   /* Je divise la première ligne (les en-têtes) en colonnes et je supprime les espaces superflus. */
  const indices = colonnes.map(col => entetes.indexOf(col)); /* Je crée un tableau d'indices pour savoir à quelle position se trouve chaque colonne dans le CSV. */
  const donnees = lignes.slice(1);                           /* Je récupère toutes les lignes de données en excluant la première ligne (les en-têtes). */

  const idxDate = indices[colonnes.indexOf('Date')];         /* Je récupère l'indice de la colonne "Date" pour pouvoir identifier les lignes récentes. */
  const saisonsRecentes = ['2025', '2026'];                  /* Je définis les années considérées comme récentes pour mettre en évidence les lignes correspondantes dans le tableau. */

  let html = '<table><thead><tr>';                           /* Je commence à construire le tableau HTML en ajoutant les balises <table>, <thead> et <tr>. */
  colonnes.forEach(col => html += `<th>${col}</th>`);        /* Je crée les en-têtes de colonnes en utilisant les titres définis dans le tableau "colonnes". */
  html += '</tr></thead><tbody>';                            /* Je ferme la balise <tr> et j'ouvre la balise <tbody> pour commencer à ajouter les lignes de données. */

  donnees.forEach(ligne => {
    const cellules = ligne.split(';');
    const dateValeur = (cellules[idxDate] ?? '').trim();
    const anneeMatch = dateValeur.match(/\d{4}/);
    const estRecent = anneeMatch && saisonsRecentes.includes(anneeMatch[0]);
    const classeRecente = estRecent ? ' class="ligne-recente"' : '';

    html += `<tr${classeRecente}>`;
    indices.forEach(idx => html += `<td>${(cellules[idx] ?? '—').trim()}</td>`);
    html += '</tr>';
  });

  html += '</tbody></table>';
  return html;
}

/* ------------------------------------------------------------ */
function afficherTableau() {
  const groupe = document.getElementById('filtre-groupe').value;
  const sexe = document.getElementById('filtre-sexe').value;
  const categorie = document.getElementById('filtre-categorie').value;
  const output = document.getElementById('output');

  if (!groupe || !sexe || !categorie) {
    output.innerHTML = '';
    return;
  }

  const cle = `${categorie}|${sexe}|${groupe}`;
  const chemin = fichiersCSV[cle];

  if (!chemin) {
    output.innerHTML = '<p>Aucune donnée disponible pour cette sélection.</p>';
    return;
  }

  if (cache[chemin]) {
    output.innerHTML = construireTableau(cache[chemin]);
    return;
  }

  fetch(chemin)
    .then(res => res.text())
    .then(texte => {
      cache[chemin] = texte;
      output.innerHTML = construireTableau(texte);
    })
    .catch(() => {
      output.innerHTML = '<p>Erreur lors du chargement des données.</p>';
    });
}

/* ------------------------------------------------------------ */
document.getElementById('filtre-groupe').addEventListener('change', afficherTableau);
document.getElementById('filtre-sexe').addEventListener('change', afficherTableau);
document.getElementById('filtre-categorie').addEventListener('change', afficherTableau);