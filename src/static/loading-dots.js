const dotTemplate = document.createElement("template");
dotTemplate.innerHTML = `
    <style>
        span.invisible{
            height: 0;
            visibility: hidden;
            overflow: hidden;
            user-select: none;
            pointer-events: none;
        }
        span.visible{
            position: absolute;
        }
    </style>
    <span class="visible"></span>
    <span class="invisible">...</span>
`;
class LoadingDots extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(dotTemplate.content.cloneNode(true));
    this.speed = this.getAttribute("speed") || 700;
    this.auto = this.getAttribute("auto") || false;
    this.animTimeout;
  }
  animate() {
    this.animTimeout = setTimeout(() => {
      const currentVal = this.getVal();
      if (currentVal === ".") this.setVal("..");
      else if (currentVal === "..") this.setVal("...");
      else if (currentVal === "...") this.setVal(".");
      this.animate();
    }, this.speed);
  }

  getVal() {
    return this.shadowRoot.querySelector("span.visible").innerHTML;
  }
  setVal(val) {
    this.shadowRoot.querySelector("span.visible").innerHTML = val;
  }

  stopAnim() {
    this.setVal("");
    clearTimeout(this.animTimeout);
  }

  startAnim() {
    this.setVal(".");
    this.animate();
  }

  connectedCallback() {
    if (this.auto) this.startAnim();
  }

  disconnectedCallback() {
    this.stopAnim();
  }
}

window.customElements.define("loading-dots", LoadingDots);
