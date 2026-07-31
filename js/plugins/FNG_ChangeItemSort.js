//アイテム入手順の配列を作成する
/*var _game_Party_initialize = Game_Party.prototype.initialize;
Game_Party.prototype.initialize = function() {
    _game_Party_initialize.apply(this,arguments);
};*/

var _game_Party_gainItem = Game_Party.prototype.gainItem;
Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
    if(amount == 0){
        return;
    }
    _game_Party_gainItem.apply(this,arguments);
    if(!this._itemOrder){
        this._itemOrder = [];
        this._itemOrderType = [];
    }else{
		const tmporder = []
		for(oitem of this._itemOrder){
            if(!oitem){
                continue;
            }
			if(!typeof oitem.itypeId === "undefined" && !DataManager.isItem(oitem)){
				tmporder.push($dataItems[oitem.itypeId]);
			}else if(!typeof oitem.wtypeId === "undefined" && !DataManager.isWeapon(oitem)){
				tmporder.push($dataWeapons[oitem.wtypeId]);
			}else if(!typeof oitem.atypeId === "undefined" && !DataManager.isArmor(oitem)){
				tmporder.push($dataArmors[oitem.atypeId]);
			}else{
				tmporder.push(oitem)
			}
		}
        this._itemOrder = tmporder;
	}
	//console.log(this._itemOrder);
    if(amount < 0){
        if(this.numItems(item) < 1){
            if(!this._itemOrder){
                this._itemOrder = this.itemOrder();
                this._itemOrderType = this.itemOrderType();
            }
            //console.log(item,this._itemOrder);
            const index = this.findItemOrderIndex(item);
            //console.log(item,index);
            if(index){
                this._itemOrder.splice(index, 1);
                this._itemOrderType.splice(index, 1);
            }
        }
    }else if(!this._itemOrder.includes(item)){
        //console.log("itemOrder 1:",this._itemOrder,"item:",item);
        const orderTemp = this._itemOrder.slice();
        orderTemp.push(item);
        if(DataManager.isItem(item) && item.itypeId < 2){
            this._itemOrderType.push("i");
        }else if(DataManager.isWeapon(item)){
            this._itemOrderType.push("w");
        }else if(DataManager.isArmor(item)){
            this._itemOrderType.push("a");            
        }
        //console.log(orderTemp,"length:",orderTemp.length);
        this._itemOrder = orderTemp.slice();
        //this._itemOrder.length = orderTemp.length;
        //console.log("itemOrder 2:",this._itemOrder,"item:",item,this._itemOrder.length);
        //console.log("itemOrder[28]:",this._itemOrder[28],"length:",this._itemOrder.length,this._itemOrder);
    }
};

Game_Party.prototype.findItemOrderIndex = function(findItem){
    if(!findItem){
        return;
    }
    const findId = findItem.id;
    console.log(this._itemOrder,findId);
    var index = 0;
    let i=0;
    for(item of this.itemOrder()){
        if(!item){
            console.log(this.itemOrder(),i);
        }
        //i++;
        if(item.id == findId){
            if(item.itypeId != null&&DataManager.isItem(findItem)){
                return index;
            }
            if(item.wtypeId != null&&DataManager.isWeapon(findItem)){
                return index;
            }
            if(item.atypeId != null&&DataManager.isArmor(findItem)){
                return index;
            }
           //return index;
        }
        index++;
    }
    return -1;
}

Game_Party.prototype.itemOrder = function() {
    if(!this._itemOrder){
        return [];
    }
    if(this.items().length == 0 && this.weapons().length == 0 && this.armors().length){
        return [];
    }
    this.removeNullItemOrder();
    this.resetOrderType();
    const iO = this._itemOrder;
    const iOT = this._itemOrderType;
    this._itemOrder = [];
    this._itemType = [];
    for(let i=0;i<iOT.length;i++){
        if(iO[i]){
            switch(iOT[i]){
                case "i":
                this._itemOrder.push($dataItems[iO[i].id]);
                break;
                case "w":
                this._itemOrder.push($dataWeapons[iO[i].id]);
                break;
                case "a":
                this._itemOrder.push($dataArmors[iO[i].id]);
                break;
            }
        }
    }
    return this._itemOrder;
};

Game_Party.prototype.removeNullItemOrder = function() {
    var newOrder = [];
    for(item of this._itemOrder){
        if(item){
            var itemType = this.getItemType(item)
            var addable = true
            for(orderItem of newOrder){ // 重複チェック
                var itemTypeNew = this.getItemType(orderItem)
                if((orderItem.id == item.id) && (itemType == itemTypeNew)){
                    addable = false
                }
            }
            if(addable){
                newOrder.push(item)
            }
        }
    }
    this._itemOrder = newOrder;
}

Game_Party.prototype.getItemType = function(item) {
    if(item.itypeId){
        return "i"
    }else if(item.wtypeId){
        return "w"      
    }else if(item.atypeId){
        return "a"
    }
    return null
}

Game_Party.prototype.resetOrderType = function() {
    this._itemOrderType = [];
    for(item of this._itemOrder){
        if(item.itypeId){
            this._itemOrderType.push("i");
        }else if(item.wtypeId){
            this._itemOrderType.push("w");            
        }else if(item.atypeId){
            this._itemOrderType.push("a");            
        }
    }
}

Game_Party.prototype.itemOrderType = function() {
    if(!this.itemOrderType){
        return [];
    }
    if(this.items().length == 0 && this.weapons().length == 0 && this.armors().length){
        return [];
    }
    return this._itemOrderType;
};

Game_Party.prototype.itemOrderReset = function() {
    this._itemOrder = [];
    this._itemOrderType = [];
    var tmpSortitemOrder = [];
    var tmpSortitemOrderType = [];
    //通常アイテムのソート--------------------------------------------------------------------------
    var itemlist = this.items();
    for(let i=0;i<itemlist.length;i++){
        if($dataItems[itemlist[i].id].itypeId < 2 && !$dataItems[itemlist[i].id].meta.sort && !$dataItems[itemlist[i].id].meta.release && !$dataItems[itemlist[i].id].meta.learnByOwning){
            this._itemOrder.push($dataItems[itemlist[i].id]);
            this._itemOrderType.push("i");
        }else if($dataItems[itemlist[i].id].meta.sort && !$dataItems[itemlist[i].id].meta.release && !$dataItems[itemlist[i].id].meta.learnByOwning){
            tmpSortitemOrder.push($dataItems[itemlist[i].id]);
            tmpSortitemOrderType.push("i");            
        }
    }
    for(item of tmpSortitemOrder){
        const index = Number(item.meta.sort);
        for(let i = 0;i < this._itemOrder.length;i++){
            const oderItem = this._itemOrder[i];
            if(oderItem.id > index && !oderItem.meta.sort && !oderItem.meta.release && !oderItem.meta.learnByOwning){
                this._itemOrder.splice(i, 0, item);
                this._itemOrderType.splice(i,0,"i");
                break;
            }else if(oderItem.meta.sort && Number(oderItem.meta.sort) > index){
                this._itemOrder.splice(i, 0, item);
                this._itemOrderType.splice(i,0,"i");
                break;
            }
        }
    }
    //武器のソート--------------------------------------------------------------------------
    var weaponlist = this.weapons();
    const tmpWeaponOrder = [];
    const tmpWeaponOrderType = [];
    tmpSortitemOrder = [];
    tmpSortitemOrderType = [];
    for(let i=0;i<weaponlist.length;i++){
        if(!$dataWeapons[weaponlist[i].id].meta.sort){
            tmpWeaponOrder.push($dataWeapons[weaponlist[i].id]);
            tmpWeaponOrderType.push("w");
        }else if($dataWeapons[weaponlist[i].id].meta.sort){
            tmpSortitemOrder.push($dataWeapons[weaponlist[i].id]);
            tmpSortitemOrderType.push("w");            
        }
    }
    for(item of tmpSortitemOrder){
        const index = Number(item.meta.sort);
        for(let i = 0;i < tmpWeaponOrder.length;i++){
            const oderItem = tmpWeaponOrder[i];
            if(oderItem.id > index && !oderItem.meta.sort){
                tmpWeaponOrder.splice(i, 0, item);
                tmpWeaponOrderType.splice(i,0,"w");
                break;
            }else if(oderItem.meta.sort && Number(oderItem.meta.sort) > index){
                tmpWeaponOrder.splice(i, 0, item);
                tmpWeaponOrderType.splice(i,0,"w");
                break;
            }
        }
    }
    console.log(this._itemOrder);
    this._itemOrder = this._itemOrder.concat(tmpWeaponOrder);
    this._itemOrderType = this._itemOrderType.concat(tmpWeaponOrderType);
    //防具のソート--------------------------------------------------------------------------
    var armorlist = this.armors();
    const tmpArmorOrder = [];
    const tmpArmorOrderType = [];
    tmpSortitemOrder = [];
    tmpSortitemOrderType = [];
    for(let i=0;i<armorlist.length;i++){
        if(!$dataArmors[armorlist[i].id].meta.sort){
            tmpArmorOrder.push($dataArmors[armorlist[i].id]);
            tmpArmorOrderType.push("a");
        }else if($dataArmors[armorlist[i].id].meta.sort){
            tmpSortitemOrder.push($dataArmors[armorlist[i].id]);
            tmpSortitemOrderType.push("a");        
        }
    }
    for(item of tmpSortitemOrder){
        const index = Number(item.meta.sort);
        for(let i = 0;i < tmpArmorOrder.length;i++){
            const oderItem = tmpArmorOrder[i];
            if(oderItem.id > index && !oderItem.meta.sort){
                tmpArmorOrder.splice(i, 0, item);
                tmpArmorOrderType.splice(i,0,"a");
                break;
            }else if(oderItem.meta.sort && Number(oderItem.meta.sort) > index){
                tmpArmorOrder.splice(i, 0, item);
                tmpArmorOrderType.splice(i,0,"a");
                break;
            }
        }
    }
    this._itemOrder = this._itemOrder.concat(tmpArmorOrder);
    this._itemOrderType = this._itemOrderType.concat(tmpArmorOrderType);
    //特殊アイテムのソート--------------------------------------------------------------------------
    for(let i=0;i<itemlist.length;i++){
        if($dataItems[itemlist[i].id].itypeId < 2 && ($dataItems[itemlist[i].id].meta.release || $dataItems[itemlist[i].id].meta.learnByOwning)){
            this._itemOrder.push($dataItems[itemlist[i].id]);
            this._itemOrderType.push("i");
        }
    }
};

Game_Party.prototype.itemOrderExchange = function(a,b) {
    console.log(this._itemOrder[a],this._itemOrder[b]);
    const itemA = this._itemOrder[a];
    const itemTypeA =  this._itemOrderType[a];
    this._itemOrder[a] = this._itemOrder[b];
    this._itemOrderType[a] = this._itemOrderType[b];
    this._itemOrder[b] = itemA;
    this._itemOrderType[b] = itemTypeA;
};

