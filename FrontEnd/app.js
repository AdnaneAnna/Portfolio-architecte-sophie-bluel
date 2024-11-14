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
    const imagePreview = document.getElementById('img-preview');
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

    // Prévisualisation de l'image ajoutée
    imageInput.addEventListener('change', function () {
        const file = this.files[0];
        const reader = new FileReader();

        reader.addEventListener("load", function () {
            imagePreview.src = reader.result;
            imagePreview.style.display = "block";
            imagePreview.style.height = "auto";  // Ajuster la hauteur pour correspondre au conteneur
            imagePreview.style.maxHeight = "150px"; // Hauteur maximale souhaitée dans la maquette
        });

        reader.readAsDataURL(file);
    });

    // Fonction pour vérifier l'état du bouton "Ajouter"
    function checkFormFields() {
        const isFilled = imageInput.files.length > 0 && titleInput.value.trim() && categoryInput.value;
        submitButton.disabled = !isFilled; // Active ou désactive le bouton
    }

    // Écouteurs pour vérifier les champs du formulaire
    imageInput.addEventListener('change', checkFormFields);
    titleInput.addEventListener('input', checkFormFields);
    categoryInput.addEventListener('change', checkFormFields);

    // Gestion du formulaire d'ajout de photo
    addPhotoForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        if (!imageInput.files.length || !titleInput.value.trim() || !categoryInput.value) {
            alert('Veuillez remplir tous les champs et ajouter une image.');
            return;
        }

        const formData = new FormData();
        formData.append('title', titleInput.value);
        formData.append('category', categoryInput.value);
        formData.append('image', imageInput.files[0]);

        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.id && data.imageUrl) {
                alert('Projet ajouté avec succès');
                const newProject = {
                    id: data.id,
                    imageUrl: data.imageUrl,
                    title: data.title,
                    categoryId: data.categoryId
                };
                galleryElement.appendChild(createProjectElement(newProject)); 
                document.querySelector('.gallery-modal').appendChild(createProjectElementForModal(newProject)); 
                closeModal(); 
            } else {
                alert('Erreur lors de l\'ajout du projet. Vérifiez que tous les champs sont correctement remplis.');
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

    // Appeler cette fonction après que la page se charge
    window.onload = function() {
        fetchAndDisplayProjects(); 
        fetchAndDisplayFilters();  
        checkIfLoggedIn();         
    };
});
