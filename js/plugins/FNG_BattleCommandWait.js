//コマンドウィンドウを開いたときに、コマンド入力用のウェイトを挟むようにする
//バトルスピードによって変化

BattleManager.updateTurn = function(timeActive) {
    $gameParty.requestMotionRefresh();
    this.updateCommandWait();
    if (this.isTpb() && timeActive && this.commandWait() <= 0) {
        this.updateTpb();
    }
    if (!this._subject) {
        this._subject = this.getNextSubject();
    }
    if (this._subject) {
        this.processTurn();
    } else if (!this.isTpb()) {
        this.endTurn();
    }
};

Window_ActorCommand.prototype.activate = function() {
    Window_Command.prototype.activate.call(this);
    BattleManager.setCommandWait();
    BattleManager.setActorCommandWindow(this);
};

Window_ActorCommand.prototype.deactivate = function() {
    Window_Command.prototype.deactivate.call(this);
    BattleManager.resetCommandWait();
};

BattleManager.setActorCommandWindow = function(actorCommandWindow){
    this._actorCommandWindow = actorCommandWindow;
};

BattleManager.actorCommandWindow = function(){
    return this._actorCommandWindow;
};

BattleManager.setCommandWait = function(){
    // バトルスピードによってウェイト時間を変更
    this._commandWait = 55 + Number($gameVariables.value(1002)) * 5;
    this._commandWait = Math.min(this._commandWait,80);
};

BattleManager.resetCommandWait = function(){
    this._commandWait = 0;
}

BattleManager.updateCommandWait = function(){
    if(!this._commandWait){
        this.resetCommandWait();
    }
    this._commandWait = Math.min(this._commandWait,80);
    this._commandWait = Math.max(0,this._commandWait - 1);
    if(this.fastForwarding()){
        this._commandWait = 0;
    }
}

BattleManager.commandWait = function(){
    if(!this._commandWait){
        this.resetCommandWait();
    }
    return this._commandWait;
}

BattleManager.startFastForwarding = function(){
    this._fastForwarding = true;
}

BattleManager.endFastForwarding = function(){
    this._fastForwarding = false;
}

BattleManager.fastForwarding = function(){
    return this._fastForwarding;
}