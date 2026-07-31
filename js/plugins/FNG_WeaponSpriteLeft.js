//=============================================================================
// FNG_WeaponSprite2.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc 左手攻撃時に表示されるスプライトを実装する
  * @author finga
  * @help 左手攻撃時に表示されるスプライトを実装する
*/

function Sprite_Weapon2() {
    this.initialize(...arguments);
}

Sprite_Weapon2.prototype = Object.create(Sprite_Weapon.prototype);
Sprite_Weapon2.prototype.constructor = Sprite_Weapon2;

Sprite_Weapon2.prototype.initialize = function(){
    Sprite_Weapon.prototype.initialize.call(this);
    //this._actor = actor;
}

Sprite_Weapon2.prototype.setActor = function(battler){
    this._actor = battler;
}

Sprite_Weapon2.prototype.actor = function(){
    return this._actor;
}

Sprite_Weapon2.prototype.isWeapon2 = function() {
    return true;
};

Sprite_Weapon.prototype.isWeapon2 = function() {
    return false;
};

Sprite_Actor.prototype.createWeaponSprite2 = function() {
    this._weaponSprite2 = new Sprite_Weapon2();
    this.addChild(this._weaponSprite2);
};

const _Sprite_Actor_setBattler2 = Sprite_Actor.prototype.setBattler;
Sprite_Actor.prototype.setBattler = function(battler) {
    _Sprite_Actor_setBattler2.apply(this,arguments);
    this._weaponSprite2.setActor(battler);
};

Sprite_Weapon2.prototype.setFrame = function(x,y,w,h) {
    //console.log("Sprite_Weapon setFrame",x,y,w,h);
    //console.log("Sprite_Weapon2 setFrame x,y",this.x,this.y);
    Sprite.prototype.setFrame.call(this,x,y,w,h);
    this.visible = true;
};

Sprite_Weapon2.prototype.updateWeaponMotion = function() {
    //console.log("Sprite_Weapon2,updateWeaponMotion",this._motionIndex,this._allAnimationCount);
    if(this._allAnimationCount <= 8){
        this._pattern = 0;
        this.anchor.x = 0;
        this.anchor.y = 1;
    }else if(this._allAnimationCount <= 16){
        this._pattern = 1;
        this.anchor.x = 1;
        this.anchor.y = 1;
    }else{
        this._pattern = 2;
        this.anchor.x = 1;
        this.anchor.y = 1;
    }
    this.rotation = 0 * Math.PI / 180;
    //onionL オニオン左---------------------------------------------------------------
    if(this._motionIndex == 49){
        //onion onionL
        if(this._motionIndex == 49){
            if(Math.floor(this._allAnimationCount/4)%2 == 0){
                this._pattern = 0;
                this.anchor.x = 0;
                this.anchor.y = 1;
            }else{
                this._pattern = 2;
                this.anchor.x = 1;
                this.anchor.y = 1;
            }
        }
        //槍
        if((!this._exImage&&(this._weaponImageId == 11||this._weaponImageId == 12))||
        this._exImage == "Spire1"||this._exImage == "Spire2"||this._exImage == "Lance1"||
        this._exImage == "Lance2"){
            this._pattern = 1;
            this.anchor.x = 1;
            this.anchor.y = 21/24;
            if(this._allAnimationCount<=9){
                this.rotation = 135 * Math.PI / 180;
                this.x = -$DOT*5;
                this.y = -$DOT*24;
            }else{
                this.rotation = 45 * Math.PI / 180;
                this.x = -$DOT*2;
                this.y = $DOT*4;
            }
        }else{
            if (this._pattern == 0){
                this.x = $DOT*4;
                this.y = -$DOT*20;
            }
            if (this._pattern == 1){
                this.x = -$DOT*22;
                this.y = -$DOT*8;
            }
            if (this._pattern == 2){
                this.x = -$DOT*4;
                this.y = -$DOT*8;
            }
        }
    }
    
    // setupSpireDive POD槍の構え---------------------------------------------------------------
    if(this._motionIndex == 203){
        this.anchor.x = 1;
        this.anchor.y = 18/24;
        this.rotation = 0 * Math.PI / 180;
        this.x = $DOT*20;
        this.y = $DOT*8;
    }
    
    // gunshotL 銃撃左---------------------------------------------------------------
    if(this._motionIndex == 205){
        
        //console.log("gunshotL",this._allAnimationCount);

        if(this._allAnimationCount == 1){
            AudioManager.playSe({"name":"ETC gunreload","volume":100,"pitch":100,"pan":0});
        }
        this.anchor.x = 39/48;
        this.anchor.y = 26/32;
        this.x = -$DOT*10;
        this.y = -$DOT*10;
        if(this._allAnimationCount <= 12){
            this._pattern = 0;
        }else if(this._allAnimationCount <= 18){
            this._pattern = 1;
        }else if(this._allAnimationCount <= 24){
            this._pattern = 2;
        }else if(this._allAnimationCount <= 30){
            this._pattern = 0;
        }else{
            this._motionIndex = 0;
        }
    }
    
    // gunshotLmiss 銃撃左ミス---------------------------------------------------------------
    if(this._motionIndex == 207){
        if(this._allAnimationCount == 1){
            AudioManager.playSe({"name":"ETC gunreload","volume":100,"pitch":100,"pan":0});
        }
        this.anchor.x = 39/48;
        this.anchor.y = 26/32;
        this.x = -$DOT*10;
        this.y = -$DOT*10;
        this._pattern = 0;
    }
    this._allAnimationCount++;
    //console.log(this.y)
    this.y += this._plusY;
    let w = 0;
    let h = 0;
    if(this._pageId !== 3){
        w = Math.floor(this.bitmap.width / 6);
    }else{
        w = Math.floor(this.bitmap.width / 3);
    }
    h = Math.floor(this.bitmap.height / 6);
    const xa = w*this._pattern+Math.floor((this._weaponImageId-1)%12/6)*w*3;
    const ya = h*((this._weaponImageId-1)%6);
    this.setFrame(xa,ya,w,h);

};