document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.add("ring", "ring-yellow-400");
      setTimeout(() => {
        btn.classList.remove("ring", "ring-yellow-400");
      }, 200);
    });
  });
  