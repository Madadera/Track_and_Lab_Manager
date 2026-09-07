/* ============================================================
   Scoring Tables — Logique JavaScript
   ============================================================ */

// Comment faire tourner les blocks un par un afin d'afficher leurs résultats ?

async function cotation_jeune() { // async ? Différence avec une fonction classique ?

   const fichiers = {
      'BE|M': '../../datas/Tables_Cotations_BEM.csv',
      'BE|F': '../../datas/Tables_Cotations_BEF.csv',
      'MI|M': '../../datas/Tables_Cotations_MIM.csv',
      'MI|F': '../../datas/Tables_Cotations_MIF.csv',
      'CA|M': '../../datas/Tables_Cotations_CAM.csv',
      'CA|F': '../../datas/Tables_Cotations_CAF.csv',
   };

   const sexe = document.getElementById("filtre-sexe").value;
   const categorie = document.getElementById("filtre-categorie").value;
   const epreuve = document.getElementById("filtre-epreuve").value;
   const input = document.getElementById("input").value.trim();
   const output_jeune = document.getElementById("output-jeune");

   if (!sexe || !categorie || !epreuve || !input) { // Lorsque je clique sur mon bouton de calcule, rien ne s'afficeh dans ma case d'output...
      output_jeune.innerHTML = 'Champs incomplets.';
      return;
   }

   const cle = `${categorie}|${sexe}`;
   const chemin = fichiers[cle];

   if (!chemin) {
      output_jeune.innerHTML = 'Catégorie non disponible en points jeunes';
      return;
   }

  try {
    const res = await fetch(chemin);
    if (!res.ok) throw new Error(`Fichier introuvable : ${chemin}`);
    const texte = await res.text();
 
    const table = parseCSV(texte);
    const entetes = table[0];
    const lignes = table.slice(1);
 
    const idxEpreuve = entetes.indexOf(epreuve);
    const idxPoints = entetes.indexOf("Points");
 
    if (idxEpreuve === -1 || idxPoints === -1) {
      output_jeune.value = "Épreuve introuvable dans la table";
      return;
    }
 
    const perf = parsePerformance(input);
    if (isNaN(perf)) {
      output_jeune.value = "Format de performance invalide";
      return;
    }
 
    const sensTemps = estUneEpreuveDeTemps(epreuve);
    const points = trouverPoints(lignes, idxEpreuve, idxPoints, perf, sensTemps);
 
    output_jeune.value = points !== null ? points : "Hors barème";
 
  } catch (err) {
    console.error(err);
    output_jeune.value = "Erreur de chargement de la table";
  }

   // const colonne = // récupération de toutes mes colonnes d'entêtes //

   // Fonction de recherche me permettant d'obtenir l'équivalent en point par rapport à ma performance rentrée en input

   // Récupérer l'output et le mettre dans ma case prévue à cet effet //

}

// ---------------------------------------------------------------------
// Fonctions utilitaires
// ---------------------------------------------------------------------
 
// Transforme le texte brut du CSV en tableau de tableaux (lignes x colonnes)
function parseCSV(texte) {
  return texte
    .replace(/^\uFEFF/, "")   // retire un éventuel BOM en début de fichier
    .trim()
    .split(/\r?\n/)
    .map(ligne => ligne.split(";").map(cellule => cellule.trim()));
}
 
// Convertit une performance texte ("10,45" / "1:05,30" / "6.50") en nombre :
// - une distance devient des mètres
// - un temps devient des secondes
function parsePerformance(str) {
  if (!str) return NaN;
  str = str.trim().replace(",", ".");
 
  if (str.includes(":")) {
    const parties = str.split(":").map(Number);
    if (parties.some(isNaN)) return NaN;
 
    if (parties.length === 3) {
      const [h, m, s] = parties;
      return h * 3600 + m * 60 + s;
    }
    if (parties.length === 2) {
      const [m, s] = parties;
      return m * 60 + s;
    }
  }
 
  return parseFloat(str);
}
 
// Détermine si une épreuve se mesure en temps (plus petit = meilleur)
// ou en distance/hauteur (plus grand = meilleur)
function estUneEpreuveDeTemps(epreuve) {
  const epreuvesDeDistance = [
    "Hauteur", "Longueur", "Perche", "Poids", "Disque",
    "Javelot", "Marteau", "Triple Saut", "Médecine Ball"
  ];
  return !epreuvesDeDistance.some(mot => epreuve.includes(mot));
}
 
// Cherche, dans les lignes de la table, le palier de points le plus proche
// (le meilleur atteint sans le dépasser) pour la performance donnée.
// Ne suppose aucun ordre particulier des lignes dans le CSV.
function trouverPoints(lignes, idxEpreuve, idxPoints, perf, sensTemps) {
  let meilleureLigne = null;
  let meilleureValeur = null;
 
  for (const ligne of lignes) {
    const valTable = parsePerformance(ligne[idxEpreuve]);
    if (isNaN(valTable)) continue;
 
    const estMeilleure = sensTemps
      ? valTable >= perf && (meilleureValeur === null || valTable < meilleureValeur)
      : valTable <= perf && (meilleureValeur === null || valTable > meilleureValeur);
 
    if (estMeilleure) {
      meilleureValeur = valTable;
      meilleureLigne = ligne;
    }
  }
 
  return meilleureLigne ? meilleureLigne[idxPoints] : null;
}





/* Dans ma première fonction cela veut dire qu'il faut que je récupère l'index de mes colonnes */

// Récupérer les données (coefficients) - Faire une sorte de clé comme pour les records //

/* Sauvegarder mes données dans des constantes */

/* Pour la table de cotation jeune il faut simplement créer une fonction de recherche qui retourne le nombre de point au pus proche */

/* Pour la table hongroise et de combinés et faut appliquer les formules */

/* Pour les niveaux c'est pareil c'est juste une fonction de recherche */

/* Donc il faut plusieurs fonctions qui font les différents calculs et qui retournent les outpur dans les cas concernées */

