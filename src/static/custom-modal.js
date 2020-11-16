const modalTemplate = document.createElement("template");
modalTemplate.innerHTML = `
    <style>
        @import url('pre.css');
        @import url('style.css');
    </style>
    <div class="modal-wrapper hidden">
        <div class="modal-overlay"></div>
        <div class="modal bd-gray2">
            <div class="modal-header uppercase c-gray"></div>
            <div class="modal-body">
            <slot/>
            </div>
        </div>
    </div>
`;

class Modal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(modalTemplate.content.cloneNode(true));
    this.shadowRoot.querySelector(
      ".modal-header"
    ).innerHTML = this.getAttribute("title");
  }
  open() {
    this.shadowRoot.querySelector(".modal-wrapper").classList.remove("hidden");
  }

  close() {
    this.shadowRoot.querySelector(".modal-wrapper").classList.add("hidden");
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector(".modal-wrapper")
      .addEventListener("click", () => this.close());
  }
  disconnectedCallback() {
    this.shadowRoot.querySelector(".modal-wrapper").removeEventListener();
  }
}

window.customElements.define("custom-modal", Modal);

const modalOpeners = [
  ...document.querySelectorAll("[data-target]"),
  ...document
    .querySelector("quick-shorten")
    .shadowRoot.querySelectorAll("[data-target]"),
];

modalOpeners.forEach(opener => {
  opener.addEventListener("click", () => {
    document
      .querySelector(`[data-label='${opener.getAttribute("data-target")}']`)
      .open();
  });
});
