const courses = [
    {
        subject: "WDD",
        number: 130,
        title: "Web Fundamentals",
        credits: 2,
        completed: true
    },
    {
        subject: "WDD",
        number: 131,
        title: "Dynamic Web Fundamentals",
        credits: 2,
        completed: true
    },
    {
        subject: "CSE",
        number: 111,
        title: "Programming with Functions",
        credits: 2,
        completed: true
    },
    {
        subject: "CSE",
        number: 210,
        title: "Programming with Classes",
        credits: 2,
        completed: false
    }
];

const container = document.getElementById("courseContainer");
const credits = document.getElementById("credits");
const buttons = document.querySelectorAll(".filter-btn");

function displayCourses(courseList) {
    container.innerHTML = "";

    courseList.forEach((course) => {
        const card = document.createElement("article");
        card.classList.add("course-card");

        if (course.completed) {
            card.classList.add("completed");
        }

        card.innerHTML = `
            <span class="course-badge">${course.subject} ${course.number}</span>
            <h3>${course.title}</h3>
            <p>${course.credits} credit${course.credits > 1 ? "s" : ""}</p>
            <p>${course.completed ? "Completed" : "In progress"}</p>
        `;

        container.appendChild(card);
    });

    const totalCredits = courseList.reduce((sum, course) => sum + course.credits, 0);
    credits.textContent = `Total Credits: ${totalCredits}`;
}

function setActiveButton(activeId) {
    buttons.forEach((button) => {
        button.classList.toggle("active", button.id === activeId);
    });
}

function filterCourses(filter) {
    let filteredCourses = courses;

    if (filter === "WDD") {
        filteredCourses = courses.filter((course) => course.subject === "WDD");
    } else if (filter === "CSE") {
        filteredCourses = courses.filter((course) => course.subject === "CSE");
    }

    displayCourses(filteredCourses);
}

displayCourses(courses);
setActiveButton("allBtn");

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        filterCourses(filter);
        setActiveButton(button.id);
    });
});