/* =========================
   DATA
   ========================= */

const DATA = {
  "C++": {
    "Domain & Threads": {
      "il2cpp_domain_get": {
        tip: "Gets the active IL2CPP domain",
        desc: "Entry point for all metadata access.",
        code: `Il2CppDomain* domain = il2cpp_domain_get();`
      },
      "il2cpp_domain_get_assemblies": {
        tip: "Enumerates loaded assemblies",
        desc: "Used to locate Assembly-CSharp.",
        code: `auto assemblies =
    il2cpp_domain_get_assemblies(domain, &size);`
      },
      "il2cpp_thread_attach": {
        tip: "Attach native thread to IL2CPP",
        desc: "Required before calling IL2CPP APIs.",
        code: `il2cpp_thread_attach(domain);`
      }
    },

    "Assembly & Image": {
      "il2cpp_assembly_get_image": {
        tip: "Assembly → Image",
        desc: "Required before resolving classes.",
        code: `Il2CppImage* image =
    il2cpp_assembly_get_image(assembly);`
      },
      "BNM::Image": {
        tip: "BNM image wrapper",
        desc: "Resolves IL2CPP image by name.",
        code: `BNM::Image image("Assembly-CSharp");`
      }
    },

    "Class Metadata": {
      "il2cpp_class_from_name": {
        tip: "Resolve class by name",
        desc: "Primary class resolver.",
        code: `il2cpp_class_from_name(img,"NS","Class");`
      },
      "il2cpp_class_get_methods": {
        tip: "Enumerate class methods",
        desc: "Used for invoke or hooking.",
        code: `il2cpp_class_get_methods(klass, &iter);`
      }
    }
  },

  "C#": {
    "Unity Lifecycle": {
      "Update": {
        tip: "Runs every frame",
        desc: "Used for input and logic.",
        code: `void Update() { }`
      },
      "FixedUpdate": {
        tip: "Physics tick",
        desc: "Used for Rigidbody logic.",
        code: `void FixedUpdate() { }`
      }
    },

    "Input & Time": {
      "Input.GetKey": {
        tip: "Checks if a key is held",
        desc: "Used for continuous input.",
        code: `Input.GetKey(KeyCode.Space);`
      },
      "Time.deltaTime": {
        tip: "Frame delta time",
        desc: "Used for smooth movement.",
        code: `speed * Time.deltaTime;`
      }
    }
  }
};

/* =========================
   UI + SEARCH LOGIC
   ========================= */

let currentLang = "C++";

const categoryContainer = document.getElementById("categories");
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
  categoryContainer.innerHTML = "";

  const categories = DATA[currentLang];

  for (const cat in categories) {
    let visibleCount = 0;
    const section = document.createElement("div");

    const header = document.createElement("h3");
    header.textContent = cat;
    section.appendChild(header);

    for (const method in categories[cat]) {
      const item = categories[cat][method];
      const searchText =
        `${method} ${item.tip} ${item.desc}`.toLowerCase();

      if (query && !searchText.includes(query)) continue;

      visibleCount++;

      const btn = document.createElement("button");
      btn.className = "method";
      btn.textContent = method;
      btn.dataset.tip = item.tip;
      btn.onclick = () => showMethod(cat, method);

      section.appendChild(btn);
    }

    if (visibleCount > 0) {
      categoryContainer.appendChild(section);
    }
  }
}

function showMethod(cat, method) {
  const item = DATA[currentLang][cat][method];
  titleEl.textContent = method;
  descEl.textContent = item.desc;
  codeEl.textContent = item.code;
}

/* =========================
   SNOW ANIMATION
   ========================= */

const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");
let w, h, flakes;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  flakes = Array.from({ length: 140 }, () => ({
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
clearContent();
