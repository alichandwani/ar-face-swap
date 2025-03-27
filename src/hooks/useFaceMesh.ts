import { useCallback, useRef } from 'react';
import * as THREE from 'three';

interface FaceLandmarks {
  positions: any[];
  shift: {
    x: number;
    y: number;
  };
}

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Face {
  id: string;
  landmarks: FaceLandmarks;
  box: Box;
  mesh: any;
}

// Standard 3D face mesh vertices based on the Face API 68 landmarks
const FACE_MESH_VERTICES = [
  // Face contour (jaw) indices 0-16
  [0, 1, 2], [1, 2, 3], [2, 3, 4], [3, 4, 5], [4, 5, 6], [5, 6, 7], 
  [6, 7, 8], [7, 8, 9], [8, 9, 10], [9, 10, 11], [10, 11, 12], 
  [11, 12, 13], [12, 13, 14], [13, 14, 15], [14, 15, 16],
  
  // Left eyebrow indices 17-21
  [17, 18, 19], [18, 19, 20], [19, 20, 21],
  
  // Right eyebrow indices 22-26
  [22, 23, 24], [23, 24, 25], [24, 25, 26],
  
  // Nose bridge indices 27-30
  [27, 28, 29], [28, 29, 30],
  
  // Nose bottom indices 31-35
  [30, 31, 32], [31, 32, 33], [32, 33, 34], [33, 34, 35],
  
  // Left eye indices 36-41
  [36, 37, 41], [37, 38, 41], [38, 39, 41], [39, 40, 41],
  
  // Right eye indices 42-47
  [42, 43, 47], [43, 44, 47], [44, 45, 47], [45, 46, 47],
  
  // Mouth outer indices 48-59
  [48, 49, 59], [49, 50, 59], [50, 51, 59], [51, 52, 59],
  [52, 53, 59], [53, 54, 59], [54, 55, 59], [55, 56, 59],
  [56, 57, 59], [57, 58, 59],
  
  // Mouth inner indices 60-67
  [60, 61, 67], [61, 62, 67], [62, 63, 67], [63, 64, 67],
  [64, 65, 67], [65, 66, 67]
];

export const useFaceMesh = () => {
  const meshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  
  const createFaceMesh = useCallback((face: Face) => {
    // Skip if already created for this face
    if (meshesRef.current.has(face.id)) return;
    
    if (!face.landmarks || !face.landmarks.positions || face.landmarks.positions.length < 68) {
      console.error('Invalid face landmarks for mesh creation');
      return;
    }
    
    try {
      // Extract 3D positions from landmarks
      const positions = face.landmarks.positions.map((point: { x: number, y: number }) => {
        // Convert 2D coordinates to 3D space
        // Z coordinate is estimated based on facial features
        // This is simplified and would be more accurate with depth estimation
        const zOffset = getZOffset(point, face.landmarks.positions);
        return new THREE.Vector3(
          (point.x - face.box.width / 2) / 100, 
          -(point.y - face.box.height / 2) / 100, 
          zOffset
        );
      });
      
      // Create geometry
      const geometry = new THREE.BufferGeometry();
      
      // Create faces (triangles) from the vertex indices
      const indices: number[] = [];
      FACE_MESH_VERTICES.forEach(triangle => {
        indices.push(triangle[0], triangle[1], triangle[2]);
      });
      
      // Set positions and indices
      const positionArray = new Float32Array(positions.length * 3);
      positions.forEach((pos, i) => {
        positionArray[i * 3] = pos.x;
        positionArray[i * 3 + 1] = pos.y;
        positionArray[i * 3 + 2] = pos.z;
      });
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      
      // Create material
      const material = new THREE.MeshPhongMaterial({
        color: 0x8888ff,
        wireframe: false,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      });
      
      // Create mesh
      const mesh = new THREE.Mesh(geometry, material);
      
      // Store in ref
      meshesRef.current.set(face.id, mesh);
      
      // Assign to face object
      face.mesh = mesh;
      
      return mesh;
    } catch (error) {
      console.error('Error creating face mesh:', error);
      return null;
    }
  }, []);
  
  const updateFaceMesh = useCallback((face: Face, scene: THREE.Scene) => {
    let mesh = meshesRef.current.get(face.id);
    
    // Create mesh if it doesn't exist
    if (!mesh) {
      mesh = createFaceMesh(face);
      if (mesh && !scene.children.includes(mesh)) {
        scene.add(mesh);
      }
      return;
    }
    
    // Update mesh geometry with new landmark positions
    if (face.landmarks && face.landmarks.positions && face.landmarks.positions.length >= 68) {
      const positions = face.landmarks.positions.map((point: { x: number, y: number }) => {
        const zOffset = getZOffset(point, face.landmarks.positions);
        return new THREE.Vector3(
          (point.x - face.box.width / 2) / 100, 
          -(point.y - face.box.height / 2) / 100, 
          zOffset
        );
      });
      
      const geometry = mesh.geometry;
      const positionAttribute = geometry.getAttribute('position');
      
      // Update positions
      for (let i = 0; i < positions.length; i++) {
        positionAttribute.setXYZ(i, positions[i].x, positions[i].y, positions[i].z);
      }
      
      positionAttribute.needsUpdate = true;
      geometry.computeVertexNormals();
    }
  }, [createFaceMesh]);
  
  const removeFaceMesh = useCallback((faceId: string, scene: THREE.Scene) => {
    const mesh = meshesRef.current.get(faceId);
    if (mesh) {
      scene.remove(mesh);
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(material => material.dispose());
      } else {
        mesh.material.dispose();
      }
      meshesRef.current.delete(faceId);
    }
  }, []);
  
  return {
    createFaceMesh,
    updateFaceMesh,
    removeFaceMesh
  };
};

// Helper function to estimate Z-coordinate based on facial features
function getZOffset(point: { x: number, y: number }, allPoints: any[]): number {
  // This is a simplified approach - in a real implementation,
  // you would use more sophisticated depth estimation
  
  // Find center of face
  const centerX = allPoints.reduce((sum: number, p: { x: number }) => sum + p.x, 0) / allPoints.length;
  const centerY = allPoints.reduce((sum: number, p: { y: number }) => sum + p.y, 0) / allPoints.length;
  
  // Calculate distance from center
  const dx = point.x - centerX;
  const dy = point.y - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Adjust Z based on distance from center (simplified model)
  // Further points are more likely to be at the edges of the face
  const maxDistance = Math.max(...allPoints.map((p: { x: number, y: number }) => {
    const pdx = p.x - centerX;
    const pdy = p.y - centerY;
    return Math.sqrt(pdx * pdx + pdy * pdy);
  }));
  
  // Normalize distance and convert to a Z offset
  // This creates a somewhat spherical face shape
  const normalizedDistance = distance / maxDistance;
  return -Math.sin(normalizedDistance * Math.PI) * 0.5;
} 