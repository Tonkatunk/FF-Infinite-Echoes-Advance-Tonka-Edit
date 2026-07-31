//-----------------------------------------------------------------------------
// Window_Options
//
// The window for changing various settings on the options screen.

var _window_Options_initialize = Window_Options.prototype.initialize;
Window_Options.prototype.initialize = function(rect) {
    _window_Options_initialize.apply(this,arguments);
    this.contents.fontSize = 8;
};

//-----------------------------------------------------------------------------
// Scene_Options
//
// The scene class of the options screen.

var _scene_Options_create = Scene_Options.prototype.create;
Scene_Options.prototype.create = function() {
    _scene_Options_create.apply(this,arguments);
    this.createMenuNameWindow("コンフィグ");
};

Scene_Options.prototype.createMenuNameWindow = function(name) {
    const width = this.mainFontSize()*8;
    var rect = new Rectangle(Graphics.boxWidth-width, 0,width,this.mainFontSize()*3.75);
    this._menuNameWindow = new Window_MenuName(rect);
    this._menuNameWindow.drawMenuName(name);
    this.addWindow(this._menuNameWindow);
};

Scene_Options.prototype.optionsWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight-this.mainFontSize()*3.75;
    const wx = 0;
    const wy = this.mainFontSize()*3.75;
    return new Rectangle(wx, wy, ww, wh);
};
