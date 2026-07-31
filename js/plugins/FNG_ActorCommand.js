//-----------------------------------------------------------------------------
// Window_ActorCommand
//
// FFI用にアクターコマンドを改造。

Window_ActorCommand.prototype.addSkillCommands = function() {
    const skillTypes = this._actor.skillTypes();
    for (const stypeId of skillTypes) {
        //スキルタイプ1～4はアクターコマンドの対象外
        if(stypeId >= 5){
            const name = $dataSystem.skillTypes[stypeId];
            //隠れる状態はコマンドを無効化する
            const enable = !this._actor.isStateAffected(21);
            this.addCommand(name, "skill", enable, stypeId);
        }
    }
};

Window_ActorCommand.prototype.addGuardCommand = function() {
    //防御コマンドは追加しない。
    //this.addCommand(TextManager.guard, "guard", this._actor.canGuard());
};

Window_ActorCommand.prototype.update = function(){
    Window_Selectable.prototype.update.call(this);
    this.updateAnimationFrame();
    this.updateOverdriveCommand();
    if(this._actor&&this._actor.isStateAffected(16)){
        if(this._actor.manipulate()&&!this._actor.manipulate().isStateAffected(17)){
            this._actor.removeState(16);
            this._actor._manipulate = null;
            this.close();
            this.refresh();
            this.open();
        }
    }
}

Window_ActorCommand.prototype.updateOverdriveCommand = function(){
    if(BattleManager._currentActor && !BattleManager._currentActor.isStateAffected(16) && BattleManager._currentActor.tp && (BattleManager._currentActor.isStateAffected(28)||
      BattleManager._currentActor.tp >= 100)){
        if(this.animationFrame()<10){
            this.drawIcon(65, $TILE*2.5, -$TILE/2);
        }else{
            this.drawIcon(66, $TILE*2.5, -$TILE/2);          
        }
    }
}

Window_ActorCommand.prototype.updateAnimationFrame = function(){
    if(!this._animationFrame){
        this._animationFrame = 0;
    }
    this._animationFrame++;
    if(this._animationFrame >= 20){
        this._animationFrame = 0;        
    }
}

Window_ActorCommand.prototype.animationFrame = function(){
    return this._animationFrame;
}

Window_ActorCommand.prototype.makeCommandList = function() {
    /*if(this._actor){
        console.log(this._actor,this._actor.name())
        console.log(this._actor.name(),this._actor.isStateAffected(16),this._actor.manipulate(),this._actor.manipulate().isStateAffected(17))
    }*/
    /*if(this._actor&&this._actor.manipulate()){
    console.log(this._actor,this._actor._states.includes(16),this._actor.manipulate(),this._actor.manipulate().isStateAffected(17))
    }*/
    if(this._actor&&this._actor._states.includes(16)&&this._actor.manipulate()&&!this._actor.manipulate().isStateAffected(17)){
       this._actor.removeState(16);
       this._actor._manipulate = null;
    }
    if(this._actor&&this._actor._states.includes(16)&&!this._actor.manipulate()){
       this._actor.removeState(16);
       this._actor._manipulate = null;
    }
    if(this._actor&&this._actor._states.includes(16)&&this._actor.manipulate()&&this._actor.manipulate().isStateAffected(17)) {
        //console.log("manipulate command")
        this.resizeWindow();
        this.addAttackCommand();
        this.addManipulateCommands();
    }else if(this._actor){
        this.resizeWindow();
        if(!this._actor.hasSkill(222)){
            this.addAttackCommand();
        }
        this.addCommandsAbilities();
        this.addItemCommand();
    }
};

Window_ActorCommand.prototype.resizeWindow = function() {
    if (this._actor&&this._actor.isStateAffected(16)) {
        this.width = $TILE/2*14.5;
        this.x = 0;
    }else{
        this.width = $TILE/2*8.5;
        this.x = Graphics.boxWidth - (Graphics.boxWidth - $TILE/2*12.5)-this.width;
    }
};

Window_ActorCommand.prototype.addManipulateCommands = function(){
    const enemy = $dataEnemies[this._actor.manipulate().enemyId()];
    for(let i=0;i<5&&i<enemy.actions.length;i++){
        var skill = $dataSkills[enemy.actions[i].skillId];
        if(skill.meta.mnpalt){
            const id = Number(skill.meta.mnpalt);
            if(id == 0||id == 1){ continue; }
            skill = $dataSkills[enemy.actions[i].id];
        }
        //隠れる状態だと現れるコマンド以外を無効化する
        const enable = !this._actor.isStateAffected(21) || !skill.meta.appear;
        if(skill && skill.id != 1){
            if(!skill.meta.hide){
                if(skill.message2){
                    this.addCommand(skill.message2, `special`, enable, skill);
                }else{
                    this.addCommand(skill.name, `special`, enable, skill);
                }
            }else{
                if(this._actor.isStateAffected(21)){
                    const appearSkill = $dataSkills[208];
                    this.addCommand(appearSkill.name, `special`, true, appearSkill);
                }else{
                    this.addCommand(skill.name, `special`, false, skill);
                }
            }
        }
        
    }
}

Window_ActorCommand.prototype.isFanaticMode = function(){
    return $gameSwitches.value(26);
}

Window_ActorCommand.prototype.isMuteMode = function(){
    return $gameSwitches.value(31);
}

Window_ActorCommand.prototype.canUseStypeInFanatic = function(stypeId){
    const stypes = [5,6,7,8,9,19,23,24,26,33]
    return stypes.includes(stypeId);
}

Window_ActorCommand.prototype.addCommandsAbilities = function() {
    if(this._actor.hasSkill(222)){ //ものまね士
        const skill = $dataSkills[258]; //ものまねコマンド
        var enable = !this._actor.isStateAffected(21)&&this._actor.canUse(skill);
        if(this.isFanaticMode()&&!skill.meta.fanatic){
            enable = false;
        }
        this.addCommand(skill.name, `special`, enable, skill);

        for(command of this._actor.monomaneCommands()){
            if(!command){
                continue;
            }
            if(command.meta.sTypeSkill){
                const stypeId = Number(command.meta.sTypeSkill);
                const name = $dataSystem.skillTypes[stypeId];
                var enable = !this._actor.isStateAffected(21);
                if(this.isFanaticMode()){
                    enable = this.canUseStypeInFanatic(stypeId);
                }
                if(this.isMuteMode()){
                    enable = !this.canUseStypeInFanatic(stypeId);
                }
                if(stypeId == 19){
                    this.addCommand(name, "Release",!this._actor.isSkillTypeSealed(stypeId)&&this._actor.canUseMagicSword()&&enable, stypeId);
                }else if(stypeId == 20){
                    if(this.isFanaticMode()){
                        enable = false;
                    }
                    this.addCommand("Beast", `release`, !this._actor.isSkillTypeSealed(stypeId)&&enable, stypeId);
                }else if(stypeId >= 5){
                    this.addCommand(name, "skill",!this._actor.isSkillTypeSealed(stypeId)&&enable, stypeId);
                }
            }else{
                while(true){
                    if(command.meta.chogo){
                        this.addCommand(command.name, `chogo`, enable, command);
                        break;
                    }
                    if(command.meta.throw){
                        this.addCommand(command.name, `throw`, enable, command);
                        break;
                    }
                    this.addCommand(command.name, `special`, enable, command);
                    break;
                }
            }
        }

    }else{
        if(this._actor.hasSkill(223)){ //デュアルスタイル
            var enable = true;
            if(this._actor.isStateAffected(33)){//後衛時はショット・白黒魔
                var stypeId = 34;
				enable = !this._actor.isStateAffected(21)&&!this._actor.isSkillTypeSealed(stypeId);
                if(this.isFanaticMode()){
                    enable = false;
                }
                var name = $dataSystem.skillTypes[stypeId];
                this.addCommand(name, "skill",enable, stypeId);
				
				stypeId = 23;
				enable = !this._actor.isStateAffected(21)&&!this._actor.isSkillTypeSealed(stypeId);
            	name = $dataSystem.skillTypes[stypeId];
            	this.addCommand(name, "skill",!this._actor.isSkillTypeSealed(stypeId)&&enable, stypeId);
				
            }else{//前衛時は騎士道
                var stypeId = 17;
				enable = !this._actor.isStateAffected(21)&&!this._actor.isSkillTypeSealed(stypeId);
                if(this.isFanaticMode()){
                    enable = false;
                }
                var name = $dataSystem.skillTypes[stypeId];
                this.addCommand(name, "skill",!this._actor.isSkillTypeSealed(stypeId)&&enable, stypeId);
                /*const skillId = 246;
                const skill = $dataSkills[skillId];
                enable = !this._actor.isStateAffected(21)&&this._actor.canUse(skill);
				this.addCommand(skill.name, `special`, enable, skill);*/
            }
        }else{
            for(trait of $dataActors[this._actor.actorId()].traits){
                if(trait.code == Game_BattlerBase.TRAIT_STYPE_ADD){
                    const stypeId = trait.dataId;
                    const name = $dataSystem.skillTypes[stypeId];
                    var enable = !this._actor.isStateAffected(21);
                    if(this.isFanaticMode()&&enable){
                        enable = this.canUseStypeInFanatic(stypeId);
                    }
                    if(stypeId == 19){
                        this.addCommand(name, "skill",!this._actor.isSkillTypeSealed(stypeId)&&this._actor.canUseMagicSword()&&enable, stypeId);
                    }else if(stypeId >= 5){
                        this.addCommand(name, "skill",!this._actor.isSkillTypeSealed(stypeId)&&enable, stypeId);
                    }
                }
                if(trait.code == Game_BattlerBase.TRAIT_SKILL_ADD){
                    const skillId = trait.dataId;
                    const skill = $dataSkills[skillId];
                    var enable = !this._actor.isStateAffected(21)&&this._actor.canUse(skill);
                    if(this.isFanaticMode()&&!skill.meta.fanatic){
                        enable = false;
                    }
                    if($gameTemp.isCommandSkill(skill)){
                        if(!skill.meta.hide){
                            this.addCommand(skill.name, `special`, enable, skill);
                        }else{
                            if(this._actor.isStateAffected(21)){
                                const appearSkill = $dataSkills[208];
                                this.addCommand(appearSkill.name, `special`, true, appearSkill);
                            }else{
                                this.addCommand(skill.name, `special`, this._actor.canUse(skill)&&enable, skill);
                            }
                        }
                    }
                    if(skill.meta.release){
                        this.addCommand(skill.name, `release`, this._actor.canUse(skill)&&enable, skill);
                    }
                    if(skill.meta.chogo){
                        this.addCommand(skill.name, `chogo`, this._actor.canUse(skill)&&enable, skill);
                    }
                    if(skill.meta.throw){
                        this.addCommand(skill.name, `throw`, this._actor.canUse(skill), skill);
                    }
                }
            }
        }
    }
    for(skill of this._actor.jobSkills()){
        var enable = !this._actor.isStateAffected(21)&&this._actor.canUse(skill);
        if(this.isFanaticMode()&&!skill.meta.fanatic){
            enable = false;
        }
        if($gameTemp.isCommandSkill(skill)){
            if(!skill.meta.hide){
                    this.addCommand(skill.name, `special`, enable, skill);
                }else{
                    if(this._actor.isStateAffected(21)&&this._actor.canUse(skill)){
                        const appearSkill = $dataSkills[208];
                        this.addCommand(appearSkill.name, `special`, true, appearSkill);
                    }else{
                        this.addCommand(skill.name, `special`, enable, skill);
                }
            }
        }
        if(skill.meta.throw){
            this.addCommand(skill.name, `throw`, this._actor.canUse(skill), skill);
        }
    }
    if(this._actor.equips()[5]){
        const mareria = this._actor.equips()[5];
        for(trait of mareria.traits){
            if(trait.code == Game_BattlerBase.TRAIT_STYPE_ADD){
                const stypeId = trait.dataId;
                const name = $dataSystem.skillTypes[stypeId];
                var enable = !this._actor.isStateAffected(21);
                if(this.isFanaticMode()&&enable){
                    enable = this.canUseStypeInFanatic(stypeId);
                }
                if(stypeId == 19){
                    this.addCommand(name, "skill",!this._actor.isSkillTypeSealed(stypeId)&&this._actor.canuseMagicSword()&&enable, stypeId);
                }else if(stypeId >= 5){
                    this.addCommand(name, "skill",!this._actor.isSkillTypeSealed(stypeId)&&enable, stypeId);
                }
            }
            if(trait.code == Game_BattlerBase.TRAIT_SKILL_ADD){
                const skillId = trait.dataId;
                const skill = $dataSkills[skillId];
                var enable = !this._actor.isStateAffected(21)&&this._actor.canUse(skill);
                if(this.isFanaticMode()&&!skill.meta.fanatic){
                    enable = false;
                }
                if($gameTemp.isCommandSkill(skill)){
                    if(!skill.meta.hide){
                        this.addCommand(skill.name, `special`, enable, skill);
                    }else{
                        if(this._actor.isStateAffected(21)){
                            const appearSkill = $dataSkills[208];
                            this.addCommand(appearSkill.name, `special`, true, appearSkill);
                        }else{
                            this.addCommand(skill.name, `special`, enable, skill);
                        }
                    }
                }
                if(skill.meta.release){
                    this.addCommand(skill.name, `release`, enable, skill);
                }
                if(skill.meta.throw){
                    this.addCommand(skill.name, `throw`, enable, skill);
                }
                if(skill.meta.chogo){
                    this.addCommand(skill.name, `chogo`, enable, skill);
                }
            }
        }
    }
};

const _Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
Scene_Battle.prototype.createActorCommandWindow = function() {
    _Scene_Battle_createActorCommandWindow.apply(this,arguments);
    this._actorCommandWindow.setHandler("release", this.commandRelease.bind(this));
    this._actorCommandWindow.setHandler("throw", this.commandThrow.bind(this));
    this._actorCommandWindow.setHandler("chogo", this.commandChogo.bind(this));
    this._actorCommandWindow.setHandler("escaping", this.escaping.bind(this));
    this._actorCommandWindow.setHandler("notescaping", this.notEscaping.bind(this));
};

Scene_Battle.prototype.commandAttack = function() {
    var action = BattleManager.inputtingAction();
    if(!action){
        SoundManager.playBuzzer();
        return;
    }
    action.setAttack();
    this._actorCommandWindow.resetShowingODWindow();
    this.onSelectAction();
};

Scene_Battle.prototype.commandItem = function() {
    this._itemWindow.setCategory("item");
    this._itemWindow.refresh();
    this._itemWindow.show();
    this._itemWindow.activate();
    this._statusWindow.hide();
    this._actorCommandWindow.resetShowingODWindow();
    this._actorCommandWindow.hide();
};

Scene_Battle.prototype.commandRelease = function() {
    this._itemWindow.setCategory("release");
    this._itemWindow.refresh();
    this._itemWindow.show();
    this._itemWindow.activate();
    this._statusWindow.hide();
    this._actorCommandWindow.resetShowingODWindow();
    this._actorCommandWindow.hide();
};

Scene_Battle.prototype.commandChogo = function() {
    this._itemWindow.setCategory("chogo");
    this._itemWindow.refresh();
    this._itemWindow.show();
    this._itemWindow.activate();
    this._statusWindow.hide();
    this._actorCommandWindow.resetShowingODWindow();
    this._actorCommandWindow.hide();
};

Scene_Battle.prototype.commandThrow = function() {
    //隠れているか否かで投げアイテムの使用可否が変わる
    const hidemode = this._actorCommandWindow._actor.isStateAffected(21);
    this._itemWindow.setCategory("throw",hidemode);
    this._itemWindow.refresh();
    this._itemWindow.show();
    this._itemWindow.activate();
    this._statusWindow.hide();
    this._actorCommandWindow.resetShowingODWindow();
    this._actorCommandWindow.hide();
};

Scene_Battle.prototype.commandSpecial = function() {
    const skill = this._actorCommandWindow.currentExt();
    var action = BattleManager.inputtingAction();
    this._actorCommandWindow.resetShowingODWindow();
    action.setSkill(skill.id);
    BattleManager.actor().setLastBattleSkill(skill);
    //スキル判定がうまくいかないことがあるのですべてスキル扱いとする
    /*if (DataManager.isSkill(skill)) { 
    } else {
        action.setItem(skill.id);
    }*/
    this.onSelectAction();
};


/*
Scene_Battle.prototype.commandChogo = function() {
    this._itemWindow.setCategory("chogo");
    this._itemWindow.refresh();
    this._itemWindow.show();
    this._itemWindow.activate();
    this._statusWindow.hide();
    this._actorCommandWindow.hide();
};*/

Scene_Battle.prototype.onItemCancel = function() {
    if(!this._itemWindow._subIndex||this._itemWindow._subIndex < 0){
        this._itemWindow.hide();
        this._statusWindow.show();
        this._actorCommandWindow.refresh();
        this._actorCommandWindow.show();
        this._actorCommandWindow.activate();
    }else{
       this._itemWindow._index = this._itemWindow._subIndex
       this._itemWindow._subIndex = -1;
       this._itemWindow.activate();        
    }
};

Window_ActorCommand.prototype.addAttackCommand = function() {
    var enable = !this._actor.isStateAffected(21);
    if(this.isFanaticMode()){
        enable = false;
    }
    this.addCommand(TextManager.attack, "attack", enable&&this._actor.canAttack());
};

Window_ActorCommand.prototype.addItemCommand = function() {
    var enable = !this._actor.isStateAffected(21);
    if(this.isFanaticMode()){
        enable = false;
    }
    this.addCommand(TextManager.item, "item",enable);
};