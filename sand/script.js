const form = document.querySelector("form#quick-form");
const formInput = document.querySelector("input#quick-input");
const formButton = document.querySelector("button#quick-button");
const loading = document.querySelector(".load-div");
const loadInput = document.querySelector("div#load-input");
const loadOutput = document.querySelector("span#load-output");

function handleForm(e) {
  e.preventDefault();
  startLoad();
}

form.addEventListener("submit", handleForm);

function startLoad() {
  loadInput.innerHTML = formInput.value;
  loadOutput.innerHTML = ".....";
  form.classList.add("hidden");
  loading.classList.remove("hidden");
}
