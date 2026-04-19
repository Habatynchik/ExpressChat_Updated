let chats = [];
let currentChat = null;
let theme = localStorage.getItem("theme") || "dark";

if (theme === "light") document.body.classList.add("light");

function save() {

}

function renderChats() {
    const list = document.getElementById("chatList");
    list.innerHTML = "";

    chats.forEach((chat, index) => {
        const div = document.createElement("div");
        div.className = "chat-item";
        div.innerHTML = `
            ${chat.name}
            <button onclick="deleteChat(${index});event.stopPropagation()">❌</button>
        `;

        div.onclick = () => openChat(index);
        list.appendChild(div);
    });
}

function createChat() {
    const name = prompt("Назва чату:");
    if (!name) return;

    chats.push({ name, messages: [] });

    const data = {
        name: name,
        imageUrl: "EMPTY",
        userId: localStorage.getItem("userId"),
    }

    fetch("/chat", {
        method: "POST",
        body: JSON.stringify(data),
    })

    save();
    renderChats();
}

function deleteChat(index) {
    chats.splice(index, 1);
    save();
    renderChats();
    // TODO create fetch
    document.getElementById("messages").innerHTML = "";
}

function openChat(index) {
    currentChat = index;
    const messages = document.getElementById("messages");
    messages.innerHTML = "";

    // TODO create fetch
    chats[index].messages.forEach(m => {
        const div = document.createElement("div");
        div.className = "message " + m.type;
        div.textContent = m.text;
        messages.appendChild(div);
    });
}

function sendMessage() {
    const input = document.getElementById("input");
    if (!input.value || currentChat === null) return;

    const msg = { text: input.value, type: "me" };
    chats[currentChat].messages.push(msg);

    const div = document.createElement("div");
    div.className = "message me";
    div.textContent = input.value;

    document.getElementById("messages").appendChild(div);

    input.value = "";
    save();

    setTimeout(() => {
        const reply = { text: "Ок 👍", type: "other" };
        chats[currentChat].messages.push(reply);

        const div2 = document.createElement("div");
        div2.className = "message other";
        div2.textContent = reply.text;

        document.getElementById("messages").appendChild(div2);
        save();
    }, 500);
}

function toggleTheme() {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
}

renderChats();

document.getElementById("input").addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
});