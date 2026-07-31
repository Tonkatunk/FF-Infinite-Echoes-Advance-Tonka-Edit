//=============================================================================
// FNG_replaceTroop.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc 敵グループの配置を低解像度でも配置できるようにする
  * @author finga
  * @help 敵グループの配置を低解像度でも配置できるようにする
*/
/*
Game_Troop.prototype.setup = function(troopId) {
    this.clear();
    this._troopId = troopId;
    this._enemies = [];
    for (const member of this.troop().members) {
        if ($dataEnemies[member.enemyId]) {
            const enemyId = member.enemyId;
            const x = 240;
            const y = 480;
            const enemy = new Game_Enemy(enemyId, x, y);
            if (member.hidden) {
                enemy.hide();
            }
            this._enemies.push(enemy);
        }
    }
    this.makeUniqueNames();
};*/