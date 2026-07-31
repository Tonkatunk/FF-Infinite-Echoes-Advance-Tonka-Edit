//=============================================================================
// FNG_EnemyBook.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc モンスター図鑑を作成します
  * @author finga
  * @help モンスター図鑑を作成します
*/

function Scene_EnemyBook() {
    this.initialize.apply(this, arguments);
}

Scene_EnemyBook.prototype = Object.create(Scene_MenuBase.prototype);
Scene_EnemyBook.prototype.constructor = Scene_EnemyBook;

Scene_EnemyBook.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_EnemyBook.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createMenuNameWindow("Monster Guide");
    this.createAchievementWindow();
    this.createIndexWindow();
    this.createLibraWindow();
    this._achievementWindow.setup((this._indexWindow.achievementRate()*100).toFixed(1));
    this._indexWindow.activate();
};

Scene_EnemyBook.prototype.createLibraWindow = function() {
    const rect = new Rectangle(0,0,Graphics.boxWidth,Graphics.boxHeight);
    const libraWindow = new Window_Libra(rect,this._indexWindow);
    this._libraWindow = libraWindow;
    this._libraWindow.setHandler("ok", this.onLibraOk.bind(this));
    this._libraWindow.setHandler("cancel", this.onLibraOk.bind(this));
    this._libraWindow.setHandler("pageup", this.onLibraPageup.bind(this));
    this._libraWindow.setHandler("pagedown", this.onLibraPagedown.bind(this));
    this._libraWindow.hide();
    this.addWindow(this._libraWindow);
};

Scene_EnemyBook.prototype.onLibraOk = function() {
    this._libraWindow.hide();
    BattleManager.endLibra();
    this._libraWindow.deactivate();
    
    this._indexWindow.refresh();
    this._indexWindow.activate();
}

Scene_EnemyBook.prototype.onLibraPageup = function() {
    this._libraWindow.nextPage();
}

Scene_EnemyBook.prototype.onLibraPagedown = function() {
    this._libraWindow.prevPage();
}


Scene_EnemyBook.prototype.createMenuNameWindow = function(name) {
    const width = this.mainFontSize()*9+this.mainFontSize()*5/4;
    const height = this.mainFontSize()*3;
    var rect = new Rectangle(Graphics.boxWidth-width, 0, width,height);
    this._menuNameWindow = new Window_MenuName(rect);
    this._menuNameWindow.drawMenuName(name);
    this.addWindow(this._menuNameWindow);
};

Scene_EnemyBook.prototype.createAchievementWindow = function(){
    const width = Graphics.boxWidth-this._menuNameWindow.width;
    const height = this._menuNameWindow.height;
    var rect = new Rectangle(0, 0, width,height);
    this._achievementWindow = new Window_EnemyBookAchievement(rect);
    this.addWindow(this._achievementWindow);
}

Scene_EnemyBook.prototype.createIndexWindow = function(){
    const width = Graphics.boxWidth;
    const height = Graphics.boxHeight - this._menuNameWindow.height;
    var rect = new Rectangle(0, this._menuNameWindow.height, width,height);
    this._indexWindow = new Window_EnemyBookIndex(rect);
    this._indexWindow.setHandler("cancel", this.popScene.bind(this));
    this._indexWindow.setHandler("ok", this.onIndexOk.bind(this));
    this.addWindow(this._indexWindow);    
}

Scene_EnemyBook.prototype.onIndexOk = function() {
    BattleManager.startLibra(new Game_Enemy(this._indexWindow.item().id));
    $gameParty.checkPage(this._indexWindow.index()+1);
    this._indexWindow.refresh();
    this._libraWindow.setupShowFrame();
    this._libraWindow.activate();
    this._indexWindow.deactivate();
};

//-----------------------------------------------------------------------------
// Window_EnemyBookAchievement
// 
// モンスター図鑑画面で倒したモンスターの達成率を表示させる

function Window_EnemyBookAchievement() {
    this.initialize(...arguments);
}

Window_EnemyBookAchievement.prototype = Object.create(Window_Base.prototype);
Window_EnemyBookAchievement.prototype.constructor = Window_EnemyBookAchievement;

Window_EnemyBookAchievement.prototype.initialize = function(rect,rate = 0) {
    Window_Base.prototype.initialize.call(this, rect);
    this._rate = rate;
    this.refresh();
};

Window_EnemyBookAchievement.prototype.refresh = function() {
    this.contents.clear();
    this.drawText("Completion Percent",0,this.innerHeight/2-$TILE/4,this.innerWidth);
    this.drawText(this._rate+"%",0,this.innerHeight/2-$TILE/4,this.innerWidth,"right");
};

Window_EnemyBookAchievement.prototype.setup = function(rate) {
    this.contents.clear();
    this._rate = rate;
    this.refresh();
};


//-----------------------------------------------------------------------------
// Window_EnemyBookIndex
// 
// モンスター図鑑画面の倒したモンスター一覧

function Window_EnemyBookIndex() {
    this.initialize(...arguments);
}

Window_EnemyBookIndex.prototype = Object.create(Window_ItemList.prototype);
Window_EnemyBookIndex.prototype.constructor = Window_EnemyBookIndex;

Window_EnemyBookIndex.prototype.initialize = function(rect,rate = 0) {
    Window_ItemList.prototype.initialize.call(this, rect);
    this.makeItemList();
    this.drawAllItems();
    this._index = 0;
}

Window_EnemyBookIndex.prototype.drawItem = function(index) {
    const item = this.itemAt(index);
    if (item) {
        const rect = this.itemLineRect(index);
        var indexText;
        const beatNum = this.beatNum(item) > 999 ? 999 : this.beatNum(item);
        const name = this.isEnabled(item) ? item.name : "????????????";
        //const name = item.name
        if(this.isEnabled(item)){
            if(!$gameParty.pageChecked(index+1)){
                indexText = "NEW!";
                this.changeTextColor(ColorManager.textColor(17));
            }else{
                indexText = (Array(3).join('0') + (index+1) ).slice( -3 );
                this.changeTextColor(ColorManager.normalColor());
            }
        }else{
            indexText = (Array(3).join('0') + (index+1) ).slice( -3 );
            this.changeTextColor(ColorManager.normalColor());
        }
        this.drawText(indexText, rect.x, rect.y, rect.width);
        //const name = item.name;
        this.changePaintOpacity(this.isEnabled(item));
        this.changeTextColor(ColorManager.normalColor());
        this.drawText("    "+name, rect.x, rect.y, rect.width);
        if(this.isEnabled(item)){
            this.drawText(beatNum+"\u00D7", rect.x, rect.y, rect.width,"right");
        }
        this.changePaintOpacity(1);
    }
};

Window_EnemyBookIndex.prototype.lineHeight = function(index) {
    return $TILE/2;
}

Window_EnemyBookIndex.prototype.isEnabled = function(enemy){
    return this.beatNum(enemy) > 0;
}

Window_EnemyBookIndex.prototype.achievementRate = function(){
    var registed = 0;
    for(item of this._data){
        if(this.isEnabled(item)){
            registed++;
        }
    }
    return registed/this._data.length;
}

Window_EnemyBookIndex.prototype.makeItemList = function(){
    this._data = [];
    for(enemy of $dataEnemies){
        if(enemy && enemy.name &&enemy.name.substr(0,1) != "◆"&&!enemy.meta.metamored&&!enemy.meta.noBook){
            this._data.push(enemy);
        }
    }
}

Window_EnemyBookIndex.prototype.beatNum = function(enemy){
    var nums = $gameParty.beatNums();
    if(nums[enemy.id]){
        num = $gameParty.beatNums()[enemy.id];
    }else{
        num = 0
    }
    return num+$gameParty.beatedMetamoredNum(enemy);
}

//変身したモンスターの撃破数を返す
Window_EnemyBookIndex.prototype.beatedMetamoredNum = function(enemy){
    beatNums = $gameParty.beatNums();
    var value = 0;
    for(enemy of $dataEnemies){
        if(enemy&&enemy.meta.metamored && enemy.id == Number(enemy.meta.metamored)){
            value += beatNums[enemy.id];
        }
    }
    return value;
}

Window_EnemyBookIndex.prototype.maxCols = function() {
    return 2;
};

Window_EnemyBookIndex.prototype.processOk = function() {
    if (this.isCurrentItemEnabled()) {
        this.playOkSound();
        this.updateInputData();
        this.deactivate();
        this.callOkHandler();
    } else {
        this.playBuzzerSound();
    }
};


BattleManager.updateBook = function() {
    const beated = $gameTroop.deadMembers();
    for(enemy of beated){
        $gameParty.registToBook(enemy);
    };
}

Game_Party.prototype.registToBook = function(enemy) {
    if(!this._beatNums){
        this._beatNums = {};
    }
    if(!this._beatNums[enemy.enemyId()]){
        this._beatNums[enemy.enemyId()] = 0;
    }
    this._beatNums[enemy.enemyId()]++;
};

Game_Party.prototype.pageChecked = function(index){
    if(!this._checkedPages){
        this._checkedPages = {};
    }
    if(!this._checkedPages[index]){
        return false;
    }
    return this._checkedPages[index];
}

Game_Party.prototype.checkPage = function(index){
    if(!this._checkedPages){
        this._checkedPages = {};
    }
    console.log("check",index);
    this._checkedPages[index] = true;
}

Game_Party.prototype.beatNums = function(){
    if(!this._beatNums){
        this._beatNums = {};
    }
    return this._beatNums;
}

//変身したモンスターの撃破数を返す
Game_Party.prototype.beatedMetamoredNum = function(enemy){
    beatNums = $gameParty.beatNums();
    var value = 0;
    for(enemy of $dataEnemies){
        if(enemy&&enemy.meta.metamored && enemy.id == Number(enemy.meta.metamored)){
            value += beatNums[enemy.id];
        }
    }
    return value;
}

Window_Libra.prototype.goPrevIdPage = function() {
    const newId = this.getPrevEnemyId();
    if(!newId){return;}
    const newBattler = new Game_Enemy(newId);
    BattleManager.startLibra(newBattler);
    this._battler = newBattler;
    this.refresh();
}

Window_Libra.prototype.goNextIdPage = function() {
    const newId = this.getNextEnemyId();
    if(!newId){return;}
    const newBattler = new Game_Enemy(newId);
    BattleManager.startLibra(newBattler);
    this._battler = newBattler;
    this.refresh();
}

Window_Libra.prototype.getNextEnemyId = function() {
    const data = this._indexWindow._data;
    for(let i = this._indexWindow.index()+1;i < data.length;i++){
        const enemy = this._indexWindow.itemAt(i);
        if(this._indexWindow.beatNum(enemy)>0){
            this._indexWindow.select(i);
            $gameParty.checkPage(i+1);
            return enemy.id;
        }
    }
    return null;
}

Window_Libra.prototype.getPrevEnemyId = function() {
    const data = this._indexWindow._data;
    for(let i = this._indexWindow.index()-1;i > 0;i--){
        const enemy = this._indexWindow.itemAt(i);
        if(this._indexWindow.beatNum(enemy)>0){
            this._indexWindow.select(i);
            $gameParty.checkPage(i+1);
            return enemy.id;
        }
    }
    return null;
}