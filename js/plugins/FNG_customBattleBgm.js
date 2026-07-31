BattleManager.playBattleBgm = function() {
    const mode = $gameVariables.value(9);
    var index = 0
    switch(mode){
        case 0:
            AudioManager.playBgm($gameSystem.battleBgm());
            AudioManager.stopBgs();
            return;
        case 1:
            index = $gameVariables.value(71);
            AudioManager.stopBgs();
            switch(index){
                case 0:
                    AudioManager.playBgm({"name":"FF1 battle(nes)","volume":100,"pitch":100,"pan":0}); break;
                case 1:
                    AudioManager.playBgm({"name":"FF1 battle(FF6)","volume":100,"pitch":100,"pan":0}); break;
                case 2:
                    AudioManager.playBgm({"name":"FF1 battle(ps)","volume":100,"pitch":100,"pan":0}); break;
                case 3:
                    AudioManager.playBgm({"name":"FF1 battle(gba)","volume":100,"pitch":100,"pan":0}); break;
                case 4:
                    AudioManager.playBgm({"name":"FF2 battle(nes)","volume":100,"pitch":100,"pan":0}); break;
                case 5:
                    AudioManager.playBgm({"name":"FF2 battle(FF6)","volume":100,"pitch":100,"pan":0}); break;
                case 6:
                    AudioManager.playBgm({"name":"FF2 battle(ps)","volume":100,"pitch":100,"pan":0}); break;
                case 7:
                    AudioManager.playBgm({"name":"FF2 battle(gba)","volume":100,"pitch":100,"pan":0}); break;
                case 8:
                    AudioManager.playBgm({"name":"FF3 battle(nes)","volume":100,"pitch":100,"pan":0}); break;
                case 9:
                    AudioManager.playBgm({"name":"FF3 battle(FF6)","volume":100,"pitch":100,"pan":0}); break;
                case 10:
                    AudioManager.playBgm({"name":"FF3 battle(ds)","volume":100,"pitch":100,"pan":0}); break;
                case 11:
                    AudioManager.playBgm({"name":"FF4 battle(snes)","volume":100,"pitch":100,"pan":0}); break;
                case 12:
                    AudioManager.playBgm({"name":"FF4 battle(FF6)","volume":100,"pitch":100,"pan":0}); break;
                case 13:
                    AudioManager.playBgm({"name":"FF4 battle(gba)","volume":100,"pitch":100,"pan":0}); break;
                case 14:
                    AudioManager.playBgm({"name":"FF4 battle(ds)","volume":100,"pitch":100,"pan":0}); break;
                case 15:
                    AudioManager.playBgm({"name":"FF5 battle(snes)","volume":100,"pitch":100,"pan":0}); break;
                case 16:
                    AudioManager.playBgm({"name":"FF5 battle(FF6)","volume":100,"pitch":100,"pan":0}); break;
                case 17:
                    AudioManager.playBgm({"name":"FF5 battle(gba)","volume":100,"pitch":100,"pan":0}); break;
                case 18:
                    AudioManager.playBgm({"name":"FF6 battle(snes)","volume":100,"pitch":100,"pan":0}); break;
                case 19:
                    AudioManager.playBgm({"name":"FF6 battle(gba)","volume":100,"pitch":100,"pan":0}); break;
                case 20:
                    AudioManager.playBgm({"name":"FF7 battle(ps)","volume":100,"pitch":100,"pan":0}); break;
                case 21:
                    AudioManager.playBgm({"name":"FF7 battle(FF6)","volume":100,"pitch":100,"pan":0}); break;
                case 22:
                    AudioManager.playBgm({"name":"FF8 battle(ps)","volume":100,"pitch":100,"pan":0}); break;
                case 23:
                    AudioManager.playBgm({"name":"FF8 battle(FF6)","volume":100,"pitch":100,"pan":0}); break;
                case 24:
                    AudioManager.playBgm({"name":"FF9 battle(ps)","volume":100,"pitch":100,"pan":0}); break;
                case 25:
                    AudioManager.playBgm({"name":"FF9 battle(FF6)","volume":100,"pitch":100,"pan":0}); break;
                case 26:
                    AudioManager.playBgm({"name":"FF10 battle(ps2)","volume":100,"pitch":100,"pan":0}); break;
                case 27:
                    AudioManager.playBgm({"name":"FF10 battle(FF6)","volume":100,"pitch":100,"pan":0}); break;
                case 28:
                    AudioManager.playBgm({"name":"FF10 battle(ps3)","volume":100,"pitch":100,"pan":0}); break;
                case 29:
                    AudioManager.playBgm({"name":"FF11 battle(ps2)","volume":100,"pitch":100,"pan":0}); break;
                case 30:
                    AudioManager.playBgm({"name":"FF11 battle(FF6)","volume":100,"pitch":100,"pan":0}); break;
                case 31:
                    AudioManager.playBgm({"name":"FF11 battle2(ps2)","volume":100,"pitch":100,"pan":0}); break;
                case 32:
                    AudioManager.playBgm({"name":"FF13 battle(ps3)","volume":100,"pitch":100,"pan":0}); break;
                case 33:
                    AudioManager.playBgm({"name":"FF13 battle(FF6)","volume":100,"pitch":100,"pan":0}); break;
                case 34:
                    AudioManager.playBgm({"name":"FF13LR battle","volume":100,"pitch":100,"pan":0}); break;
                case 35:
                    AudioManager.playBgm({"name":"FFL battle light","volume":100,"pitch":100,"pan":0}); break;
                case 36:
                    AudioManager.playBgm({"name":"FFL battle dark","volume":100,"pitch":100,"pan":0}); break;
            }
            return;
        case 2:
            index =  $gameVariables.value(72);
            break;
        case 3:
            index = $gameVariables.value(73);
            break;
        case 4:
            AudioManager.playBgm({"name":"FF4 Archfiends","volume":100,"pitch":100,"pan":0}); break;
            break;
    }
    
    AudioManager.stopBgs();
    switch(index){
        case 0:
            AudioManager.playBgm({"name":"FF1 boss2","volume":100,"pitch":100,"pan":0}); break;
        case 1:
            AudioManager.playBgm({"name":"FF2 boss","volume":100,"pitch":100,"pan":0}); break;
        case 2:
            AudioManager.playBgm({"name":"FF3 boss","volume":100,"pitch":100,"pan":0}); break;
        case 3:
            AudioManager.playBgm({"name":"FF4 boss","volume":100,"pitch":100,"pan":0}); break;
        case 4:
            AudioManager.playBgm({"name":"FF5 boss","volume":100,"pitch":100,"pan":0}); break;
        case 5:
            AudioManager.playBgm({"name":"FF6 boss","volume":100,"pitch":100,"pan":0}); break;
        case 6:
            AudioManager.playBgm({"name":"FF7 boss","volume":100,"pitch":100,"pan":0}); break;
        case 7:
            AudioManager.playBgm({"name":"FF8 boss","volume":100,"pitch":100,"pan":0}); break;
        case 8:
            AudioManager.playBgm({"name":"FF9 boss","volume":100,"pitch":100,"pan":0}); break;
        case 9:
            AudioManager.playBgm({"name":"FF10 boss","volume":100,"pitch":100,"pan":0}); break;
        case 10:
            AudioManager.playBgm({"name":"FFL boss","volume":100,"pitch":100,"pan":0}); break;
    }
};
    
BattleManager.playVictoryMe = function() {
    if($gameSwitches.value(12)){
        return;
    }
    //AudioManager.playMe($gameSystem.victoryMe());
    
    const mode = $gameVariables.value(74);
    if(mode<1){ //BGMに合わせるモード
        const battleA = $gameVariables.value(71);
        switch(battleA){ //通常バトル時
            case 0: 
                AudioManager.playBgm({"name":"FF1 fanfare(nes)","volume":100,"pitch":100,"pan":0}); break;
            case 1:
                AudioManager.playBgm({"name":"FF1 fanfare(FF6)","volume":100,"pitch":100,"pan":0}); break;
            case 2: 
                AudioManager.playBgm({"name":"FF1 fanfare(ps)","volume":100,"pitch":100,"pan":0}); break;
            case 3:
                AudioManager.playBgm({"name":"FF1 fanfare(gba)","volume":100,"pitch":100,"pan":0}); break;
            case 4:
                AudioManager.playBgm({"name":"FF2 fanfare(nes)","volume":100,"pitch":100,"pan":0}); break;
            case 5:
                AudioManager.playBgm({"name":"FF2 fanfare(FF6)","volume":100,"pitch":100,"pan":0}); break;
            case 6:
                AudioManager.playBgm({"name":"FF2 fanfare(ps)","volume":100,"pitch":100,"pan":0}); break;
            case 7:
                AudioManager.playBgm({"name":"FF2 fanfare(gba)","volume":100,"pitch":100,"pan":0}); break;
            case 8:
                AudioManager.playBgm({"name":"FF3 fanfare(nes)","volume":100,"pitch":100,"pan":0}); break;
            case 9:
                AudioManager.playBgm({"name":"FF3 fanfare(FF6)","volume":100,"pitch":100,"pan":0}); break;
            case 10: 
                AudioManager.playBgm({"name":"FF3 fanfare(ds)","volume":100,"pitch":100,"pan":0}); break;
            case 11:
                AudioManager.playBgm({"name":"FF4 fanfare(snes)","volume":100,"pitch":100,"pan":0}); break;
            case 12: 
                AudioManager.playBgm({"name":"FF4 fanfare(FF6)","volume":100,"pitch":100,"pan":0}); break;
            case 13: 
                AudioManager.playBgm({"name":"FF4 fanfare(gba)","volume":100,"pitch":100,"pan":0}); break;
            case 14: 
                AudioManager.playBgm({"name":"FF4 fanfare(ds)","volume":100,"pitch":100,"pan":0}); break;
            case 15:
                AudioManager.playBgm({"name":"FF5 fanfare(snes)","volume":100,"pitch":100,"pan":0}); break;
            case 16: 
                AudioManager.playBgm({"name":"FF5 fanfare(FF6)","volume":100,"pitch":100,"pan":0}); break;
            case 17: 
                AudioManager.playBgm({"name":"FF5 fanfare(gba)","volume":100,"pitch":100,"pan":0}); break;
            case 18:
                AudioManager.playBgm({"name":"FF6 fanfare(snes)","volume":100,"pitch":100,"pan":0}); break;
            case 19: 
                AudioManager.playBgm({"name":"FF6 fanfare(gba)","volume":100,"pitch":100,"pan":0}); break;
            case 20: 
                AudioManager.playBgm({"name":"FF7 fanfare(ps)","volume":100,"pitch":100,"pan":0}); break;
            case 21: 
                AudioManager.playBgm({"name":"FF7 fanfare(FF6)","volume":100,"pitch":100,"pan":0}); break;
            case 22: 
                AudioManager.playBgm({"name":"FF8 fanfare(ps)","volume":100,"pitch":100,"pan":0}); break;
            case 23: 
                AudioManager.playBgm({"name":"FF8 fanfare(FF6)","volume":100,"pitch":100,"pan":0}); break;
            case 24: 
                AudioManager.playBgm({"name":"FF9 fanfare(ps)","volume":100,"pitch":100,"pan":0}); break;
            case 25: 
                AudioManager.playBgm({"name":"FF9 fanfare(ps)","volume":100,"pitch":100,"pan":0}); break;
            case 26: 
                AudioManager.playBgm({"name":"FF10 fanfare(ps2)","volume":100,"pitch":100,"pan":0}); break;
            case 27:
                AudioManager.playBgm({"name":"FF10 fanfare(ps2)","volume":100,"pitch":100,"pan":0}); break;
            case 28: 
                AudioManager.playBgm({"name":"FF10 fanfare(ps3)","volume":100,"pitch":100,"pan":0}); break;
            case 29: //FF11 battle
                AudioManager.playBgm({"name":"FF4 fanfare(DS)","volume":100,"pitch":100,"pan":0}); break;
            case 30: //FF11 battle2
                AudioManager.playBgm({"name":"FF4 fanfare(DS)","volume":100,"pitch":100,"pan":0}); break;
            case 31: //FF11 battle
                AudioManager.playBgm({"name":"FF4 fanfare(DS)","volume":100,"pitch":100,"pan":0}); break;
            case 32: 
                AudioManager.playBgm({"name":"FF13 fanfare","volume":100,"pitch":100,"pan":0}); break;
            case 33:
                AudioManager.playBgm({"name":"FF13 fanfare","volume":100,"pitch":100,"pan":0}); break;
            case 34: 
                AudioManager.playBgm({"name":"FF13LR fanfare","volume":100,"pitch":100,"pan":0}); break;
            case 35: 
                AudioManager.playBgm({"name":"FFL fanfare","volume":100,"pitch":100,"pan":0}); break;
            case 36: 
                AudioManager.playBgm({"name":"FFL fanfare","volume":100,"pitch":100,"pan":0}); break;
        }
        
    }else{
        switch(mode){
            case 1:
                AudioManager.playBgm({"name":"FF1 fanfare(nes)","volume":100,"pitch":100,"pan":0}); break;
            case 2:
                AudioManager.playBgm({"name":"FF1 fanfare(FF6)","volume":100,"pitch":100,"pan":0}); break;
            case 3: 
                AudioManager.playBgm({"name":"FF1 fanfare(ps)","volume":100,"pitch":100,"pan":0}); break;
            case 4:
                AudioManager.playBgm({"name":"FF1 fanfare(gba)","volume":100,"pitch":100,"pan":0}); break;
            case 5:
                AudioManager.playBgm({"name":"FF2 fanfare(nes)","volume":100,"pitch":100,"pan":0}); break;
            case 6:
                AudioManager.playBgm({"name":"FF2 fanfare(FF6)","volume":100,"pitch":100,"pan":0}); break;
            case 7:
                AudioManager.playBgm({"name":"FF2 fanfare(ps)","volume":100,"pitch":100,"pan":0}); break;
            case 8:
                AudioManager.playBgm({"name":"FF2 fanfare(gba)","volume":100,"pitch":100,"pan":0}); break;
            case 9:
                AudioManager.playBgm({"name":"FF3 fanfare(nes)","volume":100,"pitch":100,"pan":0}); break;
            case 10:
                AudioManager.playBgm({"name":"FF3 fanfare(FF6)","volume":100,"pitch":100,"pan":0}); break;
            case 11: 
                AudioManager.playBgm({"name":"FF3 fanfare(ds)","volume":100,"pitch":100,"pan":0}); break;
            case 12:
                AudioManager.playBgm({"name":"FF4 fanfare(snes)","volume":100,"pitch":100,"pan":0}); break;
            case 13: 
                AudioManager.playBgm({"name":"FF4 fanfare(FF6)","volume":100,"pitch":100,"pan":0}); break;
            case 14: 
                AudioManager.playBgm({"name":"FF4 fanfare(gba)","volume":100,"pitch":100,"pan":0}); break;
            case 15: 
                AudioManager.playBgm({"name":"FF4 fanfare(ds)","volume":100,"pitch":100,"pan":0}); break;
            case 16:
                AudioManager.playBgm({"name":"FF5 fanfare(snes)","volume":100,"pitch":100,"pan":0}); break;
            case 17: 
                AudioManager.playBgm({"name":"FF5 fanfare(FF6)","volume":100,"pitch":100,"pan":0}); break;
            case 18: 
                AudioManager.playBgm({"name":"FF5 fanfare(gba)","volume":100,"pitch":100,"pan":0}); break;
            case 19:
                AudioManager.playBgm({"name":"FF6 fanfare(snes)","volume":100,"pitch":100,"pan":0}); break;
            case 20: 
                AudioManager.playBgm({"name":"FF6 fanfare(gba)","volume":100,"pitch":100,"pan":0}); break;
            case 21: 
                AudioManager.playBgm({"name":"FF7 fanfare(ps)","volume":100,"pitch":100,"pan":0}); break;
            case 22: 
                AudioManager.playBgm({"name":"FF7 fanfare(FF6)","volume":100,"pitch":100,"pan":0}); break;
            case 23: 
                AudioManager.playBgm({"name":"FF8 fanfare(ps)","volume":100,"pitch":100,"pan":0}); break;
            case 24: 
                AudioManager.playBgm({"name":"FF8 fanfare(FF6)","volume":100,"pitch":100,"pan":0}); break;
            case 25: 
                AudioManager.playBgm({"name":"FF9 fanfare(ps)","volume":100,"pitch":100,"pan":0}); break;
            case 26: 
                AudioManager.playBgm({"name":"FF10 fanfare(ps2)","volume":100,"pitch":100,"pan":0}); break;
            case 27: 
                AudioManager.playBgm({"name":"FF10 fanfare(ps3)","volume":100,"pitch":100,"pan":0}); break;
            case 28: 
                AudioManager.playBgm({"name":"FF13 fanfare","volume":100,"pitch":100,"pan":0}); break;
            case 29:
                AudioManager.playBgm({"name":"FF13LR fanfare","volume":100,"pitch":100,"pan":0}); break;
        }
    }
};