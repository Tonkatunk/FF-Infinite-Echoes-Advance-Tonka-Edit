const _sprite_StateOverlay_updateFrame = Sprite_StateOverlay.prototype.updateFrame;
Sprite_StateOverlay.prototype.updateFrame = function() {
    _sprite_StateOverlay_updateFrame.apply(this,arguments);
    if(this._battler){
        this.scale.x = Math.max(this._battler.width / ($TILE*6),1/3);
    }else{
        this.scale.x = 1;
    }
    this.scale.y = this.scale.x;
};

const _sprite_Actor_setBattler
 = Sprite_Actor.prototype.setBattler;
Sprite_Actor.prototype.setBattler = function(battler) {
    _sprite_Actor_setBattler.apply(this,arguments);
    for(sprites of this._stateSprites){
        sprites.setup(battler);
    }
};

//敵側のアイコン表示を使わない
Sprite_Enemy.prototype.updateStateSprite = function() {
    /*this._stateIconSprite.y = -Math.round((this.bitmap.height + 40) * 0.9);
    if (this._stateIconSprite.y < 20 - this.y) {
        this._stateIconSprite.y = 20 - this.y;
    }*/
};

Sprite_StateIcon.prototype.updateIcon = function() {
    /*
    const icons = [];
    if (this.shouldDisplay()) {
        icons.push(...this._battler.allIcons());
    }
    if (icons.length > 0) {
        this._animationIndex++;
        if (this._animationIndex >= icons.length) {
            this._animationIndex = 0;
        }
        this._iconIndex = icons[this._animationIndex];
    } else {
        this._animationIndex = 0;
        this._iconIndex = 0;
    }*/
};


Sprite_Enemy.prototype.createStateIconSprite = function() {
    //基本使わないが動作の都合上残しておく
    this._stateIconSprite = new Sprite_StateIcon();
    this._stateIconSprite.visible = false;
    this.addChild(this._stateIconSprite);
    
    //オーバーレイを表示するステート
    //毒…4 暗闇…5 沈黙…6 混乱…8 睡眠…10
    //麻痺…12 リレイズ…49
    //バファイ…50 バコルド…51 バサンダ…52 バウォタ…53 バエアロ…54
    const olStates = [4,5,6,8,10,12,49,50,51,52,53,54];
    this._stateSprites = [];
    
    for(let i=0;i<olStates.length;i++){
        this._stateSprites.push(new Sprite_StateOverlayEx(olStates[i]));
        this.addChild(this._stateSprites[i]);
    }
};

const _sprite_Enemy_setBattler
 = Sprite_Enemy.prototype.setBattler;
Sprite_Enemy.prototype.setBattler = function(battler) {
    _sprite_Enemy_setBattler.apply(this,arguments);
    for(sprites of this._stateSprites){
        sprites.setup(battler);
    }
};

//override
Sprite_Actor.prototype.createStateSprite = function() {
    //基本使わないが動作の都合上残しておく
    this._stateSprite = new Sprite_StateOverlay();
    this._stateSprite.visible = false;
    this.addChild(this._stateSprite);
    
    //オーバーレイを表示するステート
    //毒…4 暗闇…5 沈黙…6 混乱…8 睡眠…10
    //麻痺…12 リレイズ…49
    //バファイ…50 バコルド…51 バサンダ…52 バウォタ…53 バエアロ…54
    const olStates = [4,5,6,8,10,12,49,50,51,52,53,54];
    this._stateSprites = [];
    
    for(let i=0;i<olStates.length;i++){
        this._stateSprites.push(new Sprite_StateOverlayEx(olStates[i]));
        this.addChild(this._stateSprites[i]);
    }
};

//override
Sprite_Enemy.prototype.createStateSprite = function() {
    //基本使わないが動作の都合上残しておく
    this._stateSprite = new Sprite_StateOverlay();
    this._stateSprite.visible = false;
    this.addChild(this._stateSprite);
    
    //オーバーレイを表示するステート
    //毒…4 暗闇…5 沈黙…6 混乱…8 睡眠…10
    //麻痺…12 リレイズ…49
    //バファイ…50 バコルド…51 バサンダ…52 バウォタ…53 バエアロ…54
    const olStates = [4,5,6,8,10,12,49,50,51,52,53,54];
    this._stateSprites = [];
    
    for(let i=0;i<olStates.length;i++){
        this._stateSprites.push(new Sprite_StateOverlayEx(olStates[i]));
        this.addChild(this._stateSprites[i]);
    }
};


function Sprite_StateOverlayEx() {
    this.initialize(...arguments);
}

Sprite_StateOverlayEx.prototype = Object.create(Sprite_StateOverlay.prototype);
Sprite_StateOverlayEx.prototype.constructor = Sprite_StateOverlayEx;

Sprite_StateOverlayEx.prototype.initialize = function(stateId) {
    this._stateId = stateId;
    Sprite_StateOverlay.prototype.initialize.call(this);
};

Sprite_StateOverlayEx.prototype.loadBitmap = function() {
    //グループによって読み込むビットマップを変える
    const groupA = [4,5,12];
    if(groupA.includes(this._stateId)){
        this.bitmap = ImageManager.loadSystem("States");
    }else{
        this.bitmap = ImageManager.loadSystem("ExStates");        
    }
    this.setFrame(0, 0, 0, 0);
};

Sprite_StateOverlayEx.prototype.getFrameY = function() {
    switch(this._stateId){
        case 4:
            return 96*0;
        case 5:
            return 96*1;
        case 6:
            return 96*8;
        case 8:
            return 96*0;
        case 10:
            return 96*6;
        case 12:
            return 96*7;
        case 49:
            return 96*7;
        case 50:
            return 96*1;
        case 51:
            return 96*4;
        case 52:
            return 96*2;
        case 53:
            return 96*3;
        case 54:
            return 96*5;
    }
};

Sprite_StateOverlayEx.prototype.updateFrame = function() {
    if (this._battler && this._battler.isStateAffected(this._stateId)) {
        const w = 96;
        const h = 96;
        const sx = this._pattern * w;
        const sy = this.getFrameY();
        this.setFrame(sx, sy, w, h);
        this.updatePosition();
    } else {
        this.setFrame(0, 0, 0, 0);
    }
};

Sprite_StateOverlayEx.prototype.updatePosition = function() {
    this.scale.x = 0.33;
    this.scale.y = 0.33;
    if(this._stateId == 4 || this._stateId == 12|| this._stateId == 50 || this._stateId == 51 || this._stateId == 52 || this._stateId == 53 || this._stateId == 54){ //毒・麻痺・バ系
        this.scale.x = Math.max(this._battler.width / ($TILE*6),1/3);
        this.scale.y = this.scale.x;
        this.x = 0;
        if(this._stateId == 4){ //毒
            this.y = this.height*this.scale.y-this._battler.height;
        }else{
            this.y = 0;
        }
    }
    if(this._stateId == 5){ //暗闇
        this.anchor.x = 0.416667;
        this.anchor.y = 0.416667;
        this.scale.x = Math.max(this._battler.width / ($TILE*6),1/3);
        this.scale.y = this.scale.x;
        this.x = this._battler.headX();
        this.y = this._battler.headY()+4;
    }
    if(this._stateId == 8){ //混乱
        this.anchor.x = 0.5;
        this.anchor.y = 0.2;
        this.x = this._battler.headX();
        this.y = this._battler.headY() - 16;
    }
    if(this._stateId == 49){ //リレイズ
        this.anchor.x = 0.5;
        this.anchor.y = 0.125;
        this.x = this._battler.headX();
        this.y = this._battler.headY() - 16;
    }
    if(this._stateId == 6){ //沈黙
        this.anchor.x = 0.572;
        this.anchor.y = 0.3229;
        if(this._battler.isEnemy()){
            this.scale.x *= -1;
            this.x = this._battler.headX() + 8;
        }else{ 
            this.x = this._battler.headX() - 8;
        }
        this.y = this._battler.headY() - 4;
    }
    if(this._stateId == 10){ //睡眠
        this.anchor.x = 0.25;
        this.anchor.y = 0.25;
        this.x = this._battler.headX() - 16;
        this.y = this._battler.headY() + 8;
    }
};

Game_Battler.prototype.headX = function(){
    var xpoint = this.width * 0.5 - this.width/2;
    if(this.isEnemy() && this.enemy() && this.enemy().meta['head']){
        xpoint = this.width * Number(this.enemy().meta['head'].split(',')[0]) - this.width/2;
    }
    return Math.floor(xpoint);
}

Game_Battler.prototype.headY = function(){
    var ypoint = this.height * 0.4 - this.height;
    if(this.isEnemy() && this.enemy() && this.enemy().meta['head']){
        ypoint = this.height * Number(this.enemy().meta['head'].split(',')[1])-this.height;
    }
    return Math.floor(ypoint);
}