async function getWorks() {
    const result = await fetch('http://localhost:5678/api/works');
    return result.json();    
}

const gallery= document.querySelector('.gallery');
const filters = document.querySelector('.filters');

function displayWorks(workList) {
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

async function getCategories() {
    const result = await fetch('http://localhost:5678/api/categories');
    return result.json();
}

async function displayCategories() {
    const categoriesList = await getCategories();
    categoriesList.forEach(category => {
        const button = document.createElement('button');
        button.classList.add('filter-button');
        button.id = category.id;
        button.textContent = category.name;
        filters.appendChild(button);
    });
    
    
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', async function() {
            filterButtons.forEach(button => {
                button.classList.remove('active-filter');
                gallery.innerHTML = "";
            });
            const workList = await getWorks();
            if(this.id === ""){
                displayWorks(workList);
            }
            else{
                displayWorks(workList.filter(p=> p.categoryId==this.id));
            }
            this.classList.add('active-filter');
            console.log(this.id);
        });
    });
    
};

displayCategories();