//=============================================================================
// FNG_BattleItemWindow.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc バトル中のアイテムウィンドウの仕様変更
  * @author finga
  * @help バトルとメニューのアイテムウィンドウを別物とする
*/

Window_BattleItem.prototype.throwableType = function(){
    //投げられる武器のタイプ
    if(this._hideMode){
        return [7];
    }
    return [1,2,3,4,5,6,7,11,12,14,15,16,17];
}

Window_BattleItem.prototype.setCategory = function(category,hidemode = false) {
    if (this._category !== category) {
        this._category = category;
        this.refresh();
        this.scrollTo(0, 0);
        this.resetTextColor();
    }
    //隠れている時の投げるアイテム
    this._hideMode = hidemode;
};

Window_BattleItem.prototype.makeItemList = function() {
    this._data = [];
    const itemOrder = $gameParty.itemOrder();
    for(let i=0;i < itemOrder.length;i++){
        if(itemOrder[i] && $gameParty.numItems(itemOrder[i]) > 0){
            if(itemOrder[i].itypeId === 1){
                if(this._category == "release" && itemOrder[i].meta.release && itemOrder[i].meta.release > 0){
                    this._data.push(itemOrder[i]);
                }else if(this._category == "chogo" && itemOrder[i].meta.chogo){
                    this._data.push(itemOrder[i]);
                }else if(this._category == "throw" && itemOrder[i].meta.throw){
                    if(!this._hideMode){
                        this._data.push(itemOrder[i]);
                    }else if(this._hideMode && itemOrder[i].meta.hidethrow){
                        this._data.push(itemOrder[i]);
                    }
                }else if(this._category == "item"){
                    if(!itemOrder[i].meta.release&&!itemOrder[i].meta.throw){
                        this._data.push(itemOrder[i]);
                    }
                }
            }
        }
    }
    for(let i=0;i < itemOrder.length;i++){
        if(itemOrder[i] && $gameParty.numItems(itemOrder[i]) > 0){
            if(this._category == "throw" &&
               DataManager.isWeapon(itemOrder[i]) &&
               this.throwableType().includes(itemOrder[i].wtypeId)){
                this._data.push(itemOrder[i]);
            }
        }
    }
};

Scene_Battle.prototype.onItemShift = function() {
    if(this._helpWindow.visible){
        this._helpWindow.hide()
    }else{
        this._helpWindow.show()        
    }
}

const _Scene_Battle_onItemOk = Scene_Battle.prototype.onItemOk;
Scene_Battle.prototype.onItemOk = function() {
    const item = this._itemWindow.item();
    //console.log(this._itemWindow);
    if(this._itemWindow._category == "chogo"){
        if(this._itemWindow._subIndex < 0){
           this._itemWindow._subIndex = this._itemWindow._index;
            this._itemWindow.activate();
        }else{
            const item1 = this._itemWindow.itemAt(this._itemWindow._subIndex);
            const item2 = this._itemWindow.itemAt(this._itemWindow._index);
            const skill = BattleManager.chogoSkill(item1,item2);
            const action = BattleManager.inputtingAction();
            action.setSkill(skill.id);
            action.subject().setChogoConsumeId(item1,item2);
            this.onSelectAction();
            this._itemWindow._subIndex = -1;
        }
    }else if(this._itemWindow._category == "release"){
        const item = this._itemWindow.item();
        const action = BattleManager.inputtingAction();
        if(!item){
            SoundManager.playBuzzer();
            return;
        }
        action.setItem(item.id);
        $gameParty.setLastItem(item);
        this.onSelectAction();
        SoundManager.playOk();
        this._itemWindow.deactivate();
    }else if(item.occasion == 0 ||item.occasion == 1){
        _Scene_Battle_onItemOk.apply(this,arguments);
    }else if(this._itemWindow._category == "throw" && DataManager.isWeapon(item)){
        const action = BattleManager.inputtingAction();
        action.setSkill(249);
        action.subject().setThrowWeapon(item);
        if(action){
            const weapon = action.subject().throwWeapon();
            if(DataManager.isSkill(weapon)&&weapon.meta.throw){
                if(weapon.image){
                    ImageManager.loadSystem("Weapons/"+weapon.meta['image'].split(',')[0]);
                }else{
                    const wtypeId = weapon.wtypeId
                    const attackMotion = $dataSystem.attackMotions[wtypeId];
                    const pageId = Math.floor((attackMotion.weaponImageId - 1) / 12) + 1;
                    this.bitmap = ImageManager.loadSystem("Weapons" + pageId);
                }
            }
        }
        this.onSelectAction();
        SoundManager.playOk();
    }else{
        SoundManager.playBuzzer();
    }
};

Window_BattleItem.prototype.itemRect = function(index) {
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
    return new Rectangle(x, y, width, height);
};

Window_BattleItem.prototype.lineHeight = function() {
    return $TILE/2;
};

Window_BattleItem.prototype.colSpacing = function() {
    return $TILE/2;
};

const _Scene_Battle_createItemWindow = Scene_Battle.prototype.createItemWindow;
Scene_Battle.prototype.createItemWindow = function() {
    _Scene_Battle_createItemWindow.apply(this,arguments);
    this._itemWindow.setHandler("up", this.onItemUp.bind(this));
    //this._itemWindow.setHandler("shift", this.onItemShift.bind(this));
};

Scene_Battle.prototype.onItemUp = function() {    
    if(this._itemWindow.index() < 2 && this._itemWindow._category == "item"){
        this._equipWindow.setActor(this._actorCommandWindow.actor());
        this._equipWindow.refresh();
        this._equipWindow.visible = true;
        this._equipWindow._index = this._itemWindow.index();
        this._equipWindow.activate();
        this._itemWindow.deactivate();
        this._itemWindow.playCursorSound();
    }else{
        if(this._itemWindow.index() >= 2){
            this._itemWindow.playCursorSound();
            this._itemWindow.cursorUp(Input.isRepeated("up"));
        }
    }
}

Window_BattleItem.prototype.processCursorMove = function() {
    if (this.isCursorMovable()) {
        const lastIndex = this.index();
        if (Input.isRepeated("down")) {
            this.cursorDown(Input.isTriggered("down"));
        }
        if (Input.isRepeated("up")) {
            //this.cursorUp(Input.isTriggered("up"));
            this.callHandler("up");
        }
        if (Input.isRepeated("shift")) {
            //this.cursorUp(Input.isTriggered("up"));
            //this.callHandler("up");
        }
        //upはHandringで処理
        if (Input.isRepeated("right")) {
            this.cursorRight(Input.isTriggered("right"));
        }
        if (Input.isRepeated("left")) {
            this.cursorLeft(Input.isTriggered("left"));
        }
        if (!this.isHandled("pagedown") && Input.isTriggered("pagedown")) {
            this.cursorPagedown();
        }
        if (!this.isHandled("pageup") && Input.isTriggered("pageup")) {
            this.cursorPageup();
        }
        if (this.index() !== lastIndex) {
            this.playCursorSound();
        }
    }
};

Window_BattleItem.prototype.isEnabled = function(item){
    if(this._category == "item"){
        if(item.meta.throw){
            return false;
        }
       return Window_ItemList.prototype.isEnabled.call(this,item);
    }else if(this._category == "chogo"){
        return true;
    }else if(this._category == "throw"){
        if(DataManager.isWeapon(item)){
            return this.throwableType().includes(item.wtypeId);
        }
        return true;
    }else if(this._category == "release"){
        return true;
    }
}

const _scene_battle_createAllWindows5 = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
    _scene_battle_createAllWindows5.apply(this,arguments);
    this.createEquipWindow();
    this.createEquipListWindow();
};

Scene_Battle.prototype.createEquipListWindow = function() {
    const rect = this.equipListWindowRect();
    this._equipListWindow = new Window_BattleEquipList(rect);
    this._equipListWindow.setHandler("ok", this.onEquipListOk.bind(this));
    this._equipListWindow.setHandler("cancel", this.onEquipListCancel.bind(this));
    this._equipListWindow.visible = false;
    this._equipListWindow.setEquipWindow(this._equipWindow);
    this.addWindow(this._equipListWindow);
};

Scene_Battle.prototype.equipListWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = this.windowAreaHeight()-this._equipWindow.height+$TILE/16*5;
    const wx = 0;
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.onEquipListOk = function() {
    const item = this._equipListWindow.item()
    if(item == "つかう"){
        const skill = $dataSkills[Number(this._equipWindow.item().meta.use)];
        const action = BattleManager.inputtingAction();
        action.setSkill(skill.id);
        this.onSelectAction();
        this._itemWindow.hide();
        this._equipWindow.hide();
        this._equipListWindow.hide();
        this._equipListWindow.deactivate();
    }else if(item == "はずす"){
        SoundManager.playEquip();
        const actor = this._equipWindow.actor();
        actor.changeEquip(this._equipWindow.index(), null);
        this._equipWindow.activate();
        this._equipWindow.refresh();
        this._equipWindow.show();  
        this._equipListWindow.hide();     
        this._equipListWindow.deactivate(); 
    }else if(item == null){
        SoundManager.playBuzzer();
        this._equipListWindow.show();     
        this._equipListWindow.activate(); 
    }else{
        SoundManager.playEquip();
        const actor = this._equipWindow.actor();
        actor.changeEquip(this._equipWindow.index(), item);
        if(item.meta.image){
            ImageManager.loadSystem("Weapons/"+item.meta['image'].split(',')[0]);
        }
        this._equipWindow.activate();
        this._equipWindow.refresh();
        this._equipWindow.show();
        this._equipListWindow.hide();
        this._equipListWindow.deactivate();
    }
}

const _Scene_Battle_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
Scene_Battle.prototype.onEnemyCancel = function() {
    const item = BattleManager.inputtingAction()._item;
    if(this._actorCommandWindow.isShowingODWindow()){
        SoundManager.playCancel();
        this._enemyWindow.hide();
        this._enemyWindow.deactivate();
        this._enemyWindow.deselect();
        this._skillWindow.show();
        this._skillWindow.activate();
        return;
    }
    if(item.isSkill(item) && $dataSkills[item._itemId].stypeId == 29){
        SoundManager.playCancel();
        this._enemyWindow.hide();
        this._enemyWindow.deactivate();
        this._enemyWindow.deselect();
        this._itemWindow.show();
        this._equipWindow.show();
        this._equipListWindow.show();
        this._equipListWindow.activate();
        return;
    }
    if(item.isSkill(item) && $dataSkills[item._itemId].meta.chogo){
        SoundManager.playCancel();
        this._enemyWindow.hide();
        this._enemyWindow.deactivate();
        this._enemyWindow.deselect();
        this._itemWindow.show();
        this._itemWindow.activate();
        return;
    }
    _Scene_Battle_onEnemyCancel.apply(this, arguments);
};

const _Scene_Battle_onActorCancel = Scene_Battle.prototype.onActorCancel;
Scene_Battle.prototype.onActorCancel = function() {
    const item = BattleManager.inputtingAction()._item;
    if(this._actorCommandWindow.isShowingODWindow()){
        SoundManager.playCancel();
        this._actorWindow.hide();
        this._actorWindow.deactivate();
        this._actorWindow.deselect();
        this._skillWindow.show();
        this._skillWindow.activate();
        return;
    }
    if(item.isSkill(item) && $dataSkills[item._itemId].stypeId == 29){
        SoundManager.playCancel();
        this._actorWindow.hide();
        this._actorWindow.deactivate();
        this._itemWindow.show();
        this._equipWindow.show();
        this._equipListWindow.show();
        this._equipListWindow.activate();
        return;
    }
    if(item.isSkill(item) && $dataSkills[item._itemId].meta.chogo){
        SoundManager.playCancel();
        this._actorWindow.hide();
        this._actorWindow.deactivate();
        this._itemWindow.show();
        this._itemWindow.activate();
        return;
    }
    _Scene_Battle_onActorCancel.apply(this, arguments);
};

Scene_Battle.prototype.onEquipListCancel = function() {
    SoundManager.playCancel();
    this._equipListWindow.deactivate();
    this._equipListWindow.hide();
    this._equipWindow.activate();
    this._equipWindow.refresh();
    this._equipWindow.show();
}

Scene_Battle.prototype.createEquipWindow = function() {
    const rect = this.equipWindowRect();
    this._equipWindow = new Window_BattleEquip(rect);
    this._equipWindow.setHandler("ok", this.onEquipOk.bind(this));
    this._equipWindow.setHandler("down", this.onEquipDown.bind(this));
    this._equipWindow.visible = false;
    this.addWindow(this._equipWindow);
};

Scene_Battle.prototype.onEquipOk = function() {
    //console.log(this._equipWindow.index)
    if(!this._equipWindow.isEnabled(this._equipWindow.index())){
        this._equipWindow.playBuzzerSound();
        this._equipWindow.show();
        this._equipWindow.activate();
        return;
    }
    this._equipWindow.playCursorSound();
    this._equipWindow.deactivate();
    this._equipListWindow.setActor(this._equipWindow.actor());
    this._equipListWindow._index = 0;
    this._equipListWindow.refresh();
    this._equipListWindow.show();
    this._equipListWindow.activate();
}

Scene_Battle.prototype.onEquipDown = function() {
    this._equipWindow.visible = false;
    this._equipWindow.deactivate();
    this._itemWindow.activate();
    this._itemWindow.playCursorSound();
}

Scene_Battle.prototype.equipWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = $TILE/2+$TILE/8*5;
    const wx = 0;
    const wy = this._itemWindow.y;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.isSkillOrItemCommandSelecting = function() {
    return this._skillWindow.active || this._itemWindow.active || this._actorSubCommandWindow.active || this._equipWindow.active || this._equipListWindow.active || this._subActorWindow.active;;
};

const _scene_Battle_isAnyInputWindowActive2 = Scene_Battle.prototype.isAnyInputWindowActive;
Scene_Battle.prototype.isAnyInputWindowActive = function() {
    return this._equipWindow.active || this._equipListWindow.active || _scene_Battle_isAnyInputWindowActive2.apply(this,arguments);
};

function Window_BattleEquip() {
    this.initialize(...arguments);
}

Window_BattleEquip.prototype = Object.create(Window_Selectable.prototype);
Window_BattleEquip.prototype.constructor = Window_BattleEquip;

Window_BattleEquip.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._actor = null;
};

Window_BattleEquip.prototype.setActor = function(actor){
    this._actor = actor;
}

Window_BattleEquip.prototype.actor = function(){
    return this._actor;
}

Window_BattleEquip.prototype.processCursorMove = function() {
    if (this.isCursorMovable()) {
        const lastIndex = this.index();
        //upはなし・downはHandringで処理
        if (Input.isRepeated("right")) {
            this.cursorRight(Input.isTriggered("right"));
        }
        if (Input.isRepeated("left")) {
            this.cursorLeft(Input.isTriggered("left"));
        }
        if (!this.isHandled("pagedown") && Input.isTriggered("pagedown")) {
            this.cursorPagedown();
        }
        if (!this.isHandled("pageup") && Input.isTriggered("pageup")) {
            this.cursorPageup();
        }
        if (this.index() !== lastIndex) {
            this.playCursorSound();
        }
    }
};

Window_BattleEquip.prototype.processHandling = function() {
    Window_Selectable.prototype.processHandling.call(this);
    if (this.isOpenAndActive()) {
        if (this.isHandled("down") && Input.isTriggered("down")) {
            return this.processDown();
        }
    }
};

Window_BattleEquip.prototype.processDown = function() {
    //this.updateInputData();
    this.callHandler("down");
};

Window_BattleEquip.prototype.maxCols = function() {
    return 2;
};

Window_BattleEquip.prototype.maxItems = function() {
    return 2;
};

Window_BattleEquip.prototype.colSpacing = function() {
    return 16;
};

Window_BattleEquip.prototype.lineHeight = function() {
    return $TILE/2;
};


Window_BattleEquip.prototype.item = function() {
    return this._actor.equips()[this.index()];
};

Window_BattleEquip.prototype.itemAt = function(index) {
    return this._actor.equips()[index];
};

Window_BattleEquip.prototype.makeItemList = function() {
    this._data = [];
    this._data.push(this.actor().equips()[0]);
    this._data.push(this.actor().equips()[1]);
};

Window_BattleEquip.prototype.drawItem = function(index) {
    const item = this.itemAt(index);
    if (item) {
        const rect = this.itemLineRect(index);
        this.changeTextColor(ColorManager.systemColor());
        if(DataManager.isWeapon(item)){
            this.drawText("Weapon", rect.x, rect.y, rect.width);
        }else{
            this.drawText("Shield", rect.x, rect.y, rect.width);          
        }
        this.resetTextColor();
        if(DataManager.isGun(item)){
            this.drawText($gameParty.numItems(item)+1, rect.x, rect.y, rect.width+8,"right");
        }
        this.changePaintOpacity(this.isEnabled(index));
        this.drawItemName(item, rect.x+$TILE, rect.y, rect.width);
        this.changePaintOpacity(true);
    }
};

Window_BattleEquip.prototype.isEnabled = function(index) {
    this.makeItemList();
    if(this._data.length<index){
        return true;
    }
    const item = this._data[index];
    if(DataManager.isWeapon(item)){
        if(item.meta.paladin||item.meta.sonion){
            return false;
        }
    }
    return true;
};

Window_BattleEquip.prototype.refresh = function() {
    Window_Selectable.prototype.refresh.call(this);
    this.makeItemList();
    this.drawItem(0);
    this.drawItem(1);
};

function Window_BattleEquipList() {
    this.initialize(...arguments);
}

Window_BattleEquipList.prototype = Object.create(Window_Selectable.prototype);
Window_BattleEquipList.prototype.constructor = Window_BattleEquipList;

Window_BattleEquipList.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._actor = null;
    this._equipWindow = null;
    this._data = [];
};


Window_BattleEquipList.prototype.setEquipWindow = function(_equipWindow){
    this._equipWindow = _equipWindow;
}

Window_BattleEquipList.prototype.setActor = function(actor){
    this._actor = actor;
}

Window_BattleEquipList.prototype.actor = function(){
    return this._actor;
}

Window_BattleEquipList.prototype.maxCols = function() {
    return 2;
};

Window_BattleEquipList.prototype.colSpacing = function() {
    return 16;
};

Window_BattleEquipList.prototype.item = function() {
    return this._data[this.index()];
};

Window_BattleEquipList.prototype.itemAt = function(index) {
    return this._data[index];
};

Window_BattleEquipList.prototype.makeItemList = function() {
    this._data = [];
    if(!this._actor){
        return;
    }
    const currentEquip = this._equipWindow.item();
    if(currentEquip && currentEquip.meta.use){
        this._data.push("つかう");
    }
    const allItems = $gameParty.allItems();
    for(item of allItems){
        if(DataManager.isWeapon(item)||(DataManager.isArmor(item)&&item.etypeId==2)){
            if(this.category() == "weapon" && DataManager.isWeapon(item) && this.actor().canEquip(item)){
                this._data.push(item);
            }
            if(this.category() == "shield" && DataManager.isArmor(item) && item.etypeId==2 && this.actor().canEquip(item)){
                this._data.push(item);
            }
        }
    }
    if(currentEquip){
        this._data.push("はずす");
    }
};

Window_BattleEquipList.prototype.category = function(){
    if(!this._equipWindow||!this._actor){
        return null;
    }
    if(this._equipWindow._index == 0){
        return "weapon";
    }else{
        if(this._actor.isDualWield()){
            return "weapon";
        }else{
            return "shield";
        }
    }
}

Window_BattleEquipList.prototype.numberWidth = function() {
    return this.textWidth("00");
};

Window_BattleEquipList.prototype.needsNumber = function() {
    return true;
};

Window_BattleEquipList.prototype.drawItemNumber = function(item, x, y, width) {
    if (this.needsNumber()) {
        this.drawText(":", x, y, width - this.textWidth("00"), "right");
        this.drawText($gameParty.numItems(item), x, y, width, "right");
    }
};

Window_BattleEquipList.prototype.drawItem = function(index) {
    const item = this.itemAt(index);
    const rect = this.itemLineRect(index);
    if(item == "つかう"||item == "はずす"){
        this.drawText(item, rect.x, rect.y, rect.width);
    }else if(item){
        const numberWidth = this.numberWidth();
        this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
        this.drawItemNumber(item, rect.x, rect.y, rect.width);
    }
};

Window_BattleEquipList.prototype.maxItems = function() {
    return this._data.length;
}

Window_BattleEquipList.prototype.drawAllItems = function() {
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

Window_BattleEquipList.prototype.refresh = function() {
    Window_Selectable.prototype.refresh.call(this);
    this.makeItemList();
    this.drawAllItems();
};