//=============================================================================
// FNG_DanceAndSing.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc 踊ると歌うを実装します
  * @author finga
  * @help 踊ると歌うを実装します
*/

//いやしのうたが有効か
Game_Unit.prototype.isSingingCureSong = function(){
    for(member of this.aliveMembers()){
        if(member.isStateAffected(59)&&member.danceSingId()){
            if(member.danceSingId() == 853){
                return true;
            }
        }
    }
    return false;
}

//こもりうたが有効か
Game_Unit.prototype.isSingingLullaby = function(){
    for(member of this.aliveMembers()){
        if(member.isStateAffected(59)&&member.danceSingId()){
            if(member.danceSingId() == 854){
                return true;
            }
        }
    }
    return false;
}

//ゆうわくのうたが有効か
Game_Unit.prototype.isSingingTempt = function(){
    for(member of this.aliveMembers()){
        if(member.isStateAffected(59)&&member.danceSingId()){
            if(member.danceSingId() == 852){
                return true;
            }
        }
    }
    return false;
}

//あいのうたが有効か
Game_Unit.prototype.isSingingLove = function(){
    for(member of this.aliveMembers()){
        if(member.isStateAffected(59)&&member.danceSingId()){
            if(member.danceSingId() == 859){
                return true;
            }
        }
    }
    return false;
}

Game_Party.prototype.danceSingParamChanges = function(){
    //力、魔力、体力、素早さ
    var params = [0,0,0,0];
    var danceSings = [];
    for(member of this.aliveMembers()){
        if(member.isStateAffected(59)&&member.danceSingId()){
            if(!danceSings.includes(member.danceSingId())){
                danceSings.push(member.danceSingId());
            }
        }
    }
    for(enemy of $gameTroop.aliveMembers()){
        if(enemy.isStateAffected(60)&&enemy.danceSingId()){
            if(!danceSings.includes(enemy.danceSingId())){
                danceSings.push(enemy.danceSingId());
            }
        }
    }
    for(danceSing of danceSings){
        switch(danceSing){
            case 845: //ポルカポルカ
                params[0] = params[0]-6; break;
            case 846: //ウィッチハント
                params[1] = params[1]-6; break;
            case 847: //ブレイクダンス
                params[2] = params[2]-20; break;
            case 848: //スロウメヌエット
                params[3] = params[3]-8; break;
            case 855: //まもりのうた
                params[2] = params[2]+10; break;
            case 856: //ちからのうた
                params[0] = params[0]+10; break;
            case 857: //まりょくのうた
                params[1] = params[1]+10; break;
            case 858: //はやてのうた
                params[3] = params[3]+7; break;
            case 860: //えいゆうのうた
                params[0] = params[0]+3;
                params[1] = params[1]+3;
                params[2] = params[2]+6;
                params[3] = params[3]+3; break;
            case 1087: //しょうりのうた
                params[0] = params[0]+5;
                params[1] = params[1]+5;
                params[2] = params[2]+8;
                params[3] = params[3]+5; break;
        }
    }
    return params;
}

Game_Troop.prototype.danceSingParamChanges = function(){
    //力、魔力、体力、素早さ
    var params = [0,0,0,0];
    var danceSings = [];
    for(member of this.aliveMembers()){
        if(member.isStateAffected(59)&&member.danceSingId()){
            if(!danceSings.includes(member.danceSingId())){
                danceSings.push(member.danceSingId());
            }
        }
    }
    for(actor of $gameParty.aliveMembers()){
        if(actor.isStateAffected(60)&&actor.danceSingId()){
            if(!danceSings.includes(actor.danceSingId())){
                danceSings.push(actor.danceSingId());
            }
        }
    }
    for(danceSing of danceSings){
        switch(danceSing){
            case 845: //ポルカポルカ
                params[0] = params[0]-6; break;
            case 846: //ウィッチハント
                params[1] = params[1]-6; break;
            case 847: //ブレイクダンス
                params[2] = params[2]-20; break;
            case 848: //スロウメヌエット
                params[3] = params[3]-6; break;
            case 855: //まもりのうた
                params[2] = params[2]+20; break;
            case 856: //ちからのうた
                params[0] = params[0]+5; break;
            case 857: //まりょくのうた
                params[1] = params[1]+5; break;
            case 858: //はやてのうた
                params[3] = params[3]+5; break;
            case 860: //えいゆうのうた
                params[0] = params[0]+3;
                params[1] = params[1]+3;
                params[2] = params[2]+14;
                params[3] = params[3]+3; break;
            case 1087: //しょうりのうた
                params[0] = params[0]+5;
                params[1] = params[1]+5;
                params[2] = params[2]+17;
                params[3] = params[3]+5; break;
        }
    }
    return params;
}
           
Game_Battler.prototype.danceSingId = function() { 
    if(!this._danceSingId){
        this._danceSingId = null;
    }
    return this._danceSingId;
};

Game_Battler.prototype.setDanceSing = function(skillId) { 
    this._danceSingId = skillId;
};