var _scene_Item_create = Scene_Item.prototype.create;
Scene_Item.prototype.create = function() {
    Scene_ItemBase.prototype.create.call(this);
    this.createCategoryWindow();
    this.createItemWindow();
    this.createHelpWindow();
    this.createActorWindow();
    this.createMenuNameWindow("アイテム");
    this.createItemAmountWindow();
    this.createStatusWindow();
    this.createActorsWindow();
    this.createListWindow();
    this.createMaterialsWindow();
    this.createCompositionWindow();    
};

const _Scene_Item_createItemWindow = Scene_Item.prototype.createItemWindow;
Scene_Item.prototype.createItemWindow = function() {
    _Scene_Item_createItemWindow.apply(this,arguments);
    this._itemWindow.setHandler("shift", this.onItemShift.bind(this));
};

Scene_Item.prototype.createHelpWindow = function() {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_Help(rect);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow._subIndex = -1;
    this.addWindow(this._helpWindow);
};

Scene_Item.prototype.onItemShift = function(){
    this._helpWindow.y = 0;
    this._listWindow.setupGoods($gameParty.getIncludeRecipeItems(this._itemWindow.item()));
    this._listWindow.show();
    this._actorsWindow.show();
    this._materialsWindow.show();
    this._menuNameWindow.hide();
    this._statusWindow.hide();
    this._compositionWindow.deactivate();
    this._compositionWindow.hide();
    this._listWindow.activate();
}

Scene_Item.prototype.createMaterialsWindow = function() {
    const rect = this.materialsWindowRect();
    this._materialsWindow = new Window_Materials(rect);
    this.addWindow(this._materialsWindow);
    this._materialsWindow.hide();
    this._listWindow.setMaterialsWindow(this._materialsWindow);
};

Scene_Item.prototype.materialsWindowRect = function() {
    const wh = $TILE*2.5+$TILE/8*5;
    const wx = this._actorsWindow.x;
    const wy = Graphics.boxHeight-wh;
    const ww = this._actorsWindow.width;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Item.prototype.createCompositionWindow = function() {
    const rect = new Rectangle(0,0,Graphics.boxWidth-this._menuNameWindow.width,this._menuNameWindow.height);
    this._compositionWindow = new Window_Composition(rect);
    this._compositionWindow.setHandler("make",this.commandMake.bind(this));;
    this._compositionWindow.setHandler("cancel", this.onCompositionCancel.bind(this));
    this._compositionWindow.setHandler("pageup", this.onCompositionPageup.bind(this));
    this._compositionWindow.setHandler("pagedown", this.onCompositionPagedown.bind(this));
    this._compositionWindow.hide();
    this.addWindow(this._compositionWindow);
};

Scene_Item.prototype.onCompositionCancel = function() {
    this._listWindow.show();
    this._helpWindow.show();
    this._actorsWindow.show();
    this._materialsWindow.show();
    this._menuNameWindow.hide();
    this._statusWindow.hide();
    this._compositionWindow.deactivate();
    this._compositionWindow.hide();
    this._listWindow.activate();
};

Scene_Item.prototype.onCompositionPageup = function(){
    this._statusWindow.changePage();
    this._compositionWindow.activate();
}
Scene_Item.prototype.onCompositionPagedown = function(){
    this._statusWindow.changeBackPage();
    this._compositionWindow.activate();
}

Scene_Item.prototype.commandMake = function() {
    if(this._compositionWindow.enable()){
        if(this._item.meta.multiMakeComposition){
            const meta = this._item.meta.multiMakeComposition;
            const id = Number(meta.split(',')[0]);
            const amount = Number(meta.split(',')[1]);
            const makeItem = $dataItems[id];
            $gameParty.gainItem(makeItem, amount);
        }else{
            $gameParty.gainItem(this._item, 1);
        }
        const recipe = $gameParty.getItemRecipe(this._item);
        for(let i=2;i<recipe.length;i++){
            var info = recipe[i];
            var material;
            if(info[0] == "I"){
                material = $dataItems[info[1]];
            }else if(info[0] == "W"){
                material = $dataWeapons[info[1]];
            }else if(info[0] == "A"){
                material = $dataArmors[info[1]];
            }
            $gameParty.loseItem(material, info[2]);
        }
        this._listWindow.refresh();
        this._itemWindow.refresh();
        this.onCompositionCancel();
    }else{
        this._compositionWindow.activate();
    }
};

Scene_Item.prototype.createActorsWindow = function() {
    const rect = this.actorsWindowRect();
    this._actorsWindow = new Window_ShopActors(rect);
    this.addWindow(this._actorsWindow);
    this._actorsWindow.hide();
};

Scene_Item.prototype.actorsWindowRect = function() {
    const wx = $TILE*6+$TILE/8*5;
    const ww = Graphics.boxWidth-wx;
    const wy = this._helpWindow.height;
    const wh = Graphics.boxHeight - wy - $TILE*2.5+$TILE/8*5;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Item.prototype.createListWindow = function() {
    const rect = this.listWindowRect();
    this._listWindow = new Window_compositionList(rect);
    //this._listWindow.setupGoods(this.goods());
    this._listWindow.setHelpWindow(this._helpWindow);
    this._listWindow.setStatusWindow(this._statusWindow);
    this._listWindow.setActorsWindow(this._actorsWindow);
    this._listWindow.setHandler("ok", this.onListOk.bind(this));
    this._listWindow.setHandler("cancel", this.onListCancel.bind(this));
    this._listWindow.setHandler("pageup", this.onListPageup.bind(this));
    this._listWindow.setHandler("pagedown", this.onListPagedown.bind(this));
    this._listWindow.hide();
    this.addWindow(this._listWindow);
};

Scene_Item.prototype.listWindowRect = function() {
    const wx = 0;
    const wy = this._helpWindow.height;
    const ww = $TILE*6+$TILE/8*5;
    const wh = Graphics.boxHeight-this._helpWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Item.prototype.onListOk = function() {
    this._item = this._listWindow.item();
    this._listWindow.hide();
    this._helpWindow.hide();
    this._materialsWindow.hide();
    this._actorsWindow.hide();
    this._menuNameWindow.show();
    this._statusWindow.show();
    this._statusWindow.setItem(this._item);
    this._compositionWindow.setEnable($gameParty.isComposibleItem(this._item));
    this._compositionWindow.setItem(this._item);
    this._compositionWindow.refresh();
    this._compositionWindow.show();
    this._compositionWindow.activate();
};

Scene_Item.prototype.onListCancel = function() {
    this._actorsWindow.hide();
    this._listWindow.deactivate();
    this._listWindow.hide();
    this._helpWindow.y = Graphics.boxHeight - this._helpWindow.height;
    this._menuNameWindow.show();
    this._materialsWindow.hide();
    this._itemWindow.activate();
};

Scene_Item.prototype.onListPageup = function(){
    this._actorsWindow.changePage();
    this._listWindow.activate();
}
Scene_Item.prototype.onListPagedown = function(){
    this._actorsWindow.changeBackPage();
    this._listWindow.activate();
}

Scene_Item.prototype.createStatusWindow = function() {
    const rect = this.statusWindowRect();
    this._statusWindow = new Window_ShopStatusEx(rect);
    this._statusWindow.hide();
    this.addWindow(this._statusWindow);
};

Scene_Item.prototype.statusWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight - this._menuNameWindow.height;
    const wx = 0;
    const wy = this._menuNameWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Item.prototype.createMenuNameWindow = function(name) {
    const cateRect = this.categoryWindowRect();
    var rect = new Rectangle(cateRect.width, 0, Graphics.width-cateRect.width,cateRect.height);
    this._menuNameWindow = new Window_MenuName(rect);
    this._menuNameWindow.drawMenuName(name);
    this.addWindow(this._menuNameWindow);
};

Scene_Item.prototype.createItemAmountWindow = function() {
    const wx = this.actorWindow
    var rect = new Rectangle(this._actorWindow.width,0,Graphics.width-this._actorWindow.width,this.mainFontSize()*5);
    this._itemAmountWindow = new Window_MenuName(rect);
    this.addWindow(this._itemAmountWindow);
    this._itemAmountWindow.hide();
};

Scene_Item.prototype.refreshItemAmountWindow = function(item) {
    var y = this._itemAmountWindow.lineHeight()/2;
    this._itemAmountWindow.contents.clear(); 
    this._itemAmountWindow.drawItemName(item,0,y,this.mainFontSize()*10);
    y += this._itemAmountWindow.lineHeight()*1.5;
    this._itemAmountWindow.drawText($gameParty.numItems(item), this.mainFontSize()/2, y, this.mainFontSize()*9, "right");
    this._itemAmountWindow.changeTextColor(ColorManager.systemColor());
    this._itemAmountWindow.drawText("持っている数",this.mainFontSize()/2, y, this.mainFontSize()*9);
    this._itemAmountWindow.resetTextColor();
};

Scene_Item.prototype.categoryWindowRect = function() {
    const wx = 0;
    const wy = 0;
    const ww = Graphics.width-this.mainFontSize()*7;
    const wh = this.mainFontSize()*3;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Item.prototype.itemWindowRect = function() {
    const wx = 0;
    const wy = this._categoryWindow.height;
    const ww = Graphics.width;
    const wh = Graphics.height-this.mainFontSize()*7;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Item.prototype.helpWindowRect = function() {
    const wx = 0;
    const wy = Graphics.height - this.mainFontSize()*4;
    const ww = Graphics.width;
    const wh = this.mainFontSize()*4;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Item.prototype.showActorWindow = function() {
    this._actorWindow.show();
    this._actorWindow.activate();
};

var _scene_Item_onCategoryOk = Scene_Item.prototype.onCategoryOk;
Scene_Item.prototype.onCategoryOk = function() {
    if(this._categoryWindow.index() == 1){
        this.sort();
        this._categoryWindow.activate();
    }else{
        _scene_Item_onCategoryOk.apply(this,arguments);
    }
};

Scene_Item.prototype.sort = function() {
    $gameParty.itemOrderReset();
    this._itemWindow._index = 0;
    this._itemWindow.refresh();
};

var _scene_item_onItemOK = Scene_Item.prototype.onItemOk;
Scene_Item.prototype.onItemOk = function() {
    if(this._itemWindow._subIndex < 0){
       this._itemWindow._subIndex = this._itemWindow._index;
        this._itemWindow.activate();
    }else if(this._itemWindow._subIndex == this._itemWindow._index){
        this._itemWindow._subIndex = -1;
        _scene_item_onItemOK.apply(this,arguments);
    }else{
        $gameParty.itemOrderExchange(this._itemWindow._subIndex,this._itemWindow._index)
        this._itemWindow.refresh();
        this._itemWindow.activate();
       this._itemWindow._subIndex = -1;
    }
};

var _scene_item_onItemCancel = Scene_Item.prototype.onItemCancel;
Scene_Item.prototype.onItemCancel = function() {
    if(!this._itemWindow._subIndex||this._itemWindow._subIndex < 0){
        _scene_item_onItemCancel.apply(this,arguments);
    }else{
       this._itemWindow._index = this._itemWindow._subIndex
       this._itemWindow._subIndex = -1;
       this._itemWindow.activate();
    }
};

Scene_Item.prototype.hideActorWindow = function() {
    this._actorWindow.hide();
    this._itemAmountWindow.hide();
    this._actorWindow.deactivate();
};

Scene_Item.prototype.determineItem = function() {
    const action = new Game_Action(this.user());
    const item = this.item();
    action.setItemObject(item);
    if (action.isForFriend() || item.meta.forFriendOnMap) {
        this.showActorWindow();
        this._actorWindow.selectForItem(this.item());
        this.refreshItemAmountWindow(this.item());
        this._itemAmountWindow.show();
    } else {
        this.useItem();
        this.activateItemWindow();
    }
};

Scene_Item.prototype.actorWindowRect = function() {
    const wx = 0;
    const wy = 0;
    const ww = Graphics.boxWidth - this.mainCommandWidth()-16;
    const wh = this.mainAreaHeight() + this.helpAreaHeight();
    return new Rectangle(wx, wy, ww, wh);
};

Window_ItemCategory.prototype.makeCommandList = function() {
    if (this.needsCommand("item")) {
        this.addCommand("つかう", "item");
    }
    if (this.needsCommand("sort")) {
        this.addCommand("せいとん", "item");
    }
    if (this.needsCommand("keyItem")) {
        this.addCommand(TextManager.keyItem, "keyItem");
    }
};

Window_ItemCategory.prototype.needsCommand = function(name) {
    const table = ["item", "weapon", "armor", "keyItem"];
    const index = table.indexOf(name);
    if (index >= 0) {
        return $dataSystem.itemCategories[index];
    }
    return true;
};

Window_ItemCategory.prototype.maxCols = function() {
    return 3;
};

Window_ItemCategory.prototype.lineHeight = function() {
    return this.height-this.padding*2;
};

const _window_ItemList_initialize= Window_ItemList.prototype.initialize
Window_ItemList.prototype.initialize = function() {
    _window_ItemList_initialize.apply(this,arguments);
    this.createHandCursor();
};

const _window_ItemList_update= Window_ItemList.prototype.update
Window_ItemList.prototype.update = function() {
    _window_ItemList_update.apply(this,arguments);
    
    if (!this.active) {
        this.setCursorRect(0, 0, 0, 0);
    }
    
    if (this._handCursorSprite && this.active) {
        const rect = this.itemRect(this.index());
        this._handCursorSprite.visible = true;

        // 指マークを矩形の左端に配置（Y座標は中央）
        this._handCursorSprite.x = rect.x - this._handCursorSprite.width + 10;
        this._handCursorSprite.y = rect.y + (rect.height - this._handCursorSprite.height) / 2 -this._scrollY % this.scrollBlockHeight()+4;
    } else if (this._handCursorSprite) {
        this._handCursorSprite.visible = false;
    }

    if (this._tempHandCursorSprite && this._subIndex > -1) {
        const rect = this.itemRect(this._subIndex);
        this._tempHandCursorSprite.visible = true;
        this._tempHandCursorSprite.opacity = 191;

        // 指マークを矩形の左端に配置（Y座標は中央）
        this._tempHandCursorSprite.x = rect.x - this._tempHandCursorSprite.width + 10;
        this._tempHandCursorSprite.y = rect.y + (rect.height - this._tempHandCursorSprite.height) / 2- this._scrollY % this.scrollBlockHeight() +2;
    } else if (this._tempHandCursorSprite || this._subIndex == -1) {
        this._tempHandCursorSprite.visible = false;
    }
};

Window_ItemList.prototype.colSpacing = function() {
    return 2;
};

Window_ItemList.prototype.lineHeight = function() {
    return Math.floor(this.height/10);
};


Window_ItemList.prototype.processOk = function() {
    if (this.isCurrentItemEnabled()) {
        this.playOkSound();
        this.updateInputData();
        this.deactivate();
        this.callOkHandler();
    } else {
        if(this._subIndex == this._index){
            this._subIndex = -1;
            this.playBuzzerSound();
        }else{
            this.playOkSound();   
            this.updateInputData(); 
            this.callOkHandler();        
        }
    }
};

Window_ItemList.prototype.drawText = function(text, x, y, maxWidth, align) {
    this.contents.drawText(text, x, y, maxWidth+2, this.lineHeight(), align);
};

Window_ItemList.prototype.includes = function(item) {
    switch (this._category) {
        case "item":
            if(DataManager.isItem(item) && item.itypeId === 1){
                return true;
            }
            if(DataManager.isWeapon(item) || DataManager.isArmor(item)){
                return true;
            }
            return false;
        case "weapon":
            return DataManager.isWeapon(item);
        case "armor":
            return DataManager.isArmor(item);
        case "keyItem":
            return DataManager.isItem(item) && item.itypeId === 2;
        case "release":
            return item.meta.release && item.meta.release > 0;
        default:
            return false;
    }
};

Window_ItemList.prototype.makeItemList = function() {
    this._data = [];
    const itemOrder = $gameParty.itemOrder();
    if(this._category == "keyItem"){
        this._data = $gameParty.allItems().filter(item => this.includes(item)&& item.itypeId === 2);
        if (this.includes(null)) {
            this._data.push(null);
        }
        return;
    }
    for(let i=0;i < itemOrder.length;i++){
        if(itemOrder[i] && $gameParty.numItems(itemOrder[i]) > 0){
            if(this._category == "item" && itemOrder[i].itypeId === 1){
                this._data.push(itemOrder[i]);
            }else if(this._category == "item" && DataManager.isWeapon(itemOrder[i])){
                this._data.push(itemOrder[i]);
            }else if(this._category == "item" && DataManager.isArmor(itemOrder[i])){
                this._data.push(itemOrder[i]);
            }else if(this._category == "release" && itemOrder[i].meta.release && itemOrder[i].meta.release > 0){
                this._data.push(itemOrder[i]);
            }
        }
    }
    console.log(this._data)
};

Window_ItemList.prototype.processHandling = function() {
    Window_Selectable.prototype.processHandling.call(this);
    if (this.isOpenAndActive()) {
        if (this.isHandled("shift") && Input.isTriggered("shift")) {
            return this.processShift();
        }
    }
};

Window_ItemList.prototype.processShift = function() {
    this.playOkSound();
    this.updateInputData();
    this.deactivate();
    this.callShiftHandler();
};

Window_ItemList.prototype.callShiftHandler = function() {
    this.callHandler("shift");
};

Window_ItemList.prototype.createHandCursor = function() {
    const bitmap = ImageManager.loadSystem("cursor");
    this._tempHandCursorSprite = new Sprite(bitmap);
    this._handCursorSprite = new Sprite(bitmap);
    this.addChild(this._tempHandCursorSprite);
    this.addChild(this._handCursorSprite);
};


Scene_ItemBase.prototype.applyItem = function() {
    const action = new Game_Action(this.user());
    action.setItemObject(this.item());
    console.log(action)
    for (const target of this.itemTargetActors()) {
        for (let i = 0; i < action.numRepeats(); i++) {
            action.apply(target);
            const result = target.result();
            if (result.hpDamage != 0) {
                action.executeHpDamage(target, result.hpDamage);
                action.gainAttackDrainedHp(result);
            }
            if (result.mpDamage != 0) {
                action.executeMpDamage(target, result.mpDamage);
                action.gainAttackDrainedMp(result);
            }        
            for (const effect of action.item().effects) {
                action.applyItemEffect(target, effect);
            }
            target.clearResults();
        }
    }
    action.applyGlobal();
};

const _Scene_ItemBase_itemTargetActors = Scene_ItemBase.prototype.itemTargetActors;
Scene_ItemBase.prototype.itemTargetActors = function() {
    const item = this.item();
    if(item.meta.forFriendOnMap){
        return [$gameParty.members()[this._actorWindow.index()]];
    }
    
    return _Scene_ItemBase_itemTargetActors.apply(this,arguments);
};

const _Scene_ItemBase_useItem = Scene_ItemBase.prototype.useItem;
Scene_ItemBase.prototype.useItem = function() {
    _Scene_ItemBase_useItem.apply(this,arguments);
    if(this.item().meta.souleater){
       $gameSwitches.setValue(112,true);
    }
    if(this._itemAmountWindow){
        this.refreshItemAmountWindow(this.item());
    }
    if(this._statusWindow){
       this._statusWindow.refresh();
    }
};

const _game_Party_maxItems = Game_Party.prototype.maxItems;
Game_Party.prototype.maxItems = function(item) {
    if(DataManager.isGun(item)){
        return 300;
    }
    return _game_Party_maxItems.apply(this,arguments);
};

DataManager.isGun = function(item){
    if(this.isWeapon(item)){
        if(item.wtypeId == 22){
            return true;
        }
    }
    return false;
}