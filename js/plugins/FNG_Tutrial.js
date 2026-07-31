//=============================================================================
// FNG_Tutrial.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc チュートリアルシーン
  * @author finga
  * @help チュートリアルシーン
*/


function Scene_Tutrial() {
    this.initialize(...arguments);
}

Scene_Tutrial.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Tutrial.prototype.constructor = Scene_Tutrial;

Scene_Tutrial.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createMenuNameWindow("Tutorial");
    this.createCommandWindow();
    this.createMessageWindow();
};

Scene_Tutrial.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
};

Scene_Tutrial.prototype.createCommandWindow = function() {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_TutrialCommand(rect);
    this._commandWindow.setHelpWindow(this._helpWindow);
    this._commandWindow.setHandler("tutrial", this.commandTutrial.bind(this));
    this._commandWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Tutrial.prototype.createMessageWindow = function() {
    const rect = this.messageWindowRect();
    this._messageWindow = new Window_TutrialMessage(rect);
    this._messageWindow.setHandler("ok", this.onMessageOk.bind(this));
    this._messageWindow.setHandler("pageup", this.onMessagePageup.bind(this));
    this._messageWindow.setHandler("pagedown", this.onMessagePagedown.bind(this));
    this._messageWindow.setHandler("cancel", this.onMessageCancel.bind(this));
    this.addWindow(this._messageWindow);
};

Scene_Tutrial.prototype.commandWindowRect = function() {
    const rect = new Rectangle();
    rect.x = 0;
    rect.y = this._menuNameWindow.height;
    rect.width = Graphics.boxWidth;
    rect.height = Graphics.boxHeight - this._menuNameWindow.height;
    return rect;
};

Scene_Tutrial.prototype.messageWindowRect = function() {
    const rect = new Rectangle();
    rect.x = 0;
    rect.y = 0;
    rect.width = Graphics.boxWidth;
    rect.height = Graphics.boxHeight;
    return rect;
};

Scene_Tutrial.prototype.createMenuNameWindow = function(name) {
    const width = this.mainFontSize()*7+this.mainFontSize()*5/4;
    const height = this.mainFontSize()*3;
    var rect = new Rectangle(Graphics.boxWidth-width, 0, width,height);
    this._menuNameWindow = new Window_MenuName(rect);
    this._menuNameWindow.drawMenuName(name);
    this.addWindow(this._menuNameWindow);
};

Scene_Tutrial.prototype.onMessageCancel = function() {
    this._messageWindow.deactivate();
    this._messageWindow.hide();
    this._commandWindow.activate();
};

Scene_Tutrial.prototype.onMessagePageup = function() {
    this._messageWindow.nextPage()
};

Scene_Tutrial.prototype.onMessagePagedown = function() {
    this._messageWindow.prevPage()
};

Scene_Tutrial.prototype.onMessageOk = function() {
    this.onMessageCancel()
};


Scene_Tutrial.prototype.commandTutrial = function() {
    this._messageWindow.drawAllitem(this._commandWindow.index());
    this._messageWindow.show();
    this._messageWindow.activate();
};

//-----------------------------------------------------------------------------
// Window_TutrialCommand
//
// ライブラリメニュー用のコマンド

function Window_TutrialCommand() {
    this.initialize(...arguments);
}

Window_TutrialCommand.prototype = Object.create(Window_Command.prototype);
Window_TutrialCommand.prototype.constructor = Window_TutrialCommand;

Window_TutrialCommand.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
};

Window_TutrialCommand.prototype.setHelpWindow = function(helpWindow) {
    this._helpWindow = helpWindow;
};

Window_TutrialCommand.prototype.makeCommandList = function() {
    this.addCommand("Q. What should I do?","tutrial",true);
    this.addCommand("Q. How do I get stronger?","tutrial",true);
    this.addCommand("Q. What is Junction?","tutrial",true);
    this.addCommand("Q. The enemies are too strong","tutrial",true);
    this.addCommand("Q. I want to defeat enemies faster","tutrial",true);
    this.addCommand("Q. I don't understand Synthesis","tutrial",true);
    this.addCommand("Q. Synthesis is a hassle","tutrial",true);
    this.addCommand("Q. Where do I get items?","tutrial",true);
    this.addCommand("Q. Who should I level up?","tutrial",true);
    this.addCommand("Q. I want to learn abilities efficiently","tutrial",true);
    this.addCommand("Q. What's the difference between EXP and AP?","tutrial",true);
    this.addCommand("Back","cancel",true);
};

Window_TutrialCommand.prototype.itemRect = function(index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = 0;
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
    const width = itemWidth - colSpacing;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};

Window_TutrialCommand.prototype.itemHeight = function() {
    return 12;
}

Window_TutrialCommand.prototype.itemTextAlign = function() {
    return "left";
};

//-----------------------------------------------------------------------------
// Window_TutrialMessage
//
// ライブラリメニュー用のコマンド

function Window_TutrialMessage(rect) {
    this.initialize(...arguments);
}

Window_TutrialMessage.prototype = Object.create(Window_Selectable.prototype);
Window_TutrialMessage.prototype.constructor = Window_TutrialMessage;

Window_TutrialMessage.prototype.initialize = function(rect,indexWindow) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.visible = false;
    this._page = 0;
    this._index = 0;
};

Window_TutrialMessage.prototype.nextPage = function() {
    this._page = this._page >= 10 ? 0 : this._page+1;
    this.drawAllitem(this._page);
    this.activate();
};

Window_TutrialMessage.prototype.prevPage = function() {
    this._page = this._page <= 0 ? 10 : this._page-1;
    this.drawAllitem(this._page);
    this.activate();
};

Window_TutrialMessage.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    
    this.setCursorRect(Graphics.witdh*2,Graphics.height*2,1,1);
};

Window_TutrialMessage.prototype.drawAllitem = function(index){
    this._page = index
    this.contents.clear();
    this.drawPage(index);
}

Window_TutrialMessage.prototype.lineHeight = function(){
    return 12;
}

Window_TutrialMessage.prototype.drawPage = function(index){
    let text = ""
    switch(index){
        case 0:
            text = "Q. What should I do?\n\n"+
                    "A. Push deeper and defeat the enemies in your path. Don't pick fights with blue ones at first."
            break;
        case 1:
            text = "Q. How do I get stronger?\n\n"+
                    "A. Hunting enemies helps, but also collect items to sell for gil and gather synthesis materials for strong gear and magic. Don't forget to Junction Crystals."
            break;
        case 2:
            text = "Q. What is Junction?\n\n"+
                    "A. It's the system that connects Crystal items like Crystal Shards and Earth Crystals to party members. The Crystal gains the same AP that character earns, and you can trade accumulated AP for equippable Materia. If the character has max AP, then the Crystal gets double!"
            break;
        case 3:
            text = "Q. The enemies are too strong\n\n"+
                    "A. Use the white magic Libra to find their weaknesses. Make sure to use items and equip your gear. You may need a magic user and healer."
            break;
        case 4:
            text = "Q. I want to defeat enemies faster\n\n"+
                    "A. Blast through them with Black Magic abilities. Most attack spells can target all enemies by tapping L or R."
            break;
        case 5:
            text = "Q. I don't understand Synthesis\n\n"+
                    "A. Combine ore like Iron Ore with magic-type items like Magicite and element items like Antarctic Wind to create magic. Remember that much for now."
            break;
        case 6:
            text = "Q. Synthesis is a hassle\n\n"+
                    "A. Tap the dash button on the item screen to view a list of recipes using the selected item, and you can synthesize from there. That should make it easier."
            break;
        case 7:
            text = "Q. Where do I get items?\n\n"+
                    "A. The Monster Guide shows steal, drop, and morph items. You will have to hunt the appropriate monsters."
            break;
        case 8:
            text = "Q. Who should I level up?\n\n"+
                    "A. Reserve and locked members still earn 80% EXP, so they'll grow on their own. If you're stuck, unlock someone with useful abilities. You get more character slots by progressing."
            break;
        case 9:
            text = "Q. I want to learn abilities efficiently\n\n"+
                    "A. Each dungeon has enemies that give more AP. Focus on those."
            break;
        case 10:
            text = "Q. What's the difference between EXP and AP?\n\n"+
                    "A. EXP raises your level, boosting HP/MP and damage. AP raises Job Level so you learn abilities. At max Job Level, AP gained by Junctioned Crystals doubles."
            break;
    }
    this.drawTextEx(text, 0, 0, this.itemWidth(), 48, "left");
}

Window_TutrialMessage.prototype.refresh = function(){
    this.drawAllitem();
};

Window_TutrialMessage.prototype.processCursorMove = function() {
    if (this.isCursorMovable()) {
        const lastIndex = this.index();
        if (Input.isRepeated("down")) {
            this.cursorDown(Input.isTriggered("down"));
        }
        if (Input.isRepeated("up")) {
            this.cursorUp(Input.isTriggered("up"));
        }
        if (this.index() !== lastIndex) {
            this.playCursorSound();
        }
    }
};

Window_TutrialMessage.prototype.processHandling = function() {
    if (this.isOpenAndActive()) {
        if (this.isOkEnabled() && Input.isPressed("ok") && this._showFrame == 0) {
            this.playCursorSound();
            return this.processOk();
        }
        if (this.isCancelEnabled() && Input.isPressed("cancel")) {
            this.playCursorSound();
            return this.processOk();
        }
        if (Input.isPressed("right") && this._pressing != "r") {
            this._pressing = "r";
            this.playCursorSound();
            return this.processPageup();
        }
        if (Input.isPressed("left") && this._pressing != "l") {
            this._pressing = "l";
            this.playCursorSound();
            return this.processPagedown();
        }
        if (this.isHandled("pagedown") && Input.isPressed("pagedown") && this._pressing != "pd") {
            this._pressing = "pd";
            if(this._indexWindow){
                this.playCursorSound();
                return this.goNextIdPage();
            }
        }
        if (this.isHandled("pageup") && Input.isPressed("pageup") && this._pressing != "pu") {
            this._pressing = "pu";
            if(this._indexWindow){
                this.playCursorSound();
                return this.goPrevIdPage();
            }
        }
    }
    
    if (!Input.isPressed("pagedown") && this._pressing == "pd") {
        this._pressing = "";
    }
    if (!Input.isPressed("pageup") && this._pressing == "pu") {
        this._pressing = "";
    }
    if (!Input.isPressed("right") && this._pressing == "r") {
        this._pressing = "";
    }
    if (!Input.isPressed("left") && this._pressing == "l") {
        this._pressing = "";
    }
};
