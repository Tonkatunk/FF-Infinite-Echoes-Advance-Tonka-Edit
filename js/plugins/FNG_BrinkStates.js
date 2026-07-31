//=============================================================================
// FNG_BrinkStates.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc 物理攻撃を2回回避する分身ステートを作成する
  * @author finga
  * @help 物理攻撃を2回回避する分身ステートを作成する
*/

//ステートを追加した時、時間経過が影響するステートの数値を代入する
const _Game_Battler_addState2 = Game_Battler.prototype.addState;
Game_Battler.prototype.addState = function(stateId) { 
    _Game_Battler_addState2.apply(this,arguments);
    if(stateId == 45){ // 分身の数を代入
        this._avatarNum = 2;
    }
};

Game_Battler.prototype.avatarNum = function() {
    var value = 0
    if(this._avatarNum > 0){
        value = this._avatarNum
    }
    return value;
};


Game_Battler.prototype.reduceAvatar = function(value) {
    if(this._avatarNum > 0){ // 分身の数を代入
        this._avatarNum -= value;
    }
    if(this._avatarNum <= 0){ // 分身の数を代入
        this.removeState(45);
    }
};

const _Sprite_Actor_initMembers2 = Sprite_Actor.prototype.initMembers;
Sprite_Actor.prototype.initMembers = function() {
    _Sprite_Actor_initMembers2.apply(this,arguments);
    this.createAvatarSprite();
};

Sprite_Actor.prototype.updateBitmap = function() {
    Sprite_Battler.prototype.updateBitmap.call(this);
    const name = this._actor.battlerName();
    if (this._battlerName !== name) {
        this._battlerName = name;
        this._mainSprite.bitmap = ImageManager.loadSvActor(name);
        
        if(this._avatarSprites){
            for(as of this._avatarSprites){
                as.bitmap = this._mainSprite.bitmap;
                as.opacity = this._mainSprite.opacity/2;
            }
        }
    }
    if(this._avatarSprites){
        for(as of this._avatarSprites){
            as.opacity = this._mainSprite.opacity/2;
        }
    }
};

Sprite_Actor.prototype.isAfterimage = function() {
    return false;
}

Sprite_Actor.prototype.createAvatarSprite = function() {
    this._avatarSprites = [];
    for(let i=0;i<2;i++){
        let as = new Sprite();
        as.x += $TILE/2*(i+1);
        as.anchor.x = 0.5;
        as.anchor.y = 1;
        //as.opacity = 127;
        as.visible = false;
        this._avatarSprites.push(as);
        this.addChild(as);
    }
};


const _Sprite_Enemy_initMembers = Sprite_Enemy.prototype.initMembers;
Sprite_Enemy.prototype.initMembers = function() {
    _Sprite_Enemy_initMembers.apply(this,arguments);
    this.createAvatarSprite();
};

Sprite_Enemy.prototype.createAvatarSprite = function() {
    this._avatarSprites = [];
    for(let i=0;i<2;i++){
        let as = new Sprite();
        as.x -= $TILE/2*(i+1);
        as.anchor.x = 0.5;
        as.anchor.y = 1;
        as.opacity = 127;
        as.visible = false;
        this._avatarSprites.push(as);
        this.addChild(as);
    }
};

const _Sprite_Enemy_loadBitmap = Sprite_Enemy.prototype.loadBitmap;
Sprite_Enemy.prototype.loadBitmap = function(name) {
    _Sprite_Enemy_loadBitmap.apply(this,arguments);
    if(!this._avatarSprites){
        return;
    }
    for(as of this._avatarSprites){
        as.bitmap = this.bitmap;
    }
};


const _Sprite_Enemy_updateFrame = Sprite_Enemy.prototype.updateFrame;
Sprite_Enemy.prototype.updateFrame = function() {
    _Sprite_Enemy_updateFrame.apply(this,arguments);
    Sprite_Battler.prototype.updateFrame.call(this);
    for(as of this._avatarSprites){
        as.setFrame(0, 0, this.bitmap.width, this.bitmap.height);
    }
    if(this._battler._avatarNum >= 2){
        this._avatarSprites[1].visible = true;
    }else{
        this._avatarSprites[1].visible = false;            
    }
    if(this._battler._avatarNum >= 1){
        this._avatarSprites[0].visible = true;
    }else{
        this._avatarSprites[0].visible = false;            
    }
};

