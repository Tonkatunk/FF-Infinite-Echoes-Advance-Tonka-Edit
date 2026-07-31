//=============================================================================
// FNG_CaptureMonster.js
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc ほかくアビリティを持つアクターがとどめを刺すと、倒したモンスターを捕獲する
 * @author finga
 * @url
 *
 * @help ほかくアビリティを持つアクターがとどめを刺すと、倒したモンスターを捕獲する
 * 
 */

Game_Battler.prototype.capturable = function(){
    if(this.isActor()){
        return false;
    }
    const item = $dataEnemies[this._enemyId];
    if(item.meta.capture){
        return true; 
    }
    return false;
}

Game_Battler.prototype.isBeastMaster = function(){
    if(this.isEnemy()){
        return false;
    }
    return this.hasSkill(294);
}

BattleManager.capture = function(targets){
    if(this._subject.isBeastMaster()){
        for(target of targets){
            if(target.capturable()&&target.isDead()){
                const enemy = $dataEnemies[target._enemyId];
                const itemId = Number(enemy.meta.capture);
                BattleManager.pushActiveMessage(enemy.name + "をほかくした");
                $gameParty.gainItem($dataItems[itemId],1);
            }
        }
    }
}

BattleManager.startSummonEffect = function(){
    for(member of $gameParty.members()){
        member.startSummonEffect();
    }
}

BattleManager.endSummonEffect = function(){
    for(member of $gameParty.members()){
        member.endSummonEffect();
    }   
}

Game_Actor.prototype.startRelease = function(enemyId){
    this._releasing = enemyId;
}

Game_Actor.prototype.resetRelease = function(){
    this._releasing = null;
}

Game_Actor.prototype.isReleasing = function(){
    return this._releasing > 0;
}

Game_Enemy.prototype.isReleasing = function(){
    return false;
}

Game_Actor.prototype.releasingMonster = function(){
    if(!this.isReleasing()){
        return null;
    }
    return $dataEnemies[this._releasing];
}

Game_Actor.prototype.isStartingSummonEffect = function(){
    return this._summonStart;
}

Game_Actor.prototype.isEndingSummonEffect = function(){
    return this._summonEnd;
}

Game_Actor.prototype.startSummonEffect = function(){
    this._summonStart = true;
}

Game_Actor.prototype.endSummonEffect = function(){
    this._summonEnd = true;
}

Game_Actor.prototype.resetSummonEffect = function(){
    this._summonEnd = false;
    this._summonStart = false;
}

Game_Battler.prototype.hidden = function(){
    this._hidden = true;
}

Game_Battler.prototype.sudden = function(){
    this._hidden = false;
}

Game_Battler.prototype.isHidden = function(){
    return this._hidden;
}

Sprite_Actor.prototype.startSummonEffect = function(){
    this._summonEnd = false;
    this._summonStart = true;
    this._summonFrame = 0;
}

Sprite_Actor.prototype.endSummonEffect = function(){
    this._summonStart = false;
    this._summonEnd = true;
    this._summonFrame = 0;
}

Sprite_Actor.prototype.finishSummonEffect = function(){
    this._summonEnd = false;
    this._summonStart = false;
    this._summonFrame = 0;
}

Sprite_Actor.prototype.updateSummonEffect = function(actor){
    if(!actor){
        return;
    }
    if(actor.isStartingSummonEffect()){
        this.startSummonEffect();
        actor.resetSummonEffect();
    }
    if(actor.isEndingSummonEffect()){
        this.endSummonEffect();
        actor.resetSummonEffect();
    }
    if(this._summonStart||this._summonEnd){
        if(this._summonFrame<60){
            this._summonFrame++;
        }
        if(this._summonFrame>60){
            this._summonFrame = 0;
            if(this._summonStart){
                this._summonInvisible = true;
            }
            if(this._summonEnd){
                this._summonInvisible = false;
            }
            this.finishSummonEffect();
        }
    }
}

function Sprite_Release() {
    this.initialize(...arguments);
}

Sprite_Release.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_Release.prototype.constructor = Sprite_Release;

Sprite_Release.prototype.initialize = function(){
    Sprite_Clickable.prototype.initialize.call(this);
    this.initMembers();
}

Sprite_Release.prototype.initMembers = function() {
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.scale.x = -1;
    this._homeX = Graphics.boxWidth/6*5;
    this._homeY = Graphics.boxHeight/6*5;
    this._offsetX = 0;
    this._offsetY = 0;
    this.x = this._homeX;
    this.y = this._homeY;    
    this._targetOffsetX = NaN;
    this._targetOffsetY = NaN;
    this._movementDuration = 0;
    this.visible= false;
    this._enemy = null;
    this._appear = false;
    this._disappear = false;
};

Sprite_Release.prototype.setEnemy = function(enemyId){
    this._enemy = $dataEnemies[enemyId];
    console.log(this._enemy)
	this.setHue(this._enemy.battlerHue);
}

Sprite_Release.prototype.loadBitmap = function(){
    this.bitmap = ImageManager.loadSvEnemy(this._enemy.battlerName);
}

Sprite_Release.prototype.startAppear = function(){
    this._appear = true;
    this.visible = true;
    this._motionFrame = 60;
}

Sprite_Release.prototype.startDisappear = function(){
    this._disappear = true;
    this._motionFrame = 60;
}

Sprite_Release.prototype.updateAppear = function(){
    if(this._motionFrame > 40){
        this.opacity = 255/20*(60-this._motionFrame);
        this.setColorTone([255,255,255,255]);
    }else if(this._motionFrame > 0){
        this.opacity = 255;
        const tone = 255/40 * this._motionFrame;
        this.setColorTone([tone,tone,tone,tone]);
    }else{
        this._appear = false;        
    }
    this._motionFrame--;
}

Sprite_Release.prototype.updateDisappear = function(){
    if(this._motionFrame > 20){
        this.opacity = 255;
        const tone = 255/40 * 40-(this._motionFrame-20);
        this.setColorTone([tone,tone,tone,tone]);
    }else if(this._motionFrame > 0){
        this.opacity = 255/20*this._motionFrame;
        this.setColorTone([255,255,255,255]);
    }else{
        this._disappear = false;
        this.bitmap = null;
        this.visible = false;
        BattleManager.releaseReset();
    }
    this._motionFrame--;
}

Sprite_Release.prototype.update = function(){
    Sprite_Clickable.prototype.update.call(this);
    if(BattleManager.releaseEnemy() > 0 && this.bitmap == null){
        this.setEnemy(BattleManager.releaseEnemy());
        this.loadBitmap();
    }
    if(BattleManager.isReleaseAppearing()){
        this.startAppear();
        BattleManager.resetReleaseAppearDisappear();
    }
    if(BattleManager.isReleaseDisappearing()){
        this.startDisappear();
        BattleManager.resetReleaseAppearDisappear();
    }
    if(this._appear){
        this.updateAppear();
    }
    if(this._disappear){
        this.updateDisappear();
    }
}

const _Spriteset_Battle_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer
Spriteset_Battle.prototype.createLowerLayer = function() {
    _Spriteset_Battle_createLowerLayer.apply(this,arguments);
    this.createReleaseMonster();
};

Spriteset_Battle.prototype.createReleaseMonster = function() {
    this._releaseSprite;
    this._releaseSprite = new Sprite_Release();
    this._battleField.addChild(this._releaseSprite);
};

BattleManager.releaseReady = function(enemyId){
    this._releaseEnemyId = enemyId;
    this._subject.startRelease(enemyId);
}

BattleManager.releaseEnemy = function(){
    return this._releaseEnemyId;
}

BattleManager.releaseReset = function(){
    this._releaseEnemyId = 0;
}

BattleManager.releaseAppear = function(){
    this._releaseAppear = true;
}

BattleManager.releaseDisappear = function(){
    this._releaseDisappear = true;
}

BattleManager.isReleaseAppearing = function(){
    return this._releaseAppear;
}

BattleManager.isReleaseDisappearing = function(){
    return this._releaseDisappear;
}

BattleManager.resetReleaseAppearDisappear = function(){
    this._releaseAppear = false;
    this._releaseDisappear = false;
}

Game_Action.prototype.evalDamageFormula = function(target) {
    try {
        const item = this.item();
        var a = this.subject(); // eslint-disable-line no-unused-vars
        if(a.isReleasing()){
            a = this.createReleaseEnemy();
        }
        const b = target; // eslint-disable-line no-unused-vars
        const v = $gameVariables._data; // eslint-disable-line no-unused-vars
        const sign = [3, 4].includes(item.damage.type) ? -1 : 1;
        const value = Math.max(eval(item.damage.formula), 0) * sign;
        return isNaN(value) ? 0 : value;
    } catch (e) {
        return 0;
    }
};
    
Game_Action.prototype.createReleaseEnemy = function(){
    const enemyId = this.subject().releasingMonster().id;
    const enemy = new Game_Enemy(enemyId, 0, 0);
    return enemy;
}