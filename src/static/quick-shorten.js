const shortenTemplate = document.createElement("template");
shortenTemplate.innerHTML = `
<style>
    @import url('pre.css');
    @import url('style.css');
</style>
<div class="shorten-container ready b-primary">
    <div class="row ready">
        <h2 class="text-center c-white">Shorten Now</h2>
    </div>
    <div class="row load success failed">
        <p class="uppercase state output text-center c-white"></p>
    </div>
    <div class="row ready failed load">
        <form>
        <div class="input-container m-auto">
            <input type="text" placeholder="Enter link" value="" required />
            <button class="b-secondary c-white btn">Shorten</button>
        </div>
        </form>
    </div>
    <div class="row success">
        <p class="c-white output success-input text-center"></p>
    </div>
    <div class="row success load">
        <div class="text-center output c-white">
        momo.me /
        <div class="letter-anim load-anim hidden">
            <div class="circle b-gray2"></div>
            <div class="circle b-gray2"></div>
            <div class="circle b-gray2"></div>
            <div class="circle b-gray2"></div>
            <div class="circle b-gray2"></div>
        </div>
        <div class="letter-anim success-output hidden c-green"></div>
        </div>
    </div>
    <div class="row failed">
        <p class="fail-msg c-gray2 text-center"></p>
    </div>
    <div class="row ready">
        <p class="text-center c-gray2">
        By proceeding you are agreeing with our
        <a class="c-white hoverfx" data-text="Terms of Usage"
        data-target="terms"
            >Terms of Usage</a
        >.
        </p>
    </div>
    <div class="row success">
        <div class="btn-row action-btns">
        <button class="btn b-secondary c-white shrink copy-btn">Copy</button>
        <button class="btn b-tertiary c-white shrink fresh-btn">New</button>
        </div>
    </div>
</div>`;

class QuickShorten extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(shortenTemplate.content.cloneNode(true));
    this.container = this.shadowRoot.querySelector("div.shorten-container");
    this.form = this.shadowRoot.querySelector("form");
    this.formInput = this.shadowRoot.querySelector("form input");
    this.formBtn = this.shadowRoot.querySelector("form button");
    this.state = this.shadowRoot.querySelector("p.state");
    this.successInput = this.shadowRoot.querySelector("p.success-input");
    this.successOutput = this.shadowRoot.querySelector("div.success-output");
    this.failOutput = this.shadowRoot.querySelector("p.fail-msg");
    this.loadAnim = this.shadowRoot.querySelector("div.letter-anim.load-anim");
    this.copyBtn = this.shadowRoot.querySelector("button.copy-btn");
    this.freshBtn = this.shadowRoot.querySelector("button.fresh-btn");
    this.apiUrl = "http://localhost:3030/api/v1/urls/guest";
  }
  async startLoad() {
    this.disable(true);
    this.state.className = "uppercase state output c-white text-center";
    this.state.innerHTML = "Working<loading-dots auto='true'/>";
    this.loadAnim.classList.remove("hidden");
    this.container.className = "shorten-container load b-primary";

    const { error, data } = await this.shortenLink();

    if (error) return this.startFailed(error);
    else if (data) return this.startSuccess(data);
  }

  startSuccess(data) {
    this.state.className = "uppercase state output c-green text-center";
    this.state.innerText = "Success";
    this.loadAnim.classList.add("hidden");
    this.successInput.innerText = data.original_url;
    this.successOutput.innerText = data.ref_id;
    this.successOutput.classList.remove("hidden");
    this.container.className = "shorten-container success b-primary";
  }

  startFailed(error) {
    this.disable(false);
    this.state.className = "uppercase state output c-secondary text-center";
    this.state.innerText = "Failed";
    this.failOutput.innerText = `ERROR: ${error}`;
    this.loadAnim.classList.add("hidden");
    this.container.className = "shorten-container failed b-primary";
  }

  startFresh() {
    this.disable(false);
    this.formInput.value = "";
    this.successOutput.classList.add("hidden");
    this.container.className = "shorten-container ready b-primary";
  }

  disable(bool) {
    this.formInput.disabled = bool;
    this.formBtn.disabled = bool;
  }

  async shortenLink() {
    await sleep(2000);
    let original_url = this.formInput.value;
    if (
      !original_url.includes("http://") &&
      !original_url.includes("https://") &&
      original_url.includes(".")
    ) {
      original_url = "http://" + original_url;
    }
    try {
      const response = await fetch(this.apiUrl, {
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
  copyLink() {
    console.log("try to copy");
  }

  connectedCallback() {
    this.form.addEventListener("submit", e => {
      e.preventDefault();
      this.startLoad();
    });

    this.freshBtn.addEventListener("click", () => this.startFresh());
    this.copyBtn.addEventListener("click", () => this.copyLink());
  }
}

window.customElements.define("quick-shorten", QuickShorten);
