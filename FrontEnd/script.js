let works = [];
let categories = [];

async function getWorks() {
    const result = await fetch('http://localhost:5678/api/works');
    return result.json();    
}

const gallery= document.querySelector('.gallery');
const filters = document.querySelector('.filters');

function displayWorks(workList) {
    works = workList;
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
    let categoriesList = await getCategories();
    categories = categoriesList;
    categoriesList.push({name:"Tous", id:0})
    categoriesList.sort((a,b) => a.id - b.id);
    categoriesList.forEach(category => {
        const button = document.createElement('button');
        button.classList.add('filter-button');
        button.id = category.id;
        button.textContent = category.name;
        button.addEventListener("click", async () => {
            const workList = await getWorks();
            gallery.innerHTML = "";
            //console.log(category.id);
            if(this.id === 0){
                displayWorks(workList);
            }
            else{
                displayWorks(workList.filter(p=> p.categoryId==category.id));
            }
            this.classList.add('active-filter');
        })
        filters.appendChild(button);
    });
    
    
    /*const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', async function() {
            
            
            console.log(this.id);
        });
    });*/
    
};

displayCategories();