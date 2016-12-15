/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var renderer_1 = __webpack_require__(1);
	var controller_1 = __webpack_require__(3);
	var explosionController_1 = __webpack_require__(4);
	window.onload = function () {
	    var time = Date.now();
	    var timeScale;
	    var stats = new Stats();
	    stats.showPanel(0);
	    document.getElementById("stats").appendChild(stats.domElement);
	    controller_1.Controller.init();
	    renderer_1.Renderer.init();
	    explosionController_1.ExplosionController.init();
	    timeScale = controller_1.Controller.getParams().TimeScale;
	    var onRequestAnimationFrame = function () {
	        requestAnimationFrame(onRequestAnimationFrame);
	        stats.begin();
	        renderer_1.Renderer.animate();
	        stats.end();
	    };
	    var deltaTimeMaximum = 1000 / 65;
	    renderer_1.Renderer.setUpdateFunc(function () {
	        var timeDiff = (Date.now() - time);
	        explosionController_1.ExplosionController.update(timeDiff > deltaTimeMaximum ? deltaTimeMaximum : timeDiff);
	        time = Date.now();
	    });
	    controller_1.Controller.setRestartFunc(function () {
	        explosionController_1.ExplosionController.reset();
	    });
	    requestAnimationFrame(onRequestAnimationFrame);
	    window.addEventListener('resize', function () { renderer_1.Renderer.onWindowResize(); }, false);
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(2);
	var controller_1 = __webpack_require__(3);
	var Renderer = (function () {
	    function Renderer() {
	    }
	    Renderer.init = function () {
	        var _this = this;
	        this.scene = new THREE.Scene();
	        this.scene.background = new THREE.Color(0xf8f8f8);
	        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
	        this.renderer = new THREE.WebGLRenderer({ antialias: true });
	        this.renderer.setSize(window.innerWidth, window.innerHeight);
	        document.body.appendChild(this.renderer.domElement);
	        this.gridHelper = new THREE.GridHelper(100, 40, 0xdddddd, 0xdddddd);
	        this.scene.add(this.gridHelper);
	        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
	        this.controls.enableDamping = true;
	        this.controls.dampingFactor = 0.25;
	        this.controls.enableZoom = true;
	        this.camera.position.z = 75;
	        this.camera.position.y = 75;
	        this.camera.position.x = 75;
	        controller_1.Controller.attachEvent(controller_1.Controller.INVERTED_BACKGROUND, function (value) {
	            if (value) {
	                _this.scene.background = new THREE.Color(0x111111);
	                _this.scene.remove(_this.gridHelper);
	                _this.gridHelper = new THREE.GridHelper(100, 40, 0x444444, 0x444444);
	                _this.scene.add(_this.gridHelper);
	            }
	            else {
	                _this.scene.background = new THREE.Color(0xf8f8f8);
	                _this.scene.remove(_this.gridHelper);
	                _this.gridHelper = new THREE.GridHelper(100, 40, 0xdddddd, 0xdddddd);
	                _this.scene.add(_this.gridHelper);
	            }
	        });
	        controller_1.Controller.attachEvent(controller_1.Controller.SHOW_GRID, function (value) {
	            _this.gridHelper.visible = value;
	        });
	    };
	    Renderer.animate = function () {
	        this.controls.update();
	        if (this.updateCallback != null) {
	            this.updateCallback();
	        }
	        this.renderer.render(this.scene, this.camera);
	    };
	    Renderer.addToScene = function (obj) {
	        this.scene.add(obj);
	    };
	    Renderer.removeFromScene = function (obj) {
	        this.scene.remove(obj);
	    };
	    Renderer.setUpdateFunc = function (func) {
	        this.updateCallback = func;
	    };
	    Renderer.onWindowResize = function () {
	        this.camera.aspect = window.innerWidth / window.innerHeight;
	        this.camera.updateProjectionMatrix();
	        this.renderer.setSize(window.innerWidth, window.innerHeight);
	    };
	    Renderer.updateCallback = null;
	    return Renderer;
	}());
	exports.Renderer = Renderer;


/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * @author qiao / https://github.com/qiao
	 * @author mrdoob / http://mrdoob.com
	 * @author alteredq / http://alteredqualia.com/
	 * @author WestLangley / http://github.com/WestLangley
	 * @author erich666 / http://erichaines.com
	 */

	// This set of controls performs orbiting, dollying (zooming), and panning.
	// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
	//
	//    Orbit - left mouse / touch: one finger move
	//    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
	//    Pan - right mouse, or arrow keys / touch: three finter swipe

	THREE.OrbitControls = function ( object, domElement ) {

		this.object = object;

		this.domElement = ( domElement !== undefined ) ? domElement : document;

		// Set to false to disable this control
		this.enabled = true;

		// "target" sets the location of focus, where the object orbits around
		this.target = new THREE.Vector3();

		// How far you can dolly in and out ( PerspectiveCamera only )
		this.minDistance = 0;
		this.maxDistance = Infinity;

		// How far you can zoom in and out ( OrthographicCamera only )
		this.minZoom = 0;
		this.maxZoom = Infinity;

		// How far you can orbit vertically, upper and lower limits.
		// Range is 0 to Math.PI radians.
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians

		// How far you can orbit horizontally, upper and lower limits.
		// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
		this.minAzimuthAngle = - Infinity; // radians
		this.maxAzimuthAngle = Infinity; // radians

		// Set to true to enable damping (inertia)
		// If damping is enabled, you must call controls.update() in your animation loop
		this.enableDamping = false;
		this.dampingFactor = 0.25;

		// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
		// Set to false to disable zooming
		this.enableZoom = true;
		this.zoomSpeed = 1.0;

		// Set to false to disable rotating
		this.enableRotate = true;
		this.rotateSpeed = 1.0;

		// Set to false to disable panning
		this.enablePan = true;
		this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

		// Set to true to automatically rotate around the target
		// If auto-rotate is enabled, you must call controls.update() in your animation loop
		this.autoRotate = false;
		this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

		// Set to false to disable use of the keys
		this.enableKeys = true;

		// The four arrow keys
		this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

		// Mouse buttons
		this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };

		// for reset
		this.target0 = this.target.clone();
		this.position0 = this.object.position.clone();
		this.zoom0 = this.object.zoom;

		//
		// public methods
		//

		this.getPolarAngle = function () {

			return spherical.phi;

		};

		this.getAzimuthalAngle = function () {

			return spherical.theta;

		};

		this.reset = function () {

			scope.target.copy( scope.target0 );
			scope.object.position.copy( scope.position0 );
			scope.object.zoom = scope.zoom0;

			scope.object.updateProjectionMatrix();
			scope.dispatchEvent( changeEvent );

			scope.update();

			state = STATE.NONE;

		};

		// this method is exposed, but perhaps it would be better if we can make it private...
		this.update = function() {

			var offset = new THREE.Vector3();

			// so camera.up is the orbit axis
			var quat = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
			var quatInverse = quat.clone().inverse();

			var lastPosition = new THREE.Vector3();
			var lastQuaternion = new THREE.Quaternion();

			return function update () {

				var position = scope.object.position;

				offset.copy( position ).sub( scope.target );

				// rotate offset to "y-axis-is-up" space
				offset.applyQuaternion( quat );

				// angle from z-axis around y-axis
				spherical.setFromVector3( offset );

				if ( scope.autoRotate && state === STATE.NONE ) {

					rotateLeft( getAutoRotationAngle() );

				}

				spherical.theta += sphericalDelta.theta;
				spherical.phi += sphericalDelta.phi;

				// restrict theta to be between desired limits
				spherical.theta = Math.max( scope.minAzimuthAngle, Math.min( scope.maxAzimuthAngle, spherical.theta ) );

				// restrict phi to be between desired limits
				spherical.phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, spherical.phi ) );

				spherical.makeSafe();


				spherical.radius *= scale;

				// restrict radius to be between desired limits
				spherical.radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, spherical.radius ) );

				// move target to panned location
				scope.target.add( panOffset );

				offset.setFromSpherical( spherical );

				// rotate offset back to "camera-up-vector-is-up" space
				offset.applyQuaternion( quatInverse );

				position.copy( scope.target ).add( offset );

				scope.object.lookAt( scope.target );

				if ( scope.enableDamping === true ) {

					sphericalDelta.theta *= ( 1 - scope.dampingFactor );
					sphericalDelta.phi *= ( 1 - scope.dampingFactor );

				} else {

					sphericalDelta.set( 0, 0, 0 );

				}

				scale = 1;
				panOffset.set( 0, 0, 0 );

				// update condition is:
				// min(camera displacement, camera rotation in radians)^2 > EPS
				// using small-angle approximation cos(x/2) = 1 - x^2 / 8

				if ( zoomChanged ||
					lastPosition.distanceToSquared( scope.object.position ) > EPS ||
					8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {

					scope.dispatchEvent( changeEvent );

					lastPosition.copy( scope.object.position );
					lastQuaternion.copy( scope.object.quaternion );
					zoomChanged = false;

					return true;

				}

				return false;

			};

		}();

		this.dispose = function() {

			scope.domElement.removeEventListener( 'contextmenu', onContextMenu, false );
			scope.domElement.removeEventListener( 'mousedown', onMouseDown, false );
			scope.domElement.removeEventListener( 'wheel', onMouseWheel, false );

			scope.domElement.removeEventListener( 'touchstart', onTouchStart, false );
			scope.domElement.removeEventListener( 'touchend', onTouchEnd, false );
			scope.domElement.removeEventListener( 'touchmove', onTouchMove, false );

			document.removeEventListener( 'mousemove', onMouseMove, false );
			document.removeEventListener( 'mouseup', onMouseUp, false );

			window.removeEventListener( 'keydown', onKeyDown, false );

			//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

		};

		//
		// internals
		//

		var scope = this;

		var changeEvent = { type: 'change' };
		var startEvent = { type: 'start' };
		var endEvent = { type: 'end' };

		var STATE = { NONE : - 1, ROTATE : 0, DOLLY : 1, PAN : 2, TOUCH_ROTATE : 3, TOUCH_DOLLY : 4, TOUCH_PAN : 5 };

		var state = STATE.NONE;

		var EPS = 0.000001;

		// current position in spherical coordinates
		var spherical = new THREE.Spherical();
		var sphericalDelta = new THREE.Spherical();

		var scale = 1;
		var panOffset = new THREE.Vector3();
		var zoomChanged = false;

		var rotateStart = new THREE.Vector2();
		var rotateEnd = new THREE.Vector2();
		var rotateDelta = new THREE.Vector2();

		var panStart = new THREE.Vector2();
		var panEnd = new THREE.Vector2();
		var panDelta = new THREE.Vector2();

		var dollyStart = new THREE.Vector2();
		var dollyEnd = new THREE.Vector2();
		var dollyDelta = new THREE.Vector2();

		function getAutoRotationAngle() {

			return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

		}

		function getZoomScale() {

			return Math.pow( 0.95, scope.zoomSpeed );

		}

		function rotateLeft( angle ) {

			sphericalDelta.theta -= angle;

		}

		function rotateUp( angle ) {

			sphericalDelta.phi -= angle;

		}

		var panLeft = function() {

			var v = new THREE.Vector3();

			return function panLeft( distance, objectMatrix ) {

				v.setFromMatrixColumn( objectMatrix, 0 ); // get X column of objectMatrix
				v.multiplyScalar( - distance );

				panOffset.add( v );

			};

		}();

		var panUp = function() {

			var v = new THREE.Vector3();

			return function panUp( distance, objectMatrix ) {

				v.setFromMatrixColumn( objectMatrix, 1 ); // get Y column of objectMatrix
				v.multiplyScalar( distance );

				panOffset.add( v );

			};

		}();

		// deltaX and deltaY are in pixels; right and down are positive
		var pan = function() {

			var offset = new THREE.Vector3();

			return function pan ( deltaX, deltaY ) {

				var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

				if ( scope.object instanceof THREE.PerspectiveCamera ) {

					// perspective
					var position = scope.object.position;
					offset.copy( position ).sub( scope.target );
					var targetDistance = offset.length();

					// half of the fov is center to top of screen
					targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );

					// we actually don't use screenWidth, since perspective camera is fixed to screen height
					panLeft( 2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix );
					panUp( 2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix );

				} else if ( scope.object instanceof THREE.OrthographicCamera ) {

					// orthographic
					panLeft( deltaX * ( scope.object.right - scope.object.left ) / scope.object.zoom / element.clientWidth, scope.object.matrix );
					panUp( deltaY * ( scope.object.top - scope.object.bottom ) / scope.object.zoom / element.clientHeight, scope.object.matrix );

				} else {

					// camera neither orthographic nor perspective
					console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
					scope.enablePan = false;

				}

			};

		}();

		function dollyIn( dollyScale ) {

			if ( scope.object instanceof THREE.PerspectiveCamera ) {

				scale /= dollyScale;

			} else if ( scope.object instanceof THREE.OrthographicCamera ) {

				scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom * dollyScale ) );
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
				scope.enableZoom = false;

			}

		}

		function dollyOut( dollyScale ) {

			if ( scope.object instanceof THREE.PerspectiveCamera ) {

				scale *= dollyScale;

			} else if ( scope.object instanceof THREE.OrthographicCamera ) {

				scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom / dollyScale ) );
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
				scope.enableZoom = false;

			}

		}

		//
		// event callbacks - update the object state
		//

		function handleMouseDownRotate( event ) {

			//console.log( 'handleMouseDownRotate' );

			rotateStart.set( event.clientX, event.clientY );

		}

		function handleMouseDownDolly( event ) {

			//console.log( 'handleMouseDownDolly' );

			dollyStart.set( event.clientX, event.clientY );

		}

		function handleMouseDownPan( event ) {

			//console.log( 'handleMouseDownPan' );

			panStart.set( event.clientX, event.clientY );

		}

		function handleMouseMoveRotate( event ) {

			//console.log( 'handleMouseMoveRotate' );

			rotateEnd.set( event.clientX, event.clientY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			// rotating across whole screen goes 360 degrees around
			rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

			// rotating up and down along whole screen attempts to go 360, but limited to 180
			rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

			rotateStart.copy( rotateEnd );

			scope.update();

		}

		function handleMouseMoveDolly( event ) {

			//console.log( 'handleMouseMoveDolly' );

			dollyEnd.set( event.clientX, event.clientY );

			dollyDelta.subVectors( dollyEnd, dollyStart );

			if ( dollyDelta.y > 0 ) {

				dollyIn( getZoomScale() );

			} else if ( dollyDelta.y < 0 ) {

				dollyOut( getZoomScale() );

			}

			dollyStart.copy( dollyEnd );

			scope.update();

		}

		function handleMouseMovePan( event ) {

			//console.log( 'handleMouseMovePan' );

			panEnd.set( event.clientX, event.clientY );

			panDelta.subVectors( panEnd, panStart );

			pan( panDelta.x, panDelta.y );

			panStart.copy( panEnd );

			scope.update();

		}

		function handleMouseUp( event ) {

			//console.log( 'handleMouseUp' );

		}

		function handleMouseWheel( event ) {

			//console.log( 'handleMouseWheel' );

			if ( event.deltaY < 0 ) {

				dollyOut( getZoomScale() );

			} else if ( event.deltaY > 0 ) {

				dollyIn( getZoomScale() );

			}

			scope.update();

		}

		function handleKeyDown( event ) {

			//console.log( 'handleKeyDown' );

			switch ( event.keyCode ) {

				case scope.keys.UP:
					pan( 0, scope.keyPanSpeed );
					scope.update();
					break;

				case scope.keys.BOTTOM:
					pan( 0, - scope.keyPanSpeed );
					scope.update();
					break;

				case scope.keys.LEFT:
					pan( scope.keyPanSpeed, 0 );
					scope.update();
					break;

				case scope.keys.RIGHT:
					pan( - scope.keyPanSpeed, 0 );
					scope.update();
					break;

			}

		}

		function handleTouchStartRotate( event ) {

			//console.log( 'handleTouchStartRotate' );

			rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

		}

		function handleTouchStartDolly( event ) {

			//console.log( 'handleTouchStartDolly' );

			var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
			var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

			var distance = Math.sqrt( dx * dx + dy * dy );

			dollyStart.set( 0, distance );

		}

		function handleTouchStartPan( event ) {

			//console.log( 'handleTouchStartPan' );

			panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

		}

		function handleTouchMoveRotate( event ) {

			//console.log( 'handleTouchMoveRotate' );

			rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			// rotating across whole screen goes 360 degrees around
			rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

			// rotating up and down along whole screen attempts to go 360, but limited to 180
			rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

			rotateStart.copy( rotateEnd );

			scope.update();

		}

		function handleTouchMoveDolly( event ) {

			//console.log( 'handleTouchMoveDolly' );

			var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
			var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

			var distance = Math.sqrt( dx * dx + dy * dy );

			dollyEnd.set( 0, distance );

			dollyDelta.subVectors( dollyEnd, dollyStart );

			if ( dollyDelta.y > 0 ) {

				dollyOut( getZoomScale() );

			} else if ( dollyDelta.y < 0 ) {

				dollyIn( getZoomScale() );

			}

			dollyStart.copy( dollyEnd );

			scope.update();

		}

		function handleTouchMovePan( event ) {

			//console.log( 'handleTouchMovePan' );

			panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

			panDelta.subVectors( panEnd, panStart );

			pan( panDelta.x, panDelta.y );

			panStart.copy( panEnd );

			scope.update();

		}

		function handleTouchEnd( event ) {

			//console.log( 'handleTouchEnd' );

		}

		//
		// event handlers - FSM: listen for events and reset state
		//

		function onMouseDown( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();

			if ( event.button === scope.mouseButtons.ORBIT ) {

				if ( scope.enableRotate === false ) return;

				handleMouseDownRotate( event );

				state = STATE.ROTATE;

			} else if ( event.button === scope.mouseButtons.ZOOM ) {

				if ( scope.enableZoom === false ) return;

				handleMouseDownDolly( event );

				state = STATE.DOLLY;

			} else if ( event.button === scope.mouseButtons.PAN ) {

				if ( scope.enablePan === false ) return;

				handleMouseDownPan( event );

				state = STATE.PAN;

			}

			if ( state !== STATE.NONE ) {

				document.addEventListener( 'mousemove', onMouseMove, false );
				document.addEventListener( 'mouseup', onMouseUp, false );

				scope.dispatchEvent( startEvent );

			}

		}

		function onMouseMove( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();

			if ( state === STATE.ROTATE ) {

				if ( scope.enableRotate === false ) return;

				handleMouseMoveRotate( event );

			} else if ( state === STATE.DOLLY ) {

				if ( scope.enableZoom === false ) return;

				handleMouseMoveDolly( event );

			} else if ( state === STATE.PAN ) {

				if ( scope.enablePan === false ) return;

				handleMouseMovePan( event );

			}

		}

		function onMouseUp( event ) {

			if ( scope.enabled === false ) return;

			handleMouseUp( event );

			document.removeEventListener( 'mousemove', onMouseMove, false );
			document.removeEventListener( 'mouseup', onMouseUp, false );

			scope.dispatchEvent( endEvent );

			state = STATE.NONE;

		}

		function onMouseWheel( event ) {

			if ( scope.enabled === false || scope.enableZoom === false || ( state !== STATE.NONE && state !== STATE.ROTATE ) ) return;

			event.preventDefault();
			event.stopPropagation();

			handleMouseWheel( event );

			scope.dispatchEvent( startEvent ); // not sure why these are here...
			scope.dispatchEvent( endEvent );

		}

		function onKeyDown( event ) {

			if ( scope.enabled === false || scope.enableKeys === false || scope.enablePan === false ) return;

			handleKeyDown( event );

		}

		function onTouchStart( event ) {

			if ( scope.enabled === false ) return;

			switch ( event.touches.length ) {

				case 1:	// one-fingered touch: rotate

					if ( scope.enableRotate === false ) return;

					handleTouchStartRotate( event );

					state = STATE.TOUCH_ROTATE;

					break;

				case 2:	// two-fingered touch: dolly

					if ( scope.enableZoom === false ) return;

					handleTouchStartDolly( event );

					state = STATE.TOUCH_DOLLY;

					break;

				case 3: // three-fingered touch: pan

					if ( scope.enablePan === false ) return;

					handleTouchStartPan( event );

					state = STATE.TOUCH_PAN;

					break;

				default:

					state = STATE.NONE;

			}

			if ( state !== STATE.NONE ) {

				scope.dispatchEvent( startEvent );

			}

		}

		function onTouchMove( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();
			event.stopPropagation();

			switch ( event.touches.length ) {

				case 1: // one-fingered touch: rotate

					if ( scope.enableRotate === false ) return;
					if ( state !== STATE.TOUCH_ROTATE ) return; // is this needed?...

					handleTouchMoveRotate( event );

					break;

				case 2: // two-fingered touch: dolly

					if ( scope.enableZoom === false ) return;
					if ( state !== STATE.TOUCH_DOLLY ) return; // is this needed?...

					handleTouchMoveDolly( event );

					break;

				case 3: // three-fingered touch: pan

					if ( scope.enablePan === false ) return;
					if ( state !== STATE.TOUCH_PAN ) return; // is this needed?...

					handleTouchMovePan( event );

					break;

				default:

					state = STATE.NONE;

			}

		}

		function onTouchEnd( event ) {

			if ( scope.enabled === false ) return;

			handleTouchEnd( event );

			scope.dispatchEvent( endEvent );

			state = STATE.NONE;

		}

		function onContextMenu( event ) {

			event.preventDefault();

		}

		//

		scope.domElement.addEventListener( 'contextmenu', onContextMenu, false );

		scope.domElement.addEventListener( 'mousedown', onMouseDown, false );
		scope.domElement.addEventListener( 'wheel', onMouseWheel, false );

		scope.domElement.addEventListener( 'touchstart', onTouchStart, false );
		scope.domElement.addEventListener( 'touchend', onTouchEnd, false );
		scope.domElement.addEventListener( 'touchmove', onTouchMove, false );

		window.addEventListener( 'keydown', onKeyDown, false );

		// force an update at start

		this.update();

	};

	THREE.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
	THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;

	Object.defineProperties( THREE.OrbitControls.prototype, {

		center: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .center has been renamed to .target' );
				return this.target;

			}

		},

		// backward compatibility

		noZoom: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
				return ! this.enableZoom;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
				this.enableZoom = ! value;

			}

		},

		noRotate: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
				return ! this.enableRotate;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
				this.enableRotate = ! value;

			}

		},

		noPan: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
				return ! this.enablePan;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
				this.enablePan = ! value;

			}

		},

		noKeys: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
				return ! this.enableKeys;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
				this.enableKeys = ! value;

			}

		},

		staticMoving : {

			get: function () {

				console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
				return ! this.enableDamping;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
				this.enableDamping = ! value;

			}

		},

		dynamicDampingFactor : {

			get: function () {

				console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
				return this.dampingFactor;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
				this.dampingFactor = value;

			}

		}

	} );


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	var Controller = (function () {
	    function Controller() {
	    }
	    Controller.init = function () {
	        this.eventListener = [];
	        var ControlParam = function () {
	            this.LightColor2 = '#ff8700';
	            this.LightColor = '#f7f342';
	            this.NormalColor = '#f7a90e';
	            this.DarkColor2 = '#ff9800';
	            this.GreyColor = '#3c342f';
	            this.DarkColor = "#181818";
	            this.TimeScale = 3;
	            this.ParticleSpread = 1;
	            this.ParticleColor = '#ffb400';
	            this.InvertedBackground = false;
	            this.ShowGrid = true;
	            this.restart = function () { };
	        };
	        var params = new ControlParam();
	        var gui = new dat.GUI();
	        var f1 = gui.addFolder('Spawn Color');
	        this.eventListener[Controller.DARK_COLOR] = f1.addColor(params, 'DarkColor');
	        this.eventListener[Controller.DARK_COLOR_2] = f1.addColor(params, 'GreyColor');
	        this.eventListener[Controller.DARK_COLOR_2] = f1.addColor(params, 'DarkColor2');
	        this.eventListener[Controller.NORMAL_COLOR] = f1.addColor(params, 'NormalColor');
	        this.eventListener[Controller.LIGHT_COLOR] = f1.addColor(params, 'LightColor');
	        this.eventListener[Controller.LIGHT_COLOR_2] = f1.addColor(params, 'LightColor2');
	        f1.open();
	        var f2 = gui.addFolder('Flare Particle');
	        this.eventListener[Controller.PARTICLE_SPREAD] = f2.add(params, 'ParticleSpread', 0, 2);
	        this.eventListener[Controller.PARTICLE_COLOR] = f2.addColor(params, 'ParticleColor');
	        f2.open();
	        this.eventListener[Controller.INVERTED_BACKGROUND] = gui.add(params, 'InvertedBackground');
	        this.eventListener[Controller.SHOW_GRID] = gui.add(params, 'ShowGrid');
	        this.eventListener[Controller.TIME_SCALE] = gui.add(params, 'TimeScale', 0, 10);
	        gui.add(params, 'restart');
	        this.gui = gui;
	        this.params = params;
	    };
	    Controller.getParams = function () {
	        return this.params;
	    };
	    Controller.setRestartFunc = function (func) {
	        this.params.restart = func;
	    };
	    Controller.attachEvent = function (key, callback) {
	        this.eventListener[key].onChange(callback);
	    };
	    Controller.DARK_COLOR = 0;
	    Controller.NORMAL_COLOR = 1;
	    Controller.LIGHT_COLOR = 2;
	    Controller.LIGHT_COLOR_2 = 3;
	    Controller.DARK_COLOR_2 = 4;
	    Controller.RESTART = 5;
	    Controller.TIME_SCALE = 6;
	    Controller.PARTICLE_SPREAD = 7;
	    Controller.PARTICLE_COLOR = 8;
	    Controller.INVERTED_BACKGROUND = 9;
	    Controller.SHOW_GRID = 10;
	    return Controller;
	}());
	exports.Controller = Controller;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var flameSphere_1 = __webpack_require__(5);
	var flameAnimation_1 = __webpack_require__(8);
	var flareParticle_1 = __webpack_require__(9);
	var controller_1 = __webpack_require__(3);
	var renderer_1 = __webpack_require__(1);
	var ExplosionController = (function () {
	    function ExplosionController() {
	    }
	    ExplosionController.init = function () {
	        var _this = this;
	        this.objs = [];
	        this.objectPool = [];
	        this.spawnTime = 0;
	        this.flareParticle = new flareParticle_1.FlareParticle();
	        this.spawnNewFlame();
	        controller_1.Controller.attachEvent(controller_1.Controller.DARK_COLOR, function (value) {
	            for (var i = 0; i < _this.objs.length; i++) {
	                _this.currentCol['colDark'] = value;
	                _this.objs[i].instance.setColor({ colDark: value });
	            }
	        });
	        controller_1.Controller.attachEvent(controller_1.Controller.NORMAL_COLOR, function (value) {
	            for (var i = 0; i < _this.objs.length; i++) {
	                _this.currentCol['colNormal'] = value;
	                _this.objs[i].instance.setColor({ colNormal: value });
	            }
	        });
	        controller_1.Controller.attachEvent(controller_1.Controller.LIGHT_COLOR, function (value) {
	            for (var i = 0; i < _this.objs.length; i++) {
	                _this.currentCol['colLight'] = value;
	                _this.objs[i].instance.setColor({ colLight: value });
	            }
	        });
	        this.reset();
	    };
	    ExplosionController.reset = function () {
	        for (var i = 0; i < this.objs.length; i++) {
	            this.objs[i].reset();
	            renderer_1.Renderer.removeFromScene(this.objs[i].instance.getMesh());
	        }
	        this.objectPool = [];
	        this.objs = [];
	        this.flareParticle.reset();
	    };
	    ExplosionController.spawnNewFlame = function () {
	        var i = this.objs.length;
	        if (this.objectPool.length > 0) {
	            i = this.objectPool.shift();
	            this.objs[i].instance.getMesh().visible = true;
	            this.objs[i].instance.setColor(this.currentCol);
	            this.objs[i].reset();
	        }
	        else {
	            var obj = new flameAnimation_1.FlameAnimation(new flameSphere_1.FlameSphere(Math.random() * 5 + 8), Math.random() * 7 - 4, Math.random() * 7 - 4, Math.random() * 0.4 + 0.35, Math.random() * 0.4 + 0.3);
	            obj.instance.setColor(this.currentCol);
	            this.objs.push(obj);
	            renderer_1.Renderer.addToScene(this.objs[i].instance.getMesh());
	        }
	    };
	    ExplosionController.update = function (deltaTime) {
	        var timeScale = controller_1.Controller.getParams().TimeScale;
	        this.spawnTime += deltaTime * timeScale;
	        if (this.spawnTime > 200) {
	            while (this.spawnTime > 200)
	                this.spawnTime -= 200;
	            this.spawnNewFlame();
	        }
	        for (var i = 0; i < this.objs.length; i++) {
	            if (this.objs[i].isDie()) {
	                if (this.objs[i].inPolling())
	                    continue;
	                this.objs[i].setInPolling(true);
	                this.objs[i].instance.getMesh().visible = false;
	                this.objectPool.push(i);
	            }
	            else {
	                this.objs[i].update(deltaTime);
	            }
	        }
	        this.flareParticle.update(deltaTime * timeScale);
	    };
	    ExplosionController.currentCol = {};
	    return ExplosionController;
	}());
	exports.ExplosionController = ExplosionController;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var assetsManager_1 = __webpack_require__(6);
	var utils_1 = __webpack_require__(7);
	var FlameSphere = (function () {
	    function FlameSphere(radius) {
	        this.flowRatio = 1;
	        radius = radius || 20;
	        var glsl = assetsManager_1.AssetsManager.instance.getTexture();
	        this.material = new THREE.ShaderMaterial({
	            uniforms: {
	                time: {
	                    type: "f",
	                    value: 0.0
	                },
	                seed: {
	                    type: 'f',
	                    value: Math.random() * 1000.0
	                },
	                detail: {
	                    type: 'f',
	                    value: Math.random() * 3.5 + 5
	                },
	                opacity: {
	                    type: 'f',
	                    value: 1
	                },
	                colLight: {
	                    value: utils_1.Utils.hexToVec3(FlameSphere.defaultColor.colLight)
	                },
	                colNormal: {
	                    value: utils_1.Utils.hexToVec3(FlameSphere.defaultColor.colNormal)
	                },
	                colDark: {
	                    value: utils_1.Utils.hexToVec3(FlameSphere.defaultColor.colDark)
	                }
	            },
	            vertexShader: glsl.vertexFlameShader,
	            fragmentShader: glsl.fragmentFlameShader
	        });
	        this.material.transparent = true;
	        this.mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 3), this.material);
	        this.mesh.position.set(0, 0, 0);
	    }
	    FlameSphere.prototype.setColor = function (prop) {
	        if (prop.colDark != null) {
	            if (typeof prop.colDark === 'string') {
	                this.material.uniforms['colDark'].value = utils_1.Utils.hexToVec3(prop.colDark);
	            }
	            else {
	                this.material.uniforms['colDark'].value = prop.colDark;
	            }
	        }
	        if (prop.colNormal != null) {
	            if (typeof prop.colNormal === 'string') {
	                this.material.uniforms['colNormal'].value = utils_1.Utils.hexToVec3(prop.colNormal);
	            }
	            else {
	                this.material.uniforms['colNormal'].value = prop.colNormal;
	            }
	        }
	        if (prop.colLight != null) {
	            if (typeof prop.colLight === 'string') {
	                this.material.uniforms['colLight'].value = utils_1.Utils.hexToVec3(prop.colLight);
	            }
	            else {
	                this.material.uniforms['colLight'].value = prop.colLight;
	            }
	        }
	    };
	    FlameSphere.prototype.setOpacity = function (value) {
	        this.material.uniforms['opacity'].value = value;
	    };
	    FlameSphere.prototype.setDetail = function (value) {
	        this.material.uniforms['detail'].value = value;
	    };
	    FlameSphere.prototype.update = function (timeDiff) {
	        this.material.uniforms['time'].value += .0005 * timeDiff * this.flowRatio;
	    };
	    FlameSphere.prototype.setFlowRatio = function (val) {
	        this.flowRatio = val;
	    };
	    FlameSphere.prototype.getMesh = function () {
	        return this.mesh;
	    };
	    FlameSphere.defaultColor = {
	        colDark: '#000000',
	        colNormal: '#f7a90e',
	        colLight: '#ede92a'
	    };
	    return FlameSphere;
	}());
	exports.FlameSphere = FlameSphere;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	var AssetsManager = (function () {
	    function AssetsManager() {
	        var _this = this;
	        this.vertexFlameShader = null;
	        this.fragmentFlameShader = null;
	        this.vertexParticleShader = null;
	        this.fragmentParticleShader = null;
	        $.ajax({
	            url: './dist_github/shader/vertexFlameShader.glsl',
	            async: false,
	            success: function (vs) {
	                _this.vertexFlameShader = vs;
	            }
	        });
	        $.ajax({
	            url: './dist_github/shader/fragmentFlameShader.glsl',
	            async: false,
	            success: function (fs) {
	                _this.fragmentFlameShader = fs;
	            }
	        });
	        $.ajax({
	            url: './dist_github/shader/vertexParticleShader.glsl',
	            async: false,
	            success: function (fs) {
	                _this.vertexParticleShader = fs;
	            }
	        });
	        $.ajax({
	            url: './dist_github/shader/fragmentParticleShader.glsl',
	            async: false,
	            success: function (fs) {
	                _this.fragmentParticleShader = fs;
	            }
	        });
	    }
	    AssetsManager.prototype.getTexture = function () {
	        return {
	            vertexFlameShader: this.vertexFlameShader,
	            fragmentFlameShader: this.fragmentFlameShader,
	            vectexParticleShader: this.vertexParticleShader,
	            fragmentParticleShader: this.fragmentParticleShader
	        };
	    };
	    AssetsManager.instance = new AssetsManager();
	    return AssetsManager;
	}());
	exports.AssetsManager = AssetsManager;


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	var Utils = (function () {
	    function Utils() {
	    }
	    Utils.hexToVec3 = function (col) {
	        var num = parseInt(col.substr(1), 16);
	        var r = (num / 256 / 256) % 256;
	        var g = (num / 256) % 256;
	        var b = num % 256;
	        return [r / 255.0, g / 255.0, b / 255.0];
	    };
	    Utils.formatZero = function (val) {
	        if (val.length == 1)
	            return '0' + val;
	        return val;
	    };
	    Utils.vec3ToHex = function (col) {
	        return '#' +
	            this.formatZero(col[0].toString(16)) +
	            this.formatZero(col[1].toString(16)) +
	            this.formatZero(col[2].toString(16));
	    };
	    Utils.vec3Blend = function (cola, colb, t) {
	        var a = this.hexToVec3(cola);
	        var b = this.hexToVec3(colb);
	        return [
	            a[0] + (b[0] - a[0]) * t,
	            a[1] + (b[1] - a[1]) * t,
	            a[2] + (b[2] - a[2]) * t
	        ];
	    };
	    return Utils;
	}());
	exports.Utils = Utils;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var controller_1 = __webpack_require__(3);
	var utils_1 = __webpack_require__(7);
	var FlameAnimation = (function () {
	    function FlameAnimation(instance, distX, distZ, yRatio, animationTimeRatio) {
	        distX = distX || 0;
	        distZ = distZ || 0;
	        yRatio = yRatio || 1;
	        animationTimeRatio = animationTimeRatio || 1;
	        this.instance = instance;
	        this.distX = distX;
	        this.distZ = distZ;
	        this.yRatio = yRatio;
	        this.animationTimeRatio = animationTimeRatio;
	        this.reset();
	    }
	    FlameAnimation.prototype.reset = function () {
	        this.randFlyX = Math.random() * 0.1 - 0.05;
	        this.randFlyZ = Math.random() * 0.1 - 0.05;
	        this.posX = -1;
	        this.currentTime = 0;
	        this.timeCount = 0;
	        this.spawnTime = 0;
	        this.isObjDie = false;
	        this.isInPooling = false;
	        this.currentState = FlameAnimation.STATE_BEFORE_START;
	        this.colorTransitionRandom = Math.random() * 2000 - 1000;
	        this.instance.getMesh().position.set(0, 0, 0);
	        this.instance.getMesh().scale.set(0, 0, 0);
	        this.instance.setFlowRatio(1);
	        this.instance.setOpacity(1);
	    };
	    FlameAnimation.prototype.setColor = function () {
	        var params = controller_1.Controller.getParams();
	        var tc = this.timeCount + this.colorTransitionRandom;
	        if (tc < 2500 + this.colorTransitionRandom) {
	            var t = tc / 2500 + this.colorTransitionRandom;
	            this.instance.setColor({
	                colDark: params.NormalColor,
	                colNormal: params.LightColor,
	                colLight: params.LightColor2
	            });
	        }
	        else if (tc < 4000) {
	            var t = (tc - 2500) / 1500;
	            this.instance.setColor({
	                colDark: utils_1.Utils.vec3Blend(params.NormalColor, params.DarkColor2, t),
	                colNormal: utils_1.Utils.vec3Blend(params.LightColor, params.NormalColor, t),
	                colLight: utils_1.Utils.vec3Blend(params.LightColor2, params.LightColor, t)
	            });
	        }
	        else if (tc < 7000) {
	            var t = (tc - 4000) / 3000;
	            this.instance.setColor({
	                colDark: utils_1.Utils.vec3Blend(params.DarkColor2, params.DarkColor2, t),
	                colNormal: utils_1.Utils.vec3Blend(params.NormalColor, params.NormalColor, t),
	                colLight: utils_1.Utils.vec3Blend(params.LightColor, params.LightColor, t)
	            });
	        }
	        else if (tc < 12000) {
	            var t = Math.min(1, (tc - 7000) / 5000);
	            this.instance.setColor({
	                colDark: utils_1.Utils.vec3Blend(params.DarkColor2, params.DarkColor, t),
	                colNormal: utils_1.Utils.vec3Blend(params.NormalColor, params.DarkColor2, t),
	                colLight: utils_1.Utils.vec3Blend(params.LightColor, params.NormalColor, t)
	            });
	        }
	        else if (tc < 17000) {
	            var t = Math.min(1, (tc - 12000) / 5000);
	            this.instance.setColor({
	                colDark: utils_1.Utils.vec3Blend(params.DarkColor, params.DarkColor, t),
	                colNormal: utils_1.Utils.vec3Blend(params.DarkColor2, params.DarkColor, t),
	                colLight: utils_1.Utils.vec3Blend(params.NormalColor, params.DarkColor2, t)
	            });
	        }
	        else {
	            var t = Math.min(1, (tc - 17000) / 6000);
	            this.instance.setColor({
	                colDark: utils_1.Utils.vec3Blend(params.DarkColor, params.GreyColor, t),
	                colNormal: utils_1.Utils.vec3Blend(params.DarkColor, params.GreyColor, t),
	                colLight: utils_1.Utils.vec3Blend(params.DarkColor2, params.DarkColor, t)
	            });
	        }
	    };
	    FlameAnimation.prototype.updateState = function (deltaTime) {
	        var cTime = this.currentTime + deltaTime;
	        if (this.currentState == FlameAnimation.STATE_BEFORE_START) {
	            if (cTime > FlameAnimation.BEFORE_INTERVAL) {
	                cTime -= FlameAnimation.BEFORE_INTERVAL;
	                this.currentState = FlameAnimation.STATE_SPAWN;
	            }
	        }
	        else if (this.currentState == FlameAnimation.STATE_SPAWN) {
	            if (cTime > FlameAnimation.SPAWN_INTERVAL) {
	                cTime -= FlameAnimation.SPAWN_INTERVAL;
	                this.posX = -1;
	                this.currentState = FlameAnimation.STATE_SPAWN_DOWN;
	            }
	        }
	        else if (this.currentState == FlameAnimation.STATE_SPAWN_DOWN) {
	            if (cTime > FlameAnimation.SPAWN_DOWN_INTERVAL) {
	                cTime -= FlameAnimation.SPAWN_DOWN_INTERVAL;
	                this.currentState = FlameAnimation.STATE_FLOATING;
	            }
	        }
	        else if (this.currentState == FlameAnimation.STATE_FLOATING) {
	            if (cTime > FlameAnimation.FLOATING_INTERVAL) {
	                this.randFlyX += Math.random() * 0.2;
	                this.randFlyZ += Math.random() * 0.2;
	                cTime -= FlameAnimation.FLOATING_INTERVAL;
	                this.posX = -1;
	                this.currentState = FlameAnimation.STATE_IDLE;
	            }
	        }
	        else if (this.currentState == FlameAnimation.STATE_IDLE) {
	            if (cTime > FlameAnimation.IDLE_INTERVAL) {
	                this.isObjDie = true;
	            }
	        }
	        this.currentTime = cTime;
	    };
	    FlameAnimation.prototype.update = function (deltaTime) {
	        if (this.isObjDie)
	            return;
	        var mesh = this.instance.getMesh();
	        var timeScale = controller_1.Controller.getParams().TimeScale;
	        this.updateState(deltaTime * timeScale);
	        this.timeCount += deltaTime * timeScale;
	        if (this.currentState == FlameAnimation.STATE_SPAWN) {
	            var t = this.currentTime / FlameAnimation.SPAWN_INTERVAL;
	            var t2 = this.currentTime / (FlameAnimation.SPAWN_INTERVAL + FlameAnimation.SPAWN_DOWN_INTERVAL);
	            mesh.position.set(this.distX * t2, mesh.position.y + t * 0.4 * this.yRatio * timeScale, this.distZ * t2);
	            var scale = t;
	            mesh.scale.set(scale, scale, scale);
	        }
	        else if (this.currentState == FlameAnimation.STATE_SPAWN_DOWN) {
	            var t2 = (this.currentTime + FlameAnimation.SPAWN_INTERVAL) /
	                (FlameAnimation.SPAWN_INTERVAL + FlameAnimation.SPAWN_DOWN_INTERVAL);
	            mesh.position.set(this.distX * t2, mesh.position.y +
	                (0.6 * timeScale *
	                    (1 - this.currentTime / FlameAnimation.SPAWN_DOWN_INTERVAL) +
	                    0.2 * timeScale) * this.yRatio, this.distZ * t2);
	        }
	        else if (this.currentState == FlameAnimation.STATE_FLOATING) {
	            if (this.posX == -1) {
	                this.posX = mesh.position.x;
	                this.posY = mesh.position.y;
	                this.posZ = mesh.position.z;
	                this.instance.setFlowRatio(0.5);
	            }
	            mesh.position.set(mesh.position.x + this.randFlyX * timeScale, mesh.position.y + 0.2 * timeScale, mesh.position.z + this.randFlyZ * timeScale);
	            var scale = mesh.scale.x + 0.003 * timeScale;
	            mesh.scale.set(scale, scale, scale);
	        }
	        else if (this.currentState == FlameAnimation.STATE_IDLE) {
	            if (this.posX == -1) {
	                this.posX = mesh.position.x;
	                this.posY = mesh.position.y;
	                this.posZ = mesh.position.z;
	                this.instance.setFlowRatio(0.2);
	            }
	            mesh.position.setY(this.posY + this.currentTime / 100);
	            if (this.currentTime > FlameAnimation.IDLE_INTERVAL - 5000) {
	                this.instance.setOpacity(1 - (this.currentTime - (FlameAnimation.IDLE_INTERVAL - 5000)) / 5000);
	            }
	            var scale = mesh.scale.x + 0.002 * timeScale;
	            mesh.scale.set(scale, scale, scale);
	        }
	        this.setColor();
	        this.instance.update(deltaTime * timeScale * this.animationTimeRatio);
	    };
	    FlameAnimation.prototype.isDie = function () {
	        return this.isObjDie;
	    };
	    FlameAnimation.prototype.inPolling = function () {
	        return this.isInPooling;
	    };
	    FlameAnimation.prototype.setInPolling = function (val) {
	        this.isInPooling = val;
	    };
	    FlameAnimation.STATE_BEFORE_START = 0;
	    FlameAnimation.STATE_SPAWN = 1;
	    FlameAnimation.STATE_SPAWN_DOWN = 2;
	    FlameAnimation.STATE_FLOATING = 3;
	    FlameAnimation.STATE_IDLE = 4;
	    FlameAnimation.BEFORE_INTERVAL = 300;
	    FlameAnimation.SPAWN_INTERVAL = 400;
	    FlameAnimation.SPAWN_DOWN_INTERVAL = 2000;
	    FlameAnimation.FLOATING_INTERVAL = 8000;
	    FlameAnimation.IDLE_INTERVAL = 20000;
	    return FlameAnimation;
	}());
	exports.FlameAnimation = FlameAnimation;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var renderer_1 = __webpack_require__(1);
	var assetsManager_1 = __webpack_require__(6);
	var controller_1 = __webpack_require__(3);
	var constants_1 = __webpack_require__(10);
	var utils_1 = __webpack_require__(7);
	var FlareParticle = (function () {
	    function FlareParticle() {
	        var _this = this;
	        this.particlesNumber = 500;
	        var shaderMaterial = new THREE.ShaderMaterial({
	            uniforms: {
	                color: { value: new THREE.Color(0xffffff) },
	                texture: { value: new THREE.TextureLoader().load("./dist_github/images/circle-particle.png") }
	            },
	            vertexShader: assetsManager_1.AssetsManager.instance.getTexture().vectexParticleShader,
	            fragmentShader: assetsManager_1.AssetsManager.instance.getTexture().fragmentParticleShader,
	            blending: THREE.NormalBlending,
	            depthTest: false,
	            transparent: true
	        });
	        this.geometry = new THREE.BufferGeometry();
	        var positions = new Float32Array(this.particlesNumber * 3);
	        var colors = new Float32Array(this.particlesNumber * 3);
	        var sizes = new Float32Array(this.particlesNumber);
	        this.needsUpdate = [];
	        this.originalSizes = new Float32Array(this.particlesNumber);
	        this.moveDest = new Float32Array(this.particlesNumber * 3);
	        this.particleTime = new Float32Array(this.particlesNumber);
	        this.particleColor = utils_1.Utils.hexToVec3(controller_1.Controller.getParams().ParticleColor);
	        for (var i = 0, i3 = 0; i < this.particlesNumber; i++, i3 += 3) {
	            positions[i3 + 0] = 0;
	            positions[i3 + 1] = 0;
	            positions[i3 + 2] = 0;
	            this.moveDest[i3] = Math.random() * 200 - 100;
	            this.moveDest[i3 + 1] = Math.random() * 0.3 + 0.45;
	            this.moveDest[i3 + 2] = Math.random() * 200 - 100;
	            colors[i3 + 0] = this.particleColor[0];
	            colors[i3 + 1] = this.particleColor[1];
	            colors[i3 + 2] = this.particleColor[2];
	            sizes[i] = Math.random() * 1 + 0.5;
	            this.originalSizes[i] = sizes[i];
	        }
	        this.geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
	        this.geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
	        this.geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
	        this.particleSystem = new THREE.Points(this.geometry, shaderMaterial);
	        renderer_1.Renderer.addToScene(this.particleSystem);
	        this.reset();
	        FlareParticle.setController();
	        controller_1.Controller.attachEvent(controller_1.Controller.PARTICLE_COLOR, function (value) {
	            _this.particleColor = utils_1.Utils.hexToVec3(value);
	        });
	    }
	    FlareParticle.setController = function () {
	        var _this = this;
	        this.particleSpreadingRatio = controller_1.Controller.getParams().ParticleSpread;
	        controller_1.Controller.attachEvent(controller_1.Controller.PARTICLE_SPREAD, function (value) {
	            _this.particleSpreadingRatio = value;
	        });
	    };
	    FlareParticle.prototype.reset = function () {
	        this.time = 0;
	        this.spawnParticleTime = 0;
	        this.spawnParticleInterval = 1;
	        var sizes = this.geometry.attributes['size'].array;
	        var positions = this.geometry.attributes['position'].array;
	        for (var i = 0; i < this.particlesNumber; i++) {
	            sizes[i] = 0;
	            positions[i * 3] = 0;
	            positions[i * 3 + 1] = 0;
	            positions[i * 3 + 2] = 0;
	            this.needsUpdate[i] = false;
	            this.particleTime[i] = 0;
	        }
	        this.geometry.attributes['size'].needsUpdate = true;
	        this.geometry.attributes['position'].needsUpdate = true;
	    };
	    FlareParticle.prototype.spawnParticle = function () {
	        for (var i = 0; i < this.particlesNumber; i++) {
	            if (this.needsUpdate[i] == false) {
	                this.needsUpdate[i] = true;
	                return;
	            }
	        }
	    };
	    FlareParticle.prototype.update = function (deltaTime) {
	        this.spawnParticleTime += deltaTime;
	        if (this.spawnParticleTime > this.spawnParticleInterval) {
	            this.spawnParticleTime = 0;
	            this.spawnParticleInterval = Math.random() * 300 + 50;
	            this.spawnParticle();
	        }
	        deltaTime /= 1000;
	        this.time += deltaTime;
	        this.particleSystem.rotation.y += 0.01 * deltaTime;
	        var timeScale = controller_1.Controller.getParams().TimeScale / 3;
	        var sizes = this.geometry.attributes['size'].array;
	        var positions = this.geometry.attributes['position'].array;
	        var colors = this.geometry.attributes['customColor'].array;
	        for (var i = 0, i3 = 0; i < this.particlesNumber; i++, i3 += 3) {
	            if (this.needsUpdate[i]) {
	                if (this.particleTime[i] > constants_1.Constants.MAXIMUM_LIVE_TIME / 1000) {
	                    positions[i3] = 0;
	                    positions[i3 + 1] = 0;
	                    positions[i3 + 2] = 0;
	                    this.particleTime[i] = 0;
	                    sizes[i] = 0.01;
	                }
	                else {
	                    var ac = FlareParticle.particleSpreadingRatio *
	                        this.particleTime[i] / (constants_1.Constants.MAXIMUM_LIVE_TIME / 1000) +
	                        0.01 * Math.sin(this.time);
	                    var randDist = (10 * Math.sin(0.3 * i + this.time + Math.random() / 10)) * timeScale;
	                    sizes[i] = this.originalSizes[i] * (3 + Math.sin(0.4 * i + this.time));
	                    positions[i3] = ac * this.moveDest[i3] + randDist;
	                    positions[i3 + 1] += (Math.random() * 0.4 + 0.9) * this.moveDest[i3 + 1] * timeScale;
	                    positions[i3 + 2] = ac * this.moveDest[i3 + 2] + randDist;
	                    this.particleTime[i] += deltaTime;
	                }
	            }
	            colors[i3] = this.particleColor[0];
	            colors[i3 + 1] = this.particleColor[1];
	            colors[i3 + 2] = this.particleColor[2];
	        }
	        this.geometry.attributes['customColor'].needsUpdate = true;
	        this.geometry.attributes['size'].needsUpdate = true;
	        this.geometry.attributes['position'].needsUpdate = true;
	    };
	    return FlareParticle;
	}());
	exports.FlareParticle = FlareParticle;


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	var Constants = (function () {
	    function Constants() {
	    }
	    Constants.MAXIMUM_LIVE_TIME = 20000;
	    return Constants;
	}());
	exports.Constants = Constants;


/***/ }
/******/ ]);