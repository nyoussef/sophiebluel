let works = [];
let categories = [];
const body = document.querySelector("body");
const projectTitle = document.querySelector("#projectTitle");
const header = document.querySelector("header");
const authButton = document.querySelector(".auth_button");
const token = localStorage.getItem("token");
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
//Modal
const modalContainer = document.createElement("div");
modalContainer.className = "modalContainer display-none";
const modalContent = document.createElement("div");
modalContent.className = "modalContent";
const xmark = document.createElement("i");
xmark.className = "fa-solid fa-xmark";
const modalTitle = document.createElement("h2");
const modalGallery = document.createElement("div");
modalGallery.className = "modalGallery display-flex";
const addButton = document.createElement("button");
addButton.className = "addButton hoverButton display-flex";
addButton.innerHTML = "Ajouter une photo";
//Modal Ajout
const arrowLeft = document.createElement("i");
arrowLeft.className = "fa-solid fa-arrow-left display-none";
const modalForm = document.createElement("form");
modalForm.setAttribute("method", "post");
modalForm.setAttribute("enctype", "multipart/form-data");
modalForm.className = "display-none";
const formContent = document.createElement("div");
formContent.className = "formContent";
const fileContainer = document.createElement("div");
fileContainer.className = "fileContainer";
const fileIcon = document.createElement("i");
fileIcon.className = "fa-regular fa-image";
const fileLabel = document.createElement("label");
fileLabel.setAttribute("for", "file");
fileLabel.className = "display-flex";
fileLabel.innerHTML = "+ Ajouter photo";
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.id = "file";
fileInput.name = "image";
const fileParagraph = document.createElement("p");
fileParagraph.innerHTML = "jpg, png : 4mo max";
const fileImage = document.createElement("img");
fileImage.src = "";
fileImage.alt = "";
const titleLabel = document.createElement("label");
titleLabel.setAttribute("for", "title");
titleLabel.innerHTML = "Titre";
const formTitle = document.createElement("input");
formTitle.type = "text";
formTitle.id = "title";
formTitle.name = "title";
const categoriesLabel = document.createElement("label");
categoriesLabel.setAttribute("for", "category");
categoriesLabel.innerHTML = "Catégorie";
const formCategories = document.createElement("select");
formCategories.name = "category";
formCategories.id = "category";
const defaultCategoryOption = document.createElement("option");
defaultCategoryOption.value = "";
defaultCategoryOption.text = "Sélectionnez une catégorie";
defaultCategoryOption.disabled = true;
defaultCategoryOption.selected = true;
const formButton = document.createElement("button");
formButton.className = "formButton";
formButton.innerHTML = "Valider";
formButton.setAttribute("disabled", "disabled");

async function main() {
  works = await getWorks();
  categories = await getCategories();
  if (!token) {
    await displayCategories();
  } else {
    await displayWorks(works);
    editionMode();
    closeModal();
    checkInputsFilled(); 
    //Retour Modal Galerie
    arrowLeft.addEventListener("click", () => {
      clearModal();
      clearAdd();
      displayModalWorks(works);
    });
    //Modal Ajout
    addButton.addEventListener("click", () => {
      displayModalCategories();
      toggleDisplay(arrowLeft, "flex");
      modalTitle.innerHTML = "Ajout photo";
      toggleDisplay(modalGallery, "none");
      toggleDisplay(addButton, "none");
      toggleDisplay(modalForm, "flex");
    });
    //Préchargement image
    previewImage();
    fileImage.addEventListener("click", () => {
      fileInput.click();
      previewImage();
    });
  }
}

main();

async function getWorks() {
  const result = await fetch("http://localhost:5678/api/works");
  return result.json();
}

async function getCategories() {
  const result = await fetch("http://localhost:5678/api/categories");
  return result.json();
}

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

async function displayWorksByCategories() {
  clearActiveFilter();
  if (this.id == "") {
    displayWorks(works);
  } else {
    displayWorks(works.filter((work) => work.categoryId == this.id));
  }
  this.classList.add("active-filter");
}

function clearActiveFilter() {
  const filterButtons = document.querySelectorAll(".filter-button");
  filterButtons.forEach((button) => {
    button.classList.remove("active-filter");
  });
  gallery.innerHTML = "";
}

function editionMode() {
  //Modification bouton de connexion
  authButton.innerHTML = "";
  const logoutButton = document.createElement("div");
  logoutButton.innerHTML = "logout";
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "../index.html";
  };
  logoutButton.addEventListener("click", logout);
  authButton.appendChild(logoutButton);
  //Création topbar
  const topBar = document.createElement("div");
  const topBarText = document.createElement("span");
  topBarText.className = "topBarText";
  topBarText.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Mode édition';
  topBar.className = "topBar";
  header.classList.add("mt20");
  topBar.appendChild(topBarText);
  body.appendChild(topBar);
  //Création bouton modifier
  const editButton = document.createElement("button");
  editButton.className = "editButton";
  editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier';
  projectTitle.appendChild(editButton);
  //Ouverture modal
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


function appendChildren(parent, ...children) {
  children.forEach((child) => {
    parent.appendChild(child);
  });
}

function closeModal() {
  //Fermeture modal
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

function clearModal() {
  toggleDisplay(arrowLeft, "none");
  toggleDisplay(modalGallery, "flex");
  toggleDisplay(addButton, "flex");
  toggleDisplay(modalForm, "none");
  modalGallery.innerHTML = "";
  clearAdd();
}

async function displayModalCategories() {
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    formCategories.appendChild(option);
  });
}

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

function clearCategoryList() {
  const removeOptions = document.querySelectorAll('#category option:not([value=""])');
  removeOptions.forEach(option => {
    option.remove();
  });
}

////////// Ajout Work \\\\\\\\\\
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

function toggleDisplay(element, displayMode) {
  if (displayMode === "flex") {
    element.classList.add("display-flex");
    element.classList.remove("display-none");
  } else if (displayMode === "none") {
    element.classList.add("display-none");    
    element.classList.remove("display-flex");
  }
}

function changeBackgroundColor(element, state) {
  if (state === "enabled") {
    element.classList.add("bg-color-enabled");
    element.classList.remove("bg-color-disabled");
  } else if (state === "disabled") {
    element.classList.add("bg-color-disabled");    
    element.classList.remove("bg-color-enabled");
  }
}