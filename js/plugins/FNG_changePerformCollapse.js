//=============================================================================
// NRP_changePerformCollapse.js
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc NRP_DamageTiming.jsでの上書き元用
 * @author finga
 * @url
 *
 * @help NRP_DamageTiming.jsでの上書き元用
 * 
 * NRP_DamageTiming.jsより上に
 */

Window_BattleLog.prototype.displayAddedStates = function(target) {
    const result = target.result();
    const states = result.addedStateObjects();
    for (const state of states) {
        const stateText = target.isActor() ? state.message1 : state.message2;
        if (state.id === target.deathStateId()) {
            //this.push("performCollapse", target);
        }
        if (stateText) {
            this.push("popBaseLine");
            this.push("pushBaseLine");
            this.push("addText", stateText.format(target.name()));
            this.push("waitForEffect");
        }
    }
};

const _Sprite_Enemy_startEffect = Sprite_Enemy.prototype.startEffect;
Sprite_Enemy.prototype.startEffect = function(effectType) {
    this._effectType = effectType;
    switch (this._effectType) {
        case "zantetsu":
            this.startZantetsu();
            break;
    }
    _Sprite_Enemy_startEffect.apply(this,arguments);
};

const _Sprite_Enemy_updateEffect = Sprite_Enemy.prototype.updateEffect
Sprite_Enemy.prototype.updateEffect = function() {
    _Sprite_Enemy_updateEffect.apply(this,arguments);
    this.setupEffect();
    if (this._effectDuration > 0) {
        switch (this._effectType) {
            case "zantetsu":
                this.updateZantetsu();
                break;
        }
    }
};

Sprite_Enemy.prototype.startZantetsu = function() {
    this._effectDuration = 64;
    this._appeared = false;
    this._zantetsu1 = new Sprite(this.bitmap);
    this._zantetsu2 = new Sprite(this.bitmap);
    this._zantetsu3 = new Sprite(this.bitmap);
    this._zantetsu1.setFrame(0,0,this._zantetsu1.width,this._zantetsu1.height/3);
    this._zantetsu2.setFrame(0,this._zantetsu2.height/3,this._zantetsu2.width,this._zantetsu2.height/3);
    this._zantetsu3.setFrame(0,this._zantetsu3.height/3*2,this._zantetsu3.width,this._zantetsu3.height/3);
    this.addChild(this._zantetsu1);
    this.addChild(this._zantetsu2);
    this.addChild(this._zantetsu3);
    this._zantetsu1.x = -this._zantetsu1.width/2
    this._zantetsu2.x = -this._zantetsu2.width/2
    this._zantetsu3.x = -this._zantetsu3.width/2
};

Sprite_Enemy.prototype.updateZantetsu = function() {
    this.y -= Graphics.boxHeight;
    this._zantetsu1.y = Graphics.boxHeight-this._zantetsu1.height*3;
    this._zantetsu2.y = Graphics.boxHeight-this._zantetsu2.height*2;
    this._zantetsu3.y = Graphics.boxHeight-this._zantetsu3.height;
    this._zantetsu1.blendMode = 1;
    this._zantetsu2.blendMode = 1;
    this._zantetsu3.blendMode = 1;
    
    this._zantetsu1.setBlendColor([255, 128, 128, 128]);
    this._zantetsu2.setBlendColor([255, 128, 128, 128]);
    this._zantetsu3.setBlendColor([255, 128, 128, 128]);

    this.opacity *= this._effectDuration / (this._effectDuration + 1);
    if(this.opacity < 10){
        this.opacity = 0;
    }
    
    this._zantetsu1.x = (64 - this._effectDuration)/4-this.width/2;
    this._zantetsu2.x = -(64 - this._effectDuration)/4-this.width/2;
    this._zantetsu3.x = (64 - this._effectDuration)/4-this.width/2;
    
};