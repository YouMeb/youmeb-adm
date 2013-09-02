'use strict';

(function (window) {

  var document = window.document;

  var log = (function (enable) {
    return enable ? function () {
      window.console && console.log && console.log.apply(console, arguments);
    } : function () {};
  })(false);

  // emitter
  var emitter = (function () {
    var events = {};
    return {
      emit: function (evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        var list = (events[evt] || []);
        list.forEach(function (fn, i) {
          if (fn.once) {
            list.splice(i, 1);
          }
          fn.apply(window, args);
        });
      },
      on: function (evt, fn) {
        (events[evt] || (function () {
          return events[evt] = [];
        })()).push(fn);
      },
      once: function (evt, fn) {
        fn.once = true;
        this.on(evt, fn);
      },
      off: function (evt, fn) {
        var list = events[evt] || [];
        var i = list.indexOf(fn);
        if (!~i) {
          list.splice(i, 1);
        }
      }
    };
  })();

  // Point
  // 去你的三角函數
  var Point = (function () {
    function Point(x, y) {
      this.set(x, y);
    }

    Point.prototype.x = 0;
    Point.prototype.y = 0;

    Point.prototype.toString = function () {
      return 'x: ' + this.x + ', y: ' + this.y;
    };

    Point.prototype.set = function (x, y) {
      if (typeof x === 'object') {
        y = 0;
        this.x = x.x || x.left || 0;
        this.y = x.y || y.top || 0;
        return;
      }
      this.x = x || 0;
      this.y = y || 0;
    };

    // 距離
    Point.prototype.distance = function (p) {
      if (!(p instanceof Point)) {
        return 0;
      }
      return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2));
    };

    // 角度
    Point.prototype.angle = function (p) {
      if (!(p instanceof Point)) {
        return 0;
      }
      return Math.atan2(this.x - p.x, this.y - p.y);
    };

    return Point;
  })();

  // lottery snadbox
  var lottery = window.lottery = (function () {

    var lock = false;
    var draw = false;
    var lastPoint = null;

    var posData = {
      length: 0,
      display: 0,
      percent: 100
    };

    var fps = {
      value: 0,
      filter: 10,
      updatedAt: (new Date()) * 1 - 1,
      update: function () {
        var now = new Date();
        var val = 1000 / (now - lastUpdate);
        fps.value = (val - fps.value) / fps.filter;
        fps.updateAt = now;
      }
    };

    var lottery = {
      width: 0,
      height: 0,
      body: null,
      layers: {},
      images: {},

      on: emitter.on,
      once: emitter.once,
      off: emitter.off,

      lock: function () {
        lock = true;
      },

      unlock: function () {
        lock = false;
      },

      toggle: function () {
        lock = !lock;
      },

      isLock: function () {
        return lock;
      },

      getImage: function () {
        log('no images');
      },

      setImage: function (image) {
        if (typeof image !== 'function') {
          lottery.getImage = function () {
            return image;
          };
          return lottery;
        }
        lottery.getImage = image;
        return lottery;
      },

      getBrush: function () {
        log('no brush');
      },

      setBrush: function (image) {
        if (typeof image !== 'function') {
          lottery.getBrush = function () {
            return image;
          };
          return lottery;
        }
        lottery.getBrush = image;
        return lottery;
      },

      getPercent: function () {
        return posData.display  / posData.length * 100;
      },

      setPercent: function (p) {
        posData.percent = p || 100;
      },

      // body onload 時執行
      start: function (id, images) {
        this.images = images || {};

        lottery.body = document.getElementsByTagName('body')[0];

        // 網頁大小改變時調整畫布尺寸，順便重繪
        window.addEventListener('resize', lottery.resize);

        id = id || 'lottery';

        // 畫布
        var el = lottery.el = window.document.getElementById(id);
        var ctx = lottery.ctx = el.getContext('2d');

        // Layers
        var layers = {
          image: {
            init: function (layer) {
              var img = lottery.getImage();
              console.log(lottery.width);
              layer.ctx.drawImage(img, (lottery.width - img.width) / 2, (lottery.height - img.height) / 2);
              //lottery.body.appendChild(layer.el);
            },
            before: function (layer) {
              //layer.init(layer);
            }
          },
          mask: {
            before: function () {
              ctx.globalCompositeOperation = 'destination-in';
            },
            after: function () {
              ctx.globalCompositeOperation = 'source-over';
              lottery.check();
            }
          },
          grey: {
            init: function (layer) {
              var img = images.grey;
              // console.log()
              layer.ctx.drawImage(img, (lottery.width - img.width) / 2, (lottery.height - img.height) / 2 + 70);
              //lottery.body.appendChild(layer.el);
              //console.log(layer);
            },
            before: function (layer) {
              //layer.init(layer);
              ctx.globalCompositeOperation = 'destination-in';
            },
            after: function () {
              ctx.globalCompositeOperation = 'source-over';
            }
          },
          background: {
            init: function (layer) {
              var grey = images.grey;
              var bg = lottery.getImage();
              layer.ctx.drawImage(grey, (lottery.width - grey.width) / 2, (lottery.height - grey.height) / 2 + 70);
              layer.ctx.globalCompositeOperation = 'source-out';
              layer.ctx.drawImage(bg, (lottery.width - bg.width) / 2, (lottery.height - bg.height) / 2);
              layer.ctx.globalCompositeOperation = 'source-over';
            },
            before: function (layer) {
              //layer.init(layer);
            }
          },
          canvasBgColor: {
            init: function (layer) {
              var bg = images['image-01'];
              layer.ctx.fillStyle = '#FFF';
              layer.ctx.fillRect(0, 0, lottery.width, lottery.height);
              layer.ctx.globalCompositeOperation = 'destination-out';
              // console.log(bg);
              layer.ctx.drawImage(bg, (lottery.width - bg.width) / 2, (lottery.height - bg.height) / 2);
              layer.ctx.globalCompositeOperation = 'source-over';
            }
          } 
        };
        lottery.layers._keys = Object.keys(layers);
        lottery.layers._keys.forEach(function (key) {
          var canvas = window.document.createElement('canvas');
          var layer = {};
          layer.el = canvas;
          layer.ctx = canvas.getContext('2d');
          layer.before = layers[key].before || function () {};
          layer.after = layers[key].after || function () {};
          layer.init = layers[key].init || function () {};
          //layer.init(layer);
          lottery.layers[key] = layer;
          //lottery.body.appendChild(layer.el);
        });

        // 刮刮刮 刮刮刮
        if ('ontouchstart' in window) {
          el.addEventListener('touchstart', lottery.mousedown);
          el.addEventListener('touchend', lottery.mouseup);
          el.addEventListener('touchmove', lottery.mousemove);
        } else {
          el.addEventListener('mousedown', lottery.mousedown);
          el.addEventListener('mouseup', lottery.mouseup);
          el.addEventListener('mousemove', lottery.mousemove);
        }

        el.addEventListener('mouseleave', lottery.mouseup);

        lottery.resize();
        return lottery;
      },

      offset: function () {
        var x = 0;
        var y = 0;

        var el = lottery.el;

        while (el) {
          x += (el.offsetLeft - el.scrollLeft + el.clientLeft);
          y += (el.offsetTop - el.scrollTop + el.clientTop);
          el = el.offsetParent;
        }

        return new Point(x, y);
      },

      getMousePoint: function (e) {
        var target = (e.touches && e.touches[0]) || e;
        var offset = lottery.offset();
        return new Point(target.pageX - offset.x, target.pageY - offset.y);
      },

      mousedown: function (e) {
        e.preventDefault();

        if (lottery.isLock()) {
          return;
        }
        lastPoint = lottery.getMousePoint(e);
        draw = true;
      },

      mousemove: function (e) {
        e.preventDefault();

        if (!draw) {
          return;
        }

        var start = lastPoint;
        var end = lottery.getMousePoint(e);

        lastPoint = end;

        var distance = end.distance(start);
        var angle = end.angle(start);

        var brush = lottery.getBrush();
        var bw = brush.width / 2;
        var bh = brush.height / 2;

        do {
          lottery.layers.mask.ctx.drawImage(
            brush,
            start.x + (Math.sin(angle) * distance) - bw,
            start.y + (Math.cos(angle) * distance) - bh 
          );
          distance -= 1;
        } while (!!~distance); // 不等於 -1

        lottery.update();
      },

      mouseup: function (e) {
        e.preventDefault();
        draw = false;
      },

      // 圖片確切位置（網格點）
      position: [],

      // 掃描圖片，用網格紀錄圖片出現位置
      scan: function () {
        var gridSize = 50;
        var x = Math.round(lottery.width / gridSize);
        var y = Math.round(lottery.height / gridSize);
        var i, j;

        var imgctx = lottery.layers.grey.ctx;

        var data;

        var p = lottery.position = [];

        //console.log(x, y);
        for (i = 0; i < x; i += 1) {
          for (j = 0; j < y; j += 1) {
            data = imgctx.getImageData(i * gridSize, j * gridSize, 1, 1).data;
            if (data[0] + data[1] + data[2] + data[3]) {
              p.push(new Point(i * gridSize, j * gridSize));
            }
          }
        }

        posData.length = p.length;
        posData.display = 0;

        log(p);
      },

      // 檢查哪些點已經顯示
      check: function () {
        var p = lottery.position;
        var hidden = [];
        var ctx = lottery.ctx;

        p.forEach(function (point) {
          var data = ctx.getImageData(point.x, point.y, 1, 1).data;
          if (data[0] + data[1] + data[2] + data[3]) {
            posData.display += 1;
            return;
          }
          hidden.push(point);
        });

        lottery.position = hidden;

        if (lottery.getPercent() >= posData.percent) {
          log('done');
          emitter.emit('done');
        }
      },

      // 更改畫面尺寸
      resize: function () {
        lottery.lock();

        lottery.width = window.innerWidth || document.documentElement.clientWidth || lottery.body.clientWidth;
        lottery.height = window.innerHeight || document.documentElement.clientHeight || lottery.body.clientHeight;

        // clear
        lottery.clear();

        // 畫布
        lottery.el.width = lottery.width;
        lottery.el.height = lottery.height;

        // 圖層
        lottery.layers._keys.forEach(function (key) {
          var layer = lottery.layers[key];
          layer.el.width = lottery.width;
          layer.el.height = lottery.height;
          layer.init(layer);
        });

        log('resize: ' + lottery.width + ' x ' + lottery.height);

        // 重繪
        lottery.update();
        
        lottery.scan();

        lottery.unlock();
        return lottery;
      },

      // 清理畫面
      clear: function () {
        var w = lottery.width;
        var h = lottery.height;
        lottery.ctx.clearRect(0, 0, w, h);
        lottery.layers._keys.forEach(function (key) {
          var layer = lottery.layers[key];
          layer.ctx.clearRect(0, 0, w, h);
          layer.init(layer);
        });
      },

      // 更新畫面
      update: function () {
        log('update: ' + Date.now());

        var ctx = lottery.ctx;
        var layers = lottery.layers;

        layers._keys.forEach(function (key) {
          var layer = layers[key];
          layer.before(layer);
          ctx.drawImage(layers[key].el, 0, 0);
          layer.after(layer);
        });

        return lottery;
      },

      fps: fps
    };

    return lottery;
  })();

})(this);
