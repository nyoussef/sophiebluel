let works = [];
let categories = [];
//Récupération éléments du DOM
const body = document.querySelector("body");
const projectTitle = document.querySelector("#projectTitle");
const header = document.querySelector("header");
const authButton = document.querySelector(".auth_button");
const modalContainer = document.querySelector(".modalContainer");
const modalGallery = document.querySelector(".modalGallery");
const xmark = document.querySelector(".modalContent .fa-xmark");
const arrowLeft = document.querySelector(".modalContent .fa-arrow-left");
const modalTitle = document.querySelector(".modalContent h2");
const addButton = document.querySelector(".addButton");
const token = localStorage.getItem("token");
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

async function main() {
  works = await getWorks();
  categories = await getCategories();
  if (!token) {
    await displayCategories();
  } else {
    await displayWorks(works);
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
    editButton.innerHTML =
      '<i class="fa-regular fa-pen-to-square"></i> modifier';
    projectTitle.appendChild(editButton);
    //Ouverture modal
    editButton.addEventListener("click", () => {
      modalContainer.style.display = "flex";
      displayModalWorks(works);
    });
    //Fermeture modal
    xmark.addEventListener("click", () => {
      clearModal();
    });
    modalContainer.addEventListener("click", (e) => {
      if (e.target.className == "modalContainer") {
        clearModal();
      }
    });
    addButton.addEventListener('click', () => {
      arrowLeft.style.display = "flex";
      modalTitle.innerHTML = "Ajout Photo";
      modalGallery.style.display = "none";
      addButton.style.display = "none";
    })
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
  modalContainer.style.display = "none";
  arrowLeft.style.display = "none";
  modalGallery.style.display = "flex";
  addButton.style.display = "flex";
  modalGallery.innerHTML = "";
  modalTitle.innerHTML = "Galerie photo";
}

async function displayModalWorks(workList) {
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
  const trashes = document.getElementsByClassName("fa-trash-can");
  for (const trash of trashes) {
    if (trash.id == id) {
      const init = {
        method: "DELETE",
        headers: { 
          "accept": "*/*",
          "Authorization": 'Bearer ' + token,
         },
      };
      fetch("http://localhost:5678/api/works/" + id, init)
        .then(response => {
          if (response.status !== 204) {
            console.log("Erreur lors de la suppression");
          } 
        })
        .then(async data => {
          const works = await getWorks();
          displayWorks(works);
          displayModalWorks(works);
        });
    }
  }
}
