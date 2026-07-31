Sprite_Timer.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._seconds = 0;
    this.createBitmap();
    this.createDigits();
    this.update();
};

Sprite_Timer.prototype.createDigits = function() {
    this._digits = [];
    for(let i = 0;i<5;i++){
        const sprite = new Sprite();
        sprite.bitmap = ImageManager.loadSystem("Damage");
        sprite.setFrame(0,0,0,0);
        this._digits.push(sprite)
        sprite.x = -20 + 8*i;
        this.addChild(sprite);
    }
};

Sprite_Timer.prototype.redraw = function() {
    const text = this.timerText();
    for(let i = 0;i<this._digits.length;i++){
        const char = text.charAt(i);
        if(char == ":"){
            this._digits[i].setFrame(16,32,8,8);
        }else{
            const num = Number(char);
            this._digits[i].setFrame(num*8,0,8,8);
        }
    }
    //this.bitmap.clear();
    //this.bitmap.drawText(text, 0, 0, width, height, "center");
};

Sprite_Timer.prototype.updatePosition = function() {
    if ($gameParty.inBattle()) {
        this.x = 22;
        this.y = 100;
    } else {
        this.x = Graphics.boxWidth - 22;
        this.y = Graphics.boxHeight - 12;
    }
};

Sprite_Timer.prototype.updateBitmap = function() {
    if (this._seconds !== $gameTimer.seconds()) {
        this._seconds = $gameTimer.seconds();
        this.redraw();
    }
};
