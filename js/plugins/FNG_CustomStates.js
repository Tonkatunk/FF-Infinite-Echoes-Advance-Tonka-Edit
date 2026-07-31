//=============================================================================
// FNG_CustomStates.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc エディタでは作成できないステートの処理
  * @author finga
  * @help エディタでは作成できないステートの処理
*/

const _Game_Battler_addState3 = Game_Battler.prototype.addState;
Game_Battler.prototype.addState = function(stateId) {
    //console.log(this.name(),"addState stateId:",stateId)
    //睡眠、麻痺、ストップ、石化、除外、戦闘不能の場合ゲージとアクションをリセット
    if(stateId == 1||stateId == 10||stateId == 11||stateId == 12||stateId == 34||stateId == 37){
        this._tpbState = "charging";
        this.setActionState("undecided");
        this._tpbCastTime = 0;
        this._tpbChargeTime = 0;
        this._tpbIdleTime = 0;
        this._actions = [];
		this._counterActions = [];
    }

    //トンベリ前進
    if(stateId == 76){
        this._tonberryStep = 0;
    }
    //沈黙の場合、歌う・踊るを解除
    if(stateId == 6){
        this.removeState(59);
        this.removeState(60);
    }
    //斬鉄の場合、除外も付与
    if(stateId == 64){
        this.addState(34);
    }
    //捕らわれの場合、現在の行動者を記録する
    if(stateId == 62){
        this.setShokusher(BattleManager.subject());
        this.shokusher().addState(63);
        //ゲージをリセット
        this._tpbState = "charging";
        this.setActionState("undecided");
        this._tpbCastTime = 0;
        this._tpbChargeTime = 0;
        this._tpbIdleTime = 0;
    }
    //補足の場合、現在のターゲットを記録する
    if(stateId == 63){
       this.setShokushed(BattleManager._targets[0]);
    }
    //魔法剣の場合、発動中のスキルIDを記憶する
    if(stateId == 26){
       this.setMagicSword(BattleManager._action.item().id);
    }
    //おどる・歌うの場合、発動中のスキルIDを記憶する
    if(stateId == 59||stateId == 60){
       this.setDanceSing(BattleManager._action.item().id);
    }
    if (this.isStateAffected(11)) {
        //石化状態で戦闘不能を付与された場合、HPを０にする
        if (stateId == 1) {
            this._hp = 0;
        }
        //石化状態の場合、新たなステートを受け付けない
        return;
    }
    //石化すると特定のステート以外は解除される
    if (stateId == 11) {
        this.removeStatesByStone();
    }
    //敵が石化すると戦闘不能扱い
    if (stateId == 11 && this.isEnemy()) {
        this.die();
        this.refresh();
    }
    // あやつられるとあやつったバトラーにあやつりステートを付加
    if (stateId == 17) {
        const enemy = $dataEnemies[this.enemyId()];
        BattleManager.pushActiveMessage(enemy.name + "をあやつった");
        BattleManager._subject.addState(16);
        BattleManager._subject.setManipulate(this);
        //ゲージをリセット
        this._tpbState = "charging";
        this.setActionState("undecided");
        this._tpbCastTime = 0;
        this._tpbChargeTime = 0;
        this._tpbIdleTime = 0;
        this._manipulater = BattleManager._subject.index();
        console.log(this,BattleManager._subject.manipulate())
    }
    //敵が除外されると戦闘不能にもする
    if (stateId == 34 && this.isEnemy()) {
        this.hide();
        this.die();
    }
    //ためるが付与されるとチャージレートアップ
    if (stateId == 24) {
        this.chargeUp();
    }
    //クイックが付与されるとクイックカウントを付与
    if (stateId == 47 && !this.isStateAffected(47)) {
        this._quickTime = 2;
    }
    //沈黙・混乱・バーサク・あやつられ・カエル・捕捉は歌う・踊る・あやつりを解除する
    const cancelDanceSingStates = [6,7,8,14,17,62];
    if (cancelDanceSingStates.includes(stateId)) {
        this.removeState(16);
        this.removeState(59);
        this.removeState(60);
    }
    //混乱・バーサク・あやつられ・カエルは魔封剣を解除する
    const cancelRunicStates = [7,8,14,17,62];
    if (cancelRunicStates.includes(stateId)) {
        this.removeState(61);
    }
    // 魔封剣の場合、魔封剣待機バトラーに追加
    if (stateId == 61){
        BattleManager.pushRunicReady(this);
    }
    //トランスするとカエル・ミニマムは解除される
    if (stateId == 28) {
        this.removeState(14);
        this.removeState(35);
    }
    //スロウ&死の宣告
    if(stateId == 40 && this._deathCount > 0){
        this._deathCount = this._deathCount * 4 / 3;
    }
    //ヘイスト&死の宣告
    if(stateId == 41 && this._deathCount > 0){
        this._deathCount = this._deathCount * 2 / 3;
    }
    //ミニマムの縮小リクエスト
    if(stateId == 35 && !this.isStateAffected(35)){ //
        this.requestShrink();
    }
    //バリアチェンジの場合、バリア属性を設定
    if(stateId == 75){ //
        if(this.isActor()){
            $gameParty.applyBarrierChange();
        }else{
            $gameTroop.applyBarrierChange();
        }
    }
    //トード、ミニマムの入れ替わり処理
    if(stateId == 14 && this.isStateAffected(14)){
        this.removeState(stateId);
    }else if(stateId == 35 && this.isStateAffected(35)){ //
        this.removeState(stateId);
    }else{
        _Game_Battler_addState3.apply(this,arguments);        
    }
    
    //挑発の場合、現在のバトラー（デコイ）をセット
    if(stateId == 20){
        this.setDecoy(BattleManager.subject());
     }
};

Game_Battler.prototype.setDecoy = function(battler){
    this._deciy = battler;
}

Game_Battler.prototype.decoy = function(battler){
    return this._deciy;
}

Game_Battler.prototype.setDecoyResetFlag = function(){
    this._decoyReset = true;
}

Game_Battler.prototype.requestShrink = function(){
    this._toShrink = true;
}

Game_Battler.prototype.resetRequestShrink = function(){
    this._toShrink = false;
}

Game_Battler.prototype.toShrink = function(){
    return this._toShrink;
}

Game_Battler.prototype.requestRecoverShrink = function(){
    this._recoverShrink = true;
}

Game_Battler.prototype.resetRequestRecoverShrink = function(){
    this._recoverShrink = false;
}

Game_Battler.prototype.recoverShrink = function(){
    return this._recoverShrink;
}

const _Game_BattlerBase_isStateAffected = Game_BattlerBase.prototype.isStateAffected;
Game_BattlerBase.prototype.isStateAffected = function(stateId) {
    if(stateId == 62){
       if(this.shokusher()&&this.shokusher().isAlive()){
           return true;
       }
        return false;
    }
    if(stateId == 63){
       if(this.shokushed()&&this.shokushed().isAlive()){
           return true;
       }
        return false;
    }
    return _Game_BattlerBase_isStateAffected.apply(this,arguments);
};

Game_Battler.prototype.resetShokusher = function() {
    this._shokusher = null;
};

Game_Battler.prototype.resetShokushed = function() {
    this._shokushed = null;
};

Game_Battler.prototype.resetShokushu = function() {
    this.resetShokusher();
    this.resetShokushed();
};


Game_Battler.prototype.shokusher = function() {
    if(!this._shokusher){
        return null;
    }
    if($gameTroop.members()[this._shokusher-1].canMove()){
        return $gameTroop.members()[this._shokusher-1];
    }
    return null;
};

Game_Battler.prototype.shokushed = function() {
    if(!this._shokushed){
        return null;
    }
    if($gameParty.members()[this._shokushed-1].canMove()){
        return $gameParty.members()[this._shokushed-1];
    }
    return null;
};

Game_Battler.prototype.setShokusher = function(battler) {
    this._shokusher = battler.index()+1;
};

Game_Battler.prototype.setShokushed = function(battler) {
    this._shokushed = battler.index()+1;
};

Game_Battler.prototype.manipulater = function(){
    if(!this._manipulater){
        return null;
    }
    if($gameParty.members()[this._manipulater-1].canMove()){
        return $gameParty.members()[this._manipulater-1];
    }
    return null;
};

Game_Battler.prototype.manipulate = function() {
    if(!this._manipulate){
        return null;
    }
    if($gameTroop.members()[this._manipulate-1].canMove()){
        return $gameTroop.members()[this._manipulate-1];
    }
    return null;
};

Game_Battler.prototype.setManipulate = function(battler) {
    this._manipulate = battler.index()+1;
};

Game_Battler.prototype.quickReset = function() {
    if(this.isStateAffected(47) && this._quickTime <= 0){
        this.removeState(47);
    }
};

Game_Battler.prototype.decoyReset = function(){
    if(this._decoyReset){
        this.removeState(20);
        this._decoy = null;
    }
}

Game_Battler.prototype.chargeUp = function() { 
    //チャージレートが代入されていない、またためる状態でなければチャージ１へリセット
    if(!this._chargeRate||!this.isStateAffected(24)){
        this._chargeRate = 1;
    }
    this._chargeRate += 0.5;
    this._chargeRate = Math.min(this._chargeRate,3);
};

Game_Battler.prototype.chargeReset = function() {
    if(this._chargeReset){
        this._chargeReset = false;
        this._chargeRate = 1;
    }
};

Game_Battler.prototype.chargeResetFlagOn = function() { 
    this._chargeReset = true;
};

Game_Battler.prototype.chargeRate = function() { 
    if(!this._chargeRate){
        this._chargeRate = 1;
    }
    return this._chargeRate;
};

Game_Battler.prototype.setRemoveInvisible = function() { 
    this._removeInvisible = true;
};

Game_Battler.prototype.settedRemoveInvisible = function() { 
    return this._removeInvisible;
};

Game_Battler.prototype.resetSettedRemoveInvisible = function() { 
    this._removeInvisible = false;
};

Game_Battler.prototype._setRemoveBfire = function() { 
    this._removeBfire = true;
};

Game_Battler.prototype._setRemoveBcold = function() { 
    this._removeBcold = true;
};

Game_Battler.prototype._setRemoveBthunder = function() { 
    this._removeBthunder = true;
};

Game_Battler.prototype._setRemoveBwater = function() { 
    this._removeBwater = true;
};

Game_Battler.prototype._setRemoveBaero = function() { 
    this._removeBaero = true;
};

Game_Battler.prototype.getMagicAnimationId = function(itemId) {
    if(this.isStateAffected(18)){
        return 408;
    }else{
        return itemId;
    }
};

Game_Actor.prototype.canUseMagicSword = function() {
    const usableTypes = [1,2,3,4,5,6,7,16,17];
    for(let i=0;i<2;i++){
        weapon = this.equips()[i];
        if(weapon && usableTypes.includes(weapon.wtypeId)){
           return true;
        }
    }
    return false;
};

Game_Battler.prototype.magicSwordId = function() { 
    if(!this._magicSwordId){
        this._magicSwordId = null;
    }
    return this._magicSwordId;
};

Game_Battler.prototype.setMagicSword = function(skillId) { 
    this._magicSwordId = skillId;
};

Game_Battler.prototype.magicSwordAtk = function() {
    const id = this.magicSwordId();
    if(id && this.isStateAffected(26)){
        const atk = $dataSkills[id].meta.msAtk;
        if(atk){
            return Number(atk);
        }
    }
    return 0;
};

Game_Battler.prototype.magicSwordAtkRate = function() {
    const id = this.magicSwordId();
    if(id && this.isStateAffected(26)){
        const rate = $dataSkills[id].meta.msAtkRate;
        if(rate){
            return Number(rate);
        }
    }
    return 1;
};

Game_Battler.prototype.magicSwordHpConsumeRate = function() {
    const id = this.magicSwordId();
    if(id && this.isStateAffected(26)){
        var rate = $dataSkills[id].meta.msHpConsumeRate;
        if(this.isEnemy()){
            rate*=0.1;
        }
        if(rate){
            return Number(rate);
        }
    }
    return 0;
};

Game_Battler.prototype.magicSwordElement = function() {
    const id = this.magicSwordId(); 
    if(id && this.isStateAffected(26)){
        const elm = $dataSkills[id].meta.msElement;
        if(elm){
            return Number(elm);
        }
    }
    return null;
};

Game_Battler.prototype.magicSwordAnimationId = function(){
    const id = this.magicSwordId(); 
    if(id && this.isStateAffected(26)){
        const animationId = $dataSkills[id].meta.msAtkAnimId;
        if(animationId){
            return Number(animationId);
        }
    }
    return;
}

Game_Battler.prototype.magicSwordCastAnimationId = function(){
    const id = this.magicSwordId(); 
    if(id && this.isStateAffected(26)){
        const animationId = $dataSkills[id].meta.msCastAnimId;
        if(animationId){
            return Number(animationId);
        }
    }
    return;
}

Game_Battler.prototype.removeState = function(stateId) {
    // 補足中
    if(stateId == 63){
        if(this._shokushed){
            this.shokushed().removeState(62);
        }
        this.resetShokushed();
    }
    // 捕らわれ
    if(stateId == 62){
        this.resetShokusher();
    }
    // 魔封剣解除の場合、魔封剣待機バトラーリストから削除
    if(stateId == 61){
        BattleManager.removeRunicBattler(this);
    }
    //石化状態の場合、石化以外のステート解除を受け付けない
    if (this.isStateAffected(11) && stateId != 11) {
        return;
    }
    // 種族がアンデッドの場合、ゾンビ状態を解除できない
    if(stateId == 36 && this.isUndead()){
        return;
    }
    //ためるを解除した場合、チャージレートもリセット
    if (stateId == 24) {
        this.chargeReset();
    }
    //ミニマムを解除した場合、スプライトの小人状態の解除をリクエスト
    if (stateId == 35) {
        this.requestRecoverShrink();
    }
    if (this.isStateAffected(stateId)) {
        if (stateId === this.deathStateId()) {
            this.revive();
        }
        this.eraseState(stateId);
        this.refresh();
        this._result.pushRemovedState(stateId);
    }
};

//const _Game_Battler_gainTp = Game_Battler.prototype.gainTp;
Game_Battler.prototype.gainTp = function(value) {
    if(this.tp < 100 &&
       this.tp + value >= 100 && 
       this.isActor() && 
       this.hasSkill(278)){
        this.removeState(7);
    }
    this.setTp(this.tp + value);
    //_Game_Battler_gainTp.apply(this,arguments);
};

const _Game_Battler_gainSilentTp = Game_Battler.prototype.gainSilentTp;
Game_Battler.prototype.gainSilentTp = function(value) {
    if(this.tp < 100 &&
       this.tp + value >= 100 && 
       this.isActor() && 
       this.hasSkill(278)){
        this.removeState(7);
    }
    _Game_Battler_gainSilentTp.apply(this,arguments);
};

Game_BattlerBase.prototype.revive = function() {
//ゾンビ状態の場合、戦闘不能状態で蘇生効果を受けると除外状態になる
    if (this._hp === 0 && !this.isStateAffected(11)) {
        this._hp = 1;
    }
};

//
Game_BattlerBase.prototype.addNewState = function(stateId) {
    if(stateId == 39){ // 死の宣告
        const deathCount = 480;
        //console.log(this.stateRate(39));
        this._deathCount = deathCount + deathCount*(1-this.stateRate(39));
        if($gameSwitches.value(193)){ //クラウディヘブンなら半分
            this._deathCount /= 2;
        }
        //スロウ&死の宣告
        if(this.isStateAffected(40)){
            this._deathCount = this._deathCount * 4 / 3;
        }
        //ヘイスト&死の宣告
        if(this.isStateAffected(41)){
            this._deathCount = this._deathCount * 2 / 3;
        }
    }
    //戦闘不能ステート付与の場合、ゾンビでなければ戦闘不能に
    if (stateId === this.deathStateId() && !this.isStateAffected(36)) {
        this.die();
    }
    const restricted = this.isRestricted();
    this._states.push(stateId);
    this.sortStates();
    if (!restricted && this.isRestricted()) {
        this.onRestrict();
    }
};

Game_BattlerBase.prototype.removeStatesByStone = function() {
    const notRemove = [1,3,11,14,28,32,33,34,35,36];
    for(let i=2;i<100;i++){
        if(!notRemove.includes(i)){
            this.removeState(i);
        }
    }
}

//対象バトラーが選択できる状態か
Game_BattlerBase.prototype.isSelectable = function() {
   //隠れる・ジャンプ・除外であれば対象選択不可
    if(this.isStateAffected(21)||this.isStateAffected(23)||this.isStateAffected(34)){
        return false;
    }
    return true;
}

//対象バトラーが魔法剣デスペル状態か
Game_BattlerBase.prototype.isMsDespel = function() {
    if(this.isStateAffected(26)&&this.magicSwordId()==573){
        return true;
    }
    return false;
}



/*
//アクターのホーム座標更新フラグ
Game_Actor.prototype.refreshHomePosition = function() {
   this._refreshHomePosition = true;
}*/

//-----------------------------------------------------------------------------
// Game_Unit
//
// The superclass of Game_Party and Game_Troop.

//メンバーの対象選択可能が可能かどうか
Game_Unit.prototype.isSelectable = function() {
    for(member of this.members()){
        if(member.isSelectable()){
            return true;
        }
    }
    return false;
};

//リレイズが残っているか対象選択可能が可能かどうか
Game_Unit.prototype.isStillReraise = function() {
    for(member of this.members()){
        if(member.isStateAffected(49)){
            return true;
        }
    }
    return false;
};

BattleManager.checkBattleEnd = function() {
    if (this._phase) {
        if (this.checkAbort()) {
            return true;
        }else if ($gameParty.isAllDead() && !$gameParty.isStillReraise()) {
            if($gameSwitches.value(34)&&!$gameSwitches.value(38)){ // 全滅保険を使用しておらず、入れ替えバトルの場合はfalse
                $gameSwitches.setValue(35,true) //全滅入れ替えスイッチON
                $gameSwitches.setValue(36,true) //全滅処理をしない
                return false;
            }
            if($gameSwitches.value(36)){ //全滅処理をしない
                return false;
            }
            $gameSwitches.setValue(35,false)
            this.processDefeat();
            return true;
        } else if ($gameTroop.isAllDead() && !$gameTroop.isStillReraise()) {
            this.processVictory();
            return true;
        }
    }
    return false;
};

//ファイナルアタックの処理
/*const _Game_BattlerBase_die = Game_BattlerBase.prototype.die;
Game_BattlerBase.prototype.die = function() {

    _Game_BattlerBase_die.apply(this,arguments);
};*/

Game_BattlerBase.prototype.executableFinalAttack = function() {
    if(!this.isEnemy()){
        return false;
    }
    if(!this.enemy().meta.finalattack){
       return false;
    }
    if(this._finalAttacking){
       return false;
    }
    if(this.isAlive()){
       return false;
    }
    
    // 石化、除外、斬鉄で倒した場合はFAは発動しない
    const states = [11,34,64];

    for(state of states){
        if(this.isStateAffected(state)){
            return false;
        }
    }
    return true;
};

Game_BattlerBase.prototype.removeCombinationByStates = function(stateId) {
    const removeStateIds = [1,8,9,10,11,12,13,14,17,34,35,37,62,64];
    const combinationStateIds = [67,68,69,70];
    
    //特定のステートでコンビネーションを解除
    if(removeStateIds.includes(stateId)){
        for(comboStateId of combinationStateIds){
            if(this.isStateAffected(comboStateId)){
                for(rId of combinationStateIds){
                    BattleManager.pushActiveMessage("The combination broke apart!");
                    this.removeState(rId);
                }      
            }
        }       
    }
};

Game_Battler.prototype.onRestrict = function() {
    Game_BattlerBase.prototype.onRestrict.call(this);
    //混乱とバーサクでゲージがリセットされるのを防ぐためコメントアウト
    //this.clearTpbChargeTime(); 
    this.clearActions();
    for (const state of this.states()) {
        if (state.removeByRestriction) {
            this.removeState(state.id);
        }
    }
};

Game_Battler.prototype.isTonberry = function(){
    return this.isStateAffected(76);
}

Game_Battler.prototype.tonberryStep = function(){
    if(!this._tonberryStep){
        this._tonberryStep = 0;
    }
    return this._tonberryStep;
}

Game_Battler.prototype.stepTonberry = function(step){
    var steprate = 1
    var maxStep = 120;
    if(this.isEnemy()&&this._enemyId == 415){
        maxStep = 115;
        if($gameTroop.members()[0].isAlive()){        
            steprate = 0.15;
        }
    }
    if(!this._tonberryStep){
        this._tonberryStep = 0;
    }
    this._tonberryStep += step*steprate;
    this._tonberryStep = Math.min(maxStep,this._tonberryStep);
}

Game_Battler.prototype.resetStepTonberry = function(){
    this._tonberryStep = 0;
}

Game_Battler.prototype.attractByAtomos = function(){
    this.attractX(25);
}

Game_Battler.prototype.attractedX = function(){
    if(!this._attractedX){
        this._attractedX = 0;
    };
    return this._attractedX;
}

Game_Battler.prototype.attractX = function(value){
    if(!this._attractedX){
        this._attractedX = 0;
    };
    this._attractedX += value;
}

Game_Battler.prototype.resetAttractX = function(){
    this._attractedX = 0;
}

Game_Party.prototype.attractedMember = function(){
    return this.members().filter(member => member.attractedX() >= 120&&!member.isStateAffected(34));
}