//初期化
enchant();
//ゲーム画面
var iframe = window.parent.document.getElementById("frame");
console.log(iframe.width);

//画面サイズの決定　横幅は640を基準に高さを決める
var w = 640;
var h = iframe.scrollHeight * (640 / iframe.scrollWidth);
var game = new Core(w, h);



//FPS
game.fps = 60;
//背景色
game.rootScene.backgroundColor = "#83F1A8";
//アセットプリロード
game.preload('images/title.png');
game.preload('images/startbutton.png');
game.preload('images/rankbutton.png');
game.preload('sounds/start.mp3');
game.preload('images/finger.png');
game.preload('images/hageoyaji.png');
game.preload('images/hair.png');
game.preload('images/hairtwin.png');
game.preload('images/combo.png');
game.preload('sounds/ok.mp3');
game.preload('sounds/miss.mp3');
game.preload('sounds/unplug.mp3');
game.preload('sounds/combo.mp3');
game.preload('images/house.png');
game.preload('images/bakamon.png');
game.preload('sounds/gameover.mp3');
game.preload('sounds/back.mp3');
game.preload('sounds/Explosion99.mp3');
game.preload('images/tweetbutton.png');
game.preload('images/anger.png');
game.preload('images/swipe.png');


//ハイスコア取得
var highScore = localStorage.getItem("tlh-highscore");
if (!highScore) {
    highScore = 0;
}

//ゲームスタート
game.start(); // start your game!

//onLoad
game.onload = function () {
    startTitleScene();
};


//タイトル
function startTitleScene() {
    var title = new Sprite(614, 135);
    title.image = game.assets["images/title.png"];
    title.x = (game.rootScene.width - title.width) / 2;
    title.y = 300;
    game.rootScene.addChild(title);

    var start = new Sprite(294, 90);
    start.image = game.assets["images/startbutton.png"];
    start.x = (game.rootScene.width - start.width) / 2;
    start.y = (title.y + title.height) + 100;
    start.tl.scaleTo(0.8, 0);
    game.rootScene.addChild(start);
    start.on('touchstart', function (e) {
        playSE('sounds/start.mp3');
        this.tl.scaleTo(0.9, 0.9, 3);
        this.tl.delay(8);
        this.tl.then(function () {
            //シーン遷移
            startGameScene(16);
        });
    });

    // var ranking = new Sprite(428, 105);
    // ranking.image = game.assets["images/rankbutton.png"];
    // ranking.x = (game.rootScene.width - ranking.width) / 2;
    // ranking.y = (start.y + start.height) + 20;
    // ranking.tl.scaleTo(0.6, 0);
    // game.rootScene.addChild(ranking);
    // ranking.on('touchstart', function (e) {
    //     playSE('sounds/start.mp3');
    //     this.tl.scaleTo(0.7, 0.7, 3);
    //     this.tl.delay(8);
    //     alert("工事中");
    // });

    var twitter = new Sprite(148, 148);
    twitter.image = game.assets["images/tweetbutton.png"];
    twitter.x = (game.rootScene.width - twitter.width) / 2;
    twitter.y = (start.y + start.height) + 70;
    twitter.tl.scaleTo(0.6, 0);
    game.rootScene.addChild(twitter);
    twitter.on('touchstart', function (e) {
        playSE('sounds/ok.mp3');
        this.tl.scaleTo(0.7, 0.7, 3);
        this.tl.delay(8);
        open("https://twitter.com/intent/tweet?text=ハゲ親父断髪式　ハイスコアチャレンジ！%0d最高記録：" + highScore + "本抜き%0d%0d" +
            "&hashtags=ハゲ親父断髪式ハイスコアチャレンジ" +
            "&url=https://hair.udonko.net/"
            , "_parent");
    });

    //インジケーターのラベル
    var copyright = new Label();
    copyright.width = 200;
    copyright.textAlign = "center";
    copyright.color = "#fff";
    copyright.text = "UDONKONET";
    copyright.font = "20px 'Kosugi Maru'";
    copyright.x = (game.rootScene.width - copyright.width) / 2;
    copyright.y = (game.rootScene.height - 30);
    game.rootScene.addChild(copyright);

}

//ゲームシーン
function startGameScene(tap) {
    //得点
    var count = 0;
    var combo = 1;
    var gameoverFlg = false;
    var anger = 1;

    //シーン作成
    var gameScene = new Scene();
    game.replaceScene(gameScene);
    gameScene.backgroundColor = "skyblue";

    //ハゲ親父
    var oyaji = new Sprite(320, 568);
    oyaji.image = game.assets["images/hageoyaji.png"];
    oyaji.x = (gameScene.width - oyaji.width) / 2;;
    oyaji.y = gameScene.height - oyaji.height;
    gameScene.addChild(oyaji);

    //髪の毛
    var hair = new Sprite(25, 80);
    hair.image = game.assets["images/hair.png"];
    hair.x = (gameScene.width - hair.width) / 2;
    hair.y = oyaji.y + 120;
    var hairHeight = hair.height
    hair.originY = hairHeight;
    gameScene.addChild(hair);

    //スワイプ
    var swipe = new Sprite(443, 196);
    swipe.image = game.assets["images/swipe.png"];
    swipe.x = (gameScene.width - swipe.width) / 2;
    swipe.y = (gameScene.height - swipe.height) / 2;

    gameScene.addChild(swipe);
    swipe.tl.moveBy(0, -50, 60);
    // swipe.tl.and();
    // swipe.tl.fadeTo(0, 60);
    swipe.tl.moveBy(0, 50, 1);
    // swipe.tl.and();
    // swipe.tl.fadeTo(1, 1);
    swipe.tl.loop();

    //怒り
    var ikaru = new Sprite(71, 95);
    ikaru.image = game.assets["images/anger.png"];
    ikaru.x = oyaji.x + 200;
    ikaru.y = oyaji.y + 130;
    ikaru.tl.fadeTo(0, 1);
    gameScene.addChild(ikaru);

    var ikari = 1;
    ikaru.on('enterframe', function (e) {
        ikari = getRandom(0, 600);
        if (ikari == 0) {
            ikaru.tl.fadeTo(1, 1);
            ikaru.tl.fadeTo(0, 60);
            playSE('sounds/Explosion99.mp3');
        }
    });

    //指
    var defaultPosY = hair.y;
    var defaultPosX = hair.x;
    var finger = new Sprite(612, 350);
    finger.image = game.assets["images/finger.png"];
    finger.x = defaultPosX - finger.width / 2 + 15;
    finger.y = defaultPosY;
    finger.tl.scaleTo(0.7, 0);
    finger.tl.hide();
    gameScene.addChild(finger);

    //得点ラベル
    var label = new Label();
    label.width = gameScene.width - 80;
    label.height = 40;
    label.textAlign = "right";
    label.color = "#444444";
    label.text = "0本抜き";
    label.font = "45px 'Kosugi Maru'";
    label.x = 45;
    label.y = 100;
    gameScene.addChild(label);

    var fingerAdjust = 70;

    //タッチイベントで髪の毛を伸び縮み
    var beforeY = 0;
    var afterY = 0;
    var nuitaFlg = false;
    var playingFlg = false;
    gameScene.on('touchstart', function (e) {
        swipe.remove();

        if (gameoverFlg == true) {
            return;
        }
        hair.tl.clear();
        hair.tl.scaleTo(1, 1, 0);
        finger.y = defaultPosY - finger.height + fingerAdjust;
        beforeY = e.y;
        finger.tl.show();
        playingFlg = false;
    });
    gameScene.on('touchmove', function (e) {
        if (gameoverFlg == true) {
            return;
        }
        afterY = e.y;
        var scale = 1;

        anger = getRandom(0, 300);
        if (anger == 0) {
            gameoverFlg = true;

            ikaru.tl.fadeTo(1, 1);
            playSE('sounds/Explosion99.mp3');
            gameScene.tl.delay(30);
            gameScene.tl.then(function () {
                gameOverScene(count);
            });
        }

        //抜ける前
        if (nuitaFlg == false) {
            scale = ((hair.height + (beforeY - afterY)) / hairHeight);
            if (scale < 0.6) {
                scale = 0.6;
                nuitaFlg = false;
            } else {
                if (scale > 3.5) {
                    nuitaFlg = true;
                } else {
                    nuitaFlg = false;
                }
                finger.y = defaultPosY - finger.height + fingerAdjust - (beforeY - afterY);
            }
        } else {
            //抜けた後
            console.log("抜いた");
            finger.y = defaultPosY - finger.height + fingerAdjust - (beforeY - afterY);
            hair.y = finger.y + finger.height - hair.height;

            if (playingFlg == false) {
                if (combo == 0) {
                    comboAnim(gameScene);
                    count *= 2;
                    label.text = count + "本抜き";
                    label.color = "red";
                } else {
                    count += 1;
                    label.text = count + "本抜き";
                    label.color = "black";
                }
                playingFlg = true;
                playSE('sounds/miss.mp3');
            }
            //カンスト
            if (count > 5000000000000000) {
                count = 5000000000000000;
            }
        }
        hair.tl.scaleTo(1, scale, 0);
    });

    gameScene.on('touchend', function (e) {
        if (gameoverFlg == true) {
            return;
        }
        finger.tl.hide();
        if (nuitaFlg == false) {
            //抜けなかった
            playSE('sounds/unplug.mp3');
            hair.x = (gameScene.width - hair.width) / 2;
            hair.y = oyaji.y + 120;
            hair.tl.scaleTo(1, 1, 4);
            hair.tl.scaleTo(1, 0.7, 4);
            hair.tl.scaleTo(1, 1, 4);
            hair.tl.scaleTo(1, 0.7, 4);
            hair.tl.scaleTo(1, 1, 4);
            hair.tl.scaleTo(1, 0.7, 4);
            hair.tl.scaleTo(1, 1, 4);

        } else {
            //抜けた
            combo = getRandom(0, 150);
            if (combo == 0) {
                //ツインヘアー
                hair.tl.clear();
                hair.image = game.assets["images/hairtwin.png"];
                hair.x = (gameScene.width - hair.width) / 2;
                hair.y = oyaji.y + 120;
                hair.tl.scaleTo(1, 0, 1);
                hair.tl.scaleTo(1, 1, 10);
            } else {
                //ノーマル
                console.log("抜けた");
                hair.tl.clear();
                hair.image = game.assets["images/hair.png"];
                hair.x = (gameScene.width - hair.width) / 2;
                hair.y = oyaji.y + 120;
                hair.tl.scaleTo(1, 0, 1);
                hair.tl.scaleTo(1, 1, 10);
            }
        }
        nuitaFlg = false;
    });
}

//ゲームシーン
function gameOverScene(count) {
    //シーン作成
    var gameoverScene = new Scene();
    game.replaceScene(gameoverScene);
    gameoverScene.backgroundColor = "white;";

    gameoverScene.tl.delay(60);
    gameoverScene.tl.then(function () {
        //広告 プレイ回数に応じてゲームオーバー時に表示
        var playCount = localStorage.getItem("tlh-playcount");
        if (!playCount) {
            playCount = 0;
        }
        playCount++;
        localStorage.setItem("tlh-playcount", playCount);
        if (playCount % 1 == 0) {
            showAdGameOver();
            var frame = window.parent;
            $(frame).scrollTop(10000);
        }
    });

    //背景
    var background = new Sprite(640, 1500);
    background.image = game.assets["images/house.png"];
    background.x = 0;
    background.y = 0;
    gameoverScene.addChild(background);

    playSE('sounds/gameover.mp3');

    //ハイスコア判定
    var color = "white";
    var message = "ハイスコア：";
    if (count > highScore) {
        highScore = count;
        localStorage.setItem("tlh-highscore", highScore);
        color = "red";
        message = "ハイスコア更新！：";

    }

    //得点ラベル
    showScoreLabel(count, "今回の得点：", 0, 392, gameoverScene, "white");
    showScoreLabel(highScore, message, 0, 440, gameoverScene, color);

    //ばかもん
    var bakamon = new Sprite(618, 125);
    bakamon.image = game.assets["images/bakamon.png"];
    bakamon.x = (gameoverScene.width - bakamon.width) / 2;
    bakamon.y = 600;
    gameoverScene.addChild(bakamon);
    bakamon.tl.scaleTo(0, 0, 1);
    bakamon.tl.moveTo(0, 200, 30)
    bakamon.tl.and();
    bakamon.tl.scaleTo(0.9, 0.9, 30);


    //戻る
    bakamon.tl.delay(120);
    bakamon.tl.then(function (e) {
        var label2 = new Label();
        label2.width = 640;
        label2.height = 30;
        label2.textAlign = "center";
        label2.color = "white";
        label2.text = "タップしてもどる";
        label2.font = "20px 'Kosugi Maru'";
        label2.x = 0;
        label2.y = 550;
        gameoverScene.addChild(label2);

        gameoverScene.on('touchend', function (e) {
            playSE('sounds/back.mp3');
            //シーン遷移
            game.replaceScene(game.rootScene);
        });
    });

}

function showScoreLabel(score, message, x, y, scene, color) {
    var label = new Label();
    label.width = 640;
    label.height = 40;
    label.textAlign = "center";
    label.color = "black";
    label.text = message + score + "本抜き";
    label.font = "30px 'Kosugi Maru'";
    label.x = x + 2;
    label.y = y + 2;
    scene.addChild(label);

    var label2 = new Label();
    label2.width = 640;
    label2.height = 40;
    label2.textAlign = "center";
    label2.color = color;
    label2.text = message + score + "本抜き";
    label2.font = "30px 'Kosugi Maru'";
    label2.x = x;
    label2.y = y;
    scene.addChild(label2);
}

function playSE(path) {
    var sound = game.assets[path].clone();
    sound.play();
};

function comboAnim(scene) {
    playSE('sounds/combo.mp3');

    var comboImg = new Sprite(628, 136);
    comboImg.image = game.assets["images/combo.png"];
    comboImg.tl.scaleTo(0.7, 0.7, 1);
    comboImg.tl.scaleTo(1, 1, 20);
    comboImg.tl.fadeTo(0, 20)
    comboImg.x = (scene.width - comboImg.width) / 2;
    comboImg.y = 170;
    scene.addChild(comboImg);

}

function getRandom(start, end) {
    return start + Math.floor(Math.random() * (end - start + 1));
}
