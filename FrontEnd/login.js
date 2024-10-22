// Fonction pour vérifier si l'utilisateur est connecté
function checkIfLoggedIn() {
    const token = localStorage.getItem('token');
    const loginLink = document.querySelector('nav ul li a[href="login.html"]');
    
    if (token) {
        loginLink.textContent = 'Logout';
        loginLink.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('token'); // Supprime le token pour déconnexion
            window.location.href = 'index.html'; // Redirige après la déconnexion
        });
    } else {
        loginLink.textContent = 'Login';
    }
}

// Connexion de l'utilisateur
document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Empêche le rechargement de la page

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:5678/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const data = await response.json();

                    // Vérifier ici si le token est bien reçu et le stocker
                    console.log("Données reçues :", data);
                    if (data.token) {
                        localStorage.setItem('token', data.token);
                        console.log("Token stocké :", localStorage.getItem('token'));
                        window.location.href = 'index.html'; // Redirection après connexion
                    } else {
                        console.error("Le token n'est pas présent dans la réponse.");
                        document.getElementById('error-message').style.display = 'block'; // Afficher le message d'erreur
                    }
                } else {
                    document.getElementById('error-message').style.display = 'block';
                    console.error("Erreur lors de la connexion :", response.status);
                }
            } catch (error) {
                console.error('Erreur lors de la connexion:', error);
            }
        });
    }
});

// Appel lors du chargement de la page
window.onload = function() {
    checkIfLoggedIn(); // Vérifie si l'utilisateur est connecté au chargement de la page
};

// Ajout de gestion supplémentaire du bouton Login/Logout dans la page principale (si nécessaire)
document.addEventListener('DOMContentLoaded', function() {
    const loginLogoutButton = document.querySelector('nav ul li a[href="login.html"]');

    function updateLoginLogoutButton() {
        const token = localStorage.getItem('token');
        if (token) {
            loginLogoutButton.textContent = 'Logout';
            loginLogoutButton.href = '#';
            loginLogoutButton.addEventListener('click', function(event) {
                event.preventDefault();
                localStorage.removeItem('token');
                window.location.href = 'index.html'; // Redirige après la déconnexion
            });
        } else {
            loginLogoutButton.textContent = 'Login';
            loginLogoutButton.href = 'login.html';
        }
    }

    updateLoginLogoutButton(); // Mettre à jour le bouton à chaque chargement de la page
});
