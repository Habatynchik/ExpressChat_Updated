let chats = [];
let currentChat = null;
let theme = localStorage.getItem("theme") || "dark";

if (theme === "light") document.body.classList.add("light");

getAllChats();

function addMember() {
    const list = document.getElementsByClassName("chat-header")[0];
    list.innerHTML = "";

    fetch("users/all", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }).then((response) => {
        return response.json()
    })
        .then(data => {
            data.forEach(element => {
                const div = document.createElement("div");
                div.innerHTML = ` <button onclick="addToChat(${element.id})"> ${element.username} </button>`;
                list.appendChild(div);
            })
        })
}


function addToChat(id) {
    fetch(`messages/${currentChat}/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({users: [id]})
    })
}

function getAllChats() {
    fetch("/chat/all", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(res => res.json())
        .then(data => {
            data.forEach(chat => {
                chats.push({id: chat.id, name: chat.name, messages: []});
            })
            renderChats()
        })
}

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
            <button onclick="deleteChat(${chat.id});event.stopPropagation()">❌</button>
        `;

        div.onclick = () => openChat(chat.id);
        list.appendChild(div);
    });
}

function createChat() {
    const name = prompt("Назва чату:");
    if (!name) return;


    const data = {
        name: name,
        imageUrl: "EMPTY",
        userId: localStorage.getItem("userId"),
    }

    fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then(res => res.json())
        .then(data => {
            chats.push({id: data.id, name: data.name, messages: []});
            renderChats()
        })
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

    fetch(`/messages/${currentChat}/all`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }).then(res => res.json())
        .then(data => {
            data.forEach(message => {
                const div = document.createElement("div");
                div.className = "message";
                div.textContent = message.username + ": " + message.text;
                messages.appendChild(div);
            })
        })
}

function sendMessage() {
    const input = document.getElementById("input");
    if (!input.value || currentChat === null) return;

    const msg = {message: input.value};

    fetch(`/messages/${currentChat}/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(msg),
    }).then(res => res.json())
        .then(data => {
            const messages = document.getElementById("messages");
            const div = document.createElement("div");
            div.className = "message";
            div.textContent = data.username + ": " + data.text;
            messages.appendChild(div);
        })
}

function toggleTheme() {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
}

renderChats();

document.getElementById("input").addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
});