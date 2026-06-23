// Flora live chat. Wires the existing .flora-chat card to the Cloudflare Worker.
// Set this to your deployed Worker URL before this will work.
const FLORA_WORKER_URL = "https://flora-api.karanchaudhri.workers.dev";

(function () {
  const stream = document.getElementById("floraStream");
  const input = document.getElementById("floraInput");
  const send = document.getElementById("floraSend");
  if (!stream || !input || !send) return;

  const history = []; // { role, content }

  function addMsg(role, text, extra) {
    const el = document.createElement("div");
    el.className = "msg " + (role === "user" ? "msg-user" : "msg-flora") + (extra ? " " + extra : "");
    el.textContent = text;
    stream.appendChild(el);
    el.scrollIntoView({ block: "nearest" });
    return el;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    input.value = "";
    send.disabled = true;
    addMsg("user", text);
    history.push({ role: "user", content: text });

    const typing = addMsg("flora", "Flora is thinking", "typing");

    try {
      const res = await fetch(FLORA_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      typing.remove();

      if (data.reply) {
        addMsg("flora", data.reply);
        history.push({ role: "assistant", content: data.reply });
      } else {
        addMsg("flora", data.error || "Flora is having a quiet moment. Please try again.");
      }
    } catch (e) {
      typing.remove();
      addMsg("flora", "Flora could not connect just now. Please try again.");
    } finally {
      send.disabled = false;
      input.focus();
    }
  }

  send.addEventListener("click", sendMessage);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });
})();
