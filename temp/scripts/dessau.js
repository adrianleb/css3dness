(function() {
  var Dessau, Listener, Object, Producer, Space, Vector,
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

    function Dessau() {
      var _this = this;
      this.listener = new Listener('listener');
      this.listener.listen(this.producer);
      this.producer.start();
      this.loop();
      this.producer.draw();
      this.listener.draw();
      $('input').keyup(function(e) {
        var attrName, newVal, objName, p;
        objName = $(e.target).parent().data('bind');
        cl($(e.target).parent());
        attrName = $(e.target).attr('name');
        p = _this[objName].getPosition();
        newVal = parseInt($(e.target).val());
        if (!isNaN(newVal)) {
          p[attrName] = newVal;
          _this[objName].setPosition(p);
          return $('.distance').html(space.distance(_this.producer.getPosition(), _this.listener.getPosition()));
        }
      });
    }

    Dessau.prototype.loop = function() {
      var _this = this;
      _.each([this.producer, this.listener], function(o) {
        return o.loop();
      });
      return setTimeout((function() {
        return _this.loop();
      }), 100);
    };

    return Dessau;

  })();

}).call(this);
