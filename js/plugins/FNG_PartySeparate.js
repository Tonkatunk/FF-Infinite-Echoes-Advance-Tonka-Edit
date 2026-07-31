//=============================================================================
// FNG_PartySeparate.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc パーティを２つ・３つに分割する編成画面です
  * @author finga
  * @help パーティを２つ・３つに分割する編成画面です
*/

//-----------------------------------------------------------------------------
// Game_Party
// 
// 分割パーティの情報を追加

//現在のパーティ数を返す
Game_Party.prototype.partyNum = function(){
    return this._partyNum;
}

//パーティ数を変更する
Game_Party.prototype.setPartyNum = function(num) {
    this._partyNum = num;
}

//分割したパーティのメンバーを返す
Game_Party.prototype.separatedMembers = function(no){
    if(!this._separatedMembers){
        this.resetSeparatedMembers();
    }
    return this._separatedMembers[no-1];
}

//分割パーティのメンバーを設定
Game_Party.prototype.setSeparatedMembers = function(no,members){
    this._separatedMembers[no-1] = members;
}

//分割パーティのメンバーをリセット
Game_Party.prototype.resetSeparatedMembers = function(no,ids){
    this._separatedMembers = [$gameParty.members(),[null,null,null,null,null],[null,null,null,null,null]];
}

//該当パーティのメンバーをサブメンバーリストへ戻す
Game_Party.prototype.returnSeparatedPartyToSubmembers = function(no){
    for(member of this._separatedMembers[no-1]){
        this._subMembers.push(member)
    }
}

//-----------------------------------------------------------------------------
// Scene_PartySeparate
// 
// シーンクラス

function Scene_PartySeparate() {
    this.initialize.apply(this, arguments);
}

Scene_PartySeparate.prototype = Object.create(Scene_MenuBase.prototype);
Scene_PartySeparate.prototype.constructor = Scene_PartySeparate;

Scene_PartySeparate.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_PartySeparate.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this._tempWindow = null;
    this._tempIndex = null;
    this.createMenuNameWindow("Modification");
    this.createNumWindow();
    this.createSubMembersWindow();
    this.createDummyWindow();
    this.createStatusWindow();
    this.createPartyWindows();
    this._subMembersWindow.drawItemAll();
    this._party1Window.drawItemAll();
    this._party2Window.drawItemAll();
    this._party3Window.drawItemAll();
};

Scene_PartySeparate.prototype.createPartyWindows = function() {
    const baserect = this.dummyWindowRect();
    const rectp1 = new Rectangle(baserect.x,baserect.y,baserect.width/2,baserect.height/2);
    const rectp2 = new Rectangle(baserect.width/2,baserect.y,baserect.width/2,baserect.height/2);
    const rectp3 = new Rectangle(baserect.x,baserect.y+baserect.height/2,baserect.width/2,baserect.height/2);
    const party1Window = new Window_SeparatedMembers(rectp1,1);
    const party2Window = new Window_SeparatedMembers(rectp2,2);
    const party3Window = new Window_SeparatedMembers(rectp3,3);
    this.addWindow(party1Window);
    this.addWindow(party2Window);
    this.addWindow(party3Window);
    this._party1Window = party1Window;
    this._party2Window = party2Window;
    this._party3Window = party3Window;
    this._party1Window.setHandler('upex',this.onParty1up.bind(this));
    this._party2Window.setHandler('upex',this.onParty2up.bind(this));
    this._party3Window.setHandler('upex',this.onParty3up.bind(this));
    this._party1Window.setHandler('downex2',this.onParty1down.bind(this));
    this._party2Window.setHandler('downex2',this.onParty2down.bind(this));
    this._party3Window.setHandler('downex2',this.onParty3down.bind(this));
    this._party1Window.setHandler('rightex',this.onParty1rightex.bind(this));
    this._party2Window.setHandler('leftex',this.onParty2leftex.bind(this));
    this._party1Window.setHandler('ok',this.onParty1Ok.bind(this));
    this._party2Window.setHandler('ok',this.onParty2Ok.bind(this));
    this._party3Window.setHandler('ok',this.onParty3Ok.bind(this));
    this._party1Window.setHandler('cancel',this.onParty1Cancel.bind(this));
    this._party2Window.setHandler('cancel',this.onParty2Cancel.bind(this));
    this._party3Window.setHandler('cancel',this.onParty3Cancel.bind(this));
    this._party1Window.setStatusWindow(this._statusWindow);
    this._party2Window.setStatusWindow(this._statusWindow);
    this._party3Window.setStatusWindow(this._statusWindow);
    this._party1Window.deactivate();
    this._party1Window._index = 0;
    this._party2Window.deactivate();
    this._party2Window._index = 0;
    this._party3Window.deactivate();
    this._party3Window._index = 0;
    if($gameParty.partyNum() < 2){
        this._party2Window.hide();
    }
    if($gameParty.partyNum() < 3){
        this._party3Window.hide();
    }
    this._lastActiveWindow = this._party1Window;
};

Scene_PartySeparate.prototype.onParty1down = function() {
    if($gameParty.partyNum() >= 3){
        SoundManager.playCursor();
        this._party3Window.activate();
        this._party1Window.deactivate();
        this._lastActiveWindow = this._party1Window;
    }
};

Scene_PartySeparate.prototype.onParty2down = function() {
    if($gameParty.partyNum() >= 3){
        SoundManager.playCursor();
        this._party3Window.activate();
        this._party2Window.deactivate();
        this._lastActiveWindow = this._party2Window;
    }
};

Scene_PartySeparate.prototype.onParty3down = function() {
    console.log("なにもしないぞ");
    //何もしない
};

Scene_PartySeparate.prototype.onParty1up = function() {
    SoundManager.playCursor();
    this._subMembersWindow.activate();
    this._lastActiveWindow = this._party1Window;
    this._party1Window.deactivate();
};

Scene_PartySeparate.prototype.onParty2up = function() {
    SoundManager.playCursor();
    this._subMembersWindow.activate();
    this._lastActiveWindow = this._party2Window;
    this._party2Window.deactivate();
};

Scene_PartySeparate.prototype.onParty3up = function() {
    SoundManager.playCursor();
    this._lastActiveWindow.activate();
    this._party3Window.deactivate();
};

Scene_PartySeparate.prototype.onParty1rightex = function() {
    if($gameParty.partyNum() >= 2){
        SoundManager.playCursor();
        this._party2Window._index = 0;
        this._party2Window.activate();
        this._party1Window.deactivate();
    }
};

Scene_PartySeparate.prototype.onParty2leftex = function() {
    SoundManager.playCursor();
    this._party1Window.activate();
    this._party2Window.deactivate();
};

Scene_PartySeparate.prototype.subMembersWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight*40/100;
    const wx = 0;
    const wy = this._menuNameWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_PartySeparate.prototype.createDummyWindow = function() {
    const rect = this.dummyWindowRect();
    const dummyWindow = new Window_Base(rect);
    this.addWindow(dummyWindow);
};

Scene_PartySeparate.prototype.dummyWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight-this._subMembersWindow.y-this._subMembersWindow.height;
    const wx = 0;
    const wy = Graphics.boxHeight-wh;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_PartySeparate.prototype.createStatusWindow = function() {
    const rect = this.partySeparateStatusWindowRect();
    const statusWindow = new Window_PartySeparateStatus(rect);
    this.addWindow(statusWindow);
    this._statusWindow = statusWindow;
    this._subMembersWindow.setStatusWindow(this._statusWindow);
};

Scene_PartySeparate.prototype.partySeparateStatusWindowRect = function() {
    const ww = Graphics.boxWidth/2;
    const wh = (Graphics.boxHeight-this._subMembersWindow.y-this._subMembersWindow.height)/2;
    const wx = ww;
    const wy = Graphics.boxHeight-wh;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_PartySeparate.prototype.createSubMembersWindow = function() {
    const rect = this.subMembersWindowRect();
    this._subMembersWindow = new Window_SubMembersSeparate(rect);
    this.addWindow(this._subMembersWindow);
    this._subMembersWindow.activate();
    this._subMembersWindow.setHandler('ok',this.onSubMembersOk.bind(this));
    this._subMembersWindow.setHandler('cancel',this.onSubMembersCancel.bind(this));
    this._subMembersWindow.setHandler('toParty1',this.onSubMembersToParty1.bind(this));
    this._subMembersWindow.setHandler('toParty2',this.onSubMembersToParty2.bind(this));
};

Scene_PartySeparate.prototype.onSubMembersToParty1 = function() {
    SoundManager.playCursor();
    this._subMembersWindow.deactivate();
    this._party1Window.activate();
};

Scene_PartySeparate.prototype.onSubMembersToParty2 = function() {
    SoundManager.playCursor();
    this._subMembersWindow.deactivate();
    this._party2Window.activate();
};

Scene_PartySeparate.prototype.onSubMembersOk = function() {
    if(this._subMembersWindow.item() == "OK"){
        if(!this.isFinishable()){
            SoundManager.playBuzzer();
            this._subMembersWindow.activate();
            return;
        }
        SoundManager.playOk();
        $gameParty.setSeparatedMembers(1,this._party1Window._data.filter(actor => actor != null));
        if($gameParty.partyNum() >= 2){
            $gameParty.setSeparatedMembers(2,this._party2Window._data.filter(actor => actor != null));
        }
        if($gameParty.partyNum() >= 3){
            $gameParty.setSeparatedMembers(3,this._party3Window._data.filter(actor => actor != null));
        }
        /*
        for(let i = 0;i<5;i++){
            if(this._party1Window._data.filter(actor => actor != null).length<i+1){
                $gameParty._actors.push(actor._actorId);
            }else{
                $gameParty._actors[i] = this._party1Window._data.filter(actor => actor != null)[i]._actorId;
            }
        }*/
        var cullentPirtyId = $gameVariables.value(81)
        $gameParty._actors = [];
        if(cullentPirtyId == 0 || cullentPirtyId == 1){
            for(let i = 0;i<this._party1Window._data.length;i++){
                if(this._party1Window._data[i]){
                    $gameParty._actors.push(this._party1Window._data[i]._actorId);
                }
            }
        }else if(cullentPirtyId == 2){
            for(let i = 0;i<this._party2Window._data.length;i++){
                if(this._party2Window._data[i]){
                    $gameParty._actors.push(this._party2Window._data[i]._actorId);
                }
            }
        }else if(cullentPirtyId == 3){
            for(let i = 0;i<this._party3Window._data.length;i++){
                if(this._party3Window._data[i]){
                    $gameParty._actors.push(this._party3Window._data[i]._actorId);
                }
            }
        }
        $gameParty._subMembers = this._subMembersWindow._data.filter(actor => actor != null && actor != "OK");
        this.popScene();
        console.log($gameParty._actors);
    }
    if (this.isTempItemEnabled()) {
        SoundManager.playOk();
        var actor = this.tempItem();
        this._tempWindow._data[this._tempIndex] = this._subMembersWindow.item();
        this._subMembersWindow._data[this._subMembersWindow.index()] = actor;
        this._subMembersWindow.activate();
        this._subMembersWindow.drawItemAll();
        this._tempWindow.drawItemAll();
        this._tempWindow.resetTempIndex();
        this._tempWindow = null;
        this._tempIndex = null;
    } else {
        SoundManager.playOk();
        this._tempWindow = this._subMembersWindow;
        this._tempIndex = this._subMembersWindow.index();
        this._tempWindow.setTempIndex(this._tempIndex);
        this._subMembersWindow.activate();
    }
};

Scene_PartySeparate.prototype.isFinishable = function(){
    if(this._party1Window._data.filter(actor => actor != null).length == 0){
        return false;
    }
    if($gameParty.partyNum() >= 2 && this._party2Window._data.filter(actor => actor != null).length == 0){
        return false;
    }
    if($gameParty.partyNum() >= 3 && this._party3Window._data.filter(actor => actor != null).length == 0){
        return false;
    }
    return true;
}

Scene_PartySeparate.prototype.onParty1Ok = function() {
    if (this.isTempItemEnabled()) {
        SoundManager.playOk();
        var actor = this.tempItem();
        this._tempWindow._data[this._tempIndex] = this._party1Window.item();
        this._party1Window._data[this._party1Window.index()] = actor;
        this._party1Window.activate();
        this._party1Window.drawItemAll();
        this._tempWindow.drawItemAll();
        this._tempWindow.resetTempIndex();
        this._tempWindow = null;
        this._tempIndex = null;
    } else {
        SoundManager.playOk();
        this._tempWindow = this._party1Window;
        this._tempIndex = this._party1Window.index();
        this._party1Window.activate();
        this._party1Window.drawItemAll();
        this._tempWindow.setTempIndex(this._tempIndex);
    }
};

Scene_PartySeparate.prototype.onParty2Ok = function() {
    if (this.isTempItemEnabled()) {
        SoundManager.playOk();
        var actor = this.tempItem();
        this._tempWindow._data[this._tempIndex] = this._party2Window.item();
        this._party2Window._data[this._party2Window.index()] = actor;
        this._party2Window.activate();
        this._party2Window.drawItemAll();
        this._tempWindow.drawItemAll();
        this._tempWindow.resetTempIndex();
        this._tempWindow = null;
        this._tempIndex = null;
    } else {
        SoundManager.playOk();
        this._tempWindow = this._party2Window;
        this._tempIndex = this._party2Window.index();
        this._party2Window.activate();
        this._party2Window.drawItemAll();
        this._tempWindow.setTempIndex(this._tempIndex);
    }
};

Scene_PartySeparate.prototype.onParty3Ok = function() {
    if (this.isTempItemEnabled()) {
        SoundManager.playOk();
        var actor = this.tempItem();
        this._tempWindow._data[this._tempIndex] = this._party3Window.item();
        this._party3Window._data[this._party3Window.index()] = actor;
        this._party3Window.activate();
        this._party3Window.drawItemAll();
        this._tempWindow.drawItemAll();
        this._tempWindow.resetTempIndex();
        this._tempWindow = null;
        this._tempIndex = null;
    } else {
        SoundManager.playOk();
        this._tempWindow = this._party3Window;
        this._tempIndex = this._party3Window.index();
        this._party3Window.activate();
        this._party3Window.drawItemAll();
        this._tempWindow.setTempIndex(this._tempIndex);
    }
};

Scene_PartySeparate.prototype.onParty1Cancel = function() {
    var thisWindow =  this._party1Window
    if (this.isTempItemEnabled()) {
        SoundManager.playCancel();
        thisWindow.deactivate();
        thisWindow.drawItemAll();
        this._tempWindow.drawItemAll();
        this._tempWindow._index = this._tempIndex;
        this._tempWindow.activate();
        this._tempWindow.resetTempIndex();
        this._tempWindow = null;
        this._tempIndex = null;
    } else {
        thisWindow.activate();
        thisWindow.drawItemAll();
        if(thisWindow._data[thisWindow._index] == null && $gameSwitches.value(24)){
            SoundManager.playBuzzer();
            return;
        }
        SoundManager.playCancel();
        var actor;
        if(thisWindow.membersNum() > 0){
            for(let i=thisWindow._data.length-1;i>=0;i--){
                if(thisWindow._data[i]){
                    actor = thisWindow._data[i];
                    thisWindow._data[i] = null;
                    this._subMembersWindow._data.splice(this._subMembersWindow._data.length-2,0,actor)
                    this._subMembersWindow.drawItemAll();
                    thisWindow.drawItemAll();
                    return;
                }
            }
        }
        
        $gameSwitches.setValue(25,true); //PT編成をｷｬﾝｾﾙで終了したフラグ
        this.popScene();
    }
};

Scene_PartySeparate.prototype.onParty2Cancel = function() {
    var thisWindow =  this._party2Window
    if (this.isTempItemEnabled()) {
        SoundManager.playCancel();
        thisWindow.deactivate();
        thisWindow.drawItemAll();
        this._tempWindow.drawItemAll();
        this._tempWindow._index = this._tempIndex;
        this._tempWindow.activate();
        this._tempWindow.resetTempIndex();
        this._tempWindow = null;
        this._tempIndex = null;
    } else {
        thisWindow.activate();
        thisWindow.drawItemAll();
        if(thisWindow._data[thisWindow._index] == null && $gameSwitches.value(24)){
            SoundManager.playBuzzer();
            return;
        }
        SoundManager.playCancel();
        var actor;
        if(thisWindow.membersNum() > 0){
            for(let i=thisWindow._data.length-1;i>=0;i--){
                if(thisWindow._data[i]){
                    actor = thisWindow._data[i];
                    thisWindow._data[i] = null;
                    this._subMembersWindow._data.splice(this._subMembersWindow._data.length-2,0,actor)
                    this._subMembersWindow.drawItemAll();
                    thisWindow.drawItemAll();
                    return;
                }
            }
        }
        
        $gameSwitches.setValue(25,true); //PT編成をｷｬﾝｾﾙで終了したフラグ
        this.popScene();
    }
};

Scene_PartySeparate.prototype.onParty3Cancel = function() {
    var thisWindow =  this._party3Window
    if (this.isTempItemEnabled()) {
        SoundManager.playCancel();
        thisWindow.deactivate();
        thisWindow.drawItemAll();
        this._tempWindow.drawItemAll();
        this._tempWindow._index = this._tempIndex;
        this._tempWindow.activate();
        this._tempWindow.resetTempIndex();
        this._tempWindow = null;
        this._tempIndex = null;
    } else {
        thisWindow.activate();
        thisWindow.drawItemAll();
        if(thisWindow._data[thisWindow._index] == null && $gameSwitches.value(24)){
            SoundManager.playBuzzer();
            return;
        }
        SoundManager.playCancel();
        var actor;
        if(thisWindow.membersNum() > 0){
            for(let i=thisWindow._data.length-1;i>=0;i--){
                if(thisWindow._data[i]){
                    actor = thisWindow._data[i];
                    thisWindow._data[i] = null;
                    this._subMembersWindow._data.splice(this._subMembersWindow._data.length-2,0,actor)
                    this._subMembersWindow.drawItemAll();
                    thisWindow.drawItemAll();
                    return;
                }
            }
        }
        
        $gameSwitches.setValue(25,true); //PT編成をｷｬﾝｾﾙで終了したフラグ
        this.popScene();
    }
};



Scene_PartySeparate.prototype.onSubMembersCancel = function() {
    SoundManager.playCancel();
    this._subMembersWindow.activate();
    if(this._tempWindow){
        this._tempWindow = null;
        this._tempIndex = null;
        return;
    }
    if($gameSwitches.value(24)){
        SoundManager.playBuzzer();
        return;
    }
    $gameSwitches.setValue(25,true); //PT編成をｷｬﾝｾﾙで終了したフラグ
    this.popScene();
}

Scene_PartySeparate.prototype.isTempItemEnabled = function() {
    if(this._tempWindow){
        return true;
    }
    return false;
};

Scene_PartySeparate.prototype.tempItem = function() {
    if(this._tempWindow){
        return this._tempWindow._data[this._tempIndex];
    }
    return null;
};

Scene_PartySeparate.prototype.createNumWindow = function() {
    const width = this.mainFontSize()*6+this.mainFontSize()*5/4;
    const height = this.mainFontSize()*3;
    var rect = new Rectangle(0, 0, Graphics.boxWidth-this._menuNameWindow.width,this._menuNameWindow.height);
    this._numWindow = new Window_MakePartyNum(rect);
    this.addWindow(this._numWindow);
};

Scene_PartySeparate.prototype.createMenuNameWindow = function(name) {
    const width = this.mainFontSize()*6+this.mainFontSize()*5/4;
    const height = this.mainFontSize()*3;
    var rect = new Rectangle(Graphics.boxWidth-width, 0, width,height);
    this._menuNameWindow = new Window_MenuName(rect);
    this._menuNameWindow.drawMenuName(name);
    this.addWindow(this._menuNameWindow);
};

//-----------------------------------------------------------------------------
// Window_SeparatedMembers
// 
// パーティ分割画面で各パーティのメンバーを表示する


function Window_SeparatedMembers() {
    this.initialize(...arguments);
}

Window_SeparatedMembers.prototype = Object.create(Window_SubMembers.prototype);
Window_SeparatedMembers.prototype.constructor = Window_SeparatedMembers;

Window_SeparatedMembers.prototype.maxCols = function() {
    return 5;
};

Window_SeparatedMembers.prototype.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
};

Window_SeparatedMembers.prototype.itemRect = function(index) {
    const rect = new Rectangle();
    rect.x = Math.floor(this.innerWidth/5*(index%5));
    rect.y = Math.floor(this.innerHeight/2*Math.floor(index/5));
    rect.width = this.innerWidth/5;
    rect.height = this.innerHeight;
    return rect;
};

Window_SeparatedMembers.prototype.initialize = function(rect,partyNo) {
    Window_ItemList.prototype.initialize.call(this, rect);
    this._index = 0;
    this._partyNo = partyNo;
    this.setActorsData(this._partyNo);
    this.loadSvActorImages();
    this.drawItemAll();
    //this.createHandCursor();
};

Window_SeparatedMembers.prototype.setActorsData = function(partyNo) {
    this.data = [];
    if(partyNo == 1 && $gameParty.separatedMembers(1).length == 0){
        //元のパーティのメンバーデータがいじられると都合が悪いのでスプレッド構文
        for(actor of $gameParty.members()){
            this._data.push(actor)
        }
    }else{
        //元のパーティのメンバーデータがいじられると都合が悪いのでスプレッド構文
        for(actor of $gameParty.separatedMembers(partyNo)){
            this._data.push(actor)
        }
    }
    var length = this._data.length
    for(let i = 0;i<5-length;i++){
        this._data.push(null);
    }
}

Window_SeparatedMembers.prototype.refresh = function() {
    Window_SubMembers.prototype.refresh.call(this);
    this._index = 0;
    this.setActorsData(this._partyNo);
    this.drawItemAll();
};

Window_SeparatedMembers.prototype.drawSvActor = function(
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
};

Window_SeparatedMembers.prototype.processCursorMove = function() {
    if(this.isOpenAndActive()){
        if (Input.isTriggered("down")) {
            this.callHandler("downex2");
            this.updateInputData();
            return;
        }
        if (Input.isTriggered("up")) {
            console.log("upex");
            this.callHandler("upex");
            this.updateInputData();
            return;
        }
    }
    if (this.isCursorMovable()) {
        const lastIndex = this.index();
        if (Input.isRepeated("right")) {
            if(this.index() == 4 && this._partyNo == 1){
                this.callHandler("rightex");
                this.updateInputData();
            }else{
                this.cursorRight(Input.isTriggered("right"));
            }
        }
        if (Input.isRepeated("left")) {
            if(this.index() == 0 && this._partyNo == 2){
                this.callHandler("leftex");
                this.updateInputData();
            }else{
                this.cursorLeft(Input.isTriggered("left"));
            }
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

Window_SeparatedMembers.prototype.processOk = function() {
    if (this.isCurrentItemEnabled()) {
        this.playOkSound();
        this.updateInputData();
        this.deactivate();
        this.callOkHandler();
    } else {
        this.playBuzzerSound();
    }
};

Window_SeparatedMembers.prototype.update = function() {
    Window_ItemList.prototype.update.call(this);
    if(this.isOpenAndActive()){
        this._statusWindow.setActor(this._data[this._index]);
    }

    // 初回または未描画なら再描画
    if (!this._svActorDrawn) {
        if (ImageManager.isReady()) {
            this.drawItemAll();
            this._svActorDrawn = true;
        }
    }

    if (!this.active) {
        this.setCursorRect(0, 0, 0, 0);
    }

    if (this._handCursorSprite && this.active) {
        const rect = this.itemRect(this.index());
        this._handCursorSprite.visible = true;

        // 指マークを矩形の左端に配置（Y座標は中央）
        this._handCursorSprite.x = rect.x - this._handCursorSprite.width + 10;
        this._handCursorSprite.y = rect.y + (rect.height - this._handCursorSprite.height) / 2;
    } else if (this._handCursorSprite) {
        this._handCursorSprite.visible = false;
    }

    if (this._tempHandCursorSprite && this._tempIndex > -1) {
        const rect = this.itemRect(this._tempIndex);
        this._tempHandCursorSprite.visible = true;
        this._tempHandCursorSprite.opacity = 191;

        // 指マークを矩形の左端に配置（Y座標は中央）
        this._tempHandCursorSprite.x = rect.x - this._tempHandCursorSprite.width + 10 +2;
        this._tempHandCursorSprite.y = rect.y + (rect.height - this._tempHandCursorSprite.height) / 2 -2;
    } else if (this._tempHandCursorSprite || this._tempIndex == 0) {
        this._tempHandCursorSprite.visible = false;
    }
};

Window_SeparatedMembers.prototype.setTempIndex = function(tempIndex) {
    this._tempIndex = tempIndex;
};

Window_SeparatedMembers.prototype.resetTempIndex = function(tempIndex) {
    this._tempIndex = -1;
};

/*
Window_SeparatedMembers.prototype.createHandCursor = function() {
    const bitmap = ImageManager.loadSystem("cursor");
    this._tempHandCursorSprite = new Sprite(bitmap);
    this._handCursorSprite = new Sprite(bitmap);
    this.addChild(this._tempHandCursorSprite);
    this.addChild(this._handCursorSprite);
};
*/

Window_SeparatedMembers.prototype.membersNum = function() {
    var num = 0
    for(data of this._data){
        if(data){
            num = num+1
        }
    }
    return num
};


//-----------------------------------------------------------------------------
// Window_MakePartyNum
// 
// パーティをいくつ作るか表示する

function Window_MakePartyNum() {
    this.initialize(...arguments);
}

Window_MakePartyNum.prototype = Object.create(Window_Base.prototype);
Window_MakePartyNum.prototype.constructor = Window_MakePartyNum;

Window_MakePartyNum.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.refresh();
};

Window_MakePartyNum.prototype.refresh = function() {
    this.contents.clear();
    this.drawText("Please choose "+$gameParty.partyNum()+"members for your party.",0,this.innerHeight/2-$TILE/4,this.innerWidth);
};

Window_MakePartyNum.prototype.setup = function(num) {
    this.contents.clear();
    this._num = num;
    this.refresh();
};

//-----------------------------------------------------------------------------
// Window_SubMembersSeparate
// 
// パーティ分割画面で未所属のアクターを選ぶウィンドウ

function Window_SubMembersSeparate() {
    this.initialize(...arguments);
}

Window_SubMembersSeparate.prototype = Object.create(Window_SubMembers.prototype);
Window_SubMembersSeparate.prototype.constructor = Window_SubMembersSeparate;

Window_SubMembersSeparate.prototype.maxCols = function() {
    return 10;
};

Window_SubMembersSeparate.prototype.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
};

Window_SubMembersSeparate.prototype.lineHeight = function() {
    return this.innerHeight/2;
};

/*
Window_SubMembersSeparate.prototype.itemRect = function(index) {
    const rect = new Rectangle();
    rect.x = Math.floor(this.innerWidth/10*(index%10));
    rect.y = Math.floor(this.innerHeight/2*Math.floor(index/10));
    rect.width = this.innerWidth/10;
    rect.height = this.innerHeight/2;
    return rect;
};*/

Window_SubMembersSeparate.prototype.initialize = function(rect) {
    Window_ItemList.prototype.initialize.call(this, rect);
    this._index = 0;
    this._data = $gameParty.subMembers().concat([null,"OK"]);
    this.loadSvActorImages();
    this.drawItemAll();
    //this.createHandCursor();
};

Window_SubMembersSeparate.prototype.refresh = function() {
    Window_SubMembers.prototype.refresh.call(this);
    this.drawItemAll();
};
/*
Window_SubMembersSeparate.prototype.drawSvActor = function(
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

Window_SubMembersSeparate.prototype.processCursorMove = function() {
    if(this.isOpenAndActive()){
        if (Input.isTriggered("down")) {
            if(Math.floor(this.index()/10)==Math.floor((this._data.length-1)/10)){
                const lastIndex = this.index();
                if(Math.floor(this.index()%10)>4&&$gameParty.partyNum() > 1){
                    this.callHandler("toParty2");
                    this.updateInputData();
                }else{
                    this.callHandler("toParty1");
                    this.updateInputData();
                }
                return;
            }
            if(Math.floor(this.index()/10)==Math.floor((this._data.length-1)/10)-1 && Math.floor(this.index()%10)>Math.floor((this._data.length-1)%10)){
                const lastIndex = this.index();
                if(Math.floor(this.index()%10)>4&&$gameParty.partyNum() > 1){
                    this.callHandler("toParty2");
                    this.updateInputData();
                }else{
                    this.callHandler("toParty1");
                    this.updateInputData();
                }
                return;
            }
        }
    }
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

Window_SubMembersSeparate.prototype.processOk = function() {4
    if (this.isCurrentItemEnabled()) {
        this.playOkSound();
        this.updateInputData();
        this.deactivate();
        this.callOkHandler();
    } else {
        this.playBuzzerSound();
    }
};

Window_SubMembersSeparate.prototype.update = function() {
    Window_ItemList.prototype.update.call(this);
    
    if(this.isOpenAndActive()){
        this._statusWindow.setActor(this._data[this._index]);
    }
    
    if (!this.active) {
        this.setCursorRect(0, 0, 0, 0);
    }
    
    if (this._handCursorSprite && this.active) {
        const rect = this.itemRect(this.index());
        this._handCursorSprite.visible = true;

        // 指マークを矩形の左端に配置（Y座標は中央）
        this._handCursorSprite.x = rect.x - this._handCursorSprite.width + 10;
        this._handCursorSprite.y = rect.y + (rect.height - this._handCursorSprite.height) / 2;
    } else if (this._handCursorSprite) {
        this._handCursorSprite.visible = false;
    }

    if (this._tempHandCursorSprite && this._tempIndex > -1) {
        const rect = this.itemRect(this._tempIndex);
        this._tempHandCursorSprite.visible = true;
        this._tempHandCursorSprite.opacity = 191;

        // 指マークを矩形の左端に配置（Y座標は中央）
        this._tempHandCursorSprite.x = rect.x - this._tempHandCursorSprite.width + 10 +2;
        this._tempHandCursorSprite.y = rect.y + (rect.height - this._tempHandCursorSprite.height) / 2 -2;
    } else if (this._tempHandCursorSprite || this._tempIndex == 0) {
        this._tempHandCursorSprite.visible = false;
    }
};


Window_SubMembersSeparate.prototype.setTempIndex = function(tempIndex) {
    this._tempIndex = tempIndex;
};

Window_SubMembersSeparate.prototype.resetTempIndex = function(tempIndex) {
    this._tempIndex = -1;
};

/*
Window_SubMembersSeparate.prototype.createHandCursor = function() {
    const bitmap = ImageManager.loadSystem("cursor");
    this._tempHandCursorSprite = new Sprite(bitmap);
    this._handCursorSprite = new Sprite(bitmap);
    this.addChild(this._tempHandCursorSprite);
    this.addChild(this._handCursorSprite);
};
*/


//-----------------------------------------------------------------------------
// Window_PartySeparateStatus
// 
// パーティ分割画面でカーソル対象のステータスを表示する

function Window_PartySeparateStatus() {
    this.initialize(...arguments);
}

Window_PartySeparateStatus.prototype = Object.create(Window_StatusBase.prototype);
Window_PartySeparateStatus.prototype.constructor = Window_PartySeparateStatus;

Window_PartySeparateStatus.prototype.initialize = function(rect) {
    Window_StatusBase.prototype.initialize.call(this,rect);
    this._actor = null;
};

Window_PartySeparateStatus.prototype.setActor = function(actor) {
    if(actor != this._actor && !!actor){
        this._actor = actor;
        if(this._actor&&this._actor != "OK"){
            this.drawStatus();
        }
    }
};

Window_PartySeparateStatus.prototype.refresh = function(refresh) {
    Window_StatusBase.prototype.refresh.call(this);
    if(this._actor){
        this.drawStatus();
    }
};

Window_PartySeparateStatus.prototype.drawStatus = function() {
    if(!this._actor){
        return;
    }
    this.contents.clear();
    const x = 0;
    const h = this.innerHeight;
    const lineHeight = this.lineHeight();
    const y = h / 2 - lineHeight * 1.5;
    this.drawSvActor(this._actor.battlerName(), 10, -this.padding, -6);
    this.changeTextColor(ColorManager.normalColor());
    this.drawText(this._actor.name(), this.contents.fontSize*2.5, this.contents.fontSize*0.25, this.width-this.padding*2-this.contents.fontSize*3);
    this.changeTextColor(ColorManager.systemColor());
    this.drawText("Lv.", this.contents.fontSize*8.75, this.contents.fontSize*0.25,this.contents.fontSize*2);
    this.drawText("JLv.", this.contents.fontSize*2.75, this.contents.fontSize*1.75,this.contents.fontSize*2);
    this.changeTextColor(ColorManager.normalColor());
    this.drawText(this._actor._level, this.contents.fontSize*10.25, this.contents.fontSize*0.25,this.contents.fontSize);
    if(this._actor.isJobMaster()){
        this.drawIcon(57,this.contents.fontSize*4.75, this.contents.fontSize*1.25);
    }else{
        this.resetTextColor();
        this.drawText(this._actor.jLevel(), this.contents.fontSize*2.25, this.contents.fontSize*1.75, this.contents.fontSize*3, "right");
        const text = '   ' + this._actor.currentAp()+'/'+this._actor.nextAp();
        this.drawText(text, this.contents.fontSize*7.25, this.contents.fontSize*1.75);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText('AP', this.contents.fontSize*7.25, this.contents.fontSize*1.75);
    }
    if(this._actor.crystal()){
        this.drawIcon($dataItems[this._actor.crystal()._id+249].iconIndex,x+this.contents.fontSize*11.75, this.contents.fontSize*-0.25);
    }
};