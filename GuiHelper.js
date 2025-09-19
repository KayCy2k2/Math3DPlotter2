// GuiHelper.js

class GuiHelperTabs {
  constructor() {
    this.tabs = {};
    this.currentTab = null;
    this.defaultValues = {};
    this._commands = []; // 🆕 danh sách lệnh
    this._injectLayout(); // 👈 tạo DOM + style inline
    this._injectStyles(); // 👈 chèn CSS chung
    this._initShortcuts();
    this._initCollapseButton();
    this.miniMenu = null; // 🆕 lưu menu
    this._initMiniMenu();
    this._noteDiv = null; // 🆕 lưu div ghi chú hiện tại

    // danh sách các controller dạng 4 cột
    this.fourColumnControllers = [];
    this._searchData = []; // 🆕 lưu tab + folder để tìm kiếm
    this.layoutMode = false; // 🆕 trạng thái Layout Mode

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

    // 🆕 Lưu vào danh sách search
    this._searchData.push({
      type: "tab",
      name: name,
      open: () => this.showTab(name),
    });
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
      nameEl.textContent = ""; // clear chữ gốc

      const iconSpan = document.createElement("span");
      iconSpan.textContent = icon || "";
      iconSpan.style.display = "inline-block";
      iconSpan.style.width = "20px";
      iconSpan.style.textAlign = "center";
      nameEl.appendChild(iconSpan);

      if (options.showLabel) {
        const labelSpan = document.createElement("span");
        labelSpan.textContent = " " + (options.label || prop);
        nameEl.appendChild(labelSpan);
      } else {
        // === Căn giữa nếu chỉ có icon ===
        const hasInput = li.querySelector(
          'input[type="checkbox"], input[type="text"], select, input[type="range"]'
        );
        if (!hasInput) {
          nameEl.style.display = "flex";
          nameEl.style.justifyContent = "center";
          nameEl.style.alignItems = "center";
        }
        nameEl.title = options.label || prop;
      }

      // tooltip khi chỉ hiển thị icon
      if (!options.showLabel) {
        nameEl.title = options.label || prop;
      }
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

    // ===== Thêm CSS trực tiếp cho label .property-name =====
    if (!document.getElementById("with-icon-label-style")) {
      const styleEl = document.createElement("style");
      styleEl.id = "with-icon-label-style";
      styleEl.innerHTML = `
        .dg .cr .property-name {
          overflow: visible !important;
          text-overflow: unset !important;
          white-space: nowrap !important; /* 👈 giữ 1 dòng */
          line-height: 2.8em;
          max-width: none !important;
        }
      `;
      document.head.appendChild(styleEl);
    }

    // ===== Tùy biến số cột =====
    const cols = options.columns || 4;
    const liWidth = `calc(${100 / cols}%)`;
    li.style.setProperty("flex", `0 0 ${liWidth}`, "important");
    li.style.boxSizing = "border-box";

    if (options.onChange) controller.onChange(options.onChange);
    if (options.onFinishChange)
      controller.onFinishChange(options.onFinishChange);

    // 🆕 Thêm vào danh sách command palette
    if (options.label) {
      this._commands.push({
        label: options.label,
        run: () => {
          // toggle checkbox nếu có
          const checkbox = controller.domElement.querySelector(
            'input[type="checkbox"]'
          );
          if (checkbox) {
            checkbox.click();
          } else {
            // hoặc gọi onChange nếu là button
            if (typeof obj[prop] === "function") {
              obj[prop]();
            }
          }
        },
      });
    }

    return controller;
  }
  toggleLayoutMode() {
    this.layoutMode = !this.layoutMode;
    console.log("Layout Mode:", this.layoutMode ? "ON" : "OFF");
  }

  makeDraggable(el, handle) {
    let offsetX = 0, offsetY = 0, isDown = false;

    handle.style.cursor = "move"; // con trỏ kéo
    handle.onmousedown = (e) => {
      if (!this.layoutMode) return; // chỉ cho kéo khi LayoutMode bật
      isDown = true;
      offsetX = e.clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;
      document.onmousemove = (e) => {
        if (!isDown) return;
        el.style.left = e.clientX - offsetX + "px";
        el.style.top = e.clientY - offsetY + "px";
      };
      document.onmouseup = () => {
        isDown = false;
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
  // 🆕 Quick Command Palette
  createCommandPalette() {
    if (this._cmdDiv) {
      this._cmdDiv.remove();
      this._cmdDiv = null;
      return;
    }

    const div = document.createElement("div");
    this._cmdDiv = div;
    div.style.position = "fixed";
    div.style.top = "20px";
    div.style.left = "50%";
    div.style.transform = "translateX(-50%)";
    div.style.width = "400px";
    div.style.background = "rgba(30,30,30,0.95)";
    div.style.color = "#fff";
    div.style.borderRadius = "8px";
    div.style.boxShadow = "0 4px 15px rgba(0,0,0,0.5)";
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.zIndex = 20000;

    // --- Thanh input + nút X ---
    const inputRow = document.createElement("div");
    inputRow.style.display = "flex";
    inputRow.style.alignItems = "center";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Gõ lệnh...";
    input.style.flex = "1";
    input.style.padding = "10px";
    input.style.border = "none";
    input.style.outline = "none";
    input.style.fontSize = "14px";
    input.style.background = "#1e1e1e";
    input.style.color = "#fff";

    const closeBtn = document.createElement("span");
    closeBtn.textContent = "✖";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontSize = "16px";
    closeBtn.style.padding = "0 10px";
    closeBtn.style.color = "#bbb";
    closeBtn.onmouseover = () => (closeBtn.style.color = "#fff");
    closeBtn.onmouseout = () => (closeBtn.style.color = "#bbb");
    closeBtn.onclick = () => {
      div.remove();
      this._cmdDiv = null;
    };

    inputRow.appendChild(input);
    inputRow.appendChild(closeBtn);
    div.appendChild(inputRow);

    // --- Results ---
    const results = document.createElement("div");
    results.style.maxHeight = "300px";
    results.style.overflowY = "auto";
    results.style.display = "none"; // 🚫 ban đầu ẩn
    div.appendChild(results);

    // Tìm kiếm
    const updateResults = () => {
      const val = input.value.toLowerCase().trim();
      results.innerHTML = "";

      if (!val) {
        results.style.display = "none"; // không hiển thị khi chưa nhập
        return;
      }

      const matches = this._commands.filter((c) =>
        c.label.toLowerCase().includes(val)
      );

      if (matches.length > 0) {
        results.style.display = "block"; // hiện khi có kết quả
        matches.forEach((c, idx) => {
          const item = document.createElement("div");
          item.textContent = c.label;
          item.style.padding = "6px 10px";
          item.style.cursor = "pointer";
          item.onmouseover = () =>
            (item.style.background = "rgba(255,255,255,0.2)");
          item.onmouseout = () => (item.style.background = "transparent");
          item.onclick = () => {
            c.run();
            // ❌ Không đóng palette nữa, chỉ chạy lệnh
          };
          if (idx === 0) item.style.background = "rgba(255,255,255,0.1)";
          results.appendChild(item);
        });
      } else {
        results.style.display = "none"; // không có kết quả thì ẩn
      }
    };

    input.addEventListener("input", updateResults);

    // Enter chọn lệnh đầu tiên
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const first = results.querySelector("div");
        if (first) first.click();
      }
    });
    input.addEventListener("click", (e) => e.stopPropagation());
    input.addEventListener("keydown", (e) => e.stopPropagation());
    results.addEventListener("click", (e) => e.stopPropagation());
    document.body.appendChild(div);
    input.focus();
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
    // 🆕 Lưu vào danh sách search
    this._searchData.push({
      type: "folder",
      name: folderName,
      open: () => {
        folder.open();
        // Mở luôn tab chứa folder
        for (const key in this.tabs) {
          if (this.tabs[key].gui === gui) {
            this.showTab(key);
            break;
          }
        }
      },
    });
    return folder;
  }
  // 🆕 Tạo khung tìm kiếm nổi (giống note)
  createSearchBox() {
    // Nếu đã có box hiện tại thì toggle đóng/mở
    if (this._searchDiv) {
      this._searchDiv.remove();
      this._searchDiv = null;
      return;
    }

    const searchDiv = document.createElement("div");
    this._searchDiv = searchDiv;

    // --- Khung chính ---
    searchDiv.style.position = "fixed";
    searchDiv.style.top = "20px";
    searchDiv.style.left = "20px";
    searchDiv.style.width = "280px";
    searchDiv.style.background = "rgba(40,40,40,0.97)";
    searchDiv.style.color = "#ddd";
    searchDiv.style.zIndex = 10000;
    searchDiv.style.display = "flex";
    searchDiv.style.flexDirection = "column";
    searchDiv.style.borderRadius = "10px";
    searchDiv.style.overflow = "hidden";
    searchDiv.style.boxShadow = "0 4px 15px rgba(0,0,0,0.6)";
    searchDiv.style.fontFamily = "Segoe UI, sans-serif";

    // --- Header ---
    const header = document.createElement("div");
    header.innerText = "🔍 Tìm kiếm";
    header.style.background = "linear-gradient(90deg, #444, #222)";
    header.style.color = "#fff";
    header.style.padding = "6px 10px";
    header.style.fontSize = "14px";
    header.style.fontWeight = "bold";
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    searchDiv.appendChild(header);

    // --- Nút đóng ---
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "✖";
    closeBtn.style.background = "transparent";
    closeBtn.style.border = "none";
    closeBtn.style.color = "#aaa";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontSize = "14px";
    closeBtn.style.transition = "color 0.2s";
    closeBtn.onmouseover = () => (closeBtn.style.color = "#ff5555");
    closeBtn.onmouseout = () => (closeBtn.style.color = "#aaa");
    closeBtn.onclick = () => {
      searchDiv.remove();
      this._searchDiv = null;
    };
    header.appendChild(closeBtn);

    // --- Input ---
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Nhập tên tab hoặc folder...";
    input.style.width = "100%";
    input.style.padding = "6px 8px";
    input.style.border = "none";
    input.style.outline = "none";
    input.style.background = "#1e1e1e";
    input.style.color = "#eee";
    input.style.fontSize = "14px";
    searchDiv.appendChild(input);

    // --- Results ---
    const results = document.createElement("div");
    results.style.flex = "1";
    results.style.overflowY = "auto";
    results.style.maxHeight = "200px";
    results.style.background = "#222";
    results.style.padding = "4px";
    searchDiv.appendChild(results);

    // --- Xử lý tìm kiếm ---
    input.addEventListener("input", () => {
      const val = input.value.toLowerCase().trim();
      results.innerHTML = "";
      if (!val) return;

      const matches = this._searchData.filter((item) =>
        item.name.toLowerCase().includes(val)
      );

      if (matches.length === 0) {
        const div = document.createElement("div");
        div.textContent = "Không tìm thấy";
        div.style.padding = "4px 6px";
        div.style.color = "#aaa";
        results.appendChild(div);
      } else {
        matches.forEach((item) => {
          const div = document.createElement("div");
          div.textContent = `${item.type === "tab" ? "📑" : "📂"} ${item.name}`;
          div.style.padding = "4px 6px";
          div.style.cursor = "pointer";
          div.onmouseover = () =>
            (div.style.background = "rgba(255,255,255,0.15)");
          div.onmouseout = () => (div.style.background = "transparent");
          div.onclick = () => {
            // Nếu đang thu gọn thì tự mở trước
            if (this._collapsed && this._collapseBtn) {
              this._collapseBtn.click();
            }
            item.open();
          };

          results.appendChild(div);
        });
      }
    });
    // Ngăn sự kiện click bên trong searchBox bong ra ngoài
    input.addEventListener("click", (e) => e.stopPropagation());
    input.addEventListener("keydown", (e) => e.stopPropagation());
    results.addEventListener("click", (e) => e.stopPropagation());

    document.body.appendChild(searchDiv);
    this.makeDraggable(searchDiv, header); // 🆕 kéo-thả bằng header

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
    reader.onload = (e) => {
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
        Object.values(gui.__folders).forEach((f) => {
          f.close(); // chỉ cần close thôi
        });
      }
    }
  }

  expandAll() {
    for (const key in this.tabs) {
      const gui = this.tabs[key].gui;
      if (gui.__folders) {
        Object.values(gui.__folders).forEach((f) => {
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
  // ===== Tạo miniMenu kiểu dat.GUI =====
  _initMiniMenu() {
    const menu = document.createElement("div");
    menu.className = "gui-mini-menu";
    menu.style.position = "absolute";
    menu.style.background = "rgba(50,50,50,0.95)";
    menu.style.color = "#fff";
    menu.style.padding = "6px 10px";
    menu.style.borderRadius = "6px";
    menu.style.display = "none";
    menu.style.zIndex = "9999";
    menu.style.fontSize = "14px";
    menu.style.minWidth = "120px";
    menu.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
    menu.style.userSelect = "none";
    document.body.appendChild(menu);
    this.miniMenu = menu;

    // click ra ngoài ẩn menu
    window.addEventListener("click", () => {
      menu.style.display = "none";
    });
  }

  // 🆕 Cập nhật nội dung menu
  setMiniMenuItems(items) {
    if (!this.miniMenu) return;
    this.miniMenu.innerHTML = "";
    items.forEach((it) => {
      const div = document.createElement("div");
      div.textContent = it.label;
      div.style.padding = "2px 6px";
      div.style.cursor = "pointer";
      div.onmouseover = () => (div.style.background = "rgba(255,255,255,0.2)");
      div.onmouseout = () => (div.style.background = "transparent");
      div.onclick = (e) => {
        e.stopPropagation(); // 🆕 ngăn sự kiện click "bong ra" window
        it.onClick();
        this.miniMenu.style.display = "none";
      };
      this.miniMenu.appendChild(div);
    });
  }

  // 🆕 Hiển thị menu tại vị trí chuột
  showMiniMenu(x, y) {
    if (!this.miniMenu) return;
    this.miniMenu.style.left = x + "px";
    this.miniMenu.style.top = y + "px";
    this.miniMenu.style.display = "block";
  }
  createNote() {
    // Nếu đã có note đang hiển thị, đóng nó và trả về
    if (this._noteDiv) {
      this._noteDiv.remove();
      this._noteDiv = null;
      return;
    }

    const noteDiv = document.createElement("div");
    this._noteDiv = noteDiv; // lưu tham chiếu

    // --- Khung chính ---
    noteDiv.style.position = "fixed";
    noteDiv.style.top = "20px";
    noteDiv.style.left = "20px";
    noteDiv.style.width = "350px";
    noteDiv.style.height = "300px";
    noteDiv.style.background = "rgba(40,40,40,0.97)";
    noteDiv.style.color = "#ddd";
    noteDiv.style.zIndex = 10000;
    noteDiv.style.display = "flex";
    noteDiv.style.flexDirection = "column";
    noteDiv.style.borderRadius = "10px";
    noteDiv.style.overflow = "hidden";
    noteDiv.style.boxShadow = "0 4px 15px rgba(0,0,0,0.6)";
    noteDiv.style.fontFamily = "Segoe UI, sans-serif";

    // --- Header ---
    const header = document.createElement("div");
    header.innerText = "📝 Ghi chú";
    header.style.background = "linear-gradient(90deg, #444, #222)";
    header.style.color = "#fff";
    header.style.padding = "6px 10px";
    header.style.fontSize = "14px";
    header.style.fontWeight = "bold";
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    noteDiv.appendChild(header);

    // --- Nút đóng ---
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "✖";
    closeBtn.style.background = "transparent";
    closeBtn.style.border = "none";
    closeBtn.style.color = "#aaa";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontSize = "14px";
    closeBtn.style.transition = "color 0.2s";
    closeBtn.onmouseover = () => (closeBtn.style.color = "#ff5555");
    closeBtn.onmouseout = () => (closeBtn.style.color = "#aaa");
    closeBtn.onclick = () => {
      noteDiv.remove();
      this._noteDiv = null; // reset tham chiếu
    };
    header.appendChild(closeBtn);

    // --- Textarea ---
    const textarea = document.createElement("textarea");
    textarea.value = "Viết ghi chú...";
    textarea.style.flex = "1";
    textarea.style.resize = "none";
    textarea.style.width = "100%";
    textarea.style.height = "100%";
    textarea.style.background = "#1e1e1e";
    textarea.style.color = "#eee";
    textarea.style.border = "none";
    textarea.style.outline = "none";
    textarea.style.padding = "10px";
    textarea.style.fontFamily = "Consolas, monospace";
    textarea.style.fontSize = "14px";
    textarea.style.lineHeight = "1.4";

    textarea.addEventListener("click", (e) => e.stopPropagation());
    textarea.addEventListener("keydown", (e) => e.stopPropagation());

    noteDiv.appendChild(textarea);

    document.body.appendChild(noteDiv);
    this.makeDraggable(noteDiv, header); // 🆕 kéo-thả bằng header

  }

  // 🆕 Gắn sự kiện chuột phải
  attachMiniMenu(renderer) {
    renderer.domElement.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      event.stopPropagation(); // 🆕 ngăn "bong ra" click
      this.setMiniMenuItems([
        {
          label: "Ghi chú",
          onClick: () => this.createNote(), // gọi lại phương thức
        },
        {
          label: "Xoá",
          onClick: () => console.log("Xoá"),
        },
      ]);

      this.showMiniMenu(event.clientX, event.clientY);
    });

    // click ra ngoài mới ẩn menu
    window.addEventListener("click", (e) => {
      if (!this.miniMenu.contains(e.target)) {
        this.miniMenu.style.display = "none";
      }
    });
  }

  // ===== Nút thu gọn =====
  _initCollapseButton() {
    const collapseBtn = document.createElement("button");
    collapseBtn.innerHTML = "»";
    collapseBtn.title = "Thu gọn / Mở rộng panel";
    collapseBtn.className = "gui-tab button";
    this.tabsEl.insertBefore(collapseBtn, this.tabsEl.firstChild);

    this._collapsed = true; // 👈 lưu trạng thái
    this._collapseBtn = collapseBtn; // 👈 lưu tham chiếu

    // ẩn content + các tab con ngay khi khởi tạo
    this.contentEl.style.display = "none";
    Array.from(this.tabsEl.children).forEach((el) => {
      if (el !== collapseBtn) el.style.display = "none";
    });

    collapseBtn.onclick = () => {
      this._collapsed = !this._collapsed; // 👈 update trạng thái
      if (this._collapsed) {
        this.contentEl.style.display = "none";
        Array.from(this.tabsEl.children).forEach((el) => {
          if (el !== collapseBtn) el.style.display = "none";
        });
        collapseBtn.innerHTML = "»";
      } else {
        this.contentEl.style.display = "";
        Array.from(this.tabsEl.children).forEach((el) => {
          if (el !== collapseBtn) el.style.display = "";
        });
        collapseBtn.innerHTML = "«";
      }
    };
  }

  _initShortcuts() {
    window.addEventListener("keydown", (e) => {
      // toggle panel
      if (e.key.toLowerCase() === "h") {
        this.toggle();
      }
      // 🆕 mở Quick Command Palette: Ctrl+Shift+P
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        this.createCommandPalette();
      }
    });
  }
  _injectLayout() {
    // container chính
    this.containerEl = document.createElement("div");
    this.containerEl.className = "gui-container";
    this.containerEl.style.position = "fixed";
    this.containerEl.style.top = "20%";
    this.containerEl.style.right = "20px";
    this.containerEl.style.display = "flex";
    this.containerEl.style.border = "1px solid #555";
    this.containerEl.style.background = "#222";
    this.containerEl.style.color = "white";
    this.containerEl.style.zIndex = "9999";
    this.containerEl.style.maxHeight = "90vh";

    // content
    this.contentEl = document.createElement("div");
    this.contentEl.className = "gui-content";
    this.contentEl.style.display = "flex";
    this.contentEl.style.flexDirection = "column";
    this.contentEl.style.borderLeft = "1px solid #444";
    this.contentEl.style.maxHeight = "60vh";
    this.contentEl.style.overflowY = "auto";

    // tabs
    this.tabsEl = document.createElement("div");
    this.tabsEl.className = "gui-tabs";
    this.tabsEl.style.display = "flex";
    this.tabsEl.style.flexDirection = "column";
    this.tabsEl.style.borderLeft = "1px solid #444";
    this.tabsEl.style.maxHeight = "60vh";
    this.tabsEl.style.overflowY = "auto";

    // gắn vào container
    this.containerEl.appendChild(this.contentEl);
    this.containerEl.appendChild(this.tabsEl);

    // chèn vào body
    document.body.appendChild(this.containerEl);
  }

  _injectStyles() {
    if (document.getElementById("guihelper-style")) return;
    const styleEl = document.createElement("style");
    styleEl.id = "guihelper-style";
    styleEl.innerHTML = `
      /* Scrollbar chung cho toàn bộ panel */
      .gui-container::-webkit-scrollbar,
      .gui-content::-webkit-scrollbar,
      .gui-tabs::-webkit-scrollbar {
        width: 6px;
      }
      .gui-container::-webkit-scrollbar-thumb,
      .gui-content::-webkit-scrollbar-thumb,
      .gui-tabs::-webkit-scrollbar-thumb {
        background: #555;
        border-radius: 3px;
      }
      .gui-container::-webkit-scrollbar-thumb:hover,
      .gui-content::-webkit-scrollbar-thumb:hover,
      .gui-tabs::-webkit-scrollbar-thumb:hover {
        background: #777;
      }
      .gui-container::-webkit-scrollbar-track,
      .gui-content::-webkit-scrollbar-track,
      .gui-tabs::-webkit-scrollbar-track {
        background: #222;
      }
  
      .gui-tabs button {
        background: #444;
        color: #eee;
        border: none;
        cursor: pointer;
        padding: 6px 10px;
        font-size: 14px;
        margin: 2px;
        border-radius: 4px;
        min-width: 32px;
        min-height: 28px;
      }
  
      .gui-tabs button.active {
        background: #666;
        font-weight: bold;
      }
      /* Đổi nền và chữ của select trong dat.GUI */
      .dg .c select {
        background-color: #222;
        /* màu nền */
        color: #ffffff;
        /* màu chữ */
        border: 1px solid #666;
        /* viền */
        border-radius: 6px;
        /* bo góc */
        padding: 1px;
      }
  
      /* Khi hover */
      .dg .c select:hover {
        background-color: #333;
        color: #fff;
      }
  
      /* Thu nhỏ box chọn màu trong dat.GUI */
      .dg .cr.color .c {
        width: 60px !important;
        /* chỉnh chiều ngang */
      }
  
      .dg .cr.color input {
        width: 55px !important;
        /* chỉnh input text */
        height: 20px !important;
        padding: 0 2px;
        font-size: 11px;
      }
    `;
    document.head.appendChild(styleEl);
  }
}
