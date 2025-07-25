// geometryFunctions.js

// 🎯 Mặt cầu 3D
export function sphere3D(theta, phi, r = 5) {
  return new THREE.Vector3(
    r * Math.sin(theta) * Math.cos(phi),
    r * Math.sin(theta) * Math.sin(phi),
    r * Math.cos(theta)
  );
}

// ❤️ Trái tim 3D
export function heart3D(t, s = 2.5) {
  return new THREE.Vector3(
    s * 16 * Math.pow(Math.sin(t), 3),
    s * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
    s * 4 * Math.sin(2 * t)
  );
}
// 🔷 Hình xuyến (Torus)
export function torus3D(u, v, R = 4, r = 1.5) {
  return new THREE.Vector3(
    (R + r * Math.cos(v)) * Math.cos(u),
    (R + r * Math.cos(v)) * Math.sin(u),
    r * Math.sin(v)
  );
}

// 🔷 Sóng Sin 3D
export function wave3D(x, z, A = 1, f = 1) {
  return new THREE.Vector3(
    x,
    A * Math.sin(f * (x ** 2 + z ** 2)),
    z
  );
}

// 🔷 Hình xoắn ốc
export function spiral3D(t, a = 0.1, b = 0.2) {
  return new THREE.Vector3(
    a * t * Math.cos(t),
    a * t * Math.sin(t),
    b * t
  );
}

// 🔷 Mặt yên ngựa (Hyperbolic Paraboloid)
export function saddle3D(x, z) {
  return new THREE.Vector3(
    x,
    x * x - z * z,
    z
  );
}

// 🔷 Elipsoid
export function ellipsoid3D(theta, phi, rx = 4, ry = 2, rz = 1.5) {
  return new THREE.Vector3(
    rx * Math.sin(theta) * Math.cos(phi),
    ry * Math.sin(theta) * Math.sin(phi),
    rz * Math.cos(theta)
  );
}
// 🔶 Mặt Parabol 3D
export function paraboloid3D(x, z, a = 0.5) {
  return new THREE.Vector3(
    x,
    a * (x * x + z * z),
    z
  );
}
// 🔶 Mặt sóng Sin-Cos 3D
export function sincosWave3D(x, z, a = 1) {
  return new THREE.Vector3(
    x,
    a * Math.sin(x) * Math.cos(z),
    z
  );
}
// 🔶 Mobius Strip (Dải Mobius)
export function mobius3D(u, v, R = 2) {
  const halfV = v / 2;
  return new THREE.Vector3(
    Math.cos(u) * (R + halfV * Math.cos(u / 2)),
    Math.sin(u) * (R + halfV * Math.cos(u / 2)),
    halfV * Math.sin(u / 2)
  );
}
// 🔶 Hình Chóp Xoay (Cone)
export function cone3D(theta, h, r = 1) {
  return new THREE.Vector3(
    r * (1 - h) * Math.cos(theta),
    h,
    r * (1 - h) * Math.sin(theta)
  );
}
// 🔶 Cycloid 3D
export function cycloid3D(t, r = 1) {
  return new THREE.Vector3(
    r * (t - Math.sin(t)),
    0,
    r * (1 - Math.cos(t))
  );
}
