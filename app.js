const tooltip = document.getElementById("tooltip");

/* =========================
   DATA
========================= */

const DATA = {
  "C++": {
    "Domain & Threads": {
      "il2cpp_domain_get": {
        tip: "Gets the active IL2CPP domain",
        desc: "Entry point for all metadata access.",
        code: "Il2CppDomain* domain = il2cpp_domain_get();"
      },
      "il2cpp_domain_get_assemblies": {
        tip: "Enumerate loaded assemblies",
        desc: "Used to find Assembly-CSharp.",
        code: "il2cpp_domain_get_assemblies(domain, &size);"
      },
      "il2cpp_thread_attach": {
        tip: "Attach native thread to IL2CPP",
        desc: "Required before calling IL2CPP APIs.",
        code: "il2cpp_thread_attach(domain);"
      },
      "il2cpp_thread_detach": {
        tip: "Detach thread safely",
        desc: "Call when native thread work is done.",
        code: "il2cpp_thread_detach(thread);"
      }
    },

    "Assembly / Image": {
      "il2cpp_assembly_get_image": {
        tip: "Assembly → Image",
        desc: "Converts assembly to image metadata.",
        code: "Il2CppImage* img = il2cpp_assembly_get_image(assembly);"
      },
      "BNM::Image": {
        tip: "BNM image wrapper",
        desc: "Represents an IL2CPP image.",
        code: 'BNM::Image image("Assembly-CSharp");'
      }
    },

    "Class Metadata": {
      "il2cpp_class_from_name": {
        tip: "Resolve class by namespace + name",
        desc: "Primary class resolver.",
        code: 'il2cpp_class_from_name(img,"NS","Class");'
      },
      "BNM::Class": {
        tip: "BNM class wrapper",
        desc: "Represents a managed class.",
        code: 'BNM::Class klass("Namespace","Class",image);'
      }
    },

    "Field Methods": {
      "il2cpp_field_get_offset": {
        tip: "Get field memory offset",
        desc: "Required for reading/writing instance fields.",
        code: "size_t offset = il2cpp_field_get_offset(field);"
      },
      "il2cpp_field_static_get_value": {
        tip: "Read static field",
        desc: "Reads value of static field.",
        code: "il2cpp_field_static_get_value(field, &value);"
      }
    },

    "Invoke / Hook Concepts": {
      "il2cpp_runtime_invoke": {
        tip: "Call managed method from native",
        desc: "Invokes C# method via MethodInfo.",
        code: "il2cpp_runtime_invoke(method, instance, args, nullptr);"
      },
      "InvokeBasic": {
        tip: "Wrapper around runtime_invoke",
        desc: "Simplifies calling managed methods.",
        code:
`template<typename T>
T InvokeBasic(MethodInfo* m, void* inst, void** args) {
  auto obj = il2cpp_runtime_invoke(m, inst, args, nullptr);
  return *(T*)il2cpp_object_unbox(obj);
}`
      },
      "InvokeHook": {
        tip: "Hook a method and replace logic",
        desc: "Redirects execution to custom function.",
        code:
`OriginalType Original;
ReturnType Hook(args...) {
  // custom logic
  return Original(args...);
}`
      },
      "InvokeBasicHook": {
        tip: "Hook + invoke hybrid",
        desc: "Intercept call, invoke original safely.",
        code:
`ReturnType Hook(args...) {
  auto result = InvokeBasic<ReturnType>(original, inst, args);
  return result;
}`
      }
    }
  },

  "C#": {
    "Unity Lifecycle": {
      "Update": {
        tip: "Runs every frame",
        desc: "Used for logic and input.",
        code: "void Update() { }"
      },
      "FixedUpdate": {
        tip: "Physics tick",
        desc: "Used for Rigidbody logic.",
        code: "void FixedUpdate() { }"
      }
    },

    "GameObject / Transform": {
      "GameObject.CreatePrimitive": {
        tip: "Creates a primitive object",
        desc: "Creates cube, sphere, etc.",
        code: "GameObject.CreatePrimitive(PrimitiveType.Cube);"
      },
      "transform.position": {
        tip: "World position",
        desc: "Controls object location.",
        code: "transform.position += Vector3.up;"
      }
    },

    "Debug / Drawing": {
      "Debug.DrawLine": {
        tip: "Draws line in scene",
        desc: "Used for visualization.",
        code: "Debug.DrawLine(a, b, Color.red);"
      },
      "Gizmos.DrawWireSphere": {
        tip: "Editor visualization",
        desc: "Draws wireframe sphere.",
        code: "Gizmos.DrawWireSphere(pos, radius);"
      }
    },

    "Input / Time": {
      "Input.GetKey": {
        tip: "Key held",
        desc: "Continuous input.",
        code: "Input.GetKey(KeyCode.Space);"
      },
      "Time.deltaTime": {
        tip: "Frame delta",
        desc: "Smooth movement.",
        code: "speed * Time.deltaTime;"
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
      btn.onmouseleave = () => {
        tooltip.style.display = "none";
      };

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
   INIT
========================= */

renderCategories();
