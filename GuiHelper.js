// GuiHelper.js

class GuiHelperTabs {
  constructor() {
    this.tabs = {};
    this.currentTab = null;
    this.contentEl = document.getElementById("gui-content");
    this.tabsEl = document.getElementById("gui-tabs");
    this.defaultValues = {};
    this._initShortcuts();
    this._initCollapseButton();

    // danh sách các controller dạng 4 cột
    this.fourColumnControllers = [];
}


  // ===== Tabs =====
  addTab(name, width = 300, options = {}) {
    const tabDiv = document.createElement("div");
    tabDiv.style.display = "none";
    this.contentEl.appendChild(tabDiv);

    const gui = new dat.GUI({ autoPlace: false, width });
    tabDiv.appendChild(gui.domElement);
// Xóa nút close do dat.GUI tự tạo
const closeBtn = gui.domElement.querySelector(".close-button");
if (closeBtn) closeBtn.remove();
    this.tabs[name] = { gui, tabDiv };

    // tạo nút tab
    const btn = document.createElement("button");
    btn.className = "gui-tab button"; // 👈 style giống collapseBtn

    if (options.icon) {
      btn.innerHTML = options.icon; // hiển thị icon
      btn.title = options.label || name; // tooltip
    } else {
      btn.innerText = options.label || name; // hiển thị chữ
    }

    btn.onclick = () => this.showTab(name);
    this.tabsEl.appendChild(btn);
    this.tabs[name].btn = btn;

    if (!this.currentTab) this.showTab(name);

    return gui;
  }
  addWithIcon(gui, obj, prop, icon, options = {}) {
    let controller;

    if (options.choices) {
        controller = gui.add(obj, prop, options.choices);
    } else if (options.isColor) {
        controller = gui.addColor(obj, prop);
    } else {
        controller = gui.add(obj, prop);
    }

    const li = controller.domElement.parentElement.parentElement;
    li.classList.add("with-icon-item");

    // lấy label gốc
    const nameEl = li.querySelector(".property-name");
    if (nameEl) {
        nameEl.textContent = "";  // ẩn chữ gốc

        const iconSpan = document.createElement("span");
        iconSpan.textContent = icon || "";
        iconSpan.style.display = "inline-block";
        iconSpan.style.width = "20px";
        iconSpan.style.textAlign = "center";
        nameEl.appendChild(iconSpan);

        // tooltip
        nameEl.title = options.label || prop;
    }

    // di chuyển checkbox sang phải
    const checkbox = li.querySelector('input[type="checkbox"]');
    if (checkbox) {
        checkbox.style.marginLeft = "8px";
        checkbox.style.float = "right";
    }

    // --- Tạo group with-icon nếu chưa có ---
    let customGroup = gui.domElement.querySelector("ul.with-icon-list");
    if (!customGroup) {
        customGroup = document.createElement("ul");
        customGroup.classList.add("with-icon-list");
        gui.domElement.querySelector("ul").appendChild(customGroup);
    }
    customGroup.appendChild(li);

    // ===== Thêm CSS trực tiếp cho ul.with-icon-list =====
    if (!document.getElementById("with-icon-list-style")) {
        const styleEl = document.createElement("style");
        styleEl.id = "with-icon-list-style";
        styleEl.innerHTML = `
            .dg.main ul.with-icon-list {
                display: flex !important;
                flex-wrap: wrap !important;
                padding: 0 !important;
                margin: 0 !important;
                list-style: none;
            }
        `;
        document.head.appendChild(styleEl);
    }

    // ===== Tùy biến số cột =====
    const cols = options.columns || 4;
    const gap = 4; // px
    const liWidth = `calc(${100 / cols}%`;// - ${gap}px)`; 
    li.style.setProperty("flex", `0 0 ${liWidth}`, "important");
    li.style.boxSizing = "border-box";

    if (options.onChange) controller.onChange(options.onChange);
    if (options.onFinishChange) controller.onFinishChange(options.onFinishChange);

    return controller;
}


addFolderWithTooltip(gui, folderName, icon = "", tooltip = "") {
  const folder = gui.addFolder(folderName);

  // Tìm thẻ <li> đại diện folder
  const li = folder.domElement.parentElement;
  if (li) {
      // Tạo span dấu chấm than
      const infoBtn = document.createElement("span");
      infoBtn.textContent = "❗"; // dấu chấm than
      infoBtn.title = tooltip; // tooltip khi hover

      // style cho nút info
      infoBtn.style.position = "absolute";
      infoBtn.style.right = "8px"; // nằm sát bên phải
      infoBtn.style.top = "50%";
      infoBtn.style.transform = "translateY(-50%)"; // căn giữa theo chiều dọc
      infoBtn.style.cursor = "pointer";
      infoBtn.style.padding = "2px 4px";
      infoBtn.style.borderRadius = "4px";
      infoBtn.style.transition = "all 0.2s ease";
      infoBtn.style.userSelect = "none";

      // hiệu ứng highlight khi hover
      infoBtn.onmouseover = () => {
          infoBtn.style.backgroundColor = "rgba(255,255,255,0.2)";
      };
      infoBtn.onmouseout = () => {
          infoBtn.style.backgroundColor = "transparent";
      };

      // đặt relative cho container để nút info nằm đúng
      const titleEl = li.querySelector(".title");
      if (titleEl) {
          titleEl.style.position = "relative"; 
          titleEl.appendChild(infoBtn);
      }
  }

  return folder;
}

  showTab(name) {
    for (const key in this.tabs) {
      const { tabDiv, btn } = this.tabs[key];
      tabDiv.style.display = key === name ? "block" : "none";
      btn.classList.toggle("active", key === name);
    }
    this.currentTab = name;
  }

  getCurrentGUI() {
    return this.tabs[this.currentTab]?.gui || null;
  }

  // ===== Extra Features =====
  saveDefaults(paramsObj) {
    for (const key in paramsObj) {
      if (!(key in this.defaultValues)) {
        this.defaultValues[key] = JSON.parse(JSON.stringify(paramsObj[key]));
      }
    }
  }

  resetAll(paramsObj) {
    for (const key in this.defaultValues) {
      if (paramsObj[key] !== undefined) {
        paramsObj[key] = JSON.parse(JSON.stringify(this.defaultValues[key]));
      }
    }
    this.updateAllDisplays();
  }

  exportJSON(paramsObj) {
    const json = JSON.stringify(paramsObj, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gui-config.json";
    a.click();
  }

  importJSON(paramsObj, file) {
    const reader = new FileReader();
    reader.onload = e => {
      const data = JSON.parse(e.target.result);
      Object.assign(paramsObj, data);
      this.updateAllDisplays();
    };
    reader.readAsText(file);
  }

  collapseAll() {
    for (const key in this.tabs) {
      const gui = this.tabs[key].gui;
      if (gui.__folders) {
        Object.values(gui.__folders).forEach(f => {
          f.close();  // chỉ cần close thôi
        });
      }
    }
  }
  
  expandAll() {
    for (const key in this.tabs) {
      const gui = this.tabs[key].gui;
      if (gui.__folders) {
        Object.values(gui.__folders).forEach(f => {
          f.open(); // chỉ cần open thôi
        });
      }
    }
  }
 
  toggle() {
    const root = document.getElementById("gui-root");
    root.style.display = root.style.display === "none" ? "flex" : "none";
  }

  updateAllDisplays() {
    for (const key in this.tabs) {
      this.tabs[key].gui.updateDisplay();
    }
  }

// ===== Nút thu gọn =====
_initCollapseButton() {
  const collapseBtn = document.createElement("button");
  collapseBtn.innerHTML = "»";  // vì ban đầu là thu gọn
  collapseBtn.title = "Thu gọn / Mở rộng panel";
  collapseBtn.className = "gui-tab button"; // 👈 dùng class chung

  // gắn vào đầu tabsEl
  this.tabsEl.insertBefore(collapseBtn, this.tabsEl.firstChild);

  let collapsed = true; // 👈 ban đầu thu gọn

  // ẩn content + các tab con ngay khi khởi tạo
  this.contentEl.style.display = "none";
  Array.from(this.tabsEl.children).forEach(el => {
    if (el !== collapseBtn) el.style.display = "none";
  });

  collapseBtn.onclick = () => {
    collapsed = !collapsed;
    if (collapsed) {
      this.contentEl.style.display = "none";
      Array.from(this.tabsEl.children).forEach(el => {
        if (el !== collapseBtn) el.style.display = "none";
      });
      collapseBtn.innerHTML = "»"; // đổi icon mở lại
    } else {
      this.contentEl.style.display = "";
      Array.from(this.tabsEl.children).forEach(el => {
        if (el !== collapseBtn) el.style.display = "";
      });
      collapseBtn.innerHTML = "«"; // đổi icon thu gọn
    }
  };
}


  _initShortcuts() {
    window.addEventListener("keydown", e => {
      if (e.key.toLowerCase() === "h") {
        this.toggle();
      }
    });
  }
}
