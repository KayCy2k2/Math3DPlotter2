import { heart3D, sphere3D, torus3D, wave3D, spiral3D, saddle3D, ellipsoid3D, paraboloid3D, sincosWave3D, mobius3D, cone3D, cycloid3D } from './geometryFunctions.js';
  

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
function createAxis(direction, color) {
    const axis = new THREE.ArrowHelper(
        direction.clone().normalize(), // hướng chuẩn hóa
        new THREE.Vector3(0, 0, 0),    // gốc
        50,                            // chiều dài
        color                          // màu
    );
    scene.add(axis);
    return axis; // ⚠️ THÊM DÒNG NÀY
}

// Thêm các trục X, Y, Z
const xAxis = createAxis(new THREE.Vector3(1, 0, 0), 0xff0000); // Trục X - đỏ
const yAxis = createAxis(new THREE.Vector3(0, 1, 0), 0x00ff00); // Trục Y - xanh lá
const zAxis = createAxis(new THREE.Vector3(0, 0, 1), 0x00ffff); // Trục Z - xanh dương nhạt

// Labels
function createLabel(text, pos, color) {
    const div = document.createElement('div');
    div.textContent = text;
    div.style.color = color;
    div.style.fontWeight = 'bold';
    const label = new THREE.CSS2DObject(div);
    label.position.copy(pos);
    scene.add(label);
    return label; // ✅ trả về đối tượng label

}
const originLabel = createLabel('.', new THREE.Vector3(0, 0, 0), 'white');
const xLabel = createLabel('X', new THREE.Vector3(55, 0, 0), 'red');
const yLabel = createLabel('Y', new THREE.Vector3(0, 55, 0), 'lime');
const zLabel = createLabel('Z', new THREE.Vector3(0, 0, 55), 'cyan');


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
  const allObjects = [heart, sphere, torus, spiral, wave, saddle, ellipsoid, paraboloid, sincosWave, mobius, cone,cycloid];
  
  // ✅ Ẩn tất cả khi tải trang và thêm vào scene
  allObjects.forEach(obj => {
    obj.visible = false;
    scene.add(obj);
  });
  
// Toggle visibility
function toggle(...objects) {
    objects.forEach(obj => {
        if (obj) obj.visible = !obj.visible;
    });
}

// Vẽ đồ thị mặt
let surfaceMesh;
function plotSurface() {
    const formulaRaw = document.getElementById("inputFormula").value.toLowerCase().replace(/\s+/g, '');
    const mode = document.getElementById("mode").value;
    const resolution = parseInt(document.getElementById("resolution").value);
    const lightMode = document.getElementById("lightMode").value;

    const xMin = parseFloat(document.getElementById("xMin").value);
    const xMax = parseFloat(document.getElementById("xMax").value);
    const yMin = parseFloat(document.getElementById("yMin").value);
    const yMax = parseFloat(document.getElementById("yMax").value);

    let depVar = null;
    const vars = ['x', 'y', 'z'];
    let indepVars = [];

    for (let v of vars) {
        if (formulaRaw.startsWith(v + '=')) {
            depVar = v;
            indepVars = vars.filter(w => w !== v);
            break;
        }
    }

    if (!depVar) {
        alert('Công thức phải bắt đầu bằng x=, y=, hoặc z=');
        return;
    }

    const exprBody = formulaRaw.split('=')[1];
    let expr;
    try {
        expr = math.compile(exprBody);
    } catch (e) {
        alert('Lỗi công thức: ' + e.message);
        return;
    }

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
                if (depVar === 'x') {
                    x = result; y = u; z = v;
                } else if (depVar === 'y') {
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

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
// === TÍNH TOÁN UV MAPPING (áp dụng ánh xạ phẳng từ x,y) ===
const uv = [];
for (let i = 0; i <= resolution; i++) {
    const u = xMin + i * stepX;
    for (let j = 0; j <= resolution; j++) {
        const v = yMin + j * stepY;

        // Đưa x và y về khoảng [0,1]
        const uCoord = (u - xMin) / (xMax - xMin);
        const vCoord = (v - yMin) / (yMax - yMin); // Không đảo trục Y

        uv.push(uCoord, vCoord);
    }
}
geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));

    if (mode === 'surface') {
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
        if (lightMode === 'wireframe') {
            material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
        } else {
            const texLoader = new THREE.TextureLoader();
            const texture = texLoader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
            material = new THREE.MeshStandardMaterial({
                color: 0x00ffff,
                map: texture,
                metalness: 0.5,
                roughness: lightMode === 'soft' ? 0.9 : 0.3,
                flatShading: lightMode === 'strong',
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
    addToHistory(`Bề mặt: ${formulaRaw}`, surfaceMesh);

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
let customCurve; // lưu đường cũ để xóa trước khi vẽ mới

function plotCustom3D() {
    const tMin = parseFloat(document.getElementById("tMin").value);
    const tMax = parseFloat(document.getElementById("tMax").value);
    const res = parseInt(document.getElementById("tRes").value);

    const rawX = document.getElementById("customX").value.trim().toLowerCase();
    const rawY = document.getElementById("customY").value.trim().toLowerCase();
    const rawZ = document.getElementById("customZ").value.trim().toLowerCase();

    if (!rawX.startsWith("x = ") || !rawY.startsWith("y = ") || !rawZ.startsWith("z = ")) {
        alert("Vui lòng nhập đúng định dạng: x = ..., y = ..., z = ...");
        return;
    }

    const xExpr = rawX.split("=")[1];
    const yExpr = rawY.split("=")[1];
    const zExpr = rawZ.split("=")[1];

    let fx, fy, fz;
    try {
        fx = math.compile(xExpr);
        fy = math.compile(yExpr);
        fz = math.compile(zExpr);
    } catch (e) {
        alert("Lỗi trong công thức: " + e.message);
        return;
    }

    // Xoá đường cong cũ nếu có
    if (customCurve) scene.remove(customCurve);

    const points = [];
    for (let i = 0; i <= res; i++) {
        const t = tMin + ((tMax - tMin) * i / res);

        const context = {
            t: t,
            theta: t,
            u: t,
            v: t
        };

        try {
            const x = fx.evaluate(context);
            const y = fy.evaluate(context);
            const z = fz.evaluate(context);

            if (isFinite(x) && isFinite(y) && isFinite(z)) {
                points.push(new THREE.Vector3(x, y, z));
            }
        } catch (e) {
            console.warn("Lỗi khi đánh giá tại t =", t, ":", e.message);
        }
    }

    if (points.length < 2) {
        alert("Không đủ điểm hợp lệ để vẽ đường.");
        return;
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff44aa });
    customCurve = new THREE.Line(geometry, material);
    scene.add(customCurve);
    addToHistory(`Tùy chỉnh 3D`, customCurve);

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


// Vẽ đồ thị cực
function plotPolar() {
    const formula = document.getElementById("polarFormula").value;
    const expr = math.compile(formula);
    const points = [];

    for (let i = 0; i <= 1000; i++) {
        const theta = (i / 1000) * Math.PI * 2;
        let r = 0;
        try { r = expr.evaluate({ theta }); } catch (e) { }
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        points.push(new THREE.Vector3(x, 0, y));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const polarCurve = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xff9933 }));
    scene.add(polarCurve);
    addToHistory(`Đồ thị cực: ${formula}`, polarCurve);

}
const historyList = document.getElementById('historyList');

function addToHistory(label, object3D) {
    const li = document.createElement('li');
    li.classList.add('flex', 'justify-between', 'items-center');

    const span = document.createElement('span');
    span.textContent = label;
    span.classList.add('cursor-pointer', 'hover:text-yellow-300', 'truncate');

    let visible = true;
    span.addEventListener('click', () => {
        visible = !visible;
        object3D.visible = visible;
        span.style.textDecoration = visible ? 'none' : 'line-through';
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑';
    deleteBtn.classList.add('ml-2', 'hover:text-red-500');
    deleteBtn.addEventListener('click', () => {
        scene.remove(object3D);      // Xoá khỏi scene
        li.remove();                // Xoá khỏi giao diện lịch sử
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    historyList.appendChild(li);
}

function updateLightMode() {
    const mode = document.getElementById("lightMode").value;
    const materialType = document.getElementById("materialType").value;
    const textureInput = document.getElementById("textureImage");
    const textureLabel = document.getElementById("textureLabel");

    if (!surfaceMesh) return;

    let newMaterial;

    // Ẩn/hiện phần chọn ảnh
    if (materialType === 'texture') {
        textureInput.classList.remove("hidden");
        textureLabel.classList.remove("hidden");
    } else {
        textureInput.classList.add("hidden");
        textureLabel.classList.add("hidden");
    }

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
                if (textureInput.files && textureInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
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
            
                            applyMaterial(texturedMat); // Áp dụng texture lên surfaceMesh
                        };
                        img.src = e.target.result;
                    };
                    reader.readAsDataURL(textureInput.files[0]);
                    return; // ⚠️ QUAN TRỌNG! Tránh chạy tiếp các lệnh sau
                } else {
                    alert("Vui lòng chọn ảnh.");
                    return;
                }
            
            break;
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

  
// Xuất ảnh
function saveImage() {
    renderer.render(scene, camera);
    const link = document.createElement('a');
    link.download = 'screenshot.png';
    link.href = renderer.domElement.toDataURL('image/png');
    link.click();
}

// Auto rotate toggle
let autoRotate = true;
document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'r') autoRotate = !autoRotate;
});

function animate() {
    requestAnimationFrame(animate);
    if (autoRotate) scene.rotation.y += 0.003;
    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});
let previousCameraPos = new THREE.Vector3(); // Lưu camera cũ
let previousTarget = new THREE.Vector3();    // Lưu target cũ nếu dùng controls.target

function setViewDirection() {
    const view = document.getElementById("viewSelector").value;

    // Lưu camera trước đó nếu chưa lưu
    if (!previousCameraPos) previousCameraPos = new THREE.Vector3();
    if (!previousTarget) previousTarget = new THREE.Vector3();
    previousCameraPos.copy(camera.position);
    previousTarget.copy(controls.target);

    scene.rotation.set(0, 0, 0);

    switch (view) {
        case 'xy': // Nhìn từ trên xuống
            camera.position.set(0, 100, 0);
            controls.target.set(0, 0, 0);
            controls.enableRotate = false;
            autoRotate = false;

            if (zAxis) zAxis.visible = false;
            if (zLabel) zLabel.visible = false;
            break;

        case 'yz': // Nhìn từ trục X (trái -> phải)
            camera.position.set(100, 0, 0);
            controls.target.set(0, 0, 0);
            controls.enableRotate = false;
            autoRotate = false;

            if (xAxis) xAxis.visible = false;
            if (xLabel) xLabel.visible = false;
            break;

        case 'xz': // Nhìn từ trước (trục Y lên)
            camera.position.set(0, 0, 100);
            controls.target.set(0, 0, 0);
            controls.enableRotate = false;
            autoRotate = false;

            if (yAxis) yAxis.visible = false;
            if (yLabel) yLabel.visible = false;
            break;

        default: // Trở về 3D
            camera.position.copy(previousCameraPos);
            controls.target.copy(previousTarget);
            controls.enableRotate = true;
            autoRotate = true;

            // Hiện lại các trục
            if (xAxis) xAxis.visible = true;
            if (yAxis) yAxis.visible = true;
            if (zAxis) zAxis.visible = true;
            if (xLabel) xLabel.visible = true;
            if (yLabel) yLabel.visible = true;
            if (zLabel) zLabel.visible = true;
            break;
    }

    controls.update();
    camera.lookAt(controls.target);
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

        // Lưu vào lịch sử (tùy chọn)
        addToHistory(`Vector từ (${from.x.toFixed(1)}, ${from.y.toFixed(1)}, ${from.z.toFixed(1)}) đến (${to.x.toFixed(1)}, ${to.y.toFixed(1)}, ${to.z.toFixed(1)})`, arrow);
    }

    addToHistory(`Điểm (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})`, point);
}

function drawVectorFromInput() {
    const x1 = parseFloat(document.getElementById("x1").value);
    const y1 = parseFloat(document.getElementById("y1").value);
    const z1 = parseFloat(document.getElementById("z1").value);

    const x2 = parseFloat(document.getElementById("x2").value);
    const y2 = parseFloat(document.getElementById("y2").value);
    const z2 = parseFloat(document.getElementById("z2").value);

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

    // Thêm điểm và nhãn nếu muốn lưu
    addPoint(from);
    addPoint(to);

    addToHistory(`Vector từ (${x1}, ${y1}, ${z1}) đến (${x2}, ${y2}, ${z2})`, arrow);
}

//////////////
// Các hàm được dùng trong HTML cần gán vào window
window.drawVectorFromInput = drawVectorFromInput;
// window.toggleMiniForm = toggleMiniForm;
// window.switchTab = switchTab;
// window.toggleMenu = toggleMenu;
// window.toggleDiv = toggleDiv;
window.plotPrimitive = plotPrimitive;
window.plotSurface = plotSurface;
window.plotPolar = plotPolar;
window.plotCustom3D = plotCustom3D;
window.saveImage = saveImage;
window.updateLightMode = updateLightMode;
window.toggle = toggle;
window.gridHelper = gridHelper;
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
window. cycloid = cycloid;
window.line = heart;  // nếu `line` dùng cho đường cong tùy chỉnh
window.setViewDirection = setViewDirection;
// Gán vào window để có thể dùng trong HTML
window.xAxis = xAxis;
window.yAxis = yAxis;
window.zAxis = zAxis;
window.originLabel = originLabel;
window.xLabel = xLabel;
window.yLabel = yLabel;
window.zLabel = zLabel;
