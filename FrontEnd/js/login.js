const form = document.querySelector("form");
const token = localStorage.getItem('token');
const apiUrl = "http://localhost:5678/api/users/login";

if (token) {
    window.location.href="../index.html";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const userEmail = document.querySelector("#email").value;
  const userPassword = document.querySelector("#password").value;
  const postData = {
    email: userEmail,
    password: userPassword,
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
    .then((data) => {
      localStorage.setItem("token", data.token);
      window.location.href="../index.html";
    })
    .catch((error) => {
      console.error("erreur", error);
    });
});
