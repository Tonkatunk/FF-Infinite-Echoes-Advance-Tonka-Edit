//=============================================================================
// FNG_Libraly.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc ライブラリシーン
  * @author finga
  * @help ライブラリシーン
*/


function Scene_Library() {
    this.initialize(...arguments);
}

Scene_Library.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Library.prototype.constructor = Scene_Library;

Scene_Library.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createMenuNameWindow("Library");
    this.createCommandWindow();
    //殿堂用画像をここで読み込んでおく
    ImageManager.loadSystem("dendo");
};

Scene_Library.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
};

Scene_Library.prototype.createCommandWindow = function() {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_LibraryCommand(rect);
    this._commandWindow.setHelpWindow(this._helpWindow);
    this._commandWindow.setHandler("tutrial", this.commandTutrial.bind(this));
    this._commandWindow.setHandler("history", this.commandHistory.bind(this));
    this._commandWindow.setHandler("dendo", this.commandDendo.bind(this));
    this._commandWindow.setHandler("bounty", this.commandBounty.bind(this));
    this._commandWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Library.prototype.commandWindowRect = function() {
    const rect = new Rectangle();
    rect.x = 0;
    rect.y = 0;
    rect.width = Graphics.boxWidth-this._menuNameWindow.width;
    rect.height = Graphics.boxHeight - this._helpWindow.height;
    return rect;
};

Scene_Library.prototype.createMenuNameWindow = function(name) {
    const width = this.mainFontSize()*6+this.mainFontSize()*5/4;
    const height = this.mainFontSize()*3;
    var rect = new Rectangle(Graphics.boxWidth-width, 0, width,height);
    this._menuNameWindow = new Window_MenuName(rect);
    this._menuNameWindow.drawMenuName(name);
    this.addWindow(this._menuNameWindow);
};

Scene_Library.prototype.createHelpWindow = function() {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_Help(rect);
    this.addWindow(this._helpWindow);
};

Scene_Library.prototype.helpWindowRect = function() {
    const wx = 0;
    const wh = this.mainFontSize()*3+this.mainFontSize()*7/8;
    const wy = Graphics.boxHeight-wh;
    const ww = Graphics.boxWidth;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Library.prototype.commandTutrial = function() {
    SceneManager.push(Scene_Tutrial);
}

Scene_Library.prototype.commandHistory = function() {
    
    SceneManager.push(Scene_History);
}

Scene_Library.prototype.commandDendo = function() {
    SceneManager.push(Scene_Dendo);
}

Scene_Library.prototype.commandBounty = function() {
    
    SceneManager.push(Scene_Bounty);
    
}

//-----------------------------------------------------------------------------
// Window_LibraryCommand
//
// ライブラリメニュー用のコマンド

function Window_LibraryCommand() {
    this.initialize(...arguments);
}

Window_LibraryCommand.prototype = Object.create(Window_Command.prototype);
Window_LibraryCommand.prototype.constructor = Window_LibraryCommand;

Window_LibraryCommand.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
    //this.makeCommandList();
    //this.drawItem();
};

Window_LibraryCommand.prototype.setHelpWindow = function(helpWindow) {
    this._helpWindow = helpWindow;
    this.callUpdateHelp();
};

Window_LibraryCommand.prototype.callUpdateHelp = function() {
    if (this.active && this._helpWindow) {
        this.updateHelp();
    }
};

Window_LibraryCommand.prototype.makeCommandList = function() {
    this.addCommand("Tutorial","tutrial",true);
    this.addCommand("Battle Log","history",true);
    this.addCommand("Hall of Fame","dendo",true);
    this.addCommand("Bounty","bounty",true);
    this.addCommand("Back","cancel",true);
};

Window_LibraryCommand.prototype.updateHelp = function() {
    this._helpWindow.clear();
    if(this._index == 0){
        this._helpWindow.setText("When in doubt, check the tutorial");
    }else if(this._index == 1){
        this._helpWindow.setText("A record of your battles");
    }else if(this._index == 2){
        this._helpWindow.setText("View records of powerful foes you've defeated");
    }else if(this._index == 3){
        this._helpWindow.setText("Rogues lurking in the dungeons");
    }else if(this._index == 4){
        this._helpWindow.setText("Return to the menu");
    }
};

Window_LibraryCommand.prototype.itemHeight = function() {
    return 12;
}

Window_LibraryCommand.prototype.itemRect = function(index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth()/2;
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX()+this.itemWidth()/4;
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
    const width = itemWidth - colSpacing;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};