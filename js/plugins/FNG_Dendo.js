//=============================================================================
// FNG_Dendo.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc 殿堂シーン
  * @author finga
  * @help 殿堂シーン
*/


function Scene_Dendo() {
    this.initialize(...arguments);
}

Scene_Dendo.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Dendo.prototype.constructor = Scene_Dendo;

Scene_Dendo.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Dendo.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createMenuNameWindow("Hall of Fame");
    this.createHelpWindow();
    this.createListWindow();
    this.createInfoWindow();
    this.createTroopInfoWindow();
    this._listWindow.activate();
    this._infoWindow.hide();
};

Scene_Dendo.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
};

Scene_Dendo.prototype.createListWindow = function() {
    const rect = this.listWindowRect();
    this._listWindow = new Window_DendoList(rect);
    this._listWindow.setHelpWindow(this._helpWindow);
    this._listWindow.setHandler("cancel", this.popScene.bind(this));
    this._listWindow.setHandler("ok", this.openInfoWindow.bind(this));
    this.addWindow(this._listWindow);
};

Scene_Dendo.prototype.openInfoWindow = function() {
    const item = this._listWindow.itemAt(this._listWindow.index());
    console.log(item)
	this._infoWindow.setRecord(item[3]);
	this._troopInfoWindow.setInfo(item[0],item[1]);
    this._listWindow.deactivate();
    this._infoWindow.show();
	this._troopInfoWindow.show();
    this._infoWindow.activate();
};

Scene_Dendo.prototype.closeInfoWindow = function() {
    this._listWindow.activate();
    this._infoWindow.hide();
	this._troopInfoWindow.hide();
};

Scene_Dendo.prototype.createInfoWindow = function() {
    const rect = this.listWindowRect();
    this._infoWindow = new Window_DendoInfo(rect);
    this._infoWindow.setHandler("pageup", this.nextInfo.bind(this));
    this._infoWindow.setHandler("pagedown", this.prevInfo.bind(this));
    this._infoWindow.setHandler("cancel", this.closeInfoWindow.bind(this));
	this._infoWindow.addCommand("Close","cancel",true);
    this.addWindow(this._infoWindow);
};

Scene_Dendo.prototype.createTroopInfoWindow = function() {
    const rect = this.helpWindowRect();
    this._troopInfoWindow = new Window_DendoTroopInfo(rect);
    this.addWindow(this._troopInfoWindow);
};

Scene_Dendo.prototype.nextInfo = function() {
	this._infoWindow.nextPage();
};

Scene_Dendo.prototype.prevInfo = function() {
	this._infoWindow.prevPage();
};

Scene_Dendo.prototype.createMenuNameWindow = function(name) {
    const width = this.mainFontSize()*6+this.mainFontSize()*5/4;
    const height = this.mainFontSize()*3+2;
    var rect = new Rectangle(Graphics.boxWidth-width, 0, width,height);
    this._menuNameWindow = new Window_MenuName(rect);
    this._menuNameWindow.drawMenuName(name);
    this.addWindow(this._menuNameWindow);
};

Scene_Dendo.prototype.createHelpWindow = function() {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_Help(rect);
    this.addWindow(this._helpWindow);
};

Scene_Dendo.prototype.helpWindowRect = function() {
    const wx = 0;
    const wh = this._menuNameWindow.height;
    const wy = 0;
    const ww = Graphics.boxWidth-this._menuNameWindow.width;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Dendo.prototype.listWindowRect = function() {
    const wx = 0;
    const wh = Graphics.boxHeight-this._menuNameWindow.height;
    const wy = this._menuNameWindow.height;
    const ww = Graphics.boxWidth;
    return new Rectangle(wx, wy, ww, wh);
};

//-----------------------------------------------------------------------------
// Window_DendolList
//
// 殿堂入りリスト

function Window_DendoList() {
    this.initialize(...arguments);
}

Window_DendoList.prototype = Object.create(Window_ItemList.prototype);
Window_DendoList.prototype.constructor = Window_DendoList;

Window_DendoList.prototype.initialize = function(rect) {
    Window_ItemList.prototype.initialize.call(this, rect);
    this.makeItemList();
    this.drawItemAll();
    this._index = 0;
};

/*
Window_DendoList.prototype.drawItemAll = function(index) {
    var i=0;
    for(item of this._data){
        this.drawItem(i);
        i = i+1;
    }
};*/

Window_DendoList.prototype.drawItemAll = function() {
    const topIndex = this.topIndex();
    for (let i = 0; i < this.maxVisibleItems(); i++) {
        const index = topIndex + i;
        if (index < this.maxItems()) {
            this.drawItemBackground(index);
            this.drawItem(index);
        }
    }
};

Window_DendoList.prototype.updateHelp = function() {
    this._helpWindow.clear();
    this._helpWindow.setText("");
};

Window_DendoList.prototype.makeItemList = function() {
    this._data = [];
	//groupId,imageId,グループ名
	const listData = {}
    listData["19"] =[0,"Wing Raptor"];
    listData["43"]=[1,"Shiva"];
    listData["45"]=[2,"Black Waltz 1"];
    listData["72"]=[3,"Mist Dragon"];
    listData["73"]=[4,"Ifrit"];
    listData["73"]=[5,"Diablos"];
    listData["97"]=[6,"Ramuh"];
    listData["98"]=[7,"Magissa & Typhon"];
    listData["119"]=[8,"ファントム"];
    listData["121"]=[9,"ナムタルウトク"];
    listData["148"]=[10,"Fenrir & Titan"];
    listData["149"]=[11,"Secret & Minotaur"];
    listData["172"]=[12,"Carbuncle"];
    listData["173"]=[13,"Demon Wall"];
    listData["174"]=[14,"Lich"];
    listData["198"]=[15,"ゴーレムききいっぱつ"];
    listData["199"]=[16,"グツコー"];
    listData["220"]=[17,"The Reborn Magus Sisters"];
    listData["241"]=[18,"ザ・ソウルケージ"];
    listData["260"]=[19,"エルヴィオレ"];
    listData["261"]=[20,"Liquid Flame"];
    listData["279"]=[21,"ガーディアン"];
    listData["284"]=[22,"Motor Ball"];
    listData["285"]=[23,"Marilith"];
    listData["290"]=[24,"Iron Claw"];
    listData["317"]=[25,"Odin"];
    listData["315"]=[26,"Orthrus"];
    listData["316"]=[27,"Baigan"];
    listData["336"]=[28,"Syldra"];
    listData["337"]=[29,"ボトムスウェル"];
    listData["357"]=[30,"Catoblepas"];
    listData["338"]=[31,"カロフィステリ"];
    listData["381"]=[32,"Leviathan"];
    listData["382"]=[34,"Octomammoth"];
    listData["398"]=[33,"シリオン"];
    listData["399"]=[35,"Kraken"];
    listData["422"]=[36,"アレクソウル"];
    listData["423"]=[37,"JENOVA"];
    listData["444"]=[38,"Atmos"];
    listData["445"]=[39,"Yunalesca"];
    listData["468"]=[40,"バハムート"];
    listData["469"]=[41,"エフレイエ"];
    listData["507"]=[42,"グリーヴァ"];
    listData["504"]=[43,"アパンダ"];
    listData["508"]=[44,"アデル＆ハイン"];
    listData["509"]=[45,"ティアマット"];
    listData["511"]=[46,"まじょ"];
    listData["537"]=[47,"アスタロート"];
    listData["538"]=[48,"フェイズ"];
    listData["539"]=[49,"ネクロフォビア"];
    listData["647"]=[50,"ロストナンバー"];
    listData["646"]=[51,"６ヘッドドラゴン"];
    listData["648"]=[52,"デスゲイズ"];
    listData["649"]=[53,"アルテマバスター"];
    listData["LB1"]=[54,"ネオクロノディア・パーティ１"];
    listData["LB2"]=[54,"ネオクロノディア・パーティ２"];

    listData["16"]=[60,"Soldier Statues"];
    listData["17"]=[61,"T-Rexaur"];
    listData["18"]=[62,"Imp"];
    listData["40"]=[63,"Pisco Demons"];
    listData["41"]=[64,"Twin Head"];
    listData["42"]=[65,"Cocytus"];
    listData["66"]=[66,"Trap Door"];
    listData["67"]=[67,"Ralvurahva"];
    listData["68"]=[68,"Dark Elf"];
    listData["94"]=[69,"Materia Keeper"];
    listData["95"]=[70,"Dragon Pod"];
    listData["96"]=[71,"Abaddon"];
    listData["120"]=[72,"Soul Eater"];
    listData["111"]=[73,"Phantom Knights"];
    listData["112"]=[74,"ウルフラマイター"];
    listData["141"]=[75,"Sabotender"];
    listData["139"]=[76,"Gorgimera"];
    listData["144"]=[77,"Cactuar"];
    listData["145"]=[78,"Landworm"];
    listData["167"]=[79,"Omega Prototype"];
    listData["168"]=[80,"Mimic"];
    listData["170"]=[81,"グランインセクト"];
    listData["171"]=[82,"スフィンクス"];
    listData["195"]=[83,"ラルヴァイマーゴ"];
    listData["196"]=[84,"Ninja"];
    listData["197"]=[85,"ボムふさい"];
    listData["215"]=[86,"Werewolf"];
    listData["216"]=[87,"ヤーン"];
    listData["256"]=[88,"ヒュドラ"];
    listData["257"]=[89,"きかいりゅう"];
    listData["258"]=[90,"アルケオエイビス"];
    listData["275"]=[91,"フリーズビースト"];
    listData["276"]=[92,"ゴドー"];
    listData["277"]=[93,"プラウド・クラッド"];
    listData["312"]=[94,"モルボル"];
    listData["313"]=[95,"ブッシュファイア"];
    listData["314"]=[96,"バイオソルジャー"];
    listData["332"]=[97,"ミニドラゴン"];
    listData["333"]=[98,"ドラゴンエイビス"];
    listData["334"]=[99,"グランドドラゴン"];
    listData["351"]=[100,"ジェミニスミー"];
    listData["352"]=[101,"ティラノサウルス"];
    listData["353"]=[102,"ジャンボプリン"];
    listData["375"]=[103,"のろいのきんか"];
    listData["376"]=[104,"カーラボス"];
    listData["377"]=[105,"ゴーストシップ"];
    listData["418"]=[106,"バンパイアロード"];
    listData["419"]=[107,"マザーラミア"];
    listData["420"]=[108,"デスライダー"];
    listData["441"]=[109,"コムサ　ベラズ"];
    listData["442"]=[110,"アーク＆クレイクロウ"];
    listData["443"]=[111,"プレイグ"];
    listData["464"]=[112,"フンババ"];
    listData["465"]=[113,"ブラキオレイドス"];
    listData["466"]=[114,"オズマ"];
    listData["505"]=[115,"デスマシーン"];
    listData["506"]=[116,"まほうレベル９９"];
    listData["526"]=[117,"プロトフェイズ"];
    listData["527"]=[118,"ヒュージスフィア"];
    listData["528"]=[119,"タイダリアサン"];
    listData["644"]=[120,"ルブルムドラゴン"];
    listData["643"]=[121,"クァールレギナ"];
    listData["642"]=[122,"オメガ改"];
    listData["671"]=[123,"しんりゅう改"];
	//groupId,imageId,グループ名

	//console.log($gameParty.dendoList())
    
    const datatemp = [];
    for(troopId in $gameParty.dendoList()){
		const record = $gameParty.dendoList()[troopId];
        if(listData[troopId]){			
            const timeValue = this.timeTextToValue(record.playTime);
            datatemp.push([listData[troopId][0],listData[troopId][1],record.playTime,troopId,timeValue]);
        }
    }
    if(datatemp.length>0){
        this._data.push(datatemp[0]);
        //console.log(datatemp)
        for (let i = 1; i < datatemp.length; i++) {
            for(let j = 0;j<this._data.length;j++){
                if(datatemp[i][4] <= this._data[j][4]){
                    this._data.splice(j, 0, datatemp[i]);
                    break;
                }
                if(j==this._data.length-1){
                    this._data.push(datatemp[i]);
                    break;
                }
            }
        }
    }
};

Window_DendoList.prototype.timeTextToValue = function(text) {
    var value = Number(text.substr( 0,2 ))*60*60
                +Number(text.substr( 3, 2 ))*60
                +Number(text.substr( 6, 2 ));
    return value;
};

Window_DendoList.prototype.drawItem = function(index) {
    const item = this.itemAt(index);
    if (item) {
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(1);
        this.drawDendoImage(item[0],rect.x+6,rect.y+2);
        this.drawText(item[1], rect.x+40, rect.y);
        this.drawText(item[2], rect.x, rect.y+4,rect.width-8,"right");
    }
};

/*
Window_DendoList.prototype.drawItem = function(index) {
    const item = this.itemAt(index);
    if (item) {
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
        this.drawItemNumber(item, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
    }
};*/

Window_DendoList.prototype.maxCols = function() {
    return 1;
};

Window_DendoList.prototype.lineHeight = function() {
    return 20;
};

Window_DendoList.prototype.itemHeight = function() {
    return 20;
};

Window_DendoList.prototype.itemWidth = function() {
    return this.innerWidth-12;
};
/*
Window_DendoList.prototype.itemRect = function(index) {
    const rect = new Rectangle();
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX();
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
    rect.x = x
    rect.y = y
    rect.width = itemWidth;
    rect.height = itemHeight;
    return rect;
};*/

//-----------------------------------------------------------------------------
// Window_DendolInfo
//
// 殿堂の詳細

function Window_DendoInfo() {
    this.initialize(...arguments);
}

Window_DendoInfo.prototype = Object.create(Window_Command.prototype);
Window_DendoInfo.prototype.constructor = Window_DendoInfo;

Window_DendoInfo.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
	this._page = 0;
};

Window_DendoInfo.prototype.setRecord = function(troopId) {
	this._troopId = troopId;
    this.contents.clear();
    
	this.drawRecord();
	this.drawAllItems();
};

Window_DendoInfo.prototype.drawRecord = function() {
    const record = $gameParty.dendoList()[this._troopId];
    if(this._page == 0){
        var i = 0;
        for(actor of record.party){
            const rect = this.actorRect(i);
			if(actor.stoned){
            	this.drawSvActor(actor.battlerName, 52, rect.x-8, rect.y+4);
			}else if(!actor.elased){
            	this.drawSvActor(actor.battlerName, 10, rect.x-8, rect.y+4);
			}
            this.changeTextColor(ColorManager.systemColor());
            this.drawText("Lv.", rect.x+this.textWidth("0000000000000"), rect.y);
            this.drawText("JLv.", rect.x+this.textWidth("0000000000000000000"), rect.y);
            this.drawText("HP", rect.x+this.textWidth("00000"), rect.y+this.lineHeight());
            this.drawText("MP", rect.x+this.textWidth("00000000000000000"), rect.y+this.lineHeight());
            this.changeTextColor(ColorManager.normalColor());
            this.drawText($dataActors[actor.id].name, rect.x, rect.y);
            this.drawText(actor.level, rect.x+this.textWidth("0000000000000000"), rect.y,this.textWidth("00"),"right");
            this.drawText(actor.jLevel, rect.x+this.textWidth("00000000000000000000000"), rect.y,this.textWidth("00"),"right");
            this.drawText(actor.hp, rect.x+this.textWidth("0000000"), rect.y+this.lineHeight(),this.textWidth("0000"),"right");
            this.drawText("/", rect.x+this.textWidth("00000000000"), rect.y+this.lineHeight());
            this.drawText(actor.mhp, rect.x+this.textWidth("000000000000"), rect.y+this.lineHeight(),this.textWidth("0000"),"right");
            this.drawText(actor.mp, rect.x+this.textWidth("0000000000000000000"), rect.y+this.lineHeight(),this.textWidth("0000"),"right");
            this.drawText(actor.mmp, rect.x+this.textWidth("00000000000000000000000"), rect.y+this.lineHeight(),this.textWidth("0000"),"right");
            this.drawText("/", rect.x+this.textWidth("00000000000000000000000"), rect.y+this.lineHeight());
            this.drawItemName(actor.equips[0], rect.x+this.textWidth("00000"), rect.y+this.lineHeight()*2);
            this.drawItemName(actor.equips[1], rect.x+this.textWidth("00000"), rect.y+this.lineHeight()*3);
            i++;
        }
        this.drawText("Playtime", Math.floor(this.innerWidth/2), Math.floor(this.innerHeight/3*2));
    	this.drawText(record.playTime, Math.floor(this.innerWidth/2)+this.textWidth("00000000000000"), Math.floor(this.innerHeight/3*2));
	}else if(this._page == 1){
        var i = 0;
        for(actor of record.party){
            const rect = this.actorRect(i);
			if(actor.stoned){
            	this.drawSvActor(actor.battlerName, 52, rect.x-8, rect.y+4);
			}else if(!actor.elased){
            	this.drawSvActor(actor.battlerName, 10, rect.x-8, rect.y+4);
			}
            this.changeTextColor(ColorManager.normalColor());
            this.drawItemName(actor.equips[2], rect.x+this.textWidth("00000"), rect.y+this.lineHeight()*0);
            this.drawItemName(actor.equips[3], rect.x+this.textWidth("00000"), rect.y+this.lineHeight()*1);
            this.drawItemName(actor.equips[4], rect.x+this.textWidth("00000"), rect.y+this.lineHeight()*2);
            this.drawItemName(actor.equips[5], rect.x+this.textWidth("00000"), rect.y+this.lineHeight()*3);
            i++;
        }
    }else if(this._page == 2){
        var i = 0;
        for(actor of record.party){
            const rect = this.actorRect(i);
			if(actor.stoned){
            	this.drawSvActor(actor.battlerName, 52, rect.x-8, rect.y+4);
			}else if(!actor.elased){
            	this.drawSvActor(actor.battlerName, 10, rect.x-8, rect.y+4);
			}
            if(actor.license){
                this.changeTextColor(ColorManager.systemColor());
                this.drawText("JLv.", rect.x+this.textWidth("00000000000000000000"), rect.y+this.lineHeight());
                this.drawText("JLv.", rect.x+this.textWidth("00000000000000000000"), rect.y+this.lineHeight()*2);
                this.changeTextColor(ColorManager.normalColor());
                this.drawText(actor.license, rect.x+this.textWidth("000000") ,rect.y+this.lineHeight());
                this.drawText(actor.lLevel, rect.x+this.textWidth("00000000000000000000000") ,rect.y+this.lineHeight(),this.textWidth("000"),"right");
                this.drawText(actor.subLicense, rect.x+this.textWidth("000000") ,rect.y+this.lineHeight()*2);
                this.drawText(actor.sllevel, rect.x+this.textWidth("00000000000000000000000") ,rect.y+this.lineHeight()*2,this.textWidth("000"),"right");
            }
            this.changeTextColor(ColorManager.normalColor());
            this.drawText($dataActors[actor.id].name, rect.x, rect.y);
            i++;
        }
    }
}

Window_DendoInfo.prototype.actorRect = function(index) {
    const width = Math.floor(this.innerWidth/2);
    const height = Math.floor(this.innerHeight/3);
    const x = Math.floor(Math.floor(index / 3) * width)+4;
    const y = Math.floor(Math.floor(index % 3) * height)+4;
    return new Rectangle(x, y, width, height);
}

Window_DendoInfo.prototype.itemRect = function(index) {
    const rect = new Rectangle();
    rect.x = this.innerWidth-68;
    rect.y = this.innerHeight-32;
    rect.width = 64;
    rect.height = 36;
    return rect; 
};

Window_DendoInfo.prototype.nextPage = function() {
    this._page++;
	if(this._page>2){
		this._page = 0;
	}
    SoundManager.playCursor();
    this.contents.clear();
	this.drawRecord();
	this.drawAllItems();
	this.activate();
};

Window_DendoInfo.prototype.prevPage = function() {
    this._page--;
	if(this._page<0){
		this._page = 2;
	}
	SoundManager.playCursor();
    this.contents.clear();
	this.drawRecord();
	this.drawAllItems();
	this.activate();
};

//-----------------------------------------------------------------------------
// Window_DendoTroopInfo
//
// 殿堂の敵グループの情報を表示

function Window_DendoTroopInfo() {
    this.initialize(...arguments);
}

Window_DendoTroopInfo.prototype = Object.create(Window_Base.prototype);
Window_DendoTroopInfo.prototype.constructor = Window_DendoInfo;

Window_DendoTroopInfo.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
};

Window_DendoTroopInfo.prototype.setInfo = function(faceIndex,troopName) {
    this.contents.clear();
        this.drawDendoImage(faceIndex,0,0);
        this.drawText(troopName, 40, 4);
};

//-----------------------------------------------------------------------------
// Game_Party
//
// 殿堂データを保持

Game_Party.prototype.dendoList = function(){
	if(!this._dendoList){
		this._dendoList = {};
	}
	return this._dendoList;
}

Game_Party.prototype.clearDendo = function(){
	this._dendoList = {};
}

Game_Party.prototype.pushDendoList = function(troopId){
	const list = this.dendoList();
	if(list[String(troopId)]){
		return; //既に殿堂データがある場合は終了
	}
	const record = {};
	record.playTime = $gameSystem.playtimeText();
	record.troopId = troopId;
	const party = [];
    var members = $gameParty.members()
    //ラストバトルのみ　パーティを２つ記録する
    if(troopId == "LB1"){
       members = $gameParty.separatedMembers(1)
    }
    if(troopId == "LB2"){
       members = $gameParty.separatedMembers(2)
    }
	for(member of members){
        //const amember = Object.assign({}, member); //値渡し
		const recordActor = {};
        //console.log(amember)
		recordActor.battlerName = member.battlerName()+"";
		recordActor.id = member.actorId()+0;
		recordActor.level = member.level+0
		recordActor.jLevel = member.jLevel()+0;
		recordActor.mhp = member.mhp+0;
		recordActor.hp = member.hp+0;
		recordActor.mmp = member.mmp+0;
		recordActor.mp = member.mp+0;
		recordActor.stoned = member.isStateAffected(11)+0;
		recordActor.elased = member.isStateAffected(34)+0;
        if(member.currentLicenseJobs()){
            recordActor.lLevel = member.jLevelFromClass(member.currentLicenseJobs()[0])+0;
            recordActor.license = member.currentLicenseJobs()[0].name+"";
            recordActor.sllevel = member.jLevelFromClass(member.currentLicenseJobs()[1])+0;
            recordActor.subLicense = member.currentLicenseJobs()[1].name+"";
        }else{
            recordActor.lLevel = 0;
            recordActor.license = null;
            recordActor.sllevel = 0;
            recordActor.subLicense = null;
        }
		const equips = [];
		for(equip of member.equips()){
			if(!equip){
				equips.push(null);
			}
			if(DataManager.isWeapon(equip)){
				equips.push($dataWeapons[equip.id]);
			}
			if(DataManager.isArmor(equip)){
				equips.push($dataArmors[equip.id]);
			}
		}
		recordActor.equips = equips;
		party.push(recordActor);
	}
	record.party = party;
    //console.log(troopId,record)
	this._dendoList[String(troopId)] = record;
}

//-----------------------------------------------------------------------------
// Game_Troop
//
// 現在の敵グループのIDを取得できるようにする

Game_Troop.prototype.troopId = function() {
    return this._troopId;
};


//-----------------------------------------------------------------------------
// Window_Base
//
// 殿堂のイメージ表示

Window_Base.prototype.drawDendoImage = function(index,x,y){
    const bitmap = ImageManager.loadSystem("dendo");
    const width = bitmap.width;
    const height = bitmap.height;
    const sx = (index % 10) * width/10;
    const sy = Math.floor(index / 10) * height/20;
    bitmap.addLoadListener(function() {
        this.contents.blt(bitmap,sx,sy,width/10,height/20,x,y);
    }.bind(this));
}