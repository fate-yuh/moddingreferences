const tooltip = document.getElementById("tooltip");

/* =========================
   DATA (EXPANDED HEAVILY)
========================= */

const DATA = {
  "C++": {
     "Basics": {
        "bool/boolean": {
           tip: "true or false, sometimes in binary (0 1) mostly strings (true or false)",
           desc: "easiest part of modding, true or false.",
           code: "m_IsActive = true"
        },
    "Domains & Threads": {
      "il2cpp_domain_get": {
        tip: "Get active IL2CPP domain",
        desc: "Root entry point for all IL2CPP metadata.",
        code: "Il2CppDomain* domain = il2cpp_domain_get();"
      },
      "il2cpp_domain_get_assemblies": {
        tip: "Enumerate assemblies",
        desc: "Used to locate Assembly-CSharp.",
        code: "il2cpp_domain_get_assemblies(domain, &size);"
      },
      "il2cpp_thread_attach": {
        tip: "Attach native thread",
        desc: "Required before IL2CPP calls.",
        code: "il2cpp_thread_attach(domain);"
      }
    },

    "Class / Method Metadata": {
      "il2cpp_class_from_name": {
        tip: "Resolve class",
        desc: "Find class by namespace + name.",
        code: 'il2cpp_class_from_name(img,"NS","Class");'
      },
      "il2cpp_class_get_methods": {
        tip: "Enumerate methods",
        desc: "Used for invoke and hooks.",
        code: "il2cpp_class_get_methods(klass, &iter);"
      },
      "il2cpp_method_get_name": {
        tip: "Get method name",
        desc: "Metadata inspection.",
        code: "il2cpp_method_get_name(method);"
      }
    },

    "Invoke / Hook Concepts": {
      "il2cpp_runtime_invoke": {
        tip: "Invoke managed method",
        desc: "Calls C# method from native code.",
        code: "il2cpp_runtime_invoke(m, inst, args, nullptr);"
      },
      "InvokeBasic": {
        tip: "Simplified invoke wrapper",
        desc: "Handles boxing/unboxing automatically.",
        code: "// Wrapper around il2cpp_runtime_invoke"
      },
      "InvokeHook": {
        tip: "Hook managed method",
        desc: "Intercept and replace method execution.",
        code: "// Redirect execution to custom function"
      },
      "InvokeBasicHook": {
        tip: "Hook + invoke hybrid",
        desc: "Intercept call and safely call original.",
        code: "// Call original inside hook"
      }
    },

    "Memory / Objects": {
      "il2cpp_object_get_class": {
        tip: "Get runtime class",
        desc: "RTTI for managed objects.",
        code: "il2cpp_object_get_class(obj);"
      },
      "il2cpp_object_unbox": {
        tip: "Unbox value type",
        desc: "Extract primitive from object.",
        code: "il2cpp_object_unbox(obj);"
      }
    }
  },

  "C#": {
    "Unity Lifecycle": {
      "Update": {
        tip: "Every frame",
        desc: "Main game loop.",
        code: "void Update() { }"
      },
      "LateUpdate": {
        tip: "After Update",
        desc: "Camera logic.",
        code: "void LateUpdate() { }"
      }
    },

    "GameObject / World": {
      "GameObject.CreatePrimitive": {
        tip: "Create primitive",
        desc: "Spawn cube, sphere, etc.",
        code: "GameObject.CreatePrimitive(PrimitiveType.Cube);"
      },
      "Instantiate": {
        tip: "Clone object",
        desc: "Spawn prefab at runtime.",
        code: "Instantiate(prefab, pos, rot);"
      }
    },

    "Drawing / Debug": {
      "Debug.DrawLine": {
        tip: "Draw debug line",
        desc: "Visualize rays.",
        code: "Debug.DrawLine(a,b,Color.red);"
      },
      "Gizmos.DrawWireSphere": {
        tip: "Editor visualization",
        desc: "Show radius or area.",
        code: "Gizmos.DrawWireSphere(pos, r);"
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
}

function renderCategories() {
  const q = searchEl.value.toLowerCase();
  categoriesEl.innerHTML = "";

  for (const cat in DATA[currentLang]) {
    const methods = DATA[currentLang][cat];
    const container = document.createElement("div");

    const catBtn = document.createElement("button");
    catBtn.className = "category-btn";
    catBtn.textContent = cat;

    const list = document.createElement("div");
    list.className = "method-list";

    let matches = 0;

    for (const name in methods) {
      const m = methods[name];
      const text = `${name} ${m.tip} ${m.desc}`.toLowerCase();
      if (q && !text.includes(q)) continue;

      matches++;

      const btn = document.createElement("button");
      btn.className = "method";
      btn.textContent = name;

      btn.onmouseenter = e => {
        tooltip.textContent = m.tip;
        tooltip.style.display = "block";
      };
      btn.onmousemove = e => {
        tooltip.style.left = e.clientX + 15 + "px";
        tooltip.style.top = e.clientY + 15 + "px";
      };
      btn.onmouseleave = () => tooltip.style.display = "none";

      btn.onclick = () => {
        titleEl.textContent = name;
        descEl.textContent = m.desc;
        codeEl.textContent = m.code;
      };

      list.appendChild(btn);
    }

    if (matches === 0) continue;
    list.style.display = q ? "block" : "none";

    catBtn.onclick = () => {
      list.style.display = list.style.display === "none" ? "block" : "none";
    };

    container.appendChild(catBtn);
    container.appendChild(list);
    categoriesEl.appendChild(container);
  }
}

/* =========================
   SNOW (RESTORED)
========================= */

const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");
let w, h, flakes;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  flakes = Array.from({ length: 180 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2 + 0.5,
    s: Math.random() * 1 + 0.4
  }));
}

function snow() {
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  flakes.forEach(f => {
    ctx.beginPath();
    ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
    ctx.fill();
    f.y += f.s;
    if (f.y > h) f.y = -5;
  });
  requestAnimationFrame(snow);
}

window.addEventListener("resize", resize);
resize();
snow();
renderCategories();

