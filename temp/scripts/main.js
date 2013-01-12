(function() {
  var Yolo;

  Yolo = (function() {
    var _this = this;

    function Yolo() {
      this.buildCam();
      this.buildEls();
      this.clock = new THREE.Clock();
      this.allowedToRender = true;
      console.log('built something?');
    }

    Yolo.prototype.buildCam = function() {
      this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight / 2, 1, 100);
      this.camera.position.set(-500, 0, 0);
      this.controls = new THREE.FirstPersonControls(this.camera);
      this.controls.movementSpeed = 100;
      this.controls.lookSpeed = 0.039;
      this.controls.lookVertical = false;
      this.controls.noFly = true;
      this.controls.activeLook = false;
      return this;
    };

    Yolo.prototype.buildControls = function() {
      var _this = this;
      $(document).on('click', '.media_each', function(e) {
        return console.log(_this, e, e.currentTarget);
      });
      $(window).on('keydown', function(e) {
        var key;
        key = e.which;
        if (key === 16) {
          _this.holdingShift = true;
        }
        switch (key) {
          case 37:
            return _this.camera.position.x--;
          case 39:
            return _this.camera.position.x++;
          case 38:
            if (_this.holdingShift) {
              return _this.camera.position.y--;
            } else {
              return _this.camera.position.z--;
            }
          case 40:
            if (_this.holdingShift) {
              return _this.camera.position.y++;
            } else {
              return _this.camera.position.z++;
            }
        }
      });
      return $(window).on('keyup', function(e) {
        var key;
        key = e.which;
        if (key === 16) {
          _this.holdingShift = false;
        }
        console.log(_this.holdingShift);
        return false;
      });
    };

    $(window).on('blur', function(e) {
      return console.log('yolo out');
    });

    $(window).on('focus', function(e) {
      return console.log('yolo back');
    });

    Yolo.prototype.makeCube = function(size, pos) {
      var cubeWrap, face, faces, i, img, wrapEl, _i, _j, _ref;
      wrapEl = document.createElement('section');
      wrapEl.style.width = '200px';
      wrapEl.style.height = '200px';
      wrapEl.classList.add('box_wrap');
      cubeWrap = new THREE.CSS3DObject(wrapEl);
      this.centerVector = new THREE.Vector3();
      faces = [];
      for (i = _i = 0; _i < 6; i = ++_i) {
        img = new Image();
        img.src = "http://placekitten.com/1000/" + (i + 1000);
        face = document.createElement('div');
        face.appendChild(img);
        face.style.background = 'red';
        face.style.width = size * 2 + "px";
        face.style.height = size * 2 + "px";
        face.classList.add('box_face');
        faces[i] = new THREE.CSS3DObject(face);
        cubeWrap.add(faces[i]);
      }
      faces[2].position.z = faces[3].position.x = faces[5].position.y = -size;
      faces[0].position.z = faces[1].position.x = faces[4].position.y = size;
      for (i = _j = 0, _ref = faces.length - 1; 0 <= _ref ? _j <= _ref : _j >= _ref; i = 0 <= _ref ? ++_j : --_j) {
        faces[i].lookAt(this.centerVector);
      }
      cubeWrap.position.set(pos.x, pos.y, pos.z);
      this.scene.add(cubeWrap);
      return this.cubez.push(cubeWrap);
    };

    Yolo.prototype.buildEls = function() {
      var coords, cubeCount, i, size, _i;
      this.scene = new THREE.Scene();
      cubeCount = 10;
      this.cubez = [];
      for (i = _i = 0; 0 <= cubeCount ? _i < cubeCount : _i > cubeCount; i = 0 <= cubeCount ? ++_i : --_i) {
        size = Math.random() * 30;
        coords = {
          x: Math.random() * 300,
          y: Math.random() * 20,
          z: Math.random() * 300
        };
        this.makeCube(size, coords);
      }
      this.renderer = new THREE.CSS3DRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.domElement.style.position = 'absolute';
      this.renderer.domElement.style.top = 0;
      console.log(this.renderer.domElement, this.scene);
      return $('body').append(this.renderer.domElement);
    };

    Yolo.prototype.haveFun = function() {
      var cube, _i, _len, _ref, _results;
      _ref = this.cubez;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cube = _ref[_i];
        cube.rotation.x += 0.05;
        cube.rotation.y += 0.04;
        _results.push(cube.rotation.z += 0.03);
      }
      return _results;
    };

    Yolo.prototype.animate = function() {
      var delta;
      requestAnimationFrame(yolo.animate);
      yolo.haveFun();
      delta = yolo.clock.getDelta();
      yolo.controls.update(delta);
      return yolo.renderer.render(yolo.scene, yolo.camera);
    };

    return Yolo;

  }).call(this);

  (function() {
    window.yolo = new Yolo();
    return setTimeout((function() {
      yolo.animate();
      return console.log('yolo');
    }), 500);
  })();

}).call(this);
