//=============================================================================
// FNG_MultiTypeSkill.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc スキルタイプを２つ以上設定できるようにします
  * @author finga
  * @help メモ欄に<MultiTypeSkill:x,y,z...>と記載すると、
  x,y,z...分も指定したスキルタイプとしても扱います。
*/

const _window_skillList_includes = Window_SkillList.prototype.includes;
Window_SkillList.prototype.includes = function(item) {
    
    var include = _window_skillList_includes.apply(this,arguments);
    if(item && item.meta.MultiTypeSkill){
        for(const typestr of item.meta['MultiTypeSkill'].split(',')){
            const type = Number(typestr);
            if(type === this._stypeId){
                include = true;
            }
        }
    }
    return include;
};