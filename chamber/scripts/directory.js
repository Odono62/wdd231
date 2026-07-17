const url = "data/members.json";
const container = document.querySelector("#members");
const gridBtn = document.querySelector("#gridBtn");
const listBtn = document.querySelector("#listBtn");
const menuBtn = document.querySelector("#menu");
const nav = document.querySelector("#primary-navigation");

const membershipLabel = level =>
    level === 3 ? "Gold Member" : level === 2 ? "Silver Member" : "Chamber Member";

const formatPhone = phone => phone.replace(/[^+0-9]/g, "");

function displayMembers(members) {
    container.innerHTML = members
        .map(member => `
            <article class="member-card membership-${member.membership}">
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
            </article>
        `)
        .join("");
}

async function getMembers() {
    const response = await fetch(url);
    const data = await response.json();
    displayMembers(data);
}

async function getMembers() {
    const response = await fetch(url);
    const members = await response.json();
    displayMembers(members);
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
