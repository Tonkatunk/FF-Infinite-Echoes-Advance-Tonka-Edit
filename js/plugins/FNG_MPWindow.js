//=============================================================================
// FNG_MPWindow.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc バトル中に現在MPを表示するウィンドウを表示する
  * @author finga
  * @help バトル中に現在MPを表示するウィンドウを表示する
*/

function Window_Mp() {
    this.initialize(...arguments);
}

Window_Mp.prototype = Object.create(Window_Base.prototype);
Window_Mp.prototype.constructor = Window_Mp;

Window_Mp.prototype.initialize = function(sw) {
    this._skillWindow = sw;
    this._stypeId = sw._stypeId;
    const w = $TILE*2;
    const x = Graphics.boxWidth - w;
    const y = sw.y;
    const h = sw.height;
    const rect = new Rectangle(x,y,w,h);
    Window_Base.prototype.initialize.call(this, rect);
    this._actor = sw._actor;
    this.deactivate();
};

Window_Mp.prototype.update = function() {
    this.visible = this._skillWindow.visible;
    this.x = Graphics.boxWidth - this.width;
    this.y = this._skillWindow.y;
    this._actor = this._skillWindow._actor;
    if(!this._skill&&this._skillWindow&&this._skillWindow.item()){
        this._skill = this._skillWindow.item();
        this.refresh();
    }
    if(this._skill && this._skillWindow.item() && this._skill.id != this._skillWindow.item().id){
        this._skill = this._skillWindow.item();
        this.refresh();
    }
};

Window_Mp.prototype.refresh = function() {
    const skill = this._skill;
    if(!skill){
        return;
    }
    this.contents.clear();
    stypeId = skill.stypeId;
    this._actor = this._skillWindow._actor;
    if(stypeId == 14){
        this.drawIcon(58,0, this.lineHeight()/2);
        this.drawIcon(59,0, this.lineHeight()/2+$TILE/4+$DOT*2);
        this.drawIcon(60,$TILE, this.lineHeight()/2+$TILE/4+$DOT*2);
        this.drawText(this._actor.tp, 0, this.lineHeight()*2.5, this.innerWidth,"right");
    }else if(stypeId == 34){
        this.drawText("disabled", 0, this.lineHeight()/2, this.innerWidth,"center");
        this.drawText("after", 0, this.lineHeight()*1.5, this.innerWidth,"center");
        const itemNum = $gameParty.numItems($dataWeapons[skill.meta.bullet]);
        this.drawText(itemNum, 0, this.lineHeight()*3, this.innerWidth,"center");
    }else{
        this.drawText("ＭＰ", 0, this.lineHeight()/2, this.innerWidth,"center");
        this.drawText(this._actor.mp, 0, this.lineHeight()*2, this.innerWidth,"center");
        this.drawText("/"+this._actor.mmp, 0, this.lineHeight()*3, this.innerWidth,"center");
    }
};

const _Scene_Battle_createSkillWindow = Scene_Battle.prototype.createSkillWindow;
Scene_Battle.prototype.createSkillWindow = function() {
    _Scene_Battle_createSkillWindow.apply(this,arguments);
    this._mpWindow = new Window_Mp(this._skillWindow);
    this._skillWindow.setMpWindow(this._mpWindow);
    this._skillWindow.width -= this._mpWindow.width;
    this.addWindow(this._mpWindow);
};

Window_BattleSkill.prototype.itemRect = function(index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = col * itemWidth + colSpacing / 4 - this.scrollBaseX();
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
    const width = itemWidth - colSpacing/2;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};

Window_BattleSkill.prototype.setMpWindow = function(window) {
    this._mpWindow = window;
};

const _Window_BattleSkill_update = Window_BattleSkill.prototype.update;
Window_BattleSkill.prototype.update = function() {
    _Window_BattleSkill_update.apply(this,arguments);
    this._mpWindow.update();
};

const _Window_BattleSkill_refresh = Window_BattleSkill.prototype.refresh;
Window_BattleSkill.prototype.refresh = function() {
    _Window_BattleSkill_refresh.apply(this,arguments);
    if(this._skillWindow){
        this._skill = this._skillWindow.item();
    }
    this._mpWindow.refresh();
};
