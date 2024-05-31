// Sélection du formulaire et de l'élément pour afficher les messages d'erreur
const form = document.querySelector("form");
const errorText = document.querySelector(".errorText");

// Récupération du token de connexion depuis le localStorage
const token = localStorage.getItem('token');

// URL de l'API pour la connexion des utilisateurs
const apiUrl = "http://localhost:5678/api/users/login";

// Si un token existe déjà, redirection vers la page d'accueil
if (token) {
    window.location.href = "../index.html";
}

// Ajout d'un écouteur d'événement pour la soumission du formulaire
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Empêche le comportement par défaut de soumission du formulaire
  
  // Récupération des valeurs des champs email et mot de passe
  const userEmail = document.querySelector("#email");
  const userPassword = document.querySelector("#password");
  
  // Création de l'objet contenant les données à envoyer
  const postData = {
    email: userEmail.value,
    password: userPassword.value,
  };
  
  // Envoi des données à l'API avec une requête POST
  fetch(apiUrl, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    body: JSON.stringify(postData), // Conversion des données en JSON
  })
    .then((response) => response.json()) // Conversion de la réponse en JSON
    .then(data => {
      // Si le token est présent dans la réponse, l'utilisateur est authentifié
      if (data.token !== undefined) {
        // Stockage du token dans le localStorage
        localStorage.setItem("token", data.token);
        // Redirection vers la page d'accueil
        window.location.href = "../index.html";
      } else {
        // Si l'authentification échoue, suppression du token et affichage d'un message d'erreur
        localStorage.removeItem('token');
        errorText.innerHTML = "Identifiant et/ou mot de passe incorrect"; // Message d'erreur
        // Mise en évidence des champs avec des bordures rouges
        userEmail.style.border = "2px solid red";
        userPassword.style.border = "2px solid red";
      }
    })
    .catch((error) => {
      // Gestion des erreurs de la requête fetch
      console.log("erreur", error);
    });
});
