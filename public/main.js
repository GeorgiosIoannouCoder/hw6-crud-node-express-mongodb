// Update button.
const update = document.querySelector("#update-button");

// Delete button.
const deleteButton = document.querySelector("#delete-button");

// If we receive "No quote to delete" from res.json, then we can change the textContent of this .message div.
const messageDiv = document.querySelector("#message");

// Update button event listener.
update.addEventListener("click", (_) => {
  fetch("/quotes", {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Darth Vader",
      quote: "I find your lack of faith disturbing.",
    }),
  })
    .then((res) => {
      if (res.ok) return res.json();
    })
    .then((response) => {
      window.location.reload(true);
    });
});

// Delete button event listener.
deleteButton.addEventListener("click", (_) => {
  fetch("/quotes", {
    method: "delete",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Darth Vader",
    }),
  })
    .then((res) => {
      if (res.ok) return res.json();
    })
    .then((response) => {
      if (response === "No quote to delete") {
        messageDiv.textContent = "No Darth Vader quote to delete";
      } else {
        window.location.reload(true);
      }
    })
    .catch((error) => console.error(error));
});
