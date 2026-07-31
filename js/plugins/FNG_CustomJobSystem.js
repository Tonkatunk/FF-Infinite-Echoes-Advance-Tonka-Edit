//=============================================================================
// FNG_CustomJobSystem.js
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc ジョブシステムをFFIで使う用にカスタムします。
 *              
 * @author finga
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */

//-----------------------------------------------------------------------------
// Game_Actor
//
// The game object class for an actor.

Game_Actor.prototype.initSkills = function() {
    this._skills = [];
    //職業による初期習得はなし
    /*for (const learning of this.currentLicense().learnings) {
        if (learning.level <= this._level) {
            this.learnSkill(learning.skillId);
        }
    }*/
};

const _game_actor_skills = Game_Actor.prototype.skills
Game_Actor.prototype.skills = function() {
    var list = _game_actor_skills.apply(this,arguments);
    list = list.concat(this.jobSkills());
    //console.log(this.name(),list,this.jobSkills());
    if(list.includes($dataSkills[222])){ //ものまね士
        list = list.concat(this.monomaneshiSkills());
    }
    list = list.concat(this.licenseSkills());
    return list;
};

Game_Actor.prototype.jobSkills = function() {
    var list = [];
    if(this.currentClass().learnings.length > 0){
        for (let i = 0;i < this.currentClass().learnings.length; i++) {
            if(this.currentClass().learnings[i].level <= this.mainJLevelFromAp(this.MainAp())){
                const skill = $dataSkills[this.currentClass().learnings[i].skillId];
                if(skill){
                    list.push(skill);
                }
            }
        }
    }
    return list;
};

Game_Actor.prototype.monomaneCommands = function() {
    if(!this._monomaneCommands){
        this._monomaneCommands = [null,null];
    }
    return this._monomaneCommands;
};

Game_Actor.prototype.setMonomaneCommand = function(index,skill) {
    if(!this._monomaneCommands){
        this._monomaneCommands = [null,null];
    }
    this._monomaneCommands[index] = skill;
};

Game_Actor.prototype.monomaneshiSkills = function() {
    var list = []
    list = this.membersMonomaneSkills($gameParty.members(),list);
    list = this.membersMonomaneSkills($gameParty.subMembers(),list);
    list = this.membersMonomaneSkills($gameParty.separatedMembers(1),list);
    list = this.membersMonomaneSkills($gameParty.separatedMembers(2),list);
    list = this.membersMonomaneSkills($gameParty.separatedMembers(3),list);
    return list;
};

Game_Actor.prototype.membersMonomaneSkills = function(members,list){
    const addableStypes = [10,11,12,13,14,15,16,17,18,19,20,21,22,25,26]
    for(actor of members){
        if(!actor||actor.actorId() == this.actorId()){ // 無限ループ阻止
            continue;
        }
        for(skillId of actor._skills){
            skill = $dataSkills[skillId]
            if(addableStypes.includes(skill.stypeId)&&!list.includes(skill)){
                list.push(skill)
            }
        }
        for(skillId of actor.addedSkills()){
            skill = $dataSkills[skillId]
            if(addableStypes.includes(skill.stypeId)&&!list.includes(skill)){
                list.push(skill)
            }
        }
        for(skill of actor.jobSkills()){
            if(addableStypes.includes(skill.stypeId)&&!list.includes(skill)){
                list.push(skill)
            }
        }
    }
    return list;
};

Game_Actor.prototype.monomaneCommandList = function() {
    var list = [$dataSkills[1]]
    list = this.membersMonomaneCommands($gameParty.members(),list);
    list = this.membersMonomaneCommands($gameParty.subMembers(),list);
    //list = this.membersMonomaneCommands($gameParty.separatedMembers(1),list);
    //list = this.membersMonomaneCommands($gameParty.separatedMembers(2),list);
    //list = this.membersMonomaneCommands($gameParty.separatedMembers(3),list);
    list.push(null);
    return list;
};

Game_Actor.prototype.membersMonomaneCommands = function(members,list){
    for(actor of members){
        if(!actor||actor.actorId() == this.actorId()){ // 無限ループ阻止
            continue;
        }
        for(skillId of actor._skills){
            skill = $dataSkills[skillId]
            if(skill.iconIndex == 44 && !list.includes(skill)){
                list.push(skill);
            }
        }
        for(skillId of actor.addedSkills()){
            skill = $dataSkills[skillId]
            if(skill.iconIndex == 44 && !list.includes(skill)){
                list.push(skill);
            }
        }
        for(skillId of actor.jobSkills()){
            if(skill.iconIndex == 44&&!list.includes(skill)){
                list.push(skill);
            }
        }
    }
    return list;
};

const _Game_Actor_skillTypes = Game_Actor.prototype.skillTypes;
Game_Actor.prototype.skillTypes = function() {
    var stypes = _Game_Actor_skillTypes.apply(this,arguments);
    for(command of this.monomaneCommands()){
        if(!command){
            continue;
        }
        if(command.meta.sTypeSkill){
            stypes.push(Number(command.meta.sTypeSkill));
        }
    }
    return stypes;
};

Game_Actor.prototype.jLevel = function(job) {
    if(!job){
        return this.jLevelFromAp(this.Ap());
    }
    return this.jLevelFromClass(job);
};

Game_Actor.prototype.currentLisence = function() {
    var currentLisence = this.currentClass();
    if(this.currentLicenseJobs()){
        currentLisence = $dataClass[this.currentLicenseJobs()[0]];
    }
    return currentLisence;
};

Game_Actor.prototype.jLevelFromAp = function(ap,job) {
    var remain = ap;
    var jLevel = 0;
    var license = job;
    if(!license){
        license = this.currentLicense();
    }
    if(license.learnings.length == 0){
        return jLevel;
    }
    for (let i = 0; i < license.learnings.length; i++) {
        if(Number(license.learnings[i].note) == 0){
            i++;
        }
        if(i>=license.learnings.length){
            return jLevel;
        }
        remain -= Number(license.learnings[i].note);
        if(remain < 0){
            return jLevel;
        }
        jLevel++;
    }
    return jLevel;
};


Game_Actor.prototype.mainJLevelFromAp = function(ap) {
    var remain = ap;
    var jLevel = 0;
    for (let i = 0; i < this.currentClass().learnings.length; i++) {
        if(Number(this.currentClass().learnings[i].note) == 0){
            i++;
        }
        if(i>=this.currentClass().learnings.length){
            return jLevel;
        }
        remain -= Number(this.currentClass().learnings[i].note);
        if(remain < 0){
            return jLevel;
        }
        jLevel++;
    }
    return jLevel;
};

Game_Actor.prototype.isJobMaster = function(job) {
    if(this.jLevel(job) >= this.maxJLevel(job)){
        return true;
    }
    return false;
};

Game_Actor.prototype.nextAp = function(job) {
    return this.nextApFromJLevel(this.jLevel(job),job);
};

Game_Actor.prototype.nextApFromJLevel = function(jlv,job) {
    var license = job;
    if(!license){
        license = this.currentLicense();
    }
    if(this.isJobMaster(license)){
        return 0;
    }
    for(let i = 0;i<license.learnings.length;i++){
        if(license.learnings[i].level > jlv){
            return Number(license.learnings[i].note);
        }
    }
    return 0;
};

Game_Actor.prototype.nextToralApFromJLevel = function(jlv,job) {
    var license = job;
    if(!license){
        license = this.currentLicense();
    }
    var total = 0;
    if(this.isJobMaster()){
        return 0;
    }
    for(let i = 0;i<license.learnings.length;i++){
        total += Number(license.learnings[i].note);
        if(license.learnings[i].level > jlv){
            return total;
        }
    }
    return 0;
};

Game_Actor.prototype.Ap = function(job) {
    if(!this._ap){
        this._ap = 0;
    }
    
    if(job){
        const aps = this.licenseAps();
        return aps[job.id-151];
    }
    
    if(this.currentLicenseJobs()){
        const aps = this.licenseAps();
        return aps[this.currentLicense().id-151];
    }
    
    return this._ap;
};

Game_Actor.prototype.MainAp = function() {
    if(!this._ap){
        this._ap = 0;
    }
    
    return this._ap;
};

Game_Actor.prototype.gainAp = function(value) {
    if(!this._ap){
        this._ap = 0;
    }
    this._ap += value;
    if(this.currentLicenseJobs()){
        this.gainLicenseAp(value,this.currentLicenseJobs()[0]);
        return;
    }
};

Game_Actor.prototype.currentAp = function(job) {
    var value = this.Ap(job);
    var jl = this.jLevel(job);
    var license = job;
    if(!license){
        license = this.currentLicense()
    }
    for (let i = 0; i < license.learnings.length; i++) {
        if(license.learnings[i].level <= jl){
            value -= Number(license.learnings[i].note);
        }
    }
    return value;
};

Game_Actor.prototype.maxJLevel = function(job) {
    var license = job;
    if(!license){
        license = this.currentLicense()
    }
    const length = license.learnings.length;
    if(length == 0){
        return 0;
    }
    const learnings = license.learnings;
    return learnings[length-1].level;
};

Game_Actor.prototype.finalApRate = function() {
    var rate = this.hasSkill(328) ? 2 : 1;
    //石化・戦闘不能ならAP０
    if(this.isStateAffected(11) || this.isStateAffected(1)){
        rate = 0;
    }
    return rate;
};

//レベルアップでは技は覚えない
Game_Actor.prototype.levelUp = function() {
    this._level++;
    /*
    for (const learning of this.currentLicense().learnings) {
        if (learning.level === this._level) {
            this.learnSkill(learning.skillId);
        }
    }*/
};

Game_Actor.prototype.licenseSkills = function() {
    const list = [];
    if(this.currentLicenseJobs()){
        if(this.currentLicenseJobs()[0]){
            for(ability of this.currentLicenseJobs()[0].traits){
                if(ability.code == Game_BattlerBase.TRAIT_SKILL_ADD){
                    list.push($dataSkills[ability.dataId]);
                }
            }
        }
        for(license of this.currentLicenseJobs()){
            for(larning of license.learnings){
                if(this.jLevel(license)>=larning.level){
                    if(!list.includes($dataSkills[larning.skillId])){
                        list.push($dataSkills[larning.skillId]);
                    }
                }
            }
        }
    }
    return list;
};

//-----------------------------------------------------------------------------
// Game_Enemy
//
// 敵に取得できるAPを設定できるようにする

Game_Enemy.prototype.Ap = function() {
    return Number(this.enemy().meta.ap);
};

//-----------------------------------------------------------------------------
// Game_Troop
//
// 敵に取得できるAPを設定できるようにする
Game_Troop.prototype.apTotal = function() {
    return this.deadMembers().reduce((r, enemy) => r + enemy.Ap(), 0);
};

//-----------------------------------------------------------------------------
// BattleManager
//
// APを入手できるようにする
BattleManager.gainAp = function() {
    const ap = this._rewards.ap;
    const boostRate = $gameParty.boostApRate();
    var boostedAp = Math.floor(ap*boostRate);
    for (const actor of $gameParty.allMembers()) {
        actor.gainAp(boostedAp*actor.finalApRate());
        if(actor.crystal()){
            actor.crystal().gainAp(boostedAp*actor.finalApRate());
        }
    }
    $gameSystem.addGainedApCount(boostedAp);
    $gameSystem.addBoostedApCount(boostedAp-ap);
};

const _BattleManager_gainRewards = BattleManager.gainRewards;
BattleManager.gainRewards = function() {
    _BattleManager_gainRewards.apply(this,arguments);
    this.gainAp();
    $gameSystem.addBeatCount($gameTroop.beatedNum());
};

const _BattleManager_makeRewards = BattleManager.makeRewards;
BattleManager.makeRewards = function() {
    _BattleManager_makeRewards.apply(this,arguments);
    this._rewards.ap = $gameTroop.apTotal();
};

Game_Party.prototype.boostApRate = function(){
    switch($gameVariables.value(53)){
        case 0: return 0;
        case 1: return 0.25;
        case 2: return 0.5;
        case 3: return 0.75;
        case 4: return 1;
        case 5: return 1.25;
        case 6: return 1.5;
        case 7: return 1.75;
        case 8: return 2;
        case 9: return 3;
        case 10: return 4;
    }
}

