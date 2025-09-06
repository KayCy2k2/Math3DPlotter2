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



  // ----- Góc nhìn -----
const viewParams = { view: "default" };
const guiView      = guiHelper.addTab("Góc Nhìn", 250, { icon: "👁️", label: "Góc Nhìn" });

guiView.add(viewParams, "view", {
"3D Tự Do": "default",
"XY (Trên)": "xy",
"YZ (Trái)": "yz",
"XZ (Trước)": "xz"
}).name("Chọn góc nhìn")
.onChange(val => setViewDirection(val));

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


// ----- Vector -----
const vectorParams = {
x1: 0, y1: 0, z1: 0,
x2: 1, y2: 1, z2: 1,
draw: () => drawVectorFromInput()
};

const guiVector    = guiHelper.addTab("Vector", 300, { icon: "🧭", label: "Vector" });

guiVector.add(vectorParams, "x1", -10, 10, 0.1).name("X1");
guiVector.add(vectorParams, "y1", -10, 10, 0.1).name("Y1");
guiVector.add(vectorParams, "z1", -10, 10, 0.1).name("Z1");
guiVector.add(vectorParams, "x2", -10, 10, 0.1).name("X2");
guiVector.add(vectorParams, "y2", -10, 10, 0.1).name("Y2");
guiVector.add(vectorParams, "z2", -10, 10, 0.1).name("Z2");

guiVector.add(vectorParams, "draw").name("✏️ Vẽ Vector");

function drawVectorFromInput() {
  const x1 = parseFloat(vectorParams.x1);
  const y1 = parseFloat(vectorParams.y1);
  const z1 = parseFloat(vectorParams.z1);

  const x2 = parseFloat(vectorParams.x2);
  const y2 = parseFloat(vectorParams.y2);
  const z2 = parseFloat(vectorParams.z2);

  if (
    isNaN(x1) || isNaN(y1) || isNaN(z1) ||
    isNaN(x2) || isNaN(y2) || isNaN(z2)
  ) {
    alert("Vui lòng nhập đầy đủ và hợp lệ các tọa độ.");
    return;
  }

  const from = new THREE.Vector3(x1, y1, z1);
  const to = new THREE.Vector3(x2, y2, z2);
  const dir = new THREE.Vector3().subVectors(to, from);
  const length = dir.length();

  const arrow = new THREE.ArrowHelper(dir.clone().normalize(), from, length, 0x00ff00);
  scene.add(arrow);

  // Lưu vào lịch sử
  const historyText = `Vector từ (${x1}, ${y1}, ${z1}) đến (${x2}, ${y2}, ${z2})`;
  historyParams.addEntry(historyText);

  // Nếu bạn có các hàm addPoint, vẫn giữ
  if (typeof addPoint === "function") {
    addPoint(from);
    addPoint(to);
  }
}
let points3D = []; // Danh sách các điểm đã thêm

function addPoint(pos) {
  // Tạo điểm
  const point = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xff3333 }).clone()
  );
  point.position.copy(pos);
  scene.add(point);

  // Tạo nhãn
  const label = createLabel(`(${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})`, pos.clone().add(new THREE.Vector3(1, 1, 0)), '#fff');

  // Lưu lại để quản lý
  points3D.push({ point, label, pos: pos.clone() });

  // Nếu có điểm trước đó thì vẽ vector (mũi tên)
  if (points3D.length >= 2) {
    const from = points3D[points3D.length - 2].pos;
    const to = pos;
    const dir = new THREE.Vector3().subVectors(to, from);
    const arrow = new THREE.ArrowHelper(dir.clone().normalize(), from.clone(), dir.length(), 0xffff00);
    scene.add(arrow);

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


// ----- Đồ thị 2D -----
const graph2DParams = {
  formula: "y = sin(x)", // công thức mặc định
  xMin: -10,
  xMax: 10,
  step: 0.1,
  plot: () => plotGraph2D()
};

// Tạo tab trong GUI
const guiGraph2D = guiHelper.addTab("Đồ thị 2D", 350, { icon: "📈", label: "Đồ thị 2D" });
guiGraph2D.add(graph2DParams, "formula").name("Công thức");
guiGraph2D.add(graph2DParams, "xMin", -50, 0, 1).name("X Min");
guiGraph2D.add(graph2DParams, "xMax", 0, 50, 1).name("X Max");
guiGraph2D.add(graph2DParams, "step", 0.01, 1, 0.01).name("Bước Δx");
guiGraph2D.add(graph2DParams, "plot").name("📈 Vẽ Đồ Thị");

// ✅ Tạo canvas trong tab GUI
const canvasWrapper = document.createElement("div");
canvasWrapper.style.width = "100%";
canvasWrapper.style.height = "250px";
canvasWrapper.style.padding = "10px";
const canvasGraph2D = document.createElement("canvas");
canvasGraph2D.id = "graph2D";
canvasGraph2D.width = 320;
canvasGraph2D.height = 240;
canvasWrapper.appendChild(canvasGraph2D);

// Chèn vào container của tab
guiGraph2D.domElement.appendChild(canvasWrapper);

// Hàm vẽ lại đồ thị 2D
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
  for (let x = graph2DParams.xMin; x <= graph2DParams.xMax; x += graph2DParams.step) {
    try {
      const y = expr.evaluate({ x });
      yValues.push(isFinite(y) ? y : null);
      xValues.push(x);
    } catch {
      xValues.push(x);
      yValues.push(null);
    }
  }

  if (window.chart2D) window.chart2D.destroy();
  const ctx = canvasGraph2D.getContext("2d"); // 👈 lấy context từ canvas trong GUI
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
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { type: "linear", title: { display: true, text: "x" } },
        y: { title: { display: true, text: "y" } }
      }
    }
  });
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



const classMappings = [
  {
    selector: '.tw-divTab',
    classes: ['space-y-6', 'text-xl', 'font-medium', 'text-white', 'm-4']
  },
  {
    selector: '.refactor-target',
    classes: ['tab-content', 'hidden', 'custom-scroll', 'overflow-auto', 'max-h-80', 'space-y-4']
  },
  {
    selector: '.tw-button',
    classes: ['border', 'px-3', 'py-1', 'rounded', 'hover:bg-green-700', 'transition', 'duration-200']
  },
  {
    selector: '.tw-select',
    classes: ['border', 'bg-transparent', 'text-white', 'rounded', 'px-3', 'py-1', 'flex-1']
  },
  {
    selector: '.tw-input',
    classes: ['flex-1', 'px-2', 'py-1', 'text-black', 'rounded']
  },
  {
    selector: '.tw-h2',
    classes: ['text-lg', 'font-semibold']
  }
];

classMappings.forEach(({ selector, classes }) => {
  document.querySelectorAll(selector).forEach(el => {
    el.classList.add(...classes);
  });
});


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
// Các hàm được dùng trong HTML cần gán vào window
window.drawVectorFromInput = drawVectorFromInput;
window.plotPrimitive = plotPrimitive;
window.plotSurface = plotSurface;
window.plotPolar = plotPolar;
window.plotCustom3D = plotCustom3D;
window.updateLightMode = updateLightMode;
window.toggle = toggle;
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