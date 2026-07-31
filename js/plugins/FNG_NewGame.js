//=============================================================================
// FNG_NewGame.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc ニューゲーム選択直後、最初にパーティ編成を行う画面
  * @author finga
  * @help ニューゲーム選択直後、最初にパーティ編成を行う画面
*/

//-----------------------------------------------------------------------------
// Scene_NewGame
//
// ・ニューゲーム選択直後に最初に構成するパーティを決定する

function Scene_NewGame() {
    this.initialize.apply(this, arguments);
}

Scene_NewGame.prototype = Object.create(Scene_MenuBase.prototype);
Scene_NewGame.prototype.constructor = Scene_NewGame;

Scene_NewGame.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_NewGame.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    console.log("newgame create")
    this.createMenuNameWindow("New Game");
    this.createMenuInfoWindow("Please choose starting party");
    this.createMembersWindow();
    this.createSubMembersWindow();
    this.createDesideWindow();
    this.createMemberChangeStatusWindow();
    this._membersWindow.select(0);
    this._membersWindow.activate();
    this._decideWindow.setHandler('left',this.onDecideLeft.bind(this));
};

Scene_NewGame.prototype.createMemberChangeStatusWindow = function() {
    const rect = this.memberChangeStatusWindowRect();
    const memberChangeStatusWindow = new Window_MemberChangeStatusNewGame(rect);
    this.addWindow(memberChangeStatusWindow);
    this._memberChangeStatusWindow = memberChangeStatusWindow;
    this._memberChangeStatusWindow.hide();
    this._subMembersWindow.setMemberChangeStatusWindow(this._memberChangeStatusWindow);
    this._membersWindow.setMemberChangeStatusWindow(this._memberChangeStatusWindow);
};

Scene_NewGame.prototype.memberChangeStatusWindowRect = function() {
    const ww = Graphics.boxWidth*77/100;
    const wh = Graphics.boxHeight*27/100;
    const wx = Math.floor(Graphics.boxWidth*23/100);
    const wy = Graphics.boxHeight-wh;
    return new Rectangle(wx, wy, ww, wh);
};

//-----------------------------------------------------------------------------
// Window_MemberChangeStatusNewGame
//
// ニューゲーム時のサブメンバーの情報を表示するウィンドウ

function Window_MemberChangeStatusNewGame() {
    this.initialize(...arguments);
}

Window_MemberChangeStatusNewGame.prototype = Object.create(Window_MemberChangeStatus.prototype);
Window_MemberChangeStatusNewGame.prototype.constructor = Window_MemberChangeStatusNewGame;

Window_MemberChangeStatusNewGame.prototype.initialize = function(rect) {
    Window_MemberChangeStatus.prototype.initialize.call(this,rect);
};

Window_MemberChangeStatusNewGame.prototype.drawStatus = function() {
    this.contents.clear();
    const x = this.contents.fontSize*6.5;
    const x2 = x + this.contents.fontSize*6.5;
    const h = this.innerHeight;
    const lineHeight = this.lineHeight();
    this.drawFace(this._actor.faceName(), this._actor.faceIndex(), 0, 0,$DOT*40,h);
    this.changeTextColor(ColorManager.normalColor());
    this.drawText(this._actor.name(), x, this.contents.fontSize*0.25, this.width-this.padding*2-this.contents.fontSize*3);
    this.drawActorName(this._actor, x, this.contents.fontSize*0.25);
    this.drawActorClass(this._actor, x2, this.contents.fontSize*0.25);
    this.drawActorCapaInfo(this._actor, x, this.contents.fontSize*0.25+this.lineHeight()/2);
};



Window_MemberChangeStatusNewGame.prototype.drawActorCapaInfo = function(actor, x, y) {
    this.resetTextColor();
    this.drawTextEx($dataActors[actor.actorId()].meta.capainfo, x, y,this.innerWidth-x);
};

//-----------------------------------------------------------------------------
// Window_SubMembersNewGame
//
// ニューゲーム時の待機メンバーが並ぶウィンドウ

function Window_SubMembersNewGame() {
    this.initialize(...arguments);
}

Window_SubMembersNewGame.prototype = Object.create(Window_SubMembers.prototype);
Window_SubMembersNewGame.prototype.constructor = Window_SubMembersNewGame;

Window_SubMembersNewGame.prototype.maxCols = function() {
    return 7;
};

Window_SubMembersNewGame.prototype.refresh = function() {
    this.contents.clear();
    this._data = $gameParty.subMembers();
    for(let i = 0;i<this._data.length%this.maxCols();i++){
		this._data.push(null);
	}
	this.drawItemAll();
};


Window_SubMembersNewGame.prototype.processCursorMove = function() {
    if (this.isCursorMovable()) {
        const lastIndex = this.index();
        if (Input.isRepeated("down")) {
            this.cursorDown(Input.isTriggered("down"));
        }
        if (Input.isRepeated("up")) {
            this.cursorUp(Input.isTriggered("up"));
        }
        if (Input.isRepeated("right")) {
            this.cursorRight(Input.isTriggered("right"));
        }
        if (Input.isRepeated("left")) {
            this.cursorLeft(Input.isTriggered("left"));
        }
        if (!this.isHandled("pagedown") && Input.isTriggered("pagedown")) {
            this.cursorPagedown();
        }
        if (!this.isHandled("pageup") && Input.isTriggered("pageup")) {
            this.cursorPageup();
        }
        if (this.index() !== lastIndex) {
            this.playCursorSound();
        }
    }
};

Window_SubMembers.prototype.cursorLeft = function(wrap) {
    Window_Selectable.prototype.cursorLeft.call(this);
};

Window_SubMembers.prototype.cursorRight = function(wrap) {
    Window_Selectable.prototype.cursorRight.call(this);
};

Scene_NewGame.prototype.createSubMembersWindow = function() {
    const rect = this.subMembersWindowRect();
    const subMembersWindow = new Window_SubMembersNewGame(rect);
    this.addWindow(subMembersWindow);
    this._subMembersWindow = subMembersWindow;
    this._subMembersWindow.deactivate();
    this._subMembersWindow.hide();
    this._subMembersWindow.setHandler('ok',this.onSubMembersOk.bind(this));
    this._subMembersWindow.setHandler('cancel',this.onSubMembersCancel.bind(this));
};

Scene_NewGame.prototype.subMembersWindowRect = function() {
    const ww = Graphics.boxWidth*77/100;
    const wh = Graphics.boxHeight*73/100;
    const wx = Math.floor(Graphics.boxWidth*23/100);
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_NewGame.prototype.onSubMembersOk = function(){
	if(!this._subMembersWindow.item()){
		this._subMembersWindow.playBuzzerSound();
		this._subMembersWindow.activate();
		return;
	}
    this._membersWindow.playCursorSound();
    this._membersWindow.activate();
    this._subMembersWindow.deactivate();
    this._subMembersWindow.hide();
    this._memberChangeStatusWindow.hide();
    this.memberChange();
    this._membersWindow.refresh();
	this._subMembersWindow.refresh();
}

Scene_NewGame.prototype.memberChange = function(){
    const mainActorId = $gameParty._actors[this._membersWindow.index()];
    const mainActor = $gameActors.actor(mainActorId);
    const subActor = $gameParty._subMembers[this._subMembersWindow.index()];
    const subActorId = subActor.actorId();
    $gameParty._actors[this._membersWindow.index()] = subActor.actorId();
    $gameParty._subMembers[this._subMembersWindow.index()] = $gameActors.actor(mainActorId);
	console.log($gameActors.actor(mainActorId));
}

Scene_NewGame.prototype.onSubMembersCancel = function(){
    SoundManager.playCancel();
    this._membersWindow.activate();
    this._subMembersWindow.deactivate();
    this._subMembersWindow.hide();
    this._memberChangeStatusWindow.hide();
}

Scene_NewGame.prototype.onMembersOk = function(){
    this._membersWindow.playCursorSound();
    this._membersWindow.deactivate();
    this._subMembersWindow.drawItemAll();
    this._subMembersWindow.activate();
    this._subMembersWindow.show();
    this._memberChangeStatusWindow.show();
}

Scene_NewGame.prototype.onMembersRight = function(){
    this._membersWindow.playCursorSound();
    this._membersWindow.deactivate();
    this._decideWindow.activate();
}

Scene_NewGame.prototype.onDecideLeft = function(){
    this._membersWindow.playCursorSound();
    this._membersWindow.activate();
    this._decideWindow.deactivate();
}

Scene_NewGame.prototype.createDesideWindow = function(name) {
    const width = this._menuNameWindow.width;
    const height = this._menuNameWindow.height;
    var rect = new Rectangle(Graphics.boxWidth-width, Graphics.boxHeight-height, width,height);
    this._decideWindow = new Window_NewGameCommand(rect);
    this._decideWindow.setHandler("decide", this.commandDecide.bind(this));
    this.addWindow(this._decideWindow);
    this._decideWindow.deactivate();
};

Scene_NewGame.prototype.commandDecide = function() {
    AudioManager.playSe({"name":"FF8 newgame","volume":90,"pitch":100,"pan":0});
    this.fadeOutAll();
    SceneManager.goto(Scene_Map);
};

function Window_NewGameCommand() {
    this.initialize(...arguments);
}

Window_NewGameCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_NewGameCommand.prototype.constructor = Window_NewGameCommand;

Window_NewGameCommand.prototype.initialize = function(rect) {
    Window_HorzCommand.prototype.initialize.call(this, rect);
};

Window_NewGameCommand.prototype.maxCols = function() {
    return 1;
};

Window_NewGameCommand.prototype.makeCommandList = function() {
    this.addCommand("けってい", "decide");
};

Window_NewGameCommand.prototype.processCursorMove = function() {
    //カーソルムーブしない
    if (this.isOpenAndActive() && Input.isRepeated("left")) {
        this.callHandler("left");
    }
};

Window_NewGameCommand.prototype.processHandling = function() {
    Window_Selectable.prototype.processHandling.call(this);
    if (this.isOpenAndActive()) {
        if (this.isHandled("left") && Input.isTriggered("left")) {
            return this.processLeft();
        }
    }
};


Scene_NewGame.prototype.createMenuNameWindow = function(name) {
    const width = this.mainFontSize()*6+this.mainFontSize()*5/4;
    const height = this.mainFontSize()*3;
    var rect = new Rectangle(Graphics.boxWidth-width, 0, width,height);
    this._menuNameWindow = new Window_MenuName(rect);
    this._menuNameWindow.drawMenuName(name);
    this.addWindow(this._menuNameWindow);
};

Scene_NewGame.prototype.createMenuInfoWindow = function(info) {
    const width = this._menuNameWindow.width;
    const height = Graphics.boxHeight-this._menuNameWindow.height;
    var rect = new Rectangle(Graphics.boxWidth-width, this._menuNameWindow.height, width,height);
    this._menuInfoWindow = new Window_Base(rect);
    this._menuInfoWindow.drawTextEx(info,0,$DOT);
    this.addWindow(this._menuInfoWindow);
};

Scene_NewGame.prototype.createMembersWindow = function() {
    const rect = this.membersWindowRect();
    this._membersWindow = new Window_NewGameMembers(rect);
    this._membersWindow.setHandler('right',this.onMembersRight.bind(this)); 
    this._membersWindow.setHandler('ok',this.onMembersOk.bind(this));
    this.addWindow(this._membersWindow);
};

function Window_NewGameMembers() {
    this.initialize(...arguments);
}

Window_NewGameMembers.prototype = Object.create(Window_MenuStatus.prototype);
Window_NewGameMembers.prototype.constructor = Window_NewGameMembers;

Window_NewGameMembers.prototype.initialize = function(rect) {
    Window_MenuStatus.prototype.initialize.call(this, rect);
};

Window_NewGameMembers.prototype.drawActorSimpleStatus = function(actor, x, y) {
    const lineHeight = this.lineHeight();
    const x2 = x + this.contents.fontSize*7;
    this.drawActorName(actor, x, y);
    this.drawActorClass(actor, x2, y);
    this.drawActorCapaInfo(actor, x, y+this.lineHeight()/2);
};

Window_NewGameMembers.prototype.drawActorCapaInfo = function(actor, x, y) {
    this.resetTextColor();
    this.drawTextEx($dataActors[actor.actorId()].meta.capainfo, x, y,this.innerWidth-x);
};

Window_NewGameMembers.prototype.lineHeight = function() {
    return this.contents.fontSize+1;
};

Scene_NewGame.prototype.membersWindowRect = function() {
    const ww = Graphics.boxWidth-this._menuNameWindow.width;
    const wh = Graphics.boxHeight;
    const wx = 0;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};

/*
Scene_Crystal.prototype.createMateriaListWindow = function() {
    var rect = this.materiaListWindowRect();
    this._materiaListWindow = new Window_CrystalMaterias(rect);
    this._materiaListWindow.setHandler("cancel", this.onMateriaListCancel.bind(this));
    this._materiaListWindow.setHandler("ok", this.onMateriaListOk.bind(this));
    this._materiaListWindow._index = 0;
    this.addWindow(this._materiaListWindow);
};

Scene_Crystal.prototype.materiaListWindowRect = function() {
    const ww = Graphics.boxWidth-this.mainFontSize()*12;
    const wh = Graphics.boxHeight-this.mainFontSize()*6-this.mainFontSize()*7/8;
    const wx = Graphics.boxWidth-ww;
    const wy = this.mainFontSize()*3;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Crystal.prototype.createStatusWindow = function() {
    var rect = this.statusWindowRect();
    this._statusWindow = new Window_CrystalStatus(rect);
    this._statusWindow.setHandler("cancel", this.onStatusCancel.bind(this));
    this._statusWindow.setHandler("ok", this.onStatusOk.bind(this));
    this._statusWindow._index = 0;
    this.addWindow(this._statusWindow);
};

Scene_Crystal.prototype.statusWindowRect = function() {
    const ww = Graphics.boxWidth-this.mainFontSize()*12;
    const wh = Graphics.boxHeight-this.mainFontSize()*6-this.mainFontSize()*7/8;
    const wx = Graphics.boxWidth-ww;
    const wy = this.mainFontSize()*3;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Crystal.prototype.helpWindowRect = function() {
    const wx = this.mainFontSize;
    const wh = this.mainFontSize()*3+this.mainFontSize()*7/8;
    const wy = Graphics.boxHeight-wh;
    const ww = Graphics.boxWidth;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Crystal.prototype.createCrystalListWindow = function() {
    var rect = this.crystalListWindowRect();
    this._crystalListWindow = new Window_CrystalList(rect);
    this._crystalListWindow.setHandler("cancel", this.onCrystalCancel.bind(this));
    this._crystalListWindow.setHandler("ok", this.onCrystalOk.bind(this));
    this.addWindow(this._crystalListWindow);
};

Scene_Crystal.prototype.createHelpWindow = function() {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_Help(rect);
    this.addWindow(this._helpWindow);
};

Scene_Crystal.prototype.helpWindowRect = function() {
    const wx = 0;
    const wh = this.mainFontSize()*3+this.mainFontSize()*7/8;
    const wy = Graphics.boxHeight-wh;
    const ww = Graphics.boxWidth;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Crystal.prototype.createCommandWindow = function() {
    const rect = this.commandWindowRect();
    const commandWindow = new Window_CrystalCommand(rect);
    commandWindow.setHandler("materia", this.commandMateria.bind(this));
    commandWindow.setHandler("junction", this.commandJunction.bind(this));
    commandWindow.setHandler("cancel", this.popScene.bind(this));
    this._commandWindow = commandWindow;
    this.addWindow(this._commandWindow);
}

Scene_Crystal.prototype.commandWindowRect = function() {
    const ww = Graphics.boxWidth-(this.mainFontSize()*5+this.mainFontSize()*5/4);
    const wh = this.mainFontSize()*3;
    const wx = 0;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Crystal.prototype.createCheckWindow = function() {
    const rect = this.checkWindowRect();
    const checkWindow = new Window_CrystalApConsumeCheck(rect);
    checkWindow.setHandler("ok", this.onCheckOk.bind(this));
    checkWindow.setHandler("cancel", this.onCheckCancel.bind(this));
    this._checkWindow = checkWindow;
    this.addWindow(this._checkWindow);
}

Scene_Crystal.prototype.checkWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = this.mainFontSize()*7;
    const wx = 0;
    const wy = Graphics.boxHeight/2-wh/2;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Crystal.prototype.crystalListWindowRect = function() {
    const ww = this.mainFontSize()*12;
    const wh = Graphics.boxHeight-this.mainFontSize()*6-this.mainFontSize()*7/8;
    const wx = 0;
    const wy = this.mainFontSize()*3;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Crystal.prototype.commandMateria = function() {
    this._helpWindow.clear()
    this._crystalListWindow.activate();
}

Scene_Crystal.prototype.commandJunction = function() {
    this._helpWindow.clear()
    this._crystalListWindow.activate();
}

Scene_Crystal.prototype.onCrystalCancel = function() {
    this._commandWindow.activate();
}

Scene_Crystal.prototype.onCrystalOk = function() {
    if(this._commandWindow._index == 1){
        this._statusWindow.activate();
    }else{
        this._materiaListWindow.activate();
    }
}

Scene_Crystal.prototype.onCheckCancel = function() {
    this._checkWindow.hide();
    this._materiaListWindow.activate();
}

Scene_Crystal.prototype.onCheckOk = function() {
    const index = this._materiaListWindow.index();
    const crystalItem = this._crystalListWindow._data[this._crystalListWindow._index];
    const crystal = $gameCrystals._data[crystalItem.id-250];
    const ability = $dataArmors[crystal._abilities[index]];
    const cost = crystal._costs[index];
    $gameParty.gainItem(ability,1);
    crystal.consumeAp(cost);
    crystal.setGettable(false,index);
    this._crystalListWindow.refresh();
    this._materiaListWindow.refresh();
    this._checkWindow.hide();
    this._materiaListWindow.activate();
}

Scene_Crystal.prototype.onMateriaListCancel = function() {
    this._helpWindow.clear()
    this._crystalListWindow.activate();
}

Scene_Crystal.prototype.onStatusCancel = function() {
    this._crystalListWindow.activate();
}

Scene_Crystal.prototype.onStatusOk = function() {
    const index = this._statusWindow.index();
    const actor = this._statusWindow.actor(index);
    const crystalItem = this._crystalListWindow._data[this._crystalListWindow._index];
    const crystal = $gameCrystals._data[crystalItem.id-250];
    crystal._actor = actor;
    this._statusWindow.refresh();
    this._crystalListWindow.activate();
}

Scene_Crystal.prototype.onMateriaListOk = function() {
    const index = this._materiaListWindow.index();
    const crystalItem = this._crystalListWindow._data[this._crystalListWindow._index];
    const crystal = $gameCrystals._data[crystalItem.id-250];
    const ability = $dataArmors[crystal._abilities[index]];
    const cost = crystal._costs[index];
    if(crystal._ap >= cost && crystal._gettables[index]){
        this._checkWindow._crystal = crystal;
        this._checkWindow._cost = cost;
        this._checkWindow._item = ability;
        this._checkWindow.show();
        this._checkWindow.activate();
    }
}*/