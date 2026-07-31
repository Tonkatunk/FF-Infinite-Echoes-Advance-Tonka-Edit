//=============================================================================
// ReplaceEndME.js
//=============================================================================

/*:ja
 * @plugindesc ver1.00 各場面でMEの代わりにBGMを演奏します。
 * @author まっつＵＰ
 * 
 * @param victorybgm
 * @desc 勝利時演奏するファイル名
 * @default Battle1
 * 
 * @param defeatbgm
 * @desc 敗北時演奏するファイル名
 * @default Battle2
 * 
 * @param gameoverbgm
 * @desc 全滅時演奏するファイル名
 * @default Battle3
 * 
 * @param volume
 * @desc 音量
 * @default 80
 * 
 * @param pitch
 * @desc ピッチ
 * @default 100
 * 
 * @param pan
 * @desc 位相
 * @default 0
 *
 * @help
 * 
 * RPGで笑顔を・・・
 * 
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 * 
 * パラメータに設定したファイル名と値を確認してご利用ください。
 * 
 * 免責事項：
 * このプラグインを利用したことによるいかなる損害も制作者は一切の責任を負いません。
 * 
 */

(function() {
    
    var parameters = PluginManager.parameters('ReplaceEndME');
    var REMvictorybgm = String(parameters['victorybgm']);
    var REMdefeatbgm = String(parameters['defeatbgm']);
    var REMgameoverbgm = String(parameters['gameoverbgm']);
    var REMvolume = Number(parameters['volume'] || 80);
    var REMpitch = Number(parameters['pitch'] || 100);
    var REMpan = Number(parameters['pan'] || 0);
    
    BattleManager.processVictory = function() {
    $gameParty.removeBattleStates();
    $gameParty.performVictory();
    this.playVictoryMe();
    //this.replayBgmAndBgs();
    //（追加なし）
    this.makeRewards();
    this.displayVictoryMessage();
    this.displayRewards();
    this.gainRewards();
    this.endBattle(0);
    };

    BattleManager.processDefeat = function() {
    this.playDefeatMe(); //追加    
    this.displayDefeatMessage();
    /*this.playDefeatMe();
    if (this._canLose) {
        this.replayBgmAndBgs();
    } else {
        AudioManager.stopBgm();
    }*/
    this.endBattle(2);
    };
    
    BattleManager.updateBattleEnd = function() {
    if (this.isBattleTest()) {
        AudioManager.stopBgm();
        SceneManager.exit();
    } else if ($gameParty.isAllDead()) {
        if (this._canLose) {
            $gameParty.reviveBattleMembers();
            SceneManager.pop();
            this.replayBgmAndBgs(); //追加
        } else {
            SceneManager.goto(Scene_Gameover);
        }
    } else {
        SceneManager.pop();
        this.replayBgmAndBgs(); //追加
    }
    this._phase = null;
    };
    
    BattleManager.playVictoryMe = function() {
    //AudioManager.playMe($gameSystem.victoryMe());
    var VB = {
      name:   REMvictorybgm,
      volume: REMvolume,
      pitch:  REMpitch,
      pan:    REMpan
    };
        AudioManager.playBgm(VB);
    };

    BattleManager.playDefeatMe = function() {
    //AudioManager.playMe($gameSystem.defeatMe());
    var VB = {
      name:   REMdefeatbgm,
      volume: REMvolume,
      pitch:  REMpitch,
      pan:    REMpan
    };
    AudioManager.playBgm(VB);
    };
    
    Scene_Gameover.prototype.playGameoverMusic = function() {
    AudioManager.stopBgm();
    AudioManager.stopBgs();
    //AudioManager.playMe($dataSystem.gameoverMe);
    var VB = {
      name:   REMgameoverbgm,
      volume: REMvolume,
      pitch:  REMpitch,
      pan:    REMpan
    };
    AudioManager.playBgm(VB);
    };
    
})();
