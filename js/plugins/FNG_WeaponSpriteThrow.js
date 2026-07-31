//=============================================================================
// FNG_WeaponSpriteThrow.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc 投げる際に表示されるスプライトを実装する
  * @author finga
  * @help 投げる際に表示されるスプライトを実装する
*/

function Sprite_WeaponThrow() {
    this.initialize(...arguments);
}

Sprite_WeaponThrow.prototype = Object.create(Sprite_Weapon.prototype);
Sprite_WeaponThrow.prototype.constructor = Sprite_WeaponThrow;

Sprite_WeaponThrow.prototype.initialize = function(){
    Sprite_Weapon.prototype.initialize.call(this);
    this.setFrame(0,0,0,0);
}

Sprite_WeaponThrow.prototype.setActor = function(battler){
    this._actor = battler;
}

Sprite_WeaponThrow.prototype.actor = function(){
    return this._actor;
}

Sprite_WeaponThrow.prototype.update = function(){
    const subject = BattleManager.subject();
    var actor;
    if(subject){
        actor = subject.isActor() ? subject : null;
    }
    
    if(actor && actor.isStartingThrowMotion()){
        actor.resetThrowMotion();
        this.initThrowSprite();
        this.visible = false;
    }
    if(this._throwFrame > 0){
        this.updateThrowFrame();
        this.visible = true;
        this.updateThrowCoordinate();
        this._throwFrame--;
    }
    if(this._throwFrame <= 0){
        this.visible = false;
    }
    Sprite_Weapon.prototype.update.call(this);
}

Sprite_WeaponThrow.prototype.updateThrowCoordinate = function(){
    switch(this.throwMotionType()){
        case "straight":
            this.updateThrowStright();
            break;
        case "arc":
            this.updateThrowArc();
            break;
        case "bound":
            this.updateThrowBound();
            break;
        case "spin":
            this.updateThrowSpin();
            break; 
    }
}


Sprite_WeaponThrow.prototype.initThrowSprite = function(){
    this._throwFrame = 25;
    this.loadThrowBitmap();
    this.visible = true;
}

Sprite_WeaponThrow.prototype.updateThrowArc = function(){
    const actor = BattleManager.subject();
    this._actor = actor;
    
    if(this._throwFrame > 20){
        this._pattern = 0;
        const sx = actor.throwFromCoordinate().x+$DOT*12;
        const sy = actor.throwFromCoordinate().y;
        this.anchor.x = 0.5;
        this.anchor.y = 27/32;
        this.x = sx;
        this.y = sy;
        this.rotation = 0;
    }else if(this._throwFrame > 10){
        this._pattern = 1;
        const sx = actor.throwFromCoordinate().x;
        const sy = actor.throwFromCoordinate().y;
        const ex = actor.throwToCoordinate().x;
        const ey = actor.throwToCoordinate().y;
        this.anchor.x = 0.5;
        this.anchor.y = 27/32;
        this.x = sx+(ex-sx)/10*(10-(this._throwFrame-10));
        this.y = sy+(ey-sy)/10*(10-(this._throwFrame-10));
        this.rotation = 0;
    }else{
        this._pattern = 1;
        const sx = actor.throwFromCoordinate().x;
        const sy = actor.throwFromCoordinate().y;
        const ex = actor.throwToCoordinate().x;
        const ey = actor.throwToCoordinate().y;
        this.anchor.x = 0.5;
        this.anchor.y = 27/32;
        this.x = ex;
        this.y = ey;
        this.rotation = 0;
    }
    if(this._throwFrame == 10){
        AudioManager.playSe({"name":"FF6 scratch","volume":90,"pitch":100,"pan":0})
    }
}

Sprite_WeaponThrow.prototype.updateThrowBound = function(){
    const actor = BattleManager.subject();
    this._actor = actor;
    
    if(this._throwFrame == 24){
        AudioManager.playSe({"name":"FF6 wheel","volume":90,"pitch":100,"pan":0})
    }    
    if(this._throwFrame == 16){
        AudioManager.playSe({"name":"FF6 wheel","volume":90,"pitch":100,"pan":0})
    }    
    if(this._throwFrame == 8){
        AudioManager.playSe({"name":"FF6 wheel","volume":90,"pitch":100,"pan":0})
    }
    if(this._throwFrame > 20){
        this._pattern = 0;
        const sx = actor.throwFromCoordinate().x+$DOT*12;
        const sy = actor.throwFromCoordinate().y;
        this.anchor.x = 8/32;
        this.anchor.y = 24/32;
        this.x = sx;
        this.y = sy;
        this.rotation = 0;
    }else if(this._throwFrame > 10){
        this._pattern = 1;
        const sx = actor.throwFromCoordinate().x;
        const sy = actor.throwFromCoordinate().y;
        const ex = actor.throwToCoordinate().x;
        const ey = actor.throwToCoordinate().y;
        this.anchor.x = 8/32;
        this.anchor.y = 24/32;
        this.x = sx+(ex-sx)/10*(10-(this._throwFrame-10));
        this.y = sy+(ey-sy)/10*(10-(this._throwFrame-10));
        this.rotation = this._throwFrame * 25 * Math.PI / 180;
    }else{
        this._pattern = 1;
        const sx = actor.throwToCoordinate().x;
        const sy = actor.throwToCoordinate().y;
        const ex = -16;
        const ey = Graphics.boxHeight/3;
        this.anchor.x = 8/32;
        this.anchor.y = 24/32;
        this.x = sx+(ex-sx)/10*(10-(this._throwFrame));
        this.y = sy+(ey-sy)/10*(10-(this._throwFrame));
        this.rotation = this._throwFrame * 25 * Math.PI / 180;
    }
    if(this._throwFrame == 10){
        AudioManager.playSe({"name":"FF5 hit","volume":90,"pitch":100,"pan":0})
    }
}

Sprite_WeaponThrow.prototype.updateThrowSpin = function(){
    const actor = BattleManager.subject();
    this._actor = actor;
    
    if(this._throwFrame == 24){
        AudioManager.playSe({"name":"FF6 wheel","volume":90,"pitch":100,"pan":0})
    }    
    if(this._throwFrame == 16){
        AudioManager.playSe({"name":"FF6 wheel","volume":90,"pitch":100,"pan":0})
    }    
    if(this._throwFrame == 8){
        AudioManager.playSe({"name":"FF6 wheel","volume":90,"pitch":100,"pan":0})
    }
    if(this._throwFrame > 20){
        this._pattern = 0;
        const sx = actor.throwFromCoordinate().x+$DOT*12;
        const sy = actor.throwFromCoordinate().y;
        this.anchor.x = 8/32;
        this.anchor.y = 24/32;
        this.x = sx;
        this.y = sy;
        this.rotation = 0;
    }else if(this._throwFrame > 10){
        this._pattern = 1;
        const sx = actor.throwFromCoordinate().x;
        const sy = actor.throwFromCoordinate().y;
        const ex = actor.throwToCoordinate().x;
        const ey = actor.throwToCoordinate().y;
        this.anchor.x = 8/32;
        this.anchor.y = 24/32;
        this.x = sx+(ex-sx)/10*(10-(this._throwFrame-10));
        this.y = sy+(ey-sy)/10*(10-(this._throwFrame-10));
        this.rotation = this._throwFrame * 25 * Math.PI / 180;
    }else{
        this._pattern = 2;
        const sx = actor.throwFromCoordinate().x;
        const sy = actor.throwFromCoordinate().y;
        const ex = actor.throwToCoordinate().x;
        const ey = actor.throwToCoordinate().y;
        this.anchor.x = 8/32;
        this.anchor.y = 24/32;
        this.x = ex;
        this.y = ey;
        this.rotation = 180 * Math.PI / 180;
    }
    if(this._throwFrame == 10){
        AudioManager.playSe({"name":"FF6 scratch","volume":90,"pitch":100,"pan":0})
    }
}

Sprite_WeaponThrow.prototype.updateThrowStright = function(){
    const actor = BattleManager.subject();
    this._actor = actor;
    
    if(this._throwFrame > 20){
        this._pattern = 0;
        const sx = actor.throwFromCoordinate().x+$DOT*12;
        const sy = actor.throwFromCoordinate().y;
        this.anchor.x = 5/32;
        this.anchor.y = 27/32;
        this.x = sx;
        this.y = sy;
        this.rotation = 0;
    }else if(this._throwFrame > 10){
        this._pattern = 1;
        const sx = actor.throwFromCoordinate().x;
        const sy = actor.throwFromCoordinate().y;
        const ex = actor.throwToCoordinate().x;
        const ey = actor.throwToCoordinate().y;
        this.anchor.x = 5/32;
        this.anchor.y = 27/32;
        this.x = sx+(ex-sx)/10*(10-(this._throwFrame-10));
        this.y = sy+(ey-sy)/10*(10-(this._throwFrame-10));
        this.rotation = 225 * Math.PI / 180;
    }else{
        this._pattern = 2;
        const sx = actor.throwFromCoordinate().x;
        const sy = actor.throwFromCoordinate().y;
        const ex = actor.throwToCoordinate().x;
        const ey = actor.throwToCoordinate().y;
        this.anchor.x = 5/32;
        this.anchor.y = 27/32;
        this.x = ex;
        this.y = ey;
        this.rotation = 225 * Math.PI / 180;
    }
    if(this._throwFrame == 10){
        AudioManager.playSe({"name":"FF6 scratch","volume":90,"pitch":100,"pan":0})
    }
}

Sprite_WeaponThrow.prototype.homeX = function(index){
    return Sprite_Actor.prototype.homeX.call(this,index);
}

Sprite_WeaponThrow.prototype.homeY = function(index){
    return Sprite_Actor.prototype.homeY.call(this,index);
}

Sprite_WeaponThrow.prototype.throwMotionType = function(){
    const actor = BattleManager.subject();
    const weapon = actor.throwWeapon();
    const typeId = weapon.wtypeId;
    //まっすぐ飛んでいき、突き刺さる
    const straightType = [7]; //短剣
    //弧を描いて飛んでいき、突き刺さる
    const arcType = [11,12]; //軽槍・重槍
    //回転しながら飛んでいき、ぶつかったらバウンドする
    const boundType = [14,15]; //杖・ロッド
    //該当しない場合、回転しながら飛んでいき、突き刺さるモーション
    if(straightType.includes(typeId)){
       return "straight";
    }
    if(arcType.includes(typeId)){
       return "arc";
    }
    if(boundType.includes(typeId)){
       return "bound";
    }
    return "spin";
}

Sprite_WeaponThrow.prototype.loadThrowBitmap = function() {
    const actor = BattleManager.subject();
    const weapon = actor.throwWeapon();
    
    if(weapon.meta.image){
       this.bitmap = 
        ImageManager.loadSystem("Weapons/"+weapon.meta['image'].split(',')[0]);
    }else{
        const weaponImageId = $dataSystem.attackMotions[weapon.wtypeId].weaponImageId;
        const pageId = Math.floor((weaponImageId - 1) / 12) + 1;
        this.bitmap = ImageManager.loadSystem("Weapons" + pageId);
    }
    this.setFrame(0,0,0,0);
};

Sprite_WeaponThrow.prototype.updateThrowFrame = function() {
    const actor = BattleManager.subject();
    const weapon = actor.throwWeapon();
    const weaponImageId = $dataSystem.attackMotions[weapon.wtypeId].weaponImageId;
    var index;
    var w;
    var h = Math.floor(this.bitmap.height / 6);
    
    if(weapon.meta.image){
        index = Number(weapon.meta['image'].split(',')[1])-1;
        w = Math.floor(this.bitmap.width / 6);
    }else{
        const pageId = Math.floor((weaponImageId - 1) / 12) + 1;
        index = (weaponImageId - 1) % 12;
        if(pageId !== 3){
            w = Math.floor(this.bitmap.width / 6);
        }else{
            w = Math.floor(this.bitmap.width / 3);
        }
    }

    //パターン０は投げる前、パターン１は投げている途中、パターン２は突き刺さった後
    //軽槍・重槍・爪・素手
    if(weaponImageId == 10 ||weaponImageId == 12 || weaponImageId == 0){
        if (this._pattern == 0){
            const sx = (Math.floor(index / 6) * 3) * w;
            const sy = Math.floor(index % 6) * h;
            this.setFrame(sx, sy, w, h);
            this.x = $DOT*10;
            this.y = -$DOT*22;
        }
        if (this._pattern == 1){
            const sx = (Math.floor(index / 6) * 3) * w;
            const sy = Math.floor(index % 6) * h;
            this.setFrame(sx, sy, w, h);
            this.x = 0;
            this.y = 0;
        }
        if (this._pattern == 2){
            const sx = (Math.floor(index / 6) * 3) * w;
            const sy = Math.floor(index % 6) * h;
            this.setFrame(sx+w/12, sy, w-w/12, h);
            this.x = 0;
            this.y = 0;
        }
        this.anchor.x = 0.5;
        this.anchor.y = 1;
    }else{
        if (this._pattern == 0){
            const sx = (Math.floor(index / 6) * 3) * w;
            const sy = Math.floor(index % 6) * h;
            this.setFrame(sx, sy, w, h);
            this.x = $DOT*26;
            this.y = -$DOT*10;
            this.anchor.x = 0.5;
            this.anchor.y = 1;
        }
        if (this._pattern == 1){
            const sx = (Math.floor(index / 6) * 3) * w;
            const sy = Math.floor(index % 6) * h;
            //wじゃなくてh
            this.setFrame(sx, sy, h, h);
            this.x = 0;
            this.y = 0;
        }
        if (this._pattern == 2){
            const sx = (Math.floor(index / 6) * 3) * w;
            const sy = Math.floor(index % 6) * h;
            //wじゃなくてh
            if(weaponImageId == 0){
                this.setFrame(sx, sy, h/32*4, h);
            }else{
                this.setFrame(sx, sy, h/32*8, h);
            }
            this.x = 0;
            this.y = 0;
        }        
    }
};

Spriteset_Base.prototype.createThrowWeaponSprite = function() {
    this._throwWeaponSprite = new Sprite_WeaponThrow();
    this.addChild(this._throwWeaponSprite);
};

const _Spriteset_Base_createUpperLayer = Spriteset_Base.prototype.createUpperLayer;
Spriteset_Base.prototype.createUpperLayer = function() {
    this.createThrowWeaponSprite();
    _Spriteset_Base_createUpperLayer.apply(this,arguments);
};

BattleManager.subject = function(){
    return this._subject;
}