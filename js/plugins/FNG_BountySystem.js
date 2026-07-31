//-----------------------------------------------------------------------------
// Scene_Bounty
//
// コーネリア城から呼び出す
// このシーンの機能
// ・バウンティ一覧を表示

function Scene_Bounty() {
    this.initialize.apply(this, arguments);
}

Scene_Bounty.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Bounty.prototype.constructor = Scene_Bounty;

Scene_Bounty.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);

    this._sprite = new Sprite(ImageManager.loadPicture("wanted/wanted_1"));
    this._sprite.anchor.x = 0;
    this._sprite.anchor.y = 0;
    this._sprite.x = 0;
    this._sprite.y = 0;
    this._completedSprite = new Sprite(ImageManager.loadPicture("wanted/wanted cmp"));
    this._completedSprite.anchor.x = 0;
    this._completedSprite.anchor.y = 0;
    this._completedSprite.x = 0;
    this._completedSprite.y = 0;
    this._completedSprite.visible = $gameVariables.value($gameParty.bountyInfo()[0][3])>0;
    this._infoId = 0;
    this.addChild(this._sprite);
    this.addChild(this._completedSprite);
};

Scene_Bounty.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createInfoWindow();
    this.createMenuNameWindow("てはいしょ");
    this.createListWindow();
    this.createRateWindow();
    this._listWindow.activate();
    this._infoWindow.setInfo(0);
};

Scene_Bounty.prototype.createRateWindow = function() {
    var rect = this.rateWindowRect();
    this._rateWindow = new Window_Base(rect);
    this.addWindow(this._rateWindow);
    this._rateWindow.drawText($gameParty.bountyAchieveRate()+"%",0,2,this._rateWindow.innerWidth,"right");
    this._rateWindow.changeTextColor(ColorManager.systemColor());
    this._rateWindow.drawText("Completion",0,2,this._rateWindow.innerWidth);
};

Scene_Bounty.prototype.rateWindowRect = function() {
    const ww = 128-this._menuNameWindow.width;
    const wh = this._menuNameWindow.height;
    const wx = Graphics.boxWidth-ww-this._menuNameWindow.width;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Bounty.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    if(this._infoId != this._listWindow.index()){
        this._infoId = this._listWindow.index();
        this._infoWindow.setInfo(this._infoId);
        if($gameParty.bountyInfo()[this._infoId][4]<=$gameVariables.value(2)){
            this._sprite.bitmap = ImageManager.loadPicture("wanted/wanted_" + Number(this._infoId+1));
        }else{
            this._sprite.bitmap = ImageManager.loadPicture("wanted/wanted_undefined");
        }
        console.log("wanted/wanted_" + Number(this._infoId+1));
        this._completedSprite.visible = $gameVariables.value($gameParty.bountyInfo()[this._infoId][3])>0;
    }
};

Scene_Bounty.prototype.createInfoWindow = function() {
    var rect = this.InfoWindowRect();
    this._infoWindow = new Window_BountyInfo(rect);
    this.addWindow(this._infoWindow);
};

Scene_Bounty.prototype.InfoWindowRect = function() {
    const ww = Graphics.boxWidth-128;
    const wh = 50;
    const wx = 0;
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Bounty.prototype.createMenuNameWindow = function(name) {
    const width = this.mainFontSize()*5+this.mainFontSize()*5/4;
    const height = this.mainFontSize()*3;
    var rect = new Rectangle(Graphics.boxWidth-width, 0, width,height);
    this._menuNameWindow = new Window_MenuName(rect);
    this._menuNameWindow.drawMenuName(name);
    this.addWindow(this._menuNameWindow);
};

Scene_Bounty.prototype.createListWindow = function() {
    var rect = this.ListWindowRect();
    this._listWindow = new Window_BountyList(rect);
    this._listWindow.setHandler("cancel", this.popScene.bind(this));
    //this._materiaListWindow.setHandler("ok", this.onMateriaListOk.bind(this));
    this.addWindow(this._listWindow);
};

Scene_Bounty.prototype.ListWindowRect = function() {
    const ww = 128;
    const wh = Graphics.boxHeight-this._menuNameWindow.height;
    const wx = Graphics.boxWidth-ww;
    const wy = Graphics.boxHeight-wh;
    return new Rectangle(wx, wy, ww, wh);
};

//-----------------------------------------------------------------------------
// Window_BountyList
//
// 手配リスト

function Window_BountyList() {
    this.initialize(...arguments);
}

Window_BountyList.prototype = Object.create(Window_ItemList.prototype);
Window_BountyList.prototype.constructor = Window_BountyList;

Window_BountyList.prototype.initialize = function(rect) {
    Window_ItemList.prototype.initialize.call(this, rect);
    this.makeItemList();
    this.drawAllItems();
    this._index = 0;
};

Window_BountyList.prototype.maxCols = function(rect) {
    return 1;
};

Window_BountyList.prototype.lineHeight = function(rect) {
    return 10;
};

Window_BountyList.prototype.makeItemList = function() {
    const infos = $gameParty.bountyInfo()
    this._data = [];
    for(info of infos){
        this._data.push(info[2]);
    }
};

Window_BountyList.prototype.drawItem = function(index) {
    var item = this.itemAt(index);
    
    if($gameParty.bountyInfo()[index][4]>$gameVariables.value(2)){
        item = "？？？？？？？？？？"
    }
    if (item) {
        const text = ( '000' + (index+1) ).slice( -3 ) + " " + item;
        const numberWidth = this.numberWidth();
        const rect = this.itemLineRect(index);
        this.drawText(text, rect.x, rect.y, rect.width);
        if($gameVariables.value($gameParty.bountyInfo()[index][3])>0){
            this.drawIcon(57, rect.x+rect.width-14,rect.y-4);
        }
    }
};

Window_BountyList.prototype.itemRect = function(index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX();
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
    const width = itemWidth - colSpacing;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x+8, y, width-8, height);
};


//-----------------------------------------------------------------------------
// Window_BountyInfo
//
// 手配書の報酬と出現エリアを表示する

function Window_BountyInfo() {
    this.initialize(...arguments);
}

Window_BountyInfo.prototype = Object.create(Window_Base.prototype);
Window_BountyInfo.prototype.constructor = Window_BountyInfo;

Window_BountyInfo.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
};

Window_BountyInfo.prototype.setInfo = function(id) {
    if(id<0){
        return;
    }
    this.contents.clear();
    this.changeTextColor(ColorManager.systemColor());
    this.drawText("Reward",0,0,40);
    this.drawText("Location",0,20,64);
    this.changeTextColor(ColorManager.normalColor());
    const item = $gameParty.bountyInfo()[id][1];
    this.drawItemName(item, 0, 10, this.itemWidth());
    var location = $gameParty.bountyInfo()[id][0];
    if($gameVariables.value(2)<$gameParty.bountyInfo()[id][4]){
        location = "？？？？？？？？？？"
    }
    //console.log(location,this._maxFloor,$gameParty.bountyInfo()[id][4])
    this.drawText(location,0,30,this.itemWidth());
};

//-----------------------------------------------------------------------------
// Game_Party
//
// 出現場所と報酬リスト

Game_Party.prototype.bountyInfo = function() {
    var data = [
        ["Chaos Shrine","I,173","Stone Statue",1081,0],
        ["Chaos Shrine","W,7","Archaeodinos",1082,0],
        ["Chaos Shrine","I,82","Garchimera",1083,0],
        ["Snow Cave","I,146","Mind Flayer",1084,5], //デスペル
        ["Snow Cave","A,50","Twin Dragon",1085,5], //だいちのころも
        ["Snow Cave","I,85","Cocytus",1086,5], //ミスリル
        ["Sealed Cave","A,51","Trap Door",1087,11], //サバイバルベスト
        ["Sealed Cave","W,84","Larva-Larva",1088,11], //マンイーター
        ["Sealed Cave","I,91","Dark Elf",1089,11], //ませきのかけら
        ["Mt Hobbs","A,175","Materia Keeper",1090,17], //アミュレット
        ["Mt Hobbs","A,10","Hiryu-So",1091,17], //フレイムシールド
        ["Mt Hobbs","I,160","Abaddon",1092,17], //ブリザラ
        ["Phantom Train","A,82","Skull Eater",1093,23], //フェアリーローブ
        ["Phantom Train","W,65","Phantom Knights",1094,23], //かぜきりのやいば
        ["Phantom Train","I,137","Iron Giant",1095,23], //バファイ
        ["サヌビアさばく","A,154","サポテンダー",1096,24], //とうぞくのこて
        ["サヌビアさばく","W,232","ドルムキマイラ",1097,24], //きんのたてごと
        ["サヌビアさばく","I,83","サボテンダー",1098,24], //きんのかたまり
        ["サヌビアさばく","A,177","スラッグクロウラ",1099,24], //シュシュ
        ["ピラミッド","I,92","マシンヘッド",1100,30], //まどうせき
        ["ピラミッド","A,17","ミミック",1101,30], //ゴールドシールド
        ["ピラミッド","A,206","グランインセクト",1102,30], //ほのおのゆびわ
        ["ピラミッド","A,56","スフィンクス",1103,30], //はくしきのガウン
        ["ほのおのどうくつ","A,208","ラルヴァイマーゴ",1104,36], //サンゴのゆびわ
        ["ほのおのどうくつ","W,67","ニンジャ",1105,36], //かげぬい
        ["ほのおのどうくつ","A,70","マザーボム",1106,36], //あかいドレス
        ["ムーアのだいしんりん","A,57","ウェアウルフ",1107,42], //デュエルスーツ
        ["ムーアのだいしんりん","I,52","ヤーン",1108,42], //メテオストーン
        ["バブイルのとう（下）","W,161","ヒュドラ",1109,48], //ダイヤランス
        ["バブイルのとう（下）","I,50","きかいりゅう",1110,48], //まどうせき
        ["バブイルのとう（下）","I,20","アルケオエイビス",1111,48], //メガフェニックス
        ["バブイルのとう（上）","A,84","フリーズビースト",1112,53], //しろのローブ
        ["バブイルのとう（上）","I,119","ゴドー",1113,53], //にじいろのいと
        ["バブイルのとう（上）","W,95","プラウド・クラッド",1114,53], //チキンナイフ
        ["ちかげすいどう","A,83","モルボル",1115,56], //くろのローブ
        ["ちかげすいどう","W,23","ブッシュファイア",1116,56], //ブレイブブレイド
        ["ちかげすいどう","I,97","バイオソルジャー",1117,56], //りゅうのうろこ
        ["ビサイドとう","I,50","ミニドラゴン",1118,61], //まどうせき
        ["ビサイドとう","W,70","ドラゴンエイビス",1119,61], //まさむね
        ["ビサイドとう","A,164","グランドドラゴン",1120,61], //げんじのこて
        ["マカラーニャのもり","I,36","ジェミニスミーズ",1121,63], //ダークマター 
        ["マカラーニャのもり","W,237","ティラノサウルス",1122,63], //マーメイドハープ
        ["マカラーニャのもり","I,93","ジャンボプリン",1123,63], //ロゼッタいし
        ["ふねのはかば","I,94","のろいのきんか",1124,69], //けんじゃのいし
        ["ふねのはかば","W,178","カーラボス",1125,69], //ゴッドハンド
        ["ふねのはかば","I,107","ゴーストシップ",1126,69], //ときのはぐるま
        ["たつまき","A,178","ヴァンパイアロード",1127,77], //リボン
        ["たつまき","A,129","マザーラミア",1128,77], //リミテッドムーン
        ["たつまき","W,165","デスライダー",1129,77], //グローランス
        ["オーエンのとう","A,199","コムサ　ベラズ",1130,83], //スリースターズ
        ["オーエンのとう","A,192","アーク＆クレイクロウ",1131,83], //てんしのゆびわ
        ["オーエンのとう","W,24","プレイグ",1132,83], //オニオンソードII
        ["またいりく","W,94","フンババ",1133,89], //バリアントナイフ
        ["またいりく","A,23","ブラキオレイドス",1134,89], //えいゆうのたて
        ["またいりく","W,24","オズマ",1135,89], //エクスカリバーII
        ["アルティミシアじょう","W,50","デスマシーン",1136,95], //アルテマウェポン
        ["アルティミシアじょう","A,64","まほうレベル99",1137,95], //スノーマフラー
        ["じげんのとう　じょうそう","I,103","プロトフェイズ",1139,101], //エネルギーけっしょう
        ["じげんのとう　じょうそう","I,102","ヒュージスフィア",1140,101], //せいよくしょう
        ["じげんのとう　じょうそう","I,89","タイダリアサン",1141,101], //アダマンタイト
        ["じげんのとう　しんぶ","I,89","ルブルムドラゴン",1142,102], //アダマンタイト
        ["じげんのとう　しんぶ","I,9","クァールレギナ",1143,102], //ラストエリクサー
        ["じげんのとう　しんぶ","A,109","オメガ改",1144,102], //ガラスのマスク
        ["クリスタルワールド","I,106","しんりゅう改",1145,103], //ピンクのしっぽ
    ] 
    for(var i=0;i<data.length;i++){
        const type = data[i][1];
        const itemtext = [];
        for(const text of type.split(',')){
            itemtext.push(text);
        }
        switch(itemtext[0]){
            case "I":
                data[i][1] = $dataItems[itemtext[1]];
                break;
            case "W":
                data[i][1] = $dataWeapons[itemtext[1]];
                break;
            case "A":
                data[i][1] = $dataArmors[itemtext[1]];
                break;
        }
    }
    return data;
};

Game_Party.prototype.bountyRewards = function(){
    const bountyInfo = this.bountyInfo();
    var rewards = []
    for(var i=0;i<bountyInfo.length;i++){
        if($gameVariables.value(1081+i) == 1){
            rewards.push(bountyInfo[i]);
        }
    }
    return rewards;
}

Game_Party.prototype.bountyAchieveRate = function(){
    const bountyInfo = this.bountyInfo();
    var beatedNum = 0;
    for(var i=0;i<bountyInfo.length;i++){
        if($gameVariables.value(1081+i) > 0){
            beatedNum++;
        }
    }
    return Math.floor(beatedNum/bountyInfo.length*100);
}
