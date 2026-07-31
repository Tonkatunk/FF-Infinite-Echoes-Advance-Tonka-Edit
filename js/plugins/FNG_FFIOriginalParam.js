Game_Actor.prototype.paramBase = function(paramId) {
    switch (paramId) {
            
        case 0:
            var value = this.currentClass().params[paramId][this._level];
            value += this.licenseParamPlus("mhp");
            return Math.min(value,9999);
            break;
            
        case 1:
            var value = this.currentClass().params[paramId][this._level];
            value += this.licenseParamPlus("mmp");
            return Math.min(value,999);
            break;
            
        case 3:
            return 0;
            break;
        case 4:
            var value = this.currentClass().params[paramId][this._level];
            if(this.hasSkill(299)&&this.isStateAffected(28)){
                value = Math.max(value,55);
            }
            value += this.licenseParamPlus("mat");
            var minimum = this.guarantParam(1);
            return Math.max(value,minimum);
            break;
        case 5:
            return 0;
            break;
        case 6:
            var value = this.currentClass().params[paramId][this._level];
            value += this.licenseParamPlus("agi");
            var minimum = this.guarantParam(3);
            return Math.max(value,minimum);
            break;
    }
    return this.currentClass().params[paramId][this._level];
};

Game_Actor.prototype.ffparamBase = function(paramId) {
    if (paramId == 0 || paramId == 1){ //攻撃力1 or 2
        //素の攻撃力は0とする。
        return 0;
    }
    if (paramId == 2){ //ちから
        //装備の影響のないデフォでのちからを返す
        var value = this.currentClass().params[2][this._level];
        value += this.licenseParamPlus("pow");
        var minimum = this.guarantParam(0);
        return Math.max(value,minimum);
    }
    if (paramId == 3){ //たいりょく
        //装備の影響のないデフォでのたいりょくを返す
        var value = this.currentClass().params[3][this._level];
        value += this.licenseParamPlus("vit");
        var minimum = this.guarantParam(2);
        return Math.max(value,minimum);
    }
};

Game_Actor.prototype.param = function(paramId) {
    var value =
        this.paramBasePlus(paramId) *
        this.paramRate(paramId) *
        this.paramBuffRate(paramId);
    if(paramId == 2){ // 攻撃力
       value += $gameParty.danceSingParamChanges()[0];
    }
    if(paramId == 3){ // 防御力
       value += $gameParty.danceSingParamChanges()[2];
    }
    if(paramId == 5){ // 魔法防御力
       value += $gameParty.danceSingParamChanges()[2];
    }
    if(paramId == 4){ // 魔力
       value += $gameParty.danceSingParamChanges()[1];
    }
    if(paramId == 6){ // すばやさ
       value += $gameParty.danceSingParamChanges()[3];
    }
    if(paramId == 2){
        value = (this.ffparam(0) + this.ffparam(1)) *
        this.paramRate(paramId) *
        this.paramBuffRate(paramId);
    }
    const maxValue = this.paramMax(paramId);
    const minValue = this.paramMin(paramId);
    return Math.round(value.clamp(minValue, maxValue));
};

Game_Enemy.prototype.param = function(paramId) {
    var value =
        this.paramBasePlus(paramId) *
        this.paramRate(paramId) *
        this.paramBuffRate(paramId);
    if(paramId == 2){ // 攻撃力
       value += $gameTroop.danceSingParamChanges()[0];
        //console.log(this.name(),$gameTroop.danceSingParamChanges());
    }
    if(paramId == 3){ // 防御力
       value += $gameTroop.danceSingParamChanges()[2];
    }
    if(paramId == 5){ // 魔法防御力
       value += $gameTroop.danceSingParamChanges()[2];
    }
    if(paramId == 4){ // 魔力
       value += $gameTroop.danceSingParamChanges()[1];
    }
    if(paramId == 6){ // すばやさ
       value += $gameTroop.danceSingParamChanges()[3];
    }
    const maxValue = this.paramMax(paramId);
    const minValue = this.paramMin(paramId);
    return Math.round(value.clamp(minValue, maxValue));
};

Game_Actor.prototype.ffparamPlus = function(paramId) {
    let value = 0;
    //武器2本目が来た場合、攻撃力２へ加算するためのフラグ
    var atk2 = false;
    const twoHandedWeaponTypes = [1,2,3,6,11,12,14,15,16,17,20];
    for (const item of this.equips()) {
        if (item) {
            //武器での攻撃力の加算は攻撃力へ、防具での攻撃力加算はちからへ
            //運は体力へ加算する
            if(DataManager.isWeapon(item)){
                // 攻撃力１
                if(paramId == 0 && atk2 == false){
                    value += item.params[2];
                    if(item.meta.paladin||item.meta.sonion){
                        value += this.centerAtk(this.level);
                     }
                    if(item.meta.chicken){
                       value += $gameSystem.escapeCount()/7 > 100 ? 100 : Math.floor($gameSystem.escapeCount()/7);
                       //value+=15;
                    }
                    if(item.meta.brave){
                       value += $gameSystem.winCount()/6 > 100 ? 100 : Math.floor($gameSystem.winCount()/6);
                    }
                    if(this.hasSkill(317)&&item.meta.stick){
                        value *= 1.5;
                    }
                    if(this.hasSkill(313)&&twoHandedWeaponTypes.includes(item.wtypeId)){
                        value *= 1.5;                        
                    }
                    if(item.meta.atkupbyhp){ //アルテマウェポン
                       value += Math.floor(30*(this.hp/this.mhp));
                    }
                    value += this.licenseWeaponPlus(item.wtypeId);
                    value += this.magicSwordAtk() + Math.floor(this.level/3); 
                    value *= this.magicSwordAtkRate();
                    atk2 = true;
                }
                // 攻撃力２
                if(paramId == 1 && atk2 == false){
                    atk2 = true;
                }else if(paramId == 1 && atk2){
                    value += item.params[2] + this.magicSwordAtk() + Math.floor(this.level/3);
                    if(item.meta.paladin||item.meta.sonion){
                        value += this.centerAtk(this.level);
                     }
                    if(item.meta.chicken){
                       value += $gameSystem.escapeCount()/10 > 120 ? 120 : Math.floor($gameSystem.escapeCount()/10);
                       value+=15;
                    }
                    if(item.meta.brave){
                       value += $gameSystem.winCount()/5 > 120 ? 120 : Math.floor($gameSystem.winCount()/5);
                    }
                    value *= this.magicSwordAtkRate();
                }
            }else{
                // ちから
                if(paramId == 2){
                    value += item.params[2];
                }            
            }
            // 体力
            if(paramId == 3){
                value += item.params[7];
            }     
        }
    }
    return Math.floor(value);
};

Game_Actor.prototype.ffparam = function(paramId) {
    var value = 0;
    if(this.monkStyle()){
        if(paramId == 0 || paramId == 1){
            var weapon = this.weapons()[paramId]
            if(weapon == null || weapon.wtypeId == 13 ){
                return this.monkParam(paramId) * this.paramRate(2);
            }
        }
    }
    value = this.ffparamBase(paramId)+this.ffparamPlus(paramId);
    if(paramId == 0 || paramId == 1){
        //攻撃力のパラメータレートの反映
        value *= this.paramRate(2);
    }
    if(paramId == 2){ // 力
       value += $gameParty.danceSingParamChanges()[0];
    }
    if(paramId == 3){ // 体力
       value += $gameParty.danceSingParamChanges()[2];
    }
    value = Math.max(0,value);
    console.log(value,paramId)
    return value;
};

Game_Enemy.prototype.ffparam = function(paramId) {
    var value = 0;
    if (paramId == 0 || paramId == 1){ //攻撃力1 or 2
        return this.atk;
    }
    if (paramId == 2){ //ちから
        if($dataEnemies[this.enemyId()].meta.pow > 0){
            value = Number($dataEnemies[this.enemyId()].meta.pow);
        }else{
            value = 30;
        }
        return value;
    }
    if (paramId == 3){ //たいりょく
        if($dataEnemies[this.enemyId()].meta.vit > 0){
            value = Number($dataEnemies[this.enemyId()].meta.vit);
        }else{
            value = 20;
        }
        return value;
    }
    if(paramId == 2){ // 力
       value += $gameTroop.danceSingParamChanges()[0];
    }
    if(paramId == 3){ // 体力
       value += $gameTroop.danceSingParamChanges()[2];
    }
    return value;
};

Game_Actor.prototype.monkParam = function(paramId){
        //格闘アビリティ持ちで、素手の場合
        if(this.weapons().length == 0){
            if (paramId == 0){ //攻撃力1
                //格闘アビリティ所持で素手の場合の攻撃力
                return this.cat + this.licenseWeaponPlus(0);
            }
            //攻撃力2
            if (paramId == 1 && !this.isEquippedShield()){ //盾を装備していない
                //格闘アビリティ所持で素手の場合の攻撃力
                return this.cat + this.licenseWeaponPlus(0);
            }else{
                return 0;
            }
        //武器を１つ装備している場合
        }else if(this.weapons().length == 1){
            if (paramId == 0){ //攻撃力1
                //装備が爪
                if(this.weapons()[0].wtypeId == 13){
                    //格闘アビリティ所持で素手の場合の攻撃力+爪の攻撃力
                    return this.cat + this.weapons()[0].params[2] + this.licenseWeaponPlus(13);
                }else{
                    return this.weapons()[0].params[2]+Math.floor(this.level/3);
                }
            }
            //攻撃力2
            if (paramId == 1 && !this.isEquippedShield()){ //盾を装備していない
                //格闘アビリティ所持で素手の場合の攻撃力
                return this.cat + this.licenseWeaponPlus(0);
            }else{
                return 0;
            }
        //武器を２つ装備している場合
        }else if(this.weapons().length == 2){
            if (paramId == 0){ //攻撃力1
                //装備が爪
                if(this.weapons()[0].wtypeId == 13){
                    //格闘アビリティ所持で素手の場合の攻撃力+爪の攻撃力
                    return this.cat + this.weapons()[0].params[2] + this.licenseWeaponPlus(13);
                }else{
                    return this.weapons()[0].params[2]+Math.floor(this.level/3);
                }
            }
            if (paramId == 1){ //攻撃力2
                //装備が爪
                if(this.weapons()[1].wtypeId == 13){
                    //格闘アビリティ所持で素手の場合の攻撃力+爪の攻撃力
                    return this.cat + this.weapons()[1].params[2] + this.licenseWeaponPlus(13);
                }else{
                    return this.weapons()[1].params[2]+Math.floor(this.level/3);
                }
            }
        }
};

Game_Actor.prototype.monkAtk = function(){
    var atk1 = this.cat;
    var atk2 = this.cat;

    //武器を１つ装備している場合
    if(this.weapons()&&this.weapons()[0]){
        //装備が爪
        if(this.weapons()[0].wtypeId == 13){
            atk1 += this.weapons()[0].params[2]+ this.licenseWeaponPlus(13);
        }
        if(this.hasSkill(206)){
            atk1 + 15
        }
    }
    if(this.weapons()&&this.weapons()[1]){
        if(this.weapons()[1].wtypeId == 13){
            atk2 += + this.weapons()[1].params[2]+ this.licenseWeaponPlus(13);
        }
        if(this.hasSkill(206)){
            atk1 + 15
        }
    }
    return Math.floor((atk1+atk2)*0.5);
};

Game_Enemy.prototype.monkAtk = function(){
    return this.atk;
};

Game_Actor.prototype.isEquippedShield = function(){
    for(armor of this.armors()){
        if(armor.etypeId == 2){
            return true;
        }
    }
    return false;
};

Game_Actor.prototype.xparam = function(xparamId) {
    value = 0
    if(xparamId == 0){
        //命中の場合の計算式の変更
        value = this.hitRate();
    }else if(xparamId == 1){
        value = this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);
        value += this.licenseParamPlus("eva")*0.01;
        if(this.isEquippedShield()){
            value += this.licenseShieldPlus();
        }
        value = Math.min(value,1);
    }else{
        value = this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);        
    }
    return value;
};

Game_Actor.prototype.hitRate = function() {
    //右手・左手の命中率で低い方を返す
    return Math.min(this.hitRate1(),this.hitRate2());
};

//利き手の命中率
Game_Actor.prototype.hitRate1 = function(){
    var weapon = null;
    var value = 1;
    if(this.weapons().length >= 1 && this.equips()[0] != null){
        weapon = this.weapons()[0];
        value =  DataManager.itemxparamSum(weapon, 0);
        if(value == 0){
          value = 1;
        }
        //装備武器が爪、かつ格闘アビリティ所持は命中率100%
        if(weapon.wtypeId == 13 && this.monkStyle()){
            value = 1; 
        }
    }else if(this.monkStyle()){
        value =  1;
    }else{
        value =  0.8;            
    }
    // 必中持ちなら    
    if(this.isSniper()){
        value = 1;
    }
    value = value * this.traitsSum(Game_BattlerBase.TRAIT_XPARAM,0);
    return value;
}

//もう一方の手の命中率
Game_Actor.prototype.hitRate2 = function(){
    var weapon = null;
    var value = 1;
    // 二刀流なら
    if(this.isDualWield()){
        if(this.weapons().length >= 2){
            weapon = this.weapons()[1];
            value =  DataManager.itemxparamSum(weapon, 0);
            if(value == 0){
              value = 1;
            }
            //装備武器が爪、かつ格闘アビリティ所持は命中率100%
            if(weapon.wtypeId == 13 && this.monkStyle()){
                value = 1; 
            }
        }else if(this.monkStyle()){
            value =  1;
        }else{
            value =  0.8;            
        }
    }
    // 必中持ちなら
    if(this.isSniper()){
        return 1;
    }
    value = value * this.traitsSum(Game_BattlerBase.TRAIT_XPARAM,0);
    return value;
}

Game_Actor.prototype.monkStyle = function(){
    return this.hasSkill(320); // 格闘アビリティを持っているか
};

Game_Actor.prototype.isWeaponMaster = function(){
    return this.hasSkill(321); // 勲章アビリティを持っているか
};

Game_Actor.prototype.isEquipWtypeOk = function(wtypeId) {
    // 勲章アビリティをセットなら全てtrue
    if(this.isWeaponMaster()){
        return true;
    }
    //元からのモンクタイプでなく、格闘アビリティを所有している場合は爪以外は装備できない
    if(!this.isMonk()&&this.monkStyle()){
        return wtypeId == 13;        
    }
    //ライセンスによる武器の装備タイプ
    if(this.licenseWtypeIds().includes(wtypeId)){
        return true;
    }
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_WTYPE).includes(wtypeId);
};

Game_BattlerBase.prototype.isEquipAtypeOk = function(atypeId) {
    //ライセンスによる防具の装備タイプ
    if(this.licenseAtypeIds().includes(atypeId)){
        return true;
    }
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_ATYPE).includes(atypeId);
};

Game_Actor.prototype.isMonk = function() {
    const item = $dataActors[this.actorId()];
    if(item.meta.monk){
        return true;
    }
    return false;
};

//中央攻撃力
Game_BattlerBase.prototype.centerAtk = function(level) {
    const cats = [10,11,12,13,14,15,16,17,18,19, // 1~10
                  20,21,22,23,24,26,27,28,29,30, // 11~20
                  32,33,34,35,36,38,39,40,41,42, // 21~30
                  44,45,46,47,49,50,51,52,54,55, // 31~40
                  56,57,59,60,61,62,64,65,66,67, // 41~50
                  69,70,71,73,74,75,77,78,79,81, //51~60
                  82,83,85,86,88,89,90,91,93,94, //61~70
                  96,97,99,100,102,103,105,106,108,109, // 71~80
                  111,112,114,115,117,119,120,122,124,125, // 81~90
                  127,129,131,132,134,136,138,140,142]; //91~99
    if(level > 99){
        return cats[98];
    }else{
        return cats[level-1];
    }
};


Object.defineProperties(Game_BattlerBase.prototype, {
    // power
    pow: {
        get: function() {
            return this.ffparam(2);
        },
        configurable: true
    },
    vit: {
        get: function() {
            return this.ffparam(3);
        },
        configurable: true
    },
    //中央攻撃力
    cat: {
        get: function() {
            return this.centerAtk(this.level);
        },
        configurable: true
    },
});

Object.defineProperties(Game_Enemy.prototype, {
    level: {
        get: function() {
            var value = 1;
            if($dataEnemies[this.enemyId()].meta.lv){
                value = Number($dataEnemies[this.enemyId()].meta.lv);
            }
            return value;
        },
        configurable: true
    },
    // ATtacK power
    atk: {
        get: function() {
            return this.param(2)+this.magicSwordAtk();
        },
        configurable: true
    },
});