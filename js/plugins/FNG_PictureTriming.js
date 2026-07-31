Game_Picture.prototype.frame = function() {
    return this._frame;
};

Game_Picture.prototype.setFrame = function(sx,sy,w,h) {
    this._frame = [sx,sy,w,h];
};

Game_Picture.prototype.clearFrame = function() {
    this._frame = null;
};

const _Game_Picture_initBasic = Game_Picture.prototype.initBasic;
Game_Picture.prototype.initBasic = function() {
    _Game_Picture_initBasic.apply(this,arguments);
    this.clearFrame();
};

const _Sprite_Picture_update = Sprite_Picture.prototype.update;
Sprite_Picture.prototype.update = function() {
    _Sprite_Picture_update.apply(this,arguments);
    if (this.visible) {
        this.updateFrame();
    }
};

Sprite_Picture.prototype.updateFrame = function() {
    const picture = this.picture();
    const frame = picture.frame()
    if(frame){
        this.setFrame(frame[0],frame[1],frame[2],frame[3]);
    }
};