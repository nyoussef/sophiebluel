let works = [];
let categories = [];
const body = document.querySelector("body");
const projectTitle = document.querySelector("#projectTitle");
const header = document.querySelector("header");
const authButton = document.querySelector(".auth_button");
const modalContainer = document.querySelector(".modalContainer");
const modalGallery = document.querySelector(".modalGallery");
const xmark = document.querySelector(".modalContent .fa-xmark");
const arrowLeft = document.querySelector(".modalContent .fa-arrow-left");
const modalTitle = document.querySelector(".modalContent h2");
const modalForm = document.querySelector(".modalContent form");
const formTitle = document.querySelector("form #title");
const formCategory = document.querySelector("form #category");
const formButton = document.querySelector(".formButton");
const addButton = document.querySelector(".addButton");
const token = localStorage.getItem("token");
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
const previewImg = document.querySelector(".fileContainer img");
const fileInput = document.querySelector(".fileContainer input");
const fileLabel = document.querySelector(".fileContainer label");
const fileIcon = document.querySelector(".fileContainer .fa-image");
const fileParagraph = document.querySelector(".fileContainer p");

async function main() {
  works = await getWorks();
  categories = await getCategories();
  if (!token) {
    await displayCategories();
  } else {
    await displayWorks(works);
    editionMode();
    closeModal();
    //Retour Modal Galerie
    arrowLeft.addEventListener("click", () => {
      clearModal();
      displayModalWorks(works);
    });
    //Modal Ajout
    addButton.addEventListener("click", () => {
      displayModalCategories();
      addWork();
      arrowLeft.style.display = "flex";
      modalTitle.innerHTML = "Ajout photo";
      modalGallery.style.display = "none";
      addButton.style.display = "none";
      modalForm.style.display = "flex";
    });
    //Préchargement image
    previewImage();
    previewImg.addEventListener("click", () => {
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
  const categoriesList = await getCategories();
  categoriesList.push({ name: "Tous", id: "" });
  categoriesList.sort((a, b) => a.id - b.id);
  categoriesList.forEach(async (category) => {
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
    displayWorks(works.filter((p) => p.categoryId == this.id));
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

function clearModal() {
  arrowLeft.style.display = "none";
  modalGallery.style.display = "flex";
  addButton.style.display = "flex";
  modalForm.style.display = "none";
  modalGallery.innerHTML = "";
  previewImg.src = "";
  previewImg.style.display = "none";
  fileLabel.style.display = "flex";
  fileIcon.style.display = "flex";
  fileParagraph.style.display = "flex";
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

async function displayModalCategories() {
  categories = await getCategories();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    formCategory.appendChild(option);
  });
}

function previewImage() {
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewImg.alt = "Prévisualisation de l'image";
        previewImg.style.display = "flex";
        fileLabel.style.display = "none";
        fileIcon.style.display = "none";
        fileParagraph.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });
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
  topBarText.innerHTML =
    '<i class="fa-regular fa-pen-to-square"></i> Mode édition';
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
    modalContainer.style.display = "flex";
    displayModalWorks(works);
  });
}

function closeModal() {
  //Fermeture modal
  xmark.addEventListener("click", () => {
    modalContainer.style.display = "none";
    clearModal();
  });
  modalContainer.addEventListener("click", (e) => {
    if (e.target.className == "modalContainer") {
      modalContainer.style.display = "none";
      clearModal();
    }
  });
}

async function deleteWork(id) {
  const trashes = document.getElementsByClassName("fa-trash-can");
  for (const trash of trashes) {
    if (trash.id == id) {
      const init = {
        method: "DELETE",
        headers: {
          accept: "*/*",
          Authorization: "Bearer " + token,
        },
      };
      fetch("http://localhost:5678/api/works/" + id, init)
        .then((response) => {
          if (response.status !== 204) {
            console.log("Erreur lors de la suppression");
          }
        })
        .then(async (data) => {
          works = await getWorks();
          displayWorks(works);
          displayModalWorks(works);
        });
    }
  }
}

async function addWork() {
  checkInputsFilled();
  modalForm.addEventListener("submit", async (e) => {
    e.preventDefault();
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
        modalContainer.style.display = "none";
        clearModal();
      });
  });
}

function checkInputsFilled() {
  modalForm.addEventListener("input", () => {
    if (
      fileInput.value !== "" &&
      formTitle.value !== "" &&
      formCategory.value !== ""
    ) {
      formButton.disabled = false;
      formButton.style.backgroundColor = "#1d6154";
      formButton.classList.add("hoverButton");
    } else {
      formButton.disabled = true;
      formButton.style.backgroundColor = "#A7A7A7";
      formButton.classList.remove("hoverButton");
    }
  });
}
