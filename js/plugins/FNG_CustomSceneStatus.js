//=============================================================================
// FNG_CustomSceneStatus.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc ステータス画面をカスタムします
  * @author finga
  * @help ステータス画面をカスタムします
*/

const _Scene_Status_create = Scene_Status.prototype.create;
Scene_Status.prototype.create = function() {
    _Scene_Status_create.apply(this,arguments);
    this.createMenuNameWindow("Status");
    this.createCommandWindow();
};

Scene_Status.prototype.nextActor = function() {
    $gameParty.makeMenuActorNext();
    this.updateActor();
    this._commandWindow.setup(this._actor);
    this.onActorChange();
};

Scene_Status.prototype.previousActor = function() {
    $gameParty.makeMenuActorPrevious();
    this.updateActor();
    this._commandWindow.setup(this._actor);
    this.onActorChange();
};

Scene_Status.prototype.createCommandWindow = function() {
    var rect = new Rectangle(Graphics.boxWidth-this.mainFontSize()*8, this.mainFontSize()*5+$DOT*2, this.mainFontSize()*8,this.mainFontSize()*5+$DOT*14);
    this._commandWindow = new Window_StatusCommand(rect);
    this.addWindow(this._commandWindow);
    this._commandWindow.setup(this._actor);
    this._commandWindow.show();
};


Scene_Status.prototype.createMenuNameWindow = function(name) {
    var rect = new Rectangle(Graphics.boxWidth-this.mainFontSize()*7, 0, this.mainFontSize()*7,this.mainFontSize()*3);
    this._menuNameWindow = new Window_MenuName(rect);
    this._menuNameWindow.drawMenuName(name);
    this.addWindow(this._menuNameWindow);
};

Scene_Status.prototype.statusEquipWindowRect = function() {
    const wx = this._statusParamsWindow.width;
    const ww = Graphics.boxWidth - wx;
    const wh = $TILE*4;
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Status.prototype.statusWindowRect = function() {
    const wx = 0;
    const wy = this.mainAreaTop();
    const ww = Graphics.boxWidth;
    const wh = this.statusParamsWindowRect().y - wy;
    return new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight);
};

Scene_Status.prototype.statusParamsWindowRect = function() {
    const ww = $TILE*5+$TILE/8*5;
    const wx = 0;
    const wy = $TILE*3.75;
    const wh = Graphics.boxHeight-wy;
    return new Rectangle(wx, wy, ww, wh);
};

Window_Status.prototype.drawBlock1 = function() {
    const y = this.block1Y();

    this.drawActorFace(this._actor, 0, y);
    this.drawActorName(this._actor, $TILE*3, y+this.lineHeight(), $TILE*3);
    this.drawActorClass(this._actor, $TILE*6.5, y+this.lineHeight(), $TILE*3);
    this.changeTextColor(ColorManager.systemColor());
    this.drawText("Junction", 0,y+this.lineHeight()*5, $TILE*3.5);
    this.drawText("Commands", $TILE*10.75, y+this.lineHeight()*3, $TILE*2);
    this.drawText("Lv.", $TILE*3,y+this.lineHeight()*2);
    this.drawText("JLv.", $TILE*3,y+this.lineHeight()*3);
    this.changeTextColor(ColorManager.normalColor());
    this.drawText(this._actor._level, $TILE*3.75, y+this.lineHeight()*2,$TILE/2);
    this.drawActorHp(this._actor, $TILE*6.5, y+this.lineHeight()*3, this.contents.fontSize*10);
    this.drawActorMp(this._actor, $TILE*6.5, y+this.lineHeight()*4, this.contents.fontSize*10);
    this.drawIcon(58,$TILE*7.25, y+this.lineHeight()+$DOT*4);
    this.drawIcon(59,$TILE*8.25, y+this.lineHeight()+$DOT*4);
    this.drawIcon(60,$TILE*9.25, y+this.lineHeight()+$DOT*4);
    this.placeGauge(this._actor, "tp", $TILE*7, y+this.lineHeight()-$DOT*8);
    this.drawExpInfo($TILE*5.5,y+this.lineHeight()*6);
    if(this._actor.crystal()){
        this.drawIcon($dataItems[this._actor.crystal()._id+249].iconIndex,$TILE*4-$DOT*4, y+this.lineHeight()*5-$DOT*4);
        this.drawText($dataItems[this._actor.crystal()._id+249].name,$TILE*4.5,y+this.lineHeight()*5);
    }
    if(this._actor.isJobMaster()){
        this.drawIcon(57,$TILE*4,y+this.lineHeight()*2.5-2);
    }else{
        this.resetTextColor();
        this.drawText(this._actor.jLevel(), $TILE*4, y+this.lineHeight()*3, $TILE/2);
        const text = '   ' + this._actor.currentAp()+'/'+this._actor.nextAp();
        this.drawText(text, $TILE*3, y+this.lineHeight()*4);
        //this.changeTextColor(ColorManager.systemColor());
        this.changeTextColor(ColorManager.systemColor());
        this.drawText('AP', $TILE*3, y+this.lineHeight()*4);
        this.changeTextColor(ColorManager.normalColor());
    }
    //this.drawActorNickname(this._actor, 432, y, 270);
};

Window_Status.prototype.drawBlock2 = function() {
    const y = this.block2Y();
    //this.drawBasicInfo(204, y);
    //this.drawExpInfo(456, y);
};

// HPゲージを表示しない
Window_Status.prototype.drawActorHp = function(actor, x, y, width) {
    
    const text = actor.hp + '/' + actor.mhp;
    
    //ゲージは描画しない
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.hpA, x, y);
    this.resetTextColor();
    this.drawText(text, x, y,4*12,'right');
};

//MPゲージを表示しない
Window_Status.prototype.drawActorMp = function(actor, x, y, width) {    
    const text = actor.mp + '/' + actor.mmp;
    
    //ゲージは描画しない
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.mpA, x, y);
    this.resetTextColor();
    this.drawText(text, x, y,4*12,'right');
};

Window_Status.prototype.itemRect = function() {
    return new Rectangle(Graphics.boxWidth*2,Graphics.boxHeight*2,0,0);
};


Window_StatusParams.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        this.drawffParamItem(0, this.lineHeight()*0, 0);
        this.drawffParamItem(0, this.lineHeight()*1, 1);
        this.drawItem(0,this.lineHeight()*2,3);
        this.drawItem(0,this.lineHeight()*3,5);
        this.drawItem(0,this.lineHeight()*4,4);
        this.drawItem(0,this.lineHeight()*5,6);
        this.drawffParamItem(0, this.lineHeight()*6, 2);
        this.drawffParamItem(0, this.lineHeight()*7, 3);
        this.drawxParamItem(0, this.lineHeight()*8,0);
        this.drawxParamItem(0, this.lineHeight()*9,1);
    }
};
Window_StatusParams.prototype.drawItem = function(x,y,paramId) {
    const rect = new Rectangle(x,y,this.innerWidth,this.lineHeight);
    const name = TextManager.param(paramId);
    const value = this._actor.param(paramId);
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(name, rect.x, rect.y, 160);
    this.resetTextColor();
    this.drawText(value, rect.x, rect.y, rect.width, "right");
};

Window_StatusParams.prototype.drawffParamItem = function(x, y, paramId) {
    const paramX = this.paramX();
    const paramWidth = this.paramWidth();
    this.drawffParamName(x, y, paramId);
    this.changeTextColor(ColorManager.normalColor());
    this.drawText(this._actor.ffparam(paramId), x, y, this.innerWidth, "right");
};

Window_StatusParams.prototype.paramWidth = function() {
    return this.contents.fontSize*1.5;
};

Window_StatusParams.prototype.paramX = function() {
    const itemPadding = this.itemPadding();
    const paramWidth = this.paramWidth();
    return this.innerWidth - itemPadding - paramWidth * 2;
};

Window_StatusParams.prototype.drawffParamName = function(x, y, paramId) {
    var width = 0;
    var text = "";
    
    switch (paramId) {
        case 0:
            text = "Attack"
            width = this.contents.fontSize*7;
            break;
        case 1:
            return;
            break;
        case 2:
            text = "Strength"
            width = this.contents.fontSize*3;
            break;
        case 3:
            text = "Vitality"
            width = this.contents.fontSize*5;
            break;
    }
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(text, x, y, width);
};

Window_StatusParams.prototype.drawxParamItem = function(x, y, paramId) {
    this.drawxParamName(x, y, paramId);
    if (this._actor) {
        this.changeTextColor(ColorManager.normalColor());
        this.drawText(Math.round(this._actor.xparam(paramId)*100), x, y, this.innerWidth, "right");
    }
};

Window_StatusParams.prototype.drawCurrentxParam = function(x, y, paramId) {
    const paramWidth = this.paramWidth();
};

Window_StatusParams.prototype.drawxParamName = function(x, y, paramId) {
    var width = 0;
    var text = "";
    
    switch (paramId) {
        case 0:
            text = "Accuracy"
            width = this.contents.fontSize*7;
            break;
        case 1:
            text = "Evasion"
            width = this.contents.fontSize*5;
            break;
    }
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(text, x, y, width);
};

Window_StatusEquip.prototype.drawItem = function(index) {
    const rect = this.itemLineRect(index);
    const equips = this._actor.equips();
    const item = equips[index];
    const slotName = this.actorSlotName(this._actor, index);
    const sw = $TILE*2;
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(slotName, rect.x, rect.y, sw, rect.height);
    this.drawItemName(item, rect.x + sw, rect.y, rect.width - sw);
};

function Window_StatusCommand() {
    this.initialize(...arguments);
}

Window_StatusCommand.prototype = Object.create(Window_ActorCommand.prototype);
Window_StatusCommand.prototype.constructor = Window_StatusCommand;

Window_StatusCommand.prototype.initialize = function(rect) {
    Window_ActorCommand.prototype.initialize.call(this, rect);
    //this.openness = 0;
    this.deactivate();
};

Window_StatusCommand.prototype.setup = function(actor) {
    this._actor = actor;
    this.refresh();
    this.selectLast();
    this.activate();
    this.open();
};

Window_StatusCommand.prototype.resizeWindow = function() {

};

Window_StatusCommand.prototype.addAttackCommand = function() {
    this.addCommand(TextManager.attack, "attack", true);
};


Window_StatusCommand.prototype.addCommand = function(name,symbol,enable) {
    Window_Command.prototype.addCommand.call(this,name,symbol);
};

