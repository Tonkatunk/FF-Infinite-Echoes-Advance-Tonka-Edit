//-----------------------------------------------------------------------------
// DataManager
//
// The static class that manages the database and game objects.

$gameCrystals = null;

const _dataManager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function(){
    _dataManager_createGameObjects.apply(this,arguments);
    $gameCrystals = new Game_Crystals();
}

var _makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
var contents = _makeSaveContents.call(this);
contents.gameCrystals = $gameCrystals;
return contents;
};

var _extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
_extractSaveContents.call(this, contents);
$gameCrystals = contents.gameCrystals;
};

//-----------------------------------------------------------------------------
// Game_Crystals
//
// クリスタルのデータをまとめて管理するクラス

function Game_Crystals() {
    this.initialize(...arguments);
}

Game_Crystals.prototype.initialize = function() {
    this._data = [];
    for (let i = 1; i <= 6;i++){
        this._data.push(new Game_Crystal(i))
    }
};

Game_Crystals.prototype.crystal = function(crystalId) {
    return this._data[crystalId-1];
};

//-----------------------------------------------------------------------------
// Game_Crystal
//
// クリスタルの情報を扱う

function Game_Crystal() {
    this.initialize(...arguments);
}

Game_Crystal.prototype.initialize = function(crystalId) {
    this.setup(crystalId);
};

Game_Crystal.prototype.setup = function(crystalId) {
    const initAps = [100,200,300,650,1200,0];
    this._id = crystalId;
    this._ap = initAps[crystalId-1];
    this._actor = null;
    this._gainedMaterias = [];
};

Game_Crystal.prototype.actor = function() {
    return this._actor;
};

Game_Crystal.prototype.setActor = function(actor) {
    if(actor.crystal()){
        actor.crystal()._actor = null;
    }
    this._actor = actor;
};

Game_Crystal.prototype.removeActor = function() {
    this._actor = null;
};

Game_Crystal.prototype.name = function() {
    const id = this._id;
    return $dataItems[249+id].name;
};

Game_Crystal.prototype.abilities = function() {
    const list = [];
    if(this._id == 1){ //クリスタルのかけら -----------------------------------------
        list.push([230,50]); //しらべる
        list.push([253,50]); //ラーニング
        list.push([305,50]); //バランスかんかく
        list.push([298,100]); //どくみのじゅつ
        list.push([299,100]); //ねむらずのじゅつ
        list.push([300,100]); //ねこのめのじゅつ
        list.push([301,100]); //ゆうぜんのじゅつ
        list.push([302,100]); //じょうぜつのじゅつ
        list.push([263,150]); //しらはどり
        list.push([297,150]); //とまらずのじゅつ
        list.push([303,150]); //かたまらずのじゅつ
        list.push([304,150]); //へんげかいひのじゅつ
        list.push([255,200]); //とらえる
        list.push([258,250]); //せんしのごくい
        list.push([260,250]); //まどうしのごくい
        list.push([259,300]); //かくとう
        list.push([256,300]); //ＨＰ３０％アップ
        list.push([295,300]); //くすりのちしき    
        list.push([276,350]); //けんそうび
        list.push([268,350]); //たてそうび
        list.push([223,400]); //しろくろま
        list.push([344,500]); //へんか    
    }else if(this._id == 2){ //つちのクリスタル ---------------------------------------
        list.push([234,150]); //ぶんしん
        list.push([250,150]); //かばう
        list.push([315,150]); //まもる
        list.push([342,150]); //スマッシュ
        list.push([262,200]); //きょじんのこころ
        list.push([269,200]); //ローブそうび
        list.push([270,200]); //よろいそうび
        list.push([277,200]); //かたなそうび
        list.push([278,200]); //ガンブレードそうび
        list.push([285,200]); //おのそうび
        list.push([293,200]); //オートレビテト
        list.push([314,200]); //ねらいうち
        list.push([321,200]); //オートライブラ
        list.push([322,200]); //たてごとそうび
        list.push([323,200]); //かんつう
        list.push([246,250]); //ふみこむ
        list.push([249,250]); //かくれる
        list.push([288,350]); //オートリジェネ
        list.push([289,450]); //オートプロテス
        list.push([290,450]); //オートシェル
        list.push([291,450]); //オートリフレク
        list.push([308,550]); //たいれつむし
        list.push([324,550]); //てきよけ
        list.push([345,550]); //ちけい
    }else if(this._id == 3){ //火のクリスタル ------------------------------------------
        list.push([226,200]); //ぬすむ
        list.push([235,200]); //いのる
        list.push([271,250]); //まほうぼうそうび
        list.push([272,250]); //かぶとそうび
        list.push([273,250]); //こてそうび
        list.push([228,300]); //ひっさつ
        list.push([236,300]); //おどす
        list.push([343,300]); //チャージ
        list.push([251,300]); //カウンター
        list.push([252,300]); //オートポーション
        list.push([284,300]); //ロッドそうび
        list.push([227,350]); //ドロー
        list.push([231,350]); //ためる
        list.push([240,350]); //ジャンプ
        list.push([248,350]); //バーサク
        list.push([254,350]); //まほうがえし
        list.push([279,350]); //とうてきそうび
        list.push([280,350]); //ゆみやそうび
        list.push([281,350]); //ムチそうび
        list.push([282,350]); //やりそうび
        list.push([283,350]); //つえそうび
        list.push([247,400]); //せんぎ
        list.push([257,400]); //ＭＰ２０％アップ
        list.push([261,450]); //ちょこまかうごく
        list.push([294,450]); //ミラージュ
        list.push([267,450]); //さきがけ
        list.push([266,650]); //りょうてもち
    }else if(this._id == 4){ //水のクリスタル ------------------------------------------
        list.push([318,500]); //トレジャーハント
        list.push([242,500]); //あやつる
        list.push([346,650]); //かいふく
        list.push([237,650]); //せいしんは
        list.push([306,650]); //てんしのまもり
        list.push([245,675]); //あんこく
        list.push([347,675]); //まじゅう
        list.push([221,750]); //くろまほう
        list.push([222,750]); //じくう
        list.push([224,750]); //まどう
        list.push([286,750]); //おまじない
        list.push([238,775]); //そせい
        list.push([239,775]); //ちりょう
        list.push([326,900]); //アイテムのごくい
        list.push([309,900]); //まんげつのこころえ
        list.push([220,975]); //しろまほう
    }else if(this._id == 5){ //風のクリスタル ------------------------------------------
        list.push([316,800]); //アンデッド
        list.push([319,900]); //あんぜんちたい
        list.push([317,1000]); //レアハント
        list.push([287,1100]); //オートヘイスト
        list.push([229,1200]); //みだれうち
        //list.push([232,1200]); //ちょうごう
        list.push([233,1200]); //なげる
        list.push([244,1200]); //ぜんぎり
        list.push([310,1200]); //インビジブル
        list.push([311,1200]); //しょうひＭＰ１／４
        list.push([312,1350]); //にとうりゅう
    }else if(this._id == 6){ //謎のクリスタル ------------------------------------------
        list.push([225,1500]); //あおまほう
        list.push([241,1500]); //たくす
        list.push([243,1500]); //まほうけん
        list.push([274,1500]); //オニオンそうび
        list.push([275,1800]); //ぶきなんでもそうび
        list.push([340,1800]); //ものまね
        list.push([296,2100]); //れんぞくまほう
        list.push([320,2100]); //リボン
    }
    return list;
};

Game_Crystal.prototype.isGainedMateria = function(id) {
    if(!this._gainedMaterias){
        this._gainedMaterias = []
    }
    return this._gainedMaterias.includes(id);
};

Game_Crystal.prototype.pushGainedMateria = function(id) {
    if(!this._gainedMaterias){
        this._gainedMaterias = []
    }
    this._gainedMaterias.push(id);
};


Game_Crystal.prototype.ability = function(index) {
    if(this.abilities().length>=index){
       return null
    }
    if(index){
        return $dataArmors[this.abilities()[index][0]];
    }
    return null;
};


Game_Crystal.prototype.cost = function(index) {
    if(this.abilities().length>=index){
       return null
    }
    if(index){
        return $dataArmors[this.abilities()[index][1]];
    }
    return null;
};

Game_Crystal.prototype.gainAp = function(value) {
    this._ap = this._ap + value;
};

Game_Crystal.prototype.consumeAp = function(value) {
    this._ap = this._ap - value;
    if(this._ap < 0){
        this._ap = 0;
    }
};

Game_Crystal.prototype.ap = function() {
    if(!this._ap){
        this._ap = 0;
    }
    return this._ap;
};

Game_Crystal.prototype.finalApRate = function() {
    if(!this.actor()){
       return 0;
    }
    var value = this.actor().finalApRate();
    value *= this.actor().isJobMaster() ? 2 : 1;
    return value;    
};

//-----------------------------------------------------------------------------
// Game_Actor
//
// ジャンクションしているクリスタルがあれば返す関数を追加する

Game_Actor.prototype.crystal = function(){
    var value = null;
    for(crystal of $gameCrystals._data){
        if(crystal.actor() && this._actorId == crystal.actor()._actorId){
            value = crystal;
        }
    }
    return value;
}

//-----------------------------------------------------------------------------
// Scene_Crystal
//
// メニュー画面から移動
// このシーンの機能
// ・クリスタルがジャンクションするアクターを選択する
// ・AP（たまったポイント）とマテリアを交換する

function Scene_Crystal() {
    this.initialize.apply(this, arguments);
}

Scene_Crystal.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Crystal.prototype.constructor = Scene_Crystal;

Scene_Crystal.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Crystal.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createMenuNameWindow("Crystal");
    this.createHelpWindow();
    this.createMateriaListWindow();
    this.createStatusWindow();
    this.createCommandWindow();
    this._commandWindow.setStatusWindow(this._statusWindow);
    this._commandWindow.setHelpWindow(this._helpWindow);
    this.createCrystalListWindow();
    this._materiaListWindow.setCrystalListWindow(this._crystalListWindow);
    this._materiaListWindow.setHelpWindow(this._helpWindow);
    this.createCheckWindow();
};

Scene_Crystal.prototype.createMateriaListWindow = function() {
    var rect = this.materiaListWindowRect();
    this._materiaListWindow = new Window_CrystalMaterias(rect);
    this._materiaListWindow.setHandler("cancel", this.onMateriaListCancel.bind(this));
    this._materiaListWindow.setHandler("ok", this.onMateriaListOk.bind(this));
    this._materiaListWindow._index = 0;
    this.addWindow(this._materiaListWindow);
};

Scene_Crystal.prototype.materiaListWindowRect = function() {
    const ww = Graphics.boxWidth-this.mainFontSize()*12;
    const wh = Graphics.boxHeight-this.mainFontSize()*6-this.mainFontSize()*7/8;
    const wx = Graphics.boxWidth-ww;
    const wy = this.mainFontSize()*3;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Crystal.prototype.createStatusWindow = function() {
    var rect = this.statusWindowRect();
    this._statusWindow = new Window_CrystalStatus(rect);
    this._statusWindow.setHandler("cancel", this.onStatusCancel.bind(this));
    this._statusWindow.setHandler("ok", this.onStatusOk.bind(this));
    this._statusWindow._index = 0;
    this.addWindow(this._statusWindow);
};

Scene_Crystal.prototype.statusWindowRect = function() {
    const ww = Graphics.boxWidth-this.mainFontSize()*12;
    const wh = Graphics.boxHeight-this.mainFontSize()*6-this.mainFontSize()*7/8;
    const wx = Graphics.boxWidth-ww;
    const wy = this.mainFontSize()*3;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Crystal.prototype.helpWindowRect = function() {
    const wx = this.mainFontSize;
    const wh = this.mainFontSize()*3+this.mainFontSize()*7/8;
    const wy = Graphics.boxHeight-wh;
    const ww = Graphics.boxWidth;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Crystal.prototype.createCrystalListWindow = function() {
    var rect = this.crystalListWindowRect();
    this._crystalListWindow = new Window_CrystalList(rect);
    this._crystalListWindow.setHandler("cancel", this.onCrystalCancel.bind(this));
    this._crystalListWindow.setHandler("ok", this.onCrystalOk.bind(this));
    this.addWindow(this._crystalListWindow);
};

Scene_Crystal.prototype.createMenuNameWindow = function(name) {
    const width = this.mainFontSize()*5+this.mainFontSize()*5/4;
    const height = this.mainFontSize()*3;
    var rect = new Rectangle(Graphics.boxWidth-width, 0, width,height);
    this._menuNameWindow = new Window_MenuName(rect);
    this._menuNameWindow.drawMenuName(name);
    this.addWindow(this._menuNameWindow);
};

Scene_Crystal.prototype.createHelpWindow = function() {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_Help(rect);
    this.addWindow(this._helpWindow);
};

Scene_Crystal.prototype.helpWindowRect = function() {
    const wx = 0;
    const wh = this.mainFontSize()*3+this.mainFontSize()*7/8;
    const wy = Graphics.boxHeight-wh;
    const ww = Graphics.boxWidth;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Crystal.prototype.createCommandWindow = function() {
    const rect = this.commandWindowRect();
    const commandWindow = new Window_CrystalCommand(rect);
    commandWindow.setHandler("materia", this.commandMateria.bind(this));
    commandWindow.setHandler("junction", this.commandJunction.bind(this));
    commandWindow.setHandler("cancel", this.popScene.bind(this));
    this._commandWindow = commandWindow;
    this.addWindow(this._commandWindow);
}

Scene_Crystal.prototype.commandWindowRect = function() {
    const ww = Graphics.boxWidth-(this.mainFontSize()*5+this.mainFontSize()*5/4);
    const wh = this.mainFontSize()*3;
    const wx = 0;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Crystal.prototype.createCheckWindow = function() {
    const rect = this.checkWindowRect();
    const checkWindow = new Window_CrystalApConsumeCheck(rect);
    checkWindow.setHandler("ok", this.onCheckOk.bind(this));
    checkWindow.setHandler("cancel", this.onCheckCancel.bind(this));
    this._checkWindow = checkWindow;
    this.addWindow(this._checkWindow);
}

Scene_Crystal.prototype.checkWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = this.mainFontSize()*7;
    const wx = 0;
    const wy = Graphics.boxHeight/2-wh/2;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Crystal.prototype.crystalListWindowRect = function() {
    const ww = this.mainFontSize()*12;
    const wh = Graphics.boxHeight-this.mainFontSize()*6-this.mainFontSize()*7/8;
    const wx = 0;
    const wy = this.mainFontSize()*3;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Crystal.prototype.commandMateria = function() {
    this._helpWindow.clear()
    this._crystalListWindow.activate();
}

Scene_Crystal.prototype.commandJunction = function() {
    this._helpWindow.clear()
    this._crystalListWindow.activate();
}

Scene_Crystal.prototype.onCrystalCancel = function() {
    this._commandWindow.activate();
}

Scene_Crystal.prototype.onCrystalOk = function() {
    if(this._commandWindow._index == 1){
        this._statusWindow.activate();
    }else{
        this._materiaListWindow.activate();
    }
}

Scene_Crystal.prototype.onCheckCancel = function() {
    this._checkWindow.hide();
    this._materiaListWindow.activate();
}

Scene_Crystal.prototype.onCheckOk = function() {
    const index = this._materiaListWindow.index();
    const crystalItem = this._crystalListWindow._data[this._crystalListWindow._index];
    const crystal = $gameCrystals._data[crystalItem.id-250];
    const ability = $dataArmors[crystal.abilities()[index][0]];
    const cost = crystal.abilities()[index][1];
    $gameParty.gainItem(ability,1);
    crystal.consumeAp(cost);
    crystal.pushGainedMateria(crystal.abilities()[index][0]);
    this._crystalListWindow.refresh();
    this._materiaListWindow.refresh();
    this._checkWindow.hide();
    this._materiaListWindow.refresh();
    this._materiaListWindow.activate();
}

Scene_Crystal.prototype.onMateriaListCancel = function() {
    this._helpWindow.clear()
    this._crystalListWindow.activate();
}

Scene_Crystal.prototype.onStatusCancel = function() {
    this._crystalListWindow.activate();
}

Scene_Crystal.prototype.onStatusOk = function() {
    const index = this._statusWindow.index();
    const actor = this._statusWindow.actor(index);
    const crystalItem = this._crystalListWindow._data[this._crystalListWindow._index];
    const crystal = $gameCrystals._data[crystalItem.id-250];
    crystal._actor = actor;
    this._statusWindow.refresh();
    this._crystalListWindow.activate();
}

Scene_Crystal.prototype.onMateriaListOk = function() {
    const index = this._materiaListWindow.index();
    const crystalItem = this._crystalListWindow._data[this._crystalListWindow._index];
    const crystal = $gameCrystals._data[crystalItem.id-250];
    const ability = $dataArmors[crystal.abilities()[index][0]];
    const cost = crystal.abilities()[index][1];
    if(crystal.ap() >= cost && !crystal.isGainedMateria(ability)){
        this._checkWindow._crystal = crystal;
        this._checkWindow._cost = cost;
        this._checkWindow._item = ability;
        this._checkWindow.show();
        this._checkWindow.activate();
    }
}


//-----------------------------------------------------------------------------
// Window_CrystalList
//
// 所持しているクリスタルを選ぶウィンドウ

function Window_CrystalList() {
    this.initialize(...arguments);
}

Window_CrystalList.prototype = Object.create(Window_ItemList.prototype);
Window_CrystalList.prototype.constructor = Window_CrystalList;

Window_CrystalList.prototype.initialize = function(rect) {
    Window_ItemList.prototype.initialize.call(this, rect);
    this.makeItemList();
    this.drawItemAll();
    this._index = 0;
};

Window_CrystalList.prototype.drawItemAll = function(index) {
    var i=0;
    for(item of this._data){
        this.drawItem(i);
        i = i+1;
    }
};

Window_CrystalList.prototype.makeItemList = function() {
    this._data = [];
    for(item of $gameParty.allItems()){
        if(DataManager.isItem(item) && item.id>=250 && item.id<256){
            this._data.push(item);
        }
    }    
    if (this.includes(null)) {
        this._data.push(null);
    }
};

Window_CrystalList.prototype.drawItem = function(index) {
    const item = this.itemAt(index);
    if (item) {
        const rect = this.itemRect(index);
        console.log(item.id,$gameCrystals._data[item.id-250])
        const ap = $gameCrystals._data[item.id-250]._ap;
        this.changePaintOpacity(1);
        this.drawItemName(item, rect.x, rect.y, rect.width);
        this.drawText(ap, rect.x, rect.y+this.contents.fontSize, rect.width - this.textWidth(" AP"),"right");
        this.changeTextColor(ColorManager.systemColor());
        this.drawText("AP", rect.x, rect.y+this.contents.fontSize, rect.width,"right");
        this.changeTextColor(ColorManager.normalColor());
    }
};

Window_CrystalList.prototype.maxCols = function() {
    return 1;
};

Window_CrystalList.prototype.itemRect = function(index) {
    const rect = new Rectangle();
    rect.x = 0;
    rect.y = this.innerHeight/6*index;
    rect.width = this.innerWidth-this.contents.fontSize/4;
    rect.height = this.innerHeight/6;
    return rect;
};

Window_CrystalList.prototype.isEnabled = function(index) {
    return true;
};

//-----------------------------------------------------------------------------
// Window_CrystalCommand
//
// クリスタルメニュー用のコマンド

function Window_CrystalCommand() {
    this.initialize(...arguments);
}

Window_CrystalCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_CrystalCommand.prototype.constructor = Window_CrystalCommand;

Window_CrystalCommand.prototype.initialize = function(rect) {
    Window_HorzCommand.prototype.initialize.call(this, rect);
    this.drawItem();
};

Window_CrystalCommand.prototype.setHelpWindow = function(helpWindow) {
    this._helpWindow = helpWindow;
    this.callUpdateHelp();
};

Window_CrystalCommand.prototype.maxCols = function() {
    return 2;
};

Window_CrystalCommand.prototype.callUpdateHelp = function() {
    if (this.active && this._helpWindow) {
        this.updateHelp();
    }
};

Window_CrystalCommand.prototype.updateHelp = function() {
    this._helpWindow.clear();
    if(this._index == 0){
        this._helpWindow.setText("Exchange the Crystals' AP for Materia");
    }else{
        this._helpWindow.setText("Select a character to junction the Crystal to.");
    }
};

Window_CrystalCommand.prototype.makeCommandList = function() {
    this.addCommand("マテリア", "materia");
    this.addCommand("ジャンクション", "junction");
};

Window_CrystalCommand.prototype.drawItem = function(){
    this.contents.clear();
    this.drawText("Materia",0,this.lineHeight()/4,this.innerWidth/2,"center");
    this.drawText("Junction",this.innerWidth/2,this.lineHeight()/4,this.innerWidth/2,"center");
}

Window_CrystalCommand.prototype.itemRect = function() {
    const rect = new Rectangle();
    rect.x = this.index()%2*this.innerWidth/2 + this.contents.fontSize*1.75;
    rect.y = 0;
    rect.width = this.innerWidth/2 - this.contents.fontSize*3.5;
    rect.height = this.innerHeight;
    return rect;
};

Window_CrystalCommand.prototype.update = function() {
    Window_Command.prototype.update.call(this);
    if (this._index == 0 && this._statusWindow.visible) {
        this._statusWindow.hide();
    }
    if (this._index == 1 && !this._statusWindow.visible) {
        this._statusWindow.show();
    }
};

Window_CrystalCommand.prototype.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
};

//-----------------------------------------------------------------------------
// Window_CrystalStatus
//
// クリスタルメニュー用のパーティステータス選択

function Window_CrystalStatus() {
    this.initialize(...arguments);
}

Window_CrystalStatus.prototype = Object.create(Window_MenuStatus.prototype);
Window_CrystalStatus.prototype.constructor = Window_CrystalStatus;

Window_CrystalStatus.prototype.maxCols = function(){
    return 2;
}

Window_CrystalStatus.prototype.lineHeight = function(){
    return this.innerHeight/7;
}

Window_CrystalStatus.prototype.drawItemStatus = function(index) {
    const actor = this.actor(index);
    const rect = this.itemRect(index);
    const x = rect.x;
    const y = rect.y;
    this.drawActorSimpleStatus(actor, x, y);
};

Window_CrystalStatus.prototype.drawActorSimpleStatus = function(actor, x, y) {
    const lineHeight = this.lineHeight();
    this.drawSvActor(actor.battlerName(), 10, x-this.padding, y);
    if(actor.crystal()){
        this.drawIcon($dataItems[actor.crystal()._id+249].iconIndex,x-this.padding+this.contents.fontSize*2.5, y+this.lineHeight()*1.5);
    }
    this.drawActorName(actor, x+this.contents.fontSize*2.5, y+this.contents.fontSize/2);
    this.changeTextColor(ColorManager.systemColor());
    this.drawText('Lv.', x+this.contents.fontSize*2.5, y+this.lineHeight());
    this.resetTextColor();
    this.drawText(actor.level, x+this.contents.fontSize*2.5, y+this.lineHeight(), 20, "right");
};

Window_CrystalStatus.prototype.drawItem = function(index) {
    this.drawItemStatus(index);
};

Window_CrystalStatus.prototype.itemRect = function(index) {
    const maxCols = this.maxCols();
    const itemWidth = this.innerWidth/2;
    const itemHeight = this.innerHeight/3;
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = col * itemWidth;
    const y = row * itemHeight;
    const width = itemWidth;
    const height = itemHeight;
    return new Rectangle(x, y, width, height);
};

Window_CrystalStatus.prototype.playOkSound = function() {
    SoundManager.playEquip();
};

//-----------------------------------------------------------------------------
// Window_CrystalMaterias
//
// クリスタルメニュー用のマテリアリスト用Window

function Window_CrystalMaterias() {
    this.initialize(...arguments);
}

Window_CrystalMaterias.prototype = Object.create(Window_ItemList.prototype);
Window_CrystalMaterias.prototype.constructor = Window_CrystalMaterias;

Window_CrystalMaterias.prototype.initialize = function(rect) {
    Window_ItemList.prototype.initialize.call(this, rect);
};

Window_CrystalMaterias.prototype.update = function(rect) {
    Window_ItemList.prototype.update.call(this, rect);
    this.updateCrystal();
    //this.makeItemList();
    this.drawItemAll();
    this.updateHelp();
};

Window_CrystalMaterias.prototype.refresh = function() {
    Window_ItemList.prototype.refresh.call(this);
};

Window_CrystalMaterias.prototype.setCrystalListWindow = function(crystalListWindow){
    this._crystalListWindow = crystalListWindow;
}

Window_CrystalMaterias.prototype.setHelpWindow = function(helpWindow){
    this._helpWindow = helpWindow;
    this.callUpdateHelp();
}

Window_CrystalMaterias.prototype.updateCrystal = function(){
    const item = this._crystalListWindow._data[this._crystalListWindow._index];
    if(item != null && (!this._crystal || item.id - 249 != this._crystal._id)){
        if(this._crystal){
            console.log(this._crystal._id);
        }
        console.log(this._crystal);
        console.log(item.id - 250);
        this._crystal = $gameCrystals._data[item.id - 250];
        this.makeItemList();
        this.deselect();
        console.log($gameCrystals._data);
        this.drawItemAll();
        this._index = 0;
    }
}

Window_CrystalMaterias.prototype.drawItemAll = function() {
    if(this._crystal){
        const abilities = this._crystal.abilities();
        this.contents.clear();
        for(let i = 0;i < abilities.length;i++){
            this.drawItem(i,abilities[i][0]);
            if(!this._crystal.isGainedMateria(abilities[i][0])){
                this.drawCost(i,abilities[i][1]);
            }else{
                const rect = this.itemLineRect(i);
                this.drawText("Completed!!", rect.x, rect.y, rect.width,"right");
            }
        }
    }
};

Window_CrystalMaterias.prototype.lineHeight = function() {
    return 12;
};

Window_CrystalMaterias.prototype.makeItemList = function() {
    this._data = [];
    if(this._crystal){
        const abilities = this._crystal.abilities()
        for(ability of abilities){
            this._data.push($dataArmors[ability[0]]);
        }
    }
};

Window_CrystalMaterias.prototype.drawItem = function(index,itemId) {
    if (this._crystal) {
        const item = $dataArmors[itemId];
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(this.isEnabled(index));
        this.drawItemName(item, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
    }
};

Window_CrystalMaterias.prototype.drawCost = function(index,cost) {
    const rect = this.itemLineRect(index);
    this.changePaintOpacity(1);
    this.changeTextColor(ColorManager.normalColor());
    this.drawText(cost, rect.x, rect.y, rect.width - this.textWidth(" AP"),"right");
    this.changeTextColor(ColorManager.systemColor());
    this.drawText("AP", rect.x, rect.y, rect.width,"right");
    this.changeTextColor(ColorManager.normalColor());
};

Window_CrystalMaterias.prototype.maxCols = function() {
    return 1;
};

Window_CrystalMaterias.prototype.processOk = function() {
    if (this.isCurrentItemEnabled()) {
        this.playOkSound();
        this.updateInputData();
        this.deactivate();
        this.callOkHandler();
    } else {
        this.playBuzzerSound();
    }
};

Window_CrystalMaterias.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.index());
};

Window_CrystalMaterias.prototype.isEnabled = function(index) {
	if(!this._crystal){
		return false;
	}
    const enoughAp = this._crystal._ap >= this._crystal.abilities()[index][1];
    const gettable = !this._crystal.isGainedMateria(this._crystal.abilities()[index][0]);
    return enoughAp && gettable;
};

Window_CrystalMaterias.prototype.setHelpWindow = function(helpWindow) {
    this._helpWindow = helpWindow;
    this.callUpdateHelp();
};

Window_CrystalMaterias.prototype.updateHelp = function() {
   if(this.isOpenAndActive()){    this.setHelpWindowItem($dataArmors[this._crystal.abilities()[this._index][0]]);
    }
};
//-----------------------------------------------------------------------------
// Window_CrystalApConsumeCheck
//
// クリスタルメニュー用のAP消費の最終確認


function Window_CrystalApConsumeCheck() {
    this.initialize(...arguments);
}

Window_CrystalApConsumeCheck.prototype = Object.create(Window_HorzCommand.prototype);
Window_CrystalApConsumeCheck.prototype.constructor = Window_CrystalApConsumeCheck;

Window_CrystalApConsumeCheck.prototype.initialize = function(rect) {
    Window_HorzCommand.prototype.initialize.call(this, rect);
    this.deactivate();
    this.hide();
    this._crystal = null;
    this._cost = 0;
    this._item = null;
};

Window_CrystalApConsumeCheck.prototype.update = function(rect) {
    Window_HorzCommand.prototype.update.call(this, rect);
    if(this._crystal){
        this.drawItem();   
    }
};

Window_CrystalApConsumeCheck.prototype.maxCols = function() {
    return 2;
};

Window_CrystalApConsumeCheck.prototype.makeCommandList = function() {
    this.addCommand("はい", "ok");
    this.addCommand("いいえ", "cancel");
};

Window_CrystalApConsumeCheck.prototype.drawItem = function(){
    if(!this._crystal){
        return;
    }
    this.contents.clear();
    var text = "";
    const crystalIcon = $dataItems[this._crystal._id+249].iconIndex;
    const crystalName = $dataItems[this._crystal._id+249].name;
    const materiaName = this._item.name;
    text = "\\C[16]\\I[" + crystalIcon + "]"+crystalName+"\\C[0]の\\C[16]AP\\C[0]"+this._cost+"と、";
    this.drawTextEx(text,0,this.lineHeight()*0.5,this.innerWidth,"center");
    text = "マテリア\\C[16]\\I[" + this._item.iconIndex + "]"+materiaName+"\\Cをこうかんします。"
    this.drawTextEx(text,0,this.lineHeight()*1.5,this.innerWidth,"center");
    this.drawText("よろしいですか？",0,this.lineHeight()*2.5,this.innerWidth,"center");
    this.drawText("はい",0,this.lineHeight()*4,this.innerWidth/2,"center");
    this.drawText("いいえ",this.innerWidth/2,this.lineHeight()*4,this.innerWidth/2,"center");
}

Window_CrystalApConsumeCheck.prototype.itemRect = function() {
    const rect = new Rectangle();
    rect.x = this.index()%2*this.innerWidth/2 + this.contents.fontSize*1.75;
    rect.y = this.contents.fontSize*4;
    rect.width = this.innerWidth/2 - this.contents.fontSize*3.5;
    rect.height = this.innerHeight;
    return rect;
};

Window_CrystalApConsumeCheck.prototype.playOkSound  = function() {
    AudioManager.playSe({"name":"FF8 levelup","volume":90,"pitch":100,"pan":0})
};