//-----------------------------------------------------------------------------
// FNG_ActiveBattleMessage.js
//
// バトルを進行させながら表示させるメッセージ用のウィンドウ

function Window_ActiveBattleMessage() {
    this.initialize(...arguments);
}

Window_ActiveBattleMessage.prototype = Object.create(Window_Help.prototype);
Window_ActiveBattleMessage.prototype.constructor = Window_ActiveBattleMessage;

Window_ActiveBattleMessage.prototype.initialize = function() {
    const rect = new Rectangle(0,0,Graphics.boxWidth,$TILE*(22/16));
    Window_Help.prototype.initialize.call(this, rect);
    this.deactivate();
    this.visible = false;
    this._showTime = 0;
    this._setTime = 0;
    //テキストは23文字まで
};

Window_ActiveBattleMessage.prototype.refresh = function() {
    const rect = this.baseTextRect();
    rect.y += $DOT;
    this.contents.clear();
    this.drawTextEx(this._text, rect.x, rect.y, rect.width);
};

Window_ActiveBattleMessage.prototype.resetFontSettings = function() {
    this.contents.fontFace = "rmmz-numberfont, " + $dataSystem.advanced.fallbackFonts;
    this.contents.fontSize = $TILE*5/8;
    this.resetTextColor();
};

Window_ActiveBattleMessage.prototype.update = function() {
    const text = BattleManager.getActiveMessage();
    const setTime = BattleManager._setTime;
    if(text && this._showTime <= 0){
        this.setText(text);
        this._showTime = setTime;
        BattleManager._setTime = 0;
        this.visible = true;
        this.refresh();
    }else if(text){
        this._showTime -= 1;
    }
    if(text && this._showTime == 0){
        BattleManager.shiftActiveMessage();
        this.visible = false;
    }
};

const _scene_battle_createAllWindows4 = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
    _scene_battle_createAllWindows4.apply(this,arguments);
    this.createActiveBattleMessageWindow(); 
};

Scene_Battle.prototype.createActiveBattleMessageWindow = function() {
    const activeBattleMessageWindow = new Window_ActiveBattleMessage();
    this.addWindow(activeBattleMessageWindow);
    this._activeBattleMessageWindow = activeBattleMessageWindow;
};

BattleManager.pushActiveMessage = function(text,frame) {
    if(!this._activeMessages.includes(text)){
        this._activeMessages.push(text);
        if(frame > 0){
            this._setTime = frame
        }else{
            this._setTime = 60
        }
    }
}

BattleManager.getActiveMessage = function() {
    if(this._activeMessages.length > 0){
        return this._activeMessages[0];
    }
}

BattleManager.shiftActiveMessage = function() {
    this._activeMessages.shift();
}

const _battleManager_initMembers2 = BattleManager.initMembers;
BattleManager.initMembers = function() {
    _battleManager_initMembers2.apply(this,arguments);
    this._activeMessages = [];
};
