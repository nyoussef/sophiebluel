const form = document.querySelector("form");
const errorText = document.querySelector(".errorText");
const token = localStorage.getItem('token');
const apiUrl = "http://localhost:5678/api/users/login";

if (token) {
    window.location.href="../index.html";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const userEmail = document.querySelector("#email");
  const userPassword = document.querySelector("#password");
  const postData = {
    email: userEmail.value,
    password: userPassword.value,
  };
  console.log(JSON.stringify(postData));
  fetch(apiUrl, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    body: JSON.stringify(postData),
  })
    .then((response) => response.json())
    .then(data => {
      if (data.token !== undefined) {
        localStorage.setItem("token", data.token);
        window.location.href="../index.html";
      }
      else{
        localStorage.removeItem('token');
        errorText.innerHTML = "Identifiant et/ou mot de passe incorrect";
        userEmail.style.border = "2px solid red";
        userPassword.style.border = "2px solid red";
      }
    })
    .catch((error) => {
      console.log("erreur", error);
    });
});

