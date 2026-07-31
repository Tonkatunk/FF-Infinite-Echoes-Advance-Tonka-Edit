//=============================================================================
// FNG_History.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc 戦歴表示
  * @author finga
  * @help 戦歴表示
*/


function Scene_History() {
    this.initialize(...arguments);
}

Scene_History.prototype = Object.create(Scene_MenuBase.prototype);
Scene_History.prototype.constructor = Scene_History;

Scene_History.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHistoryWindow();
    this.createMenuNameWindow("War History");
    this.createCommandWindow();
};

Scene_History.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
};

Scene_History.prototype.createCommandWindow = function() {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_Command(rect);
    this._commandWindow.setHandler("cancel", this.popScene.bind(this));
    this._commandWindow.addCommand("back","cancel",true);
    this.addWindow(this._commandWindow);
};

Scene_History.prototype.commandWindowRect = function() {
    const width = this.mainFontSize()*6+this.mainFontSize()*5/4;
    const height = this.mainFontSize()*3;
    return new Rectangle(Graphics.boxWidth-width, Graphics.boxHeight-height, width,height);
};

Scene_History.prototype.createMenuNameWindow = function(name) {
    const width = this.mainFontSize()*6+this.mainFontSize()*5/4;
    const height = this.mainFontSize()*3;
    var rect = new Rectangle(Graphics.boxWidth-width, 0, width,height);
    this._menuNameWindow = new Window_MenuName(rect);
    this._menuNameWindow.drawMenuName(name);
    this.addWindow(this._menuNameWindow);
};

Scene_History.prototype.createHistoryWindow = function() {
    const rect = this.historyWindowRect();
    this._historyWindow = new Window_History(rect);
    this.addWindow(this._historyWindow);
    this._historyWindow.drawItem(0);
};

Scene_History.prototype.historyWindowRect = function() {
    const rect = new Rectangle();
    rect.x = 0;
    rect.y = 0;
    rect.height = Graphics.boxHeight;
    rect.width = Graphics.boxWidth;
    return rect;
};



function Window_History(rect) {
    this.initialize(...arguments);
}

Window_History.prototype = Object.create(Window_Base.prototype);
Window_History.prototype.constructor = Window_History;

Window_History.prototype.resetFontSettings = function() {    
    this.contents.fontFace = "rmmz-numberfont, " + $dataSystem.advanced.fallbackFonts;
    this.contents.fontSize = $TILE*5/8;
};

Window_History.prototype.lineHeight = function(text) {    
    return this.contents.fontSize/10*12;
};

Window_History.prototype.drawItem = function(page) {
    this.changeTextColor(ColorManager.textColor(3));
    this.drawText("Battles",$TILE/2,0);
    this.drawText("Wins",$TILE/2,this.lineHeight()*1);
    this.drawText("Fled",$TILE/2,this.lineHeight()*2);
    this.drawText("Enemies Slain",$TILE/2,this.lineHeight()*3);
    this.drawText("Total EXP",$TILE/2,this.lineHeight()*4);
    this.drawText("Total AP",$TILE/2,this.lineHeight()*5);
    this.drawText("Total Gil",$TILE/2,this.lineHeight()*6);
    this.drawText("EXP Boosted",$TILE/2,this.lineHeight()*7);
    this.drawText("AP Boosted",$TILE/2,this.lineHeight()*8);
    this.drawText("Gil Boosted",$TILE/2,this.lineHeight()*9);
    this.drawText("Playtime",$TILE/2,this.lineHeight()*10);
    this.changeTextColor(ColorManager.normalColor());
    this.drawText($gameSystem.battleCount() ,$TILE/2+$TILE*5,0);
    this.drawText($gameSystem.winCount() ,$TILE/2+$TILE*5,this.lineHeight());
    this.drawText($gameSystem.escapeCount() ,$TILE/2+$TILE*5,this.lineHeight()*2);
    this.drawText($gameSystem.beatCount(),$TILE/2+$TILE*5,this.lineHeight()*3);
    this.drawText($gameSystem.gainedExpCount(),$TILE/2+$TILE*5,this.lineHeight()*4);
    this.drawText($gameSystem.gainedApCount(),$TILE/2+$TILE*5,this.lineHeight()*5);
    this.drawText($gameSystem.gainedGoldCount(),$TILE/2+$TILE*5,this.lineHeight()*6);
    this.drawText($gameSystem.boostedExpCount(),$TILE/2+$TILE*5,this.lineHeight()*7);
    this.drawText($gameSystem.boostedApCount(),$TILE/2+$TILE*5,this.lineHeight()*8);
    this.drawText($gameSystem.boostedGoldCount(),$TILE/2+$TILE*5,this.lineHeight()*9);
    this.drawText($gameSystem.playtimeText() ,$TILE/2+$TILE*5,this.lineHeight()*10);
};

Game_System.prototype.beatCount = function() {
    if(!this._beatCount){
        this._beatCount = 0
    }
    return this._beatCount;
};

Game_System.prototype.addBeatCount = function(value) {
    if(!this._beatCount){
        this._beatCount = 0
    }
    this._beatCount += value;
};

Game_System.prototype.gainedExpCount = function() {
    if(!this._gainedExpCount){
        this._gainedExpCount = 0
    }
    return this._gainedExpCount;
};

Game_System.prototype.addGainedExpCount = function(value) {
    if(!this._gainedExpCount){
        this._gainedExpCount = 0
    }
    this._gainedExpCount += value;
};

Game_System.prototype.gainedApCount = function() {
    if(!this._gainedApCount){
        this._gainedApCount = 0
    }
    return this._gainedApCount;
};

Game_System.prototype.addGainedApCount = function(value) {
    if(!this._gainedApCount){
        this._gainedApCount = 0
    }
    this._gainedApCount += value;
};

BattleManager.gainGold = function() {
    const gold = this._rewards.gold;
    const boostRate = $gameParty.boostGoldRate();
    const boostedGold = Math.floor(gold*boostRate);
    $gameParty.gainGold(boostedGold);
    $gameSystem.addGainedGoldCount(boostedGold);
    $gameSystem.addBoostedGoldCount(boostedGold-gold);
};

Game_System.prototype.gainedGoldCount = function() {
    if(!this._gainedGoldCount){
        this._gainedGoldCount = 0
    }
    return this._gainedGoldCount;
};

Game_System.prototype.addGainedGoldCount = function(value) {
    if(!this._gainedGoldCount){
        this._gainedGoldCount = 0
    }
    this._gainedGoldCount += value;
};

Game_System.prototype.boostedExpCount = function() {
    if(!this._boostedExpCount){
        this._boostedExpCount = 0
    }
    return this._boostedExpCount;
};

Game_System.prototype.addBoostedExpCount = function(value) {
    if(!this._boostedExpCount){
        this._boostedExpCount = 0
    }
    this._boostedExpCount += value;
};

Game_System.prototype.boostedApCount = function() {
    if(!this._boostedApCount){
        this._boostedApCount = 0
    }
    return this._boostedApCount;
};

Game_System.prototype.addBoostedApCount = function(value) {
    if(!this._boostedApCount){
        this._boostedApCount = 0
    }
    this._boostedApCount += value;
};

Game_System.prototype.boostedGoldCount = function() {
    if(!this._boostedGoldCount){
        this._boostedGoldCount = 0
    }
    return this._boostedGoldCount;
};

Game_System.prototype.addBoostedGoldCount = function(value) {
    if(!this._boostedGoldCount){
        this._boostedGoldCount = 0
    }
    this._boostedGoldCount += value;
};