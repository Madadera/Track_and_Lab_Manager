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

   const coefficents = {                                 // Dictionnaire des fichiers CSV de mes coefficients selon le type et le sexe
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

// ----- Fonction de conversion -----

function conversion(str) {

  if (!str) return NaN;

  str = str.trim()
           .replace(/[’′]/g, "'")   // apostrophes typographiques -> '
           .replace(/[”″]/g, '"')   // guillemets typographiques -> "
           .replace(/''/g, '"')     // deux apostrophes collées = guillemet
           .replace(/,/g, ".");     // virgules -> points

  // Format temps : 3'10"00 (minutes'secondes"centièmes)
  const m = str.match(/^(\d+)'(\d{1,2})(?:"(\d+)?)?$/);
  if (m) {
    const minutes = parseInt(m[1], 10);
    const secondes = parseInt(m[2], 10);
    const centiemes = m[3] ? parseFloat("0." + m[3]) : 0;
    return (minutes * 60 + secondes + centiemes) / 86400;
  }

  // Si ça contient ' ou " mais ne correspond pas au format : saisie invalide
  if (/['"]/.test(str)) return NaN;

  return parseFloat(str); // Sinon, nombre classique (mètres, etc.)
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
function trouverPoints(lignes, idxEpreuve, idxPoints, perf, objectif) {
  let meilleureLigne = null;
  let meilleureValeur = null;
 
  for (const ligne of lignes) {
    const valTable = conversion(ligne[idxEpreuve]);
    if (isNaN(valTable)) continue;
 
    const estMeilleure = objectif
      ? valTable >= perf && (meilleureValeur === null || valTable < meilleureValeur)
      : valTable <= perf && (meilleureValeur === null || valTable > meilleureValeur);
 
    if (estMeilleure) {
      meilleureValeur = valTable;
      meilleureLigne = ligne;
    }
  }
 
  return meilleureLigne ? meilleureLigne[idxPoints] : null;
}

// ----- Fonction somme -----

function somme(sex, cat) { // Fonction pour calculer la somme des points des trois épreuves

  const course = parseFloat(document.getElementById(`output_course_${cat}_${sex}`).value) || 0; // Récupère la valeur des points de la course, ou 0 si vide
  const saut = parseFloat(document.getElementById(`output_saut_${cat}_${sex}`).value) || 0;     // Récupère la valeur des points du saut, ou 0 si vide
  const lancer = parseFloat(document.getElementById(`output_lancer_${cat}_${sex}`).value) || 0; // Récupère la valeur des points du lancer, ou 0 si vide
  const output_somme = document.getElementById(`output_somme_${cat}_${sex}`);                       // Récupère l'élément de sortie pour afficher la somme des points

  const total = course + saut + lancer;                                               // Calcule la somme des points des trois épreuves

  output_somme.value = total === 0 ? '' : total;                                      // Affiche la somme des points dans l'élément de sortie, ou vide si la somme est 0
}

// ---------------------------------------------------------------------
// Fonctions conversion
// ---------------------------------------------------------------------

async function cotation_jeune() { 
  
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

   const cle = `${categorie}|${sexe}`; // Crée une clé pour accéder au fichier CSV correspondant à la catégorie et au sexe
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
 
    const perf = conversion(input);         // Convertit la performance entrée par l'utilisateur en nombre (mètres ou secondes)
    if (isNaN(perf)) {                            // Vérifie si la performance entrée par l'utilisateur est invalide (non numérique)
      output_jeune.value = "Format non invalide"; // Affiche un message d'erreur si la performance entrée par l'utilisateur est invalide
      return;                                     // Arrête l'exécution de la fonction si la performance entrée par l'utilisateur est invalide
    }
 
    const objectif = estUneEpreuveDeTemps(epreuve);                              // Détermine si l'épreuve est mesurée en temps (plus petit = meilleur) ou en distance/hauteur (plus grand = meilleur)
    const points = trouverPoints(lignes, idxEpreuve, idxPoints, perf, objectif); // Cherche le nombre de points correspondant à la performance entrée par l'utilisateur dans le tableau de cotation
 
    output_jeune.value = points !== null ? points : "Hors barème"; // Affiche le nombre de points correspondant à la performance entrée par l'utilisateur, ou "Hors barème" si la performance est en dehors du barème
 
  } catch (err) {                                // Attrape les erreurs lors du chargement ou du traitement du fichier CSV
    console.error(err);                          // Affiche l'erreur dans la console pour le débogage
    output_jeune.value = "Erreur de chargement"; // Affiche un message d'erreur si le fichier CSV n'a pas pu être chargé ou traité
  }
}

// ---------------------------------------------------------------------
// Fonctions combinés
// ---------------------------------------------------------------------

async function combiné(sex, cat, type) {

   const sexe = sex;
   const categorie = cat;
   const epreuve = document.getElementById(`filtre_${type}_${cat}_${sex}`).value;
   const input = document.getElementById(`input_${type}_${cat}_${sex}`).value.trim();
   const output = document.getElementById(`output_${type}_${cat}_${sex}`);

   if (!epreuve || !input) {
      output.value = '';
      return;
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
 
    const perf = conversion(input);         // Convertit la performance entrée par l'utilisateur en nombre (mètres ou secondes)
    if (isNaN(perf)) {                            // Vérifie si la performance entrée par l'utilisateur est invalide (non numérique)
      output.value = "Format non valide"; // Affiche un message d'erreur si la performance entrée par l'utilisateur est invalide
      return;                                     // Arrête l'exécution de la fonction si la performance entrée par l'utilisateur est invalide
    }
 
    const objectif = estUneEpreuveDeTemps(epreuve);                              // Détermine si l'épreuve est mesurée en temps (plus petit = meilleur) ou en distance/hauteur (plus grand = meilleur)
    const points = trouverPoints(lignes, idxEpreuve, idxPoints, perf, objectif); // Cherche le nombre de points correspondant à la performance entrée par l'utilisateur dans le tableau de cotation
 
    output.value = points !== null ? points : "Hors barème"; // Affiche le nombre de points correspondant à la performance entrée par l'utilisateur, ou "Hors barème" si la performance est en dehors du barème
 
  } catch (err) {                          // Attrape les erreurs lors du chargement ou du traitement du fichier CSV
    console.error(err);                    // Affiche l'erreur dans la console pour le débogage
    output.value = "Erreur de chargement"; // Affiche un message d'erreur si le fichier CSV n'a pas pu être chargé ou traité
  }
}

// ---------------------------------------------------------------------
// Mise-à-jour des totaux
// ---------------------------------------------------------------------

async function maj(sex, cat, type) {   // Fonction pour mettre à jour les points et la somme des trois épreuves
  await combiné(sex, cat, type); // Appelle la fonction combiné pour calculer les points de l'épreuve spécifiée
  somme(sex, cat);                   // Appelle la fonction somme pour calculer la somme des points des trois épreuves
}