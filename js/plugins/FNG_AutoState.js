//=============================================================================
// FNG_AutoState.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc オートステート・さきがけステートを実装する
  * @author finga
  * @help オートステート・さきがけステートを実装する
*/

const _Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
Game_Battler.prototype.onBattleStart = function(advantageous) {
    _Game_Battler_onBattleStart.apply(this,arguments);
    if(this.isActor()){
        this.initInitiativateState();
    }
}

//戦闘開始時に作用するステート
Game_Actor.prototype.initInitiativateState = function() {
    //さきがけ
    if(this.hasSkill(216)){
        this._tpbChargeTime = 1;
    }
    //分身数は初期化
    this._avatarNum = 0;
    //ミラージュ
    if(this.hasSkill(217)){
        this.addState(45);
    }
    //インビジブル
    if(this.hasSkill(218)){
        this.addState(46);
    }
    //おまじない
    if(this.hasSkill(219)){
        this.addState(49);
    }
}

const _game_Battler_updateTpbState = Game_Battler.prototype.updateTpbState;
Game_Battler.prototype.updateTpbState = function() {
    _game_Battler_updateTpbState.apply(this,arguments);
    if(this.isActor()){
        //オートヘイスト
        if(this.hasSkill(210)&&!this.isStateAffected(41)){
            this.addState(41);       
        }
        //オートリジェネ
        if(this.hasSkill(211)&&!this.isStateAffected(15)){
            this.addState(15);       
        }
        //オートプロテス
        if(this.hasSkill(212)&&!this.isStateAffected(43)){
            //オートステートでの付与ボーナスはないのでaddNewState
            this.addNewState(43);
        }
        //オートシェル
        if(this.hasSkill(213)&&!this.isStateAffected(44)){
            //オートステートでの付与ボーナスはないのでaddNewState
            this.addState(44);       
        }
        //オートリフレク
        if(this.hasSkill(214)&&!this.isStateAffected(18)){
            this.addState(18);       
        }
        if(this.isEnemy()&&this.enemy().meta.autoReflec){
            this.addState(18);       
        }
        //オートレビテト
        if(this.hasSkill(215)&&!this.isStateAffected(38)){
            this.addState(38);       
        }
    }
    if(this.isEnemy()){
        //浮遊モンスターは常にレビテト
        if(this.enemy().meta.BattlerFloat&&!this.isStateAffected(38)){
            this.addState(38);            
        }
    }
};
