const toggleButton = document.getElementById('theme-toggle');
const htmlElement = document.documentElement; // <html>

// Au chargement de la page : vérifie si un thème est déjà enregistré
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  htmlElement.setAttribute('data-theme', savedTheme);
}

// Au clic sur le bouton : bascule le thème
toggleButton.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  htmlElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme); // Mémorise le choix de l'utilisateur
});