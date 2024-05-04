let works = [];
let categories = [];
const token = localStorage.getItem('token');

async function main ()  {
    works = await getWorks();
    categories = await getCategories();
    if (!token) {
        await displayCategories();        
    }
    else{
        await displayWorks(works);
        const body = document.querySelector('body');
        const projectTitle = document.querySelector('#projectTitle');
        const header = document.querySelector('header');
        const authButton = document.querySelector('.auth_button');
        authButton.innerHTML = "";
        const logoutButton = document.createElement('div');
        logoutButton.innerHTML = 'logout';
        const logout = () => {
            localStorage.removeItem('token'); 
            window.location.href="../index.html";       
        }
        logoutButton.addEventListener('click', logout);
        authButton.appendChild(logoutButton);
        const topBar = document.createElement('div'); 
        const topBarText = document.createElement('span');       
        topBarText.className = "topBarText";
        topBarText.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Mode édition';
        topBar.className = "topBar";
        header.classList.add("mt20");
        topBar.appendChild(topBarText);
        body.appendChild(topBar);
        const editButton = document.createElement('button');
        editButton.className = "editButton";
        editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier';
        projectTitle.appendChild(editButton);
        

    }
}

main();

async function getWorks() {
    const result = await fetch('http://localhost:5678/api/works');
    return result.json();    
}

async function getCategories() {
    const result = await fetch('http://localhost:5678/api/categories');
    return result.json();
}

const gallery= document.querySelector('.gallery');
const filters = document.querySelector('.filters');

async function displayWorks(workList) {
    for (let index = 0; index < workList.length; index++) {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = workList[index].imageUrl;
        img.alt = workList[index].title;
        const figcaption = document.createElement('figcaption');
        figcaption.innerHTML = workList[index].title;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }    
};    

async function displayCategories() {
    const categoriesList = await getCategories();
    categoriesList.push({ name: "Tous", id: "" });
    categoriesList.sort((a, b) => a.id - b.id);
    categoriesList.forEach(async category => {
        const button = document.createElement('button');
        button.classList.add('filter-button');
        button.id = category.id;
        button.textContent = category.name;
        button.addEventListener('click', displayWorksByCategories);
        filters.appendChild(button);
        if (button.id=="") {
            await displayWorks(works);
            button.classList.add('active-filter');
        }
    });    
};

async function displayWorksByCategories() {    
    clearActiveFilter();
    if (this.id == "") {
        displayWorks(works);
    } else {
        displayWorks(works.filter(p=> p.categoryId==this.id));
    }
    this.classList.add('active-filter');
}

function clearActiveFilter() {
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.classList.remove('active-filter');
    });
    gallery.innerHTML = "";
}