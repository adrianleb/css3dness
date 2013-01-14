(function() {
  var Dessau, Listener, Object, Producer, Space, Vector, Yolo,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.cl = function(o) {
    return console.debug(o);
  };

  Space = (function() {

    function Space() {}

    Space.prototype.distance = function(a, b) {
      return Math.abs(Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2)));
    };

    return Space;

  })();

  Vector = (function() {

    function Vector(x, y, z) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.z = z != null ? z : 0;
    }

    return Vector;

  })();

  Object = (function() {

    function Object(_name) {
      this._name = _name;
      this._position = new Vector();
    }

    Object.prototype.getPosition = function() {
      return this._position;
    };

    Object.prototype.setPosition = function(_position) {
      this._position = _position;
    };

    Object.prototype.getName = function() {
      return this._name;
    };

    Object.prototype.draw = function() {
      var s,
        _this = this;
      s = $('<section data-bind="' + this._name + '">');
      s.append($('<h2>' + this._name + ':</h2>'));
      _.each(['x', 'y', 'z'], function(k) {
        var i, l;
        l = $('<label>');
        l.html(k + ': ');
        s.append(l);
        i = $('<input type="text">');
        i.attr('name', k);
        i.val(_this._position[k]);
        return s.append(i);
      });
      return $('.container').append(s);
    };

    return Object;

  })();

  Producer = (function(_super) {

    __extends(Producer, _super);

    function Producer(name) {
      Producer.__super__.constructor.call(this, name);
      this.out = context.createOscillator();
    }

    Producer.prototype.start = function() {
      return this.out.noteOn(0);
    };

    Producer.prototype.stop = function() {
      return this.out.noteOff(0);
    };

    Producer.prototype.loop = function() {};

    return Producer;

  })(Object);

  Listener = (function(_super) {

    __extends(Listener, _super);

    Listener.prototype.producers = [];

    function Listener(name) {
      Listener.__super__.constructor.call(this, name);
    }

    Listener.prototype.listen = function(producer) {
      var gainNode;
      gainNode = context.createGainNode();
      producer.out.connect(gainNode);
      this.producers.push({
        producer: producer,
        gainNode: gainNode
      });
      return gainNode.connect(context.destination);
    };

    Listener.prototype.loop = function() {
      var _this = this;
      return _.each(this.producers, function(o) {
        var distance, value;
        distance = space.distance(_this.getPosition(), o.producer.getPosition());
        value = 1 / Math.pow(distance, 2);
        o.gainNode.gain.value = value > 1 ? 1 : value;
        return $('.gain').html(o.gainNode.gain.value);
      });
    };

    return Listener;

  })(Object);

  Dessau = (function() {

    function Dessau() {}

    return Dessau;

  })();

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
      this.camera.position.set(0, 0, 0);
      this.listener = new Listener('listener');
      this.controls = new THREE.FirstPersonControls(this.camera);
      this.controls.movementSpeed = 300;
      this.controls.lookSpeed = 0.039;
      this.controls.lookVertical = false;
      this.controls.noFly = true;
      this.controls.activeLook = true;
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
      var cubeWrap, face, faces, gainNode, i, img, producer, wrapEl, _i, _j, _ref;
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
      producer = new Producer('producer');
      gainNode = context.createGainNode();
      producer.out.connect(gainNode);
      gainNode.connect(context.destination);
      producer.start();
      this.scene.add(cubeWrap);
      return this.cubez.push({
        obj: cubeWrap,
        producer: producer,
        gainNode: gainNode
      });
    };

    Yolo.prototype.buildEls = function() {
      var coords, cubeCount, i, size, _i;
      this.counter = 0;
      this.scene = new THREE.Scene();
      this.producers = [];
      cubeCount = 10;
      this.cubez = [];
      for (i = _i = 0; 0 <= cubeCount ? _i < cubeCount : _i > cubeCount; i = 0 <= cubeCount ? ++_i : --_i) {
        size = Math.random() * 30;
        coords = {
          x: Math.random() * 3000,
          y: Math.random() * 5,
          z: Math.random() * 3000
        };
        this.makeCube(size, coords);
      }
      this.renderer = new THREE.CSS3DRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.domElement.style.position = 'absolute';
      this.renderer.domElement.style.top = 0;
      console.log(this.renderer.domElement, this.scene);
      $('body').append(this.renderer.domElement);
      return this.moveThem();
    };

    Yolo.prototype.moveThem = function() {
      var coords, cube, _i, _len, _ref, _results;
      coords = {
        x: Math.random() * 3000,
        y: Math.random() * 5,
        z: Math.random() * 3000
      };
      _ref = this.cubez;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cube = _ref[_i];
        _results.push(console.log(cube));
      }
      return _results;
    };

    Yolo.prototype.haveFun = function() {
      var cube, distance, value, _i, _len, _ref, _results;
      _ref = this.cubez;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cube = _ref[_i];
        cube.obj.rotation.x += 0.05;
        cube.obj.rotation.y += 0.04;
        cube.obj.rotation.z += 0.03;
        distance = space.distance(this.controls.target, cube.obj.position);
        value = (1 / Math.pow(distance, 2)) * 10000;
        cube.gainNode.gain.value = value > 1 ? 1 : value;
        if (this.counter < 200) {
          console.log(value, distance, this.controls.target, cube.obj.position);
          _results.push(this.counter++);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Yolo.prototype.animate = function() {
      var delta;
      requestAnimationFrame(yolo.animate);
      yolo.haveFun();
      TWEEN.update();
      delta = yolo.clock.getDelta();
      yolo.controls.update(delta);
      return yolo.renderer.render(yolo.scene, yolo.camera);
    };

    return Yolo;

  }).call(this);

  (function() {
    window.space = new Space();
    window.context = new webkitAudioContext();
    window.yolo = new Yolo();
    return setTimeout((function() {
      yolo.animate();
      return console.log('yolo');
    }), 500);
  })();

}).call(this);
