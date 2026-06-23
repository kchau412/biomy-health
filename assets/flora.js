// Flora live chat, early preview. Wires the chat card to the Cloudflare Worker.
const FLORA_WORKER_URL = "https://flora-api.karanchaudhri.workers.dev";

(function () {
  const stream = document.getElementById("floraStream");
  const input = document.getElementById("floraInput");
  const sendBtn = document.getElementById("floraSend");
  if (!stream || !input || !sendBtn) return;

  // Conversation turns sent to the worker on each request.
  const messages = [];

  function addMessage(role, text) {
    const el = document.createElement("div");
    el.className = "msg " + (role === "user" ? "msg-user" : "msg-flora");
    el.textContent = text;
    stream.appendChild(el);
    stream.scrollTop = stream.scrollHeight;
    return el;
  }

  function setBusy(busy) {
    input.disabled = busy;
    sendBtn.disabled = busy;
  }

  async function send() {
    const text = input.value.trim();
    if (!text) return;

    addMessage("user", text);
    messages.push({ role: "user", content: text });
    input.value = "";
    setBusy(true);

    const typing = addMessage("flora", "Flora is thinking");
    typing.classList.add("typing");

    try {
      const res = await fetch(FLORA_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messages })
      });
      const data = await res.json().catch(function () { return {}; });
      typing.remove();

      if (data && data.reply) {
        addMessage("flora", data.reply);
        messages.push({ role: "assistant", content: data.reply });
      } else if (data && data.error) {
        // Show the worker's own message, for example the rate limit note.
        addMessage("flora", data.error);
      } else {
        addMessage("flora", "Something went wrong reaching Flora. Please try again in a moment.");
      }
    } catch (err) {
      typing.remove();
      addMessage("flora", "Flora could not be reached just now. Please check your connection and try again.");
    } finally {
      setBusy(false);
      input.focus();
    }
  }

  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  });
})();
