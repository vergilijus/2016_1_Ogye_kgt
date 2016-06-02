define(function (require) {
    var jQuery = require('jquery');
    var THREE = require('three');
    var Detector = require('detector');
    var Orbit = require('orbit');
    var ws;

    var BasicScene = {
        init: function () {
//        if (!Detector.webgl) Detector.addGetWebGLMessage();
            
            
            var HOST = "ws://127.0.0.1/api/game";

            var CELL_SIZE = 200;
            var ITEM_SIZE = 160;
            var CELL_NUMBER = 4;
            var SIZE = CELL_NUMBER * CELL_SIZE;
            var HS = SIZE / 2;

            var container;
            var info;

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

            var gameField = [];


            init();

            function sendCoord(pos) {
                ws.send(JSON.stringify(pos))
            }



            function init() {

                // WebSocket init.
                ws = new WebSocket(HOST);
                ws.onopen = function (event) {
                    console.log("Connection open.");
                    startGame();
                };
                ws.onmessage = function (event) {
                    var pos = JSON.parse(event.data);
                    putItemOn(pos.x, pos.y, pos.z);
                    console.log("Message:" + event.data);
                };
                ws.onclose = function (event) {
                    console.log("Connection close.")
                };
                ws.onerror = function (event) {
                    console.log("Connection error.")
                };


                container = document.createElement('div');
                info = document.createElement('div');
                document.body.appendChild(container);

                // Status panel.
                info.style.position = 'absolute';
                info.style.top = '200px';
                info.style.width = '100%';
                info.style.textAlign = 'center';
                info.innerHTML = '<br><strong>click</strong>: add item, double <strong>shift + click</strong>: remove item';

            }

            function startGame() {

                // Field init.
                for (var x = 0; x < CELL_NUMBER; ++x) {
                    gameField[x] = [];
                    for (var y = 0; y < CELL_NUMBER; ++y) {
                        gameField[x][y] = [];
                        for (var z = 0; z < CELL_NUMBER; ++z) {
                            gameField[x][y][z] = 0;
                        }
                    }
                }

                camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
                camera.position.set(500, 800, 1300);
                camera.lookAt(new THREE.Vector3(-1000000, 8, 9));


                controls = new THREE.OrbitControls(camera);
                controls.enablePan = false;
                controls.minDistance = 500;
                controls.maxDistance = 5000;
                controls.target = new THREE.Vector3(HS, HS, HS);


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

                // Grid.

                var step = CELL_SIZE;
                var size = SIZE;

                var geometry = new THREE.Geometry();

                for (var i = 0; i <= size; i += step) {

                    geometry.vertices.push(new THREE.Vector3(0, 0, i));
                    geometry.vertices.push(new THREE.Vector3(size, 0, i));

                    geometry.vertices.push(new THREE.Vector3(i, 0, 0));
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

                // Plane.
                plane = new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial({visible: false}));
                plane.position.copy(new THREE.Vector3(SIZE / 2, 0, SIZE / 2));
                scene.add(plane);

                objects.push(plane);

                // Lights.

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
                container.appendChild(info);

                document.addEventListener('mousemove', onDocumentMouseMove, false);
                document.addEventListener('mousedown', onDocumentMouseDown, false);
                document.addEventListener('keydown', onDocumentKeyDown, false);
                document.addEventListener('keyup', onDocumentKeyUp, false);

                //

                window.addEventListener('resize', onWindowResize, false);
                animate();
            }

            function putItem(intersect) {
                var helperVoxel = new THREE.Mesh(helperCube, invisibleMaterial);
                helperVoxel.position.copy(intersect.point).add(intersect.face.normal);
                helperVoxel.position.divideScalar(CELL_SIZE).floor().multiplyScalar(CELL_SIZE).addScalar(CELL_SIZE / 2);

                if (!checkLimit(helperVoxel.position)) {
                    return;
                }

                objects.push(helperVoxel);
                curColor = rollOverMesh.material.color;

                var voxel = new THREE.Mesh(itemGeometry, cubeMaterial);
                voxel.position.copy(helperVoxel.position);

                objects.push(voxel);
                var pos = new THREE.Vector3();
                pos.copy(voxel.position);
                pos.divideScalar(CELL_SIZE).floor();

                // Отмечаем ход на игровом поле.
                gameField[pos.x][pos.y][pos.z] = cubeMaterial === materialDark ? 1 : 2;
                // Отправляем позицию на сервер.
                console.log(pos);
                sendCoord(pos);
            }

            function putItemOn(x, y, z) {
                var helperVoxel = new THREE.Mesh(helperCube, invisibleMaterial);
                var newPosition = new THREE.Vector3(x, y, z);
                newPosition.multiplyScalar(CELL_SIZE).addScalar(CELL_SIZE / 2);
                helperVoxel.position.copy(newPosition);

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

                console.log(voxel.position);
            }

            function checkLimit(pos) {
                if (pos.x < 0 || pos.x > SIZE) return false;
                if (pos.z < 0 || pos.z > SIZE) return false;
                if (pos.y >= SIZE) return false;
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
                    putItem(intersect);
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
        }
    };

    return BasicScene;
});

