const isoToName = {
  "ET": "Ethiopia",
  "NE": "Niger",
  "SD": "Sudan",
  "SO": "Somalia",
  "NG": "Nigeria",
  "KE": "Kenya",
  "UG": "Uganda",
  "CD": "Democratic Republic of the Congo",
  "IN": "India",
  "BD": "Bangladesh",
  "PH": "Philippines",
  "HT": "Haiti",
  "VE": "Venezuela",
  "YE": "Yemen",
  "AF": "Afghanistan",
  "BR": "Brazil",
  "US": "United States",
  "MX": "Mexico",
  "ZA": "South Africa",
  "PK": "Pakistan",
  "ID": "Indonesia",
  "CN": "China",
  "AU": "Australia",
  "GB": "United Kingdom",
  "DE": "Germany"
};

let hungerData = {};

fetch('hungerData.json')
  .then(response => response.json())
  .then(data => {
    hungerData = data;
    console.log("✅ hungerData loaded:", hungerData);
  })
  .catch(err => console.error("❌ Failed to load hungerData.json", err));

const countries = document.querySelectorAll("svg path");
const sidePanel = document.querySelector(".side-panel");
const container = document.querySelector(".side-panel .container");
const closeBtn = document.querySelector(".close-btn");
const loading = document.querySelector(".loading");

const countryNameOutput = document.querySelector(".country-name");
const countryFlagOutput = document.querySelector(".country-flag");
const hungerOutput = document.querySelector(".hunger");
const deathsOutput = document.querySelector(".deaths");


countries.forEach(country => {
  country.addEventListener("mouseenter", function() {
    this.style.fill = "#c99aff";
  });

  country.addEventListener("mouseout", function() {
    this.style.fill = "#443d4b";
  });

  country.addEventListener("click", async function(e) {
    e.stopPropagation();

    const iso2 = this.getAttribute("id"); // e.g., "ET"
    if (!iso2) return;

    const countryName = isoToName[iso2] || iso2;

    // Show loader
    container.classList.add("hide");
    loading.innerText = "Loading...";
    sidePanel.classList.add("side-panel-open");

    try {
      const res = await fetch(`https://restcountries.com/v3.1/alpha/${iso2}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const c = data[0];

      let apiStats = [
        `Capital: ${c.capital ? c.capital[0] : "N/A"}`,
        `Population: ${c.population.toLocaleString()}`
      ];

      const hunger = hungerData[countryName];

      fillCountryPanel(
        countryName,
        hunger?.flag || c.flags?.png || c.flags?.svg || "",
        hunger?.stats || apiStats,
        hunger?.deaths || "No death info.",
        hunger?.access || "No data on access.",
        hunger?.zeroHungerIssues || ["No Zero Hunger info available."]
      );
    } catch (err) {
      loading.innerText = "Could not load data.";
      console.error(err);
    }
  });
});

function fillCountryPanel(name, flag, stats, deaths, access, zeroIssues) {
  countryNameOutput.innerText = name;
  countryFlagOutput.src = flag || "";
  hungerOutput.innerHTML = stats && stats.length ? stats.map(line => `• ${line}`).join("<br>") : "No hunger info.";
  deathsOutput.innerText = deaths || "No death info.";

  const liItems = container.querySelectorAll("li");
  if (liItems[2]) {
    const plainSpan = liItems[2].querySelector("span:not(.hunger):not(.deaths)");
    if (plainSpan) plainSpan.innerText = access || "No data on access.";
  }

  let zhList = container.querySelector(".zh-list");
  if (!zhList) {
    const div = document.createElement("div");
    div.innerHTML = `<h4>Zero Hunger Issues</h4><ul class="zh-list"></ul>`;
    container.appendChild(div);
    zhList = div.querySelector(".zh-list");
  }
  zhList.innerHTML = zeroIssues && zeroIssues.length ? zeroIssues.map(z => `<li>${z}</li>`).join("") : "<li>No data.</li>";

  container.classList.remove("hide");
  loading.innerText = "";
}

if (closeBtn) {
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    sidePanel.classList.remove("side-panel-open");
  });
}

document.addEventListener("click", (e) => {
  if (!sidePanel) return; // skip if no panel exists
  const clickedInsidePanel = sidePanel.contains(e.target);
  const clickedOnCountry = e.target.tagName.toLowerCase() === "path";
  if (!clickedInsidePanel && !clickedOnCountry) {
    sidePanel.classList.remove("side-panel-open");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".nutri-btn");
  const slides = document.querySelectorAll(".slide");

  buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      slides.forEach(s => s.classList.remove("active"));
      btn.classList.add("active");
      slides[index].classList.add("active");
    });
  });
});

document.querySelectorAll('.zero-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});

function animateCounter(counter) {
  const target = +counter.getAttribute("data-target");
  const duration = 2000; // total animation time in ms
  const stepTime = 20; // refresh interval
  const step = target / (duration / stepTime);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    counter.innerText = Math.floor(current).toLocaleString();
  }, stepTime);
}

// Detect when section is visible
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll(".counter").forEach(counter => {
        animateCounter(counter);
      });
      observer.unobserve(entry.target); // run only once
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector("#hunger-stats");
if (statsSection) {
  observer.observe(statsSection);
}

document.addEventListener("DOMContentLoaded", () => {
  const recipes = {
    lentils: {
      title: "Rice & Lentils",
      content: `
        <strong>Ingredients:</strong><br>
        - 1 cup rice<br>
        - 1/2 cup lentils<br>
        - 1 onion, chopped<br>
        - Salt & spices to taste<br><br>
        <strong>Instructions:</strong><br>
        1. Cook rice and lentils separately.<br>
        2. Sauté onion with spices.<br>
        3. Mix rice, lentils, and onion.<br>
        4. Serve hot with vegetables.
      `
    },
    stirfry: {
      title: "Veggie Stir Fry",
      content: `
        <strong>Ingredients:</strong><br>
        - Mixed vegetables<br>
        - Soy sauce<br>
        - Garlic & ginger<br><br>
        <strong>Instructions:</strong><br>
        1. Heat oil in a pan.<br>
        2. Add garlic & ginger.<br>
        3. Add vegetables, stir fry for 5-7 mins.<br>
        4. Add soy sauce and serve with rice.
      `
    },
    porridge: {
      title: "Protein Porridge",
      content: `
        <strong>Ingredients:</strong><br>
        - 1/2 cup oats<br>
        - 1 cup milk<br>
        - 1 scoop protein powder<br>
        - Fruits & nuts for topping<br><br>
        <strong>Instructions:</strong><br>
        1. Cook oats in milk.<br>
        2. Stir in protein powder.<br>
        3. Top with fruits & nuts.<br>
        4. Enjoy a healthy breakfast!
      `
    }
  };

  const modal = document.getElementById("recipeModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");
  const closeBtn = document.querySelector(".close-btn");

  document.querySelectorAll(".recipe-card").forEach(card => {
    card.addEventListener("click", () => {
      const recipeKey = card.dataset.recipe;
      modalTitle.textContent = recipes[recipeKey].title;
      modalContent.innerHTML = recipes[recipeKey].content;
      modal.style.display = "flex";
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});

