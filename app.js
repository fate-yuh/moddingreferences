const data = {
  "C#": {
    "Unity Lifecycle": {
      "Update": {
        desc: "Runs every frame. Used for input & logic.",
        code: `void Update()\n{\n    // frame logic\n}`
      },
      "FixedUpdate": {
        desc: "Runs on physics tick.",
        code: `void FixedUpdate()\n{\n    // physics logic\n}`
      }
    }
  },
  "C++": {
    "IL2CPP Domain": {
      "il2cpp_domain_get": {
        desc: "Gets the active IL2CPP domain.",
        code: `Il2CppDomain* domain = il2cpp_domain_get();`
      },
      "il2cpp_domain_get_assemblies": {
        desc: "Enumerates loaded assemblies.",
        code: `auto assemblies = il2cpp_domain_get_assemblies(domain, &size);`
      }
    },
    "BNM Resolve": {
      "BNM::Class": {
        desc: "Resolves a managed class by name.",
        code: `BNM::Class klass("Namespace","ClassName", image);`
      }
    }
  }
};

let currentLang = "C#";

function setLang(lang) {
  currentLang = lang;
  renderCategories();
}

function renderCategories() {
  const container = document.getElementById("categories");
  container.innerHTML = "";

  for (const cat in data[currentLang]) {
    const h = document.createElement("h3");
    h.textContent = cat;
    container.appendChild(h);

    for (const method in data[currentLang][cat]) {
      const btn = document.createElement("button");
      btn.className = "method";
      btn.textContent = method;
      btn.dataset.tip = data[currentLang][cat][method].desc;
      btn.onclick = () => showMethod(cat, method);
      container.appendChild(btn);
    }
  }
}

function showMethod(cat, method) {
  document.getElementById("title").textContent = method;
  document.getElementById("desc").textContent =
    data[currentLang][cat][method].desc;
  document.getElementById("code").textContent =
    data[currentLang][cat][method].code;
}

/* ❄️ Snow animation */
const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");
let w, h, flakes;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  flakes = Array.from({ length: 120 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2 + 1,
    s: Math.random() * 1 + 0.5
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

window.onresize = resize;
resize();
drawSnow();
renderCategories();
