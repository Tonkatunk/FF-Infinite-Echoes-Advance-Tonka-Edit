//=============================================================================
// FNG_persuit.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc 武器に追撃効果を設定します
  * @author finga
  * @help 武器に追撃効果を設定します
*/

//敵の場合追撃はなし
Game_Enemy.prototype.persuits = function(){
    return [];
}

//
Game_Actor.prototype.persuits = function(){
    if(!this._persuits){
        this._persuits = [];
    }
    return this._persuits;
}

Game_Actor.prototype.initPersuits = function(){
    this.clearPersuits();
    var persuits = [];
    for(weapon of this.weapons()){
        if($dataWeapons[weapon.id].meta['persuit']){
            const skillId = $dataWeapons[weapon.id].meta['persuit'].split(',')[0];
            const rate = $dataWeapons[weapon.id].meta['persuit'].split(',')[1];
            persuits.push([skillId,rate]);
        }
    }
    for(persuit of persuits){
        if(persuit[1] > Math.random()*100){       
            this._persuits.push(persuit[0]);
        }
    }
    if(this.isStateAffected(26)){
        if($dataSkills[this.magicSwordId()].meta.msPersuit){
            this._persuits.push($dataSkills[this.magicSwordId()].meta.msPersuit);
        };
    }
}

Game_Actor.prototype.initPersuitsByThrow = function(){
    this.clearPersuits();
    const weapon = this.throwWeapon();
    var persuits = [];
    if($dataWeapons[weapon.id].meta['persuit']){
        const skillId = $dataWeapons[weapon.id].meta['persuit'].split(',')[0];
        const rate = 100;
        persuits.push([skillId,rate]);
        this._persuits.push(persuits[0][0]);
    }
}

Game_Actor.prototype.clearPersuits = function(){
    this._persuits = [];
}