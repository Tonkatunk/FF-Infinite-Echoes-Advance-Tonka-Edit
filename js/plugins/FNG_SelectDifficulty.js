//-----------------------------------------------------------------------------
// Scene_SelectDifficulty
//
// ・難易度を選択する画面

function Scene_SelectDifficulty() {
    this.initialize.apply(this, arguments);
}

Scene_SelectDifficulty.prototype = Object.create(Scene_MenuBase.prototype);
Scene_SelectDifficulty.prototype.constructor = Scene_SelectDifficulty;

Scene_SelectDifficulty.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_SelectDifficulty.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createMenuNameWindow("Difficulty Level");
    this.createMenuInfoWindow("Please select the game difficulty");
    this.createDifficultyWindow();
    this.createHelpWindow();
    this._difficultyWindow.select(1);
    this._difficultyWindow.activate();
};

Scene_SelectDifficulty.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    this.updateHelp(this._difficultyWindow.index());
}

Scene_SelectDifficulty.prototype.commandOk = function() {
    if(this._difficultyWindow.isCurrentItemEnabled()){
        $gameSystem.setDifficulty(this._difficultyWindow.index());
        if(this._difficultyWindow.index()>0){
            this._difficultyWindow.deselect();
            SceneManager.push(Scene_NewGame);
        }else{
            this.popScene();
        }
    }else{
        this._difficultyWindow.playBuzzerSound();
    }
}

Scene_SelectDifficulty.prototype.updateHelp = function(index) {
    if(this._helpIndex != index){
        this._helpIndex = index;
        switch(index){
            case 0:
                this._helpWindow.setText(
                    "This difficulty features a simplified system.\n\nRecommended for:\nRPG newcomers.\n\People who are new to the Final Fantasy series.");
                break;
            case 1:
                this._helpWindow.setText(
                    "This is standard difficulty,\n\nRecommended for:\nRPG veterans\nPeople who are familiar with the Final Fantasy series.");
                break;
            case 2:
                this._helpWindow.setText("This is hard difficulty. It requires solid gameplay and mechanic knowledge. \n\nRecommended for:\nNew Game+\nTactics style veterans.");
                break;
        }
    }
}


Scene_SelectDifficulty.prototype.createHelpWindow = function() {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_Help(rect);
    this.addWindow(this._helpWindow);
};

Scene_SelectDifficulty.prototype.helpWindowRect = function() {
    const wx = 0;
    const wy = this._difficultyWindow.y+this._difficultyWindow.height;
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight-this._difficultyWindow.height-this._difficultyWindow.y;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_SelectDifficulty.prototype.createMenuNameWindow = function(name) {
    const width = this.mainFontSize()*8;
    var rect = new Rectangle(Graphics.boxWidth-width, 0,width,this.mainFontSize()*3.75);
    this._menuNameWindow = new Window_MenuName(rect);
    this._menuNameWindow.drawMenuName(name);
    this.addWindow(this._menuNameWindow);
};

Scene_SelectDifficulty.prototype.createDifficultyWindow = function(name) {
    const width = this.mainFontSize()*10;
    var rect = new Rectangle(Graphics.boxWidth/2-width/2, this._menuNameWindow.height,width,this.mainFontSize()*5);
    this._difficultyWindow = new Window_DifficultySelect(rect);
    this._difficultyWindow.setHandler("ok", this.commandOk.bind(this));
    this.addWindow(this._difficultyWindow);
};

Scene_SelectDifficulty.prototype.createMenuInfoWindow = function(info) {
    const width = Graphics.boxWidth-this._menuNameWindow.width;
    const height = this._menuNameWindow.height;
    var rect = new Rectangle(0,0, width,height);
    this._menuInfoWindow = new Window_Base(rect);
    this._menuInfoWindow.drawTextEx(info,2,6);
    this.addWindow(this._menuInfoWindow);
};

//-----------------------------------------------------------------------------
// Window_DifficultySelect
//

function Window_DifficultySelect() {
    this.initialize(...arguments);
}

Window_DifficultySelect.prototype = Object.create(Window_Command.prototype);
Window_DifficultySelect.prototype.constructor = Window_DifficultySelect;

Window_DifficultySelect.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.addCommand("ＥＡＳＹ", "ok", false);
    this.addCommand("ＮＯＲＭＡＬ", "ok", true);
    this.addCommand("ＨＡＲＤ", "ok", true);
    this.drawAllItems();
};

Window_DifficultySelect.prototype.drawItem = function(index) {
    const item = this._list[index];
    if (item) {
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(this.isItemEnabled(index));
        this.drawText(item.name, rect.x, rect.y+1, rect.width,"center");
        this.changePaintOpacity(1);
    }
};

Window_DifficultySelect.prototype.isItemEnabled = function(index) {
    return this._list[index].enabled;
};

Window_DifficultySelect.prototype.isCurrentItemEnabled = function() {
    return this.isItemEnabled(this._index);
};

Window_DifficultySelect.prototype.lineHeight = function() {
    return 9;
};


Window_DifficultySelect.prototype.maxCols = function() {
    return 1;
};

Window_DifficultySelect.prototype.itemRect = function(index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth()-8;
    const itemHeight = this.itemHeight();
    const colSpacing = 0;
    const rowSpacing = 0;
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX()+8;
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
    const width = itemWidth - colSpacing;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};

Window_DifficultySelect.prototype.itemLineRect = function(index) {
    const rect = this.itemRect(index);
    return rect;
};

Game_System.prototype.difficulty = function() {
    return $gameVariables.value(11);
};

Game_System.prototype.setDifficulty = function(value) {
    return $gameVariables.setValue(11,value);
};