const weatherCurrent = document.querySelector("#weatherCurrent");
const weatherForecast = document.querySelector("#weatherForecast");
const spotlightsContainer = document.querySelector("#spotlights");

const chamberLocation = {
    name: "Abakaliki",
    lat: 6.3244,
    lon: 8.1278,
};

const openWeatherKey = "YOUR_OPENWEATHERMAP_API_KEY";
const weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${chamberLocation.lat}&lon=${chamberLocation.lon}&units=metric&exclude=minutely,hourly,alerts&appid=${openWeatherKey}`;
const membersUrl = "data/members.json";

const weatherLabels = {
    temp: "Temperature",
    description: "Conditions",
    forecast: "3-Day Forecast",
};

function formatTemperature(value) {
    return `${Math.round(value)}°C`;
}

function renderWeather(data) {
    const current = data.current;
    const description = current.weather[0].description;

    weatherCurrent.innerHTML = `
        <div class="weather-card-inner">
            <h3>${chamberLocation.name}</h3>
            <p class="weather-temp">${formatTemperature(current.temp)}</p>
            <p class="weather-desc">${description}</p>
            <p>Humidity: ${current.humidity}%</p>
        </div>
    `;

    const forecastDays = data.daily.slice(1, 4);
    weatherForecast.innerHTML = `
        <h3>${weatherLabels.forecast}</h3>
        <div class="forecast-list">
            ${forecastDays
                .map(day => {
                    const date = new Date(day.dt * 1000);
                    return `
                    <article class="forecast-day">
                        <p class="forecast-date">${date.toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                        })}</p>
                        <p>${formatTemperature(day.temp.day)}</p>
                        <p>${day.weather[0].main}</p>
                    </article>
                `;
                })
                .join("")}
        </div>
    `;
}

function renderSpotlights(members) {
    const featuredWithIndex = members
        .map((member, index) => ({ member, index }))
        .filter(({ member }) => member.membership >= 2)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    if (!featuredWithIndex.length) {
        spotlightsContainer.innerHTML = "<p>No spotlights available right now.</p>";
        return;
    }

    const logos = [
        "business1.svg",
        "business2.svg",
        "business3.svg",
        "business4.svg",
        "business5.svg",
        "business6.svg",
        "business7.svg",
    ];

    spotlightsContainer.innerHTML = featuredWithIndex
        .map(({ member, index }) => {
            const logoSrc = `images/${logos[index % logos.length]}`;
            return `
                <article class="spotlight-card">
                    <div class="spotlight-logo">
                        <img src="${logoSrc}" alt="${member.name} logo" loading="lazy" />
                    </div>
                    <div class="spotlight-copy">
                        <h3>${member.name}</h3>
                        <p class="spotlight-level">${member.membership === 3 ? "Gold Member" : "Silver Member"}</p>
                        <p>${member.address}</p>
                        <p><a href="tel:${member.phone.replace(/[^+0-9]/g, "")}">${member.phone}</a></p>
                        <p><a href="${member.website}" target="_blank" rel="noopener">${member.website}</a></p>
                    </div>
                </article>
            `;
        })
        .join("");
}

const sampleWeatherData = {
    current: {
        temp: 30,
        weather: [{ description: "partly cloudy" }],
        humidity: 68,
    },
    daily: [
        { dt: Date.now() / 1000, temp: { day: 30 }, weather: [{ main: "Clouds" }] },
        { dt: Date.now() / 1000 + 86400, temp: { day: 31 }, weather: [{ main: "Sunny" }] },
        { dt: Date.now() / 1000 + 2 * 86400, temp: { day: 29 }, weather: [{ main: "Rain" }] },
        { dt: Date.now() / 1000 + 3 * 86400, temp: { day: 28 }, weather: [{ main: "Clear" }] },
    ],
};

async function loadWeather() {
    if (!openWeatherKey || openWeatherKey === "YOUR_OPENWEATHERMAP_API_KEY") {
        weatherCurrent.innerHTML = "<p>Please set your OpenWeatherMap API key in scripts/home.js to load live weather data.</p>";
        renderWeather(sampleWeatherData);
        return;
    }

    try {
        const response = await fetch(weatherUrl);
        if (!response.ok) throw new Error(`Weather API error ${response.status}`);
        const data = await response.json();
        renderWeather(data);
    } catch (error) {
        weatherCurrent.innerHTML = "<p>Unable to load weather data.</p>";
        weatherForecast.innerHTML = "";
        console.error(error);
    }
}

async function loadSpotlights() {
    try {
        const response = await fetch(membersUrl, { cache: "force-cache" });
        if (!response.ok) throw new Error(`Members fetch failed: ${response.status}`);
        const members = await response.json();
        renderSpotlights(members);
    } catch (error) {
        spotlightsContainer.innerHTML = "<p>Unable to load member spotlights right now.</p>";
        console.error(error);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        loadWeather();
        loadSpotlights();
    }, { once: true });
} else {
    loadWeather();
    loadSpotlights();
}
