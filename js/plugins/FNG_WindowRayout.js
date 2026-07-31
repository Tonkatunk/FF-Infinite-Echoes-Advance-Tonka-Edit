$TILE = 16;
$DOT = $TILE/16;

Scene_Boot.prototype.screenWidth = function(){
    var value = $dataSystem.advanced.screenWidth;
    if($gameVariables.value(1001) == 1){
        value = 240;
    }else{
    }
    return value;
}

Scene_Boot.prototype.screenHeight = function(){
    var value = $dataSystem.advanced.screenHeight;
    if($gameVariables.value(1001) == 1){
        value = 208;
    }else{
    }
    return value;
}

Scene_Boot.prototype.resizeScreen = function() {
    Graphics.resize(this.screenWidth(), this.screenHeight());
    this.adjustBoxSize();
    this.adjustWindow();
};

Scene_Boot.prototype.adjustBoxSize = function() {
    Graphics.boxWidth = this.screenWidth();
    Graphics.boxHeight = this.screenHeight();
};

Window_Base.prototype.updatePadding = function() {
    this.padding = $gameSystem.windowPadding()*1.25;
};

Window_Base.prototype.lineHeight = function() {
    return $DOT*9;
};

Window_Base.prototype.updateBackOpacity = function() {
    this.backOpacity = 255;
};

Window_Base.prototype.itemPadding = function() {
    return $DOT;
};

Window_Base.prototype.drawItemName = function(item, x, y, width) {
    if (item) {
        const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
        const itemWidth = Math.max(0, width);
        this.resetTextColor();
        this.drawIcon(item.iconIndex, x - this.contents.fontSize/2, iconY);
        this.drawText(item.name, x + this.contents.fontSize, y, itemWidth);
    }
};

Window_Base.prototype.processDrawIcon = function(iconIndex, textState) {
    if (textState.drawing) {
        this.drawIcon(iconIndex, textState.x + ImageManager.iconWidth/4 , textState.y + 2 - ImageManager.iconHeight/2);
    }
    textState.x += ImageManager.iconWidth;
};

Window_Selectable.prototype.itemHeight = function() {
    return Window_Scrollable.prototype.itemHeight.call(this);
};

Window_Selectable.prototype.drawBackgroundRect = function(rect) {
    
};

Window_Message.prototype.lineHeight = function() {
    return $DOT*11;
};

//アクターの設定により切り抜きY座標をずらす
Window_Base.prototype.drawFaceEx = function(
    faceName, faceIndex, x, y, width, height,cutY
) {
    width = width || ImageManager.faceWidth;
    height = height || ImageManager.faceHeight;
    const bitmap = ImageManager.loadFace(faceName);
    const pw = ImageManager.faceWidth;
    const ph = ImageManager.faceHeight;
    const sw = Math.min(width, pw);
    const sh = Math.min(height, ph);
    const dx = Math.floor(x + Math.max(width - pw, 0) / 2);
    const dy = Math.floor(y + Math.max(height - ph, 0) / 2);
    const sx = Math.floor((faceIndex % 4) * pw + (pw - sw) / 2);
    const sy = Math.floor(Math.floor(faceIndex / 4) * ph + (ph - sh) / 2) + cutY;
    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
};

Window_Help.prototype.lineHeight = function() {
    return this.contents.fontSize * 1.1;
};
