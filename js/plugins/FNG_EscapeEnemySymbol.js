/*:ja
 * @target MV MZ
 * @plugindesc v1.00 てきよけを実装する。
 * @author finga
 * @url 
 *
 * @help NRP_StopSelfMovement.jsより上に配置すること
 * 
 */

Game_Event.prototype.moveTypeTowardPlayer = function() {
    if (this.isNearThePlayer()) {
        switch (Math.randomInt(6)) {
            case 0:
            case 1:
            case 2:
            case 3:
				if($gameParty.tekiyoke()){
                	this.moveAwayFromPlayer();					
				}else{
                	this.moveTowardPlayer();
				}
                break;
            case 4:
                this.moveRandom();
                break;
            case 5:
                this.moveForward();
                break;
        }
    } else {
        this.moveRandom();
    }
};

Game_Party.prototype.tekiyoke = function(){
    //テレポ禁止時は敵除け無効
    if($gameSwitches.value(17)){
        return false;
    }
    for(actor of this.aliveMembers()){
        if(actor.hasSkill(224)){
            return true;
        }
    }
    return false;
}
