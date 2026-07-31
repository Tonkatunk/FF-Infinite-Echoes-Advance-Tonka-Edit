const _Game_CharacterBase_isMapPassable = Game_CharacterBase.prototype.isMapPassable;
Game_CharacterBase.prototype.isMapPassable = function(x, y, d) {
    if($gameMap.onLift(x, y, d)){
        return true;
    }
    if($gameMap.onLift(x, y, 0)){
        const x2 = $gameMap.roundXWithDirection(x, d);
        const y2 = $gameMap.roundYWithDirection(y, d);
        console.log(x2,y2,"from lift to floor is passible?",$gameMap.isPassable(x2, y2, 0));
        console.log("tiles are",$gameMap.allTiles(x2, y2));
        if(!$gameMap.checkPassage(x2, y2, 2)&&
          !$gameMap.checkPassage(x2, y2, 4)&&
          !$gameMap.checkPassage(x2, y2, 6)&&
          !$gameMap.checkPassage(x2, y2, 8)){
            return false;
        }
        return true;
    }
    return _Game_CharacterBase_isMapPassable.apply(this,arguments);
};

Game_Map.prototype.isExistLiftEvent = function(x, y) {
    const mapevents = this.eventsXy(x,y);
    for(mapevent of mapevents){
        const meta = $gameMap.event(mapevent.eventId()).event().meta;
        if(meta.lift){
            return true;
        }
    }
    return false;
};

Game_Map.prototype.onLift = function(x, y, d) {
    const x2 = $gameMap.roundXWithDirection(x, d);
    const y2 = $gameMap.roundYWithDirection(y, d);
    if(this.isExistLiftEvent(x2-1,y2+2)||
      this.isExistLiftEvent(x2,y2+2)||
      this.isExistLiftEvent(x2+1,y2+2)||
      this.isExistLiftEvent(x2-1,y2+1)||
      this.isExistLiftEvent(x2,y2+1)||
      this.isExistLiftEvent(x2+1,y2+1)||
      this.isExistLiftEvent(x2-1,y2)||
      this.isExistLiftEvent(x2,y2)||
      this.isExistLiftEvent(x2+1,y2)){
       return true;
    }
    return false;
};

//魔大陸のワープ階段が設置可能か
Game_Map.prototype.isSettableWarpStair = function(x, y) {
    if(this.isPassable(x,y,0)
        &&this.isPassable(x+1,y,0)
        &&this.isPassable(x-1,y,0)
        &&this.isPassable(x,y-1,0)
        &&this.isPassable(x,y+1,0)
        &&this.isPassable(x+1,y+1,0)
        &&this.isPassable(x+1,y-1,0)
        &&this.isPassable(x-1,y+1,0)
        &&this.isPassable(x-1,y-1,0)){
            return true;
        }
    return false
};