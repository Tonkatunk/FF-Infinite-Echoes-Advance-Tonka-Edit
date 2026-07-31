var _window_Selectable_initialize = Window_Selectable.prototype.initialize;
Window_Selectable.prototype.initialize = function(rect) {
    _window_Selectable_initialize.apply(this,arguments);
    var cursorBitmap = ImageManager.loadBitmap('img/system/','Cursor' , 0, true)
    this._cSprite = new Sprite(cursorBitmap);
    this.addChild(this._cSprite);
};

Window_Selectable.prototype.updateCursorSprite = function(){
	if(!this._cSprite){
		return;
	}
    if(this.active == false || this.visible == false){
        this._cSprite.opacity = 0;
    }else{
        this._cSprite.opacity = 255;
    }
    const rect = this.itemRect(this.index());
    
    const cx = rect.x-this._cSprite.width/2;
    const cy = rect.y+rect.height/2-this._cSprite.height/3-this._scrollY % this.scrollBlockHeight();
    this._cSprite.x = Math.floor(cx);
    this._cSprite.y = Math.floor(cy);
    this._cSprite.visible = this.visible;
}

Window_Selectable.prototype.update = function() {
    this.processCursorMove();
    this.processHandling();
    this.processTouch();
    this.updateCursorSprite();
    Window_Scrollable.prototype.update.call(this);
};



