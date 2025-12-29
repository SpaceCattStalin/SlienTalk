import React, { Suspense } from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas, useLoader } from '@react-three/fiber/native';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'


const MODEL_URL = 'https://curious-pauline-catchable.ngrok-free.dev/static/3d/A.fbx';

const Model = () => {
  const fbx = useLoader(FBXLoader, MODEL_URL);
  return <primitive object={fbx} scale={20} />;
};

const ModelViewer = () => (
  <View style={styles.container}>
    <Canvas style={styles.canvas}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 10]} intensity={1} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </Canvas>
  </View>
);

export default ModelViewer;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  canvas: { width: 300, height: 300 },
});
