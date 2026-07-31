//-----------------------------------------------------------------------------
// FNG_ActorSubcommand.js
//
// 防御・チェンジを行うサブコマンドウィンドウを表示する

//=============================================================================
// Window_ActorSubCommand
//=============================================================================

function Window_ActorSubCommand() {
    this.initialize(...arguments);
}

Window_ActorSubCommand.prototype = Object.create(Window_ActorCommand.prototype);
Window_ActorSubCommand.prototype.constructor = Window_ActorSubCommand;

Window_ActorSubCommand.prototype.initialize = function(rect) {
    Window_ActorCommand.prototype.initialize.call(this, rect);
    this.openness = 0;
    this.deactivate();
    this._actor = null;
};

Window_ActorSubCommand.prototype.makeCommandList = function() {
    if (this._actor) {
        this.addGuardCommand();
        this.addChangeCommand();
        this.addMemberChangeCommand();
    }
};
Window_ActorSubCommand.prototype.addMemberChangeCommand = function() {
    if(!$gameSwitches.value(34)){ //入れ替えが有効でないならreturn
        return;
    }
    const skill = $dataSkills[21];
    const enable = !$gameSwitches.value(38); // 全滅保険
    this.addCommand(skill ? skill.name : 'memberchange', 'memberchange', enable);
};

Window_ActorSubCommand.prototype.addChangeCommand = function() {
        const skill = $dataSkills[3];
        //隠れる状態はコマンドを無効化する
        //アトモス戦は封印
        const enable = !this._actor.isStateAffected(21)&&!$gameSwitches.value(191);
        this.addCommand(skill ? skill.name : 'Change', 'change', enable&&this.isChangeEnabled());
};

Window_ActorSubCommand.prototype.addGuardCommand = function() {
    this.addCommand(TextManager.guard, "guard", this._actor.canGuard());
};

Window_ActorSubCommand.prototype.setup = function(actor) {
    this._actor = actor;
    this.makeCommandList();
    this.refresh();
    this.selectLast();
    this.activate();
    this.open();
};

Window_ActorSubCommand.prototype.actor = function() {
    return this._actor;
};

Window_ActorSubCommand.prototype.processOk = function() {
    if (this._actor) {
        if (ConfigManager.commandRemember) {
            this._actor.setLastSubCommandSymbol(this.currentSymbol());
        } else {
            this._actor.setLastSubCommandSymbol("");
        }
    }
    Window_Command.prototype.processOk.call(this);
};

Window_ActorSubCommand.prototype.selectLast = function() {
    this.forceSelect(0);
    if (this._actor && ConfigManager.commandRemember) {
        const symbol = this._actor.lastSubCommandSymbol();
        this.selectSymbol(symbol);
    }
};

Window_ActorSubCommand.prototype.processCursorMove = function() {
    if (this.isCursorMovable()) {
        const lastIndex = this.index();
        if (Input.isRepeated("down")) {
            this.cursorDown(Input.isTriggered("down"));
        }
        if (Input.isRepeated("up")) {
            this.cursorUp(Input.isTriggered("up"));
        }
        //rightはHandringで処理 それ以外は使わない
        if (this.index() !== lastIndex) {
            this.playCursorSound();
        }
    }
};

Window_ActorSubCommand.prototype.processHandling = function() {
    Window_Command.prototype.processHandling.call(this);
    if (this.isOpenAndActive()) {
        if (this.isHandled("right") && Input.isTriggered("right")) {
            return this.processRight();
        }
    }
};

Window_ActorSubCommand.prototype.processRight = function() {
    //this.updateInputData();
    this.callHandler("right");
};


//=============================================================================
// Game_Actor
// カーソル記憶用
//=============================================================================

Game_Actor.prototype.lastSubCommandSymbol = function() {
    return this._lastSubCommandSymbol;
};

Game_Actor.prototype.setLastSubCommandSymbol = function(symbol) {
    this._lastubCommandSymbol = symbol;
};

//=============================================================================
// Scene_Battle
// ウィンドウの処理
//=============================================================================
Scene_Battle.prototype.createActorSubCommandWindow = function() {
    const rect = this.actorCommandWindowRect();
    rect.x = rect.x + $TILE*2;
    rect.width = rect.width - $TILE*4;
    if($gameSwitches.value(34)){
        rect.height = rect.height - $TILE;
    }else{
        rect.height = rect.height - $TILE*1.5;
    }
    const subCommandWindow = new Window_ActorSubCommand(rect);
    subCommandWindow.y = Graphics.boxHeight - subCommandWindow.height - $TILE;
    subCommandWindow.setHandler("guard", this.commandGuard.bind(this));
    subCommandWindow.setHandler("change", this.commandChange.bind(this));
    if($gameSwitches.value(34)){
        subCommandWindow.setHandler("memberchange", this.commandMemberChange.bind(this));
    }
    this.addWindow(subCommandWindow);
    this._actorSubCommandWindow = subCommandWindow;
};

const _scene_battle_createAllWindows2 = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
    _scene_battle_createAllWindows2.apply(this,arguments);
    this.createActorSubCommandWindow();
    this._actorSubCommandWindow.setHandler("right", this.subCommandRight.bind(this));    
};

Scene_Battle.prototype.subCommandRight = function() {
    this._actorSubCommandWindow.playCursorSound();
    this._actorSubCommandWindow.close();
    this._actorSubCommandWindow.deactivate();
    this._actorCommandWindow.activate();
};

const _scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
Scene_Battle.prototype.createActorCommandWindow = function() {
    _scene_Battle_createActorCommandWindow.apply(this,arguments);
    this._actorCommandWindow.setHandler("left", this.commandLeft.bind(this));
    this._actorCommandWindow.setHandler("shift", this.commandShift.bind(this));
    this._actorCommandWindow.setHandler("right", this.commandRight.bind(this));
};

Scene_Battle.prototype.commandLeft = function() {
    if(BattleManager._currentActor.isStateAffected(16)){
        return;
    }
    this._actorSubCommandWindow.setup(this._actorCommandWindow._actor);
    this._actorSubCommandWindow.playCursorSound();
    this._actorSubCommandWindow.open();
    this._actorSubCommandWindow.activate();
    this._actorCommandWindow.deactivate();
};

Scene_Battle.prototype.commandRight = function() {
    if(BattleManager._currentActor && !BattleManager._currentActor.isStateAffected(16) && (BattleManager._currentActor.isStateAffected(28)||
      BattleManager._currentActor.tp >= 100)){
        SoundManager.playCursor();
        const actor = BattleManager.actor();
        this._skillWindow.setActor(BattleManager.actor());
        if($dataActors[actor.actorId()].meta.ODSkillType){
            const type = Number($dataActors[actor.actorId()].meta.ODSkillType);
            this._skillWindow.setStypeId(type);
        }else{
            this._skillWindow.setStypeId(4);
        }
        this._skillWindow.refresh();
        this._skillWindow.show();
        this._skillWindow.activate();
        this._actorCommandWindow.setShowingODWindow()
        this._actorCommandWindow.deactivate();
    }
};

Scene_Battle.prototype.commandShift = function() {
    BattleManager.startFastForwarding();
};

Scene_Battle.prototype.commandGuard = function() {
    this._actorSubCommandWindow.close();
    this._actorSubCommandWindow.deactivate();    
    const action = BattleManager.inputtingAction();
    action.setGuard();
    this.onSelectAction();
};

Scene_Battle.prototype.commandChange = function() {
    this._actorSubCommandWindow.close();
    this._actorSubCommandWindow.deactivate();
    const action = BattleManager.inputtingAction();
    action.setChange();
    this.selectNextCommand();
};

Scene_Battle.prototype.commandMemberChange = function() {
    this._actorSubCommandWindow.deactivate();
    this._actorCommandWindow.deactivate();
    
    this._subActorWindow.refresh();
    this._subActorWindow.show();
    this._subActorWindow.open();
    this._subActorWindow.activate();
};

const _scene_Battle_isAnyInputWindowActive = Scene_Battle.prototype.isAnyInputWindowActive;
Scene_Battle.prototype.isAnyInputWindowActive = function() {
    return this._subActorWindow.active || this._actorSubCommandWindow.active || _scene_Battle_isAnyInputWindowActive.apply(this,arguments);
};

//=============================================================================
// Game_Action
// 対象選択が不要なスキルにぼうぎょとチェンジとあらわれるを定義
//=============================================================================

Game_Action.prototype.needsSelection = function() {
    // 防御・チェンジは除外
    if (this.isGuard() || this.item() === $dataSkills[3] || this.item() === $dataSkills[208]) {
        return false;
    }
    // それ以外は要選択
    return true;
};

//=============================================================================
// Window_ActorCommand
// サブコマンドを開けるようにする
//=============================================================================
Window_ActorCommand.prototype.processCursorMove = function() {
    if (this.isCursorMovable()) {
        const lastIndex = this.index();
        if (Input.isRepeated("down")) {
            this.cursorDown(Input.isTriggered("down"));
        }
        if (Input.isRepeated("up")) {
            this.cursorUp(Input.isTriggered("up"));
        }
        // left,rightはHandlingで処理
        // それ以外は使わない
        if (this.index() !== lastIndex) {
            this.playCursorSound();
        }
    }
};

Window_ActorCommand.prototype.processHandling = function() {
    Window_Command.prototype.processHandling.call(this);
    if (this.isOpenAndActive()) {
        if (this.isHandled("left") && Input.isTriggered("left")) {
            return this.processLeft();
        }
        if (this.isHandled("right") && Input.isTriggered("right")) {
            return this.processRight();
        }
        if (this.isHandled("shift") && Input.isPressed("shift")) {
            return this.processShift();
        }else if(BattleManager.fastForwarding()){
            BattleManager.endFastForwarding();
        }
    }
};

Window_ActorCommand.prototype.processLeft = function() {
    //this.updateInputData();
    this.callHandler("left");
};

Window_ActorCommand.prototype.processRight = function() {
    //this.updateInputData();
    this.callHandler("right");
};

Window_ActorCommand.prototype.processShift = function() {
    this.callHandler("shift");
};

Window_ActorCommand.prototype.setShowingODWindow = function() {
    this._showingODWindow = true;
};

Window_ActorCommand.prototype.resetShowingODWindow = function() {
    this._showingODWindow = false;
};

Window_ActorCommand.prototype.isShowingODWindow = function() {
    return this._showingODWindow;
};

Window_ActorCommand.prototype.callShiftHandler = function() {
    this.callHandler("shift");
};

//-----------------------------------------------------------------------------
// Window_BattleSubActor
//

function Window_BattleSubActor() {
    this.initialize(...arguments);
}

Window_BattleSubActor.prototype = Object.create(Window_MenuStatus.prototype);
Window_BattleSubActor.prototype.constructor = Window_BattleSubActor;

Window_BattleSubActor.prototype.initialize = function(rect) {
    Window_MenuStatus.prototype.initialize.call(this, rect);
    this.openness = 255;
    this.hide();
    this._index = 0;
};

Window_BattleSubActor.prototype.maxItems = function() {
    return $gameParty.separatedMembers(2).length;
};

Window_BattleSubActor.prototype.actor = function(index) {
    return $gameParty.separatedMembers(2)[index];
};

Window_BattleSubActor.prototype.drawItem = function(index) {
    if(this.actor(index)){
        this.drawItemStatus(index);
    }
};

Window_BattleSubActor.prototype.drawItemStatus = function(index) {
    const actor = this.actor(index);
    const rect = this.itemRect(index);
    const x = rect.x;
    const y = rect.y;
    this.drawActorSimpleStatus(actor, x, y);
};

Window_BattleSubActor.prototype.drawActorSimpleStatus = function(actor, x, y) {
    this.drawActorName(actor, x, y);
    this.drawActorHp(actor, x+42, y, 4*12);
    this.drawActorMp(actor, x+76, y, 4*12);
};

Window_BattleSubActor.prototype.drawActorHp = function(actor, x, y, width) {
    const text = actor.hp + '/' + actor.mhp;
    
    //ゲージは描画しない
    this.resetTextColor();
    this.drawText(text, x, y,4*12,'right');
};

Window_BattleSubActor.prototype.drawActorMp = function(actor, x, y, width) {
    const text = actor.mp + '/' + actor.mmp;
    
    //ゲージは描画しない
    this.resetTextColor();
    this.drawText(text, x, y,4*12,'right');
};

Window_BattleSubActor.prototype.processOk = function() {
    Window_Command.prototype.processOk.call(this);
};

Window_BattleSubActor.prototype.processCancel = function() {
    Window_Command.prototype.processCancel.call(this);
};


const _scene_battle_createAllWindows7 = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
    _scene_battle_createAllWindows7.apply(this,arguments);
    this.createBattleSubActorWindow();   
};

Scene_Battle.prototype.createBattleSubActorWindow = function() {
    const rect = this.actorWindowRect();
    rect.x = 100
    rect.y = 110
    this._subActorWindow = new Window_BattleSubActor(rect);
    this._subActorWindow.setHandler("ok", this.onSubActorOk.bind(this));
    this._subActorWindow.setHandler("cancel", this.onSubActorCancel.bind(this));
    this.addWindow(this._subActorWindow);
};

Scene_Battle.prototype.onSubActorOk = function() {
    BattleManager._changeAcrtorIndex = this._subActorWindow.index()
    this._subActorWindow.close();
    this._actorSubCommandWindow.close();
    this._actorSubCommandWindow.deactivate();
    const action = BattleManager.inputtingAction();
    action.setSkill(21);
    this.selectNextCommand();
};

Scene_Battle.prototype.onSubActorCancel = function() {
    this._subActorWindow.close();
    this._actorSubCommandWindow.activate();
};

BattleManager.memberChange = function(a,b){
    var index1 = a
    var index2 = b
    const actor1 = $gameParty.members()[index1]
    const actor2 = $gameParty.separatedMembers(2)[index2]
    $gameParty._actors[a] = actor2.actorId()

    $gameActors._data[actor2.actorId()]._tpbState = "charging";
    $gameActors._data[actor2.actorId()]._tpbChargeTime = 1;
    $gameParty._separatedMembers[1][b] = actor1
}


BattleManager.allMemberChange = function(){
    var actorIds = [];
    for(actor of $gameParty.separatedMembers(2)){
        actorIds.push(actor.actorId())
    }
    var actors = [];
    for(actor of $gameParty.members()){
        actors.push(actor)
    }
    
    $gameParty._actors = actorIds
    $gameParty._separatedMembers[1] = actors

    for(actor of $gameParty.members()){
        actor._tpbState = "charging";
        actor._tpbChargeTime = 0.5;
    }
}
