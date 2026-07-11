if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then(
      () => console.log("Service Worker registered"),
      (err) => console.log("Service Worker registration failed:", err)
    );
  });
}
