(function () {
  function getMinuteToken() {
    return Math.floor(Date.now() / 60000);
  }

  const script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/gh/OnSignals/FIC-floater/fic-floater.min.js?v=" +
    getMinuteToken();

  script.async = true;
  document.head.appendChild(script);
})();
