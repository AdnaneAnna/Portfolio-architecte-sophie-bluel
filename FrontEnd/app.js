document.addEventListener('DOMContentLoaded', () => {
    // Sélectionner les éléments du DOM
    const galleryElement = document.querySelector('.gallery');
    const addPhotoForm = document.getElementById('add-photo-form');
    const imageInput = document.getElementById('img-input');
    const titleInput = document.getElementById('title');
    const categoryInput = document.getElementById('category');
    const submitButton = addPhotoForm.querySelector('button[type="submit"]');
    const modal = document.getElementById('modal');
    const closeModalBtn = document.querySelector('.close');
    const addNewPhotoBtn = document.getElementById('addNewPhotoBtn');
    const galleryView = document.getElementById('gallery-view');
    const addPhotoView = document.getElementById('add-photo-view');
    const editProjectsBtn = document.getElementById('editProjectsBtn');
    const editBar = document.getElementById('edit-bar');
    const imagePreview = document.getElementById("imagePreview");
    const backArrow = document.getElementById('back-arrow'); // Back arrow element

    // Fonction pour ouvrir le sélecteur de fichier lorsque l'on clique sur "Ajouter une photo"
    document.getElementById("modal-img-add").addEventListener("click", () => {
        document.getElementById("img-input").click(); // Ouvre le sélecteur de fichier
    });

    // Fonction pour ouvrir la modale
    function openModal() {
        modal.style.display = 'flex';
        galleryView.style.display = 'block'; 
        addPhotoView.style.display = 'none'; 
        backArrow.style.display = 'none'; // Hide back arrow when opening gallery view
        loadGallery(); 
    }

    // Fonction pour fermer la modale
    function closeModal() {
        modal.style.display = 'none';
        galleryView.style.display = 'block'; 
        addPhotoView.style.display = 'none'; 
        backArrow.style.display = 'none'; // Hide back arrow when closing modal
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
        backArrow.style.display = 'inline'; // Show back arrow when entering add photo view

        // Réinitialiser les champs du formulaire d'ajout
        imageInput.value = ""; // Réinitialise l'input de fichier
        imagePreview.style.display = "none"; // Cache l'aperçu de l'image
        const iconPreview = document.querySelector('.icon-upload-preview');
        const buttonLabel = document.querySelector('.file-upload-label');
        const fileInfo = document.querySelector('.file-info');

        iconPreview.style.display = "block";
        buttonLabel.style.display = "inline-block";
        fileInfo.style.display = "block";

        titleInput.value = ""; // Réinitialise le champ titre
        categoryInput.value = ""; // Réinitialise la sélection de catégorie
        submitButton.disabled = true; // Désactive le bouton Ajouter

        loadCategories(); 
    });

    // Back arrow functionality
    backArrow.addEventListener('click', () => {
        galleryView.style.display = 'block';
        addPhotoView.style.display = 'none';
        backArrow.style.display = 'none'; // Hide back arrow when returning to gallery view
    });

    // Ouvrir la modale lorsque l'on clique sur le bouton "Modifier"
    editProjectsBtn.addEventListener('click', openModal);

    // Fonction pour vérifier si l'utilisateur est connecté
    function checkIfLoggedIn() {
        const token = localStorage.getItem('token');
        const loginLink = document.querySelector('nav ul li a[href="login.html"]');
        
        if (token) {
            editProjectsBtn.style.display = 'block'; 
            editBar.style.display = 'block'; 
            loginLink.textContent = 'Logout';
            loginLink.addEventListener('click', (event) => {
                event.preventDefault();
                localStorage.removeItem('token'); 
                window.location.href = 'login.html'; 
            });
        } else {
            editProjectsBtn.style.display = 'none'; 
            editBar.style.display = 'none'; 
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
        galleryElement.innerHTML = ''; 
        projects.forEach(project => {
            const projectElement = createProjectElement(project);
            galleryElement.appendChild(projectElement);
        });
    }

    // Fonction pour récupérer et afficher les projets
    function fetchAndDisplayProjects() {
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(projects => {
                displayProjects(projects); 
            })
            .catch(error => console.error('Erreur lors de la récupération des projets:', error));
    }

    // Fonction pour créer un élément projet pour la modale
    function createProjectElementForModal(project) {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = project.imageUrl;
        img.alt = project.title;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-icon'); 
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>'; 
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
            galleryModal.innerHTML = ''; 

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
                loadGallery(); 
                fetchAndDisplayProjects(); 
            } else {
                alert('Erreur lors de la suppression du projet');
            }
        })
        .catch(error => console.error('Erreur lors de la suppression du projet:', error));
    }

    // Prévisualisation de l'image ajoutée et gestion de l'affichage
    imageInput.addEventListener('change', function () {
        const file = this.files[0]; // Récupère le fichier sélectionné
        const iconPreview = document.querySelector('.icon-upload-preview');
        const buttonLabel = document.querySelector('.file-upload-label');
        const fileInfo = document.querySelector('.file-info');

        if (file) {
            const reader = new FileReader();

            reader.addEventListener("load", function () {
                // Remplace les éléments par l'image sélectionnée
                imagePreview.src = reader.result;
                imagePreview.style.display = "block";
                
                // Cacher les autres éléments
                iconPreview.style.display = "none";
                buttonLabel.style.display = "none";
                fileInfo.style.display = "none";
            });

            reader.readAsDataURL(file);
        } else {
            // Réinitialiser l'affichage si aucun fichier n'est sélectionné
            imagePreview.style.display = "none";
            iconPreview.style.display = "block";
            buttonLabel.style.display = "inline-block";
            fileInfo.style.display = "block";
        }
    });

    // Vérification des champs du formulaire pour activer ou désactiver le bouton "Ajouter"
    function checkFormFields() {
        const isFilled = imageInput.files.length > 0 && titleInput.value.trim() && categoryInput.value;
        submitButton.disabled = !isFilled; // Active ou désactive le bouton
    }


    // Fonction pour soumettre un nouveau projet
addPhotoForm.addEventListener('submit', async function (event) {
    event.preventDefault(); // Empêche le rechargement de la page

    // Récupérez les données du formulaire
    const file = imageInput.files[0]; // L'image sélectionnée
    const title = titleInput.value.trim();
    const category = categoryInput.value;

    if (!file || !title || !category) {
        alert('Veuillez remplir tous les champs.');
        return;
    }

    // Préparer les données pour l'API
    const formData = new FormData();
    formData.append('image', file); // Ajoute l'image
    formData.append('title', title); // Ajoute le titre
    formData.append('category', category); // Ajoute la catégorie

    try {
        // Envoyer la requête POST à l'API
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (response.ok) {
            alert('Projet ajouté avec succès.');
            
            // Rechargez les projets pour mettre à jour la galerie
            fetchAndDisplayProjects();

            // Réinitialiser le formulaire
            addPhotoForm.reset();
            imagePreview.style.display = "none";
            submitButton.disabled = true;

               // Fermer la modale après ajout réussi
               closeModal();

            // Retour à la vue principale de la galerie dans la modale
            backArrow.click();
        } else {
            const errorData = await response.json();
            console.error('Erreur lors de l\'ajout du projet :', errorData);
            alert('Impossible d\'ajouter le projet.');
        }
    } catch (error) {
        console.error('Erreur réseau ou serveur :', error);
        alert('Une erreur est survenue lors de l\'ajout du projet.');
    }
});


    // Écouteurs pour vérifier les champs du formulaire
    imageInput.addEventListener('change', checkFormFields);
    titleInput.addEventListener('input', checkFormFields);
    categoryInput.addEventListener('change', checkFormFields);

    // Fonction pour charger les catégories dans le formulaire d'ajout de projet
    function loadCategories() {
        fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(categories => {
            const categorySelect = document.getElementById('category');
            categorySelect.innerHTML = ''; 
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
        filtersContainer.innerHTML = ''; 

        const allFilter = document.createElement('button');
        allFilter.textContent = 'Tous';
        allFilter.classList.add('active'); 
        allFilter.addEventListener('click', () => {
            fetchAndDisplayProjects();
            updateActiveFilter(allFilter); 
        });
        filtersContainer.appendChild(allFilter);

        categories.forEach(category => {
            const filterButton = document.createElement('button');
            filterButton.textContent = category.name;
            filterButton.addEventListener('click', () => {
                filterProjectsByCategory(category.id);
                updateActiveFilter(filterButton); 
            });
            filtersContainer.appendChild(filterButton);
        });
    }

    // Fonction pour mettre à jour le style du filtre actif
    function updateActiveFilter(activeButton) {
        const filterButtons = document.querySelectorAll('#filters button');
        filterButtons.forEach(button => button.classList.remove('active')); 
        activeButton.classList.add('active'); 
    }

    // Fonction pour filtrer les projets par catégorie
    function filterProjectsByCategory(categoryId) {
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(projects => {
                const filteredProjects = projects.filter(project => project.categoryId === categoryId);
                displayProjects(filteredProjects); 
            })
            .catch(error => console.error('Erreur lors de la récupération des projets filtrés:', error));
    }

    // Fonction pour récupérer et afficher les filtres
    function fetchAndDisplayFilters() {
        const categoriesUrl = 'http://localhost:5678/api/categories';
        fetch(categoriesUrl)
            .then(response => response.json())
            .then(categories => {
                createFilters(categories); 
            })
            .catch(error => console.error('Erreur lors de la récupération des catégories:', error));
    }

    // Charger les projets et les filtres lors du chargement de la page
    window.onload = function() {
        fetchAndDisplayProjects(); 
        fetchAndDisplayFilters();  
        checkIfLoggedIn();         
    };
});

