//=============================================================================
// FNG_SpecialAttack.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc 魔法・必殺技系スキルの処理を改造する
  * @author finga
  * @help 魔法・必殺技系スキルの処理を改造する
*/

Game_Action.prototype.applySpecialAttack = function(target) {
    console.log(this.subject().name(),"setResultSpecialAttack");
    //攻撃の結果を計算・代入
    this.setResultSpecialAttack(target);
    console.log(this.subject().name(),"sumresults");
    //すべての段数の行動結果を合計する
    target.sumResults();
    
    this.updateLastTarget(target);
};

//魔法・必殺技系行動の結果を代入させる
Game_Action.prototype.setResultSpecialAttack = function(target) {
    const result = new Game_ActionResult();
    result.used = this.testApply(target);
    result.physical = this.isPhysical();
    result.missed = result.used && Math.random() >= this.specialAttackHit(target);
    result.evaRand = Math.random(); // 回避乱数
    result.evaded = !result.missed && result.evaRand < this.specialAttackEva(target);
    if(this.item().meta.diffusionTarget && 
        BattleManager._targets[0]._results.length > 0 &&
        (BattleManager._targets[0]._results[0].missed||
            BattleManager._targets[0]._results[0].evaded||
            BattleManager._targets[0]._results[0].golemed)){
                result.evaded = true;
                result.evaRand = 100;
    }
    result.golemed = !result.missed && !result.evaded && this.isGolemCoverable(target);
    if((result.evaded||result.missed) && (this.item().elementId == 1||this.item().hitType == 1) &&  target.isStateAffected(45)){
        result.reduceAvatar = 1;
    }
    result.drain = this.isDrain();
    if (!result.missed && !result.evaded) {
        if (this.item().damage.type > 0) {
            result.critical = Math.random() < this.itemCri(target);
            const value = this.makeDamageValueSpecialAttack(target, result.critical);
            if(this.isHpEffect()){
                result.hpDamage = value;
            }
            if(this.isMpEffect()){
                result.mpDamage = value;
            }
        }
        if(this.applyAntiDamage(0,target)){
           if(result.hpDamage){
               result.hpDamage += this.applyAntiDamage(result.hpDamage,target);
           }else{
               result.hpDamage = this.applyAntiDamage(result.hpDamage,target);
           }
        }
        if(this.item().meta.sylph&&result.hpDamage > target.hp){
            result.hpDamage = target.hp;
        }
        if(this.item().meta.diffusionRate && BattleManager._targets[0] != target){
            const rate = Number(this.item().meta.diffusionRate);
            result.hpDamage = Math.floor(result.hpDamage*rate);
            result.mpDamage = Math.floor(result.mpDamage*rate);
        }
        result.hpDamage = Math.min(result.hpDamage,9999);
        result.mpDamage = Math.min(result.mpDamage,9999);
        if(result.drain){
            if(result.hpDamage){
                result.hpDrain = result.hpDamage
            }
            if(result.mpDamage){
                result.mpDrain = result.mpDamage
            }
        }
        for (const effect of this.item().effects) {
            this.setItemResult(target, effect, result);
        }
        //武器タイプ一致時の追加状態異常
        if(this.item().meta.wTypeEffect&&this.subject().isActor()){
            const weapon = this.subject().weapons()[0];
            if(weapon){
                const wtypeEffects = this.item().meta['wTypeEffect'].split(',')
                if(wtypeEffects.includes(weapon.wtypeId)){
                    this.itemResultSetAddAttackStateByWeapon(target,result,weapon);
                }
            }
        }
        //投げ時の追加状態異常
        if(DataManager.isSkill(this.item()) && this.item().meta.throw){
            const weapon = this.subject().throwWeapon()
            this.itemResultSetAddAttackStateByWeapon(target,result,weapon);
        }
    }
    target.addResult(result);
};

/*
const _Game_Action_isHpEffect = Game_Action.prototype.isHpEffect;
Game_Action.prototype.isHpEffect = function() {
    const dt = _Game_Action_isHpEffect.apply(this,arguments);
    return dt || this.applyAntiDamage(0,target) > 0;
};*/


Game_Action.prototype.specialAttackHit = function(target) {
    const subject = this.subject()//
    var successRate = this.item().successRate * 0.01;
    const elements = this.getElements(this.item()); 

    //暗闇状態の反映
    if(this.item().hitType == 1 && this.item().damage.elementId == 1 && subject.isStateAffected(5)){
        successRate = successRate/2;
    }
    //にらみスキルで暗闇状態の場合、成功率を０とする
    if(this.item().meta.eye && subject.isStateAffected(5)){
        successRate = 0;
    }
    //心眼
    if(this.item().meta.blindhit && subject.isStateAffected(5)){
        successRate = 1;
    }
	//対象のHPの残量によって命中率に補正
	if(this.item().meta.HpRateHit){
		const hpratehit = Number(this.item().meta.HpRateHit);
		successRate += (1-(target.hp/target.mhp))*hpratehit;
	}
    //浮遊による地震系の技の回避
    if(elements.includes(23)&&target.isStateAffected(38)){
        successRate = 0;
    }
    //物理攻撃の場合、使用者の命中率とスキルの成功率をかけ合わせる
    if(this.item().damage.elementId == 1){
        successRate = successRate * subject.hit;
    }
    //必中アビリティ持ちで物理攻撃扱いの場合、基本成功率が50%より高いスキルを必中扱いとする
    if(this.item().damage.elementId == 1 && subject.isSniper() && this.item().successRate > 0.5){
        successRate = 1;
    }
    return successRate;
};

Game_Action.prototype.specialAttackEva = function(target,handside) {
    const subject = this.subject()//
    var value = 0;
    
    //命中タイプが必中なら０
    if(this.item().hitType == 0){
       return 0;
    }
    if(this.isPhysical()){
        value = target.eva;
    }
    if(this.item().elementId == 1 && subject.isSniper()){
        value = 0;
    }
    if(this.item().meta.airSniping && target.isStateAffected(38)){
        value = 0;
    }
    //分身
    if((this.item().elementId == 1 && value > 0 && target.isStateAffected(45)) ||
        (this.item().hitType == 1 && target.isStateAffected(45)) ){
        value = 100;
    }
    //透明
    if((this.item().elementId == 1 && value > 0 && target.isStateAffected(46))||
       (this.item().hitType == 1 && target.isStateAffected(46) )){
        value = 100;
    }
    return value;
};

//体力によるダメージ補正
Game_Action.prototype.vitrate = function(target) {
    var difPlus = 0;
    if($gameSystem.difficulty()<2 && target.isActor()){
        difPlus += 40
    }
    return Math.max(100-(target.vit+difPlus-25),0)*0.01;
}

//バリアチェンジステートの適用
const _Game_BattlerBase_elementRate = Game_BattlerBase.prototype.elementRate;
Game_BattlerBase.prototype.elementRate = function(elementId) {
    if(this.isStateAffected(75)&&elementId >= 2&&elementId <= 5){
        if(this.isActor()){
            return $gameParty.changedBarrierElementRate(elementId);
        }else{
            return $gameTroop.changedBarrierElementRate(elementId);
        }
    }
    return _Game_BattlerBase_elementRate.apply(this, arguments);
}

Game_Unit.prototype.changedBarrierElementRate = function(elementId) {
    if(!this._changedBarrierElementRates){
        this.applyBarrierChange();
    }
    return this._changedBarrierElementRates[elementId];
}

Game_Unit.prototype.changedBarrierWeakElementId = function() {
    if(!this._changedBarrierElementRates){
        this.applyBarrierChange();
    }
    for(let i=2;i<this._changedBarrierElementRates.length;i++){
        if(this._changedBarrierElementRates[i] == 1.5){
            return i;
        }
    }
    return 2;
}

Game_Unit.prototype.changedBarrierAbsorptionElementId = function() {
    if(!this._changedBarrierElementRates){
        this.applyBarrierChange();
    }
    for(let i=2;i<this._changedBarrierElementRates.length;i++){
        if(this._changedBarrierElementRates[i] == -1){
            return i;
        }
    }
    return 2;
}

Game_Unit.prototype.applyBarrierChange = function() {
    const elementIds = [1,1,0,0,0,0];

    elementIds[Math.floor(Math.random()*4+2)] = 1.5;
    var randomId = 0;
    do{
        randomId = Math.floor(Math.random()*4+2);
    }while(elementIds[randomId] == 1.5)
    elementIds[randomId] = -1;

    this._changedBarrierElementRates = elementIds;
}

//special physical basic damage
Game_Action.prototype.SPBD = function(target,plusatk = 0) {
    const a = this.subject();
    const b = target;
    const elements = this.getElements(this.item());
    var atk = plusatk + a.atk;
    if(a.isDualWield()){
        atk = atk*2/3;
    }
    var def = elements.includes(19) ? b.def : b.def/2;
    var value = (atk - def)*(a.pow * a.level /128 + 2);
    //エクスカリパーの適用
    if(a.isActor()){
        const welements = [];
        for(weapon of this.subject().weapons()){
            for(trait of weapon.traits){
                if(trait.code == Game_BattlerBase.TRAIT_ATTACK_ELEMENT){
                    welements.push(trait.dataId);
                }
            }
        }
        value = this.applyExcalipoor(value,welements);
    }
    if(a.isReleasing()){ value *= 1.5 }; 
    if(!value){
        value = 1;
    }
    return Math.floor(value);
}

//masic basic damage
Game_Action.prototype.MBD = function(target,atk) {
    const a = this.subject();
    const b = target;
    const ins = a.level/3*2;
    var def = b.mdf;
    var value = atk - def;
    //行動者がアクターの場合、威力を保障する
    if(a.isActor() && ins > value && value >= 0){
        //基礎ダメージが威力保障以下かつ0以上の場合は威力保障発揮
        value = Math.min(ins,atk);
    }else if(a.isActor() && value < 0 && value + ins > 0){
        //基礎ダメージが0未満の場合は威力保障分を加算
        value = value + ins;
    }
    var value = value*(a.mat * a.level /128 + 2);
    if(a.isReleasing()){ value *= 1.5 }; 
    if(!value||value<1){
        value = 1;
    }
    return Math.floor(value);
}

//magic speed damage
Game_Action.prototype.MSD = function(target,atk) {
    const a = this.subject();
    const b = target;
    const ins = a.level/3*2;
    var def = b.mdf;
    var value = atk - def;
    //行動者がアクターの場合、威力を保障する
    if(a.isActor() && ins > value && value >= 0){
        //基礎ダメージが威力保障以下かつ0以上の場合は威力保障発揮
        value = Math.min(ins,atk);
    }else if(a.isActor() && value < 0 && value + ins > 0){
        //基礎ダメージが0未満の場合は威力保障分を加算
        value = value + ins;
    }
    var value = value*(a.agi * a.level /128 + 2);
    if(a.isReleasing()){ value *= 1.5 }; 
    if(!value||value<1){
        value = 1;
    }
    return Math.floor(value);
}

//masic item damage
Game_Action.prototype.MID = function(target,atk) {
    const a = this.subject();
    const b = target;
    const ins = a.level/3*2;
    var def = b.mdf;
    var value = atk - def;
    //行動者がアクターの場合、威力を保障する
    if(a.isActor() && ins > value && value >= 0){
        //基礎ダメージが威力保障以下かつ0以上の場合は威力保障発揮
        value = Math.min(ins,atk);
    }else if(a.isActor() && value < 0 && value + ins > 0){
        //基礎ダメージが0未満の場合は威力保障分を加算
        value = value + ins;
    }
    value = value*(35 * a.level /128 + 2);
    //アイテムの極意　薬の知識分はここでは対象外
    if(a.isActor() && a.hasSkill(308)){
        value = value*2;
    }
    if(!value){
        value = 1;
    }
    return Math.floor(value);
}

//masic item Physical-damage
Game_Action.prototype.MIPD = function(target,atk) {
    const a = this.subject();
    const b = target;
    const ins = a.level/3*2;
    var def = b.def;
    var value = atk - def;
    //行動者がアクターの場合、威力を保障する
    if(a.isActor() && ins > value && value >= 0){
        //基礎ダメージが威力保障以下かつ0以上の場合は威力保障発揮
        value = Math.min(ins,atk);
    }else if(a.isActor() && value < 0 && value + ins > 0){
        //基礎ダメージが0未満の場合は威力保障分を加算
        value = value + ins;
    }
    value = value*(35 * a.level /128 + 2);
    //アイテムの極意　薬の知識分はここでは対象外
    if(a.isActor() && a.hasSkill(308)){
        value = value*2;
    }
    if(!value){
        value = 1;
    }
    return Math.floor(value);
}

//special physical-attack magic-def basic damage
Game_Action.prototype.SPAMDBD = function(target,plusatk = 0) {
    const a = this.subject();
    const b = target;
    var atk = plusatk + a.atk;
    if(a.isDualWield()){
        atk = atk*2/3;
    }
    var def = b.mdf;
    var value = (atk - def)*(a.pow * a.level /128 + 2);

    //エクスカリパーの適用
    if(a.isActor()){
        const elements = [];
        for(weapon of this.subject().weapons()){
            for(trait of weapon.traits){
                if(trait.code == Game_BattlerBase.TRAIT_ATTACK_ELEMENT){
                    elements.push(trait.dataId);
                }
            }
        }
        value = this.applyExcalipoor(value,elements);
    }

    if(a.isReleasing()){ value *= 1.5 }; 
    return Math.floor(value);
}

//magic-attack physical-defence basic damage
Game_Action.prototype.MAPDBD = function(target,atk) {
    const a = this.subject();
    const b = target;
    const elements = this.getElements(this.item());
    var def = elements.includes(19) ? b.def : b.def/2;
    var value = (atk - def)*(a.mat * a.level /128 + 2);
    if(a.isReleasing()){ value *= 1.5 }; 
    if(!value){
        value = Math.floor(Math.random()*2);
    }
    return Math.floor(value);
}

Game_Battler.prototype.cheerable = function(){
    if(this.isEnemy()){
        return false;
    }
    if(this.hasSkill(312)){
        return true;
    }
    return false;
}

//summon physical-defence basic damage
Game_Action.prototype.SPDBD = function(target,atk) {
    const a = this.subject();
    const b = target;
    const elements = this.getElements(this.item());
    var def = elements.includes(19) ? b.def : b.def/2;
    var value = (atk - def)*((a.mat/4+50) * a.level / 128 + 2);
    if(a.cheerable()){
        value = value * 1.2;
    }
    if(!value){
        value = Math.floor(Math.random()*2);
    }
    return Math.floor(value);
}

//summon magic-defence basic damage
Game_Action.prototype.SMDBD = function(target,atk) {
    const a = this.subject();
    const b = target;
    const elements = this.getElements(this.item());
    var def = b.mdf;
    var value = (atk - def)*((a.mat/4+50) * a.level / 128 + 2);
    if(a.cheerable()){
        value = value * 1.2;
    }
    if(!value){
        value = Math.floor(Math.random()*2);
    }
    return Math.floor(value);
}

//particuler physical basic damage
Game_Action.prototype.PPBD = function(target,atk) {
    const a = this.subject();
    const b = target;
    const elements = this.getElements(this.item());
    var def = elements.includes(19) ? b.def : b.def/2;
    const rate = (a.pow * a.level /128 + 2)
    var value = (atk - def)* rate;
    if(a.isReleasing()){ value *= 1.5 };
    if(!value){
        value = 1;
    }
    return Math.floor(value);
}

//particuler physical-attack magic-defence damage
Game_Action.prototype.PPAMDBD = function(target,atk) {
    const a = this.subject();
    const b = target;
    var def = b.mdf;
    const rate = (a.pow * a.level /128 + 2)
    var value = (atk - def)* rate;
    if(a.isReleasing()){ value *= 1.5 };
    if(!value){
        value = 1;
    }
    return Math.floor(value);
}

Game_Action.prototype.SealdAttackDamage = function(target) {
    const a = this.subject();
    const b = target;
	const seald = a.equips()[1];
	if(!seald||!DataManager.isArmor(seald)){
		//盾を装備していない場合、皮の盾を装備しているものとして扱う
		return this.PPBD(b,a.sealdAtk());
	}else if(seald.id == 20){ //フォースシールドは魔法攻撃
		return this.PPAMDBD(b,a.sealdAtk());	 
	}else if(seald.id == 25){ //英雄の盾は魔法攻撃
		return this.PPAMDBD(b,a.sealdAtk());	 
	}
	return this.PPBD(b,a.sealdAtk());
}

Game_Action.prototype.GobrinPunchDamage = function(target) {
    const a = this.subject();
    const b = target;
    const atk = a.atk;
    const def = b.def;
    const rate = a.pow * a.level /128 + 2
    var value = (atk - def)* rate;
    if(a.level == b.level){
        value*=8
    }
    if(!value){
        value = 1;
    }
    return Math.floor(value);
}

Game_Battler.prototype.sealdAtk = function(){
	var atk = this.sealdEva();
	if(atk == 0){
		atk = 5;
	}
    atk = atk * 3
	console.log(atk);
	return atk;
}

//ミナフレアの威力計算に使う
Game_Action.prototype.minaAtk = function(a) {
    var atk = 0
    if(a.isEnemy()){
        for(member of $gameTroop.aliveMembers()){
            if(member.canMove() && member.enemyId() == 436){
                atk++;
            }
        }
    }else{
        for(member of $gameParty.aliveMembers()){
            if(member.canMove()){
                atk++;
            }
        }
    }
    return atk;
}

//weapon physical basic damage
//右手の武器タイプが一致の場合、その武器と同じダメージ計算をする
Game_Action.prototype.WPBD = function(target,plusAtk) {
    const a = this.subject();
    var value = 0;
    const weapon = a.weapons()[0];
    if(weapon){
        const wtypeEffects = this.item().meta['wTypeEffect'].split(',')
        if(wtypeEffects.includes(String(weapon.wtypeId))){
            value = this.evalDamageNormalAttack(target,0,false,plusAtk);
        }    //エクスカリパーの適用
        if(a.isActor()){
            const elements = [];
            for(trait of weapon.traits){
                if(trait.code == Game_BattlerBase.TRAIT_ATTACK_ELEMENT){
                    elements.push(trait.dataId);
                }
            }
            value = this.applyExcalipoor(value,elements);
        }
    }else{
        value = this.PPBD(target,a.cat+plusAtk);
    }
    if(a.isReleasing()){ value *= 1.5 }; 
    return Math.floor(value);
}

//particuler gunshot basic damage
Game_Action.prototype.PGBD = function(target,atk) {
    const a = this.subject();
    const b = target;
    const elements = this.getElements(this.item());
    var def = elements.includes(19) ? b.def : b.def/2;
    var value = (atk - def)*(50 * a.level /128 + 2);
    if(a.isActor()){
        value += a.licenseGunshotPlus();
    }
    if(!value){
        value = 1;
    }
    return Math.floor(value);
}

//particuler physical basic damage
/*Game_Action.prototype.configBD = function(target,atk) {
    const a = this.subject();
    const b = target;
    const elements = this.getElements(this.item());
    var def = elements.includes(19) ? b.def : b.def/2;
    var value = (atk - def)*(a.pow * a.level /128 + 2);
    console.log(a.name(),"PPBD damage:",value)
    if(!value){
        value = 1;
    }
    return Math.floor(value);
}*/

//特定の武器種を右手に装備していた場合その攻撃力を返す
//そうでない場合は標準攻撃力を返す
Game_Battler.prototype.wtypeAtk = function(wtypeId){
    const cat = this.cat;
    if(this.isEnemy()){
        return cat;
    }
    const weapon = this.weapons()[0];
    if(!weapon){
        return cat;
    }
    if(Array.isArray(wtypeId)){
        for(id of wtypeId){
            if(weapon.wtypeId == id){
                return cat > weapon.params[2] ? cat : weapon.params[2];
            }
        }
    }else{
        if(weapon.wtypeId == wtypeId){
            return cat > weapon.params[2] ? cat : weapon.params[2];
        }
    }
    return cat;
}

Game_Action.prototype.itemCri = function(target) {
    const cri = this.item().damage.critical ? this.subject().cri : 0;
    const plus = this.item().meta.critical ? Number(this.item().meta.critical) : 0;
    return cri+plus;
};

Game_Action.prototype.makeDamageValueSpecialAttack = function(target, critical) {
    const item = this.item();
    const baseValue = this.evalDamageFormula(target);
    let elements = this.getElements(item,true);
    let value = baseValue;
    if (!elements.includes(25) && item.damage.type == 1||item.damage.type == 5) {
        if(!item.meta.hissatsu&&value>1){
            const vrate = this.vitrate(target);
            value *= vrate;
        }
    }
    value = this.calcSpecialAttackElementRate(target,value);
    if (item.damage.elementId == 1) {
        if(target.isStateAffected(43)&&!item.meta.guardThrough){
            value *= target.protectRate();
        }
    }else if(!elements.includes(25)&& !item.meta.medicine) {
        if(target.isStateAffected(44)&&!item.meta.notShell){
            value *= target.shellRate();
        }
    }
    
    //薬の知識・アイテムの知識
    if(this.subject().isActor() && (this.subject().hasSkill(184) || this.subject().hasSkill(308)) && item.meta.medicine) {
        value = value*2
    }
    if(item.meta.potion){
        value -= this.subject().licensePotionPlus();
    }
    if (baseValue < 0) {
        value *= target.rec;
    }
    if (critical) {
        value = this.applyCritical(value);
    }
    value = this.applyChargeRate(value);
    if(value != 1){ //1ダメージは減らない
        value = this.applyHalfDamageToAll(value);
    }
    value = this.applyVariance(value, item.damage.variance);
    if(!item.meta.guardThrough){
        value = this.applyGuard(value, target);
    }
    value = this.applyAntiDamage(value,target);
    value = Math.floor(value);
    value = this.applyDamageAbsorb(value,target);
    //エクスカリパーの適用
    if(this.subject().isActor() && item.damage.formula.match(/a.atk/)){
        const elements = [];
        for(weapon of this.subject().weapons()){
            for(trait of weapon.traits){
                if(trait.code == Game_BattlerBase.TRAIT_ATTACK_ELEMENT){
                    elements.push(trait.dataId);
                }
            }
        }
        value = this.applyExcalipoor(value,elements);
    }
    return value;
};

Game_Action.prototype.applyDamageAbsorb = function(value,target){
    const item = this.item();
    //HP吸収
    if(item.damage.type == 5){
        value = value > target.hp ? target.hp : value;
    }
    //MP吸収
    if(item.damage.type == 6){
        value = value > target.mp ? target.mp : value;
    }
    //魔力吸収
    if(item.meta.limitmp){
        value = value > target.mp ? target.mp : value;
    }
    //与えたダメージがプラスで対象がゾンビの場合の反映
    if(item.damage.type == 5 && target.isStateAffected(36) && value > 0){
        value = value * -1;
    }
    return value;
}

//チャージレートの適用
Game_Action.prototype.applyChargeRate = function(value){
    const subject = this.subject();
    //アイテム・ダメージ固定・ためる対象外スキル・調合効果は対象外
    if(DataManager.isItem(this.item())||
        this.item().damage.elementId == 25||
        this.item().meta.nocharge||
        this.item().meta.chogo){
        return value;
    }
    //オーバードライブは対象外
    if(this.item().stypeId == 4){
        return value;
    }
    //ためる状態
    if(subject.isStateAffected(24)){
        value *= subject.chargeRate();
        subject.chargeResetFlagOn();
    }
    return value;
}

Game_Action.prototype.applyHalfDamageToAll = function(value){
    const item = this.item();
    if($gameParty.inBattle() && BattleManager._targets.length >= 2 && item.meta.canExpandScope){
        //敵側は固定倍率
        if(this.subject().isEnemy()){
            return value*2/3;
        }
        if(BattleManager._targets.length <= 4){
            return value/2;
        }
        return value/(BattleManager._targets.length/2);
    }
    return value;
}

Game_Action.prototype.applyAntiDamage = function(value,target){
    item = this.item();
    let poison = 0;
    let undead = 0;
    let zombie = 0;
    let stone = 0;
    if(item.meta.antipoison && target.elementRate(11) > 1){
        poison = Number(item.meta.antipoison)+target.valueAntiPoison();
    }
    if(item.meta.antistone && target.elementRate(12) > 1){
        stone = Number(item.meta.antistone)+target.valueAntiStone();
    }
    if(item.meta.antiundead && target.elementRate(22) > 1){
        undead = Number(item.meta.antiundead)+target.valueAntiUndead();
    }
    if(item.meta.antizombie && target.isStateAffected(36)){
        zombie = Number(item.meta.antizombie)+target.valueAntiZombie();
    }
    return value+poison+stone+undead+zombie;
}

Game_Actor.prototype.valueAntiPoison = function(){
    return 0;
}
Game_Actor.prototype.valueAntiStone = function(){
    return 0;
}
Game_Actor.prototype.valueAntiUndead = function(){
    return 0;
}
Game_Actor.prototype.valueAntiZombie = function(){
    return 0;
}

Game_Enemy.prototype.valueAntiPoison = function(){
    return Number(this.enemy().meta.antipoison);
}
Game_Enemy.prototype.valueAntiStone = function(){
    return Number(this.enemy().meta.antistone);
}
Game_Enemy.prototype.valueAntiUndead = function(){
    return Number(this.enemy().meta.antiundead);
}
Game_Enemy.prototype.valueAntiZombie = function(){
    return Number(this.enemy().meta.antizombie);
}

Game_Action.prototype.getElements = function(obj,handside){
    var elements = [];
    //通常攻撃系スキルの場合、武器の属性を取得
    //武器タイプの影響を受ける場合、タイプが一致した場合のみ取得
    if(obj.damage.elementId == -1||obj.meta.wTypeEffect){
        if(this.subject().isEnemy()){
            //敵の通常攻撃の属性仕様があるならここで代入
        }else{
            if(this.subject().weapons().length == 1 && (handside == 0 || handside == "both")){
                let weapon = this.subject().weapons()[0];
                for(trait of weapon.traits){
                    if(trait.code == Game_BattlerBase.TRAIT_ATTACK_ELEMENT){
                        elements.push(trait.dataId);
                    }
                }
                //トマホーク武器を投擲扱いした場合は対空属性・隊列無視属性を追加する
                if(this.subject().isEquipWtypeOk(8) && weapon.meta.tomahawk){
                    elements.push(18);
                    elements.push(26);
                }
                //棍武器かつ棍術の極意持ちの場合、隊列無視を追加
                if(this.subject().hasSkill(317)&&weapon.meta.stick){
                    elements.push(26);
                }
                //隊列無視アビリティ
                if(this.subject().hasSkill(315)){
                    elements.push(26);
                }
            }
            if(this.subject().weapons().length == 2 && (handside == 0 || handside == "both")){
                let weapon = this.subject().weapons()[0];
                for(trait of weapon.traits){
                    if(trait.code == Game_BattlerBase.TRAIT_ATTACK_ELEMENT){
                        elements.push(trait.dataId);
                    }
                }
                //トマホーク武器を投擲扱いした場合は対空属性を追加する
                if(this.subject().isEquipWtypeOk(8) && weapon.meta.tomahawk){
                    elements.push(18);
                    elements.push(26);
                }
                //棍武器かつ棍術の極意持ちの場合、隊列無視を追加
                if(this.subject().hasSkill(317)&&weapon.meta.stick){
                    elements.push(26);
                }
                //隊列無視アビリティ
                if(this.subject().hasSkill(315)){
                    elements.push(26);
                }
            }
            if(this.subject().weapons().length == 2 && (handside == 1 || handside == "both")){
                let weapon = this.subject().weapons()[1];
                for(trait of weapon.traits){
                    if(trait.code == Game_BattlerBase.TRAIT_ATTACK_ELEMENT){
                        elements.push(trait.dataId);
                    }
                }
                //トマホーク武器を投擲扱いした場合は対空属性を追加する
                if(this.subject().isEquipWtypeOk(8) && weapon.meta.tomahawk){
                    elements.push(18);
                    elements.push(26);
                }
                //棍武器かつ棍術の極意持ちの場合、隊列無視を追加
                if(this.subject().hasSkill(317)&&weapon.meta.stick){
                    elements.push(26);
                }
                //隊列無視アビリティ
                if(this.subject().hasSkill(315)){
                    elements.push(26);
                }
            }
            if(obj.meta.wTypeEffect){
                let weapon = this.subject().weapons()[0];
                
                const wtypeEffects = this.item().meta['wTypeEffect'].split(',')
                if(weapon && Number(wtypeEffects.includes(weapon.wtypeId))){
                    for(trait of weapon.traits){
                        if(trait.code == Game_BattlerBase.TRAIT_ATTACK_ELEMENT){
                            elements.push(trait.dataId);
                        }
                    }
                    //トマホーク武器を投擲扱いした場合は対空属性を追加する
                    if(this.subject().isEquipWtypeOk(8) && weapon.meta.tomahawk){
                        elements.push(18);
                        elements.push(26);
                    }
                    //棍武器かつ棍術の極意持ちの場合、隊列無視を追加
                    if(this.subject().hasSkill(317)&&weapon.meta.stick){
                        elements.push(26);
                    }
                    //隊列無視アビリティ
                    if(this.subject().hasSkill(315)){
                        elements.push(26);
                    }
                }
            }
            //貫通
            if(!elements.includes(19)&&this.subject().hasSkill(307)){
                elements.push(19);
            }
        }
        //魔法剣の属性を追加
        if(this.subject().magicSwordElement()){
            const element = this.subject().magicSwordElement();
            if(!elements.includes(element)){
                elements.push(element);
            }
        }
    }
    if(this.item().damage.elementId > 0||this.item().damage.elementId == -1){
        if(this.item().damage.elementId > 0){
            elements.push(this.item().damage.elementId);
        }
        if(this.item().meta['addElements']){
            const addElements = this.item().meta['addElements'].split(',');
            for(element of addElements){
                elements.push(Number(element));
            }
        }
    }
	
    if(this.item().meta.sealdAttack){
		for(elementId of this.subject().sealdElements()){
			if(!elements.includes(elementId)){
				elements.push(elementId);
			}
		}
    }
    return elements;
}

//属性計算は大きく変更
//自然系属性(火氷雷)などと種族特攻などその他の属性を分けて処理する
Game_Action.prototype.calcSpecialAttackElementRate = function(target,baseValue) {
    //スキルの属性を代入
    let elements;
    if(DataManager.isSkill(this.item())&&this.item().meta.throw){
       elements = this.subject().thelm();
    }else{
       elements = this.getElements(this.item());   
    }
    let natureElements = elements.filter(id => id >= 2 && id <= 10);
    let baseValue2 = baseValue;
    var value = baseValue;
    if(natureElements.length > 0){
        value = 0;
        baseValue2 = baseValue/natureElements.length;
    }
    if(elements.length > 0){
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
            //神罰適用
            console.log(this.subject().isActor())
            if(element == 8 && this.subject().isActor() && this.subject().hasSkill(183)){
               eValue *= 1.5;
            }
            value += eValue;
        }
        let speciesRates = elements.filter(id => id > 10);
        for(rate of speciesRates){
            console.log(target.name(),target.elementRate(rate),target.traitsWithId(Game_BattlerBase.TRAIT_ELEMENT_RATE, rate))
            value = value * target.elementRate(rate);
        }
    }
    //対象がゾンビ状態、属性に回復を含む、値が回復、ＭＰ回復以外の場合はダメージを反転
    if(target.isStateAffected(36) && elements.includes(21) && value < 0 && !(this.item()&&(this.item().damage.type == 4||this.item().damage.type == 6))){
        value = -value;
    };
    //対象が石化状態の場合、すべてのダメージを０にする
    if(target.isStateAffected(11)){
        value = 0;
    };
    return Math.floor(value);
};