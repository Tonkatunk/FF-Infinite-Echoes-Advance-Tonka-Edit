const _Sprite_Actor_initMembers3 = Sprite_Actor.prototype.initMembers;
Sprite_Actor.prototype.initMembers = function() {
    _Sprite_Actor_initMembers3.apply(this,arguments);
    this._cursorSprite = new Sprite();
    this._cursorSprite.bitmap = ImageManager.loadPicture("Cursor");
    this.addChild(this._cursorSprite);
    this._cursorSprite.anchor.x = 0.5;
    this._cursorSprite.anchor.y = 0.5;
};

const _Sprite_Enemy_initMembers2 = Sprite_Enemy.prototype.initMembers;
Sprite_Enemy.prototype.initMembers = function() {
    _Sprite_Enemy_initMembers2.apply(this,arguments);
    this._cursorSprite = new Sprite();
    this._cursorSprite.bitmap = ImageManager.loadPicture("CursorL");
    this.addChild(this._cursorSprite);
    this._cursorSprite.anchor.x = 0.5;
    this._cursorSprite.anchor.y = 0.5;
};

const _Sprite_Enemy_update = Sprite_Enemy.prototype.update;
Sprite_Enemy.prototype.update = function() {
    _Sprite_Enemy_update.apply(this, arguments);
    this._cursorSprite.x = this.width/2;
    this._cursorSprite.y = -this.height/2;
    this._cursorSprite.visible = this.isShowingCursor();
    if(this._cursorSprite.visible && BattleManager.isAllEnemySelecting()){
            this._cursorSprite.opacity = 127  
    }else if(this._cursorSprite.visible){
            this._cursorSprite.opacity = 255         
    }
};

Sprite_Enemy.prototype.isShowingCursor = function(){
    /*
    if(this._enemy && this._enemy.cantSelect()){
       return false; 
    }
    if(!this._enemy){
        return false;
    }
    return BattleManager.isEnemySelecting(this._enemy.index());
    */
   return false;
}

const _Sprite_Actor_update = Sprite_Actor.prototype.update;
Sprite_Actor.prototype.update = function() {
    _Sprite_Actor_update.apply(this, arguments);
    this._cursorSprite.x = -this.width/2;
    this._cursorSprite.y = -this.height/4;
    this._cursorSprite.visible = this.isShowingCursor();
    if(this._cursorSprite.visible && BattleManager.isAllActorSelecting()){
        this._cursorSprite.opacity = 127
    }else if(this._cursorSprite.visible){
        this._cursorSprite.opacity = 255         
    }
};

Sprite_Actor.prototype.isShowingCursor = function(){/*
    if(this._actor && this._actor.cantSelect()){
       return false; 
    }
    if(!this._actor){
        return false;
    }
    return BattleManager.isActorSelecting(this._actor.index());*/
    return false;
}

BattleManager.setEnemyWindow = function(window){
    this._enemyWindow = window;
}

BattleManager.setActorWindow = function(window){
    this._actorWindow = window;
}

BattleManager.enemyWindow = function(){
    return this._enemyWindow;
}

BattleManager.actorWindow = function(){
    return this._actorWindow;
}

const _Scene_Battle_createEnemyWindow = Scene_Battle.prototype.createEnemyWindow;
Scene_Battle.prototype.createEnemyWindow = function() {
    _Scene_Battle_createEnemyWindow.apply(this, arguments);
    BattleManager.setEnemyWindow(this._enemyWindow);
};

const _Scene_Battle_createActorWindow = Scene_Battle.prototype.createActorWindow;
Scene_Battle.prototype.createActorWindow = function() {
    _Scene_Battle_createActorWindow.apply(this, arguments);
    BattleManager.setActorWindow(this._actorWindow);
};

BattleManager.isAllEnemySelecting = function(){
    if(!this._enemyWindow){
        return false;
    }
    if(!this._enemyWindow.visible){
        return false;
    }
    return this._enemyWindow.cursorAll();
}

BattleManager.isEnemySelecting = function(index){
    if(!this._enemyWindow){
        return false;
    }
    if(!this._enemyWindow.visible){
        return false;
    }
    if(this._enemyWindow.enemy() && this._enemyWindow.enemy().index() == index){
        return true;
    }
    if(BattleManager.isAllEnemySelecting()){
        return true;
    }
    return false;
}

BattleManager.isAllActorSelecting = function(){
    if(!this._actorWindow){
        return false;
    }
    if(!this._actorWindow.visible){
        return false;
    }
    return this._actorWindow.cursorAll();
}

BattleManager.isActorSelecting = function(index){
    if(!this._actorWindow){
        return false;
    }
    if(!this._actorWindow.visible){
        return false;
    }
    if(this._actorWindow.actor(this._actorWindow.index()).index() == index){
        return true;
    }
    if(BattleManager.isAllActorSelecting()){
        return true;
    }
    return false;
}