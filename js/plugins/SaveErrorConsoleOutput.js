/*:
 * @plugindesc Save Error Console Output Plugin
 * @author ChatGPT
 *
 * @help This plugin allows you to output error messages to the console when an error occurs while saving the game.
 *
 * @param errorPrefix
 * @text Error Prefix
 * @type text
 * @default Save Error:
 * @desc The prefix to be displayed before the error message in the console.
 */

(function() {
  'use strict';
  
  var parameters = PluginManager.parameters('SaveErrorConsoleOutput');
  var errorPrefix = parameters['errorPrefix'];

  var _StorageManager_save = StorageManager.save;
  StorageManager.save = function(savefileId, json) {
    try {
      _StorageManager_save.apply(this, arguments);
    } catch (e) {
      console.error(errorPrefix + e);
    }
  };

})();




