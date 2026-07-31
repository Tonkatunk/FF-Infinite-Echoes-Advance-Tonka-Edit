Bitmap.prototype._drawTextBody = function(text, tx, ty, maxWidth) {
    const context = this.context;
    context.filter = 'none';
    context.fillStyle = "#000000";
    context.fillText(text, tx, ty+1, maxWidth);
    context.fillText(text, tx+1, ty+1, maxWidth);
    context.fillText(text, tx+1, ty, maxWidth);
    context.fillStyle = this.textColor;
    context.fillText(text, tx, ty, maxWidth);
    //context.fillText(text, tx, ty, maxWidth);
};

Bitmap.prototype._drawTextOutline = function(text, tx, ty, maxWidth) {

};

var _bitmap_prototype_drawText = Bitmap.prototype.drawText;
Bitmap.prototype.drawText = function(text, x, y, maxWidth, lineHeight, align) {
    if(this.fontSize == 8){
        _bitmap_prototype_drawText.apply(this,arguments);      
    }else{
        _bitmap_prototype_drawText.apply(this,arguments);
    }
};