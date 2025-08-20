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

/***********************
 *   RECIPE MODAL      *
 ***********************/
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

/***********************
 * FARMING GUIDE LOGIC *
 ***********************/
/* ---------- FARMING GUIDES: WORKS WITH YOUR EXISTING MARKUP ---------- */
/* No HTML changes required.
   - Uses the *order* of your existing .guide-btn buttons (1..4)
   - Replaces the single .guide-info-block content when a button is clicked
   - "Learn More" toggles an in-block panel with extra info + links
*/
/*(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector(".guides-section");
    if (!section) return;

    // Prevent double-initializing if scripts load twice
    if (section.dataset.guidesReady === "1") return;
    section.dataset.guidesReady = "1";

    const btns = Array.from(section.querySelectorAll(".button-row .guide-btn"));
    const block = section.querySelector(".guide-info-block");
    if (!btns.length || !block) return;

    // Content mapped by button index (0..3) — adjust text/links freely
    const CONTENT = [
      {
        title: "Grow Smart, Eat Fresh",
        summary:
          "Start with easy crops (lettuce, spinach, herbs). Use 20–30 cm deep containers, a sunny spot (4–6h), and water consistently.",
        more: `
          <ul>
            <li>🌱 <strong>Starter list:</strong> Lettuce, spinach, basil, mint, spring onion.</li>
            <li>🪴 <strong>Soil mix:</strong> 60% potting mix + 20% compost + 20% coco coir/perlite.</li>
            <li>💡 <strong>Tip:</strong> Harvest little & often to keep plants producing.</li>
          </ul>
          <p><strong>Helpful links:</strong></p>
          <ul>
            <li><a href="https://www.almanac.com/gardening" target="_blank" rel="noopener">Old Farmer’s Almanac – Gardening</a></li>
            <li><a href="https://www.gardeningknowhow.com/" target="_blank" rel="noopener">Gardening Know How</a></li>
          </ul>
        `
      },
      {
        title: "Farming Tips",
        summary:
          "Build soil health, mulch generously, and water deeply but less often. Rotate crops to reduce pests and disease.",
        more: `
          <ul>
            <li>🌾 <strong>Rotation:</strong> Leaf → fruiting → root → legumes.</li>
            <li>🍂 <strong>Mulch:</strong> 5–8 cm of straw/leaves keeps moisture & suppresses weeds.</li>
            <li>💧 <strong>Irrigation:</strong> Early morning; drip is best for saving water.</li>
          </ul>
          <p><strong>Explore:</strong></p>
          <ul>
            <li><a href="https://www.fao.org/family-farming/en/" target="_blank" rel="noopener">FAO – Family Farming</a></li>
            <li><a href="https://www.fao.org/soils-portal" target="_blank" rel="noopener">FAO – Soils Portal</a></li>
          </ul>
        `
      },
      {
        title: "Urban Farming in Dry Areas",
        summary:
          "Use containers, wicking beds, or drip lines. Choose drought-tolerant crops and capture greywater (where safe/legal).",
        more: `
          <ul>
            <li>🧱 <strong>Containers:</strong> Light-colored, 25–40 cm deep; add shade cloth in heat waves.</li>
            <li>🌵 <strong>Crops:</strong> Amaranth, okra, cowpea, cherry tomato, peppers, herbs.</li>
            <li>💧 <strong>Water-saving:</strong> Mulch + drip; water at dawn.</li>
          </ul>
          <p><strong>Read more:</strong></p>
          <ul>
            <li><a href="https://www.ifpri.org/" target="_blank" rel="noopener">IFPRI – Food Policy Research</a></li>
            <li><a href="https://www.unep.org/resources/report/urban-agriculture" target="_blank" rel="noopener">UNEP – Urban Agriculture</a></li>
          </ul>
        `
      },
      {
        title: "Seasonal Planting Calendar",
        summary:
          "Match crop choices to your seasons. Cool-season: leafy greens, peas. Warm-season: tomatoes, peppers, beans, squash.",
        more: `
          <ul>
            <li>📅 <strong>Plan:</strong> Note first/last frost dates, sow 2–4 weeks before/after as needed.</li>
            <li>🧪 <strong>Stagger:</strong> Sow every 2–3 weeks for continuous harvests.</li>
            <li>🪴 <strong>Backup:</strong> Keep seedlings ready to fill gaps after harvests.</li>
          </ul>
          <p><strong>Calendars & tools:</strong></p>
          <ul>
            <li><a href="https://gardenplanner.almanac.com/" target="_blank" rel="noopener">Almanac Garden Planner</a></li>
            <li><a href="https://www.rhs.org.uk/advice/grow-your-own/calendar" target="_blank" rel="noopener">RHS – Grow-Your-Own Calendar</a></li>
          </ul>
        `
      }
    ];

    // Render helper
    const render = (index) => {
      const c = CONTENT[index] || CONTENT[0];
      block.innerHTML = `
        <h3>${c.title}</h3>
        <p>${c.summary}</p>
        <a href="#" class="learn-more">Learn More →</a>
        <div class="more-content" hidden>
          ${c.more}
        </div>
      `;
    };

    // Initial state (first button active + content)
    btns.forEach(b => b.classList.remove("active"));
    if (btns[0]) btns[0].classList.add("active");
    render(0);

    // Button clicks (use stopImmediatePropagation to avoid old broken listeners)
    btns.forEach((btn, i) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();

        btns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        render(i);
      });
    });

    // Learn More toggle (event delegation)
    section.addEventListener("click", (e) => {
      const link = e.target.closest(".learn-more");
      if (!link) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();

      const more = block.querySelector(".more-content");
      if (more) more.hidden = !more.hidden;
    });
  });
})();
*/
