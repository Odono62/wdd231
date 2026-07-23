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
    if (!container) return;

    const fragment = document.createDocumentFragment();

    members.forEach(member => {
        const article = document.createElement("article");
        article.className = `member-card membership-${member.membership}`;
        article.innerHTML = `
            <img src="${member.logo}" alt="${member.name} logo" class="member-logo" loading="lazy" decoding="async">
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
        fragment.appendChild(article);
    });

    container.replaceChildren(fragment);
}

async function getMembers() {
    try {
        const response = await fetch(url, { cache: "force-cache" });
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        const members = await response.json();
        displayMembers(members);
    } catch (error) {
        if (container) {
            container.innerHTML = "<p>Unable to load chamber members right now.</p>";
        }
        console.error(error);
    }
}

function setActiveButton(selectedButton) {
    [gridBtn, listBtn].forEach(button => {
        button.classList.toggle("active", button === selectedButton);
    });
}

function initDirectory() {
    if (gridBtn && listBtn) {
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
    }

    if (menuBtn && nav) {
        menuBtn.addEventListener("click", () => {
            const expanded = nav.classList.toggle("open");
            menuBtn.setAttribute("aria-expanded", expanded);
        });
    }

    getMembers();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDirectory, { once: true });
} else {
    initDirectory();
}
