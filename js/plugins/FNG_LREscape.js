//-----------------------------------------------------------------------------
// FNG_LREscape.js
//
// バトル時、コマンドウィンドウをスキップし別のアクターへ入力を移す。

//-----------------------------------------------------------------------------
// Window_InputEscape
// 逃げ入力専用の透明なウィンドウ

function Window_InputEscape() {
    this.initialize(...arguments);
}

Window_InputEscape.prototype = Object.create(Window_Command.prototype);
Window_InputEscape.prototype.constructor = Window_InputEscape;

Window_InputEscape.prototype.initialize = function() {
    const rect = new Rectangle(0,0,0,0);
    Window_Command.prototype.initialize.call(this, rect);
    this.hide();
    this.activate();
};

Window_InputEscape.prototype.processCursorMove = function() {
};

Window_InputEscape.prototype.processHandling = function() {
    Window_Command.prototype.processHandling.call(this);
    if (this.active) {
        if (Input.isPressed("pageup") && Input.isPressed("pagedown")) {
            this.processEscaping();
        }else{
            this.processNotEscaping();
        }
    }
};

Window_InputEscape.prototype.processEscaping = function() {
    this.callHandler("escaping");
};

Window_InputEscape.prototype.processNotEscaping = function() {
    this.callHandler("notescaping");
};

Window_InputEscape.prototype.playBuzzerSound = function() {
};


Scene_Battle.prototype.createInputEscapeWindow = function() {
    const commandWindow = new Window_InputEscape();
    commandWindow.y = Graphics.boxHeight - commandWindow.height;
    commandWindow.setHandler("escaping", this.escaping.bind(this));
    commandWindow.setHandler("notescaping", this.notEscaping.bind(this));
    this.addWindow(commandWindow);
    this._inputEscapeWindow = commandWindow;
    //this._inputEscapeWindow.deactivate();
};

Scene_Battle.prototype.escaping = function() {
    BattleManager._escaping = true;
};

Scene_Battle.prototype.notEscaping = function() {
    BattleManager._escaping = false;
};

const _scene_battle_createAllWindows3 = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
    _scene_battle_createAllWindows3.apply(this,arguments);
    this.createInputEscapeWindow();   
};

const _battleManager_updateTpb = BattleManager.updateTpb;
BattleManager.updateTpb = function() {
    if ($gameTimer.isWorking() && $gameTimer.frames() <= 0){
        for(actor of $gameParty.members()){
            actor.clearTpbChargeTime();
        }
        for(enemy of $gameTroop.members()){
            enemy.clearTpbChargeTime();
        }
        this.onEscapeSuccess();
        return;
    }
    if(this._escaping){
        this.updateEscaping();
        if(BattleManager.canEscape() && this._escapeValue > 80 + ($gameTroop.agility() - $gameParty.agility())){
            $gameParty.performEscape();
            for(actor of $gameParty.members()){
                actor.clearTpbChargeTime();
            }
            for(enemy of $gameTroop.members()){
                enemy.clearTpbChargeTime();
            }
            SoundManager.playEscape();
            BattleManager.pushActiveMessage("Fled!");
            this.onEscapeSuccess();
            
        }
    }else{
        this._escapeValue = Math.max(0,this._escapeValue-1);
    }
    if(!this._escaped){
        _battleManager_updateTpb.apply(this,arguments);
    }
};

Game_Timer.prototype.onExpire = function() {
    //BattleManager.abort();
};

// Abort Battle
Game_Interpreter.prototype.command340 = function() {
    BattleManager._escaped = true;
    BattleManager.processAbort();
    return true;
};

BattleManager.onEscapeSuccess = function() {
    //this.displayEscapeSuccessMessage();
    this._escaped = true;
    this.processAbort();
};

BattleManager.updateEscaping = function() {
    this._escapeValue += 1;
    if($gameParty.fleable()){
        this._escapeValue += 1000;
    }
    if(!BattleManager.canEscape()){
        this._escapeValue = 0;
        BattleManager.pushActiveMessage("Can't Flee!");
    }
};

const _battleManager_initMembers = BattleManager.initMembers;
BattleManager.initMembers = function() {
    _battleManager_initMembers.apply(this,arguments);
    this._escapeValue = 0;
    this._telepo = false;
    this._monomanatedActor = null;
    this._superMonomanatedActor = null;
    $gameParty.setGolem(0);
    $gameTroop.setGolem(0);
};

Game_Party.prototype.fleable = function(){
    for(actor of this.aliveMembers()){
        if(actor.hasSkill(305)&&actor.isTpbCharged()){
            return true;
        }
    }
    return false;
}

const _BattleManager_canEscape = BattleManager.canEscape;
BattleManager.canEscape = function() {
    //誰かが捕らわれていると逃走できない
    for(actor of $gameParty.members()){
        if(actor.isStateAffected(62)){
            return false;
        }
    }
    return _BattleManager_canEscape.apply(this,arguments);
};

const _Scene_Battle_startActorCommandSelection = Scene_Battle.prototype.startActorCommandSelection;
Scene_Battle.prototype.startActorCommandSelection = function() {
    _Scene_Battle_startActorCommandSelection.apply(this,arguments);
    this._actorCommandWindow.resetShowingODWindow();
    this._inputEscapeWindow.hide();
    this._inputEscapeWindow.deactivate();
};

const _Scene_Battle_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
    if(this._inputEscapeWindow && !this._inputEscapeWindow.active &&
        !this._actorCommandWindow.active && !this.isAnyInputWindowActive()){
        this._inputEscapeWindow.show();
        this._inputEscapeWindow.activate();
    }
    _Scene_Battle_update.apply(this,arguments);
};

const _Window_ActorCommand_processHandling = Window_ActorCommand.prototype.processHandling;
Window_ActorCommand.prototype.processHandling = function() {
    _Window_ActorCommand_processHandling.apply(this,arguments);
    if (this.active) {
        if (Input.isPressed("pageup") && Input.isPressed("pagedown")) {
            this.processEscaping();
        }else{
            this.processNotEscaping();
        }
    }
};

Window_ActorCommand.prototype.processEscaping = function() {
    //this.updateInputData();
    this.callHandler("escaping");
};

Window_ActorCommand.prototype.processNotEscaping = function() {
    //this.updateInputData();
    this.callHandler("notescaping");
};