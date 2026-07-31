//=============================================================================
// FNG_CustomSceneShop.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc ショップ画面をFFIで使う用にカスタムします
  * @author finga
  * @help 主に配置を変更します
*/

Scene_Shop.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createMenuNameWindow();
    this.createCommandWindow();
    this.createHelpWindow();
    this.createGoldWindow();
    this.createpossessionWindow();
    this.createDummyWindow();
    this.createStatusWindow();
    this.createActorsWindow();
    this.createBuyWindow();
    this.createNumberWindow();
    //this.createCategoryWindow();
    this.createSellWindow();
};

Scene_Shop.prototype.createActorsWindow = function() {
    const rect = this.actorsWindowRect();
    this._actorsWindow = new Window_ShopActors(rect);
    this.addWindow(this._actorsWindow);
    this._actorsWindow.hide();
};

Scene_Shop.prototype.createSellWindow = function() {
    const rect = this.sellWindowRect();
    this._sellWindow = new Window_ShopSell(rect);
    this._sellWindow._category = "item";
    this._sellWindow.makeItemList();
    this._sellWindow.setHelpWindow(this._helpWindow);
    this._sellWindow.hide();
    this._sellWindow.setHandler("ok", this.onSellOk.bind(this));
    this._sellWindow.setHandler("cancel", this.onSellCancel.bind(this));
    //this._categoryWindow.setItemWindow(this._sellWindow);
    this.addWindow(this._sellWindow);
};
Scene_Shop.prototype.createpossessionWindow = function() {
    const rect = this.possessionWindowRect();
    this._possessionWindow = new Window_Possession(rect);
    this.addWindow(this._possessionWindow);
};
Scene_Shop.prototype.createGoldWindow = function() {
    const rect = this.goldWindowRect();
    this._goldWindow = new Window_ShopGold(rect);
    this._goldWindow.width = this.mainFontSize()*6;
    this._goldWindow.refresh();
    this.addWindow(this._goldWindow);
};
Scene_Shop.prototype.createMenuNameWindow = function(name) {
    const width = this.mainFontSize()*8;
    var rect = new Rectangle(Graphics.boxWidth-width, 0,width,this.mainFontSize()*3.75);
    this._menuNameWindow = new Window_MenuName(rect);
    this._menuNameWindow.drawMenuName("Shop");
    this.addWindow(this._menuNameWindow);
};
Scene_Shop.prototype.createBuyWindow = function() {
    const rect = this.buyWindowRect();
    this._buyWindow = new Window_ShopBuy(rect);
    this._buyWindow.setupGoods(this._goods);
    this._buyWindow.setHelpWindow(this._helpWindow);
    this._buyWindow.setStatusWindow(this._statusWindow);
    this._buyWindow.setPossessionWindow(this._possessionWindow);
    this._buyWindow.setActorsWindow(this._actorsWindow);
    this._buyWindow.hide();
    this._buyWindow.setHandler("ok", this.onBuyOk.bind(this));
    this._buyWindow.setHandler("cancel", this.onBuyCancel.bind(this));
    this._buyWindow.setHandler("pageup", this.onBuyPageup.bind(this));
    this._buyWindow.setHandler("pagedown", this.onBuyPagedown.bind(this));
    this.addWindow(this._buyWindow);
};
Scene_Shop.prototype.createHelpWindow = function() {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_Help(rect);
    this.addWindow(this._helpWindow);
    this._helpWindow.hide();
};
Scene_Shop.prototype.createStatusWindow = function() {
    const rect = this.statusWindowRect();
    this._statusWindow = new Window_ShopStatusEx(rect);
    this._statusWindow.hide();
    this.addWindow(this._statusWindow);
};
Scene_Shop.prototype.createNumberWindow = function() {
    const rect = this.numberWindowRect();
    this._numberWindow = new Window_ShopNumber(rect);
    this._numberWindow.hide();
    this._numberWindow.setHandler("ok", this.onNumberOk.bind(this));
    this._numberWindow.setHandler("cancel", this.onNumberCancel.bind(this));
    this._numberWindow.setHandler("pageup", this.onNumberPageup.bind(this));
    this._numberWindow.setHandler("pagedown", this.onNumberPagedown.bind(this));
    this.addWindow(this._numberWindow);
};

Scene_Shop.prototype.statusWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight - this.mainFontSize()*7;
    const wx = 0;
    const wy = this.mainFontSize()*7;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Shop.prototype.actorsWindowRect = function() {
    const ww = this.statusWidth();
    const wh = Graphics.boxHeight - this.mainFontSize()*3.75;
    const wx = Graphics.boxWidth - ww;
    const wy = this.mainFontSize()*3.75;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Shop.prototype.goldWindowRect = function() {
    const ww = this._menuNameWindow.width;
    const wh = this.mainFontSize()*3.25;
    const wx = Graphics.boxWidth - this.statusWidth() - this.mainFontSize()*6;
    const wy = this.mainFontSize()*3.75;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Shop.prototype.helpWindowRect = function() {
    const wx = 0;
    const wy = 0;
    const ww = Graphics.boxWidth;
    const wh = this.mainFontSize()*3.75;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Shop.prototype.commandWindowRect = function() {
    const wx = 0;
    const wy = 0;
    const ww = Graphics.boxWidth-this._menuNameWindow.width;
    const wh = this.mainFontSize()*3.75;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Shop.prototype.dummyWindowRect = function() {
    const wx = 0;
    const wy = this._commandWindow.y + this._commandWindow.height;
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight - this._commandWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Shop.prototype.buyWindowRect = function() {
    const wx = 0;
    const wy = this.mainFontSize()*7;
    const ww = Graphics.boxWidth - this.statusWidth();
    const wh = Graphics.boxHeight - wy;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Shop.prototype.sellWindowRect = function() {
    const wx = 0;
    const wy = this.mainFontSize()*3.75;
    const ww = Graphics.boxWidth;
    const wh =  Graphics.boxHeight -
        this._commandWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Shop.prototype.possessionWindowRect = function() {
    const ww = Graphics.boxWidth - this.statusWidth() - this._goldWindow.width;
    const wh = this.mainFontSize()*3.25;
    const wx = 0;
    const wy = this.mainFontSize()*3.75;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Shop.prototype.numberWindowRect = function() {
    const wx = 0;
    const wy = 0;
    const ww = Graphics.boxWidth - this._menuNameWindow.width;
    const wh = this.mainFontSize()*7;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Shop.prototype.commandBuy = function() {
    this._dummyWindow.hide();
    this.activateBuyWindow();
    this._helpWindow.show();
    this._actorsWindow.show();
};
Scene_Shop.prototype.commandSell = function() {
    this._dummyWindow.hide();
    this._helpWindow.show();
    this._actorsWindow.hide();
    this.onCategoryOk();
};

Scene_Shop.prototype.activateSellWindow = function() {
    this._sellWindow.refresh();
    this._sellWindow.show();
    this._sellWindow.activate();
    this._statusWindow.hide();
};
Scene_Shop.prototype.onSellOk = function() {
    this._item = this._sellWindow.item();
    this._goldWindow.x = Graphics.boxWidth - this._menuNameWindow.width;
    this._goldWindow.y = this.mainFontSize()*3.75;
    this._goldWindow.width = this._menuNameWindow.width;
    this._goldWindow.innerwidth = this._menuNameWindow.width - this._menuNameWindow.padding * 2;
    this._goldWindow.refresh();
    //this._categoryWindow.hide();
    this._helpWindow.hide();
    this._sellWindow.hide();
    this._numberWindow.setup(this._item, this.maxSell(), this.sellingPrice());
    this._numberWindow.setCurrencyUnit(this.currencyUnit());
    this._numberWindow.show();
    this._numberWindow.activate();
    this._actorsWindow.hide();
    this._statusWindow.setItem(this._item);
    this._statusWindow.show();
};
Scene_Shop.prototype.onSellCancel = function() {
    this._sellWindow.deselect();
    this._statusWindow.setItem(null);
    this._actorsWindow.hide();
    this._helpWindow.hide();
    this.onCategoryCancel();
};

Scene_Shop.prototype.onCategoryCancel = function() {
    this._commandWindow.activate();
    this._dummyWindow.show();
    //this._categoryWindow.hide();
    this._sellWindow.hide();
};

Scene_Shop.prototype.onBuyOk = function() {
    this._item = this._buyWindow.item();
    this._goldWindow.x = Graphics.boxWidth - this._menuNameWindow.width;
    this._goldWindow.y = this.mainFontSize()*3.75;
    this._goldWindow.width = this._menuNameWindow.width;
    this._goldWindow.innerwidth = this._menuNameWindow.width - this._menuNameWindow.padding * 2;
    this._goldWindow.refresh();
    this._buyWindow.hide();
    this._helpWindow.hide();
    this._actorsWindow.hide();
    this._statusWindow.show();
    this._numberWindow.setup(this._item, this.maxBuy(), this.buyingPrice());
    this._numberWindow.setCurrencyUnit(this.currencyUnit());
    this._numberWindow.show();
    this._numberWindow.activate();
};
Scene_Shop.prototype.onBuyPageup = function(){
    this._actorsWindow.changePage();
    this._buyWindow.activate();
}
Scene_Shop.prototype.onBuyPagedown = function(){
    this._actorsWindow.changeBackPage();
    this._buyWindow.activate();
}
Scene_Shop.prototype.onBuyCancel = function() {
    this._commandWindow.activate();
    this._dummyWindow.show();
    this._buyWindow.hide();
    this._helpWindow.hide();
    this._statusWindow.hide();
    this._actorsWindow.hide();
    this._statusWindow.setItem(null);
    this._helpWindow.clear();
};

Scene_Shop.prototype.onNumberCancel = function() {
    SoundManager.playCancel();
    this._helpWindow.show();
    this._actorsWindow.show();
    this._statusWindow.hide();
    this._goldWindow.width = this.mainFontSize()*6;
    this._goldWindow.height = this.mainFontSize()*3.25;
    this._goldWindow.x = Graphics.boxWidth - this.statusWidth() - this.mainFontSize()*6;
    this._goldWindow.y = this.mainFontSize()*3.75;
    this._goldWindow.refresh();
    this.endNumberInput();
};
Scene_Shop.prototype.onNumberOk = function() {
    SoundManager.playShop();
    this._actorsWindow.show();
    this._goldWindow.x = Graphics.boxWidth - this.statusWidth() - this.mainFontSize()*6;
    this._goldWindow.y = this.mainFontSize()*3.75;
    this._goldWindow.width = this.mainFontSize()*6;
    switch (this._commandWindow.currentSymbol()) {
        case "buy":
            this.doBuy(this._numberWindow.number());
            break;
        case "sell":
            this.doSell(this._numberWindow.number());
            break;
    }
    this.endNumberInput();
    this._goldWindow.refresh();
    this._possessionWindow.refresh();
    this._statusWindow.refresh();
};
Scene_Shop.prototype.onNumberPageup = function(){
    this._statusWindow.changePage();
    this._numberWindow.activate();
}
Scene_Shop.prototype.onNumberPagedown = function(){
    this._statusWindow.changeBackPage();
    this._numberWindow.activate();
}

//-----------------------------------------------------------------------------
// Window_ShopCommand
//
// itemRectのみ調整

Window_ShopCommand.prototype.itemRect = function(index) {
    const width = this.innerWidth/3;
    const height = this.innerHeight;
    const x = width*index;
    const y = 0;
    return new Rectangle(x, y, width, height);
};

//-----------------------------------------------------------------------------
// Window_ShopBuy
//
// 所持金と所有数を表示する専用のウィンドウを更新する処理を加える

Window_ShopBuy.prototype.setPossessionWindow = function(possessionWindow) {
    this._possessionWindow = possessionWindow;
    this.callUpdateHelp();
};

Window_ShopBuy.prototype.setActorsWindow = function(actorsWindow) {
    this._actorsWindow = actorsWindow;
    this.callUpdateHelp();
};

Window_ShopBuy.prototype.updateHelp = function() {
    this.setHelpWindowItem(this.item());
    if (this._statusWindow) {
        this._statusWindow.setItem(this.item());
    }
    if (this._possessionWindow) {
        this._possessionWindow.setItem(this.item());
    }
    if (this._actorsWindow) {
        this._actorsWindow.setItem(this.item());
    }
};

//-----------------------------------------------------------------------------
// Window_Possession
//
// アイテムの所有数・装備数を表示する

function Window_Possession() {
    this.initialize(...arguments);
}

Window_Possession.prototype = Object.create(Window_ShopStatus.prototype);
Window_Possession.prototype.constructor = Window_Possession;

Window_Possession.prototype.refresh = function() {
    this.contents.clear();
    if (this._item) {
        const x = this.itemPadding();
        this.drawPossession(0,0);
    }
};

Window_Possession.prototype.drawPossession = function(x, y) {
    const width = this.innerWidth;
    const possessionWidth = this.textWidth("0000");
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(TextManager.possession, x, y, width);
    this.drawText("Equipped", x, y+this.lineHeight(), width);
    this.resetTextColor();
    this.drawText($gameParty.numItems(this._item), x, y, width, "right");
    this.drawText(this.numEquipped(this._item), x, y+this.lineHeight(), width, "right");
};

Window_Possession.prototype.numEquipped = function(){
    const members = $gameParty.members().concat($gameParty.subMembers());
    var value = 0;
    for(actor of members){
        if(actor.isEquipped(this._item)){
            value = value + 1;
        }
        if(this._item.etypeId == 1){
            if(this.weapon2(actor) && this._item.id == this.weapon2(actor).id){
                value = value + 1;
            }
        }
    }
    return value;
}
           
Window_Possession.prototype.weapon2 = function(actor){
    const list = [];
    const equips = actor.equips();
    const slots = actor.equipSlots();
    var weapon;
    for (let i = 0; i < slots.length; i++) {
        if (slots[i] === 1) {
            list.push(equips[i]);
        }
    }
    if(list.length >= 2){
        return list[1];
    }
    return null;
}     

//-----------------------------------------------------------------------------
// Window_ShopGold
//
// ショップ画面専用のギル表示ウィンドウ

function Window_ShopGold() {
    this.initialize(...arguments);
}

Window_ShopGold.prototype = Object.create(Window_Gold.prototype);
Window_ShopGold.prototype.constructor = Window_ShopGold;

Window_ShopGold.prototype.initialize = function(rect) {
    Window_Gold.prototype.initialize.call(this, rect);
    this.refresh();
};

Window_ShopGold.prototype.refresh = function() {
    const x = 0;
    const y = this.innerHeight/2-this.lineHeight();
    const width = this.innerWidth;
    this.contents.clear();
    this.drawText($gameParty.gold(), x, y, width,"right");
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(this.currencyUnit(), x, y+this.lineHeight(), width,"right");
    this.resetTextColor();
};

//-----------------------------------------------------------------------------
// Window_ShopActors
//
// ショップ画面の該当アクターが使用可能かどうかを表示するウィンドウ

function Window_ShopActors() {
    this.initialize(...arguments);
}

Window_ShopActors.prototype = Object.create(Window_ShopStatus.prototype);
Window_ShopActors.prototype.constructor = Window_ShopActors;

Window_ShopActors.prototype.initialize = function(rect) {
    Window_ShopStatus.prototype.initialize.call(this, rect);
    this._aFrame = 0;
    this.loadSvActorImages();
};

Window_ShopActors.prototype.update = function(){
    Window_ShopStatus.prototype.update.call(this);
    this.updateAnimationFrame();
    this.refresh();
}

Window_ShopActors.prototype.updateAnimationFrame = function(){
    this._aFrame = this._aFrame + 1;
    if(this._aFrame > 60){
        this._aFrame = 0;
    }
}

Window_ShopActors.prototype.refresh = function() {
    this.contents.clear();
    if (this._item) {
        const x = this.itemPadding();
        if (this.isEquipItem()) {
            const y = Math.floor(this.lineHeight() * 1.5);
            this.drawEquipInfo(x, y);
        }
    }
};

Window_ShopActors.prototype.drawEquipInfo = function(x, y) {
    const members = this.statusMembers();
    for (let i = 0; i < members.length; i++) {
        const rect = this.itemRect(i);
        this.drawActorEquipInfo(rect.x, rect.y, members[i]);
    }
};

Window_ShopActors.prototype.statusMembers = function() {
    const members = $gameParty.members().concat($gameParty.subMembers());
    const start = this._pageIndex * this.pageSize();
    var end = Math.min(start + this.pageSize(),members.length);
    return members.slice(start, end);
};

Window_ShopActors.prototype.maxPages = function() {
    const members = $gameParty.members().concat($gameParty.subMembers());
    return Math.floor(members.length / this.pageSize());
};

Window_ShopActors.prototype.pageSize = function() {
    return 12;
};

Window_ShopActors.prototype.changePage = function() {
    this._pageIndex = this._pageIndex + 1;
    if(this._pageIndex > this.maxPages()){
        this._pageIndex = 0;
    }
    this.playCursorSound();
};

Window_ShopActors.prototype.changeBackPage = function() {
    this._pageIndex = this._pageIndex - 1;
    if(this._pageIndex < 0){
        this._pageIndex = this.maxPages();
    }
    this.playCursorSound();
};

Window_ShopActors.prototype.updatePage = function() {};

Window_ShopActors.prototype.drawActorEquipInfo = function(x, y, actor) {
    const item1 = this.currentEquippedItem(actor, this._item.etypeId);
    const width = this.itemRect(0).width;
    const enabled = actor.canEquip(this._item);
    if (enabled) {
        if(this._aFrame > 30){
            this.drawSvActor(actor.battlerName(), 16, x, y);
        }else{
            this.drawSvActor(actor.battlerName(), 17, x, y);
        }
        if(item1 != null && actor.isEquipped(this._item)){
            this.drawIcon(56, x-this.contents.fontSize/2, y+this.lineHeight()*2.25);
        }
        if(this.isParamUp(actor)){
            this.drawIcon(54, x-this.contents.fontSize/2, y+this.lineHeight()*1.25-Math.floor(((this._aFrame-1)%30)/7.5));
        }else if(this.isParamDown(actor)){
            this.drawIcon(55, x-this.contents.fontSize/2, y+this.lineHeight()*1.25+Math.floor(((this._aFrame-1)%30)/7.5));
        }
    }else{
        this.drawSvActor(actor.battlerName(), 51, x, y);
    }
};

Window_ShopActors.prototype.getCurrentUpParam = function(actor){
    const item1 = this.currentEquippedItem(actor, this._item.etypeId);
    var currentUpParam = 0;
    if(item1 && item1.etypeId == 1){
        currentUpParam = item1.params[2];
    }
    if(item1 && item1.etypeId == 2){
        currentUpParam = DataManager.itemxparamSum(item1, 1);
    }
    if(item1 && item1.etypeId == 3){
        currentUpParam = item1.params[3]+item1.params[5];
    }
    if(item1 && item1.etypeId == 4){
        currentUpParam = item1.params[3]+item1.params[5];
    }
    if(item1 && item1.etypeId == 5 && (item1.atypeId == 11 || item1.atypeId == 16)){
        currentUpParam = item1.params[3]+item1.params[5];
    }
    return currentUpParam;    
}

Window_ShopActors.prototype.getPurchaseUpParam = function(){
    var purchaseUpParam = 0;
    if(this._item.etypeId == 1){
        purchaseUpParam = this._item.params[2];
    }
    if(this._item.etypeId == 2){
        purchaseUpParam = DataManager.itemxparamSum(this._item, 1);
    }
    if(this._item.etypeId == 3){
        purchaseUpParam = this._item.params[3]+this._item.params[5];
    }
    if(this._item.etypeId == 4){
        purchaseUpParam = this._item.params[3]+this._item.params[5];
    }
    if(this._item.etypeId == 5 && (this._item.atypeId == 11 || this._item.atypeId == 16)){
        purchaseUpParam = this._item.params[3]+this._item.params[5];
    }
    return purchaseUpParam;
}

Window_ShopActors.prototype.isParamUp = function(actor){
    return this.getCurrentUpParam(actor) < this.getPurchaseUpParam();
}

Window_ShopActors.prototype.isParamDown = function(actor){
    return this.getCurrentUpParam(actor) > this.getPurchaseUpParam();
}

Window_ShopActors.prototype.currentEquippedItem = function(actor, etypeId) {
    const list = [];
    const equips = actor.equips();
    const slots = actor.equipSlots();
    for (let i = 0; i < slots.length; i++) {
        if (slots[i] === etypeId) {
            list.push(equips[i]);
        }
    }
    if(list.length == 0){
        return null;
    }
    if(list.length == 1){
        return list[0];
    }
    if(list.length == 2){
        let worstParam = Number.MAX_VALUE;
        let worstItem = null;
        for (const item of list) {
            if (item && item.params[2] < worstParam) {
                worstParam = item.params[2];
                worstItem = item;
            }
        }
        return worstItem;
    }
};

Window_ShopActors.prototype.itemRect = function(index) {
    const maxCol = Math.floor(this.innerWidth/($DOT*28));
    const maxRow = Math.floor(this.innerHeight/($DOT*28));
    
    const wx = Math.floor(this.innerWidth/maxCol * (index % maxCol) + this.contents.fontSize/2);
    const wy = Math.floor(this.innerHeight/maxRow * Math.floor(index / maxCol));
    const ww = this.innerWidth/maxCol;
    const wh = this.innerHeight/maxRow;
    return new Rectangle(wx,wy,ww,wh);
};

//-----------------------------------------------------------------------------
// Window_ShopStatusEx
//
// Window_ShopActorsの機能を引き継いだWindow_ShopStatusのパワーアップ版

function Window_ShopStatusEx() {
    this.initialize(...arguments);
}

Window_ShopStatusEx.prototype = Object.create(Window_ShopActors.prototype);
Window_ShopStatusEx.prototype.constructor = Window_ShopStatusEx;

Window_ShopStatusEx.prototype.drawActorEquipInfo = function(x, y, actor) {
    const item1 = this.currentEquippedItem(actor, this._item.etypeId);
    const itemslot1 = this.currentEquippedItemslots(actor, this._item.etypeId,0);
    const itemslot2 = this.currentEquippedItemslots(actor, this._item.etypeId,1);
    const width = this.itemRect(0).width;
    const enabled = actor.canEquip(this._item);
    if (enabled) {
        if(this._aFrame > 30){
            this.drawSvActor(actor.battlerName(), 16, x, y);
        }else{
            this.drawSvActor(actor.battlerName(), 17, x, y);
        }
        if(item1 != null && actor.isEquipped(this._item)){
            this.drawIcon(56, x-this.contents.fontSize/2, y+this.lineHeight()*2.25);
        }
        if(this.isParamUp(actor)){
            this.drawIcon(54, x-this.contents.fontSize/2, y+this.lineHeight()*1.25-Math.floor(((this._aFrame-1)%30)/7.5));
        }else if(this.isParamDown(actor)){
            this.drawIcon(55, x-this.contents.fontSize/2, y+this.lineHeight()*1.25+Math.floor(((this._aFrame-1)%30)/7.5));
        }
       if(this._item.etypeId == 1){
           this.drawItemName(itemslot1,x+this.contents.fontSize*3,y+this.lineHeight()*1.5,this.innerWidth/2); this.drawItemName(itemslot2,x+this.contents.fontSize*3,y+this.lineHeight()*2.5,this.innerWidth/2);
        }else{
            this.drawItemName(itemslot1,x+this.contents.fontSize*3,y+this.lineHeight()*2.5,this.innerWidth/2); 
        }
        
        this.changeTextColor(ColorManager.normalColor());
       if(this._item.etypeId == 1){
           this.drawText("Atk",x+this.contents.fontSize*3,y+this.lineHeight()*0.5,this.contents.fontSize*4);
           this.drawText("Mag",x+this.contents.fontSize*8.5,y+this.lineHeight()*0.5,this.contents.fontSize*3);
           this.drawParamChangeValue(2,x+this.contents.fontSize*6,y+this.lineHeight()*0.5,item1)
           this.drawParamChangeValue(4,x+this.contents.fontSize*10,y+this.lineHeight()*0.5,item1)
        }
        if(this._item.etypeId == 2){
           this.drawText("Eva",x+this.contents.fontSize*3,y+this.lineHeight()*0.5,this.contents.fontSize*6);
            this.drawTraitChangeValue(1,x+this.contents.fontSize*8,y+this.lineHeight()*0.5,item1)
        }
        if(this._item.etypeId == 3 || this._item.etypeId == 4){
           this.drawText("Def",x+this.contents.fontSize*3,y+this.lineHeight()*0.5,this.contents.fontSize*3);
           this.drawText("M.Def",x+this.contents.fontSize*7.5,y+this.lineHeight()*0.5,this.contents.fontSize*5);
           this.drawText("Agi",x+this.contents.fontSize*3,y+this.lineHeight()*1.5,this.contents.fontSize*5);
           this.drawText("Mag",x+this.contents.fontSize*9,y+this.lineHeight()*1.5,this.contents.fontSize*4);
           this.drawParamChangeValue(3,x+this.contents.fontSize*5,y+this.lineHeight()*0.5,item1)
           this.drawParamChangeValue(5,x+this.contents.fontSize*11.5,y+this.lineHeight()*0.5,item1)
           this.drawParamChangeValue(6,x+this.contents.fontSize*6.5,y+this.lineHeight()*1.5,item1)
           this.drawParamChangeValue(4,x+this.contents.fontSize*10.5,y+this.lineHeight()*1.5,item1)
        }
        if(this._item.etypeId == 5 && (this._item.atypeId == 11 || this._item.atypeId == 16)){
           this.drawText("Def",x+this.contents.fontSize*3,y+this.lineHeight()*0.5,this.contents.fontSize*3);
           this.drawText("M.Def",x+this.contents.fontSize*7.5,y+this.lineHeight()*0.5,this.contents.fontSize*5);
           this.drawText("Agi",x+this.contents.fontSize*3,y+this.lineHeight()*1.5,this.contents.fontSize*5);
           this.drawText("Str",x+this.contents.fontSize*8.5,y+this.lineHeight()*1.5,this.contents.fontSize*4);
           this.drawParamChangeValue(3,x+this.contents.fontSize*5,y+this.lineHeight()*0.5,item1)
           this.drawParamChangeValue(5,x+this.contents.fontSize*11.5,y+this.lineHeight()*0.5,item1)
           this.drawParamChangeValue(6,x+this.contents.fontSize*6.5,y+this.lineHeight()*1.5,item1)
           this.drawParamChangeValue(2,x+this.contents.fontSize*11,y+this.lineHeight()*1.5,item1)
        }
    }else{
        this.drawSvActor(actor.battlerName(), 51, x, y);
        this.changeTextColor(ColorManager.normalColor());
        this.drawText("Can not equip!",x+this.contents.fontSize*3,y+this.lineHeight()*1.5,this.innerWidth/2);
    }
};

Window_ShopActors.prototype.drawParamChangeValue = function(paramId,x,y,equippedItem){
    var value1 = 0;
    if(equippedItem){
        value1 = equippedItem.params[paramId];
    }
    const value2 = this._item.params[paramId];
    const value = value2 - value1;
    if(value == 0){
        this.changeTextColor(ColorManager.normalColor());
    }
    if(value < 0){
        this.changeTextColor(ColorManager.powerDownColor());
    }
    if(value > 0){
        this.changeTextColor(ColorManager.powerUpColor());
    }
    this.drawText(value,x,y,this.contents.fontSize*2,"right");
}

Window_ShopActors.prototype.drawTraitChangeValue = function(traitId,x,y,equippedItem){
    var value1 = 0;
    if(equippedItem){
        value1 = DataManager.itemxparamSum(equippedItem, traitId);
    }
    const value2 = DataManager.itemxparamSum(this._item, traitId);
    const value = value2 - value1;
    if(value == 0){
        this.changeTextColor(ColorManager.normalColor());
    }
    if(value < 0){
        this.changeTextColor(ColorManager.powerDownColor());
    }
    if(value > 0){
        this.changeTextColor(ColorManager.powerUpColor());
    }
    this.drawText(value,x,y,this.contents.fontSize*2,"right");
}

Window_ShopActors.prototype.currentEquippedItemslots = function(actor, etypeId,slot) {
    const list = [];
    const equips = actor.equips();
    const slots = actor.equipSlots();
    for (let i = 0; i < slots.length; i++) {
        if (slots[i] === etypeId) {
            list.push(equips[i]);
        }
    }
    return list[slot];
};

Window_ShopStatusEx.prototype.pageSize = function() {
    return 6;
};

Window_ShopStatusEx.prototype.itemRect = function(index) {
    const maxRow = Math.floor(this.innerHeight/($TILE*1.75));
    const ww = this.innerWidth/2;
    const wh = this.innerHeight/maxRow;
    const wx = Math.floor(ww * (index % 2) + this.contents.fontSize/2);
    const wy = Math.floor(wh * Math.floor(index / 2));
    return new Rectangle(wx,wy,ww,wh);
};

//-----------------------------------------------------------------------------
// DataManager
//
// アイテムの命中率と回避率を取得できるようにする

DataManager.itemxparamtraits = function(item, id) {
	//console.log(item)
       return item.traits.filter(function(trait) {
             return trait.code === Game_BattlerBase.TRAIT_XPARAM && trait.dataId === id;
       });
};

DataManager.itemxparamSum = function(item, id) {
        return this.itemxparamtraits(item, id).reduce(function(r, trait) {
             return r + Math.floor(Number(trait.value) * 100);
        }, 0);
};