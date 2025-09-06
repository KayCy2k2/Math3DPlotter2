// GuiHelper.js

class GuiHelperTabs {
  constructor() {
    this.tabs = {};
    this.currentTab = null;
    this.contentEl = document.getElementById("gui-content");
    this.tabsEl = document.getElementById("gui-tabs");
    this.defaultValues = {};
    this._initShortcuts();

    // thêm nút thu gọn
    this._initCollapseButton();
  }

  // ===== Tabs =====
  addTab(name, width = 300, options = {}) {
    const tabDiv = document.createElement("div");
    tabDiv.style.display = "none";
    this.contentEl.appendChild(tabDiv);

    const gui = new dat.GUI({ autoPlace: false, width });
    tabDiv.appendChild(gui.domElement);

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
      gui.__folders && Object.values(gui.__folders).forEach(f => f.close());
    }
  }

  expandAll() {
    for (const key in this.tabs) {
      const gui = this.tabs[key].gui;
      gui.__folders && Object.values(gui.__folders).forEach(f => f.open());
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
