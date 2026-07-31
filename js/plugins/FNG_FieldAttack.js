//=============================================================================
// FNG_FieldAttack.js
//=============================================================================

/*:
  * @target MZ
  * @plugindesc 「ちけい」コマンドにより呼び出される技を定義する
  * @author finga
  * @help 「ちけい」コマンドにより呼び出される技を定義する
*/

BattleManager.fieldAttack = function(){
  const floor = $gameVariables.value(1);
  const bg1 = $gameMap.battleback1Name();
  const bg2 = $gameMap.battleback2Name();
  const rand = Math.floor(Math.random()*10);
  const troopId = $gameTroop._troopId;
  const mapId = $gameMap.mapId()

    var id = 1751;
    if(floor < 5){
        if(rand < 4){       id = 1751;
        }else if(rand < 7){ id = 1752;
        }else if(rand < 9){ id = 1753;
        }else{              id = 1754;}
    }else if(floor < 10){
        if(rand < 4){       id = 1755;
        }else if(rand < 7){ id = 1756;
        }else if(rand < 9){ id = 1757;
        }else{              id = 1758;}
    }else if(floor < 16){
        if(rand < 4){       id = 1759;
        }else if(rand < 7){ id = 1760;
        }else if(rand < 9){ id = 1761;
        }else{              id = 1754;}
    }else if(floor < 23){
        if(rand < 4){       id = 1751;
        }else if(rand < 7){ id = 1762;
        }else if(rand < 9){ id = 1752;
        }else{              id = 1763;}
    }else if(floor == 23){
        if(rand < 4){       id = 1759;
        }else if(rand < 7){ id = 1764;
        }else if(rand < 9){ id = 1768;
        }else{              id = 1766;}
    }else if(floor < 29){ //サヌビア砂漠
        if(rand < 4){       id = 1770; //流砂
        }else if(rand < 7){ id = 1772; //砂鉄砲
        }else if(rand < 9){ id = 1752; //真空波
        }else{              id = 1771;}//デザートストーム
    }else if(floor < 35){ //ピラミッド
        if(rand < 4){       id = 1770; //流砂
        }else if(rand < 7){ id = 1759; //鬼火
        }else if(rand < 9){ id = 1769; //スカラベ
        }else{              id = 1775;}//いけにえ
    }else if(floor < 42){ //炎の洞窟
        if(rand < 4){       id = 1760; //鍾乳石
        }else if(rand < 7){ id = 1777; //メテオストライク
        }else if(rand < 9){ id = 1761; //落盤
        }else{              id = 1776;}//水蒸気爆発
    }else if(floor < 47){ //ムーアの大森林
        if(rand < 4){       id = 1751; //かまいたち
        }else if(rand < 7){ id = 1762; //霧
        }else if(rand < 9){ id = 1779; //ブランチアロー
        }else{              id = 1778;}//木の葉乱舞
    }else if(floor < 56){ //バブイルの塔
        if(rand < 4){       id = 1780; //漏電
        }else if(rand < 7){ id = 1781; //マスタードボム
        }else if(rand < 9){ id = 1782; //メタルカッター
        }else{              id = 1783;}//100万ボルト
    }else if(floor < 61){ //地下下水道
        if(rand < 4){       id = 1759; //鬼火
        }else if(rand < 7){ id = 1784; //地震
        }else if(rand < 9){ id = 1761; //落盤
        }else{              id = 1754;}//シャドウフレア
    }else if(floor < 62){ //ビサイド
        if(rand < 4){       id = 1751; //かまいたち
        }else if(rand < 7){ id = 1771; //デザートストーム
        }else if(rand < 9){ id = 1774; //熱砂
        }else{              id = 1763;}//土砂崩れ
    }else if(floor < 69){ //マカラーニャの森
        if(rand < 4){       id = 1751; //かまいたち
        }else if(rand < 7){ id = 1759; //鬼火
        }else if(rand < 9){ id = 1787; //底なし沼
        }else{              id = 1778;}//木の葉乱舞
    }else if(floor < 76){ //船の墓場
        if(rand < 4){       id = 1759; //鬼火
        }else if(rand < 7){ id = 1788; //セントエルモスファイアー
        }else if(rand < 9){ id = 1786; //フェーンファントム
        }else{              id = 1785;}//タイダルウェーブ
    }else if(floor < 77){ //ビッグブリッジ
        if(rand < 4){       id = 1751; //かまいたち
        }else if(rand < 7){ id = 1790; //１まんボルト
        }else if(rand < 9){ id = 1789; //フラッシュレイン
        }else{              id = 1785;}//タイダルウェーブ
    }else if(floor < 83){ //たつまき
        if(rand < 4){       id = 1751; //かまいたち
        }else if(rand < 7){ id = 1790; //１まんボルト
        }else if(rand < 9){ id = 1752; //真空波
        }else{              id = 1791;}//竜巻
    }else if(floor < 89){ //オーエンの塔
        if(rand < 4){       id = 1751; //かまいたち
        }else if(rand < 7){ id = 1780; //漏電
        }else if(rand < 9){ id = 1752; //真空波
        }else{              id = 1784;}//地震
    }else if(floor < 95){ //魔大陸
        if(rand < 4){       id = 1751; //かまいたち
        }else if(rand < 7){ id = 1777; //メテオストライク
        }else if(rand < 9){ id = 1752; //真空波
        }else{              id = 1754;}//シャドウフレア
    }else if(floor < 100){ //アルティミシア城
        if(rand < 4){       id = 1751; //かまいたち
        }else if(rand < 7){ id = 1759; //鬼火
        }else if(rand < 9){ id = 1753; //タイムスリップ
        }else{              id = 1754;}//シャドウフレア
    }else if(floor < 101){ //異次元の塔　上層
        if(mapId == 443 || mapId == 448){
            if(rand < 4){       id = 1751; //かまいたち
            }else if(rand < 7){ id = 1777; //メテオストライク
            }else if(rand < 9){ id = 1761; //落盤
            }else{              id = 1776;}//水蒸気爆発
        }else if(mapId == 447 || mapId == 442){
            if(rand < 4){       id = 1751; //かまいたち
            }else if(rand < 7){ id = 1752; //しんくうは
            }else if(rand < 9){ id = 1761; //らくばん
            }else{              id = 1791;}//竜巻
        }else if(mapId == 441 || mapId == 446){
            if(rand < 4){       id = 1760; //しょうにゅうせき
            }else if(rand < 7){ id = 1752; //しんくうは
            }else if(rand < 9){ id = 1761; //らくばん
            }else{              id = 1754;}//シャドウフレア
        }else if(mapId == 441 || mapId == 446){
            if(rand < 4){       id = 1760; //しょうにゅうせき
            }else if(rand < 7){ id = 1752; //しんくうは
            }else if(rand < 9){ id = 1761; //らくばん
            }else{              id = 1754;}//シャドウフレア
        }else if(mapId == 440 || mapId == 445){
            if(rand < 4){       id = 1770; //流砂
            }else if(rand < 7){ id = 1759; //鬼火
            }else if(rand < 9){ id = 1761; //らくばん
            }else{              id = 1754;}//シャドウフレア
        }else{
            if(rand < 4){       id = 1751; //かまいたち
            }else if(rand < 7){ id = 1780; //漏電
            }else if(rand < 9){ id = 1753; //タイムスリップ
            }else{              id = 1793;}//パニッシュレイ
        }
    }else if(floor < 102){ //異次元の塔　深層
        if(mapId == 452){
            if(rand < 4){       id = 1751; //かまいたち
            }else if(rand < 7){ id = 1780; //漏電
            }else if(rand < 9){ id = 1782; //メタルカッター
            }else{              id = 1781;}//マスタードボム
        }else{
            if(rand < 4){       id = 1751; //かまいたち
            }else if(rand < 7){ id = 1752; //しんくうは
            }else if(rand < 9){ id = 1753; //タイムスリップ
            }else{              id = 1754;}//シャドウフレア
        }
    }else if(floor < 103){ //クリスタルワールド
        if(rand < 4){       id = 1751; //かまいたち
        }else if(rand < 7){ id = 1752; //しんくうは
        }else if(rand < 9){ id = 1792; //流星群
        }else{              id = 1754;}//シャドウフレア
    }

    switch(troopId){
        case 172: //カーバンクル戦
            if(rand < 4){       id = 1770; //流砂
            }else if(rand < 7){ id = 1773; //ジュエルクラッシュ
            }else if(rand < 9){ id = 1769; //スカラベ
            }else{              id = 1754;}//シャドウフレア
            break;
        case 173: //デモンズウォール戦
            if(rand < 4){       id = 1770; //流砂
            }else if(rand < 7){ id = 1759; //鬼火
            }else if(rand < 9){ id = 1769; //スカラベ
            }else{              id = 1754;}//シャドウフレア
            break;
        case 174: //リッチ戦
            if(rand < 4){       id = 1759; //鬼火
            }else if(rand < 7){ id = 1751; //かまいたち
            }else if(rand < 9){ id = 1771; //デザートストーム
            }else{              id = 1774;}//熱砂
            break;
    }

    //id = 1775
    return id;
};

//field masic basic damage
Game_Action.prototype.FMBD = function(target,plusatk) {
    var floor = $gameVariables.value(1);
    if(floor < 1){
        floor = 1;
    }
    const atk = floor/2+15 //階層が深いほど威力がアップする
    const a = this.subject();
    const b = target;
    const ins = floor/5*2;
    var def = b.mdf;
    var value = (atk + plusatk - def)*(45 * floor /256 + 2);
    //行動者がアクターの場合、威力を保障する
    if(a.isActor() && ins > value && value >= 0){
        //基礎ダメージが威力保障以下かつ0以上の場合は威力保障発揮
        value = Math.min(ins,atk);
    }else if(a.isActor() && value < 0 && value + ins > 0){
        //基礎ダメージが0未満の場合は威力保障分を加算
        value = value + ins;
    }
    //const vrate = this.vitrate(b);
    //value = value*(a.mat * floor / 256 + 2) * vrate;
    if(!value){
        value = 1;
    }
    return Math.floor(value);
}

//field physical basic damage
Game_Action.prototype.FPBD = function(target,plusatk) {
    var floor = $gameVariables.value(1);
    if(floor < 1){
        floor = 1;
    }
    const atk = floor/2+15 //階層が深いほど威力がアップする
    const a = this.subject();
    const b = target;
    const ins = floor/5*2;
    var def = b.def;
    var value = (atk + plusatk - def)*(45 * floor /256 + 2);
    //行動者がアクターの場合、威力を保障する
    if(a.isActor() && ins > value && value >= 0){
        //基礎ダメージが威力保障以下かつ0以上の場合は威力保障発揮
        value = Math.min(ins,atk);
    }else if(a.isActor() && value < 0 && value + ins > 0){
        //基礎ダメージが0未満の場合は威力保障分を加算
        value = value + ins;
    }
    //const vrate = this.vitrate(b);
    //value = value*(a.mat * floor / 256 + 2) * vrate;
    if(!value){
        value = 1;
    }
    return Math.floor(value);
}