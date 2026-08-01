//=============================================================================
// FNG_FFIVictory.js
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc 勝利画面をFFIオリジナルの物にする
 * @author finga
 * @url
 *
 * @help 勝利画面をFFIオリジナルの物にする
 * 
 */
 
//-----------------------------------------------------------------------------
// Scene_Result
//
// 戦闘画面の結果を表示する専用シーン

function Scene_Result() {
    this.initialize.apply(this, arguments);
}

Scene_Result.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Result.prototype.constructor = Scene_Result;

Scene_Result.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
    this._phase = "start";
    this._frameCount = 0;
};

Scene_Result.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createMenuNameWindow("Rewards");
    this.createResultWindow();
    this.createResultActorWindows();
    this.createResultCrystalsWindow();
    this.createNoticeLevelUpWindows();
};

Scene_Result.prototype.update = function() {
    console.log(this._phase)
    switch(this._phase){
        case "start":
            this.updateStart();
            break;
        case "plus":
            this.updatePlus();
            break;
        case "startItem1":
            this.updateStartItem1();
            break;
        case "startItem2":
            this.updateStartItem2();
            break;
        case "item":
            this._resultCrystalsWindow.update();
            break;
        case "end":
            this.updateEnd();
            break;
    }
    for(let i = 0;i<this._noticeLevelUpWindows.length;i++){
        this._noticeLevelUpWindows[i].update();
    }
};

Scene_Result.prototype.updateStart = function() {
    const frame = this._frameCount;
    if(frame <= 15 && this._resultActorsWindows.length>0){
        for(let i = 0;i<this._resultActorsWindows.length;i++){
            const basex = -Graphics.boxWidth/2+(i%2)*Graphics.boxWidth/2*3;
            var addx = Graphics.boxWidth/15/2 * frame;
            if(i%2 == 1){
                addx *= -1;
            }
            this._resultActorsWindows[i].x = basex + addx;
        }
    }
    this._resultCrystalsWindow.x = Graphics.boxWidth - Graphics.boxWidth/2/15*(frame-1);
    this._frameCount++;
    if(frame > 15){
        this._phase = "plus";
        console.log("plus");
        this._frameCount = 0;
        AudioManager.playBgs({"name":"FF8 exp","volume":90,"pitch":100,"pan":0});
    }
};

Scene_Result.prototype.updateStartItem2 = function() {
    const frame = this._frameCount;
    this._frameCount++;
    this._dropItemWindow.y = Graphics.boxHeight - Math.floor(this._dropItemWindow.height/10 * (frame-1));
    if(frame > 10){
        console.log("item");
        this._phase = "item";
        this._resultCrystalsWindow.activate();
    }
};

Scene_Result.prototype.updateStartItem1 = function() {
    const frame = this._frameCount;
    if(frame <= 10 && this._resultActorsWindows.length>0){
        for(let i = 0;i<this._resultActorsWindows.length;i++){
            const basex = Graphics.boxWidth * (i%2);
            var addx = Graphics.boxWidth/10/2 * frame;
            if(i%2 == 0){
                addx *= -1;
            }
            this._resultActorsWindows[i].x = basex + addx;
        }
    }
    this._frameCount++;
    if(frame > 10){
        this._frameCount = 0;
        this._resultWindow.drawOtakara();
        this.createDropItemWindow();
        console.log("startItem2");
        this._phase = "startItem2";
    }
};

Scene_Result.prototype.updatePlus = function() {
    const frame = this._frameCount;
    if(frame < 180){
        for(let i = 0;i<this._resultActorsWindows.length;i++){
            this._resultActorsWindows[i].updateParam(frame);
            this._resultActorsWindows[i].update();
        }
        this._resultCrystalsWindow.updateParam(frame);
    }
    if(frame >= 180 || this.isAllCountStop()){
        for(let i = 0;i<this._resultActorsWindows.length;i++){
            this._resultActorsWindows[i]._countStop = true;
        }
        this._resultCrystalsWindow._countStop = true;
        this._frameCount = 180;
        AudioManager.stopBgs();
    }
    this._resultCrystalsWindow.update();
    this._frameCount++;
};

Scene_Result.prototype.updateEnd = function() {
    const frame = this._frameCount;
    this._noticeItemgetWindow.update();
    if(frame >= 120){
        SceneManager.pop();
        BattleManager.replayBgmAndBgs();
        if(!$gameSwitches.value(12)){
            AudioManager.fadeInBgm(1);
        }
        $gameScreen.startFadeIn(60);
        //console.log($gameParty.subMembers()[0].name,$gameParty.subMembers()[0].currentExp());
    }else if(frame == 60){
        //console.log($gameParty.subMembers()[0].name,$gameParty.subMembers()[0].currentExp());
        BattleManager.gainRewards();
        BattleManager.setBountyResult();
        $gameParty.removeVictoryStates();
        //console.log($gameParty.subMembers()[0].name,$gameParty.subMembers()[0].currentExp());
        BattleManager.updateBook();
        this._menuNameWindow.close();
        this._resultCrystalsWindow.close();
        this._resultWindow.close();
        this._dropItemWindow.close();
        if(!$gameSwitches.value(12)){
            AudioManager.fadeOutBgm(1);
        }
    }
    this._menuNameWindow.update();
    this._resultCrystalsWindow.update();
    this._resultWindow.update();
    this._dropItemWindow.update();
    this._frameCount++;
};

BattleManager.setBountyResult = function(){
    if($gameVariables.value(96)>0){
        if($gameVariables.value($gameVariables.value(96))==0){
            $gameVariables.setValue($gameVariables.value(96),1);
        }
    }
}

//戦闘勝利確定直後にステートを解除すると見た目がおかしくなるステートを解除する
//Scene_Result.prototype.updateEndから呼び出し
Game_Party.prototype.removeVictoryStates = function() {
    for(member of this.allBattleMembers()){
        member.removeState(23); //ジャンプ
        member.removeState(34); //除外
    }
}

BattleManager.gainExp = function() {
    var exp = this._rewards.exp;
    const boostRate = Number($gameParty.boostExpRate());
    var boostedExp = Math.floor(exp*boostRate);
	console.log(boostedExp)
    for (const actor of $gameParty.allMembers()) {
        actor.gainExp(boostedExp);
    }
    $gameSystem.addGainedExpCount(boostedExp);
    $gameSystem.addBoostedExpCount(boostedExp-exp);

    exp = Math.floor(exp*0.8);
    boostedExp = Math.floor(boostedExp*0.8);

    for(actor of $gameParty.subMembers()){
        //なぜかgameActorsから呼び出さないとダメなようなので
        const id = actor.actorId();
        console.log(boostedExp)
        $gameActors.actor(id).changeExp($gameActors.actor(id).currentExp()+boostedExp, false);
        
    }
    //パーティ分割時の他パーティへも経験値増加
    if($gameParty.partyNum() > 1){
        for(let i = 1;i<=3;i++){
            if($gameVariables.value(81) == i){ //現在のパーティ
                continue;
            }
            for(actor of $gameParty.separatedMembers(i)){
                if(!actor){
                    break;
                }
                const id = actor.actorId();
                $gameActors.actor(id).changeExp($gameActors.actor(id).currentExp()+exp,false);
            }
        }
    }

    $gameParty.addInitialExp(boostedExp);
};

Game_Party.prototype.boostExpRate = function(){
    switch($gameVariables.value(51)){
        case 0: return 0;
        case 1: return 0.25;
        case 2: return 0.5;
        case 3: return 0.75;
        case 4: return 1;
        case 5: return 1.25;
        case 6: return 1.5;
        case 7: return 1.75;
        case 8: return 2;
        case 9: return 3;
        case 10: return 4;
    }
}

Game_Party.prototype.boostGoldRate = function(){
    switch($gameVariables.value(51)){
        case 0: return 0;
        case 1: return 0.25;
        case 2: return 0.5;
        case 3: return 0.75;
        case 4: return 1;
        case 5: return 1.25;
        case 6: return 1.5;
        case 7: return 1.75;
        case 8: return 2;
        case 9: return 3;
        case 10: return 4;
    }
}

Game_Party.prototype.addInitialExp = function(exp){
    if(!this._initialExp){
        this._initialExp = 0;
    }
    this._initialExp += exp;
}

//パーティ加入時に加算されるEXP
Game_Party.prototype.initialExp = function(){
    if(!this._initialExp){
        this._initialExp = 0;
    }
    return Math.floor(this._initialExp*0.8);
}


Scene_Result.prototype.isAllCountStop = function() {
    var countStopNum = 0;
    console.log(this._resultActorsWindows.length,this._resultCrystalsWindow)
    for(let i = 0;i<this._resultActorsWindows.length;i++){
        if(this._resultActorsWindows[i]._countStop){
            console.log("countStop No.",i);
            countStopNum++;
        }
    }
    if(this._resultCrystalsWindow._countStop){
        console.log("countStop Cristal");
        countStopNum++;       
    }
    if(this._resultActorsWindows.length <= countStopNum){
        return true;
    }
    return false;
};

Scene_Result.prototype.createMenuNameWindow = function(name) {
    const width = this.mainFontSize()*5+this.mainFontSize()*5/4;
    const height = this.mainFontSize()*3;
    var rect = new Rectangle(Graphics.boxWidth-width, 0, width,height);
    this._menuNameWindow = new Window_MenuName(rect);
    this._menuNameWindow.drawMenuName(name);
    this.addWindow(this._menuNameWindow);
};

Scene_Result.prototype.createResultWindow = function() {
    const rect = new Rectangle(0,0,Graphics.boxWidth-this._menuNameWindow.width,this._menuNameWindow.height);
    this._resultWindow = new Window_BattleResult(rect);
    this.addWindow(this._resultWindow);
};

Scene_Result.prototype.createResultActorWindows = function() {
    this._resultActorsWindows = [];
    for(let i=0;i < $gameParty.members().length;i++){
        const actor = $gameParty.members()[i];
        const h = (Graphics.boxHeight-this._resultWindow.height)/3;
        const y = this._resultWindow.height+(h * Math.floor(i/2));
        const w = Graphics.boxWidth/2;
        const x = -w+(i%2)*w*3;
        const rect = new Rectangle(x,y,w,h);
        const window = new Window_ResultActor(actor,rect);
        this._resultActorsWindows.push(window);
        this.addWindow(window);
    }
};

Scene_Result.prototype.createNoticeLevelUpWindows = function() {
    this._noticeLevelUpWindows = [];
    for(let i=0;i < $gameParty.members().length;i++){
        const window = new Window_NoticeLevelUp(this._resultActorsWindows[i]);
        this._noticeLevelUpWindows.push(window);
        this.addWindow(window);
        this._resultActorsWindows[i].setLevelUpWindow(window);
    }
};

Scene_Result.prototype.createNoticeItemGetWindow = function() {
    const window = new Window_NoticeItemGet();
    this._noticeItemgetWindow = window;
    this.addWindow(window);
};

Scene_Result.prototype.createResultCrystalsWindow = function() {
    const h = (Graphics.boxHeight-this._resultWindow.height)/3;
    const y = this._resultWindow.height+h*2;
    const w = Graphics.boxWidth/2;
    const x = Graphics.boxWidth;
    const rect = new Rectangle(x,y,w,h);
    const window = new Window_ResultCrystals(rect);
    this._resultCrystalsWindow = window;
    this._resultCrystalsWindow.setHandler("next", this.toNext.bind(this));
    this._resultCrystalsWindow.activate();
    this.addWindow(window);
};

Scene_Result.prototype.createDropItemWindow = function() {
    const h = Graphics.boxHeight-this._resultWindow.height;
    const y = Graphics.boxHeight;
    const w = Graphics.boxWidth/2;
    const x = 0;
    const rect = new Rectangle(x,y,w,h);
    const window = new Window_DropItem(rect);
    this._dropItemWindow = window;
    this.addWindow(window);
};

Scene_Result.prototype.toNext = function() {
    console.log(this._phase,this._frameCount,this.isNoticedAllInfo(),this.isAllCountStop())
    if(this._phase == "plus" && this._frameCount >= 180 && this.isNoticedAllInfo() || this._frameCount >= 300){
        console.log("startItem1");
        this._phase = "startItem1";
        this._frameCount = 0;
    }
    if(this._phase == "plus"){
        AudioManager.stopBgs();
        this._frameCount = 200;
        this._resultCrystalsWindow.activate();
        //this._phase = "startItem1";
        //this._frameCount = 0;
    }
    if(this._phase == "item"){
        this.createNoticeItemGetWindow();
        console.log("end");
        this._phase = "end";
        if(BattleManager._rewards.items.length > 0){
            this._noticeItemgetWindow.pushContents("get");
        }else{
            this._noticeItemgetWindow.pushContents("notget");           
        }
        this._frameCount = 0; //Raising this will let you skip the get item window faster, but will disable all AP rewards for some reason.
        this._resultCrystalsWindow.activate();
    }
    this._resultCrystalsWindow.activate();
};

Scene_Result.prototype.isNoticedAllInfo = function() {
    var nopush = 0;
    for(let i = 0;i<this._noticeLevelUpWindows.length;i++){
        if(this._noticeLevelUpWindows[i]._contents.length == 0){
            nopush++;
        }
    }
    return this.isAllCountStop() && this._noticeLevelUpWindows.length == nopush;
};

//-----------------------------------------------------------------------------
// Window_NoticeLevelUp
//
// アクターがレベルアップしたり、スキルを習得すると
// それぞれのアクターの上に表示される

function Window_NoticeLevelUp() {
    this.initialize(...arguments);
}

Window_NoticeLevelUp.prototype = Object.create(Window_Base.prototype);
Window_NoticeLevelUp.prototype.constructor = Window_NoticeLevelUp;

Window_NoticeLevelUp.prototype.initialize = function(resultActorWindow) {
    var rect = new Rectangle(100,100,100,100);
    Window_Base.prototype.initialize.call(this, rect);
    this._frameCount = 0;
    this._mode = "hide";
    this.visible = false;
    this._contents = [];
    this._resultActorWindow = resultActorWindow;
};

Window_NoticeLevelUp.prototype.startLevelUp = function() {
    AudioManager.playSe({"name":"FF8 levelup","volume":90,"pitch":100,"pan":0});
    this._mode = this._contents.shift();
    this.visible = true;
    this.open();
    this.width = $TILE*2.5 + $TILE * 5/8;
    this.height = $TILE/2 + $TILE * 5/8;
    this.x = this._resultActorWindow.x + this._resultActorWindow.width/2 - this.width/2;
    this.y = this._resultActorWindow.y + this._resultActorWindow.height/2 - this.height/2;
    this.contents.clear();
    this.changeTextColor(ColorManager.textColor(17));
    this.drawText("LEVEL UP!!",0,0,this.innerWidth,"left");
    this.changeTextColor(ColorManager.normalColor());
};

Window_NoticeLevelUp.prototype.startSkillGet = function() {
    AudioManager.playSe({"name":"FF7 limit learn","volume":90,"pitch":100,"pan":0});
    this.visible = true;
    this.open();
    this.width = $TILE*6.5 + $TILE * 5/8;
    this.height = $TILE + $TILE * 5/8;
    this.x = this._resultActorWindow.x + this._resultActorWindow.width/2 - this.width/2;
    this.y = this._resultActorWindow.y + this._resultActorWindow.height/2 - this.height/2;
    this.contents.clear();
    this.changeTextColor(ColorManager.textColor(17));
    this.drawText("SKILL GET!!",0,0,this.innerWidth,"left");
    this.changeTextColor(ColorManager.normalColor());
    this.drawText(this._mode.name,$TILE * 5/8,this.lineHeight(),this.innerWidth,"left");
};

Window_NoticeLevelUp.prototype.lineHeight = function() {
    return $TILE/2;
};

Window_NoticeLevelUp.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if(this._contents.length > 0 && this._mode == "hide"){
        this._mode = this._contents.shift();
        if(this._mode == "levelup"){
            this.startLevelUp();
        }else{
            this.startSkillGet();           
        }
    }
    if(this._mode != "hide"){
        this._frameCount++;
        if(this._frameCount >= 60){
            this.close();
            this._mode = "hide";
            this._frameCount = 0;
        }
    }
}

Window_NoticeLevelUp.prototype.pushContents = function(content) {
    this._contents.push(content);
}

//-----------------------------------------------------------------------------
// Window_NoticeItemGet
//
// アイテムドロップしたかどうかを知らせるウィンドウ

function Window_NoticeItemGet() {
    this.initialize(...arguments);
}

Window_NoticeItemGet.prototype = Object.create(Window_Base.prototype);
Window_NoticeItemGet.prototype.constructor = Window_NoticeItemGet;

Window_NoticeItemGet.prototype.initialize = function() {
    var rect = new Rectangle(100,100,200,100);
    Window_Base.prototype.initialize.call(this, rect);
    this._frameCount = 0;
    this._mode = "hide";
    this.visible = false;
    this._contents = [];
};

Window_NoticeItemGet.prototype.startItemGet = function() {
    AudioManager.playSe({"name":"FF8 itemget","volume":90,"pitch":100,"pan":0});
    this._mode = this._contents.shift();
    this.visible = true;
    this.open();
    this.width = $TILE*6 + $TILE * 5/8;
    this.height = $TILE/2 + $TILE * 5/8;
    this.x = Graphics.boxWidth*0.75 - this.width/2;
    this.y = Graphics.boxHeight/2 - this.height/2;;
    this.contents.clear();
    this.drawText("Obtained an item!",0,0,this.innerWidth,"left");
};

Window_NoticeItemGet.prototype.startItemNotGet = function() {null;
//    AudioManager.playSe({"name":"FF8 loadready","volume":90,"pitch":100,"pan":0});
//    this._mode = this._contents.shift();
//    this.visible = true;
//    this.open();
//    this.width = $TILE*8 + $TILE * 5/8;
//    this.height = $TILE/2 + $TILE * 5/8;
//    this.x = Graphics.boxWidth/2-this.width/2;
//    this.y = Graphics.boxHeight/2 - this.height/2;
//    this.contents.clear();
//    this.drawText("アイテムはてにはいりませんでした",0,0,this.innerWidth,"left");
};

Window_NoticeItemGet.prototype.lineHeight = function() {
    return $TILE/2;
};

Window_NoticeItemGet.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if(this._contents.length > 0 && this._mode == "hide"){
        this._mode = this._contents.shift();
        if(this._mode == "get"){
            this.startItemGet();
        }else{
            this.startItemNotGet();           
        }
    }
    if(this._mode != "hide"){
        this._frameCount++;
        if(this._frameCount >= 60){
            this.close();
            this._mode = "get";
            this._frameCount = 0;
        }
    }
}

Window_NoticeItemGet.prototype.pushContents = function(content) {
    this._contents.push(content);
}

//-----------------------------------------------------------------------------
// Window_ResultActor
//
// アクター一人毎のリザルト結果を表示する。

function Window_ResultActor() {
    this.initialize(...arguments);
}

Window_ResultActor.prototype = Object.create(Window_Base.prototype);
Window_ResultActor.prototype.constructor = Window_ResultActor;

Window_ResultActor.prototype.initialize = function(actor,rect) {    
    Window_Base.prototype.initialize.call(this, rect);
    this._actor = actor;
    this._frameCount = 0;
    this._countStop = false;
    this.contents.clear();
    this.drawStatusBasic();
    this.updateParam(0);
    this._pvLv = actor.level;
    this._pvJLv = actor.jLevel();
};

Window_ResultActor.prototype.updateParam = function(frame) {
    this.drawStatusParam(frame);
};

Window_ResultActor.prototype.drawStatusBasic = function() {
    const actor = this._actor;
    const crystal = actor.crystal();
    this.changeTextColor(ColorManager.normalColor());
    this.drawText(actor.name(),$TILE*2,$TILE/8,this.innerWidth,$TILE/2);
    this.drawSvActor(actor,-$TILE/4, 0);
    this.changeTextColor(ColorManager.systemColor());
    this.drawText("Lv.",$TILE*1.5,this.lineHeight()+$TILE/8,this.innerWidth,$TILE/2);
    this.drawText("JLv.",$TILE*3.5,this.lineHeight()+$TILE/8,this.innerWidth,$TILE/2+$TILE/4);
    if(crystal){
        this.drawIcon($dataItems[crystal._id+249].iconIndex,$TILE+1.5+$TILE/8,-$TILE/8);
    }
};

Window_ResultActor.prototype.drawSvActor = function(actor,x,y){
    var battlerName = actor.battlerName();
    
    //除外
    if(actor.isStateAffected(34)){
        return;
    }

    //石化
    if(actor.isStateAffected(11)){
        Window_Base.prototype.drawSvActor.call(this, battlerName,51,x,y); 
        
    //戦闘不能
    }else if(actor.isStateAffected(1)){
        Window_Base.prototype.drawSvActor.call(this, battlerName,53,x,y);       
    }else{
        Window_Base.prototype.drawSvActor.call(this, battlerName,10,x,y);
    }
}

Window_ResultActor.prototype.drawStatusParam = function(frame) {
    if(!this._levelUpWindow){
        return;
    }
    const actor = this._actor;
    if(!this._pvLv){
        this._pvLv = actor.level;
    }
    if(!this._pvJLv){
        this._pvJLv = actor.jLevel(actor.currentLicense());
    }
    const mainAp = actor.MainAp();
    const mainJLevel = actor.mainJLevelFromAp(mainAp);
    const getExp = Math.round(BattleManager._rewards.exp * actor.finalExpRate());
    const frameExp = Math.max(1,getExp/179);
    const displayExp = Math.round(Math.min(actor.currentExp()+frameExp*frame,actor.currentExp()+getExp));
    const displayLevel = actor.levelFromExp(displayExp+1);
    const nextExp = actor.expForLevel(displayLevel+1);
    const getAp = BattleManager._rewards.ap * actor.finalApRate();
    const frameAp = Math.max(1,getAp/179);
    const displayAp = Math.round(Math.min(actor.Ap()+frameAp*frame,actor.Ap()+getAp));
    //const totalAp = actor.Ap();
    const displayJLevel = actor.jLevelFromAp(displayAp);
    const nextAp = actor.nextToralApFromJLevel(displayJLevel);
    if(displayLevel > this._pvLv){
        this._levelUpWindow.pushContents("levelup");
    }
    if(displayJLevel > this._pvJLv && actor.currentLicense().learnings.length > 0){
        for(let i=0;i < actor.currentLicense().learnings.length;i++){
            if(actor.currentLicense().learnings[i].level == displayJLevel){
               this._levelUpWindow.pushContents($dataSkills[actor.currentLicense().learnings[i].skillId]);
            }
        }
    }
    if(frame == 1 && actor.mainJLevelFromAp(mainAp+getAp) > mainJLevel 
       && actor.currentClass().learnings.length > 0
       && actor.currentLicenseJobs()){
        this._levelUpWindow.pushContents($dataSkills[actor.currentClass().learnings[actor.mainJLevelFromAp(mainAp+getAp)-1].skillId]);
    }
    
    this._pvLv = displayLevel;
    this._pvJLv = displayJLevel;
    if(getExp <= frameExp*frame && getAp <= frameAp*frame || frame >= 180){
        this._countStop = true;        
    }
    this.changeTextColor(ColorManager.normalColor());
    this.contents.clearRect($TILE*2.25,this.lineHeight()+$TILE/8,$TILE/2+4,$TILE/2);
    this.contents.clearRect($TILE*4.5-2,this.lineHeight()+$TILE/8,$TILE/2+2,$TILE/2);
    this.contents.clearRect($TILE*1.5-2,this.lineHeight()*2+$TILE/8,$TILE*5+2,$TILE/2);
    this.contents.clearRect($TILE*1.5-2,this.lineHeight()*3+$TILE/8,$TILE*5+2,$TILE/2);
   
    if(displayLevel<99){ 
       
        this.changeTextColor(ColorManager.systemColor());
        this.drawText("EXP",$TILE*1.5,this.lineHeight()*2+$TILE/8,this.innerWidth,$TILE/2);
       
        this.changeTextColor(ColorManager.normalColor());
        this.drawText(displayLevel,$TILE*2.25,this.lineHeight()+$TILE/8,$TILE/2,"right");
        this.drawText(displayExp+"/",$TILE*2.5,this.lineHeight()*2+$TILE/8,$TILE*2,"right");
        this.drawText(nextExp,$TILE*4.5,this.lineHeight()*2+$TILE/8,$TILE*2,"right");
    }
   if(!actor.isJobMaster()){
       
        this.changeTextColor(ColorManager.systemColor());
        this.drawText("AP",$TILE*1.5,this.lineHeight()*3+$TILE/8,this.innerWidth,$TILE/2);
        this.changeTextColor(ColorManager.normalColor());
    this.drawText(displayJLevel,$TILE*4.25,this.lineHeight()+$TILE/8,$TILE/2,"right");
       this.drawText(displayAp+"/",$TILE*2.5,this.lineHeight()*3+$TILE/8,$TILE*2,"right");
       this.drawText(nextAp,$TILE*4.5,this.lineHeight()*3+$TILE/8,$TILE*2,"right");
    }else{
        this.drawIcon(57,$TILE*4.5, this.lineHeight()/2+$TILE/8);
   }
};

Window_ResultActor.prototype.lineHeight = function() {
    return this.innerHeight/4;
};

Window_ResultActor.prototype.setLevelUpWindow = function(window){
    this._levelUpWindow = window;
}

//-----------------------------------------------------------------------------
// Window_ResultCrystals
//
// クリスタルのAPの加算状況を表示する

function Window_ResultCrystals() {
    this.initialize(...arguments);
}

Window_ResultCrystals.prototype = Object.create(Window_Command.prototype);
Window_ResultCrystals.prototype.constructor = Window_ResultCrystals;

Window_ResultCrystals.prototype.initialize = function(rect) {    
    Window_Command.prototype.initialize.call(this, rect);
    this._frameCount = 0;
    this._countStop = false;
    this.contents.clear();
    this.refresh();
    this.addCommand("Continue","next",true);
    this.select(0);
    this.drawStatusBasic();
    this.updateParam(0);
};

Window_ResultCrystals.prototype.isCurrentItemEnabled = function() {
    return this.currentData() ? this.currentData().enabled : false;
};

Window_ResultCrystals.prototype.processNext = function() {
    if (this._actor) {
        if (ConfigManager.commandRemember) {
            this._actor.setLastCommandSymbol(this.currentSymbol());
        } else {
            this._actor.setLastCommandSymbol("");
        }
    }
    Window_Command.prototype.processOk.call(this);
    this.activate();
};

Window_ResultCrystals.prototype.drawStatusBasic = function() {
    for(let i=0;i<6;i++){
        if($gameParty.hasItem($dataItems[250+i])){
            const crystal = $gameCrystals._data[i];
            const x = Math.floor(this.innerWidth/2)*Math.floor(i/4);
            const y = this.lineHeight()*(i%4)+$TILE/4-$TILE/2;
            this.drawIcon($dataItems[250+i].iconIndex,x,y);
            if(crystal && crystal.finalApRate() == 2){
                this.drawIcon(62,x,y);                
            }
            if(crystal && crystal.finalApRate() == 4){
                this.drawIcon(63,x,y);                
            }
            this.changeTextColor(ColorManager.systemColor());
            this.drawText("AP",x+$TILE,y+this.lineHeight()/2,$TILE/2);
            this.changeTextColor(ColorManager.normalColor());
        }
    }
    this.changeTextColor(ColorManager.normalColor());
    this.drawText("Continue",Math.floor(this.innerWidth/2)+$TILE/2,this.lineHeight()*2.5-$TILE/8,Math.floor(this.innerWidth/2),"center");
};

Window_ResultCrystals.prototype.updateParam = function(frame) {
    this.drawStatusParam(frame);
};

Window_ResultCrystals.prototype.itemRect = function() {
    const rect = new Rectangle();
    rect.x = this.innerWidth/2+$TILE;
    rect.y = this.innerHeight/2;
    rect.width = this.innerWidth/2-$TILE;
    rect.height = this.innerHeight/2;
    return rect;
};

Window_ResultCrystals.prototype.drawStatusParam = function(frame) {
    const countStops = [];
    
    for(let i=0;i<6;i++){
        if($gameParty.hasItem($dataItems[250+i])){
            const x = Math.floor(this.innerWidth/2)*Math.floor(i/4);
            const y = this.lineHeight()*(i%4)+$TILE/4-$TILE/2;
            
            const crystal = $gameCrystals._data[i];
            const apBase = crystal._ap;
            const getAp = BattleManager._rewards.ap * crystal.finalApRate();
            const frameAp = Math.max(1,getAp/179);
            const apPlus = Math.floor(Math.min(getAp,frameAp*frame));
            
            this.changeTextColor(ColorManager.normalColor());
            this.contents.clearRect(x+$TILE*1.75,y+this.lineHeight()/2,$TILE*1.75,this.lineHeight()+$TILE/8);
            this.drawText(apBase+apPlus,x+$TILE*1.75,y+this.lineHeight()/2,$TILE*1.5,"right");
            if(getAp <= frameAp*frame){
                countStops.push(true);        
            }
        }
    }
    if(countStops.length >= 6 || frame >= 180){
        this._countStop = true;
    }
    this.changeTextColor(ColorManager.normalColor());
}

Window_ResultCrystals.prototype.playOkSound = function() {
    //音は鳴らさない
};

//-----------------------------------------------------------------------------
// Window_DropItem
//
// ドロップアイテムを表示するウィンドウ

function Window_DropItem() {
    this.initialize(...arguments);
}

Window_DropItem.prototype = Object.create(Window_Base.prototype);
Window_DropItem.prototype.constructor = Window_DropItem;

Window_DropItem.prototype.initialize = function(rect) {      
    this.createSubTexts();
    Window_Base.prototype.initialize.call(this, rect);
    
    this.drawSubTexts();
};

Window_DropItem.prototype.drawSubTexts = function() {
    for(let i=0;i<this._subTexts.length;i++){
        this.drawTextEx(this._subTexts[i],0,i*$TILE/2+$TILE/8,this.innerWidth,$TILE/2);
    }
};

Window_DropItem.prototype.createSubTexts = function() {
    this._subTexts = [];
    for(item of BattleManager._rewards.items){
        this._subTexts.push("\\i["+item.iconIndex+"]"+item.name);
    }
};

//-----------------------------------------------------------------------------
// Window_BattleResult
//
// 入手ギル、入手EXP、入手APを表示する1行ウィンドウ

function Window_BattleResult() {
    this.initialize(...arguments);
}

Window_BattleResult.prototype = Object.create(Window_Base.prototype);
Window_BattleResult.prototype.constructor = Window_BattleResult;

Window_BattleResult.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.drawEXPs();
};

Window_BattleResult.prototype.resetFontSettings = function() {
    this.contents.fontFace = "rmmz-numberfont, " + $dataSystem.advanced.fallbackFonts;
    this.contents.fontSize = $TILE*5/8;
    this.resetTextColor();
};

Window_BattleResult.prototype.drawEXPs = function() {
    this.contents.clear();
    const ap = String(BattleManager._rewards.ap);
    const exp = String(BattleManager._rewards.exp);
    const gold = String(BattleManager._rewards.gold);
    const text = " GET: Gil "+gold +", EXP " + exp + ", AP " + ap;
    this.changeTextColor(ColorManager.normalColor());
    this.drawText(text,0,$TILE/8,this.innerWidth,this.innerHeight);
};

Window_BattleResult.prototype.drawOtakara = function() {
    this.contents.clear();
    this.drawText("GET:Treasure",0,$TILE/8,this.innerWidth,this.innerHeight);
};

//-----------------------------------------------------------------------------
// BattleManager
//
// バトル終了時の処理を変更

BattleManager.processVictory = function() {
    
	this.pushDendoList();
    $gameParty.removeBattleStates();
    if(!$gameSwitches.value(12)){ //勝利MEを流さない場合、勝利モーションを行わない
        $gameParty.performVictory();
        this.playVictoryMe();
    }
    //this.replayBgmAndBgs();
    this.makeRewards();
    this.displayVictoryMessage();
    //this.displayRewards();
    //this.gainRewards();
    this.endBattle(0);
};

BattleManager.pushDendoList = function(){
	if($gameSwitches.value(16)){ //殿堂バトルスイッチがONなら
		$gameParty.pushDendoList($gameTroop.troopId()); //殿堂に登録
	}
    $gameSwitches.setValue(16,false); //殿堂入りスイッチをオフ
}

BattleManager.updateBattleEnd = function() {
    if (this.isBattleTest()) {
        AudioManager.stopBgm();
        SceneManager.exit();
    } else if (!this._escaped && $gameParty.isAllDead()) {
        if (this._canLose) {
            //BattleManager.cancelOutMessageWindow();
            SceneManager.pop();
        } else {
            $gameSwitches.setValue(7,true); //全滅スイッチ
            SceneManager.pop();
            $gameParty.removeVictoryStates();
            $gamePlayer.setTransparent(true);
            if(!$gameParty.hasItem(251)){
                $gameSwitches.setValue(44,true);
                $gamePlayer.reserveTransfer(4, 8, 7, 2, 0);
            }else{
                $gamePlayer.reserveTransfer(20, 0, 0, 2, 0);
            }
            $gameParty.loseGold(Math.ceil($gameParty.gold()/2));
            $gameParty.loseStealedItems(this._stealedItems);
            $gameParty.loseCursedItems();
        }
    } else {
        if(this._escaped){
            //BattleManager.cancelOutMessageWindow();
            SceneManager.pop();
            $gameParty.removeVictoryStates();
        }else{
            SceneManager.goto(Scene_Result);
            //BattleManager.cancelOutMessageWindow();
        }
    }
    this._phase = "";
};

Game_Actor.prototype.shouldDisplayLevelUp = function() {
    return false;
};


Game_Troop.prototype.expTotal = function() {
    var total = this.deadMembers().reduce((r, enemy) => r + enemy.exp(), 0);
    for(enemy of this.members()){
        if(enemy.isStateAffected(11)||enemy.isStateAffected(34)){ //石化・除外
            total += enemy.exp()
        }
    }
    return total;
};

Game_Troop.prototype.makeDropItems = function() {
    const members = this.deadMembers();
    for(enemy of this.members()){
        if(enemy.isStateAffected(11)||enemy.isStateAffected(34)){ //石化・除外
            members.push(enemy);
        }
    }
    return members.reduce((r, enemy) => r.concat(enemy.makeDropItems()), []);
};

Game_Troop.prototype.goldTotal = function() {
    const members = this.deadMembers();
    var total = members.reduce((r, enemy) => r + enemy.gold(), 0);
    for(enemy of this.members()){
        if(enemy.isStateAffected(11)||enemy.isStateAffected(34)){ //石化・除外
            total += enemy.gold()
        }
    }
    return total * this.goldRate();
};

Game_Troop.prototype.beatedNum = function() {
    var value = 0
    for(enemy of this.members()){
        if(enemy.isDead||enemy.isStateAffected(11)||enemy.isStateAffected(34)){ //石化・除外
            value++;
        }
    }
    return value;
};