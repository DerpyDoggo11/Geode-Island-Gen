import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SimplexNoise } from 'three/addons/math/SimplexNoise.js';
import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js';

const TriangulationTable = [
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [0, 1, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [1, 8, 3, 9, 8, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [0, 8, 3, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [9, 2, 10, 0, 2, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [2, 8, 3, 2, 10, 8, 10, 9, 8, -1, -1, -1, -1, -1, -1, -1],
  [3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [0, 11, 2, 8, 11, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [1, 9, 0, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [1, 11, 2, 1, 9, 11, 9, 8, 11, -1, -1, -1, -1, -1, -1, -1],
  [3, 10, 1, 11, 10, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [0, 10, 1, 0, 8, 10, 8, 11, 10, -1, -1, -1, -1, -1, -1, -1],
  [3, 9, 0, 3, 11, 9, 11, 10, 9, -1, -1, -1, -1, -1, -1, -1],
  [9, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [4, 3, 0, 7, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [0, 1, 9, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [4, 1, 9, 4, 7, 1, 7, 3, 1, -1, -1, -1, -1, -1, -1, -1],
  [1, 2, 10, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [3, 4, 7, 3, 0, 4, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1],
  [9, 2, 10, 9, 0, 2, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1],
  [2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4, -1, -1, -1, -1],
  [8, 4, 7, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [11, 4, 7, 11, 2, 4, 2, 0, 4, -1, -1, -1, -1, -1, -1, -1],
  [9, 0, 1, 8, 4, 7, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1],
  [4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1, -1, -1, -1, -1],
  [3, 10, 1, 3, 11, 10, 7, 8, 4, -1, -1, -1, -1, -1, -1, -1],
  [1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4, -1, -1, -1, -1],
  [4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3, -1, -1, -1, -1],
  [4, 7, 11, 4, 11, 9, 9, 11, 10, -1, -1, -1, -1, -1, -1, -1],
  [9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [9, 5, 4, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [0, 5, 4, 1, 5, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [8, 5, 4, 8, 3, 5, 3, 1, 5, -1, -1, -1, -1, -1, -1, -1],
  [1, 2, 10, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [3, 0, 8, 1, 2, 10, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1],
  [5, 2, 10, 5, 4, 2, 4, 0, 2, -1, -1, -1, -1, -1, -1, -1],
  [2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8, -1, -1, -1, -1],
  [9, 5, 4, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [0, 11, 2, 0, 8, 11, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1],
  [0, 5, 4, 0, 1, 5, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1],
  [2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5, -1, -1, -1, -1],
  [10, 3, 11, 10, 1, 3, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1],
  [4, 9, 5, 0, 8, 1, 8, 10, 1, 8, 11, 10, -1, -1, -1, -1],
  [5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3, -1, -1, -1, -1],
  [5, 4, 8, 5, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1],
  [9, 7, 8, 5, 7, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [9, 3, 0, 9, 5, 3, 5, 7, 3, -1, -1, -1, -1, -1, -1, -1],
  [0, 7, 8, 0, 1, 7, 1, 5, 7, -1, -1, -1, -1, -1, -1, -1],
  [1, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [9, 7, 8, 9, 5, 7, 10, 1, 2, -1, -1, -1, -1, -1, -1, -1],
  [10, 1, 2, 9, 5, 0, 5, 3, 0, 5, 7, 3, -1, -1, -1, -1],
  [8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2, -1, -1, -1, -1],
  [2, 10, 5, 2, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1],
  [7, 9, 5, 7, 8, 9, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1],
  [9, 5, 7, 9, 7, 2, 9, 2, 0, 2, 7, 11, -1, -1, -1, -1],
  [2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7, -1, -1, -1, -1],
  [11, 2, 1, 11, 1, 7, 7, 1, 5, -1, -1, -1, -1, -1, -1, -1],
  [9, 5, 8, 8, 5, 7, 10, 1, 3, 10, 3, 11, -1, -1, -1, -1],
  [5, 7, 0, 5, 0, 9, 7, 11, 0, 1, 0, 10, 11, 10, 0, -1],
  [11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0, -1],
  [11, 10, 5, 7, 11, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [0, 8, 3, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [9, 0, 1, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [1, 8, 3, 1, 9, 8, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1],
  [1, 6, 5, 2, 6, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [1, 6, 5, 1, 2, 6, 3, 0, 8, -1, -1, -1, -1, -1, -1, -1],
  [9, 6, 5, 9, 0, 6, 0, 2, 6, -1, -1, -1, -1, -1, -1, -1],
  [5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8, -1, -1, -1, -1],
  [2, 3, 11, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [11, 0, 8, 11, 2, 0, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1],
  [0, 1, 9, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1],
  [5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11, -1, -1, -1, -1],
  [6, 3, 11, 6, 5, 3, 5, 1, 3, -1, -1, -1, -1, -1, -1, -1],
  [0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11, 6, -1, -1, -1, -1],
  [3, 11, 6, 0, 3, 6, 0, 6, 5, 0, 5, 9, -1, -1, -1, -1],
  [6, 5, 9, 6, 9, 11, 11, 9, 8, -1, -1, -1, -1, -1, -1, -1],
  [5, 10, 6, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [4, 3, 0, 4, 7, 3, 6, 5, 10, -1, -1, -1, -1, -1, -1, -1],
  [1, 9, 0, 5, 10, 6, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1],
  [10, 6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4, -1, -1, -1, -1],
  [6, 1, 2, 6, 5, 1, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1],
  [1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7, -1, -1, -1, -1],
  [8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6, -1, -1, -1, -1],
  [7, 3, 9, 7, 9, 4, 3, 2, 9, 5, 9, 6, 2, 6, 9, -1],
  [3, 11, 2, 7, 8, 4, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1],
  [5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11, -1, -1, -1, -1],
  [0, 1, 9, 4, 7, 8, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1],
  [9, 2, 1, 9, 11, 2, 9, 4, 11, 7, 11, 4, 5, 10, 6, -1],
  [8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6, -1, -1, -1, -1],
  [5, 1, 11, 5, 11, 6, 1, 0, 11, 7, 11, 4, 0, 4, 11, -1],
  [0, 5, 9, 0, 6, 5, 0, 3, 6, 11, 6, 3, 8, 4, 7, -1],
  [6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11, 9, -1, -1, -1, -1],
  [10, 4, 9, 6, 4, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [4, 10, 6, 4, 9, 10, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1],
  [10, 0, 1, 10, 6, 0, 6, 4, 0, -1, -1, -1, -1, -1, -1, -1],
  [8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10, -1, -1, -1, -1],
  [1, 4, 9, 1, 2, 4, 2, 6, 4, -1, -1, -1, -1, -1, -1, -1],
  [3, 0, 8, 1, 2, 9, 2, 4, 9, 2, 6, 4, -1, -1, -1, -1],
  [0, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [8, 3, 2, 8, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1],
  [10, 4, 9, 10, 6, 4, 11, 2, 3, -1, -1, -1, -1, -1, -1, -1],
  [0, 8, 2, 2, 8, 11, 4, 9, 10, 4, 10, 6, -1, -1, -1, -1],
  [3, 11, 2, 0, 1, 6, 0, 6, 4, 6, 1, 10, -1, -1, -1, -1],
  [6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1, -1],
  [9, 6, 4, 9, 3, 6, 9, 1, 3, 11, 6, 3, -1, -1, -1, -1],
  [8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4, 1, -1],
  [3, 11, 6, 3, 6, 0, 0, 6, 4, -1, -1, -1, -1, -1, -1, -1],
  [6, 4, 8, 11, 6, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [7, 10, 6, 7, 8, 10, 8, 9, 10, -1, -1, -1, -1, -1, -1, -1],
  [0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10, -1, -1, -1, -1],
  [10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0, -1, -1, -1, -1],
  [10, 6, 7, 10, 7, 1, 1, 7, 3, -1, -1, -1, -1, -1, -1, -1],
  [1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6, 7, -1, -1, -1, -1],
  [2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9, -1],
  [7, 8, 0, 7, 0, 6, 6, 0, 2, -1, -1, -1, -1, -1, -1, -1],
  [7, 3, 2, 6, 7, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7, -1, -1, -1, -1],
  [2, 0, 7, 2, 7, 11, 0, 9, 7, 6, 7, 10, 9, 10, 7, -1],
  [1, 8, 0, 1, 7, 8, 1, 10, 7, 6, 7, 10, 2, 3, 11, -1],
  [11, 2, 1, 11, 1, 7, 10, 6, 1, 6, 7, 1, -1, -1, -1, -1],
  [8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6, -1],
  [0, 9, 1, 11, 6, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [7, 8, 0, 7, 0, 6, 3, 11, 0, 11, 6, 0, -1, -1, -1, -1],
  [7, 11, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [3, 0, 8, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [0, 1, 9, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [8, 1, 9, 8, 3, 1, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1],
  [10, 1, 2, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [1, 2, 10, 3, 0, 8, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1],
  [2, 9, 0, 2, 10, 9, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1],
  [6, 11, 7, 2, 10, 3, 10, 8, 3, 10, 9, 8, -1, -1, -1, -1],
  [7, 2, 3, 6, 2, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [7, 0, 8, 7, 6, 0, 6, 2, 0, -1, -1, -1, -1, -1, -1, -1],
  [2, 7, 6, 2, 3, 7, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1],
  [1, 6, 2, 1, 8, 6, 1, 9, 8, 8, 7, 6, -1, -1, -1, -1],
  [10, 7, 6, 10, 1, 7, 1, 3, 7, -1, -1, -1, -1, -1, -1, -1],
  [10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8, -1, -1, -1, -1],
  [0, 3, 7, 0, 7, 10, 0, 10, 9, 6, 10, 7, -1, -1, -1, -1],
  [7, 6, 10, 7, 10, 8, 8, 10, 9, -1, -1, -1, -1, -1, -1, -1],
  [6, 8, 4, 11, 8, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [3, 6, 11, 3, 0, 6, 0, 4, 6, -1, -1, -1, -1, -1, -1, -1],
  [8, 6, 11, 8, 4, 6, 9, 0, 1, -1, -1, -1, -1, -1, -1, -1],
  [9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3, 6, -1, -1, -1, -1],
  [6, 8, 4, 6, 11, 8, 2, 10, 1, -1, -1, -1, -1, -1, -1, -1],
  [1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6, -1, -1, -1, -1],
  [4, 11, 8, 4, 6, 11, 0, 2, 9, 2, 10, 9, -1, -1, -1, -1],
  [10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4, 6, 3, -1],
  [8, 2, 3, 8, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1],
  [0, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [1, 9, 0, 2, 3, 4, 2, 4, 6, 4, 3, 8, -1, -1, -1, -1],
  [1, 9, 4, 1, 4, 2, 2, 4, 6, -1, -1, -1, -1, -1, -1, -1],
  [8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1, -1, -1, -1, -1],
  [10, 1, 0, 10, 0, 6, 6, 0, 4, -1, -1, -1, -1, -1, -1, -1],
  [4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10, 9, 3, -1],
  [10, 9, 4, 6, 10, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [4, 9, 5, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [0, 8, 3, 4, 9, 5, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1],
  [5, 0, 1, 5, 4, 0, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1],
  [11, 7, 6, 8, 3, 4, 3, 5, 4, 3, 1, 5, -1, -1, -1, -1],
  [9, 5, 4, 10, 1, 2, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1],
  [6, 11, 7, 1, 2, 10, 0, 8, 3, 4, 9, 5, -1, -1, -1, -1],
  [7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2, -1, -1, -1, -1],
  [3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11, 7, 6, -1],
  [7, 2, 3, 7, 6, 2, 5, 4, 9, -1, -1, -1, -1, -1, -1, -1],
  [9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7, -1, -1, -1, -1],
  [3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0, -1, -1, -1, -1],
  [6, 2, 8, 6, 8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8, -1],
  [9, 5, 4, 10, 1, 6, 1, 7, 6, 1, 3, 7, -1, -1, -1, -1],
  [1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4, -1],
  [4, 0, 10, 4, 10, 5, 0, 3, 10, 6, 10, 7, 3, 7, 10, -1],
  [7, 6, 10, 7, 10, 8, 5, 4, 10, 4, 8, 10, -1, -1, -1, -1],
  [6, 9, 5, 6, 11, 9, 11, 8, 9, -1, -1, -1, -1, -1, -1, -1],
  [3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5, -1, -1, -1, -1],
  [0, 11, 8, 0, 5, 11, 0, 1, 5, 5, 6, 11, -1, -1, -1, -1],
  [6, 11, 3, 6, 3, 5, 5, 3, 1, -1, -1, -1, -1, -1, -1, -1],
  [1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6, -1, -1, -1, -1],
  [0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10, -1],
  [11, 8, 5, 11, 5, 6, 8, 0, 5, 10, 5, 2, 0, 2, 5, -1],
  [6, 11, 3, 6, 3, 5, 2, 10, 3, 10, 5, 3, -1, -1, -1, -1],
  [5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2, -1, -1, -1, -1],
  [9, 5, 6, 9, 6, 0, 0, 6, 2, -1, -1, -1, -1, -1, -1, -1],
  [1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2, 8, -1],
  [1, 5, 6, 2, 1, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [1, 3, 6, 1, 6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6, -1],
  [10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0, -1, -1, -1, -1],
  [0, 3, 8, 5, 6, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [10, 5, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [11, 5, 10, 7, 5, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [11, 5, 10, 11, 7, 5, 8, 3, 0, -1, -1, -1, -1, -1, -1, -1],
  [5, 11, 7, 5, 10, 11, 1, 9, 0, -1, -1, -1, -1, -1, -1, -1],
  [10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1, -1, -1, -1, -1],
  [11, 1, 2, 11, 7, 1, 7, 5, 1, -1, -1, -1, -1, -1, -1, -1],
  [0, 8, 3, 1, 2, 7, 1, 7, 5, 7, 2, 11, -1, -1, -1, -1],
  [9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7, -1, -1, -1, -1],
  [7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2, -1],
  [2, 5, 10, 2, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1],
  [8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5, -1, -1, -1, -1],
  [9, 0, 1, 5, 10, 3, 5, 3, 7, 3, 10, 2, -1, -1, -1, -1],
  [9, 8, 2, 9, 2, 1, 8, 7, 2, 10, 2, 5, 7, 5, 2, -1],
  [1, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [0, 8, 7, 0, 7, 1, 1, 7, 5, -1, -1, -1, -1, -1, -1, -1],
  [9, 0, 3, 9, 3, 5, 5, 3, 7, -1, -1, -1, -1, -1, -1, -1],
  [9, 8, 7, 5, 9, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [5, 8, 4, 5, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1],
  [5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0, -1, -1, -1, -1],
  [0, 1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5, -1, -1, -1, -1],
  [10, 11, 4, 10, 4, 5, 11, 3, 4, 9, 4, 1, 3, 1, 4, -1],
  [2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8, -1, -1, -1, -1],
  [0, 4, 11, 0, 11, 3, 4, 5, 11, 2, 11, 1, 5, 1, 11, -1],
  [0, 2, 5, 0, 5, 9, 2, 11, 5, 4, 5, 8, 11, 8, 5, -1],
  [9, 4, 5, 2, 11, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4, -1, -1, -1, -1],
  [5, 10, 2, 5, 2, 4, 4, 2, 0, -1, -1, -1, -1, -1, -1, -1],
  [3, 10, 2, 3, 5, 10, 3, 8, 5, 4, 5, 8, 0, 1, 9, -1],
  [5, 10, 2, 5, 2, 4, 1, 9, 2, 9, 4, 2, -1, -1, -1, -1],
  [8, 4, 5, 8, 5, 3, 3, 5, 1, -1, -1, -1, -1, -1, -1, -1],
  [0, 4, 5, 1, 0, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5, -1, -1, -1, -1],
  [9, 4, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [4, 11, 7, 4, 9, 11, 9, 10, 11, -1, -1, -1, -1, -1, -1, -1],
  [0, 8, 3, 4, 9, 7, 9, 11, 7, 9, 10, 11, -1, -1, -1, -1],
  [1, 10, 11, 1, 11, 4, 1, 4, 0, 7, 4, 11, -1, -1, -1, -1],
  [3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4, -1],
  [4, 11, 7, 9, 11, 4, 9, 2, 11, 9, 1, 2, -1, -1, -1, -1],
  [9, 7, 4, 9, 11, 7, 9, 1, 11, 2, 11, 1, 0, 8, 3, -1],
  [11, 7, 4, 11, 4, 2, 2, 4, 0, -1, -1, -1, -1, -1, -1, -1],
  [11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4, -1, -1, -1, -1],
  [2, 9, 10, 2, 7, 9, 2, 3, 7, 7, 4, 9, -1, -1, -1, -1],
  [9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2, 0, 7, -1],
  [3, 7, 10, 3, 10, 2, 7, 4, 10, 1, 10, 0, 4, 0, 10, -1],
  [1, 10, 2, 8, 7, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [4, 9, 1, 4, 1, 7, 7, 1, 3, -1, -1, -1, -1, -1, -1, -1],
  [4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1, -1, -1, -1, -1],
  [4, 0, 3, 7, 4, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [4, 8, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [9, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [3, 0, 9, 3, 9, 11, 11, 9, 10, -1, -1, -1, -1, -1, -1, -1],
  [0, 1, 10, 0, 10, 8, 8, 10, 11, -1, -1, -1, -1, -1, -1, -1],
  [3, 1, 10, 11, 3, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [1, 2, 11, 1, 11, 9, 9, 11, 8, -1, -1, -1, -1, -1, -1, -1],
  [3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9, -1, -1, -1, -1],
  [0, 2, 11, 8, 0, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [3, 2, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [2, 3, 8, 2, 8, 10, 10, 8, 9, -1, -1, -1, -1, -1, -1, -1],
  [9, 10, 2, 0, 9, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8, -1, -1, -1, -1],
  [1, 10, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [1, 3, 8, 9, 1, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [0, 9, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [0, 3, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
];

const cornerIndexFromEdge = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
];

const cornerOffset = [
  [0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0],
  [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1],
];

function fbm3(x: number, y: number, z: number, octaves = 5, lacunarity = 2.0, gain = 0.5): number {
  let freq = 1, amp = 1, sum = 0, norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise.noise3d(x * freq, y * freq, z * freq);
    norm += amp;
    freq *= lacunarity;
    amp *= gain;
  }
  return sum / norm;
}

const biomes = [
  { sand: 0x659988, grass: 0x4d7568, rock: 0x667db4, snow: 0x6ebdea }, // Emerald
  { sand: 0xdd8d9f, grass: 0xb63f83, rock: 0x47195d, snow: 0xdd8d9f }, // Amythest
  { sand: 0x667db4, grass: 0x5b5f90, rock: 0x667db4, snow: 0x6ebdea }, // Diamond
];

interface Stop { y: number; r: number; g: number; b: number; }
function makeStops(b: typeof biomes[0]): Stop[] {
  const c = (hex: number) => { const col = new THREE.Color(hex); return { r: col.r, g: col.g, b: col.b }; };
  const sand = c(b.sand), grass = c(b.grass), rock = c(b.rock), snow = c(b.snow);
  return [
    { y: 0.5, ...sand },
    { y: 2.0, ...grass },
    { y: 6.0, ...rock },
    { y: 9.0, ...snow },
  ];
}
const biomeStops: Stop[][] = biomes.map(makeStops);

function gradientRGB(y: number, stops: Stop[], out: Float32Array): void {
  if (y <= stops[0].y) { out[0] = stops[0].r; out[1] = stops[0].g; out[2] = stops[0].b; return; }
  for (let i = 0; i < stops.length - 1; i++) {
    const s0 = stops[i], s1 = stops[i + 1];
    if (y <= s1.y) {
      const t = (y - s0.y) / (s1.y - s0.y);
      out[0] = s0.r + (s1.r - s0.r) * t;
      out[1] = s0.g + (s1.g - s0.g) * t;
      out[2] = s0.b + (s1.b - s0.b) * t;
      return;
    }
  }
  const last = stops[stops.length - 1];
  out[0] = last.r; out[1] = last.g; out[2] = last.b;
}

function stoneColor(y: number): THREE.Color {
  const shallow = new THREE.Color(0x5b5f90);
  const deep = new THREE.Color(0x544c70);
  return shallow.lerp(deep, THREE.MathUtils.clamp(-y / (stretch * 10), 0, 1));
}

const STONE_SHALLOW = new THREE.Color(0x5b5f90);
const STONE_DEEP = new THREE.Color(0x544c70);
function stoneColorRGB(y: number, out: Float32Array): void {
  const t = THREE.MathUtils.clamp(-y / (stretch * 10), 0, 1);
  out[0] = STONE_SHALLOW.r + (STONE_DEEP.r - STONE_SHALLOW.r) * t;
  out[1] = STONE_SHALLOW.g + (STONE_DEEP.g - STONE_SHALLOW.g) * t;
  out[2] = STONE_SHALLOW.b + (STONE_DEEP.b - STONE_SHALLOW.b) * t;
}

const seamColorBand = 3.0; 
const seamHeightAmp = 1.6;
const seamHeightFreq = 0.08;
const seamDeformBand = 2.5; 
const seamDispXZ = 0.7; 
const seamDispY = 0.5; 
const seamDeformFreq = 0.16; 

function smooth01(t: number): number {
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  return c * c * (3 - 2 * c);
}

function seamBlend(x: number, y: number, z: number): number {
  const localSeam = seamHeightAmp * noise.noise3d(x * seamHeightFreq, 0, z * seamHeightFreq);
  return smooth01((y - (localSeam - seamColorBand)) / (2 * seamColorBand));
}

function seamDeform(x: number, y: number, z: number, out: Float64Array): void {
  const a = Math.abs(y);
  if (a >= seamDeformBand) { out[0] = x; out[1] = y; out[2] = z; return; }
  const w = smooth01(1 - a / seamDeformBand);
  const nx = noise.noise3d(x * seamDeformFreq, 0.0, z * seamDeformFreq);
  const ny = noise.noise3d(x * seamDeformFreq + 31.7, 12.3, z * seamDeformFreq - 8.1);
  const nz = noise.noise3d(x * seamDeformFreq - 19.4, 27.6, z * seamDeformFreq + 5.2);
  out[0] = x + nx * seamDispXZ * w;
  out[1] = y + ny * seamDispY * w;
  out[2] = z + nz * seamDispXZ * w;
}

const ROCKS_ENABLED = true;
const rockBiomes = new Set<number>([0, 2]);
const rockUpThreshold = 2;
const maxRocks = 100;
const rockMinRadius = 0.9;
const rockMaxRadius = 1.8;
const rockNoiseAmp = 0.45;
const rockNoiseFreq = 0.9;
const rockSquashY = 1.4;
const rockBury = 0.3;

function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rockVerts: number[] = [];
const rockColors: number[] = [];

const ROCK_DARK = new THREE.Color(0x3e3b4a);
const ROCK_LIGHT = new THREE.Color(0x8f8ca0);
const rockTint = biomes.map(b => new THREE.Color(b.rock));

function rockColorRGB(localT: number, tintR: number, tintG: number, tintB: number, out: Float32Array): void {
  const t = localT < 0 ? 0 : localT > 1 ? 1 : localT;
  const baseR = ROCK_DARK.r + (ROCK_LIGHT.r - ROCK_DARK.r) * t;
  const baseG = ROCK_DARK.g + (ROCK_LIGHT.g - ROCK_DARK.g) * t;
  const baseB = ROCK_DARK.b + (ROCK_LIGHT.b - ROCK_DARK.b) * t;
  const k = 0.25;
  out[0] = baseR + (tintR - baseR) * k;
  out[1] = baseG + (tintG - baseG) * k;
  out[2] = baseB + (tintB - baseB) * k;
}

const rval = new Float64Array(8);
const rwx = new Float64Array(8);
const rwy = new Float64Array(8);
const rwz = new Float64Array(8);
const rTriPos = new Float64Array(9);
const rTriCol = new Float64Array(9);
const rTmpCol = new Float32Array(3);

function marchRock(cx: number, cy: number, cz: number, radius: number, sx: number, sy: number, sz: number, biomeIndex: number): void {
  const maxSurface = radius * (1 + rockNoiseAmp);
  const half = maxSurface + inv;
  const x0 = cx - half, y0 = cy - half, z0 = cz - half;
  const cells = Math.ceil((2 * half) / inv);
  const np = cells + 1;

  const dens = new Float64Array(np * np * np);
  const di = (i: number, j: number, k: number) => (i * np + j) * np + k;
  for (let i = 0; i < np; i++) {
    const wx = x0 + i * inv, dx = wx - cx;
    for (let j = 0; j < np; j++) {
      const wy = y0 + j * inv, dy = (wy - cy) * rockSquashY;
      for (let k = 0; k < np; k++) {
        const wz = z0 + k * inv, dz = wz - cz;
        const r = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const bump = fbm3(wx * rockNoiseFreq + sx, wy * rockNoiseFreq + sy, wz * rockNoiseFreq + sz);
        const surface = radius * (1 + rockNoiseAmp * bump);
        dens[di(i, j, k)] = surface - r;
      }
    }
  }

  const yMin = y0, yRange = 2 * half;
  const tintR = rockTint[biomeIndex % rockTint.length].r;
  const tintG = rockTint[biomeIndex % rockTint.length].g;
  const tintB = rockTint[biomeIndex % rockTint.length].b;

  for (let ci = 0; ci < cells; ci++) {
    for (let cj = 0; cj < cells; cj++) {
      for (let ck = 0; ck < cells; ck++) {
        let cubeIndex = 0;
        for (let c = 0; c < 8; c++) {
          const o = cornerOffset[c];
          const v = dens[di(ci + o[0], cj + o[1], ck + o[2])];
          rval[c] = v;
          rwx[c] = x0 + (ci + o[0]) * inv;
          rwy[c] = y0 + (cj + o[1]) * inv;
          rwz[c] = z0 + (ck + o[2]) * inv;
          if (v > 0) cubeIndex |= 1 << c;
        }
        if (cubeIndex === 0 || cubeIndex === 255) continue;

        const tri = TriangulationTable[cubeIndex];
        for (let t = 0; t < tri.length && tri[t] !== -1; t += 3) {
          for (let k = 0; k < 3; k++) {
            const e = tri[t + k];
            const a = cornerIndexFromEdge[e][0], b = cornerIndexFromEdge[e][1];
            const va = rval[a], vb = rval[b];
            const denom = vb - va;
            const tt = Math.abs(denom) < 1e-6 ? 0.5 : (0 - va) / denom; // surface level 0

            const px = rwx[a] + (rwx[b] - rwx[a]) * tt;
            const py = rwy[a] + (rwy[b] - rwy[a]) * tt;
            const pz = rwz[a] + (rwz[b] - rwz[a]) * tt;

            rockColorRGB((py - yMin) / yRange, tintR, tintG, tintB, rTmpCol);

            const k3 = k * 3;
            rTriPos[k3] = px; rTriPos[k3 + 1] = py; rTriPos[k3 + 2] = pz;
            rTriCol[k3] = rTmpCol[0]; rTriCol[k3 + 1] = rTmpCol[1]; rTriCol[k3 + 2] = rTmpCol[2];
          }
          for (const ord of [2, 1, 0]) {
            const o3 = ord * 3;
            rockVerts.push(rTriPos[o3], rTriPos[o3 + 1], rTriPos[o3 + 2]);
            rockColors.push(rTriCol[o3], rTriCol[o3 + 1], rTriCol[o3 + 2]);
          }
        }
      }
    }
  }
}


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(5, 5, 10);
controls.update();
controls.autoRotate = true;

const noise = new SimplexNoise();
const surfaceLevel = 0.6;
const frequency = 0.03;
const stretch = 3.0;

const resolution = 2;
const inv = 1 / resolution;

const worldX = 200;
const worldY = 40;
const worldZ = 200;

const sizeX = Math.round(worldX * resolution);
const sizeY = Math.round(worldY * resolution);
const sizeZ = Math.round(worldZ * resolution);

const total = sizeX * sizeY * sizeZ;
const idx = (x: number, y: number, z: number) => (x * sizeY + y) * sizeZ + z;

const values = new Float32Array(total);
for (let x = 0; x < sizeX; x++) {
  for (let y = 0; y < sizeY; y++) {
    const wy = y * inv;
    const heightFrac = wy / (worldY - 1);
    for (let z = 0; z < sizeZ; z++) {
      const n = (fbm3(x * inv * frequency, wy * frequency, z * inv * frequency) + 1) / 2;
      values[idx(x, y, z)] = n - heightFrac;
    }
  }
}

const islandId = new Int32Array(total).fill(-1);
const nb = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
let nextId = 0;
const stack: number[] = [];
for (let x = 0; x < sizeX; x++)
  for (let y = 0; y < sizeY; y++)
    for (let z = 0; z < sizeZ; z++) {
      const i0 = idx(x, y, z);
      if (!(values[i0] > surfaceLevel) || islandId[i0] !== -1) continue;
      const id = nextId++;
      islandId[i0] = id;
      stack.push(i0);
      while (stack.length) {
        const cur = stack.pop()!;
        const cz = cur % sizeZ;
        const t1 = (cur - cz) / sizeZ;
        const cy = t1 % sizeY;
        const cx = (t1 - cy) / sizeY;
        for (let n = 0; n < 6; n++) {
          const nx = cx + nb[n][0], ny = cy + nb[n][1], nz = cz + nb[n][2];
          if (nx < 0 || ny < 0 || nz < 0 || nx >= sizeX || ny >= sizeY || nz >= sizeZ) continue;
          const ni = idx(nx, ny, nz);
          if (values[ni] > surfaceLevel && islandId[ni] === -1) {
            islandId[ni] = id;
            stack.push(ni);
          }
        }
      }
    }

const allVerts: number[] = [];
const allColors: number[] = [];

const candX: number[] = [];
const candY: number[] = [];
const candZ: number[] = [];
const candBiome: number[] = [];

const cval = new Float64Array(8);
const cwx = new Float64Array(8);
const cwy = new Float64Array(8);
const cwz = new Float64Array(8);
const cgi = new Int32Array(8);
const triPos = new Float64Array(9);
const triCol = new Float64Array(9);
const tmpCol = new Float32Array(3);

for (let x = 0; x < sizeX - 1; x++) {
  for (let y = 0; y < sizeY - 1; y++) {
    for (let z = 0; z < sizeZ - 1; z++) {
      let cubeIndex = 0;
      for (let j = 0; j < 8; j++) {
        const o = cornerOffset[j];
        const gi = idx(x + o[0], y + o[1], z + o[2]);
        cgi[j] = gi;
        const v = values[gi];
        cval[j] = v;
        if (v > surfaceLevel) cubeIndex |= 1 << j;
      }
      if (cubeIndex === 0 || cubeIndex === 255) continue;

      let wantRock = false;
      let cubeBiome = -1;
      if (ROCKS_ENABLED) {
        let solidJ = -1;
        for (let j = 0; j < 8; j++) { if (cval[j] > surfaceLevel) { solidJ = j; break; } }
        if (solidJ >= 0) {
          cubeBiome = islandId[cgi[solidJ]] % biomes.length;
          if (rockBiomes.has(cubeBiome)) {
            let oy = 0;
            for (let j = 0; j < 8; j++) {
              const air = cval[j] > surfaceLevel ? -1 : 1;
              const ySign = cornerOffset[j][1] === 1 ? 1 : -1;
              oy += air * ySign;
            }
            if (oy > rockUpThreshold) wantRock = true;
          }
        }
      }
      let seedX = 0, seedY = 0, seedZ = 0, seedN = 0;

      for (let j = 0; j < 8; j++) {
        const o = cornerOffset[j];
        cwx[j] = (x + o[0]) * inv;
        cwy[j] = (y + o[1]) * inv;
        cwz[j] = (z + o[2]) * inv;
      }

      const tri = TriangulationTable[cubeIndex];
      for (let t = 0; t < tri.length && tri[t] !== -1; t += 3) {
        for (let k = 0; k < 3; k++) {
          const e = tri[t + k];
          const a = cornerIndexFromEdge[e][0], b = cornerIndexFromEdge[e][1];
          const va = cval[a], vb = cval[b];

          const denom = vb - va;
          const tt = Math.abs(denom) < 1e-6 ? 0.5 : (surfaceLevel - va) / denom;

          const px = cwx[a] + (cwx[b] - cwx[a]) * tt;
          const py = cwy[a] + (cwy[b] - cwy[a]) * tt;
          const pz = cwz[a] + (cwz[b] - cwz[a]) * tt;

          const solidCorner = va > surfaceLevel ? a : b;
          const id = islandId[cgi[solidCorner]];
          const stops = biomeStops[id % biomeStops.length];
          gradientRGB(py, stops, tmpCol);

          const k3 = k * 3;
          triPos[k3] = px; triPos[k3 + 1] = py; triPos[k3 + 2] = pz;
          triCol[k3] = tmpCol[0]; triCol[k3 + 1] = tmpCol[1]; triCol[k3 + 2] = tmpCol[2];

          if (wantRock) { seedX += px; seedY += py; seedZ += pz; seedN++; }
        }
        for (const ord of [2, 1, 0]) {
          const o3 = ord * 3;
          allVerts.push(triPos[o3], triPos[o3 + 1], triPos[o3 + 2]);
          allColors.push(triCol[o3], triCol[o3 + 1], triCol[o3 + 2]);
        }
      }

      if (wantRock && seedN > 0) {
        candX.push(seedX / seedN);
        candY.push(seedY / seedN);
        candZ.push(seedZ / seedN);
        candBiome.push(cubeBiome);
      }
    }
  }
}

scene.add(new THREE.HemisphereLight(0xddeeff, 0x4a5d23, 1.0));
const sun = new THREE.DirectionalLight(0xffffff, 1.5);
sun.position.set(10, 20, 10);
scene.add(sun);

const botVerts = new Array<number>(allVerts.length);
const botColors = new Array<number>(allColors.length);
const seamStone = new Float32Array(3);
for (let i = 0; i < allVerts.length; i += 9) {
  for (let vi = 0; vi < 3; vi++) {
    const src = i + (2 - vi) * 3;
    const dst = i + vi * 3;
    const bx = allVerts[src];
    const by = -stretch * allVerts[src + 1];
    const bz = allVerts[src + 2];
    botVerts[dst] = bx; botVerts[dst + 1] = by; botVerts[dst + 2] = bz;

    stoneColorRGB(by, seamStone);
    const blend = seamBlend(bx, by, bz);
    const biR = allColors[src], biG = allColors[src + 1], biB = allColors[src + 2];
    botColors[dst]     = seamStone[0] + (biR - seamStone[0]) * blend;
    botColors[dst + 1] = seamStone[1] + (biG - seamStone[1]) * blend;
    botColors[dst + 2] = seamStone[2] + (biB - seamStone[2]) * blend;
  }
}

for (let i = 0; i < allVerts.length; i += 3) {
  const x = allVerts[i], y = allVerts[i + 1], z = allVerts[i + 2];
  stoneColorRGB(y, seamStone);
  const blend = seamBlend(x, y, z);
  allColors[i] = seamStone[0] + (allColors[i] - seamStone[0]) * blend;
  allColors[i + 1] = seamStone[1] + (allColors[i + 1] - seamStone[1]) * blend;
  allColors[i + 2] = seamStone[2] + (allColors[i + 2] - seamStone[2]) * blend;
}

const dbuf = new Float64Array(3);
for (let i = 0; i < allVerts.length; i += 3) {
  seamDeform(allVerts[i], allVerts[i + 1], allVerts[i + 2], dbuf);
  allVerts[i] = dbuf[0]; allVerts[i + 1] = dbuf[1]; allVerts[i + 2] = dbuf[2];
}
for (let i = 0; i < botVerts.length; i += 3) {
  seamDeform(botVerts[i], botVerts[i + 1], botVerts[i + 2], dbuf);
  botVerts[i] = dbuf[0]; botVerts[i + 1] = dbuf[1]; botVerts[i + 2] = dbuf[2];
}

const topGeo = new THREE.BufferGeometry();
topGeo.setAttribute('position', new THREE.Float32BufferAttribute(allVerts, 3));
topGeo.setAttribute('color', new THREE.Float32BufferAttribute(allColors, 3));

const bottomGeo = new THREE.BufferGeometry();
bottomGeo.setAttribute('position', new THREE.Float32BufferAttribute(botVerts, 3));
bottomGeo.setAttribute('color', new THREE.Float32BufferAttribute(botColors, 3));

let merged = BufferGeometryUtils.mergeGeometries([topGeo, bottomGeo]);
merged = BufferGeometryUtils.mergeVertices(merged);

const mat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true });
scene.add(new THREE.Mesh(merged, mat));

if (ROCKS_ENABLED && candX.length > 0) {
  const rng = mulberry32(1337);
  const C = candX.length;
  const order = new Int32Array(C);
  for (let i = 0; i < C; i++) order[i] = i;
  for (let i = C - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = order[i]; order[i] = order[j]; order[j] = tmp;
  }

  const nRocks = Math.min(maxRocks, C);
  for (let r = 0; r < nRocks; r++) {
    const ci = order[r];
    const radius = rockMinRadius + (rockMaxRadius - rockMinRadius) * rng();
    marchRock(
      candX[ci], candY[ci] - radius * rockBury, candZ[ci], radius,
      rng() * 1000, rng() * 1000, rng() * 1000, candBiome[ci],
    );
  }

  if (rockVerts.length > 0) {
    const rockGeo = new THREE.BufferGeometry();
    rockGeo.setAttribute('position', new THREE.Float32BufferAttribute(rockVerts, 3));
    rockGeo.setAttribute('color', new THREE.Float32BufferAttribute(rockColors, 3));
    scene.add(new THREE.Mesh(rockGeo, mat));
  }
}


function animate() {
  controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);