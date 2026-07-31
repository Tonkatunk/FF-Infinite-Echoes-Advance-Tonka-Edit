//=============================================================================
// FNG_DualCast.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc 連続魔を実装します ついでにものまねも実装します
  * @author finga
  * @help 連続魔を実装します ついでにものまねも実装します
*/

//魔法を一度に打てる回数
Game_Battler.prototype.castableNum = function(){
    let num = 1;
    //28…ステート「トランス」
    if(this.isStateAffected(28)){
        num++;
    }
    //318…アビリティ「連続魔法」
    if(this.hasSkill(318)){
        num++;
    }
    return num;
}

//連続魔用配列
Game_Battler.prototype.castMagics = function(){
    if(!this._castMagics){
        this._castMagics = [];
    }
    return this._castMagics;
}

Game_Battler.prototype.resetCastMagics = function(){
    this._castMagics = [];
}

//連続魔用配列
Game_Battler.prototype.stockedMagicNum = function(){
    return this.castMagics().length;
}

//連続魔用配列
Game_Battler.prototype.stockMagic = function(action){
    let stock = new Game_Action(this,false);
    stock.setSkill(action.item().id);
    stock.setTarget(action._targetIndex);
    stock._isExpandedScope = action._isExpandedScope;
    stock._isReverseTargetSide = action.isReverseTargetSide();
    
    this._castMagics.push(stock);
}

Game_Battler.prototype.areActionsMonomanable = function(superMonomane = false){
    const actions = this._actions;
    if(!actions){
        return false;
    }
    for(action of actions){
        if(!action.isMonomanableAction(superMonomane,this)){
            return false;
        }
    }
    //console.log("areActionsMonomanable return true actions:",actions);
    return true;
}

Game_Battler.prototype.setMonomaneActions = function(actions){
    if(!actions){
        this._monomaneActions = [...this._actions];
    }else{
        this._monomaneActions = [...actions];
    }
    //console.log("setmonomaneactions:",this._monomaneActions);
}

Game_Battler.prototype.setSuperMonomaneActions = function(actions){
    if(!actions){
        this._superMonomaneActions = [...this._actions];
    }else{
        this._superMonomaneActions = [...actions];
    }
    //console.log("setmonomaneactions:",this._superMonomaneActions);
}

Game_Battler.prototype.monomaneActions = function(actions){
    return this._monomaneActions;
}

Scene_Battle.prototype.onActorOk = function() {
    const action = BattleManager.inputtingAction();
    action.setTarget(this._actorWindow.index());
    if (this._actorWindow.cursorAll()) {
          const action = BattleManager.inputtingAction();
          action.expandScope();
    }
    const actor = BattleManager._currentActor;
    const item = action.item();
    if(!actor.isStateAffected(16)){
        const magicSkillType = [5,6,7];

        if(actor.castableNum() > actor.stockedMagicNum()+1){
            if(magicSkillType.includes(item.stypeId)){
                actor.stockMagic(action);
                this._actorWindow.hide();
                this._skillWindow.show();
                this._skillWindow.activate();
                this._actorWindow.hide();
                this._actorWindow.setCursorAll(false);
                return;
            }
        }
        if(magicSkillType.includes(item.stypeId)){
            actor._actions = actor.castMagics().concat(actor._actions);
            actor._actionInputIndex = actor._actions.length-1;
        }
        if(actor.areActionsMonomanable()){
            actor.setMonomaneActions();
        }
        if(actor.areActionsMonomanable(true)){
            actor.setSuperMonomaneActions();
        }
        actor.resetCastMagics();
        actor.initResetMoving();
        this._actorWindow.setCursorAll(false);
    }else{
        actor.manipulate()._actions = [];
        actor.manipulate()._actions.push(action);
        actor.manipulate()._tpbState = "waiting";
        actor.manipulate()._tpbChargeTime = 1;
        BattleManager._actionBattlers.push(actor.manipulate());
        
        BattleManager._currentActor._tpbState = "charging";
        BattleManager._currentActor._tpbChargeTime = 0;
    }
    actor.removeState(61); //コマンド入力で魔封剣を解除
    this.hideSubInputWindows();
    this.selectNextCommand();

};

//一人目が選択できない時、全体対象を選択できなくなってしまうので対策
Window_BattleActor.prototype.isCurrentItemEnabled = function() {
    if(this._cursorAll){
        return true;
    }
    return Window_BattleStatus.prototype.isCurrentItemEnabled.call(this);
};

Scene_Battle.prototype.onEnemyOk = function() {
    const action = BattleManager.inputtingAction();
    action.setTarget(this._enemyWindow.enemyIndex());
    if (this._enemyWindow.cursorAll()) {
          const action = BattleManager.inputtingAction();
          action.expandScope();
    }
    const actor = BattleManager._currentActor;
    const item = action.item();
    if(!actor.isStateAffected(16)){
        const magicSkillType = [5,6,7];

        if(actor.castableNum() > actor.stockedMagicNum()+1){
            if(magicSkillType.includes(item.stypeId)){
                actor.stockMagic(action);
                this._actorWindow.hide();
                this._skillWindow.show();
                this._skillWindow.activate();
                this._enemyWindow.hide();
                this._enemyWindow.setCursorAll(false);
                return;
            }
        }
        if(magicSkillType.includes(item.stypeId)){
            actor._actions = actor.castMagics().concat(actor._actions);
            actor._actionInputIndex = actor._actions.length-1;
        }
        if(actor.areActionsMonomanable()){
            actor.setMonomaneActions();
        }
        if(actor.areActionsMonomanable(true)){
            actor.setSuperMonomaneActions();
        }
        actor.resetCastMagics();
        this._enemyWindow.setCursorAll(false);
    }else{
        actor.manipulate()._actions = [];
        actor.manipulate()._actions.push(action);
        actor.manipulate()._tpbState = "waiting";
        actor.manipulate()._tpbChargeTime = 1;
        BattleManager._actionBattlers.push(actor.manipulate());
        //this.debugActionBattlerList(actor.manipulate(),"push")
        BattleManager._currentActor._tpbState = "charging";
        BattleManager._currentActor._tpbChargeTime = 0;
    }
    //コマンドを入力し終えたら特定のステートを解除する
    actor.removeWaitStates();

    this.hideSubInputWindows();
    this.selectNextCommand();
};

//コマンドを入力し終えたら特定のステートを解除する
Game_Actor.prototype.removeWaitStates = function(){
    this.removeState(61); //魔封剣
    this.removeState(72); //必殺剣空
    this.removeState(73); //カウンター
}

const _BattleManager_finishActorInput = BattleManager.finishActorInput;
BattleManager.finishActorInput = function() {
    if (!this._currentActor.isStateAffected(16)) {
        _BattleManager_finishActorInput.apply(this,arguments);
    }else{
        //console.log(this._currentActor._tpbState);
    }
};

Scene_Battle.prototype.onSkillCancel = function() {
    const actor = BattleManager._currentActor;
    actor.resetCastMagics();
    
    this._skillWindow.hide();
    this._statusWindow.show();
    this._actorCommandWindow.show();
    this._actorCommandWindow.activate();
};

Scene_Battle.prototype.commandSkill = function() {
    const actor = BattleManager._currentActor;
    if(actor){
        actor.resetCastMagics();
    }

    this._skillWindow.setActor(BattleManager.actor());
    this._skillWindow.setStypeId(this._actorCommandWindow.currentExt());
    this._skillWindow.refresh();
    this._skillWindow.show();
    this._skillWindow.activate();
    this._statusWindow.hide();
    this._actorCommandWindow.resetShowingODWindow();
    this._actorCommandWindow.hide();
};
