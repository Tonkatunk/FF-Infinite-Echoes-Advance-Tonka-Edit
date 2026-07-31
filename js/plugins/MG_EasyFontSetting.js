//=============================================================================
// MG_EasyFontSetting.js
// ----------------------------------------------------------------------------
// M.GAMES mo-to
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2020/9/11 公開
// ----------------------------------------------------------------------------
// [Ci-en](18禁): https://ci-en.dlsite.com/creator/2737
// [Twitter](18禁): https://twitter.com/_M_GAMES_
//=============================================================================

/*:
 * @plugindesc らくらくフォントセッティングプラグイン
 * @target MZ
 * @url 
 * @author M.GAMES mo-to
 *  
 * @help MG_EasyFontSetting.js
 *
 * ■使い方
 * 1.追加したいフォントをＭＺのフォントフォルダに入れます
 * 2.プラグインパラメータ『フォントの登録』で追加したいフォントを登録します
 * 3.プラグインパラメータ『個別フォント設定』でフォントを変更したいウィンドウクラスを選んでフォントフェイスを指定します
 * 
 *【TIPS】メッセージウィンドウのフォント変更も当プラグインに対応していますが、
 * メッセージウィンドウは本体のデータベースで変更するほうがプレビュー機能も使えるのでおすすめです。 
 * 
 * (注意　フォントファイルを増やし過ぎると初期の読み込みに時間がかかり、ゲームの起動が遅くなる恐れがあります。
 * 多くても三種類くらいまでにとどめておいたほうがいいかもしれません。
 * 
 * 当プラグインはトリアコンタンさん制作『WindowBackImage.js』からソースコードとパラメータを流用しています。
 * この場をお借りしてお礼申し上げます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *  
 * 
 * @param fontRegister
 * @text フォントの登録
 * @desc ゲーム内で使う追加フォントをすべて登録します
 * @default
 * @type struct<fontset>[]
 *
 * 
 * @param subFontSetting
 * @text 個別フォント設定
 * @desc 選択したウインドウで使うフォントを個別設定します
 * @default
 * @type struct<Windowset>[]
 */

/*~struct~fontset:
 *
 * @param fontFaceSetting
 * @text フォントフェイス名
 * @desc フォントの呼び出しに使う名前を登録してください(重複禁止)
 * @type String
 * @default
 * 
 * @param fontFileSetting
 * @text フォントファイル名 
 * @desc フォントのファイル名を拡張子込みで登録してください
 * @type String
 * @default
 */

/*~struct~Windowset:
 *
 * @param WindowClass
 * @desc フォントを変更するウィンドウクラスです。独自クラスも直接入力で使えるかもしれません(未調査)
 * @type select
 * @default
 * @option [ゲーム全般]ヘルプウィンドウ
 * @value Window_Help
 * @option [ゲーム全般]お金ウィンドウ
 * @value Window_Gold
 * @option [メインメニュー]メインコマンドウィンドウ
 * @value Window_MenuCommand
 * @option [メインメニュー]アクターステータスウィンドウ
 * @value Window_MenuStatus
 * @option [アイテム画面]アイテムカテゴリウィンドウ
 * @value Window_ItemCategory
 * @option [アイテム画面]アイテムリストウィンドウ
 * @value Window_ItemList
 * @option [アイテム画面]アクター選択ウィンドウ
 * @value Window_MenuActor
 * @option [スキル画面]スキルタイプウィンドウ
 * @value Window_SkillType
 * @option [スキル画面]ステータスウィンドウ
 * @value Window_SkillStatus
 * @option [スキル画面]スキルリストウィンドウ
 * @value Window_SkillList
 * @option [装備画面]ステータスウィンドウ
 * @value Window_EquipStatus
 * @option [装備画面]装備コマンドウィンドウ
 * @value Window_EquipCommand
 * @option [装備画面]装備スロットウィンドウ
 * @value Window_EquipSlot
 * @option [装備画面]装備リストウィンドウ
 * @value Window_EquipItem
 * @option [ステータス画面]ステータスウィンドウ
 * @value Window_Status
 * @option [オプション画面]オプションウィンドウ
 * @value Window_Options
 * @option [セーブ、ロード画面]ファイルリストウィンドウ
 * @value Window_SavefileList
 * @option [ショップ画面]ショップコマンドウィンドウ
 * @value Window_ShopCommand
 * @option [ショップ画面]購入アイテムウィンドウ
 * @value Window_ShopBuy
 * @option [ショップ画面]売却アイテムウィンドウ
 * @value Window_ShopSell
 * @option [ショップ画面]数値入力ウィンドウ
 * @value Window_ShopNumber
 * @option [ショップ画面]ステータスウィンドウ
 * @value Window_ShopStatus
 * @option [名前入力画面]名前ウィンドウ
 * @value Window_NameEdit
 * @option [名前入力画面]名前入力ウィンドウ
 * @value Window_NameInput
 * @option [マップ画面]選択肢ウィンドウ
 * @value Window_ChoiceList
 * @option [マップ画面]数値入力ウィンドウ
 * @value Window_NumberInput
 * @option [マップ画面]アイテム選択ウィンドウ
 * @value Window_EventItem
 * @option [マップ画面]ネームボックスウィンドウ 
 * @value Window_NameBox
 * @option [マップ画面]メッセージウィンドウ
 * @value Window_Message
 * @option [マップ画面]スクロールメッセージウィンドウ
 * @value Window_ScrollText
 * @option [マップ画面]マップ名ウィンドウ
 * @value Window_MapName
 * @option [戦闘画面]バトルログウィンドウ
 * @value Window_BattleLog
 * @option [戦闘画面]パーティコマンドウィンドウ
 * @value Window_PartyCommand
 * @option [戦闘画面]アクターコマンドウィンドウ
 * @value Window_ActorCommand
 * @option [戦闘画面]アクター一覧ウィンドウ
 * @value Window_BattleActor
 * @option [戦闘画面]敵キャラ一覧ウィンドウ
 * @value Window_BattleEnemy
 * @option [戦闘画面]スキル一覧ウィンドウ
 * @value Window_BattleSkill
 * @option [戦闘画面]アイテム一覧ウィンドウ
 * @value Window_BattleItem
 * @option [タイトル画面]タイトルウィンドウ
 * @value Window_TitleCommand
 * @option [ゲーム終了画面]終了確認ウィンドウ
 * @value Window_GameEnd
 * @option [デバッグ画面]変数選択ウィンドウ
 * @value Window_DebugRange
 * @option [デバッグ画面]変数設定ウィンドウ
 * @value Window_DebugEdit
 *
 * @param IndSelectFontFace
 * @desc 『フォントの登録』で登録した呼び出すフォントフェイス名を指定してください
 * @type string
 * @default
 * 
 * @param IndFontSize
 * @desc フォントサイズを指定してください
 * @type number
 * @default 26
 */
 
 
(() => {
	'use strict';
	
//=============================================================================
// WindowBackImage.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------		
	
    const createPluginParameter = function(pluginName) {
        const paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        const parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };
    
    const param = createPluginParameter('MG_EasyFontSetting');
    if (!param.fontRegister) {
        param.fontRegister = [];
    }
    if (!param.subFontSetting) {
        param.subFontSetting = [];
    }    

    const getClassName = function(object) {
        return object.constructor.toString().replace(/function\s+(.*)\s*\([\s\S]*/m, '$1');
    };
    
//フォントのロード
	const _MG_Scene_Boot_loadGameFonts = Scene_Boot.prototype.loadGameFonts;
	Scene_Boot.prototype.loadGameFonts = function() {
	    _MG_Scene_Boot_loadGameFonts.call(this);
	    const fontRegisterData = param.fontRegister;
	    fontRegisterData.forEach(function(data) {
	    	if (data['fontFaceSetting'] && data['fontFileSetting']) {
	    		FontManager.load(data['fontFaceSetting'], data['fontFileSetting']);
	    	}
	    },)
	};
	
	const _MG_Window_Base_resetFontSettings = Window_Base.prototype.resetFontSettings;
	Window_Base.prototype.resetFontSettings = function() {
		_MG_Window_Base_resetFontSettings.call(this);
		
		const className = getClassName(this);
	    const dataList = param.subFontSetting.filter(function(data) {
	            return data['WindowClass'] === className;
	    }, this);

	    if (dataList.length >= 0) {
		    dataList.forEach(function(data) {
				this.contents.fontFace = data['IndSelectFontFace'];
				this.contents.fontSize = Number(data['IndFontSize']);
				this.resetTextColor();
		    }, this);
	    }  
		
	};

    const Window_Base_initialize = Window_Base.prototype.initialize;
    Window_Base.prototype.initialize = function(rect) {
	    FontManager.load("PixelMPlus10", "PixelMplus10-Regular.woff");
        while(!FontManager.isReady()){}
        Window_Base_initialize.apply(this,arguments);
    };
})(); 
 