"use strict";

if (!window.hasOwnProperty('Game')) window.Game = {}

{
  // DOM functions
  function e(tag, properties, children) {
    let elem = document.createElement(tag)
    if (properties.hasOwnProperty('_c'))
      elem.className = properties._c
    if (children instanceof Array)
      addChildren(elem, children)
    else addChild(elem, children)
  }
  function addChild(htmlElement, child) {
    if (typeof child === 'string' || typeof child === 'number'
        || typeof child === 'bigint' || typeof child === 'boolean') {
      let childElem = document.createTextNode(String(child))
      htmlElement.addChild(childElem)
    } else if (child instanceof HTMLElement || child instanceof Text) {
      htmlElement.addChild(child)
    } else {
      console.error('Unsupported child element:', child)
      throw "Unsupported child element.";
    }
  }
  function addChildren(htmlElement, children) {
    children.forEach((child) => {
      addChild(elem, child)
    })
  }

  let _kunits = [
    '', 'K', 'M', 'B', 'T', 'Qd', 'Q', 'Sx', 'Sp', 'Oc', 'No', 'Dc',
    'UDc', 'DDc', 'TDc', 'QtDc', 'QDc', 'SxDc', 'SpDx', 'OcDc', 'NvDc', 'Vg',
  ]

  function _kize(num, dig = 0, func = 0) {
    if (num === 0) return 0
    let kunitIndex = Math.floor(Math.log10(num)/3)
    let finum = num/Math.pow(10, kunitIndex*3)
    let zeroOfDig = Math.pow(10,dig)
    if (func === 0) finum = (Math.round(finum*zeroOfDig)/zeroOfDig).toFixed(dig)
    else if (func === -1) finum = (Math.round(finum*zeroOfDig)/zeroOfDig).toFixed(dig)
    else if (func === 1) finum = (Math.round(finum*zeroOfDig)/zeroOfDig).toFixed(dig)
    if (Math.abs(kunitIndex) < _kunits.length) {
      return finum + ' ' +
      (
        (kunitIndex<0)?
        (_kunits[-kunitIndex]+'th'):
        (_kunits[kunitIndex])
      )
    } else {
      return finum +' _t'+(Math.abs(kunitIndex)-_kunits.length+1)
    }
  }

  // Local Storage Function
  function lsget(key, defaultValue = null) {
    let res = localStorage.getItem(key)
    if (res === null) return defaultValue
    return JSON.parse(res)
  }
  function lsset(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  function gq(qs) {
    return document.querySelector(qs)
  }
  function gqa(qs) {
    return document.querySelectorAll(qs)
  }

  // Some object property function
  function objProp(object, propertyName, defaultValue) {
    if (object.hasOwnProperty(propertyName)) return object[propertyName]
    return defaultValue
  }

  let Player = {}
  Player.calculateStats = function(player) {
    // Calculate the Level, requiring Lv1 -> Lv2 to need 10 XP
    // Lv2 -> Lv3 to need 15 XP
    player.level = 1;
    player.nextxp = 10;
    player.curxp = player.xp
    while (player.nextxp <= player.curxp) {
      player.level ++;
      player.curxp -= player.nextxp
      player.nextxp *= 1.5
    }
    let level = player.level - 1;
    // Calculate base stats
    player.efficiency = 100 + level * 2
    player.stamina = 20 + level * 1
    player.cleaningSpeed = 100 + level * 1
    player.criticalChance = 10 + level * 0.5
    player.criticalDamage = 50 + level * 1
    // Add stats boost from equipments
    function addStats(equipmentStats) {
      player.efficiency += objProp(equipmentStats, "efficiency", 0)
      player.stamina += objProp(equipmentStats, "stamina", 0)
      player.cleaningSpeed += objProp(equipmentStats, "cleaningSpeed", 0)
      player.criticalChance += objProp(equipmentStats, "criticalChance", 0)
      player.criticalDamage += objProp(equipmentStats, "criticalDamage", 0)
    }
    addStats(Game.Equipments[player.equipments.weapon].stats)
    addStats(Game.Equipments[player.equipments.helmet].stats)
    addStats(Game.Equipments[player.equipments.mask].stats)
    addStats(Game.Equipments[player.equipments.clothes].stats)
    addStats(Game.Equipments[player.equipments.shoes].stats)
    addStats(Game.Equipments[player.equipments.accessory1].stats)
    addStats(Game.Equipments[player.equipments.accessory2].stats)
    // Special effects goes here
    if (player.equipments.shoes === 'heavy_shoes')
      player.efficiency += level * 2
    if (player.equipments.weapon === 'thunderboots') {
      player.efficiency *= 2
      player.cleaningSpeed *= 1.5
    }
    if (player.equipments.shoes === 'obfuscated_shoes') {
      player.efficiency += level * 2
      player.efficiency *= 2
      player.cleaningSpeed *= 1.5
    }
    if (player.equipments.clothes === 'obfuscated_clothes') {
      player.stamina *= 1500
      player.efficiency *= 5
      player.cleaningSpeed *= 2
      player.criticalDamage *= 10
    }
    if (player.equipments.accessory1 === 'obfuscated_ring'
      || player.equipments.accessory2 === 'obfuscated_ring')
    {
      player.efficiency *= 1 + Math.pow(1.01, level)
      player.stamina *= 1 + Math.pow(1.01, level)
      player.cleaningSpeed *= 1 + Math.pow(1.01, level)
      player.criticalChance *= 1 + Math.pow(1.01, level)
      player.criticalDamage *= 1 + Math.pow(1.01, level)
    }
    if (player.equipments.mask === 'obfuscated_mask') {
      player.criticalChance /= 20
      if (player.criticalChance >= 100) {
        player.criticalDamage *= 7_000_000
      } else {
        player.criticalDamage *= 2_000
      }
    }
  }

  let savedata
  // Load the current progress of the game, if there's any.
  {
    savedata = lsget('savedata', {version: 0})
    if (savedata.version === 0) {
      // Version 1: first save data format
      savedata.version = 1
      savedata.player = {}
      savedata.player.equipments = {
        weapon: 'broom',
        helmet: 'cool_cap',
        mask: 'facemask',
        clothes: 'normal_clothes',
        shoes: 'rubber_boots',
        accessory1: 'null',
        accessory2: 'null',
      }
      savedata.player.coins = 0
      savedata.player.level = 1
      savedata.player.xp = 0
      savedata.player.curxp = 0
      savedata.player.nextxp = 10
      Player.calculateStats(savedata.player)
    }
    if (savedata.version === 1) {
      savedata.version = 2
      savedata.cooldown = 0
      savedata.curstamina = 0
    }
    if (savedata.version === 2) {
      savedata.version = 3
      savedata.purse = 0
    }
  }

  let _statce = gq('#stat-ce')
  let _statcs = gq('#stat-cs')
  let _statcc = gq('#stat-cc')
  let _statcd = gq('#stat-cd')
  let _statname = gq('#stat-name')
  let _statlv = gq('#stat-lv')
  let _statxp = gq('#stat-xp')
  let _xpbarfill = gq('#xp-bar-fill')
  let _pursespan = gq('#purse-span')
  let _equipmentw = gq('#equipment-w')
  let _equipmenth = gq('#equipment-h')
  let _equipmentf = gq('#equipment-f')
  let _equipmentc = gq('#equipment-c')
  let _equipmentb = gq('#equipment-b')
  let _staminaspan = gq('#stamina-span')
  let _staminabarfill = gq('#stamina-bar-fill')
  let _cooldownspan = gq('#cooldown-span')
  let _cooldownbarfill = gq('#cooldown-bar-fill')
  let _enemyhpspan = gq('#enemy-hp-span')
  let _enemyhpbarfill = gq('#enemy-hp-bar-fill')
  let _enemyname = gq('#enemy-name')
  let _trashpicturebox = gq('#trash-picture-box')
  let _tooltipspan = gq('#tooltip-span')

  // enemy picture and shake updates and sweep animation
  let enemyPictureArray = [];

  function updateUI() {
    _statce.innerText = _kize(savedata.player.efficiency, 2)
    _statcs.innerText = _kize(savedata.player.cleaningSpeed, 2)
    _statcc.innerText = _kize(savedata.player.criticalChance, 2)
    _statcd.innerText = _kize(savedata.player.criticalDamage, 2)
    _statname.innerText = savedata.name
    _statlv.innerText = savedata.player.level
    _statxp.innerText = _kize(savedata.player.curxp, 2, -1) + ' / ' + _kize(savedata.player.nextxp, 2, 1)
    _xpbarfill.style.width = (savedata.player.curxp/savedata.player.nextxp*100)+'%'
    _pursespan.innerText = _kize(savedata.purse, 2, -1)
    _equipmentw.innerText = Game.Equipments[savedata.player.equipments.weapon].name
    _equipmenth.innerText = Game.Equipments[savedata.player.equipments.helmet].name
    _equipmentf.innerText = Game.Equipments[savedata.player.equipments.mask].name
    _equipmentc.innerText = Game.Equipments[savedata.player.equipments.clothes].name
    _equipmentb.innerText = Game.Equipments[savedata.player.equipments.shoes].name
    _staminaspan.innerText = _kize(savedata.curstamina, 2, -1) + ' / ' + _kize(savedata.player.stamina, 2, -1)
    _staminabarfill.style.width = (savedata.curstamina / savedata.player.stamina * 100) + '%'
    _cooldownspan.innerText = Math.ceil(savedata.cooldown/20) + 's'
    _cooldownbarfill.style.width = ((1 - savedata.cooldown / (100 / savedata.player.cleaningSpeed * 60)) * 100) + '%'
    _enemyhpspan.innerText = _kize(enemyPictureArray[0].hp, 2)
    _enemyhpbarfill.style.width = (enemyPictureArray[0].hp / enemyPictureArray[0].maxhp*100) + '%'
    _enemyname.innerText = enemyPictureArray[0].img.name
    for (let i=0; i<enemyPictureArray.length;i++) {
      let enemyPicture = enemyPictureArray[i]
      if (enemyPicture.state === 'idle') {
        enemyPicture.elem.style.top = '0px'
        enemyPicture.elem.style.left = '0px'
      } else if (enemyPicture.state === 'hit') {
        if (enemyPicture.progress === 3) {
          enemyPicture.state = 'idle'
          enemyPicture.progress = 0
          continue
        }
        if (enemyPicture.progress % 2 === 0) {
          enemyPicture.elem.style.top = Math.floor(Math.random()*10 - 5)+'px'
          enemyPicture.elem.style.left = Math.floor(Math.random()*10 - 5)+'px'
        }
        enemyPicture.progress++;
      } else if (enemyPicture.state === 'sweep') {
        if (enemyPicture.direction === undefined) enemyPicture.direction = Math.random()<0.5?-1:1
        if (enemyPicture.progress >= 9) {
          enemyPictureArray.splice(i--)
          enemyPicture.elem.parentElement.removeChild(enemyPicture.elem)
          continue
        }
        // Animate the thing with an ease out for 9 frames.
        let x = 1-(enemyPicture.progress/9)
        x = 1-x*x
        enemyPicture.elem.style.left = enemyPicture.direction*x*100 + '%'
        enemyPicture.elem.style.top = -x*60 + 'px'
        enemyPicture.progress++;
      }
    }
  }

  let __enemiesImageWeight = [
    {img: 'nails', name: 'Nails', weight: 40},
    {img: 'plasticbag', name: 'Plastic Bag', weight: 3000},
    {img: 'openedcan', name: 'Opened Can', weight: 30},
  ]
  // Compute lower bound and higher bound
  function computeLowerHigherOfWeightArray(weightArray) {
    for (let i=0; i<weightArray.length; i++) {
      if (i==0) {
        weightArray[0].lowerBound = 0
        weightArray[0].higherBound = weightArray[0].weight
        continue
      }
      weightArray[i].lowerBound = weightArray[i-1].higherBound
      weightArray[i].higherBound = weightArray[i].lowerBound + weightArray[i].weight
    }
  }
  computeLowerHigherOfWeightArray(__enemiesImageWeight)
  // Function to get the value based on weight
  function getWeightArrayElement(weightArray, weight) {
    for (let i=0; i<weightArray.length; i++) {
      if (weight < weightArray[i].higherBound) return weightArray[i]
    }
    return null;
  }
  function getRandomWeightArrayElement(weightArray) {
    let sumWeight = weightArray[weightArray.length-1].higherBound
    let rand = Math.random()*sumWeight
    return getWeightArrayElement(weightArray, rand)
  }

  function addEnemy(img) {
    let elem = document.createElement('div')
    elem.classList.add('trash-picture')
    if (img === undefined) img = getRandomWeightArrayElement(__enemiesImageWeight)
    elem.style.backgroundImage = `url('assets/img/${img.img}.png')`
    let maxhp = 20+10*Math.pow(1.1, savedata.player.level-1)
    if (img.img === 'nails') maxhp *= 3.0
    else if (img.img === 'openedcan') maxhp *= 3.5
    enemyPictureArray.unshift({
      img: img,
      state: 'idle',
      progress: 0,
      elem,
      maxhp,
      hp: maxhp,
    })
    _trashpicturebox.appendChild(elem)
  }

  function initiateGame() {
    // Initialize
    gq('#playing-area').addEventListener('mousedown', e => {
      attack()
    })
    gq('#playing-area').addEventListener('touchstart', e => {
      attack()
    })
    window.addEventListener('keydown', e => {
      if (e.key === 'Space' || e.keyCode === 32) {
        attack()
      }
    })
    addEnemy()

    // Start gameloop
    let autosavecooldown = 100
    window.setInterval(()=>{
      savedata.curstamina = Math.min(savedata.curstamina + savedata.player.stamina * 0.005, savedata.player.stamina)
      savedata.cooldown = Math.max(savedata.cooldown - 1, 0)

      autosavecooldown--
      if (autosavecooldown <= 0) {
        autosavecooldown += 100
        lsset('savedata', savedata)
      }

      // Auto attack function
      if (savedata.player.equipments.weapon === 'obfuscated_weapon'
          || savedata.player.equipments.weapon === 'flying_automaton')
      {
        attack()
      }

      updateUI()
    }, 1000/20)
  }

  function attack() {
    if (savedata.cooldown <= 0 && savedata.curstamina >= 10) {
      savedata.cooldown = 100 / savedata.player.cleaningSpeed * 60
      let attackCount = 1 / savedata.cooldown
      let damage = 10 * savedata.player.efficiency/100
      let crit = false
      // crit
      if (Math.random()*100 < savedata.player.criticalChance) {
        crit = true
        damage *= 1 + savedata.player.criticalDamage/100
      }
      if (attackCount > 1) {
        enemyPictureArray[0].hp -= damage * attackCount
        savedata.curstamina -= 10 * attackCount
      } else {
        enemyPictureArray[0].hp -= damage
        savedata.curstamina -= 10
      }
      _tooltipspan.innerText = _kize(damage, 2) + ' damage' + (crit?'!!!':'')
      if (enemyPictureArray[0].hp <= 0) {
        enemyPictureArray[0].state = 'sweep'
        enemyPictureArray[0].progress = 0
        let xpadd = Math.pow(enemyPictureArray[0].maxhp, 0.8)
        // Check if the player has the cheat ring
        if (savedata.player.equipments.helmet === 'obfuscated_cap') {
          xpadd += Math.pow(savedata.player.nextxp,0.995)/10
        }
        savedata.player.curxp += xpadd
        savedata.player.xp += xpadd
        if (savedata.player.curxp > savedata.player.nextxp) {
          Player.calculateStats(savedata.player)
        }
        savedata.purse += Math.round((6+Math.random()*2)
          *Math.pow(enemyPictureArray[0].maxhp, 0.3))
        addEnemy()
      } else {
        enemyPictureArray[0].state = 'hit'
        enemyPictureArray[0].progress = 0
      }
    }
  }

  // UI and other things

  let activeTabName = null
  function switchTab(tabname) {
    if (activeTabName !== null) gq(activeTabName).classList.toggle('active', false)
    gq(tabname).classList.toggle('active', true)
    activeTabName = tabname
  }

  window.addEventListener('load', (e)=>{
    gq('#menu-openbutton').addEventListener('click', (e)=>{
      gq('#main-div').classList.toggle('menu-shown')
    })
    gq('#menu-closebutton').addEventListener('click', e=>{
      gq('#main-div').classList.toggle('menu-shown')
    })
    gq('#compendium-tab-back').addEventListener('click', (e)=>{
      switchTab('#tab-menus')
    })
    gq('#menu-trashcompendiumbutton').addEventListener('click', (e)=>{
      switchTab('#compendium-tab')
    })
    // Show name input if not yet named
    if (savedata.name === undefined) {
      switchTab('#entername-tab')

      function submitName() {
        let answer = gq('#charname').value.trim()
        if (answer.length === 0) return
        e.preventDefault()
        savedata.name = answer
        lsset('savedata', savedata)
        gq('#main-div').classList.toggle('menu-shown', false)
        gq('#main-div').classList.toggle('unnamed-character', false)
        switchTab('#tab-menus')
        initiateGame()
      }

      gq('#charname').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
          submitName()
        }
      })

      gq('#enternamebutton').addEventListener('click', (e)=>{
        submitName()
      })
    } else {
      gq('#main-div').classList.toggle('menu-shown', false)
      gq('#main-div').classList.toggle('unnamed-character', false)
      switchTab('#tab-menus')
      initiateGame()
    }
  })

  Game.recalculateStats = function() {
    Player.calculateStats(savedata.player)
    lsset('savedata', savedata)
  }

  Game.player = savedata.player
}
