//=============================================================================
// FNG_MultiHitAttack.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc 多段攻撃結果の演出を強化します
  * @author finga
  * @help 多段攻撃結果の演出を強化します
*/

//-----------------------------------------------------------------------------
// Game_Action
//
// ・行動結果の代入処理を通常攻撃系スキルとその他のスキルで分ける

//override
Game_Action.prototype.apply = function(target) {
    this.changeActionBySomeCases();
    //console.log(this.item());
    if(this.item().damage.elementId == -1){
        this.applyNormalAttack(target);
    }else{
        this.applySpecialAttack(target);
    }
};

Game_Action.prototype.changeActionBySomeCases = function() {
    const item = this.item();
    //console.log(this.subject().name(),item,this.subject().isStateAffected(28),DataManager.isSkill(item))
    //トランス状態の場合、一部のキャラの「たたかう」が変化する
    if(this.subject().isStateAffected(28)&&DataManager.isSkill(item)){
        if(item.id == 1 && this.subject().hasSkill(297)){ //パラディンフォース
            this.setSkill(105);
        }
        if(item.id == 1 && this.subject().hasSkill(298)){ //オニオンフォース
            this.setSkill(105);
        }
    }
    //暗闇状態の場合、心眼対応スキルが変化する
    if(this.subject().isStateAffected(5)&&DataManager.isSkill(item)){
        if(item.meta.shingan && this.subject().isSniper()){
            this.setSkill(Number(item.meta.shingan));
        }
    }
};

Game_Action.prototype.applyNormalAttack = function(target) {
    //
    //右手攻撃の結果を計算・代入
    this.setResultNormalAttack(target,0);
    //左手攻撃の結果を計算・代入
    if(this.subject().isDualWield()){
        this.setResultNormalAttack(target,1);
    }
    //すべての段数の行動結果を合計する
    target.sumResults();
    
    this.updateLastTarget(target);
};

//ゴーレムでカバーできるか否か
Game_Action.prototype.isGolemCoverable = function(target) {
    const targets = BattleManager._targets;
    // ゴーレムを召喚していなければ終了
    if(!BattleManager.golem(target)){
        return false;
    }
    // 物理回避以外は対象外
    if(this.item().hitType != 1){
        return false;
    }
    if(targets.length>1){
        //対象が複数の場合、一番HPが低いキャラをかばう
        var trueTarget = targets[0];
        for(let i=1;i<targets.length;i++){
            if(trueTarget.hp > targets[i]){
                trueTarget = targets[i];
            }
        }
        if(target != trueTarget){
            return false;           
        }
    }
    return true;
};

//通常攻撃行動の結果を代入させる
//通常攻撃系スキルでは以下の効果は作用しない
//・ステートの解除　
//・バフ＆デバフの効果適用or効果解除　・能力の成長
//・スキルの習得　・コモンイベントの開始
Game_Action.prototype.setResultNormalAttack = function(target,handside) {
    const result = new Game_ActionResult();
    const elements = this.getElements(this.item(),handside);
    result.used = this.testApply(target);
    result.physical = this.isPhysical();
    result.missed = result.used && Math.random() >= this.normalAttackHit(target,handside);
    result.wolfed = Math.random() < this.normalAttackWolf(target);
    result.evaRand = Math.random(); // 回避乱数
    result.evaded = !result.missed && result.evaRand < this.normalAttackEva(target,handside);
    if(result.wolfed){
        result.evaded = true;
    }
    result.golemed = !result.missed && !result.evaded && this.isGolemCoverable(target) && !result.wolfed;
    if(!result.wolfed&&(result.evaded||result.missed)){
        result.reduceAvatar = 1;
    }
    result.drain = this.isDrain();
    if (!result.missed && !result.evaded) {
        if (this.item().damage.type > 0) {
            result.critical = Math.random() < this.subject().criticalRate(handside);
            var value = this.makeDamageValueNormalAttack(target, result.critical,handside);
            if(result.critical){
                var weapon = null;
                var lune = 0;
                if(this.subject().isActor()){
                    const weapon = this.subject().equips()[handside];
                    if(weapon){
                        lune = Math.floor(Number($dataWeapons[weapon.id].meta.lune) * this.subject().mcr);
                    }
                }
                if(this.subject().mp < lune){
                    result.critical = false;
                    value = Math.floor(value/2);
                }else{
                    this.subject().addLuneCost(lune);
                }
            }
            value = Math.min(value,9999);
            if(this.isHpEffect()){
                result.hpDamage = value;
            }
            if(this.isMpEffect()){
                result.mpDamage = value;
            }
            //MP吸収物理攻撃？
            if(elements.includes(28)){
                result.hpDamage = 0;
                result.mpDamage = value;
                result.mpDrain = value;
            //MP攻撃？      
            }else if(elements.includes(29)){
                result.hpDamage = 0;
                result.mpDamage = value;
            //HP吸収物理攻撃？      
            }else if(elements.includes(27)){
                result.hpDrain = Math.floor(value/2);
            }
            if(result.golemed){
                if(result.hpDamage <= 0){
                    result.golemed = false;
                }
            }
        }
        for (const effect of this.item().effects){
            this.setItemResult(target, effect, result,handside);
        }
    }
    target.addResult(result);
};

//デスペル効果の事前適用
Game_Battler.prototype.applyDespel = function(){
    const removeStates = [15,18,24,27,37,38,40,41,43,44,45,46,47,48,49,50,51,52,53,54,61];
    for(stateId of removeStates){
        this.removeState(stateId);
    }
}

Game_Battler.prototype.initLuneCost = function(){
    this._luneCost = 0;
}

Game_Battler.prototype.addLuneCost = function(value){
    if(!this._luneCost){
        this._luneCost = 0;
    }
    this._luneCost += value;
}

Game_Battler.prototype.luneCost = function(){
    if(!this._luneCost){
        this._luneCost = 0;
    }
    return this._luneCost;
}

Game_Battler.prototype.initHpCost = function(){
    this._hpCost = 0;
}

Game_Battler.prototype.addHpCost = function(value){
    if(!this._hpCost){
        this._hpCost = 0;
    }
    this._hpCost += value;
}

Game_Battler.prototype.hpCost = function(){
    if(!this._hpCost){
        this._hpCost = 0;
    }
    return this._hpCost;
}

Game_Actor.prototype.criticalRate = function(handside){
    const weapon = this.equips()[handside];
    
    if(weapon == null){
        if(this.monkStyle()){
            return 0.15 + this.level/500;
        }else{
            return 0;
        }
    }else{
        if(weapon.wtypeId == 13 && this.monkStyle()){
            return 0.15 + this.level/500;
        }
        return DataManager.itemxparamSum(weapon, 2)*0.01;
    }
}

Game_Enemy.prototype.criticalRate = function(handside){
    return 0;
}

Game_Action.prototype.gainAttackDrainedHp = function(result) {
    if (result.hpDrain != 0) {
        let gainTarget = this.subject();
        gainTarget.gainHp(result.hpDrain);
    }
};

Game_Action.prototype.gainAttackDrainedMp = function(result) {
    if (result.mpDrain != 0) {
        let gainTarget = this.subject();
        gainTarget.gainMp(result.mpDrain);
    }
};

Game_Action.prototype.makeDamageValueNormalAttack = function(target, critical,handside) {
    const item = this.item();
    const subject = this.subject();
    let baseValue = this.evalDamageNormalAttack(target,handside,critical);
    var weapons = [null,null];
    if(subject.isActor()){
        weapons = subject.weapons();
    }
    let value = this.calcNormalAttackElementRate(target,baseValue,handside);
    if (value < 0) {
        value *= target.rec;
    }
    //魔法剣デスペルでなければプロテスorシェルを適用
    if(!subject.isMsDespel()){
        if(weapons[handside] && weapons[handside].meta.mdf && target.isStateAffected(44)){ //シェル
            value *= target.shellRate();
        }else if(target.isStateAffected(43)){ //プロテス
            value *= target.protectRate();
        }
    }
    //ためる状態
    if(subject.isStateAffected(24)&&weapons[handside]&&weapons[handside].wtypeId != 22){
        value *= subject.chargeRate();
        subject.chargeResetFlagOn();
    }
    //「はなつ」は１．５倍
    if(subject.isReleasing()){
        value *= 1.5;
    }
    value = this.applyJumpRate(value,handside,subject,item);
    value = this.applyVariance(value, item.damage.variance);
    if(!item.meta.guardThrough){
        value = this.applyGuard(value, target);
    }
    if(subject.isDualWield()){
        value *= 0.75;
    }
    value = Math.round(value);
    value = this.applyExcalipoor(value, this.getElements(this.item(),handside));
    return value;
};

Game_Action.prototype.applyGuard = function(damage, target) {
    var value = damage / (damage > 0 && target.isGuard() ? 2 * target.grd : 1);
	if(target.isActor()){
    	value = target.hasSkill(323) && target.isGuard() ? value /2 : value; //まもる
	}
    return value;
};

Game_Action.prototype.applyJumpRate = function(value,handside,subject,item) {
    if(subject.isEnemy()){
        return value;
    }
    const weapon = subject.equips()[handside];
    if(weapon && item.meta.landing && (item.wtypeId == 11 || item.wtypeId == 12)){
        return value * 1.3;
    }
    return value;
}

Game_Action.prototype.applyExcalipoor = function(value,elements){
    var newValue = value;
    //エクスカリパーの適用
    if(elements.includes(20)){
        if(value == 0){
            newValue = 0;
        }else if(value > 0){
            newValue = 1;            
        }else{
            value = -1;
        }
    }
    return newValue;
}

Game_Action.prototype.evalDamageNormalAttack = function(target,handside,critical,plusAtk) {
    const item = this.item();
    const a = this.subject(); // eslint-disable-line no-unused-vars
    const b = target; // eslint-disable-line no-unused-vars
    var lune = 0;
    var elements = this.getElements(this.item());
    if(a.isActor()){
        const weapon = a.equips()[handside];
        elements = this.getElements(this.item(),handside);
        if(weapon){
            lune = $dataWeapons[weapon.id].meta.lune;
        }
    }
    //const sign = [3, 4].includes(item.damage.type) ? -1 : 1;
    const level = a.level;
    var pow = 0;
    if(a.isActor() && a.hasMagicWeapon(handside)){
        pow = a.mat;
    }else if(a.hasGun(handside)){
        pow = 50; //銃を武器とする場合はちからの値を５０として計算
    }else{
        pow = a.pow
    }
    var atk = 0;
    if(a.isActor()){
        if(handside == 0){
            atk = a.ffparam(0);
        }else{
            atk = a.ffparam(1);
        }
    }else{
        atk = a.atk;
    }
    if(plusAtk){
        atk += plusAtk;
    }
    //魔法防御参照武器はバランス調整のためこっそり攻撃力+10
    /*if(a.isActor() && a.hasMagicDefWeapon(handside)){
        atk += 10;
    }*/
    if(critical){
        if(lune){
            atk*= 1;
        }else{
            atk*= 2;
        }
    }
    if(elements.includes(29)){
        atk = atk/2;
    }
    var def = 0;
    if(a.isActor() && a.hasMagicDefWeapon(handside)){
        def = b.mdf;
    }else{
		var def = b.def;
	}
    if(a.hasPierceWeapon(handside)||elements.includes(19) ? b.def : b.def/2){
        def = Math.floor(def / 2);
    }	
    if(a.hasCureWeapon()||(critical&&lune==0)||a.hasDef0Weapon(handside)||elements.includes(28)||elements.includes(29)){
        def = 0;
    }
    if(item.meta.hissatsu){
        //必殺系コマンドの場合、防御0
        def = 0;
    }
    var rate = 100;
    if(item.damage.formula&&item.damage.elementId == -1){
        if(item.damage.formula.charAt(0)=="+"||item.damage.formula.charAt(0)=="-"){
            atk = Math.max(0,atk+Number(item.damage.formula));
        }else{
            rate = Number(item.damage.formula);
        }
    }
    var vitrate = this.vitrate(b);
    if(item.meta.hissatsu){ //必殺スキルなら体力補正なし
        vitrate = 1;
    }
    rate = (pow * level /128 + 2) * rate/100 * vitrate;
    if(elements.includes(28)||elements.includes(29)){ //MPにダメージの場合倍率1固定で力の半分を攻撃力に加算
        rate = 1;
        atk += pow/2;
    }
    var value = atk-def
    if(value > 1 && a.isActor()&&a.hasGun(handside)){
        value += a.licenseGunshotPlus();
    }
    if(value < 0){
        value = 0;
    }
    value = value*rate;
    if(value >= 0 && value < 1){
        value = 1;
    }

    //console.log(a.name(),value,atk-def,pow,level,(pow * level /128 + 2));
    return value;
};

Game_Action.prototype.normalAttackHit = function(target,handside) {
    const subject = this.subject()//
    const hissatsu = this.item().meta.hissatsu;
    var weapons = [];
    if(subject.isActor()){
        weapons = subject.weapons();
    }
    var weapon;
    if(handside == 0 && weapons.length>0){
        weapon = weapons[0];
    }else if(handside == 1 && weapons.length>1){
        weapon = weapons[1];
    }
    var successRate = this.item().successRate;
    if(hissatsu){
        //必殺系コマンドの場合、眠り・麻痺・ストップで命中率１００％」
        if(target.isStateAffected(10)||target.isStateAffected(12)||target.isStateAffected(37)){
            successRate = 1;
        }
    }
    if(subject.isStateAffected(5)){
        if(!(weapon && weapon.wtypeId == 18)){
            successRate = successRate/2;
        }
    }
    //竪琴だと沈黙時は命中率０
    if(subject.isStateAffected(6) && (weapon && weapon.wtypeId == 18)){
        successRate = 0;
    }
    if(subject.hasCureWeapon()){
        return 1 * successRate * 0.01;
    }
    if(subject.isActor()){
        if(handside == 0){
            return subject.hitRate1() * successRate * 0.01;
        }else{
            return subject.hitRate2() * successRate * 0.01;
        }
    }
    return successRate * 0.01 * this.subject().hit;
};

Game_Action.prototype.normalAttackEva = function(target,handside) {
    const subject = this.subject()//
    var value = target.eva;
    const jump = this.item().meta.landing;
    //console.log(this.item())
    //眠り・麻痺・睡眠時は回避０
    if(target.isStateAffected(10)||target.isStateAffected(12)||target.isStateAffected(37)){
        value = 0;
    }
    if(subject.isSniper()||subject.hasCureWeapon(handside)||(jump&&subject.hasJumpWeapon(handside))){
        value = 0;
    }else if(target.isStateAffected(45)||target.isStateAffected(46)){
        value = 100;
    }
    //console.log("jump:",jump,target.name()+"の回避率:",value);
    return value;
};

//属性計算は大きく変更
//自然系属性(火氷雷)などと種族特攻などその他の属性を分けて処理する
Game_Action.prototype.calcNormalAttackElementRate = function(target,baseValue,handside) {
    //通常攻撃の属性を取得する
    let elements = this.getElements(this.item(),handside);
    let natureElements = elements.filter(id => id >= 2 && id <= 10);
    let baseValue2 = baseValue;
    const subject = this.subject();
    if(natureElements.length > 0){
        baseValue2 = baseValue/natureElements.length;
    }
    //ダークコントロール
    if(subject.isActor()&&natureElements.includes(9)&&target.elementRate(9)<1&&subject.hasSkill(207)){
        natureElements = elements.filter(id => id != 9);
    }
    var value = baseValue;
    if(elements.length > 0){
        if(natureElements.length > 0){
            value = 0;
            for(element of natureElements){
                let eValue = baseValue2 * target.elementRate(element);
                //バファイ適用
                if(element == 2 && target.isStateAffected(50)){
                   eValue /= 2;
                    target._setRemoveBfire();
                }
                //バコルド適用
                if(element == 3 && target.isStateAffected(51)){
                   eValue /= 2;
                   target._setRemoveBcold();
                }
                //バサンダ適用
                if(element == 4 && target.isStateAffected(52)){
                   eValue /= 2;
                    target._setRemoveBthunder();
                }
                //バウォタ適用
                if(element == 5 && target.isStateAffected(53)){
                   eValue /= 2;
                    target._setRemoveBwater();
                }
                //バエアロ適用
                if(element == 7 && target.isStateAffected(54)){
                   eValue /= 2;
                    target._setRemoveBaero();
                }
                value += eValue;
            }
        }
        let speciesRates = elements.filter(id => id > 10);
        for(rate of speciesRates){
            value = value * target.elementRate(rate);
        }
    }
    //隊列無視武器でなければ隊列を反映
    if(!elements.includes(26)){
        //後列の反映
        if(this.subject().isStateAffected(33)||target.isStateAffected(33)){
           value /= 2;
        }
        //踏み込みの反映
        if(this.subject().isStateAffected(31)||target.isStateAffected(31)){
           value *= 1.25;
        }
    }
    //属性に回復を含む、値がダメージの場合はダメージを反転
    if(elements.includes(21) && value > 0){
        value = -value;
    };
    //対象がゾンビ状態、属性に回復を含む、値が回復の場合はダメージを反転
    if(target.isStateAffected(36) && elements.includes(21) && value < 0){
        value = -value;
    };
    //対象がゾンビ状態、属性にHP吸収・MP吸収を含む、値がダメージの場合は値を反転
    if(target.isStateAffected(36) && (elements.includes(27)||elements.includes(27)) && value > 0){
        value = -value;
    };
    //対象が石化状態の場合、すべてのダメージを０にする
    if(target.isStateAffected(11)){
        value = 0;
    };
    if(value > 1){
        value = Math.ceil(value);
    }
    return Math.round(value);
};

//-----------------------------------------------------------------------------
// Game_Battler
//
// ・多段ヒット時の全ての結果を後から参照できるようにする

const _Game_Battler_initMembers = Game_Battler.prototype.initMembers;
Game_Battler.prototype.initMembers = function() {
    _Game_Battler_initMembers.apply(this,arguments);
    this._results = [];
    //アニメーション時に今何段目かを参照させるための変数
    this._atkrcvCount = 0;
};

Game_Battler.prototype.atkrcvCount = function() {
    if(!this._atkrcvCount){
        this._atkrcvCount = 0;
    }
    return this._atkrcvCount;
};

Game_Battler.prototype.atkrcvCountUp = function() {
    if(!this._atkrcvCount){
        this._atkrcvCount = 0;
    }
    this._atkrcvCount += 1;
};

Game_Battler.prototype.addResult = function(result) {
    if(!this._results){
        this.clearResults();
    }
    if(!this._popupResults){
        this.clearPopupResults();
    }
    if(!this._drainPopupResults){
        this._drainPopupResults = [];
    }
    this._results.push(result);
    //console.log(this._popupResults);
};

Game_Battler.prototype.clearResults = function() {
    this._results = [];
};

Game_Battler.prototype.clearPopupResults = function() {
    this._popupResults = [];
};

Game_Battler.prototype.resetAtkrcvCount = function() {
    this._atkrcvCount = 0;
};

Game_Battler.prototype.throwable = function() {
    if(this.elementRate(31)<0){
        return false;
    }
    return true;
};

//ジャンプ攻撃の場合、自身にジャンプ状態を付与・対象を記憶・着地時に発動するスキルIDを記憶する
Game_Battler.prototype.setJumpAttack = function(skillId,targets) {
    this.addState(23);
    this._landingSkillId = skillId;
    this._landingTargets = targets;
};

Game_Battler.prototype.resetJumpAttack = function() {
    this.removeState(23);
    this._landingSkillId = 0;
    this._landingTargets = [];
};

Game_Battler.prototype.landingTargets = function() {
    if(!this._landingTargets){
        this.resetlandingTargets();
    }
    return this._landingTargets;
};

Game_Battler.prototype.resetlandingTargets = function() {
    this._landingTargets = [];
};

//全ての段の結果を合計する
Game_Battler.prototype.sumResults = function() {
    this.clearResult();
    this._result.evaded = true;
    this._result.missed = true;
    this._result.golemed = true;
    this._result.wolfed = true;
    this._result.hpDamage = 0;
    this._result.mpDamage = 0;
    this._result.hpRecover = 0;
    this._result.mpRecover = 0;
    this._result.hpDrain = 0;
    this._result.mpDrain = 0;
    this._result.reduceAvatar = 0;
    for(result of this._results){
        this._result.used = this._result.used || result.used;
        this._result.missed = this._result.missed && result.missed;
        this._result.evaded = this._result.evaded && result.evaded;
        this._result.golemed = this._result.golemed && result.golemed;
        this._result.wolfed = this._result.wolfed && result.wolfed;
        this._result.physical = this._result.physical || result.physical;
        this._result.drain = this._result.drain || result.drain;
        this._result.critical = this._result.critical || result.critical;
        this._result.hpDamage += result.hpDamage;
        
        this._result.mpDamage += result.mpDamage;
        this._result.hpRecover += result.hpRecover;
        this._result.mpRecover += result.mpRecover;
        this._result.hpDrain += result.hpDrain;
        this._result.mpDrain += result.mpDrain;
        this._result.reduceAvatar += result.reduceAvatar;
        for(state of result.addedStates){
            //ためるは例外
            if(!this._result.addedStates.includes(state)||state == 24){
                this._result.addedStates.push(state)
            }
        }
        for(state of result.missedStates){
            if(!this._result.missedStates.includes(state)){
                this._result.missedStates.push(state)
            }
        }
        for(state of result.guardedStates){
            if(!this._result.guardedStates.includes(state)){
                this._result.guardedStates.push(state);
            }
        }
        this._result.evaRand = result.evaRand; //回避乱数は最終段を合計値として保存
    }
    if(this._result.missedStates.length>0&&this._result.guardedStates.length==0&&this._result.addedStates.length==0&&this._result.hpDamage == 0&&this._result.mpDamage == 0){
        //console.log(this._result.missedStates)
        this._result.missed = true;
    }
};

Game_Battler.prototype.addStateInMotion = function(){
    for(state of this._result.addedStates){
        this.addState(state);
    }
    this._result.addedStates = [];
}

Game_Battler.prototype.makeJumpActions = function() {
    this.clearActions();
    var action = new Game_Action(this,true);
    action.setSkill(this._landingSkillId);
    action.setTarget(this._landingTargets);
    this._actions = [];
    this._actions.push(action);
};

BattleManager.endBattlerActions = function(battler) {
    battler.setActionState(this.isTpb() ? "undecided" : "done");   
    battler.onAllActionsEnd();   
    if(!battler.isCountering()){
        battler.clearTpbChargeTime();
    }
    if(battler.counterActions().length <= 0){
        battler.resetCounter();
    }
    battler._atkrcvCount = 0;
    this.displayBattlerStatus(battler, true);
    if(battler._landingSkillId){
        battler.makeJumpActions();
        battler.startTpbCasting();
        battler._landingSkillId = null;
    }
};

Game_Battler.prototype.hasWolf = function(battler){
    if(battler.isEnemy()){
        return false;
    }
    //アンジェロガードかウルフガード
    return battler.hasSkill(283) || battler.hasSkill(295);
};

Game_Action.prototype.normalAttackWolf = function(target) {
    const subject = this.subject()//
    var value = 0;
    if(subject.hasWolf(target)){
       value = 0.15;
    }
    return value;
};

BattleManager.animationIdOrMiss = function(id,index){
    if(BattleManager._targets.length <= index){
        return 1;
    }
    console.log(this.resultList());
    if(this.resultList()[index].missed||BattleManager.resultList()[index].evaded){
        return 113;
    }
    return id;
}

BattleManager.playableTargetDAnimation = function(index){
    if(BattleManager._targets.length <= index){
        return false;
    }
    if(this.resultList()[index].missed||BattleManager.resultList()[index].evaded){
        return false;
    }
    return true;
}