const container = document.querySelector("div.shorten-container");
const form = document.querySelector("form");
const formInput = document.querySelector("form input");
const formBtn = document.querySelector("form button");
const state = document.querySelector("p.state");
const successInput = document.querySelector("p.success-input");
const successOutput = document.querySelector("div.success-output");
const failOutput = document.querySelector("p.fail-msg");
const loadAnim = document.querySelector("div.letter-anim.load-anim");
const copyBtn = document.querySelector("button.copy-btn");
const freshBtn = document.querySelector("button.fresh-btn");
const apiUrl = "http://localhost:3030/api/v1/urls/guest";

async function startLoad() {
  disable(true);
  state.className = "uppercase state output c-white text-center";
  state.innerText = "Working...";
  loadAnim.classList.remove("hidden");
  container.className = "shorten-container load b-primary";

  const { error, data } = await shortenLink();

  if (error) return startFailed(error);
  else if (data) return startSuccess(data);
}

function startSuccess(data) {
  state.className = "uppercase state output c-green text-center";
  state.innerText = "Success";
  loadAnim.classList.add("hidden");
  successInput.innerText = data.original_url;
  successOutput.innerText = data.ref_id;
  successOutput.classList.remove("hidden");
  container.className = "shorten-container success b-primary";
}

function startFailed(error) {
  disable(false);
  state.className = "uppercase state output c-secondary text-center";
  state.innerText = "Failed";
  failOutput.innerText = `ERROR: ${error}`;
  loadAnim.classList.add("hidden");
  container.className = "shorten-container failed b-primary";
}

function startFresh() {
  disable(false);
  formInput.value = "";
  successOutput.classList.add("hidden");
  container.className = "shorten-container ready b-primary";
}

async function shortenLink() {
  await sleep(2000);
  let original_url = formInput.value;
  if (
    !original_url.includes("http://") &&
    !original_url.includes("https://") &&
    original_url.includes(".")
  ) {
    original_url = "http://" + original_url;
  }
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ original_url }),
    });

    const data = await response.json();

    if (!data.success) return { error: data.message };
    return { data: data.data };
  } catch (err) {
    return { error: "Failed to make request" };
  }
}

function disable(bool) {
  formInput.disabled = bool;
  formBtn.disabled = bool;
}

function copyOuput() {}

form.addEventListener("submit", e => {
  e.preventDefault();
  startLoad();
});

freshBtn.addEventListener("click", startFresh);
copyBtn.addEventListener("click", copyOuput);

const sleep = async ms => {
  return await new Promise(resolve => setTimeout(() => resolve(), ms));
};
