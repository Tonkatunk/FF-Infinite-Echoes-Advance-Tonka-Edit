//=============================================================================
// RPG Maker MZ - TPB Skill Timwe
// Copyright (c) 2020 Virtual Wanderer
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc TPB戦闘のゲージ消費量をスキルごとに設定します。
 * @author LegionHawk(VirtualWanderer)
 *
 * @help TPBSkillTime.js
 *
 * このプラグインは、TPB戦闘でスキルごとにTPBゲージ消費量を
 * 変更できるようにするものです。
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ■ 設定方法
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 単純に、ゲージ消費量が(100-速度補正)%になります。
 * つまり、速度補正100以上でゲージ消費なしになります。
 * なお、負の値の場合は0と同じ扱いになります。
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ■ プラグインコマンド
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 本プラグインにはプラグインコマンドはありません。
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ■　利用規約
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 当プラグインのライセンス表示を残しておいて下さい。
 * 当プラグインにつきましては、作者に無断で改変、再配布が可能で、
 * 利用形態（商用、18禁利用等）についても制限はありません。
 * ただし、動作保証などもございません。
 * このプラグインを使用して何かあったとしても、作者は一切責任を持ちません。
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ■　更新履歴
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 2020/08/20 21:30 一部条件で正常に動作しない問題の修正
 * 
 */

(() => {

    const _Game_Battler_initMembers = Game_Battler.prototype.initMembers;
	Game_Battler.prototype.initMembers = function() {
		_Game_Battler_initMembers.apply(this, arguments);
	    this._tpbSkillSpeed = 0;
	};


	Game_Battler.prototype.clearTpbChargeTime = function() {
	    this._tpbState = "charging";
	    this._tpbChargeTime = Math.max(0,Math.min(1,this._tpbSkillSpeed / 100));
		this._tpbSkillSpeed = 0;
	};

    const _Game_Battler_startTpbAction= Game_Battler.prototype.startTpbAction;
	Game_Battler.prototype.startTpbAction = function() {
	    _Game_Battler_startTpbAction.apply(this, arguments);
	    const actions = this._actions.filter(action => action.isValid());
	    const items = actions.map(action => action.item());
		this._tpbSkillSpeed = items.reduce((r, item) => r + Math.max(0, item.speed), 0)/items.length;
	};


})();

