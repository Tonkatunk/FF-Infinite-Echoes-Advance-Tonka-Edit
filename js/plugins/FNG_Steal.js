//=============================================================================
// FNG_Steal.js
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 敵からアイテムを盗めるようにします
 * @author finga
 * @url
 *
 * @help 敵からアイテムを盗めるようにします
 * 
 * ・スキルメモ欄に<steal>と記載すると、行動後に対象からアイテムを盗めるようになります
 * ・盗めるアイテムは敵キャラのメモ欄に<steal:100,"I1","W78">の用に記載
 * 　それぞれ確率、アイテムタイプ(I:アイテム、W:武器、A:防具)
 */

const _game_Enemy_setup2 = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function() {
    _game_Enemy_setup2.apply(this,arguments);
    this.initSteal();
};

const _battleManager_initMembers3 = BattleManager.initMembers;
BattleManager.initMembers = function() {
    _battleManager_initMembers3.apply(this,arguments);
    this._stealedItems = [];
};

Game_Enemy.prototype.initSteal = function() {
    this._stolen = false; //盗まれたかどうかのフラグ
    this._stealRate = 0; //盗める確率
    this._stealItems = []; //盗めるアイテム
    const meta = this.enemy().meta.steal;
    const itemtext = [];
    if(!meta){
        this._stealItems = [null];
    }
    for(const text of meta.split(',')){
        itemtext.push(text);
    }
    if(itemtext.length > 0){
        this._stealRate = itemtext[0];
       for(let i=1;i<itemtext.length;i++){
           const type = itemtext[i].substr(0,1);
           const id = Number(itemtext[i].substr(1,itemtext[i].length-1));
           this._stealItems.push(this.setStealItem(type,id));
        }
    }
};

Game_Enemy.prototype.stealRate = function() {
    var stealRate = 0; //盗める確率
    const meta = this.enemy().meta.steal;
    const itemtext = [];
    for(const text of meta.split(',')){
        itemtext.push(text);
    }
    if(itemtext.length > 0){
        stealRate = itemtext[0];
    }
    return Number(stealRate)*0.01;
};

Game_Enemy.prototype.setStealItem = function(type,id) {
    switch(type){
        case "I":
            return $dataItems[id];
        case "W":
            return $dataWeapons[id];
        case "A":
            return $dataArmors[id];
    }
};

Game_Action.prototype.isStealAction = function() {
    return this.item().meta['steal'];
};

//endactionから呼ばれる
BattleManager.applySteal = function(target) {
    if(target.isActor() || !this._action.isStealAction() ){
        if(this._action.item().damage.elementId == -1 && this._subject.isStealWeaponEquipped()){
            const rate = 0.5
            if(Math.random()>rate){
                return;
            }
        }else{
            //console.log("return");
            return;
        }
    }
    console.log("applysteal2",this._subject.isStealWeaponEquipped())
    if(this._action.item().damage.elementId == -1 && !this._subject.isStealWeaponEquipped() &&
      !this._action.item().meta.steal){
        return;
    }
    console.log("applysteal3")
    //console.log("target.applySteal");
    target.applySteal(this._subject);
}

Game_Battler.prototype.isStealWeaponEquipped = function() {
    if(this.isEnemy()){
        return false;
    }
    if(this.weapons()){
        for(weapon of this.weapons()){
            if(weapon.meta.steal){
                return true;
            }
        }
    }
    return false;
}

BattleManager.getStealItem = function(item) {
    BattleManager.pushActiveMessage(item.name + " Stolen!");
    $gameParty.gainItem(item, 1);
    $gameParty.stealCountPlus();
    this._stealedItems.push(item);
    this.addWaitCount(20);
}

Game_Battler.prototype.applySteal = function(subject) {
    const rand = Math.random() * 99;
    const rare = Math.floor(Math.random() * 8) == 0 || subject.hasSkill(324);
    var rate = this._stealRate;
    //レアハント時は入手率半減
    if(subject.hasSkill(324)){
        rate /= 2;
    }
    if(subject.hasSkill(182)){ //盗みの極意
        rate += Math.min(rate,25);
    }
    if(this._stolen || this._stealItems.length == 0){
        BattleManager.pushActiveMessage("No items!");
        BattleManager.addWaitCount(20);
        return;
    }
    var getItem = null;
    if(!rare || this._stealItems.length == 1){
        getItem = this._stealItems[0];
    }else{
        getItem = this._stealItems[1];
    }
    if(rate > rand){
        this._stolen = true;
        BattleManager.getStealItem(getItem);
    }else{
        BattleManager.pushActiveMessage("Failed!");
        BattleManager.addWaitCount(20);
        return;        
    }
};

Game_Battler.prototype.stealItem = function(index){
    const stealItems = this._stealItems;
    if(!stealItems || stealItems.length<index+1){
        return null;
    }
    return stealItems[index];
}

Game_Party.prototype.loseStealedItems = function(items){
    for(item of items){
        this.loseItem(item,1,true);
    }
}

Game_Party.prototype.stealCount = function(){
    if(!this._stealCount){
        this._stealCount = 0;
    }
    return this._stealCount;
}

Game_Party.prototype.stealCountPlus = function(){
    if(!this._stealCount){
        this._stealCount = 0;
    }
    this._stealCount++;
}

BattleManager.thieveryAtk = function(){
    console.log($gameParty.stealCount())
    var attack = Math.floor($gameParty.stealCount()/3);
    return attack > 140 ? 140 : attack;
}