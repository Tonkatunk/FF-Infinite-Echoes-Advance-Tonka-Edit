//=============================================================================
// FNG_ActorSummon.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc アクター召喚ポイントと引き換えにアクターを召喚します
  * @author finga
  * @help アクター召喚ポイントと引き換えにアクターを召喚します
*/

function Scene_ActorSummon() {
    this.initialize.apply(this, arguments);
}

Scene_ActorSummon.prototype = Object.create(Scene_MenuBase.prototype);
Scene_ActorSummon.prototype.constructor = Scene_ActorSummon;

Scene_ActorSummon.prototype.initialize = function() {
  
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_ActorSummon.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createMenuNameWindow("しょうかん");
    this.createNumWindow();
    this.createSubMembersWindow();
    this.createMemberChangeStatusWindow();
    this.createCheckWindow();
};

Scene_ActorSummon.prototype.onCheckOk = function() {
    $gameParty.addSubMember(this._subMembersWindow.item());
    $gameActors.actor(this._subMembersWindow.item().actorId()).initialize(this._subMembersWindow.item().actorId());
    this._subMembersWindow.item().changeExp($gameParty.initialExp(), false);
    $gameVariables.setValue(3,$gameVariables.value(3)-1);
    this._subMembersWindow.refresh();
    this._numWindow.refresh();
    this.onCheckCancel();
}

Scene_ActorSummon.prototype.onCheckCancel = function() {
    this._checkWindow.hide();
    this._subMembersWindow.activate();
}

Scene_ActorSummon.prototype.checkWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = this.mainFontSize()*7;
    const wx = 0;
    const wy = Graphics.boxHeight/2-wh/2;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_ActorSummon.prototype.createCheckWindow = function() {
    const rect = this.checkWindowRect();
    const checkWindow = new Window_SummonActorConsumeCheck(rect);
    checkWindow.setHandler("ok", this.onCheckOk.bind(this));
    checkWindow.setHandler("cancel", this.onCheckCancel.bind(this));
    this._checkWindow = checkWindow;
    this.addWindow(this._checkWindow);
}

Scene_ActorSummon.prototype.subMembersWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight*60/100;
    const wx = 0;
    const wy = this._menuNameWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_ActorSummon.prototype.createMemberChangeStatusWindow = function() {
    const rect = this.memberChangeStatusWindowRect();
    const memberChangeStatusWindow = new Window_MemberChangeStatusNewGame(rect);
    this.addWindow(memberChangeStatusWindow);
    this._memberChangeStatusWindow = memberChangeStatusWindow;
    this._subMembersWindow.setMemberChangeStatusWindow(this._memberChangeStatusWindow);
};

Scene_ActorSummon.prototype.memberChangeStatusWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight-this._subMembersWindow.y-this._subMembersWindow.height;
    const wx = 0;
    const wy = Graphics.boxHeight-wh;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_ActorSummon.prototype.createSubMembersWindow = function() {
    const rect = this.subMembersWindowRect();
    this._subMembersWindow = new Window_SubMembersSummon(rect);
    this.addWindow(this._subMembersWindow);
    this._subMembersWindow.activate();
    this._subMembersWindow.setHandler('ok',this.onSubMembersOk.bind(this));
    this._subMembersWindow.setHandler('cancel',this.popScene.bind(this));
};

Scene_ActorSummon.prototype.onSubMembersOk = function() {
    const actor = this._subMembersWindow.item();
    if(this._subMembersWindow.isCurrentItemEnabled()){
        this._checkWindow._actor = actor;
        this._checkWindow.show();
        this._checkWindow.activate();
    }
};

Scene_ActorSummon.prototype.createNumWindow = function() {
    const width = this.mainFontSize()*6+this.mainFontSize()*5/4;
    const height = this.mainFontSize()*3;
    var rect = new Rectangle(0, 0, Graphics.boxWidth-this._menuNameWindow.width,this._menuNameWindow.height);
    this._numWindow = new Window_SummonableNum(rect);
    this.addWindow(this._numWindow);
};

Scene_ActorSummon.prototype.createMenuNameWindow = function(name) {
    const width = this.mainFontSize()*6+this.mainFontSize()*5/4;
    const height = this.mainFontSize()*3;
    var rect = new Rectangle(Graphics.boxWidth-width, 0, width,height);
    this._menuNameWindow = new Window_MenuName(rect);
    this._menuNameWindow.drawMenuName(name);
    this.addWindow(this._menuNameWindow);
};

//-----------------------------------------------------------------------------
// Window_SummonableNum
// 
// アクターを残り何人召喚できるかを表示する

function Window_SummonableNum() {
    this.initialize(...arguments);
}

Window_SummonableNum.prototype = Object.create(Window_Base.prototype);
Window_SummonableNum.prototype.constructor = Window_SummonableNum;

Window_SummonableNum.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.refresh();
};

Window_SummonableNum.prototype.refresh = function() {
    this.contents.clear();
    this.drawText("あと "+$gameVariables.value(3)+"にん しょうかんできます",0,this.innerHeight/2-$TILE/4,this.innerWidth);
};

Window_SummonableNum.prototype.setup = function(num) {
    this.contents.clear();
    this._num = num;
    this.refresh();
};

//-----------------------------------------------------------------------------
// Window_SubMembersSummon
// 
// 召喚できるメンバーを選ぶウィンドウ

function Window_SubMembersSummon() {
    this.initialize(...arguments);
}

Window_SubMembersSummon.prototype = Object.create(Window_SubMembers.prototype);
Window_SubMembersSummon.prototype.constructor = Window_SubMembersSummon;

Window_SubMembersSummon.prototype.maxCols = function() {
    return 9;
};

/*
Window_SubMembersSummon.prototype.itemRect = function(index) {
    const rect = new Rectangle();
    rect.x = Math.floor(this.innerWidth/9*(index%9));
    rect.y = Math.floor(this.innerHeight/3*Math.floor(index/9));
    rect.width = this.innerWidth/6;
    rect.height = this.innerHeight/3;
    return rect;
};*/

Window_SubMembersSummon.prototype.initialize = function(rect) {
    Window_ItemList.prototype.initialize.call(this, rect);
    this._index = 0;
    this._data = $gameParty.summonableActors();
    for(let i = 0;i<this._data.length%this.maxCols();i++){
		this._data.push(null);
	}
    this.loadSvActorImages();
    this.drawItemAll();
};

Window_SubMembersSummon.prototype.refresh = function() {
    Window_SubMembers.prototype.refresh.call(this);
    this._data = $gameParty.summonableActors();
    for(let i = 0;i<this._data.length%this.maxCols();i++){
		this._data.push(null);
	}
    this.drawItemAll();
};

Window_SubMembersSummon.prototype.lineHeight = function() {
    return this.innerHeight/3;
};

/*
Window_SubMembersSummon.prototype.drawSvActor = function(
    SvActorName, svActorIndex, x, y
) {
    const bitmap = ImageManager.loadSvActor(SvActorName);
    const width = bitmap.width;
    const height = bitmap.height;
    const sx = (svActorIndex % 9) * width/9;
    const sy = Math.floor(svActorIndex / 9) * height/6;
    bitmap.addLoadListener(function() {
        this.contents.blt(bitmap,sx,sy,width/9,height/6,x,y);
    }.bind(this));
};*/

Window_SubMembersSummon.prototype.processCursorMove = function() {
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

Window_SubMembersSummon.prototype.isEnabled = function(){
    return $gameVariables.value(3) > 0;
}

Window_SubMembersSummon.prototype.processOk = function() {4
    if (this.item() && this.isCurrentItemEnabled()) {
        this.playOkSound();
        this.updateInputData();
        this.deactivate();
        this.callOkHandler();
    } else {
        this.playBuzzerSound();
        this.activate();
    }
};

//-----------------------------------------------------------------------------
// Window_SummonActorConsumeCheck
//
// 召喚ポイント消費の最終確認


function Window_SummonActorConsumeCheck() {
    this.initialize(...arguments);
}

Window_SummonActorConsumeCheck.prototype = Object.create(Window_HorzCommand.prototype);
Window_SummonActorConsumeCheck.prototype.constructor = Window_SummonActorConsumeCheck;

Window_SummonActorConsumeCheck.prototype.initialize = function(rect) {
    Window_HorzCommand.prototype.initialize.call(this, rect);
    this.deactivate();
    this.hide();
    this._actor = null;
    this._cost = 0;
    this._item = null;
};

Window_SummonActorConsumeCheck.prototype.update = function(rect) {
    Window_HorzCommand.prototype.update.call(this, rect);
    if(this._actor){
        this.drawItem();   
    }
};

Window_SummonActorConsumeCheck.prototype.maxCols = function() {
    return 2;
};

Window_SummonActorConsumeCheck.prototype.makeCommandList = function() {
    this.addCommand("はい", "ok");
    this.addCommand("いいえ", "cancel");
};

Window_SummonActorConsumeCheck.prototype.drawItem = function(){
    if(!this._actor){
        return;
    }
    this.contents.clear();
    var text = "";
    text = this._actor.name()+"をしょうかんします。";
    this.drawTextEx(text,0,this.lineHeight()*0.5,this.innerWidth,"center");
    this.drawText("よろしいですか？",0,this.lineHeight()*2.5,this.innerWidth,"center");
    this.drawText("はい",0,this.lineHeight()*4,this.innerWidth/2,"center");
    this.drawText("いいえ",this.innerWidth/2,this.lineHeight()*4,this.innerWidth/2,"center");
}

Window_SummonActorConsumeCheck.prototype.itemRect = function() {
    const rect = new Rectangle();
    rect.x = this.index()%2*this.innerWidth/2 + this.contents.fontSize*1.75;
    rect.y = this.contents.fontSize*4;
    rect.width = this.innerWidth/2 - this.contents.fontSize*3.5;
    rect.height = this.lineHeight()*1.75;
    return rect;
};

Window_SummonActorConsumeCheck.prototype.playOkSound  = function() {
    AudioManager.playSe({"name":"FF8 levelup","volume":90,"pitch":100,"pan":0})
};

Game_Party.prototype.summonableActors = function() {
    var actorsId = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,29,30,32,33,34,35,36,37,38,39,40,41,44,45,50,52,54,55,56,57,59];
    var nots = $gameParty.members().concat($gameParty.subMembers());
    var actors = [];
    for(id of actorsId){
        if(!nots.includes($gameActors.actor(id))){
            actors.push($gameActors.actor(id));
        }
    }
    return actors;
};

Game_Party.prototype.allActorsSummon = function() {
    for(actor of this.summonableActors()){
        const a = actor;
        if(!a){
            continue;
        }
        $gameParty.addSubMember(a);
        $gameActors.actor(a.actorId()).initialize(a.actorId());
        console.log(a);
        a.changeExp($gameParty.initialExp(), false);
    }
    $gameVariables.setValue(3,0);
    
}