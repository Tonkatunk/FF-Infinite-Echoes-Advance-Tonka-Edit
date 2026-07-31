//=============================================================================
// FNG_Libra.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc ライブラ・みやぶる・しらべるを実装
  * @author finga
  * @help ライブラ・みやぶる・しらべるを実装
*/

const _scene_battle_createAllWindows6 = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
    _scene_battle_createAllWindows6.apply(this,arguments);
    this.createSubLibraWindow();
    this.createLibraWindow();
};

Scene_Battle.prototype.createSubLibraWindow = function() {
    const rect = this.enemyNameWindowRect();
    const subLibraWindow = new Window_SubLibra(rect);
    this.addWindow(subLibraWindow);
    this._subLibraWindow = subLibraWindow;
    this._enemyWindow.setSubLibraWindow(subLibraWindow);
};

Scene_Battle.prototype.createLibraWindow = function() {
    const rect = new Rectangle(0,0,Graphics.boxWidth,Graphics.boxHeight);
    const libraWindow = new Window_Libra(rect);
    this._libraWindow = libraWindow;
    this._libraWindow.setHandler("ok", this.onLibraOk.bind(this));
    this._libraWindow.setHandler("cancel", this.onLibraOk.bind(this));
    this._libraWindow.setHandler("pageup", this.onLibraPageup.bind(this));
    this._libraWindow.setHandler("pagedown", this.onLibraPagedown.bind(this));
    this.addWindow(this._libraWindow);
};

Scene_Battle.prototype.onLibraOk = function() {
    this._libraWindow.hide();
    BattleManager.endLibra();
}

Scene_Battle.prototype.onLibraPageup = function() {
    this._libraWindow.nextPage();
}

Scene_Battle.prototype.onLibraPagedown = function() {
    this._libraWindow.prevPage();
}

function Window_LibraExplain(rect) {
    this.initialize(...arguments);
}

Window_LibraExplain.prototype = Object.create(Window_Base.prototype);
Window_LibraExplain.prototype.constructor = Window_LibraExplain;

Window_LibraExplain.prototype.resetFontSettings = function() {    
    this.contents.fontFace = "rmmz-numberfont, " + $dataSystem.advanced.fallbackFonts;
    this.contents.fontSize = $TILE*5/8;
};

Window_LibraExplain.prototype.setText = function(text) {    
    this.contents.clear();
    this.setupText(text.replace(/\n/g,""), 0, $TILE/4, this.textWidth("ああああああああああ"));
};

Window_LibraExplain.prototype.setupText = function(text,x,y,width) {
    var lineText = "";
    var line = 0;
    const notNewLinedCharas = [",",".","。","、","　"," "];
    for(let i=0;i<text.length;i++){
        lineText = lineText + text.substr(i,1);
        if(notNewLinedCharas.includes(text.substr(i+1,1))){
           i++;
           lineText = lineText + text.substr(i,1);
        }
        if(this.textWidth(lineText)+this.textWidth(text.substr(i+1,1))>width){
            this.drawText(lineText,x,y+this.lineHeight()*line,width);
            line++;
            lineText = "";
        }
    }
    if(lineText){
        this.drawText(lineText,x,y+this.lineHeight()*line,width);
    }
};

Window_LibraExplain.prototype.lineHeight = function(text) {    
    return this.contents.fontSize/10*11;
};

function Window_Libra(rect) {
    this.initialize(...arguments);
}

Window_Libra.prototype = Object.create(Window_Selectable.prototype);
Window_Libra.prototype.constructor = Window_Libra;

Window_Libra.prototype.initialize = function(rect,indexWindow) {
    Window_Selectable.prototype.initialize.call(this, rect);
    const explainRect = new Rectangle(rect.x+rect.width/2,rect.y,rect.width/2,rect.height);
    this._explainWindow = new Window_LibraExplain(explainRect);
    this._explainWindow.opacity = 0;
    this._sprite = new Sprite_Clickable();
    this._showFrame = 30;
    this.addChild(this._sprite);
    this._battler = null;
    this.visible = false;
    this._page = 1;
    this._index = 0;
    this.addChild(this._explainWindow);
    this.addChild(this._sprite);
    this._indexWindow = indexWindow;
};

Window_Libra.prototype.nextPage = function() {
    this._page = this._page >= 3 ? 1 : this._page+1;
    this.drawAllitem();
    this.activate();
};

Window_Libra.prototype.prevPage = function() {
    this._page = this._page <= 1 ? 3 : this._page-1;
    this.drawAllitem();
    this.activate();
};

Window_Libra.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    if(!this.visible && BattleManager.libraBattler()){
        this.setBattler(BattleManager.libraBattler());
        this.visible = true;
        this.refresh();
        this.activate();
    }
    if(this.visible && !BattleManager.libraBattler()){
        this.visible = false;
        this._battler = null;
    }
    if(!this._explainWindow.visible && this._page == 3){
        this._explainWindow.show()
    }
    if(this._explainWindow.visible && this._page != 3){
        this._explainWindow.hide()
    }
    
    this.setCursorRect(Graphics.witdh*2,Graphics.height*2,1,1);
    //this._cSprite.visible = false;
    if(this._showFrame>0){
        this._showFrame--;
    }
};

Window_Libra.prototype.setupShowFrame = function(){
    this._showFrame = 30;
}

Window_Libra.prototype.drawAllitem = function(){
    this.contents.clear();
    switch(this._page){
        case 1:
            this.drawPage1();
            break;
        case 2:
            this.drawPage2();
            break;
        case 3:
            this.drawPage3();
            break; 
    }
}

Window_Libra.prototype.drawPage1 = function(){
    const battler = this._battler;

    this.setSprite(battler);
    this.drawBasicInfo(battler);
    this.drawParams(battler);
    this.drawItems(battler);
}

Window_Libra.prototype.drawBasicInfo = function(battler){
    const areaX = Graphics.boxWidth/2;
    const areaX2 = Graphics.boxWidth/4*3;
    const areaY = $TILE/4;
    var name;
    if(battler.isActor()){
        name = battler.name();
    }else if(battler.isEnemy()){
        //console.log(battler);
        name = $dataEnemies[battler.enemyId()].name;
    }
    
    this.changeTextColor(ColorManager.systemColor());
    this.drawText("Lv.",this.textWidth("０００００００００００"),areaY,this.innerWidth);
    this.drawText("HP",areaY,areaY+(this.lineHeight()-1)*1.5,this.innerWidth);
    this.drawText("MP",areaY,areaY+(this.lineHeight()-1)*2.5,this.innerWidth);  
    
    this.changeTextColor(ColorManager.normalColor());
    this.drawText(name,areaY,areaY,this.textWidth("００００００００００"));
    this.drawText(battler.level,this.textWidth(" ００００００００００000"),areaY,this.textWidth("00"),"right");
    this.drawText(battler.hp,this.textWidth(" HP "),areaY+(this.lineHeight()-1)*1.5,this.textWidth("000000"),"right");
    this.drawText("/",this.textWidth(" HP 000000"),areaY+(this.lineHeight()-1)*1.5,this.textWidth("/"));
    this.drawText(battler.mhp,this.textWidth(" HP 000000/"),areaY+(this.lineHeight()-1)*1.5,this.textWidth("000000"),"right");
    this.drawText(battler.mp,this.textWidth(" MP "),areaY+(this.lineHeight()-1)*2.5,this.textWidth("000000"),"right");
    this.drawText("/",this.textWidth(" MP 000000"),areaY+(this.lineHeight()-1)*2.5,this.textWidth("/"));
    this.drawText(battler.mmp,this.textWidth(" MP 000000/"),areaY+(this.lineHeight()-1)*2.5,this.textWidth("000000"),"right");  
}

Window_Libra.prototype.drawElementInfo = function(battler){
    const areaX = Graphics.boxWidth/2;
    const areaX2 = Graphics.boxWidth/4*3;
    const areaY = $TILE/4;
    
    this.drawIcon(67,areaX-$TILE/4,areaY+(this.lineHeight()-1)*13.5-$TILE/4);
    this.drawIcon(68,areaX-$TILE/4+this.textWidth("■000% "),areaY+(this.lineHeight()-1)*13.5-$TILE/4);
    this.drawIcon(69,areaX-$TILE/4+this.textWidth("■000% ■000% "),areaY+(this.lineHeight()-1)*13.5-$TILE/4);
    this.drawIcon(70,areaX-$TILE/4+this.textWidth("■000% ■000% ■000% "),areaY+(this.lineHeight()-1)*13.5-$TILE/4);
    this.drawIcon(71,areaX-$TILE/4,areaY+(this.lineHeight()-1)*14.5+1-$TILE/4);
    this.drawIcon(72,areaX-$TILE/4+this.textWidth("■000% "),areaY+(this.lineHeight()-1)*14.5+1-$TILE/4);
    this.drawIcon(73,areaX-$TILE/4+this.textWidth("■000% ■000% "),areaY+(this.lineHeight()-1)*14.5+1-$TILE/4);
    this.drawIcon(74,areaX-$TILE/4+this.textWidth("■000% ■000% ■000% "),areaY+(this.lineHeight()-1)*14.5+1-$TILE/4);
    this.drawIcon(75,areaX-$TILE/4,areaY+(this.lineHeight()-1)*15.5+2-$TILE/4);
    this.drawIcon(76,areaX-$TILE/4+this.textWidth("■000% "),areaY+(this.lineHeight()-1)*15.5+2-$TILE/4);
    this.drawIcon(77,areaX-$TILE/4+this.textWidth("■000% ■000% "),areaY+(this.lineHeight()-1)*15.5+2-$TILE/4);-
    this.drawIcon(78,areaX-$TILE/4+this.textWidth("■000% ■000% ■000% "),areaY+(this.lineHeight()-1)*15.5+2-$TILE/4);
    this.drawIcon(79,areaX-$TILE/4,areaY+(this.lineHeight()-1)*16.5+3-$TILE/4);
    this.drawIcon(80,areaX-$TILE/4+this.textWidth("■000% "),areaY+(this.lineHeight()-1)*16.5+3-$TILE/4);
    this.drawIcon(81,areaX-$TILE/4+this.textWidth("■000% ■000% "),areaY+(this.lineHeight()-1)*16.5+3-$TILE/4);
    
    this.changeTextColor(ColorManager.normalColor());
    this.drawText(Math.floor(battler.elementRate(2)*100)+"%",areaX-$TILE/4+this.textWidth(" ■"),areaY+(this.lineHeight()-1)*13.5,this.textWidth("-000%"),"right");
    this.drawText(Math.floor(battler.elementRate(3)*100)+"%",areaX-$TILE/4+this.textWidth(" ■-000%■"),areaY+(this.lineHeight()-1)*13.5,this.textWidth("-000%"),"right");
    this.drawText(Math.floor(battler.elementRate(4)*100)+"%",areaX-$TILE/4+this.textWidth(" ■-000%■-000%■"),areaY+(this.lineHeight()-1)*13.5,this.textWidth("-000%"),"right");
    this.drawText(Math.floor(battler.elementRate(5)*100)+"%",areaX-$TILE/4+this.textWidth(" ■-000%■-000%■-000%■"),areaY+(this.lineHeight()-1)*13.5,this.textWidth("-000%"),"right");
    this.drawText(Math.floor(battler.elementRate(6)*100)+"%",areaX-$TILE/4+this.textWidth(" ■"),areaY+(this.lineHeight()-1)*14.5+1,this.textWidth("-000%"),"right");
    this.drawText(Math.floor(battler.elementRate(7)*100)+"%",areaX-$TILE/4+this.textWidth(" ■-000%■"),areaY+(this.lineHeight()-1)*14.5+1,this.textWidth("-000%"),"right");
    this.drawText(Math.floor(battler.elementRate(8)*100)+"%",areaX-$TILE/4+this.textWidth(" ■-000%■-000%■"),areaY+(this.lineHeight()-1)*14.5+1,this.textWidth("-000%"),"right");
    this.drawText(Math.floor(battler.elementRate(9)*100)+"%",areaX-$TILE/4+this.textWidth(" ■-000%■-000%■-000%■"),areaY+(this.lineHeight()-1)*14.5+1,this.textWidth("-000%"),"right");
    this.drawText(Math.floor(battler.elementRate(10)*100)+"%",areaX-$TILE/4+this.textWidth(" ■"),areaY+(this.lineHeight()-1)*15.5+2,this.textWidth("-000%"),"right");
    this.drawText(Math.floor(battler.elementRate(13)*100)+"%",areaX-$TILE/4+this.textWidth(" ■-000%■"),areaY+(this.lineHeight()-1)*15.5+2,this.textWidth("-000%"),"right");
    this.drawText(Math.floor(battler.elementRate(14)*100)+"%",areaX-$TILE/4+this.textWidth(" ■-000%■-000%■"),areaY+(this.lineHeight()-1)*15.5+2,this.textWidth("-000%"),"right");
    this.drawText(Math.floor(battler.elementRate(15)*100)+"%",areaX-$TILE/4+this.textWidth(" ■-000%■-000%■-000%■"),areaY+(this.lineHeight()-1)*15.5+2,this.textWidth("-000%"),"right");
    this.drawText(Math.floor(battler.elementRate(16)*100)+"%",areaX-$TILE/4+this.textWidth(" ■"),areaY+(this.lineHeight()-1)*16.5+3,this.textWidth("-000%"),"right");
    this.drawText(Math.floor(battler.elementRate(17)*100)+"%",areaX-$TILE/4+this.textWidth(" ■-000%■"),areaY+(this.lineHeight()-1)*16.5+3,this.textWidth("-000%"),"right");
    this.drawText(Math.floor(battler.elementRate(18)*100)+"%",areaX-$TILE/4+this.textWidth(" ■-000%■-000%■"),areaY+(this.lineHeight()-1)*16.5+3,this.textWidth("-000%"),"right");
    
    
}

Window_Libra.prototype.drawItems = function(battler){
    const areaX = Graphics.boxWidth/2;
    const areaY = $TILE/4;
    
    if(battler.isEnemy()){
        this.changeTextColor(ColorManager.systemColor());
        this.drawText("Steal",areaX,areaY,this.textWidth("Steal"));
        this.drawText("Drops",areaX,areaY+(this.lineHeight()-1)*3.5,this.textWidth("Drops"));
        this.drawText("Morph",areaX,areaY+(this.lineHeight()-1)*8,this.textWidth("Morph"));
        
        this.changeTextColor(ColorManager.normalColor());
        
        var stealRate1 = 0;
        if(battler.stealItem(0)){
            this.drawItemName(battler.stealItem(0),areaX,areaY+(this.lineHeight()-1)*1,areaX);
            stealRate1 = Math.floor(battler.stealRate()*1000)/10;
        }
        if(battler.stealItem(1)){
            stealRate1 = Math.floor((stealRate1 - stealRate1/8)*10)/10;
        }
        this.drawText(stealRate1+"%",areaX,areaY+(this.lineHeight()-1)*1,this.textWidth("■００００００００００0000%"),"right");
        if(battler.stealItem(1)){
            this.drawItemName(battler.stealItem(1),areaX,areaY+(this.lineHeight()-1)*2,areaX);
            this.drawText(Math.floor(battler.stealRate()*1000/8)/10+"%",areaX,areaY+(this.lineHeight()-1)*2,this.textWidth("■００００００００００0000%"),"right");
        }
        const dropItems = $dataEnemies[battler._enemyId].dropItems;
        for(let i = 0;i<dropItems.length;i++){
            switch(dropItems[i].kind){
                // アイテム
                case 1:
            this.drawItemName($dataItems[dropItems[i].dataId],areaX,areaY+(this.lineHeight()-1)*(4.5+i),areaX);
                    break;
                // 武器
                case 2:
            this.drawItemName($dataWeapons[dropItems[i].dataId],areaX,areaY+(this.lineHeight()-1)*(4.5+i),areaX);
                    break;
                // 防具
                case 3:
            this.drawItemName($dataArmors[dropItems[i].dataId],areaX,areaY+(this.lineHeight()-1)*(4.5+i),areaX);
                    break;
                
            }
            if(dropItems[i].kind){
                this.drawText(Math.floor(1/dropItems[i].denominator*1000)/10+"%",areaX,areaY+(this.lineHeight()-1)*(4.5+i),this.textWidth("■００００００００００0000%"),"right");
            }
        }
        if(battler.metamolItem()){
            this.drawItemName(battler.metamolItem(),areaX,areaY+(this.lineHeight()-1)*9,areaX);
            this.drawText(Math.floor(battler.stateRate(34)*1000/2)/10+"%",areaX,areaY+(this.lineHeight()-1)*9,this.textWidth("■００００００００００0000%"),"right");
        }
    }    
}

Window_Libra.prototype.drawParams = function(battler){
    const areaX = Graphics.boxWidth/2;
    const areaX2 = Graphics.boxWidth/4*3;
    const areaY = $TILE/4;
    
    this.changeTextColor(ColorManager.systemColor());
    this.drawText("ATK",areaX,areaY+(this.lineHeight()-1)*11,areaX2);
    this.drawText("DEF",areaX2,areaY+(this.lineHeight()-1)*11,areaX2);
    this.drawText("POW",areaX,areaY+(this.lineHeight()-1)*12,areaX2);
    this.drawText("MAT",areaX2,areaY+(this.lineHeight()-1)*12,areaX2);
    this.drawText("VIT",areaX,areaY+(this.lineHeight()-1)*13,areaX2);
    this.drawText("AGI",areaX2,areaY+(this.lineHeight()-1)*13,areaX2);
    this.drawText("MDF",areaX,areaY+(this.lineHeight()-1)*14,areaX2);
    this.drawText("Eva%",areaX,areaY+(this.lineHeight()-1)*15,areaX2);
    if(battler.isEnemy()){
        this.drawText("EXP",areaX,areaY+(this.lineHeight()-1)*16.5,areaX2);
        this.drawText("AP",areaX+this.textWidth("EXP     "),areaY+(this.lineHeight()-1)*16.5,areaX2+this.textWidth("EXP     "));
    }

    this.changeTextColor(ColorManager.normalColor());
    this.drawText(battler.atk,areaX+this.textWidth("ATK   "),areaY+(this.lineHeight()-1)*11,this.textWidth("000"),"right");
    this.drawText(battler.def,areaX2+this.textWidth("DEF "),areaY+(this.lineHeight()-1)*11,this.textWidth("000"),"right");
    this.drawText(battler.pow,areaX+this.textWidth("POW    "),areaY+(this.lineHeight()-1)*12,this.textWidth("000"),"right");
    this.drawText(battler.mat,areaX2+this.textWidth("MAT "),areaY+(this.lineHeight()-1)*12,this.textWidth("000"),"right");
    this.drawText(battler.vit,areaX+this.textWidth("VIT   "),areaY+(this.lineHeight()-1)*13,this.textWidth("000"),"right");
    this.drawText(battler.agi,areaX2+this.textWidth("AGI "),areaY+(this.lineHeight()-1)*13,this.textWidth("000"),"right");
    this.drawText(battler.mdf,areaX+this.textWidth("MDF    "),areaY+(this.lineHeight()-1)*14,this.textWidth("000"),"right");
    this.drawText(Math.floor(battler.eva*100)+"%",areaX+this.textWidth("Eva%    "),areaY+(this.lineHeight()-1)*15,this.textWidth("000%"),"right");
    if(battler.isEnemy()){
        this.drawText(battler.exp(),areaX+this.textWidth("EXP "),areaY+(this.lineHeight()-1)*16.5,this.textWidth("000000"),"left");
        this.drawText(battler.Ap(),areaX+this.textWidth("EXP     AP "),areaY+(this.lineHeight()-1)*16.5,this.textWidth("000000"),"left");
    }
}

Window_Libra.prototype.drawPage2 = function(){
    const battler = this._battler;

    this.setSprite(battler);
    this.drawBasicInfo(battler);
    this.drawStateInfo(battler);
    this.drawElementInfo(battler);
}

Window_Libra.prototype.drawPage3 = function(){
    const battler = this._battler;

    this.setSprite(battler);
    this.drawExplain(battler);
    this.drawBasicInfo(battler);
}

Window_Libra.prototype.setSprite = function(battler){
    if(battler.isEnemy()){
        if(battler.enemy().meta.bookImage){
            this._sprite.bitmap = ImageManager.loadBitmap("img/sv_enemies/", battler.enemy().meta.bookImage);
        }else{
            this._sprite.bitmap = ImageManager.loadBitmap("img/sv_enemies/", battler.battlerName());
        }
		this._sprite.anchor.x = 0.5;
        this._sprite.anchor.y = 0.5;
		this._sprite.setHue(battler.battlerHue());
        this._sprite.x = 65;
        this._sprite.y = 95;
        this.addChild(this._sprite);
    }else if(battler.isActor()){
        const bitmap = ImageManager.loadSvActor(battler.battlerName());
        this._sprite.bitmap = bitmap;
        this._sprite.setFrame(bitmap.width/9,0,bitmap.width/9,bitmap.height/6);
        this._sprite.anchor.x = 0.5;
        this._sprite.anchor.y = 0.5;
        this._sprite.x = 65;
        this._sprite.y = 95;
        this.addChild(this._sprite);
    }
}

Window_Libra.prototype.drawExplain = function(battler){
    const areaX = Graphics.boxWidth/2;
    const areaY = $TILE/4;
    
    var text;
    if(battler.isEnemy()){
        text = $dataEnemies[battler._enemyId].meta.explain;
    }else{
        if($dataActors[battler._actorId].meta.explain){
            text = $dataActors[battler._actorId].meta.explain;
        }else{
            text = "No character description set."
        }
    }
    
    this._explainWindow.setText(text);
}

Window_Libra.prototype.drawStateInfo = function(battler){    
    const areaX = Graphics.boxWidth/2;
    const areaX2 = areaX+this.textWidth("あああああ000%");
    const areaY = $TILE/4;
    
    this.changeTextColor(ColorManager.systemColor());
    this.drawText("Eff%",areaX,areaY,areaX);
    this.drawText("Cannot fight",areaX,areaY+(this.lineHeight()-1)*1.5,areaX);
    this.drawText("Death",areaX,areaY+(this.lineHeight()-1)*2.5,areaX2);
    this.drawText("Poison",areaX,areaY+(this.lineHeight()-1)*3.5,areaX2);
    this.drawText("Dark",areaX2,areaY+(this.lineHeight()-1)*3.5,areaX2);
    this.drawText("Silence",areaX,areaY+(this.lineHeight()-1)*4.5,areaX2);
    this.drawText("Berserk",areaX2,areaY+(this.lineHeight()-1)*4.5,areaX2);
    this.drawText("Confuse",areaX,areaY+(this.lineHeight()-1)*5.5,areaX2);
    this.drawText("Sleep",areaX2,areaY+(this.lineHeight()-1)*5.5,areaX2);
    this.drawText("Stone",areaX,areaY+(this.lineHeight()-1)*6.5,areaX2);
    this.drawText("Paralyze",areaX2,areaY+(this.lineHeight()-1)*6.5,areaX2);
    this.drawText("Delay",areaX,areaY+(this.lineHeight()-1)*7.5,areaX2);
    this.drawText("Frog",areaX2,areaY+(this.lineHeight()-1)*7.5,areaX2);
    this.drawText("Control",areaX,areaY+(this.lineHeight()-1)*8.5,areaX2);
    this.drawText("Mini",areaX2,areaY+(this.lineHeight()-1)*8.5,areaX2);
    this.drawText("Zombie",areaX,areaY+(this.lineHeight()-1)*9.5,areaX2);
    this.drawText("Stop",areaX2,areaY+(this.lineHeight()-1)*9.5,areaX2);
    this.drawText("Slow",areaX,areaY+(this.lineHeight()-1)*10.5,areaX2);
    this.drawText("Slip",areaX2,areaY+(this.lineHeight()-1)*10.5,areaX2);
    this.drawText("Transp.",areaX,areaY+(this.lineHeight()-1)*11.5,areaX2);
    this.drawText("ATK\u2193",areaX2,areaY+(this.lineHeight()-1)*11.5,areaX2);
    this.drawText("DEF\u2193",areaX,areaY+(this.lineHeight()-1)*12.5,areaX2);
    
    this.changeTextColor(ColorManager.normalColor());
    this.drawText(Math.floor(battler.stateRate(1)*100)+"%",areaX+this.textWidth("Cannot fight"),areaY+(this.lineHeight()-1)*1.5,this.textWidth("000%"),"right");
    this.drawText(Math.floor(battler.stateRate(39)*100)+"%",areaX+this.textWidth("Death   "),areaY+(this.lineHeight()-1)*2.5,this.textWidth("000%"),"right");
    this.drawText(Math.floor(battler.stateRate(4)*100)+"%",areaX+this.textWidth("Poison"),areaY+(this.lineHeight()-1)*3.5,this.textWidth("000%"),"right");
    this.drawText(Math.floor(battler.stateRate(5)*100)+"%",areaX2+this.textWidth("Dark"),areaY+(this.lineHeight()-1)*3.5,this.textWidth("000%"),"right");
    this.drawText(Math.floor(battler.stateRate(6)*100)+"%",areaX+this.textWidth("Silence"),areaY+(this.lineHeight()-1)*4.5,this.textWidth("000%"),"right");
    this.drawText(Math.floor(battler.stateRate(7)*100)+"%",areaX2+this.textWidth("Berserk"),areaY+(this.lineHeight()-1)*4.5,this.textWidth("000%"),"right");
    this.drawText(Math.floor(battler.stateRate(8)*100)+"%",areaX+this.textWidth("Confuse"),areaY+(this.lineHeight()-1)*5.5,this.textWidth("000%"),"right");
    this.drawText(Math.floor(battler.stateRate(10)*100)+"%",areaX2+this.textWidth("Sleep"),areaY+(this.lineHeight()-1)*5.5,this.textWidth("000%"),"right");
    this.drawText(Math.floor(battler.stateRate(11)*100)+"%",areaX+this.textWidth("Stone"),areaY+(this.lineHeight()-1)*6.5,this.textWidth("000%"),"right");
    this.drawText(Math.floor(battler.stateRate(12)*100)+"%",areaX2+this.textWidth("Paralyze"),areaY+(this.lineHeight()-1)*6.5,this.textWidth("000%"),"right");
    this.drawText(Math.floor(battler.stateRate(13)*100)+"%",areaX+this.textWidth("Delay"),areaY+(this.lineHeight()-1)*7.5,this.textWidth("000%"),"right");
    this.drawText(Math.floor(battler.stateRate(14)*100)+"%",areaX2+this.textWidth("Frog"),areaY+(this.lineHeight()-1)*7.5,this.textWidth("000%"),"right");
    this.drawText(Math.floor(battler.stateRate(17)*100)+"%",areaX+this.textWidth("Control"),areaY+(this.lineHeight()-1)*8.5,this.textWidth("000%"),"right");
    this.drawText(Math.floor(battler.stateRate(35)*100)+"%",areaX2+this.textWidth("Mini"),areaY+(this.lineHeight()-1)*8.5,this.textWidth("000%"),"right");
    this.drawText(Math.floor(battler.stateRate(36)*100)+"%",areaX+this.textWidth("Zombie"),areaY+(this.lineHeight()-1)*9.5,this.textWidth("000%"),"right");
    this.drawText(Math.floor(battler.stateRate(37)*100)+"%",areaX2+this.textWidth("Stop"),areaY+(this.lineHeight()-1)*9.5,this.textWidth("000%"),"right");
    this.drawText(Math.floor(battler.stateRate(40)*100)+"%",areaX+this.textWidth("Slow"),areaY+(this.lineHeight()-1)*10.5,this.textWidth("000%"),"right");
    this.drawText(Math.floor(battler.stateRate(42)*100)+"%",areaX2+this.textWidth("Slip"),areaY+(this.lineHeight()-1)*10.5,this.textWidth("000%"),"right");
    this.drawText(Math.floor(battler.stateRate(46)*100)+"%",areaX+this.textWidth("Transp."),areaY+(this.lineHeight()-1)*11.5,this.textWidth("000%"),"right");
    this.drawText(Math.floor(battler.stateRate(55)*100)+"%",areaX2+this.textWidth("ATK\u2193"),areaY+(this.lineHeight()-1)*11.5,this.textWidth("000%"),"right");
    this.drawText(Math.floor(battler.stateRate(56)*100)+"%",areaX+this.textWidth("DEF\u2193"),areaY+(this.lineHeight()-1)*12.5,this.textWidth("000%"),"right");
}

Window_Libra.prototype.setBattler = function(battler){
    this._battler = battler;
    this.refresh();
};

Window_Libra.prototype.refresh = function(){
    this.drawAllitem();
};

Window_Libra.prototype.processCursorMove = function() {
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

Window_Libra.prototype.processHandling = function() {
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

function Window_SubLibra() {
    this.initialize(...arguments);
}

Window_SubLibra.prototype = Object.create(Window_Selectable.prototype);
Window_SubLibra.prototype.constructor = Window_SubLibra;

Window_SubLibra.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._battler = null;
    this.visible = false;
};

Window_SubLibra.prototype.setBattler = function(battler){
    this._battler = battler;
    this.refresh();
};

Window_SubLibra.prototype.refresh = function(){
    this.drawAllitem();
    this.visible = this.shouldShow();
};

Window_SubLibra.prototype.shouldShow = function(){
    const battler = this._battler;
    const actor = BattleManager._currentActor;
    if(battler){
        //ライブラ状態
        if(battler.isStateAffected(27)){
            return true;
        };
        if(actor){
            if(actor.isMsLibla()){
                return true;
            }
        }
    }
    return false;
};

Game_Actor.prototype.isMsLibla = function(){
    if(this.isStateAffected(26)&&this.magicSwordId()==560){
       return true;
    }
    if(this.hasSkill(302)){
       return true;
    }
    return false;
}

Window_SubLibra.prototype.drawAllitem = function(){
    this.contents.clear();
    const battler = this._battler;
    if(!battler){
        return;
    }
    this.changeTextColor(ColorManager.systemColor());
    this.drawText("Lv.",0,0,this.innerWidth);
    this.drawText("HP",this.textWidth("000000"),0,this.innerWidth);
    this.drawText("MP",0,this.lineHeight()-1,this.innerWidth);
    this.drawText("Weak",0,(this.lineHeight()-1)*2,this.innerWidth);
    this.drawText("Null",0,(this.lineHeight()-1)*3,this.innerWidth);
    this.drawText("Absorb",0,(this.lineHeight()-1)*4,this.innerWidth);
    this.changeTextColor(ColorManager.normalColor());
    this.drawText(battler.level,this.textWidth("000"),0,this.textWidth("00"),"right");
    this.drawText(battler.hp,this.textWidth("00000000"),0,this.textWidth("000000"),"right");
    this.drawText("/",this.textWidth("00000000000000"),0,this.textWidth("0"));
    this.drawText(battler.mhp,this.textWidth("000000000000000"),0,this.textWidth("000000"),"right");
    this.drawText(battler.mp,this.textWidth("00"),this.lineHeight()-1,this.textWidth("000000"),"right");
    this.drawText("/",this.textWidth("00000000"),this.lineHeight()-1,this.textWidth("0"));
    this.drawText(battler.mmp,this.textWidth("000000000"),this.lineHeight()-1,this.textWidth("000000"),"right");
    this.drawElementIcons(this.textWidth("00000"),(this.lineHeight()-1)*2,"weak");
    this.drawElementIcons(this.textWidth("00000"),(this.lineHeight()-1)*3,"guard");
    this.drawElementIcons(this.textWidth("00000"),(this.lineHeight()-1)*4,"absorb");
};

Window_SubLibra.prototype.drawElementIcons = function(x,y,category){
    const battler = this._battler;
    var currentX = x;
    for(let i=2;i<11;i++){
        switch(category){
            case "weak":
                if(battler.elementRate(i)>1){
                    this.drawIcon(65+i,currentX-$TILE/4,y-$TILE/4);
                    currentX+=$TILE/2;
                }
                break;
            case "guard":
                if(battler.elementRate(i)==0){
                    this.drawIcon(65+i,currentX-$TILE/4,y-$TILE/4);
                    currentX+=$TILE/2;
                }
                break;
            case "absorb":
                if(battler.elementRate(i)<0){
                    this.drawIcon(65+i,currentX-$TILE/4,y-$TILE/4);
                    currentX+=$TILE/2;
                }
                break;
        }
    }
    for(let i=13;i<19;i++){
        switch(category){
            case "weak":
                if(battler.elementRate(i)>1){
                    this.drawIcon(63+i,currentX-$TILE/4,y-$TILE/4);
                    currentX+=$TILE/2;
                }
                break;
            case "guard":
                if(battler.elementRate(i)==0){
                    this.drawIcon(63+i,currentX-$TILE/4,y-$TILE/4);
                    currentX+=$TILE/2;
                }
                break;
            case "absorb":
                if(battler.elementRate(i)<0){
                    this.drawIcon(63+i,currentX-$TILE/4,y-$TILE/4);
                    currentX+=$TILE/2;
                }
                break;
        }        
    }
};

const _Window_BattleEnemy_activate = Window_BattleEnemy.prototype.activate;
Window_BattleEnemy.prototype.activate = function() {    
    _Window_BattleEnemy_activate.apply(this,arguments);
    battler = this._enemies[this.index()];
    this._subLibraWindow.setBattler(battler);
};

const _Window_BattleEnemy_deactivate = Window_BattleEnemy.prototype.deactivate;
Window_BattleEnemy.prototype.deactivate = function() {    
    _Window_BattleEnemy_deactivate.apply(this,arguments);
    if(this._subLibraWindow){
        this._subLibraWindow.setBattler(null);
    }
};

Window_BattleEnemy.prototype.processCursorMove = function() {    
    const lastIndex = this.index();
    Window_Selectable.prototype.processCursorMove.call(this);
    if(lastIndex != this.index() && this.index() >= 0){
        battler = this._enemies[this.index()];
        this._subLibraWindow.setBattler(battler);
    }
};

Window_BattleEnemy.prototype.setSubLibraWindow = function(subLibraWindow) {
    this._subLibraWindow = subLibraWindow;
};

BattleManager.startLibra = function(battler) {
    this._phase = "Libra";
    this._LibraBattler = battler;
};

BattleManager.endLibra = function() {
    this._LibraBattler = null;
    this._phase = "action";
};

BattleManager.libraBattler = function() {
    return this._LibraBattler;
};