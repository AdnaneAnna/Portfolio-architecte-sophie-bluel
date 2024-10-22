// Sélection des éléments du DOM pour la modale
const modal = document.getElementById('modal');
const closeModalBtn = document.querySelector('.close');
const addNewPhotoBtn = document.getElementById('addNewPhotoBtn');
const galleryView = document.getElementById('gallery-view');
const addPhotoView = document.getElementById('add-photo-view');
const editProjectsBtn = document.getElementById('editProjectsBtn');
const editBar = document.getElementById('edit-bar'); // Sélectionne la barre noire

// Fonction pour ouvrir la modale
function openModal() {
    modal.style.display = 'flex';
    galleryView.style.display = 'block'; // Assure que la vue de la galerie est affichée
    addPhotoView.style.display = 'none'; // Cache la vue d'ajout de projet
    loadGallery(); // Charger les travaux existants dans la galerie modale
}

// Fonction pour fermer la modale
function closeModal() {
    modal.style.display = 'none';
    galleryView.style.display = 'block'; // Réinitialise la vue à la galerie photo lors de la fermeture
    addPhotoView.style.display = 'none'; // Cache la vue d'ajout de projet
}

// Fermer la modale si l'on clique sur la croix
closeModalBtn.addEventListener('click', closeModal);

// Fermer la modale si l'on clique en dehors du contenu
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Ouvrir la vue d'ajout de projet
addNewPhotoBtn.addEventListener('click', () => {
    galleryView.style.display = 'none';
    addPhotoView.style.display = 'block';
});

// Ouvrir la modale lorsque l'on clique sur le bouton "Modifier"
editProjectsBtn.addEventListener('click', openModal);

// Fonction pour vérifier si l'utilisateur est connecté
function checkIfLoggedIn() {
    const token = localStorage.getItem('token');
    const loginLink = document.querySelector('nav ul li a[href="login.html"]');
    
    if (token) {
        editProjectsBtn.style.display = 'block'; // Affiche le bouton "Modifier"
        editBar.style.display = 'block'; // Affiche la barre noire de mode édition
        loginLink.textContent = 'Logout';
        loginLink.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('token'); // Supprime le token pour déconnexion
            window.location.href = 'index.html'; // Redirige après la déconnexion
        });
    } else {
        editProjectsBtn.style.display = 'none'; // Cache le bouton "Modifier" si non connecté
        editBar.style.display = 'none'; // Cache la barre noire si non connecté
        loginLink.textContent = 'Login';
    }
}

// Fonction pour créer les éléments des travaux dans la galerie principale
function createProjectElement(project) {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = project.imageUrl;
    img.alt = project.title;

    const caption = document.createElement('figcaption');
    caption.textContent = project.title;

    figure.appendChild(img);
    figure.appendChild(caption);
    return figure;
}

// Fonction pour afficher les travaux dans la galerie principale
function displayProjects(projects) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; // Efface la galerie existante
    projects.forEach(project => {
        const projectElement = createProjectElement(project);
        gallery.appendChild(projectElement);
    });
}

// Fonction pour récupérer et afficher les projets
function fetchAndDisplayProjects() {
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(projects => {
            displayProjects(projects); // Affiche les projets dans la galerie principale
        })
        .catch(error => console.error('Erreur lors de la récupération des projets:', error));
}

// Fonction pour créer un élément projet pour la modale
function createProjectElementForModal(project) {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = project.imageUrl;
    img.alt = project.title;

    const caption = document.createElement('figcaption');
    caption.textContent = project.title;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-icon'); // Ajoute la classe delete-icon
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>'; // Icône de poubelle
    deleteButton.addEventListener('click', () => deleteProject(project.id));

    figure.appendChild(img);
    figure.appendChild(deleteButton);
    return figure;
}

// Fonction pour charger la galerie dans la modale
async function loadGallery() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const works = await response.json();

        const galleryModal = document.querySelector('.gallery-modal');
        galleryModal.innerHTML = ''; // Vide la galerie avant de la remplir

        works.forEach(work => {
            const figure = createProjectElementForModal(work);
            galleryModal.appendChild(figure);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des travaux :', error);
    }
}

// Fonction pour supprimer un projet
function deleteProject(projectId) {
    fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Projet supprimé avec succès');
            loadGallery(); // Recharger la galerie après suppression
            fetchAndDisplayProjects(); // Mettre à jour la galerie principale
        } else {
            alert('Erreur lors de la suppression du projet');
        }
    })
    .catch(error => console.error('Erreur lors de la suppression du projet:', error));
}

// Gestion du formulaire d'ajout de photo
const addPhotoForm = document.getElementById('add-photo-form');

addPhotoForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('image', document.getElementById('image').files[0]);

    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert('Projet ajouté avec succès');
            closeModal();
            fetchAndDisplayProjects(); // Mettre à jour la galerie principale
        } else {
            alert('Erreur lors de l\'ajout du projet');
        }
    })
    .catch(error => console.error('Erreur lors de l\'ajout du projet:', error));
});

// Charger les catégories dans le formulaire d'ajout de projet
function loadCategories() {
    fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(categories => {
        const categorySelect = document.getElementById('category');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    })
    .catch(error => console.error('Erreur lors du chargement des catégories:', error));
}

// Charger les catégories lorsque l'on ouvre la vue "Ajout photo"
addNewPhotoBtn.addEventListener('click', loadCategories);

// Fonction pour créer les filtres dynamiques
function createFilters(categories) {
    const filtersContainer = document.getElementById('filters');
    filtersContainer.innerHTML = ''; // Efface les filtres existants

    // Création d'un bouton pour afficher tous les travaux
    const allFilter = document.createElement('button');
    allFilter.textContent = 'Tous';
    allFilter.addEventListener('click', () => fetchAndDisplayProjects());
    filtersContainer.appendChild(allFilter);

    // Création des boutons de filtres par catégorie
    categories.forEach(category => {
        const filterButton = document.createElement('button');
        filterButton.textContent = category.name;
        filterButton.addEventListener('click', () => filterProjectsByCategory(category.id));
        filtersContainer.appendChild(filterButton);
    });
}

// Fonction pour filtrer les projets par catégorie
function filterProjectsByCategory(categoryId) {
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(projects => {
            const filteredProjects = projects.filter(project => project.categoryId === categoryId);
            displayProjects(filteredProjects); // Affiche les projets filtrés
        })
        .catch(error => console.error('Erreur lors de la récupération des projets filtrés:', error));
}

// Fonction pour récupérer et afficher les filtres (catégories)
function fetchAndDisplayFilters() {
    const categoriesUrl = 'http://localhost:5678/api/categories';
    fetch(categoriesUrl)
        .then(response => response.json())
        .then(categories => {
            createFilters(categories); // Crée et affiche les filtres sur la page
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories:', error));
}

// Appeler cette fonction après que la page se charge
window.onload = function() {
    fetchAndDisplayProjects(); // Récupère et affiche les projets sur la page principale
    fetchAndDisplayFilters();  // Récupère et affiche les filtres
    checkIfLoggedIn();         // Vérifie si l'utilisateur est connecté
};
