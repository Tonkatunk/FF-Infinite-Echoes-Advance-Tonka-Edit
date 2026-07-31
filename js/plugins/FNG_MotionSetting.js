//=============================================================================
// FNG_MotionSetting.js
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc NRP_MotionSetting.jsを低解像度用にカスタムします
 * @author finga
 * @url
 *
 * @help NRP_MotionSetting.jsを低解像度用にカスタムします。
 * 
 * ・前進モーションの座標を調整します。
 * ・既存のパターンの挙動でないモーションを定義します
 * ・ブロッキングアニメーションもここで定義します
 */

const _Sprite_Actor_initMembers = Sprite_Actor.prototype.initMembers;
Sprite_Actor.prototype.initMembers = function() {
    _Sprite_Actor_initMembers.apply(this,arguments);
    this.createBlockingSprite();
    this.createWeaponSprite2(this._weaponSprite);
};

Sprite_Actor.MOTIONS = {
    walk: { index: 0, loop: true },
    wait: { index: 1, loop: true },
    chant: { index: 2, loop: true },
    guard: { index: 3, loop: true },
    damage: { index: 4, loop: false },
    evade: { index: 5, loop: false },
    thrust: { index: 6, loop: false },
    swing: { index: 7, loop: false },
    missile: { index: 8, loop: false },
    skill: { index: 9, loop: false },
    spell: { index: 10, loop: false },
    item: { index: 11, loop: false },
    escape: { index: 12, loop: true },
    victory: { index: 13, loop: true },
    dying: { index: 14, loop: true },
    abnormal: { index: 15, loop: true },
    sleep: { index: 16, loop: true },
    dead: { index: 17, loop: true },
    blockR: { index: 18, loop: false },
    blockL: { index: 19, loop: false },
    thrustL: { index: 20, loop: false },
    swingL: { index: 21, loop: false },
    mant:{ index: 22, loop: false },
    handsup: { index: 23, loop: true },
    bow: { index: 24, loop: false },
    confuse: { index: 25, loop: true },
    thrustkick: { index: 26, loop: false },
    dancespin: { index: 27, loop: false },
    dancing: { index: 28, loop: true },
    claymore: { index: 29, loop: false },
    fastpunch: { index: 71, loop: true },
    tackle: { index: 72, loop: true },
    upper: { index: 73, loop: true },
    yareyare: { index: 74, loop: true },
    throw: { index: 75, loop: true },
    accommodate: { index: 76, loop: true },
    spinfast: { index: 77, loop: true },
    spinslow: { index: 78, loop: true },
    mugentobu: { index: 79, loop: true },
    kick: { index: 80, loop: true },
    pray: { index: 81, loop: true },
    portolan : { index: 82,loop: true },//宿命のポルトラン
    upRightArm : { index: 83,loop: true },//右手を上げる
    seisatsu : { index: 84,loop: false },//生殺与奪ダンス
    spinslowmore : { index: 85,loop: false },//もっと遅く回転
    //武器アクション 30~70
    swingW: { index: 30, loop: false }, //振る
    swingbothW: { index: 31, loop: false }, //両手で振る
    thrustW: { index: 32, loop: false }, //突き刺す
    swingupW: { index: 33, loop: false }, //振り上げる
    swingdownW: { index: 34, loop: false }, //振り下ろす
    raiseW: { index: 35, loop: true }, //掲げる
    spinWFR: { index: 36, loop: true }, //右手前で回す
    spinWUR: { index: 37, loop: true }, //右手上で回す
    spinWBR: { index: 38, loop: true }, //右手後ろで回す
    spinWFL: { index: 39, loop: true }, //左手前で回す
    spinWUL: { index: 40, loop: true }, //左手上で回す
    spinWBL: { index: 41, loop: true }, //左手後ろで回す
    setupW: { index: 42, loop: true }, //構える
    standW: { index: 43, loop: true }, //突き立てる
    guardW: { index: 44, loop: true }, //防ぐ
    woundupW: { index: 45, loop: true }, //振りかぶる
    woundupbothW: { index: 46, loop: true }, //両手で振りかぶる
    swingWquick: { index: 47, loop: false }, //素早く振る
    onion: { index: 48, loop: false },//オニオン右
    onionL: { index: 49, loop: false },//オニオン左
    readyBow: { index: 50, loop: true },//弓を構える
    shotArrow: { index: 51, loop: true },//矢を放つ
    swingSword: { index: 52, loop: false },//剣を振る
    takeSword: { index: 53, loop: false },//剣を向ける
    swingWhip: { index: 54, loop: false },//ムチを振る
    swingbothWquick: { index: 55, loop: false },//両手で素早く振る
    swingUpSword: { index: 56, loop: false },//剣を振りあげる
    spinWithSword: { index: 57, loop: false },//剣をもって１回転
    swingUpSwordMore: { index: 58, loop: false },//剣を大きく振りあげる
    zantetsu: { index: 59, loop: false },//刀を片手に目をつむる
    spinningEdge :  { index: 60, loop: true },//剣をもって回転
    tamanegiri1 :  { index: 61, loop: false },//鬼怨魂音斬構え
    tamanegiri2 :  { index: 62, loop: false },//鬼怨魂音斬放つ
    chargeOrder :  { index: 63, loop: false },//突撃指令
    jumpSlash :  { index: 64, loop: false },//ジャンプ斬り
    upperSlash :  { index: 65, loop: false },//アッパー斬り
    stubClaymore :  { index: 66, loop: false },//両手剣を突き刺す
    upperSlashClaymore :  { index: 67, loop: false },//アッパー斬り両手剣
    swingAroundClaymore : { index: 68, loop: false },//両手剣振り回し
    woundUpClaymore :  { index: 69, loop: false },//両手剣振り上げ
    upperW :  { index: 70, loop: true },//武器を片手で掲げる
    pointUpClaymore :  { index: 200, loop: false },//両手剣を胸の前で立てる
    swingClaymore :  { index: 201, loop: false },//両手剣を振る
    nagi :  { index: 202, loop: false },//薙ぎ払い
    setupSpireDive : {index:203,loop:true},//POD飛び込み
    gunshotR: { index: 204, loop: false },//銃撃右
    gunshotL: { index: 205, loop: false },//銃撃左
    gunshotRmiss: { index: 206, loop: false },//銃撃右ミス
    gunshotLmiss: { index: 207, loop: false },//銃撃左ミス
    setupSword: { index: 208, loop: false },//剣を構える
    raiseSword: { index: 209, loop: true }, //剣を掲げる
    smashUpper: { index: 210, loop: true }, //スマッシュアッパー
    strongSlash: { index: 211, loop: true }, //強斬り
    strongSlashReady: { index: 212, loop: true }, //強斬り構え
    swingDownSword: { index: 213, loop: false }, //剣を振り下ろす
    swingGunblade :  { index: 214, loop: false },//ガンブレードを振る
    readyGunblade :  { index: 215, loop: false },//ガンブレードを構える
    woundUpGunblade :  { index: 216, loop: false },//ガンブレードを振りかぶる
    standKatana: { index: 217, loop: true }, //刀を突きたてる
    swingBothKatana: { index: 218, loop: false }, //両手で刀を振る
    woundUpBothKatana :  { index: 219, loop: false },//刀を両手で振りかぶる
    chargeOrderGunblade :  { index: 220, loop: false },//突撃指令の動きをガンブレードで
    spinningGunblade :  { index: 221, loop: false },//ガンブレードでスピン
    raiseGunblade: { index: 222, loop: true }, //ガンブレードを掲げる
    stubGunblade :  { index: 223, loop: false },//ガンブレードを突き刺す
    tackleWithGunblade : {index:224,loop: false},//ガンブレードを片手にタックル
    swingDownGunblade: { index: 225, loop: false }, //ガンブレードを振り下ろす
    
};

Sprite_Actor.prototype.isLefthandWeaponMotion = function(motionId){
    const leftMotions = [39,40,41,49,203,205];
    //console.log("isLefthandWeaponMotion:",motionId,leftMotions.includes(motionId));
    return leftMotions.includes(motionId);
};

//指定されていない武器タイプを装備していない場合はデフォルトの武器タイプを返す
Sprite_Weapon.prototype.forcedWeaponType = function(motionIndex,actor) {
    let weapons = actor.weapons();
    let weapon;
    if(weapons.length == 0){
        weapon = null;
    }else{
        weapon = weapons[0];
    }
    let wtypeId = 0;
    let types = [];
    if(weapon){
        wtypeId = weapon.wtypeId;
    }
    switch(motionIndex){
        case 48: //onion
            types = [1,2,3,6,20];
            break;
        case 49: //onionL
            types = [1,2,3,6,20];
            break;
        case 50: //readyBow
            types = [9];
            break;
        case 51: //shotArrow
            types = [9];
            break;
        case 52: //swingSword
            types = [1,2,3,6,20];
            break;
        case 53: //takeSword
            types = [1,2,3,6,20];
            break;
        case 54: //swingWhip
            types = [10];
            break;
        case 56: //swingupSword
            types = [1,2,3,6,20];
            break;
        case 60: //spinningEdge
            types = [1,2,3,4,5,6,7,8,11,12,14,15,16,17,20];
            break;
        case 61: //tamanegiri1
            types = [1,2,3,6,20];
            break;
        case 62: //tamanegiri2
            types = [1,2,3,6,20];
            break;
        case 63: //chargeOrder
            types = [1,2,3,6,20];
            break;
        case 64: //jumpSlash
            types = [1,2,3,4,5,6,7,8,11,12,16,17];
            break;
        case 65: //upperSlash
            types = [1,2,3,4,5,6,7,8,11,12,16,17];
            break;
        case 66: //stubClaymore
            types = [4,1,2,3,5,6,7,8,11,12,16,17];
            break;
        case 67: //upperSlashClaymore
            types = [4,1,2,3,5,6,7,8,11,12,16,17];
            break;
        case 68: //swingAroundClaymore
            types = [4,1,2,3,5,6,7,8,11,12,16,17];
            break;
        case 69: //woundUpClaymore
            types = [4,1,2,3,5,6,7,8,11,12,16,17];
            break;
        case 200: //pointUpClaymore
            types = [4,1,2,3,5,6,7,8,11,12,16,17];
            break;
        case 201: //swingClaymore
            types = [4,1,2,3,5,6,7,8,11,12,16,17,20];
            break;
        case 202: //nagi
            types = [11,1,2,3,4,5,6,12,14,15,16,17,20];
            break;
        case 203: //setupSpireDive
            types = [12,11];
            break;
        case 204: //gunshotR
            types = [22];
            break;
        case 205: //gunshotL
            types = [22];
            break;
        case 206: //gunshotRmiss
            types = [22];
            break;
        case 207: //gunshotLmiss
            types = [22];
            break;
        case 208: //setupSword
            types = [1,2,3,6,20];
            break;
        case 209: //raiseSword
            types = [1,2,3,4,5,6,16,20];
            break;
        case 210: //smashUpper
            types = [5,1,2,3,4,6,11,12,14,15,16,17,20];
            break;
        case 211: //strongSlash
            types = [1,2,3,4,5,6,16,17,20];
            break;
        case 212: //strongSlashReady
            types = [1,2,3,4,5,6,16,17,20];
            break;
        case 213: //swingDownSword
            types = [1,2,3,4,5,6,16,17,20];
            break;
        case 214: //swingGunblade
            types = [5,1,2,3,4,6,7,8,11,12,16,17,20];
            break;
        case 215: //readyGunblade
            types = [5,1,2,3,4,6,7,8,11,12,16,17,20];
            break;
        case 216: //woundUpGunblade
            types = [5,1,2,3,4,6,7,8,11,12,16,17,20];
            break;
        case 217: //standKatana
            types = [6,1,2,3,4,5,11,12,14,15,16,17,20];
            break;
        case 218: //swingBothKatana
            types = [6,1,2,3,4,5,7,8,11,12,16,17,20];
            break;
        case 219: //woundUpKatana
            types = [6,1,2,3,4,5,7,8,11,12,16,17,20];
            break;
        case 220: //chargeOrderGunblade
            types = [5,1,2,3,4,6,7,8,11,12,16,17,20];
            break;
        case 221: //spinningGunblade
            types = [5,1,2,3,4,6,7,8,11,12,16,17,20];
            break;
        case 222: //raiseGunblade
            types = [5,1,2,3,4,6,7,8,11,12,16,17,20];
            break;
        case 223: //stubGunblade
            types = [5,1,2,3,4,6,7,8,11,12,16,17,20];
            break;
        case 224: // tackleWithGunblade
            types = [5,1,2,3,4,6,7,8,11,12,16,17,20];
            break;
        case 225: // swingDownGunblade
            types = [5,1,2,3,4,6,7,8,11,12,16,17,20];
            break;
    }
    if(!types.includes(wtypeId)&&types.length>0){
        return types[0];
    }
    return 0;
};

//カスタムモーションをここで定義する
//2次元配列で渡す。1要素目がキャラグラインデックス、2要素目が表示フレーム数
Sprite_Actor.prototype.customMotion = function(index) {
    if(index == 3){ //guard
        return [[27,60]];
    }
    if(index == 8){ //missile
        return [[21,36]];
    }
    if(index == 15){ //abnormal
        return [[51,60]];
    }
    if(index == 16){ //sleep
        return [[52,60]];
    }
    if(index == 17){ //dead
        return [[53,60]];
    }
    if(index == 18){ //blockR
        return [[13,27]];
    }
    if(index == 19){ //blockL
        return [[40,27]];
    }
    if(index == 20){ //thrustL
        return [[30,4],[31,120]];
    }
    if(index == 22){ //mant
        return [[39,16],[40,9]];
    }
    if(index == 23){ //handsup
        return [[49,9]];
    }
    if(index == 25){ //confuse
        return [[43,8],[7,8],[34,8],[1,8]];
    }
    if(index == 26){ //thrustkick
        return [[33,3],[8,3],[44,3],[45,16]];
    }
    if(index == 27){ //dancespin
        return [[43,3],[8,3],[34,3],[28,16]];
    }
    if(index == 28){ //dancing
        return [[33,3],[8,3],[44,3],[45,16],[33,3],[8,3],[44,3],[45,16],[15,8],[1,8],[15,8],[1,8]];
    }
    if(index == 29){ //claymore
        return [[49,9],[22,16]];
    }
    if(index == 71){ //fastpunch
        return [[4,20]];
    }
    if(index == 72||index == 224){ //tackle tackleWithGunblade
        return [[29,20]];
    }
    if(index == 73){ //upper
        return [[23,20]];
    }
    if(index == 74){ //yareyare
        return [[15,20]];
    }
    if(index == 75){ //throw
        return [[5,20]];
    }
    if(index == 76){ //accommodate
        return [[22,60]];
    }
    if(index == 77){ //spinfast
        return [[1,2],[34,2],[7,2],[43,2],[1,2],[34,2],[7,2],[43,2],[1,2],[34,2],[7,2],[43,2],[1,2],[34,2],[7,2],[43,2],[1,2],[34,2],[7,2],[43,2],[1,2],[34,2],[7,2],[43,2],[1,2],[34,2],[7,2],[43,2],[1,2],[34,2],[7,2],[43,2]];
    }
    if(index == 78){ //spinslow
        return [[1,4],[34,4],[7,4],[43,4],[1,4],[34,4],[7,4],[43,4],[1,4],[34,4],[7,4],[43,4],[1,4],[34,4],[7,4],[43,4],[1,4],[34,4],[7,4],[43,4],[1,4],[34,4],[7,4],[43,4],[1,4],[34,4],[7,4],[43,4],[1,4],[34,4],[7,4],[43,4]];
    }
    if(index == 79){ //mugentobu
        return [[4,2],[21,2], [42,2],[44,2],[42,2],[44,2], [6,2],[8,2],[6,2],[8,2], [31,2],[33,2],[31,2],[33,2], [4,2],[21,2],[4,2],[21,2], [42,2],[44,2],[42,2],[44,2], [6,2],[8,2],[6,2],[8,2], [31,2],[33,2],[31,2],[33,2], [4,2],[21,2],[4,2],[21,2], [42,2],[44,2],[42,2],[44,2], [6,2],[8,2],[6,2],[8,2], [31,2],[33,2],[31,2],[33,2], [4,2],[21,2],[4,2],[21,2], [42,2],[44,2],[42,2],[44,2], [6,2],[8,2],[6,2],[8,2], [31,2],[33,2],[31,2],[33,2], [4,2],[21,2]];
    }
    if(index == 80){ //kick
        return [[45,180]];
    }
    if(index == 81){ //pray
        return [[19,180]];
    }
    if(index == 82){ //portolan
        return [[4,14],[13,14],[4,14],[13,14],[4,14],[13,14],[4,14],[13,14],[4,14],[13,14]];
    }
    if(index == 83){ //upRightArm
        return [[3,60]];
    }
    if(index == 84){ //seisatsu
        return [[35,6],[6,6],[42,6],[0,24],[35,6],[0,6],[42,6],[6,24],[10,3],[48,60]];
    }
    if(index == 85){ //spinslowmore
        return [[1,6],[34,6],[7,6],[43,6],[1,6],[34,6],[7,6],[43,6],[1,6],[34,6],[7,6],[43,6],[1,6],[34,6],[7,6],[43,6],[1,6],[34,6],[7,6],[43,6],[1,6],[34,6],[7,6],[43,6],[1,6],[34,6],[7,6],[43,6],[1,6],[34,6],[7,6],[43,6]];
    }
    //武器アクション
    if(index == 30||index == 52||index == 54){ //swingW swingSword swingWhip
        return [[12,9],[13,16]];
    }
    if(index == 31){ //swingbothW
        return [[49,9],[22,32]];
    }
    if(index == 32){ //thrustW
        return [[3,9],[4,60]];
    }
    if(index == 33){ //swingupW
        return [[13,9],[12,16]];
    }
    if(index == 34||index == 213){ //swingdownW swingdownsword
        return [[12,9],[13,16]];
    }
    if(index == 35||index == 209||index == 222){ //raiseW raiseSword raiseGunblade
        return [[15,120]];
    }
    if(index == 36){ //spinWFR
        return [[4,60]];
    }
    if(index == 37){ //spinWUR
        return [[12,60]];
    }
    if(index == 38){ //spinWBR
        return [[3,60]];
    }
    if(index == 39){ //spinWFL
        return [[21,60]];
    }
    if(index == 40){ //spinWUL
        return [[39,60]];
    }
    if(index == 41){ //spinWBL
        return [[13,60]];
    }
    if(index == 42||index == 208){ //setupW setupSword
        return [[21,60]];
    }
    if(index == 43||index == 217){ //standW standKatana
        return [[24,60]];
    }
    if(index == 44){ //guardW
        return [[4,60]];
    }
    if(index == 45){ //woundupW
        return [[12,60]];
    }
    if(index == 46||index == 69){ //woundupbothW woundUpClaymore
        return [[48,120]];
    }
    if(index == 47){ //swingWquick
        return [[12,4],[13,16]];
    }
    if(index == 48){ //onionsw
        return [[12,4],[13,4],[12,4],[13,4],[12,4],[13,4],[12,4],[13,4],[12,4],[13,4],[12,4],[13,4],[12,4],[13,4],[12,4],[13,16]];
    }
    if(index == 49){ //onionL
        return [[39,4],[40,4],[39,4],[40,4],[39,4],[40,4],[39,4],[40,4],[39,4],[40,4],[39,4],[40,4],[39,4],[40,4],[39,4],[40,16]];
    }
    if(index == 50||index == 51){ //readyBow shotArrow
        return [[21,60]];
    }
    if(index == 53){ //takeSword
        return [[13,60]];
    }
    if(index == 55){ //swingbothWquick
        return [[49,4],[22,32]];
    }
    if(index == 56||index == 202){ //swingupSword nagi
        return [[13,9],[12,16]];
    }
    if(index == 57){ //spinWithSword
        return [[12,4],[13,6],[35,2],[6,6],[15,6],[13,10]];
    }
    if(index == 58){ //swingUpSwordMore
        return [[13,6],[12,60]];
    }
    if(index == 59){ //zantetsu
        return [[52,60]];
    }
    if(index == 60||index == 221){ //spinningEdge
        return [[14,2],[35,2],[6,2],[42,2],[14,2],[35,2],[6,2],[42,2],[14,2],[35,2],[6,2],[42,2],[14,2],[35,2],[6,2],[42,2],[14,2],[35,2],[6,2],[42,2],[14,2],[35,2],[6,2],[42,2],[14,2],[35,2],[6,2],[42,2],[14,2],[35,2]];
    }
    if(index == 61){ //tamanegiri1
        return [[3,10]];
    }
    if(index == 62){ //tamanegiri2
        return [[4,20]];
    }
    if(index == 63||index == 220){ //chargeOrder chargeOrderGunblade
        return [[12,4],[4,60]];
    }
    if(index == 64){ //jumpSlash
        return [[23,15],[13,30]];
    }
    if(index == 65||index == 67||index == 70){ //upperSlash upperSlashClaymore upperW
        return [[23,120]];
    }
    if(index == 66||index == 223){ //stubClaymore stubGunblade
        return [[22,120]];
    }
    if(index == 68){ //swingAroundClaymore
        return [[23,120]];
    }
    if(index == 200){ //pointUpClaymore
        return [[21,300]];
    }
    if(index == 201||index == 214||index == 218||index == 225){ //swingClaymore swingGunblade swingBothKatana swingDownGunblade
        return [[49,9],[22,32]];
    }
    if(index == 203){ //setupSpireDive
        return [[29,120]];
    }
    if(index == 204||index == 206){ //gunshotR
        return [[4,32]];
    }
    if(index == 205||index == 207){ //gunshotL
        return [[21,32]];
    }
    if(index == 210){ //smashUpper
        return [[40,3],[30,3],[23,30]];
    }
    if(index == 211){ //strongSlash
        return [[48,5],[22,30]];
    }
    if(index == 212){ //strongSlashReady
        return [[3,30]];
    }
    if(index == 215){ //readyGunblade
        return [[21,60]];
    }
    if(index == 216||index == 219){ //woundUpSwordMore
        return [[48,120]];
    }
};

Sprite_Battler.prototype.isCustomMotion = function(index){
    if(index>=200){
        return true;
    }
    const cMotionIndex = [3,8,15,16,17,18,19,20,22,23,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85];
    return cMotionIndex.includes(index);
}

Sprite_Actor.prototype.createBlockingSprite = function() {
    this._blockingSprite = new Sprite_Blocking();
    this.addChild(this._blockingSprite);
};

/**
 * ●一歩前進
 */
Sprite_Actor.prototype.stepForward = function() {
    var pStepForward = 12;
    
    // ホームポジションから外れている場合は処理しない
    if (!this.inHomePosition()) {
        return;
    }
    //this.startMotion('walk');
    this.startMove(-$TILE, 0, pStepForward);
};

const _sprite_Actor_updateMotionCount = Sprite_Actor.prototype.updateMotionCount;
Sprite_Actor.prototype.updateMotionCount = function() {
    if(this._motion && this.isCustomMotion(this._motion.index)){
        if (this._motionCount < this.customMotionLength(this._motion.index)){
            //if(this._motion.index == 25){
               //console.log("plus motionCount confuseMotion count:",this._motionCount);
            //}
            this._motionCount++;
        }else{
            this.refreshMotion();
            this._motionCount = 0;
        }
    }else{
        _sprite_Actor_updateMotionCount.apply(this,arguments);
    }
};

const _sprite_Actor_refreshMotion = Sprite_Actor.prototype.refreshMotion;
Sprite_Actor.prototype.refreshMotion = function() {
    const actor = this._actor;
    if (actor) {
        const stateMotion = actor.stateMotionIndex();
        //石化は最優先で表示
        if (actor.isStateAffected(11)) {
            this.startMotion("abnormal");
            return;
        } else if (stateMotion === 3) {
            this.startMotion("dead");
            return;
        } else if (actor.damagePosing()) {
            this.startMotion("damage");
            return;
        } else if (stateMotion === 2) {
            this.startMotion("sleep");
            return;
        } else if (actor.coverPerforming()) {
            this.startMotion("guard");
            return;
        } else if (BattleManager._escaping) {
            this.startMotion("escape");
            return;
        } else if (actor.isStateAffected(8)) {
            this.startMotion("confuse");
            return;
        } else if (actor.isStateAffected(59)) {
            this.startMotion("chant");
            return;
        } else if (actor.isStateAffected(60)) {
            this.startMotion("dancing");
            return;
        } else if (actor.isStateAffected(62)) {
            this.startMotion("damage");
            return;
        }
    }
    _sprite_Actor_refreshMotion.apply(this,arguments);
};

const _sprite_Actor_updateMotion = Sprite_Actor.prototype.updateMotion;
Sprite_Actor.prototype.updateMotion = function() {
    const actor = this._actor;
    if (actor) {
        this.updateColorTone();
        // 小人状態リクエストの時小さくする
        if (actor.toShrink()){
            actor.resetRequestShrink();
            this.scale.x = 0.5;
            this.scale.y = 0.5;
        }
        // 小人状態解除リクエストの時元に戻す
        if (actor.recoverShrink()){
            actor.resetRequestRecoverShrink();
            this.scale.x = 1;
            this.scale.y = 1;
        }
        // 透明状態の時薄くする
        if (actor.isStateAffected(46)){
            this._mainSprite.opacity = 64;
        // 除外・ジャンプ・隠れる状態・エフェクト消去は非表示
        }else if (actor.isStateAffected(34) || actor.isStateAffected(21)||
            actor.isStateAffected(23)||actor.isPerformingHide()){
            this._mainSprite.opacity = 0;
            this._shadowSprite.visible = false;
        }else{
            this._mainSprite.opacity = 255;
            this._shadowSprite.visible = true;
        }
        this._mainSprite.opacity = this._mainSprite.opacity * (this.updateOpacity()/100);
    }
    _sprite_Actor_updateMotion.apply(this,arguments);
};

Game_BattlerBase.prototype.performHide = function(){
    this._performingHide = true;
}

Game_BattlerBase.prototype.endPerformHide = function(){
    this._performingHide = false;
}

Game_BattlerBase.prototype.isPerformingHide = function(){
    return this._performingHide;
}

BattleManager.performHideWithoutSubject = function(){
    subject = this._subject;
    for(actor of $gameParty.members()){
        if(actor!=subject){
            actor.performHide();
        }
    }
    for(enemy of $gameTroop.members()){
        if(enemy!=subject){
            enemy.performHide();
        }
    }
}

BattleManager.performHideAllActorsWithoutSubject = function(){
    subject = this._subject;
    for(actor of $gameParty.members()){
        if(actor!=subject){
            actor.performHide();
        }
    }
}

BattleManager.endPerformHideAll = function(){
    subject = this._subject;
    for(actor of $gameParty.members()){
        if(actor!=subject){
            actor.endPerformHide();
        }
    }
    for(enemy of $gameTroop.members()){
        if(enemy!=subject){
            enemy.endPerformHide();
        }
    }
}

Sprite_Weapon.prototype.setActorScale = function(xscale,yscale){
    this._actorScaleX = xscale;
    this._actorScaleX = yscale;
};

Sprite_Actor.prototype.updateOpacity  = function(actor){
    if(this._summonStart){
        const opacityStep = this._summonFrame > 40 ? 20-(this._summonFrame-40) : 20;
        return Math.ceil(100/20 * opacityStep);
    }else if(this._summonEnd){
        const opacityStep = this._summonFrame < 40 ? this._summonFrame : 40;
        return Math.ceil(100/20 * opacityStep);
    }
    return 100;
}

//バグの対処療法としてオーバーライド
Sprite_Actor.prototype.startMotion = function(motionType) {
    const newMotion = Sprite_Actor.MOTIONS[motionType];
    this._weaponSprite._allAnimationCount = 0;
    if (this._motion !== newMotion) {
        //console.log(newMotion);
        this._motion = newMotion;
        //何故かitemモーションのデータではなくアイテムデータが
        //motionTypeで投げられてくるので対処
        if(!newMotion){
            this._motion = { index: 11, loop: false };
        }
        if(this.isWeaponMotion(this._motion.index)){
            this._weaponMotionRequest = true;
            if(this.isLefthandWeaponMotion(this._motion.index)){
                this._weaponSprite._motionIndex = 0;
            }else{
                this._weaponSprite2._motionIndex = 0;
            }
        }else{
            this._weaponSprite._motionIndex = 0;
            this._weaponSprite2._motionIndex = 0;
        }
        this._motionCount = 0;
        this._pattern = 0;
    }
};

Sprite_Actor.prototype.isWeaponMotion = function(motionIndex) {
    if(this._motion.index >= 30 && this._motion.index <= 70){
        return true;
    }
    if(this._motion.index >= 200 && this._motion.index < 300){
        return true;
    }
    return false;
}

const _sprite_Enemy_updateFrame2 = Sprite_Enemy.prototype.updateFrame;
Sprite_Enemy.prototype.updateFrame = function() {
    if(this._enemy){
        this.updateColorTone();
        // 小人状態の時小さくする
        if (this._enemy.isStateAffected(35)){
            this.scale.x = 0.5;
            this.scale.y = 0.5;
        }else{
            this.scale.x = 1;
            this.scale.y = 1;
        }
    }
    if (this._effectType === "bossCollapse") {
        if(this._effectDuration/3<=this.bitmap.height){
            this.setFrame(0, 0, this.bitmap.width, this._effectDuration/3);
        }
    } else if (this._effectType === "zantetsu") {
        this.updateZantetsu()
    } else if (this._effectType === "collapse") {
        this.updateCollapse()
    }else{
        
        // 透明状態の時薄くする
        if (this._enemy.isStateAffected(46)){
            this.opacity = 64;
        // 除外・ジャンプ・隠れる状態・エフェクト消去は非表示
        }else if (this._enemy.isDead()||this._enemy.isStateAffected(34) || this._enemy.isStateAffected(21)|| this._enemy.isStateAffected(23)||this._enemy.isPerformingHide()||this._enemy.isHidden()){
            this.opacity = 0;
            this._shadowSprite.visible = false;
        }else{
            this.opacity = 255;
            this._shadowSprite.visible = true;
        }
        _sprite_Enemy_updateFrame2.apply(this,arguments);
    }
};

Sprite_Actor.prototype.updateColorTone = function(){
    const actor = this._actor;
    const cFrame = this.getCFrame();
    const cStates = this.getCStates();
    var r = 0; var g = 0; var b = 0; var a = 0;
    // ゾンビ状態の時ゾンビっぽい色にする
    if (actor.isStateAffected(36)){
        r -= 150; g -= 100; b -= 180; a += 90;
    }
    // バーサク状態の時赤っぽい色にする
    if (actor.isStateAffected(7)){
        r += 75; g -= 50; b -= 90; a += 90;
    }
    // ストップ状態の時水色っぽい色にする
    if (actor.isStateAffected(37)){
        r += 0; g -= 0; b += 172; a += 180;
    }
    if(cStates.length > 0){
        const pct = this.getPColorTone(cStates[0]);
        pr = pct[0]; pg = pct[1]; pb = pct[2]; pa = pct[3]; 
        r += pr/15*(15-Math.abs(cFrame-15));
        g += pg/15*(15-Math.abs(cFrame-15));
        b += pb/15*(15-Math.abs(cFrame-15));
        a += pa/15*(15-Math.abs(cFrame-15));
    }
    this.updateCStates();
    this.updateSummonEffect(actor);
    r += this.getSummonColorTone();
    g += this.getSummonColorTone();
    b += this.getSummonColorTone();
    a += this.getSummonColorTone();
    this.updateCFrame();
    this._mainSprite.setColorTone([r,g,b,a]);    
}

Sprite_Actor.prototype.getSummonColorTone = function(){
    if(this._summonStart){
        const colorStep = this._summonFrame > 40 ? 40 : this._summonFrame;
        return 255/40 * colorStep;
    }else if(this._summonEnd){
        const colorStep = this._summonFrame < 20 ? 40 : 40 - (this._summonFrame-20);
        return 255/40 * colorStep;
    }
    return 0;
}

Sprite_Enemy.prototype.updateColorTone = function(){
    const enemy = this._enemy;
    const cFrame = this.getCFrame();
    const cStates = this.getCStates();
    var r = 0; var g = 0; var b = 0; var a = 0;
    // ゾンビ状態の時ゾンビっぽい色にする
    if (enemy.isStateAffected(36) && !enemy.isUndead()){
        r -= 150; g -= 100; b -= 180; a += 90;
    }
    // バーサク状態の時赤っぽい色にする
    if (enemy.isStateAffected(7)){
        r += 75; g -= 50; b -= 90; a += 90;
    }
    // ストップ状態の時水色っぽい色にする
    if (enemy.isStateAffected(37)){
        r += 0; g -= 0; b += 172; a += 180;
    }
    if(cStates.length > 0){
        const pct = this.getPColorTone(cStates[0]);
        pr = pct[0]; pg = pct[1]; pb = pct[2]; pa = pct[3]; 
        r += pr/15*(15-Math.abs(cFrame-15));
        g += pg/15*(15-Math.abs(cFrame-15));
        b += pb/15*(15-Math.abs(cFrame-15));
        a += pa/15*(15-Math.abs(cFrame-15));
    }
    this.updateCStates();
    this.updateCFrame();
    this.setColorTone([r,g,b,a]);
}

Sprite_Battler.prototype.shakeX = function(){
    var battler;
    
    if(this._actor){
        battler = this._actor;
    }else if(this._enemy){
        battler = this._enemy;        
    }
    if(battler){
        if(battler.shakeFrame()>18){
            return 0;
        }else{
            return Math.floor(battler.shakeFrame() / 2) % 2;
        }
    }
    return 0;
}


Game_Battler.prototype.startShake = function(frame){
    this._shakeFrame = frame;
}

Game_Battler.prototype.startDamageShake = function(){
    this._shakeFrame = 26;
}

Game_Battler.prototype.shakeFrame = function(){
    if(!this._shakeFrame){
        this._shakeFrame = 0;
    }
    return this._shakeFrame;
}

Game_Battler.prototype.damagePosing = function(){
    return this._damagePosing;
}

Game_Battler.prototype.updateShake = function(){
    if(!this._shakeFrame){
        this._shakeFrame = 0;
    }
    if(this._shakeFrame > 0 && this._shakeFrame <= 12){
       this._damagePosing = true;
        if(this.actor){
           this.requestMotion("damage");
        }
    }
    if(this._shakeFrame == 1){
       this._damagePosing = false;
    }
    this._shakeFrame--;
}

Sprite_Battler.prototype.updateShake = function(){
    const frame = this._battler.shakeFrame();
    if(frame > 0){
        this._shakeX = this.shakeX();
        this._battler.updateShake();
    }
    if(frame <= 0){
        this._shakeX = 0;
    }
}

Game_Battler.prototype.startMagicNockback = function(delay,frame,id,result){
    const animationId = Number(id);
    //console.log(this.name(),delay,frame,animationId,result);
    if(animationId == 408){
        return;
    }
    if(result && result.hpDamage <= 0){
       return;
    }
    this._untilMagicNockback = delay;
    this._nockbackFrame = frame;
}

Game_Battler.prototype.nockbackFrame = function(){
    if(!this._nockbackFrame){
        this._nockbackFrame = 0;
    }
    return this._nockbackFrame;
}

Game_Battler.prototype.untilMagicNockback = function(){
    if(!this._untilMagicNockback){
        this._untilMagicNockback = 0;
    }
    return this._untilMagicNockback;
}

Game_Battler.prototype.updateNockback = function(){
    if(this.untilMagicNockback()>0){
        this._untilMagicNockback--;
        return;
    }
    if(this.nockbackFrame()>0){
       this._damagePosing = true;
        if(this.actor){
            //console.log("requestMotion");
           this.requestMotion("damage");
        }
    }
    if(this.nockbackFrame() == 1){
       this._damagePosing = false;
    }
    this._nockbackFrame--;
}

Sprite_Battler.prototype.updateNockback = function(){
    const frame = this._battler.nockbackFrame();
    if(frame > 0){
        this._battler.updateNockback();
    }
}

Sprite_Battler.prototype.getPColorTone = function(stateId){
    var r; var g; var b; var a;
    switch(stateId){
        case 4:
            r = -150; g = 0; b = -180; a = 45;
            break;
        case 18:
            r = 0; g = 255; b = 255; a = 0;
            break;
        case 28:
            r = 255; g = 255; b = 255; a = 0;
            break;
        case 40:
            r = 180; g = 180; b = 180; a = 45;
            break;
        case 41:
            r = 255; g = 127; b = 0; a = 0;
            break;
        case 43:
            r = 255; g = 255; b = 127; a = 0;
            break;
        case 44:
            r = 127; g = 255; b = 127; a = 0;
            break;
        case 47:
            r = 127; g = 64; b = 255; a = 0;
            break;
        case 55:
            r = 107; g = 59; b = 25; a = 255;
            break;
        case 56:
            r = 25; g = 59; b = 93; a = 255;
            break;
    }
    return [r,g,b,a];
}

Sprite_Battler.prototype.getCFrame = function(){
    if(!this._cFrame){
        this._cFrame = 0;
    }
    return this._cFrame;
}

Sprite_Battler.prototype.updateCFrame = function(){
    this._cFrame += 1;
    if(this.getCFrame() > 30){
        this._cFrame = 30;
    }
}

Sprite_Battler.prototype.getCStates = function(){
    if(!this._cStates){
        this._cStates = [];
        this.updateCStates();
    }
    return this._cStates;
}

Sprite_Battler.prototype.updateCStates = function(){
    const battler = this._battler;
    if(!battler){
        return;
    }
    
    //毒
    if(!this._cStates.includes(4) && battler.isStateAffected(4)){
        this._cStates.push(4);
    }
    if(this._cStates.includes(4) && !battler.isStateAffected(4)){
        this._cStates = this._cStates.filter(n => n !== 4);
    }
    //リフレク
    if(!this._cStates.includes(18) && battler.isStateAffected(18)){
        this._cStates.push(18);
    }
    if(this._cStates.includes(18) && !battler.isStateAffected(18)){
        this._cStates = this._cStates.filter(n => n !== 18);
    }
    //トランス
    if(!this._cStates.includes(28) && battler.isStateAffected(28)){
        this._cStates.push(28);
    }
    if(this._cStates.includes(28) && !battler.isStateAffected(28)){
        this._cStates = this._cStates.filter(n => n !== 28);
    }
    //スロウ
    if(!this._cStates.includes(40) && battler.isStateAffected(40)){
        this._cStates.push(40);
    }
    if(this._cStates.includes(40) && !battler.isStateAffected(40)){
        this._cStates = this._cStates.filter(n => n !== 40);
    }
    //ヘイスト
    if(!this._cStates.includes(41) && battler.isStateAffected(41)){
        this._cStates.push(41);
    }
    if(this._cStates.includes(41) && !battler.isStateAffected(41)){
        this._cStates = this._cStates.filter(n => n !== 41);
    }
    //プロテス
    if(!this._cStates.includes(43) && battler.isStateAffected(43)){
        this._cStates.push(43);
    }
    if(this._cStates.includes(43) && !battler.isStateAffected(43)){
        this._cStates = this._cStates.filter(n => n !== 43);
    }
    //シェル
    if(!this._cStates.includes(44) && battler.isStateAffected(44)){
        this._cStates.push(44);
    }
    if(this._cStates.includes(44) && !battler.isStateAffected(44)){
        this._cStates = this._cStates.filter(n => n !== 44);
    }
    //クイック
    if(!this._cStates.includes(47) && battler.isStateAffected(47)){
        this._cStates.push(47);
    }
    if(this._cStates.includes(47) && !battler.isStateAffected(47)){
        this._cStates = this._cStates.filter(n => n !== 47);
    }
    //攻撃↓
    if(!this._cStates.includes(55) && battler.isStateAffected(55)){
        this._cStates.push(55);
    }
    if(this._cStates.includes(55) && !battler.isStateAffected(55)){
        this._cStates = this._cStates.filter(n => n !== 55);
    }
    //防御↓
    if(!this._cStates.includes(56) && battler.isStateAffected(56)){
        this._cStates.push(56);
    }
    if(this._cStates.includes(56) && !battler.isStateAffected(56)){
        this._cStates = this._cStates.filter(n => n !== 56);
    }
    
    if(this.getCFrame() >= 29 && this._cStates.length > 0){
        this._cStates.shift();
        this._cFrame = 0;
    }
    return this._cStates;
}

// override
const _sprite_Enemy_updateBitmap = Sprite_Enemy.prototype.updateBitmap;
Sprite_Enemy.prototype.updateBitmap = function() {    
    
    // カエル状態の時、グラフィックを変更する
    if (this._enemy.isStateAffected(14) && !this._updateToad){
        this.bitmap = ImageManager.loadSvEnemy("FF5 toad");
        this._updateToad = true;
    }else if(!this._enemy.isStateAffected(14) && this._updateToad){
        this._battlerName = name;
        this.bitmap = ImageManager.loadSvEnemy(name);
        this._updateToad = false;
    }
    
    if(this._timeGauge){
        var gaugeY = -this.height-24;
        var gaugeX = -24;
        if(this._enemy&&this._enemy.enemy().meta.gaugeY){
            gaugeY += Number(this._enemy.enemy().meta.gaugeY);
        }
        if(this._enemy&&this._enemy.enemy().meta.gaugeX){
            gaugeX += Number(this._enemy.enemy().meta.gaugeX);
        }
        if(this.y-(this.height) < 0){
            gaugeY = 12;
        }
        if(this._enemy&&this._enemy.cantSelect()){
            gaugeY = -9999;
        }
        //console.log(this._enemy.enemy().name,gaugeX, gaugeY)
        this._timeGauge.move(gaugeX, gaugeY);
	    this._timeGauge.show();
        //console.log(this._timeGauge)
    }
    
    _sprite_Enemy_updateBitmap.apply(this,arguments);
    
};

const _sprite_Actor_updateFrame = Sprite_Actor.prototype.updateFrame;
Sprite_Actor.prototype.updateFrame = function() {
    if(this._motion && this.isCustomMotion(this._motion.index)){
        if(this.customUpdateFrame){
            this.customUpdateFrame();
        }else{
            Sprite_Battler.prototype.updateFrame.call(this);
            var bitmap;
            if(this._mainSprite){
                bitmap = this._mainSprite.bitmap;
            }
            if (bitmap) {
                const cMotions = Sprite_Actor.prototype.customMotion(this._motion.index);
                const step = Sprite_Actor.prototype.currentStep(this._motion.index);
                const svcIndex = cMotions[step][0];
                const cw = bitmap.width / 9;
                const ch = bitmap.height / 6;
                const cx = svcIndex % 9 * cw;
                const cy = Math.floor(svcIndex/9) * ch ;
                this._mainSprite.setFrame(cx, cy, cw, ch);
            }
        }
    }else{
        _sprite_Actor_updateFrame.apply(this,arguments);
        const bitmap = this._mainSprite.bitmap;
        if (bitmap) {
            const motionIndex = this._motion ? this._motion.index : 0;
            const pattern = this._pattern < 3 ? this._pattern : 1;
            const cw = bitmap.width / 9;
            const ch = bitmap.height / 6;
            const cx = Math.floor(motionIndex / 6) * 3 + pattern;
            const cy = motionIndex % 6;
            if(this._avatarSprites&&!this._actor.isReleasing()){
                for(as of this._avatarSprites){
                    as.setFrame(cx * cw, cy * ch, cw, ch);
                }
            }
        }
    }
    if(this._avatarSprites){
        if(this._battler._avatarNum >= 2){
            this._avatarSprites[1].visible = true;
        }else{
            this._avatarSprites[1].visible = false;            
        }
        if(this._battler._avatarNum >= 1){
            this._avatarSprites[0].visible = true;
        }else{
            this._avatarSprites[0].visible = false;            
        }
    }
};



//カスタムモーションをここで定義する
//2次元配列で渡す。1要素目がキャラグラインデックス、2要素目が表示フレーム数
Sprite_Actor.prototype.customMotionLength = function(index) {
    const motions = this.customMotion(index);
    var length = 0;
    for(cm of motions){
        length += cm[1];
    }
    return length;
};

//カスタムモーションの現在のステップを返す
Sprite_Actor.prototype.currentStep = function(index) {
    var frames = this._motionCount;
    var step = 0;
    for(cm of this.customMotion(index)){
        frames-=cm[1];
        if(frames < 0){
            return step;
        }
        step++;
    }
    return this.customMotion(index).length-1;
};

Sprite_Actor.prototype.customUpdateFrame = function() {
    Sprite_Battler.prototype.updateFrame.call(this);
    var bitmap;
    if(this._mainSprite){
        bitmap = this._mainSprite.bitmap;
    }
    if (bitmap) {
        const cMotions = this.customMotion(this._motion.index);
        const step = this.currentStep(this._motion.index);
        const svcIndex = cMotions[step][0];
        const cw = bitmap.width / 9;
        const ch = bitmap.height / 6;
        const cx = svcIndex % 9 * cw;
        const cy = Math.floor(svcIndex/9) * ch ;
        this._mainSprite.setFrame(cx, cy, cw, ch);
        //console.log(cx, cy, cw, ch);
        for(as of this._avatarSprites){
            as.setFrame(cx, cy, cw, ch);
        }
        this.setFrame(0, 0, cw, ch);
    }
    this._blockingSprite.typeId(this._motion.index);
};

Sprite_Actor.prototype.createWeaponSprite = function() {
    this._weaponSprite = new Sprite_Weapon();
    if(this._actor){
        this._weaponSprite.setup(this._actor.weaponImageId(),this._actor._weaponExImage);
    }
    this.addChild(this._weaponSprite);
};

Sprite_Weapon.prototype.setPlusY = function(value) {
    this._plusY = value;
};

// デフォルトの回避モーションを削除
Game_Actor.prototype.performEvasion = function() {
    Game_Battler.prototype.performEvasion.call(this);
    //this.requestMotion("evade");
};

// デフォルトの回避モーションを削除
Game_Actor.prototype.performMagicEvasion = function() {
    Game_Battler.prototype.performMagicEvasion.call(this);
    //this.requestMotion("evade");
};

const _Sprite_Actor_setBattler = Sprite_Actor.prototype.setBattler;
Sprite_Actor.prototype.setBattler = function(battler) {
    _Sprite_Actor_setBattler.apply(this,arguments);
    this._blockingSprite.setBattler(battler);
};

//-----------------------------------------------------------------------------
// Sprite_Blocking
//
// 盾やマントなど、ブロッキング時に表示させるスプライト。

function Sprite_Blocking() {
    this.initialize(...arguments);
}

Sprite_Blocking.prototype = Object.create(Sprite_Weapon.prototype);
Sprite_Blocking.prototype.constructor = Sprite_Blocking;

Sprite_Blocking.prototype.initMembers = function() {
    this._blockingImageId = 0;
    this._animationCount = 0;
    this._pattern = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.x = -$TILE;
    this._typeId = null;
    this._actor = null;
};

Sprite_Blocking.prototype.setBattler = function(actor) {
    this._actor = actor;
};

Sprite_Blocking.prototype.setup = function(blockingImageId) {
    this._blockingImageId = blockingImageId;
    this._animationCount = 0;
    this._pattern = 0;
    this.loadBitmap();
    this.updateFrame();
};

Sprite_Blocking.prototype.typeId = function(id) {
    if(this.typeId > 0){
        this._animationCount = 0;
        this._pattern = 0;
    } 
    this._typeId = id;
};

Sprite_Blocking.prototype.updatePattern = function() {
    this._pattern++;
    if (this._pattern >= 3) {
        this._pattern = 0;
        this._blockingImageId = 0;
        this._typeId = null;
    }
};

Sprite_Blocking.prototype.loadBitmap = function() {
    const pageId = Math.floor((this._blockingImageId - 1) / 12) + 1;
    if (pageId >= 1) {
        this.bitmap = ImageManager.loadSystem("Blocking" + pageId);
    } else {
        this.bitmap = ImageManager.loadSystem("");
    }
};

Sprite_Blocking.prototype.isPlaying = function() {
    return this._blockingImageId > 0;
};

Sprite_Blocking.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if(this._animationCount == 0 && this._typeId && this._pattern == 0){
        this.setupByTypeId();
    }
    if(this._typeId){
        this._animationCount++;
    }
    if (this._animationCount >= this.animationWait()) {
        this.updatePattern();
        this.updateFrame();
        this._animationCount = 0;
    }
    if(this._typeId == null && this._animationCount > 0){
        this._animationCount = 0;
    }
};

Sprite_Blocking.prototype.updateFrame = function() {
    if (this._blockingImageId > 0) {
        const index = (this._blockingImageId - 1) % 12;
        const w = Math.floor(this.bitmap.width / 6);
        const h = Math.floor(this.bitmap.height / 6);
        const sx = (Math.floor(index / 6) * 3 + this._pattern) * w;
        const sy = index % 6 * h;
        this.setFrame(sx, sy, w, h);
    } else {
        this.setFrame(0, 0, 0, 0);
    }
};

Sprite_Blocking.prototype.setupByTypeId = function() {
    if(this._typeId == 18){ //blockR
        const weapons = this._actor.weapons();
        const equip = weapons[0];
        if(weapons[0] == null){ // 素手
            this.setup(1);
            this.x = -$DOT*26;
            this.y = $DOT*5;
        }else{
            if(equip.wtypeId >= 1 && equip.wtypeId <= 4){ // 剣系
                    this.setup(5);
                    this.x = -$DOT*26;
                    this.y = $DOT*5;
            }
            else if(equip.wtypeId == 6){ // 刀
                    this.setup(8);
                    this.x = -$DOT*26;
                    this.y = $DOT*5;
            }
            else if(equip.wtypeId == 7){ // 短剣
                    this.setup(6);
                    this.x = -$DOT*26;
                    this.y = $DOT*5;
            }
            else if(equip.wtypeId == 11 || equip.wtypeId == 12){ // 槍類
                    this.setup(7);
                    this.x = -$DOT*4;
                    this.y = 0;
            }else{
                this.setup(1);
                this.x = -$DOT*26;
                this.y = $DOT*5;
            }
        }
    }
    if(this._typeId == 19){ //blockL
        const armors = this._actor.armors();
        const weapons = this._actor.weapons();
        var equip = null;
        if(weapons.length > 1){
            equip = weapons[1];
            if(equip == null){ // 素手
                this.setup(1);
                this.x = -$DOT*26;
                this.y = $DOT*5;
            }else{
                if(equip.wtypeId >= 1 && equip.wtypeId <= 4){ // 剣系
                        this.setup(5);
                        this.x = -$DOT*26;
                        this.y = $DOT*5;
                }
                else if(equip.wtypeId == 6){ // 刀
                        this.setup(8);
                        this.x = -$DOT*26;
                        this.y = $DOT*5;
                }
                else if(equip.wtypeId == 7){ // 短剣
                        this.setup(6);
                        this.x = -$DOT*26;
                        this.y = $DOT*5;
                }
                else if(equip.wtypeId == 11 || equip.wtypeId == 12){ // 槍類
                        this.setup(7);
                        this.x = -$DOT*4;
                        this.y = 0;
                }else{
                    this.setup(1);
                    this.x = -$DOT*26;
                    this.y = $DOT*5;
                }
            }            
        }else{
            for(let i=0;i<armors.length;i++){
                if(armors[i].etypeId == 2){
                    equip = armors[i];
                }
            }
            if(equip == null){
                this.setup(2);
                this.x = -$DOT*24;
                this.y = 0;
            }else{
                if(equip.atypeId == 1){ // 小型盾
                    this.setup(2);
                    this.x = -$DOT*24;
                    this.y = 0;
                }
                if(equip.atypeId == 2){ // 大型盾
                    this.setup(3);
                    this.x = -$DOT*24;
                    this.y = 0;
                }
            }
        }
    }
    if(this._typeId == 22){
        this.setup(4);
         if (this._pattern == 0){
            this.x = -$TILE;
            this.y = -$TILE/2+$DOT*4;
        }   
        if (this._pattern >= 1){
            this.x = -$TILE;
            this.y = -$DOT*2+$DOT*4;
        }
    }
}

Sprite_Blocking.prototype.animationWait = function() {
    return 12;
};

//--------------------------------------------------------------------------


Sprite_Weapon.prototype.updatePattern = function() {
    this._pattern++;
    if (this._pattern >= 3) {
        this._weaponImageId = 0;
    }
};

/*
Sprite_Weapon.prototype.setExImage = function(filename,imageId) {
    this._exImage = filename;
    this._weaponImageId = imageId;
};*/
const _Sprite_Weapon_updateFrame = Sprite_Weapon.prototype.updateFrame;
Sprite_Weapon.prototype.updateFrame = function() {
    if(!this._motionIndex){
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this.rotation = 0 * Math.PI / 180;
        //軽槍・爪・素手
        if(!this._exImage&&(this._weaponImageId == 11 ||this._weaponImageId == 12 || this._weaponImageId == 0) ||
          this._exImage == "Spire1" || this._exImage == "Spire2" || this._exImage == "Knuckle1"){
            if (this._pattern == 0){
                this.x = $DOT*26;
                this.y = -$DOT*3;
            }
            if (this._pattern == 1){
                this.x = -$DOT*8;
                this.y = -$DOT*3;
            }
            if (this._pattern == 2){
                this.x = -$DOT*16;
                this.y = -$DOT*3;
            }
            if(this.isWeapon2()){
                this.y += $DOT*3;       
            }
        }
        //重槍
        else if((!this._exImage&&this._weaponImageId == 12)||
                this._exImage == "Lance1"||
                this._exImage == "Lance2"){
            if (this._pattern == 0){
                this.x = -$DOT*16;
                this.y = -$DOT*3;
            }
            if (this._pattern == 1){
                this.x = -$DOT*22;
                this.y = -$DOT*3;
            }
            if (this._pattern == 2){
                this.x = -$DOT*22;
                this.y = -$DOT*3;
            }
            if(this.isWeapon2()){
                this.y += $DOT*3;       
            } 
        }
        //両手剣
        else if((!this._exImage&&this._weaponImageId == 3)||
                this._exImage == "Claymore1"){
            if (this._pattern == 0){
                this.x = $DOT*26;
                this.y = -$DOT*18;
            }
            if (this._pattern == 1){
                this.x = -$DOT*22;
                this.y = -$DOT*8;
            }
            if (this._pattern == 2){
                this.x = -$DOT*18;
                this.y = $DOT*0;
            }        
        }
        //ガンブレード
        else if((!this._exImage&&this._weaponImageId == 8)||
                this._exImage == "Gunblade1"){
            if (this._pattern == 0){
                this.x = $DOT*26;
                this.y = -$DOT*18;
            }
            if (this._pattern == 1){
                this.x = -$DOT*22;
                this.y = -$DOT*8;
            }
            if (this._pattern == 2){
                this.x = -$DOT*26;
                this.y = -$DOT*4;
            }        
        }
        //弓矢・竪琴
        else if((!this._exImage&&(this._weaponImageId == 7||this._weaponImageId == 9))||
        this._exImage == "Bow1"||this._exImage == "Bow2"||this._exImage == "Harp1"){ 
            this.x = -$DOT*14;
            this.y = $DOT*3;
        }
        //杖・ロッド
        else if((!this._exImage&&(this._weaponImageId == 6||this._weaponImageId == 10))||
        this._exImage == "Rod1"||this._exImage == "Rod2"||this._exImage == "Wand1"||this._exImage == "Wand2"){ 
            if (this._pattern == 0){
                this.x = $DOT*26;
                this.y = -$DOT*18;
            }
            if (this._pattern == 1){
                this.x = -$DOT*31;
                this.y = -$DOT*8;
            }
            if (this._pattern == 2){
                this.x = -$DOT*31;
                this.y = -$DOT*8;
            }
        // 
        }else if((!this._exImage&&(this._weaponImageId == 15))||this._exImage == "Gun"){
            this.x = -$DOT*10;
            this.y = -$DOT*12;
        }else{
            if (this._pattern == 0){
                this.x = $DOT*26;
                this.y = -$DOT*10;
            }
            if (this._pattern == 1){
                this.x = -$DOT*22;
                this.y = -$DOT*8;
            }
            if (this._pattern == 2){
                this.x = -$DOT*29;
                this.y = -$DOT*7;
            }        
        }
        this.y += this._plusY;		
        
        if (this._weaponImageId > 0) {
            const index = (this._weaponImageId - 1) % 12;
            let w = 0;
            let h = 0;
            if(this._pageId !== 3){
                w = Math.floor(this.bitmap.width / 6);
            }else{
                w = Math.floor(this.bitmap.width / 3);
            }
            h = Math.floor(this.bitmap.height / 6);
            const sx = (Math.floor(index / 6) * 3 + this._pattern) * w;
            const sy = Math.floor(index % 6) * h;
            if((!this._exImage&&(this._weaponImageId == 15))||this._exImage == "Gun"){ 
                console.log("setframe",sx, sy, w, h);
            }
            this.setFrame(sx, sy, w, h);
        }else{
            this.visible = false;
        }
    }
};

//スプライトアニメーションを強制終了する
Sprite_Weapon.prototype.forceTermination = function() {
    console.log("forceTermination");
    this._weaponImageId = 0;
    this._motionIndex = 0;
    this.updateFrame();
    this.setFrame(0, 0, 0, 0);
}

Sprite_Weapon.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this._animationCount++;
    if (this._motionIndex == 0 && this._animationCount >= this.animationWait()) {
        //console.log("updateWeaponAnimation");
        this.updatePattern();
        this.updateFrame();
        this._animationCount = 0;
    }
    if(this._motionIndex){
        this.updateWeaponMotion();
    }
};

Sprite_Weapon.prototype.updateWeaponMotion = function() {
    //console.log("Sprite_Weapon1,updateWeaponMotion",this._motionIndex,this._allAnimationCount);
    if(this._allAnimationCount <= 8){
        this._pattern = 0;
        this.anchor.x = 0;
        this.anchor.y = 1;
    }else if(this._allAnimationCount <= 16){
        this._pattern = 1;
        this.anchor.x = 1;
        this.anchor.y = 1;
    }else{
        this._pattern = 2;
        this.anchor.x = 1;
        this.anchor.y = 1;
    }
    this.rotation = 0 * Math.PI / 180;
    this.scale.y = 1;
    this.scale.x = 1;
    //spinWFR 右手前で回す
    if(this._motionIndex == 36){
        this._pattern = 0;
        this.anchor.x = 2/48;
        this.anchor.y = 30/32;
        this.x = -$DOT*8;
        this.y = -$DOT*12;
        
        this.rotation = 360 - 360/10*(this._allAnimationCount%10) * Math.PI / 180;
        //弓矢・竪琴
        if((!this._exImage&&(this._weaponImageId == 7||this._weaponImageId == 9))||
        this._exImage == "Bow1"||this._exImage == "Bow2"||this._exImage == "Harp1"){
            this._pattern = 1;
            this.anchor.x = 31/48;
            this.anchor.y = 18/32;
        }
        //槍
        else if((!this._exImage&&(this._weaponImageId == 11||this._weaponImageId == 12))||
        this._exImage == "Spire1"|| this._exImage == "Spire2"||this._exImage == "Lance1"||
        this._exImage == "Lance2"){
            this._pattern = 1;
            this.anchor.x = 38/48;
            this.anchor.y = 23/32;
        }
        //ムチ
        else if((!this._exImage&&(this._weaponImageId == 5))||
        this._exImage == "Whip1"){
            this._pattern = 2;
            this.anchor.x = 46/48;
            this.anchor.y = 30/32;
        }
    }
    //spinningEdge スピニングエッジ spinningGunblade ガンブレードスピン -------------------------------------------------------
    if(this._motionIndex == 60 ||this._motionIndex == 221){
        //両手剣 -------------------------------------------------
        if(((!this._exImage&&this._weaponImageId == 3)||this._exImage == "Claymore1")||
        ((!this._exImage&&(this._weaponImageId == 11||this._weaponImageId == 12))||
        this._exImage == "Spire1"||this._exImage == "Spire2"||this._exImage == "Lance1"||
        this._exImage == "Lance2")){                
                this._pattern = 2;
                this.anchor.x = 1;
                this.anchor.y = 16/24;
                if(this._allAnimationCount%8 < 2){
                    this.rotation = 90 * Math.PI / 180;
                }else if(this._allAnimationCount%8 < 4){
                    this.rotation = 0 * Math.PI / 180;
                }else if(this._allAnimationCount%8 < 6){
                    this.x = $DOT*4;
                    this.y = -$DOT*8;
                    this.rotation = -90 * Math.PI / 180;
                }else{
                    this.x = $DOT*3;
                    this.y = -$DOT*18;
                    this.rotation = 180 * Math.PI / 180;
                }
        }else{
            this._pattern = 0;
            this.anchor.x = 0;
            this.anchor.y = 1;
            if(this._allAnimationCount%8 < 2){
                this.rotation = -45 * Math.PI / 180;
            }else if(this._allAnimationCount%8 < 4){
                this.rotation = -135 * Math.PI / 180;
            }else if(this._allAnimationCount%8 < 6){
                this.x = $DOT*4;
                this.y = -$DOT*8;
                this.rotation = 135 * Math.PI / 180;
            }else{
                this.x = $DOT*3;
                this.y = -$DOT*18;
                this.rotation = 45 * Math.PI / 180;
            }
        }
    }
      
    //swingupW
    if((this._motionIndex == 33||this._motionIndex == 56||this._motionIndex == 202)){
        if((!this._exImage&&(this._weaponImageId == 11||this._weaponImageId == 12))||
        this._exImage == "Spire1"||this._exImage == "Spire2"||this._exImage == "Lance1"||
        this._exImage == "Lance2"){
            this._pattern = 1;
            this.anchor.x = 1;
            this.anchor.y = 21/24;
            if(this._allAnimationCount<=8){
                this.rotation = 45 * Math.PI / 180;
                this.x = -$DOT*2;
                this.y = $DOT*4;
            }else{
                this.rotation = 135 * Math.PI / 180;
                this.x = -$DOT*5;
                this.y = -$DOT*12;
            }
        }else{
            this.rotation = 0 * Math.PI / 180;
            if(this._allAnimationCount <= 8){
                this._pattern = 2;
                this.anchor.x = 1;
                this.anchor.y = 1;
            	this.x = $DOT*2;
            	this.y = $DOT*2;
            }else{
                this._pattern = 0;
                this.anchor.x = 0;
                this.anchor.y = 1;
            	this.x = $DOT*4;
            	this.y = -$DOT*20;
            }
        }
    }
      
    //swingdownW swingDownSword swingDownGunblade
    if((this._motionIndex == 34||this._motionIndex == 213||this._motionIndex == 225)){
        if((!this._exImage&&(this._weaponImageId == 11||this._weaponImageId == 12))||
        this._exImage == "Spire1"||this._exImage == "Spire2"||this._exImage == "Lance1"||
        this._exImage == "Lance2"){
            this._pattern = 1;
            this.anchor.x = 1;
            this.anchor.y = 21/24;
            if(this._allAnimationCount<=8){
                this.rotation = 45 * Math.PI / 180;
                this.x = -$DOT*2;
                this.y = $DOT*4;
            }else{
                this.rotation = 135 * Math.PI / 180;
                this.x = -$DOT*5;
                this.y = -$DOT*12;
            }
        //ガンブレード
        }else if((!this._exImage&&this._weaponImageId == 8)||
                    this._exImage == "Gunblade1"){
            this._pattern = 0;
            this.anchor.x = 0;
            this.anchor.y = 1;
            this.rotation = 180 * Math.PI / 180;
            this.x = -$DOT*3;
            this.y = -$DOT*12;
            if(this._allAnimationCount <= 8){
                this.rotation = 0 * Math.PI / 180;
                this.x = $DOT*2;
                this.y = -$DOT*24;
            }
        }
    }
    //swingW 振る swingbothW 両手で振る swingWquick 素早く振る
    //onion オニオン右 swingSword 剣を振る 3 剣を向ける swingWhip ムチを振る
    //swingWquick 素早く両手で振る spinWithSword 剣とともに１回転 swingUpSwordMore 大きく剣を振り上げる
    //tamanegiri 鬼怨魂音斬 swingupSword 剣を振り上げる nagi 薙ぎ払い
    //swingClaymore 両手剣を振る swingGunblade ガンブレードを振る swingUpSwordMore 大きくガンブレードを振り上げる
    //swingBothKatana 両手で刀を振る
    //---------------------------------------------------------------
    if(this._motionIndex == 30||this._motionIndex == 31||this._motionIndex == 47||this._motionIndex == 48||this._motionIndex == 52||this._motionIndex == 53||
        this._motionIndex == 54||this._motionIndex == 55||this._motionIndex == 57||this._motionIndex == 58||this._motionIndex == 61||
        this._motionIndex == 62||this._motionIndex == 201||this._motionIndex == 214||this._motionIndex == 218)
        {
        this.rotation = 0 * Math.PI / 180;
        //swingW
        if(this._motionIndex == 30||this._motionIndex == 33||this._motionIndex == 48||this._motionIndex == 54){
            if(this._allAnimationCount <= 5){
                this._pattern = 0;
                this.anchor.x = 0;
                this.anchor.y = 1;
            }else if(this._allAnimationCount <= 10){
                this._pattern = 1;
                this.anchor.x = 1;
                this.anchor.y = 1;
            }else{
                this._pattern = 2;
                this.anchor.x = 1;
                this.anchor.y = 1;
            }
        }
        //onion
        if(this._motionIndex == 48){
            if(Math.floor(this._allAnimationCount/4)%2 == 0){
                this._pattern = 0;
                this.anchor.x = 0;
                this.anchor.y = 1;
            }else{
                this._pattern = 2;
                this.anchor.x = 1;
                this.anchor.y = 1;
            }
        }  
        //swingbothWquick
        if(this._motionIndex == 47||this._motionIndex == 55){
            if(this._allAnimationCount <= 4){
                this._pattern = 0;
                this.anchor.x = 0;
                this.anchor.y = 1;
            }else{
                this._pattern = 2;
                this.anchor.x = 1;
                this.anchor.y = 1;
            }
        }  
        //takeSword
        if(this._motionIndex == 53){
            this._pattern = 2;
            this.anchor.x = 1;
            this.anchor.y = 1;
        }
        //両手剣
        if((!this._exImage&&this._weaponImageId == 3)||
                this._exImage == "Claymore1"){
            if (this._pattern == 0){
                this.x = $DOT*4;
                this.y = -$DOT*20;
            }
            if (this._pattern == 1){
                this.x = -$DOT*22;
                this.y = -$DOT*8;
            }
            if (this._pattern == 2){
                this.x = -$DOT*4;
                this.y = -$DOT*2;
            }        
        }
        //ガンブレード
        else if((!this._exImage&&this._weaponImageId == 8)||
                this._exImage == "Gunblade1"){
            if (this._pattern == 0){
                this.x = $DOT*2;
                this.y = -$DOT*24;
            }
            if (this._pattern == 1){
                this.x = -$DOT*22;
                this.y = -$DOT*8;
            }
            if (this._pattern == 2){
                this.x = -$DOT*4;
                this.y = -$DOT*2;
            }        
        }
        //弓矢・竪琴
        else if((!this._exImage&&(this._weaponImageId == 7||this._weaponImageId == 9))||
        this._exImage == "Bow1"||this._exImage == "Bow2"||this._exImage == "Harp1"){
            this._pattern = 1;
            this.anchor.x = 0;
            this.anchor.y = 1;
            if(this._allAnimationCount<=9){
                this.rotation = 45 * Math.PI / 180;
                this.x = -$DOT*24;
                this.y = -$DOT*40;
            }else{
                this.rotation = -45 * Math.PI / 180;
                this.x = -$DOT*24;
                this.y = $DOT*16;
            }
        }
        //槍
        else if((!this._exImage&&(this._weaponImageId == 11||this._weaponImageId == 12))||
        this._exImage == "Spire1"||this._exImage == "Spire2"||this._exImage == "Lance1"||
        this._exImage == "Lance2"){
            this._pattern = 1;
            this.anchor.x = 1;
            this.anchor.y = 21/24;
            if(this._allAnimationCount<=9){
                this.rotation = 135 * Math.PI / 180;
                this.x = -$DOT*5;
                this.y = -$DOT*24;
            }else{
                this.rotation = 45 * Math.PI / 180;
                this.x = -$DOT*2;
                this.y = $DOT*4;
            }
        }else{
            if (this._pattern == 0){
                this.x = $DOT*2;
                this.y = -$DOT*17;
            }
            if (this._pattern == 1){
                this.x = -$DOT*6;
                this.y = -$DOT*8;
            }
            if (this._pattern == 2){
                this.x = -$DOT*4;
                this.y = -$DOT*8;
            }
        }
    }
    // thrustW 突き刺す
    if(this._motionIndex == 32){
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this.rotation = 0 * Math.PI / 180;
        //両手剣
        if((!this._exImage&&this._weaponImageId == 3)||
                this._exImage == "Claymore1"){

        }
        //ガンブレード
        else if((!this._exImage&&this._weaponImageId == 8)||
                this._exImage == "Gunblade1"){

        }
        //弓矢・竪琴
        else if((!this._exImage&&(this._weaponImageId == 7||this._weaponImageId == 9))||
        this._exImage == "Bow1"||this._exImage == "Bow2"||this._exImage == "Harp1"){

        }
        //槍
        else if((!this._exImage&&(this._weaponImageId == 11||this._weaponImageId == 12))||
        this._exImage == "Spire1"||this._exImage == "Spire2"||this._exImage == "Lance1"||
        this._exImage == "Lance2"){
            if (this._pattern == 0){
                this.x = $DOT*2;
                this.y = -$DOT*3;
            }
            if (this._pattern == 1){
                this.x = -$DOT*8;
                this.y = -$DOT*3;
            }
        }else{
        //その他

        }
    }
    //readyGunblade ガンブレードの構え
    if(this._motionIndex == 215){
        
        this.rotation = 0 * Math.PI / 180;
        if((!this._exImage&&this._weaponImageId == 8)||
                this._exImage == "Gunblade1"){
                    this._pattern = 0;
                    this.anchor.x = 0;
                    this.anchor.y = 1;
                    this.x = -10;
                    this.y = -6;
        }
    }
    //tackleWithGunblade ガンブレードでタックル
    if(this._motionIndex == 224){
        
        this.rotation = 0 * Math.PI / 180;
        if((!this._exImage&&this._weaponImageId == 8)||
                this._exImage == "Gunblade1"){
                    this._pattern = 0;
                    this.anchor.x = 0;
                    this.anchor.y = 1;
                    this.x = 10;
                    this.y = -6;
        }
    }
    //raiseW 掲げる upperW 片手で掲げる raiseSword 剣を掲げる raiseGunblade
    if(this._motionIndex == 70||this._motionIndex == 35||this._motionIndex == 209||this._motionIndex == 222){
        this._pattern = 0;
        this.anchor.x = 0;
        this.anchor.y = 1;
        this.rotation = 315 * Math.PI / 180;
        this.x = -4;
        this.y = -24;
        //両手剣
        if((!this._exImage&&this._weaponImageId == 3)||
                this._exImage == "Claymore1"){
            this._pattern = 2;
            this.rotation = 90 * Math.PI / 180;
            this.anchor.x = 1;
            this.anchor.y = 16/24;
        }
        //ガンブレード
        else if((!this._exImage&&this._weaponImageId == 8)||
                this._exImage == "Gunblade1"){
            this._pattern = 0;
            this.anchor.x = 0;
            this.anchor.y = 1;
        	this.x += 0;
        	this.y = -20;
            this.rotation = -45 * Math.PI / 180;
        }
        //弓矢
        else if((!this._exImage&&this._weaponImageId == 7)||
        this._exImage == "Bow1"||this._exImage == "Bow2"){
            this._pattern = 1;
            this.anchor.x = 22/32;
            this.anchor.y = 1;
            this.rotation = 0 * Math.PI / 180;
        }
        //竪琴
        else if((!this._exImage&&this._weaponImageId == 9)||this._exImage == "Harp1"){
            this._pattern = 0;
            this.anchor.x = 22/32;
            this.anchor.y = 1;
        }
        //槍
        else if((!this._exImage&&(this._weaponImageId == 11||this._weaponImageId == 12))||
        this._exImage == "Spire1"||this._exImage == "Spire2"||this._exImage == "Lance1"||
        this._exImage == "Lance2"){
            this._pattern = 0;
            this.anchor.x = 1;
            this.anchor.y = 16/24;
            this.rotation = 90 * Math.PI / 180;
        }
    }
    //standW 突き立てる standKatana 刀を突きたてる
    if(this._motionIndex == 43||this._motionIndex == 217){
        this._pattern = 0;
        this.anchor.x = 0;
        this.anchor.y = 1;
        this.rotation = 135 * Math.PI / 180;
        this.x = -7;
        this.y = -24;
        //両手剣
        if((!this._exImage&&this._weaponImageId == 3)||
                this._exImage == "Claymore1"){
            this._pattern = 2;
            this.rotation = -90 * Math.PI / 180;
            this.anchor.x = 1;
            this.anchor.y = 16/24;
        }
        //ガンブレード
        else if((!this._exImage&&this._weaponImageId == 8)||
                this._exImage == "Gunblade1"){
            this._pattern = 0;
            this.anchor.x = 0;
            this.anchor.y = 1;
        	this.y = -20;
            this.rotation = 135 * Math.PI / 180;
        }
        //弓矢
        else if((!this._exImage&&this._weaponImageId == 7)||
        this._exImage == "Bow1"||this._exImage == "Bow2"){
            this._pattern = 1;
            this.anchor.x = 22/32;
            this.anchor.y = 1;
            this.rotation = 0 * Math.PI / 180;
        }
        //竪琴
        else if((!this._exImage&&this._weaponImageId == 9)||this._exImage == "Harp1"){
            this._pattern = 0;
            this.anchor.x = 22/32;
            this.anchor.y = 1;
        }
        //槍
        else if((!this._exImage&&(this._weaponImageId == 11||this._weaponImageId == 12))||
        this._exImage == "Spire1"||this._exImage == "Spire2"||this._exImage == "Lance1"||
        this._exImage == "Lance2"){
            this._pattern = 0;
            this.anchor.x = 1;
            this.anchor.y = 16/24;
            this.rotation = 90 * Math.PI / 180;
        }
    }
    //pointUpClaymore 胸の前で両手剣を上へ向ける
    if(this._motionIndex == 200){
        this.anchor.x = 0;
        this.anchor.y = 1;
        this.rotation = 225 * Math.PI / 180;
        this.x = -2;
        this.y = -8;
        //両手剣
        if((!this._exImage&&this._weaponImageId == 3)||
                this._exImage == "Claymore1"){
            this._pattern = 2;
            this.rotation = 90 * Math.PI / 180;
            this.anchor.x = 1;
            this.anchor.y = 16/24;
        }
        //ガンブレード
        else if((!this._exImage&&this._weaponImageId == 8)||
                this._exImage == "Gunblade1"){
            this._pattern = 0;
            this.rotation = -45 * Math.PI / 180;
            this.anchor.x = 24/32;
            this.anchor.y = 16/24;
        }
    }
    //jumpSlash ジャンプ斬り
    if(this._motionIndex == 64){
        this._pattern = 2;
        this.anchor.x = 1;
        this.anchor.y = 1;
        if(this._allAnimationCount >= 10){
            this.rotation = -90 * Math.PI / 180;
            this.y = -$DOT*10;
            this.x = -$DOT*2;
        }else{
            this.x = -$DOT*1;
            this.y = -$DOT*17;
            this.rotation = 0 * Math.PI / 180;
        }
    }
    //upperSlash アッパー斬り upperSlashClaymore アッパー斬り両手剣
    if(this._motionIndex == 65||this._motionIndex == 66){
        this._pattern = 2;
        this.anchor.x = 1;
        this.anchor.y = 1;
        this.x = -$DOT*1;
        this.y = -$DOT*17;
        this.rotation = 0 * Math.PI / 180;
    }
    //swingAroundClaymore 両手剣振り回し
    if(this._motionIndex == 68){
        this._pattern = 2;
        this.anchor.x = 1;
        this.anchor.y = 24/32;
        this.x = $DOT*0;
        this.y = -$DOT*17;
        this.rotation = 360 - 360/10*(this._allAnimationCount%10) * Math.PI / 180;
    }
    //stubClaymore 両手剣で突き刺す stubGunblade ガンブレードで突き刺す
    if(this._motionIndex == 66||this._motionIndex == 223){
        this.rotation = 0 * Math.PI / 180;
        this._pattern = 2;
        this.anchor.x = 1;
        this.anchor.y = 24/32;
        this.x = $DOT*0;
        this.y = -$DOT*8;
        if((!this._exImage&&this._weaponImageId == 8)||
            this._exImage == "Gunblade1"){
            this._pattern = 0;
            this.anchor.x = 0;
            this.anchor.y = 1;
            this.x = $DOT*2;
            this.y = -$DOT*6;
            this.rotation = -135 * Math.PI / 180;
        }
    }

    //woundupW 振りかぶる woundupbothW 両手で振りかぶる woundupGunblade ガンブレードを振りかぶる woundUpBothKatana 刀を両手で振りかぶる ---------------------------------------------------------------
    if(this._motionIndex == 45||this._motionIndex == 46||this._motionIndex == 69||this._motionIndex == 216||this._motionIndex == 219){
        this.anchor.x = 0;
        this.anchor.y = 1;
        //両手剣
        if((!this._exImage&&this._weaponImageId == 3)||
                this._exImage == "Claymore1"){
            this._pattern = 0;
            this.rotation = 90 * Math.PI / 180;
            this.x = $DOT*2;
            this.y = -$DOT*24;
        }
        //ガンブレード
        else if((!this._exImage&&this._weaponImageId == 8)||
                this._exImage == "Gunblade1"){
            this._pattern = 0;
            this.anchor.x = 0;
            this.anchor.y = 1;
            this.x = $DOT*2;
            this.y = -$DOT*24;
        }
        //弓矢・竪琴
        else if((!this._exImage&&(this._weaponImageId == 7||this._weaponImageId == 9))||
        this._exImage == "Bow1"||this._exImage == "Bow2"||this._exImage == "Harp1"){
            this._pattern = 1;
            this.anchor.x = 1;
            this.anchor.y = 1;
            this.rotation = 135 * Math.PI / 180;
            this.x = -$DOT*10;
            this.y = -$DOT*16;
        }
        //槍
        else if((!this._exImage&&(this._weaponImageId == 11||this._weaponImageId == 12))||
        this._exImage == "Spire1"||this._exImage == "Spire2"||this._exImage == "Lance1"||
        this._exImage == "Lance2"){
            this._pattern = 1;
            this.anchor.x = 1;
            this.anchor.y = 21/24;
            this.rotation = 225 * Math.PI / 180;
            this.x = $DOT*2;
            this.y = -$DOT*32;
        }else{
            this._pattern = 0;
            this.rotation = 90 * Math.PI / 180;
            this.x = $DOT*2;
            this.y = -$DOT*20;
        }
    }
    //setupW 構える setupSword 剣を構える ---------------------------------------------------------------
    if(this._motionIndex == 42||this._motionIndex == 208){
        this._pattern = 0;
        this.anchor.x = 0;
        this.anchor.y = 1;
        this.rotation = 315 * Math.PI / 180;
        this.x = -$DOT*7;
        this.y = -$DOT*8;
        //弓矢・竪琴
        if((!this._exImage&&(this._weaponImageId == 7||this._weaponImageId == 9))||
        this._exImage == "Bow1"||this._exImage == "Bow2"||this._exImage == "Harp1"){
            this._pattern = 1;
            this.anchor.x = 1;
            this.anchor.y = 1;
            this.x = -$DOT*10;
            this.y = -$DOT*16;
        }
        //槍
        else if((!this._exImage&&(this._weaponImageId == 11||this._weaponImageId == 12))||
        this._exImage == "Spire1"||this._exImage == "Spire2"||this._exImage == "Lance1"||
        this._exImage == "Lance2"){
            this._pattern = 1;
            this.anchor.x = 1;
            this.anchor.y = 21/24;
            this.rotation = 90 * Math.PI / 180;
            this.x = $DOT*2;
            this.y = -$DOT*32;
        }
    }
    //readyBow 弓を構える ---------------------------------------------------------------
    if(this._motionIndex == 50){
        this._pattern = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this.x = -$DOT*14;
        this.y = $DOT*5;
    }
    //shotArrow 弓を放つ ---------------------------------------------------------------
    if(this._motionIndex == 51){
        this._pattern = 1;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this.x = -$DOT*14;
        this.y = $DOT*5;
    }
    //spinWithSword 剣と共に回る ---------------------------------------------------------------
    if(this._motionIndex == 57){
        if(this._allAnimationCount < 2){
            this._pattern = 0;
            this.anchor.x = 0;
            this.anchor.y = 1;
        }else if(this._allAnimationCount < 4){
            this._pattern = 1;
            this.anchor.x = 1;
            this.anchor.y = 1;
            this.x = $DOT*8;
        }else if(this._allAnimationCount < 6){
            this._pattern = 2;
            this.anchor.x = 1;
            this.anchor.y = 1;
        }else if(this._allAnimationCount < 8){
            this._pattern = 2;
            this.anchor.x = 1;
            this.anchor.y = 1;
            this.rotation = -45 * Math.PI / 180;
        }else if(this._allAnimationCount < 10){
            this._pattern = 2;
            this.anchor.x = 1;
            this.anchor.y = 1;
            this.rotation = -90 * Math.PI / 180;
        }else if(this._allAnimationCount < 12){
            this._pattern = 2;
            this.anchor.x = 1;
            this.anchor.y = 1;
            this.rotation = -135 * Math.PI / 180;
        }else if(this._allAnimationCount < 14){
            this._pattern = 2;
            this.anchor.x = 1;
            this.anchor.y = 1;
            this.x = $DOT*4;
            this.y = -$DOT*6;
            this.rotation = 180 * Math.PI / 180;
        }else if(this._allAnimationCount < 16){
            this._pattern = 2;
            this.anchor.x = 1;
            this.anchor.y = 1;
            this.x = $DOT*4;
            this.y = -$DOT*8;
            this.rotation = 135 * Math.PI / 180;
        }else if(this._allAnimationCount < 18){
            this._pattern = 2;
            this.anchor.x = 1;
            this.anchor.y = 1;
            this.x = $DOT*4;
            this.y = -$DOT*8;
            this.rotation = 90 * Math.PI / 180;
        }else{
            this._pattern = 2;
            this.anchor.x = 1;
            this.anchor.y = 1;
            this.x = $DOT*3;
            this.y = -$DOT*18;
            this.rotation = 45 * Math.PI / 180;
        }
    }
    //swingUpSwordMore 大きく剣を振り上げる---------------------------------------------------------------
    if(this._motionIndex == 58){
        if(this._allAnimationCount < 2){
            this._pattern = 2;
            this.anchor.x = 1;
            this.anchor.y = 1;
            this.x = $DOT*2;
            this.y = $DOT*2;
            this.rotation = -90 * Math.PI / 180;
        }else if(this._allAnimationCount < 4){
            this._pattern = 2;
            this.anchor.x = 1;
            this.anchor.y = 1;
            this.rotation = -45 * Math.PI / 180;
            this.x = -$DOT*2;
            this.y = $DOT*0;
        }else if(this._allAnimationCount < 6){
            this._pattern = 2;
            this.anchor.x = 1;
            this.anchor.y = 1;
            this.x = $DOT*2;
            this.y = $DOT*2;
        }else if(this._allAnimationCount < 8){
            this._pattern = 2;
            this.anchor.x = 1;
            this.anchor.y = 1;
            this.x = -$DOT*2;
            this.y = -$DOT*8;
        }else{
            this._pattern = 0;
            this.anchor.x = 0;
            this.anchor.y = 1;
        }
    }
    //zantetsu 剣を抱えたまま目をつぶる ---------------------------------------------------------------
    if(this._motionIndex == 59){
        this._pattern = 0;
        this.anchor.x = 0;
        this.anchor.y = 1;
        this.x = -$DOT*8;
        this.y = $DOT*0;
    }
    //tamanegiri1 鬼怨魂音斬構え ---------------------------------------------------------------
    if(this._motionIndex == 61){
        if(this._allAnimationCount < 10){
            this._pattern = 0;
            this.anchor.x = 0;
            this.anchor.y = 1;
            this.x = -$DOT*4;
            this.y = -$DOT*16;
            this.rotation = 90 * Math.PI / 180;
        }
    }
    //tamanegiri2 鬼怨魂音斬放つ ---------------------------------------------------------------
    if(this._motionIndex == 62){
        if(this._allAnimationCount < 10){
            this._pattern = 0;
            this.anchor.x = 0;
            this.anchor.y = 1;
            this.x = -$DOT*8;
            this.y = -$DOT*10;
            this.rotation = 180 * Math.PI / 180;
        }
    }
    //chargeOrder chargeOrderGunblade
    if(this._motionIndex == 63 ||this._motionIndex == 220){
        if(this._allAnimationCount < 4){
            this._pattern = 0;
            this.anchor.x = 0;
            this.anchor.y = 1;
        }else if(this._allAnimationCount < 8){
            this._pattern = 1;
            this.anchor.x = 1;
            this.anchor.y = 1;
        }else{
            this._pattern = 2;
            this.anchor.x = 1;
            this.anchor.y = 1;
            this.y = -$DOT*12;
            this.x = -$DOT*8;
            this.rotation = -45 * Math.PI / 180;
        }
    } 
   
    // gunshotR 銃撃右---------------------------------------------------------------
    if(this._motionIndex == 204){
        if(this._allAnimationCount == 1){
            AudioManager.playSe({"name":"ETC gunreload","volume":100,"pitch":100,"pan":0});
        }
        this.anchor.x = 40/48;
        this.anchor.y = 27/32;
        this.x = -$DOT*10;
        this.y = -$DOT*10;
        if(this._allAnimationCount <= 12){
            this._pattern = 0;
        }else if(this._allAnimationCount <= 18){
            this._pattern = 1;
        }else if(this._allAnimationCount <= 24){
            this._pattern = 2;
        }else if(this._allAnimationCount <= 30){
            this._pattern = 0;
        }else{
            this._motionIndex = 0;
        }
    }
   
    // gunshotRmiss 銃撃右ミス---------------------------------------------------------------
    if(this._motionIndex == 206){
        if(this._allAnimationCount == 1){
            AudioManager.playSe({"name":"ETC gunreload","volume":100,"pitch":100,"pan":0});
        }
        this.anchor.x = 40/48;
        this.anchor.y = 27/32;
        this.x = -$DOT*10;
        this.y = -$DOT*10;
        this._pattern = 0;
    }
    //smashUpper スマッシュアッパー
    if(this._motionIndex == 210){
        // ガンブレード -------------------------------------------------
        if((!this._exImage&&this._weaponImageId == 8)||
                this._exImage == "Gunblade1"){  
                this.anchor.x = 2/48;
                this.anchor.y = 30/32;
            if(this._allAnimationCount < 3){
                this._pattern = 0;
                this.scale.y = -1;
                this.x = 0;
                this.y = -6;
            }else if(this._allAnimationCount <= 6){
                this._pattern = 0;
                this.scale.y = -1;
                this.rotation = 90 * Math.PI / 180;
                this.x = -2;
                this.y = -8;
            }else{
                this._pattern = 0;
                this.scale.y = -1;
                this.rotation = 135 * Math.PI / 180;
                this.x = -2;
                this.y = -26;
            }
        }
        //槍 -------------------------------------------------
        else if((!this._exImage&&(this._weaponImageId == 11||this._weaponImageId == 12))||
        this._exImage == "Spire1"||this._exImage == "Spire2"||this._exImage == "Lance1"||
        this._exImage == "Lance2"){
            this.anchor.x = 44/48;
            this.anchor.y = 27/32;
            this._pattern = 0;
            if(this._allAnimationCount < 3){
                this.rotation = 225 * Math.PI / 180;
                this.x = $DOT*4;
                this.y = -$DOT*12;
            }else if(this._allAnimationCount <= 6){
                this.rotation = 315 * Math.PI / 180;
                this.x = $DOT*4;
                this.y = -$DOT*12;
            }else{
                this.rotation = 0 * Math.PI / 180;
                this.x = -$DOT*0;
                this.y = -$DOT*18;
            }
        }
        //両手剣 -------------------------------------------------
        else if((!this._exImage&&this._weaponImageId == 3)||
                this._exImage == "Claymore1"){
            this.anchor.x = 44/48;
            this.anchor.y = 27/32;
            if(this._allAnimationCount < 3){
                this._pattern = 0;
                this.rotation = 90 * Math.PI / 180;
                this.x = $DOT*4;
                this.y = $DOT*34;
            }else if(this._allAnimationCount <= 6){
                this._pattern = 0;
                this.rotation = 180 * Math.PI / 180;
                this.x = -$DOT*44;
                this.y = $DOT*2;
            }else{
                this._pattern = 2;
                this.rotation = 0 * Math.PI / 180;
                this.x = -$DOT*8;
                this.y = -$DOT*20;
            }
        }else{
            if(this._allAnimationCount < 3){
                this._pattern = 0;
                this.scale.y = -1;
                this.x = -$DOT*1;
                this.y = -$DOT*11;
            }else if(this._allAnimationCount <= 6){
                this._pattern = 0;
                this.scale.y = -1;
                this.rotation = 90 * Math.PI / 180;
                this.x = $DOT*3;
                this.y = -$DOT*7;
            }else{
                this._pattern = 0;
                this.scale.y = -1;
                this.rotation = 135 * Math.PI / 180;
                this.x = -$DOT*39;
                this.y = $DOT*12;
            }
        }
    }

    //strongSlash 強斬り
    if(this._motionIndex == 211){
        // ガンブレード -------------------------------------------------
        if((!this._exImage&&this._weaponImageId == 8)||
                this._exImage == "Gunblade1"){
            if(this._allAnimationCount <= 4){
                this._pattern = 0;
                this.x = $DOT*2;
                this.y = -$DOT*20;
                this.anchor.x = 0;
                this.anchor.y = 1;
                this.rotation = 0 * Math.PI / 180;
            }else if(this._allAnimationCount <= 8){
                this._pattern = 1;
                this.x = $DOT*0;
                this.y = $DOT*-6;
                this.anchor.x = 1;
                this.anchor.y = 1;
                this.rotation = 0 * Math.PI / 180;
            }else if(this._allAnimationCount <= 12){
                this._pattern = 2;
                this.x = $DOT*0;
                this.y = $DOT*-2;
                this.anchor.x = 1;
                this.anchor.y = 1;
                this.rotation = 0 * Math.PI / 180;
            }else{
                this._pattern = 0;
                this.rotation = 180 * Math.PI / 180;
                this.x = $DOT*0;
                this.y = $DOT*-8;
                this.anchor.x = 0;
                this.anchor.y = 1;
            }
        }
        //槍 -------------------------------------------------
        else if((!this._exImage&&(this._weaponImageId == 11||this._weaponImageId == 12))||
        this._exImage == "Spire1"||this._exImage == "Spire2"||this._exImage == "Lance1"||
        this._exImage == "Lance2"){
            this.anchor.x = 44/48;
            this.anchor.y = 27/32;
            this._pattern = 0;
            if(this._allAnimationCount < 3){
                this.rotation = 225 * Math.PI / 180;
                this.x = $DOT*4;
                this.y = -$DOT*12;
            }else if(this._allAnimationCount <= 6){
                this.rotation = 315 * Math.PI / 180;
                this.x = $DOT*4;
                this.y = -$DOT*12;
            }else{
                this.rotation = 0 * Math.PI / 180;
                this.x = -$DOT*0;
                this.y = -$DOT*18;
            }
        }
        //両手剣 -------------------------------------------------
        else if((!this._exImage&&this._weaponImageId == 3)||
                this._exImage == "Claymore1"){
            this.anchor.x = 44/48;
            this.anchor.y = 27/32;
            if(this._allAnimationCount < 3){
                this._pattern = 0;
                this.rotation = 90 * Math.PI / 180;
                this.x = $DOT*4;
                this.y = $DOT*34;
            }else if(this._allAnimationCount < 6){
                this._pattern = 0;
                this.rotation = 0 * Math.PI / 180;
                this.x = -$DOT*44;
                this.y = $DOT*2;
            }else{
                this._pattern = 2;
                this.rotation = 0 * Math.PI / 180;
                this.x = -$DOT*8;
                this.y = -$DOT*20;
            }
        }else{
            if(this._allAnimationCount < 3){
                this._pattern = 0;
                this.scale.y = -1;
                this.x = -$DOT*1;
                this.y = -$DOT*11;
            }else if(this._allAnimationCount <= 6){
                this._pattern = 0;
                this.scale.y = -1;
                this.rotation = 90 * Math.PI / 180;
                this.x = $DOT*3;
                this.y = -$DOT*7;
            }else{
                this._pattern = 0;
                this.scale.y = -1;
                this.rotation = 135 * Math.PI / 180;
                this.x = -$DOT*39;
                this.y = $DOT*12;
            }
        }
    }

    //strongSlash 強斬り準備
    if(this._motionIndex == 212){
        // ガンブレード -------------------------------------------------
        if((!this._exImage&&this._weaponImageId == 8)||
                this._exImage == "Gunblade1"){
            this._pattern = 0;
            this.x = $DOT*4;
            this.y = -$DOT*8;
            this.anchor.x = 0;
            this.anchor.y = 1;
            this.rotation = 90 * Math.PI / 180;
        }
        //槍 -------------------------------------------------
        else if((!this._exImage&&(this._weaponImageId == 11||this._weaponImageId == 12))||
        this._exImage == "Spire1"||this._exImage == "Spire2"||this._exImage == "Lance1"||
        this._exImage == "Lance2"){
            this.anchor.x = 44/48;
            this.anchor.y = 27/32;
            this._pattern = 0;
            if(this._allAnimationCount < 3){
                this.rotation = 225 * Math.PI / 180;
                this.x = $DOT*4;
                this.y = -$DOT*12;
            }else if(this._allAnimationCount <= 6){
                this.rotation = 315 * Math.PI / 180;
                this.x = $DOT*4;
                this.y = -$DOT*12;
            }else{
                this.rotation = 0 * Math.PI / 180;
                this.x = -$DOT*0;
                this.y = -$DOT*18;
            }
        }
        //両手剣 -------------------------------------------------
        else if((!this._exImage&&this._weaponImageId == 3)||
                this._exImage == "Claymore1"){
            this.anchor.x = 44/48;
            this.anchor.y = 27/32;
            if(this._allAnimationCount < 3){
                this._pattern = 0;
                this.rotation = 90 * Math.PI / 180;
                this.x = $DOT*4;
                this.y = $DOT*34;
            }else if(this._allAnimationCount < 6){
                this._pattern = 0;
                this.rotation = 0 * Math.PI / 180;
                this.x = -$DOT*44;
                this.y = $DOT*2;
            }else{
                this._pattern = 2;
                this.rotation = 0 * Math.PI / 180;
                this.x = -$DOT*8;
                this.y = -$DOT*20;
            }
        }else{
            if(this._allAnimationCount < 3){
                this._pattern = 0;
                this.scale.y = -1;
                this.x = -$DOT*1;
                this.y = -$DOT*11;
            }else if(this._allAnimationCount <= 6){
                this._pattern = 0;
                this.scale.y = -1;
                this.rotation = 90 * Math.PI / 180;
                this.x = $DOT*3;
                this.y = -$DOT*7;
            }else{
                this._pattern = 0;
                this.scale.y = -1;
                this.rotation = 135 * Math.PI / 180;
                this.x = -$DOT*39;
                this.y = $DOT*12;
            }
        }
    }


    this._allAnimationCount++;
    this.y += this._plusY;
    let w = 0;
    let h = 0;
    if(this._pageId !== 3){
        w = Math.floor(this.bitmap.width / 6);
    }else{
        w = Math.floor(this.bitmap.width / 3);
    }
    h = Math.floor(this.bitmap.height / 6);
    const xa = w*this._pattern+Math.floor((this._weaponImageId-1)%12/6)*w*3;
    const ya = h*((this._weaponImageId-1)%6);
    this.setFrame(xa,ya,w,h);
    //console.log("motionIndex=",this._motionIndex,"rotation=",this.rotation)
    //this.setTransform (this.x, this.y, this.scale.x, this.scale.y, this.rotation);
    this.visible = true;
};

Game_Actor.prototype.hitArrowAnimationId = function(){
    const weapon = this.weapons()[0];
    if(weapon&&weapon.wtypeId == 9){
        return weapon.animationId-2;
    }
    return 718;
}

Game_Actor.prototype.readyBowAnimationId = function(){
    const weapon = this.weapons()[0];
    if(weapon&&weapon.wtypeId == 9){
        switch(weapon.animationId){
            case 717:
                return 1851;
            case 720:
                return 1852;
            case 723:
                return 1853;
            case 726:
                return 1854;
            case 729:
                return 1855;
            case 732:
                return 1856;
            case 735:
                return 1857;
            case 738:
                return 1858;
            case 741:
                return 1859;
        }
    }
    return 1852;
}

Game_Enemy.prototype.readyBowAnimationId = function(){
    return 1852;
}

Game_Actor.prototype.arrowAnimationId = function(){
    const weapon = this.weapons()[0];
    if(weapon&&weapon.wtypeId == 9){
        return weapon.animationId;
    }
    return 720;
}

Game_Enemy.prototype.arrowAnimationId = function(){
    return 720;
}

Sprite_Weapon.prototype.setFrame = function(x,y,w,h) {
    //console.log("Sprite_Weapon setFrame",x,y,w,h);
    this.visible = true;
    Sprite.prototype.setFrame.call(this,x,y,w,h);
};

Sprite_Weapon.prototype.animationWait = function() {
    return 8;
};

BattleManager.startNoDeath = function(){
    for(actor of $gameParty.aliveMembers()){
        //不死身ステート
        actor.addState(3);
    }
    for(enemy of $gameTroop.aliveMembers()){
        //不死身ステート
        enemy.addState(3);
    }
    this._noDeath = true;
}

BattleManager.endNoDeath = function(){
    if(this._noDeath){
        for(actor of $gameParty.members()){
            //不死身ステート
            actor.removeState(3);
        }
        for(enemy of $gameTroop.members()){
            //console.log(enemy.name(),enemy.isAlive());
            if(enemy.isAlive() && enemy.hp<=0){
                enemy.performCollapse();
            }
            //不死身ステート
            enemy.removeState(3);
        }
        this._noDeath = false;
    }
}

Game_Action.prototype.getRandomSkillTargets = function() {
    var targets = [];
    if (this.isForEveryone()) {
        targets.push(...this.targetsForEveryone());
    } else if (this.isForUser()) {
        targets.push(this.subject());
    }else if (this.isForOpponent()) {
        const unit = this.opponentsUnit();
        if (this.isForOne()) {
            targets.push(unit.randomTarget());
        }else{
            targets = unit.aliveMembers();
        }
    } else if (this.isForFriend()) {
        const unit = this.friendsUnit();
        if (this.isForOne()) {
            targets.push(unit.randomTarget());
        }else{
            targets = unit.aliveMembers();
        }
    }
    return this.repeatTargets(targets);
}

BattleManager.startAction = function() {
    var subject = this._subject;
    var action = subject.currentAction();
    if(!action){
        return;
    }
    //防御状態は解除
    subject.removeState(2);
    if (!action.isValid()){
        this._logWindow.startAction(subject, action, targets);
        return;
    }
    //魔封剣可能なスキルタイプ
    const runicableSTypes = [5,6,7,8,9,19,26];
    if(action&&action.item()&&this.runicBattler()&&
        action.isValid()&&
        DataManager.isSkill(action.item())&&
        runicableSTypes.includes(action.item().stypeId)){
        subject.gainMp(Math.floor(-action.item().mpCost*subject.mpRate()))
        this.setRunicedMagic(action.item());
        action.setSkill(107);
    }
    var targets = action.makeTargets();

    if(action.item().meta.rourette){
        targets = this.makeRouretteTargets(targets);
    }
    if(action.item().meta.random){
        //ランダム分岐スキルの場合、ここでスキルを分岐
        action.setRandomSkill();
        targets = action.getRandomSkillTargets();
    }
    if(subject.isStateAffected(57) && targets.length == 1 && targets[0] == this.monomanatedActor()){
        targets[0] = subject;
    }
    //捕捉中は、ターゲットを捕捉相手か自分以外にしかできない
    if(subject.isStateAffected(63)){
        if(!(targets.length == 1&&targets[0] == subject)){
            targets = [subject.shokushed()];
        }
    }
    if(action.item().meta.runicSeal){
       targets = [BattleManager.runicBattler()];
    }
    targets = this.removeJumpingBattler(targets);
    if(action.item().meta.toUndead){
        targets = this.removeNotUndeadBattler(targets);
    }
    if(this._reserveMessage == "封じられている" || this._reserveMessage == "ＭＰが足りない"){
        targets = [];
    }
    //対象をかばう事が可能であれば実行
    if(targets.length > 0 && action.item().damage.elementId == -1 && this.coverableTargets(targets) &&
       //属性に回復を含んでいない
       !action.getElements(action.item(),0).includes(21)){
        targets = this.applyCovering(targets);
    }
    this._phase = "action";
    this._action = action;
    this._targets = targets;
    this.applyLevelTargets(action.item());
    this.setReflectedBattlers();
    //ルーン系武器によるMPコストをリセット
    subject.initLuneCost();
    //HP消費技によるHPコストをリセット
    subject.initHpCost();
    //チェインスキルの場合、チェインが終わるまで不死身にする
    if(action.item().meta.comboTo && action.item().meta.comboTo != "guard"){
        this.startNoDeath();
    }
    subject.cancelMotionRefresh();
    //カウンター時・はなつ時はMPを消費しない・アイテムなら消費
    if((!subject.isReleasing()&&!subject.isCountering())||DataManager.isItem(action.item())){
        //ものまね中はコストが発生しない
        if(!subject.isStateAffected(57)){
            subject.useItem(action.item());
            //調合なら調合アイテムを消費
            if(action.item().meta.chogo){
               subject.consumeChogoMaterials()
            }
            //ショットなら弾薬アイテムを２つ消費
            if(action.item().meta.bullet){
                const id = Number(action.item().meta.bullet);
                const bullet = $dataWeapons[id];
               $gameParty.loseItem(bullet,2);
            }
        }
    }
    //subject.removeState(23);
    //endActionで実施
    //this._action.applyGlobal();
    this.setActionResult(); //リザルトのセットはここ
    var results = this.resultList();
    this.overWriteResultByBullets(results); //弾の残数などの理由で後からリザルトを上書きする処理
    //startActionはアニメーションを流すまでの処理
    //console.log(this.resultList());
    this._logWindow.startAction(subject, action, targets);
};

BattleManager.consumeBullets = function(){ // 弾薬消費
    const consumes = this._action.numConsumeBullets(); //左手、右手のそれぞれの弾丸消費量
    const subject = this._action.subject();
    if(subject.isEnemy()){
        return;
    }
    const weapons = subject.weapons();
    if(weapons.length == 0){
        return; //武器の装備がなければ終了
    }
    if(weapons.length == 1){
        for(let i = 0;i<consumes[0];i++){
            if($gameParty.hasItem(weapons[0])){
                $gameParty.loseItem(weapons[0], 1);   
            }else if(weapons[0]) {
                subject.discardEquip(weapons[0]);
            }
        }
    }
    if(weapons.length == 2){
        for(let i = 0;i<consumes[0];i++){
            if($gameParty.hasItem(weapons[0])){
                $gameParty.loseItem(weapons[0], 1);   
            }else if(weapons[0]) {
                subject.discardEquip(weapons[0]);
                break;
            }
        }
        for(let i = 0;i<consumes[1];i++){
            if($gameParty.hasItem(weapons[1])){
                $gameParty.loseItem(weapons[1], 1);   
            }else if(weapons[1]) {
                subject.discardEquip(weapons[1]);
                break;
            }
        }
    }
}

BattleManager.overWriteResultByBullets = function(results){ //弾薬が正常に消費できない場合はリザルトを改変する
    const subject = this._action.subject();
    if(subject.isEnemy()){
        return;
    }
    const weapons = subject.weapons();
    var overWrited = false;
    var consumes = this._action.numConsumeBullets(); //左手、右手のそれぞれの弾丸消費量
    if(weapons.length == 0){
        return; //武器の装備がなければ終了
    }
    //ものまね中なら終了
    if(subject.isStateAffected(57)){
        return;
    }

    //リザルトの改変
    for(let i = 0;i<results.length;i++){
        var result = results[i];
        //通常攻撃系スキル
        if(this._action.item().damage.elementId == -1){
            //二刀流じゃない場合
            if(weapons.length == 1 && consumes[0] > 0){
                const num = $gameParty.numItems(weapons[0])+1;
                if(num < i+1){
                    result.missed = true;
                    overWrited = true;
                }
            }
            
            //二刀流
            if(weapons.length == 2 && consumes[0]+consumes[1] > 0){
                const nums = [$gameParty.numItems(weapons[0])+1,$gameParty.numItems(weapons[1])+1];
                //同じ武器を持つ場合
                if(weapons[0].id == weapons[1].id){
                    if(nums[0]+1 < i+1){
                        result.missed = true;
                        overWrited = true;
                    }
                }else{
                    const num = $gameParty.numItems(weapons[i%2])+1;
                    if(num[i%2] < Math.floor(i/2)+1){
                        result.missed = true;
                        overWrited = true;
                    }
                }
            }

        }
    }

    if(overWrited){
        for(target of this._targets){
            target.sumResults();
        }
    }
}

Game_Action.prototype.numConsumeBullets = function() {
    const results = BattleManager.resultList();
    const subject = BattleManager.subject();
    var consumes = [0,0];
    if(subject.isEnemy()){
        return consumes;
    }
    const weapons = subject.weapons();

    //弾丸消費量の代入
    for(let i = 0;i<results.length;i++){
        //通常攻撃系スキル
        if(this.item().damage.elementId == -1){
            //二刀流かつ奇数なら左手の武器を参照する
            const lefthand = subject.isDualWield() && i%2 == 1;
            if(!lefthand){ //右手
                if(weapons[0] && weapons[0].wtypeId == 22){
                    consumes[0] += 1;
                }
            }else{ //左手
                if(weapons[1] && weapons[1].wtypeId == 22){
                    consumes[1] += 1;
                }
            }
        }
    }
    
    return consumes;
}

BattleManager.applyLevelTargets = function(item){
    //レベル系魔法の場合、適合レベル以外を除外
    if(item.meta.levelMagic){
        const level = Number(item.meta.levelMagic);
        const newTargets = [];
        for(target of this._targets){
            if(target.level%level == 0){
                newTargets.push(target);
            }
        }
        this._targets = newTargets;
    }    
}

BattleManager.removeJumpingBattler = function(targets){
    //console.log(targets);
    var battlers = [];
    if(!targets){
        return battlers;
    }
    for(target of targets){
        //ジャンプ中や隠れているバトラーを除外
        if(!target.isStateAffected(23)||!target.isStateAffected(21)){
            battlers.push(target);
        }
    }
    return battlers;
}

BattleManager.removeNotUndeadBattler = function(targets){
    //console.log(targets);
    var battlers = [];
    for(target of targets){
        //アンデッドのみを対象とするスキルの場合、ゾンビ状態のみのターゲットを残す
        if(target.isStateAffected(36)){
            battlers.push(target);
        }
    }
    return battlers;
}

BattleManager.setJumpAttack = function() {
    const skillId = this._action.item().meta.jump;
    const spire = this._action.item().meta.spire; //フライヤのヤリ
    if(skillId){
       this._subject.setJumpAttack(skillId,this._targets);
    }
    if(spire && this._subject.tp <= 1){
        this._subject.resetJumpAttack();
    }
}

//ジャンプ攻撃のように他のスキルへのチャージに遷移する
BattleManager.setChargeAttack = function() {
    const skillId = this._action.item().meta.chargeAttack;
    if(skillId){
       this._subject.setChargeAttack(skillId,this._targets);
    }
}

//ジャンプ攻撃の処理を流用
Game_Battler.prototype.setChargeAttack = function(skillId,targets) {
    this._landingSkillId = skillId;
    this._landingTargets = targets;
};

BattleManager.makeRouretteTargets = function(targets){
    var target;
    if(targets.length == 0){
        return null;
    }
    target = targets[Math.floor(Math.random() * (targets.length-1))];
    return [target];
}

BattleManager.setReflectedBattlers = function(){
    this._reflectedBattlers = [];
    //DynamicAnimationの条件分岐用に参照できるバトラーがいないと落ちるので適当にアクター0を代入しておく
    this._reflectTowards = [
            $gameParty.members()[0],
            $gameParty.members()[0],
            $gameParty.members()[0],
            $gameParty.members()[0],
            $gameParty.members()[0],
            $gameParty.members()[0],
            $gameParty.members()[0],
            $gameParty.members()[0],
            $gameParty.members()[0]];
    this._firstTargets = [
            $gameParty.members()[0],
            $gameParty.members()[0],
            $gameParty.members()[0],
            $gameParty.members()[0],
            $gameParty.members()[0],
            $gameParty.members()[0],
            $gameParty.members()[0],
            $gameParty.members()[0],
            $gameParty.members()[0]];
    //DynamicAnimationの条件分岐用
    //ターゲット数を記録
    this._targetNum = this._targets.length;
    //DynamicAnimationの条件分岐用
    //反射した回数
    this._reflectCount = 0;
    //命中タイプが反射でないなら何もせず終わる
    if(this._action.item().hitType != 2){
       return;
    }
    for(target of this._targets){
        //18…ﾘﾌﾚｸ
        if(target.isStateAffected(18)){
            this._reflectedBattlers[this._reflectCount] = target;
            this._reflectCount++;
        }
    }
    //反射する前のターゲットを代入する
    for(let i = 0;i < this._targets.length;i++){
        this._firstTargets[i] = this._targets[i];
    }
    //反射したバトラーがいなければ何もせず終わる
    if(this._reflectCount == 0){
        return;
    }else{
        //反射したバトラーをターゲットから削除
        this._targets = this._targets.filter(battler => !battler.isStateAffected(18));
    }
    
    //反射先のターゲットを追加
    for(let i = 0;i<this._reflectCount;i++){
        const battler = this._reflectedBattlers[i];
        //反射したのがアクターかエネミーかで反射先候補を代入
        var candidates;
        if(battler.isActor()){
            candidates = $gameTroop.selectableMembers();
        }else{
            candidates = $gameParty.aliveMembers();   
        }
        const rand = Math.floor(Math.random() * candidates.length);
        this._targets.push(candidates[rand]);
        this._reflectTowards[i] = candidates[rand];
    }
    
}

BattleManager.setActionResult = function() {
    for(target of this._targets){
        this.invokeAction(this._subject, target);
    }
};

BattleManager.updateAction = function() {
    if((!this._subject.isCountering() && this._subject.numActions() === 0) || 
      (this._subject.isCountering() && this._subject.counterActions().length === 0)){
        this._persuiting = false;
    }
    this.endAction();
};

BattleManager.sylphRecoverValue = function(){
    var value = this._sylphValue;
    if(value < 0){
        value = 0;
    }
    if(this.subject().isActor()){
        value /= $gameParty.aliveMembers().length;
    }else{
        value /= $gameTroop.aliveMembers().length;        
    }
    
    return Math.floor(value);
}

//override
BattleManager.endAction = function() {
    if(BattleManager._escaped){
        return;
    }
    var targets = this._targets;
    const item = this._action.item();
    this.consumeBullets(); //弾薬消費
    //console.log(targets,item,this._subject);
    //ターゲットがかばっていたらかばうモーションを終わる
    if(targets.length > 0 && targets[0] && targets[0].isStateAffected(19)){
        targets[0].performCoverEnd();
        //かばうのリセット
        targets[0].resetCovering();
    }
    if(this._reserveMessage){
        BattleManager.pushActiveMessage(this._reserveMessage)
        //console.log("効果がなかったのは:",recentItem.name," 行動者:",this._subject.name());
        this._reserveMessage = ""
    }
    //チェインアクションでなければ不死身を解除
    if(!item.meta.comboTo){
        this.endNoDeath();
    }
    //ロッド折り技なら装備を消費
    if(item.meta.consumeEquip&&!this._subject.isStateAffected(57)){
        const weapon = $dataWeapons[Number(item.meta.consumeEquip)];
        if(this._subject.equips()[0].id == Number(item.meta.consumeEquip)){
            this._subject._equips[0].setObject(null);
        }else if(this._subject.equips()[1].id == Number(item.meta.consumeEquip)){
            this._subject._equips[1].setObject(null);
        }
        BattleManager.pushActiveMessage(weapon.name + "はくだけちった");
    }
    //吸収値を表示
    if(targets.length > 0){
        console.log( this._subject.name(),targets,"setAbsorbPopupTargets")
        this._logWindow.setAbsorbPopupTargets(this._subject,targets);
    }
    //シルフ召喚の回復値のリセット
    this._sylphValue = 0;

    targets = [...new Set(targets)];
    for(target of targets){
        const result = target.result();
        this.applyLearning(target);
        if(result.guardedStates.length > 0&&result.missedStates.length == 0&&result.addedStates.length == 0&&result.removedStates.length == 0||
          (item.damage.type > 0&&item.damage.type <=2&&result.hpDamage == 0&&result.mpDamage == 0&&!result.missed&&!result.evaded)||
          (item.damage.type > 4&&item.damage.type <=6&&result.hpDamage == 0&&result.mpDamage == 0&&!result.missed&&!result.evaded)){
            target.displayGuard(this._logWindow);
        }
        if (!result.missed && !result.evaded) {
            if(item.damage.elementId == -1&&this._subject.isMsDespel()){
                target.applyDespel(target);
            }
            if (result.hpDamage != 0) {
                //ゾンビ状態でなければシルフ効果のダメージに加算
                if(!target.isStateAffected(36)){
                   this._sylphValue += result.hpDamage;
                }
                if(result.golemed){
                    BattleManager.executeDamageGolem(target,result.hpDamage);
                    result.hpAffected = true;
                    target.setNoDamageNockback();
                    if(BattleManager.golemHp(target) <= 0){
                        target.performGolemCollapse(this._action,this._logWindow);
                    }
                }else{
                    //console.log("execute hp damage ",result.hpDamage);
                    this._action.executeHpDamage(target, result.hpDamage);
                }
                this._action.gainAttackDrainedHp(result);
            }
            //console.log(result,result.mpDamage);
            if (result.mpDamage != 0) {
                this._action.executeMpDamage(target, result.mpDamage);
                this._action.gainAttackDrainedMp(result);
                if(target.mp <= 0 && target.isEnemy() && target.enemy().meta.mp0die){
                    target.setHp(0);
                }
            }
            if (this._action.isHpEffect() && result.hpDamage == 0) {
                this._action.executeHpDamage(target, 0);
            }
            if (this._action.isMpEffect() && result.mpDamage == 0) {
                this._action.executeMpDamage(target, 0);
            }
            //物理攻撃がヒットしていたら、睡眠と混乱とあやつられを解除
            if(!result.golemed && (item.damage.elementId == -1 || item.damage.elementId == 1)){
                
                //誘惑の歌効果
                if((target.isActor()&&!$gameTroop.isSingingTempt())||
                (target.isEnemy()&&!$gameParty.isSingingTempt())){
                    target.removeState(8);
                    target.removeState(17);
                }
                //子守歌効果
                if((target.isActor()&&!$gameTroop.isSingingLullaby())||
                (target.isEnemy()&&!$gameParty.isSingingLullaby())){
                    target.removeState(10);
                }
            }
            if(!result.golemed&&!result.wolfed){
                for (const effect of this._action.item().effects) {
                    this._action.applyItemEffect(target, effect);
                }
            }
            if(target.executableFinalAttack()){
                target.setFinalAttack();
            }else if(target._finalAttacking&&target!=this._subject){
                target.removeState(1);
                target.setHp(1);
                target.setFinalAttackSkill(); //ファイナルアタック消失を防ぐ
            }
           target.applyPerformCollapse();
            if(DataManager.isSkill(this._action.item())&&this._action.item().meta.throw){
                this._action.itemEffectAddState(target);
            }
            if(DataManager.isSkill(this._action.item())&&this._action.item().meta.wTypeEffect){
                this._action.itemEffectAddState(target);
            }
        }
        target.reduceAvatar(result.reduceAvatar);
        //ダメージを受けていれば透明解除フラグを立てる
        if((!result.golemed &&!result.wolfed && result.hpDamage != 0) || result.mpDamage != 0 ||
          result.hpRecover != 0 || result.mpRecover != 0 ){        
            target.setRemoveInvisible();
        }
        if(target.settedRemoveInvisible()){
            //console.log(target.name(),"remove vanish",this._action.item().effects)
            const effects = this._action.item().effects.filter(
                trait => trait.code === Game_Action.EFFECT_ADD_STATE
            );
            let states = [];
            for(effect of effects){
                states.push(effect.dataId);
            }
            //console.log("states:",states)
            if(!states.includes(46)){
                target.removeState(46);  
            }
            target.resetSettedRemoveInvisible();
            if(target.result().addedStates.includes(46)){
                target.addState(46);
            }
        }
        //バ系ステート、効果を発揮していたらステート解除
        if(!result.golemed &&!result.wolfed && target._removeBfire){
            target.removeState(50);       
            target._removeBfire = false;            
        }
        if(!result.golemed &&!result.wolfed && target._removeBcold){
            target.removeState(51);       
            target._removeBcold = false;            
        }
        if(!result.golemed &&!result.wolfed && target._removeBthunder){
            target.removeState(52);       
            target._removeBthunder = false;            
        }
        if(!result.golemed &&!result.wolfed && target._removeBwater){
            target.removeState(53);       
            target._removeBwater = false;            
        }
        if(!result.golemed &&!result.wolfed && target._removeBaero){
            target.removeState(54);       
            target._removeBaero = false;            
        }
        if(this._action.item().meta.runicSeal){
           target.removeState(61);
        }
        if(target&&target.isEnemy()){
            this.applySteal(target);
        }
        if(!this._subject.isCountering()){
            if(!((target.isEnemy()&&this._subject.isEnemy())||(target.isActor()&&this._subject.isActor()))){
                target.setCounter(this._action);
            }
            //ダメージを受けていればオートポーションフラグをセット
            if(!result.golemed && result.hpDamage > 0){
                if(target.isActor() && target.hasSkill(292)){
                    target.setAutoPotion();
                }
            }
        }
        //this.showActionResult(this._subject, target);
        this._logWindow.push("displayActionResults",this._subject,target);
        //console.log("clearresults");
        target._popupResults.push({ ...result});
        if(result.drain||result.hpDrain||result.mpDrain){
            const dResult = new Game_ActionResult();
            dResult.hpDamage = -result.hpDrain
            dResult.mpDamage = -result.mpDrain
            this._subject.startRDamagePopup(dResult)
        }
        //ダメージ表示がされないことがあるのでここで対処療法処置
        target.startDamagePopup();
        target.clearResults();
        
        this.setJumpAttack();
        this.setChargeAttack(); //ツインタニアなど他のスキルのチャージへ遷移する技をセット
    
        //TP増加
        this._action.applyItemUserEffect(target);
    }
    
    this.capture(this._targets);
    if(this._action.item().meta.souleater){
       $gameSwitches.setValue(112,true);
    }
    //コモンイベントの実施
    this._action.applyGlobal();
    this._targets = [];
    this._subject.initStepForward();
    if(item.meta.hpConsumeRate){
        var consumeHp = Math.floor(this._subject.mhp * Number(item.meta.hpConsumeRate));
        this._subject.addHpCost(consumeHp);
    }
    if(this._subject.isActor() && this._subject._actions.length <= 0 && this.releaseEnemy() > 0){
        this._subject.resetRelease();
        this.releaseDisappear();
        this.endSummonEffect();
        this.releaseReset();
    }
    //ファイナルアタックによる死亡
    if(!item.meta.comboTo && this._subject._finalAttacking){
        this._subject._finalAttacking = false;
        this._subject.setHp(0);
        this._subject.performCollapse();
        this._subject._counterActions = [];
    }
    if(this._subject._actions.length <= 0 && !this._subject.isCountering()){
        this._subject.chargeReset();
        this._subject.quickReset();
        this._subject.decoyReset();

        if(!this._action.item().meta.noSlipDamage&&
            !this._action.item().meta.comboaction&&
            !this._action.item().meta.comboTo){
            this._subject.regenerateAll();
        }
        BattleManager.endMonomane(this._subject);
    }
    
    //_subjectの挙動がおかしいので監視用
    this._subjected = this._subject;
    this._phase = "turn";
    if ((this._subject.numActions() === 0 && !this._subject.isCountering())||(this._subject.isCountering() && this._subject.counterActions().length <= 0)) {
        //console.log("endBattlerActions");
        this.endBattlerActions(this._subject);
        this._subject = null;
    }
    
};

Game_Battler.prototype.applyPerformCollapse = function(){
    //斬鉄
    if(this.isStateAffected(64)&&this.isEnemy()){
        this.requestEffect("zantetsu");
        AudioManager.playSe({"name":"MZ Sword4 echor","volume":90,"pitch":100,"pan":0})
        return;
    }
    if(this.hp <= 0 && this.isSpriteVisible() && !this.isStateAffected(3)){
        this.performCollapse();
    }
}

//override
//与えたステートの配列を適用
Game_Action.prototype.itemEffectAddState = function(target, effect) {
    //console.log(target.name(),target.result().addedStates);
    for(stateId of target.result().addedStates){
        target.addState(stateId);
    }
    target.result().clearAddedStates();
};

//通常攻撃を含む、通常攻撃派生形のスキルを演出する
BattleManager.addWaitCount = function(count) {
    if(!this._additionalWaitCount){
        this._additionalWaitCount = 0;
    }
    this._additionalWaitCount += count;
}

const _battleManager_getNextSubject = BattleManager.getNextSubject;
BattleManager.getNextSubject = function() {
    if(this.readyCounterBattlers().length > 0){
        return this.readyCounterBattlers()[0];
    }
    return _battleManager_getNextSubject.apply(this,arguments);
};

BattleManager.monomanatedActor = function(){
    return this._monomanatedActor;
}

Game_Actor.prototype.monomaneActions = function(){
    if(!this._monomaneActions){
        this._monomaneActions = [];
    }
    return this._monomaneActions;
}

BattleManager.superMonomanatedActor = function(){
    return this._superMonomanatedActor;
}

Game_Actor.prototype.superMonomaneActions = function(){
    if(!this._superMonomaneActions){
        this._superMonomaneActions = [];
    }
    return this._superMonomaneActions;
}

Game_Action.prototype.isMonomanableAction = function(superMonomane,actor){
    const item = this.item();
    var subject;
    if(actor){
        subject = actor;
    }else{
        subject = BattleManager.subject();
    }
    //追撃とものまねNGアクションは対象外
    if(item.meta.comboAction||item.meta.monomaneNG){
        return false;
    }
    if(superMonomane){
       //オーバードライブ技、リミット技でなけれは対象外
        if(!DataManager.isSkill(item)||!(item.stypeId == 4||item.stypeId == 14)){
            return false;
        }
    }else{
       //オーバードライブ技、リミット技は対象外
        if(DataManager.isSkill(item)&&(item.stypeId == 4||item.stypeId == 14)){
            return false;
        }
    }
    //console.log(subject);
    //カウンター行動・操っているときの行動は対象外
    if(subject.isCountering()||subject.isStateAffected(16)){
       return false;
    }
    return true;
}

Game_Actor.prototype.setMonomaneActor = function(actor){
    this._monomaneActor = actor;
}

Game_Actor.prototype.monomaneActor = function(){
    return this._monomaneActor;
}

//ものまね前のステートを記録
Game_Actor.prototype.pripareMonomaneState = function(){
    //バーサク、カエル、リフレク、魔法剣、浮遊、ミニマム、分身、透明
    const tempStates = [7,14,18,26,35,38,45,46];
    this._tempMonomaneStates = [];
    for(stateId of tempStates){
        if(this.isStateAffected(stateId)){
            this._tempMonomaneStates.push(stateId);
        }
    }
    //分身の数
    this._tempMonomaneAvatarNum = this._avatarNum;
    //魔法剣ID
    this._tempMagicSwordId = this._magicSwordId;
}

//ものまね前の装備を記録
Game_Actor.prototype.pripareMonomaneEquips = function(){
    this._tempMonomaneEquipsIds = [];
    for(i=0;i<6;i++){
        console.log(this.equips()[i])
        if(!this.equips()[i]){
            this._tempMonomaneEquipsIds.push(null)    
        }else{
            this._tempMonomaneEquipsIds.push(this.equips()[i].id);
        }
    }
}

//ものまね前のステートを戻す
Game_Actor.prototype.setPriparedMonomaneState = function(){
    for(stateId of this._tempMonomaneStates){   
        this.addState(stateId);
    }
    //分身の数
    this._avatarNum = this._tempMonomaneAvatarNum;
    //魔法剣ID
    this._magicSwordId = this._tempMagicSwordId;
}

//ものまね対象の装備をコピー
Game_Actor.prototype.setMonomaneEquips = function(actor){
    //console.log(this._equips);
    for(i=0;i<6;i++){
        var item
        if(!actor.equips()[i]){
            item = null;
        }else if((i == 0)||i == 1 && actor.isDualWield()){
            item = $dataWeapons[actor.equips()[i].id];
        }else{
            item = $dataArmors[actor.equips()[i].id];
        }
        this.forceChangeEquip(i,item)
    }
    //console.log(this._equips);
}

//ものまね前の装備に戻す
Game_Actor.prototype.resetMonomaneEquips = function(){
    for(i=0;i<6;i++){
        var item
        if(!this._tempMonomaneEquipsIds[i]){
            item = null;
        }else if((i == 0)||i == 1 && this.isDualWield()){
            item = $dataWeapons[this._tempMonomaneEquipsIds[i]];
        }else{
            item = $dataArmors[this._tempMonomaneEquipsIds[i]];
        }
        this.forceChangeEquip(i,item)
    }
}

Game_BattlerBase.prototype.isDualWield = function() {
    if(this._states.includes(57)&&!this._states.includes(58)&&BattleManager.monomanatedActor()){
       return BattleManager.monomanatedActor().slotType() === 1;
    }
    if(this._states.includes(58)&&BattleManager.superMonomanatedActor()){
       return BattleManager.superMonomanatedActor().slotType() === 1;
    }
    return this.slotType() === 1;
};

BattleManager.startMonomane = function(){
    const subject = this._subject;
    //ものまね前のステートを記録
    subject.pripareMonomaneState();
    //ものまね前の装備を記録
    subject.pripareMonomaneEquips();
    //ものまね状態にする
    subject.addState(57);
    subject.setMonomaneActor(BattleManager.monomanatedActor());
    for(stateId of this._monomaneStates){
        subject.addState(stateId);
    }
    subject.setMonomaneEquips(BattleManager.monomanatedActor());
    subject._actions = [...this.monomanatedActor().monomaneActions()];
    return subject.currentAction();
}

BattleManager.startSuperMonomane = function(){
    const subject = this._subject;
    this._superMonomanating = true;
    //ものまね前のステートを記録
    subject.pripareMonomaneState();
    //ものまね前の装備を記録
    subject.pripareMonomaneEquips();
    //ものまね状態にする
    subject.addState(57);
    //スーパーものまね状態にする
    subject.addState(58);
    subject.setMonomaneActor(BattleManager.superMonomanatedActor());
    for(stateId of this._superMonomaneStates){
        subject.addState(stateId);
    }
    subject.setMonomaneEquips(BattleManager.superMonomanatedActor());
    subject._actions = [...this.superMonomanatedActor().superMonomaneActions()];
    //console.log(this.superMonomanatedActor(),subject._actions[0]);
    return subject.currentAction();
}

BattleManager.endMonomane = function(actor){
    if(!actor.isStateAffected(57)){
        return;
    }
    //ものまね状態を解除する
    actor.removeState(57);
    actor.removeState(58);
    //ものまね前のステートを戻す
    if(this._superMonomanating){
        for(stateId of this._superMonomaneStates){
            actor.removeState(stateId);
        }
    }else{
        for(stateId of this._monomaneStates){
            actor.removeState(stateId);
        }
    }
    this._superMonomanating = false;
    actor.resetMonomaneEquips();
    actor.setPriparedMonomaneState();
}

Game_Battler.prototype.resetMonomane = function(){
    if(!this.isStateAffected(57)){
        return;
    }
    //ものまね状態を解除する
    this.removeState(57);
    this.removeState(58);
    //ものまね前のステートを戻す
    if(BattleManager._superMonomanating){
        for(stateId of BattleManager._superMonomaneStates){
            this.removeState(stateId);
        }
    }else{
        for(stateId of BattleManager._monomaneStates){
            this.removeState(stateId);
        }
    }
    BattleManager._superMonomanating = false;
    this.resetMonomaneEquips();
    this.setPriparedMonomaneState();
}

BattleManager.setMonomaneStates = function(){
    const subject = this._subject;
    //バーサク、カエル、リフレク、魔法剣、浮遊、ミニマム、分身、透明
    const tempStates = [7,14,18,26,35,38,45,46];
    this._monomaneStates = [];
    for(stateId of tempStates){
        if(subject.isStateAffected(stateId)){
            this._monomaneStates.push(stateId);
        }
    }
}

BattleManager.setSuperMonomaneStates = function(){
    const subject = this._subject;
    //バーサク、カエル、リフレク、魔法剣、浮遊、ミニマム、分身、透明
    const tempStates = [7,14,18,26,35,38,45,46];
    this._superMonomaneStates = [];
    for(stateId of tempStates){
        if(subject.isStateAffected(stateId)){
            this._superMonomaneStates.push(stateId);
        }
    }
}

const _Game_BattlerBase_canPaySkillCost = Game_BattlerBase.prototype.canPaySkillCost;
Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
    //console.log("canpayskillcost",this.isStateAffected(57));
    //ものまね状態ならコスト関係なく使用可
    if(this.isStateAffected(57)){
        return true;
    }
    if(skill.stypeId == 34){ //ショットコマンドの場合、対象の弾薬アイテムを2つ持っているか
        console.log(Number(skill.meta.bullet),$gameParty.numItems($dataWeapons[skill.meta.bullet]));
           return $gameParty.numItems($dataWeapons[skill.meta.bullet]) >= 2;
    }
    return _Game_BattlerBase_canPaySkillCost.apply(this,arguments);
};

BattleManager.chainRenzokukenId = function(){
    //return 1133;
    const squallId = 14;
    const sIdList = [1130,1130,1130,1130];
    for(let i=0;i<15;i++){
        sIdList.push(1130)
    }
	if($gameActors.actor(squallId).hasSkill(1131)){
        for(let i=0;i<13;i++){
            sIdList.push(1131)
        }
    }
	if($gameActors.actor(squallId).hasSkill(1132)){
        for(let i=0;i<12;i++){
            sIdList.push(1132)
        }
    }
	if($gameActors.actor(squallId).hasSkill(1133)){
        for(let i=0;i<10;i++){
            sIdList.push(1133)
        }
    }
    return sIdList[Math.floor(Math.random()*sIdList.length)];
}

BattleManager.processForcedAction = function() {
    if (this._actionForcedBattler) {
        if (this._subject) {
            this.endBattlerActions(this._subject);
        }
        this._subject = this._actionForcedBattler;
        this._actionForcedBattler = null;
        this._reserveMessage = ""
        const item = this._subject.currentAction().item()
        if(DataManager.isSkill(item) && (this._subject.isSkillTypeSealed(item.stypeId)||this._subject.isSkillSealed(item))){
            this._reserveMessage = "封じられている"
        }else if(DataManager.isSkill(item) && !this._subject.canPaySkillCost(item)){
            this._reserveMessage = "ＭＰが足りない"
        }
        this.startAction();
        if(BattleManager._targets.length == 0 && this._reserveMessage == ""){
            this._reserveMessage = "効果がなかった"
            //ジャンプはキャンセル
            this._subject.removeState(23)
        }

        this._subject.removeCurrentAction();
    }
};
//override
//追撃・カウンターの設定を行う
BattleManager.processTurn = function() {
    if (BattleManager.checkBattleEnd()) {
        return;
    }
    const subject = this._subject;
    var action = subject.currentAction();
    //console.log(subject.name(),"action:",action,"isVarid:",action.isValid());
    if (action && !this._escaped) {
        if(!subject.isCountering()){
            subject.increaseActionCount();
        }
        if(action.item()&&action.item().meta.monomane&&this._monomanatedActor){
            action = this.startMonomane();
            action.setSubject(subject);
        }
        if(action.item()&&action.item().meta.superMonomane){
            if(this._superMonomanatedActor){
                action = this.startSuperMonomane();
                action.setSubject(subject);
            }else{
                if(this._monomanatedActor){
                    action = this.startMonomane();
                    action.setSubject(subject);
                }
            }
        }/*
        //魔封剣可能なスキルタイプ
        const runicableSTypes = [5,6,7,8,9,19,26];
        if(action.item()&&this.runicBattler()&&
          action.isValid()&&
          DataManager.isSkill(action.item())&&
          runicableSTypes.includes(action.item().stypeId)){
            this.setRunicedMagic(action.item());
            action.setSkill(107);            
        }*/
        //console.log("monomanatedActor:",this._monomanatedActor,"action:",action);
        if(action.item()&&subject.isActor()&&action.isMonomanableAction(false)){
            //ものまね、もしくは混乱でなければものまね対象アクターを更新
            if(!subject.isStateAffected(57)&&!subject.isStateAffected(8)){
                this._monomanatedActor = subject;
                this.setMonomaneStates();
            }
        }
        if(action.item()&&subject.isActor()&&action.isMonomanableAction(true)){
            //ものまねでなければスーパーものまね対象アクターを更新
            if(!subject.isStateAffected(57)&&!subject.isStateAffected(8)){
                this._superMonomanatedActor = subject;
                this.setSuperMonomaneStates();
            }
        }
        if(action.item()&&subject.isActor()&&!subject.isStateAffected(57)&&action.isMonomanableAction(false)){
            this._monomanatedActor = subject;
            this.setMonomaneStates();
            //バーサク状態の場合、ものまね対象行動を更新
            if(subject.isStateAffected(7)){
                subject.setMonomaneActions([action]);
            }
        }
        action.prepare();
        this._reserveMessage = ""
        if(!action.isValid()){
            if(DataManager.isSkill(action.item()) && (this._subject.isSkillTypeSealed(action.item().stypeId)||this._subject.isSkillSealed(action.item().id))){
                this._reserveMessage = "封じられている"
            }else if(DataManager.isSkill(action.item()) && !this._subject.canPaySkillCost(action.item())){
                this._reserveMessage = "ＭＰが足りない"
            }
        }
        this.startAction();
        if(this._reserveMessage == "" && BattleManager._targets.length == 0){
            this._reserveMessage = "効果がなかった"
        }
        
        //追撃の初期化
        if(!this._persuiting && subject.isActor() && action.item() && action.item().damage.elementId == -1){
            subject.initPersuits();
        }
        //投げ時の追撃
        if(!this._persuiting && DataManager.isSkill(action.item()) && action.item().meta.throw){
            subject.initPersuitsByThrow();
        }
        subject.removeCurrentAction();
        if(subject.persuits().length > 0){
            for(skillId of subject.persuits()){
                const persuitAction = new Game_Action(subject, true);
                persuitAction.setSkill(skillId);
                persuitAction.setTarget(action._targetIndex);
                if(subject.isCountering()){
                    subject.pushCounterAction(persuitAction);
                }else{
                    subject._actions.push(persuitAction);
                }
            }
            subject.clearPersuits();
            this._persuiting = true;
        }
        if(action.item() && action.item().meta.comboTo){
            var comboAction = new Game_Action(subject, true);
            var comboId = 0;
            if(action.item().meta.comboTo == "field"){
                comboId = this.fieldAttack();
            }else if(action.item().meta.comboTo == "renzokuken"){
                comboId = this.chainRenzokukenId();
            }else if(action.item().meta.comboTo == "guard" && 
					 subject.isActor() && 
					 subject.hasSkill(300) && 
					 subject.isStateAffected(33)){
                comboId = 111;
            }else{
                comboId = Number(action.item().meta.comboTo);
            }
            if(comboId){
                comboAction.setSkill(comboId);
                if(subject.isCountering()){
                    subject.pushCounterAction(comboAction);
                }else{
                    subject._actions.push(comboAction);
                }
            }
        }
        if(action.item() && action.item().meta.release){
            const comboAction = new Game_Action(subject, true);
            const enemy = $dataEnemies[Number(action.item().meta.release)];
            const skillId = enemy.actions[0].skillId;
            this._relaseTargets = this._targets;
            comboAction.setSkill(skillId);
            comboAction.setTarget(action._targetIndex);
            comboAction._isExpandedScope = action.isExpandedScope();
            comboAction._isReverseTargetSide = action.isReverseTargetSide();
            if(subject.isCountering()){
                subject.pushCounterAction(comboAction);
            }else{
                subject._actions.push(comboAction);
            }
        } 
    } else {
        if((!subject.isCountering() && subject.numActions() > 0) || (subject.isCountering() && subject.counterActions().length > 0)){
            //this._phase = "turn";
        }else{
            this._persuiting = false;
        }
        //console.log("processTurn endAction",action.item().name);
        this.endAction();
        this._comboAction = null;
        this._subject = null;
    }
};

Sprite_Actor.prototype.updateTargetPosition = function() {
    if(this._actor.isResetMoving()){
        this._movementDuration = 0;
        this._actor.initResetMoving();
    }
    if (this._actor.canMove() && BattleManager.isEscaped()) {
        this.retreat();
    } else if (this.shouldStepForward()) {
        this.stepForward();
        //this._actor.initStepForward();
    } else if (!this.inHomePosition()&& !this._actor.isActing() && !this._actor.isCountering() && this._actor.canMove()) {
        //this._weaponSprite._weaponImageId = 0;
        //this._weaponSprite.setFrame(0,0,0,0);
        //this._weaponSprite2._weaponImageId = 0;
        //this._weaponSprite2.setFrame(0,0,0,0);
        this.stepBack();
    }
};

Game_Battler.prototype.startStepForward = function() {
    this._stepForward = true;
    this._resetMoving = true;
};

Game_Battler.prototype.initStepForward = function() {
    this._stepForward = false;
};

Game_Battler.prototype.initResetMoving = function() {
    this._resetMoving = false;
};

Game_Battler.prototype.isResetMoving = function() {
    return this._resetMoving;
};

Sprite_Battler.prototype.shouldStepForward = function() {
    return this._actor._stepForward;
};

Sprite_Actor.prototype.shouldStepForward = function() {
    //return this._actor._stepForward;
	
    return this._actor._stepForward && (this._actor.isActing() || this._actor.isCountering());
};

Window_BattleLog.prototype.performCast = function(subject,action) {
    //コンボからの発動専用スキルならキャストアクションしない
    if(action.item().meta.comboaction&&!action.item().meta.comboCast){
        return;   
    }
    //はなつならキャストアクションしない
    if(BattleManager.releaseEnemy() > 0){
        return;   
    }
    subject.performCast(action,this);
    this.push("waitForMovement");
};

Window_BattleLog.prototype.clearTpbChargeTime = function(battler) {
    battler.clearTpbChargeTime();
};

const _sprite_Actor_stepBack =Sprite_Actor.prototype.stepBack;
Sprite_Actor.prototype.stepBack = function() {
    
    if(this._actor.isRemainAction()){
        //console.log(this._actor._actions);
       return;
    }
    _sprite_Actor_stepBack.apply(this,arguments);
};

Game_Battler.prototype.isRemainAction = function() {
    if(this.isCountering()){
       if(this.counterActions().length > 0){
           return true;
       }
    }else{
       if(this._actions.length > 0 && this._tpbState != "charged"){
           return true;
       }
    }
    return false;
};

//敵の場合はその場でキャストアニメーションを開始
Game_Enemy.prototype.performCast = function(action,logwindow) {
    if(BattleManager._reserveMessage == ""){
        //actionがValidでもfocing中は別途判定が必要
        if(action._forcing && (!this.isReleasing() && !this.isCountering() && !this.canUse(item))){
            //敵の行動を示す点滅
            $gameTemp.requestAnimation([this], 22);
            BattleManager.addWaitCount(30);
        }else{
            var daAction = this.makeDynamicAction($dataSkills[1912],action._forcing);
            logwindow.showDynamicAnimation([target],daAction,false);
        }
    }else{
        //敵の行動を示す点滅
        $gameTemp.requestAnimation([this], 22);
        BattleManager.addWaitCount(30);
    }
    BattleManager.addWaitCount(20);
    if(action.item().stypeId == 7){
        BattleManager.addWaitCount(10);        
    }
    if(action.item().stypeId == 15){
        BattleManager.addWaitCount(10);        
    }
    if(action.item().stypeId == 18){
        BattleManager.addWaitCount(40);        
    }
    if(action.item().stypeId == 4||action.item().stypeId == 14){
        BattleManager.addWaitCount(24);        
    }
};

Game_Actor.prototype.performCast = function(action,logwindow) {
    this.requestMotion('item');
    if(BattleManager._reserveMessage == "" ||(DataManager.isSkill(action.item())&&action.item().tpCost>0)){
        //actionがValidでもfocing中は別途判定が必要
        if(action._forcing && (!this.isReleasing() && !this.isCountering() && !this.canUse(item))){
            BattleManager.addWaitCount(20);    
        }else{
            var daAction = this.makeDynamicAction($dataSkills[1912],action._forcing);
            logwindow.showDynamicAnimation([target],daAction,false);
        }
    }else{
        BattleManager.addWaitCount(20);    
    }
    BattleManager.addWaitCount(20);
    if(action.item().stypeId == 12||action.item().stypeId == 15){
        BattleManager.addWaitCount(20);        
    }
    if(action.item().stypeId == 4||action.item().stypeId == 14||action.item().stypeId == 7){
        BattleManager.addWaitCount(34);        
    }
};

Game_Battler.prototype.displayGuard = function(logwindow) {
    var daAction = this.makeDynamicAction($dataSkills[1921],false);
    logwindow.showDynamicAnimation([this],daAction,false);
};

Game_Enemy.prototype.isDragon = function(enemy){
    if(this.elementRate(13)>1){
        return true;
    }
    return false;
}

Game_Player.prototype.dragonBeatNum = function(){
    if(!this._dragonBeatNum){
        this._dragonBeatNum = 1
        return;
    }
    this._dragonBeatNum = this._dragonBeatNum + 1
    return this._dragonBeatNum;
}

//竜の紋章の威力値
Game_Action.prototype.DSB = function(){
    const dbn = $gamePlayer.dragonBeatNum()
    return Math.floor(Math.min(dbn/4,150));
}

Game_Enemy.prototype.performCollapse = function() {
    Game_Battler.prototype.performCollapse.call(this);
    
    //パーツが分かれているタイプの敵の場合、一緒に戦闘不能とする
    if(this.enemy().meta.parts){
        const partsIds = [];
        for(const text of this.enemy().meta.parts.split(',')){
            partsIds.push(Number(text));
        }
        for(id of partsIds){
            for(parts of $gameTroop.aliveMembers()){
                if(parts._enemyId == id){
                    parts.addState(1);
                    parts.requestEffect("collapse");
                }
            }
        }
    }
    if(this.enemy().meta.fadeoutBgmAtCollapse){
        AudioManager.fadeOutBgm(5);
    }

    switch (this.collapseType()) {
        case 0:
            this.requestEffect("collapse");
            SoundManager.playEnemyCollapse();
            break;
        case 1:
            $gameTemp.requestAnimation([this],959);
            if(this.enemy().meta.LastBoss){
                //$gameTemp.requestAnimation([this],975);
            }
            this.requestEffect("bossCollapse");
            //SoundManager.playBossCollapse1();
            break;
        case 2:
            this.requestEffect("instantCollapse");
            break;
    }

    //戦闘不能になったとき、
    //ボス制御用の敵しか残っていない場合は
    //そちらも戦闘不能とする
    if(this.enemy().meta.bossParts&&$gameTroop.aliveMembers().length == 1){
        for(boss of $gameTroop.aliveMembers()){
            if(boss.enemy().meta.bossSwitch){
                var no = boss.enemy().meta.bossSwitch
                $gameSwitches.setValue(no,true)
            }else{
                boss.addState(1);
                $gameTemp.requestAnimation([boss],959);
                boss.requestEffect("bossCollapse");
            }
        }
    }
};

Sprite_Enemy.prototype.startBossCollapse = function() {
    this._effectDuration = this.bitmap.height*3+180;
    BattleManager.addWaitCount(this._effectDuration);
    this._appeared = false;
};

Sprite_Enemy.prototype.updateBossCollapse = function() {
    if(this._effectDuration/3<=this.bitmap.height){
        this._shake = (this._effectDuration % 2) * 4 - 2;
        this.blendMode = 1;
        this.opacity *= this._effectDuration/3 / (this._effectDuration/3 + 1);
        this.setBlendColor([255, 255, 255, 255 - this.opacity]);
        if (this._effectDuration % 20 === 19) {
            SoundManager.playBossCollapse2();
        }
    }
};

Game_Enemy.prototype.performActionStart = function(action) {
    Game_Battler.prototype.performActionStart.call(this, action);
    //魔法剣の場合、発動アニメーションを再生
    if(action.item().damage.elementId == -1 && this.magicSwordCastAnimationId()){
        $gameTemp.requestAnimation([this],this.magicSwordCastAnimationId());
        BattleManager.addWaitCount(45);
    }else if(!action.item().meta.noCastAction){
        //敵の行動を示す点滅
        $gameTemp.requestAnimation([this], 22);
        BattleManager.addWaitCount(12);
    }
};

const _game_Actor_performActionStart = Game_Actor.prototype.performActionStart;
Game_Actor.prototype.performActionStart = function(action) {
    _game_Actor_performActionStart.apply(this,arguments)
    const item = action.item();
    if(item.damage.elementId != -1 || item.meta.landing || item.meta.DASkill){
        return;
    }
    if(this.canMove()&&action.item()&&!action.item().meta.noCastAction){
        this.performStep(action);
    }
    
    //魔法剣の場合、発動アニメーションを再生しポーズをとる
    if(this.magicSwordCastAnimationId()){
        this.requestMotion('item');
        $gameTemp.requestAnimation([this],this.magicSwordCastAnimationId());
        BattleManager.addWaitCount(45);
    }else{
        //振りモーションの場合は飛び掛かり開始
        const weapons = this.weapons();
        const wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
        const attackMotion = $dataSystem.attackMotions[wtypeId];
        if (attackMotion && attackMotion.type === 1) {
            this.startJump($TILE/2,12);
        }
    }
};

Game_Actor.prototype.performDamage = function() {
    Game_Battler.prototype.performDamage.call(this);
    if (this.isSpriteVisible()) {
        this.requestMotion("damage");
    } else {
        $gameScreen.startShake(5, 5, 10);
    }
    SoundManager.playActorDamage();
};

const _Window_BattleLog_updateWaitCount = Window_BattleLog.prototype.updateWaitCount;
Window_BattleLog.prototype.updateWaitCount = function() {
    _Window_BattleLog_updateWaitCount.apply(this,arguments);
    if (BattleManager._additionalWaitCount > 0) {
        BattleManager._additionalWaitCount -= 1;
        if (this._additionalWaitCount < 0) {
            this._additionalWaitCount = 0;
        }
        return true;
    }
    return false;
};


Game_Battler.prototype.startJump = function(height, duration) {
    this._jumpFrame = duration;
    this._jumpDuration = duration;
    this._jumpHeight = height;
};

Game_Battler.prototype.jumpFrame = function() {
    if(!this._jumpFrame){
        this._jumpFrame = 0;
    }
    return this._jumpFrame;
};

Sprite_Battler.prototype.updateJump = function() {
    const duration = this._battler._jumpDuration;
    const frame = this._battler._jumpFrame;
    const height = this._battler._jumpHeight;
    const p = duration/2;
    const q = height;
    const a = -(q/(p*p));
    if(frame > 0){
        this._jumpY = -(a*((frame-p)*(frame-p))+q);
        this._battler._jumpFrame--;
    }
    if(frame <= 0){
        this._jumpY = 0;
    }
};

const _sprite_Battler_updateMove = Sprite_Battler.prototype.updateMove;
Sprite_Battler.prototype.updateMove = function() {
    _sprite_Battler_updateMove.apply(this,arguments);
    if(this._battler && this._battler.jumpFrame() > 0){
        this.updateJump();
    }
    if(this._battler && this._battler.shakeFrame() > 0){
        this.updateShake();
    }
    if(this._battler && this._battler.nockbackFrame() > 0){
        this.updateNockback();
    }
    
};

const _sprite_Battler_updatePosition = Sprite_Battler.prototype.updatePosition;
Sprite_Battler.prototype.updatePosition = function() {
    _sprite_Battler_updatePosition.apply(this,arguments);
    this.y += this.jumpY();
    this.x += this.shakeX();
    if(this._battler.exHomeUpdateFlag()){
        this.x = this._battler.exHomeX();
        this.y = this._battler.exHomeY();
        if(this.x==0&&this.y==0){
            this.x = this._battler.homeX();
            this.y = this._battler.homeY();
            this._battler.resetExHomeUpdateFlag();
        }
    }
    if(this._battler && this._battler.tonberryStep() > 0){
        this.x += Math.floor(this._battler.tonberryStep());
    }
};

Game_Battler.prototype.homeX = function() {
    const x = this._homeX;
    var stepX = this.stepForward()*8;
    if(this.isActor()){
        stepX *= -1;
    }
    if(this.exHomeX()){
        return this.exHomeX()+stepX;
    }
    return x+stepX;
};

Game_Battler.prototype.exHomeX = function() {
    return this._exHomeX;
};

Game_Battler.prototype.exHomeY = function() {
    return this._exHomeY;
};

Game_Battler.prototype.setExHomeX = function(x) {
    this._exHomeX = x;
};

Game_Battler.prototype.setExHomeY = function(y) {
    this._exHomeY = y;
};

Game_Battler.prototype.exHomeUpdateFlag = function() {
    return this._exHomeUpdateFlag;
};

Game_Battler.prototype.resetExHomeUpdateFlag = function() {
    this._exHomeUpdateFlag = false;
};

Game_Battler.prototype.setExHome = function(x,y) {
    this.setExHomeX(x);
    this.setExHomeY(y);
    this._exHomeUpdateFlag = true;
};

Game_Battler.prototype.setExHomeY = function(y) {
    this._exHomeY = y;
};


Game_Battler.prototype.homeY = function() {
    const y = this._homeY;
    if(this.exHomeY()){
        return this.exHomeY();
    }
    return y;
};

Game_Troop.prototype.stalkerOrder = function(){
    const FAKEID = 393;
    const ORIGID = 392;
    const fakes = this._enemies.filter(enemy => enemy.isAlive()&&enemy._enemyId == FAKEID);
    const orig = this._enemies.filter(enemy => enemy._enemyId == ORIGID)[0];
    var temp = [this._enemies[0],this._enemies[1]]

    //console.log(fakes);
    //console.log(orig);
    fakes.splice(Math.floor(Math.random()*fakes.length),0,orig)
    //console.log(fakes,temp)
    temp = temp.concat(fakes);
    temp = temp.concat(this._enemies.filter(enemy => enemy.isDead()));
    this._enemies = temp;
    console.log("stalkerorder",temp)
}

Game_Battler.prototype.addStepForward = function(value) {
    if(!this._step){
        this._step = 0;
    }
    this._step += value;
};

Game_Battler.prototype.stepForward = function() {
    if(!this._step){
        this._step = 0;
    }
    return this._step;
};

Game_Battler.prototype.resetStepForward = function() {
    this._step = 0;
};


Sprite_Battler.prototype.jumpY = function() {
    return this._jumpY ? this._jumpY : 0;
}

ImageManager.loadWeaponBitmaps = function(battler){
    if(battler.isEnemy()){
        return;
    }
    for(weapon of battler.weapons()){
        if(weapon.meta.image){
            ImageManager.loadSystem("Weapons/"+weapon.meta['image'].split(',')[0]);
        }
    }
    //while(!this.isReady()){}
}

const _window_BattleLog_startAction = Window_BattleLog.prototype.startAction;
Window_BattleLog.prototype.startAction = function (subject, action, targets) {
    const results = BattleManager.resultList();
    const item = action.item();
    if(!item){
        return
    }
    
    //console.log("startAction",action,"subject:",subject.name(),subject.isReleasing() ,subject.isCountering() ,subject.canUse(item));
    var target;
    var step = 0;
    subject.initStepForward();
    if(!subject.isReleasing() && !subject.isCountering() && this._reserveMessage == ""){
        while(true){
            if(DataManager.isSkill(item)&&item.tpCost>0){
                //TP消費技は使用できるものとする
                break;
            }
            if(action._forcing){
                BattleManager._targets = []
            }
            if(!item.meta.noCastAction && !item.meta.landing){
                //アクション名を表示
                if(item.message1 != "none"){
                    this.displayAction(subject,item);
                }
                this.push("waitForMovement");
                //アクターなら前進
                if(subject.isActor()){
                    this.push('performStep',subject,action);
                }
                //キャストアニメ―ションを再生
                this.push('performCast',subject,action);
            }else{
                //DynamicMotionによるZ座標の反映
                this.push('performActionStart', subject, action);
                //アクション名を表示
                if(item.message1 != "none"){
                    this.displayAction(subject,item);
                }
            }
            this.push('performAction', subject, action);
            return;
        }
    }
    //通常攻撃スキルかどうか
    //ジャンプ着地は通常攻撃スキルだが通常攻撃モーションで表示しない
    if(item.damage.elementId == -1 && !item.meta.landing && !item.meta.DASkill){
        //アクション名を表示
        if(item.message1 != "none"){
            this.displayAction(subject,item);
        }
        this.push("waitForMovement");
        ImageManager.loadWeaponBitmaps(subject);
        //敵なら点滅、アクターならとびかかって前進
		if(subject.canMove()){
        	this.push('performActionStart', subject, action);
		}
        //ターゲットがかばっていたらかばうモーションを開始
        if(BattleManager._targets.length > 0 &&BattleManager._targets[0].isStateAffected(19)){
            BattleManager._targets[0].performCoverStart();
        }
        //ターゲットの量だけ繰り返す
        for(let i=0;i<BattleManager._targets.length;i++){
            target = BattleManager._targets[i];
            this.push('performAttack', subject,action, step, target);
            step++;
            if(subject.isDualWield()){
                this.push('performAttack', subject,action, step, target);
                step++;                
            }
        }
        this.push("waitForMovement");
    }else if(!item.meta.noCastAction && !item.meta.landing){
        //アクション名を表示
        if(item.message1 != "none"){
            this.displayAction(subject,item);
        }
        //魔封剣封印なら封じた魔法名を表示
        if(item.message1 == "runic"){
            this.displayAction(subject,BattleManager.runicedMagic());
        }
        this.push("waitForMovement");
        ImageManager.loadWeaponBitmaps(subject);
        //Z座標の調整のため呼び出し(NRP_DynamicMotionMZ)
        this.push('performActionStart', subject, action);
        //アクターなら前進
        if(subject.isActor()){
            this.push('performStep',subject,action);
        }
        //キャストアニメ―ションを再生
        this.push('performCast',subject,action);
        
        if(BattleManager._targets.length > 0){
            _window_BattleLog_startAction.apply(this,arguments);
        }
        console.log("startAction",action.item().name,"subject:",subject.name());
    }else{
        //DynamicMotionによるZ座標の反映
        this.push('performActionStart', subject, action);
        //アクション名を表示
        if(item.message1 != "none"){
            this.displayAction(subject,item);
        }
        ImageManager.loadWeaponBitmaps(subject);
        if(BattleManager._targets.length > 0){
            _window_BattleLog_startAction.apply(this,arguments);
        }
    }
};

const _Spriteset_Battle_loadSystemImages = Spriteset_Battle.prototype.loadSystemImages;
Spriteset_Battle.prototype.loadSystemImages = function() {
    _Spriteset_Battle_loadSystemImages.apply(this,arguments);
    for(actor of $gameParty.members()){
        if(actor.weapons()[0] && DataManager.isWeapon(actor.equips()[0])){
            weapon = actor.weapons()[0];
            if(weapon.meta.image){
                //console.log(weapon.meta['image'].split(',')[0]);
                ImageManager.loadSystem("Weapons/"+weapon.meta['image'].split(',')[0]);
                console.log("LOADED:"+weapon.meta['image'].split(',')[0]);
            }
        }
        if(actor.weapons()[1] && DataManager.isWeapon(actor.equips()[1])){
            weapon = actor.weapons()[1];
            if(weapon.meta.image){
                //console.log(weapon.meta['image'].split(',')[0]);
                ImageManager.loadSystem("Weapons/"+weapon.meta['image'].split(',')[0]);
                console.log("LOADED:"+weapon.meta['image'].split(',')[0]);
            }
        }
    }
    ImageManager.loadSystem("Blocking1");
};

BattleManager.setPerformingActionItemWhileLongRange = function(item){
    this._performingActionItemWhileLongRange = item;
}

BattleManager.performingActionItemWhileLongRange = function(){
    return this._performingActionItemWhileLongRange;
}

Game_Actor.prototype.performAttack = function(action, step, target, logwindow) {
    var wtypeId;
    var weapon;
    var weaponEximage;
    var weaponExId;
    const result = BattleManager.resultList()[step];
    BattleManager.setPerformingActionItemWhileLongRange(action.item()); //遠距離攻撃時のアニメーションID参照用
    
    //二刀流であれば、奇数ステップが左手攻撃になる
    if(this.isDualWield()&& step%2 == 1){
        if(this.equips()[0] != null && this.weapons().length > 1){
            weapon = this.weapons()[1];
        }else if(this.equips()[1] == null){
            weapon = null
        }else if(this.weapons().length > 0){
            weapon = this.weapons()[0];            
        }
    }else{
        if(this.equips()[0] != null){
            weapon = this.weapons()[0];
        }else{
            weapon = null
        }
    }
    wtypeId = weapon ? weapon.wtypeId : 0;
    if(weapon && $dataWeapons[weapon.id].meta.image){
        weaponEximage = $dataWeapons[weapon.id].meta['image'].split(',')[0];
        weaponExId = $dataWeapons[weapon.id].meta['image'].split(',')[1];
    }
    
    const attackMotion = $dataSystem.attackMotions[wtypeId];
    if (attackMotion) {
        //二刀流及び偶数ステップなら左手攻撃モーションを実行
        if(this.isDualWield()&& step%2 == 1){
            if(weapon && weapon.meta.onion){
                this.requestMotion('onionL');
                BattleManager.addWaitCount(32);                
            } else if(weapon && weapon.wtypeId == 22){
                if(result.missed || result.evaded){
                    this.requestMotion('gunshotLmiss');
                }else{
                    this.requestMotion('gunshotL');
                }
                BattleManager.addWaitCount(20);
            }else if (attackMotion.type === 0) {
                this.requestMotion('skill');
            } else if (attackMotion.type === 1) {
                this.requestMotion('spell');
            } else if (attackMotion.type === 2) {
                this.requestMotion('missile');
            }
            this._lefthandWeaponShow = true;  
        }else{
            if(weapon && weapon.meta.onion){
                this.requestMotion("onion");
                BattleManager.addWaitCount(32);
            } else if(weapon && (weapon.wtypeId == 4||weapon.wtypeId == 5)){
                this.requestMotion("claymore");
            } else if(weapon && weapon.wtypeId == 22){
                if(result.missed || result.evaded){
                    this.requestMotion('gunshotRmiss');
                }else{
                    this.requestMotion('gunshotR');
                }
                BattleManager.addWaitCount(20);             
            } else if(attackMotion.type === 0) {
                this.requestMotion("thrust");
            } else if (attackMotion.type === 1) {
                this.requestMotion("swing");
            } else if (attackMotion.type === 2) {
                this.requestMotion("missile");
            }
            this._lefthandWeaponShow = false;
        }
        if(!(weapon && this.isEquipWtypeOk(8)&&weapon.meta.tomahawk)){
            if(weaponEximage){
                this._weaponEximage = weaponEximage;
                this.startWeaponAnimation(weaponExId);            
            }else{
                this._weaponEximage = null;
                this.startWeaponAnimation(attackMotion.weaponImageId);
            }
        }
    }
    
    //　命中時
    if(!result.missed && !result.evaded && !result.golemed){
        //弓矢装備かつカエル・ミニマムではない
        if(this.attackAnimationType(false) == "bow" && !this.isStateAffected(14) && !this.isStateAffected(35)){
            if(weapon.wtypeId == 9){
                if(result.critical){
                    var daAction = this.makeDynamicAction($dataSkills[1933],action._forcing);
                }else{
                    var daAction = this.makeDynamicAction($dataSkills[1901],action._forcing);
                }
                logwindow.showDynamicAnimation([target],daAction,false);
            }else if(weapon.wtypeId == 18){
                if(result.critical){
                    var daAction = this.makeDynamicAction($dataSkills[1934],action._forcing);
                }else{
                    var daAction = this.makeDynamicAction($dataSkills[1919],action._forcing);
                }
                logwindow.showDynamicAnimation([target],daAction,false);
            }
        }else{
            //二刀流であれば、奇数ステップが左手攻撃になる
            if(this.isDualWield()&& step%2 == 1){
                if(this.attackAnimationType(true) == "throw" && !this.isStateAffected(14) && !this.isStateAffected(35)){
                    var daAction = this.makeDynamicAction($dataSkills[1904],action._forcing);
                    logwindow.showDynamicAnimation([target],daAction,false);
                }else{
                    const animationId = action.item().animationId == -1 ? this.attackAnimationId2(result.critical) : action.item().animationId;
                    if(result.hpDamage > 0){
                        target.startDamageShake();
                    }
                    $gameTemp.requestAnimation([target], animationId, false);
                }
            }else{
                if(this.attackAnimationType(false) == "throw" && !this.isStateAffected(14) && !this.isStateAffected(35)){
                    var daAction = this.makeDynamicAction($dataSkills[1903],action._forcing);
                    logwindow.showDynamicAnimation([target],daAction,false);                    
                }else{
                    const animationId = action.item().animationId == -1 ? this.attackAnimationId1(result.critical) : action.item().animationId;
                    if(result.hpDamage > 0){
                        target.startDamageShake();
                    }
                    $gameTemp.requestAnimation([target], animationId, false);
                }
            }
        }
        if(result.addedStates.includes(1)){
            $gameTemp.requestAnimation([target], 19, false);
        }
    }// 狼で防いだ
    else if(result.wolfed){
           var daAction = this.makeDynamicAction($dataSkills[295],action._forcing);
            logwindow.showDynamicAnimation([target],daAction,false);
        
    }// ゴーレムで防いだ＆弓矢で攻撃
    else if(result.golemed && this.attackAnimationType(false) == "bow"){
           var daAction = this.makeDynamicAction($dataSkills[1913],action._forcing);
            logwindow.showDynamicAnimation([target],daAction,false);
        
    }else{// 回避時
        if(this.attackAnimationType(false) == "bow" && !this.isStateAffected(14) && !this.isStateAffected(35)){
            
            if(weapon.wtypeId == 9){
               var daAction = this.makeDynamicAction($dataSkills[1902],action._forcing);
                logwindow.showDynamicAnimation([target],daAction,false);
            }else if(weapon.wtypeId == 18){
               var daAction = this.makeDynamicAction($dataSkills[1920],action._forcing);
                logwindow.showDynamicAnimation([target],daAction,false);
            }
        }else{
            //二刀流であれば、奇数ステップが左手攻撃になる
            if(this.isDualWield()&& step%2 == 1){
                if(this.attackAnimationType(true) == "throw" && !this.isStateAffected(14) && !this.isStateAffected(35)){
                    var daAction = this.makeDynamicAction($dataSkills[1906],action._forcing);
                    logwindow.showDynamicAnimation([target],daAction,false);
                }else{
                    AudioManager.playSe({"name":"FF7 cancel","volume":100,"pitch":100,"pan":0});              
                }
            }else{
                if(this.attackAnimationType(false) == "throw" && !this.isStateAffected(14) && !this.isStateAffected(35)){
                    var daAction = this.makeDynamicAction($dataSkills[1905],action._forcing);
                    logwindow.showDynamicAnimation([target],daAction,false);                    
                }else{
                    AudioManager.playSe({"name":"FF7 cancel","volume":100,"pitch":100,"pan":0});      
                }
            }
        }
    }
    
    if(result.evaded && target.isActor()){
        if(target.isWeapon1Block(result.evaRand)){
            var daAction = this.makeDynamicAction($dataSkills[1907],action._forcing);
            logwindow.showDynamicAnimation([target],daAction,false);
            AudioManager.playSe("FF6 guard2");
        }
        if(target.isWeapon2Block(result.evaRand) || target.isSealdBlock(result.evaRand)){
            var daAction = this.makeDynamicAction($dataSkills[1908],action._forcing);
            logwindow.showDynamicAnimation([target],daAction,false);
            AudioManager.playSe("FF6 guard2");
        }
        if(target.isAccessoryBlock(result.evaRand)){
            var daAction = this.makeDynamicAction($dataSkills[1909],action._forcing);
            logwindow.showDynamicAnimation([target],daAction,false);
            AudioManager.playSe("MZ Equip3");
        }
        if(target.isMateriaBlock(result.evaRand)){
            var daAction = this.makeDynamicAction($dataSkills[1910],action._forcing);
            logwindow.showDynamicAnimation([target],daAction,false); 
            AudioManager.playSe("FF6 guard2");
        }
        if(target.isNormalEva(result.evaRand)){
            var daAction = this.makeDynamicAction($dataSkills[1911],action._forcing);
            logwindow.showDynamicAnimation([target],daAction,false);
            AudioManager.playSe("FF6 cancel");
        }
    }
    
    if(result.golemed){
        if(target.isEnemy()){
            var daAction = this.makeDynamicAction($dataSkills[1915],action._forcing);
            logwindow.showDynamicAnimation([target],daAction,false);
           
        }else{
            var daAction = this.makeDynamicAction($dataSkills[1914],action._forcing);
            logwindow.showDynamicAnimation([target],daAction,false);
        }
    }
};

Game_Enemy.prototype.performAttack = function(action, step, target,logwindow){
    const result = BattleManager.resultList()[step];
    if(!result.missed && !result.evaded && !result.golemed){
        const animationId = action.item().animationId == -1 ? this.attackAnimationId1(result.critical) : action.item().animationId;
        if(result.hpDamage > 0){
            target.startDamageShake();
        }
        $gameTemp.requestAnimation([target], animationId, false);
    }
    if(result.wolfed){        
        var daAction = this.makeDynamicAction($dataSkills[295],action._forcing);
        logwindow.showDynamicAnimation([target],daAction,false);
    }else if(result.missed){
        AudioManager.playSe("FF7 cancel");
    }else if(result.evaded && target.isActor()){
        if(target.isWeapon1Block(result.evaRand)){
            var daAction = this.makeDynamicAction($dataSkills[1907],action._forcing);
            logwindow.showDynamicAnimation([target],daAction,false);
            AudioManager.playSe("FF6 guard2");
        }
        if(target.isWeapon2Block(result.evaRand) || target.isSealdBlock(result.evaRand)){
            var daAction = this.makeDynamicAction($dataSkills[1908],action._forcing);
            logwindow.showDynamicAnimation([target],daAction,false);
            AudioManager.playSe("FF6 guard2");
        }
        if(target.isAccessoryBlock(result.evaRand)){
            var daAction = this.makeDynamicAction($dataSkills[1909],action._forcing);
            logwindow.showDynamicAnimation([target],daAction,false);
            AudioManager.playSe("MZ Equip3");
        }
        if(target.isMateriaBlock(result.evaRand)){
            var daAction = this.makeDynamicAction($dataSkills[1910],action._forcing);
            logwindow.showDynamicAnimation([target],daAction,false); 
            AudioManager.playSe("FF6 guard2");
        }
        if(target.isNormalEva(result.evaRand)){
            var daAction = this.makeDynamicAction($dataSkills[1911],action._forcing);
            logwindow.showDynamicAnimation([target],daAction,false);
            AudioManager.playSe("FF7 cancel");
        }
    }
    
    if(result.golemed){
        if(target.isEnemy()){
            var daAction = this.makeDynamicAction($dataSkills[1915],action._forcing);
            logwindow.showDynamicAnimation([target],daAction,false);
           
        }else{
            var daAction = this.makeDynamicAction($dataSkills[1914],action._forcing);
            logwindow.showDynamicAnimation([target],daAction,false);
        }
    }
    
}

//オブジェクトを渡すと、アクションのスキルを作り変えて返す
Game_Battler.prototype.makeDynamicAction = function(item,forcing){
    var action = new Game_Action(this,forcing);
    action.setItemObject(item);
    return action;
}

Window_BattleLog.prototype.performAttack = function(subject,action, step, target) {
    subject.performAttack(action, step, target,this);
    BattleManager.addWaitCount(18);
};

Window_BattleLog.prototype.performStep = function(subject,action) {
    subject.performStep(action);
    BattleManager.addWaitCount(12);
};

Game_Battler.prototype.performStep = function(action) {
    if (!action.isGuard()) {
        this.setActionState("acting");
    }
    //前進
    this.startStepForward();
};

BattleManager.resultList = function(){
    //console.log(this._action)
    const item = this._action.item();
    //ターゲット順のリザルトリストを返す
    var results = []
    //アニメーションが今何段目かの情報を初期化
    for(target of this._targets){
        target.resetAtkrcvCount();
    } 
    //リザルトを代入
    for(target of this._targets){
        results.push(target._results[target._atkrcvCount]);
        target.atkrcvCountUp();
        //二刀流ならさらにもう1回
        if(this._subject.isDualWield()&&item.damage.elementId == -1){
            results.push(target._results[target._atkrcvCount]);
            target.atkrcvCountUp();
        }
    } 
    return results;
}

//ターン終了時ではなく、アクション終了時にスリップダメージ/回復を適用する
Game_Battler.prototype.onTurnEnd = function() {
    //this.clearResult();
    //this.regenerateAll();
    this.updateStateTurns();
    this.updateBuffTurns();
    this.removeStatesAuto(2);
};

//毒・リジェネのダメージ以外は処理しない
Game_Battler.prototype.regenerateHp = function() {
    const result = new Game_ActionResult();
    //const value = Math.max(Math.floor(this.mhp * this.hrg), minRecover);
    const value = Math.round(this.calcRegenRecover() - this.calcPoisonDamage());
    //console.log(this.name(),"regenerateHp",this.calcPoisonDamage())
    if (value !== 0) {
        this.gainHp(value);
        result.hpAffected = true;
        result.hpDamage = -value;
        this.startRDamagePopup(result);
        if(this.hp <= 0){
            this.performCollapse();
        }
    }
};

Game_Battler.prototype.calcPoisonDamage = function() {
    let value = 0;
    if(this.isStateAffected(4)){ //毒状態ならダメージ
        value = this.mhp * this.poisonDamageRate();
        value = value * this.elementRate(10);
        if(this.isStateAffected(36) && value > 0){ //ゾンビ状態ならダメージ反転
            value = -value;
        }
    }
    if(this.isStateAffected(26)){ //魔法剣のHP消費を適用
        value += this.mhp * this.magicSwordHpConsumeRate();
    }
    value += this.hpCost(); // HP消費を反映
    return value;
};

Game_Battler.prototype.calcRegenRecover = function() {
    let value = 0;
    if(this.isStateAffected(15)){ //リジェネ状態なら回復
        value = this.mhp * this.regenRecoverRate();
        if(this.isStateAffected(36)){ //ゾンビ状態ならダメージ反転
            value = -value;
        }
    }
    return value;
};

Game_Enemy.prototype.poisonDamageRate = function(){
    //ステート有効度の半分がダメージレートとなる
    return this.stateRate(4)/2;
}

Game_Actor.prototype.poisonDamageRate = function(){
    return 0.1;
}

Game_Enemy.prototype.regenRecoverRate = function(){
    return 0.01;
}

Game_Actor.prototype.regenRecoverRate = function(){
    return 0.1;
}

Game_Battler.prototype.regenerateMp = function() {
    var value = Math.floor(this.mmp * this.mrg);
    value -= this.luneCost();
    const result = new Game_ActionResult();
    if (value !== 0) {
        this.gainMp(value);
        result.mpAffected = true;
        result.mpDamage = -value;
        this.startRDamagePopup(result);
    }
};

// 行動結果以外のダメージ表示をする
Game_Battler.prototype.startRDamagePopup = function(result) {
    if(!this._popupResults){
        this._popupResults = [];
    }
    this._popupResults.push(result);
    this.startDamagePopup();
    /*if(!this._rDamageResults){
        this._rDamageResults = [];
    }
    this._rDamageResults.push(result);*/
};

const _Sprite_Battler_setupDamagePopup = Sprite_Battler.prototype.setupDamagePopup;
Sprite_Battler.prototype.setupDamagePopup = function() {
    _Sprite_Battler_setupDamagePopup.apply(this,arguments);
    if(!this._battler._rDamageResults){
        return;
    }
    if (this._battler._rDamageResults.length > 0) {
        if (this._battler.isSpriteVisible()) {
            this.createRDamageSprite();
        }
    }
    
};

Sprite_Battler.prototype.createRDamageSprite = function() {
    const last = this._damages[this._damages.length - 1];
    const sprite = new Sprite_Damage();
    if (last) {
        sprite.x = last.x;
        sprite.y = last.y;
    } else {
        sprite.x = this.x + this.damageOffsetX();
        sprite.y = this.y + this.damageOffsetY();
    }
    sprite.setupRdamage(this._battler);
    this._damages.push(sprite);
    this.parent.addChild(sprite);
};

Sprite_Damage.prototype.setupRdamage = function(target) {
    const result = target._rDamageResults.shift();
    if (result.hpAffected) {
        this._colorType = result.hpDamage >= 0 ? 0 : 1;
        this.createDigits(result.hpDamage);
    } else if (target.isAlive() && result.mpDamage !== 0) {
        this._colorType = result.mpDamage >= 0 ? 2 : 3;
        this.createDigits(result.mpDamage);
    }
};

// -------------------------------------------------------------------------
// 行動結果によってアニメーションを変化させるため、
// アニメーションを表示してから行動結果を計算するのではなく、
// 行動結果を計算してからアニメーションを表示させ、その後に行動結果を表示させるようにする。

BattleManager.invokeNormalAction = function(subject, target) {
    const realTarget = this.applySubstitute(target);
    this._action.apply(realTarget);
};

BattleManager.invokeCounterAttack = function(subject, target) {
    const action = new Game_Action(target);
    action.setAttack();
    action.apply(subject);
};

BattleManager.invokeMagicReflection = function(subject, target) {
    this._action._reflectionTarget = target;
    this._logWindow.displayReflection(target);
    this._action.apply(subject);
};

BattleManager.showActionResult = function(subject, target) {
    this._logWindow.push("pushBaseLine");
    
    if (Math.random() < this._action.itemCnt(target)) {
        this.showCounterAttack(subject, target);
    } else if (Math.random() < this._action.itemMrf(target)) {
        this.showMagicReflection(subject, target);
    } else {
        this.showNormalAction(subject, target);
    }
    subject.setLastTarget(target);
    //target.clearResults();
    this._logWindow.push("popBaseLine");
};

BattleManager.showNormalAction = function(subject, target) {
    const realTarget = this.applySubstitute(target);
    this._logWindow.displayActionResults(subject, realTarget);
};

BattleManager.showCounterAttack = function(subject, target) {
    const action = new Game_Action(target);
    this._logWindow.displayCounter(target);
    this._logWindow.displayActionResults(target, subject);
};

BattleManager.showMagicReflection = function(subject, target) {
    this._logWindow.displayActionResults(target, subject);
};

BattleManager.displayBattlerStatus = function(battler, current) {
    this._logWindow.displayAutoAffectedStatus(battler);
    if (current) {
        this._logWindow.displayCurrentState(battler);
    }
    //this._logWindow.displayRegeneration(battler);
};

BattleManager.setGolem = function(battler,hp) {
    if(battler.isActor()){
      $gameParty.setGolem(hp);
    }else{
      $gameTroop.setGolem(hp);        
    }
};

Game_Unit.prototype.setGolem = function(hp) {
    if(hp>0){
        this._golem = true;
    }else{
        this._golem = false;
    }
    this._golemHp = hp;
}

BattleManager.golem = function(battler) {
    if(battler.isActor()){
      return $gameParty.golem();
    }else{
      return $gameTroop.golem();
    }
};

Game_Unit.prototype.golem = function() {
    return this._golem;
}

BattleManager.golemHp = function(battler) {
    if(battler.isActor()){
      return $gameParty.golemHp();
    }else{
      return $gameTroop.golemHp();
    }   
};

Game_Unit.prototype.golemHp = function() {
    return this._golemHp;
}

BattleManager.executeDamageGolem = function(battler,damage) {
    if(battler.isActor()){
      $gameParty.executeDamageGolem(battler,damage);
    }else{
      $gameTroop.executeDamageGolem(battler,damage);
    }
    
};

Game_Unit.prototype.executeDamageGolem = function(battler,damage) {
    this._golemHp -= damage;
    if(this._golemHp <= 0){
       this.removeGolem();
    }
}

Game_Battler.prototype.performGolemCollapse = function(action,logwindow) {
    const id = this.isActor() ? 1916 : 1917;
    var daAction = this.makeDynamicAction($dataSkills[id],action._forcing);
    logwindow.showDynamicAnimation([target],daAction,false);
    BattleManager.addWaitCount(60);
}

Game_Unit.prototype.removeGolem = function() {
    this._golem = false;
}



//-----------------------------------------------------------------------------
// Game_Action
//
// ・回避乱数、HPダメージ、MPダメージを参照できるように

// override
/*
Game_Action.prototype.apply = function(target) {
    const result = target.result();
    this.subject().clearResult();
    result.clear();
    result.used = this.testApply(target);
    result.missed = result.used && Math.random() >= this.itemHit(target);
    result.evaRand = Math.random(); // 回避乱数
    result.evaded = !result.missed && result.evaRand < this.itemEva(target);
    result.physical = this.isPhysical();
    result.drain = this.isDrain();
    target.reduceAvator(result.reduceAvator);
    if (result.isHit()) {
        if (this.item().damage.type > 0) {
            result.critical = Math.random() < this.itemCri(target);
            if(this.isHpEffect()){
                result.hpDamage = value;
            }
            if(this.isMpEffect()){
                result.mpDamage = value;
            }
            const value = this.makeDamageValue(target, result.critical);
            this.executeDamage(target, value);
        }
        for (const effect of this.item().effects) {
            this.applyItemEffect(target, effect);
        }
    }
    this.updateLastTarget(target);
};*/

//行動の結果を代入させる
//
//複雑なので、バフ・デバフなどは従来の処理にし、ここで結果の代入はしない。
/*
Game_Action.prototype.setResult = function(target) {
    //console.log("setResult");
    const result = target.result();
    //this.subject().clearResult();
    result.clear();
    result.used = this.testApply(target);
    result.missed = result.used && Math.random() >= this.itemHit(target);
    result.evaRand = Math.random(); // 回避乱数
    result.evaded = !result.missed && result.evaRand < this.itemEva(target);
    result.physical = this.isPhysical();
    result.drain = this.isDrain();
    if (result.isHit()) {
        if (this.item().damage.type > 0) {
            result.critical = Math.random() < this.itemCri(target);
            const value = this.makeDamageValue(target, result.critical);
            if(this.isHpEffect()){
                result.hpDamage = value;
            }
            if(this.isMpEffect()){
                result.mpDamage = value;
            }
        }
        for (const effect of this.item().effects) {
            this.setItemResult(target, effect, result);
        }
    }
    target.addResult(result);
    this.updateLastTarget(target);
};*/
/*
const _Game_Action_isMpEffect = Game_Action.prototype.isMpEffect;
Game_Action.prototype.isMpEffect = function() {
    var value = _Game_Action_isMpEffect.apply(this,arguments);
    return value || action.getElements(action.item(),0).includes(29);
};

const _Game_Action_isHpEffect = Game_Action.prototype.isHpEffect;
Game_Action.prototype.isMpEffect = function() {
    var value = _Game_Action_isHpEffect.apply(this,arguments);
    return value || !action.getElements(action.item(),0).includes(29);
};*/

Game_Action.prototype.setItemResult = function(target, effect, result,handside) {
    switch (effect.code) {
        case Game_Action.EFFECT_RECOVER_HP:
            //リザルトを参照できるようにするため
            this.itemResultSetRecoverHp(target, effect,result);
            break;
        case Game_Action.EFFECT_RECOVER_MP:
            //リザルトを参照できるようにするため
            this.itemResultSetRecoverMp(target, effect,result);
            break;
        case Game_Action.EFFECT_ADD_STATE:
            //リザルトを参照できるようにするため
            this.itemResultSetAddState(target, effect,result,handside);
            break;
    }
};

Game_Action.prototype.itemResultSetRecoverHp = function(target, effect,result) {
    let value = (target.mhp * effect.value1 + effect.value2) * target.rec;
    if (this.isItem()) {
        value *= this.subject().pha;
    }
    value = Math.floor(value);
    if(this.item().meta.raise&&target.isAlive()){
        value = 0;
    }
    if (value !== 0) {
        this.makeSuccess(target);
    }
    result.hpRecover = value;
};

Game_Action.prototype.itemResultSetRecoverMp = function(target, effect,result) {
    let value = (target.mmp * effect.value1 + effect.value2) * target.rec;
    if (this.isItem()) {
        value *= this.subject().pha;
    }
    value = Math.floor(value);
    if (value !== 0) {
        this.makeSuccess(target);
    }
    result.mpRecover = value;
};

Game_Action.prototype.itemResultSetAddState = function(target, effect,result,handside) {
    if (effect.dataId === 0) {
        //通常攻撃によるステート付与
        this.itemResultSetAddAttackState(target, effect,result,handside);
    } else {
        //
        this.itemResultSetAddNormalState(target, effect,result);
    }
};

Game_Actor.prototype.attackStates = function(handside) {
    var weapon;
    if(this.weapons().length == 1 && handside == 0 && this.equips()[0] != null){
        weapon = this.weapons()[0];
    }
    if(this.weapons().length == 1 && handside == 1 && this.equips()[0] == null){
        weapon = this.weapons()[1];
    }
    if(this.weapons().length == 2){
        weapon = this.weapons()[handside];
    }
    if(!weapon){
        return [];
    }
    const traits = weapon.traits.filter(trait => trait.code === Game_BattlerBase.TRAIT_ATTACK_STATE);
    if(this.attackStateMagicSword()){
       traits.push(this.attackStateMagicSword());
    }
    return traits;
};

Game_Enemy.prototype.attackStates = function() {
    const traits = this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_STATE);
    if(this.attackStateMagicSword()){
       traits.push(this.attackStateMagicSword());
    }
    return traits;
};

//魔法剣による状態異常
Game_Battler.prototype.attackStateMagicSword = function() {
    if(this.isStateAffected(26)){
        const stateId = Number($dataSkills[this.magicSwordId()].meta.msState);
        if(stateId){
            return {code:21,dataId:stateId,value1:1};
        }
    }
};

Game_Action.prototype.itemResultSetAddAttackState = function(target,effect,result,handside) {
    for (const trait of this.subject().attackStates(handside)) {
        let chance = trait.value;
        if(!chance){
            chance = 1;
        }
        const stateId = trait.dataId;
        chance *= target.stateRate(stateId);
        //毒状態は敵側なら耐性が無ければ必ず有効
        if(stateId == 4 && target.stateRate(4) > 0 && target.isEnemy()){
            chance = 1;
        }
        //スリップ状態は耐性が無ければ必ず有効
        if(stateId == 42 && target.stateRate(42) > 0){
            chance = 1;
        }
        //死の宣告は耐性が無ければ必ず有効
        if(stateId == 39 && target.stateRate(39) > 0){
            chance = 1;
        }
        //透明状態の場合、耐性が無ければ必ず有効
        if(target.isStateAffected(46) && target.stateRate(stateId) > 0 && !target.isStateResist(stateId)){
            chance = 1;
        }
        //ステートに耐性がある場合、確率も０扱いとする
        if(target.isStateResist(stateId)){
            chance = 0;
        }
        //ギガフレア状態の場合、耐性関係なしに必ず有効
        if(target.isStateAffected(74)){
            chance = 1;
        }
        //ステートをかけようとした時点で透明解除のフラグが成立
        target.setRemoveInvisible();
        var rand = Math.random();
        //乱数が確率より低ければ加えたステート配列にpush
        if (Math.random() < chance) {
            this.makeSuccess(target);
            result.addedStates.push(stateId);
        //確率が０なら防いだステート配列にpush
        }else if(chance <= 0){
            result.guardedStates.push(stateId);
        //ステートを回避しても確率が１でもあればミスしたステート配列にpush
        }else{
            result.missedStates.push(stateId);        
        }
    }
};

Game_Action.prototype.itemResultSetAddAttackStateByWeapon = function(target,result,weapon) {
        const traits = weapon.traits.filter(trait => trait.code === Game_BattlerBase.TRAIT_ATTACK_STATE);
        for (const trait of traits) {

            let chance = 1;
            const stateId = trait.dataId;
            chance *= target.stateRate(stateId);
            //毒状態は耐性が無ければ必ず有効
            if(stateId == 4 && target.stateRate(4) > 0){
                chance = 1;
            }
            //スリップ状態は耐性が無ければ必ず有効
            if(stateId == 42 && target.stateRate(42) > 0){
                chance = 1;
            }
            //死の宣告は耐性が無ければ必ず有効
            if(stateId == 39 && target.stateRate(39) > 0){
                chance = 1;
            }
            //透明状態の場合、耐性が無ければ必ず有効
            if(target.isStateAffected(46) && target.stateRate(stateId) > 0 && !target.isStateResist(stateId)){
                chance = 1;
            }
            //ステートに耐性がある場合、確率も０扱いとする
            if(target.isStateResist(stateId)){
                chance = 0;
            }
            chance *= target.stateRate(stateId);
            //ステートをかけようとした時点で透明解除のフラグが成立
            target.setRemoveInvisible();
            //乱数が確率より低ければ加えたステート配列にpush
            if (Math.random() < chance) {
                this.makeSuccess(target);
                result.addedStates.push(stateId);
            //確率が０なら防いだステート配列にpush
            }else if(chance <= 0){
                result.gurdedStates.push(stateId);
            //ステートを回避しても確率が１でもあればミスしたステート配列にpush
            }else{
                result.missedStates.push(stateId);        
            }
        }
};

Game_Action.prototype.itemResultSetAddNormalState = function(target, effect,result) {
    let chance = effect.value1;
    const stateId = effect.dataId;
    /*if (!this.isCertainHit()) {
        chance *= target.stateRate(stateId);
    }*/
    chance *= target.stateRate(stateId);
    //毒状態は耐性が無ければ必ず有効
    if(stateId == 4 && target.stateRate(4) > 0 && target.isEnemy()){
        chance = 1;
    }
    //スリップ状態は耐性が無ければ必ず有効
    if(stateId == 42 && target.stateRate(42) > 0){
        chance = 1;
    }
    //死の宣告は耐性が無ければ必ず有効
    if(stateId == 39 && target.stateRate(39) > 0){
        chance = 1;
    }
    //透明状態の場合、耐性が無ければ必ず有効
    if(target.isStateAffected(46) && target.stateRate(stateId) > 0 && !target.isStateResist(stateId)){
        chance = 1;
    }
    //ステートに耐性がある場合、確率も０扱いとする
    if(target.isStateResist(stateId)){
        chance = 0;
    }
    //console.log(chance);
    //ステートをかけようとした時点で透明解除のフラグが成立
    //console.log("chance:",chance,"target:",target.name())
    target.setRemoveInvisible();
    if (Math.random() < chance) {
        this.makeSuccess(target);
        result.addedStates.push(effect.dataId);
        console.log(target.name(),"added states Ids",result.addedStates)
    }else if(chance <= 0){
        //console.log("guarded")
        result.guardedStates.push(effect.dataId);
    }else{
        //console.log("missed")
        result.missedStates.push(effect.dataId);        
    }
};

//-----------------------------------------------------------------------------
// Game_ActionResult
//
// ・回避乱数、HPダメージ・回復、MPダメージ・回復、加えられた・ミスした・ガードしたステートを参照できるように

const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
Game_ActionResult.prototype.clear = function() {
    _Game_ActionResult_clear.apply(this,arguments);
    this.evaRand = 0;
    this.hpDamage = 0;
    this.mpDamage = 0;
    this.hpRecover = 0;
    this.mpRecover = 0;
    this.reduceAvatar = 0;
    this.golemed = false;
    this.addedStates = [];
    this.missedStates = [];
    this.guardedStates = [];
};

Game_ActionResult.prototype.clearAddedStates = function() {
    this.addedStates = [];
};

//-----------------------------------------------------------------------------
// Game_Actor
//
// 回避乱数を渡してどの装備で回避したかを返す

Game_Actor.prototype.isWeapon1Block = function(rand){
    return rand*100 < this.weapon1eva();
};

Game_Actor.prototype.isWeapon2Block = function(rand){
    const evaA = this.weapon1eva();
    return rand*100 > evaA && rand*100 < evaA+this.weapon2eva();    
};

Game_Actor.prototype.isSealdBlock = function(rand){
    const evaA = this.weapon1eva() + this.weapon2eva();
    return rand*100 > evaA && rand*100 < evaA+this.sealdEva();    
};

Game_Actor.prototype.isAccessoryBlock = function(rand){
    const evaA = this.weapon1eva() + this.weapon2eva() + this.sealdEva();
    return rand*100 > evaA && rand*100 < evaA+this.accessoryEva();   
}

Game_Actor.prototype.isMateriaBlock = function(rand){
    const evaA = this.weapon1eva() + this.weapon2eva() + this.sealdEva() + this.accessoryEva();
    return rand*100 > evaA && rand*100 < evaA+this.materiaEva();   
};

Game_Actor.prototype.isNormalEva = function(rand){
    const evaA = this.weapon1eva() + this.weapon2eva() + this.sealdEva() + this.accessoryEva() + this.materiaEva();
    return rand*100 > evaA && rand*100 < this.eva;
};

Game_Actor.prototype.weapon1eva = function(){
    const weapons = this.weapons();
    if(weapons.length < 1){ return 0; };a
    return DataManager.itemxparamSum(weapons[0], 1);
};

Game_Actor.prototype.weapon2eva = function(){
    const weapons = this.weapons();
    if(weapons.length < 2){ return 0; };
    return DataManager.itemxparamSum(weapons[1], 1);
};

Game_Actor.prototype.sealdEva = function(){
    const seald = this.equips()[1];
	console.log(seald)
    if(seald&&DataManager.isArmor(seald)){
        return DataManager.itemxparamSum(seald, 1) + this.licenseShieldPlus();
    }
    return 0;
};

Game_Actor.prototype.accessoryEva = function(){
    const accessory = this.equips()[4];
    if(accessory){
        return DataManager.itemxparamSum(accessory, 1);
    }
    return 0;
}

Game_Actor.prototype.materiaEva = function(){
    const materia = this.equips()[5];
    if(materia){
        return DataManager.itemxparamSum(materia, 1);
    }
    return 0;
};

Game_Actor.prototype.bareHandsAnimationId = function() {
    return 2;
};

//override
//カエル状態・ミニマム状態の時は攻撃アニメーションを変更する
Game_Actor.prototype.attackAnimationId1 = function(critical) {
    const equips = this.equips();
    const weapons = this.weapons();
    if(this.isStateAffected(14)){
        return 24;
    }
    if(this.isStateAffected(35)){
        return 25;
    }
    if(critical){
        if (this.weapons().length == 0 || equips[0] == null) {
            //素手時のクリティカル
            return 3;
        }else if(this.weapons().length > 0 && equips[0] != null){
            if(equips[0].meta.criticalAnimation){
                return equips[0].meta.criticalAnimation;
            }            
        }       
    }
    if(this.isStateAffected(26)){
        var msAnimeId = this.magicSwordAnimationId();
        if(msAnimeId){
            return this.magicSwordAnimationId();
        }
    }
    if (this.weapons().length == 0 || equips[0] == null) {
        //素手時
        return this.bareHandsAnimationId();
    }else if(this.weapons().length > 0 && equips[0] != null){
        const weapons = this.equips();
        if(equips[0]&&equips[0].meta.tomahawk&&this.isEquipWtypeOk(8)){
            return Number(equips[0].meta.tomahawk);
        }
        return equips[0] ? equips[0].animationId : 0;           
    }
};

Game_Actor.prototype.attackAnimationId2 = function(critical) {
    const equips = this.equips();
    const weapons = this.weapons();
    if(this.isStateAffected(14)){
        return 24;
    }
    if(this.isStateAffected(35)){
        return 25;
    }
    if(critical){
        if (this.weapons().length < 2 || equips[1] == null) {
            //素手時のクリティカル
            return 3;
        }else if(this.weapons().length > 1 && equips[1] != null){
            if(equips[1].meta.criticalAnimation){
                return equips[1].meta.criticalAnimation;
            }            
        }       
    }
    if(this.isStateAffected(26)){
        var msAnimeId = this.magicSwordAnimationId();
        if(msAnimeId){
            return this.magicSwordAnimationId();
        }
    }
    if (this.weapons().length < 2 || equips[1] == null) {
        //素手時
        return this.bareHandsAnimationId();
    }else if(this.weapons().length > 1 && equips[1] != null){
        const equips = this.equips();
        if(equips[1]&&equips[1].meta.tomahawk&&this.isEquipWtypeOk(8)){
            return Number(equips[1].meta.tomahawk);
        }
        return equips[1] ? equips[1].animationId : 0;           
    }
};

//武器の攻撃アニメーションタイプを返す
// normal … 斬撃、打撃など移動を伴わない通常タイプ
// arrow … 矢など、直接飛んでいくタイプ
// throw … ブーメランや投擲斧など、弧を描いて飛んでいき戻ってくるタイプ
Game_Actor.prototype.attackAnimationType = function(left) {
    var weapon = left ? this.equips()[1] : this.equips()[0];
    //素手ならノーマル
    if(!weapon){
        return "normal";
    }
    //トマホークタイプの武器かつ投擲武器が装備可能なら投擲モーションに変更
    var typeId = weapon.wtypeId;
    if($dataWeapons[weapon.id].meta['tomahawk'] && this.isEquipWtypeOk(8)){
        return "throw";
    }
    //投擲
    if(typeId == 8){
        return "throw";
    }
    //弓矢・竪琴
    if(typeId == 9||typeId == 18){
        return "bow";
    }
    //どれにも該当しないならノーマル
    return "normal";
};

Game_Enemy.prototype.attackAnimationType = function(left) {
    //とりあえずノーマルだけ
    return "normal";
};

//武器の攻撃モーションタイプを返す
Game_Actor.prototype.attackMotionType = function(left) {
    var weapon = left ? this.equips()[1] : this.equips()[0];
    //素手なら突き
    if(!weapon){
        return "thrust";
    }
    //オニオン
    if(weapon.wtypeId == 17){
        return "onion";
    }
    //軽槍、重槍、爪
    const thrustTypes = [11,12,13];
    if(thrustTypes.includes(weapon.wtypeId)){
        return "thrust";
    }
    //弓矢・竪琴
    if(weapon.wtypeId == 9||weapon.wtypeId == 18){
        return "bow";
    }
    //銃
    /*if(weapon.wtypeId == 22){
        if(left){
            return "gunshotL";
        }else{
            return "gunshotR";
        }
    }*/
    //どれにも該当しないなら振り
    return "swing";
};

const _game_Battler_startWeaponAnimation = Game_Battler.prototype.startWeaponAnimation;
Game_Battler.prototype.startWeaponAnimation = function(weaponImageId) {
    _game_Battler_startWeaponAnimation.apply(this,arguments);
    if(this.isStateAffected(14)||this.isStateAffected(35)){
        this._weaponImageId = 0;
    }
};

//対象までの
Game_Battler.prototype.getBoomelanPoint = function(ax,ay,bx,by,t,length,arc) {
    const tlengthX = (ax-bx)/(length/2);
    const tlengthY = (ay-by)/(length/2);
    const tArcY = arc/(length/4);
    var arcY = arc-tArcY * Math.abs(length/4-t%(length/2));
    if(t < length/2){
        arcY *= -1;
    }
    const x = Math.floor(bx+tlengthX*Math.abs(length/2-t));
    const y = Math.floor(by+tlengthY*Math.abs(length/2-t)+arcY);
    return [x,y];
}

//-----------------------------------------------------------------------------
// Window_BattleLog
//
// 行動結果を計算してからアニメーションを流し、その後に結果を流すように変更する

//ウェイトの削除
Window_BattleLog.prototype.startTurn = function() {
    //this.push("wait");
};

Window_BattleLog.prototype.displayCurrentState = function(subject) {
    const stateText = subject.mostImportantStateText();
    if (stateText) {
        this.push("addText", stateText.format(subject.name()));
        //this.push("wait");
        this.push("clear");
    }
};

const _sprite_Actor_updateMain = Sprite_Actor.prototype.updateMain;
Sprite_Actor.prototype.updateMain = function() {
    _sprite_Actor_updateMain.apply(this,arguments);
    if(this._actor){
        this.setActorHome(this._actor.index());
    }
};

//発動アニメーションID
Game_Action.prototype.castAnimationId = function() {
    var stypeId = this.item().stypeId;
    if(this.item().meta.runicSeal){
        stypeId = BattleManager.runicedMagic().stypeId;
    }
    switch(stypeId){
        case 4: //オーバードライブ
            return 900;
        case 5: //白魔法
            return 200;
        case 6: //黒魔法
            return 300;
        case 7: //時空魔法
            return 400;
        case 8: //青魔法
            return 500;
        case 9: //召喚魔法
            return 169;
        case 10: //暗黒
            return 484;
        case 11: //ブリッツ
            return 1160;
        case 12: //竜技
            return 1958;
        case 13: //武士道
            return 1920;
        case 14: //リミット
            return 567;
        case 15: //必殺技
            return 1807;
        case 16: //戦技
            return 1780;
        case 17: //騎士道
            return 445;
        case 18: //秘技
            return 1390;
        case 19: //魔法剣
            return 240;
        case 24: //魔導(魔導メテオ専用)
            return 400;
        case 25: //弓技
            return 1850;
        case 26: //魔石召喚 召喚と同じ
            return 169;
        case 27: //地形
            return 1342;
    }
    if(this.subject().isEnemy()){
        return 22;
    }
};

//DynamicMotion 左手攻撃の為上書き
/**
 * 【独自】SVキャラクターモーションの実行
 */
Sprite.prototype.startDynamicSvMotion = function(dynamicMotion) {
    const bm = dynamicMotion.baseMotion;
    const dm = dynamicMotion;

    // モーションが取得できなければ終了（アクター専用）
    if (!dm.motion || !this.hasSvMotion()) {
        return;
    }

    // eval参照用
    const a = dm.referenceSubject;
    const subject = bm.getReferenceSubject();
    const b = dm.referenceTarget;
    const repeat = dm.repeat;
    const r = dm.r;

    // モーションリセット
    this._motionCount = 0;
    this._pattern = 0;

    // モーション時間
    this._motionDuration = dm.motionDuration;
    // モーションパターン
    this._motionPattern = dm.motionPattern;
    // モーション開始パターン
    if (dm.motionStartPattern != undefined) {
        this._motionStartPattern = eval(dm.motionStartPattern);
    }

    // attackの場合は武器を振る
    // 左手攻撃を意味するLAttackも追加
    if (dm.motion == "attack" || dm.motion == "LAttack"){
        var weaponId;
        if (dm.weaponId) {
            weaponId = eval(dm.weaponId);
        }
        var weaponType;
        if (dm.weaponType) {
            weaponType = eval(dm.weaponType);
        }
        this._battler.performAttackDynamicMotion(weaponId, weaponType,dm.motion);

    // 通常のモーション
    } else {
        
        // 武器非表示
        if (this._weaponSprite&&this._weaponSprite._motionIndex == 0) {
            this._weaponSprite._weaponImageId = 0;
            this._weaponSprite.updateFrame();
        }
        if (this._weaponSprite2&&this._weaponSprite2._motionIndex == 0) {
            this._weaponSprite2._weaponImageId = 0;
            this._weaponSprite2.updateFrame();
        }
        this.startMotion(dm.motion);
    }
};

//DynamicMotion 左手攻撃の為上書き
/**
 * 【独自】アタックモーション
 */
Game_Battler.prototype.performAttackDynamicMotion = function(weaponId, weaponType,motion) {

    var wtypeId;
    var weapon;
    var weaponEximage;
    var weaponExId;

    // weaponTypeの指定がある場合は優先
    if (weaponType != undefined) {
        wtypeId = weaponType;
    // それ以外は武器ＩＤから取得
    } else {
        var weapons;
        // 武器IDの指定があれば取得
        if (weaponId != undefined) {
            weapons = [$dataWeapons[weaponId]];
        } else {
            weapons = this.weapons();
        }
        //左手攻撃に対応
        //wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
        
        weapon = motion == "attack" ? weapons[0]: weapons[1];
        wtypeId = weapon ? weapon.wtypeId : 0;
        if(weapon && $dataWeapons[weapon.id].meta.image){
            weaponEximage = $dataWeapons[weapon.id].meta['image'].split(',')[0];
            weaponExId = $dataWeapons[weapon.id].meta['image'].split(',')[1];
        }
    }

    var attackMotion = $dataSystem.attackMotions[wtypeId];
    if (attackMotion) {
        if(motion == "attack"){
            if(weapon && weapon.meta.onion){
                this.requestMotion('onion');
                BattleManager.addWaitCount(32);
            } else if(wtypeId == 4||wtypeId == 5){
                this.requestMotion('claymore');
            }  else if(wtypeId == 22){
                this.requestMotion('gunshotR');
                BattleManager.addWaitCount(32);
            } else if (attackMotion.type === 0) {
                this.requestMotion('thrust');
            } else if (attackMotion.type === 1) {
                this.requestMotion('swing');
            } else if (attackMotion.type === 2) {
                this.requestMotion('missile');
            }
            this._lefthandWeaponShow = false;
        }else{
            if(weapon && weapon.meta.onion){
                this.requestMotion('onionL');
                BattleManager.addWaitCount(32);
            } else if(wtypeId == 22){
                this.requestMotion('gunshotL');
                BattleManager.addWaitCount(32);
            }  else if (attackMotion.type === 0) {
                this.requestMotion('skill');
            } else if (attackMotion.type === 1) {
                this.requestMotion('spell');
            } else if (attackMotion.type === 2) {
                this.requestMotion('missile');
            }
            if(weapon){
                this._lefthandWeaponShow = true;
            }
        }
        if(weaponEximage){
            this._weaponEximage = weaponEximage;
            this.startWeaponAnimation(weaponExId);            
        }else{
            this._weaponEximage = null;
            this.startWeaponAnimation(attackMotion.weaponImageId);
        }
    }
};

function toNumber(str, def) {
    return isNaN(str) ? def : +(str || def);
}
const parameters = PluginManager.parameters("NRP_DynamicMotionMZ");
var pDefaultEnemyMotionDuration = toNumber(parameters["defaultEnemyMotionDuration"], 12);

/**
 * ●モーション時間を求める。
 */
BaseMotion.prototype.getDefaultMotionDuration = function (a, motion) {
    var motionDuration;

    // SVモーションが有効な場合（アクターを想定）
    if (a && a.hasSvMotion()) {
        // 一時的にモーションを変更し、標準のモーション速度を取得する。
        let tmp = a._motion;
        // attackの場合は本来のモーションを取得
        if (motion == "attack") {
            var weapons = a._battler.weapons();
            var wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
            var attackMotion = $dataSystem.attackMotions[wtypeId];
            if (attackMotion) {
                if(wtypeId == 17){
                    a._motion = Sprite_Actor.MOTIONS["onion"];
                } else if(wtypeId == 22){
                    a._motion = Sprite_Actor.MOTIONS["gunshotR"];
                } else if (attackMotion.type === 0) {
                    a._motion = Sprite_Actor.MOTIONS["thrust"];
                } else if (attackMotion.type === 1) {
                    a._motion = Sprite_Actor.MOTIONS["swing"];
                } else if (attackMotion.type === 2) {
                    a._motion = Sprite_Actor.MOTIONS["missile"];
                }
            }
        } else if (motion == "LAttack") {
            var weapons = a._battler.weapons();
            var wtypeId = weapons[1] ? weapons[1].wtypeId : 0;
            var attackMotion = $dataSystem.attackMotions[wtypeId];
            if (attackMotion) {
                if(wtypeId == 17){
                    a._motion = Sprite_Actor.MOTIONS["onionL"];
                } else if(wtypeId == 22){
                    a._motion = Sprite_Actor.MOTIONS["gunshotL"];
                } else if (attackMotion.type === 0) {
                    a._motion = Sprite_Actor.MOTIONS["skill"];
                } else if (attackMotion.type === 1) {
                    a._motion = Sprite_Actor.MOTIONS["spell"];
                } else if (attackMotion.type === 2) {
                    a._motion = Sprite_Actor.MOTIONS["missile"];
                }
            }
        } else{
            a._motion = this.motion;
        }
        motionDuration = a.motionSpeed();
        a._motion = tmp; // モーションを戻す

    // それ以外（エネミーを想定）
    // またはフロントビューで無理やりアクターのモーションを指定した場合
    } else {
        // 初期値を設定
        motionDuration = pDefaultEnemyMotionDuration;
    }

    return motionDuration;
};

Sprite_Actor.prototype.setupWeaponAnimation = function() {
    var plusY = 0
    var lefthand = this._actor._lefthandWeaponShow;
    //console.log(this._actor.actorId())
    //console.log($dataActors[this._actor.actorId()])
    if(this._actor.actorId()&&$dataActors[this._actor.actorId()].meta.weaponPlusY){
        plusY = Number($dataActors[this._actor.actorId()].meta.weaponPlusY);
    }
    if (!this.isWeaponMotionRequested()&&this._actor.isWeaponAnimationRequested()) {
       if(lefthand){
           this._weaponSprite2.setup(this._actor.weaponImageId(),this._actor._weaponEximage,plusY);
           this._actor._lefthandWeaponShow = false;
       }else{
           this._weaponSprite.setup(this._actor.weaponImageId(),this._actor._weaponEximage,plusY);
       }
        this._actor.clearWeaponAnimation();
    }
    if (this.isWeaponMotionRequested()) {
        const weapons = this._actor.weapons();
        //console.log(weapons);
        var wtypeId = 0;
        if(!lefthand){
            wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
        }else{
            wtypeId = weapons[1] ? weapons[1].wtypeId : 0;
        }
        var exImage = null;
        if(!lefthand){
            exImage = weapons[0]&&weapons[0].meta['image'] ? weapons[0].meta['image'].split(',')[0] : null;
        }else{
            exImage = weapons[1]&&weapons[1].meta['image'] ? weapons[1].meta['image'].split(',')[0] : null;
        }
        var wimageId = 0;
        if(wtypeId > 0 && !exImage){
           wimageId = $dataSystem.attackMotions[wtypeId].weaponImageId;
        }
        if(exImage){
            if(!lefthand){
                wimageId = Number(weapons[0].meta['image'].split(',')[1]);
            }else{
                wimageId = Number(weapons[1].meta['image'].split(',')[1]);
            }
        }
        if(!this.isLefthandWeaponMotion(this._motion.index)){
            this._weaponSprite2.forceTermination();
            this._weaponSprite.setupWeaponMotion(wimageId,exImage,plusY,this._motion.index,this._actor);
            console.log(this._weaponSprite._forcedwType);
            this._actor._lefthandWeaponShow = false;
            this._actor.clearWeaponAnimation();
            //console.log("setupWeaponMotion",wimageId,exImage,plusY,this._motion.index);
        }else{
            this._weaponSprite.forceTermination();
            this._weaponSprite2.setupWeaponMotion(wimageId,exImage,plusY,this._motion.index,this._actor);
            this._actor._lefthandWeaponShow = true;
            this._actor.clearWeaponAnimation();
        }
        this._weaponMotionRequest = false;
    }
};

Sprite_Actor.prototype.isWeaponMotionRequested = function() {
    if(!this._weaponMotionRequest){
        this._weaponMotionRequest = false;
    }
    return this._weaponMotionRequest;
};

Sprite_Weapon.prototype.setupWeaponMotion = function(weaponImageId,weaponEximage,plusY,motionIndex,actor) {
    this._weaponImageId = weaponImageId;
    this._motionIndex = motionIndex;
    this._exImage = weaponEximage;
    this._animationCount = 0;
    this._allAnimationCount = 0;
    this._pattern = 0;
    this._plusY = plusY;
    this._forcedwType = this.forcedWeaponType(motionIndex,actor);
    this.loadBitmap(weaponEximage);
    //this.setFrame(0,0,0,0);
    //this.updateFrame();
};

Sprite_Weapon.prototype.setup = function(weaponImageId,weaponEximage,plusY) {
    this._weaponImageId = weaponImageId;
    this._motionIndex = 0;
    this._exImage = weaponEximage;
    this._animationCount = 0;
    this._pattern = 0;
    this._plusY = plusY;
    this._allAnimationCount = 0;
    this._forcedwType = 0;
    this.loadBitmap(weaponEximage);
    this.updateFrame();
};

Sprite_Weapon.prototype.loadBitmap = function(weaponEximage) {
    let pageId = Math.floor((this._weaponImageId - 1) / 12) + 1;
    if(this._forcedwType > 0){
        const attackMotion = $dataSystem.attackMotions[this._forcedwType];
        pageId = Math.floor((attackMotion.weaponImageId - 1) / 12) + 1;
        this._weaponImageId = attackMotion.weaponImageId;
        this.bitmap = ImageManager.loadSystem("Weapons" + pageId);
    }
    if (pageId >= 1) {
        if(weaponEximage&&this._forcedwType == 0){
            this.bitmap = ImageManager.loadSystem("Weapons/"+weaponEximage);            
        }else{
            this.bitmap = ImageManager.loadSystem("Weapons" + pageId);
        }
    } else {
        this.bitmap = ImageManager.loadSystem("");
    }
};

Game_Battler.prototype.shouldPopupDamage = function() {
    const result = this._result;
    return (
        result.missed ||
        result.evaded ||
        result.hpAffected ||
        result.hpDamage !== 0 ||
        result.mpDamage !== 0
    );
};

Game_Battler.prototype.onAllActionsEnd = function() {
    //this.clearResult();
    this.removeStatesAuto(1);
    this.removeBuffsAuto();
    this.performActionEnd();
};

Game_Battler.prototype.setNoDamageNockback = function() {
    this._noDamageNockback = true;
};

Game_Battler.prototype.resetNoDamageNockback = function() {
    this._noDamageNockback = false;
};

Game_Battler.prototype.noDamageNockback = function() {
    return this._noDamageNockback;
};

Window_BattleLog.prototype.displayHpDamage = function(target) {
    if (target.result().hpAffected) {
        if (target.result().hpDamage > 0 && !target.result().drain && !target.noDamageNockback()) {
            //this.push("performDamage", target);
        }
        target.resetNoDamageNockback();
        if (target.result().hpDamage < 0) {
            this.push("performRecovery", target);
        }
        this.push("addText", this.makeHpDamageText(target));
    }
};

Scene_Battle.prototype.stop = function() {
    Scene_Message.prototype.stop.call(this);
    if (this.needsSlowFadeOut()) {
        this.startFadeOut(this.slowFadeSpeed(), false);
    } else {
        this.startFadeOut(this.fadeSpeed(), false);
    }
    //this._statusWindow.close();
    this._partyCommandWindow.close();
    this._actorCommandWindow.close();
};

Scene_Battle.prototype.updateStatusWindowVisibility = function() {
    if ($gameMessage.isBusy()) {
        //this._statusWindow.close();
    } else if (this.shouldOpenStatusWindow()) {
        this._statusWindow.open();
        this._statusWindow.show();
    }
    this.updateStatusWindowPosition();
};

Game_Enemy.prototype.damageX = function(){
    if(this.enemy().meta.damageX){
        return Number(this.enemy().meta.damageX);
    }
    return 0;
}

Game_Actor.prototype.damageX = function(){
    return 0;
}

Sprite_Battler.prototype.createDamageSprite = function() {
    const last = this._damages[this._damages.length - 1];
    const sprite = new Sprite_Damage();
    if (last) {
        sprite.x = last.x + 0;
        sprite.y = last.y - 0;
    } else {
        sprite.x = this.x + this.damageOffsetX();
        sprite.y = this.y + this.damageOffsetY();
    }
    if(this._enemy){
        sprite.x+= this._enemy.damageX();
    }
    sprite.setup(this._battler);
    this._damages.push(sprite);
    this.parent.addChild(sprite);
};

Sprite_Battler.prototype.setupDamagePopup = function() {
    if (this._battler.isDamagePopupRequested()) {
        if (this._battler.isSpriteVisible()) {
            this.createDamageSprite();
        }
        this._battler.clearDamagePopup();
        //this._battler.clearResult();
    }
};

Sprite_Enemy.prototype.damageOffsetX = function() {
    var value = Sprite_Battler.prototype.damageOffsetX.call(this);
    if (this._battler.enemy().meta.damagePlusX){
        value += this._battler.enemy().meta.damagePlusX
    }
    return value
};

Sprite_Enemy.prototype.damageOffsetY = function() { 
    var value = Sprite_Battler.prototype.damageOffsetY.call(this);
    if (this._battler.enemy().meta.DamagePlusY){
        value += this._battler.enemy().meta.damagePlusY
    }
    return value
};

Sprite_Damage.prototype.setup = function(target) {
    var result = target.popupResult();
    if(!this._popupwait){
        this._popupwait = 0;
    }
    if(result&&this._popupwait <= 0){
        if(result.missed || result.evaded) {
            this._colorType = 0;
            this.createMiss();
        } else if (result.hpDamage !== 0) {
            this._colorType = result.hpDamage >= 0 ? 0 : 1;
            this.createDigits(result.hpDamage);
        } else if (result.mpDamage !== 0) {
            this._baseRow = 2;
            this.createDigits(result.mpDamage);
        }
        this._popupwait = 20;
    }else if(result && this._popupwait > 0){
        target.unshiftDrainPopupResult(result);
        this._popupwait--;
    }else if(this._popupwait > 0){
        this._popupwait--;
    }
}

Game_Battler.prototype.popupResult = function(){
    if(!this._popupResults){
        this._popupResults = [];
    }
    return this._popupResults.shift();
}

Game_Battler.prototype.unshiftDrainPopupResult = function(result){
    if(!this._drainPopupResult){
       this._drainPopupResults = [];
    }
    this._drainPopupResults.unshift(result);
}

Game_Battler.prototype.pushDrainPopupResult = function(result){
    if(!this._drainPopupResult){
       this._drainPopupResults = [];
    }
    this._drainPopupResults = result;
}

Game_Battler.prototype.drainPopupResult = function(){
    if(!this._drainPopupResults){
       return null;
    }
    return this._drainPopupResults[0];
}

Game_Battler.prototype.shiftDrainPopupResult = function(){
    if(!this._drainPopupResults){
       return null;
    }
    return this._drainPopupResults.shift();
}

BattleManager.applyCommandChange =function(actor){
    //後衛時
    if(actor.isStateAffected(33)){
        actor.addState(32);
        //actor.removeState(33);
    //踏み込み時
    }else if(actor.isStateAffected(31)){
        actor.addState(32);
        //actor.removeState(31);       
    //前衛時
    }else{
        actor.addState(33);
        actor.removeState(32);        
    }
}

BattleManager.applyCommandStep =function(actor){
    //後衛時
    if(actor.isStateAffected(33)){
        actor.addState(31);
        actor.addState(32);
        actor.removeState(33);
    //踏み込み時
    }else if(actor.isStateAffected(31)){
        actor.addState(32);
        actor.removeState(31);
    //前衛時
    }else{
        actor.addState(31);
    }
}

BattleManager.applyStepAttack =function(actor){
    //後衛時
    if(actor.isStateAffected(33)){
        actor.addState(31);
        actor.addState(32);
        actor.removeState(33);
    //踏み込み時
    }else if(actor.isStateAffected(31)){
        
    //前衛時
    }else{
        actor.addState(31);
    }
}

BattleManager.applyStepBackAttack =function(actor){
    //後衛時
    if(actor.isStateAffected(33)){
        actor.addState(31);
        actor.addState(32);
        actor.removeState(33);
    //踏み込み・前衛時
    }else{
        actor.removeState(31);
        actor.removeState(32);        
        actor.addState(33);
    }
}

//DynamicMotionで座標を記録するために使う
Game_Battler.prototype.setTempX = function(value){
    this._tempX = value;
}

Game_Battler.prototype.setTempY = function(value){
    this._tempY = value;
}

Game_Battler.prototype.setTempXY = function(x,y){
    this._tempX = x;
    this._tempY = y;
}

Game_Battler.prototype.tempX = function(){
    return this._tempX;
}

Game_Battler.prototype.tempY = function(){
    return this._tempY;
}

Game_Troop.prototype.indexMember = function(index){
    if(this.members().length <= index){
        //console.log(this._targets[0]);
        return this.members()[0];
    }
    return this.members()[index];
}

BattleManager.indexTarget = function(index){
    if(this._targets.length <= index){
        //console.log(this._targets[0]);
        return this._targets[0];
    }
    //console.log(this._targets[index]);
    return this._targets[index];
}

BattleManager.indexResult = function(index){
    const results = BattleManager.resultList();
    if(results.length <= index){
        return results[0];
    }
    //console.log(this._targets[index]);
    return results[index];
}

//行動回数・バウンティ変数・行動内容のリセット
const _Game_Battler_onBattleStart2 = Game_Battler.prototype.onBattleStart;
Game_Battler.prototype.onBattleStart = function(advantageous) {
    _Game_Battler_onBattleStart2.apply(this,arguments);
    this._actions = [];
    this._counterActions = [];
    this._countering = false;
    $gameVariables.setValue(96, 0);
    this._actionCount = 0;
}

//行動回数を返す
Game_Battler.prototype.actionCount = function(advantageous) {
    return this._actionCount;
}

//行動回数を増やす
Game_Battler.prototype.increaseActionCount = function() {
    this._actionCount = this._actionCount + 1;
}

Game_Unit.prototype.applySixDragon = function(){
    const rand = Math.random()
    for(member of this.targetableMembers()){
        member.setHp(Math.max(Math.floor(member.mhp*rand),1))
    }
}

//ケーツハリー適用
Game_Party.prototype.startQuetzalli = function(){
    for(member of this.aliveMembers()){
        if(member.canMove()&&member!=BattleManager._subject){
            if(!member.isStateAffected(17) //あやつられてない
                ||member.isStateAffected(62) //とらわれてない
                ||member.isStateAffected(23) //ジャンプしてない
                ||member.isStateAffected(21) //隠れてない
                ){
                member.removeState(2); //防御は解除
                member.removeState(7); //バーサクは解除
                member.removeState(8); //混乱は解除
                member.removeState(16); //あやつりは解除
                member.removeState(61); //魔封剣は解除
                member.removeState(72); //必殺剣空は解除
                member.removeState(73); //カウンターは解除
                member.removeState(74); //ギガフレアは解除

                member.setJumpAttack(101,BattleManager._targets);
                member.clearTpbChargeTime();
                member.makeJumpActions();
                member.startTpbCasting();
                member._landingSkillId = null;
                member.addState(23); //ジャンプ開始
            }
        }
    }
}

BattleManager.gainMetamol = function(target){
    if(target.isActor()){
        return;
    }
    var item = target.metamolItem();
    if(!item){
        return;
    }
    BattleManager.pushActiveMessage(item.name + "になるがいい！");
    $gameParty.gainItem(item,1);
}

Game_Enemy.prototype.metamolItem = function(){
    if(this.stateRate(34)==0){
        return null;
    }
    if(this.enemy().meta.metamol){
        const meta = this.enemy().meta.metamol;
        if(meta){
           const type = meta.substr(0,1);
           const id = Number(meta.substr(1,meta.length-1));
           item = this.setStealItem(type,id);
        }else if(this.enemy().dropItems[1]){
            item = this.enemy().dropItems[1];
        }
    }
    return item;
}

Game_Actor.prototype.usedMagicStones = function(){
    if(!this._usedMagicStones){
        this._usedMagicStones = [];
    }
    return this._usedMagicStones;
}

Game_Actor.prototype.resetMagicStones = function(){
    this._usedMagicStones = [];
}

Game_Actor.prototype.useMagicStone = function(id){
    if(!this._usedMagicStones){
        this._usedMagicStones = [];
    }
    this._usedMagicStones.push(id);
}

const _Game_BattlerBase_meetsSkillConditions = Game_BattlerBase.prototype.meetsSkillConditions;
Game_BattlerBase.prototype.meetsSkillConditions = function(skill) {
    var enable;
    if(this.isEnemy()){
        enable = true;
    }else{
        enable = !this.usedMagicStones().includes(skill.id);
    }
    return enable && _Game_BattlerBase_meetsSkillConditions.apply(this,arguments);
};

Game_Battler.prototype.sealdElements = function(){
	const elements = [];
	if(this.isEnemy()){
		return elements;
	}
	const seald = this.equips()[1];
	if(!seald){
		return [];
	}
	if(DataManager.isArmor(seald)){
	   switch(seald.id){
		   case 10: // フレイムシールド
			   elements.push(2); break;
		   case 11: // アイスシールド
			   elements.push(3); break;
		   case 12: // アクアシールド
			   elements.push(5); break;
		   case 13: // らいじんのたて
			   elements.push(4); break;
		   case 14: // ふうじんのたて
			   elements.push(7); break;
		   case 15: // あんこくのたて
			   elements.push(9); break;
		   case 18: // ひかりのたて
			   elements.push(8); break;
	   }
	}else{
		return [];
	}
	return elements;
}

Game_Battler.prototype.sealdAttackAnimationId = function(){
	var seald = this.equips()[1];
	if(!seald){
		return 1908;
	}
	if(DataManager.isArmor(seald)){
	   switch(seald.id){
		   case 10: // フレイムシールド
			   return 1901;
		   case 11: // アイスシールド
			   return 1902;
		   case 12: // アクアシールド
			   return 1904;
		   case 13: // らいじんのたて
			   return 1903;
		   case 14: // ふうじんのたて
			   return 1905;
		   case 15: // あんこくのたて
			   return 1907;
		   case 18: // ひかりのたて
			   return 1906;
		   case 20: // フォースシールド
			   return 1911;
		   case 23: // 英雄の盾
			   return 1910;
		   case 25: // ｱﾀﾞﾏﾝシールド
			   return 1909;
	   }
	}
	return 1908;
}

Game_Battler.prototype.ultimaSealdAnimationId = function(){
	var seald = this.equips()[1];
	if(!seald){
		return 913;
	}
	if(DataManager.isArmor(seald)){
	   switch(seald.id){
		   case 10: // フレイムシールド
			   return 1901;
		   case 11: // アイスシールド
			   return 1902;
		   case 12: // アクアシールド
			   return 1904;
		   case 13: // らいじんのたて
			   return 1903;
		   case 14: // ふうじんのたて
			   return 1905;
		   case 15: // あんこくのたて
			   return 1907;
		   case 18: // ひかりのたて
			   return 1906;
		   case 20: // フォースシールド
			   return 1911;
		   case 23: // 英雄の盾
			   return 1910;
		   case 25: // ｱﾀﾞﾏﾝシールド
			   return 1909;
	   }
	}
	return 913;
}

BattleManager.displayVictoryMessage = function() {
    //BattleManager.OutMessageWindow();
    
    const scene = SceneManager._scene;
    if (scene && scene._messageWindow) {
        scene._messageWindow.x = -10000;
        scene._messageWindow.y = -10000;
    }
    $gameMessage.add(TextManager.victory.format($gameParty.name()));
};

BattleManager.displayDefeatMessage = function() {
    //BattleManager.OutMessageWindow();
    BattleManager.pushActiveMessage("全滅した",180);
    const scene = SceneManager._scene;
    if (scene && scene._messageWindow) {
        scene._messageWindow.x = -10000;
        scene._messageWindow.y = -10000;
    }
    $gameMessage.add(TextManager.defeat.format($gameParty.name()));
    
};

/**
 * NRP_TpbCustomize.jsから【上書】
 * キャスト時間取得
 */
Game_Battler.prototype.tpbRequiredCastTime = function() {
    const actions = this._actions.filter(action => action.isValid());
    const items = actions.map(action => action.item());
    /* 
    var delay = items.reduce((r, item) => r + Math.max(0, -item.speed), 0);
    */
   var delay = 0
   for(item of items){ 
        if(item.speed < 0){
            var addSpeed = -item.speed 
            if(this.isActor() && DataManager.isSkill(item)){
                //アクセル
                if(this.hasSkill(314)){
                    addSpeed /= 2;
                }
                //すばやくしょうかん
                if(this.hasSkill(311) && item.stypeId == 9){
                    addSpeed /= 2;
                }
            }
            delay += addSpeed / items.length
        }
    }
    var newDelay = delay > 100 ? 100 : delay;

    //onsole.log(newDelay)
    return newDelay / 100;
    //return delay / this.tpbSpeed();
    // return Math.sqrt(delay) / this.tpbSpeed();
};

BattleManager.affectedStatesNum = function(members,stateId){
    var num = 0
    for(member of members){
        if(member.isStateAffected(stateId)){
            num++;
        }        
    }
    return num;
}

Game_Battler.prototype.setTargeting = function(targets){
    this._targetedTargets = targets;
}

Game_Battler.prototype.targetedTargets = function(){
    if(!this._targetedTargets){
        this._targetedTargets = [];
    }
    return this._targetedTargets;
}

Game_Battler.prototype.resetTargeting = function(){
    this._targetedTargets = [];
}

Game_Battler.prototype.isChanting = function() {
    if (this.isWaiting()) {
        return this._actions.some(action => action.isMagicSkill() && (action.isSkill() && action.item().stypeId != 22 && action.item().stypeId != 21));
    }
    return false;
};

Game_Battler.prototype.longRangeAttackAnimationId = function(defaultId){
    const item = BattleManager.performingActionItemWhileLongRange();
    if(item.animationId>0){
        return item.animationId
    }else{
        return defaultId;
    }
}

Game_Party.prototype.memoryFormations = function(){
    if(!this._tempFormations){
        this._tempFormations = [0,0,0,0,0];
    }
    for(let i = 0;i < this.members().length;i++){
        this._tempFormations[i] = this.members()[i].isStateAffected(33);
    }
}

Game_Party.prototype.applyFormations = function(){
    if(!this._tempFormations){
        this._tempFormations = [0,0,0,0,0];
    }
    for(let i = 0;i < this.members().length;i++){
        if(this._tempFormations[i]){
            this.members()[i].addState(33);
        }
    }
}

//ラスボス用背景カスタムスクロール
const _Scene_Battle_prototype_update = Scene_Battle.prototype.update
Scene_Battle.prototype.update = function() {
    _Scene_Battle_prototype_update.apply(this,arguments);
    const MaxNeoScrollSpeed = 24
    if($gameSwitches.value(32)){
        if($gameSwitches.value(33)){
            $gameVariables.setValue(78,0);
            $gameVariables.setValue(79,0);
            $gameVariables.setValue(80,0);
            $gameSwitches.setValue(32,false);
        }else{
            if(this.neoScrollCycleX == null){
                this.neoScrollX = 0
                this.neoScrollSpeedX = Math.random()*MaxNeoScrollSpeed
                this.neoScrollCycleX = 120 + Math.random()*150
            }
            if(this.neoScrollCycleY == null){
                this.neoScrollY = 0
                this.neoScrollSpeedY = Math.random()*MaxNeoScrollSpeed
                this.neoScrollCycleY = 120 + Math.random()*150
            }
            if(this.neoScrollCycleColor == null){
                this.neoScrollColor = 0
                this.neoScrollSpeedColor = Math.random()*360
                this.neoScrollCycleColor = 240 + Math.random()*150
            }

            this.neoScrollX = this.neoScrollX+1;
            this.neoScrollY = this.neoScrollY+1;
            this.neoScrollColor = this.neoScrollColor+1;

            var progressX = this.neoScrollX/this.neoScrollCycleX;
            var progressY = this.neoScrollY/this.neoScrollCycleY;
            var progressColor = this.neoScrollColor/this.neoScrollCycleColor;

            $gameVariables.setValue(78,Math.sin(Math.PI * 2 * progressX)*this.neoScrollSpeedX);
            $gameVariables.setValue(79,Math.sin(Math.PI * 2 * progressY)*this.neoScrollSpeedY);
            $gameVariables.setValue(80,Math.sin(Math.PI * 2 * progressColor)*this.neoScrollColor%360);

            if(this.neoScrollCycleX == null){
                this.neoScrollX = 0
                this.neoScrollSpeedX = Math.random()*MaxNeoScrollSpeed
                this.neoScrollCycleX = 120 + Math.random()*150
            }
            if(this.neoScrollCycleY == null){
                this.neoScrollY = 0
                this.neoScrollSpeedY = Math.random()*MaxNeoScrollSpeed
                this.neoScrollCycleY = 120 + Math.random()*150
            }
            if(this.neoScrollCycleColor == null){
                this.neoScrollColor = 0
                this.neoScrollSpeedColor = Math.random()*360
                this.neoScrollCycleColor = 240 + Math.random()*150
            }
        }
    }
    if($gameSwitches.value(33)){
        $gameVariables.setValue(78,Math.min(24,$gameVariables.value(78)-0.05));
    }
};

const _Spriteset_Battle_prototype_update = Spriteset_Battle.prototype.update
Spriteset_Battle.prototype.update = function() {
    _Spriteset_Battle_prototype_update.apply(this,arguments)
    this.updateBackgroundHue1();
}

Spriteset_Battle.prototype.updateBackgroundHue1 = function() {
    if(!$gameSwitches.value(32)){ return }
    if(this._back1Sprite){
        this._back1Sprite._hue = $gameVariables.value(80);
    }
}

BattleManager.debugActionBattlerList = function(battlerb,moving){
    let list = []
    for(battler of this._actionBattlers){
        list.push(battler.name())
    }
    if(!battlerb&&moving == "shift"){
        //console.log(list,"battler is nil:"+moving)
    }else{
        console.log(list,battlerb.name()+moving)
    }
}

//何故かリザルトを戦闘終了後に持ち出してしまう現象が発生するためクリア
const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
Scene_Battle.prototype.terminate = function() {
    _Scene_Battle_terminate.apply(this, arguments);

    $gameParty.clearResults()
    $gameTroop.clearResults()
    //土のクリスタル入手前は特例
    if($gameSwitches.value(44)&&$gameSwitches.value(7)){
        $gameParty.members().forEach(function(actor) {
            actor.recoverAll();
        });
    }
};