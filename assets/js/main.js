'use strict';

function main() {
  // ele
  var $mask = document.querySelector('#mask');
  var $msg = $mask.querySelector('.mask-msg');

  // 訊息
  var gifts = [
    '強效抗皺保溼乳液',
    '經驗回春晶華面膜乙盒',
    '美白淡斑保溼水乳液',
  ];

  // 圖片
  var images = {
    bg: '/images/bg.jpg',
    grey: '/images/gray.png',
    brush: '/images/brush.png'
  };
  (function (len) {
    var n;
    console.log(len);
    while (len) {
      n = len >= 10 ? len : '0' + len;
      images['image-' + n] = '/images/image-' + n + '.jpg';
      len -= 1;
    }
  })(gifts.length);

  // preload
  (function (images, done) {
    var keys = Object.keys(images);
    var len = keys.length;
    var count = 0;
    var els = {};
    
    var size = (function () {
      var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;
      return {
        width: x,
        height: y
      };
    })();

    function load() {
      count += 1;

      var h = this.height;
      var w = this.width;
      var changed = false;
      var p;

      if (h > size.height) {
        p = size.height / h;
        h = size.height;
        w *= p;
        changed = true;
      }

      if (w > size.width) {
        p = size.width / w;
        w = size.width;
        h *= p;
        changed = true;
      }

      if (changed) {
        if (h < size.height) {
          p = size.height / h;
          h = size.height;
          w *= p;
        }

        if (w < size.width) {
          p = size.width / w;
          w = size.width;
          h *= p;
        }
      }
      this.height = h;
      this.width = w;
      if (count === len) {
        done(els);
      }
    }

    keys.forEach(function (key) {
      var image = window.document.createElement('img');
      els[key] = image;
      image.onload = load;
      image.src = images[key];
    });
  })(images, function (images) {
    var i = Math.round(Math.random() * (gifts.length - 1)) + 1;
    var ii = i >= 10 ? i : '0' + i;
    //alert('yoyo:'+images.grey.width)
  
    // 刮完啦
    lottery.once('done', function () {
      $mask.classList.add('show');
      $msg.innerText = '恭喜你獲得' + gifts[i - 1];
      $msg.innerHTML +='<br/><div style="width:100%;height:100px;"><a class="btn5 btnagain" href="/skii/input"></a><a class="btn5 btngo" href="/skii/start"></a></div>';
    });

    // 開始執行
    lottery.setPercent(50);
    lottery.setImage(images['image-' + ii]);
    lottery.setBrush(images.brush);
    lottery.start('lottery', images);
  });
}
