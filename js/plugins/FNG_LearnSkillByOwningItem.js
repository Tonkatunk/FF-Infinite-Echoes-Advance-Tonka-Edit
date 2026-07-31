//=============================================================================
// FNG_LearnSkillByOwning
//=============================================================================

/*:
  * @target MZ
  * @plugindesc アイテム所持によるスキル習得
  * @author finga
  * @help メモ欄に<learnByOwning:xx>と記載すると、
  該当のアイテムを持っているだけでID:xxのスキルを全員が習得します。
  使用にはアクターが別途スキルタイプを所有している必要があります。
  また、<learnByHasSkill:xx>と記載すると、
  特定のスキルを所持しているとまた別のスキルもセットで所持するようになります。
*/
var _game_Actor_skills = Game_Actor.prototype.skills;
Game_Actor.prototype.skills = function() {
    var list = _game_Actor_skills.apply(this,arguments);
    if(!$gameParty){
        return list;
    }
    for (const item of $gameParty.allItems()) {
        if(!item.learnByOwning){
            if(item.meta.necessarySkill && list.includes($dataSkills[Number(item.meta.necessarySkill)])){
                list.push($dataSkills[Number(item.meta.learnByOwning)]);             
            }else if($dataSkills[Number(item.meta.learnByOwning)] && !item.meta.necessarySkill){
                list.push($dataSkills[Number(item.meta.learnByOwning)]);
            }
        }
    }
    const learnByHasSkillIds = [];
    for(skill of list){
        if($dataSkills[skill.id].meta.learnByHasSkill){
            learnByHasSkillIds.push(Number(skill.meta.learnByHasSkill));
        }
    }
    //ID順に並び替え
    learnByHasSkillIds.sort(function(first, second){
      if (first > second){
        return 1;
      }else if (first < second){
        return -1;
      }else{
        return 0;
      }
    });
    const learnByHasSkills = [];
    for(skillId of learnByHasSkillIds){
        list.push($dataSkills[skillId]);
    }
    
    return list;
};

