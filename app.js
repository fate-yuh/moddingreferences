/* ============================================================
   DATA — COMPLETE CATEGORY-BASED METHOD MAP
   ============================================================ */

const DATA = {
  "C++": {
    "Domain & Threads": {
      "il2cpp_domain_get": {
        tip: "Returns the active IL2CPP domain",
        desc: "Entry point for all IL2CPP metadata access.",
        code: `Il2CppDomain* domain = il2cpp_domain_get();`
      },
      "il2cpp_domain_get_assemblies": {
        tip: "Enumerates loaded assemblies",
        desc: "Used to locate Assembly-CSharp and others.",
        code: `size_t size;
auto assemblies =
    il2cpp_domain_get_assemblies(domain, &size);`
      },
      "il2cpp_thread_attach": {
        tip: "Attach native thread to IL2CPP",
        desc: "Required before calling IL2CPP APIs from a new thread.",
        code: `il2cpp_thread_attach(domain);`
      },
      "il2cpp_thread_detach": {
        tip: "Detach native thread safely",
        desc: "Call when native work is finished.",
        code: `il2cpp_thread_detach(thread);`
      }
    },

    "Assembly & Image": {
      "il2cpp_assembly_get_image": {
        tip: "Assembly → Image",
        desc: "Converts an assembly to an image for class lookup.",
        code: `Il2CppImage* image =
    il2cpp_assembly_get_image(assembly);`
      },
      "BNM::Image": {
        tip: "BNM metadata container",
        desc: "Represents an IL2CPP image by name.",
        code: `BNM::Image image("Assembly-CSharp");`
      },
      "BNM::Image::GetImages": {
        tip: "Enumerates all loaded images",
        desc: "Useful for debugging metadata state.",
        code: `auto images = BNM::Image::GetImages();`
      }
    },

    "Class Metadata": {
      "il2cpp_class_from_name": {
        tip: "Resolve class by name",
        desc: "Finds Il2CppClass* using namespace and class name.",
        code: `Il2CppClass* klass =
    il2cpp_class_from_name(image, "NS", "Class");`
      },
      "il2cpp_class_get_fields": {
        tip: "Enumerate class fields",
        desc: "Used for reflection and offset discovery.",
        code: `void* iter = nullptr;
while (auto field =
    il2cpp_class_get_fields(klass, &iter)) { }`
      },
      "il2cpp_class_get_methods": {
        tip: "Enumerate class methods",
        desc: "Used for invoke or hooking.",
        code: `void* iter = nullptr;
while (auto method =
    il2cpp_class_get_methods(klass, &iter)) { }`
      }
    },

    "Field Metadata": {
      "il2cpp_field_get_name": {
        tip: "Get field name",
        desc: "Used for filtering and debugging.",
        code: `const char* name =
    il2cpp_field_get_name(field);`
      },
      "il2cpp_field_get_offset": {
        tip: "Get field offset",
        desc: "Required to read/write instance fields.",
        code: `size_t offset =
    il2cpp_field_get_offset(field);`
      },
      "il2cpp_field_static_get_value": {
        tip: "Read static field",
        desc: "Safely accesses static data.",
        code: `il2cpp_field_static_get_value(field, &value);`
      }
    },

    "Method Metadata": {
      "il2cpp_method_get_name": {
        tip: "Get method name",
        desc: "Used for identification.",
        code: `const char* name =
    il2cpp_method_get_name(method);`
      },
      "il2cpp_method_get_param_count": {
        tip: "Get parameter count",
        desc: "Required before invoking a method.",
        code: `int count =
    il2cpp_method_get_param_count(method);`
      }
    },

    "Invoke & Runtime": {
      "il2cpp_runtime_invoke": {
        tip: "Invoke managed method",
        desc: "Calls a C# method from native code.",
        code: `Il2CppObject* result =
    il2cpp_runtime_invoke(
        method, instance, args, nullptr
    );`
      },
      "InvokeBasic (Concept)": {
        tip: "Wrapper pattern",
        desc: "Simplifies runtime invoke boilerplate.",
        code: `// Wrapper around il2cpp_runtime_invoke`
      }
    },

    "Object & Memory": {
      "il2cpp_object_get_class": {
        tip: "Get runtime class",
        desc: "Returns Il2CppClass* of an object.",
        code: `Il2CppClass* c =
    il2cpp_object_get_class(obj);`
      },
      "il2cpp_object_unbox": {
        tip: "Unbox value type",
        desc: "Extracts primitive from boxed object.",
        code: `int value =
    *(int*)il2cpp_object_unbox(obj);`
      }
    }
  },

  "C#": {
    "Unity Lifecycle": {
      "Awake": {
        tip: "Runs on load",
        desc: "Called when script instance is created.",
        code: `void Awake() { }`
      },
      "Start": {
        tip: "Runs on first frame",
        desc: "Initialization logic.",
        code: `void Start() { }`
      },
      "Update": {
        tip: "Runs every frame",
        desc: "Used for input and logic.",
        code: `void Update() { }`
      },
      "FixedUpdate": {
        tip: "Physics tick",
        desc: "Use for Rigidbody logic.",
        code: `void FixedUpdate() { }`
      }
    },

    "Input & Time": {
      "Input.GetKey": {
        tip: "Key held",
        desc: "Checks if a key is currently pressed.",
        code: `Input.GetKey(KeyCode.Space);`
      },
      "Input.GetKeyDown": {
        tip: "Key pressed this frame",
        desc: "Detects initial key press.",
        code: `Input.GetKeyDown(KeyCode.Space);`
      },
      "Time.deltaTime": {
        tip: "Frame time",
        desc: "Used for smooth movement.",
        code: `speed * Time.deltaTime;`
      }
    },

    "Physics": {
      "Rigidbody.velocity": {
        tip: "Direct velocity access",
        desc: "Reads or writes Rigidbody velocity.",
        code: `rb.velocity += Vector3.up * 2f;`
      },
      "Physics.Raycast": {
        tip: "Raycast query",
        desc: "Checks collision along a ray.",
        code: `Physics.Raycast(
    origin, direction, out hit
);`
      }
    },

    "Mono / BepInEx": {
      "BaseUnityPlugin": {
        tip: "Plugin base class",
        desc: "Required for BepInEx mods.",
        code: `public class Plugin : BaseUnityPlugin { }`
      }
    }
  }
};

/* ============================================================
   UI LOGIC
   ============================================================ */

let currentLang = "C++";

const categoryContainer = document.getElementById("categories");
const titleEl = document.getElementById("title");
const descEl = document.getElementById("desc");
const codeEl = document.getElementById("code");

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
  categoryContainer.innerHTML = "";

  const categories = DATA[currentLang];
  for (const cat in categories) {
    const h = document.createElement("h3");
    h.textContent = cat;
    categoryContainer.appendChild(h);

    for (const method in categories[cat]) {
      const btn = document.createElement("button");
      btn.className = "method";
      btn.textContent = method;
      btn.dataset.tip = categories[cat][method].tip;
      btn.onclick = () => showMethod(cat, method);
      categoryContainer.appendChild(btn);
    }
  }
}

function showMethod(cat, method) {
  const item = DATA[currentLang][cat][method];
  titleEl.textContent = method;
  descEl.textContent = item.desc;
  codeEl.textContent = item.code;
}

/* ============================================================
   SNOW ANIMATION
   ============================================================ */

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

/* ============================================================
   INIT
   ============================================================ */

resize();
drawSnow();
renderCategories();
clearContent();
