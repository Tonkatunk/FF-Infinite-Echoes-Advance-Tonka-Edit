Game_Actor.prototype.currentLicenseJobs = function(){
    if(!this._licenseJobs){
        this._licenseJobs = [];
        if(this.actor().meta.licenses){
            this._licenseJobs.push(this.settableLicenseJobs()[0]);    
            this._licenseJobs.push(this.settableLicenseJobs()[1]);        
        }
    }
    if(this._licenseJobs.length == 0){
        this._licenseJobs = null;
    }
    //console.log(this._licenseJobs)
    return this._licenseJobs;
}

Game_Actor.prototype.currentLicense = function(){
    if(this.currentLicenseJobs()){
        return this.currentLicenseJobs()[0];
    }
    return this.currentClass();
}

Game_Actor.prototype.settableLicenseJobs = function(){
    const jobs = [];
    if(this.actor().meta.licenses){
        for (let id of this.actor().meta.licenses.split(",")) {
            jobs.push($dataClasses[Number(id)]);
        }
    }
    return jobs;
}

Game_Actor.prototype.setLicenseJob = function(job,index){
    this._licenseJobs[index] = job;
}

Game_Actor.prototype.gainLicenseAp = function(value,job){
    if(!this._licenseAps){
        this._licenseAps = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }
    this._licenseAps[job.id-151] += value;
    console.log(job,this._licenseAps[job.id-151])
}

Game_Actor.prototype.licenseAps = function(){
    if(!this._licenseAps){
        this._licenseAps = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }
    return this._licenseAps;
}

Game_Actor.prototype.licenseAp = function(job){
    if(!job){
        return 0;
    }
    const index = job.id - 151;
    const aps = this.licenseAps();
    return aps[index];
}

Game_Actor.prototype.jLevelFromClass = function(job) {
	if(!job){
		return 0;
	}
    var ap = this.Ap();
    if(job.meta.lisenceJob){
        ap = this.licenseAp(job);
    }
    //console.log(job.name,ap)
    return this.jLevelFromAp(ap,job);
};


const _Window_SkillList_makeItemList = Window_SkillList.prototype.makeItemList;
Window_SkillList.prototype.makeItemList = function() {
    if (this._actor && this._stypeId == 32) { // わざ
        this._data = this._actor.licenceWazaList();
        return;
    }
    if (this._actor && this._stypeId == 33) { // まほう
        this._data = this._actor.licenceMagicList();
        return;
    }
    _Window_SkillList_makeItemList.apply(this,arguments_);
};

Game_Actor.prototype.licenceWazaList = function() {
    const list = [];
    const stypeIds = [11,12,13,14,15,16,17,18,21,22,25];
    for(skill of this.licenseSkills()){
        if(stypeIds.includes(skill.stypeId)){
            list.push(skill);
        }
    }
    return list;
};

Game_Actor.prototype.licenceMagicList = function() {
    const list = [];
    const licenses = this.licenseSkills().filter(skill => skill.meta.mlicense);
    for(license of licenses){
        if(license.meta['mlicense'].split(',')[0] == "white"){
            for(let i = 120;i<=151;i++){
                if(i != 126){
                    const item = $dataItems[i];
                    if($gameParty.hasItem(item)){
                        const skillId = Number(item.meta.learnByOwning);
                        if(!list.includes($dataSkills[skillId])){
                            list.push($dataSkills[skillId]);
                        }
                    }
                }
            }
            continue;
        }
        if(license.meta['mlicense'].split(',')[0] == "black"){
            for(let i = 155;i<=187;i++){
                if(i != 176){
                    const item = $dataItems[i];
                    if($gameParty.hasItem(item)){
                        const skillId = Number(item.meta.learnByOwning);
                        if(!list.includes($dataSkills[skillId])){
                            list.push($dataSkills[skillId]);
                        }
                    }
                }
            }
            continue;
        }
        if(license.meta['mlicense'].split(',')[0] == "time"){
            for(let i = 194;i<=218;i++){
                const item = $dataItems[i];
                if($gameParty.hasItem(item)){
                    const skillId = Number(item.meta.learnByOwning);
                    if(!list.includes($dataSkills[skillId])){
                        list.push($dataSkills[skillId]);
                    }
                }
            }
            continue;
        }
        if(license.meta['mlicense'].split(',')[0] == "whiteblack"){
            const ids = [120,121,122,123,124,127,128,130,132,133,134,135,142,
                            143,144,145,146,147,148,149,155,156,157,159,160,
                            161,163,164,165,167,168,169,171,172,173,174,177,
                            180,181,182,183,184,187];
            for(id of ids){
                const item = $dataItems[id];
                if($gameParty.hasItem(item)){
                    const skillId = Number(item.meta.learnByOwning);
                    if(!list.includes($dataSkills[skillId])){
                        list.push($dataSkills[skillId]);
                    }
                }
            }
            continue;
        }
        for(text of license.meta['mlicense'].split(',')){
            const id = Number(text);
            if($gameParty.hasItem($dataItems[id])){
                const item = $dataItems[id];
                const skillId = Number(item.meta.learnByOwning);
                if(!list.includes($dataSkills[skillId])){
                    list.push($dataSkills[skillId]);
                }
            }
        }
    }
    return list;
};

Game_Actor.prototype.licenseParamPlus = function(param){
    var value = 0;
    var skills = this.licenseSkills().filter(skill => skill.meta.palamPlusByLicense);
    if(!skills){
        return 0;
    }
    skills = skills.filter(skill => skill.meta['palamPlusByLicense'].split(',')[0] == param);
    for(skill of skills){
        value += Number(skill.meta['palamPlusByLicense'].split(',')[1]);
    }
    return value;
};

Game_Actor.prototype.licensePotionPlus = function(){
    var value = 0;
    var skills = this.licenseSkills().filter(skill => skill.meta.potionPlusByLicense);
    if(!skills){
        return 0;
    }
    for(skill of skills){
        value += Number(skill.meta.potionPlusByLicense);
    }
    return value;
};

Game_Enemy.prototype.licensePotionPlus = function(){
    var value = 0;
    return value;
};

Game_Actor.prototype.licenseWtypeIds = function(){
    const ids = []
    var skills = this.licenseSkills().filter(skill => skill.meta.equipableW);
    if(skills){
        ids.push();
    }
    for(skill of skills){
        for(text of skill.meta['equipableW'].split(',')){
            ids.push(Number(text));
        }
    }
    return ids;
};

Game_Actor.prototype.licenseAtypeIds = function(){
    const ids = []
    var skills = this.licenseSkills().filter(skill => skill.meta.equipableA);
    if(skills){
        ids.push();
    }
    for(skill of skills){
        for(text of skill.meta['equipableA'].split(',')){
            ids.push(Number(text));
        }
    }
    return ids;
};

Game_Actor.prototype.licenseWeaponPlus = function(wtypeId){
    var value = 0;
    var skills = this.licenseSkills().filter(skill => skill.meta.weaponPlus);
    if(!skills){
        return 0 ;
    }
    for(skill of skills){
        const length = skill.meta['weaponPlus'].split(',').length;
        for(let i = 0;i<length-1;i++){
            if(Number(skill.meta['weaponPlus'].split(',')[i]) == wtypeId){
                value += Number(skill.meta['weaponPlus'].split(',')[length-1])
            }
        }
    }
    return value;
}

Game_Actor.prototype.licenseShieldPlus = function(){
    var value = 0;
    var skills = this.licenseSkills().filter(skill => skill.meta.shieldPlus);
    if(!skills){
        return 0 ;
    }
    for(skill of skills){
        value += Number(skill.meta.shieldPlus)
    }
    return value*0.01;
}


Game_Actor.prototype.licenseGunshotPlus = function(){
    var value = 0;
    var skills = this.licenseSkills().filter(skill => skill.meta.gunshotP);
    if(!skills){
        return 0 ;
    }
    for(skill of skills){
        if(Number(skill.meta['gunshotP'].split(',')[0]) == wtypeId){
            value += Number(skill.meta['gunshotP'].split(',')[1])
        }
    }
    return value;
}