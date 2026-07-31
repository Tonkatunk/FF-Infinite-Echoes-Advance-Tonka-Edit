Scene_Equip.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createStatusWindow();
    this.createSlotWindow();
    this.createCommandWindow();
    this.createItemWindow();
    this.createMenuNameWindow("そうび");
    this.createHelpWindow();
    this._helpWindow.hide();
    this._slotWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this.refreshActor();
};

const _Scene_Equip_createSlotWindow = Scene_Equip.prototype.createSlotWindow;
Scene_Equip.prototype.createSlotWindow = function() {
    _Scene_Equip_createSlotWindow.apply(this,arguments);
    this._slotWindow.setHandler("pagedown", this.nextActorOnSlot.bind(this));
    this._slotWindow.setHandler("pageup", this.previousActorOnSlot.bind(this));
};

Scene_Equip.prototype.nextActorOnSlot = function() {
    const i = this._slotWindow.index();
    $gameParty.makeMenuActorNext();
    this.updateActor();
    this.onActorChange();
    this._slotWindow.activate();
    this._slotWindow.select(i);
    this._commandWindow.deactivate();
};

Scene_MenuBase.prototype.previousActorOnSlot = function() {
    const i = this._slotWindow.index();
    $gameParty.makeMenuActorPrevious();
    this.updateActor();
    this.onActorChange();
    this._slotWindow.activate();
    this._slotWindow.select(i);
    this._commandWindow.deactivate();
};

Scene_Equip.prototype.createMenuNameWindow = function(name) {
    const commaRect = this.commandWindowRect();
    var rect = new Rectangle(commaRect.width, 0, Graphics.width-commaRect.width,this.mainFontSize()*3.75);
    this._menuNameWindow = new Window_MenuName(rect);
    this._menuNameWindow.drawMenuName(name);
    this.addWindow(this._menuNameWindow);
};

Scene_Equip.prototype.createItemWindow = function() {
    const rect = this.itemWindowRect();
    this._itemWindow = new Window_EquipItem(rect);
    this._itemWindow.setStatusWindow(this._statusWindow);
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this._slotWindow.setItemWindow(this._itemWindow);
    this.addWindow(this._itemWindow);
};

Scene_Equip.prototype.helpWindowRect = function() {
    const wx = 0;
    const wy = 0;
    const ww = Graphics.boxWidth;
    const wh = this.mainFontSize()*3.75;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.itemWindowRect = function() {
    const commandWindowRect = this.commandWindowRect();
    const slotRect = this.slotWindowRect();
    const wx = 0;
    const wy = Math.floor(slotRect.y + slotRect.height - this.mainFontSize()/2 - this.mainFontSize()/8);
    const ww = Graphics.boxWidth/2+Graphics.boxWidth/240*8;
    const wh = Graphics.boxHeight-(slotRect.y + slotRect.height)+this.mainFontSize()*5/8;
    return new Rectangle(wx, wy, ww, wh);    
};

Scene_Equip.prototype.onActorChange = function() {
    Scene_MenuBase.prototype.onActorChange.call(this);
    this.refreshActor();
    this._slotWindow.deselect();
    this._slotWindow.deactivate();
    this._commandWindow.activate();
};

Scene_Equip.prototype.commandEquip = function() {
    this._slotWindow.activate();
    this._slotWindow.select(0);
    this._helpWindow.show();
};

Scene_Equip.prototype.onSlotCancel = function() {
    this._slotWindow.deselect();
    this._commandWindow.activate();
    this._helpWindow.hide();
};

Scene_Equip.prototype.onSlotOk = function() {
    this._itemWindow.refresh();
    this._itemWindow.activate();
    this._itemWindow.select(0);
};

Scene_Equip.prototype.onItemCancel = function() {
    this._slotWindow.activate();
    this._itemWindow.deselect();
};

Scene_Equip.prototype.onItemOk = function() {
    SoundManager.playEquip();
    this.executeEquipChange();
    this._slotWindow.refresh();
    this._itemWindow.refresh();
    this._statusWindow.refresh();
    this._slotWindow.activate();
};

Scene_Equip.prototype.slotWindowRect = function() {
    const commandWindowRect = this.commandWindowRect();
    const wx = 0;
    const wy = commandWindowRect.y + commandWindowRect.height - this.mainFontSize()/2;
    const ww = Graphics.boxWidth/2+Graphics.boxWidth/240*8;
    const wh = Graphics.boxHeight*29/80;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.statusWindowRect = function() {
    const commandWindowRect = this.commandWindowRect();
    const wx = Graphics.boxWidth/2+Graphics.boxWidth/240*8;
    const wy = commandWindowRect.y + commandWindowRect.height;
    const ww = Graphics.boxWidth/2-Graphics.boxWidth/240*8;
    const wh = Graphics.boxHeight - commandWindowRect.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.commandWindowRect = function() {
    const wx = 0;
    const wy = 0;
    const ww = Graphics.boxWidth - this.mainFontSize()*6;
    const wh = this.mainFontSize()*3.75;
    return new Rectangle(wx, wy, ww, wh);
};

Window_EquipCommand.prototype.itemRect = function(index) {
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
    const height = this.height-this.padding*2;
    return new Rectangle(x, y, width, height);
};

Window_EquipStatus.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        this.changeTextColor(ColorManager.normalColor());
        this.drawSvActor(this._actor.battlerName(), 10, -this.padding, 0);
        this.drawText(this._actor.name(), this.contents.fontSize*2.5, this.contents.fontSize*0.25, this.width-this.padding*2-this.contents.fontSize*3);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText("Lv.", this.contents.fontSize*9.5, this.contents.fontSize*0.25,this.contents.fontSize*2);
        this.changeTextColor(ColorManager.normalColor());
        this.drawText(this._actor._level, this.contents.fontSize*11, this.contents.fontSize*0.25,this.contents.fontSize);
        this.drawActorHp(this._actor, this.contents.fontSize*6, this.contents.fontSize*1.5, this.contents.fontSize*10);
        this.drawActorMp(this._actor, this.contents.fontSize*6, this.contents.fontSize*2.5, this.contents.fontSize*10);
        this.drawffParamItem(0, this.contents.fontSize*4.5, 0);
        this.drawffParamItem(0, this.contents.fontSize*5.5, 1);
        this.drawItem(0,this.contents.fontSize*6.5,3);
        this.drawItem(0,this.contents.fontSize*7.5,5);
        this.drawItem(0,this.contents.fontSize*9.5,4);
        this.drawItem(0,this.contents.fontSize*11.5,6);
        this.drawffParamItem(0, this.contents.fontSize*8.5, 2);
        this.drawffParamItem(0, this.contents.fontSize*10.5, 3);
        this.drawxParamItem(0, this.contents.fontSize*12.5, 
        0);
        this.drawxParamItem(0, this.contents.fontSize*13.5, 
        1);
    }
};

Window_EquipStatus.prototype.drawItem = function(x, y, paramId) {
    const paramX = this.paramX();
    const paramWidth = this.paramWidth();
    const rightArrowWidth = this.rightArrowWidth();
    this.drawParamName(x, y, paramId);
    if (this._actor) {
        this.drawCurrentParam(paramX, y, paramId);
    }
    this.drawRightArrow(paramX + paramWidth, y);
    if (this._tempActor) {
        this.drawNewParam(paramX + paramWidth + rightArrowWidth, y, paramId);
    }
};

Window_EquipStatus.prototype.drawxParamItem = function(x, y, paramId) {
    const paramX = this.paramX();
    const paramWidth = this.paramWidth();
    const rightArrowWidth = this.rightArrowWidth();
    this.drawxParamName(x, y, paramId);
    if (this._actor) {
        this.drawCurrentxParam(paramX, y, paramId);
    }
    this.drawRightArrow(paramX + paramWidth, y);
    if (this._tempActor) {
        this.drawNewxParam(paramX + paramWidth + rightArrowWidth, y, paramId);
    }
};

Window_EquipStatus.prototype.drawxParamName = function(x, y, paramId) {
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

Window_EquipStatus.prototype.drawCurrentxParam = function(x, y, paramId) {
    const paramWidth = this.paramWidth();
    this.resetTextColor();
    this.drawText(Math.floor(this._actor.xparam(paramId)*100), x, y, paramWidth, "right");
};

Window_EquipStatus.prototype.drawNewxParam = function(x, y, paramId) {
    const paramWidth = this.paramWidth();
    const newValue = this._tempActor.xparam(paramId);
    const diffvalue = newValue - this._actor.xparam(paramId);
    this.changeTextColor(ColorManager.paramchangeTextColor(diffvalue));
    this.drawText(Math.floor(newValue*100), x, y, paramWidth, "right");
};

Window_EquipStatus.prototype.drawffParamName = function(x, y, paramId) {
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

Window_EquipStatus.prototype.drawffParamItem = function(x, y, paramId) {
    const paramX = this.paramX();
    const paramWidth = this.paramWidth();
    const rightArrowWidth = this.rightArrowWidth();
    this.drawffParamName(x, y, paramId);
    if (this._actor) {
        this.drawCurrentffParam(paramX, y, paramId);
    }
    this.drawRightArrow(paramX + paramWidth, y);
    if (this._tempActor) {
        this.drawNewffParam(paramX + paramWidth + rightArrowWidth, y, paramId);
    }
};

Window_EquipStatus.prototype.drawNewffParam = function(x, y, paramId) {
    const paramWidth = this.paramWidth();
    const newValue = this._tempActor.ffparam(paramId);
    const diffvalue = newValue - this._actor.ffparam(paramId);
    this.changeTextColor(ColorManager.paramchangeTextColor(diffvalue));
    this.drawText(newValue, x, y, paramWidth, "right");
};

Window_EquipStatus.prototype.drawCurrentffParam = function(x, y, paramId) {
    const paramWidth = this.paramWidth();
    this.resetTextColor();
    this.drawText(this._actor.ffparam(paramId), x, y, paramWidth, "right");
};

Window_EquipStatus.prototype.drawParamName = function(x, y, paramId) {
    const width = this.paramX() - this.itemPadding() * 2;
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(TextManager.param(paramId), x, y, width);
};

Window_EquipStatus.prototype.drawCurrentParam = function(x, y, paramId) {
    const paramWidth = this.paramWidth();
    this.resetTextColor();
    this.drawText(this._actor.param(paramId), x, y, paramWidth, "right");
};

Window_EquipStatus.prototype.drawRightArrow = function(x, y) {
    const rightArrowWidth = this.rightArrowWidth();
    this.changeTextColor(ColorManager.systemColor());
    this.drawText("…", x, y, rightArrowWidth, "center");
};

Window_EquipStatus.prototype.drawNewParam = function(x, y, paramId) {
    const paramWidth = this.paramWidth();
    const newValue = this._tempActor.param(paramId);
    const diffvalue = newValue - this._actor.param(paramId);
    this.changeTextColor(ColorManager.paramchangeTextColor(diffvalue));
    this.drawText(newValue, x, y, paramWidth, "right");
};

Window_EquipStatus.prototype.rightArrowWidth = function() {
    return this.contents.fontSize;
};

Window_EquipStatus.prototype.paramWidth = function() {
    return this.contents.fontSize*1.5;
};

Window_EquipStatus.prototype.lineHeight = function() {
    return 8;
};

Window_EquipStatus.prototype.paramX = function() {
    const itemPadding = this.itemPadding();
    const rightArrowWidth = this.rightArrowWidth();
    const paramWidth = this.paramWidth();
    return this.innerWidth - itemPadding - paramWidth * 2 - rightArrowWidth;
};

Window_EquipStatus.prototype.paramY = function(index) {
    const faceHeight = ImageManager.faceHeight;
    return faceHeight + Math.floor(this.lineHeight() * (index + 1.5));
};

// HPゲージを表示しない
Window_EquipStatus.prototype.drawActorHp = function(actor, x, y, width) {
    
    const text = actor.hp + '/' + actor.mhp;
    
    //ゲージは描画しない
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.hpA, x, y);
    this.resetTextColor();
    this.drawText(text, x, y,4*12,'right');
};

//MPゲージを表示しない
Window_EquipStatus.prototype.drawActorMp = function(actor, x, y, width) {    
    const text = actor.mp + '/' + actor.mmp;
    
    //ゲージは描画しない
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.mpA, x, y);
    this.resetTextColor();
    this.drawText(text, x, y,4*12,'right');
};

Window_EquipItem.prototype.colSpacing = function() {
    return 0;
};

Window_EquipItem.prototype.lineHeight = function() {
    return this.mainfontSize;
};

Window_EquipItem.prototype.processOk = function() {
    if (this.isCurrentItemEnabled()) {
        this.playOkSound();
        this.updateInputData();
        this.deactivate();
        this.callOkHandler();
    } else {
        this.playBuzzerSound();
    }
};

Window_EquipItem.prototype.drawText = function(text, x, y, maxWidth, align) {
    this.contents.drawText(text, x, y, maxWidth, this.lineHeight(), align);
};

Window_EquipItem.prototype.includes = function(item) {
    if (item === null) {
        return true;
    }
    return (
        this._actor &&
        this._actor.canEquip(item) &&
        item.etypeId === this.etypeId()
    );
};

Window_EquipItem.prototype.makeItemList = function() {
    const orgData = $gameParty.allItems().filter(item => this.includes(item));
    this._data = [];
    const orderItems = [];
    for(item of orgData){
        if(!item.meta.sort){
            this._data.push(item);
        }else{
            orderItems.push(item);
        }
    }
    console.log(orderItems)
    for(item of orderItems){
        orderIndex = Number(item.meta.sort)
        console.log(orderIndex)
        var currentIndex;
        var nextIndex;
        for(i=-1;i<this._data.length;i++){
            if(i<0){
                currentIndex = 0;
            }else if(this._data[i].meta.sort){
                currentIndex = Number(this._data[i].meta.sort)
            }else{
                currentIndex = this._data[i].id;
            }
            if(this._data.length <= i+1||!this._data[i+1]){
                nextIndex = 9999;
            }else if(this._data[i+1].meta.sort){
                nextIndex = Number(this._data[i+1].meta.sort)
            }else{
                nextIndex = this._data[i+1].id;
            }
            console.log(currentIndex,nextIndex,orderIndex)
            if(currentIndex <= orderIndex && nextIndex > orderIndex){
                this._data.splice(i+1, 0, item);
                break;
            }
        }
    }
    if (this.includes(null)) {
        this._data.push(null);
    }
};

Window_EquipItem.prototype.drawItem = function(index) {
    const item = this.itemAt(index);
    if (item) {
        const numberWidth = this.numberWidth();
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
        this.drawItemNumber(item, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
    }
};

Window_EquipItem.prototype.lineHeight = function() {
    return (this.height-this.padding*2)/8;
};

Window_EquipSlot.prototype.drawItem = function(index) {
    if (this._actor) {
        const slotName = this.actorSlotName(this._actor, index);
        const item = this.itemAt(index);
        const slotNameWidth = this.slotNameWidth();
        const rect = this.itemLineRect(index);
        const itemWidth = this.width - slotNameWidth;
        this.changeTextColor(ColorManager.systemColor());
        this.changePaintOpacity(this.isEnabled(index));
        this.drawText(slotName, rect.x, rect.y, slotNameWidth, rect.height);
        this.drawItemName(item, rect.x + slotNameWidth - slotNameWidth/12, rect.y, itemWidth);
        if(DataManager.isGun(item)){
            this.drawText(":   ", rect.x + slotNameWidth - slotNameWidth/12, rect.y, itemWidth-12,"right");
            this.drawText($gameParty.numItems(item)+1, rect.x + slotNameWidth - slotNameWidth/12, rect.y, itemWidth-12,"right");
        }
        this.changePaintOpacity(true);
    }
};

Window_EquipSlot.prototype.slotNameWidth = function() {
    return this.contents.fontSize*3;
};

Window_EquipSlot.prototype.lineHeight = function() {
    return (this.height-this.padding*2)/6;
};

Game_Actor.prototype.optimizeEquipments = function() {
    const maxSlots = this.equipSlots().length;
    this.clearEquipments();

    //両手武器型・盾装備型・二刀流型・両手持ち型４つを比較する
    const singleStyleSet = this.singleStyleOptimizeSet();
    const sieldStyleSet = this.sieldStyleOptimizeSet();
    const dualStyleSet = this.dualStyleOptimizeSet();
    const twoHandedStyleSet = this.twoHandedStyleOptimizeSet();
    const scores = [this.equipsScore(singleStyleSet),
        this.equipsScore(sieldStyleSet),
        this.equipsScore(dualStyleSet),
        this.equipsScore(twoHandedStyleSet)];

    var bestScore = 0;
    var bestSetId = 0;
    for(let i = 0;i<scores.length;i++){
        if(scores[i]>=bestScore){
            bestSetId = i;
            bestScore = scores[i];
        } 
    }

    console.log(bestSetId);

    switch(bestSetId){
        case 0:
            this.setEquipSet(singleStyleSet); break;
        case 1:
            this.setEquipSet(sieldStyleSet); break;
        case 2:
            this.setEquipSet(dualStyleSet); break;
        case 3:
            this.setEquipSet(twoHandedStyleSet); break;
    }
}

Game_Actor.prototype.setEquipSet = function(equipSet){
    console.log(equipSet)
    this.changeEquip(5, equipSet[5]); 
    this.changeEquip(4, equipSet[4]);
    this.changeEquip(3, equipSet[3]);
    this.changeEquip(2, equipSet[2]);
    this.changeEquip(1, equipSet[1]);
    this.changeEquip(0, equipSet[0]);
}

//両手武器を含む武器一本の最強装備セットを返す
Game_Actor.prototype.singleStyleOptimizeSet = function() {
    var equipSet = [null,null,null,null,null,null];
    var bestScore = 0;
    var elements;
    var score = 0;
    if(this.isStateAffected(33)){
        if(this.isSniper()){ //後衛・スナイパー型
            if(this.hasSkill(320)){ //かくとう
                elements = this.getWeaponElements(0)
                score = this.cat + this.licenseWeaponPlus(0);
                if(!elements.includes(26)){
                    score /= 2;
                }
                bestScore = score;
            }
            //武器スコア--------------------------------------------------------------------
            for(weapon of $dataWeapons){
                if($gameParty.hasItem(weapon,false)
                    && this.canEquip(weapon)
                    && !weapon.meta.noOptimize){
                    elements = this.getWeaponElements(weapon);
                    score = weapon.params[2];
                    score += this.licenseWeaponPlus(weapon.wtypeId);
                    console.log(weapon,weapon.params,weapon.params[2],this.licenseWeaponPlus(weapon.wtypeId))
                    if(!elements.includes(26)){
                        score /= 2;
                    }
                    if(elements.includes(19)){
                        score *= 1.25;
                    }
                    if(bestScore <= score){
                        bestScore = score;
                        equipSet[0] = weapon;
                    }
                }
            }
        }else{
            //後衛・魔法型
            //武器スコア--------------------------------------------------------------------
            for(weapon of $dataWeapons){
                if($gameParty.hasItem(weapon,false)
                    && this.canEquip(weapon)
                    && !weapon.meta.noOptimize){
                    elements = this.getWeaponElements(weapon);
                    score = weapon.params[2]/2;
                    score += this.licenseWeaponPlus(weapon.wtypeId);
                    console.log(weapon,weapon.params,weapon.params[2],this.licenseWeaponPlus(weapon.wtypeId))
                    if(!elements.includes(26)){
                        score /= 2;
                    }
                    if(elements.includes(19)){
                        score *= 1.25;
                    }
                    score += weapon.params[4]*5;
                    if(bestScore <= score){
                        bestScore = score;
                        equipSet[0] = weapon;
                    }
                }
            }

        }
        //体防具スコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 3
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                score = armor.params[3];
                score = armor.params[5]*2;
                if(armor.meta.rating){
                    score += Number(armor.meta.rating);
                }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[2] = armor;
                }
            }
        }
        //頭防具スコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 4
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3];
                    score = armor.params[5]*2;
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[3] = armor;
                }
            }
        }
        //アクセサリースコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 5
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3];
                    score = armor.params[5]*2;
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[4] = armor;
                }
            }
        }
        //マテリアスコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 6
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3];
                    score = armor.params[5]*2;
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[5] = armor;
                }
            }
        }
    }else{
        //武器スコア--------------------------------------------------------------------
        if(this.hasSkill(320)){ //かくとう
            score = this.cat + this.licenseWeaponPlus(0);
            bestScore = score;
        }
        for(weapon of $dataWeapons){
            if($gameParty.hasItem(weapon,false)
                && this.canEquip(weapon)
                && !weapon.meta.noOptimize){
                elements = this.getWeaponElements(weapon);
                score = weapon.params[2];
                score += this.licenseWeaponPlus(weapon.wtypeId);
                if(elements.includes(19)){
                    score *= 1.5;
                }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[0] = weapon;
                }
            }
        }
        //体防具スコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 3
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                score = armor.params[3]*2;
                score = armor.params[5];
                if(armor.meta.rating){
                    score += Number(armor.meta.rating);
                }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[2] = armor;
                }
            }
        }
        //頭防具スコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 4
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3]*2;
                    score = armor.params[5];
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[3] = armor;
                }
            }
        }
        //アクセサリースコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 5
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3]*2;
                    score = armor.params[5];
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[4] = armor;
                }
            }
        }
        //マテリアスコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 6
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3]*2;
                    score = armor.params[5];
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[5] = armor;
                }
            }
        }

    }
    return equipSet;
}

Game_Actor.prototype.equipsScore = function(equipSet){
    var totalScore = 0;
    var score = 0;
    var equip = null;
    for(let i = 0;i<equipSet.length;i++){
        equip = equipSet[i];
        score = 0;
        if(!equip){
            if(i<=1 && this.hasSkill(320)){ //かくとう
                score = this.cat + this.licenseWeaponPlus(0);
                if(this.isStateAffected(33)){ //後衛
                    if(!this.isSniper()
                      || !(equipSet[5] && equipSet[5].id == 202 ) //じげんのうでわ
                      || !(equipSet[6] && equipSet[6].id == 308 )){ //たいれつむし
                        score /= 2;
                    }
                }
            }
        }
        if(equip && DataManager.isWeapon(equip)){
            if(this.isStateAffected(33)){ //後衛
                elements = this.getWeaponElements(equip);
                score = equip.params[2] + this.licenseWeaponPlus(equip.wtypeId);
                if(!this.isSniper()
                  || !elements.includes(26) //隊列無視属性
                  || !(equipSet[5] && equipSet[5].id == 202 ) //じげんのうでわ
                  || !(equipSet[6] && equipSet[6].id == 308 ) ){ //たいれつむし
                    score /= 2;
                    score += equip.params[4]*5;
                }
            }else{ //前衛
                score = equip.params[2] + this.licenseWeaponPlus(equip.wtypeId);
                elements = this.getWeaponElements(equip);
                if(elements.includes(19)){
                    score *= 1.25;
                }
            }
        }else if(equip && DataManager.isArmor(equip)){
            if(this.isStateAffected(33)){ //後衛
                score += equip.params[5] * 2; 
                score += equip.params[3]; 
            }else{ //前衛
                score += equip.params[5]; 
                score += equip.params[3] * 2; 
            }
            if(armor.meta.rating){
                score += Number(armor.meta.rating);
            }
        }
        totalScore += score;
    }
    return totalScore;
}

//
Game_Actor.prototype.sieldStyleOptimizeSet = function() {
    var equipSet = [null,null,null,null,null,null];
    var bestScore = 0;
    var elements;
    var score = 0;
    if(!this.isEquipWtypeOk(1)&&!this.isEquipWtypeOk(2)){
        return equipSet;
    }
    const ngtypes = [4,5,9,18] //両手剣、ガンブレード、弓矢、竪琴は除外する
    if(this.isStateAffected(33)){
        if(this.isSniper()){ //後衛・スナイパー型
            if(this.hasSkill(320)){ //かくとう
                elements = this.getWeaponElements(0)
                score = this.cat + this.licenseWeaponPlus(0);
                if(!elements.includes(26)){
                    score /= 2;
                }
                bestScore = score;
            }
            //武器スコア--------------------------------------------------------------------
            for(weapon of $dataWeapons){
                if($gameParty.hasItem(weapon,false)
                    && this.canEquip(weapon)
                    && !ngtypes.includes(weapon.wtypeId)
                    && !weapon.meta.noOptimize){
                    elements = this.getWeaponElements(weapon);
                    score = weapon.params[2];
                    score += this.licenseWeaponPlus(weapon.wtypeId);
                    console.log(weapon,weapon.params,weapon.params[2],this.licenseWeaponPlus(weapon.wtypeId))
                    if(!elements.includes(26)){
                        score /= 2;
                    }
                    if(elements.includes(19)){
                        score *= 1.25;
                    }
                    if(bestScore <= score){
                        bestScore = score;
                        equipSet[0] = weapon;
                    }
                }
            }
        }else{
            //後衛・魔法型
            //武器スコア--------------------------------------------------------------------
            for(weapon of $dataWeapons){
                if($gameParty.hasItem(weapon,false)
                    && this.canEquip(weapon)
                    && !ngtypes.includes(weapon.wtypeId)
                    && !weapon.meta.noOptimize){
                    elements = this.getWeaponElements(weapon);
                    score = weapon.params[2]/2;
                    score += this.licenseWeaponPlus(weapon.wtypeId);
                    console.log(weapon,weapon.params,weapon.params[2],this.licenseWeaponPlus(weapon.wtypeId))
                    if(!elements.includes(26)){
                        score /= 2;
                    }
                    if(elements.includes(19)){
                        score *= 1.25;
                    }
                    score += weapon.params[4]*5;
                    if(bestScore <= score){
                        bestScore = score;
                        equipSet[0] = weapon;
                    }
                }
            }

        }
        //盾スコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 2
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                score = armor.params[3];
                score = armor.params[5]*2;
                if(armor.meta.rating){
                    score += Number(armor.meta.rating);
                }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[1] = armor;
                }
            }
        }
        //体防具スコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 3
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                score = armor.params[3];
                score = armor.params[5]*2;
                if(armor.meta.rating){
                    score += Number(armor.meta.rating);
                }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[2] = armor;
                }
            }
        }
        //頭防具スコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 4
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3];
                    score = armor.params[5]*2;
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[3] = armor;
                }
            }
        }
        //アクセサリースコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 5
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3];
                    score = armor.params[5]*2;
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[4] = armor;
                }
            }
        }
        //マテリアスコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 6
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3];
                    score = armor.params[5]*2;
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[5] = armor;
                }
            }
        }
    }else{
        //武器スコア--------------------------------------------------------------------
        if(this.hasSkill(320)){ //かくとう
            score = this.cat + this.licenseWeaponPlus(0);
            bestScore = score;
        }
        for(weapon of $dataWeapons){
            if($gameParty.hasItem(weapon,false)
                && this.canEquip(weapon)
                && !ngtypes.includes(weapon.wtypeId)
                && !weapon.meta.noOptimize){
                elements = this.getWeaponElements(weapon);
                score = weapon.params[2];
                score += this.licenseWeaponPlus(weapon.wtypeId);
                if(elements.includes(19)){
                    score *= 1.5;
                }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[0] = weapon;
                }
            }
        }
        //盾スコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 2
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                score = armor.params[3];
                score = armor.params[5]*2;
                if(armor.meta.rating){
                    score += Number(armor.meta.rating);
                }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[1] = armor;
                }
            }
        }
        //体防具スコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 3
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                score = armor.params[3]*2;
                score = armor.params[5];
                if(armor.meta.rating){
                    score += Number(armor.meta.rating);
                }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[2] = armor;
                }
            }
        }
        //頭防具スコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 4
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3]*2;
                    score = armor.params[5];
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[3] = armor;
                }
            }
        }
        //アクセサリースコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 5
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3]*2;
                    score = armor.params[5];
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[4] = armor;
                }
            }
        }
        //マテリアスコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 6
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3]*2;
                    score = armor.params[5];
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[5] = armor;
                }
            }
        }

    }
    return equipSet;
}

//
Game_Actor.prototype.dualStyleOptimizeSet = function() {
    var equipSet = [null,null,null,null,null,null];
    var bestScore = 0;
    var elements;
    var score = 0;
    var axscore; //比較用アクセサリースコア
    var mtscore; //比較用マテリアスコア
    if(!this.isDualWield()
        && !$gameParty.hasItem($dataArmors[312],false) //にとうりゅうマテリア
        && !($gameParty.hasItem($dataArmors[164],false)&&this.canEquip($dataArmors[164]))){  //げんじのこて
        return equipSet;
    }
    const ngtypes = [4,5,9,18] 
    if(this.isStateAffected(33)){ //後衛------------------------------------------------------------
        if(this.hasSkill(320)){ //かくとう
            elements = this.getWeaponElements(0)
            score = this.cat + this.licenseWeaponPlus(0);
            if(!elements.includes(26)){
                score /= 2;
            }
            bestScore = score;
        }
        if(this.isSniper()){ //後衛・スナイパー型
            //武器スコア--------------------------------------------------------------------
            for(weapon of $dataWeapons){
                if($gameParty.hasItem(weapon,false)
                    && this.canEquip(weapon)
                    && !ngtypes.includes(weapon.wtypeId)
                    && !weapon.meta.noOptimize){
                    elements = this.getWeaponElements(weapon);
                    score = weapon.params[2];
                    score += this.licenseWeaponPlus(weapon.wtypeId);
                    console.log(weapon,weapon.params,weapon.params[2],this.licenseWeaponPlus(weapon.wtypeId))
                    if(!elements.includes(26)){
                        score /= 2;
                    }
                    if(elements.includes(19)){
                        score *= 1.25;
                    }
                    if(bestScore <= score){
                        bestScore = score;
                        equipSet[0] = weapon;
                    }
                }
            }
            bestScore = 0;
            if(this.hasSkill(320)){ //かくとう
                elements = this.getWeaponElements(0)
                score = this.cat + this.licenseWeaponPlus(0);
                if(!elements.includes(26)){
                    score /= 2;
                }
                bestScore = score;
            }
            for(weapon of $dataWeapons){
                if($gameParty.hasItem(weapon,false)
                    && this.canEquip(weapon)
                    && !ngtypes.includes(weapon.wtypeId)
                    && !weapon.meta.noOptimize){
                    if(weapon.id == equipSet[0].id && $gameParty.numItems(weapon) <= 1){
                        continue;
                    }
                    elements = this.getWeaponElements(weapon);
                    score = weapon.params[2];
                    score += this.licenseWeaponPlus(weapon.wtypeId);
                    console.log(weapon,weapon.params,weapon.params[2],this.licenseWeaponPlus(weapon.wtypeId))
                    if(!elements.includes(26)){
                        score /= 2;
                    }
                    if(elements.includes(19)){
                        score *= 1.25;
                    }
                    if(bestScore <= score){
                        bestScore = score;
                        equipSet[1] = weapon;
                    }
                }
            }
        }else{
            //後衛・魔法型
            //武器スコア--------------------------------------------------------------------
            for(weapon of $dataWeapons){
                if($gameParty.hasItem(weapon,false)
                    && this.canEquip(weapon)
                    && !ngtypes.includes(weapon.wtypeId)
                    && !weapon.meta.noOptimize){
                    elements = this.getWeaponElements(weapon);
                    score = weapon.params[2]/2;
                    score += this.licenseWeaponPlus(weapon.wtypeId);
                    console.log(weapon,weapon.params,weapon.params[2],this.licenseWeaponPlus(weapon.wtypeId))
                    if(!elements.includes(26)){
                        score /= 2;
                    }
                    if(elements.includes(19)){
                        score *= 1.25;
                    }
                    score += weapon.params[4]*5;
                    if(bestScore <= score){
                        bestScore = score;
                        equipSet[0] = weapon;
                    }
                }
            }
            if(this.hasSkill(320)){ //かくとう
                elements = this.getWeaponElements(0)
                score = this.cat + this.licenseWeaponPlus(0);
                if(!elements.includes(26)){
                    score /= 2;
                }
                bestScore = score;
            }
            for(weapon of $dataWeapons){
                if($gameParty.hasItem(weapon,false)
                    && this.canEquip(weapon)
                    && !ngtypes.includes(weapon.wtypeId)
                    && !weapon.meta.noOptimize){
                    if(equipSet[0] && weapon.id == equipSet[0].id && $gameParty.numItems(weapon) <= 1){
                        continue;
                    }
                    elements = this.getWeaponElements(weapon);
                    score = weapon.params[2]/2;
                    score += this.licenseWeaponPlus(weapon.wtypeId);
                    console.log(weapon,weapon.params,weapon.params[2],this.licenseWeaponPlus(weapon.wtypeId))
                    if(!elements.includes(26)){
                        score /= 2;
                    }
                    if(elements.includes(19)){
                        score *= 1.25;
                    }
                    score += weapon.params[4]*5;
                    if(bestScore <= score){
                        bestScore = score;
                        equipSet[1] = weapon;
                    }
                }
            }

        }
        //体防具スコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 3
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                score = armor.params[3];
                score = armor.params[5]*2;
                if(armor.meta.rating){
                    score += Number(armor.meta.rating);
                }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[2] = armor;
                }
            }
        }
        //頭防具スコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 4
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3];
                    score = armor.params[5]*2;
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[3] = armor;
                }
            }
        }
        //アクセサリースコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 5
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3];
                    score = armor.params[5]*2;
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[4] = armor;
                }
            }
        }
        axscore = bestScore;
        //マテリアスコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 6
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3];
                    score = armor.params[5]*2;
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[5] = armor;
                }
            }
        }
        mtscore = bestScore
    }else{
        //武器スコア--------------------------------------------------------------------
        if(this.hasSkill(320)){ //かくとう
            score = this.cat + this.licenseWeaponPlus(0);
            bestScore = score;
        }
        for(weapon of $dataWeapons){
            if($gameParty.hasItem(weapon,false)
                && this.canEquip(weapon)
                && !ngtypes.includes(weapon.wtypeId)
                && !weapon.meta.noOptimize){
                elements = this.getWeaponElements(weapon);
                score = weapon.params[2];
                score += this.licenseWeaponPlus(weapon.wtypeId);
                if(elements.includes(19)){
                    score *= 1.5;
                }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[0] = weapon;
                }
            }
        }
        bestScore = 0;
        for(weapon of $dataWeapons){
            if($gameParty.hasItem(weapon,false)
                && this.canEquip(weapon)
                && !ngtypes.includes(weapon.wtypeId)
                && !weapon.meta.noOptimize){
                if(equipSet[0] && weapon.id == equipSet[0].id && $gameParty.numItems(weapon) <= 1){
                    continue;
                }
                elements = this.getWeaponElements(weapon);
                score = weapon.params[2];
                score += this.licenseWeaponPlus(weapon.wtypeId);
                if(elements.includes(19)){
                    score *= 1.5;
                }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[1] = weapon;
                }
            }
        }
        console.log(equipSet)
        //体防具スコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 3
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                score = armor.params[3]*2;
                score = armor.params[5];
                if(armor.meta.rating){
                    score += Number(armor.meta.rating);
                }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[2] = armor;
                }
            }
        }
        //頭防具スコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 4
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3]*2;
                    score = armor.params[5];
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[3] = armor;
                }
            }
        }
        //アクセサリースコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 5
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3]*2;
                    score = armor.params[5];
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[4] = armor;
                }
            }
        }
        axscore = bestScore;
        //マテリアスコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 6
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3]*2;
                    score = armor.params[5];
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[5] = armor;
                }
            }
        }
        mtscore = bestScore;
    }
    
    if(!this.isDualWield()){
        if(axscore < mtscore && this.canEquip($dataArmors[164]) && $gameParty.hasItem($dataArmors[164],false)){
            equipSet[4] = $dataArmors[164]; //げんじのこて
        }else{
            if($gameParty.hasItem($dataArmors[312],false)&&this.canEquip($dataArmors[312])){
                equipSet[5] = $dataArmors[312];
            }else{
                equipSet[4] = $dataArmors[164]; //げんじのこて
            }
        }
    }

    return equipSet;
}

//
Game_Actor.prototype.twoHandedStyleOptimizeSet = function() {
    var equipSet = [null,null,null,null,null,null];
    //両手持ちが可能な武器タイプ
    const twoHandedWeaponTypes = [1,2,3,6,11,12,14,15,16,17];
    var bestScore = 0;
    var axscore = 0;
    var mtscore = 0;
    var elements;
    var score = 0;
    if(!this.twoHanded()
        && !($gameParty.hasItem($dataArmors[266],false)&&this.canEquip($dataArmors[266])) //りょうてもちマテリア
        && !($gameParty.hasItem($dataArmors[158],false)&&this.canEquip($dataArmors[158]))){  //ガントレット
        return equipSet;
    }
    if(this.isStateAffected(33)){
        if(this.isSniper()){ //後衛・スナイパー型
            //武器スコア--------------------------------------------------------------------
            for(weapon of $dataWeapons){
                if($gameParty.hasItem(weapon,false)
                    && this.canEquip(weapon)
                    && twoHandedWeaponTypes.includes(weapon.wtypeId)
                    && !weapon.meta.noOptimize){
                    elements = this.getWeaponElements(weapon);
                    score = weapon.params[2];
                    score += this.licenseWeaponPlus(weapon.wtypeId);
                    console.log(weapon,weapon.params,weapon.params[2],this.licenseWeaponPlus(weapon.wtypeId))
                    if(!elements.includes(26)){
                        score /= 2;
                    }
                    if(elements.includes(19)){
                        score *= 1.25;
                    }
                    score *+ 1.5; //りょうてもち補正
                    if(bestScore <= score){
                        bestScore = score;
                        equipSet[0] = weapon;
                    }
                }
            }
        }else{
            //後衛・魔法型
            //武器スコア--------------------------------------------------------------------
            for(weapon of $dataWeapons){
                if($gameParty.hasItem(weapon,false)
                    && this.canEquip(weapon)
                    && !weapon.meta.noOptimize){
                    elements = this.getWeaponElements(weapon);
                    score = weapon.params[2]/2;
                    score += this.licenseWeaponPlus(weapon.wtypeId);
                    console.log(weapon,weapon.params,weapon.params[2],this.licenseWeaponPlus(weapon.wtypeId))
                    if(!elements.includes(26)){
                        score /= 2;
                    }
                    if(elements.includes(19)){
                        score *= 1.25;
                    }
                    score += weapon.params[4]*5;
                    if(bestScore <= score){
                        bestScore = score;
                        equipSet[0] = weapon;
                    }
                }
            }

        }
        //体防具スコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 3
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                score = armor.params[3];
                score = armor.params[5]*2;
                if(armor.meta.rating){
                    score += Number(armor.meta.rating);
                }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[2] = armor;
                }
            }
        }
        //頭防具スコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 4
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3];
                    score = armor.params[5]*2;
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[3] = armor;
                }
            }
        }
        //アクセサリースコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 5
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3];
                    score = armor.params[5]*2;
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[4] = armor;
                }
            }
        }
        axscore = bestScore;
        //マテリアスコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 6
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3];
                    score = armor.params[5]*2;
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[5] = armor;
                }
            }
        }
        mtscore = bestScore;
    }else{
        //武器スコア--------------------------------------------------------------------7
        for(weapon of $dataWeapons){
            if($gameParty.hasItem(weapon,false)
                && this.canEquip(weapon)
                && twoHandedWeaponTypes.includes(weapon.wtypeId)
                && !weapon.meta.noOptimize){
                elements = this.getWeaponElements(weapon);
                score = weapon.params[2];
                score += this.licenseWeaponPlus(weapon.wtypeId);
                if(elements.includes(19)){
                    score *= 1.5;
                }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[0] = weapon;
                }
            }
        }
        //体防具スコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 3
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                score = armor.params[3]*2;
                score = armor.params[5];
                if(armor.meta.rating){
                    score += Number(armor.meta.rating);
                }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[2] = armor;
                }
            }
        }
        //頭防具スコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 4
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3]*2;
                    score = armor.params[5];
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[3] = armor;
                }
            }
        }
        //アクセサリースコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 5
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3]*2;
                    score = armor.params[5];
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[4] = armor;
                }
            }
        }
        axscore = bestScore;
        //マテリアスコア--------------------------------------------------------------------
        bestScore = 0;
        for(armor of $dataArmors){
            if(armor && armor.etypeId == 6
                && $gameParty.hasItem(armor,false)
                && this.canEquip(armor)
                && !armor.meta.noOptimize){
                    score = armor.params[3]*2;
                    score = armor.params[5];
                    if(armor.meta.rating){
                        score += Number(armor.meta.rating);
                    }
                if(bestScore <= score){
                    bestScore = score;
                    equipSet[5] = armor;
                }
            }
        }
        mtscore = bestScore;
    }

    if(!this.twoHanded()){
        if(axscore < mtscore && this.canEquip($dataArmors[158]) && $gameParty.hasItem($dataArmors[158],false)){
            equipSet[4] = $dataArmors[158]; //げんじのこて
        }else if(axscore < mtscore && this.canEquip($dataArmors[266]) && $gameParty.hasItem($dataArmors[266],false)){
            equipSet[5] = $dataArmors[266];
        }else{
            return [null,null,null,null,null,null];
        }
    }

    return equipSet;
}

Game_Actor.prototype.getWeaponElements = function(weapon) {
    const elements = []
    //隊列無視アビリティ
    if(this.hasSkill(315)){
        elements.push(26);
    }
    if(!weapon){ //素手
        return elements;
    }
    for(trait of weapon.traits){
        if(trait.code == Game_BattlerBase.TRAIT_ATTACK_ELEMENT){
            elements.push(trait.dataId);
        }
    }
    //トマホーク武器を投擲扱いした場合は対空属性・隊列無視属性を追加する
    if(this.isEquipWtypeOk(8) && weapon.meta.tomahawk){
        elements.push(18);
        elements.push(26);
    }
    //棍武器かつ棍術の極意持ちの場合、隊列無視を追加
    if(this.hasSkill(317)&&weapon.meta.stick){
        elements.push(26);
    }
    return elements;
}

                
