//-----------------------------------------------------------------------------
// FNG_BattleLayout.js
//
// バトル画面のレイアウトを変更する

//-----------------------------------------------------------------------------
// Scene_Battle
//
// ・ステータスウィンドウの大きさ、表示位置を変更
// ・コマンドウィンドウの大きさ、表示位置を変更

const _scene_battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
    this.createEnemyNameWindow();
    this.createInfoSpriteWindow();
    _scene_battle_createAllWindows.apply(this,arguments);
};

Scene_Battle.prototype.createEnemyNameWindow = function() {
    const rect = this.enemyNameWindowRect();
    const enemyNameWindow = new Window_EnemyName(rect);
    this.addWindow(enemyNameWindow);
    this._enemyNameWindow = enemyNameWindow;
};

Scene_Battle.prototype.enemyNameWindowRect = function() {
    const ww = Graphics.boxWidth - (Graphics.boxWidth - this.mainFontSize()*12.5);
    const wh = this.windowAreaHeight();
    const wx = 0;
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.createInfoSpriteWindow = function() {
    const rect = this.infoSpriteWindowRect();
    const infoSpriteWindow = new Window_BattleInfoSprite(rect);
    this.addWindow(infoSpriteWindow);
    this._infoSpriteWindow = infoSpriteWindow;
    BattleManager.setInfoSpriteWindow(this._infoSpriteWindow)
};

BattleManager.setInfoSpriteWindow = function(window){
    this._infoSpriteWindow = window
}

BattleManager.infoSpriteWindow = function(){
    return this._infoSpriteWindow;
}

Scene_Battle.prototype.infoSpriteWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight-this.windowAreaHeight();
    const wx = 0;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.windowAreaHeight = function() {
    return Graphics.boxHeight * 5/16;
};

Scene_Battle.prototype.statusWindowRect = function() {
    const extra = 10;
    const ww = Graphics.boxWidth - this.mainFontSize()*12.5;
    const wh = this.windowAreaHeight();
    const wx = Graphics.boxWidth - ww;
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.actorCommandWindowRect = function() {
    const ww = this.mainFontSize()*14.5;
    const wh = this.windowAreaHeight();
    const wx = Graphics.boxWidth - (Graphics.boxWidth - this.mainFontSize()*12.5)-ww;
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.startPartyCommandSelection = function() {
    this._statusWindow.deselect();
    //this._statusWindow.show();
    this._actorCommandWindow.setup(null);
    this._actorCommandWindow.close();
    this._partyCommandWindow.setup();
};

const _Scene_Battle_createDisplayObjects = Scene_Battle.prototype.createDisplayObjects;
Scene_Battle.prototype.createDisplayObjects = function() {
    _Scene_Battle_createDisplayObjects.apply(this,arguments);
    BattleManager.setStatusWindow(this._statusWindow);
};

//-----------------------------------------------------------------------------
// BattleManager
//
// ステータスウィンドウにアクセスできるようにする

BattleManager.setStatusWindow = function(statusWindow){
    this._statusWindow = statusWindow;
}

const _BattleManager_endAction = BattleManager.endAction;
BattleManager.endAction = function() {
    _BattleManager_endAction.apply(this,arguments);
    //行動が終了後、ステータスウィンドウを更新
    for(let i = 0 ;i < $gameParty.members().length;i++){
        this._statusWindow.drawItemStatus(i);
    }
};

//-----------------------------------------------------------------------------
// Sprite_Actor
//
// ・ホームポジションの変更
Sprite_Actor.prototype.setActorHome = function(index) {
    const x = this.homeX(index);
    const y = this.homeY(index);
    this.setHome(x, y);
};

Sprite_Actor.prototype.homeX = function(index) {
    var x = Math.floor(Graphics.boxWidth*3/4 + index * 8);
    if($gameSwitches.value(191)){
        x = Math.floor(Graphics.boxWidth*3/4 + 4 * 8);
    } //アトモスバトル
    //捕らわれ状態だと対象の座標へ
    if(this._actor.isStateAffected(62)){
        return this._actor.shokusher().x+$TILE;
    }
    //踏み込み状態だと前へ
    if(this._actor.isStateAffected(31)){
        x -= 2;
    }
    //後列状態だと後ろへ
    if(this._actor.isStateAffected(33)){
        x += $TILE;
    }
    if(this._actor.coverPerforming()){
        x = Math.floor(Graphics.boxWidth*3/4 + this._actor.coveringIndex() * 8)-$TILE;
    }
    if(this._actor.attractedX()){
        x -= this._actor.attractedX();
    }
    return x;
};

Sprite_Actor.prototype.homeY = function(index) {
    //捕らわれ状態だと対象の座標へ
    if(this._actor.isStateAffected(62)){
        return this._actor.shokusher().y - $TILE*1.5;
    }
    var y = Math.floor(Graphics.boxHeight*93/160 + index * 12);
    if(this._actor.coverPerforming()){
        y = Math.floor(Graphics.boxHeight*93/160 + this._actor.coveringIndex() * 12);
    }
    //浮遊状態の高さを反映
    if(this._actor.isStateAffected(38)){
        if(!this._floatFrame || this._floatFrame <= 0){
            this._floatFrame = 3600;
        }else{
            this._floatFrame--;
        }
        height = Math.sin(this._floatFrame/10)*2+4;
        y -= height;
    }
    
    return y;
};

const _Sprite_Actor_updateShadow = Sprite_Actor.prototype.updateShadow;
Sprite_Actor.prototype.updateShadow = function() {
    _Sprite_Actor_updateShadow.apply(this, arguments);

    this._shadowSprite.scale.x = 0.8;
    this._shadowSprite.scale.y = 0.8;
    //浮遊状態の高さを反映
    if(this._actor&&this._actor.isStateAffected(38)&&this._floatFrame){
        height = Math.sin(this._floatFrame/10)*2+4;
        this._shadowSprite.y += height;
        this._shadowSprite.scale.x = 0.8 - (height/4)*0.1;
        this._shadowSprite.scale.y = 0.8 - (height/4)*0.1;
    }
    this._shadowSprite.opacity = this._mainSprite.opacity/2;
};

const _Sprite_Enemy_updateShadow = Sprite_Enemy.prototype.updateShadow;
Sprite_Enemy.prototype.updateShadow = function() {
    _Sprite_Enemy_updateShadow.apply(this, arguments);
    if(!this.floatHeight&&this._enemy&&this._enemy.isStateAffected(38)){
        this.floatHeight = -this.height/20;
        this._shadowSprite.opacity = this.opacity/2;
    }
    if(this._shadowSprite){
        const baseScale = this.width / (this._shadowSprite.width - 8)
        this._shadowSprite.y = this._homeY + (this.height / 20) * -1;
        this._shadowSprite.scale.x = baseScale;
        this._shadowSprite.scale.y = baseScale;
    }
    if(this._shadowSprite&&this._enemy&&this._enemy.isStateAffected(38)){
        const baseScale = this.width / (this._shadowSprite.width - 8)
        height = this._homeY+4 - this.y;
        this._shadowSprite.scale.x = baseScale - (height/4)*0.1;
        this._shadowSprite.scale.y = baseScale - (height/4)*0.1;
    }
    //this._shadowSprite.opacity = this.opacity/2;
};

//-----------------------------------------------------------------------------
// Window_ActorCommand
//
// itemrectを変更

Window_ActorCommand.prototype.itemRect = function(index) {
    const w = this.innerWidth-$TILE/2;
    const h = $TILE/2;
    const x = $TILE/2;
    const y = index*h;
    return new Rectangle(x,y,w,h);
};

Window_ActorCommand.prototype.itemTextAlign = function() {
    return "left";
};

Window_ActorCommand.prototype.lineHeight = function() {
    return Math.floor(this.innerHeight/5);
};

//-----------------------------------------------------------------------------
// Window_BattleLog
//
// ステータスウィンドウにアクセスできるようにする

Window_BattleLog.prototype.setStatusWindow = function(statusWindow){
    this._statusWindow = statusWindow;
}

//-----------------------------------------------------------------------------
// Window_BattleStatus
//
// レイアウトの大幅変更

Window_BattleStatus.prototype.initialize = function(rect) {
    Window_StatusBase.prototype.initialize.call(this, rect);
    this.openness = 0;
    this._bitmapsReady = 0;
    this.preparePartyRefresh();
    this.visible = true;
};

Window_BattleStatus.prototype.lineHeight = function(rect) {
    return this.innerHeight/5;
};

//顔グラは使用しない
Window_BattleStatus.prototype.drawItem = function(index) {
    //this.drawItemImage(index);
    this.drawItemStatus(index);
};

//顔グラは使用しない
Window_BattleStatus.prototype.itemRect = function(index) {
    const w = this.innerWidth;
    const h = Math.floor(this.innerHeight/5);
    const x = 0;
    const y = h*index+1;
    return new Rectangle(x,y,w,h);
};

Window_BattleStatus.prototype.drawItemStatus = function(index) {
    const actor = this.actor(index);
    const rect = this.itemRect(index);
    this.contents.clearRect(rect.x,rect.y,rect.width,rect.height);
    const nameX = this.nameX(rect);
    const nameY = this.nameY(rect);
    //const stateIconX = this.stateIconX(rect);
    //const stateIconY = this.stateIconY(rect);
    //const basicGaugesX = this.basicGaugesX(rect);
    //const basicGaugesY = this.basicGaugesY(rect);
    this.placeTimeGauge(actor, nameX+this.contents.fontSize*13, nameY);
    this.placeStateGauge(actor, nameX+this.contents.fontSize*13, nameY);
    this.drawActorHp(actor, nameX+this.contents.fontSize*6, nameY);
    this.drawActorMp(actor, nameX+this.contents.fontSize*11, nameY);
    this.drawActorName(actor, nameX, nameY);
    //this.placeStateIcon(actor, stateIconX, stateIconY);
    //this.placeBasicGauges(actor, basicGaugesX, basicGaugesY);
    this.placeGauge(actor, "tp", nameX+this.contents.fontSize*13, nameY+4);
};

Window_BattleStatus.prototype.nameY = function(rect) {
    return rect.y;
};

Window_BattleStatus.prototype.drawActorName = function(actor, x, y) {
    this.changeTextColor(ColorManager.normalColor());
    this.changePaintOpacity(actor.isSelectable());
    this.drawText(actor.name(), x, y, this.contents.fontSize*6);
    this.changePaintOpacity(true);
};

Window_BattleStatus.prototype.updateArrows = function() {
    this.downArrowVisible = false;
    this.upArrowVisible = false;
};

// HPゲージを表示しない
Window_BattleStatus.prototype.drawActorHp = function(actor, x, y, width) {    
    //ゲージは描画しない
    this.resetTextColor();
    this.drawText(actor.hp, x, y,this.contents.fontSize*2,'right');
    this.drawText("/", x+this.contents.fontSize*2, y,this.contents.fontSize/2,'right');
    this.drawText(actor.mhp, x+this.contents.fontSize*2.5, y,this.contents.fontSize*2,'right');
};

//MPゲージを表示しない
Window_BattleStatus.prototype.drawActorMp = function(actor, x, y, width) { 
    //ゲージは描画しない
    this.resetTextColor();
    this.drawText(actor.mp, x, y,this.contents.fontSize*1.5,'right');
};

Window_BattleStatus.prototype.placeGauge = function(actor, type, x, y,hide) {
    const key = "actor%1-gauge-%2".format(actor.actorId(), type);
    const sprite = this.createInnerSprite(key, Sprite_Gauge);
    sprite.setup(actor, type);
    sprite.move(x-this.contents.fontSize*1.75, y-20);
    sprite.show();
};

Window_BattleStatus.prototype.placeStateGauge = function(actor, x, y) {
    //睡眠ゲージ
    if(actor.isStateAffected(10)){
        this.placeGauge(actor,"sleep",x,y);
    }
    //麻痺ゲージ
    if(actor.isStateAffected(12)){
        this.placeGauge(actor,"parailysis",x,y);
    }
    //ストップゲージ
    if(actor.isStateAffected(37)){
        this.placeGauge(actor,"stop",x,y);
    }
};

Window_BattleStatus.prototype.maxCols = function() {
    return 5;
};

Window_BattleStatus.prototype.isCurrentItemEnabled = function(){
    const actor = this.actor(this._index);
	return actor.isSelectable();
};

const _Sprite_Gauge_currentValue = Sprite_Gauge.prototype.currentValue;
Sprite_Gauge.prototype.currentValue = function() {
    if(!_Sprite_Gauge_currentValue.apply(this,arguments)){
        if (this._battler) {
            switch (this._statusType) {
                case "sleep":
                    return this._battler.sleepCount();
                case "parailysis":
                    return this._battler.parailysisCount();
                case "stop":
                    return this._battler.stopCount();
            }
        }        
    }
    return _Sprite_Gauge_currentValue.apply(this,arguments);
};

const _Sprite_Gauge_currentMaxValue = Sprite_Gauge.prototype.currentMaxValue;
Sprite_Gauge.prototype.currentMaxValue = function() {
    if(!_Sprite_Gauge_currentMaxValue.apply(this,arguments)){
        if (this._battler) {
            switch (this._statusType) {
                case "sleep":
                    return 180;
                case "parailysis":
                    return 120;
                case "stop":
                    return 120;
            }
        }        
    }
    return _Sprite_Gauge_currentMaxValue.apply(this,arguments);
};

const _sprite_Gauge_gaugeColor1 = Sprite_Gauge.prototype.gaugeColor1;
Sprite_Gauge.prototype.gaugeColor1 = function() {
    switch (this._statusType) {
        case "sleep":
            return ColorManager.textColor(16);
        case "parailysis":
            return ColorManager.textColor(6);
        case "stop":
            return ColorManager.textColor(2);
    }
    return _sprite_Gauge_gaugeColor1.apply(this,arguments);
};

const _sprite_Gauge_gaugeColor2 = Sprite_Gauge.prototype.gaugeColor2;
Sprite_Gauge.prototype.gaugeColor2 = function() {
    switch (this._statusType) {
        case "sleep":
            return ColorManager.textColor(16);
        case "parailysis":
            return ColorManager.textColor(6);
        case "stop":
            return ColorManager.textColor(27);
    }
    return _sprite_Gauge_gaugeColor2.apply(this,arguments);
};

//-----------------------------------------------------------------------------
// Window_EnemyName
//
// バトル中の生存しているモンスター一覧を表示する

function Window_EnemyName(rect) {
    this.initialize(...arguments);
}

Window_EnemyName.prototype = Object.create(Window_Base.prototype);
Window_EnemyName.prototype.constructor = Window_EnemyName;

Window_EnemyName.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._enemies = [];
};

Window_EnemyName.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if(this.isNeedRefresh()){
        this.refresh();
    }    
};

Window_EnemyName.prototype.enemy = function(index) {
    return $gameTroop.aliveMembers()[index];
};

Window_EnemyName.prototype.enemies = function() {
    return this._enemies;
};

Window_EnemyName.prototype.isNeedRefresh = function(index) {
    if($gameTroop.isSomeoneTransformed()){
        $gameTroop.setSomeoneTransformed(false);
        this._enemies = $gameTroop.aliveMembers();
        return true;
    }
    if(this.enemies().length != $gameTroop.aliveMembers().length){
        this._enemies = $gameTroop.aliveMembers();
        return true;
    }
    return false;
};

// 敵が変身した時も名前一覧を更新する
Game_Interpreter.prototype.command336 = function(params) {
    this.iterateEnemyIndex(params[0], enemy => {
        enemy.transform(params[1]);
        $gameTroop.makeUniqueNames();
        $gameTroop.setSomeoneTransformed(true);
    });
    return true;
};

Game_Troop.prototype.setSomeoneTransformed = function(value){
    this._transFromed = value;
}

Game_Troop.prototype.isSomeoneTransformed = function(){
    return this._transFromed;
}

Window_EnemyName.prototype.refresh = function() {
    const enemies = $gameTroop.aliveMembers();
    this._enemies = enemies.filter(enemy => !enemy.enemy().meta.cantSelect);
    this.contents.clear();
    this.drawNameList();
};

Window_EnemyName.prototype.nameList = function() {
    var list = [];
    for(let i = 0;i<this.enemies().length;i++){
        if(!list.includes($dataEnemies[this.enemies()[i].enemyId()].name)){
            list.push($dataEnemies[this.enemies()[i].enemyId()].name);
        }
    }
    return list;
};

Window_EnemyName.prototype.itemRect = function(index) {
    const w = this.innerWidth;
    const h = Math.floor(this.innerHeight/5);
    const x = 0;
    const y = h*index;
    return new Rectangle(x,y,w,h);
};

Window_EnemyName.prototype.drawNameList = function() {
    for(let i = 0;i<this.nameList().length;i++){
        const rect = this.itemRect(i);
        this.drawText(this.nameList()[i],rect.x,rect.y,rect.width);
        this.drawText(this.amount(this.nameList()[i]),rect.x,rect.y,rect.width,"right");        
    }
};

Window_EnemyName.prototype.amount = function(name) {
    var count = 0;
    for(var i = 0; i < this._enemies.length;i++){
        //console.log(this._enemies[i].enemyId());
        if($dataEnemies[this.enemies()[i].enemyId()].name == name){
             count++;
        }           
    }
    return count;
};
//-----------------------------------------------------------------------------
// Sprite_Gauge
//
// ゲージの長さを調整

Sprite_Gauge.prototype.gaugeX = function() {
    return this.measureLabelWidth() + 6;
};

Sprite_Battleback.prototype.adjustPosition = function() {
    this.width = 240;
    this.height = 208
    this.scale.x = 1;
    this.scale.y = 1;
};

//-----------------------------------------------------------------------------
// Window_BattleSkill
//
// ヘルプウィンドウをデフォルトで非表示

Window_BattleSkill.prototype.show = function() {
    this.selectLast();
    //this.showHelpWindow();
    Window_SkillList.prototype.show.call(this);
};

//-----------------------------------------------------------------------------
// Window_BattleItem
//
// ヘルプウィンドウをデフォルトで非表示

Window_BattleItem.prototype.show = function() {
    this.selectLast();
    //this.showHelpWindow();
    Window_ItemList.prototype.show.call(this);
};

//-----------------------------------------------------------------------------
// Scene_Battle
//
// ヘルプウィンドウのサイズを変更

Scene_Battle.prototype.helpWindowRect = function() {
    const wx = 0;
    const wy = 0;
    const ww = Graphics.boxWidth;
    const wh = this.mainFontSize()*3.75;
    return new Rectangle(wx, wy, ww, wh);
};

//-----------------------------------------------------------------------------
// Game_Battler
//
// Z座標にmetaから補正をつける

/**
* ●アクション開始
*/
const _Game_Battler_performActionStart = Game_Battler.prototype.performActionStart;
Game_Battler.prototype.performActionStart = function(action) {
    _Game_Battler_performActionStart.apply(this, arguments);

    // 行動開始前のＺ座標に補正
    const battlerSprites = BattleManager._spriteset.battlerSprites();
    for (const sprite of battlerSprites) {
        // 存在しない場合は無視
        if (!sprite._battler||!sprite._battler.isEnemy()||!sprite._battler.enemy().meta.zPlus) {
            continue;
        }
        sprite.z += Number(sprite._battler.enemy().meta.zPlus);
    }
};

const _Game_Battler_performActionEnd = Game_Battler.prototype.performActionEnd;
Game_Battler.prototype.performActionEnd = function() {
    _Game_Battler_performActionEnd.call(this);

    // 初期化されたZ座標から補正
    const battlerSprites = BattleManager._spriteset.battlerSprites();
    for (const sprite of battlerSprites) {
        // 存在しない場合は無視
        if (!sprite._battler||!sprite._battler.isEnemy()||!sprite._battler.enemy().meta.zPlus) {
            continue;
        }
        sprite.z += Number(sprite._battler.enemy().meta.zPlus);
    }
};

var _Sprite_Battler_initialize = Sprite_Battler.prototype.initialize;
Sprite_Battler.prototype.initialize = function(battler) {
    _Sprite_Battler_initialize.apply(this, arguments);
    
    // Ｚ座標の設定
    if(battler&&battler.isEnemy()&&battler.enemy().meta.zPlus){
        this.z += Number(battler.enemy().meta.zPlus);
    }
};

//-----------------------------------------------------------------------------
// Window_BattleInfoSprite
//
// 選択中のカーソルや敵のゲージを表示するウィンドウ

function Window_BattleInfoSprite(rect) {
    this.initialize(...arguments);
}

Window_BattleInfoSprite.prototype = Object.create(Window_Base.prototype);
Window_BattleInfoSprite.prototype.constructor = Window_BattleInfoSprite;

Window_BattleInfoSprite.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.createCursorSprites();
    this._gaugeSprites = [];
    this.opacity = 0;
};

Window_BattleInfoSprite.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.updateCursorSprites();
    this.updateTimeGauges();
};

Window_BattleInfoSprite.prototype.createCursorSprites = function() {
    this._cursorL = [];
    for(let i = 0;i<9;i++){
        const cursorSprite = new Sprite();
        cursorSprite.bitmap = ImageManager.loadPicture("CursorL");
        this.addChild(cursorSprite);
        cursorSprite.anchor.x = 1/16;
        cursorSprite.anchor.y = 4/16;
        cursorSprite.visible = false;
        this._cursorL.push(cursorSprite);
    }
    this._cursorR = [];
    for(let i = 0;i<5;i++){
        const cursorSprite = new Sprite();
        cursorSprite.bitmap = ImageManager.loadPicture("Cursor");
        this.addChild(cursorSprite);
        cursorSprite.anchor.x = 15/16;
        cursorSprite.anchor.y = 4/16;
        cursorSprite.visible = false;
        this._cursorR.push(cursorSprite);
    }
};

Window_BattleInfoSprite.prototype.updateCursorSprites = function() {
    if(BattleManager.enemyWindow().active){
        if(BattleManager.isAllEnemySelecting()){
            for(let i=0;i<BattleManager.enemyWindow().enemies().length && i<9;i++){
                const enemy = BattleManager.enemyWindow().enemies()[i];
                this._cursorL[i].visible = true;
                this._cursorL[i].x = enemy.x+enemy.width/2;
                this._cursorL[i].y = enemy.y-36-enemy.height/2;
                this._cursorL[i].opacity = 127;
            }
        }else{
            if(this._cursorL[1].visible){
                for(sprite of this._cursorL){
                    sprite.visible = false;
                }
            }
            const enemy = BattleManager.enemyWindow().enemy();
            if(enemy){
                this._cursorL[0].visible = true;
                this._cursorL[0].x = enemy.x+enemy.width/2;
                this._cursorL[0].y = enemy.y-36-enemy.height/2;
                this._cursorL[0].opacity = 255;
            }
        }
    }else{
        if(this._cursorL[0].visible){
            for(sprite of this._cursorL){
                sprite.visible = false;
            }
        }
    }
    if(BattleManager.actorWindow().active){
        if(BattleManager.isAllActorSelecting()){
            for(let i=0;i<$gameParty.battleMembers().length && i<5;i++){
                const actor = $gameParty.battleMembers()[i];
                this._cursorR[i].visible = true;
                this._cursorR[i].x = actor.x-actor.width/2+7;
                this._cursorR[i].y = actor.y-36-actor.height/4;
                this._cursorR[i].opacity = 127;
            }
        }else{
            if(this._cursorR[1].visible){
                for(sprite of this._cursorR){
                    sprite.visible = false;
                }
            }
            const actor = BattleManager.actorWindow().actor(BattleManager.actorWindow().index());
            if(actor){
                this._cursorR[0].visible = true;
                this._cursorR[0].x = actor.x-actor.width/2+7;
                this._cursorR[0].y = actor.y-36-actor.height/4;
                this._cursorR[0].opacity = 255;
            }
        }
    }else{
        if(this._cursorR[0].visible){
            for(sprite of this._cursorR){
                sprite.visible = false;
            }
        }
    }
};

Window_BattleInfoSprite.prototype.updateTimeGauges = function() {
    for(let i=0;i<BattleManager.enemyWindow().enemies().length;i++){
        const enemy = BattleManager.enemyWindow().enemies()[i];
        if(!enemy.gaugeSprite()){
            enemy.setupGaugeSprite();
            const gaugeSprite = enemy.gaugeSprite();
            this.addChild(gaugeSprite);
            this._gaugeSprites.push(gaugeSprite);
        }
    }
    for(gaugeSprite of this._gaugeSprites){
        const enemy = gaugeSprite._battler;
        const plusX = enemy.enemy().meta.gaugeX ? enemy.enemy().meta.gaugeX : 0;
        const plusY = enemy.enemy().meta.gaugeY ? enemy.enemy().meta.gaugeY : 0;
        gaugeSprite.visible = !enemy.cantSelect() && enemy.isAlive();
        gaugeSprite.x = enemy.x-8+Number(plusX);
        gaugeSprite.y = enemy.y-32-enemy.height+Number(plusY);
    }
};

//-----------------------------------------------------------------------------
// Game_Enemy
//
// ・hasGaugeSprite 

Game_Enemy.prototype.gaugeSprite = function(){
    return this._gaugeSprite;
}

Game_Enemy.prototype.setupGaugeSprite = function(){
	this._gaugeSprite = new Sprite_Gauge();
	this._gaugeSprite.setup(this, "time");
    
    this._gaugeSprite.anchor.x = 0.5;
    this._gaugeSprite.anchor.y = 1;
}