class Countdown {
  constructor(seconds, link) {
    this.btn = document.querySelector("#skip-btn");
    this.seconds = seconds;
    this.link = link;
  }
  updateBtn(val) {
    this.btn.innerHTML = val;
  }
  finish() {
    this.updateBtn("Skip Now");
    this.btn.href = this.link;
  }
  decrement() {
    if (this.seconds > 0) {
      this.updateBtn(`Skip ads in ${this.seconds}s`);
      setTimeout(() => {
        this.seconds--;
        this.decrement();
      }, 1000);
    } else {
      this.finish();
    }
  }
  init() {
    this.decrement();
  }
}
