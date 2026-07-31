//=============================================================================
// FNG_AbsorbDamageSprite.js
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 吸収攻撃時、回復側の値も表示するようにします
 * @author finga
 * @url
 */
 
Game_Battler.prototype.isAbsorbPopupRequested = function() {
    if(!this._absorbPopupTargets){
        this._absorbPopupTargets = false;
    }
    return this._absorbPopupTargets;
};

Game_Battler.prototype.setAbsorbPopupTargets = function(targets) {
    this._absorbPopupTargets = targets;
    console.log(this.name(),this._absorbPopupTargets,"absorbPopupTargets setted");
};

Game_Battler.prototype.clearAbsorbPopup = function() {
    this._absorbPopupTargets = false;
};

Sprite_Battler.prototype.setupAbsorbPopup = function() {
    if (this._battler.isAbsorbPopupRequested()) {
        if (this._battler.isSpriteVisible()) {
            this.createAbsorbSprite();
            console.log(this._battler.name(),"createAbsorbSprite")
        }
        this._battler.clearAbsorbPopup();
    }
};

const _sprite_Battler_updateDamagePopup = Sprite_Battler.prototype.updateDamagePopup;
Sprite_Battler.prototype.updateDamagePopup = function() {
    _sprite_Battler_updateDamagePopup.apply(this,arguments);
    this.setupAbsorbPopup();
    if (this.absorbs().length > 0) {
        for (const absorb of this._absorbs) {
            absorb.update();
        }
        if (!this.absorbs()[0].isPlaying()) {
            this.destroyAbsorbSprite(this._absorbs[0]);
        }
    }
};

Sprite_Battler.prototype.destroyAbsorbSprite = function(sprite) {
    this.parent.removeChild(sprite);
    this._absorbs.remove(sprite);
    sprite.destroy();
};

Sprite_Battler.prototype.absorbs = function(){
    if(!this._absorbs){
        this._absorbs = [];
    }
    return this._absorbs;
}

Sprite_Battler.prototype.createAbsorbSprite = function() {
    const absorbs = this.absorbs();
    const last = this._absorbs[this._absorbs.length - 1];
    const sprite = new Sprite_Damage();
    const targets = this._battler.isAbsorbPopupRequested();
    if (last) {
        sprite.x = last.x;
        sprite.y = last.y;
    } else {
        sprite.x = this.x + this.damageOffsetX();
        sprite.y = this.y + this.damageOffsetY();
    }
    const toMp = this.isAbsorbMp(targets);
    /*var value = this.absorbValue(targets);
    if(value != 0){
        sprite.setupAbsorb(value,toMp);
        this._absorbs.push(sprite);
        this.parent.addChild(sprite);
    }*/
    value = this.absorbValueHp(targets);
    console.log(value,targets)
    if(value != 0){
        sprite.setupAbsorb(value,false);
        this._absorbs.push(sprite);
        this.parent.addChild(sprite);
        for(target of targets){
            target.shiftDrainPopupResult();
        }
    }
    value = this.absorbValueMp(targets);
    if(value != 0){
        sprite.setupAbsorb(value,true);
        this._absorbs.push(sprite);
        this.parent.addChild(sprite);
        for(target of targets){
            target.shiftDrainPopupResult();
        }
    }
};

Sprite_Battler.prototype.absorbValue = function(targets){
    var value = 0;
    for(target of targets){
        const result = target.drainPopupResult();
        if(result && dresult.hpAffected && result.drain) {
            value -= result.hpDrain;
        } else if (result && target.isAlive() && result.mpDamage !== 0 && result.drain) {
            value -= result.mpDrain;
        }
    }
    return value;
}

Sprite_Battler.prototype.absorbValueHp = function(targets){
    var value = 0;
    for(target of targets){
        const result = target.drainPopupResult();
        console.log(this._battler.name(),result)
        if(result){
            /*if(result.drain){
                value -= result.hpDrain;
            }*/
            if(result.hpDrain){
                value -= result.hpDrain;
            }
        }
    }
    return value;
}

Sprite_Battler.prototype.absorbValueMp = function(targets){
    var value = 0;
    for(target of targets){
        const result = target.drainPopupResult();
        if(result){
            //value -= result.mpDrain;
            if(result.mpDrain){
                value -= result.mpDrain;
            }
        }
    }
    return value;
}

Sprite_Battler.prototype.isAbsorbMp = function(targets){
    for(target of targets){
        const result = target.drainPopupResult();
        if (result && target.isAlive() && result.mpDamage !== 0 && result.drain) {
            return true;
        }
    }
    return false;
}

Sprite_Damage.prototype.setupAbsorb = function(value,toMp) {
    this._baseRow = toMp ? 2 : 0;
    this.createDigits(value);
};

Window_BattleLog.prototype.setAbsorbPopupTargets = function(subject,targets) {
    subject.setAbsorbPopupTargets(targets);
};

const _game_ActionResult_clear = Game_ActionResult.prototype.clear
Game_ActionResult.prototype.clear = function() {
    _game_ActionResult_clear.apply(this,arguments);
    this.hpDrain = 0;
    this.mpDrain = 0;
};

Game_Action.prototype.executeHpDamage = function(target, value) {
    if (this.isDrain()) {
        value = Math.min(target.hp, value);
    }
    this.makeSuccess(target);
    target.gainHp(-value);
    if (value > 0) {
        target.onDamage(value);
    }
    //this.gainDrainedHp(value);
};

Game_Action.prototype.executeMpDamage = function(target, value) {
    if (!this.isMpRecover()) {
        value = Math.min(target.mp, value);
    }
    if (value !== 0) {
        this.makeSuccess(target);
    }
    target.gainMp(-value);
    //this.gainDrainedMp(value);
};