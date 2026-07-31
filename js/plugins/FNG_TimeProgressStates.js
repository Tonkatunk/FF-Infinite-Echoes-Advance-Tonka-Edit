//=============================================================================
// FNG_TimeProgressStates.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc ターン経過でなく時間経過で効果を発揮・失効したりなどのステートの処理をする
  * @author finga
  * @help ターン経過でなく時間経過で効果を発揮・失効したりなどのステートの処理をする
*/

//チャージするタイミングでいろいろやる
const _game_Battler_updateTpb = Game_Battler.prototype.updateTpb;
Game_Battler.prototype.updateTpb = function() {
    if (this.isAlive()) {
        this.updateTpbState()
    }
    if (BattleManager.checkBattleEnd()) {
        this._actions = [];
        this._counterActions = [];
        return;
    }
    //トンベリ前進
    if (this.canMove()&&this.isTonberry()) {
        var step = 0.25;
        if(this.isStateAffected(40)){
            step*= 0.66;
        }
        if(this.isStateAffected(41)){
            step*= 1.5;
        }
        this.stepTonberry(step);
        this.applyUshinokoku();
    }
    //リレイズの適用
    if (this.isStateAffected(1) && this.isStateAffected(49)) {
        this.forceAction(116,this);
        BattleManager.forceAction(this);
    }
    //トランス発動
    if (this.transable()){
        const counter = new Game_Action(this, true);
        counter.setSkill(1000);
        counter.setTarget(this.index());
        counter.setTargetReverse(false);
        this.pushCounterAction(counter);
        this._countering = true;
    }
    //トランス解除
    if (this.isStateAffected(28)){
        if(this.tp>0){
            var lostTp = 0.5*BattleManager.battleSpeedTpbRate();
            this.gainTp(-lostTp);
        }
        if(this.tp<=0&&this._actions.length==0&&!this.isStateAffected(23)){ //ジャンプ中はトランスが解除されない
            const counter = new Game_Action(this, true);
            counter.setSkill(999);
            counter.setTarget(this.index());
            counter.setTargetReverse(false);
            if(this.canMove()){
                this.pushCounterAction(counter);
            }
            this._countering = true;
        }
    } 
    _game_Battler_updateTpb.apply(this,arguments);
    //変な値が入っていたらリセット
    if(!this._tpbChargeTime){
         this._tpbChargeTime = 0;      
    }
};

Game_Enemy.prototype.applyUshinokoku = function(){
    const step = this.tonberryStep();
    const ushinokoId = 1287;
    const tonberriesId = 415;
    if(this.enemyId()!=tonberriesId){
        return;
    }
    if($gameTroop.aliveMembers().filter(m => m.ushinokoku()).length>0){
        return;
    };
    const targets = [];
    for(actor of $gameParty.members()){
        if(actor&&!actor.isStateAffected(34)&&step+actor.attractedX()>=115){
            targets.push(actor);
        }
    }
    if(targets.length>0){
        this.setForcedTargets(targets);
        this.forceAction(ushinokoId,this);
        BattleManager.forceAction(this);
        this.setUshinokoku();
    }
}

Game_Enemy.prototype.ushinokoku = function(){
    if(!this._ushinokoku){
        this._ushinokoku = false;
    }
    return this._ushinokoku;    
}

Game_Enemy.prototype.setUshinokoku = function(){
    this._ushinokoku = true;
}

Game_Enemy.prototype.resetUshinokoku = function(){
    this._ushinokoku = false;
}

const _Game_Battler_tpbAcceleration = Game_Battler.prototype.tpbAcceleration;
Game_Battler.prototype.tpbAcceleration = function() {
    var value = _Game_Battler_tpbAcceleration.apply(this, arguments);
    if(BattleManager.actorCommandWindow()&&BattleManager.actorCommandWindow().active){
        value /= 3;
    }
    return value;
};

Game_Battler.prototype.transable = function(){
    if(this.isStateAffected(7)||
        this.isStateAffected(8)||
        this.isStateAffected(10)||
        this.isStateAffected(11)||
        this.isStateAffected(12)||
        this.isStateAffected(14)||
        this.isStateAffected(17)||
        this.isStateAffected(35)||
        this.isStateAffected(37)||
        this.isStateAffected(62)){
        return false;
    }
    if(this.tp>=100 && !this.isStateAffected(28) && this.isActor() && this.hasSkill(1000) && this.counterActions().length == 0){
        return true;
    }
}

//チャージ完了タイミングでいろいろやる
const _Game_Battler_finishTpbCharge = Game_Battler.prototype.finishTpbCharge;
Game_Battler.prototype.finishTpbCharge = function() {
    //歌う、踊るを解除
    if(this.isStateAffected(59)){
        this.removeState(59);
    }
    if(this.isStateAffected(60)){
        this.removeState(60);
    }
    //ギガフレア状態を解除
    if(this.isStateAffected(74)){
        this.removeState(74);
    }
    //操り状態の場合、操っている対象が戦闘不能であればあやつりを解除
    if(this.isStateAffected(16)){
        if(this.manipulate()){
            if(this.manipulate().isDead()){
                this.removeState(16);
                this._manipulate = null;
            }
        }
    }
    _Game_Battler_finishTpbCharge.apply(this,arguments);
};

Game_Battler.prototype.removeBattleStates = function() {
    this.resetMonomane(); //ものまね中に戦闘が終了した場合を想定　装備を戻す
    this.resetShokushu(); //ほかくをﾘｾｯﾄ
    var stoned = this.isStateAffected(11);
    $gameSwitches.setValue(31, false); //ミュート解除
    if(stoned){ //石化していた場合、他の状態変化解除のためフラグを残して解除
        this.removeState(11);
    }
    for (const state of this.states()) {
        if(state.id == 28){
            this.setTp(0);
        }
        if (state.removeAtBattleEnd) {
            this.removeState(state.id);
        }
    }
    this._manipulater = null; //あやつり対象を削除
    if(stoned){
        this.addState(11);
    }
    if(this.isActor()){
        this.resetMagicStones(); //使った魔石状態を消去
        this.resetlandingTargets(); //ジャンプの対象ターゲット情報を消去
    }
};

/**
 * ●戦闘終了時
 */
const _Game_Enemy_onBattleEnd = Game_Enemy.prototype.onBattleEnd;
Game_Enemy.prototype.onBattleEnd = function() {
    _Game_Enemy_onBattleEnd.apply(this, arguments);
    this._manipulater = null; //あやつりバトラー情報を削除
};

BattleManager.battleSpeedTpbRate = function(){
    const battleSpeed = $gameVariables.value(1002);
    if(this.actorCommandWindow() && this.actorCommandWindow().active && !BattleManager.fastForwarding()){
        return 0.25;
    }
    return 3 / (2 + battleSpeed);
}

//トランスタイプのアクターの場合、ダメージによる得TP量は倍になる
Game_Actor.prototype.chargeTpByDamage = function(damageRate) {
    //var value = Math.floor(50 * damageRate * this.tcr);
    //増加基本量は5で固定
    var value = 5;
    if(this.hasSkill(1000)){
        value = value*2;
    }
    this.gainSilentTp(value);
};


//トランスタイプのアクターの場合、行動による得TP量は0になる
const _Game_Action_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
Game_Action.prototype.applyItemUserEffect = function(){
    const subject = this.subject();
    if(subject.isActor() && !subject.hasSkill(1000)){
        _Game_Action_applyItemUserEffect.apply(this,arguments);
    }    
}

//トランス状態で武器が変化
const _Game_Actor_equips = Game_Actor.prototype.equips;
Game_Actor.prototype.equips = function() {
    var equips = _Game_Actor_equips.apply(this,arguments);
    //console.log(equips);
    if(this._states.includes(28)&&!this._states.includes(66)&&$dataActors[this._actorId].meta.paladin){
        var equipsEx=[$dataWeapons[248]];
        if(DataManager.isWeapon(equips[1])){
            equipsEx.push($dataWeapons[248]);
        }else{
            equipsEx.push(equips[1]);
        }
        for(let i = 2;i<equips.length;i++){
            equipsEx.push(equips[i])
        }
        return equipsEx;
    };
    if(this._states.includes(28)&&$dataActors[this._actorId].meta.onion){
        var equipsEx=[$dataWeapons[249]];
        if(DataManager.isWeapon(equips[1])){
            equipsEx.push($dataWeapons[250]);
        }else{
            equipsEx.push(equips[1]);
        }
        for(let i = 2;i<equips.length;i++){
            equipsEx.push(equips[i])
        }
        return equipsEx;
    }
    return equips;
};

//クイック・ラピッド・ディレイ・あやつられの処理
const _game_Battler_updateTpbChargeTime = Game_Battler.prototype.updateTpbChargeTime;
Game_Battler.prototype.updateTpbChargeTime = function() {
    if (this._tpbState === "charging") {
        //クイック
        if(this.isStateAffected(47)){
            this._tpbChargeTime = 1;
            this._quickTime -= 1;
        }
        
        //ラピッド
        if(this.isStateAffected(25)){
            this._tpbChargeTime = 1;
            this.removeState(25);
        }
        
        //ディレイ
        if(this.isStateAffected(13)){
            this._tpbChargeTime = 0;
            this.removeState(13);
        }
        
        //あやつられている時・補足されている時はゲージはたまらない
        if(this.isStateAffected(17)||this.isStateAffected(62)){
            this._tpbChargeTime = 0;
        }
    }
    _game_Battler_updateTpbChargeTime.apply(this,arguments);
};

//ラピッド・ディレイの処理
const _Game_Battler_updateTpbCastTime = Game_Battler.prototype.updateTpbCastTime;
Game_Battler.prototype.updateTpbCastTime = function() {
    if (this._tpbState === "casting") {
        if(this.isStateAffected(25)){
            this._tpbCastTime = this.tpbRequiredCastTime();
        }
    }
    if (this._tpbState === "casting" || this._tpbState === "charged") {
        if(this.isStateAffected(13)){
            this.setActionState("charging");
            this._tpbCastTime = 0;
            this._tpbChargeTime = 0;
            this.removeState(13);
        }
    }
    _Game_Battler_updateTpbCastTime.apply(this,arguments);
};

Game_Battler.prototype.updateTpbState = function() {
    //ストップ・石化状態だとカウントステートのアップデートはしない
    if (!this.isStateAffected(37) && !this.isStateAffected(11)) {
        this.applySlipDamage();
        this.updateStateCount();
    }
    //ストップゲージの進行
    if(this.isStateAffected(37)){
        this.updateStopState();
    }
};

Game_Battler.prototype.applySlipDamage= function() {
    if(!this._slipAndCureCount){
        this._slipAndCureCount = 0;
    }
    //スリップ基本ダメージ
    //ステート有効度がそのままダメージレートになる
    let value = 0;
    if(this.isStateAffected(42)){
       value = Math.max(1,Math.round(this.mhp/100 * this.stateRate(42))+Math.floor(Math.random()*2));
    }
    //癒しの歌効果
    var songValue = 0;
    if((this.isActor()&&$gameParty.isSingingCureSong())||
       (this.isEnemy()&&$gameTroop.isSingingCureSong())){
        songValue = Math.max(1,Math.round(this.mhp/50));
        if(this.isStateAffected(36)){
            songValue = -songValue;
        }
        value -= songValue;
    }
    // `ジャンプ・隠れるではHPは０にならない
    if(value>=this.hp&&(this.isStateAffected(21)||this.isStateAffected(23))){
        value = this.hp-1;
    }
    //8カウント毎にスリップダメージ
    if (value != 0 && this._slipAndCureCount == 0) {
        this.gainHp(-value);
        if(this.isActor()){
            $gameTemp.requestBattleRefresh();
        }
        if(this.hp <= 0){
            this.performCollapse();
        }
        //this.clearResult();
    }
    
    if(this._slipAndCureCount == 0){
        this._slipAndCureCount = 8;
    }else{
        this._slipAndCureCount--;
    }
}

Game_Battler.prototype.updateStateCount = function() {
    //プロテス・シェルのステートボーナス
    //かけてしばらくは効果量が増えるようにするため
    if (this._protectBonus > 0) {
        this._protectBonus = this._protectBonus - BattleManager.battleSpeedTpbRate();
    }
    if (this._shellBonus > 0) {
        this._shellBonus = this._shellBonus - BattleManager.battleSpeedTpbRate();
    }
    //スリップのカウント
    if (this._slipCount > 0) {
        this._slipCount = this._slipCount - BattleManager.battleSpeedTpbRate();
        //０になったら解除
        if(this._slipCount <= 0){
            this.removeState(42);
        }
    }
    //死の宣告のカウント
    if (this._deathCount > 0) {
        this._deathCount = this._deathCount - BattleManager.battleSpeedTpbRate();
    }
    //０になったら執行
    if(this.isStateAffected(39) && this._deathCount <= 0){
        //this.removeState(39)
        if($gameSwitches.value(193)){ //クラウディヘブン
            this.forceAction(117,this.index());
        }else{
            this.forceAction(106,this.index());
        }
        BattleManager.forceAction(this);
    }
    //トランスのカウント
    if (this._transeCount > 0) {
        this._transeCount = this._transeCount - BattleManager.battleSpeedTpbRate();
    }
    //睡眠のカウント
    if (this._sleepCount > 0) {
        this._sleepCount = this._sleepCount - BattleManager.battleSpeedTpbRate();

        //子守歌効果
        if((this.isActor()&&$gameTroop.isSingingLullaby())||
        (this.isEnemy()&&$gameParty.isSingingLullaby())){
            this._sleepCount = 180;
        }

        //０になったら解除
        if( this._sleepCount <= 0){
            this.removeState(10);
            this.setActionState("undecided");
            this._tpbState = "charging";
        }
    }
    //麻痺のカウント
    if (this._parailysisCount > 0) {
        this._parailysisCount = this._parailysisCount - BattleManager.battleSpeedTpbRate();
        //０になったら解除
        if(this._parailysisCount <= 0){
            this.removeState(12);
            this.setActionState("undecided");
            this._tpbState = "charging";
        }
    }
};

Game_Battler.prototype.updateStopState = function() {
    //ストップのカウント
    if (this._stopCount > 0) {
        this._stopCount = this._stopCount - BattleManager.battleSpeedTpbRate();
        //愛の歌効果
        if((this.isActor()&&$gameTroop.isSingingLove())||
        (this.isEnemy()&&$gameParty.isSingingLove())){
            this._stopCount = 120;
        }
        //０になったら解除
        if(this._stopCount <= 0){
            this.removeState(37);
            this._tpbState = "charging";
            this._tpbCastTime = 0;
            this._tpbChargeTime = 0;
            this._tpbIdleTime = 0;
            this._actions = [];
            this._counterActions = [];
        }
    }
};

Game_Battler.prototype.shellBonus = function() {
    return this._shellBonus;
};

Game_Battler.prototype.shellRate = function() {
    return 2/3 - (this._shellBonus/180 * 0.25);
};

Game_Battler.prototype.protectBonus = function() {
    return this._protectBonus;
};

Game_Battler.prototype.protectRate = function() {
    return 2/3 - (this._protectBonus/180 * 0.25);
};

Game_Battler.prototype.slipCount = function() {
    return this._slipCount;
};

Game_Battler.prototype.deathCount = function() {
    return this._deathCount;
};

Game_Battler.prototype.protectBonus = function() {
    return this._transeCount;
};

Game_Battler.prototype.sleepCount = function() {
    return this._sleepCount;
};

Game_Battler.prototype.stopCount = function() {
    return this._stopCount;
};

Game_Battler.prototype.parailysisCount = function() {
    return this._parailysisCount;
};

const _game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
Game_Battler.prototype.onBattleStart = function(advantageous) {
    this.initStateCount();
    this.resetAttractX();
    _game_Battler_onBattleStart.apply(this,arguments);
};

//各ステート用カウント変数の初期化
Game_Battler.prototype.initStateCount = function() {
    this._protectBonus = 0;
    this._shellBonus = 0;
    this._slipCount = 0;
    this._deathCount = 0;
    this._transeCount = 0;
    this._sleepCount = 0;
    this._parailysisCount = 0;
}

//ステートを追加した時、時間経過が影響するステートの数値を代入する
const _Game_Battler_addState = Game_Battler.prototype.addState;
Game_Battler.prototype.addState = function(stateId) { 
    _Game_Battler_addState.apply(this,arguments);
    if(stateId == 43){ // プロテス
        this._protectBonus = 180;
    }
    if(stateId == 44){ // シェル
        this._shellBonus = 180;
    }
    if(stateId == 10){ // 睡眠
        this._sleepCount = 180;
    }
    if(stateId == 12){ // 麻痺
        this._parailysisCount = 120;
    }
    if(stateId == 28){ // トランス
        this._transeCount = 120;
    }
    if(stateId == 42){ // スリップ
        this._slipCount = 400;
    }
    if(stateId == 37){ // ストップ
        this._stopCount = 120;
    }
};

//-----------------------------------------------------------------------------
// Sprite_DeathCount
//
// 死の宣告用スプライト。これ１つで1ケタ。

function Sprite_DeathCount() {
    this.initialize(...arguments);
}

Sprite_DeathCount.prototype = Object.create(Sprite.prototype);
Sprite_DeathCount.prototype.constructor = Sprite_DeathCount;

Sprite_DeathCount.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
};

Sprite_DeathCount.prototype.initMembers = function() {
    this._digit = null;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.y = -$TILE;
    this._typeId = null;
    this.setFrame(0, 0, 0, 0);
    this.bitmap = ImageManager.loadSystem("Damage");
    this.visible = false;
};

Sprite_DeathCount.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateFrame();
}

Sprite_DeathCount.prototype.setDigit = function(digit) {
    if(digit == 0){
        this._digit = 10;
    }else{
        this._digit = digit;
    }
};

Sprite_DeathCount.prototype.updateFrame = function() {
    if(!this._digit){
        this.visible = false;
        this.setFrame(0, 0, 0, 0);
    }else if(this._digit){
        this.visible = true;
        const w = Math.floor(this.bitmap.width / 10);
        const h = Math.floor(this.bitmap.height / 5);
        let sx = this._digit * w;
        if(this._digit == 10){
            sx = 0;
        }
        const sy = h * 2;
        this.setFrame(sx, sy, w, h);
    }else{
        this.visible = false;
        this.setFrame(0, 0, 0, 0);
    }
};

//-----------------------------------------------------------------------------
// Spriteset_DeathCounts
//
// 死の宣告用スプライトセット。3ケタまで。

function Spriteset_DeathCounts() {
    this.initialize(...arguments);
}

Spriteset_DeathCounts.prototype = Object.create(Sprite.prototype);
Spriteset_DeathCounts.prototype.constructor = Spriteset_DeathCounts;

Spriteset_DeathCounts.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._value = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this._sprites = [];
    for(let i=0;i<3;i++){
        const sprite = new Sprite_DeathCount();
        this._sprites.push(sprite);
        this.addChild(sprite);
    }
};

Spriteset_DeathCounts.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if(this._battler){
        this._value = Math.min(999,Math.floor(this._battler.deathCount()/8));
    }
    this.updateDigits();
};

Spriteset_DeathCounts.prototype.updateDigits = function() {
    if(this._battler && this._battler.isStateAffected(39)){ //死の宣告状態なら表示
        this.y = -this._battler.height/2
        if(this._battler.isActor()){
            this.y += 8
        }
        if(this._value>=100){
            this._sprites[0].x = -this._sprites[0].width;
            this._sprites[0].setDigit(Math.floor(this._value/100));
        }else{
            this._sprites[0].setDigit(null);           
        }
        if(this._value>=10){
            if(this._value<100){
                this._sprites[1].x = -this._sprites[1].width/2;
            }
            this._sprites[1].setDigit(Math.floor(this._value%100/10));
        }else{
            this._sprites[1].setDigit(null);           
        }
        if(this._value>=100){
            this._sprites[2].x = this._sprites[2].width;
        }else if(this._value>=10){
            this._sprites[2].x = this._sprites[2].width/2;            
        }
        if(this._value>=10 && this._value%10==0){
            this._sprites[2].setDigit(10);
        }else{
            this._sprites[2].setDigit(Math.floor(this._value%10));
        }
    }else{
        this._sprites[0].visible = false;
        this._sprites[1].visible = false;
        this._sprites[2].visible = false;
    }
};

Spriteset_DeathCounts.prototype.setBattler = function(battler) {
    this._battler = battler;
};

const _Sprite_Battler_initMembers = Sprite_Battler.prototype.initMembers;
Sprite_Battler.prototype.initMembers = function() {
    _Sprite_Battler_initMembers.apply(this,arguments);
    this._deathCountsSprites = new Spriteset_DeathCounts();
    this.addChild(this._deathCountsSprites);
};

const _Sprite_Battler_setBattler = Sprite_Battler.prototype.setBattler;
Sprite_Battler.prototype.setBattler = function(battler) {
    _Sprite_Battler_setBattler.apply(this,arguments);
    //this._deathCountsSprites.y = Math.floor(-this._height/2)+8;
    this._deathCountsSprites.setBattler(battler);
};

