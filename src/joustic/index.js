import * as THREE from 'three';
import nipplejs from 'nipplejs';

export class Joustic {
  #fwdValue = 0;
  #bkdValue = 0;
  #rgtValue = 0;
  #lftValue = 0;
  #tempVector = new THREE.Vector3();
  #upVector = new THREE.Vector3(0, 1, 0);

  #joyManager = null;

  #mesh = null;

  #scene = null;
  #camera = null;
  #controls = null;

  #speed = 0.3;

  constructor(scene, camera, controls) {
    this.#scene = scene;
    this.#camera = camera;
    this.#controls = controls;
  }

  updatePlayer() {
    const angle = this.#controls.getAzimuthalAngle();

    if (this.#fwdValue > 0) {
      this.#tempVector
        .set(0, 0, -this.#fwdValue)
        .applyAxisAngle(this.#upVector, angle);
      this.#mesh?.position.addScaledVector(this.#tempVector, 1);
    }

    if (this.#bkdValue > 0) {
      this.#tempVector
        .set(0, 0, this.#bkdValue)
        .applyAxisAngle(this.#upVector, angle);
      this.#mesh?.position.addScaledVector(this.#tempVector, 1);
    }

    if (this.#lftValue > 0) {
      this.#tempVector
        .set(-this.#lftValue, 0, 0)
        .applyAxisAngle(this.#upVector, angle);
      this.#mesh?.position.addScaledVector(this.#tempVector, 1);
    }

    if (this.#rgtValue > 0) {
      this.#tempVector
        .set(this.#rgtValue, 0, 0)
        .applyAxisAngle(this.#upVector, angle);
      this.#mesh?.position.addScaledVector(this.#tempVector, 1);
    }

    this.#mesh?.updateMatrixWorld();

    this.#camera.position.sub(this.#controls.target);
    this.#controls.target.copy(this.#mesh.position);
    this.#camera.position.add(this.#mesh.position);
  }

  setSpeed(speed) {
    this.#speed = speed;
  }

  addJoystick(parent) {
    const options = {
      zone: parent,
      size: 120,
      multitouch: true,
      maxNumberOfNipples: 2,
      mode: 'static',
      restJoystick: true,
      shape: 'circle',
      dynamicPage: true,
    };

    let geometry = new THREE.BoxGeometry(5, 5, 5);
    let cubeMaterial = new THREE.MeshNormalMaterial();
    this.#mesh = new THREE.Mesh(geometry, cubeMaterial);
    this.#scene.add(this.#mesh);

    this.#joyManager = nipplejs.create(options);

    this.#joyManager['0'].on('move', (_evt, data) => {
      const forward = data.vector.y * this.#speed;
      const turn = data.vector.x * this.#speed;

      if (forward > 0) {
        this.#fwdValue = Math.abs(forward);
        this.#bkdValue = 0;
      } else if (forward < 0) {
        this.#fwdValue = 0;
        this.#bkdValue = Math.abs(forward);
      }

      if (turn > 0) {
        this.#lftValue = 0;
        this.#rgtValue = Math.abs(turn);
      } else if (turn < 0) {
        this.#lftValue = Math.abs(turn);
        this.#rgtValue = 0;
      }
    });

    this.#joyManager['0'].on('end', (evt) => {
      this.#bkdValue = 0;
      this.#fwdValue = 0;
      this.#lftValue = 0;
      this.#rgtValue = 0;
    });
  }
}
