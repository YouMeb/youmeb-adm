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
    bg: 'images/bg.jpg',
    grey: 'images/gray.png',
    brush: 'images/brush.png'
  };
  (function (len) {
    var n;
    while (len) {
      n = len >= 10 ? len : '0' + len;
      images['image-' + n] = 'images/image-' + n + '.jpg';
      len -= 1;
    }
  })(gifts.length);


  // preload
  (function (images, done) {

    var _w = window.innerWidth;
    var _h = window.innerHeight;

    console.log(_w);
    console.log(_h);
    var keys = Object.keys(images);
    var len = keys.length;
    var count = 0;
    var els = {};

    function load() {
      count += 1;
      console.log(this.width);
      console.log(this.height);
      // this.width = this.width*_w/640;
      // this.height = this.height*_h/960;    
      console.log(this);
      console.log(this.width);
      console.log(this.height);
      console.log('=========');
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

    // 刮完啦
    lottery.once('done', function () {
      $mask.classList.add('show');
      $msg.innerText = '恭喜你獲得' + gifts[i - 1];
    });

    // 開始執行
    lottery.setPercent(90);
    lottery.setImage(images['image-' + ii]);
    lottery.setBrush(images.brush);
    lottery.start('lottery', images);
  });
}
