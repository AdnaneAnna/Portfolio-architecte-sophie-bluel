// URL de l'API pour récupérer les travaux
const apiUrl = 'http://localhost:5678/api/works';

// URL de l'API pour récupérer les catégories
const categoriesUrl = 'http://localhost:5678/api/categories';

// Fonction pour récupérer les travaux depuis le back-end
async function fetchWorks() {
  try {
    // Appel à l'API pour récupérer les travaux
    const response = await fetch(apiUrl);

    // Vérifier si la requête a réussi
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des travaux : ${response.status} ${response.statusText}`);
    }

    // Extraire les données JSON de la réponse
    const works = await response.json();

    // Afficher les travaux dans la console (pour vérifier)
    console.log('Travaux récupérés :', works);

    return works; // Retourne les travaux pour utilisation ultérieure
  } catch (error) {
    console.error('Erreur :', error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
}

// Fonction pour afficher les travaux dans la galerie
function displayWorks(works) {
  // Sélectionne l'élément de la galerie dans le HTML
  const gallery = document.querySelector('.gallery'); 

  // Vide la galerie actuelle
  gallery.innerHTML = '';

  // Parcours des travaux et création des éléments HTML pour chaque travail
  works.forEach((work) => {
    // Crée un nouvel élément figure pour chaque travail
    const workElement = document.createElement('figure');

    // Ajoute une image et une légende pour chaque travail
    workElement.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>
    `;

    // Ajoute l'élément du travail à la galerie
    gallery.appendChild(workElement);
  });
}

// Fonction pour récupérer les catégories depuis le back-end
async function fetchCategories() {
  try {
    const response = await fetch(categoriesUrl); // Appel à l'API pour obtenir les catégories

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des catégories : ${response.status} ${response.statusText}`);
    }

    const categories = await response.json(); // Conversion de la réponse en format JSON
    console.log('Catégories récupérées :', categories);

    // Appeler la fonction pour afficher les filtres de catégories
    displayCategoryFilters(categories);
  } catch (error) {
    console.error('Erreur :', error);
  }
}

// Fonction pour afficher les filtres de catégories
function displayCategoryFilters(categories) {
  const filterContainer = document.createElement('div'); // Crée un conteneur pour les filtres
  filterContainer.className = 'filters'; // Ajoute une classe pour styliser

  // Ajouter un bouton "Tous" pour afficher tous les travaux
  const allFilter = document.createElement('button');
  allFilter.textContent = 'Tous';
  allFilter.addEventListener('click', async () => {
    const allWorks = await fetchWorks(); // Récupère tous les travaux
    displayWorks(allWorks); // Affiche tous les travaux
  });
  filterContainer.appendChild(allFilter); // Ajoute ce bouton au conteneur

  // Ajouter un bouton pour chaque catégorie
  categories.forEach((category) => {
    const button = document.createElement('button'); // Crée un bouton pour chaque catégorie
    button.textContent = category.name; // Affiche le nom de la catégorie sur le bouton
    button.addEventListener('click', async () => {
      const allWorks = await fetchWorks(); // Récupère tous les travaux
      const filteredWorks = allWorks.filter((work) => work.categoryId === category.id); // Filtre les travaux par categoryId
      displayWorks(filteredWorks); // Affiche uniquement les travaux filtrés
    });
    filterContainer.appendChild(button); // Ajoute le bouton au conteneur
  });

  // Ajoute les filtres de catégories au DOM, avant la galerie
  const portfolioSection = document.getElementById('portfolio');
  portfolioSection.insertBefore(filterContainer, portfolioSection.querySelector('.gallery'));
}

// Appeler les fonctions pour récupérer et afficher les travaux et les filtres au démarrage
async function init() {
  const works = await fetchWorks(); // Récupère les travaux
  displayWorks(works); // Affiche les travaux

  fetchCategories(); // Récupère et affiche les filtres de catégories
}

init(); // Initialise l'application
