function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const shortenTemplate = document.createElement("template");
shortenTemplate.innerHTML = `
<style>
    @import url('/static/pre.css');
    @import url('/static/style.css');
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
        gripurl.com /
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
        <textarea class="hidden"></textarea>
        <button class="btn b-secondary c-white shrink copy-btn">Copy</button>
        <button class="btn b-tertiary c-white shrink fresh-btn">New</button>
        </div>
    </div>
</div>
<div class="flash-container hidden"></div>
`;

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
    this.copyField = this.shadowRoot.querySelector("textarea");
    this.flashContainer = this.shadowRoot.querySelector("div.flash-container");
    this.apiUrl = "https://gripurl.com/api/v1/urls/guest";
    this.flashTimeout;
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
    this.flash({ color: "green", text: "Link Shortened Successfully" });
  }

  startFailed(error) {
    this.disable(false);
    this.state.className = "uppercase state output c-secondary text-center";
    this.state.innerText = "Failed";
    this.failOutput.innerText = `ERROR: ${error}`;
    this.loadAnim.classList.add("hidden");
    this.container.className = "shorten-container failed b-primary";
    this.flash({ color: "secondary", text: "Link Shortening Failed" });
  }

  startFresh() {
    this.disable(false);
    grecaptcha.reset();
    this.formInput.value = "";
    this.successOutput.classList.add("hidden");
    this.container.className = "shorten-container ready b-primary";
  }

  disable(bool) {
    this.formInput.disabled = bool;
    this.formBtn.disabled = bool;
  }

  async shortenLink() {
    // await sleep(2000);
    let original_url = this.formInput.value;
    const recaptcha = grecaptcha.getResponse();
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
        body: JSON.stringify({ original_url, recaptcha }),
      });
      const data = await response.json();
      if (!data.success) return { error: data.message };
      return { data: data.data };
    } catch (err) {
      return { error: "Failed to make request" };
    }
  }
  copyLink() {
    this.copyField.value = `https://gripurl.com/${this.successOutput.innerText}`;
    this.copyField.className = "copyTextArea";
    this.copyField.select();
    document.execCommand("copy");
    this.copyField.className = "hidden";
    this.copyField.value = "";
    this.flash({ color: "green", text: "Link Copied" });
  }

  flash({ text, color = "white" }) {
    if (!text) return;
    this.flashContainer.innerText = text;
    this.flashContainer.className = `flash-container c-${color}`;
    this.flashTimeout = setTimeout(() => {
      this.flashContainer.className = "flash-container leaving";
      this.flashTimeout = setTimeout(() => {
        this.flashContainer.innerText = "";
        this.flashContainer.className = "flash-container hidden";
      }, 500);
    }, 2500);
  }

  connectedCallback() {
    this.form.addEventListener("submit", e => {
      e.preventDefault();
      if (this.state.innerText === "Failed") return this.startLoad();
      else return grecaptcha.execute();
    });

    this.freshBtn.addEventListener("click", () => this.startFresh());
    this.copyBtn.addEventListener("click", () => this.copyLink());

    if (getCookie("vs20") === "") {
      setTimeout(() => {
        this.flash({ text: "This website uses cookies", color: "white" });
      }, 3000);
      return setCookie("vs20", "true", 90);
    }
  }
}

window.customElements.define("quick-shorten", QuickShorten);

function submitLink() {
  document.querySelector("quick-shorten").startLoad();
}
