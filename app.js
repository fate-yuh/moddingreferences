/* =========================
   DATA
   ========================= */

const DATA = {
  "C++": {
    "Domains & Threads": {
      "il2cpp_domain_get": {
        tip: "Get active IL2CPP domain",
        desc: "Entry point for metadata access.",
        code: `Il2CppDomain* domain = il2cpp_domain_get();`
      },
      "il2cpp_domain_get_assemblies": {
        tip: "Enumerate assemblies",
        desc: "Find Assembly-CSharp.",
        code: `il2cpp_domain_get_assemblies(domain, &size);`
      },
      "il2cpp_thread_attach": {
        tip: "Attach native thread",
        desc: "Required before IL2CPP calls.",
        code: `il2cpp_thread_attach(domain);`
      }
    },

    "Assembly & Image": {
      "il2cpp_assembly_get_image": {
        tip: "Assembly → Image",
        desc: "Used before resolving classes.",
        code: `il2cpp_assembly_get_image(assembly);`
      },
      "BNM::Image": {
        tip: "BNM image wrapper",
        desc: "Resolve image by name.",
        code: `BNM::Image image("Assembly-CSharp");`
      }
    }
  },

  "C#": {
    "Unity Lifecycle": {
      "Update": {
        tip: "Runs every frame",
        desc: "Used for logic and input.",
        code: `void Update() {}`
      },
      "FixedUpdate": {
        tip: "Physics tick",
        desc: "Used for Rigidbody logic.",
        code: `void FixedUpdate() {}`
      }
    },

    "Input & Time": {
      "Input.GetKey": {
        tip: "Key held",
        desc: "Checks if key is pressed.",
        code: `Input.GetKey(KeyCode.Space);`
      },
      "Time.deltaTime": {
        tip: "Frame delta",
        desc: "Smooth movement.",
        code: `speed * Time.deltaTime;`
      }
    }
  }
};

/* =========================
   UI LOGIC
   ========================= */

let currentLang = "C++";

const categoriesEl = document.getElementById("categories");
const titleEl = document.getElementById("title");
const descEl = document.getElementById("desc");
const codeEl = document.getElementById("code");
const searchEl = document.getElementById("search");

function setLang(lang) {
  currentLang = lang;
  renderCategories();
  clearContent();
}

function clearContent() {
  titleEl.textContent = "Select a method";
  descEl.textContent = "";
  codeEl.textContent = "";
}

function renderCategories() {
  const query = searchEl.value.toLowerCase();
  categoriesEl.innerHTML = "";

  for (const category in DATA[currentLang]) {
    const methods = DATA[currentLang][category];
    const container = document.createElement("div");

    const catBtn = document.createElement("button");
    catBtn.className = "category-btn";
    catBtn.textContent = category;

    const methodList = document.createElement("div");
    methodList.className = "method-list";
    methodList.style.display = "none";

    let matchCount = 0;

    for (const method in methods) {
      const item = methods[method];
      const searchText = `${method} ${item.tip} ${item.desc}`.toLowerCase();

      if (query && !searchText.includes(query)) continue;

      matchCount++;

      const btn = document.createElement("button");
      btn.className = "method";
      btn.textContent = method;
      btn.dataset.tip = item.tip;
      btn.onclick = () => showMethod(category, method);

      methodList.appendChild(btn);
    }

    if (matchCount === 0) continue;

    // Auto-open when searching
    methodList.style.display = query ? "block" : "none";

    catBtn.onclick = () => {
      methodList.style.display =
        methodList.style.display === "none" ? "block" : "none";
    };

    container.appendChild(catBtn);
    container.appendChild(methodList);
    categoriesEl.appendChild(container);
  }
}

function showMethod(category, method) {
  const item = DATA[currentLang][category][method];
  titleEl.textContent = method;
  descEl.textContent = item.desc;
  codeEl.textContent = item.code;
}

/* =========================
   SNOW
   ========================= */

const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");
let w, h, flakes;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  flakes = Array.from({ length: 120 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2 + 0.5,
    s: Math.random() * 1 + 0.4
  }));
}

function drawSnow() {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  flakes.forEach(f => {
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fill();
    f.y += f.s;
    if (f.y > h) f.y = -5;
  });
  requestAnimationFrame(drawSnow);
}

window.addEventListener("resize", resize);

/* =========================
   INIT
   ========================= */

resize();
drawSnow();
renderCategories();
