//=============================================================================
// FNG_CustomSceneTitle.js
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc タイトル画面をFFI用にカスタムします
 *              
 * @author finga
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */

Scene_Title.prototype.commandNewGame = function() {
    DataManager.setupNewGame();
    this._commandWindow.close();
    //フェードせずすぐに移行
    const time = this.slowFadeSpeed() / 20;
    this.startFadeOut(this.slowFadeSpeed());
    SceneManager.goto(Scene_Map);
};

Scene_Title.prototype.createCommandWindow = function() {
    const background = $dataSystem.titleCommandWindow.background;
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_TitleCommand(rect);
    this._commandWindow.setBackgroundType(background);
    this._commandWindow.setHandler("newGame", this.commandNewGame.bind(this));
    this._commandWindow.setHandler("continue", this.commandContinue.bind(this));
    this._commandWindow.setHandler("options", this.commandOptions.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Title.prototype.commandKeyConfig = function() {
    this._commandWindow.close();
    SceneManager.push(Scene_KeyConfig);
};

Scene_Title.prototype.commandPadConfig = function() {
    this._commandWindow.close();
    SceneManager.push(Mano_InputConfig.Scene_GamepadConfig);
};

Window_TitleCommand.prototype.initialize = function(rect) {
    const rect2 = new Rectangle(rect.x-8,rect.y-14,Graphics.boxWidth/3,$TILE*1.5+$TILE*(16/8))
    Window_Command.prototype.initialize.call(this, rect2);
    this.openness = 0;
    this.selectLast();
};

Window_TitleCommand.prototype.drawItem = function(index) {
    this.resetTextColor();
    this.changeTextColor(ColorManager.textColor(8));
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};
Window_TitleCommand.prototype.itemRect = function(index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX()+8;
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY()+4;
    const width = itemWidth - colSpacing;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};

Window_TitleCommand.prototype.lineHeight = function(index) {
    return $TILE/2;
};

Window_TitleCommand.prototype.makeCommandList = function() {
    const continueEnabled = this.isContinueEnabled();
    this.addCommand(TextManager.newGame, "newGame");
    this.addCommand(TextManager.continue_, "continue", continueEnabled);
    this.addCommand("Options", "options");
};

Scene_Title.prototype.commandOptions = function() {
    this._commandWindow.close();
    console.log("titleoptions")
    SceneManager.push(Scene_TitleOptions);
};

const _Scene_Boot_onDatabaseLoaded = Scene_Boot.prototype.onDatabaseLoaded;
Scene_Boot.prototype.onDatabaseLoaded = function() {
    _Scene_Boot_onDatabaseLoaded.apply(this,arguments);
    //this.loadActorImage();
};

Scene_Boot.prototype.loadActorImage = function(){
    for(actor of $dataActors){
        if(actor && actor.battlerName){
            ImageManager.loadSvActor(actor.battlerName);
        }
    }    
};

function Scene_TitleOptions() {
    this.initialize(...arguments);
}

Scene_TitleOptions.prototype = Object.create(Scene_MenuBase.prototype);
Scene_TitleOptions.prototype.constructor = Scene_TitleOptions;

Scene_TitleOptions.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_TitleOptions.prototype.createMenuNameWindow = function(name) {
    const width = this.mainFontSize()*8;
    var rect = new Rectangle(Graphics.boxWidth-width, 0,width,this.mainFontSize()*3.75);
    this._menuNameWindow = new Window_MenuName(rect);
    this._menuNameWindow.drawMenuName(name);
    this.addWindow(this._menuNameWindow);
};

Scene_TitleOptions.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createOptionsWindow();
    this.createMenuNameWindow("Config");
};

Scene_TitleOptions.prototype.terminate = function() {
    Scene_MenuBase.prototype.terminate.call(this);
    ConfigManager.save();
};

Scene_TitleOptions.prototype.createOptionsWindow = function() {
    const rect = this.optionsWindowRect();
    this._optionsWindow = new Window_TitleOptions(rect);
    this._optionsWindow.setHandler("cancel", this.popScene.bind(this));
    this._optionsWindow.setHandler("padconfig", this.commandPadConfig.bind(this));
    this._optionsWindow.setHandler("keyconfig", this.commandKeyConfig.bind(this));
    this.addWindow(this._optionsWindow);
};

Scene_TitleOptions.prototype.commandKeyConfig = function() {
    SceneManager.push(Scene_KeyConfig);
};

Scene_TitleOptions.prototype.commandPadConfig = function() {
    SceneManager.push(Mano_InputConfig.Scene_GamepadConfig);
};

Scene_TitleOptions.prototype.optionsWindowRect = function() {
    const n = Math.min(this.maxCommands(), this.maxVisibleCommands());
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(n, true);
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = (Graphics.boxHeight - wh) / 2;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_TitleOptions.prototype.maxCommands = function() {
    // Increase this value when adding option items.
    return 7;
};

Scene_TitleOptions.prototype.maxVisibleCommands = function() {
    return 12;
};

function Window_TitleOptions() {
    this.initialize(...arguments);
}

Window_TitleOptions.prototype = Object.create(Window_Command.prototype);
Window_TitleOptions.prototype.constructor = Window_TitleOptions;

Window_TitleOptions.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
};

Window_TitleOptions.prototype.makeCommandList = function() {
    //this.addGeneralOptions();
    this.addVolumeOptions();
    this.addAssignOptions();
};

Window_TitleOptions.prototype.addGeneralOptions = function() {
    this.addCommand(TextManager.alwaysDash, "alwaysDash");
    this.addCommand(TextManager.commandRemember, "commandRemember");
};

Window_TitleOptions.prototype.addVolumeOptions = function() {
    this.addCommand(TextManager.bgmVolume, "bgmVolume");
    this.addCommand(TextManager.bgsVolume, "bgsVolume");
    this.addCommand(TextManager.meVolume, "meVolume");
    this.addCommand(TextManager.seVolume, "seVolume");
};

Window_TitleOptions.prototype.addAssignOptions = function() {
    this.addCommand("Controller Input", "padconfig");
    this.addCommand("Keyboard Input", "keyconfig");
};

Window_TitleOptions.prototype.itemRect = function(index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth()-8;
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX()+8;
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
    const width = itemWidth - colSpacing;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};

Window_TitleOptions.prototype.drawItem = function(index) {
    const title = this.commandName(index);
    const status = this.statusText(index);
    const rect = this.itemLineRect(index);
    const statusWidth = this.statusWidth();
    const titleWidth = rect.width - statusWidth;
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(title, rect.x+4, rect.y, titleWidth-4, "left");
    this.drawText(status, rect.x + titleWidth, rect.y, statusWidth, "right");
};

Window_TitleOptions.prototype.statusWidth = function() {
    return 120;
};

Window_TitleOptions.prototype.statusText = function(index) {
    const symbol = this.commandSymbol(index);
    const value = this.getConfigValue(symbol);
    if (this.isVolumeSymbol(symbol)) {
        return this.volumeStatusText(value);
    } else if (symbol == "alwaysDash"||symbol == "commandRemember"){
        return this.booleanStatusText(value);
    }else{
        return "";
    }
};

Window_TitleOptions.prototype.isVolumeSymbol = function(symbol) {
    return symbol.includes("Volume");
};

Window_TitleOptions.prototype.booleanStatusText = function(value) {
    return value ? "ON" : "OFF";
};

Window_TitleOptions.prototype.volumeStatusText = function(value) {
    return value + "%";
};

Window_TitleOptions.prototype.processOk = function() {
    const index = this.index();
    const symbol = this.commandSymbol(index);
    if (this.isVolumeSymbol(symbol)) {
        this.changeVolume(symbol, true, true);
    } else if (symbol == "alwaysDash"||symbol == "commandRemember"){
        this.changeValue(symbol, !this.getConfigValue(symbol));
    }else{  
        Window_Command.prototype.processOk.call(this);
    }
};

Window_TitleOptions.prototype.cursorRight = function() {
    const index = this.index();
    const symbol = this.commandSymbol(index);
    if (this.isVolumeSymbol(symbol)) {
        this.changeVolume(symbol, true, false);
    } else {
        this.changeValue(symbol, true);
    }
};

Window_TitleOptions.prototype.cursorLeft = function() {
    const index = this.index();
    const symbol = this.commandSymbol(index);
    if (this.isVolumeSymbol(symbol)) {
        this.changeVolume(symbol, false, false);
    } else {
        this.changeValue(symbol, false);
    }
};

Window_TitleOptions.prototype.changeVolume = function(symbol, forward, wrap) {
    const lastValue = this.getConfigValue(symbol);
    const offset = this.volumeOffset();
    const value = lastValue + (forward ? offset : -offset);
    if (value > 100 && wrap) {
        this.changeValue(symbol, 0);
    } else {
        this.changeValue(symbol, value.clamp(0, 100));
    }
};

Window_TitleOptions.prototype.volumeOffset = function() {
    return 20;
};

Window_TitleOptions.prototype.changeValue = function(symbol, value) {
    const lastValue = this.getConfigValue(symbol);
    if (lastValue !== value) {
        this.setConfigValue(symbol, value);
        this.redrawItem(this.findSymbol(symbol));
        this.playCursorSound();
    }
};

Window_TitleOptions.prototype.getConfigValue = function(symbol) {
    return ConfigManager[symbol];
};

Window_TitleOptions.prototype.setConfigValue = function(symbol, volume) {
    ConfigManager[symbol] = volume;
};