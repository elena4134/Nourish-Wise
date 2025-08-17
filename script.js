/***********************
 *   ISO2 → Full Name  *
 ***********************/
const isoToName = {
  "ET": "Ethiopia",
  "NE": "Niger",
  "SD": "Sudan",
  "SO": "Somalia",
  "NG": "Nigeria",
  "KE": "Kenya",
  "UG": "Uganda",
  "CD": "Democratic Republic of the Congo"
};

/***********************
 *   LOAD HUNGER DATA  *
 ***********************/
let hungerData = {};

fetch('hungerData.json')
  .then(response => response.json())
  .then(data => {
    hungerData = data;
    console.log("✅ hungerData loaded:", hungerData);
  })
  .catch(err => console.error("❌ Failed to load hungerData.json", err));

/***********************
 *   MAP SELECTORS     *
 ***********************/
const countries = document.querySelectorAll("svg path");
const sidePanel = document.querySelector(".side-panel");
const container = document.querySelector(".side-panel .container");
const closeBtn = document.querySelector(".close-btn");
const loading = document.querySelector(".loading");

const countryNameOutput = document.querySelector(".country-name");
const countryFlagOutput = document.querySelector(".country-flag");
const hungerOutput = document.querySelector(".hunger");
const deathsOutput = document.querySelector(".deaths");

/***********************
 *  COUNTRY CLICK LOGIC *
 ***********************/
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
      // ✅ Always fetch API basic info
      const res = await fetch(`https://restcountries.com/v3.1/alpha/${iso2}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const c = data[0];

      let apiStats = [
        `Capital: ${c.capital ? c.capital[0] : "N/A"}`,
        `Population: ${c.population.toLocaleString()}`
      ];

      // ✅ Merge JSON hunger data
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

/***********************
 *   PANEL FILL FUNC   *
 ***********************/
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

/***********************
 *   CLOSE PANEL LOGIC *
 ***********************/
if (closeBtn) {
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    sidePanel.classList.remove("side-panel-open");
  });
}

document.addEventListener("click", (e) => {
  const clickedInsidePanel = sidePanel.contains(e.target);
  const clickedOnCountry = e.target.tagName.toLowerCase() === "path";
  if (!clickedInsidePanel && !clickedOnCountry) {
    sidePanel.classList.remove("side-panel-open");
  }
});

/***********************
 *   NUTRITION SLIDES  *
 ***********************/
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

/***********************
 *   ZERO CARD FLIP    *
 ***********************/
document.querySelectorAll('.zero-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});


/***********************
 *   COUNTER ANIMATION *
 ***********************/
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

observer.observe(document.querySelector("#hunger-stats"));
