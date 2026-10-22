// Unit test for Rubik's Cube Model
// Requirements:
// 1. Every move applied 4 times returns to identity.
// 2. 20 random moves plus their inverses return all 27 cubies to identity.

function matMul(A, B) {
  let C = [0,0,0, 0,0,0, 0,0,0];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      C[r * 3 + c] = A[r * 3 + 0] * B[0 * 3 + c] + A[r * 3 + 1] * B[1 * 3 + c] + A[r * 3 + 2] * B[2 * 3 + c];
    }
  }
  return C;
}

function vecMul(A, v) {
  return [
    A[0] * v[0] + A[1] * v[1] + A[2] * v[2],
    A[3] * v[0] + A[4] * v[1] + A[5] * v[2],
    A[6] * v[0] + A[7] * v[1] + A[8] * v[2],
  ];
}

function getRotMatrix(axis, dir) {
  if (axis === 'x') return [1, 0, 0, 0, 0, -dir, 0, dir, 0];
  if (axis === 'y') return [0, 0, dir, 0, 1, 0, -dir, 0, 0];
  if (axis === 'z') return [0, -dir, 0, dir, 0, 0, 0, 0, 1];
}

const AXIS_INDEX = { x: 0, y: 1, z: 2 };

const MOVES = {
  U: { axis: 'y', layer: -1, dir: -1 },
  D: { axis: 'y', layer: 1, dir: 1 },
  L: { axis: 'x', layer: -1, dir: -1 },
  R: { axis: 'x', layer: 1, dir: 1 },
  F: { axis: 'z', layer: 1, dir: 1 },
  B: { axis: 'z', layer: -1, dir: -1 },
};

function initCubies() {
  const cubies = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        cubies.push({
          id: `${x},${y},${z}`,
          initPos: [x, y, z],
          pos: [x, y, z],
          rot: [1, 0, 0, 0, 1, 0, 0, 0, 1],
        });
      }
    }
  }
  return cubies;
}

function applyMove(cubies, move) {
  const R = getRotMatrix(move.axis, move.dir);
  const aIdx = AXIS_INDEX[move.axis];
  return cubies.map((c) => {
    if (c.pos[aIdx] === move.layer) {
      return {
        ...c,
        pos: vecMul(R, c.pos),
        rot: matMul(R, c.rot),
      };
    }
    return c;
  });
}

function isIdentity(cubies) {
  const I = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  return cubies.every(
    (c) =>
      c.pos[0] === c.initPos[0] &&
      c.pos[1] === c.initPos[1] &&
      c.pos[2] === c.initPos[2] &&
      c.rot.every((val, idx) => val === I[idx])
  );
}

// Test 1: Each move 4x returns to identity
console.log('--- TEST 1: Each move 4x returns to identity ---');
for (const [name, move] of Object.entries(MOVES)) {
  let cubies = initCubies();
  for (let i = 0; i < 4; i++) {
    cubies = applyMove(cubies, move);
  }
  const pass = isIdentity(cubies);
  console.log(`Move ${name} applied 4x -> Identity: ${pass ? 'PASS' : 'FAIL'}`);
  if (!pass) process.exit(1);

  // Also test inverse 4x
  let cubiesInv = initCubies();
  for (let i = 0; i < 4; i++) {
    cubiesInv = applyMove(cubiesInv, { ...move, dir: -move.dir });
  }
  const passInv = isIdentity(cubiesInv);
  console.log(`Move ${name}' applied 4x -> Identity: ${passInv ? 'PASS' : 'FAIL'}`);
  if (!passInv) process.exit(1);
}

// Test 2: 20 random moves + their inverses return all 27 cubies to identity
console.log('\n--- TEST 2: 20 random moves + inverse sequence ---');
const moveKeys = Object.keys(MOVES);
const history = [];
let prevFace = '';

for (let i = 0; i < 20; i++) {
  const choices = moveKeys.filter((k) => k !== prevFace);
  const key = choices[Math.floor(Math.random() * choices.length)];
  const isInverse = Math.random() < 0.5;
  const m = MOVES[key];
  history.push({
    name: key + (isInverse ? "'" : ''),
    axis: m.axis,
    layer: m.layer,
    dir: isInverse ? -m.dir : m.dir,
  });
  prevFace = key;
}

let cubies = initCubies();
for (const m of history) {
  cubies = applyMove(cubies, m);
}

const scrambled = !isIdentity(cubies);
console.log(`Cube is scrambled after 20 moves: ${scrambled ? 'PASS' : 'FAIL'}`);
if (!scrambled) process.exit(1);

// Apply inverses in reverse order
for (let i = history.length - 1; i >= 0; i--) {
  const m = history[i];
  cubies = applyMove(cubies, { axis: m.axis, layer: m.layer, dir: -m.dir });
}

const solved = isIdentity(cubies);
console.log(`Cube returns to identity after playing inverses: ${solved ? 'PASS' : 'FAIL'}`);
if (!solved) process.exit(1);

console.log('\nALL RUBIKS CUBE UNIT TESTS PASSED!');
