const url = "data/members.json";
const container = document.querySelector("#members");
const gridBtn = document.querySelector("#gridBtn");
const listBtn = document.querySelector("#listBtn");
const menuBtn = document.querySelector("#menu");
const nav = document.querySelector("#primary-navigation");

async function getMembers() {
    const response = await fetch(url);
    const data = await response.json();
    displayMembers(data);
}

function membershipLabel(level) {
    switch (level) {
        case 3:
            return "Gold Member";
        case 2:
            return "Silver Member";
        default:
            return "Chamber Member";
    }
}

function formatPhone(phone) {
    return phone.replace(/[^+0-9]/g, "");
}

function displayMembers(members) {
    container.innerHTML = "";
    members.forEach(member => {
        const card = document.createElement("article");
        card.className = `member-card membership-${member.membership}`;
        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name} logo">
            <div class="member-copy">
                <div class="member-headline">
                    <h3>${member.name}</h3>
                    <span class="member-level">${membershipLabel(member.membership)}</span>
                </div>
                <p class="member-description">${member.description}</p>
                <p>${member.address}</p>
                <p><a href="tel:${formatPhone(member.phone)}">${member.phone}</a></p>
                <p><a href="${member.website}" target="_blank" rel="noopener">${member.website}</a></p>
            </div>
        `;
        container.appendChild(card);
    });
}

function setActiveButton(selectedButton) {
    [gridBtn, listBtn].forEach(button => {
        button.classList.toggle("active", button === selectedButton);
    });
}

gridBtn.addEventListener("click", () => {
    container.classList.add("grid");
    container.classList.remove("list");
    setActiveButton(gridBtn);
});

listBtn.addEventListener("click", () => {
    container.classList.add("list");
    container.classList.remove("grid");
    setActiveButton(listBtn);
});

menuBtn.addEventListener("click", () => {
    const expanded = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", expanded);
});

getMembers();