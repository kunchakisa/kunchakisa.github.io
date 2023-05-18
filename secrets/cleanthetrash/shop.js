"use strict"
if (!window.hasOwnProperty('Game')) window.Game = {}

Game.Shop = {
  name: 'Palengke',
  description: 'A place where you can buy almost anything, but not everything.',
  goods: [
    // COMMON
    { itemId: 'broom', price: 10, },
    { itemId: 'cool_cap', price: 10, },
    { itemId: 'facemask', price: 10, },
    { itemId: 'normal_clothes', price: 10, },
    { itemId: 'light_clothes', price: 100, },
    { itemId: 'rubber_boots', price: 10, },
    // UNCOMMON
    { itemId: 'tingting', price: 200, },
    { itemId: 'vacuum_cleaner', price: 1_000, },
    { itemId: 'agility_cap', price: 150, },
    { itemId: 'motivational_bandana', price: 300, },
    { itemId: 'motivational_tee', price: 800, },
    { itemId: 'combat_shoes', price: 350, },
    // RARE
    { itemId: 'cleaning_sword', price: 10_000, },
    { itemId: 'cleaning_cap', price: 1_500, },
    { itemId: 'goodwill_cap', price: 6_000, },
    { itemId: 'facemask_v2', price: 4_000, },
    { itemId: 'waterproof_jacket', price: 9_000, },
    { itemId: 'mist_shoes', price: 10_000, },
    // EPIC
    { itemId: 'flying_automaton', price: 60_000, },
    { itemId: 'fact_or_cap', price: 18_000, },
    { itemId: 'cappy_paste', price: 60_000, },
    { itemId: 'disclothes', price: 100_000, },
    { itemId: 'heavy_shoes', price: 80_000, },
    // LEGENDARY
    { itemId: 'longreach_slashing_broom', price: 500_000, },
    { itemId: 'cap', price: 250_000, },
    { itemId: 'light_cap', price: 1_000_000, },
    { itemId: 'gasmask', price: 495_000, },
    { itemId: 'thick_outfit', price: 700_000, },
    { itemId: 'thunderboots', price: 10_000_000, },
  ],
}
