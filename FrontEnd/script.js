const getWorks = () => {
    fetch('http://localhost:5678/api/works').then(res => res.json()).then(data => displayWorks(data))
}
getWorks();

const displayWorks = (workList) => {
    const gallery = document.querySelector('.gallery');
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
}
