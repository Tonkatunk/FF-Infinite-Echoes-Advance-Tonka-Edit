//=============================================================================
// FNG_MemberChange.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc メニュー画面でパーティ編成をできるようにします
  * @author finga
  * @help メンバーを入れ替える際、入れ替え元のHPとMPを引き継ぎます
*/

//-----------------------------------------------------------------------------
// Scene_Menu
//
// メニュー画面の改造部分

const _scene_menu_create = Scene_Menu.prototype.create;
Scene_Menu.prototype.create = function() {
    _scene_menu_create.apply(this,arguments);
    this.createSubMembersWindow();
    this.createMemberChangeStatusWindow();
    this._subMembersWindow.setMemberChangeStatusWindow(this._memberChangeStatusWindow);
   this._statusWindow.setMemberChangeStatusWindow(this._memberChangeStatusWindow); this._statusWindow.setHandler('pagedown',this.onFormationRbutton.bind(this));
   this._statusWindow.setHandler('right',this.onFormationRbutton.bind(this)); 
};

Scene_Menu.prototype.createMemberChangeStatusWindow = function() {
    const rect = this.memberChangeStatusWindowRect();
    const memberChangeStatusWindow = new Window_MemberChangeStatus(rect);
    this.addWindow(memberChangeStatusWindow);
    this._memberChangeStatusWindow = memberChangeStatusWindow;
    this._memberChangeStatusWindow.hide();
};

Scene_Menu.prototype.memberChangeStatusWindowRect = function() {
    const ww = Graphics.boxWidth*5/9;
    const wh = Graphics.boxHeight*27/100;
    const wx = Math.floor(Graphics.boxWidth*4/9);
    const wy = Math.floor(Graphics.boxHeight*73/100);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Menu.prototype.createSubMembersWindow = function() {
    const rect = this.subMembersWindowRect();
    const subMembersWindow = new Window_SubMembers(rect);
    this.addWindow(subMembersWindow);
    this._subMembersWindow = subMembersWindow;
    this._subMembersWindow.deactivate();
    this._subMembersWindow.hide();
   this._subMembersWindow.setHandler('left',this.onSubMembersLeft.bind(this));
    this._subMembersWindow.setHandler('pageup',this.onSubMembersLbutton.bind(this));
    this._subMembersWindow.setHandler('ok',this.onSubMembersOk.bind(this));
    this._subMembersWindow.setHandler('cancel',this.onSubMembersCancel.bind(this));
};

Scene_Menu.prototype.subMembersWindowRect = function() {
    const ww = Graphics.boxWidth*5/9;
    const wh = Graphics.boxHeight*73/100;
    const wx = Math.floor(Graphics.boxWidth*4/9);
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};

const _scene_menu_commandFormation = Scene_Menu.prototype.commandFormation;
Scene_Menu.prototype.commandFormation = function() {
    _scene_menu_commandFormation.apply(this,arguments);
    if(!$gameSwitches.value(37)){ //メニュー入れ替え禁止なら表示しない
        this._subMembersWindow.show();
        this._memberChangeStatusWindow.show();
    }
    this._subMembersWindow.drawItemAll();
};

//const _scene_menu_onFormationCancel = Scene_Menu.prototype.onFormationCancel;
Scene_Menu.prototype.onFormationCancel = function() {
    if(this._subMembersWindow.pendingIndex() >= 0){
        const pend = this._subMembersWindow.pendingIndex();
        this._subMembersWindow.select(pend);
        this._subMembersWindow.setPendingIndex(-1);
        this._subMembersWindow.activate();
        this._statusWindow.deactivate();
    }else if(this._statusWindow.pendingIndex() >= 0){
        this._statusWindow.setPendingIndex(-1);
        this._statusWindow.activate();
    }else{
        this._subMembersWindow.deactivate();
        this._subMembersWindow.hide();
        this._memberChangeStatusWindow.hide();
        this._statusWindow.deselect();
        this._commandWindow.activate();
    }
};

Scene_Menu.prototype.onFormationRbutton = function() {
    if(this._statusWindow.formationMode()){
        this._subMembersWindow.playCursorSound();
        this._subMembersWindow.activate();
        this._statusWindow.deactivate();
    }else{
        this._statusWindow.activate();
    }
};

Scene_Menu.prototype.onSubMembersLbutton = function() {
    this._subMembersWindow.playCursorSound();
    this._subMembersWindow.deactivate();
    this._statusWindow.activate();
};

Scene_Menu.prototype.onSubMembersLeft = function() {
    if(this._subMembersWindow.index() % this._subMembersWindow.maxCols() == 0){
        this.onSubMembersLbutton();
    }else{
        this._subMembersWindow.playCursorSound();
        this._subMembersWindow.cursorLeft(Input.isTriggered("left"));
    }
};

Scene_Menu.prototype.onSubMembersOk = function() {
    const index = this._subMembersWindow.index();
    const subPend = this._subMembersWindow.pendingIndex();
    const mainPend = this._statusWindow.pendingIndex();
    if(!this._subMembersWindow.item()){
        SoundManager.playBuzzer();
        this._subMembersWindow.activate();
        return;
    }
    if (subPend >= 0) {
            $gameParty.swapOrderSub(index, subPend);        
            this._subMembersWindow.setPendingIndex(-1);
            this._subMembersWindow.getSubmembers();
            this._subMembersWindow.drawItemAll();
            SoundManager.playOk();
    } else {
        if(mainPend >= 0){
            AudioManager.playSe({"name":"FF8 drawpoint","volume":90,"pitch":100,"pan":0})
            this.memberChangeOnSubWindow();
            this._statusWindow.setPendingIndex(-1);
           this._subMembersWindow.getSubmembers(); this._statusWindow.redrawItem(this._statusWindow.index());
            this._subMembersWindow.drawItemAll();
        }else{
            SoundManager.playOk();
            this._subMembersWindow.setPendingIndex(index);
        }
    }
    this._subMembersWindow.activate();
};

Scene_Menu.prototype.onSubMembersCancel = function() {
    const subPend = this._subMembersWindow.pendingIndex();
    const mainPend = this._statusWindow.pendingIndex();
    if (subPend >= 0) {
            this._subMembersWindow.select(subPend);   
            this._subMembersWindow.setPendingIndex(-1);
            this._subMembersWindow.activate();
    } else {
        if(mainPend >= 0){
            this._statusWindow.setPendingIndex(-1);
            this._statusWindow.activate();
            this._subMembersWindow.deactivate();
        }else{
            this._subMembersWindow.deactivate();
            this._subMembersWindow.hide();
            this._memberChangeStatusWindow.hide();
            this._statusWindow.deselect();
            this._commandWindow.activate();
        }
    }
};

Scene_Menu.prototype.memberChangeOnSubWindow = function(){
    //console.log($gameParty._actors);
    //console.log($gameParty._subMembers);

    const mainActorId = $gameParty._actors[this._statusWindow.pendingIndex()];
    const mainActor = $gameActors.actor(mainActorId);
    const subActor = $gameParty._subMembers[this._subMembersWindow.index()];
    //console.log($gameActors.actor(subActor.actorId()).name(),$gameActors.actor(subActor.actorId())._exp[subActor._classId]);
    $gameParty._actors[this._statusWindow.pendingIndex()] = subActor.actorId();
    $gameParty._subMembers[this._subMembersWindow.index()] = mainActor;
    $gameParty._subMembers[this._subMembersWindow.index()].clearEquipments();
    $gameActors.actor(subActor.actorId()).setHp(Math.min(mainActor._hp,subActor.mhp));
    $gameActors.actor(subActor.actorId()).setMp(Math.min(mainActor._mp,subActor.mmp));
    if(mainActor.crystal()&&!subActor.crystal()){
        mainActor.crystal().setActor(subActor);
    }
    if($gameVariables.value(1)==0){ //フロアが０の場合は全回復
        mainActor.recoverAll();
    }
    //console.log($gameActors.actor(subActor.actorId()).name(),$gameActors.actor(subActor.actorId())._exp[subActor._classId]);
}

const _scene_menu_onFormationOk = Scene_Menu.prototype.onFormationOk;
Scene_Menu.prototype.onFormationOk = function() {
    const index = this._statusWindow.index();
    const subPend = this._subMembersWindow.pendingIndex();
    const mainPend = this._statusWindow.pendingIndex();
    if (mainPend >= 0) {
        _scene_menu_onFormationOk.apply(this,arguments);
        SoundManager.playOk();
    } else {
        if(subPend >= 0){
    AudioManager.playSe({"name":"FF8 drawpoint","volume":90,"pitch":100,"pan":0})
            this.memberChangeOnStatusWindow();
            this._subMembersWindow.setPendingIndex(-1);
           this._subMembersWindow.getSubmembers(); this._statusWindow.redrawItem(this._statusWindow.index());
            this._subMembersWindow.drawItemAll();
            
            //console.log($gameActors.actor(subActor.actorId()).name(),$gameActors.actor(subActor.actorId())._exp[subActor._classId]);
        }else{
            SoundManager.playOk();
            this._statusWindow.setPendingIndex(index);
        }
    }
    this._statusWindow.activate();
};

Scene_Menu.prototype.memberChangeOnStatusWindow = function(){
    const mainActorId = $gameParty._actors[this._statusWindow.index()];
    const mainActor = $gameActors.actor(mainActorId);
    const subActor = $gameParty._subMembers[this._subMembersWindow.pendingIndex()];
    $gameParty._actors[this._statusWindow.index()] = subActor.actorId();
    $gameParty._subMembers[this._subMembersWindow.pendingIndex()] = mainActor;
    $gameParty._subMembers[this._subMembersWindow.pendingIndex()].clearEquipments();
    //console.log($gameParty._actors);
    $gameActors.actor(subActor.actorId()).setHp(Math.min(mainActor._hp,subActor.mhp));
    $gameActors.actor(subActor.actorId()).setMp(Math.min(mainActor._mp,subActor.mmp));
    if($gameVariables.value(1)==0){ //フロアが０の場合は全回復
        subActor.recoverAll();
    }
}

//-----------------------------------------------------------------------------
// Game_Party
//
// 待機メンバーを扱う
const _game_pirty_initialize = Game_Party.prototype.initialize;
Game_Party.prototype.initialize = function() {
    _game_pirty_initialize.apply(this,arguments);
    this._subMembers = [];
};

Game_Party.prototype.addSubMember = function(actor) {
    this._subMembers.push(actor);
};

Game_Party.prototype.resetSubMember = function() {
    this._subMembers = [];
};

Game_Party.prototype.removeSubMember = function(actor) {
    var i = 0;
    for(submember of this._submembers){
        if(submember.actorId() == actor.actorId()){
            this._submembers(i,1)
        }
        i = i + 1;
    }
};

Game_Party.prototype.subMembers = function() {
    //重複を削除
    const membersId =[];
    for(actor of this._subMembers){
        if(actor && !membersId.includes(actor.actorId())){
            membersId.push(actor.actorId())
        }
    }
    this._subMembers = [];
    for(id of membersId){
        this._subMembers.push($gameActors.actor(id));
    }
    return this._subMembers;
};

Game_Party.prototype.swapOrderSub = function(index1, index2) {
    const temp = this._subMembers[index1];
    this._subMembers[index1] = this._subMembers[index2];
    this._subMembers[index2] = temp;
    $gamePlayer.refresh();
};

//-----------------------------------------------------------------------------
// Window_MenuStatus
//
// 左右キーによる操作ハンドラを追加する
Window_MenuStatus.prototype.setMemberChangeStatusWindow = function(memberChangeStatusWindow) {
    this._memberChangeStatusWindow = memberChangeStatusWindow;
};


const _window_menuStaus_initialize = Window_MenuStatus.prototype.initialize
Window_MenuStatus.prototype.initialize = function() {
    _window_menuStaus_initialize.apply(this,arguments);
    this.createHandCursor();
};

const _window_menuStaus_update = Window_MenuStatus.prototype.update
Window_MenuStatus.prototype.update = function() {
    _window_menuStaus_update.apply(this,arguments);
    if (this.isCursorMovable() && this._formationMode) {
        this._memberChangeStatusWindow.setActor($gameParty.members()[this._index]);
        this._memberChangeStatusWindow.refresh;
    }
    
    if (!this.active) {
        this.setCursorRect(0, 0, 0, 0);
    }
    
    if (this._handCursorSprite && this.active) {
        const rect = this.itemRect(this.index());
        this._handCursorSprite.visible = true;

        // 指マークを矩形の左端に配置（Y座標は中央）
        this._handCursorSprite.x = rect.x - this._handCursorSprite.width + 10+4;
        this._handCursorSprite.y = rect.y + (rect.height - this._handCursorSprite.height) / 2+2;
    } else if (this._handCursorSprite) {
        this._handCursorSprite.visible = false;
    }

    if (this._tempHandCursorSprite && this._pendingIndex > -1) {
        const rect = this.itemRect(this._pendingIndex);
        this._tempHandCursorSprite.visible = true;
        this._tempHandCursorSprite.opacity = 191;

        // 指マークを矩形の左端に配置（Y座標は中央）
        this._tempHandCursorSprite.x = rect.x - this._tempHandCursorSprite.width + 10 +6;
        this._tempHandCursorSprite.y = rect.y + (rect.height - this._tempHandCursorSprite.height) / 2;
    } else if (this._tempHandCursorSprite || this._pendingIndex == 0) {
        this._tempHandCursorSprite.visible = false;
    }
};

Window_MenuStatus.prototype.processHandling = function() {
    Window_Selectable.prototype.processHandling.call(this);
    if (this.isOpenAndActive()) {
        if (this.isHandled("right") && Input.isTriggered("right")) {
            
            if($gameSwitches.value(37)){ //メニュー入れ替え禁止ならreturn
                return;
            }
            return this.processRight();
        }
    }
};

Window_MenuStatus.prototype.processRight = function() {
    this.updateInputData();
    this.callHandler("right");
};

Window_MenuStatus.prototype.createHandCursor = function() {
    const bitmap = ImageManager.loadSystem("cursor");
    this._tempHandCursorSprite = new Sprite(bitmap);
    this._handCursorSprite = new Sprite(bitmap);
    this.addChild(this._tempHandCursorSprite);
    this.addChild(this._handCursorSprite);
};


//-----------------------------------------------------------------------------
// Window_SubMembers
//
// 待機メンバーを選ぶウィンドウ

function Window_SubMembers() {
    this.initialize(...arguments);
}

Window_SubMembers.prototype = Object.create(Window_ItemList.prototype);
Window_SubMembers.prototype.constructor = Window_SubMembers;

Window_SubMembers.prototype.initialize = function(rect) {
    Window_ItemList.prototype.initialize.call(this, rect);
    this._index = 0;
    this._data = $gameParty.subMembers();
    for(let i = 0;i<this._data.length%this.maxCols();i++){
		this._data.push(null);
	}
    this._pendingIndex = -1;
    this.createHandCursor();
    this.loadSvActorImages();
    this.drawItemAll();
};

Window_SubMembers.prototype.getSubmembers = function() {
    this._data = $gameParty.subMembers();
    for(let i = 0;i<this._data.length%this.maxCols();i++){
		this._data.push(null);
	}
};

Window_SubMembers.prototype.update = function() {
    Window_ItemList.prototype.update.call(this);
    if(this.isOpenAndActive()){
        if(!this._data[this._index]){
            return;
        }
        const actor = $gameActors.actor(this._data[this._index].actorId());
        this._memberChangeStatusWindow.setActor(actor);
    }
    
    if (!this.active) {
        this.setCursorRect(0, 0, 0, 0);
    }
    
    if (this._handCursorSprite && this.active) {
        const rect = this.itemRect(this.index());
        this._handCursorSprite.visible = true;

        // 指マークを矩形の左端に配置（Y座標は中央）
        this._handCursorSprite.x = rect.x - this._handCursorSprite.width + 10;
        this._handCursorSprite.y = rect.y + (rect.height - this._handCursorSprite.height) / 2;
    } else if (this._handCursorSprite) {
        this._handCursorSprite.visible = false;
    }

    if (this._tempHandCursorSprite && this._pendingIndex > -1) {
        const rect = this.itemRect(this._pendingIndex);
        this._tempHandCursorSprite.visible = true;
        this._tempHandCursorSprite.opacity = 191;

        // 指マークを矩形の左端に配置（Y座標は中央）
        this._tempHandCursorSprite.x = rect.x - this._tempHandCursorSprite.width + 10 +2;
        this._tempHandCursorSprite.y = rect.y + (rect.height - this._tempHandCursorSprite.height) / 2 -2;
    } else if (this._tempHandCursorSprite || this._pendingIndex == 0) {
        this._tempHandCursorSprite.visible = false;
    }
};

Window_SubMembers.prototype.setPendingIndex = function(index) {
    this._pendingIndex = index;
};

Window_SubMembers.prototype.pendingIndex = function() {
    return this._pendingIndex;
};

Window_SubMembers.prototype.setMemberChangeStatusWindow = function(memberChangeStatusWindow) {
    this._memberChangeStatusWindow = memberChangeStatusWindow;
};

Window_SubMembers.prototype.loadSvActorImages = function() {
    for (const actor of this._data) {
        if(actor == "OK" || !actor){
            return;
        }
        ImageManager.loadSvActor(actor.battlerName());
    }
};

Window_SubMembers.prototype.drawItemAll = function() {
    this.contents.clear();
    var i=0;
    for(actor of this._data){
        this.drawItem(i);
        i = i+1;
    }
};

Window_SubMembers.prototype.drawItem = function(index) {
    const item = this._data[index];
    if (item) {

        const rect = this.itemRect(index);

        if(item == "OK"){
            this.drawText(item,rect.x+8,rect.y/*+this.lineHeight()/2*/,16,16);
            return;
        }

        this.drawSvActor(item.battlerName(), 10, rect.x-2, rect.y-7);
        //this.drawText(item.battlerName(), rect.x+8,rect.y+10,16,16);
    }
};

Window_SubMembers.prototype.maxCols = function() {
    return 5;
};

Window_SubMembers.prototype.lineHeight = function() {
    return this.innerHeight/4;
};


Window_SubMembers.prototype.isEnabled = function(index) {
    return true;
};

Window_SubMembers.prototype.playOkSound = function(index) {
    
};

Window_SubMembers.prototype.processCursorMove = function() {
    if (this.isCursorMovable()) {
        const lastIndex = this.index();
        if (Input.isRepeated("down")) {
            this.cursorDown(Input.isTriggered("down"));
        }
        if (Input.isRepeated("up")) {
            this.cursorUp(Input.isTriggered("up"));
        }
        if (Input.isRepeated("right")) {
            this.cursorRight(Input.isTriggered("right"));
        }
        //leftはHandringで処理
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

Window_SubMembers.prototype.processHandling = function() {
    Window_Selectable.prototype.processHandling.call(this);
    if (this.isOpenAndActive()) {
        if (this.isHandled("left") && Input.isTriggered("left")) {
            return this.processLeft();
        }
    }
};

Window_SubMembers.prototype.processLeft = function() {
    this.updateInputData();
    this.callHandler("left");
};

Window_SubMembers.prototype.cursorLeft = function(wrap) {
    if(this._index % this.maxCols() != 0){
        Window_Selectable.prototype.cursorLeft.call(this);
    }
};

Window_SubMembers.prototype.cursorRight = function(wrap) {
    if(this._index % this.maxCols() != this.maxCols()-1){
        Window_Selectable.prototype.cursorRight.call(this);
    }
};

Window_SubMembers.prototype.createHandCursor = function() {
    const bitmap = ImageManager.loadSystem("cursor");
    this._tempHandCursorSprite = new Sprite(bitmap);
    this._handCursorSprite = new Sprite(bitmap);
    this.addChild(this._tempHandCursorSprite);
    this.addChild(this._handCursorSprite);
};


//-----------------------------------------------------------------------------
// Window_MemberChangeStatus
//
// メンバーチェンジ時に表示するステータスウィンドウ

function Window_MemberChangeStatus() {
    this.initialize(...arguments);
}

Window_MemberChangeStatus.prototype = Object.create(Window_StatusBase.prototype);
Window_MemberChangeStatus.prototype.constructor = Window_MemberChangeStatus;

Window_MemberChangeStatus.prototype.initialize = function(rect) {
    Window_StatusBase.prototype.initialize.call(this,rect);
    this._actor = null;
};

Window_MemberChangeStatus.prototype.setActor = function(actor) {
    if(actor != this._actor){
        this._actor = actor;
        if(this._actor){
            this.drawStatus();
        }
    }
};

Window_MemberChangeStatus.prototype.refresh = function(refresh) {
    Window_StatusBase.prototype.refresh.call(this);
    if(this._actor){
        this.drawStatus();
    }
};

Window_MemberChangeStatus.prototype.drawStatus = function() {
    this.contents.clear();
    const x = 0;
    const h = this.innerHeight;
    const lineHeight = this.lineHeight();
    const y = h / 2 - lineHeight * 1.5;
    this.drawSvActor(this._actor.battlerName(), 10, -this.padding, 0);
    this.changeTextColor(ColorManager.normalColor());
    this.drawText(this._actor.name(), this.contents.fontSize*2.5, this.contents.fontSize*0.25, this.width-this.padding*2-this.contents.fontSize*3);
    this.changeTextColor(ColorManager.systemColor());
    this.drawText("Lv.", this.contents.fontSize*8.75, this.contents.fontSize*0.25,this.contents.fontSize*2);
    this.drawText("JLv.", this.contents.fontSize*11.75, this.contents.fontSize*0.25,this.contents.fontSize*2);
    this.changeTextColor(ColorManager.normalColor());
    this.drawText(this._actor.level, this.contents.fontSize*10.25, this.contents.fontSize*0.25,this.contents.fontSize);
    this.drawActorHp(this._actor, this.contents.fontSize*2.5, this.contents.fontSize*1.75, this.contents.fontSize*10);
    this.drawActorMp(this._actor, this.contents.fontSize*2.5, this.contents.fontSize*3, this.contents.fontSize*10);
    this.drawIcon(58,this.contents.fontSize*9, this.contents.fontSize*2.5);
    this.drawIcon(59,this.contents.fontSize*11, this.contents.fontSize*2.5);
    this.drawIcon(60,this.contents.fontSize*13, this.contents.fontSize*2.5);
    this.placeGauge(this._actor, "tp", this.contents.fontSize*7.75, this.contents.fontSize*2.5+this.contents.fontSize);
    if(this._actor.isJobMaster()){
        this.drawIcon(57,this.contents.fontSize*13.25, this.contents.fontSize*-0.5);
    }else{
        this.resetTextColor();
        this.drawText(this._actor.jLevel(), this.contents.fontSize*11.25, this.contents.fontSize*0.25, this.contents.fontSize*3, "right");
        const text = '   ' + this._actor.currentAp()+'/'+this._actor.nextAp();
        this.drawText(text, this.contents.fontSize*10.25, this.contents.fontSize*1.75);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText('AP', this.contents.fontSize*8.75, this.contents.fontSize*1.75);
    }
    if(this._actor.crystal()){
        this.drawIcon($dataItems[this._actor.crystal()._id+249].iconIndex,x+this.contents.fontSize, this.contents.fontSize*2.75);
    }
};

// HPゲージを表示しない
Window_MemberChangeStatus.prototype.drawActorHp = function(actor, x, y, width) {
    
    const text = actor.hp + '/' + actor.mhp;
    
    //ゲージは描画しない
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.hpA, x, y);
    this.resetTextColor();
    this.drawText(text, x, y,4*12,'right');
};

//MPゲージを表示しない
Window_MemberChangeStatus.prototype.drawActorMp = function(actor, x, y, width) {    
    const text = actor.mp + '/' + actor.mmp;
    
    //ゲージは描画しない
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.mpA, x, y);
    this.resetTextColor();
    this.drawText(text, x, y,4*12,'right');
};
