import { StyleSheet, View } from 'react-native';
import React from 'react';
import "../../threeSetup";
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer, THREE } from 'expo-three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AnimationMixer } from 'three';

const MODEL_URL = 'https://curious-pauline-catchable.ngrok-free.dev/static/3d/';
//const MODEL_URL = 'https://curious-pauline-catchable.ngrok-free.dev/static/3d/8.gltf';

type TestRender = {
    word: string;
};

const TestRender = ({ word }: TestRender) => {
    const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

        // Renderer
        const renderer = new Renderer({ gl });
        // renderer.setSize(width, height);
        renderer.setSize(width, height);

        // renderer.setClearColor(0xaaaaaa);
        renderer.setClearColor(0xffffff);
        // Scene + Camera
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 3;
        camera.position.y = 4;


        // Lights
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 5, 10);
        scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        // ====== Load GLB Model ======
        const loader = new GLTFLoader();
        loader.load(
            MODEL_URL + word + '.glb',
            (gltf) => {
                // console.log('GLB loaded:', gltf);

                const model = gltf.scene;
                // model.scale.set(2, 2, 2);
                model.scale.set(3, 3, 3);

                model.position.set(0, -1, 0);

                scene.add(model);

                // Handle animation if available
                if (gltf.animations && gltf.animations.length > 0) {
                    const mixer = new AnimationMixer(model);
                    gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
                    scene.userData.mixer = mixer;
                }
            },
            // (xhr) => {
            //     console.log(`Loading GLB: ${(xhr.loaded / xhr.total) * 100}%`);
            // },
            (error) => {
                console.error('Error loading GLB:', error);
            }
        );

        // Animation loop
        let previousTime = 0;
        const animate = (time = 0) => {
            requestAnimationFrame(animate);
            const delta = (time - previousTime) / 1000;
            previousTime = time;

            if (scene.userData.mixer) scene.userData.mixer.update(delta);
            renderer.render(scene, camera);
            gl.endFrameEXP();
        };
        animate();
    };

    return (
        <View style={styles.container}>
            <View style={styles.glWrapper}>
                <GLView style={styles.glview} onContextCreate={onContextCreate} />
            </View>
        </View>
    );
};

export default TestRender;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    glWrapper: {
        width: "100%",
        height: 300,
        borderWidth: .5,
        borderColor: '#000',  // change color as needed
        borderRadius: 8,
        overflow: 'hidden',   // important for rounded corners!
    },
    glview: {
        flex: 1, // make GLView fill the wrapper
    },
});
