// ----- Hiển thị -----
let autoRotate = true;
const displayParams = {
  // Toggle
  autoRotate: true,
  showFormula: true,

  // Trục
  axisLength: 50,
  step: 5,
  min: -50,
  max: 50,
  axisColor: "#ffffff",

  // Hiển thị
  showAxisLabels: true,
  showAxisTicks: true,

  // Nhãn trục
  labelX: "X",
  labelY: "Y",
  labelZ: "Z",

  // Nút hành động
  toggleGrid: () => {
    toggle(gridHelper);
  },
  updateAxes: () => {
    updateAxisAllGUI(); // cập nhật trục & ticks
    updateGrid();       // cập nhật luôn lưới
  }  
};

// Tạo tab GUI
const guiHelper = new GuiHelperTabs();
const guiDisplay   = guiHelper.addTab("Hiển thị", 350, { icon: "🖥️", label: "Hiển thị" });

// --- Toggle ---
guiDisplay.add(displayParams, "autoRotate").name("🔄 Auto-Rotate")
  .onChange((value) => {
    autoRotate = value; // gán thẳng vào biến cũ
  });

guiDisplay.add(displayParams, "showFormula").name("📖 Hiển thị công thức")
  .onChange((value) => {
    formulaVisible = value;
    if (formulaLabel) formulaLabel.visible = formulaVisible;
  });

// --- Cấu hình trục ---
const fAxis = guiDisplay.addFolder("📐 Cấu hình trục");
fAxis.add(displayParams, "axisLength", 10, 200, 1).name("Độ dài trục");
fAxis.domElement.classList.add("axis-folder");

fAxis.addColor(displayParams, "axisColor").name("Màu trục");
fAxis.add(displayParams, "labelX").name("Nhãn X");
fAxis.add(displayParams, "labelY").name("Nhãn Y");
fAxis.add(displayParams, "labelZ").name("Nhãn Z");

// --- Cấu hình ticks ---
const fTicks = guiDisplay.addFolder("📏 Cấu hình ticks");
fTicks.add(displayParams, "step", 1, 20, 1).name("Bước");
fTicks.add(displayParams, "min", -100, 0, 1).name("Min");
fTicks.add(displayParams, "max", 0, 100, 1).name("Max");
fTicks.add(displayParams, "showAxisLabels").name("Hiển thị nhãn");
fTicks.add(displayParams, "showAxisTicks").name("Hiển thị ticks");

// --- Nút hành động ---
guiDisplay.add(displayParams, "toggleGrid").name("🟩 Bật/Tắt Lưới");
guiDisplay.add(displayParams, "updateAxes").name("🔄 Cập nhật Trục & Ticks");

function updateGrid() {
  // Xóa lưới cũ nếu có
  if (gridHelper) {
    scene.remove(gridHelper);
    gridHelper.geometry.dispose();
    gridHelper.material.dispose();
  }

  // Kích thước grid dựa trên max-min
  const size = displayParams.max - displayParams.min;
  const divisions = Math.floor(size / displayParams.step);

  gridHelper = new THREE.GridHelper(size, divisions, displayParams.axisColor, displayParams.axisColor);
  gridHelper.position.y = 0; // Giữ grid ở mặt phẳng Y=0 (tùy chỉnh nếu muốn)
  scene.add(gridHelper);
}
// ----- Nút Trợ giúp -----
displayParams.help = () => {
  alert(
`📖 Hướng dẫn sử dụng tab Hiển thị:

🔄 Auto-Rotate: Bật/tắt tự động xoay toàn cảnh.
📖 Hiển thị công thức: Bật/tắt nhãn công thức trong không gian.

📐 Cấu hình trục:
- Độ dài trục: Điều chỉnh chiều dài các trục X, Y, Z.
- Màu trục: Chọn màu hiển thị cho trục.
- Nhãn X/Y/Z: Đổi ký hiệu nhãn cho từng trục.

📏 Cấu hình ticks:
- Bước: Khoảng cách giữa các ticks (vạch chia).
- Min/Max: Giới hạn hiển thị trên trục.
- Hiển thị nhãn: Bật/tắt chữ số trên ticks.
- Hiển thị ticks: Bật/tắt vạch chia trên trục.

🟩 Bật/Tắt Lưới: Ẩn/hiện lưới nền.
🔄 Cập nhật Trục & Ticks: Tải lại toàn bộ trục và lưới theo cấu hình mới.
`
  );
};

// Thêm vào GUI
guiDisplay.add(displayParams, "help").name("❓ Trợ giúp");


const sampleParams = {
  primitiveShape: "none",
  motionEffect: "",
  customMotionCode: "",
  shapeType: "box",
  shapeSize: 1,
  shapeHeight: 1,
  shapeColor: "#44ccff",
};

const guiSample    = guiHelper.addTab("Khối Mẫu", 340, { icon: "🧊", label: "Khối Mẫu" });

guiSample.add(sampleParams, "primitiveShape", {
  "Chọn khối 2D/3D": "none",
  "Hình Lập Phương": "cube",
  "Hình Cầu": "sphere",
  "Hình Trụ": "cylinder",
  "Hình Nón": "cone",
  "Hình Tròn 2D": "circle",
  "Ellipse": "ellipse",
  "Tam Giác 2D": "triangle",
  "Ngũ Giác 2D": "pentagon",
  "Lục Giác 2D": "hexagon",
  "Hình Chóp": "pyramid",
  "Mặt Phẳng": "plane"
}).name("🎨 Chọn Khối 2D/3D");

guiSample.add(sampleParams, "motionEffect", {
  "-- Không chuyển động --": "",
  "Quay quanh trục Y": "rotateY",
  "Quay quanh trục X": "rotateX",
  "Nảy lên xuống": "bounce",
  "Gợn sóng": "wave",
  "Xoay liên tục": "spin",
  "Lắc ngang": "shake",
  "Trượt tròn": "circle",
  "Gợn sóng trục Z": "waveZ",
  "Trôi nổi": "float",
  "Xoay": "rotate",
  "Phồng lên": "pulse",
  "Quay quanh tâm": "orbit",
  "Chớp màu": "flashColor"
}).name("🌀 Hiệu Ứng Chuyển Động");

guiSample.add(sampleParams, "customMotionCode").name("Custom Motion (JS)");

const fShape = guiSample.addFolder("🧱 Tùy Biến Khối 3D");
fShape.add(sampleParams, "shapeType", { Box: "box", Sphere: "sphere", Cylinder: "cylinder" }).name("Loại Khối");
fShape.add(sampleParams, "shapeSize", 0.1, 10, 0.1).name("Kích thước / Bán kính");
fShape.add(sampleParams, "shapeHeight", 0.1, 10, 0.1).name("Chiều Cao");
fShape.addColor(sampleParams, "shapeColor").name("Màu sắc");
fShape.add({ createShape: () => createShape(sampleParams) }, "createShape").name("➕ Tạo Khối");

// Danh sách preset (hiển thị trong GUI)
const presetShapes = {
  "⚪ Khối Cầu": "sphere",
  "❤️ Trái Tim": "heart",
  "🌀 Hình Xuyến": "torus",
  "🔃 Xoắn Ốc": "spiral",
  "🌊 Sóng Sin": "wave",
  "🔺 Yên Ngựa": "saddle",
  "🧊 Elipsoid": "ellipsoid",
  "📈 Parabol 3D": "paraboloid",
  "🌀 Sin-Cos Wave": "sincosWave",
  "♾️ Mobius": "mobius",
  "🔻 Cone": "cone",
  "🌀 Cycloid": "cycloid"
};

// Tạo GUI chọn khối
guiSample
  .add({ preset: "sphere" }, "preset", presetShapes)
  .name("📦 Khối Mẫu")
  .onChange(val => {
    if (allObjects[val]) toggle(allObjects[val]);
  });

// ----- Nút Trợ giúp -----
sampleParams.help = () => {
  alert(
`📖 Hướng dẫn sử dụng tab Khối Mẫu:

🎨 Chọn Khối 2D/3D:
- Chọn nhanh các khối cơ bản như Cube, Sphere, Cylinder, Cone, Circle, Ellipse, Tam giác, Ngũ giác, Lục giác, Chóp, Mặt phẳng.

🌀 Hiệu Ứng Chuyển Động:
- Thêm chuyển động động cho khối đã chọn.
- Ví dụ: Quay quanh trục, Nảy, Gợn sóng, Lắc, Quay quanh tâm, Chớp màu...

💻 Custom Motion (JS):
- Tự viết code JavaScript để tạo hiệu ứng chuyển động tùy biến cho khối.

🧱 Tùy Biến Khối 3D:
- Loại Khối: Box, Sphere, Cylinder.
- Kích thước / Bán kính: Điều chỉnh kích thước khối.
- Chiều cao: Điều chỉnh độ cao (đối với Cylinder, Box, Cone).
- Màu sắc: Chọn màu khối.
- ➕ Tạo Khối: Sinh khối mới theo cấu hình.

📦 Khối Mẫu:
- Danh sách các khối đặc biệt (Heart, Torus, Spiral, Mobius, Paraboloid...).
- Chọn để hiển thị/ẩn các khối trong scene.
`
  );
};

// Thêm nút Trợ giúp vào GUI
guiSample.add(sampleParams, "help").name("❓ Trợ giúp");


// ----- Góc nhìn -----
const viewParams = { 
  view: "default",
  help: () => {
    alert(
`📖 Hướng dẫn sử dụng tab Góc Nhìn:

👁️ Chọn Góc Nhìn:
- 3D Tự Do: Bạn có thể xoay, kéo thả camera để quan sát mô hình từ mọi góc.
- XY (Trên): Nhìn từ phía trên xuống trục XY.
- YZ (Trái): Nhìn từ bên trái theo trục YZ.
- XZ (Trước): Nhìn từ phía trước theo trục XZ.

👉 Dùng để nhanh chóng chuyển đổi góc camera khi quan sát mô hình.`
    );
  }
};

const guiView = guiHelper.addTab("Góc Nhìn", 250, { icon: "👁️", label: "Góc Nhìn" });

guiView.add(viewParams, "view", {
  "3D Tự Do": "default",
  "XY (Trên)": "xy",
  "YZ (Trái)": "yz",
  "XZ (Trước)": "xz"
}).name("Chọn góc nhìn")
  .onChange(val => setViewDirection(val));

// 🔹 Nút Trợ giúp
guiView.add(viewParams, "help").name("❓ Trợ giúp");


// ----- Ánh sáng -----
const lightParams = {
  lightMode: "soft",
  materialType: "standard",
  textureImage: null
};

const guiLight     = guiHelper.addTab("Ánh Sáng", 300, { icon: "💡", label: "Ánh Sáng" });

// Chế độ ánh sáng
guiLight.add(lightParams, "lightMode", {
  "Mềm": "soft",
  "Mạnh": "strong",
  "Chỉ khung": "wireframe"
}).name("Chế độ ánh sáng")
  .onChange(updateLightMode);

// Loại vật liệu
guiLight.add(lightParams, "materialType", {
  "Standard": "standard",
  "Phong": "phong",
  "Lambert": "lambert",
  "Toon": "toon",
  "Texture": "texture"
}).name("Loại vật liệu")
  .onChange(updateLightMode);

// Hidden file input cho Texture
const hiddenTextureInput = document.createElement("input");
hiddenTextureInput.type = "file";
hiddenTextureInput.accept = "image/*";
hiddenTextureInput.style.display = "none";
document.body.appendChild(hiddenTextureInput);

hiddenTextureInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    lightParams.textureImage = ev.target.result;
    updateLightMode();
  };
  reader.readAsDataURL(file);
});

// Nút chọn ảnh
guiLight.add({ chọnẢnh: () => hiddenTextureInput.click() }, "chọnẢnh")
  .name("📂 Chọn Texture");

// ----- Thêm Trợ giúp -----
lightParams.help = () => {
  alert(
`💡 Hướng dẫn sử dụng tab Ánh Sáng:

🔆 Chế độ ánh sáng:
- Mềm: ánh sáng dịu, bề mặt mịn.
- Mạnh: ánh sáng gắt, dùng flatShading để thấy rõ cạnh.
- Chỉ khung: hiển thị wireframe (khung lưới).

🎨 Loại vật liệu:
- Standard: vật liệu chuẩn PBR (có độ bóng, nhám).
- Phong: vật liệu Phong (bóng sáng mạnh).
- Lambert: vật liệu Lambert (mềm, ít bóng).
- Toon: vật liệu hoạt hình (cắt sáng kiểu toon-shading).
- Texture: dùng ảnh texture tùy chọn.

📂 Chọn Texture:
- Nhấn nút để tải ảnh từ máy.
- Ảnh sẽ được dùng làm texture trên bề mặt khối.

👉 Gợi ý:
- Kết hợp chế độ ánh sáng + loại vật liệu để quan sát hiệu ứng khác nhau.
- Dùng wireframe để kiểm tra cấu trúc lưới.
- Với Texture, hãy chọn ảnh sáng/tối rõ ràng để thấy rõ chi tiết.
`
  );
};

// Thêm vào GUI
guiLight.add(lightParams, "help").name("❓ Trợ giúp");


// -------- Update ánh sáng + vật liệu --------
function updateLightMode() {
  const mode = lightParams.lightMode;
  const materialType = lightParams.materialType;

  if (!surfaceMesh) return;

  let newMaterial;
  const texLoader = new THREE.TextureLoader();

  switch (materialType) {
    case 'phong':
      newMaterial = new THREE.MeshPhongMaterial({
        color: 0xffaa00,
        shininess: 100,
        side: THREE.DoubleSide
      });
      break;

    case 'lambert':
      newMaterial = new THREE.MeshLambertMaterial({
        color: 0x99ccff,
        side: THREE.DoubleSide
      });
      break;

    case 'toon':
      newMaterial = new THREE.MeshToonMaterial({
        color: 0xff99cc,
        gradientMap: null,
        side: THREE.DoubleSide
      });
      break;

    case 'texture':
      if (lightParams.textureImage) {
        const img = new Image();
        img.onload = function () {
          const texture = new THREE.Texture(img);
          texture.needsUpdate = true;

          const texturedMat = new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 0.2,
            roughness: mode === 'soft' ? 0.9 : 0.3,
            flatShading: mode === 'strong',
            side: THREE.DoubleSide
          });

          applyMaterial(texturedMat);
        };
        img.src = lightParams.textureImage;
        return; // ⚠️ không chạy tiếp
      } else {
        console.warn("Chưa chọn ảnh texture.");
        return;
      }

    case 'standard':
    default:
      const baseTexture = texLoader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
      newMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        map: baseTexture,
        metalness: 0.5,
        roughness: mode === 'soft' ? 0.9 : 0.3,
        flatShading: mode === 'strong',
        side: THREE.DoubleSide
      });
  }

  // Wireframe override
  if (mode === 'wireframe') {
    newMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true
    });
  }

  applyMaterial(newMaterial);
}

function applyMaterial(material) {
  if (surfaceMesh instanceof THREE.Mesh) {
    surfaceMesh.material.dispose();
    surfaceMesh.material = material;
  }
}



// ----- History -----
const historyParams = {
  entries: [], // 👈 mảng lưu lịch sử

  addEntry: (text) => {
    historyParams.entries.push(text);
    updateHistoryBox();
  },

  clear: () => {
    historyParams.entries = [];
    updateHistoryBox();
  },

  help: () => {
    alert(
`📖 Hướng dẫn sử dụng tab Lịch Sử:

📜 Mục đích:
- Lưu lại các hành động hoặc sự kiện quan trọng trong quá trình làm việc.

✅ Box lịch sử:
- Hiển thị danh sách các sự kiện đã lưu.
- Tự động đánh số thứ tự cho từng dòng.

🗑️ Xóa Lịch Sử:
- Dùng để xóa toàn bộ các sự kiện đã lưu, đưa về trạng thái trống.

🛠️ Lưu sự kiện mới:
- Gọi hàm historyParams.addEntry("Nội dung sự kiện") để thêm vào lịch sử.

👉 Tính năng này giúp bạn theo dõi và ghi nhớ các bước thao tác đã thực hiện.`
    );
  }
};

const guiHistory = guiHelper.addTab("Lịch Sử", 250, { icon: "📜", label: "Lịch Sử" });

// ✅ Tạo box hiển thị trong tab lịch sử
const historyWrapper = document.createElement("div");
historyWrapper.style.width = "100%";
historyWrapper.style.minHeight = "150px";
historyWrapper.style.padding = "10px";
historyWrapper.style.marginTop = "8px";
historyWrapper.style.background = "#111";
historyWrapper.style.color = "#0f0";
historyWrapper.style.fontFamily = "monospace";
historyWrapper.style.fontSize = "12px";
historyWrapper.style.borderRadius = "6px";
historyWrapper.style.overflowY = "auto";

const historyBox = document.createElement("pre");
historyBox.style.whiteSpace = "pre-wrap";
historyBox.style.wordBreak = "break-word";
historyBox.textContent = "📜 Chưa có lịch sử.";
historyWrapper.appendChild(historyBox);

guiHistory.domElement.appendChild(historyWrapper);

// ✅ Hàm cập nhật lịch sử trong box
function updateHistoryBox() {
  if (historyParams.entries.length === 0) {
    historyBox.textContent = "📜 Chưa có lịch sử.";
  } else {
    historyBox.textContent = historyParams.entries.map((e, i) => `${i + 1}. ${e}`).join("\n");
  }
}

// ✅ Thêm nút xóa lịch sử
guiHistory.add(historyParams, "clear").name("🗑️ Xóa Lịch Sử");

// ✅ Thêm nút trợ giúp
guiHistory.add(historyParams, "help").name("❓ Trợ giúp");


// ----- Export -----
const exportParams = {
savePNG: () => saveAsPNG(),
saveJPG: () => saveAsJPG(),
saveGLTF: () => saveAsGLTF()
};

const guiExport    = guiHelper.addTab("Xuất Ảnh", 250, { icon: "📤", label: "Xuất Ảnh" });

guiExport.add(exportParams, "savePNG").name("💾 Xuất PNG");
guiExport.add(exportParams, "saveJPG").name("💾 Xuất JPG");
guiExport.add(exportParams, "saveGLTF").name("💾 Xuất GLTF");
guiExport.add({
  help: () => {
    alert("📤 Hướng dẫn Xuất Ảnh:\n\n" +
          "💾 Xuất PNG: Lưu ảnh canvas hiện tại dưới dạng file PNG.\n" +
          "💾 Xuất JPG: Lưu ảnh canvas hiện tại dưới dạng file JPG.\n" +
          "💾 Xuất GLTF: Lưu mô hình 3D hiện tại ở định dạng GLTF để dùng trong Blender/Three.js.");
  }
}, "help").name("❓ Trợ giúp");

// ----- Tích Phân -----
const integralParams = {
  // 1 biến
  func1D: "Math.sin(x)",   // hàm mặc định
  a: 0,
  b: Math.PI,
  n: 100,
  method: "midpoint",
  showSteps: false,
  compute1D: () => computeIntegral1D(),
  result1D: "Chưa tính",
  // 2 biến
  func2D: "Math.sin(x) * Math.cos(y)",
  ax: 0,
  bx: Math.PI,
  ay: 0,
  by: Math.PI,
  nx: 30,
  ny: 30,
  colormap: "viridis",
  compute2D: () => computeIntegral2D(),
  result2D: "Chưa tính"
};

const guiIntegral  = guiHelper.addTab("Tích Phân", 350, { icon: "∫", label: "Tích Phân" });

// --- Tích phân 1 biến ---
// --- Tích phân 1 biến ---
const f1 = guiIntegral.addFolder("📈 1 Biến (∫ f(x) dx)");
f1.add(integralParams, "func1D").name("Hàm f(x)");
f1.add(integralParams, "a", -10, 10, 0.1).name("Cận a");
f1.add(integralParams, "b", -10, 10, 0.1).name("Cận b");
f1.add(integralParams, "n", 10, 1000, 10).name("Số điểm n");
f1.add(integralParams, "method", ["midpoint", "trapezoidal", "simpson"]).name("Phương pháp");
f1.add(integralParams, "showSteps").name("Hiện từng bước");
f1.add(integralParams, "result1D").name("Kết quả").listen();

// ✅ Tạo canvas trong folder f1 nhưng ẩn đi
const canvasWrapper1D = document.createElement("div");
canvasWrapper1D.style.width = "100%";
canvasWrapper1D.style.height = "250px";
canvasWrapper1D.style.padding = "10px";
canvasWrapper1D.style.display = "none";   // 👈 ẩn mặc định

const canvasIntegral = document.createElement("canvas");
canvasIntegral.id = "integralGraph1D";
canvasIntegral.width = 320;
canvasIntegral.height = 240;

canvasWrapper1D.appendChild(canvasIntegral);
f1.domElement.appendChild(canvasWrapper1D);

// ✅ Thêm nút compute và hiện canvas khi bấm
f1.add(integralParams, "compute1D").name("▶️ Tính 1 Biến").onChange(() => {
  canvasWrapper1D.style.display = "block";   // 👈 hiện canvas
  // integralParams.compute1D();                // gọi hàm tính
});



// --- Hàm tính & vẽ ---
function computeIntegral1D() {
  const formula = integralParams.func1D.replace(/^f\(x\)\s*=\s*/, '');
  const a = (typeof integralParams.a === "string") ? math.evaluate(integralParams.a) : integralParams.a;
  const b = (typeof integralParams.b === "string") ? math.evaluate(integralParams.b) : integralParams.b;
  const steps = parseInt(integralParams.n);
  const method = integralParams.method;
  const showSteps = integralParams.showSteps;

  const expr = math.compile(formula);

  let area = 0;
  const dx = (b - a) / steps;
  const xVals = [], yVals = [], barData = [];

  if (method === "midpoint") {
    for (let i = 0; i < steps; i++) {
      const x = a + (i + 0.5) * dx;
      const y = expr.evaluate({ x });
      const slice = y * dx;
      area += slice;
      xVals.push(x);
      yVals.push(y);
      barData.push({ x, y });
    }
  } else if (method === "trapezoidal") {
    for (let i = 0; i <= steps; i++) {
      const x = a + i * dx;
      const y = expr.evaluate({ x });
      xVals.push(x);
      yVals.push(y);
      barData.push({ x, y });
      if (i === 0 || i === steps) area += y / 2;
      else area += y;
    }
    area *= dx;
  } else if (method === "simpson" && steps % 2 === 0) {
    for (let i = 0; i <= steps; i++) {
      const x = a + i * dx;
      const y = expr.evaluate({ x });
      xVals.push(x);
      yVals.push(y);
      barData.push({ x, y });
      if (i === 0 || i === steps) area += y;
      else if (i % 2 === 0) area += 2 * y;
      else area += 4 * y;
    }
    area *= dx / 3;
  } else {
    alert("Simpson's Rule cần số khoảng n chẵn.");
    return;
  }

  // 👉 update kết quả trong GUI
  integralParams.result1D = `≈ ${area.toFixed(6)}`;
// 👉 lưu vào lịch sử (dùng historyParams thay vì historyData)
const historyEntry = `Hàm: ${formula}, [${a}, ${b}], n=${steps}, phương pháp=${method}, KQ=${area.toFixed(6)}`;
historyParams.addEntry(historyEntry);
  // 👉 vẽ bằng Chart.js
  const ctx = canvasIntegral.getContext("2d");
  if (window.chartIntegral1D) window.chartIntegral1D.destroy();

  window.chartIntegral1D = new Chart(ctx, {
    type: "bar",
    data: {
      datasets: [
        {
          type: "line",
          label: "f(x)",
          data: xVals.map((x, i) => ({ x, y: yVals[i] })),
          borderColor: "blue",
          backgroundColor: "rgba(59,130,246,0.2)",
          tension: 0.3,
          fill: true,
          parsing: false
        },
        {
          type: "bar",
          label: "Diện tích lát",
          data: barData,
          backgroundColor: "rgba(34,197,94,0.6)",
          borderWidth: 0,
          parsing: false,
          barThickness: Math.max(1, 300 / steps)
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { type: "linear", title: { display: true, text: "x" } },
        y: { title: { display: true, text: "f(x)" } }
      }
    }
  });
}
// ----- Tích Phân 2D (dùng integralParams) -----
const f2 = guiIntegral.addFolder("📊 2 Biến (∬ f(x,y) dxdy)");
f2.add(integralParams, "func2D").name("Hàm f(x,y)");
f2.add(integralParams, "ax", -10, 10, 0.1).name("X min");
f2.add(integralParams, "bx", -10, 10, 0.1).name("X max");
f2.add(integralParams, "ay", -10, 10, 0.1).name("Y min");
f2.add(integralParams, "by", -10, 10, 0.1).name("Y max");
f2.add(integralParams, "nx", 10, 200, 1).name("Nx");
f2.add(integralParams, "ny", 10, 200, 1).name("Ny");
f2.add(integralParams, "colormap", ["viridis","plasma","turbo","gray"])
  .name("Colormap")
  .onChange(() => computeIntegral2D());

  guiIntegral.add({
    help: () => {
      alert("∫ Hướng dẫn sử dụng Tích Phân:\n\n" +
            "📈 1 Biến:\n" +
            "- Nhập hàm f(x), ví dụ: Math.sin(x)\n" +
            "- Chọn cận a, b và số điểm n để chia nhỏ.\n" +
            "- Phương pháp: midpoint (hình chữ nhật), trapezoidal (hình thang), simpson.\n" +
            "- Bấm ▶️ Tính 1 Biến để xem kết quả và đồ thị.\n\n" +
            "📊 2 Biến:\n" +
            "- Nhập hàm f(x,y), ví dụ: Math.sin(x)*Math.cos(y)\n" +
            "- Chọn miền X: [ax, bx], Y: [ay, by]\n" +
            "- Nx, Ny: số điểm chia theo X và Y.\n" +
            "- Colormap: chọn bảng màu hiển thị heatmap.\n" +
            "- Bấm ▶️ Tính 2 Biến để xem kết quả, heatmap và mô hình 3D.");
    }
  }, "help").name("❓ Trợ giúp");
  
// ✅ Tạo canvas heatmap nhưng ẩn đi
const canvasWrapper2D = document.createElement("div");
canvasWrapper2D.style.width = "100%";
canvasWrapper2D.style.height = "250px";
canvasWrapper2D.style.padding = "10px";
canvasWrapper2D.style.display = "none";   // 👈 ẩn mặc định

const canvasHeatmap2D = document.createElement("canvas");
canvasHeatmap2D.id = "integralHeatmap2D";
canvasHeatmap2D.width = 320;
canvasHeatmap2D.height = 240;

canvasWrapper2D.appendChild(canvasHeatmap2D);
f2.domElement.appendChild(canvasWrapper2D);

const resultCtrl = f2.add(integralParams, "result2D").name("Kết quả ∬").listen();

// ✅ Nút compute 2D: hiện canvas + chạy tính toán
f2.add(integralParams, "compute2D").name("▶️ Tính 2 Biến").onChange(() => {
  canvasWrapper2D.style.display = "block";  // 👈 hiện canvas
  // integralParams.compute2D();               // gọi hàm tính
});

// Tính tích phân 2D đơn giản bằng phương pháp hình chữ nhật
function computeIntegral2D() {
  const formula = (typeof integralParams.func2D === "string")
    ? integralParams.func2D.replace(/^f\(x,y\)\s*=\s*/, '')
    : String(integralParams.func2D);

  const xMin = parseFloat(integralParams.ax);
  const xMax = parseFloat(integralParams.bx);
  const yMin = parseFloat(integralParams.ay);
  const yMax = parseFloat(integralParams.by);
  const stepsX = parseInt(integralParams.nx);
  const stepsY = parseInt(integralParams.ny);
  const colormapName = integralParams.colormap || "viridis";

  const expr = math.compile(formula);
  const dx = (xMax - xMin) / stepsX;
  const dy = (yMax - yMin) / stepsY;

  let sum = 0;
  for (let i = 0; i <= stepsX; i++) {
    const x = xMin + i * dx;
    for (let j = 0; j <= stepsY; j++) {
      const y = yMin + j * dy;
      const val = expr.evaluate({ x, y });
      if (isFinite(val)) sum += val * dx * dy;
    }
  }

  integralParams.result2D = `≈ ${sum.toFixed(6)}`; // cập nhật GUI tự động nhờ .listen()
  
// --- ghi lịch sử ---
const timestamp = new Date().toLocaleTimeString();
const entry = `[${timestamp}] ∫∫ f(x,y) dxdy = ${sum.toFixed(6)} | f(x,y)=${formula}, [${xMin},${xMax}]×[${yMin},${yMax}] steps=(${stepsX},${stepsY})`;
historyParams.addEntry(entry);

  // vẽ heatmap và 3D surface bằng các hàm đã viết, truyền tham số vào
  draw2DHeatmap(formula, xMin, xMax, yMin, yMax, stepsX, stepsY, colormapName);
  visualizeIntegral2D(formula, xMin, xMax, yMin, yMax, stepsX, stepsY);
}

function draw2DHeatmap(formula, xMin, xMax, yMin, yMax, stepsX, stepsY, colormapName = "viridis") {
  const ctx = document.getElementById("integralHeatmap2D")?.getContext("2d");
  if (!ctx) return;

  const expr = math.compile(formula);
  const dx = (xMax - xMin) / stepsX;
  const dy = (yMax - yMin) / stepsY;

  const data = [];
  let zMin = Infinity, zMax = -Infinity;

  for (let i = 0; i < stepsX; i++) {
    const x = xMin + i * dx + dx / 2;
    for (let j = 0; j < stepsY; j++) {
      const y = yMin + j * dy + dy / 2;
      try {
        const z = expr.evaluate({ x, y });
        if (!isFinite(z)) continue;
        data.push({ x, y, v: z });
        zMin = Math.min(zMin, z);
        zMax = Math.max(zMax, z);
      } catch (e) {
        console.warn(`Lỗi tại (${x},${y}):`, e.message);
      }
    }
  }

  if (window.heatmap2DChart) window.heatmap2DChart.destroy();

  window.heatmap2DChart = new Chart(ctx, {
    type: 'matrix',
    data: {
      datasets: [{
        label: 'f(x,y)',
        data: data,
        backgroundColor(ctx) {
          const point = ctx.dataset?.data?.[ctx.dataIndex];
          if (!point || typeof point.v !== "number") return "rgba(0,0,0,0)";
          const normalized = (point.v - zMin) / (zMax - zMin || 1);
          return getColorFromMap(normalized, colormapName);
        },

        width(ctx) {
          const area = ctx.chart.chartArea;
          if (!area) return 10;
          return area.width / stepsX;
        },
        height(ctx) {
          const area = ctx.chart.chartArea;
          if (!area) return 10;
          return area.height / stepsY;
        }
      }]
    },
    options: {
      maintainAspectRatio: true,
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            title: () => '',
            label: ctx => {
              const d = ctx.raw;
              return `x: ${d.x.toFixed(2)}, y: ${d.y.toFixed(2)}, z: ${d.v.toFixed(2)}`;
            }
          }
        },
        legend: { display: false }
      },
      scales: {
        x: {
          type: 'linear',
          min: xMin,
          max: xMax,
          title: { display: true, text: 'x' }
        },
        y: {
          type: 'linear',
          min: yMin,
          max: yMax,
          title: { display: true, text: 'y' }
        }
      }
    }
  });
}

function getColorFromMap(t, mapName = "viridis") {
  t = Math.min(1, Math.max(0, t)); // đảm bảo t ∈ [0,1]

  // Các colormap phổ biến
  switch (mapName) {
    case 'plasma':
      return plasmaColorMap(t);
    case 'turbo':
      return turboColorMap(t);
    case 'gray':
      const g = Math.floor(255 * t);
      return `rgba(${g},${g},${g},1)`;
    case 'viridis':
    default:
      return viridisColorMap(t);
  }
}

// Colormap viridis (giảm nhẹ để phù hợp)
function viridisColorMap(t) {
  const r = Math.floor(255 * Math.max(0, Math.min(1, 0.267 + 1.5 * t)));
  const g = Math.floor(255 * Math.max(0, Math.min(1, 0.004 + 2.0 * t)));
  const b = Math.floor(255 * Math.max(0, Math.min(1, 0.329 + 1.2 * t)));
  return `rgba(${r},${g},${b},1)`;
}

function plasmaColorMap(t) {
  const r = Math.floor(255 * Math.min(1, Math.max(0, 1.5 * t)));
  const g = Math.floor(255 * Math.abs(Math.sin(t * Math.PI)));
  const b = Math.floor(255 * (1 - t));
  return `rgba(${r},${g},${b},1)`;
}

function turboColorMap(t) {
  // https://ai.googleblog.com/2019/08/turbo-improved-rainbow-colormap-for.html
  const r = Math.floor(255 * Math.max(0, Math.min(1, 1.0 - Math.abs(4.0 * (t - 0.75)))));
  const g = Math.floor(255 * Math.max(0, Math.min(1, 1.0 - Math.abs(4.0 * (t - 0.5)))));
  const b = Math.floor(255 * Math.max(0, Math.min(1, 1.0 - Math.abs(4.0 * (t - 0.25)))));
  return `rgba(${r},${g},${b},1)`;
}

function visualizeIntegral2D(formula, xMin, xMax, yMin, yMax, stepsX, stepsY) {
  const dx = (xMax - xMin) / stepsX;
  const dy = (yMax - yMin) / stepsY;
  const expr = math.compile(formula);

  function safeEval(x, y) {
    try {
      const z = expr.evaluate({ x, y });
      return (isFinite(z) ? z : null);
    } catch {
      return null;
    }
  }

  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const colors = [];
  const color = new THREE.Color();
  const z0 = 0; // mặt phẳng đáy

  // ===== Mặt trên (surface) + tường =====
  for (let i = 0; i < stepsX; i++) {
    for (let j = 0; j < stepsY; j++) {
      const x1 = xMin + i * dx;
      const y1 = yMin + j * dy;
      const x2 = xMin + (i + 1) * dx;
      const y2 = yMin + (j + 1) * dy;

      const z11 = safeEval(x1, y1);
      const z12 = safeEval(x1, y2);
      const z21 = safeEval(x2, y1);
      const z22 = safeEval(x2, y2);

      if (z11 == null || z12 == null || z21 == null || z22 == null) {
        continue; // bỏ qua ô lỗi
      }

      // --- Mặt trên (surface) ---
      vertices.push(x1, y1, z11, x2, y1, z21, x1, y2, z12);
      vertices.push(x2, y1, z21, x2, y2, z22, x1, y2, z12);

      const avgZ = (z11 + z12 + z21 + z22) / 4;
      for (let k = 0; k < 6; k++) {
        color.setHSL(0.6 - 0.6 * (avgZ / 10), 1.0, 0.5);
        colors.push(color.r, color.g, color.b);
      }

      // --- Tường đứng (kéo xuống z=0) ---

      // cạnh theo x (y = y1)
      vertices.push(x1, y1, z0, x1, y1, z11, x2, y1, z21);
      vertices.push(x1, y1, z0, x2, y1, z21, x2, y1, z0);

      // cạnh theo x (y = y2)
      vertices.push(x1, y2, z0, x1, y2, z12, x2, y2, z22);
      vertices.push(x1, y2, z0, x2, y2, z22, x2, y2, z0);

      // cạnh theo y (x = x1)
      vertices.push(x1, y1, z0, x1, y2, z12, x1, y1, z11);
      vertices.push(x1, y1, z0, x1, y2, z0, x1, y2, z12);

      // cạnh theo y (x = x2)
      vertices.push(x2, y1, z0, x2, y2, z22, x2, y1, z21);
      vertices.push(x2, y1, z0, x2, y2, z0, x2, y2, z22);

      // màu tường
      for (let k = 0; k < 24; k++) {
        color.setHSL(0.6 - 0.6 * (avgZ / 10), 1.0, 0.3);
        colors.push(color.r, color.g, color.b);
      }
    }
  }

  // ===== Mặt đáy (z=0) =====
  for (let i = 0; i < stepsX; i++) {
    for (let j = 0; j < stepsY; j++) {
      const x1 = xMin + i * dx;
      const y1 = yMin + j * dy;
      const x2 = xMin + (i + 1) * dx;
      const y2 = yMin + (j + 1) * dy;

      vertices.push(x1, y1, z0, x2, y1, z0, x1, y2, z0);
      vertices.push(x2, y1, z0, x2, y2, z0, x1, y2, z0);

      for (let k = 0; k < 6; k++) {
        color.setRGB(0.2, 0.2, 0.2);
        colors.push(color.r, color.g, color.b);
      }
    }
  }

  // ===== Tạo mesh =====
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = "integralSurface";

  const old = scene.getObjectByName("integralSurface");
  if (old) scene.remove(old);
  scene.add(mesh);

  // ===== Cập nhật camera =====
  if (camera && controls) {
    const centerX = (xMin + xMax) / 2;
    const centerY = (yMin + yMax) / 2;
    let zSum = 0;
    for (let k = 2; k < vertices.length; k += 3) {
      zSum += vertices[k];
    }
    const centerZ = zSum / (vertices.length / 3);
    controls.target.set(centerX, centerY, centerZ);
    camera.position.set(centerX, centerY - (xMax - xMin) * 1.5, centerZ + 5);
    controls.update();
  }
}

// ----- Fourier -----
const fourierParams = {
  func: "Math.sin(x)",       // hàm gốc f(x)
  terms: 10,                 // số số hạng Fourier
  xmin: 0,
  xmax: 2 * Math.PI,
  nPoints: 200,              // số điểm vẽ đồ thị
  showOriginal: true,        // hiển thị hàm gốc
  showApprox: true,          // hiển thị xấp xỉ Fourier
  result: "",                // kết quả text (chuỗi Fourier)
  
  compute: () => computeFourier()
};
const guiFourier = guiHelper.addTab("🔶 Fourier", 350, { icon: "🔶", label: "Chuỗi Fourier" });

// Input hàm
guiFourier.add(fourierParams, "func").name("f(x)");

// Số hạng Fourier
guiFourier.add(fourierParams, "terms", 1, 50, 1).name("Số hạng N");

// Khoảng x
guiFourier.add(fourierParams, "xmin", -10, 10, 0.1).name("X min");
guiFourier.add(fourierParams, "xmax", -10, 10, 0.1).name("X max");

// Số điểm vẽ
guiFourier.add(fourierParams, "nPoints", 50, 1000, 1).name("Số điểm");

// Checkbox hiển thị
guiFourier.add(fourierParams, "showOriginal").name("Hiển thị hàm gốc");
guiFourier.add(fourierParams, "showApprox").name("Hiển thị xấp xỉ Fourier");

// Nút tính toán
guiFourier.add(fourierParams, "compute").name("▶️ Tính Fourier");

// Kết quả
const resultCtrlFourier = guiFourier.add(fourierParams, "result").name("Chuỗi Fourier").listen();
function computeFourier() {
  const formula = fourierParams.func;
  const N = parseInt(fourierParams.terms);
  const xMin = parseFloat(fourierParams.xmin);
  const xMax = parseFloat(fourierParams.xmax);
  const nPoints = parseInt(fourierParams.nPoints);

  const dx = (xMax - xMin)/(nPoints-1);
  const xs = [];
  const fOrig = [];
  const fApprox = [];

  const expr = math.compile(formula);

  for (let i=0; i<nPoints; i++) {
    const x = xMin + i*dx;
    xs.push(x);
    try { fOrig.push(expr.evaluate({x})); } catch { fOrig.push(0); }
  }

  const L = (xMax-xMin)/2;
  const a0 = (1/L) * xs.reduce((acc, x) => acc + expr.evaluate({x}),0)*dx;
  const a=[], b=[];
  for (let n=1; n<=N; n++) {
    let an=0, bn=0;
    for (let i=0; i<nPoints; i++) {
      const x = xs[i];
      const fx = expr.evaluate({x});
      an += fx * Math.cos(n*Math.PI*(x-xMin)/L);
      bn += fx * Math.sin(n*Math.PI*(x-xMin)/L);
    }
    a.push(an*dx/L);
    b.push(bn*dx/L);
  }

  for (let i=0;i<nPoints;i++) {
    const x = xs[i];
    let sum = a0/2;
    for (let n=1;n<=N;n++) sum += a[n-1]*Math.cos(n*Math.PI*(x-xMin)/L) + b[n-1]*Math.sin(n*Math.PI*(x-xMin)/L);
    fApprox.push(sum);
  }

  fourierParams.result = `f(x) ≈ a0/2 + Σ(1→${N}) [a_n cos(nπx/L) + b_n sin(nπx/L)]`;

  // Vẽ 2D chart
  drawFourierChart(xs, fOrig, fApprox);

  // Vẽ 3D surface
  visualizeFourier3D(xs, fApprox);
}

const canvasFourier = document.createElement("canvas");
canvasFourier.id = "fourierCanvas";
canvasFourier.width = 600;
canvasFourier.height = 300;
guiFourier.domElement.appendChild(canvasFourier);

function drawFourierChart(xs, fOrig, fApprox) {
  if (window.fourierChart) window.fourierChart.destroy();

  const datasets = [];
  if (fourierParams.showOriginal) {
    datasets.push({
      label: 'Hàm gốc',
      data: xs.map((x,i)=>({x, y:fOrig[i]})),
      borderColor: 'blue',
      fill: false,
      tension: 0.1
    });
  }
  if (fourierParams.showApprox) {
    datasets.push({
      label: 'Xấp xỉ Fourier',
      data: xs.map((x,i)=>({x, y:fApprox[i]})),
      borderColor: 'red',
      fill: false,
      tension: 0.1
    });
  }

  const ctx = document.getElementById("fourierCanvas").getContext("2d");
  window.fourierChart = new Chart(ctx, {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: {
        x: { type: 'linear', title: { display: true, text: 'x' } },
        y: { title: { display: true, text: 'f(x)' } }
      }
    }
  });
}
function visualizeFourier3D(xs, fApprox) {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const colors = [];
  const color = new THREE.Color();

  const y0 = -0.5; // bề rộng mesh theo Y
  const y1 = 0.5;

  for (let i = 0; i < xs.length - 1; i++) {
    const x1 = xs[i], x2 = xs[i+1];
    const z1 = fApprox[i], z2 = fApprox[i+1];

    // Tạo 2 tam giác (quad) giữa 2 điểm liên tiếp
    vertices.push(x1, y0, z1, x2, y0, z2, x1, y1, z1);
    vertices.push(x2, y0, z2, x2, y1, z2, x1, y1, z1);

    // màu gradient theo Z
    for (let k = 0; k < 6; k++) {
      const t = (z1 + z2)/2; // trung bình 2 điểm
      color.setHSL(0.6 - 0.6 * (t / 10), 1.0, 0.5);
      colors.push(color.r, color.g, color.b);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = "fourierSurface";

  const old = scene.getObjectByName("fourierSurface");
  if (old) scene.remove(old);
  scene.add(mesh);

  // cập nhật camera/controls
  if (camera && controls) {
    const centerX = (xs[0]+xs[xs.length-1])/2;
    let zSum = 0;
    for (let k = 2; k < vertices.length; k += 3) zSum += vertices[k];
    const centerZ = zSum / (vertices.length/3);
    controls.target.set(centerX, 0, centerZ);
    camera.position.set(centerX, - (xs[xs.length-1]-xs[0]), centerZ + 5);
    controls.update();
  }
}
// ----- Fourier 2D -----
const fourier2DParams = {
  func: "Math.sin(x)*Math.cos(2*y)", // hàm 2 biến f(x,y)
  termsX: 5,    // số hạng Fourier theo X
  termsY: 5,    // số hạng Fourier theo Y
  xmin: 0, xmax: 2*Math.PI,
  ymin: 0, ymax: 2*Math.PI,
  nPoints: 50,  // số điểm trên mỗi trục
  showOriginal: true,
  showApprox: true,
  result: "",
  compute: () => computeFourier2D()
};

const guiFourier2D = guiHelper.addTab("🔷 Fourier 2D", 350, { icon:"🔷", label:"Chuỗi Fourier 2D" });
guiFourier2D.add(fourier2DParams,"func").name("f(x,y)");
guiFourier2D.add(fourier2DParams,"termsX",1,20,1).name("Số hạng X");
guiFourier2D.add(fourier2DParams,"termsY",1,20,1).name("Số hạng Y");
guiFourier2D.add(fourier2DParams,"xmin",-10,10,0.1).name("X min");
guiFourier2D.add(fourier2DParams,"xmax",-10,10,0.1).name("X max");
guiFourier2D.add(fourier2DParams,"ymin",-10,10,0.1).name("Y min");
guiFourier2D.add(fourier2DParams,"ymax",-10,10,0.1).name("Y max");
guiFourier2D.add(fourier2DParams,"nPoints",10,200,1).name("Số điểm");
guiFourier2D.add(fourier2DParams,"showOriginal").name("Hiển thị gốc");
guiFourier2D.add(fourier2DParams,"showApprox").name("Hiển thị xấp xỉ");
guiFourier2D.add(fourier2DParams,"compute").name("▶️ Tính Fourier 2D");
guiFourier2D.add(fourier2DParams,"result").name("Chuỗi Fourier 2D").listen();

function computeFourier2D() {
  const formula = fourier2DParams.func;
  const Nx = parseInt(fourier2DParams.termsX);
  const Ny = parseInt(fourier2DParams.termsY);
  const nPoints = parseInt(fourier2DParams.nPoints);
  const xMin = parseFloat(fourier2DParams.xmin);
  const xMax = parseFloat(fourier2DParams.xmax);
  const yMin = parseFloat(fourier2DParams.ymin);
  const yMax = parseFloat(fourier2DParams.ymax);

  const dx = (xMax-xMin)/(nPoints-1);
  const dy = (yMax-yMin)/(nPoints-1);

  const xs=[], ys=[], fOrig=[], fApprox=[];
  const expr = math.compile(formula);

  for (let i=0;i<nPoints;i++) xs.push(xMin+i*dx);
  for (let j=0;j<nPoints;j++) ys.push(yMin+j*dy);

  // Tạo lưới 2D
  for (let i=0;i<nPoints;i++) {
    fOrig[i] = [];
    fApprox[i] = [];
    for (let j=0;j<nPoints;j++) {
      const x = xs[i], y = ys[j];
      fOrig[i][j] = expr.evaluate({x,y});
      fApprox[i][j] = 0; // khởi tạo xấp xỉ
    }
  }

  // Fourier 2D xấp xỉ bằng Nx * Ny số hạng
  const Lx = (xMax-xMin)/2, Ly=(yMax-yMin)/2;
  for (let n=0;n<Nx;n++) {
    for (let m=0;m<Ny;m++) {
      // Tính hệ số anm = 4/Lx/Ly ∫∫ f(x,y) cos(nπx/Lx) cos(mπy/Ly) dxdy (giả sử chẵn)
      let sum=0;
      for (let i=0;i<nPoints;i++) {
        for (let j=0;j<nPoints;j++) {
          sum += fOrig[i][j]*Math.cos(n*Math.PI*(xs[i]-xMin)/Lx)*Math.cos(m*Math.PI*(ys[j]-yMin)/Ly);
        }
      }
      const anm = (4/(Lx*Ly)) * sum * dx*dy; // bỏ chia nPoints*nPoints
      for (let i=0;i<nPoints;i++) {
        for (let j=0;j<nPoints;j++) {
          fApprox[i][j] += anm * Math.cos(n*Math.PI*(xs[i]-xMin)/Lx) * Math.cos(m*Math.PI*(ys[j]-yMin)/Ly);
        }
      }
    }
  }

  fourier2DParams.result = `f(x,y) ≈ Σ(n=0→${Nx}) Σ(m=0→${Ny}) a_nm cos(nπx/Lx) cos(mπy/Ly)`;

  drawFourier2DSurface(xs, ys, fOrig, fApprox);
}

// Vẽ surface 3D
function drawFourier2DSurface(xs, ys, fOrig, fApprox) {
  const geometry = new THREE.BufferGeometry();
  const vertices = [], colors=[];
  const color = new THREE.Color();
  const n = xs.length;

  for (let i=0;i<n-1;i++){
    for (let j=0;j<n-1;j++){
      const x1=xs[i], x2=xs[i+1], y1=ys[j], y2=ys[j+1];
      const z11 = fApprox[i][j], z12=fApprox[i][j+1], z21=fApprox[i+1][j], z22=fApprox[i+1][j+1];

      // 2 tam giác
      vertices.push(x1,y1,z11, x2,y1,z21, x1,y2,z12);
      vertices.push(x2,y1,z21, x2,y2,z22, x1,y2,z12);

      for (let k=0;k<6;k++){
        const t = (z11+z12+z21+z22)/4;
        color.setHSL(0.6 - 0.6*(t/10),1,0.5);
        colors.push(color.r,color.g,color.b);
      }
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices,3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors,3));
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    vertexColors:true, side:THREE.DoubleSide, transparent:true, opacity:0.8
  });

  const mesh = new THREE.Mesh(geometry,material);
  mesh.name="fourier2DSurface";

  const old = scene.getObjectByName("fourier2DSurface");
  if(old) scene.remove(old);
  scene.add(mesh);

  if(camera && controls){
    const centerX = (xs[0]+xs[xs.length-1])/2;
    const centerY = (ys[0]+ys[ys.length-1])/2;
    let zSum=0;
    for(let k=2;k<vertices.length;k+=3) zSum+=vertices[k];
    const centerZ = zSum/(vertices.length/3);
    controls.target.set(centerX,centerY,centerZ);
    camera.position.set(centerX-(xs[xs.length-1]-xs[0]),centerY-(ys[ys.length-1]-ys[0]),centerZ+5);
    controls.update();
  }
}

// ----- Đồ thị 2D -----
const graph2DParams = {
  formula: "y = sin(x)", // công thức mặc định
  domain: {
    xMin: -10,
    xMax: 10,
    step: 0.1
  },
  plot: () => plotGraph2D(),
  help: () => {
    alert(
`📖 Hướng dẫn sử dụng tab Đồ thị 2D:

✏️ Công thức:
- Nhập công thức dạng "y = f(x)".
- Ví dụ: y = sin(x), y = cos(x), y = x^2, y = exp(-x^2).

📐 X Min, X Max:
- Giới hạn miền giá trị trục X.

🔢 Bước Δx:
- Độ chia nhỏ, càng nhỏ thì đồ thị càng mượt.

📈 Vẽ Đồ Thị:
- Nhấn để cập nhật đồ thị.

🖼️ Kết quả:
- Đồ thị hiển thị trực tiếp.
- Có thể thu phóng, đổi công thức bất kỳ lúc nào.
`
    );
  }
};

// Tạo tab trong GUI
const guiGraph2D = guiHelper.addTab("Đồ thị 2D", 350, { icon: "📈", label: "Đồ thị 2D" });

guiGraph2D.add(graph2DParams, "formula").name("Công thức");

// Tạo folder con cho miền giá trị
const domainFolder = guiGraph2D.addFolder("Miền giá trị X");
domainFolder.add(graph2DParams.domain, "xMin", -50, 0, 1).name("X Min");
domainFolder.add(graph2DParams.domain, "xMax", 0, 50, 1).name("X Max");
domainFolder.add(graph2DParams.domain, "step", 0.01, 1, 0.01).name("Bước Δx");

guiGraph2D.add(graph2DParams, "plot").name("📈 Vẽ Đồ Thị");
graph2DParams.plot3D = () => plotGraph2D3D();
guiGraph2D.add(graph2DParams, "plot3D").name("🟢 Vẽ ra 3D");
function addAsymptotes3D(verticalAsymptotes=[], obliqueAsymptotes=[]) {
  const group = new THREE.Group();

  verticalAsymptotes.forEach(x => {
    const points = [
      new THREE.Vector3(x, -1000, 0),
      new THREE.Vector3(x, 1000, 0)
    ];
    const mat = new THREE.LineDashedMaterial({ color: 0xff9900, dashSize: 1, gapSize: 1, linewidth: 2 });
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geom, mat);
    line.computeLineDistances(); // bắt buộc cho dashed
    group.add(line);

    // Thêm nhãn x
    const label = makeTextSprite(`x=${x.toFixed(2)}`, { fontsize: 20, borderColor: {r:255,g:153,b:0,a:1} });
    label.position.set(x, 0, 0);
    group.add(label);
  });

  obliqueAsymptotes.forEach(o => {
    const {a,b} = o;
    const xMin = graph2DParams.domain.xMin;
    const xMax = graph2DParams.domain.xMax;
    const points = [
      new THREE.Vector3(xMin, a*xMin+b, 0),
      new THREE.Vector3(xMax, a*xMax+b, 0)
    ];
    const mat = new THREE.LineDashedMaterial({ color: 0x9900ff, dashSize: 1, gapSize: 2, linewidth: 2 });
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geom, mat);
    line.computeLineDistances();
    group.add(line);

    // Nhãn xiên
    const label = makeTextSprite(`y=${a.toFixed(2)}x+${b.toFixed(2)}`, { fontsize: 18, borderColor: {r:153,g:0,b:255,a:1} });
    label.position.set(xMax, a*xMax+b, 0);
    group.add(label);
  });

  return group;
}
function addCriticalPoints3D(points) {
  const group = new THREE.Group();
  const sphereGeom = new THREE.SphereGeometry(0.15, 16, 16);
  const sphereMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  points.forEach(p => {
    const sphere = new THREE.Mesh(sphereGeom, sphereMat);
    sphere.position.set(p.x, p.y, 0);
    group.add(sphere);

    // Thêm nhãn
    const label = makeTextSprite(`(${p.x.toFixed(2)},${p.y.toFixed(2)})`, { fontsize: 16, borderColor: {r:255,g:0,b:0,a:1} });
    label.position.set(p.x, p.y + 0.3, 0);
    group.add(label);
  });
  return group;
}
function makeTextSprite(message, parameters={}) {
  const fontface = parameters.fontface || "Arial";
  const fontsize = parameters.fontsize || 18;
  const borderThickness = parameters.borderThickness || 2;
  const borderColor = parameters.borderColor || { r:0, g:0, b:0, a:1 };
  const textColor = parameters.textColor || { r:255, g:255, b:255, a:1 };

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = fontsize + "px " + fontface;

  // đo kích thước text
  const metrics = context.measureText(message);
  const textWidth = metrics.width;

  context.fillStyle = `rgba(${textColor.r},${textColor.g},${textColor.b},${textColor.a})`;
  context.fillText(message, borderThickness, fontsize + borderThickness);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(textWidth/30, fontsize/30, 1); // tỉ lệ vừa phải
  return sprite;
}

let last2DGraph3D = null;

function plotGraph2D3D() {
  if (!scene) return;

  // Xoá đồ thị cũ
  if (last2DGraph3D) {
    scene.remove(last2DGraph3D);
    // Duyệt từng object con để dispose geometry/material nếu có
    last2DGraph3D.traverse(obj => {
      if (obj.isMesh || obj.isLine) {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      }
    });
    last2DGraph3D = null;
  }
  

  const input = graph2DParams.formula.trim();
  const exprStr = input.replace(/^y\s*=\s*/, "");
  const expr = math.compile(exprStr);

  const points = [];
  const { xMin, xMax, step } = graph2DParams.domain;
  const yValues = [];
  for (let x = xMin; x <= xMax + 1e-12; x += step) {
    let y;
    try {
      y = expr.evaluate({ x });
      if (!Number.isFinite(y) || Math.abs(y) > HUGE_THRESHOLD) {
        y = null; // coi là "không xác định"
      }
    } catch {
      y = null;
    }
  
    if (y !== null) points.push(new THREE.Vector3(x, y, 0));
    yValues.push(y);
  }
  

  // Tạo Line3D
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x33ff99 });
  const curve3D = new THREE.Line(geometry, material);

  // Phân tích đồ thị
  const analysis = analyzeGraph2D(exprStr, expr, points.map(p=>p.x), yValues);

  // Nhóm các layer
  const group = new THREE.Group();
  group.add(curve3D);
  group.add(addAsymptotes3D(analysis.verticalAsymptotes, analysis.obliqueAsymptotes));
  group.add(addCriticalPoints3D(analysis.criticalPoints));

  scene.add(group);
  last2DGraph3D = group;

  if (points.length>0) moveCameraTo(points);
}


guiGraph2D.add(graph2DParams, "help").name("❓ Trợ giúp");

// ✅ Tạo canvas
const canvasWrapper = document.createElement("div");
canvasWrapper.style.width = "100%";
canvasWrapper.style.height = "260px";
canvasWrapper.style.padding = "10px";
const canvasGraph2D = document.createElement("canvas");
canvasGraph2D.id = "graph2D";
canvasWrapper.appendChild(canvasGraph2D);
guiGraph2D.domElement.appendChild(canvasWrapper);

// ✅ Thêm khung hiển thị kết quả
const analysisBox = document.createElement("div");
analysisBox.style.width = "100%";
analysisBox.style.minHeight = "140px";
analysisBox.style.overflowY = "auto";
analysisBox.style.background = "#1a1a1a";
analysisBox.style.color = "#eee";
analysisBox.style.fontSize = "13px";
analysisBox.style.padding = "10px";
analysisBox.style.marginTop = "10px";
analysisBox.style.border = "1px solid #333";
analysisBox.style.borderRadius = "8px";
analysisBox.style.lineHeight = "1.5";
analysisBox.innerHTML = "<div style='color:#888'>📊 Chưa có kết quả khảo sát.</div>";
guiGraph2D.domElement.appendChild(analysisBox);

// ==== Tham số nội bộ (có thể tùy chỉnh) ====
const HUGE_THRESHOLD = 1e8;      // nếu |y| > ngưỡng này coi như "vô hạn"
const JUMP_MULTIPLIER = 1e3;     // nếu delta lớn hơn maxAbs * JUMP_MULTIPLIER => coi là nhảy lớn
const REFINE_ITERS = 35;         // lần lặp tối đa khi refine vị trí tiệm cận
const REFINE_TOL = 1e-7;         // độ chính xác refine

// ===== Hàm vẽ đồ thị (thay thế) =====
function plotGraph2D() {
  const input = graph2DParams.formula.trim();
  if (!/^y\s*=/.test(input)) {
    alert("Công thức phải có dạng: y = f(x)");
    return;
  }
  const exprStr = input.replace(/^y\s*=\s*/, "");
  let expr;
  try {
    expr = math.compile(exprStr);
  } catch (e) {
    alert("Sai công thức: " + e.message);
    return;
  }

  const xValues = [];
  const yValues = [];
  for (let x = graph2DParams.domain.xMin; x <= graph2DParams.domain.xMax + 1e-12; x += graph2DParams.domain.step) {
    xValues.push(+x.toFixed(12)); // tránh lỗi số thực
    try {
      const y = expr.evaluate({ x });
      // coi như "không hữu hạn" khi số bị Infinity, NaN, hoặc quá lớn
      if (!Number.isFinite(y) || Math.abs(y) > HUGE_THRESHOLD) {
        yValues.push(null);
      } else {
        yValues.push(y);
      }
    } catch {
      // lỗi khi evaluate -> coi như tiệm cận (null)
      yValues.push(null);
    }
  }

  const analysis = analyzeGraph2D(exprStr, expr, xValues, yValues);

  // Tạo annotations: trục, cực trị, tiệm cận
  const annotations = {
    axisX: { type: "line", yMin: 0, yMax: 0, borderColor: "#666", borderWidth: 1.2 },
    axisY: { type: "line", xMin: 0, xMax: 0, borderColor: "#666", borderWidth: 1.2 },
    // cực trị
    ...analysis.criticalPoints.reduce((acc, p, i) => {
      acc[`critPoint${i}`] = { type: "point", xValue: p.x, yValue: p.y, backgroundColor: "red", radius: 5 };
      acc[`critVLine${i}`] = { type: "line", xMin: p.x, xMax: p.x, yMin: 0, yMax: p.y, borderColor: "red", borderDash: [6,6], borderWidth: 1 };
      acc[`critHLine${i}`] = { type: "line", yMin: p.y, yMax: p.y, xMin: 0, xMax: p.x, borderColor: "red", borderDash: [6,6], borderWidth: 1 };
      return acc;
    }, {}),
    // tiệm cận đứng
...analysis.verticalAsymptotes.reduce((acc, x, i) => {
  acc[`asym${i}`] = { 
    type: "line", 
    xMin: x, xMax: x, 
    borderColor: "orange", 
    borderWidth: 2, 
    borderDash: [6,6],
    label: {
      display: true,
      content: `x=${x.toFixed(3)}`,
      position: "start",  // có thể thử "end" hoặc "center"
      color: "orange",
      backgroundColor: "rgba(0,0,0,0.5)"
    }
  };
  return acc;
}, {}),

    // tiệm cận xiên
...analysis.obliqueAsymptotes.reduce((acc, obj, i) => {
  const {a, b, side} = obj;
  const xStart = graph2DParams.domain.xMin;
  const xEnd   = graph2DParams.domain.xMax;
  acc[`oblique${i}`] = {
    type: "line",
    xMin: xStart, xMax: xEnd,
    yMin: a*xStart + b, yMax: a*xEnd + b,
    borderColor: "purple",
    borderWidth: 2,
    borderDash: [8,6],
    label: {
      display: true,
      content: `y=${a.toFixed(3)}x+${b.toFixed(3)} (${side})`,
      position: "end",
      color: "purple",
      backgroundColor: "rgba(0,0,0,0.5)"
    }
  };
  return acc;
}, {})

  };

  // Hủy đồ thị cũ nếu có
  if (window.chart2D) window.chart2D.destroy();
  const ctx = canvasGraph2D.getContext("2d");
  window.chart2D = new Chart(ctx, {
    type: "line",
    data: {
      labels: xValues,
      datasets: [{
        label: input,
        data: yValues,
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        spanGaps: false // KHÔNG nối qua null (đảm bảo chia đoạn tại tiệm cận)
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { type: "linear", title: { display: true, text: "x" } },
        y: { title: { display: true, text: "y" } }
      },
      plugins: {
        annotation: { annotations },
        zoom: {
          pan: { enabled: true, mode: "xy" },
          zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: "xy" }
        }
      }
      
    }
  });

  // Cập nhật box kết quả (giao diện dạng bảng)
let msg = `
<h4 style="margin:0 0 8px;color:#0ff">📊 Kết quả khảo sát</h4>
<table style="width:100%;border-collapse:collapse;font-size:14px">
  <tr>
    <td style="border:1px solid #0ff;padding:4px">✏️ <b>Đạo hàm f'(x)</b></td>
    <td style="border:1px solid #0ff;padding:4px;color:#0f0"><code>${analysis.derivative}</code></td>
  </tr>
  <tr>
    <td style="border:1px solid #0ff;padding:4px">🔼 <b>GTLN (≈)</b></td>
    <td style="border:1px solid #0ff;padding:4px;color:#ff0">${analysis.yMax}</td>
  </tr>
  <tr>
    <td style="border:1px solid #0ff;padding:4px">🔽 <b>GTNN (≈)</b></td>
    <td style="border:1px solid #0ff;padding:4px;color:#ff0">${analysis.yMin}</td>
  </tr>
  <tr>
    <td style="border:1px solid #0ff;padding:4px">🎯 <b>Cực trị (≈)</b></td>
    <td style="border:1px solid #0ff;padding:4px;color:#f88">
      ${
        analysis.criticalPoints.length > 0
          ? analysis.criticalPoints.map(p => `(${p.x.toFixed(4)}, ${p.y.toFixed(4)})`).join(", ")
          : "Không có"
      }
    </td>
  </tr>
  ${
    analysis.verticalAsymptotes.length > 0
      ? `
        <tr>
          <td style="border:1px solid #0ff;padding:4px">📐 <b>Tiệm cận đứng</b></td>
          <td style="border:1px solid #0ff;padding:4px;color:#0af">
            ${analysis.verticalAsymptotes.map(x => `x = ${x.toFixed(6)}`).join(", ")}
          </td>
        </tr>`
      : ""
  }
  ${
    analysis.obliqueAsymptotes.length > 0
      ? `
        <tr>
          <td style="border:1px solid #0ff;padding:4px">📐 <b>Tiệm cận xiên</b></td>
          <td style="border:1px solid #0ff;padding:4px;color:#a6f">
            ${analysis.obliqueAsymptotes.map(obj =>
              `y = ${obj.a.toFixed(3)}x + ${obj.b.toFixed(3)} (${obj.side})`
            ).join("<br>")
            }
          </td>
        </tr>`
      : ""
  }
</table>
`;
analysisBox.innerHTML = msg;

}

// ===== Phân tích đồ thị (cập nhật) =====
function analyzeGraph2D(exprStr, expr, xValues, yValues) {
  // Derivative
  let derivative;
  try {
    derivative = math.derivative(exprStr, "x");
  } catch {
    derivative = null;
  }

  // Tính f'(x) trên lưới (nếu có)
  const dValues = derivative ? xValues.map(x => {
    try { const v = derivative.evaluate({ x }); return Number.isFinite(v) ? v : null; } 
    catch { return null; }
  }) : xValues.map(_ => null);

  // Tìm cực trị
  const criticalPoints = [];
  for (let i = 1; i < dValues.length; i++) {
    const d0 = dValues[i-1], d1 = dValues[i];
    if (d0 === null || d1 === null) continue;
    if (d0 * d1 <= 0) {
      const x0 = (xValues[i-1] + xValues[i]) / 2;
      try {
        const y0 = expr.evaluate({ x: x0 });
        if (Number.isFinite(y0)) criticalPoints.push({ x: x0, y: y0 });
      } catch {}
    }
  }

  // GTLN, GTNN
  const finiteY = yValues.filter(v => v !== null && Number.isFinite(v));
  const yMin = finiteY.length ? Math.min(...finiteY) : null;
  const yMax = finiteY.length ? Math.max(...finiteY) : null;

  // Phát hiện tiệm cận đứng
  const verticalAsymptotes = [];
  for (let i = 1; i < yValues.length; i++) {
    const y0 = yValues[i-1], y1 = yValues[i];
    const x0 = xValues[i-1], x1 = xValues[i];
    if ((y0 === null && y1 !== null) || (y0 !== null && y1 === null)) {
      const approx = refineAsymptoteIfPossible(expr, x0, x1);
      verticalAsymptotes.push(approx);
    }
  }
  const uniqAsym = uniqueApprox(verticalAsymptotes, 1e-6);

  // 👉 Tiệm cận xiên
  function obliqueAsymptote(side = "right") {
    try {
      const sampleXs = side === "right"
        ? xValues.slice(-20) // 20 điểm cuối
        : xValues.slice(0, 20); // 20 điểm đầu
      const sampleYs = sampleXs.map(x => expr.evaluate({ x }));
      if (sampleYs.some(y => !Number.isFinite(y))) return null;
      // Fit tuyến tính y ≈ ax+b
      const n = sampleXs.length;
      const sumX = sampleXs.reduce((a,b)=>a+b,0);
      const sumY = sampleYs.reduce((a,b)=>a+b,0);
      const sumXY = sampleXs.reduce((a,b,i)=>a+b*sampleYs[i],0);
      const sumX2 = sampleXs.reduce((a,b)=>a+b*b,0);
      const a = (n*sumXY - sumX*sumY) / (n*sumX2 - sumX*sumX);
      const b = (sumY - a*sumX) / n;
      // kiểm tra: nếu a ≈ 0 coi như tiệm cận ngang
      if (Math.abs(a) < 1e-6) return null;
      return { a, b, side };
    } catch {
      return null;
    }
  }

  const oblique = [];
  const leftAsym = obliqueAsymptote("left");
  if (leftAsym) oblique.push(leftAsym);
  const rightAsym = obliqueAsymptote("right");
  if (rightAsym) oblique.push(rightAsym);

  return {
    derivative: derivative ? derivative.toString() : "—",
    criticalPoints,
    yMin,
    yMax,
    verticalAsymptotes: uniqAsym,
    obliqueAsymptotes: oblique
  };
}


// ===== Helper: refine vị trí tiệm cận bằng chia đôi (nếu có thể) =====
function refineAsymptoteIfPossible(expr, a, b) {
  // đảm bảo a < b
  if (a > b) { const t = a; a = b; b = t; }
  let left = a, right = b;

  // cap vào vùng đồ thị hiện tại nếu quá rộng
  const span = Math.max(1e-12, right - left);

  // nếu khoảng quá nhỏ thì trả về midpoint
  if (Math.abs(right - left) < REFINE_TOL) return (left + right) / 2;

  // xác định trạng thái đầu: finite hay not
  function evalSafe(x) {
    try {
      const v = expr.evaluate({ x });
      return Number.isFinite(v) && Math.abs(v) <= HUGE_THRESHOLD ? { finite: true, v } : { finite: false, v: null };
    } catch {
      return { finite: false, v: null };
    }
  }

  // Nếu cả 2 đầu đều finite thì vẫn thử refine nếu jump lớn
  let leftState = evalSafe(left), rightState = evalSafe(right);

  // lặp chia đôi, tìm điểm chuyển finite -> not finite
  for (let it = 0; it < REFINE_ITERS; it++) {
    const mid = (left + right) / 2;
    const midState = evalSafe(mid);
    // Nếu mid không finite => tiệm cận gần mid, thu hẹp về phía mid
    if (!midState.finite) {
      // nếu left finite thì move right to mid, ngược lại move left to mid
      if (leftState.finite) {
        right = mid;
        rightState = midState;
      } else {
        left = mid;
        leftState = midState;
      }
    } else {
      // mid finite -> cần tìm phía còn lại không finite
      // nếu left không finite thì move right to mid; nếu right không finite move left to mid
      if (!leftState.finite) {
        left = mid;
        leftState = midState;
      } else if (!rightState.finite) {
        right = mid;
        rightState = midState;
      } else {
        // cả 2 phía đều finite (trường hợp jump nhưng cả hai finite): thu hẹp theo gradient (chọn phía có |y| lớn hơn)
        const leftY = leftState.v, rightY = rightState.v;
        if (Math.abs(leftY) > Math.abs(rightY)) {
          right = mid;
          rightState = midState;
        } else {
          left = mid;
          leftState = midState;
        }
      }
    }
    if (Math.abs(right - left) < Math.max(REFINE_TOL, span * 1e-6)) break;
  }
  return (left + right) / 2;
}

// ===== Helper: loại bỏ phần tử gần nhau (approx unique) =====
function uniqueApprox(arr, tol = 1e-8) {
  if (!arr || arr.length === 0) return [];
  const sorted = arr.slice().sort((a,b) => a - b);
  const out = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    if (Math.abs(sorted[i] - out[out.length-1]) > tol) out.push(sorted[i]);
  }
  return out;
}


// ----- Mặt phẳng & Đường thẳng -----
const geometryParams = {
  planes: [],          // danh sách phương trình dạng text
  planeEquations: [],  // danh sách hệ số {a,b,c,d}

  // hệ số nhập từ GUI
  a: 1, b: 0, c: 0, d: 0,

  addPlane: () => {
    const { a, b, c, d } = geometryParams;
    const eq = `${a}x + ${b}y + ${c}z + ${d} = 0`;

    geometryParams.planes.push(eq);
    geometryParams.planeEquations.push({ a, b, c, d });

    updatePlaneList();

    // vẽ mặt phẳng
    drawPlaneFromParams(a, b, c, d);

    if (typeof historyParams !== "undefined") {
      historyParams.addEntry(`➕ Thêm mặt phẳng: ${eq}`);
    }
  },

  plane1: null,
  plane2: null,

  findIntersection: () => {
    const i1 = geometryParams.planes.indexOf(geometryParams.plane1);
    const i2 = geometryParams.planes.indexOf(geometryParams.plane2);

    if (i1 < 0 || i2 < 0 || i1 === i2) {
      alert("⚠️ Vui lòng chọn hai mặt phẳng khác nhau");
      return;
    }

    const p1 = geometryParams.planeEquations[i1];
    const p2 = geometryParams.planeEquations[i2];

    intersectPlanes(p1, p2);

    if (typeof historyParams !== "undefined") {
      historyParams.addEntry(`📌 Giao tuyến: ${geometryParams.plane1} ∩ ${geometryParams.plane2}`);
    }
  },

  v1: [1, 0, 0],
  v2: [0, 1, 0],

  checkRelation: () => {
    const [x1, y1, z1] = geometryParams.v1;
    const [x2, y2, z2] = geometryParams.v2;
    const dot = x1 * x2 + y1 * y2 + z1 * z2;
    const cross = [
      y1 * z2 - z1 * y2,
      z1 * x2 - x1 * z2,
      x1 * y2 - y1 * x2
    ];
    let result = "⚪ Tổng quát";
    if (dot === 0) result = "⟂ Vuông góc";
    else if (cross.every(v => v === 0)) result = "∥ Song song";

    document.getElementById("checkResult").innerText = "Kết quả: " + result;

    if (typeof historyParams !== "undefined") {
      historyParams.addEntry(`🔎 Quan hệ vector: ${result}`);
    }
  }
};

// --- Tạo GUI ---
const guiGeometry = guiHelper.addTab("Mặt phẳng & Đường thẳng", 350, { icon: "📐", label: "Mặt phẳng & Đường thẳng" });

// nhập hệ số mặt phẳng
guiGeometry.add(geometryParams, "a", -10, 10, 0.1).name("Hệ số a");
guiGeometry.add(geometryParams, "b", -10, 10, 0.1).name("Hệ số b");
guiGeometry.add(geometryParams, "c", -10, 10, 0.1).name("Hệ số c");
guiGeometry.add(geometryParams, "d", -10, 10, 0.1).name("Hệ số d");

// nút thêm mặt phẳng
guiGeometry.add(geometryParams, "addPlane").name("➕ Thêm mặt phẳng");

// chọn 2 mặt phẳng
guiGeometry.add(geometryParams, "plane1", geometryParams.planes).name("Mặt phẳng 1");
guiGeometry.add(geometryParams, "plane2", geometryParams.planes).name("Mặt phẳng 2");

// tìm giao tuyến
guiGeometry.add(geometryParams, "findIntersection").name("📌 Giao tuyến");

// --- Vector checker ---
const fVec = guiGeometry.addFolder("🎯 Vector Checker");
fVec.add(geometryParams.v1, 0, -10, 10, 1).name("v1.x");
fVec.add(geometryParams.v1, 1, -10, 10, 1).name("v1.y");
fVec.add(geometryParams.v1, 2, -10, 10, 1).name("v1.z");
fVec.add(geometryParams.v2, 0, -10, 10, 1).name("v2.x");
fVec.add(geometryParams.v2, 1, -10, 10, 1).name("v2.y");
fVec.add(geometryParams.v2, 2, -10, 10, 1).name("v2.z");
fVec.add(geometryParams, "checkRelation").name("Kiểm tra quan hệ");
// ----- Thêm nút Trợ giúp -----
geometryParams.help = () => {
  alert(
`📖 Hướng dẫn sử dụng tab Mặt phẳng & Đường thẳng:

➕ Thêm mặt phẳng:
- Nhập các hệ số a, b, c, d để định nghĩa phương trình mặt phẳng dạng:
  ax + by + cz + d = 0
- Sau đó bấm "➕ Thêm mặt phẳng" để thêm vào danh sách và hiển thị trong không gian 3D.

📌 Giao tuyến:
- Chọn 2 mặt phẳng từ danh sách "Mặt phẳng 1" và "Mặt phẳng 2".
- Bấm "📌 Giao tuyến" để hiển thị đường thẳng giao tuyến của chúng (nếu tồn tại).

🎯 Vector Checker:
- Nhập tọa độ cho hai vector v1 và v2.
- Bấm "Kiểm tra quan hệ" để xem chúng có quan hệ gì:
  ⟂ Vuông góc, ∥ Song song, hay ⚪ Tổng quát.

👉 Bạn có thể thêm nhiều mặt phẳng, kiểm tra giao tuyến, và so sánh vector để trực quan hóa các đối tượng hình học 3D.
`
  );
};

// Gắn nút vào GUI
guiGeometry.add(geometryParams, "help").name("❓ Trợ giúp");

// --- Cập nhật danh sách mặt phẳng ---
function updatePlaneList() {
  const planeSelect1 = guiGeometry.__controllers.find(c => c.property === "plane1");
  const planeSelect2 = guiGeometry.__controllers.find(c => c.property === "plane2");
  if (planeSelect1 && planeSelect2) {
    planeSelect1.options(geometryParams.planes);
    planeSelect2.options(geometryParams.planes);
  }
}

// --- Hàm vẽ mặt phẳng ---
function drawPlaneFromParams(a, b, c, d) {
  const geometry = new THREE.PlaneGeometry(100, 100);
  const normal = new THREE.Vector3(a, b, c).normalize();
  const center = normal.clone().multiplyScalar(-d / normal.lengthSq());

  const material = new THREE.MeshStandardMaterial({
    color: Math.random() * 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.4
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(center);
  mesh.lookAt(center.clone().add(normal));
  scene.add(mesh);
}

// --- Hàm tính giao tuyến 2 mặt phẳng ---
function intersectPlanes(p1, p2) {
  const n1 = new THREE.Vector3(p1.a, p1.b, p1.c);
  const n2 = new THREE.Vector3(p2.a, p2.b, p2.c);
  const dir = new THREE.Vector3().crossVectors(n1, n2);

  if (dir.length() < 1e-6) {
    alert("⚠️ Hai mặt phẳng song song hoặc trùng nhau (không có giao tuyến)");
    return;
  }

  const A = new THREE.Matrix3();
  A.set(
    p1.a, p1.b, p1.c,
    p2.a, p2.b, p2.c,
    dir.x, dir.y, dir.z
  );

  const D = new THREE.Vector3(-p1.d, -p2.d, 0);
  const Ainv = A.clone().invert();

  if (!Ainv) {
    alert("⚠️ Không tìm được điểm giao");
    return;
  }

  const point = D.applyMatrix3(Ainv);

  const points = [];
  for (let t = -50; t <= 50; t += 1) {
    const pt = point.clone().add(dir.clone().normalize().multiplyScalar(t));
    points.push(pt);
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
  const line = new THREE.Line(geometry, material);
  scene.add(line);
}

// ----- Đạo hàm -----
const derivativeParams = {
  formula: "z = x^2 + y^2",
  mode: "surface",
  resolution: 50,

  // phạm vi mặc định
  xMin: -5,
  xMax: 5,
  yMin: -5,
  yMax: 5,
  derivativeText: "Kết quả đạo hàm sẽ hiện ở đây",
  plotSurfa: () => plotSurface({
    formula: derivativeParams.formula,
    mode: derivativeParams.mode,
    resolution: derivativeParams.resolution,
    xMin: derivativeParams.xMin,
    xMax: derivativeParams.xMax,
    yMin: derivativeParams.yMin,
    yMax: derivativeParams.yMax
  }),

  compute: () => computeDerivatives(),
  plotDx: () => plotDerivative("dx"),
  plotDy: () => plotDerivative("dy"),
  plotDx2: () => plotDerivative("dx2"),
  plotDy2: () => plotDerivative("dy2"),
  plotDxDy: () => plotDerivative("dxdy"),
};

let derivatives = {};

const guiDerivative= guiHelper.addTab("Đạo hàm", 350, { icon: "𝑑/dx", label: "Đạo hàm" });
guiDerivative.add(derivativeParams, "formula").name("Công thức");
guiDerivative.add(derivativeParams, "mode", ["surface", "line"]).name("Chế độ hiển thị");
guiDerivative.add(derivativeParams, "resolution", 10, 200, 1).name("Độ phân giải");

// 👇 thêm group nhập phạm vi
const fRange = guiDerivative.addFolder("📐 Phạm vi");
fRange.add(derivativeParams, "xMin", -50, 0, 0.1).name("x Min");
fRange.add(derivativeParams, "xMax", 0, 50, 0.1).name("x Max");
fRange.add(derivativeParams, "yMin", -50, 0, 0.1).name("y Min");
fRange.add(derivativeParams, "yMax", 0, 50, 0.1).name("y Max");

guiDerivative.add(derivativeParams, "plotSurfa").name("🧮 Vẽ đồ thị");
// ✅ Tạo box hiển thị kết quả đạo hàm, ẩn mặc định
const derivativeWrapper = document.createElement("div");
derivativeWrapper.style.width = "100%";
derivativeWrapper.style.minHeight = "150px";
derivativeWrapper.style.padding = "10px";
derivativeWrapper.style.marginTop = "8px";
derivativeWrapper.style.background = "#111";
derivativeWrapper.style.color = "#0f0";
derivativeWrapper.style.fontFamily = "monospace";
derivativeWrapper.style.fontSize = "12px";
derivativeWrapper.style.borderRadius = "6px";
derivativeWrapper.style.display = "none"; // 👈 ẩn mặc định

const derivativeBox = document.createElement("pre");
derivativeBox.style.whiteSpace = "pre-wrap";
derivativeBox.style.wordBreak = "break-word";
derivativeBox.textContent = derivativeParams.derivativeText;

derivativeWrapper.appendChild(derivativeBox);
guiDerivative.domElement.appendChild(derivativeWrapper);

// ✅ Nút tính đạo hàm → hiện box + cập nhật nội dung
guiDerivative.add(derivativeParams, "compute").name("🧮 Tính đạo hàm").onChange(() => {
  derivativeWrapper.style.display = "block"; // hiện box
  computeDerivatives();
  derivativeBox.textContent = derivativeParams.derivativeText; // update text
});

// Group hiển thị các nút vẽ đạo hàm
const fDeriv = guiDerivative.addFolder("✏️ Vẽ các đạo hàm");
fDeriv.add(derivativeParams, "plotDx").name("∂z/∂x");
fDeriv.add(derivativeParams, "plotDy").name("∂z/∂y");
fDeriv.add(derivativeParams, "plotDx2").name("∂²z/∂x²");
fDeriv.add(derivativeParams, "plotDy2").name("∂²z/∂y²");
fDeriv.add(derivativeParams, "plotDxDy").name("∂²z/∂x∂y");
// ----- Nút Trợ giúp -----
derivativeParams.help = () => {
  alert(
`📖 Hướng dẫn sử dụng tab Đạo hàm:

✏️ Công thức:
- Nhập công thức dưới dạng "z = f(x,y)".
- Ví dụ: z = x^2 + y^2 hoặc z = sin(x) * cos(y).

🖼️ Chế độ hiển thị:
- "surface": Vẽ bề mặt 3D.
- "line": Vẽ đường cong (1 biến).

🔢 Độ phân giải:
- Quyết định số lượng điểm vẽ. Càng cao thì càng mượt nhưng tốn tài nguyên.

📐 Phạm vi:
- xMin, xMax, yMin, yMax: Khoảng giá trị vẽ.
- step: bước lưới (dùng trong grid).

🧮 Vẽ đồ thị:
- Vẽ đồ thị từ công thức gốc đã nhập.

🧮 Tính đạo hàm:
- Tự động tính ∂z/∂x, ∂z/∂y, ∂²z/∂x², ∂²z/∂y², ∂²z/∂x∂y.
- Kết quả hiện trong hộp bên dưới.

✏️ Vẽ các đạo hàm:
- ∂z/∂x: Vẽ đạo hàm theo x.
- ∂z/∂y: Vẽ đạo hàm theo y.
- ∂²z/∂x², ∂²z/∂y²: Vẽ đạo hàm bậc 2.
- ∂²z/∂x∂y: Vẽ đạo hàm hỗn hợp.

👉 Quy trình gợi ý:
1. Nhập công thức z = f(x,y).
2. Nhấn "🧮 Tính đạo hàm".
3. Chọn các nút ∂ để vẽ đạo hàm tương ứng.
`
  );
};

// Thêm nút vào GUI
guiDerivative.add(derivativeParams, "help").name("❓ Trợ giúp");


function computeDerivatives() {
  const expr = derivativeParams.formula.replace(/^z\s*=\s*/, "");
  try {
    const dz_dx = math.derivative(expr, "x").toString();
    const dz_dy = math.derivative(expr, "y").toString();
    const d2z_dx2 = math.derivative(dz_dx, "x").toString();
    const d2z_dy2 = math.derivative(dz_dy, "y").toString();
    const d2z_dxdy = math.derivative(dz_dx, "y").toString();
    const differential = `dz = (${dz_dx}) dx + (${dz_dy}) dy`;

    derivatives = { dx: dz_dx, dy: dz_dy, dx2: d2z_dx2, dy2: d2z_dy2, dxdy: d2z_dxdy };

    derivativeParams.derivativeText = `
∂z/∂x = ${dz_dx}
∂z/∂y = ${dz_dy}
∂²z/∂x² = ${d2z_dx2}
∂²z/∂y² = ${d2z_dy2}
∂²z/∂x∂y = ${d2z_dxdy}

${differential}
`.trim();

  } catch (err) {
    derivativeParams.derivativeText = "❌ Lỗi công thức hoặc không thể tính đạo hàm.";
  }
}

function plotDerivative(key) {
  const formula = derivatives[key];
  if (!formula) {
    alert("❗ Vui lòng nhấn 'Tính Đạo Hàm' trước.");
    return;
  }

  plotSurface({
    formula: "z = " + formula,   // 👈 truyền đạo hàm vào luôn
    mode: derivativeParams.mode,
    resolution: derivativeParams.resolution,
    xMin: derivativeParams.xMin,
    xMax: derivativeParams.xMax,
    yMin: derivativeParams.yMin,
    yMax: derivativeParams.yMax
  });
}

// ----- Đồ thị cực -----
const polarParams = {
  // cho polar
  formula: "theta",
  sampleFormula: "",
  drawPolar: () => plotPolar(),

  // cho 3D
  xFormula: "cos(t)",
  yFormula: "sin(t)",
  zFormula: "t",
  sample3D: "",
  drawCustom: () => plotCustom3D(),

  tMin: 0,
  tMax: 10,
  step: 0.1,
};



// Các công thức mẫu r = f(θ)
const polarSamples = {
  "r = θ": "theta",
  "r = 3θ": "3 * theta",
  "r = √θ": "sqrt(theta)",
  "r = θ * sin(θ)": "theta * sin(theta)",
  "r = 10 * sin(3θ)": "10 * sin(3 * theta)",
  "r = 5 + 2 * cos(4θ)": "5 + 2 * cos(4 * theta)",
  "r = |4 * sin(2θ)|": "abs(4 * sin(2 * theta))",
  "r = √|cos(2θ)|": "sqrt(abs(cos(2 * theta)))",
  "Cardioid ❤️": "1 - sin(theta)",
  "Cardioid 💙": "1 + cos(theta)",
  "Hoa 5 cánh 🌸": "5 * sin(5 * theta)",
  "Hoa 7 cánh 🌼": "7 * cos(7 * theta)",
  "Euler Special": "exp(cos(theta)) - 2 * cos(4 * theta) + pow(sin(theta/12), 5)",
};

// Các công thức mẫu 3D
const polarSamples3D = {
  "Helix": "x = cos(t); y = sin(t); z = t",
  "Parabol 3D": "x = t; y = t^2; z = t^3",
  "Sine + Cosine Wave": "x = t; y = sin(t); z = cos(t)",
  "Spiral Xoắn": "x = 10 * sin(t); y = 10 * cos(t); z = 0.5 * t",
  "Lissajous 3D": "x = sin(2*t); y = cos(3*t); z = sin(t)",
  "Archimedean Spiral": "x = t * cos(t); y = t * sin(t); z = t",
  "Hình trứng 3D": "x = sin(t) * cos(t); y = cos(t); z = sin(t)",
  "Bó hoa xoắn": "x = sin(t) * sqrt(abs(t)); y = cos(t) * sqrt(abs(t)); z = t",
};

// ---- GUI ----
const guiPolar     = guiHelper.addTab("Đồ thị cực", 350, { icon: "🌀", label: "Đồ thị cực" });

// Công thức r = f(θ)
// Tạo controller riêng để có thể update lại giao diện
const formulaCtrl = guiPolar.add(polarParams, "formula").name("Công thức r=f(θ)");

guiPolar.add(polarParams, "sampleFormula", Object.keys(polarSamples)).name("📌 Chọn mẫu")
  .onChange(v => {
    polarParams.formula = polarSamples[v];
    formulaCtrl.updateDisplay(); // ✅ cập nhật lại GUI input
  });

guiPolar.add(polarParams, "drawPolar").name("📈 Vẽ đồ thị cực");

// Công thức 3D
const f3D = guiPolar.addFolder("🌀 Đồ thị tham số 3D");

const xCtrl = f3D.add(polarParams, "xFormula").name("x(t) = ");
const yCtrl = f3D.add(polarParams, "yFormula").name("y(t) = ");
const zCtrl = f3D.add(polarParams, "zFormula").name("z(t) = ");

f3D.add(polarParams, "sample3D", Object.keys(polarSamples3D)).name("📌 Mẫu 3D")
  .onChange(v => {
    const formula = polarSamples3D[v];
    const parts = formula.split(";");
    polarParams.xFormula = parts[0].split("=")[1].trim();
    polarParams.yFormula = parts[1].split("=")[1].trim();
    polarParams.zFormula = parts[2].split("=")[1].trim();

    // ✅ update lại giao diện
    xCtrl.updateDisplay();
    yCtrl.updateDisplay();
    zCtrl.updateDisplay();
  });

f3D.add(polarParams, "tMin", -50, 0, 1).name("t Min");
f3D.add(polarParams, "tMax", 1, 100, 1).name("t Max");
f3D.add(polarParams, "step", 0.01, 1, 0.01).name("Bước Δt");
f3D.add(polarParams, "drawCustom").name("🎨 Vẽ đồ thị 3D");
// ----- Thêm nút Trợ giúp -----
polarParams.help = () => {
  alert(
`📖 Hướng dẫn sử dụng tab Đồ thị cực:

📌 Đồ thị cực r = f(θ):
- Nhập công thức r(θ) vào ô "Công thức r=f(θ)".
- Có thể chọn công thức mẫu ở "📌 Chọn mẫu".
- Nhấn "📈 Vẽ đồ thị cực" để hiển thị.

🌀 Đồ thị tham số 3D:
- Nhập công thức x(t), y(t), z(t) vào các ô tương ứng.
- Có thể chọn công thức mẫu ở "📌 Mẫu 3D" để điền nhanh.
- Điều chỉnh miền giá trị của t bằng "t Min", "t Max" và bước "Δt".
- Nhấn "🎨 Vẽ đồ thị 3D" để hiển thị.

⚙️ Lưu ý:
- Hỗ trợ các hàm toán học: sin, cos, tan, sqrt, abs, exp, pow...
- Có thể dùng biến θ (theta) cho đồ thị cực, hoặc biến t cho đồ thị tham số 3D.
- Nếu công thức không hợp lệ hoặc thiếu điểm, hệ thống sẽ báo lỗi.

👉 Bạn có thể kết hợp nhiều đồ thị để quan sát và so sánh trực quan.
`
  );
};

// Gắn vào GUI
guiPolar.add(polarParams, "help").name("❓ Trợ giúp");


// --- Vẽ đồ thị cực r = f(θ) ---
let lastPolarGraph = null;

function plotPolar() {
  // Xoá đồ thị cũ
  if (lastPolarGraph) {
    scene.remove(lastPolarGraph);
    lastPolarGraph.geometry.dispose();
    lastPolarGraph.material.dispose();
    lastPolarGraph = null;
  }

  let expr;
  try {
    expr = math.compile(polarParams.formula);
  } catch (e) {
    alert("Công thức không hợp lệ: " + e.message);
    return;
  }

  const points = [];
  for (let i = 0; i <= 1000; i++) {
    const theta = (i / 1000) * Math.PI * 2;
    let r = 0;
    try { r = expr.evaluate({ theta }); } catch (e) {}
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    points.push(new THREE.Vector3(x, 0, y));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xff9933 });
  const polarCurve = new THREE.Line(geometry, material);

  scene.add(polarCurve);
  lastPolarGraph = polarCurve;

  // Trong plotCustom3D()
if (points.length > 0) {
  moveCameraTo(points);
}

}

// --- Vẽ đồ thị tham số 3D ---
let customCurve = null;

function plotCustom3D() {
  let fx, fy, fz;
  try {
    fx = math.compile(polarParams.xFormula);
    fy = math.compile(polarParams.yFormula);
    fz = math.compile(polarParams.zFormula);
  } catch (e) {
    alert("Lỗi biên dịch công thức: " + e.message);
    return;
  }

  if (customCurve) {
    scene.remove(customCurve);
    customCurve.geometry.dispose();
    customCurve.material.dispose();
    customCurve = null;
  }

  const points = [];
  for (let t = polarParams.tMin; t <= polarParams.tMax; t += polarParams.step) {
    const ctx = { t, theta: t, u: t, v: t };
    try {
      const x = fx.evaluate(ctx);
      const y = fy.evaluate(ctx);
      const z = fz.evaluate(ctx);
      if (isFinite(x) && isFinite(y) && isFinite(z)) {
        points.push(new THREE.Vector3(x, y, z));
      }
    } catch {}
  }

  if (points.length < 2) {
    alert("Không đủ điểm để vẽ đường cong 3D.");
    return;
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xff44aa });
  customCurve = new THREE.Line(geometry, material);
  scene.add(customCurve);

  if (points.length > 0) {
    moveCameraTo(points);
  }
}


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(60, 60, 60);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Label renderer
const labelRenderer = new THREE.CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ===== Tab GUI vẽ minh họa bằng click chuột =====
// ===== Thêm điểm =====
const drawParams = {
  points: [],
  lines: [],
  selectedPoints: [],
  selectedLines: [],

  addPoint: (x = null, y = null, z = null) => {
    x = x ?? (Math.random() - 0.5) * 50;
    y = y ?? (Math.random() - 0.5) * 50;
    z = z ?? (Math.random() - 0.5) * 50;

    const geometry = new THREE.SphereGeometry(0.5, 16, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);
    scene.add(sphere);

    const label = String.fromCharCode(65 + drawParams.points.length); // A, B, C...
    const labelSprite = createLabelSprite(label, "#ff0000");
    labelSprite.position.copy(sphere.position.clone().add(new THREE.Vector3(0, 3, 0)));

    const pointObj = { x, y, z, mesh: sphere, label, labelSprite };
    drawParams.points.push(pointObj);

    // GUI điểm
    const f = guiDraw.addFolder(`Điểm ${label}`);
    f.add(pointObj, 'x', -100, 100, 0.1).name('X').onChange(val => { 
      pointObj.mesh.position.x = val; 
      pointObj.labelSprite.position.copy(pointObj.mesh.position.clone().add(new THREE.Vector3(0, 3, 0)));
      updateLinesConnected(pointObj); 
  });
  f.add(pointObj, 'y', -100, 100, 0.1).name('Y').onChange(val => { 
      pointObj.mesh.position.y = val; 
      pointObj.labelSprite.position.copy(pointObj.mesh.position.clone().add(new THREE.Vector3(0, 3, 0)));
      updateLinesConnected(pointObj); 
  });
  f.add(pointObj, 'z', -100, 100, 0.1).name('Z').onChange(val => { 
      pointObj.mesh.position.z = val; 
      pointObj.labelSprite.position.copy(pointObj.mesh.position.clone().add(new THREE.Vector3(0, 3, 0)));
      updateLinesConnected(pointObj); 
  });
  
    f.open();
  },

  connectSelected: () => {
    if (drawParams.selectedPoints.length < 2) return;
    const p1 = drawParams.selectedPoints[0];
    const p2 = drawParams.selectedPoints[1];

    const geometry = new THREE.BufferGeometry().setFromPoints([p1.mesh.position.clone(), p2.mesh.position.clone()]);
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const lineMesh = new THREE.Line(geometry, material);
    scene.add(lineMesh);

    const label = `${p1.label}${p2.label}`;
    const initialLength = p1.mesh.position.distanceTo(p2.mesh.position);
    const lengthSprite = createLabelSprite(initialLength.toFixed(2), "#00aa00");
    lengthSprite.position.copy(new THREE.Vector3().addVectors(p1.mesh.position, p2.mesh.position).multiplyScalar(0.5));

    const lineObj = { line: lineMesh, p1, p2, _length: initialLength, label, lengthSprite, angleSprite: null };
    drawParams.lines.push(lineObj);
    updateEdgeListGUI();
    // GUI đường
    const fLine = guiDraw.addFolder(`Đường ${label}`);
    fLine.add(lineObj, '_length', 0, 200, 0.1).name('Chiều dài').listen().onChange(val => {
      const dir = new THREE.Vector3().subVectors(lineObj.p2.mesh.position, lineObj.p1.mesh.position).normalize();
      lineObj.p2.mesh.position.copy(lineObj.p1.mesh.position.clone().add(dir.multiplyScalar(val)));
      updateLineGeometry(lineObj);
      updateAngles();
    });

    lineObj.angleGUI = fLine.add({ angle: 0 }, 'angle').name('Góc (°)').listen();
    fLine.open();

    drawParams.selectedPoints.forEach(p => p.mesh.material.color.set(0xff0000));
    drawParams.selectedPoints = [];
  },

  clearAll: () => {
    drawParams.points.forEach(p => { scene.remove(p.mesh); scene.remove(p.labelSprite); });
    drawParams.lines.forEach(l => { scene.remove(l.line); if(l.lengthSprite) scene.remove(l.lengthSprite); if(l.angleSprite) scene.remove(l.angleSprite); });
    drawParams.points = [];
    drawParams.lines = [];
    drawParams.selectedPoints = [];
    drawParams.selectedLines = [];
  },


  help: () => {
    alert(`📖 Hướng dẫn:
1. "➕ Thêm điểm": thêm điểm ngẫu nhiên.
2. Click 2 điểm để nối thành đường.
3. GUI điểm: cập nhật vị trí.
4. GUI đường: chỉnh chiều dài, xem góc nếu chọn 2 đường chung 1 điểm.
5. Click đường: chọn (màu vàng).
6. "🗑️ Xóa tất cả": xóa toàn bộ.`)
  }
};

// ===== GUI =====
const guiDraw = guiHelper.addTab("Vẽ minh họa", 350, { icon: "✏️", label: "Vẽ minh họa" });
guiDraw.add(drawParams, "addPoint").name("➕ Thêm điểm");
guiDraw.add(drawParams, "clearAll").name("🗑️ Xóa tất cả");
// ===== Thêm trạng thái hiển thị dạng checkbox =====
drawParams.showValues = true; // mặc định hiển thị

// ===== Thêm checkbox trong GUI =====
guiDraw.add(drawParams, "showValues").name("Hiển thị giá trị").onChange((val) => {
  // Cập nhật nhãn độ dài và góc
  drawParams.lines.forEach(l => {
    if (l.lengthSprite) l.lengthSprite.visible = val;
    if (l.angleSprite) l.angleSprite.visible = val;
  });
});
const edgeTab = guiHelper.addTab("Cạnh", 250, { icon: "🛠️", label: "Cạnh & Trung điểm" });
function createPerpendicularPoint(point, lineObj) {
  const p = point.mesh.position;
  const a = lineObj.p1.mesh.position;
  const b = lineObj.p2.mesh.position;

  const ab = new THREE.Vector3().subVectors(b, a);
  const ap = new THREE.Vector3().subVectors(p, a);

  // Chiếu AP lên AB
  const t = ap.dot(ab) / ab.lengthSq();
  const proj = a.clone().add(ab.multiplyScalar(t));

  // Tạo điểm vuông góc
  drawParams.addPoint(proj.x, proj.y, proj.z);

  // Vẽ đường vuông góc từ point đến điểm vuông góc
  const geometry = new THREE.BufferGeometry().setFromPoints([p.clone(), proj.clone()]);
  const material = new THREE.LineBasicMaterial({ color: 0xff00ff });
  const line = new THREE.Line(geometry, material);
  scene.add(line);
}

function updateEdgeListGUI() {
  // Xóa folder cũ nếu có
  if (edgeTab.__folders) {
    Object.values(edgeTab.__folders).forEach(f => edgeTab.removeFolder(f));
  }

  drawParams.lines.forEach((lineObj, index) => {
    const f = edgeTab.addFolder(`Đường ${lineObj.label}`);

    // Nút tạo trung điểm
    f.add({ createMidpoint: () => {
      const midPos = new THREE.Vector3().addVectors(lineObj.p1.mesh.position, lineObj.p2.mesh.position).multiplyScalar(0.5);
      drawParams.addPoint(midPos.x, midPos.y, midPos.z);
    } }, 'createMidpoint').name('Tạo trung điểm');

    f.open();
  });
}

guiDraw.add(drawParams, "help").name("❓ Trợ giúp");

// ===== Raycaster =====
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// ===== Hàm tạo nhãn nhỏ hơn =====
function createLabelSprite(text, color = "#000000") {
  // Đo độ dài text để tính canvas
  const fontSize = 14;
  const padding = 20;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  ctx.font = `${fontSize}px Arial`;
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = fontSize;

  canvas.width = textWidth + padding;
  canvas.height = textHeight + padding;

  // Vẽ text
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, depthTest: false });
  const sprite = new THREE.Sprite(spriteMaterial);

  // Scale: chia cho 10 để nhãn vừa trong scene
  const scaleFactor = 0.1;
  sprite.scale.set(canvas.width * scaleFactor, canvas.height * scaleFactor, 1);

  scene.add(sprite);
  return sprite;
}


// ===== Hàm vẽ cung góc =====
function createAngleArc(shared, other1, other2, radius = 5, segments = 16) {
  const v1 = new THREE.Vector3().subVectors(other1.mesh.position, shared.mesh.position).normalize();
  const v2 = new THREE.Vector3().subVectors(other2.mesh.position, shared.mesh.position).normalize();
  const angle = v1.angleTo(v2);

  const axis = new THREE.Vector3().crossVectors(v1, v2).normalize();
  const arcPoints = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments * angle;
    const q = new THREE.Quaternion().setFromAxisAngle(axis, t);
    const point = v1.clone().applyQuaternion(q).multiplyScalar(radius).add(shared.mesh.position);
    arcPoints.push(point);
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(arcPoints);
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const arc = new THREE.Line(geometry, material);
  scene.add(arc);
  return arc;
}

// ===== Cập nhật độ dài đường =====
function updateLineLength(lineObj) {
  const mid = new THREE.Vector3().addVectors(lineObj.p1.mesh.position, lineObj.p2.mesh.position).multiplyScalar(0.5);
  const text = `${lineObj.label} = ${lineObj._length.toFixed(2)}`;
  if (lineObj.lengthSprite) scene.remove(lineObj.lengthSprite);
  lineObj.lengthSprite = createLabelSprite(text, "#00aa00", 64, 2);
  lineObj.lengthSprite.position.copy(mid);
}

// ===== Cập nhật góc và vẽ cung =====
function updateAngles() {
  drawParams.selectedLines.forEach(l => {
    if (l.angleSprite) scene.remove(l.angleSprite);
    if (l.angleArc) scene.remove(l.angleArc);
  });

  if (drawParams.selectedLines.length === 2) {
    const l1 = drawParams.selectedLines[0];
    const l2 = drawParams.selectedLines[1];
    const pts1 = [l1.p1, l1.p2];
    const pts2 = [l2.p1, l2.p2];
    const shared = pts1.find(p => pts2.includes(p));
    if (!shared) return;

    const other1 = (l1.p1 === shared) ? l1.p2 : l1.p1;
    const other2 = (l2.p1 === shared) ? l2.p2 : l2.p1;

    const v1 = new THREE.Vector3().subVectors(other1.mesh.position, shared.mesh.position).normalize();
    const v2 = new THREE.Vector3().subVectors(other2.mesh.position, shared.mesh.position).normalize();
    const angleDeg = THREE.MathUtils.radToDeg(v1.angleTo(v2));

    // Nhãn góc
    const angleLabel = `${other1.label}${shared.label}${other2.label} = ${angleDeg.toFixed(1)}°`;
    const midPos = shared.mesh.position.clone().add(new THREE.Vector3().addVectors(other1.mesh.position, other2.mesh.position).multiplyScalar(0.25));
    l1.angleSprite = createLabelSprite(angleLabel, "#0000ff", 64, 2);
    l1.angleSprite.position.copy(midPos);
    l2.angleSprite = l1.angleSprite;

    // Vẽ cung biểu diễn góc
    l1.angleArc = createAngleArc(shared, other1, other2, 5, 16);
    l2.angleArc = l1.angleArc;

    l1.angleGUI.name(`Góc ${other1.label}${shared.label}${other2.label} (°)`);
    l1.angleGUI.setValue(angleDeg.toFixed(2));
    l2.angleGUI.setValue(angleDeg.toFixed(2));
  }
}

// ===== Cập nhật vị trí nhãn khi di chuyển điểm =====
function updateLinesConnected(point) {
  drawParams.lines.forEach(lineObj => {
    if (lineObj.p1 === point || lineObj.p2 === point) {
      updateLineGeometry(lineObj);
      lineObj._length = lineObj.p1.mesh.position.distanceTo(lineObj.p2.mesh.position);
      updateLineLength(lineObj);
    }
  });
  updateAngles();
}

// ===== Cập nhật geometry đường =====
function updateLineGeometry(lineObj) {
  lineObj.line.geometry.setFromPoints([lineObj.p1.mesh.position.clone(), lineObj.p2.mesh.position.clone()]);
}

function onMouseClick(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  // ---- Chọn vector (ArrowHelper) ----
const allArrowMeshes = vectorsHistory.flatMap(v => v.meshes);
const intersectsArrow = raycaster.intersectObjects(allArrowMeshes);

if (intersectsArrow.length > 0) {
  const mesh = intersectsArrow[0].object;
  const vObj = vectorsHistory.find(v => v.meshes.includes(mesh));

  if (!selectedVectors.includes(vObj)) {
    selectedVectors.push(vObj);
    vObj.arrow.setColor(new THREE.Color(0xffff00)); // đổi màu
  }

  // Nếu chọn quá 2 thì bỏ cái đầu
  if (selectedVectors.length > 2) {
    const removed = selectedVectors.shift();
    removed.arrow.setColor(new THREE.Color(0x00ff00));
  }

  console.log("Đã chọn:", selectedVectors);
  return;
}


  // ---- Chọn điểm (như code cũ) ----
  const intersectsPoint = raycaster.intersectObjects(drawParams.points.map(p => p.mesh));
  if (intersectsPoint.length > 0) {
    const mesh = intersectsPoint[0].object;
    const p = drawParams.points.find(p => p.mesh === mesh);
    if (!drawParams.selectedPoints.includes(p)) {
      drawParams.selectedPoints.push(p);
      mesh.material.color.set(0x0000ff);
    }
    if (drawParams.selectedPoints.length === 2) drawParams.connectSelected();
    return;
  }

  // ---- Chọn đường (như code cũ) ----
  const intersectsLine = raycaster.intersectObjects(drawParams.lines.map(l => l.line));
  if (intersectsLine.length > 0) {
    const mesh = intersectsLine[0].object;
    const lineObj = drawParams.lines.find(l => l.line === mesh);
    if (!drawParams.selectedLines.includes(lineObj)) {
      drawParams.selectedLines.push(lineObj);
      mesh.material.color.set(0xffff00);
    }
    if (drawParams.selectedLines.length > 2) {
      const removed = drawParams.selectedLines.shift();
      removed.line.material.color.set(0x00ff00);
    }
    updateAngles();
  }
}

renderer.domElement.addEventListener("click", onMouseClick);


// ================== VECTOR MODULE ==================

// Tham số vector và GUI
const vectorParams = {
  x1: 0, y1: 0, z1: 0,
  x2: 1, y2: 1, z2: 1,

  draw: () => drawVectorFromInput(),
  length: () => getVectorLength(),
  unit: () => getUnitVector(),
  add: () => addVectorsFromHistory(),
  sub: () => subVectorsFromHistory(),
  dot: () => dotVectorsFromHistory(),
  cross: () => crossVectorsFromHistory(),
  angle: () => angleBetweenFromHistory(),

  help: () => {
    alert(
`📖 Hướng dẫn sử dụng tab Vector:

✏️ Vẽ Vector:
- Nhập tọa độ điểm đầu (X1, Y1, Z1).
- Nhập tọa độ điểm cuối (X2, Y2, Z2).
- Nhấn "✏️ Vẽ Vector" để tạo mũi tên trong không gian 3D.

📏 Chức năng mở rộng:
- Độ dài, vector đơn vị.
- Tổng, hiệu, tích vô hướng, tích có hướng.
- Góc giữa 2 vector (chọn từ lịch sử).

🗒️ Lịch sử:
- Mỗi vector đã vẽ sẽ được lưu lại để tính toán tiếp.
`
    );
  }
};

// Tạo GUI tab
const guiVector = guiHelper.addTab("Vector", 300, { icon: "🧭", label: "Vector" });

guiVector.add(vectorParams, "x1", -10, 10, 0.1).name("X1");
guiVector.add(vectorParams, "y1", -10, 10, 0.1).name("Y1");
guiVector.add(vectorParams, "z1", -10, 10, 0.1).name("Z1");
guiVector.add(vectorParams, "x2", -10, 10, 0.1).name("X2");
guiVector.add(vectorParams, "y2", -10, 10, 0.1).name("Y2");
guiVector.add(vectorParams, "z2", -10, 10, 0.1).name("Z2");

// Nhóm Vẽ & Thông tin cơ bản
const basicFolder = guiVector.addFolder("🎯 Cơ bản");
basicFolder.add(vectorParams, "draw").name("✏️ Vẽ Vector");
basicFolder.add(vectorParams, "length").name("📏 Độ dài");
basicFolder.add(vectorParams, "unit").name("↔️ Vector đơn vị");

// Nhóm Phép toán
const calcFolder = guiVector.addFolder("⚡ Phép toán");
calcFolder.add(vectorParams, "add").name("➕ Tổng 2 vector");
calcFolder.add(vectorParams, "sub").name("➖ Hiệu 2 vector");
calcFolder.add(vectorParams, "dot").name("✴️ Tích vô hướng");
calcFolder.add(vectorParams, "cross").name("✖️ Tích có hướng");
calcFolder.add(vectorParams, "angle").name("📐 Góc giữa 2 vector");
calcFolder.add({ rel: checkVectorRelations }, "rel").name("🔎 Quan hệ 2 vector");
calcFolder.add({ dist: distanceBetweenVectors }, "dist").name("📏 Khoảng cách 2 vector");

// Nhóm Trợ giúp
const helpFolder = guiVector.addFolder("ℹ️ Khác");
helpFolder.add(vectorParams, "help").name("❓ Trợ giúp");


// ================== LOGIC ==================

let vectorsHistory = []; // lưu danh sách vector đã vẽ
let points3D = [];       // lưu điểm 3D đã add
let selectedVectors = []; // danh sách vector đã chọn

// Vẽ vector từ input
function drawVectorFromInput() {
  const { x1, y1, z1, x2, y2, z2 } = vectorParams;

  if ([x1,y1,z1,x2,y2,z2].some(v => isNaN(v))) {
    alert("⚠️ Vui lòng nhập đầy đủ và hợp lệ các tọa độ.");
    return;
  }

  const from = new THREE.Vector3(x1, y1, z1);
  const to   = new THREE.Vector3(x2, y2, z2);
  const dir  = new THREE.Vector3().subVectors(to, from);
  const len  = dir.length();

  const arrow = new THREE.ArrowHelper(dir.clone().normalize(), from, len, 0x00ff00, 1, 0.5);
  arrow.userData.vectorData = { from, dir, to };
  scene.add(arrow);
  
  vectorsHistory.push({
    from, to, dir, arrow,
    meshes: [arrow.cone, arrow.line] // 👈 thêm danh sách con để raycast
  });
  

  historyParams.addEntry(`Vector từ (${x1},${y1},${z1}) → (${x2},${y2},${z2})`);

  addPoint(from);
  addPoint(to);
}

// Vẽ điểm và nhãn
function addPoint(pos) {
  const point = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xff3333 })
  );
  point.position.copy(pos);
  scene.add(point);

  const label = createLabel(
    `(${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})`,
    pos.clone().add(new THREE.Vector3(1, 1, 0)),
    '#fff'
  );

  points3D.push({ point, label, pos: pos.clone() });
}

// ===== Hàm dựng vector ảo nét đứt (dịch v2 về chung gốc với v1) =====
function makeDashedClone(vObj1, vObj2, color = 0xff0000) {
  const origin = vObj1.from.clone();
  const v2 = vObj2.dir.clone();
  const dashedEnd = origin.clone().add(v2);

  const dashedGeometry = new THREE.BufferGeometry().setFromPoints([
    origin,
    dashedEnd
  ]);
  const dashedMaterial = new THREE.LineDashedMaterial({
    color,
    dashSize: 0.2,
    gapSize: 0.1
  });
  const dashedLine = new THREE.Line(dashedGeometry, dashedMaterial);
  dashedLine.computeLineDistances();
  scene.add(dashedLine);

  return { origin, dashedDir: v2.clone(), dashedLine };
}

// ===== Lấy 2 vector đã đưa về cùng gốc =====
function getTwoVectorsUnified() {
  if (selectedVectors.length < 2) {
    alert("⚠️ Vui lòng chọn 2 vector (click vào mũi tên).");
    return null;
  }

  const vObj1 = selectedVectors[0];
  const vObj2 = selectedVectors[1];

  // Dựng vector ảo nét đứt cho v2 về gốc của v1
  const { origin, dashedDir, dashedLine } = makeDashedClone(vObj1, vObj2);

  // Lưu tham chiếu để xóa khi cần
  vObj1.dashedLine && scene.remove(vObj1.dashedLine);
  vObj2.dashedLine && scene.remove(vObj2.dashedLine);
  vObj2.dashedLine = dashedLine;

  return { v1: vObj1.dir.clone(), v2: dashedDir, base: origin };
}
// ===== Vẽ cung góc giữa 2 vector (dùng vector ảo nét đứt) =====
function createVectorAngleArcWithDashed(vObj1, vObj2, radius = 2, segments = 32) {
  // Lấy gốc chung
  const origin = vObj1.from.clone();

  // Vector gốc và vector ảo đã dịch
  const v1 = vObj1.dir.clone().normalize();
  const v2 = vObj2.dir.clone().normalize();

  // Tạo quaternion để quay từ v1 sang v2
  const angle = v1.angleTo(v2);
  const axis = new THREE.Vector3().crossVectors(v1, v2).normalize();

  // Nếu 2 vector song song → không tạo cung
  if (axis.length() < 1e-6) {
    return { arc: null };
  }

  // Tạo các điểm cung tròn
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * angle;
    const q = new THREE.Quaternion().setFromAxisAngle(axis, t);
    const dir = v1.clone().applyQuaternion(q);
    points.push(origin.clone().add(dir.multiplyScalar(radius)));
  }

  // Vẽ cung nét liền
  const arcGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const arcMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
  const arc = new THREE.Line(arcGeometry, arcMaterial);
  scene.add(arc);

  return { arc };
}

// ===== Các phép toán =====
// ===== Kiểm tra quan hệ giữa 2 vector =====
function checkVectorRelations() {
  const two = getTwoVectorsUnified(); if (!two) return;

  const { v1, v2, base } = two;
  const dot = v1.dot(v2);
  const cross = new THREE.Vector3().crossVectors(v1, v2);
  const isOrthogonal = Math.abs(dot) < 1e-6;
  const isParallel   = cross.length() < 1e-6;
  let isSame         = false;

  // Kiểm tra trùng nhau: song song + cùng hướng + cùng gốc
  if (isParallel) {
    const ratioX = v1.x !== 0 ? v2.x / v1.x : null;
    const ratioY = v1.y !== 0 ? v2.y / v1.y : null;
    const ratioZ = v1.z !== 0 ? v2.z / v1.z : null;

    // Lấy các tỉ số hợp lệ (không NaN, không Infinity)
    const ratios = [ratioX, ratioY, ratioZ].filter(r => r !== null && isFinite(r));
    if (ratios.length > 0 && ratios.every(r => Math.abs(r - ratios[0]) < 1e-6)) {
      // Cùng gốc?
      const sameOrigin = selectedVectors[0].from.distanceTo(selectedVectors[1].from) < 1e-6;
      isSame = sameOrigin;
    }
  }

  let msg = "📊 Quan hệ giữa 2 vector:\n";
  msg += isOrthogonal ? "✅ Vuông góc\n" : "❌ Không vuông góc\n";
  msg += isParallel   ? "✅ Song song\n" : "❌ Không song song\n";
  msg += isSame       ? "✅ Trùng nhau\n" : "❌ Không trùng nhau\n";

  alert(msg);
}

// ===== Khoảng cách giữa 2 vector =====
function distanceBetweenVectors() {
  if (selectedVectors.length < 2) {
    return alert("⚠️ Vui lòng chọn 2 vector.");
  }

  const a1 = selectedVectors[0].from.clone();
  const a2 = selectedVectors[0].to.clone();
  const b1 = selectedVectors[1].from.clone();
  const b2 = selectedVectors[1].to.clone();

  const u = new THREE.Vector3().subVectors(a2, a1);
  const v = new THREE.Vector3().subVectors(b2, b1);
  const w0 = new THREE.Vector3().subVectors(a1, b1);

  const uxv = new THREE.Vector3().crossVectors(u, v);
  const denom = uxv.length();

  let dist;
  if (denom < 1e-6) {
    // 2 vector song song → lấy khoảng cách từ điểm đến đường
    const w0xu = new THREE.Vector3().crossVectors(w0, u);
    dist = w0xu.length() / u.length();
  } else {
    dist = Math.abs(w0.dot(uxv)) / denom;
  }

  alert(`📏 Khoảng cách giữa 2 vector = ${dist.toFixed(3)}`);
}

// Độ dài vector cuối cùng
function getVectorLength() {
  if (vectorsHistory.length === 0) return alert("⚠️ Chưa có vector nào.");
  const v = vectorsHistory.at(-1).dir;
  alert(`📏 Độ dài = ${v.length().toFixed(3)}`);
}

// Vector đơn vị
function getUnitVector() {
  if (vectorsHistory.length === 0) return alert("⚠️ Chưa có vector nào.");
  const v = vectorsHistory.at(-1).dir.clone().normalize();
  alert(`↔️ Vector đơn vị = (${v.x.toFixed(3)}, ${v.y.toFixed(3)}, ${v.z.toFixed(3)})`);
}

// Cộng vector
function addVectorsFromHistory() {
  const two = getTwoVectorsUnified(); if (!two) return;
  const result = new THREE.Vector3().addVectors(two.v1, two.v2);
  drawResultVector(two.base, result, 0x0000ff, "➕ Tổng");
}

// Trừ vector
function subVectorsFromHistory() {
  const two = getTwoVectorsUnified(); if (!two) return;
  const result = new THREE.Vector3().subVectors(two.v1, two.v2);
  drawResultVector(two.base, result, 0xff00ff, "➖ Hiệu");
}

// Dot
function dotVectorsFromHistory() {
  const two = getTwoVectorsUnified(); if (!two) return;
  const dot = two.v1.dot(two.v2);
  alert(`✴️ Tích vô hướng = ${dot.toFixed(3)}`);
}

// Cross
function crossVectorsFromHistory() {
  const two = getTwoVectorsUnified(); if (!two) return;
  const cross = new THREE.Vector3().crossVectors(two.v1, two.v2);
  drawResultVector(two.base, cross, 0xff8800, "✖️ Cross");
}

// ===== Góc giữa 2 vector =====
function angleBetweenFromHistory() {
  const two = getTwoVectorsUnified(); if (!two) return;

  const { v1, v2, base } = two;
  const cosTheta = v1.dot(v2) / (v1.length() * v2.length());
  const angleRad = Math.acos(THREE.MathUtils.clamp(cosTheta, -1, 1));
  const angleDeg = THREE.MathUtils.radToDeg(angleRad);

  alert(`📐 Góc = ${angleDeg.toFixed(2)}°`);

  // Vẽ cung
  if (selectedVectors.length === 2) {
    if (selectedVectors[0].angleArc) scene.remove(selectedVectors[0].angleArc);
    if (selectedVectors[1].angleArc) scene.remove(selectedVectors[1].angleArc);

    const { arc } = createVectorAngleArcWithDashed(
      selectedVectors[0],
      selectedVectors[1],
      2,
      32
    );

    selectedVectors[0].angleArc = arc;
    selectedVectors[1].angleArc = arc;
  }
}

// ===== Vẽ vector kết quả =====
function drawResultVector(origin, dir, color, name) {
  const arrow = new THREE.ArrowHelper(dir.clone().normalize(), origin, dir.length(), color, 1, 0.5);
  scene.add(arrow);
  historyParams.addEntry(`${name}: (${dir.x.toFixed(2)}, ${dir.y.toFixed(2)}, ${dir.z.toFixed(2)})`);
}




// Tạo container trong GUI
const handControlParams = {
  enabled: false,
  sensitivity: 1.0,
  cameraOn: false, // 👈 trạng thái bật/tắt cam
};

const guiHand = guiHelper.addTab("Cử chỉ tay", 300, { icon: "🖐️", label: "Cử chỉ tay" });
guiHand.add(handControlParams, "enabled").name("✅ Kích hoạt");
guiHand.add(handControlParams, "sensitivity", 0.1, 3, 0.1).name("🎚️ Độ nhạy");

// ========== Tạo khung giao diện trong GUI ==========

// Container riêng để tránh đè lên nút close
const handContainer = document.createElement("div");
handContainer.style.display = "flex";
handContainer.style.flexDirection = "column";
handContainer.style.gap = "8px";
handContainer.style.marginTop = "28px"; // chừa khoảng trên cho nút close

// Trạng thái camera
const statusEl = document.createElement("div");
statusEl.style.padding = "4px";
statusEl.style.fontSize = "14px";
statusEl.style.color = "#0f0";
statusEl.textContent = "⌛ Đang chờ bật camera...";
handContainer.appendChild(statusEl);

// Video ẩn để xử lý
const videoElement = document.createElement("video");
videoElement.autoplay = true;
videoElement.playsInline = true;
videoElement.muted = true;
videoElement.style.display = "none"; 
handContainer.appendChild(videoElement);

// Canvas hiển thị camera + xử lý
const canvasElement = document.createElement("canvas");
canvasElement.width = 640;
canvasElement.height = 480;
canvasElement.style.width = "100%";
canvasElement.style.border = "1px solid #333";
canvasElement.style.borderRadius = "8px";
const canvasCtx = canvasElement.getContext("2d");
handContainer.appendChild(canvasElement);

// Nút bật/tắt camera
const camBtn = document.createElement("button");
camBtn.textContent = "📷 Bật Camera";
camBtn.style.padding = "6px 10px";
camBtn.style.borderRadius = "6px";
camBtn.style.border = "1px solid #555";
camBtn.style.background = "#222";
camBtn.style.color = "#0f0";
camBtn.style.cursor = "pointer";
camBtn.style.alignSelf = "flex-start";
handContainer.appendChild(camBtn);

// Thêm container vào tab GUI
guiHand.domElement.appendChild(handContainer);

function setStatus(msg) {
  statusEl.textContent = msg;
}

// Khởi tạo Mediapipe Hands
const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.5
});

hands.onResults((results) => {
  if (!handControlParams.enabled) return; // 🚫 tắt nếu chưa bật

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    setStatus(`🙌 Phát hiện ${results.multiHandLandmarks.length} bàn tay`);

    // Vẽ tất cả bàn tay
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 1 });
      drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 1 });
    }

    const hand1 = results.multiHandLandmarks[0];

    // 👉 Xoay camera theo ngón trỏ bàn tay đầu tiên
    const indexFinger = hand1[8];
    const rotateX = indexFinger.x - 0.5;
    const rotateY = indexFinger.y - 0.5;

    camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -rotateX * 0.1 * handControlParams.sensitivity);
    camera.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), -rotateY * 0.1 * handControlParams.sensitivity);

    // 👉 Di chuyển (pan) camera theo vị trí cổ tay bàn tay đầu tiên
    const wrist = hand1[0];
    const moveX = (wrist.x - 0.5) * 2 * handControlParams.sensitivity;
    const moveY = (wrist.y - 0.5) * 2 * handControlParams.sensitivity;

    camera.position.x += moveX;
    camera.position.y -= moveY; // canvas Y ngược
    controls.target.x += moveX;
    controls.target.y -= moveY;

    // 👉 Zoom nếu có đủ 2 bàn tay theo khoảng cách giữa cổ tay
    if (results.multiHandLandmarks.length >= 2) {
      const hand2 = results.multiHandLandmarks[1];
      const wrist1 = hand1[0];
      const wrist2 = hand2[0];

      const dx = wrist1.x - wrist2.x;
      const dy = wrist1.y - wrist2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      camera.position.multiplyScalar(
        1 + (0.5 - dist) * 0.05 * handControlParams.sensitivity
      );
    }

    camera.lookAt(controls.target);
    controls.update();

  } else {
    setStatus("🕵️ Không phát hiện bàn tay nào");
  }

  canvasCtx.restore();
});


// Khởi tạo Camera nhưng chưa start
const cameraHand = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 640,
  height: 480
});

// Toggle camera khi nhấn nút
camBtn.addEventListener("click", () => {
  if (!handControlParams.cameraOn) {
    cameraHand.start().then(() => {
      setStatus("🎥 Camera đã bật. Đang nhận diện bàn tay...");
      camBtn.textContent = "📴 Tắt Camera";
      handControlParams.cameraOn = true;
    }).catch((err) => {
      setStatus("❌ Không mở được camera: " + err.message);
    });
  } else {
    // Dừng camera thủ công
    if (videoElement.srcObject) {
      videoElement.srcObject.getTracks().forEach(track => track.stop());
      videoElement.srcObject = null;
    }
    setStatus("⏹️ Camera đã tắt.");
    camBtn.textContent = "📷 Bật Camera";
    handControlParams.cameraOn = false;
  }
});







let gridHelper = new THREE.GridHelper(100, 20);
scene.add(gridHelper);

// Light
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(50, 50, 100);
scene.add(light);

// Hàm tạo trục
let axisGroup = new THREE.Group(); // Nhóm chứa các trục
scene.add(axisGroup);

function createFullAxis(axis = 'x', length = 50, color = 0xffffff) {
  const dirMap = {
    x: new THREE.Vector3(1, 0, 0),
    y: new THREE.Vector3(0, 1, 0),
    z: new THREE.Vector3(0, 0, 1)
  };

  const dir = dirMap[axis];
  if (!dir) return;

  // Đường trục từ -length đến +length
  const points = [
    dir.clone().multiplyScalar(-length),
    dir.clone().multiplyScalar(length)
  ];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color });
  const line = new THREE.Line(geometry, material);
  axisGroup.add(line); // ✅ Thêm vào group

  // Mũi tên dương
  const arrowPos1 = dir.clone().multiplyScalar(length);
  const arrow1 = new THREE.ArrowHelper(dir.clone().normalize(), arrowPos1, 3, color, 1, 0.5);
  axisGroup.add(arrow1); // ✅

  // Mũi tên âm
  const dirNeg = dir.clone().negate();
  const arrowPos2 = dirNeg.clone().multiplyScalar(length);
  const arrow2 = new THREE.ArrowHelper(dirNeg.normalize(), arrowPos2, 3, color, 1, 0.5);
  axisGroup.add(arrow2); // ✅
}

// Gọi các trục như trước
createFullAxis('x', 50, 0xff0000);
createFullAxis('y', 50, 0x00ff00);
createFullAxis('z', 50, 0x00ffff);

// Labels
function createLabel(text, pos, color) {
  const div = document.createElement('div');
  div.textContent = text;
  div.style.color = color;
  div.style.fontWeight = 'bold';
  const label = new THREE.CSS2DObject(div);
  label.position.copy(pos);
  axisGroup.add(label); // 🟢 add vào group luôn
  return label; // ✅ trả về đối tượng label

}
const oLabel = createLabel('.', new THREE.Vector3(0, 0, 0), 'white');
const xLabel = createLabel('X', new THREE.Vector3(55, 0, 0), 'red');
const yLabel = createLabel('Y', new THREE.Vector3(0, 55, 0), 'lime');
const zLabel = createLabel('Z', new THREE.Vector3(0, 0, 55), 'cyan');

let axisTicksGroup = new THREE.Group(); // Nhóm để dễ ẩn/hiện tất cả tick


// Dùng nhóm để chứa tất cả ticks
function addAxisTicks(axis = 'x', step = 5, min = -50, max = 50, color = 'white') {
  const dirVectors = {
    x: {
      from: (i) => [new THREE.Vector3(i, -0.5, 0), new THREE.Vector3(i, 0.5, 0)],
      pos: (i) => new THREE.Vector3(i, 0, 0)
    },
    y: {
      from: (i) => [new THREE.Vector3(-0.5, i, 0), new THREE.Vector3(0.5, i, 0)],
      pos: (i) => new THREE.Vector3(0, i, 0)
    },
    z: {
      from: (i) => [new THREE.Vector3(0, -0.5, i), new THREE.Vector3(0, 0.5, i)],
      pos: (i) => new THREE.Vector3(0, 0, i)
    }
  };

  const data = dirVectors[axis];
  if (!data) return;

  const material = new THREE.LineBasicMaterial({ color });

  for (let i = min; i <= max; i += step) {
    if (i === 0) continue;

    const points = data.from(i);
    const tick = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      material
    );
    axisTicksGroup.add(tick);

    const label = createLabel(`${i}`, data.pos(i), color);
    axisTicksGroup.add(label);
  }
}

function updateAxisAllGUI() {
  const {
    axisLength, axisColor, showAxisLabels, showAxisTicks,
    step, min, max, labelX, labelY, labelZ
  } = displayParams;

  // clear cũ
  axisGroup.clear();
  axisTicksGroup.clear();

  const labelMap = { x: labelX, y: labelY, z: labelZ };

  ["x", "y", "z"].forEach(axis => {
    // Tạo trục
    createFullAxis(axis, axisLength, new THREE.Color(axisColor));

    if (showAxisLabels) {
      const labelPos = {
        x: new THREE.Vector3(axisLength + 5, 0, 0),
        y: new THREE.Vector3(0, axisLength + 5, 0),
        z: new THREE.Vector3(0, 0, axisLength + 5),
      };
      const labelColor = { x: "red", y: "lime", z: "cyan" };
      createLabel(labelMap[axis], labelPos[axis], labelColor[axis]);
    }

    if (showAxisTicks) {
      addAxisTicks(axis, step, min, max, axisColor);
    }
  });

  if (showAxisLabels) {
    createLabel(".", new THREE.Vector3(0, 0, 0), "white");
  }
}

// Thêm ticks 1 lần
addAxisTicks('x', 5, -50, 50, 'white');
addAxisTicks('y', 5, -50, 50, 'white');
addAxisTicks('z', 5, -50, 50, 'white');
scene.add(axisTicksGroup);

function createFormulaLabel(text, position = new THREE.Vector3(0, 0, 0)) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 128;

  ctx.fillStyle = 'white';
  ctx.font = 'bold 32px monospace';
  ctx.fillText(text, 20, 80);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);

  sprite.scale.set(10, 2.5, 1); // tùy chỉnh kích thước
  sprite.position.copy(position.clone().add(new THREE.Vector3(0, 5, 0))); // đặt phía trên đồ thị

  return sprite;
}

// ✅ Hàm nội suy tuyến tính
const lerp = (a, b, t) => a + (b - a) * t;

// ✅ Tạo điểm từ hàm 1 biến
function createParametricPoints(fn, [t0, t1], steps) {
  return Array.from({ length: steps + 1 }, (_, i) => fn(lerp(t0, t1, i / steps)));
}

// ✅ Tạo đoạn nối từ hàm 2 biến (u, v)
function createParametricSegments(fn, [u0, u1], [v0, v1], segments) {
  const points = [];

  for (let i = 1; i < segments; i++) {
    const u = lerp(u0, u1, i / segments);
    for (let j = 0; j < segments; j++) {
      const v1a = lerp(v0, v1, j / segments);
      const v1b = lerp(v0, v1, (j + 1) / segments);
      points.push(fn(u, v1a), fn(u, v1b)); // vĩ tuyến
    }
  }

  for (let j = 0; j < segments; j++) {
    const v = lerp(v0, v1, j / segments);
    for (let i = 0; i < segments; i++) {
      const u1a = lerp(u0, u1, i / segments);
      const u1b = lerp(u0, u1, (i + 1) / segments);
      points.push(fn(u1a, v), fn(u1b, v)); // kinh tuyến
    }
  }

  return points;
}
// geometryFunctions.js

// 🎯 Mặt cầu 3D
function sphere3D(theta, phi, r = 5) {
  return new THREE.Vector3(
    r * Math.sin(theta) * Math.cos(phi),
    r * Math.sin(theta) * Math.sin(phi),
    r * Math.cos(theta)
  );
}

// ❤️ Trái tim 3D
function heart3D(t, s = 2.5) {
  return new THREE.Vector3(
    s * 16 * Math.pow(Math.sin(t), 3),
    s * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
    s * 4 * Math.sin(2 * t)
  );
}
// 🔷 Hình xuyến (Torus)
function torus3D(u, v, R = 4, r = 1.5) {
  return new THREE.Vector3(
    (R + r * Math.cos(v)) * Math.cos(u),
    (R + r * Math.cos(v)) * Math.sin(u),
    r * Math.sin(v)
  );
}

// 🔷 Sóng Sin 3D
function wave3D(x, z, A = 1, f = 1) {
  return new THREE.Vector3(
    x,
    A * Math.sin(f * (x ** 2 + z ** 2)),
    z
  );
}

// 🔷 Hình xoắn ốc
function spiral3D(t, a = 0.1, b = 0.2) {
  return new THREE.Vector3(
    a * t * Math.cos(t),
    a * t * Math.sin(t),
    b * t
  );
}

// 🔷 Mặt yên ngựa (Hyperbolic Paraboloid)
function saddle3D(x, z) {
  return new THREE.Vector3(
    x,
    x * x - z * z,
    z
  );
}

// 🔷 Elipsoid
function ellipsoid3D(theta, phi, rx = 4, ry = 2, rz = 1.5) {
  return new THREE.Vector3(
    rx * Math.sin(theta) * Math.cos(phi),
    ry * Math.sin(theta) * Math.sin(phi),
    rz * Math.cos(theta)
  );
}
// 🔶 Mặt Parabol 3D
function paraboloid3D(x, z, a = 0.5) {
  return new THREE.Vector3(
    x,
    a * (x * x + z * z),
    z
  );
}
// 🔶 Mặt sóng Sin-Cos 3D
function sincosWave3D(x, z, a = 1) {
  return new THREE.Vector3(
    x,
    a * Math.sin(x) * Math.cos(z),
    z
  );
}
// 🔶 Mobius Strip (Dải Mobius)
function mobius3D(u, v, R = 2) {
  const halfV = v / 2;
  return new THREE.Vector3(
    Math.cos(u) * (R + halfV * Math.cos(u / 2)),
    Math.sin(u) * (R + halfV * Math.cos(u / 2)),
    halfV * Math.sin(u / 2)
  );
}
// 🔶 Hình Chóp Xoay (Cone)
function cone3D(theta, h, r = 1) {
  return new THREE.Vector3(
    r * (1 - h) * Math.cos(theta),
    h,
    r * (1 - h) * Math.sin(theta)
  );
}
// 🔶 Cycloid 3D
function cycloid3D(t, r = 1) {
  return new THREE.Vector3(
    r * (t - Math.sin(t)),
    0,
    r * (1 - Math.cos(t))
  );
}

// 🎯 Tạo các đối tượng hình học
const heart = new THREE.LineLoop(
  new THREE.BufferGeometry().setFromPoints(createParametricPoints(heart3D, [0, Math.PI * 2], 500)),
  new THREE.LineBasicMaterial({ color: 0xff66cc })
);

const sphere = new THREE.LineSegments(
  new THREE.BufferGeometry().setFromPoints(createParametricSegments(sphere3D, [0, Math.PI], [0, Math.PI * 2], 30)),
  new THREE.LineBasicMaterial({ color: 0x66ccff })
);

const torus = new THREE.LineSegments(
  new THREE.BufferGeometry().setFromPoints(createParametricSegments(torus3D, [0, Math.PI * 2], [0, Math.PI * 2], 50)),
  new THREE.LineBasicMaterial({ color: 0xffcc00 })
);

const spiral = new THREE.LineLoop(
  new THREE.BufferGeometry().setFromPoints(createParametricPoints(spiral3D, [0, 10 * Math.PI], 1000)),
  new THREE.LineBasicMaterial({ color: 0x00ff99 })
);

const wave = new THREE.LineSegments(
  new THREE.BufferGeometry().setFromPoints(createParametricSegments(wave3D, [-5, 5], [-5, 5], 50)),
  new THREE.LineBasicMaterial({ color: 0x3366ff })
);

const saddle = new THREE.LineSegments(
  new THREE.BufferGeometry().setFromPoints(createParametricSegments(saddle3D, [-3, 3], [-3, 3], 50)),
  new THREE.LineBasicMaterial({ color: 0xff6666 })
);

const ellipsoid = new THREE.LineSegments(
  new THREE.BufferGeometry().setFromPoints(createParametricSegments(ellipsoid3D, [0, Math.PI], [0, Math.PI * 2], 30)),
  new THREE.LineBasicMaterial({ color: 0x00ccff })
);
// 🔶 Mặt Parabol 3D
const paraboloid = new THREE.LineSegments(
  new THREE.BufferGeometry().setFromPoints(createParametricSegments(paraboloid3D, [-3, 3], [-3, 3], 50)),
  new THREE.LineBasicMaterial({ color: 0xcc00cc })
);

// 🔶 Sóng Sin-Cos 3D
const sincosWave = new THREE.LineSegments(
  new THREE.BufferGeometry().setFromPoints(createParametricSegments(sincosWave3D, [-5, 5], [-5, 5], 50)),
  new THREE.LineBasicMaterial({ color: 0x00cccc })
);

// 🔶 Dải Mobius
const mobius = new THREE.LineSegments(
  new THREE.BufferGeometry().setFromPoints(createParametricSegments(mobius3D, [0, Math.PI * 2], [-1, 1], 100)),
  new THREE.LineBasicMaterial({ color: 0xff9966 })
);

// 🔶 Hình Chóp Xoay (Cone)
const cone = new THREE.LineSegments(
  new THREE.BufferGeometry().setFromPoints(createParametricSegments(cone3D, [0, Math.PI * 2], [0, 1], 50)),
  new THREE.LineBasicMaterial({ color: 0x9999ff })
);

// 🔶 Cycloid 3D
const cycloid = new THREE.LineLoop(
  new THREE.BufferGeometry().setFromPoints(createParametricPoints(cycloid3D, [0, 4 * Math.PI], 300)),
  new THREE.LineBasicMaterial({ color: 0xffcc99 })
);

// ✅ Danh sách đối tượng để xử lý chung
const allObjects = {heart, sphere, torus, spiral, wave, saddle, ellipsoid, paraboloid, sincosWave, mobius, cone, cycloid};

Object.values(allObjects).forEach(obj => {
  obj.visible = false;
  scene.add(obj);
});

// Toggle visibility
function toggle(...objects) {
  objects.forEach((obj) => {
    if (obj) obj.visible = !obj.visible;
  });
}

// Vẽ đồ thị mặt
let surfaceMesh;
let formulaLabel; // thêm dòng này


function plotSurface(options = {}) {
  // Lấy tham số từ options hoặc dùng mặc định
  const {
    formula = "z=x^2+y^2",
    mode = "surface",
    resolution = 50,
    lightMode = "soft",
    xMin = -5,
    xMax = 5,
    yMin = -5,
    yMax = 5
  } = options;

  // Chuẩn hóa công thức
  let formulaRaw = formula
    .toLowerCase()
    .replace(/−/g, "-")    // dấu trừ unicode
    .replace(/×/g, "*")    // dấu nhân unicode
    .replace(/÷/g, "/")    // dấu chia unicode
    .replace(/\s+/g, "");  // xoá khoảng trắng

  // Xác định biến phụ thuộc
  let depVar = null;
  const vars = ["x", "y", "z"];
  let indepVars = [];

  for (let v of vars) {
    if (formulaRaw.startsWith(v + "=")) {
      depVar = v;
      indepVars = vars.filter(w => w !== v);
      break;
    }
  }

  if (!depVar) {
    alert("❗ Vui lòng nhập công thức dưới dạng: z = f(x, y)");
    return;
  }

  const exprBody = formulaRaw.split("=")[1];
  let expr;
  try {
    expr = math.compile(exprBody);
  } catch (e) {
    alert("Lỗi công thức: " + e.message);
    return;
  }

  // Xoá mesh cũ nếu có
  if (surfaceMesh) scene.remove(surfaceMesh);

  const geometry = new THREE.BufferGeometry();
  const stepX = (xMax - xMin) / resolution;
  const stepY = (yMax - yMin) / resolution;
  const countX = resolution + 1;
  const countY = resolution + 1;
  const points = [];

  for (let i = 0; i <= resolution; i++) {
    const u = xMin + i * stepX;
    for (let j = 0; j <= resolution; j++) {
      const v = yMin + j * stepY;
      let x = 0, y = 0, z = 0;
      const varsObj = {};
      varsObj[indepVars[0]] = u;
      varsObj[indepVars[1]] = v;
      try {
        const result = expr.evaluate(varsObj);
        if (depVar === "x") {
          x = result; y = u; z = v;
        } else if (depVar === "y") {
          x = u; y = result; z = v;
        } else {
          x = u; y = v; z = result;
        }
      } catch (e) {
        x = y = z = NaN;
      }
      points.push(x, y, z);
    }
  }

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));

  // === UV mapping ===
  const uv = [];
  for (let i = 0; i <= resolution; i++) {
    const u = xMin + i * stepX;
    for (let j = 0; j <= resolution; j++) {
      const v = yMin + j * stepY;
      const uCoord = (u - xMin) / (xMax - xMin);
      const vCoord = (v - yMin) / (yMax - yMin);
      uv.push(uCoord, vCoord);
    }
  }
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));

  if (mode === "surface") {
    const indices = [];
    for (let i = 0; i < countX - 1; i++) {
      for (let j = 0; j < countY - 1; j++) {
        const a = i * countY + j;
        const b = a + 1;
        const c = a + countY;
        const d = c + 1;
        indices.push(a, b, d, a, d, c);
      }
    }
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    let material;
    if (lightMode === "wireframe") {
      material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    } else {
      const texLoader = new THREE.TextureLoader();
      const texture = texLoader.load("https://threejsfundamentals.org/threejs/resources/images/checker.png");
      material = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        map: texture,
        metalness: 0.5,
        roughness: lightMode === "soft" ? 0.9 : 0.3,
        flatShading: lightMode === "strong",
        side: THREE.DoubleSide,
      });
    }
    surfaceMesh = new THREE.Mesh(geometry, material);
  } else {
    const group = new THREE.Group();
    for (let i = 0; i < countX; i++) {
      const linePoints = [];
      for (let j = 0; j < countY; j++) {
        const idx = i * countY + j;
        linePoints.push(new THREE.Vector3(points[idx * 3], points[idx * 3 + 1], points[idx * 3 + 2]));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(linePoints);
      group.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffff00 })));
    }
    for (let j = 0; j < countY; j++) {
      const linePoints = [];
      for (let i = 0; i < countX; i++) {
        const idx = i * countY + j;
        linePoints.push(new THREE.Vector3(points[idx * 3], points[idx * 3 + 1], points[idx * 3 + 2]));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(linePoints);
      group.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffaa00 })));
    }
    surfaceMesh = group;
  }

  scene.add(surfaceMesh);
  if (formulaLabel) scene.remove(formulaLabel);
  formulaLabel = createFormulaLabel(formulaRaw, new THREE.Vector3(0, 0, 0));
  scene.add(formulaLabel);

}

function plotPrimitive() {
  const choice = document.getElementById("primitiveShape").value;
  let mesh;
  const material = new THREE.MeshStandardMaterial({ color: 0x33ffff });

  switch (choice) {
    case 'cube':
      mesh = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), material);
      break;
    case 'sphere':
      mesh = new THREE.Mesh(new THREE.SphereGeometry(7, 32, 32), material);
      break;
    case 'cylinder':
      mesh = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 15, 32), material);
      break;
    case 'cone':
      mesh = new THREE.Mesh(new THREE.ConeGeometry(5, 15, 32), material);
      break;
    case 'circle':
      mesh = new THREE.Mesh(new THREE.CircleGeometry(8, 32), material);
      break;
    case 'ellipse':
      const ellipse = new THREE.Shape();
      ellipse.absellipse(0, 0, 8, 4, 0, Math.PI * 2, false, 0);
      const ellipseGeom = new THREE.ShapeGeometry(ellipse);
      mesh = new THREE.Mesh(ellipseGeom, material);
      break;
    case 'triangle':
      const triShape = new THREE.Shape();
      triShape.moveTo(0, 10);
      triShape.lineTo(-8.66, -5);
      triShape.lineTo(8.66, -5);
      triShape.lineTo(0, 10);
      const triGeom = new THREE.ShapeGeometry(triShape);
      mesh = new THREE.Mesh(triGeom, material);
      break;
    case 'pentagon':
      mesh = polygonMesh(5, 6, material);
      break;
    case 'hexagon':
      mesh = polygonMesh(6, 6, material);
      break;
    case 'pyramid':
      const geom = new THREE.ConeGeometry(7, 10, 4);
      mesh = new THREE.Mesh(geom, material);
      break;
    case 'plane':
      mesh = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), material);
      break;
    default:
      alert("Hãy chọn khối hình.");
      return;
  }

  mesh.position.set(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10);
  scene.add(mesh);

}

function moveCameraTo(points) {
  const center = new THREE.Vector3();
  points.forEach(p => center.add(p));
  center.divideScalar(points.length);

  camera.position.set(center.x + 10, center.y + 10, center.z + 10);
  camera.lookAt(center);
}

// Hàm hỗ trợ tạo đa giác 2D đều (pentagon, hexagon,...)
function polygonMesh(sides, radius, material) {
  const shape = new THREE.Shape();
  for (let i = 0; i <= sides; i++) {
    const angle = (i / sides) * Math.PI * 2;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  const geometry = new THREE.ShapeGeometry(shape);
  return new THREE.Mesh(geometry, material);
}

// Xuất ảnh
function saveAsPNG() {
  renderer.render(scene, camera);
  const link = document.createElement('a');
  link.download = 'screenshot.png';
  link.href = renderer.domElement.toDataURL('image/png');
  link.click();
}

let customMotionFunc = null;
let lastCompiledCode = "";

// Giữ vị trí gốc ban đầu cho các hiệu ứng như bounce
const originalPositions = new Map();
Object.values(allObjects).forEach(obj => {
  originalPositions.set(obj, obj.position.clone());
});

function animate(time) {
  requestAnimationFrame(animate);

  // Áp dụng hiệu ứng chuyển động nếu có
  Object.values(allObjects).forEach(obj => {
    if (!obj.visible) return;

    switch (sampleParams.motionEffect) {
      case "rotateY":
        obj.rotation.y += 0.01;
        break;
      case "rotateX":
        obj.rotation.x += 0.01;
        break;
      case "bounce":
        const orig = originalPositions.get(obj);
        obj.position.y = orig.y + Math.sin(time * 0.005) * 0.5;
        break;
      case "wave":
        obj.rotation.z = Math.sin(time * 0.003) * 0.3;
        obj.position.y = Math.sin(time * 0.002) * 0.4;
        break;
      case "spin":
        obj.rotation.x += 0.01;
        obj.rotation.y += 0.01;
        break;
      case "shake":
        const origShake = originalPositions.get(obj);
        obj.position.x = origShake.x + Math.sin(time * 0.02) * 0.3;
        break;
      case "circle":
        const origCircle = originalPositions.get(obj);
        obj.position.x = origCircle.x + Math.cos(time * 0.002) * 1;
        obj.position.z = origCircle.z + Math.sin(time * 0.002) * 1;
        break;
      case "waveZ":
        obj.rotation.x = Math.sin(time * 0.002) * 0.3;
        obj.position.z = Math.sin(time * 0.003) * 0.4;
        break;
      case "blink":
        if (obj.material) {
          obj.material.transparent = true; // Đảm bảo bật chế độ trong suốt
          obj.material.opacity = 0.5 + 0.5 * Math.sin(performance.now() * 0.005);
        }
        break;
      case "float":
        obj.position.y = Math.sin(time * 0.002) * 0.5;
        break;
      case "rotate":
        obj.rotation.y += 0.01;
        break;
      case "pulse":
        const s = 1 + 0.3 * Math.sin(time * 0.004);
        obj.scale.set(s, s, s);
        break;
      case "orbit":
        obj.position.x = Math.sin(time * 0.001) * 5;
        obj.position.z = Math.cos(time * 0.001) * 5;
        obj.lookAt(0, 0, 0);
        break;
      case "flashColor":
        const c = 0.5 + Math.sin(time * 0.01) * 0.5;
        obj.material.color.setRGB(c, 0.2, 1 - c);
        break;
    }

    // ✨ Chạy hiệu ứng người dùng viết
    if (sampleParams.customMotionCode.trim()) {
      try {
        // Cố tạo trước function 1 lần duy nhất (nếu khác với lần trước)
        if (sampleParams.customMotionCode !== lastCompiledCode) {
          customMotionFunc = new Function("obj", "time", sampleParams.customMotionCode);
          lastCompiledCode = sampleParams.customMotionCode;
        }
        if (typeof customMotionFunc === "function") {
          customMotionFunc(obj, time);
        }
      } catch (err) {
        console.warn("Lỗi trong custom motion code:", err.message);
        customMotionFunc = null;
      }
    }

  });
  if (autoRotate) scene.rotation.y += 0.001;

  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}
animate();
function createShape(params) {
  const type   = params.shapeType;
  const size   = params.shapeSize;
  const height = params.shapeHeight;
  const color  = params.shapeColor;

  let geometry;

  switch (type) {
    case "box":
      geometry = new THREE.BoxGeometry(size, height, size);
      break;
    case "sphere":
      geometry = new THREE.SphereGeometry(size, 32, 32);
      break;
    case "cylinder":
      geometry = new THREE.CylinderGeometry(size, size, height, 32);
      break;
    default:
      console.warn("Loại khối chưa hỗ trợ:", type);
      return;
  }

  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);

  // Đặt vị trí ngẫu nhiên để dễ nhìn
  mesh.position.set(
    (Math.random() - 0.5) * 5,
    (Math.random() - 0.5) * 5,
    (Math.random() - 0.5) * 5
  );

  scene.add(mesh);
  allObjects.push(mesh); // nếu bạn dùng để animate
}


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});
let previousCameraPos = new THREE.Vector3(); // Lưu camera cũ
let previousTarget = new THREE.Vector3();    // Lưu target cũ nếu dùng controls.target

function setViewDirection(view) {
  if (!previousCameraPos) previousCameraPos = new THREE.Vector3();
  if (!previousTarget) previousTarget = new THREE.Vector3();
  previousCameraPos.copy(camera.position);
  previousTarget.copy(controls.target);

  scene.rotation.set(0, 0, 0);

  switch (view) {
    case 'xy':
      camera.position.set(0, 100, 0);
      controls.target.set(0, 0, 0);
      controls.enableRotate = false;
      autoRotate = false;
      break;

    case 'yz':
      camera.position.set(100, 0, 0);
      controls.target.set(0, 0, 0);
      controls.enableRotate = false;
      autoRotate = false;
      break;

    case 'xz':
      camera.position.set(0, 0, 100);
      controls.target.set(0, 0, 0);
      controls.enableRotate = false;
      autoRotate = false;
      break;

    default:
      camera.position.copy(previousCameraPos);
      controls.target.copy(previousTarget);
      controls.enableRotate = true;
      autoRotate = true;
      break;
  }

  controls.update();
  camera.lookAt(controls.target);
}

//////////////
// // Các hàm được dùng trong HTML cần gán vào window
// window.drawVectorFromInput = drawVectorFromInput;
// window.plotPrimitive = plotPrimitive;
// window.plotSurface = plotSurface;
// window.plotPolar = plotPolar;
// window.plotCustom3D = plotCustom3D;
// window.updateLightMode = updateLightMode;
// window.toggle = toggle;
window.gridHelper = gridHelper;
window.axisTicksGroup = axisTicksGroup;
window.sphere = sphere; // nếu bạn đặt `sphereLine` đại diện cho mặt cầu 3D
window.heart = heart;
window.torus = torus;
window.spiral = spiral;
window.wave = wave;
window.saddle = saddle;
window.ellipsoid = ellipsoid;
window.paraboloid = paraboloid;
window.sincosWave = sincosWave;
window.mobius = mobius;
window.cone = cone;
window.cycloid = cycloid;
window.line = heart;  // nếu `line` dùng cho đường cong tùy chỉnh
window.setViewDirection = setViewDirection;
window.oLabel = oLabel;
window.xLabel = xLabel;
window.yLabel = yLabel;
window.zLabel = zLabel;
window.computeIntegral1D = computeIntegral1D;