if (!Detector.webgl) Detector.addGetWebGLMessage();

var CELL_SIZE = 200;
var ITEM_SIZE = 160;
var CELL_NUMBER = 4;
var SIZE = CELL_NUMBER * CELL_SIZE;

var container;
var camera, scene, renderer, controls;
var plane, cube;
var mouse, raycaster, isShiftDown = false;

var rollOverGeo;
var rollOverMesh, rollOverMaterial;
var itemGeometry, cubeMaterial, materialDark, materialLight, invisibleMaterial;
var darkColor = new THREE.Color(0.7, 0.7, 0.7);
var lightColor = new THREE.Color(0.2, 0.2, 0.5);
var curColor = lightColor;
var objects = [];

var helperCube;

init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    var info = document.createElement('div');
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.innerHTML = '<br><strong>click</strong>: add item, double <strong>shift + click</strong>: remove item';
    container.appendChild(info);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(500, 800, 1300);
    camera.lookAt(new THREE.Vector3(0, 0, 1000));

    controls = new THREE.OrbitControls(camera);
    controls.enablePan = false;
    controls.minDistance = 500;
    controls.maxDistance = 5000;


    scene = new THREE.Scene();

    // roll-over helpers

    rollOverGeo = new THREE.BoxGeometry(CELL_SIZE, CELL_SIZE, CELL_SIZE);
    rollOverMaterial = new THREE.MeshBasicMaterial({color: lightColor, opacity: 0.2, transparent: true});
    rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
    scene.add(rollOverMesh);

    // cubes

    itemGeometry = new THREE.SphereGeometry(ITEM_SIZE / 2, 30, 30);

    helperCube = new THREE.BoxGeometry(CELL_SIZE, CELL_SIZE, CELL_SIZE);
    invisibleMaterial = new THREE.MeshBasicMaterial({visible: false});
    materialDark = new THREE.MeshLambertMaterial({
        color: darkColor
    });

    materialLight = new THREE.MeshLambertMaterial({
        color: lightColor
    });

    cubeMaterial = materialDark;

    // grid

    var step = CELL_SIZE;
    var size = CELL_NUMBER * CELL_SIZE / 2;

    var geometry = new THREE.Geometry();

    for (var i = -size; i <= size; i += step) {

        geometry.vertices.push(new THREE.Vector3(-size, 0, i));
        geometry.vertices.push(new THREE.Vector3(size, 0, i));

        geometry.vertices.push(new THREE.Vector3(i, 0, -size));
        geometry.vertices.push(new THREE.Vector3(i, 0, size));

    }

    var material = new THREE.LineBasicMaterial({color: 0x000000, opacity: 0.2, transparent: true});

    var line = new THREE.LineSegments(geometry, material);
    scene.add(line);

    //

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    var plane_size = CELL_SIZE * CELL_NUMBER;
    var geometry2 = new THREE.PlaneBufferGeometry(plane_size, plane_size);
    geometry2.rotateX(-Math.PI / 2);

    plane = new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial({visible: false}));
    scene.add(plane);

    objects.push(plane);

    // Lights

    var ambientLight = new THREE.AmbientLight(0x909090);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 0.75, 0.5).normalize();
    scene.add(directionalLight);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0xf0f0f0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('keydown', onDocumentKeyDown, false);
    document.addEventListener('keyup', onDocumentKeyUp, false);

    //

    window.addEventListener('resize', onWindowResize, false);

}

function putItem(intersect) {
    var helperVoxel = new THREE.Mesh(helperCube, invisibleMaterial);
    helperVoxel.position.copy(intersect.point).add(intersect.face.normal);
    helperVoxel.position.divideScalar(CELL_SIZE).floor().multiplyScalar(CELL_SIZE).addScalar(CELL_SIZE / 2);

    if (!checkLimit(helperVoxel.position)) {
        return;
    }

    scene.add(helperVoxel);
    objects.push(helperVoxel);
    curColor = rollOverMesh.material.color;
    rollOverMesh.material.color = ( curColor.equals(lightColor) ) ? darkColor : lightColor;
    cubeMaterial = cubeMaterial === materialDark ? materialLight : materialDark;
    var voxel = new THREE.Mesh(itemGeometry, cubeMaterial);
    voxel.position.copy(helperVoxel.position);
    scene.add(voxel);
    objects.push(voxel);
}

function checkLimit(pos) {
    console.log(pos.x, pos.y, pos.z);
    if (pos.x < -300 || pos.x > 300) return false;
    if (pos.z < -300 || pos.z > 300) return false;
    if (pos.y >= 900) return false;
    return true;
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {

    event.preventDefault();

    mouse.set(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1);

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {

        var intersect = intersects[0];

        rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
        rollOverMesh.position.divideScalar(CELL_SIZE).floor().multiplyScalar(CELL_SIZE).addScalar(CELL_SIZE / 2);
        if (!checkLimit(rollOverMesh.position)) {
            return;
        }
        rollOverMesh.visible = true;

    } else {
        rollOverMesh.visible = false;
    }

}

function onDocumentMouseDown(event) {

    event.preventDefault();

    mouse.set(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1);

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {

        var intersect = intersects[0];

        // delete cube

        if (isShiftDown) {

            if (intersect.object != plane) {

                scene.remove(intersect.object);

                objects.splice(objects.indexOf(intersect.object), 1);

            }

        } else {
            putItem(intersect);
        }

    }

}

function onDocumentKeyDown(event) {

    switch (event.keyCode) {

        case 16:
            isShiftDown = true;
            break;
    }

}

function onDocumentKeyUp(event) {

    switch (event.keyCode) {

        case 16:
            isShiftDown = false;
            break;
    }

}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    controls.update();
    renderer.render(scene, camera);
}


