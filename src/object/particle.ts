import { Renderer } from "../renderer";
import { AssetsManager } from "../assetsManager";
import { Controller } from "../controller";
import { Constants } from "../constants";

class Particle {

	private geometry: THREE.BufferGeometry;
	private particlesNumber = 500;
	private particleSystem;

	private time: number;
	private spawnParticleTime: number;
	private spawnParticleInterval: number;
	private needsUpdate: boolean[];
	private positions: Float32Array;
	private originalSizes: Float32Array;
	private moveDest: Float32Array;
	private particleTime: Float32Array;

	private static particleSpreadingRatio;

	constructor() {

		let shaderMaterial = new THREE.ShaderMaterial({
			uniforms: {
				color: { value: new THREE.Color(0xffffff) },
				texture: { value: new THREE.TextureLoader().load("./dist/images/spark.png") }
			},
			vertexShader: AssetsManager.instance.getTexture().vectexParticleShader,
			fragmentShader: AssetsManager.instance.getTexture().fragmentParticleShader,
			blending: THREE.NormalBlending,
			depthTest: false,
			transparent: true
		});

		this.geometry = new THREE.BufferGeometry();

		let positions = new Float32Array(this.particlesNumber * 3);
		let colors = new Float32Array(this.particlesNumber * 3);
		let sizes = new Float32Array(this.particlesNumber);
		let color = new THREE.Color();

		this.needsUpdate = [];
		this.originalSizes = new Float32Array(this.particlesNumber);
		this.moveDest = new Float32Array(this.particlesNumber * 3);
		this.particleTime = new Float32Array(this.particlesNumber);

		for (let i = 0, i3 = 0; i < this.particlesNumber; i++ , i3 += 3) {
			positions[i3 + 0] = (Math.random() * 2 - 1) * 10;
			positions[i3 + 1] = 0;
			positions[i3 + 2] = (Math.random() * 2 - 1) * 10;

			this.moveDest[i3] = Math.random() * 200 - 100;
			this.moveDest[i3 + 1] = Math.random() * 0.3 + 0.45;
			this.moveDest[i3 + 2] = Math.random() * 200 - 100;

			color.setHSL(i / this.particlesNumber, 1.0, 0.5);
			colors[i3 + 0] = color.r;
			colors[i3 + 1] = color.g;
			colors[i3 + 2] = color.b;
			sizes[i] = Math.random() * 4 + 2;
			this.originalSizes[i] = sizes[i];
		}
		this.geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
		this.geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
		this.geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
		this.particleSystem = new THREE.Points(this.geometry, shaderMaterial);

		Renderer.addToScene(this.particleSystem);

		this.reset();
		Particle.setController();
	}

	private static setController() {
		this.particleSpreadingRatio = Controller.getParams().ParticleSpread;
		Controller.attachEvent(Controller.PARTICLE_SPREAD, (value) => {
			this.particleSpreadingRatio = value;
		});
	}

	public reset() {
		this.time = 0;
		this.spawnParticleTime = 0;
		this.spawnParticleInterval = 1;

		for (let i = 0; i < this.particlesNumber; i++) {
			this.needsUpdate[i] = false;
			this.particleTime[i] = 0;
		}
	}

	private spawnParticle() {
		for (let i = 0; i < this.particlesNumber; i++) {
			if (this.needsUpdate[i] == false) {
				this.needsUpdate[i] = true;
				return;
			}
		}
	}

	public update(deltaTime: number) {

		this.spawnParticleTime += deltaTime;
		if (this.spawnParticleTime > this.spawnParticleInterval) {
			this.spawnParticleTime = 0;
			this.spawnParticleInterval = Math.random() * 50 + 10;
			this.spawnParticle();
		}

		deltaTime /= 1000;
		this.time += deltaTime;

		this.particleSystem.rotation.y += 0.3 * deltaTime;
		var sizes = this.geometry.attributes['size'].array;
		var positions = this.geometry.attributes['position'].array;

		for (var i = 0, i3 = 0; i < this.particlesNumber; i++ , i3 += 3) {
			if (this.needsUpdate[i]) {
				if (this.particleTime[i] > Constants.MAXIMUM_LIVE_TIME / 1000) {
					positions[i3] = 0;
					positions[i3 + 1] = 0;
					positions[i3 + 2] = 0;
					this.particleTime[i] = 0;
					sizes[i] = 0;
				} else {
					let ac = Particle.particleSpreadingRatio * this.particleTime[i] / (Constants.MAXIMUM_LIVE_TIME / 1000);
					sizes[i] = this.originalSizes[i] * (0.8 + Math.sin(0.4 * i + this.time));
					positions[i3] = ac * this.moveDest[i3];
					positions[i3 + 1] += (Math.random() * 0.2 + 0.9) * this.moveDest[i3 + 1];
					positions[i3 + 2] = ac * this.moveDest[i3 + 2];
					this.particleTime[i] += deltaTime;
				}
			}
		}
		this.geometry.attributes['size'].needsUpdate = true;
		this.geometry.attributes['position'].needsUpdate = true;
	}

}

export { Particle };