//初期化
enchant();
//ゲーム画面
var game = new Core(640, 640);
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
game.preload('images/namiheihead.png');
game.preload('images/hair.png');
game.preload('sounds/ok.mp3');
game.preload('sounds/miss.mp3');
game.preload('sounds/unplug.mp3');



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
    title.y = 100;
    game.rootScene.addChild(title);

    var start = new Sprite(294, 90);
    start.image = game.assets["images/startbutton.png"];
    start.x = (game.rootScene.width - start.width) / 2;
    start.y = (title.y + title.height) + 50;
    start.tl.scaleTo(0.8, 0);
    game.rootScene.addChild(start);
    start.on('touchstart', function (e) {
        var sound = game.assets['sounds/start.mp3'].clone();
        sound.play();
        this.tl.scaleTo(0.9, 0.9, 3);
        this.tl.delay(8);
        this.tl.then(function () {
            //シーン遷移
            startGameScene(16);
        });
    });

    var ranking = new Sprite(428, 105);
    ranking.image = game.assets["images/rankbutton.png"];
    ranking.x = (game.rootScene.width - ranking.width) / 2;
    ranking.y = (start.y + start.height) + 20;
    ranking.tl.scaleTo(0.6, 0);
    game.rootScene.addChild(ranking);
    ranking.on('touchstart', function (e) {
        var sound = game.assets['sounds/start.mp3'].clone();
        sound.play();
        this.tl.scaleTo(0.7, 0.7, 3);
        this.tl.delay(8);
        alert("工事中");
    });

    //インジケーターのラベル
    var copyright = new Label();
    copyright.width = 200;
    copyright.textAlign = "center";
    copyright.color = "#fff";
    copyright.text = "UDONKONET";
    copyright.font = "20px 'impact'";
    copyright.x = (game.rootScene.width - copyright.width) / 2;
    copyright.y = (game.rootScene.height - 30);
    game.rootScene.addChild(copyright);

}

//ゲームシーン
function startGameScene(tap) {
    //得点
    var count = 0;

    //シーン作成
    var gameScene = new Scene();
    game.replaceScene(gameScene);
    gameScene.backgroundColor = "skyblue";

    //ハゲ親父
    var oyaji = new Sprite(640, 1136);
    oyaji.image = game.assets["images/namiheihead.png"];
    oyaji.x = 0;
    oyaji.y = -140;
    oyaji.tl.scaleTo(0.5, 0);
    gameScene.addChild(oyaji);

    //髪の毛
    var hair = new Sprite(25, 80);
    hair.image = game.assets["images/hair.png"];
    hair.x = (gameScene.width - hair.width) / 2;
    hair.y = 270;
    var hairHeight = hair.height
    hair.originY = hairHeight;
    gameScene.addChild(hair);

    //指
    var defaultPosY = 0;
    var defaultPosX = 15;
    var finger = new Sprite(612, 350);
    finger.image = game.assets["images/finger.png"];
    finger.x = defaultPosX;
    finger.y = defaultPosY;
    finger.tl.scaleTo(0.7, 0);
    finger.tl.hide();
    gameScene.addChild(finger);

    //インジケーターのラベル
    var label = new Label();
    label.width = 600;
    label.height = 40;
    label.textAlign = "right";
    label.color = "#444444";
    label.text = "0本抜き";
    label.font = "40px 'Kosugi Maru'";
    label.x = 20;
    label.y = 20;
    gameScene.addChild(label);

    //タッチイベントで髪の毛を伸び縮み
    var beforeY = 0;
    var afterY = 0;
    var nuitaFlg = false;
    var playingFlg = false;
    gameScene.on('touchstart', function (e) {
        hair.tl.clear();
        hair.tl.scaleTo(1, 1, 0);
        finger.y = defaultPosY;
        beforeY = e.y;
        finger.tl.show();
        playingFlg = false;
    });
    gameScene.on('touchmove', function (e) {
        afterY = e.y;
        var scale = 1;

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
                finger.y = defaultPosY - (beforeY - afterY);
            }
        } else {
            //抜けた後
            console.log("抜いた");
            finger.y = defaultPosY - (beforeY - afterY);
            hair.y = finger.y + finger.height - hair.height;

            if (playingFlg == false) {
                count += 1;
                label.text = count + "本抜き";

                playingFlg = true;
                var sound = game.assets['sounds/miss.mp3'].clone();
                sound.play();
            }

        }
        console.log(nuitaFlg);

        hair.tl.scaleTo(1, scale, 0);
    });

    gameScene.on('touchend', function (e) {
        finger.tl.hide();
        if (nuitaFlg == false) {
            //抜けなかった
            var sound = game.assets['sounds/unplug.mp3'].clone();
            sound.play();
            hair.x = (gameScene.width - hair.width) / 2;
            hair.y = 270;
            hair.tl.scaleTo(1, 1, 4);
            hair.tl.scaleTo(1, 0.7, 4);
            hair.tl.scaleTo(1, 1, 4);
            hair.tl.scaleTo(1, 0.7, 4);
            hair.tl.scaleTo(1, 1, 4);
            hair.tl.scaleTo(1, 0.7, 4);
            hair.tl.scaleTo(1, 1, 4);

        } else {
            //抜けた
            console.log("抜けた");
            hair.tl.clear();
            hair.x = (gameScene.width - hair.width) / 2;
            hair.y = 270;
            hair.tl.scaleTo(1, 0, 1);
            hair.tl.scaleTo(1, 1, 10);
        }
        nuitaFlg = false;
    });
}

function breakWaterMelon(gameScene) {
    //PhyBoxSprite(幅, 高さ, 動作モード, 密度, 摩擦力, 反発力, フラグ)

    //割れたスイカ
    var phyBall = new PhyCircleSprite(116, enchant.box2d.DYNAMIC_SPRITE, 10.0, 1.0, 0, true);
    phyBall.image = game.assets["images/watermelon-left.png"];
    phyBall.position = { x: 390, y: 490 };
    phyBall.angle = -10;
    gameScene.addChild(phyBall); // シーンに追加

    var phyBall2 = new PhyCircleSprite(116, enchant.box2d.DYNAMIC_SPRITE, 10.0, 1.0, 0, true);
    phyBall2.image = game.assets["images/watermelon-right.png"];
    phyBall2.position = { x: 410, y: 490 };
    phyBall2.angle = 10;
    gameScene.addChild(phyBall2); // シーンに追加

    //床
    var phyFloor = new PhyBoxSprite(400, 5, enchant.box2d.STATIC_SPRITE, 10, 1.0, 0, false);
    phyFloor.x = 20;
    phyFloor.y = 630;
    //    phyFloor.backgroundColor = "red";
    phyFloor.angle = -5;
    gameScene.addChild(phyFloor);

    var phyFloor3 = new PhyBoxSprite(400, 5, enchant.box2d.STATIC_SPRITE, 10, 1.0, 0, false);
    phyFloor3.x = 20;
    phyFloor3.y = 630;
    //    phyFloor3.backgroundColor = "red";
    phyFloor3.angle = 5;
    gameScene.addChild(phyFloor3);

    //床
    var phyFloorR = new PhyBoxSprite(400, 5, enchant.box2d.STATIC_SPRITE, 10, 1.0, 0, false);
    phyFloorR.x = 400;
    phyFloorR.y = 630;
    //    phyFloorR.backgroundColor = "red";
    phyFloorR.angle = 5;
    gameScene.addChild(phyFloorR);

    //床
    var phyFloorR = new PhyBoxSprite(400, 5, enchant.box2d.STATIC_SPRITE, 10, 1.0, 0, false);
    phyFloorR.x = 400;
    phyFloorR.y = 630;
    //    phyFloorR.backgroundColor = "red";
    phyFloorR.angle = -5;
    gameScene.addChild(phyFloorR);

}

function gameClear(gameScene, meijin, item) {
    //スイカ割り
    item.remove();
    breakWaterMelon(gameScene);

    gameScene.tl.delay(300);
    gameScene.tl.then(function () {
        game.replaceScene(game.rootScene);
    })


    //プレイヤー
    meijin.image = game.assets["images/meijin_hit.png"];

    gameScene.touchEnabled = false;
    var explosion = new Sprite(640, 480);
    explosion.image = game.assets["images/explosion.png"];
    explosion.tl.scaleTo(0.8, 0.8, 0);
    explosion.rotation = -90;
    explosion.x = 90;
    explosion.y = 250;
    gameScene.addChild(explosion);
    var sound = game.assets['se/explosion.mp3'].clone();
    sound.play();
    explosion.frame = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, null];
    explosion.addEventListener(Event.ANIMATION_END, function () {
        this.remove();

        var clear = new Sprite(640, 250);
        clear.image = game.assets["images/stageclear.png"];
        clear.x = 640;
        clear.y = 300;
        gameScene.addChild(clear);
        clear.tl.delay(90);
        clear.tl.then(function () {
            var sound = game.assets['se/clear.mp3'].clone();
            sound.play();
        });
        clear.tl.moveTo(0, 340, 7);
    });

    //    game.stop();


}

function cutin(gameScene, meijin, item) {
    var sound = game.assets['se/cutin.mp3'].clone();
    sound.play();

    var cutinGroup = new Group();
    cutinGroup.x = 640;
    cutinGroup.y = 0;
    gameScene.addChild(cutinGroup);
    cutinGroup.tl.moveTo(0, 0, 6);
    cutinGroup.tl.delay(60);
    cutinGroup.tl.then(function () {
        cutinGroup.remove();
        gameClear(gameScene, meijin, item);
    });

    var back = new Sprite(640, 240);
    back.image = game.assets["images/cutin.png"];
    back.frame = [0, 1, 2, 3];
    back.tl.scaleTo(1.2, 1.288, 0);
    back.rotation = -10;
    back.x = 0;
    back.y = 239;
    cutinGroup.addChild(back);

    var face = new Sprite(640, 518);
    face.image = game.assets["images/cutin_face.png"];
    face.tl.scaleTo(0.6, 0.6, 0);
    face.rotation = -10;
    face.x = 0;
    face.y = 100;
    cutinGroup.addChild(face);
}