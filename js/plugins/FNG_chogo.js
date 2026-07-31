//=============================================================================
// FNG_chogo.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc 調合を実装する
  * @author finga
  * @help 調合を実装する
*/

BattleManager.chogoSkill = function(item1,item2){
    var id1 = item1.id;
    var id2 = item2.id;
    var skill = this.chogoDeliverables(id1,id2);
    console.log(skill);
    if(!skill){
        skill = this.chogoDeliverables(id2,id1);
    }
    if(!skill){
        skill = $dataSkills[688]; //失敗作
    }
    return skill;
}

//参考
// 1…ポーション
// 2…ハイポーション
// 5…エーテル
// 8…エリクサー
// 10…毒消し
// 11…目薬
// 14…おとめのキッス
// 16…せいすい
// 18…フェニックスの尾
// 30…ボムのかけら
// 31…南極の風
// 32…サンゴのかけら
// 33…水の結晶
// 34…亀の甲羅
// 35…竜の牙
// 36…ダークマター
BattleManager.chogoDeliverables = function(id1,id2){
    if( id1== 1 && id2== 2 ){  return $dataSkills[689];   } //生命の水
    return null;
}

Game_Battler.prototype.setChogoConsumeId = function(item1,item2){
    this._chogoConsumeIds = [];
    this._chogoConsumeIds.push(item1.id);
    this._chogoConsumeIds.push(item2.id);
}

Game_Battler.prototype.consumeChogoMaterials = function(){
    if(!this._chogoConsumeIds){
        this._chogoConsumeIds = [];
    }
    for(id of this._chogoConsumeIds){
        this.consumeItem($dataItems[id]);
    }
}