//=============================================================================
// FNG_Tomahawk.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc トマホーク・フランシスカを実装する
  * @author finga
  * @help トマホーク・フランシスカを実装する
*/

const _Game_BattlerBase_canEquipWeapon = Game_BattlerBase.prototype.canEquipWeapon;
Game_BattlerBase.prototype.canEquipWeapon = function(item) {
    //投擲斧であれば、投擲(タイプ8)が装備可能であっても装備可能
    if(item.meta.tomahawk){
        return this.isEquipWtypeOk(8) &&
        !this.isEquipTypeSealed(8)||(this.isEquipWtypeOk(item.wtypeId) && !this.isEquipTypeSealed(item.etypeId))
    }
    
    //やりそうび
    if(item.wtypeId == 11||item.wtypeId == 12){
        if(this.isActor()){            
            for(skill of this.jobSkills()){
                if(skill.id == 221){
                   return true;
                }
            }
        }
    }
    return _Game_BattlerBase_canEquipWeapon.apply(this,arguments);
};