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
