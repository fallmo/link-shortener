const btn = document.querySelector("a.btn.go-to-shorten");
const targetInput = document
  .querySelector("quick-shorten")
  .shadowRoot.querySelector(".input-container input");
const footer = document.querySelector("footer");
function goToShorten() {
  targetInput.focus();
  footer.scrollIntoView({ behavior: "smooth" });
}

btn.addEventListener("click", goToShorten);

const sleep = async ms => {
  return await new Promise(resolve => setTimeout(() => resolve(), ms));
};
