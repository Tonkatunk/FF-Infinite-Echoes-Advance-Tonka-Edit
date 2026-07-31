# FF Infinite Echoes Advance
Translations and edits for FF IEA


GAME VERSION: 0.31

BACKUP "data" and "js" folders of your game, before you copy/paste these in!

This is where I got my version of the game.
https://x.com/spanish_ESP16/status/2012722574866948266

This is where I grabbed my initial translations from.
https://codeberg.org/ajbrave/ff_infinite_echoes_advance_eng/



Now it's important to note, I take a lot of issues with ajbrave's translations. I appreciate what he's done, but it's clear there's A LOT of machine or AI translation. It's why you'll see a lot of equipment or skills that are like "controlling (as in a machine)," when if you compare it to the original games' skills, this is the Manipulate from FF7. There are also a number of equipments that say +X% to HP or MP, when this isn't true. And that's important because there ARE a couple pieces of equipment that do this, give a percentage boost and not a flat number.

If you want my translations with the edits, you can compare the two in something like Notepad+ in a side by side, or use some other diffing tool like Winmerge. But you will have to make the edits yourself. If you're not basing the changes to the original Japanese version, make sure you do credit ajbrave as my work is still based off his.

------------------------------------
Translations

Game will crash if you hit Continue, quit to menu, then hit New Game. Just relaunch the game.

White Mages use Staff, Black Mages use Wands. I thought this distinction was easier when the version I had, had mixed them.

Sped up battle speed.

Sped up running speed. (not fleeing!)

Sped up text speed.

Sped up items earned after battle window.

Post-battle reward: Removed pop-up and ding that only announced you got no item! It will still chime for getting an item.

Translations.

Attack and a few commands will restore 1-3 MP. Attack now has 90% accuracy, 70% damage, but returns 25% of your ATB gauge.
Defense restores 5 MP. Defense now fully takes a turn AND has a small cast time instead of refunding 50% of your gauge.

Made many skills and spells have charge timers.

Adjusted TP and MP on various skills. (Goal is not to be overpowered but to make mages more usable early on)

A lot of status skills, buffs and debuffs, now cost far less. Buffs tend to have a 90-95% accuracy. Debuffs have 60-70% on average, depending on the effect. Some of them are balanced also with MP Cost or cast time.
Poison refunds 50% of ATB gauge on cast and only costs 3 mp. It can hit entire teams. The trade-off is that it only has a 60% success rate. On top of some enemies being resist and the effect not being great, it felt like a fair trade.
Frog refunds 50% ATB with a 70% success rate, but 12 MP to cast and only single target. This is balanced in the sense that you can get a Frog Wand pretty early that does all this for free, and it is a status that doesn't work on all enemies.

Translations.

Buffed a few enemies. Gigas and Ogre for example. 
Focusing on the ones that feel underwhelming when you run into them and they're alone or in a small group. 
While their stats were higher than other enemies on their floor, they didn't pose the threat you would expect from an enemy of their type.

Removed Rods/Wands breaking when used as an item. The other weapons did not do this, only the Rods/Wands.

Rods/Wands are now weaker than their Spell counterparts and have a cast time. This is to balance their free use.

Some weapons and/or armor descriptions initially said they'd resist or add a status when they did not!
If it was not actually listed in the equipment properties, I would use my judgment to either add/remove that effect. 
For ones that did have an effect that I did not see in the description, it always made sense to not change weapon effects and simply edit the description so you know it has that property. Or if the name would mismatch, like a lightning name being on a water weapon I'd adjust the name to match the properties. Coral was a mismatched item/effect iirc.

◆Symbol means adding an attribute/damage type. Or adding an unseen benefit, like enhancing the effect of steal.
♣Symbol means adding a resistance. Whether it be to an element or status.
☼Symbol should be adding a command or job ability to your character. So this is things like actually adding Steal or Throw to your character's abilities.


There's a Whisper enemy at a certain point, it can summon a Soul Eater. The Soul Eater will heavily prioritize enemies first. There was a bug that the one that summons it, goes immortal. Using Libra, its health becomes NaN. This ability has been removed from the Whisper.

Translations.

Reformatted the files for Skills, Enemies, Weapons, Armors, and Items. 
The previous translation had it all as one huge run on line. Each entry has its own unique line now.



---------------------------------

Bounty Board: /js/plugins/FNG_BountySystem.js
Hall of Fame: /js/plugins/FNG_Dendo.js

Somewhere is the file to control weapon and shields you equip in battle. There is no text entry for using or removing the equipped item, only a control code. Changing that crashes the game. May be able to go through the file and change all references on the command, untested. May break commands from other files, unsure.

"So be it!" - /js/plugins/FNG_MotionSetting.js Translated this line. Should happen in combat and is item related. Occurence unknown.

persuit on weapons is an on-hit skill. <persuit:902,25> is Pursuit Blizzard Skill with a 25% chance to activate.

---------------------------------

Below this line is a bunch of coding crap related to weapons and armors. If you're looking to edit things yourself, you may skim it. Useless otherwise.

Yes, after a certain point the effort I made was diminishing and some entries aren't included here.

(Formatted for legibility on my pc)
"params":	[	1,	2,	3,		4,		5,		6,		7,		8]
			[	hp,	mp,	atk,	def,	m.atk,	m.def,	agi,	vit]
			
			
persuit on weapons is an on-hit skill. <persuit:902,25> is Pursuit Blizzard Skill with a 25% chance to activate

{"code":31,"dataId":1,"value":0}
	Dummy Weapon Line



"note":
	<def0>
		Sets target's defense to 0 during your attack.
	<lune:10>
		Attacking will drain the user's MP.
	<mdf>
		Weighs your attack stat against enemy's M.Def instead of their Def.
	<noOptimize> 
		Excludes item fron being equipped with best/optimize.
	<recover:1>
		Hitting a target with the weapon will cure it instead.
	<use:0001>
		Casts a skill of the matching ID.
	
	
	
	
	
{"code":11,"dataId":X,"value":0.8}
	Code gives Elemental Resistances.
	See Code 31. dataId will match the Elements. Value is inverted, 0.8 is a 20% resist.


{"code":11,"dataId":22,"value":2}
	◆Zombie
	22 presumably Undead. Value of 2 forces it on wearer.
		All Zombie gear looks have double entries to block Poison and Dark, testing needed.


{"code":11,"dataId":8,"value":2}
	◆Zombie
	On Zombie equips. Double Holy damage or absorb Holy? Failed to put Zombie on Bronze Helm for testing.
		
		
		
		
◎◆☼





See Code 32. dataId will match the Status. 
	Code13, 14, 32 values can vary
		Use decimals.
		Code 13 and 14 are defenses. Value is inverted. 0.15 means only 15% chance of the status working.
		Code 32 is weapons. value of 0.15 means +15% chance for that status on hit
		
		
		
{"code":13,"dataId":13,"value":0}
	◎Flinch
	
	
	
	
	
	
	
{"code":21,"dataId":0,"value":1.3}
	◎HP +30%
{"code":21,"dataId":1,"value":1.2}
	◎MP +20%
THIS IS ONLY ON ARMOR!! Code 21 in other places has other effects, but the ID is also different.
	
	
{"code":22,"dataId":0,"value":0.8}
	Exclusively on Boomerangs, Knuckles, and the Flail. Possibly Dual Wield, with a damage modifier of 80%?
	
{"code":22,"dataId":1,"value":0}
	DataId of 1 and value 0 is a generic armor identifier.
	
{"code":22,"dataId":1,"value":
	Evade (decimal, 0.15 is 15 evade)
	
{"code":22,"dataId":2,"value":
	Crit (decimal, 0.15 is 15 crit)
	
{"code":22,"dataId":2,"value":1}
	Always crit at the cost of MP
	
	
	

	
{"code":23,"dataId":4,"value":0.8}
	MP Consumption reduced by 20
	
	
	
	
	
◎◆☼
	
	
{"code":31,"dataId":2,"value":1}
	◆Fire
	
{"code":31,"dataId":3,"value":1}
	◆Ice
	
{"code":31,"dataId":4,"value":1}
	◆Thunder
	
{"code":31,"dataId":5,"value":1}
	◆Water
	
{"code":31,"dataId":6,"value":1}
	◆Earth
	
{"code":31,"dataId":7,"value":1}
	◆Wind
	
{"code":31,"dataId":8,"value":1}
	◆Holy
	
{"code":31,"dataId":9,"value":1}
	◆Dark
	
{"code":31,"dataId":10,"value":1}
	◆Poison
	
{"code":31,"dataId":13,"value":1}
	◆Anti
	
{"code":31,"dataId":14,"value":1}
	◆Anti-Biped
	
{"code":31,"dataId":15,"value":1}
	◆Anti-Beast
	
{"code":31,"dataId":16,"value":1}
	◆Anti-Mage
	
{"code":31,"dataId":17,"value":1}
	◆Anti-Machine
	
{"code":31,"dataId":18,"value":1}
	◆Anti-Air
	
{"code":31,"dataId":19,"value":1}
	◆Piercing
	
{"code":31,"dataId":20,"value":1}
	unique to excalipoor? (probably forces it to do 1 low damage)
	
{"code":31,"dataId":21,"value":1}
	◆Cure
	
{"code":31,"dataId":26,"value":1}
	◆Range
	
{"code":31,"dataId":27,"value":1}
	◆Vampire
	
{"code":31,"dataId":28,"value":1}
	◆Osmose
	
	
	


◎◆☼
	
{"code":32,"dataId":1,"value":
	◆Death
	
{"code":32,"dataId":4,"value":
	◆Poison
	
{"code":32,"dataId":5,"value":
	◆Blind
	
{"code":32,"dataId":6,"value":
	◆Silence
	
{"code":32,"dataId":7,"value":
	◆Berserk
	
{"code":32,"dataId":8,"value":
	◆Confuse
	
{"code":32,"dataId":9,"value":
	◆???
	Found on Taoist Seal and Zombie Mail
	
{"code":32,"dataId":10,"value":
	◆Sleep
	
{"code":32,"dataId":11,"value":
	◆Petrify
	
{"code":32,"dataId":12,"value":
	◆Paralysis
	
{"code":32,"dataId":13,"value":
	◆????
	Only found on Ribbons. Testing has not shown it to do anything?
	
{"code":32,"dataId":14,"value":
	◆Frog
	
{"code":32,"dataId":22,"value":
	◆???
	Found on Taoist Seal
	
{"code":32,"dataId":35,"value":
	◆Mini
	
{"code":32,"dataId":36,"value":
	◆Zombie
	
{"code":32,"dataId":37,"value":
	◆Stop
	
{"code":32,"dataId":56,"value":
	◆Def↓
	
{"code":32,"dataId":64,"value":
	◆???
	
	
	

	
		
{"code":41,"dataId":5,"value":1}
	☼White Magic
		
{"code":41,"dataId":6,"value":1}
	☼Black Magic
		
{"code":41,"dataId":7,"value":1}
	☼Time Magic
		
{"code":41,"dataId":8,"value":1}
	☼Learn
	
{"code":41,"dataId":10,"value":1}
	☼Dark
	
{"code":41,"dataId":19,"value":1}
	☼Runic
		
{"code":41,"dataId":23,"value":1}
	☼Red Magic
	
	
	
	
	
{"code":43,"dataId":183,"value":1}
	☼Mixed Magic 1.5x MP consumption
	
{"code":43,"dataId":246,"value":1}
	☼Step Up
	
{"code":43,"dataId":247,"value":1}
	☼Jump
	
{"code":43,"dataId":248,"value":1}
	☼Pray
	
{"code":43,"dataId":249,"value":1}
	☼Throw
	
{"code":43,"dataId":250,"value":1}
	☼Steal
	
{"code":43,"dataId":257,"value":1}
	☼Study
	
{"code":43,"dataId":260,"value":1}
	☼Draw
	
{"code":43,"dataId":261,"value":1}
	☼Bide
	
{"code":43,"dataId":262,"value":1}
	☼Death Blow
	
{"code":43,"dataId":265,"value":1}
	☼Mix
	
{"code":43,"dataId":268,"value":1}
	☼Intimidate
	
{"code":43,"dataId":269,"value":1}
	☼Wish
	
{"code":43,"dataId":270,"value":1}
	☼Psychic Waves
	
{"code":43,"dataId":271,"value":1}
	☼Assault
	
{"code":43,"dataId":279,"value":1}
	☼Slash-All
	
{"code":43,"dataId":273,"value":1}
	☼Blink
	
{"code":43,"dataId":276,"value":1}
	☼Manipulate
	
{"code":43,"dataId":277,"value":1}
	☼Hide
	
{"code":43,"dataId":278,"value":1}
	☼Berserk
	
{"code":43,"dataId":279,"value":1}
	☼Wish
	
{"code":43,"dataId":623,"value":1}
	☼Battle

	

◎◆☼


	
{"code":43,"dataId":210,"value":1}
	◆Haste
	
{"code":43,"dataId":210,"value":1}
	◆Regen
	
{"code":43,"dataId":212,"value":1}
	◆Protect
	
{"code":43,"dataId":213,"value":1}
	◆Shell
	
{"code":43,"dataId":214,"value":1}
	◆Reflect
	
{"code":43,"dataId":214,"value":1}
	◆Auto-Float
	
{"code":43,"dataId":216,"value":1}
	◆Rapid
	
{"code":43,"dataId":217,"value":1}
	◆Blink
	
{"code":43,"dataId":219,"value":1}
	◆Auto-Raise
	
{"code":43,"dataId":281,"value":1}
	◆Cover
	
{"code":43,"dataId":290,"value":1}
	◆Counter
	
{"code":43,"dataId":290,"value":1}
	◆Magic Counter
	
{"code":43,"dataId":293,"value":1}
	◆Learning2
	
{"code":43,"dataId":294,"value":1}
	◆Capture
		
{"code":43,"dataId":302,"value":1}
	◆Quick Cast
		
{"code":43,"dataId":318,"value":1}
	◆Auto-Quick Cast
	MTL: More often to release magic, taking a guess but needs testing.
		
{"code":43,"dataId":322,"value":1}
	◆Auto-Concentrate
	
	
	
	
	
{"code":54,"dataId":2,"value":1}
	Two-Handed Weapons (right hand)
	
{"code":55,"dataId":0,"value":1}
	Two-Handed Weapons (left hand)

{"code":55,"dataId":0,"value":1},{"code":54,"dataId":2,"value":1},{"code":43,"dataId":313,"value":1}
Gauntlet and Soldier (Cloud passive to two hand a weapon) share these 3 entries while nothing else has any of them.