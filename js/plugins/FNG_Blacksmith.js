//=============================================================================
// FNG_Blacksmith.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc 鉱物アイテムとそれに対応した装備品を交換するショップを作成します
  * @author finga
  * @help 鉱物アイテムとそれに対応した装備品を交換するショップを作成します
*/

//-----------------------------------------------------------------------------
// Scene_Blacksmith
//
// 鍛冶屋のシーン

function Scene_Blacksmith() {
    this.initialize(...arguments);
}

Scene_Blacksmith.prototype = Object.create(Scene_Shop.prototype);
Scene_Blacksmith.prototype.constructor = Scene_Blacksmith;

Scene_Blacksmith.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createDummyWindow();
    this.createHelpWindow();
    this.createMenuNameWindow();
    this.createStatusWindow();
    this.createMineralsWindow();
    //ゴールドウィンドウはない
    //this.createGoldWindow();
    this.createBlacksmithWindow();
    this._mineralId = this._mineralsWindow.itemAt(this._mineralsWindow.index()).id;
    //コマンドウィンドウはない
    //this.createCommandWindow();
    this.createActorsWindow();
    this._blacksmithWindow.setActorsWindow(this._actorsWindow);
    this.createCompositionWindow();
    //カテゴリウィンドウは不要
    //this.createCategoryWindow();
    //売却も不要
    //this.createSellWindow();
};

Scene_Blacksmith.prototype.createCompositionWindow = function() {
    const rect = new Rectangle(0,0,Graphics.boxWidth-this._menuNameWindow.width,this._menuNameWindow.height);
    this._compositionWindow = new Window_Composition(rect);
    this._compositionWindow.setHandler("make",this.commandMake.bind(this));
    this._compositionWindow.setHandler("cancel", this.onCompositionCancel.bind(this));
    this._compositionWindow.setHandler("pageup", this.onCompositionPageup.bind(this));
    this._compositionWindow.setHandler("pagedown", this.onCompositionPagedown.bind(this));   
    this._compositionWindow.hide();
    this.addWindow(this._compositionWindow);
};

Scene_Blacksmith.prototype.onCompositionPageup = function(){
    this._statusWindow.changePage();
    this._compositionWindow.activate();
}
Scene_Blacksmith.prototype.onCompositionPagedown = function(){
    this._statusWindow.changeBackPage();
    this._compositionWindow.activate();
}

Scene_Blacksmith.prototype.commandMake = function() {
    if(this._compositionWindow.enable()){
        $gameParty.gainItem(this._item, 1);
        $gameParty.loseItem(this._mineralsWindow.itemAt(this._mineralsWindow.index()), 1);
        this._blacksmithWindow.refresh();
        this._mineralsWindow.refresh();
        this.onCompositionCancel();
    }else{
        this._compositionWindow.activate();
    }
};

Scene_Blacksmith.prototype.statusWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight - this._menuNameWindow.height;
    const wx = 0;
    const wy = this._menuNameWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Blacksmith.prototype.onCompositionCancel = function() {
    this._blacksmithWindow.show();
    this._helpWindow.show();
    this._actorsWindow.show();
    this._statusWindow.hide();
    this._menuNameWindow.hide();
    this._compositionWindow.deactivate();
    this._compositionWindow.hide();
    this._blacksmithWindow.activate();
};

Scene_Blacksmith.prototype.actorsWindowRect = function() {
    const wx = $TILE*6+$TILE/8*5;
    const ww = Graphics.boxWidth-wx;
    const wy = this._helpWindow.height;
    const wh = Graphics.boxHeight - wy;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Blacksmith.prototype.update = function() {
    Scene_Shop.prototype.update.call(this);
    if(this._mineralId != this._mineralsWindow.itemAt(this._mineralsWindow.index()).id){
        this._mineralId = this._mineralsWindow.itemAt(this._mineralsWindow.index()).id;
        this._blacksmithWindow.setupGoods(this.goods());
    }
};

Scene_Blacksmith.prototype.goods = function() {
    if(!this._mineralsWindow.itemAt(this._mineralsWindow.index())){
        return [];
    }
    var goods = [];
    var goodsWeaponId;
    switch(this._mineralsWindow.itemAt(this._mineralsWindow.index()).id){
        case 82: //鉄の塊
            goodsWeaponId = [4,43,62,81,112,127,138,155,205];
            goodsArmorId = [9,30,46,102,140,155];
            break;
        case 83: //金の塊
            goodsWeaponId = [34,143,231];
            goodsArmorId = [17,33,80,104,121,132,144,204];
            break;
        case 84: //ダマスカス鉱
            goodsWeaponId = [5,29];
            goodsArmorId = [];
            break;
        case 85: //ミスリル
            goodsWeaponId = [14,45,87,118,141,159,174,188,206,220];
            goodsArmorId = [16,32,49,52,143,160,179];
            break;
        case 86: //たまはがね
            goodsWeaponId = [66,92,123];
            goodsArmorId = [22,39,149,163];
            break;
        case 87: //オリハルコン
            goodsWeaponId = [20,35,93,144,163,193,223,236];
            goodsArmorId = [21,38,148];
            break;
        case 88: //ヒヒイロカネ
            goodsWeaponId = [47,72,105,179];
            goodsArmorId = [];
            break;
        case 89: //アダマンタイト
            goodsWeaponId = [36,94];
            goodsArmorId = [25,40,65,92,110,150,165,190];
            break;
            
    }
    for(id of goodsWeaponId){
        goods.push($dataWeapons[id]);
    }
    for(id of goodsArmorId){
        goods.push($dataArmors[id]);
    }
    return goods;
};

Scene_Blacksmith.prototype.blacksmithWindowRect = function() {
    const wx = 0;
    const wy = this._helpWindow.height;
    const ww = $TILE*6+$TILE/8*5;
    const wh = Graphics.boxHeight-this._helpWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Blacksmith.prototype.createBlacksmithWindow = function() {
    const rect = this.blacksmithWindowRect();
    this._blacksmithWindow = new Window_Blacksmith(rect,this._mineralsWindow);
    this._blacksmithWindow.setupGoods(this.goods());
    this._blacksmithWindow.setHelpWindow(this._helpWindow);
    //this._blacksmithWindow.setStatusWindow(this._statusWindow);
    this._blacksmithWindow.setHandler("ok", this.onBlacksmithOk.bind(this));
    this._blacksmithWindow.setHandler("cancel", this.onBlacksmithCancel.bind(this));
    this._blacksmithWindow.setHandler("pageup", this.onBlacksmithPageup.bind(this));
    this._blacksmithWindow.setHandler("pagedown", this.onBlacksmithPagedown.bind(this));
    this._mineralsWindow.setBlacksmithWindow(this._blacksmithWindow);
    this.addWindow(this._blacksmithWindow);
};

Scene_Blacksmith.prototype.onBlacksmithOk = function() {
    this._item = this._blacksmithWindow.item();
    this._blacksmithWindow.hide();
    this._helpWindow.hide();
    this._actorsWindow.hide();
    this._mineralsWindow.hide();
    this._statusWindow.show();
    this._statusWindow.setItem(this._item);
    this._menuNameWindow.show();
    this._compositionWindow.setEnable($gameParty.numItems(this._mineralsWindow.item())>0);
    this._compositionWindow.setItem(this._item);
    this._compositionWindow.refresh();
    this._compositionWindow.show();
    this._compositionWindow.activate();
};

Scene_Blacksmith.prototype.onBlacksmithPageup = function(){
    this._actorsWindow.changePage();
    this._blacksmithWindow.activate();
}
Scene_Blacksmith.prototype.onBlacksmithPagedown = function(){
    this._actorsWindow.changeBackPage();
    this._blacksmithWindow.activate();
}

Scene_Blacksmith.prototype.onBlacksmithCancel = function() {
    this._actorsWindow.hide();
    this._mineralsWindow.activate();
    this._mineralsWindow.show();
    this._menuNameWindow.show();
    this._blacksmithWindow.deactivate();
};

Scene_Blacksmith.prototype.dummyWindowRect = function() {
    const wx = 0;
    const wy = 0;
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Blacksmith.prototype.createHelpWindow = function() {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_Help(rect);
    this.addWindow(this._helpWindow);
};

Scene_Blacksmith.prototype.createMenuNameWindow = function(name) {
    const width = this.mainFontSize()*8;
    var rect = new Rectangle(Graphics.boxWidth-width, 0,width,this.mainFontSize()*3.75);
    this._menuNameWindow = new Window_MenuName(rect);
    this._menuNameWindow.drawMenuName("かじや");
    this.addWindow(this._menuNameWindow);
};

Scene_Blacksmith.prototype.createMineralsWindow = function(name) {
    const rect = new Rectangle($TILE*6+$TILE/8*5,this._helpWindow.height,Graphics.boxWidth-($TILE*6+$TILE/8*5),this.mainFontSize()*8/8*9+this.mainFontSize()*1.25);
    this._mineralsWindow = new Window_Minerals(rect,this._data);
    this._mineralsWindow.activate();
    this._mineralsWindow.setHandler("ok", this.onMineralsOk.bind(this));
    this._mineralsWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._mineralsWindow);
};

Scene_Blacksmith.prototype.onMineralsOk = function() {
    this._actorsWindow.show();
    this._mineralsWindow.deactivate();
    this._blacksmithWindow.activate();
    this._blacksmithWindow.select(0);
    this._menuNameWindow.hide();
};

function Window_Blacksmith() {
    this.initialize(...arguments);
}

Window_Blacksmith.prototype = Object.create(Window_ShopBuy.prototype);
Window_Blacksmith.prototype.constructor = Window_Blacksmith;

Window_Blacksmith.prototype.initialize = function(rect,mineralsWindow) {
    Window_ShopBuy.prototype.initialize.call(this, rect);
    this._mineralsWindow = mineralsWindow;
};

Window_Blacksmith.prototype.maxItems = function() {
    return this._shopGoods.length;
};

Window_Blacksmith.prototype.drawAllItems = function() {
    const topIndex = this.topIndex();
    for (let i = 0; i < this.maxVisibleItems(); i++) {
        const index = topIndex + i;
        if (index < this.maxItems()) {
            this.drawItemBackground(index);
            this.drawItem(index);
        }
    }
};

Window_Blacksmith.prototype.isEnabled = function(item) {
    return (
        item && !$gameParty.hasMaxItems(item)
    );
};

Window_Blacksmith.prototype.mineralNumber = function() {
    return $gameParty.numItems(this._mineralsWindow.itemAt(this._mineralsWindow.index()));
};

Window_Blacksmith.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this._shopGoods[this.index()]);
};

Window_Blacksmith.prototype.item = function() {
    return this.itemAt(this.index());
};

Window_Blacksmith.prototype.itemAt = function(index) {
    return this._shopGoods && index >= 0 ? this._shopGoods[index] : null;
};

Window_Blacksmith.prototype.itemRect = function(index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX() + $TILE/2;
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
    const width = itemWidth - colSpacing - $TILE/2;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};

Window_Blacksmith.prototype.drawItem = function(index) {
    const item = this.itemAt(index);
    const rect = this.itemLineRect(index);
    const nameWidth = rect.width;
    this.drawItemName(item, rect.x, rect.y, nameWidth);
};

function Window_Minerals() {
    this.initialize(...arguments);
}

Window_Minerals.prototype = Object.create(Window_Selectable.prototype);
Window_Minerals.prototype.constructor = Window_Minerals;

Window_Minerals.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this._blacksmithWindow = null;
    this.makeItemList();
    this.select(0);
};

Window_Minerals.prototype.setBlacksmithWindow = function(blacksmithWindow) {
    this._blacksmithWindow = blacksmithWindow;
};

Window_Minerals.prototype.refresh = function() {
    this._data = [];
    Window_Selectable.prototype.refresh.call(this);
    this.makeItemList();
    this.drawAllItems();
};

Window_Minerals.prototype.makeItemList = function() {
    this._data = [];
    for(let i = 82;i<=89;i++){
        this._data.push($dataItems[i]);
    }
};

Window_Minerals.prototype.drawAllItems = function() {
    this.contents.clear();
    const topIndex = this.topIndex();
    for (let i = 0; i < this.maxVisibleItems(); i++) {
        const index = topIndex + i;
        if (index < this._data.length) {
            this.drawItemBackground(index);
            this.drawItem(index);
        }
    }
};

Window_Minerals.prototype.maxItems = function() {
    return this._data.length;
}

Window_Minerals.prototype.drawItemNumber = function(item, x, y, width) {
    this.drawText(":", x, y, width - this.textWidth("00"), "right");
    this.drawText($gameParty.numItems(item), x, y, width, "right");
};

Window_Minerals.prototype.numberWidth = function() {
    return this.textWidth("00");
};

Window_Minerals.prototype.itemRect = function(index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX() + $TILE/2;
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
    const width = itemWidth - colSpacing - $TILE/2;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};

Window_Minerals.prototype.drawItem = function(index) {
    const item = this.itemAt(index);
    const rect = this.itemLineRect(index);
    const numberWidth = this.numberWidth();
    this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
    this.drawItemNumber(item, rect.x, rect.y, rect.width);
};

Window_Minerals.prototype.maxCols = function() {
    return 1;
};

Window_Minerals.prototype.item = function() {
    return this._data[this.index()];
};

Window_Minerals.prototype.itemAt = function(index) {
    return this._data[index];
};

Window_Minerals.prototype.update = function(){
    Window_Selectable.prototype.update.call(this);
    if(!this._data||this._data.length == 0){
        this.makeItemList();
    }
}

function Window_Composition() {
    this.initialize(...arguments);
}

Window_Composition.prototype = Object.create(Window_Command.prototype);
Window_Composition.prototype.constructor = Window_Composition;

Window_Composition.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this._enable = false;
    this.refresh();
    this.select(0);
    this.activate();
};

Window_Composition.prototype.refresh = function() {
    this.clearCommandList();
    this.makeCommandList();
    Window_Selectable.prototype.refresh.call(this);
    this.drawCompositionItem();
};

Window_Composition.prototype.setItem = function(item) {
    this._item = item;
};

Window_Composition.prototype.setEnable = function(enable) {
    this._enable = enable;
};

Window_Composition.prototype.enable = function() {
    return this._enable;
};

Window_Composition.prototype.itemRect = function() {
    const rect = new Rectangle();
    rect.x = this.innerWidth - this.textWidth("つくる ");
    rect.y = 0
    rect.width = this.textWidth("つくる ");
    rect.height = this.innerHeight;
    return rect;
};

Window_Composition.prototype.drawCompositionItem = function() {
    if(!this._item){
        return;
    }
    this.drawItemName(this._item,0,this.innerHeight/2-this.contents.fontSize/2,this.innerWidth);
};

Window_Composition.prototype.makeCommandList = function() {
    this.addCommand("つくる", "make");
};

Window_Composition.prototype.isCommandEnabled = function(index) {
    return this._enable;
};

Window_Composition.prototype.playOkSound  = function() {
    if(this._enable){
        AudioManager.playSe({"name":"MZ Chain","volume":90,"pitch":100,"pan":0})
    }else{
        SoundManager.playBuzzer();
    }
};

/*
Window_Composition.prototype.processOk = function() {
    Window_MenuCommand._lastCommandSymbol = this.currentSymbol();
    console.log(this._handlers);
    this.callHandler("make");
};*/