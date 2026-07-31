//=============================================================================
// FNG_CustomSceneSkill.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc スキル仕様画面をFFIで使う用にカスタムします
  * @author finga
  * @help 主に配置を変更します
*/

Scene_Skill.prototype.create = function() {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createStatusWindow();
    this.createMenuNameWindow("Special");
    this.createItemWindow();
    this.createMonomaneCommandListWindow();
    this.createLicenseListWindow();
    this.createActorWindow();
    this.createSkillTypeWindow();
    this.createLisenceCommandWindow();
    this.createMonomaneCommandsWindow();
    this.createLisenceAbilityListWindow();
};

Scene_Skill.prototype.createLisenceAbilityListWindow = function() {
    const rect = this.licenseAbilityListWindowRect();
    this._licenseAbilityListWindow = new Window_LicenseAbilityList(rect);
    this._licenseAbilityListWindow.setHelpWindow(this._helpWindow);
    this._licenseListWindow.setAbilityListWindow(this._licenseAbilityListWindow);
    this._licenseCommandWindow.setAbilityListWindow(this._licenseAbilityListWindow);
    //this._licenseListWindow.setHandler("ok", this.onLicenseListOk.bind(this));
    //this._licenseListWindow.setHandler("cancel", this.onLicenseListCancel.bind(this));
    this._licenseAbilityListWindow.setHandler("right", this.licenseAbilityListRight.bind(this));
    this.addWindow(this._licenseAbilityListWindow);
};

Scene_Skill.prototype.licenseAbilityListRight = function() {
    this._licenseAbilityListWindow.plevWindow().activate();
    this._licenseAbilityListWindow.deactivate();
};

Scene_Skill.prototype.licenseAbilityListWindowRect = function() {
    const ww = Graphics.boxWidth/3*2-16;
    const wx = 0;
    const wy = this._statusWindow.y + this._statusWindow.height;
    const wh = Graphics.boxHeight - this._statusWindow.height - this._helpWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Skill.prototype.createStatusWindow = function() {
    const rect = this.statusWindowRect();
    this._statusWindow = new Window_MemberChangeStatus(rect);
    this.addWindow(this._statusWindow);
};

Scene_Skill.prototype.createMenuNameWindow = function(name) {
    const width = this.mainFontSize()*8;
    var rect = new Rectangle(Graphics.boxWidth-width, 0,width,this.mainFontSize()*3.75);
    this._menuNameWindow = new Window_MenuName(rect);
    this._menuNameWindow.drawMenuName(name);
    this.addWindow(this._menuNameWindow);
};

Scene_Skill.prototype.updateMenuNameWindow = function(name) {
    this._menuNameWindow.drawMenuName(name);
};

Scene_Skill.prototype.helpWindowRect = function() {
    const wx = 0;
    const wh = this.mainFontSize()*3+this.mainFontSize()*7/8;
    const wy = Graphics.boxHeight-wh;
    const ww = Graphics.boxWidth;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Skill.prototype.statusWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = this.mainFontSize()*4+this.mainFontSize()*4/5*2;
    const wx = 0;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Skill.prototype.createSkillTypeWindow = function() {
    const rect = this.skillTypeWindowRect();
    this._skillTypeWindow = new Window_SkillType(rect);
    this._skillTypeWindow.setHelpWindow(this._helpWindow);
    this._skillTypeWindow.setHandler("skill", this.commandSkill.bind(this));
    this._skillTypeWindow.setHandler("monomane", this.commandMonomane.bind(this));
    this._skillTypeWindow.setHandler("license", this.commandLicense.bind(this));
    this._skillTypeWindow.setHandler("cancel", this.popScene.bind(this));
    this._skillTypeWindow.setHandler("pagedown", this.nextActor.bind(this));
    this._skillTypeWindow.setHandler("pageup", this.previousActor.bind(this));
    this._skillTypeWindow.setSkillWindow(this._itemWindow);
    this.addWindow(this._skillTypeWindow);
};

Scene_Skill.prototype.commandMonomane = function() {
    this._monomaneCommandListWindow.show();
    this._monomaneCommandsWindow.activate();
    this._skillTypeWindow.deactivate();
    this.updateMenuNameWindow("Impersonate");
};

Scene_Skill.prototype.commandLicense = function() {
    this._licenseListWindow.show();
    this._licenseCommandWindow.activate();
    this._skillTypeWindow.deactivate();
    this._licenseAbilityListWindow.show();
    this.updateMenuNameWindow("License");
};

Scene_Skill.prototype.createMonomaneCommandsWindow = function() {
    const rect = this.monomaneCommandsWindowRect();
    this._monomaneCommandsWindow = new Window_MonomaneCommands(rect);
    this._monomaneCommandsWindow.setHelpWindow(this._helpWindow);
    this._monomaneCommandsWindow.setHandler("ok", this.monomaneCommandsOk.bind(this));
    this._monomaneCommandsWindow.setHandler("cancel", this.monomaneCommandsCancel.bind(this));
    this.addWindow(this._monomaneCommandsWindow);
};

Scene_Skill.prototype.createMonomaneCommandListWindow = function() {
    const rect = this.itemWindowRect();
    this._monomaneCommandListWindow = new Window_MonomaneCommandList(rect);
    this._monomaneCommandListWindow.setHelpWindow(this._helpWindow);
    this._monomaneCommandListWindow.setHandler("ok", this.onMonomaneCommandListOk.bind(this));
    this._monomaneCommandListWindow.setHandler("cancel", this.onMonomaneCommandListCancel.bind(this));
    this.addWindow(this._monomaneCommandListWindow);
};

Scene_Skill.prototype.createLicenseListWindow = function() {
    const rect = this.licenseListWindowRect();
    this._licenseListWindow = new Window_LicenseList(rect);
    this._licenseListWindow.setHelpWindow(this._helpWindow);
    this._licenseListWindow.setHandler("ok", this.onLicenseListOk.bind(this));
    this._licenseListWindow.setHandler("cancel", this.onLicenseListCancel.bind(this));
    this._licenseListWindow.setHandler("left", this.onLicenseListLeft.bind(this));
    this.addWindow(this._licenseListWindow);
};

Scene_Skill.prototype.onLicenseListLeft = function() {
    this._licenseAbilityListWindow.setPlevWindow(this._licenseListWindow);
    this._licenseAbilityListWindow.activate();
    this._licenseListWindow.deactivate();
};

Scene_Skill.prototype.createLisenceCommandWindow = function() {
    const rect = this.licenseCommandWindowRect();
    this._licenseCommandWindow = new Window_LicenseCommands(rect);
    this._licenseCommandWindow.setHelpWindow(this._helpWindow);
    this._licenseCommandWindow.setHandler("ok", this.licenseCommandOk.bind(this));
    this._licenseCommandWindow.setHandler("cancel", this.licenseCommandCancel.bind(this));
    this._licenseCommandWindow.setHandler("left", this.licenseCommandLeft.bind(this));
    this.addWindow(this._licenseCommandWindow);
};

Scene_Skill.prototype.licenseCommandLeft = function() {
    this._licenseAbilityListWindow.setPlevWindow(this._licenseCommandWindow);
    this._licenseAbilityListWindow.activate();
    this._licenseCommandWindow.deactivate();
};

Scene_Skill.prototype.licenseCommandOk = function() {
    this._licenseListWindow._index = 0;
    this._licenseListWindow.activate();
    this._licenseCommandWindow.deactivate();
    this._skillTypeWindow.hide();
    this._licenseCommandWindow.hide();
};

Scene_Skill.prototype.licenseCommandCancel = function() {
    this._skillTypeWindow.activate();
    this._licenseListWindow.hide();
    this._licenseAbilityListWindow.hide();
    this._licenseCommandWindow.deactivate();
};

Scene_Skill.prototype.onLicenseListOk = function() {
    this._skillTypeWindow.show();
    this.actor().setLicenseJob(this._licenseListWindow.itemAt(this._licenseListWindow.index()),this._licenseCommandWindow.index());
    this.actor().refresh();
    this._licenseCommandWindow.show();
    this._licenseCommandWindow.activate();
    this._licenseCommandWindow.refresh();
    this._statusWindow.refresh();
    this._licenseListWindow.deselect();
};

Scene_Skill.prototype.onLicenseListCancel = function() {
    this._licenseListWindow.deselect();
    this._skillTypeWindow.show();
    this._licenseCommandWindow.show()
    this._licenseCommandWindow.activate();
};

Scene_Skill.prototype.monomaneCommandsOk = function() {
    this._monomaneCommandListWindow._index = 0;
    this._monomaneCommandListWindow.activate();
    this._monomaneCommandsWindow.deactivate();
    this._skillTypeWindow.hide();
    this._monomaneCommandsWindow.hide();
};

Scene_Skill.prototype.monomaneCommandsCancel = function() {
    this._skillTypeWindow.activate();
    this._monomaneCommandListWindow.hide();
    this._monomaneCommandsWindow.deactivate();
};

Scene_Skill.prototype.skillTypeWindowRect = function() {
    const ww = this.mainCommandWidth();
    const wh = this.mainFontSize()*6+this.mainFontSize()*4/5*2;
    const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Skill.prototype.monomaneCommandsWindowRect = function() {
    const ww = this.mainCommandWidth();
    const wh = this.mainFontSize()*2+this.mainFontSize()*4/5*2;
    const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
    const wy = this._skillTypeWindow.height
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Skill.prototype.licenseCommandWindowRect = function() {
    const ww = this.mainCommandWidth();
    const wh = this.mainFontSize()*4+this.mainFontSize()*4/5*3;
    const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
    const wy = this._skillTypeWindow.height
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Skill.prototype.createItemWindow = function() {
    const rect = this.itemWindowRect();
    this._itemWindow = new Window_SkillList(rect);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
};

Scene_Skill.prototype.onMonomaneCommandListOk = function() {
    this._skillTypeWindow.show();
    this.actor().setMonomaneCommand(this._monomaneCommandsWindow.index(),this._monomaneCommandListWindow.itemAt(this._monomaneCommandListWindow.index()));
    this._skillTypeWindow.refresh();
    this._monomaneCommandsWindow.show();
    this._monomaneCommandsWindow.activate();  
    this._monomaneCommandsWindow.refresh();    
    this._monomaneCommandListWindow.deselect();
};

Scene_Skill.prototype.onMonomaneCommandListCancel = function() {
    this._monomaneCommandListWindow.deselect();
    this._skillTypeWindow.show();
    this._monomaneCommandsWindow.show()
    this._monomaneCommandsWindow.activate();
};

Scene_Skill.prototype.itemWindowRect = function() {
    const wx = 0;
    const wy = this._statusWindow.y + this._statusWindow.height;
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight - this._statusWindow.height - this._helpWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Skill.prototype.licenseListWindowRect = function() {
    const ww = Graphics.boxWidth/3+16;
    const wx = Graphics.boxWidth-ww;
    const wy = this._statusWindow.y + this._statusWindow.height;
    const wh = Graphics.boxHeight - this._statusWindow.height - this._helpWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Skill.prototype.commandSkill = function() {
    const menuname = $dataSystem.skillTypes[this._itemWindow._stypeId];
    this.updateMenuNameWindow(menuname);
    this._skillTypeWindow.hide();
    this._monomaneCommandsWindow.hide();
    this._licenseCommandWindow.hide();
    this._itemWindow.activate();
    this._itemWindow.selectLast();
};

Scene_Skill.prototype.onItemCancel = function() {
    this._itemWindow.deselect();
    this._skillTypeWindow.show();
    if(this._actor.hasSkill(222)){
        this._monomaneCommandsWindow.show();
    }
    if(this._actor.currentLicenseJobs()){
        this._licenseCommandWindow.show();
    }
    this._skillTypeWindow.activate();
};

Scene_Skill.prototype.determineItem = function() {
    const action = new Game_Action(this.user());
    const item = this.item();
    action.setItemObject(item);
    if (action.isForFriend() || item.meta.forFriendOnMap) {
        this.showActorWindow();
        this._actorWindow.selectForItem(this.item());
    } else {
        this.useItem();
        this.activateItemWindow();
    }
};

const _Scene_Skill_refreshActor = Scene_Skill.prototype.refreshActor;
Scene_Skill.prototype.refreshActor = function() {
    _Scene_Skill_refreshActor.apply(this,arguments);
    const actor = this.actor();
    this._monomaneCommandsWindow.setActor(actor);
    this._monomaneCommandListWindow.setActor(actor);
    this._licenseCommandWindow.setActor(actor);
    this._licenseListWindow.setActor(actor);
    this._licenseAbilityListWindow.setActor(actor);
};


const _Scene_ItemBase_canUse = Scene_ItemBase.prototype.canUse;
Scene_ItemBase.prototype.canUse = function() {
    const item = this.item();

    if(item.meta.noAtomos&&$gameSwitches.value(191)){
        return false;
    }
    if(item.meta.terepo&&$gameSwitches.value(17)){
        return false;
    }
    if(item.meta.forFriendOnMap){
        return true;
    }
    return _Scene_ItemBase_canUse.apply(this,arguments);
};

//-----------------------------------------------------------------------------
// Window_SkillStatus
//
// The window for displaying the skill user's status on the skill screen.

Window_SkillStatus.prototype.refresh = function() {
    Window_StatusBase.prototype.refresh.call(this);
    if (this._actor) {
    }
};

// HPゲージを表示しない
Window_SkillStatus.prototype.drawActorHp = function(actor, x, y, width) {
    
    const text = actor.hp + '/' + actor.mhp;
    
    //ゲージは描画しない
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.hpA, x, y);
    this.resetTextColor();
    this.drawText(text, x, y,4*12,'right');
};

//MPゲージを表示しない
Window_SkillStatus.prototype.drawActorMp = function(actor, x, y, width) {    
    const text = actor.mp + '/' + actor.mmp;
    
    //ゲージは描画しない
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.mpA, x, y);
    this.resetTextColor();
    this.drawText(text, x, y,4*12,'right');
};

//-----------------------------------------------------------------------------
// Window_SkillList
//
// The window for selecting a skill on the skill screen.
Window_SkillList.prototype.maxCols = function() {
    var value = 2;
    const col3type = [5,6,7,19,23,24,33];
    const col1type = [4];
    for(id of col3type){
        if(this._stypeId === id){
            value = 3;
        }
    }
    for(id of col1type){
        if(this._stypeId === id){
            value = 1;
        }
    }
    return value;
};

Window_SkillList.prototype.itemRectWithPadding = function(index) {
    const rect = this.itemRect(index);
    const padding = this.itemPadding();
    rect.x += padding;
    rect.width -= padding * 2;
    return rect;
};

Window_SkillType.prototype.makeCommandList = function() {
    if (this._actor) {
        if(this._actor.hasSkill(222)){
            this.addCommand("Impersonate", "monomane", true, 0);
        }
        if(this._actor.actor().meta.licenses){
            this.addCommand("License", "license", true, 0);
        }
        const skillTypes = this._actor.skillTypes();
        for (const stypeId of skillTypes) {
            if(stypeId>4){
                const name = $dataSystem.skillTypes[stypeId];
                this.addCommand(name, "skill", true, stypeId);
            }
        }
        for (const stypeId of skillTypes) {
            if(stypeId<=4){
                const name = $dataSystem.skillTypes[stypeId];
                this.addCommand(name, "skill", true, stypeId);
            }
        }
    }
};

Window_SkillType.prototype.itemRect = function(index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX()+6;
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
    const width = itemWidth - colSpacing-6;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};

//-----------------------------------------------------------------------------
// Window_MonomaneCommands
//
// ものまね士(ゴゴ)がセットしているアビリティを表示・選択する

function Window_MonomaneCommands() {
    this.initialize(...arguments);
}

Window_MonomaneCommands.prototype = Object.create(Window_Command.prototype);
Window_MonomaneCommands.prototype.constructor = Window_MonomaneCommands;

Window_MonomaneCommands.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this._actor = null;
    this.deactivate();
};

Window_MonomaneCommands.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
        if(!this._actor.hasSkill(222)){
            this.visible = false;
        }else{
            this.visible = true;
        }
    }
};

Window_MonomaneCommands.prototype.makeCommandList = function() {
    if (this._actor) {
        const commands = this._actor.monomaneCommands();
        for (const command of commands) {
            if(!command){
                this.addCommand("－－－－－－", "ability", true);
                continue;
            }
            const name = command.name;
            this.addCommand(name, "ability", true)
        }
    }
};

Window_MonomaneCommands.prototype.itemRect = function(index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX()+6;
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
    const width = itemWidth - colSpacing-6;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};

//-----------------------------------------------------------------------------
// Window_MonomaneCommandList
//
// ものまね士がセットできるアビリティ一覧を表示・選択する

function Window_MonomaneCommandList() {
    this.initialize(...arguments);
}

Window_MonomaneCommandList.prototype = Object.create(Window_SkillList.prototype);
Window_MonomaneCommandList.prototype.constructor = Window_MonomaneCommandList;

Window_MonomaneCommandList.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._actor = null;
    this._data = [];
    this.visible = false;
};

Window_MonomaneCommandList.prototype.maxCols = function() {
    return 4;
};

Window_MonomaneCommandList.prototype.isCurrentItemEnabled = function() {
    return true;
};

Window_MonomaneCommandList.prototype.isEnabled = function(item) {
    return true;
};

Window_MonomaneCommandList.prototype.makeItemList = function() {
    if (this._actor) {
        this._data = this._actor.monomaneCommandList();
    } else {
        this._data = [];
    }
};

Window_MonomaneCommandList.prototype.drawItem = function(index) {
    const skill = this.itemAt(index);
    if (skill) {
        const costWidth = this.costWidth();
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(1);
        this.drawItemName(skill, rect.x, rect.y, rect.width - costWidth);
    }
};

Window_MonomaneCommandList.prototype.updateHelp = function() {
    this.setHelpWindowItem(this.item());
};

Window_MonomaneCommandList.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_MonomaneCommandList.prototype.playOkSound = function() {
    SoundManager.playEquip();
};

Window_MonomaneCommandList.prototype.itemRect = function(index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = 0;
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX()+7;
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
    const width = itemWidth - colSpacing+2;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};

//-----------------------------------------------------------------------------
// Window_LicenseCommands
//
// セットしているライセンスを表示・選択する

function Window_LicenseCommands() {
    this.initialize(...arguments);
}

Window_LicenseCommands.prototype = Object.create(Window_Command.prototype);
Window_LicenseCommands.prototype.constructor = Window_LicenseCommands;

Window_LicenseCommands.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this._actor = null;
    this._abilityListWindow = null;
    this.deactivate();
};

Window_LicenseCommands.prototype.setAbilityListWindow = function(window) {
    this._abilityListWindow = window;
};

Window_LicenseCommands.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
        if(this._actor.settableLicenseJobs().length > 0){
            this.visible = true;
        }else{
            this.visible = false;
        }
    }
};

Window_LicenseCommands.prototype.makeCommandList = function() {
    if (this._actor) {
        if(this._actor.currentLicenseJobs()){
            const jobs = this._actor.currentLicenseJobs();
            for (const job of jobs) {
                if(!job){
                    this.addCommand("－－－－－－", "license", true);
                    continue;
                }
                const name = job.name;
                this.addCommand(name, "license", true)
            }
        }
    }
};

Window_LicenseCommands.prototype.itemHeight = function() {
    return Window_Selectable.prototype.itemHeight.call(this)*2;
};

Window_LicenseCommands.prototype.drawItem = function(index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    if(index == 0){
        this.drawText("Main", rect.x, rect.y-4, rect.width,"left");
    }else{
        this.drawText("Sub", rect.x, rect.y-4, rect.width,"left");        
    }
    this.drawText(this.commandName(index), rect.x, rect.y+4, rect.width, "right");
};

Window_LicenseCommands.prototype.itemRect = function(index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = 0;
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX()+8;
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
    const width = itemWidth - colSpacing+2;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};

Window_LicenseCommands.prototype.itemWidth = function() {
    return this.width-20;
};

Window_LicenseCommands.prototype.callUpdateHelp = function() {
    Window_Selectable.prototype.callUpdateHelp.call(this);
    if (this._abilityListWindow) {
        const jobs = this._actor.currentLicenseJobs();
        this._abilityListWindow.setLicense(jobs[this.index()]);
        this._abilityListWindow.select(0);
        this._abilityListWindow.refresh();
    }
};

Window_LicenseCommands.prototype.processHandling = function() {
    Window_Command.prototype.processHandling.call(this);
    if (this.isOpenAndActive()) {
        if (this.isHandled("left") && Input.isTriggered("left")) {
            return this.processLeft();
        }
    }
};

Window_LicenseCommands.prototype.processLeft = function() {
    this.updateInputData();
    this.playCursorSound();
    this.callHandler("left");
};


//-----------------------------------------------------------------------------
// Window_LicenseList
//
// セットできるライセンス一覧を表示・選択する

function Window_LicenseList() {
    this.initialize(...arguments);
}

Window_LicenseList.prototype = Object.create(Window_SkillList.prototype);
Window_LicenseList.prototype.constructor = Window_LicenseList;

Window_LicenseList.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._actor = null;
    this._abilityListWindow = null;
    this._data = [];
    this.visible = false;
};

Window_LicenseList.prototype.maxCols = function() {
    return 1;
};

Window_LicenseList.prototype.isCurrentItemEnabled = function() {
    return true;
};

Window_LicenseList.prototype.makeItemList = function() {
    if (this._actor) {
        this._data = this._actor.settableLicenseJobs();
    } else {
        this._data = [];
    }
};

Window_LicenseList.prototype.drawItem = function(index) {
    const job = this.itemAt(index);
    if (job) {
        const costWidth = this.costWidth();
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(1);
        this.drawItemName(job, rect.x, rect.y-4, rect.width - costWidth);
        this.changeTextColor(ColorManager.systemColor());
        if(this._actor.isJobMaster(job)){
			this.drawIcon(57, rect.x+this.textWidth("　　　　　　 "),
                rect.y-8);
        }else{
            this.drawText("　　　　　　 JLv.", rect.x, rect.y+6, rect.width);
            this.drawText("AP", rect.x, rect.y+6, rect.width);
            this.changeTextColor(ColorManager.normalColor());
            this.drawText("       /", rect.x, rect.y+6, rect.width,);
            this.drawText(this._actor.jLevelFromClass(job),
                rect.x+this.textWidth("　　　　　　 JLv."),
                rect.y+6, this.textWidth("00"));
            this.drawText(this._actor.currentAp(job),
                rect.x+this.textWidth("AP"), rect.y+6,
                this.textWidth("    "),"right");
            this.drawText(this._actor.nextAp(job),
                rect.x+this.textWidth("AP 0000/"), rect.y+6,
                this.textWidth("    "));
        }
    }
};

Window_LicenseList.prototype.drawItemName = function(item, x, y, width) {
    if (item) {
        const itemWidth = Math.max(0, width);
        this.resetTextColor();
        this.drawText(item.name, x, y, itemWidth);
    }
};

Window_LicenseList.prototype.updateHelp = function() {
    //this.setHelpWindowItem(this.item());
};

Window_LicenseList.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_LicenseList.prototype.playOkSound = function() {
    SoundManager.playEquip();
};

Window_LicenseList.prototype.itemRect = function(index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = 0;
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX()+7;
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
    const width = itemWidth - colSpacing+2;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};

Window_LicenseList.prototype.itemHeight = function() {
    return Window_Selectable.prototype.itemHeight.call(this)*2;
};

Window_LicenseList.prototype.setAbilityListWindow = function(window) {
    this._abilityListWindow = window;
};

Window_LicenseList.prototype.callUpdateHelp = function() {
    Window_Selectable.prototype.callUpdateHelp.call(this);
    if (this._abilityListWindow) {
        this._abilityListWindow.setLicense(this.item());
        this._abilityListWindow.select(0);
        this._abilityListWindow.refresh();
    }
};

Window_LicenseList.prototype.processHandling = function() {
    Window_Command.prototype.processHandling.call(this);
    if (this.isOpenAndActive()) {
        if (this.isHandled("left") && Input.isTriggered("left")) {
            return this.processLeft();
        }
    }
};

Window_LicenseList.prototype.processLeft = function() {
    this.updateInputData();
    this.playCursorSound();
    this.callHandler("left");
};


//-----------------------------------------------------------------------------
// Window_LicenseAbilityList
//
// ライセンスで習得できるアビリティを表示・選択する

function Window_LicenseAbilityList() {
    this.initialize(...arguments);
}

Window_LicenseAbilityList.prototype = Object.create(Window_SkillList.prototype);
Window_LicenseAbilityList.prototype.constructor = Window_LicenseAbilityList;

Window_LicenseAbilityList.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._license = null;
    this._data = [];
    this.visible = false;
    this._jlevel = 0;
};

Window_LicenseAbilityList.prototype.maxCols = function() {
    return 1;
};

Window_LicenseAbilityList.prototype.isCurrentItemEnabled = function() {
    return true;
};

Window_LicenseAbilityList.prototype.makeItemList = function() {
    this._data = [];
    this._levels = [];
    this._aps = [];
    if (this._license) {
        const license = this._license;
        for(ability of license.traits){
            if(ability.code == Game_BattlerBase.TRAIT_SKILL_ADD){
                this._data.push($dataSkills[ability.dataId]);
                this._levels.push(0);
                this._aps.push(0);
            }
        }
        for(larning of license.learnings){
            this._data.push($dataSkills[larning.skillId]);
            this._levels.push(larning.level);
            //console.log(larning)
            if(this._aps.length > 0){
                this._aps.push(Number(this._aps[this._aps.length-1]+Number(larning.note)));
            }else{
                this._aps.push(Number(larning.note));
            }
        }
    }
};

Window_LicenseAbilityList.prototype.setLicense = function(license) {
    this._license = license;
    this._jlevel = this._actor.jLevelFromClass(license);
};

Window_LicenseAbilityList.prototype.drawItem = function(index) {
    const skill = this.itemAt(index);
    if (skill) {
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(this._jlevel >= this._levels[index]);
        if(this._aps[index]>0){
            this.changeTextColor(ColorManager.systemColor());
            this.drawText("JLv.",rect.x,rect.y,rect.width);
            this.changeTextColor(ColorManager.normalColor());
            this.drawText(this._levels[index], rect.x+16, rect.y, rect.width);
            this.drawText(this._aps[index], rect.x, rect.y, rect.width+8,"right");
        }else{
            this.changeTextColor(ColorManager.systemColor());
            this.drawText("MAIN",rect.x,rect.y,rect.width);
            this.changeTextColor(ColorManager.normalColor());
        }
        this.drawItemName(skill, rect.x+24, rect.y, rect.width);
        //this.drawSkillCost(skill, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
    }
};

Window_LicenseAbilityList.prototype.processHandling = function() {
    Window_Command.prototype.processHandling.call(this);
    if (this.isOpenAndActive()) {
        if (this.isHandled("right") && Input.isTriggered("right")) {
            return this.processRight();
        }
    }
};

Window_LicenseAbilityList.prototype.processRight = function() {
    this.updateInputData();
    this.playCursorSound();
    this.callHandler("right");
};

Window_LicenseAbilityList.prototype.setPlevWindow = function(window){
    this._plevWindow = window
}

Window_LicenseAbilityList.prototype.plevWindow = function(){
    return this._plevWindow;
}

ColorManager.bulletCostColor = function() {
    return this.textColor(30);
};

const _window_SkillList_drawSkillCost = Window_SkillList.prototype.drawSkillCost;
Window_SkillList.prototype.drawSkillCost = function(skill, x, y, width) {
    if (skill.stypeId == 34) {
        this.changeTextColor(ColorManager.tpCostColor());
        this.drawText(2, x, y, width, "right");
    }
    return _window_SkillList_drawSkillCost.apply(this,arguments);
};