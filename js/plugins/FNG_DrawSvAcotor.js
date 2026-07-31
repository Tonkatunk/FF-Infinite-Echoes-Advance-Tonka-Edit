var _window_StatusBase_Initialize = Window_StatusBase.prototype.initialize;
Window_StatusBase.prototype.initialize = function(rect) {
    _window_StatusBase_Initialize.apply(this,arguments);
    this.loadSvActorImages();
};

Window_StatusBase.prototype.loadSvActorImages = function() {
    for (const actor of $gameParty.members().concat($gameParty.subMembers())) {
        if(!actor||actor=="OK"){
            return;
        }
        ImageManager.loadSvActor(actor.battlerName());
        if(actor.hasSkill(1000)){
            if(actor.isStateAffected(14)){
                ImageManager.loadSvActor(actor.battlerName());
            }else{
                ImageManager.loadSvActor("trance/"+actor.battlerName());
            }
        };
    }
};

Window_Base.prototype.drawSvActor = function(
    SvActorName, svActorIndex, x, y
) {
    const bitmap = ImageManager.loadSvActor(SvActorName);
    const width = bitmap.width;
    const height = bitmap.height;
    const sx = (svActorIndex % 9) * width/9;
    const sy = Math.floor(svActorIndex / 9) * height/6;
    bitmap.addLoadListener(function() {
        this.contents.blt(bitmap,sx,sy,width/9,height/6,x,y);
    }.bind(this));
};