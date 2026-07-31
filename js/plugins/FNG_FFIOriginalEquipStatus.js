//必中アビリティ持ちかどうか
Game_Actor.prototype.isSniper = function() {
    return this.hasSkill(322);
};

//必中アビリティ持ちかどうか
Game_Enemy.prototype.isSniper = function() {
    return false;
};

//装備品による最低保証パラメータを返す
Game_Actor.prototype.guarantParam = function(id) {
    if(id == 0){ //ちから
        for(equip of this.armors()){
            if(equip.meta.guarantPow){
                return Number(equip.meta.guarantPow);
            }
        }
    }else if(id == 1){ //魔力
        for(equip of this.armors()){
            if(equip.meta.guarantMat){
                return Number(equip.meta.guarantMat);
            }
        }
    }else if(id == 2){ //体力
        for(equip of this.armors()){
            if(equip.meta.guarantVit){
                return Number(equip.meta.guarantVit);
            }
        }
    }else if(id == 3){ //すばやさ
        for(equip of this.armors()){
            if(equip.meta.guarantAgi){
                return Number(equip.meta.guarantAgi);
            }
        }
    }
    return 0;
};

//魔力依存武器持ちかどうか
Game_Actor.prototype.hasMagicWeapon = function(handside) {
    var weapons = this.weapons();
    var i = 0;
    for(weapon of weapons){
        if(handside == i && weapon.meta.mat){
            return true;
        }
        i++;
    }
    return false;
};

Game_Enemy.prototype.hasMagicWeapon = function() {
    return false;
};

//銃持ちかどうか
Game_Actor.prototype.hasGun = function(handside) {
    var weapons = this.weapons();
    var i = 0;
    for(weapon of weapons){
        if(handside == i && weapon.wtypeId == 22){
            return true;
        }
        i++;
    }
    return false;
};

//魔法防御依存持ちかどうか
Game_Actor.prototype.hasMagicDefWeapon = function(handside) {
    var weapons = this.weapons();
    var i = 0;
    for(weapon of weapons){
        if(handside == i && weapon.meta.mdf){
            return true;
        }
        i++;
    }
    return false;
};

//防御力無視武器持ちかどうか
Game_Actor.prototype.hasDef0Weapon = function(handside) {
    var weapons = this.weapons();
    var i = 0;
    for(weapon of weapons){
        if(handside == i && weapon.meta.def0){
            return true;
        }
        i++;
    }
    return false;
};

//防御力無視武器持ちかどうか
Game_Enemy.prototype.hasDef0Weapon = function(handside) {
    return false;
};

Game_Enemy.prototype.hasGun = function() {
    return false;
};

//貫通武器持ちかどうか
Game_Actor.prototype.hasPierceWeapon = function(handside) {
    if(this.hasSkill(307)){ //貫通アビリティを持つ場合true
        return true;
    }
    var weapons = this.weapons();
    var i = 0;
    for(weapon of weapons){
        var elements = [];
        for(trait of weapon.traits){
            if(trait.code == Game_BattlerBase.TRAIT_ATTACK_ELEMENT){
                elements.push(trait.dataId);
            }
        }
        if(handside == i && elements.includes(19)){
            return true;
        }
        i++;
    }
    return false;
};
Game_Enemy.prototype.hasPierceWeapon = function(handside) {
    return false;
};

//エクスカリパー？
Game_Actor.prototype.hasExcalipoor = function(handside) {
    var weapons = this.weapons();
    var i = 0;
    for(weapon of weapons){
        var elements = [];
        for(trait of weapon.traits){
            if(trait.code == Game_BattlerBase.TRAIT_ATTACK_ELEMENT){
                elements.push(trait.dataId);
            }
        }
        if(handside == i && elements.includes(20)){
            return true;
        }
        i++;
    }
    return false;
};
Game_Enemy.prototype.hasExcalipoor = function() {
    return false;
};

//いやしの
Game_Actor.prototype.hasCureWeapon = function(handside) {
    var weapons = this.weapons();
    var i = 0;
    for(weapon of weapons){
        var elements = [];
        for(trait of weapon.traits){
            if(trait.code == Game_BattlerBase.TRAIT_ATTACK_ELEMENT){
                elements.push(trait.dataId);
            }
        }
        if(handside == i && elements.includes(21)){
            return true;
        }
        i++;
    }
    return false;
};
Game_Enemy.prototype.hasCureWeapon = function() {
    return false;
};

//ジャンプ対応武器か
Game_Actor.prototype.hasJumpWeapon = function(handside) {
    var weapons = this.weapons();
    var i = 0;
    for(weapon of weapons){
        console.log(weapon)
        if(weapon.wtypeId == 11||weapon.wtypeId == 12){
            return true;
        }
    }
    return false;
};
Game_Enemy.prototype.hasJumpWeapon = function() {
    return false;
};

//武器の消費MP
Game_Actor.prototype.weaponCost = function(handside) {
    var weapons = this.weapons();
    var i = 0;
    for(weapon of weapons){
        if(handside == i && weapon.meta.mpcost){
            if(weapon.meta.mpcost > 0){
                return weapon.meta.mpcost;
            }
        }
        i++;
    }
    return false;
};

Game_Actor.prototype.twoHanded = function() {
    if(this.hasSkill(313)&&this.equips()[1]!=null){
       return false;
    }
};

Game_Enemy.prototype.weaponCost = function() {
    return 0;
};