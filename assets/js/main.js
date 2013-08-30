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
    egg: 'images/gray.png',
    hand: 'images/hand.png',
    man: 'images/man.png',
    brush: 'images/brush.png'
  };
  (function (len) {
    var n;
    while (len) {
      n = len >= 10 ? len : '0' + len;
      images['image-' + n] = 'images/' + n + '.jpg';
      len -= 1;
    }
  })(gifts.length);


  // preload
  (function (images, done) {
    var keys = Object.keys(images);
    console.log(keys)
    var len = keys.length;
    var count = 0;
    var els = {};

    function load() {
      count += 1;
      if (count === len) {
        done(els);
        //console.log(els);
      }
    }

    keys.forEach(function (key) {
      var image = window.document.createElement('img');
      els[key] = image;
      image.onload = load;
      image.src = images[key];
      console.log(image);
      //image.width = 100;
      //image.height = 100;
    });
    console.log(els);
  })(images, function (images) {
    var i = Math.round(Math.random() * gifts.length);
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
