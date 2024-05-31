// Initialisation des variables pour stocker les travaux et les catégories
let works = [];
let categories = [];

// Sélection des éléments du DOM nécessaires pour l'application
const body = document.querySelector("body");
const projectTitle = document.querySelector("#projectTitle");
const header = document.querySelector("header");
const authButton = document.querySelector(".auth_button");
const token = localStorage.getItem("token"); // Récupération du token de connexion depuis le localStorage
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

// Création des éléments du modal
const modalContainer = document.createElement("div");
modalContainer.className = "modalContainer display-none"; // Conteneur principal du modal, caché par défaut
const modalContent = document.createElement("div");
modalContent.className = "modalContent"; // Conteneur du contenu du modal
const xmark = document.createElement("i");
xmark.className = "fa-solid fa-xmark"; // Icône de fermeture du modal
const modalTitle = document.createElement("h2"); // Titre du modal
const modalGallery = document.createElement("div");
modalGallery.className = "modalGallery display-flex"; // Galerie des travaux dans le modal
const addButton = document.createElement("button");
addButton.className = "addButton hoverButton display-flex"; // Bouton pour ajouter une photo, affiché par défaut
addButton.innerHTML = "Ajouter une photo";

// Création des éléments pour le modal d'ajout
const arrowLeft = document.createElement("i");
arrowLeft.className = "fa-solid fa-arrow-left display-none"; // Icône pour revenir à la galerie du modal, caché par défaut
const modalForm = document.createElement("form");
modalForm.setAttribute("method", "post");
modalForm.setAttribute("enctype", "multipart/form-data"); // Formulaire pour ajouter un travail
modalForm.className = "display-none"; // Formulaire caché par défaut
const formContent = document.createElement("div");
formContent.className = "formContent"; // Conteneur pour le contenu du formulaire

// Création des éléments pour le téléchargement de fichiers
const fileContainer = document.createElement("div");
fileContainer.className = "fileContainer"; // Conteneur pour les éléments de téléchargement de fichiers
const fileIcon = document.createElement("i");
fileIcon.className = "fa-regular fa-image"; // Icône représentant une image
const fileLabel = document.createElement("label");
fileLabel.setAttribute("for", "file");
fileLabel.className = "display-flex";
fileLabel.innerHTML = "+ Ajouter photo"; // Étiquette pour le bouton de téléchargement de fichiers
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.id = "file";
fileInput.name = "image"; // Champ d'entrée pour le téléchargement de fichiers
const fileParagraph = document.createElement("p");
fileParagraph.innerHTML = "jpg, png : 4mo max"; // Paragraphe avec des instructions pour le téléchargement de fichiers
const fileImage = document.createElement("img");
fileImage.src = "";
fileImage.alt = ""; // Image de prévisualisation du fichier téléchargé

// Création des éléments pour le titre du travail
const titleLabel = document.createElement("label");
titleLabel.setAttribute("for", "title");
titleLabel.innerHTML = "Titre"; // Étiquette pour le champ du titre
const formTitle = document.createElement("input");
formTitle.type = "text";
formTitle.id = "title";
formTitle.name = "title"; // Champ d'entrée pour le titre du travail

// Création des éléments pour la catégorie du travail
const categoriesLabel = document.createElement("label");
categoriesLabel.setAttribute("for", "category");
categoriesLabel.innerHTML = "Catégorie"; // Étiquette pour le champ de sélection des catégories
const formCategories = document.createElement("select");
formCategories.name = "category";
formCategories.id = "category"; // Champ de sélection pour les catégories
const defaultCategoryOption = document.createElement("option");
defaultCategoryOption.value = "";
defaultCategoryOption.text = "Sélectionnez une catégorie";
defaultCategoryOption.disabled = true;
defaultCategoryOption.selected = true; // Option par défaut pour la sélection des catégories

// Création du bouton de soumission du formulaire
const formButton = document.createElement("button");
formButton.className = "formButton";
formButton.innerHTML = "Valider";
formButton.setAttribute("disabled", "disabled"); // Bouton désactivé par défaut


// Fonction principale exécutée lorsque le script est chargé
async function main() {
  // Récupération des travaux et des catégories
  works = await getWorks();
  categories = await getCategories();
  
  // Si aucun token n'est présent, afficher les catégories
  if (!token) {
    await displayCategories();
  } else {
    // Sinon, afficher les travaux, activer le mode édition et les autres fonctionnalités
    await displayWorks(works);
    editionMode();
    closeModal();
    checkInputsFilled(); 
    
    // Gestionnaire d'événement pour revenir à la galerie depuis le modal
    arrowLeft.addEventListener("click", () => {
      clearModal();
      clearAdd();
      displayModalWorks(works);
    });
    
    // Gestionnaire d'événement pour ouvrir le modal d'ajout
    addButton.addEventListener("click", () => {
      displayModalCategories();
      toggleDisplay(arrowLeft, "flex");
      modalTitle.innerHTML = "Ajout photo";
      toggleDisplay(modalGallery, "none");
      toggleDisplay(addButton, "none");
      toggleDisplay(modalForm, "flex");
    });
    
    // Prévisualisation de l'image à ajouter
    previewImage();
    fileImage.addEventListener("click", () => {
      fileInput.click();
      previewImage();
    });
  }
}

// Appel de la fonction principale
main();

// Fonction pour récupérer les travaux depuis l'API
async function getWorks() {
  const result = await fetch("http://localhost:5678/api/works");
  return result.json();
}

// Fonction pour récupérer les catégories depuis l'API
async function getCategories() {
  const result = await fetch("http://localhost:5678/api/categories");
  return result.json();
}

// Fonction pour afficher les travaux dans la galerie
async function displayWorks(workList) {
  gallery.innerHTML = "";
  for (let index = 0; index < workList.length; index++) {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = workList[index].imageUrl;
    img.alt = workList[index].title;
    const figcaption = document.createElement("figcaption");
    figcaption.innerHTML = workList[index].title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  }
}

// Fonction pour afficher les catégories sous forme de boutons de filtre
async function displayCategories() {
  categories.push({ name: "Tous", id: "" });
  categories.sort((a, b) => a.id - b.id);
  categories.forEach(async (category) => {
    const button = document.createElement("button");
    button.classList.add("filter-button");
    button.id = category.id;
    button.textContent = category.name;
    button.addEventListener("click", displayWorksByCategories);
    filters.appendChild(button);
    if (button.id == "") {
      await displayWorks(works);
      button.classList.add("active-filter");
    }
  });
}

// Fonction pour afficher les travaux filtrés par catégorie
async function displayWorksByCategories() {
  clearActiveFilter();
  if (this.id == "") {
    displayWorks(works);
  } else {
    displayWorks(works.filter((work) => work.categoryId == this.id));
  }
  this.classList.add("active-filter");
}

// Fonction pour supprimer le filtre actif
function clearActiveFilter() {
  const filterButtons = document.querySelectorAll(".filter-button");
  filterButtons.forEach((button) => {
    button.classList.remove("active-filter");
  });
  gallery.innerHTML = "";
}

// Fonction pour activer le mode édition (affichage d'éléments supplémentaires)
function editionMode() {
  // Modification du bouton de connexion pour afficher un bouton de déconnexion
  authButton.innerHTML = "";
  const logoutButton = document.createElement("div");
  logoutButton.innerHTML = "logout";
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "../index.html";
  };
  logoutButton.addEventListener("click", logout);
  authButton.appendChild(logoutButton);
  
  // Création et affichage de la barre supérieure en mode édition
  const topBar = document.createElement("div");
  const topBarText = document.createElement("span");
  topBarText.className = "topBarText";
  topBarText.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Mode édition';
  topBar.className = "topBar";
  header.classList.add("mt20");
  topBar.appendChild(topBarText);
  body.appendChild(topBar);
  
  // Création et affichage du bouton modifier
  const editButton = document.createElement("button");
  editButton.className = "editButton";
  editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier';
  projectTitle.appendChild(editButton);
  
  // Gestionnaire d'événement pour ouvrir le modal de modification
  editButton.addEventListener("click", () => {
    toggleDisplay(modalContainer, "flex");
    displayModalWorks(works);
    appendChildren(fileContainer, fileIcon, fileLabel, fileInput, fileParagraph, fileImage);
    appendChildren(formCategories, defaultCategoryOption);
    appendChildren(formContent, fileContainer, titleLabel, formTitle, categoriesLabel, formCategories);
    appendChildren(modalForm, formContent, formButton);
    appendChildren(modalContent, arrowLeft, xmark, modalTitle, modalGallery, addButton, modalForm);
    appendChildren(modalContainer, modalContent);
    appendChildren(body, modalContainer);
  });
}

// Fonction pour afficher les travaux dans le modal
async function displayModalWorks(workList) {
  modalTitle.innerHTML = "Galerie photo";
  modalGallery.innerHTML = "";
  for (let index = 0; index < workList.length; index++) {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const i = document.createElement("i");
    i.className = "fa-solid fa-trash-can";
    i.id = workList[index].id;
    i.addEventListener("click", () => deleteWork(i.id));
    img.src = workList[index].imageUrl;
    img.alt = workList[index].title;
    figure.appendChild(i);
    figure.appendChild(img);
    modalGallery.appendChild(figure);
  }
}

// Fonction pour supprimer un travail via l'API
async function deleteWork(id) {
  const init = {
    method: "DELETE",
    headers: {
      accept: "*/*",
      Authorization: "Bearer " + token,
    },
  };
  fetch("http://localhost:5678/api/works/" + id, init)
    .then((response) => {
      if (!response.ok) {
        return alert("Erreur lors de la suppression");
      }
    })
    .then(async (data) => {
      works = await getWorks();
      displayWorks(works);
      displayModalWorks(works);
      clearAdd();
    });
}

// Fonction pour ajouter plusieurs enfants à un élément parent
function appendChildren(parent, ...children) {
  children.forEach((child) => {
    parent.appendChild(child);
  });
}

// Fonction pour gérer la fermeture du modal
function closeModal() {
  xmark.addEventListener("click", () => {
    toggleDisplay(modalContainer, "none");
    clearModal();
  });
  modalContainer.addEventListener("click", (e) => {
    if (e.target.className == "modalContainer display-flex") {
      clearModal();
      toggleDisplay(modalContainer, "none");
    }
  });
}

// Fonction pour réinitialiser le contenu du modal
function clearModal() {
  toggleDisplay(arrowLeft, "none");
  toggleDisplay(modalGallery, "flex");
  toggleDisplay(addButton, "flex");
  toggleDisplay(modalForm, "none");
  modalGallery.innerHTML = "";
  clearAdd();
}

// Fonction pour afficher les catégories dans le formulaire du modal
async function displayModalCategories() {
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    formCategories.appendChild(option);
  });
}

// Fonction pour vérifier que tous les champs du formulaire sont remplis
function checkInputsFilled() {
  modalForm.addEventListener("input", () => {
    if (fileInput.value !== "" && formTitle.value !== "" && formCategories.value !== "") {
      formButton.disabled = false;
      changeBackgroundColor(formButton, 'enabled');
      formButton.classList.add("hoverButton");
    } else {
      formButton.disabled = true;
      changeBackgroundColor(formButton, 'disabled');
      formButton.classList.remove("hoverButton");
    }
  });
}

// Fonction pour réinitialiser les champs du formulaire d'ajout
function clearAdd() {
  toggleDisplay(fileImage, "none");
  fileImage.src = "";
  formTitle.value = "";
  formCategories.value = "";
  toggleDisplay(fileLabel, "flex");
  toggleDisplay(fileIcon, "flex");
  toggleDisplay(fileParagraph, "flex");
  formButton.disabled = true;
  changeBackgroundColor(formButton, 'disabled');
  formButton.classList.remove("hoverButton");
  clearCategoryList();
}

// Fonction pour réinitialiser la liste des catégories du formulaire d'ajout
function clearCategoryList() {
  const removeOptions = document.querySelectorAll('#category option:not([value=""])');
  removeOptions.forEach(option => {
    option.remove();
  });
}

// Gestionnaire d'événement pour l'ajout d'un nouveau travail
modalForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!fileInput.files[0] || !formTitle.value || !formCategories.value) {
    return alert("Veuillez remplir tous les champs du formulaire");
  }
  const formData = new FormData(modalForm);
  fetch("http://localhost:5678/api/works/", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: "Bearer " + token,
      accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then(async (data) => {
      works = await getWorks();
      displayWorks(works);
      displayModalWorks(works);
      clearAdd();
    });
});

// Fonction pour prévisualiser l'image avant l'ajout
function previewImage() {
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        fileImage.src = e.target.result;
        fileImage.alt = "Prévisualisation de l'image";
        toggleDisplay(fileImage, "flex");
        toggleDisplay(fileLabel, "none");
        toggleDisplay(fileIcon, "none");
        toggleDisplay(fileParagraph, "none");
      };
      reader.readAsDataURL(file);
    }
  });
}

// Fonction pour basculer l'affichage des éléments
function toggleDisplay(element, displayMode) {
  if (displayMode === "flex") {
    element.classList.add("display-flex");
    element.classList.remove("display-none");
  } else if (displayMode === "none") {
    element.classList.add("display-none");    
    element.classList.remove("display-flex");
  }
}

// Fonction pour changer la couleur de fond d'un élément en fonction de son état
function changeBackgroundColor(element, state) {
  if (state === "enabled") {
    element.classList.add("bg-color-enabled");
    element.classList.remove("bg-color-disabled");
  } else if (state === "disabled") {
    element.classList.add("bg-color-disabled");    
    element.classList.remove("bg-color-enabled");
  }
}