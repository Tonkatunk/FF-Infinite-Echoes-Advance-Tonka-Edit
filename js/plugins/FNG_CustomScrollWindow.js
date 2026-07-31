Game_Party.prototype.setScrollMessageSpeed = function(rate){
    this._scrollMessageSpeed = rate;
}

Game_Party.prototype.scrollMessageSpeed = function(){
    if(!this._scrollMessageSpeed){
        this._scrollMessageSpeed = 1;
    }
    return this._scrollMessageSpeed;
}

Game_Party.prototype.resetScrollMessageSpeed = function(rate){
    this._scrollMessageSpeed = 1;
}

Window_ScrollText.prototype.scrollSpeed = function() {
    const rate = $gameParty.scrollMessageSpeed();
    let speed = $gameMessage.scrollSpeed() / 2 * rate;
    if (this.isFastForward()) {
        speed = $gameMessage.scrollSpeed() /2 * this.fastForwardRate();
    }
    return speed;
};

Window_ScrollText.prototype.lineHeight = function() {
    return 14;
};
