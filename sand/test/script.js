const readyTemplate = document.createElement("template");
readyTemplate.innerHTML = `
    <section class="action b-primary">
        <h2 class="c-white">Shorten Now</h2>
        <div class="input-container">
            <input
            type="text"
            class="input"
            placeholder="Enter Link"
            />
            <button class="b-secondary c-white btn">Shrink</button>
        </div>
        <p class="c-gray2">
            Shortened links are only active for 30 minutes.
            <a href="#" class="c-white hoverfx" data-text="Login">Login</a> for
            timeless experience.
        </p>
    </section>
      `;

class QuickShorten extends HTMLElement {
  constructor() {
    super();
    this.state = "ready";
    this.input = "";
    this.output = "";
    this.error = "";
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(readyTemplate.content.cloneNode(true));
  }
}

window.customElements.define("quick-shorten", QuickShorten);
