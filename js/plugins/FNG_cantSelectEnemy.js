// エネミー表示位置調整
/*
const _game_Enemy_setup3 = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function(enemyId,x,y) {
    console.log(enemyId)
    this.front = $dataEnemies[enemyId].meta.front;
    _game_Enemy_setup3.apply(this,arguments);
};
 
const _sprite_Enemy_setBattler2
 = Sprite_Enemy.prototype.setBattler;
Sprite_Enemy.prototype.setBattler = function(battler) {
    _sprite_Enemy_setBattler2.apply(this,arguments);
    this.front = $dataEnemies[battler._enemyId].meta.front; //追加
};
 
 Spriteset_Battle.prototype.compareEnemySprite = function(a, b) {
    console.log("a.enemyId:",a.enemyId," a.front:",a.front);
    console.log("b.enemyId:",b.enemyId," b.front:",b.front);
    if(a.front && b.front){
        return a.front - b.front; //追加
    } else if (a.y !== b.y) {
        return a.y - b.y;
    } else {
        return b.spriteId - a.spriteId;
    }
 };*/

Game_Enemy.prototype.cantSelect = function(){
    if(this._enemyId){
        if(this.enemy().meta.cantSelect){
            return true;
        }
    }
    return false;
}

Game_Actor.prototype.cantSelect = function(){
    return false;
}

Window_BattleEnemy.prototype.refresh = function() {
    this._enemies = $gameTroop.selectableMembers();
    Window_Selectable.prototype.refresh.call(this);
};

Window_BattleEnemy.prototype.enemies = function() {
    return this._enemies;
}

Game_Troop.prototype.selectableMembers = function(){
    const enemies = this.aliveMembers();
    selectableEnemies = [];
    for(enemy of enemies){
        if(!enemy.cantSelect()){
            selectableEnemies.push(enemy)
        }
    }
    return selectableEnemies;
}