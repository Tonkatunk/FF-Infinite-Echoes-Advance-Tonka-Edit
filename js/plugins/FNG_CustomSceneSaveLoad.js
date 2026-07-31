//=============================================================================
// FNG_CustomSceneSaveLoad.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc セーブ＆ロード画面をカスタムします
  * @author finga
  * @help セーブ＆ロード画面をカスタムします
*/

Scene_File.prototype.createMenuNameWindow = function(name) {
    const width = Graphics.boxWidth-this._helpWindow.width;
    const height = this._helpWindow.height;
    var rect = new Rectangle(Graphics.boxWidth-width, 0, width,height);
    this._menuNameWindow = new Window_MenuName(rect);
    this._menuNameWindow.drawMenuName(name);
    this.addWindow(this._menuNameWindow);
};

Scene_File.prototype.helpWindowRect = function() {
    const wx = 0;
    const wy = this.mainAreaTop();
    const ww = Graphics.boxWidth-this.mainFontSize()*4-this.mainFontSize()*5/4;
    const wh = this.mainFontSize()*3;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Save.prototype.create = function() {
    Scene_File.prototype.create.call(this);
    this.createMenuNameWindow("セーブ");
    DataManager.loadAllSavefileImages();
};

Scene_Load.prototype.create = function() {
    Scene_File.prototype.create.call(this);
    this.createMenuNameWindow("ロード");
    DataManager.loadAllSavefileImages();
};

Window_SavefileList.prototype.numVisibleRows = function() {
    return 3;
};

Window_SavefileList.prototype.drawContents = function(info, rect) {
    const bottom = rect.y + rect.height;
    this.drawPartyCharacters(info, rect.x+$TILE*3, bottom - $TILE/2);
    const lineHeight = this.lineHeight();
    const y2 = bottom - lineHeight - 4;
    
    this.drawPlaytime(info, rect.x, rect.y+$TILE/4, rect.width);
    this.drawText(info.characters[0][2],rect.x,rect.y+$TILE);
    this.changeTextColor(ColorManager.systemColor());
    this.drawText("Lv.",rect.x,rect.y+$TILE*1.75);
    this.drawText("LOCATION",rect.x,rect.y+$TILE,rect.width,"right");
    this.drawText("TIME          ",rect.x,rect.y+$TILE/4,rect.width,"right");
    this.changeTextColor(ColorManager.normalColor());
    this.drawText("   "+info.characters[0][3],rect.x,rect.y+$TILE*1.75);
    this.drawText(info.characters[0][4],rect.x,rect.y+$TILE*1.75,rect.width,"right");
    if(info.characters[0].length>4){
        switch(info.characters[0][5]){
            case 0:
                this.changeTextColor(ColorManager.textColor(4));
                this.drawText("EASY",rect.x+24,rect.y+$TILE*1.75);
                break;
            case 1:
                this.changeTextColor(ColorManager.textColor(3));
                this.drawText("NORMAL",rect.x+24,rect.y+$TILE*1.75);
                break;
            case 2:
                this.changeTextColor(ColorManager.textColor(17));
                this.drawText("HARD",rect.x+24,rect.y+$TILE*1.75);
                break;
        }
    }
    if(info.characters[0][6]){
        this.drawIcon(88,rect.x+$TILE*2.5,rect.y-1)
    }
    this.changeTextColor(ColorManager.normalColor());
};

Window_SavefileList.prototype.drawPartyCharacters = function(info, x, y) {
    if (info.characters) {
        let characterX = x;
        for (const data of info.characters) {
            this.drawSvActor(data[0],10,characterX,y-$TILE*2);
            characterX += $TILE*1.25;
        }
    }
};

Window_SavefileList.prototype.drawTitle = function(savefileId, x, y) {
    this.changeTextColor(ColorManager.systemColor());
    if (savefileId === 0) {
        this.drawText(TextManager.autosave, x, y, 180);
        this.changeTextColor(ColorManager.normalColor());
    } else {
        this.drawText(TextManager.file + " " + savefileId, x, y, 180);
        this.changeTextColor(ColorManager.normalColor());
        this.drawText("　　　　 " + savefileId, x, y, 180);
    }
};

Window_SavefileList.prototype.colSpacing = function() {
    return $TILE;
};

Game_Party.prototype.charactersForSavefile = function() {
    return this.battleMembers().map(actor => [
        actor.battlerName(),
        actor.characterIndex(),
        actor.name(),
        actor.level,
        $gameMap.displayName(),
        $gameSystem.difficulty(),
        $gameSwitches.value(18)
    ]);
};

DataManager.loadSavefileImages = function(info) {
    if (info.characters && Symbol.iterator in info.characters) {
        for (const character of info.characters) {
            ImageManager.loadSvActor(character[0]);
        }
    }
    if (info.faces && Symbol.iterator in info.faces) {
        for (const face of info.faces) {
            ImageManager.loadFace(face[0]);
        }
    }
};

DataManager.saveGame = function(savefileId) {
    console.log("trying makeSaveContents...");
    const contents = this.makeSaveContents();
    console.log("trying makeSavename...");
    const saveName = this.makeSavename(savefileId);
    console.log("return StorageManager.saveObject...");
    return StorageManager.saveObject(saveName, contents).then(() => {
        this._globalInfo[savefileId] = this.makeSavefileInfo();
        this.saveGlobalInfo();
        return 0;
    });
};

const _DataManager_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    const contents = _DataManager_makeSaveContents.call(this);
    try {
        JSON.stringify(contents, this.circularReferenceReplacer());
    } catch (error) {
        console.error("循環参照が検出されました:", error);
        SoundManager.playBuzzer();
        throw new Error("循環参照が検出されました。セーブできません。");
    }
    return contents;
};

DataManager.circularReferenceReplacer = function() {
    const seen = new WeakSet();
    return function(key, value) {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return "[Circular]";
            }
            seen.add(value);
        }
        return value;
    };
};

Scene_GameEnd.prototype.commandToTitle = function() {
    DataManager._globalInfo[0] = DataManager.makeSavefileInfo();
    DataManager._globalInfo.interruption = true;
    DataManager.saveGlobalInfo();
    this.executeAutosave();
    this.fadeOutAll();
    SceneManager.goto(Scene_Title);
    Window_TitleCommand.initCommandPosition();
};

DataManager.latestSavefileId = function() {
    if(DataManager._globalInfo.interruption){
        return 0;
    }
    const globalInfo = this._globalInfo;
    const validInfo = globalInfo.slice(1).filter(x => x);
    const latest = Math.max(...validInfo.map(x => x.timestamp));
    const index = globalInfo.findIndex(x => x && x.timestamp === latest);
    return index > 0 ? index : 0;
};

Scene_Load.prototype.firstSavefileId = function() {
    if(DataManager._globalInfo.interruption){
        return 0;
    }
    return DataManager.latestSavefileId();
};

Scene_Load.prototype.executeLoad = function(savefileId) {
    DataManager._globalInfo.interruption = false;
    DataManager.saveGlobalInfo();
    DataManager.loadGame(savefileId)
        .then(() => this.onLoadSuccess(savefileId))
        .catch(() => this.onLoadFailure());
};

Scene_Load.prototype.onLoadSuccess = function(savefileId) {
    if(savefileId == 0){
        // 中断セーブ(file0)を削除する
        StorageManager.remove("file0");
    }
    SoundManager.playLoad();
    this.fadeOutAll();
    this.reloadMapIfUpdated();
    SceneManager.goto(Scene_Map);
    this._loadSuccess = true;
};

Scene_GameEnd.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createInterruptMessageWindow();
    this.createCommandWindow();
};

Scene_GameEnd.prototype.createInterruptMessageWindow = function(info) {
    const width = Graphics.boxWidth/2.2;
    const height = $TILE*2.5;
    var rect = new Rectangle(Graphics.boxWidth/2-width/2, Graphics.boxHeight/2-$TILE*3.5, width,height);
    this._messageWindow = new Window_Base(rect);
    this._messageWindow.changeTextColor(ColorManager.crisisColor());
    this._messageWindow.drawText("ちゅうだんセーブをして",0,$DOT);
    this._messageWindow.drawText("ゲームをしゅうりょう",0,9);
    this._messageWindow.drawText("しますか？",0,17);
    this._messageWindow.resetTextColor();
    this.addWindow(this._messageWindow);
};

Window_GameEnd.prototype.playOkSound = function() {
    if(this._index == 0){
        SoundManager.playSave();
    }else{
        SoundManager.playOk();
    }
};

