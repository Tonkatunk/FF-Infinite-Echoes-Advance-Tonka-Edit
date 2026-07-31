const _Scene_Menu_initialize = Scene_Menu.prototype.initialize;
Scene_Menu.prototype.initialize = function() {
    _Scene_Menu_initialize.apply(this,arguments);
    Scene_Menu.prototype.loadAllFaceImages();
};

Scene_Menu.prototype.loadAllFaceImages = function(){
    ImageManager.loadFace("Face1");
    ImageManager.loadFace("Face2");
    ImageManager.loadFace("Face3");
    ImageManager.loadFace("Face4");
    ImageManager.loadFace("Face5");
    ImageManager.loadFace("Face6");
    ImageManager.loadFace("Face7");
    ImageManager.loadFace("Face8");
}

Scene_MenuBase.prototype.createBackground = function() {
};

Scene_Menu.prototype.commandWindowRect = function() {
    const ww = this.mainCommandWidth();
    const wh = this.mainAreaHeight() - this.mainFontSize()*6;
    const wx = this.isRightInputMode() ? Graphics.boxWidth - ww: 0;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Menu.prototype.createGoldWindow = function() {
    const rect = this.goldWindowRect();
    this._goldWindow = new Window_MenuGold(rect);
    this.addWindow(this._goldWindow);
};

Scene_Menu.prototype.goldWindowRect = function() {
    const ww = this.mainCommandWidth();
    const wh = this.mainFontSize()*6;
    const wx = this.isRightInputMode() ? Graphics.boxWidth - ww: 0;
    const wy = this.mainAreaBottom() - wh;
    return new Rectangle(wx, wy, ww, wh);
};

const _scene_menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
    _scene_menu_createCommandWindow.apply(this,arguments);
    this._commandWindow.setHandler("crystal", this.commandCrystal.bind(this));
    this._commandWindow.setHandler("composition", this.commandComposition.bind(this));
    this._commandWindow.setHandler("book", this.commandBook.bind(this));
    this._commandWindow.setHandler("library", this.commandLibrary.bind(this));
    //commandWindow.setHandler("book", this.commandBook.bind(this));
};

Scene_Menu.prototype.commandLibrary = function() {
    SceneManager.push(Scene_Library);
};

Scene_Menu.prototype.commandCrystal = function() {
    SceneManager.push(Scene_Crystal);
};

Scene_Menu.prototype.commandComposition = function() {
    SceneManager.push(Scene_Composition);
};

Scene_Menu.prototype.commandBook = function() {
    SceneManager.push(Scene_EnemyBook);
};

Scene_Menu.prototype.createStatusWindow = function() {
    const rect = this.statusWindowRect();
    this._statusWindow = new Window_MenuStatus(rect);
    this.addWindow(this._statusWindow);
};

Scene_Menu.prototype.statusWindowRect = function() {
    const ww = Graphics.boxWidth - this.mainCommandWidth();
    const wh = this.mainAreaHeight();
    const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
};

Window_MenuCommand.prototype.itemRect = function(index) {
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
    return new Rectangle(x+this.contents.fontSize, y+this.contents.fontSize/4, width, height);
};

Window_MenuCommand.prototype.itemHeight = function() {
    return $TILE/2;
}

Window_MenuCommand.prototype.itemTextAlign = function() {
    return "left";
};

Window_MenuCommand.prototype.lineHeight = function() {
    return this.height / 11.5;
};

Window_MenuCommand.prototype.addOriginalCommands = function() {
    // 
    this.addCommand("Crystal", "crystal", true);
    this.addCommand("Synthesis", "composition", true);
    this.addCommand("Library", "library", true);
    this.addCommand("Bestiary", "book", true);
};

Window_MenuStatus.prototype.numVisibleRows = function() {
return 5;
};

Window_MenuStatus.prototype.drawItemStatus = function(index) {
    const actor = this.actor(index);
    const rect = this.itemRect(index);
    const x = rect.x + 52;
    const y = rect.y + Math.floor(rect.height / 2 - this.lineHeight() * 1.5);
    this.drawActorSimpleStatus(actor, x, y);
};

Window_MenuStatus.prototype.drawActorSimpleStatus = function(actor, x, y) {
    const lineHeight = this.lineHeight();
    const x2 = x + this.contents.fontSize*6;
    this.drawActorName(actor, x, y);
    this.drawActorIcons(actor, $TILE/4, y);
    
    this.changeTextColor(ColorManager.systemColor());
    this.drawText('Lv.', x2, y);
    this.drawText('JLv.', x2, y+ lineHeight * 1);
    this.resetTextColor();
    this.drawText(actor.level, x2, y, this.contents.fontSize*2.5, "right");
    this.drawIcon(58,x2+this.contents.fontSize*2.75, y- lineHeight * 0.5);
    this.drawIcon(59,x2+this.contents.fontSize*4.75, y- lineHeight * 0.5);
    this.drawIcon(60,x2+this.contents.fontSize*6.75, y- lineHeight * 0.5);
    this.placeGauge(actor, "tp", x2+this.contents.fontSize*1.5, y-16);
    if(actor.isJobMaster()){
        this.drawIcon(57,x2+this.contents.fontSize*2, y+ lineHeight * 0.5);
    }else{
        this.resetTextColor();
        this.drawText(actor.jLevel(), x2, y+ lineHeight * 1, this.contents.fontSize*3, "right");
        const text = '   ' + actor.currentAp()+'/'+actor.nextAp();
        this.drawText(text, x2, y+ lineHeight * 2);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText('AP', x2, y+ lineHeight * 2);
    }
    if(actor.crystal()){
        this.drawIcon($dataItems[actor.crystal()._id+249].iconIndex,x-this.contents.fontSize*1.5, y+this.lineHeight()*1.5);
    }
    this.drawActorHp(actor, x, y + lineHeight * 1, 4*12);
    this.drawActorMp(actor, x, y + lineHeight * 2, 4*12);
};

Window_StatusBase.prototype.drawActorIcons = function(actor, x, y, width) {
    width = width || 144;
    const iconWidth = $TILE*10/16;
    const icons = actor.allIcons().slice(0, Math.floor(width / iconWidth));
    let iconX = x;
    for (const icon of icons) {
        this.drawIcon(icon, iconX-$TILE/4, y-$TILE/4);
        iconX += iconWidth;
    }
};

// HPゲージを表示しない
Window_MenuStatus.prototype.drawActorHp = function(actor, x, y, width) {
    
    const text = actor.hp + '/' + actor.mhp;
    
    //ゲージは描画しない
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.hpA, x, y);
    this.resetTextColor();
    this.drawText(text, x, y,4*12,'right');
};

//MPゲージを表示しない
Window_MenuStatus.prototype.drawActorMp = function(actor, x, y, width) {    
    const text = actor.mp + '/' + actor.mmp;
    
    //ゲージは描画しない
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.mpA, x, y);
    this.resetTextColor();
    this.drawText(text, x, y,4*12,'right');
};

Window_MenuStatus.prototype.drawItemImage = function(index) {
    const actor = this.actor(index);
    const rect = this.itemRect(index);
    const width = ImageManager.faceWidth;
    const height = rect.height - 2;
    this.drawActorFace(actor, rect.x + 1, rect.y + 1, width, height);
};

//-----------------------------------------------------------------------------
// Window_StatusBase
//
// 
Window_StatusBase.prototype.drawActorFace = function(
    actor, x, y, width, height
) {
    var plusY = $dataActors[actor.actorId()].meta.facePlusY;
    if(!plusY){
        plusY = 0;
    }
    plusY = Number(plusY);
    if(!height){
        plusY = 0;
    }
    this.drawFaceEx(actor.faceName(), actor.faceIndex(), x, y, width, height,plusY);
};

//-----------------------------------------------------------------------------
// Window_MenuGold
//
// メニュー画面専用の所持金などを表示するウィンドウ。
// 所持金以外も表示するが、便宜上MenuGoldとする

function Window_MenuGold() {
    this.initialize(...arguments);
}

Window_MenuGold.prototype = Object.create(Window_Selectable.prototype);
Window_MenuGold.prototype.constructor = Window_MenuGold;

Window_MenuGold.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._locNameF = 0;
    this.refresh();
};

Window_MenuGold.prototype.colSpacing = function() {
    return 0;
};

Window_MenuGold.prototype.refresh = function() {
    const rect = this.itemLineRect(0);
    const x = rect.x;
    const y = rect.y;
    const width = rect.width;
    this.contents.clear();
    this.changeTextColor(this.systemColor());
    this.drawText('LOCATION', x, y+$DOT*2, width*2, 'left');
    this.drawText('TIME', x, y+this.lineHeight()*2+$DOT*2, width*2, 'left');
    this.resetTextColor();
    this.drawText($gameSystem.playtimeText(), x, y+this.lineHeight()*2+$DOT*2, width, 'right');
    this.changeTextColor(this.systemColor());
    this.drawText('ギル', x, y+this.lineHeight()*3+$DOT*2, width*2, 'left');
    this.resetTextColor();
    this.drawText($gameParty.gold(), x, y+this.lineHeight()*3+$DOT*2, width, 'right');
};

Window_MenuGold.prototype.update = function(){
    Window_Selectable.prototype.update.call(this);
    this.updateLocationName();
}

Window_MenuGold.prototype.updateLocationName = function() {
    const textWidth = this.textWidth($gameMap.displayName()+" ");
    const rect = this.itemLineRect(1);
    const x = rect.x;
    const y = rect.y;
    if(this._locNameF <= 0){
       this._locNameF = textWidth*4;
    }
    this.contents.clearRect(rect.x-$TILE/2, rect.y, rect.width+$TILE, rect.height+$DOT*2);
    this.drawText($gameMap.displayName()+" ", Math.floor(rect.x+this._locNameF/4), rect.y+$DOT*2, textWidth*2, 'left');
    this.drawText($gameMap.displayName()+" ", Math.floor(rect.x+this._locNameF/4)-textWidth, rect.y+$DOT*2, textWidth*2, 'left');
    this._locNameF--;
    
}

Window_MenuGold.prototype.value = function() {
    return $gameParty.gold();
};

Window_MenuGold.prototype.currencyUnit = function() {
    return TextManager.currencyUnit;
};

Window_MenuGold.prototype.open = function() {
    this.refresh();
    Window_Selectable.prototype.open.call(this);
};

//-----------------------------------------------------------------------------
// Sprite_Gauge
//
// ゲージの大きさ。
// ここは要調整

Sprite_Gauge.prototype.redraw = function() {
    this.bitmap.clear();
    const currentValue = this.currentValue();
    if (!isNaN(currentValue)) {
        this.drawGauge();
        /*if (this._statusType !== "time") {
            this.drawLabel();
            if (this.isValid()) {
                this.drawValue();
            }
        }*/
    }
};

Sprite_Gauge.prototype.bitmapWidth = function() {
    return 40;
};

Sprite_Gauge.prototype.bitmapHeight = function() {
    return 24;
};

Sprite_Gauge.prototype.gaugeHeight = function() {
    return 4;
};

Scene_GameEnd.prototype.commandWindowRect = function() {
    const ww = this.mainCommandWidth();
    const wh = $TILE*1.75;
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = (Graphics.boxHeight - wh) / 2;
    return new Rectangle(wx, wy, ww, wh);
};