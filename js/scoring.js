/* ============================================================
   Scoring Tables — Logique JavaScript
   ============================================================ */

// ---------------------------------------------------------------------
// Chargement des fichiers CSV
// ---------------------------------------------------------------------

   const cotations = {                                // Dictionnaire des fichiers CSV de cotations selon la catégorie et le sexe
      'BE|M': '../../datas/Tables_Cotations_BEM.csv', // Fichier CSV des cotations Benjamins Masculins
      'BE|F': '../../datas/Tables_Cotations_BEF.csv', // Fichier CSV des cotations Benjamins Féminins
      'MI|M': '../../datas/Tables_Cotations_MIM.csv', // Fichier CSV des cotations Minimes Masculins
      'MI|F': '../../datas/Tables_Cotations_MIF.csv', // Fichier CSV des cotations Minimes Féminins
      'CA|M': '../../datas/Tables_Cotations_CAM.csv', // Fichier CSV des cotations Cadets Masculins
      'CA|F': '../../datas/Tables_Cotations_CAF.csv', // Fichier CSV des cotations Cadets Féminins
   };

   const coefficients = {                                // Dictionnaire des fichiers CSV de mes coefficients selon le type et le sexe
    'SE|M|H': '../../datas/Coefficients_M_Hongrois.csv', // Fichier CSV des Coefficients Hongrois Sénior Masculin
    'SE|M|C': '../../datas/Coefficients_M_Combinés.csv', // Fichier CSV des Coefficients Combinés Sénior Masculin
    'SE|F|H': '../../datas/Coefficients_F_Hongrois.csv', // Fichier CSV des Coefficients Hongrois Sénior Féminin
    'SE|F|C': '../../datas/Coefficients_F_Combinés.csv', // Fichier CSV des Coefficients Combinés Sénior Féminin
   }

   const niveaux = {                      // Dictionnaire des fichiers CSV des niveaux selon la catégorie et le sexe
    'BE|M': '../../datas/Niveau_BEM.csv', // Fichier CSV des Niveaux Benjamins Masculins
    'BE|F': '../../datas/Niveau_BEF.csv', // Fichier CSV des Niveaux Benjamins Féminins
    'MI|M': '../../datas/Niveau_MIM.csv', // Fichier CSV des Niveaux Minimes Masculins
    'MI|F': '../../datas/Niveau_MIF.csv', // Fichier CSV des Niveaux Minimes Féminins
    'SE|M': '../../datas/Niveau_SEM.csv', // Fichier CSV des Niveaux Séniors Masculins
    'SE|F': '../../datas/Niveau_SEF.csv', // Fichier CSV des Niveaux Séniors Féminins
   }

// ---------------------------------------------------------------------
// Fonctions utilitaires
// ---------------------------------------------------------------------
 
// ----- Fonction de transformation -----

function parseCSV(texte) {                                          // Transforme un texte CSV en tableau de tableaux (lignes x colonnes)
  return texte                                                      // Renvoie la variable texte
    .replace(/^\uFEFF/, "")                                         // Supprime un caractère spécial appelé BOM (Byte Order Mark) s’il est présent au début
    .trim()                                                         // Surpprime les espaces superflus
    .split(/\r?\n/)                                                 // Découpe le texte en ligne
    .map(ligne => ligne.split(";").map(cellule => cellule.trim())); // le .map(ligne => [...] permet d'appliquer une transformation à chaque ligne. Donc le .map(cellule [...] applique une transformation à chaque cellule
}                                                                   // Ensuite chaque ligne est séparée en colonne et chaque cellule est nétoyée individuellement

// ----- Fonction de conversion classique -----

function conversion_classique(str) { // Ma fonction de conversion

  if (!str) return NaN; // Si la chaîne est vide ou nulle, retourne NaN (Not a Number)

  str = str.trim()                // Supprime les espaces superflus au début et à la fin de la chaîne
           .replace(/[’′]/g, "'") // Remplace les apostrophes et les guillemets typographiques par des apostrophes simples
           .replace(/[”″]/g, '"') // Remplace les guillemets typographiques par des guillemets doubles
           .replace(/''/g, '"')   // Remplace les doubles apostrophes par des guillemets doubles
           .replace(/,/g, ".")   // Remplace les virgules par des points pour les décimales
           .replace(/m/g, ".");  // Remplace les m (mètre) par des points

  const h = str.match(/^(\d+):(\d{1,2})'(\d{1,2})(?:"(\d+)?)?$/);         // Format heures : 1:23'45"00 (heures:minutes'secondes"centièmes)
  if (h) {
    const heures = parseInt(h[1], 10);                                    // Récupère les heures
    const minutes = parseInt(h[2], 10);                                   // Récupère les minutes
    const secondes = parseInt(h[3], 10);                                  // Récupère les secondes
    const centiemes = h[4] ? parseFloat("0." + h[4]) : 0;                 // Centièmes si présents
    return (heures * 3600 + minutes * 60 + secondes + centiemes) / 86400; // Total en jours
  }

  const m = str.match(/^(\d+)'(\d{1,2})(?:"(\d+)?)?$/);   // Format temps : 3'10"00 (minutes'secondes"centièmes)
  if (m) {
    const minutes = parseInt(m[1], 10);                   // Récupère les minutes et les convertit en nombre entier
    const secondes = parseInt(m[2], 10);                  // Récupère les secondes et les convertit en nombre entier
    const centiemes = m[3] ? parseFloat("0." + m[3]) : 0; // Récupère les centièmes et les convertit en nombre décimal, ou 0 si non présent
    return (minutes * 60 + secondes + centiemes) / 86400; // Retourne le temps total en jours (1 jour = 86400 secondes)
  }

  const s = str.match(/^(\d+)"(\d+)?$/);                                   // Format secondes : 10"85 (secondes"centièmes)
  if (s) return parseInt(s[1], 10) + (s[2] ? parseFloat("0." + s[2]) : 0); // Total en secondes !

  if (/['"]/.test(str)) return NaN; // Si ça contient ' ou " mais ne correspond pas au format : saisie invalide

  return parseFloat(str); // Sinon, nombre classique (mètres, etc.)
}

// ----- Fonction de conversion pour les combinés -----

function conversion_combine(str, epreuve) { // Ma fonction de conversion pour les combinés

  if (!str) return NaN; // Si la chaîne est vide ou nulle, retourne NaN (Not a Number)

  str = str.trim()                // Supprime les espaces superflus au début et à la fin de la chaîne
           .replace(/[’′]/g, "'") // Remplace les apostrophes et les guillemets typographiques par des apostrophes simples
           .replace(/[”″]/g, '"') // Remplace les guillemets typographiques par des guillemets doubles
           .replace(/''/g, '"')   // Remplace les doubles apostrophes par des guillemets doubles
           .replace(/,/g, ".")   // Remplace les virgules par des points pour les décimales
           .replace(/m/g, ".");  // Remplace les m (mètre) par des points

  if (type(epreuve) === "course") { // Si l'épreuve est une course, on convertit le temps en secondes

  const h = str.match(/^(\d+):(\d{1,2})'(\d{1,2})(?:"(\d+)?)?$/);         // Format heures : 1:23'45"00 (heures:minutes'secondes"centièmes)
  if (h) {
    const heures = parseInt(h[1], 10);                                    // Récupère les heures
    const minutes = parseInt(h[2], 10);                                   // Récupère les minutes
    const secondes = parseInt(h[3], 10);                                  // Récupère les secondes
    const centiemes = h[4] ? parseFloat("0." + h[4]) : 0;                 // Centièmes si présents
    return (heures * 3600 + minutes * 60 + secondes + centiemes);         // Total en secondes !
  }

  const m = str.match(/^(\d+)'(\d{1,2})(?:"(\d+)?)?$/);   // Format temps : 3'10"00 (minutes'secondes"centièmes)
  if (m) {
    const minutes = parseInt(m[1], 10);                   // Récupère les minutes et les convertit en nombre entier
    const secondes = parseInt(m[2], 10);                  // Récupère les secondes et les convertit en nombre entier
    const centiemes = m[3] ? parseFloat("0." + m[3]) : 0; // Récupère les centièmes et les convertit en nombre décimal, ou 0 si non présent
    return (minutes * 60 + secondes + centiemes);         // Total en secondes !
  }

  const s = str.match(/^(\d+)"(\d+)?$/);                                   // Format secondes : 10"85 (secondes"centièmes)
  if (s) return parseInt(s[1], 10) + (s[2] ? parseFloat("0." + s[2]) : 0); // Total en secondes !

  }

  if (type(epreuve) === "saut") {
    return str < 10 ? Math.round(str * 100) : Math.round(str); // < 10 : saisi en mètres
  }

  return str; // Courses en secondes (10.85) et lancers en mètres

}

// ----- Fonction de conversion pour les points Hongrois -----

function conversion_hongrois(str) {

  if (!str) return NaN; // Si la chaîne est vide ou nulle, retourne NaN (Not a Number)

  str = str.trim()                // Supprime les espaces superflus au début et à la fin de la chaîne
           .replace(/[’′]/g, "'") // Remplace les apostrophes et les guillemets typographiques par des apostrophes simples
           .replace(/[”″]/g, '"') // Remplace les guillemets typographiques par des guillemets doubles
           .replace(/''/g, '"')   // Remplace les doubles apostrophes par des guillemets doubles
           .replace(/,/g, ".")   // Remplace les virgules par des points pour les décimales
           .replace(/m/g, ".");  // Remplace les m (mètre) par des points

  const h = str.match(/^(\d+):(\d{1,2})'(\d{1,2})(?:"(\d+)?)?$/);         // Format heures : 1:23'45"00 (heures:minutes'secondes"centièmes)
  if (h) {
    const heures = parseInt(h[1], 10);                                    // Récupère les heures
    const minutes = parseInt(h[2], 10);                                   // Récupère les minutes
    const secondes = parseInt(h[3], 10);                                  // Récupère les secondes
    const centiemes = h[4] ? parseFloat("0." + h[4]) : 0;                 // Centièmes si présents
    return (heures * 3600 + minutes * 60 + secondes + centiemes);         // Total en secondes !
  }

  const m = str.match(/^(\d+)'(\d{1,2})(?:"(\d+)?)?$/);   // Format temps : 3'10"00 (minutes'secondes"centièmes)
  if (m) {
    const minutes = parseInt(m[1], 10);                   // Récupère les minutes et les convertit en nombre entier
    const secondes = parseInt(m[2], 10);                  // Récupère les secondes et les convertit en nombre entier
    const centiemes = m[3] ? parseFloat("0." + m[3]) : 0; // Récupère les centièmes et les convertit en nombre décimal, ou 0 si non présent
    return (minutes * 60 + secondes + centiemes);         // Total en secondes !
  }

  const s = str.match(/^(\d+)"(\d+)?$/);                                   // Format secondes : 10"85 (secondes"centièmes)
  if (s) return parseInt(s[1], 10) + (s[2] ? parseFloat("0." + s[2]) : 0); // Total en secondes !
  
  if (/['"]/.test(str)) return NaN; // Si ça contient ' ou " mais ne correspond pas au format : saisie invalide

  return parseFloat(str); // Sinon, nombre classique (mètres, etc.)
}

// ----- Fonction pour déterminer l'objectif de l'épreuve -----

function sens(epreuve) { // Détermine si une épreuve se mesure en temps (plus petit = meilleur) ou en distance/hauteur (plus grand = meilleur)
  const plus = [         // Liste des épreuves où la plus grande performance est la meilleure. Retourne un booléen "true" ou "false"
    "24 Heures", "30 Minutes", "30 Minutes Marche", "Course Hors-Stade", "Cross",
    "Cross Court", "Cross Long", "Cross Équipe", "Décathlon", "Décathlon Cadets",
    "Décathlon Juniors_Masters", "Disque (1 kg)", "Disque (1.25 kg)", "Disque (1.5 kg)",
    "Disque (1.75 kg)", "Disque (2 kg)", "Disque (600 g)", "Disque (800 g)",
    "Équip'Athlé", "Équip'Athlé N1", "Équip'Athlé N2", "Équipe", "Interclubs",
    "Interclubs Jeunes", "Grand Fond Marche", "Hauteur", "Hauteur (i)", "Heptathlon",
    "Heptathlon (i)", "Heptathlon (i) Cadets", "Heptathlon (i) Juniors_Masters",
    "Heure", "Heure Marche", "Javelot (400 g)", "Javelot (500 g)", "Javelot (600 g)",
    "Javelot (700 g)", "Javelot (800 g)", "Jeune Juge", "Longueur", "Longueur (i)",
    "Marteau (2 kg)", "Marteau (3 kg)", "Marteau (4 kg)", "Marteau (5 kg)", "Marteau (6 kg)",
    "Marteau (7.26 kg)", "Médecine Ball (2 kg) (i)", "Médecine Ball (3 kg) (i)",
    "Médecine Ball (4 kg) (i)", "Octathlon", "Pentathlon", "Pentathlon (i)", "Pentathlon (i) Cadets",
    "Pentathlon (i) Juniors_Masters", "Pentathlon Longueur (i)", "Perche", "Perche (i)",
    "Poids (2 kg)", "Poids (2 kg) (i)", "Poids (3 kg)", "Poids (3 kg) (i)", "Poids (4 kg)",
    "Poids (4 kg) (i)", "Poids (5 kg)", "Poids (5 kg) (i)", "Poids (6 kg)", "Poids (6 kg) (i)",
    "Poids (7.26 kg)", "Poids (7.26 kg) (i)", "Tétrathlon (i)", "Tétrathlon Disque", "Tétrathlon Javelot",
    "Tétrathlon Longueur (i)", "Tétrathlon Perche (i)", "Triathlon (Anciennes Tables)",
    "Triathlon (i) (Anciennes Tables)", "Triathlon", "Triathlon (i)", "Triple Saut", "Triple Saut (i)",
  ];

  return plus.some(mot => epreuve.includes(mot)); // true si l'épreuve est dans la liste "plus" (grande performance = meilleure), false sinon (temps)
}

// ----- Fonction pour déterminer le type de l'épreuve -----

function type(epreuve) { // Détermine si une épreuve est une course, un saut ou un lancer

  const course = [ // Liste des épreuves de course
    "1 000 m",
    "1 000 m (i)",
    "1 500 m",
    "1 500 m (i)",
    "1 500 m Steeple (76)",
    "1 500 m Steeple (84)",
    "1 500 m Steeple (91)",
    "10 000 m",
    "10 000 m Marche",
    "10 000 m Marche (i)",
    "10 km",
    "10 km Marche",
    "10 Miles",
    "100 km",
    "100 km Marche",
    "100 m",
    "100 m Haies (76)",
    "100 m Haies (84)",
    "100 m Haies (91)",
    "100 m Haies (99)",
    "110 m Haies (1.06)",
    "110 m Haies (91)",
    "110 m Haies (99)",
    "12 × 200 m",
    "120 m",
    "15 000 m Marche",
    "15 km",
    "150 m",
    "15 km Marche",
    "2 000 m",
    "2 000 m (i)",
    "2 000 m Marche",
    "2 000 m Marche (i)",
    "2 000 m Steeple (76)",
    "2 000 m Steeple (84)",
    "2 000 m Steeple (91)",
    "2 Miles",
    "2 Miles (i)",
    "20 000 m",
    "20 000 m Marche",
    "20 km",
    "20 km Marche",
    "200 m",
    "200 m (i)",
    "200 m Haies (76)",
    "24 Heures",
    "25 km",
    "3 000 m",
    "3 000 m (i)",
    "3 000 m Marche",
    "3 000 m Marche (i)",
    "3 000 m Steeple (76)",
    "3 000 m Steeple (91)",
    "3 km Marche",
    "30 000 m Marche",
    "30 km",
    "30 km Marche",
    "30 Minutes",
    "30 Minutes Marche",
    "300 m",
    "300 m (i)",
    "320 m Haies (76)",
    "320 m Haies (84)",
    "320 m Haies (91)",
    "35 000 m Marche",
    "35 km Marche",
    "4 × 1 Tour (i)",
    "4 × 100 m",
    "4 × 100 m Mixte",
    "4 × 200 m",
    "4 × 200 m (i)",
    "4 × 400 m",
    "4 × 400 m (i)",
    "4 × 400 m Mixte",
    "4 × 400 m Mixte (i)",
    "4 × 60 m",
    "4 × 60 m Mixte",
    "4 × 800 m",
    "4 × 800 m (i)",
    "400 m",
    "400 m (i)",
    "400 m Haies (76)",
    "400 m Haies (84)",
    "400 m Haies (91)",
    "5 000 m",
    "5 000 m (i)",
    "5 000 m Marche",
    "5 000 m Marche (i)",
    "5 km",
    "5 km Marche",
    "50 000 m Marche",
    "50 km Marche",
    "50 m",
    "50 m (i)",
    "50 m Haies (1.06)",
    "50 m Haies (1.06) (i)",
    "50 m Haies (55)",
    "50 m Haies (65)",
    "50 m Haies (65) (i)",
    "50 m Haies (76)",
    "50 m Haies (76) (i)",
    "50 m Haies (84)",
    "50 m Haies (84) (i)",
    "50 m Haies (91)",
    "50 m Haies (91) (i)",
    "50 m Haies (99)",
    "50 m Haies (99) (i)",
    "500 m",
    "500 m (i)",
    "55 m (i)",
    "55 m Haies (1.06) (i)",
    "55 m Haies (84) (i)",
    "60 m",
    "60 m (i)",
    "60 m Haies (1.06)",
    "60 m Haies (1.06) (i)",
    "60 m Haies (76)",
    "60 m Haies (76) (i)",
    "60 m Haies (84)",
    "60 m Haies (84) (i)",
    "60 m Haies (91)",
    "60 m Haies (91) (i)",
    "60 m Haies (99)",
    "60 m Haies (99) (i)",
    "600 m",
    "600 m (i)",
    "80 m",
    "80 m (i)",
    "80 m Haies (76)",
    "80 m Haies (76) (i)",
    "80 m Haies (84)",
    "800 m",
    "800 m (i)",
    "Course Hors-Stade",
    "Cross",
    "Cross Court",
    "Cross Long",
    "Ekiden",
    "Grand Fond Marche",
    "Heure",
    "Heure Marche",
    "Marathon",
    "Mile",
    "Mile (i)",
    "Mile Road",
    "Relais Américain",
    "Medley Long",
    "Semi-marathon",
  ];

  const saut = [ // Liste des épreuves de saut
    "Hauteur",
    "Hauteur (i)",
    "Longueur",
    "Longueur (i)",
    "Perche",
    "Perche (i)",
    "Triple Saut",
    "Triple Saut (i)",
  ];

  const lancer = [ // Liste des épreuves de lancer
    "Disque (1 kg)",
    "Disque (1.25 kg)",
    "Disque (1.5 kg)",
    "Disque (1.75 kg)",
    "Disque (2 kg)",
    "Disque (600 g)",
    "Disque (800 g)",
    "Javelot (400 g)",
    "Javelot (500 g)",
    "Javelot (600 g)",
    "Javelot (700 g)",
    "Javelot (800 g)",
    "Marteau (2 kg)",
    "Marteau (3 kg)",
    "Marteau (4 kg)",
    "Marteau (5 kg)",
    "Marteau (6 kg)",
    "Marteau (7.26 kg)",
    "Médecine Ball (2 kg) (i)",
    "Médecine Ball (3 kg) (i)",
    "Médecine Ball (4 kg) (i)",
    "Poids (2 kg)",
    "Poids (2 kg) (i)",
    "Poids (3 kg)",
    "Poids (3 kg) (i)",
    "Poids (4 kg)",
    "Poids (4 kg) (i)",
    "Poids (5 kg)",
    "Poids (5 kg) (i)",
    "Poids (6 kg)",
    "Poids (6 kg) (i)",
    "Poids (7.26 kg)",
    "Poids (7.26 kg) (i)",
  ];

  if (course.some(mot => epreuve.includes(mot))) return "course"; // Si l'épreuve est dans la liste "course", retourne "course"
  if (saut.some(mot => epreuve.includes(mot))) return "saut"; // Si l'épreuve est dans la liste "saut", retourne "saut"
  return "lancer"; // Sinon, retourne "lancer" (si l'épreuve est dans la liste "lancer")

}

// ----- Fonction de recherche -----

function recherche(lignes, idxEpreuve, idxPoints, performance, objectif) { // Cherche, dans les lignes de la table, le palier de points le plus proche (le meilleur atteint sans le dépasser) pour la performance donnée.
  let meilleureLigne = null;  // La meilleure ligne trouvée. Le let permet à la variable d'être modifié à l'inverse de const
  let meilleureValeur = null; // La meilleure valeur associée.
 
  for (const ligne of lignes) {                            // On examine chaque ligne du tableau.
    const valeur = conversion_classique(ligne[idxEpreuve]); // On transforme la valeur texte, de la ligne de la boucle, du tableau en nombre exploitable.
    if (isNaN(valeur)) continue;                            // Si la valeur est invalide on ignore la ligne.
 
    const best = objectif // Je crée une constante "best" dans laquelle je vais récupérer un "vrai" ou un "faux". Logique Booléenne.
      ? valeur <= performance && (meilleureValeur === null || valeur > meilleureValeur) // Si l'objectif est d'avoir une performance plus grande que la valeur de la ligne, alors on vérifie si la valeur est inférieure ou égale à la performance et si elle est supérieure à la meilleure valeur trouvée jusqu'à présent.
      : valeur >= performance && (meilleureValeur === null || valeur < meilleureValeur); // Si l'objectif est d'avoir une performance plus petite que la valeur de la ligne, alors on vérifie si la valeur est supérieure ou égale à la performance et si elle est inférieure à la meilleure valeur trouvée jusqu'à présent.
 
    if (best) { // Si la condition est remplie, on met à jour la meilleure valeur et la meilleure ligne.
      meilleureValeur = valeur; // On met à jour la meilleure valeur trouvée jusqu'à présent.
      meilleureLigne = ligne; // On met à jour la meilleure ligne trouvée jusqu'à présent.
    }
  }
 
  return meilleureLigne ? meilleureLigne[idxPoints] : null; // Si on trouve la ligne alors on retourne les points, sinon rien.
}

// ----- Fonction de calcul de mes points combinés -----

function recherche_combine(lignes, idxEpreuve, idxCoef, performance, objectif) {

  const Coef = (nom) => { // Cherche la ligne "a", "b" ou "c" dans la colonne "Coefficients" et renvoie la valeur correspondante pour l'épreuve choisie
    const ligne = lignes.find(l => l[idxCoef]?.trim().toLowerCase() === nom);
    if (!ligne) return NaN;
    return parseFloat(ligne[idxEpreuve].trim().replace(",", ".")); // gère les virgules décimales
  };

  const a = Coef("a");
  const b = Coef("b");
  const c = Coef("c");

  if (isNaN(a) || isNaN(b) || isNaN(c)) return null; // coefficients manquants → "Hors barème"

  const base = objectif ? (performance - b) : (b - performance); // Course : a * (b - T)^c    |    Saut / lancer : a * (P - b)^c

  if (base <= 0) return 0; // performance en dessous du seuil de la table

  const result = Math.floor(a * Math.pow(base, c)); // points arrondis à l'entier inférieur

  if (result > 1500) return 0;

  return result;
}

// ----- Fonction de calcul de mes points combinés -----

function recherche_hongrois(lignes, idxEpreuve, idxCoef, performance) {

  const Coef = (nom) => { // Cherche la ligne "a", "b" ou "c" dans la colonne "Coefficients" et renvoie la valeur correspondante pour l'épreuve choisie
    const ligne = lignes.find(l => l[idxCoef]?.trim().toLowerCase() === nom);
    if (!ligne) return NaN;
    return parseFloat(ligne[idxEpreuve].trim().replace(",", ".")); // gère les virgules décimales
  };

  const a = Coef("a");
  const b = Coef("b");
  const c = Coef("c");

  if (isNaN(a) || isNaN(b) || isNaN(c)) return null; // coefficients manquants → "Hors barème"

  const result = Math.floor((Math.pow((performance + b), 2)) * a + c)

  if (result < 0) return 0;
  if (result > 1500) return 0;

  return result;

}

// ----- Fonction somme jeunes -----

function somme_jeunes(sex, cat) { // Fonction pour calculer la somme des points des trois épreuves

  const epreuve1 = parseFloat(document.getElementById(`output_epreuve1_${cat}_${sex}`).value) || 0; // Récupère la valeur des points de la course, ou 0 si vide
  const epreuve2 = parseFloat(document.getElementById(`output_epreuve2_${cat}_${sex}`).value) || 0; // Récupère la valeur des points du saut, ou 0 si vide
  const epreuve3 = parseFloat(document.getElementById(`output_epreuve3_${cat}_${sex}`).value) || 0; // Récupère la valeur des points du lancer, ou 0 si vide

  const output_somme = document.getElementById(`output_somme_${cat}_${sex}`);                       // Récupère l'élément de sortie pour afficher la somme des points

  const total = epreuve1 + epreuve2 + epreuve3;                       // Calcule la somme des points des trois épreuves

  output_somme.value = total === 0 ? '' : total;                      // Affiche la somme des points dans l'élément de sortie, ou vide si la somme est 0
}

// ----- Fonction somme adultes -----

function somme_adultes(sex, classe) { // Fonction pour calculer la somme des points des trois épreuves

  const epreuve1 = parseFloat(document.getElementById(`output_epreuve1_${classe}_${sex}`).value) || 0; // Récupère la valeur des points de la course, ou 0 si vide
  const epreuve2 = parseFloat(document.getElementById(`output_epreuve2_${classe}_${sex}`).value) || 0; // Récupère la valeur des points du saut, ou 0 si vide
  const epreuve3 = parseFloat(document.getElementById(`output_epreuve3_${classe}_${sex}`).value) || 0; // Récupère la valeur des points du lancer, ou 0 si vide
  const epreuve4 = parseFloat(document.getElementById(`output_epreuve4_${classe}_${sex}`).value) || 0;

  const output_somme = document.getElementById(`output_somme_${classe}_${sex}`);                       // Récupère l'élément de sortie pour afficher la somme des points

  const total = epreuve1 + epreuve2 + epreuve3 + epreuve4;                       // Calcule la somme des points des trois épreuves

  output_somme.value = total === 0 ? '' : total;                      // Affiche la somme des points dans l'élément de sortie, ou vide si la somme est 0
}

// ---------------------------------------------------------------------
// Fonction conversion tables jeunes
// ---------------------------------------------------------------------

async function jeune() { 
  
  // Une fonction async renvoie toujours une Promise et te permet d'utiliser await à l'intérieur. 
  // Ici, fetch doit aller chercher le CSV sur le serveur, ce qui prend du temps.
  // Avec await, la fonction attend la réponse sans figer la page.
  // Une fonction classique ne peut pas utiliser await.

   const sexe = document.getElementById("filtre-sexe").value;           // Récupère la valeur du sexe sélectionné dans le filtre
   const categorie = document.getElementById("filtre-categorie").value; // Récupère la valeur de la catégorie sélectionnée dans le filtre
   const epreuve = document.getElementById("filtre-epreuve").value;     // Récupère la valeur de l'épreuve sélectionnée dans le filtre
   const input = document.getElementById("input").value.trim();         // Récupère la valeur de l'input de performance et supprime les espaces superflus
   const output_jeune = document.getElementById("output-jeune");        // Récupère l'élément de sortie pour afficher les points jeunes

   if (!sexe || !categorie || !epreuve || !input) {  // Vérifie si tous les champs sont remplis
      output_jeune.value = 'Champs incomplets';      // Affiche un message d'erreur si un champ est vide
      return;                                        // Arrête l'exécution de la fonction si un champ est vide
   }

   const cle = `${categorie}|${sexe}`;  // Crée une clé pour accéder au fichier CSV correspondant à la catégorie et au sexe
   const chemin = cotations[cle];       // Récupère le chemin du fichier CSV correspondant à la clé

   if (!chemin) {                                      // Vérifie si le chemin du fichier CSV est défini pour la clé donnée
      output_jeune.value = 'Catégorie non disponible'; // Affiche un message d'erreur si la catégorie n'est pas disponible
      return;                                          // Arrête l'exécution de la fonction si la catégorie n'est pas disponible
   }

  try {                                                              // Essaye de charger et de traiter le fichier CSV
    const res = await fetch(chemin);                                 // Charge le fichier CSV correspondant à la catégorie et au sexe
    if (!res.ok) throw new Error(`Fichier introuvable : ${chemin}`); // Vérifie si le fichier CSV a été chargé correctement, sinon lance une erreur
    const texte = await res.text();                                  // Récupère le contenu du fichier CSV sous forme de texte
 
    const table = parseCSV(texte); // Transforme le texte CSV en tableau de tableaux (lignes x colonnes)
    const entetes = table[0];      // Récupère la première ligne du tableau qui contient les entêtes de colonnes
    const lignes = table.slice(1); // Récupère toutes les lignes du tableau sauf la première (les données)
 
    const idxEpreuve = entetes.indexOf(epreuve); // Récupère l'index de la colonne correspondant à l'épreuve sélectionnée
    const idxPoints = entetes.indexOf("Points"); // Récupère l'index de la colonne correspondant aux points
 
    if (idxEpreuve === -1 || idxPoints === -1) {  // Vérifie si l'épreuve ou la colonne des points n'existe pas dans le tableau
      output_jeune.value = "Épreuve introuvable"; // Affiche un message d'erreur si l'épreuve ou la colonne des points n'existe pas
      return;                                     // Arrête l'exécution de la fonction si l'épreuve ou la colonne des points n'existe pas
    }
 
    const perf = conversion_classique(input);         // Convertit la performance entrée par l'utilisateur en nombre (mètres ou secondes)
    if (isNaN(perf)) {                            // Vérifie si la performance entrée par l'utilisateur est invalide (non numérique)
      output_jeune.value = "Format non invalide"; // Affiche un message d'erreur si la performance entrée par l'utilisateur est invalide
      return;                                     // Arrête l'exécution de la fonction si la performance entrée par l'utilisateur est invalide
    }
 
    const objectif = sens(epreuve);                              // Détermine si l'épreuve est mesurée en temps (plus petit = meilleur) ou en distance/hauteur (plus grand = meilleur)
    const points = recherche(lignes, idxEpreuve, idxPoints, perf, objectif); // Cherche le nombre de points correspondant à la performance entrée par l'utilisateur dans le tableau de cotation
 
    output_jeune.value = points !== null ? points : "Hors barème"; // Affiche le nombre de points correspondant à la performance entrée par l'utilisateur, ou "Hors barème" si la performance est en dehors du barème
 
  } catch (err) {                                 // Attrape les erreurs lors du chargement ou du traitement du fichier CSV
    console.error(err);                           // Affiche l'erreur dans la console pour le débogage
    output_jeune.value = "Erreur de chargement";  // Affiche un message d'erreur si le fichier CSV n'a pas pu être chargé ou traité
  }
}

// ---------------------------------------------------------------------
// Fonction conversion tables combinés
// ---------------------------------------------------------------------

async function combine() { 

   const sexe = document.getElementById("filtre-sexe").value;           // Récupère la valeur du sexe sélectionné dans le filtre
   let categorie = document.getElementById("filtre-categorie").value; // Récupère la valeur de la catégorie sélectionnée dans le filtre
   const epreuve = document.getElementById("filtre-epreuve").value;     // Récupère la valeur de l'épreuve sélectionnée dans le filtre
   const input = document.getElementById("input").value.trim();         // Récupère la valeur de l'input de performance et supprime les espaces superflus
   const output_combine = document.getElementById("output-combine");        // Récupère l'élément de sortie pour afficher les points jeunes

   if (!sexe || !categorie || !epreuve || !input) {  // Vérifie si tous les champs sont remplis
      output_combine.value = 'Champs incomplets';    // Affiche un message d'erreur si un champ est vide
      return;                                        // Arrête l'exécution de la fonction si un champ est vide
   }

  if (["EA", "PO", "BE", "MI", "CA", "JU", "ES", "MA"].includes(categorie)) {
     categorie = "SE";
  }

   const cle = `${categorie}|${sexe}|C`;  // Crée une clé pour accéder au fichier CSV correspondant à la catégorie et au sexe
   const chemin = coefficients[cle];       // Récupère le chemin du fichier CSV correspondant à la clé

   if (!chemin) {                                      // Vérifie si le chemin du fichier CSV est défini pour la clé donnée
      output_combine.value = 'Catégorie non disponible'; // Affiche un message d'erreur si la catégorie n'est pas disponible
      return;                                          // Arrête l'exécution de la fonction si la catégorie n'est pas disponible
   }

  try {                                                              // Essaye de charger et de traiter le fichier CSV
    const res = await fetch(chemin);                                 // Charge le fichier CSV correspondant à la catégorie et au sexe
    if (!res.ok) throw new Error(`Fichier introuvable : ${chemin}`); // Vérifie si le fichier CSV a été chargé correctement, sinon lance une erreur
    const texte = await res.text();                                  // Récupère le contenu du fichier CSV sous forme de texte
 
    const table = parseCSV(texte); // Transforme le texte CSV en tableau de tableaux (lignes x colonnes)
    const entetes = table[0];      // Récupère la première ligne du tableau qui contient les entêtes de colonnes
    const lignes = table.slice(1); // Récupère toutes les lignes du tableau sauf la première (les données)
 
    const idxEpreuve = entetes.indexOf(epreuve); // Récupère l'index de la colonne correspondant à l'épreuve sélectionnée
    const idxCoef = entetes.indexOf("Coefficients"); // Récupère l'index de la colonne correspondant aux coefficients
 
    if (idxEpreuve === -1 || idxCoef === -1) {  // Vérifie si l'épreuve ou la colonne des coefficients n'existe pas dans le tableau
      output_combine.value = "Épreuve introuvable"; // Affiche un message d'erreur si l'épreuve ou la colonne des points n'existe pas
      return;                                     // Arrête l'exécution de la fonction si l'épreuve ou la colonne des points n'existe pas
    }
 
    const performance = conversion_combine(input, epreuve);         // Convertit la performance entrée par l'utilisateur en nombre (mètres ou secondes)
    if (isNaN(performance)) {                            // Vérifie si la performance entrée par l'utilisateur est invalide (non numérique)
      output_combine.value = "Format non invalide"; // Affiche un message d'erreur si la performance entrée par l'utilisateur est invalide
      return;                                     // Arrête l'exécution de la fonction si la performance entrée par l'utilisateur est invalide
    }
 
    const objectif = sens(epreuve);                              // Détermine si l'épreuve est mesurée en temps (plus petit = meilleur) ou en distance/hauteur (plus grand = meilleur)
    const points = recherche_combine(lignes, idxEpreuve, idxCoef, performance, objectif);
 
    output_combine.value = points !== null ? points : "Hors barème"; // Affiche le nombre de points correspondant à la performance entrée par l'utilisateur, ou "Hors barème" si la performance est en dehors du barème
 
  } catch (err) {                                 // Attrape les erreurs lors du chargement ou du traitement du fichier CSV
    console.error(err);                           // Affiche l'erreur dans la console pour le débogage
    output_combine.value = "Erreur de chargement";  // Affiche un message d'erreur si le fichier CSV n'a pas pu être chargé ou traité
  }
}

// ---------------------------------------------------------------------
// Fonction conversion tables hongroises
// ---------------------------------------------------------------------

async function hongrois() { 

   const sexe = document.getElementById("filtre-sexe").value;           // Récupère la valeur du sexe sélectionné dans le filtre
   let categorie = document.getElementById("filtre-categorie").value; // Récupère la valeur de la catégorie sélectionnée dans le filtre
   const epreuve = document.getElementById("filtre-epreuve").value;     // Récupère la valeur de l'épreuve sélectionnée dans le filtre
   const input = document.getElementById("input").value.trim();         // Récupère la valeur de l'input de performance et supprime les espaces superflus
   const output_hongrois = document.getElementById("output-hongrois");        // Récupère l'élément de sortie pour afficher les points jeunes

   if (!sexe || !categorie || !epreuve || !input) {  // Vérifie si tous les champs sont remplis
      output_hongrois.value = 'Champs incomplets';    // Affiche un message d'erreur si un champ est vide
      return;                                        // Arrête l'exécution de la fonction si un champ est vide
   }

  if (["EA", "PO", "BE", "MI", "CA", "JU", "ES", "MA"].includes(categorie)) {
     categorie = "SE";
  }

   const cle = `${categorie}|${sexe}|H`;  // Crée une clé pour accéder au fichier CSV correspondant à la catégorie et au sexe
   const chemin = coefficients[cle];       // Récupère le chemin du fichier CSV correspondant à la clé

   if (!chemin) {                                      // Vérifie si le chemin du fichier CSV est défini pour la clé donnée
      output_hongrois.value = 'Catégorie non disponible'; // Affiche un message d'erreur si la catégorie n'est pas disponible
      return;                                          // Arrête l'exécution de la fonction si la catégorie n'est pas disponible
   }

  try {                                                              // Essaye de charger et de traiter le fichier CSV
    const res = await fetch(chemin);                                 // Charge le fichier CSV correspondant à la catégorie et au sexe
    if (!res.ok) throw new Error(`Fichier introuvable : ${chemin}`); // Vérifie si le fichier CSV a été chargé correctement, sinon lance une erreur
    const texte = await res.text();                                  // Récupère le contenu du fichier CSV sous forme de texte
 
    const table = parseCSV(texte); // Transforme le texte CSV en tableau de tableaux (lignes x colonnes)
    const entetes = table[0];      // Récupère la première ligne du tableau qui contient les entêtes de colonnes
    const lignes = table.slice(1); // Récupère toutes les lignes du tableau sauf la première (les données)
 
    const idxEpreuve = entetes.indexOf(epreuve); // Récupère l'index de la colonne correspondant à l'épreuve sélectionnée
    const idxCoef = entetes.indexOf("Coefficients"); // Récupère l'index de la colonne correspondant aux coefficients
 
    if (idxEpreuve === -1 || idxCoef === -1) {  // Vérifie si l'épreuve ou la colonne des coefficients n'existe pas dans le tableau
      output_hongrois.value = "Épreuve introuvable"; // Affiche un message d'erreur si l'épreuve ou la colonne des points n'existe pas
      return;                                     // Arrête l'exécution de la fonction si l'épreuve ou la colonne des points n'existe pas
    }
 
    const performance = conversion_hongrois(input);         // Convertit la performance entrée par l'utilisateur en nombre (mètres ou secondes)
    if (isNaN(performance)) {                            // Vérifie si la performance entrée par l'utilisateur est invalide (non numérique)
      output_hongrois.value = "Format non invalide"; // Affiche un message d'erreur si la performance entrée par l'utilisateur est invalide
      return;                                     // Arrête l'exécution de la fonction si la performance entrée par l'utilisateur est invalide
    }
 
    const objectif = sens(epreuve);                              // Détermine si l'épreuve est mesurée en temps (plus petit = meilleur) ou en distance/hauteur (plus grand = meilleur)
    const points = recherche_hongrois(lignes, idxEpreuve, idxCoef, performance);
 
    output_hongrois.value = points !== null ? points : "Hors barème"; // Affiche le nombre de points correspondant à la performance entrée par l'utilisateur, ou "Hors barème" si la performance est en dehors du barème
 
  } catch (err) {                                 // Attrape les erreurs lors du chargement ou du traitement du fichier CSV
    console.error(err);                           // Affiche l'erreur dans la console pour le débogage
    output_hongrois.value = "Erreur de chargement";  // Affiche un message d'erreur si le fichier CSV n'a pas pu être chargé ou traité
  }
}

// ---------------------------------------------------------------------
// Fonction pour les niveaux
// ---------------------------------------------------------------------

async function niveau() {

   const sexe = document.getElementById("filtre-sexe").value;           // Récupère la valeur du sexe sélectionné dans le filtre
   let categorie = document.getElementById("filtre-categorie").value; // Récupère la valeur de la catégorie sélectionnée dans le filtre
   let epreuve = document.getElementById("filtre-epreuve").value;     // Récupère la valeur de l'épreuve sélectionnée dans le filtre
   const input = document.getElementById("input").value.trim();         // Récupère la valeur de l'input de performance et supprime les espaces superflus
   const output_niveau = document.getElementById("output-niveau");      // Récupère l'élément de sortie pour afficher les niveaux

  if (!sexe || !categorie || !epreuve || !input) {  // Vérifie si tous les champs sont remplis
     output_niveau.value = 'Champs incomplets';    // Affiche un message d'erreur si un champ est vide
     return;                                       // Arrête l'exécution de la fonction si un champ est vide
   }

  if (["Triathlon", "Triathlon (i)", "Triathlon (Anciennes Tables)", "Triathlon (i) (Anciennes Tables)"].includes(epreuve)) {

      const cle = `${categorie}|${sexe}`; // Crée une clé pour accéder au fichier CSV correspondant à la catégorie et au sexe
      const chemin = niveaux[cle];        // Récupère le chemin du fichier CSV correspondant à la clé

      epreuve = "Triathlon";

      try {                                                              // Essaye de charger et de traiter le fichier CSV
        const res = await fetch(chemin);                                 // Charge le fichier CSV correspondant à la catégorie et au sexe
        if (!res.ok) throw new Error(`Fichier introuvable : ${chemin}`); // Vérifie si le fichier CSV a été chargé correctement, sinon lance une erreur
        const texte = await res.text();                                  // Récupère le contenu du fichier CSV sous forme de texte
    
        const table = parseCSV(texte); // Transforme le texte CSV en tableau de tableaux (lignes x colonnes)
        const entetes = table[0];      // Récupère la première ligne du tableau qui contient les entêtes de colonnes
        const lignes = table.slice(1); // Récupère toutes les lignes du tableau sauf la première (les données)
    
        const idxEpreuve = entetes.indexOf(epreuve); // Récupère l'index de la colonne correspondant à l'épreuve sélectionnée
        const idxNiveaux = entetes.indexOf("Niv."); // Récupère l'index de la colonne correspondant au niveau
    
        if (idxEpreuve === -1 || idxNiveaux === -1) {  // Vérifie si l'épreuve ou la colonne du niveau n'existe pas dans le tableau
          output_niveau.value = "Épreuve introuvable"; // Affiche un message d'erreur si l'épreuve ou la colonne des points n'existe pas
          return;                                     // Arrête l'exécution de la fonction si l'épreuve ou la colonne des points n'existe pas
        }
    
        const perf = conversion_classique(input);         // Convertit la performance entrée par l'utilisateur en nombre (mètres ou secondes)
        if (isNaN(perf)) {                            // Vérifie si la performance entrée par l'utilisateur est invalide (non numérique)
          output_niveau.value = "Format non invalide"; // Affiche un message d'erreur si la performance entrée par l'utilisateur est invalide
          return;                                     // Arrête l'exécution de la fonction si la performance entrée par l'utilisateur est invalide
        }
    
        const objectif = sens(epreuve);                                           // Détermine si l'épreuve est mesurée en temps (plus petit = meilleur) ou en distance/hauteur (plus grand = meilleur)
        const niveau = recherche(lignes, idxEpreuve, idxNiveaux, perf, objectif); 
    
        output_niveau.value = niveau !== null ? niveau : "Hors barème";
    
      } catch (err) {                                 // Attrape les erreurs lors du chargement ou du traitement du fichier CSV
        console.error(err);                           // Affiche l'erreur dans la console pour le débogage
        output_niveau.value = "Erreur de chargement";  // Affiche un message d'erreur si le fichier CSV n'a pas pu être chargé ou traité
      };
      return;
  }
   
  if (["EA", "PO", "BE", "MI", "CA", "JU", "ES", "MA"].includes(categorie)) {
     categorie = "SE";
  }

   const cle = `${categorie}|${sexe}`; // Crée une clé pour accéder au fichier CSV correspondant à la catégorie et au sexe
   const chemin = niveaux[cle];        // Récupère le chemin du fichier CSV correspondant à la clé

  try {                                                              // Essaye de charger et de traiter le fichier CSV
    const res = await fetch(chemin);                                 // Charge le fichier CSV correspondant à la catégorie et au sexe
    if (!res.ok) throw new Error(`Fichier introuvable : ${chemin}`); // Vérifie si le fichier CSV a été chargé correctement, sinon lance une erreur
    const texte = await res.text();                                  // Récupère le contenu du fichier CSV sous forme de texte
 
    const table = parseCSV(texte); // Transforme le texte CSV en tableau de tableaux (lignes x colonnes)
    const entetes = table[0];      // Récupère la première ligne du tableau qui contient les entêtes de colonnes
    const lignes = table.slice(1); // Récupère toutes les lignes du tableau sauf la première (les données)
 
    const idxEpreuve = entetes.indexOf(epreuve); // Récupère l'index de la colonne correspondant à l'épreuve sélectionnée
    const idxNiveaux = entetes.indexOf("Niv."); // Récupère l'index de la colonne correspondant au niveau
 
    if (idxEpreuve === -1 || idxNiveaux === -1) {  // Vérifie si l'épreuve ou la colonne du niveau n'existe pas dans le tableau
      output_niveau.value = "Épreuve introuvable"; // Affiche un message d'erreur si l'épreuve ou la colonne des points n'existe pas
      return;                                     // Arrête l'exécution de la fonction si l'épreuve ou la colonne des points n'existe pas
    }
 
    const perf = conversion_classique(input);         // Convertit la performance entrée par l'utilisateur en nombre (mètres ou secondes)
    if (isNaN(perf)) {                            // Vérifie si la performance entrée par l'utilisateur est invalide (non numérique)
      output_niveau.value = "Format non invalide"; // Affiche un message d'erreur si la performance entrée par l'utilisateur est invalide
      return;                                     // Arrête l'exécution de la fonction si la performance entrée par l'utilisateur est invalide
    }
 
    const objectif = sens(epreuve);                                           // Détermine si l'épreuve est mesurée en temps (plus petit = meilleur) ou en distance/hauteur (plus grand = meilleur)
    const niveau = recherche(lignes, idxEpreuve, idxNiveaux, perf, objectif); 
 
    output_niveau.value = niveau !== null ? niveau : "Hors barème";
 
  } catch (err) {                                 // Attrape les erreurs lors du chargement ou du traitement du fichier CSV
    console.error(err);                           // Affiche l'erreur dans la console pour le débogage
    output_niveau.value = "Erreur de chargement";  // Affiche un message d'erreur si le fichier CSV n'a pas pu être chargé ou traité
  }

}

// ---------------------------------------------------------------------
// Fonction combinés jeunes
// ---------------------------------------------------------------------

async function combine_jeunes(sex, cat, type) { // Fonction pour calculer les points d'une épreuve

   const sexe = sex;                                                                  // Récupère la valeur du sexe sélectionné dans le filtre
   const categorie = cat;                                                             // Récupère la valeur de la catégorie sélectionnée dans le filtre
   const epreuve = document.getElementById(`filtre_${type}_${cat}_${sex}`).value;     // Récupère la valeur de l'épreuve sélectionnée dans le filtre
   const input = document.getElementById(`input_${type}_${cat}_${sex}`).value.trim(); // Récupère la valeur de l'input de performance et supprime les espaces superflus
   const output = document.getElementById(`output_${type}_${cat}_${sex}`);            // Récupère l'élément de sortie pour afficher les points de l'épreuve

   if (!epreuve || !input) { // Vérifie si l'épreuve ou la performance est vide
      output.value = '';     // Affiche un message vide si l'épreuve ou la performance est vide
      return;                // Arrête l'exécution de la fonction si l'épreuve ou la performance est vide
   }

   const cle = `${categorie}|${sexe}`; // Crée une clé pour accéder au fichier CSV correspondant à la catégorie et au sexe
   const chemin = cotations[cle];      // Récupère le chemin du fichier CSV correspondant à la clé

  try {                                                              // Essaye de charger et de traiter le fichier CSV
    const res = await fetch(chemin);                                 // Charge le fichier CSV correspondant à la catégorie et au sexe
    if (!res.ok) throw new Error(`Fichier introuvable : ${chemin}`); // Vérifie si le fichier CSV a été chargé correctement, sinon lance une erreur
    const texte = await res.text();                                  // Récupère le contenu du fichier CSV sous forme de texte
 
    const table = parseCSV(texte); // Transforme le texte CSV en tableau de tableaux (lignes x colonnes)
    const entetes = table[0];      // Récupère la première ligne du tableau qui contient les entêtes de colonnes
    const lignes = table.slice(1); // Récupère toutes les lignes du tableau sauf la première (les données)
 
    const idxEpreuve = entetes.indexOf(epreuve); // Récupère l'index de la colonne correspondant à l'épreuve sélectionnée
    const idxPoints = entetes.indexOf("Points"); // Récupère l'index de la colonne correspondant aux points
 
    if (idxEpreuve === -1 || idxPoints === -1) {  // Vérifie si l'épreuve ou la colonne des points n'existe pas dans le tableau
      output.value = "Épreuve introuvable";       // Affiche un message d'erreur si l'épreuve ou la colonne des points n'existe pas
      return;                                     // Arrête l'exécution de la fonction si l'épreuve ou la colonne des points n'existe pas
    }
 
    const perf = conversion_classique(input);       // Convertit la performance entrée par l'utilisateur en nombre (mètres ou secondes)
    if (isNaN(perf)) {                    // Vérifie si la performance entrée par l'utilisateur est invalide (non numérique)
      output.value = "Format non valide"; // Affiche un message d'erreur si la performance entrée par l'utilisateur est invalide
      return;                             // Arrête l'exécution de la fonction si la performance entrée par l'utilisateur est invalide
    }
 
    const objectif = sens(epreuve);                              // Détermine si l'épreuve est mesurée en temps (plus petit = meilleur) ou en distance/hauteur (plus grand = meilleur)
    const points = recherche(lignes, idxEpreuve, idxPoints, perf, objectif); // Cherche le nombre de points correspondant à la performance entrée par l'utilisateur dans le tableau de cotation
 
    output.value = points !== null ? points : "Hors barème"; // Affiche le nombre de points correspondant à la performance entrée par l'utilisateur, ou "Hors barème" si la performance est en dehors du barème
 
  } catch (err) {                          // Attrape les erreurs lors du chargement ou du traitement du fichier CSV
    console.error(err);                    // Affiche l'erreur dans la console pour le débogage
    output.value = "Erreur de chargement"; // Affiche un message d'erreur si le fichier CSV n'a pas pu être chargé ou traité
  }
}

// ---------------------------------------------------------------------
// Fonction combinés adultes
// ---------------------------------------------------------------------

async function combine_adultes(sex, type, classe) { // Fonction pour calculer les points d'une épreuve

   const sexe = sex;                                                                  // Récupère la valeur du sexe sélectionné dans le filtre
   const epreuve = document.getElementById(`filtre_${type}_${classe}_${sex}`).value;     // Récupère la valeur de l'épreuve sélectionnée dans le filtre
   const input = document.getElementById(`input_${type}_${classe}_${sex}`).value.trim(); // Récupère la valeur de l'input de performance et supprime les espaces superflus
   const output = document.getElementById(`output_${type}_${classe}_${sex}`);            // Récupère l'élément de sortie pour afficher les points de l'épreuve

   if (!epreuve || !input) { // Vérifie si l'épreuve ou la performance est vide
      output.value = '';     // Affiche un message vide si l'épreuve ou la performance est vide
      return;                // Arrête l'exécution de la fonction si l'épreuve ou la performance est vide
   }

   const cle = `SE|${sexe}|C`; // Crée une clé pour accéder au fichier CSV correspondant à la catégorie et au sexe
   const chemin = coefficients[cle];      // Récupère le chemin du fichier CSV correspondant à la clé

  if (!chemin) {                                      // Vérifie si le chemin du fichier CSV est défini pour la clé donnée
      output.value = 'Catégorie non disponible'; // Affiche un message d'erreur si la catégorie n'est pas disponible
      return;                                          // Arrête l'exécution de la fonction si la catégorie n'est pas disponible
   }

  try {                                                              // Essaye de charger et de traiter le fichier CSV
    const res = await fetch(chemin);                                 // Charge le fichier CSV correspondant à la catégorie et au sexe
    if (!res.ok) throw new Error(`Fichier introuvable : ${chemin}`); // Vérifie si le fichier CSV a été chargé correctement, sinon lance une erreur
    const texte = await res.text();                                  // Récupère le contenu du fichier CSV sous forme de texte
 
    const table = parseCSV(texte); // Transforme le texte CSV en tableau de tableaux (lignes x colonnes)
    const entetes = table[0];      // Récupère la première ligne du tableau qui contient les entêtes de colonnes
    const lignes = table.slice(1); // Récupère toutes les lignes du tableau sauf la première (les données)
 
    const idxEpreuve = entetes.indexOf(epreuve); // Récupère l'index de la colonne correspondant à l'épreuve sélectionnée
    const idxPoints = entetes.indexOf("Coefficients"); // Récupère l'index de la colonne correspondant aux points
 
    if (idxEpreuve === -1 || idxPoints === -1) {  // Vérifie si l'épreuve ou la colonne des points n'existe pas dans le tableau
      output.value = "Épreuve introuvable";       // Affiche un message d'erreur si l'épreuve ou la colonne des points n'existe pas
      return;                                     // Arrête l'exécution de la fonction si l'épreuve ou la colonne des points n'existe pas
    }
 
    const perf = conversion_combine(input, epreuve);       // Convertit la performance entrée par l'utilisateur en nombre (mètres ou secondes)
    if (isNaN(perf)) {                    // Vérifie si la performance entrée par l'utilisateur est invalide (non numérique)
      output.value = "Format non valide"; // Affiche un message d'erreur si la performance entrée par l'utilisateur est invalide
      return;                             // Arrête l'exécution de la fonction si la performance entrée par l'utilisateur est invalide
    }
 
    const objectif = sens(epreuve);                              // Détermine si l'épreuve est mesurée en temps (plus petit = meilleur) ou en distance/hauteur (plus grand = meilleur)
    const points = recherche_combine(lignes, idxEpreuve, idxPoints, perf, objectif); // Cherche le nombre de points correspondant à la performance entrée par l'utilisateur dans le tableau de cotation
 
    output.value = points !== null ? points : "Hors barème"; // Affiche le nombre de points correspondant à la performance entrée par l'utilisateur, ou "Hors barème" si la performance est en dehors du barème
 
  } catch (err) {                          // Attrape les erreurs lors du chargement ou du traitement du fichier CSV
    console.error(err);                    // Affiche l'erreur dans la console pour le débogage
    output.value = "Erreur de chargement"; // Affiche un message d'erreur si le fichier CSV n'a pas pu être chargé ou traité
  }
}

// ---------------------------------------------------------------------
// Mise-à-jour des totaux jeunes
// ---------------------------------------------------------------------

async function maj_jeunes(sex, cat, type) {   // Fonction pour mettre à jour les points et la somme des trois épreuves
  await combine_jeunes(sex, cat, type); // Appelle la fonction combiné pour calculer les points de l'épreuve spécifiée
  somme_jeunes(sex, cat);                     // Appelle la fonction somme pour calculer la somme des points des trois épreuves
}

// ---------------------------------------------------------------------
// Mise-à-jour des totaux adultes
// ---------------------------------------------------------------------

async function maj_adultes(sex, type, classe) {   // Fonction pour mettre à jour les points et la somme des trois épreuves
  await combine_adultes(sex, type, classe); // Appelle la fonction combiné pour calculer les points de l'épreuve spécifiée
  somme_adultes(sex, classe);                     // Appelle la fonction somme pour calculer la somme des points des trois épreuves
}

// ---------------------------------------------------------------------
// Départ de toutes mes fonctions
// ---------------------------------------------------------------------

function tout() {
  jeune();
  combine();
  hongrois();
  niveau();
}