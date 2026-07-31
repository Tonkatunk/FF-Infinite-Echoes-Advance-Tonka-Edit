/*:
 * @target MZ
 * @plugindesc 各シーンの背景ぼかし除去
 * @author 加藤マリン
 * 
 * @param メニュー関連で背景をぼかす
 * @desc falseにすると背景をぼかさなくします
 * @default true
 * @type boolean
 * 
 * @param バトルで背景をぼかす
 * @desc falseにすると背景をぼかさなくします
 * @default true
 * @type boolean
 * 
 * @help
 * プラグインパラーメタをfalseにすると、
 * メニュー画面、オプション画面、バトル背景などの背景のぼかし処理を除外します。
 * 
 * 万が一、ゲームの途中で背景のぼかしを有効にしたい場合は
 * 
 * 【メニュー関連背景】
 * $gameSystem.BG_MenuBlur = true;
 * 【バトル背景】
 * $gameSystem.BG_BattleBlur = true;
 * 
 * をスクリプトで実行してください。
 */

var Param = PluginManager.parameters('BG_notBlur');
var bgmenublur = Boolean(Param['メニュー関連で背景をぼかす'] === 'true') || false;
var bgbattleblur = Boolean(Param['バトルで背景をぼかす'] === 'true') || false;

(function () {


    Scene_MenuBase.prototype.createBackground = function () {
        this._backgroundFilter = new PIXI.filters.BlurFilter();
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        if (bgmenublur || $gameSystem.BG_MenuBlur) { this._backgroundSprite.filters = [this._backgroundFilter]; var opa = 192; } else { var opa = 255; }
        //this.addChild(this._backgroundSprite);
        //this.setBackgroundOpacity(opa);
    };

    Spriteset_Battle.prototype.createBackground = function () {
        this._backgroundFilter = new PIXI.filters.BlurFilter();
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        if (bgbattleblur || $gameSystem.BG_BattleBlur) { this._backgroundSprite.filters = [this._backgroundFilter]; }
        //this._baseSprite.addChild(this._backgroundSprite);
    };


})();
