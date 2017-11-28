/**
 *  Компактное обозначение ресурсов
 */
var R = {
    dir: { // -------------------- пути к ресурсам -------------------------
        atlas: "img"
    },

    atlas: { // -------------------- атласы для загрузки -------------------------
        common: [/*"monsters", "buttons", "items"*/]
    },

    img: { // -------------------- картинки -------------------------

        Cache: { // имена для сохранения в кэше
            MONSTER_HEALTH_BG: "MONSTER_HEALTH_BG",
            MONSTER_HEALTH_BAR: "MONSTER_HEALTH_BAR",
            MONSTER_SHADOW_BAR: "MONSTER_SHADOW_BAR",
            DEATH_EFFECT_BAR: "DEATH_EFFECT_BAR",
        },

        Ui: {
            COIN: {page: 'items', name: 'coin.png'},
            POTION_HEALTH: {page: 'items', name: 'potion_health.png'},
        },

        MonsterButtons: {
            bgPage: "buttons",
            bgArray: ["bt_bg_01.png",
            "bt_bg_02.png",
            "bt_bg_03.png",
            "bt_bg_04.png",
            "bt_bg_05.png",
            "bt_bg_06.png",
            "bt_bg_07.png",
            ],

            iconPage: "monsters",
            iconArray: [
                [ // first set
                    "monsters_64x64_spritesheet_r1_c1.png",
                    "monsters_64x64_spritesheet_r1_c2.png",
                    "monsters_64x64_spritesheet_r1_c3.png",
                    "monsters_64x64_spritesheet_r1_c4.png",
                    "monsters_64x64_spritesheet_r1_c5.png",
                    "monsters_64x64_spritesheet_r1_c6.png",
                    "monsters_64x64_spritesheet_r1_c7.png",
                    "monsters_64x64_spritesheet_r1_c8.png",
                    "monsters_64x64_spritesheet_r1_c9.png",
                    "monsters_64x64_spritesheet_r1_c10.png",
                ],

                [ // 2n set
                    "monsters_64x64_spritesheet_r2_c1.png",
                    "monsters_64x64_spritesheet_r2_c2.png",
                    "monsters_64x64_spritesheet_r2_c3.png",
                    "monsters_64x64_spritesheet_r2_c4.png",
                    "monsters_64x64_spritesheet_r2_c5.png",
                    "monsters_64x64_spritesheet_r2_c6.png",
                    "monsters_64x64_spritesheet_r2_c7.png",
                    "monsters_64x64_spritesheet_r2_c8.png",
                    "monsters_64x64_spritesheet_r2_c9.png",
                    "monsters_64x64_spritesheet_r2_c10.png",
                ],

                [ // 3n set
                    "monsters_64x64_spritesheet_r3_c1.png",
                    "monsters_64x64_spritesheet_r3_c2.png",
                    "monsters_64x64_spritesheet_r3_c3.png",
                    "monsters_64x64_spritesheet_r3_c4.png",
                    "monsters_64x64_spritesheet_r3_c5.png",
                    "monsters_64x64_spritesheet_r3_c6.png",
                    "monsters_64x64_spritesheet_r3_c7.png",
                    "monsters_64x64_spritesheet_r3_c8.png",
                    "monsters_64x64_spritesheet_r3_c9.png",
                    "monsters_64x64_spritesheet_r3_c10.png",
                ],

                [ // 4n set
                    "monsters_64x64_spritesheet_r4_c1.png",
                    "monsters_64x64_spritesheet_r4_c2.png",
                    "monsters_64x64_spritesheet_r4_c3.png",
                    "monsters_64x64_spritesheet_r4_c4.png",
                    "monsters_64x64_spritesheet_r4_c5.png",
                    "monsters_64x64_spritesheet_r4_c6.png",
                    "monsters_64x64_spritesheet_r4_c7.png",
                    "monsters_64x64_spritesheet_r4_c8.png",
                    "monsters_64x64_spritesheet_r4_c9.png",
                    "monsters_64x64_spritesheet_r4_c10.png",
                ],

                [ // 5n set
                    "monsters_64x64_spritesheet_r5_c1.png",
                    "monsters_64x64_spritesheet_r5_c2.png",
                    "monsters_64x64_spritesheet_r5_c3.png",
                    "monsters_64x64_spritesheet_r5_c4.png",
                    "monsters_64x64_spritesheet_r5_c5.png",
                    "monsters_64x64_spritesheet_r5_c6.png",
                    "monsters_64x64_spritesheet_r5_c7.png",
                    "monsters_64x64_spritesheet_r5_c8.png",
                    "monsters_64x64_spritesheet_r5_c9.png",
                    "monsters_64x64_spritesheet_r5_c10.png",
                ],

                [ // 6n set
                    "monsters_64x64_spritesheet_r6_c1.png",
                    "monsters_64x64_spritesheet_r6_c2.png",
                    "monsters_64x64_spritesheet_r6_c3.png",
                    "monsters_64x64_spritesheet_r6_c4.png",
                    "monsters_64x64_spritesheet_r6_c5.png",
                    "monsters_64x64_spritesheet_r6_c6.png",
                    "monsters_64x64_spritesheet_r6_c7.png",
                    "monsters_64x64_spritesheet_r6_c8.png",
                    "monsters_64x64_spritesheet_r6_c9.png",
                    "monsters_64x64_spritesheet_r6_c10.png",
                ],

                [ // 7n set
                    "monsters_64x64_spritesheet_r7_c1.png",
                    "monsters_64x64_spritesheet_r7_c2.png",
                    "monsters_64x64_spritesheet_r7_c3.png",
                    "monsters_64x64_spritesheet_r7_c4.png",
                    "monsters_64x64_spritesheet_r7_c5.png",
                    "monsters_64x64_spritesheet_r7_c6.png",
                    "monsters_64x64_spritesheet_r7_c7.png",
                    "monsters_64x64_spritesheet_r7_c8.png",
                    "monsters_64x64_spritesheet_r7_c9.png",
                    "monsters_64x64_spritesheet_r7_c10.png",
                ],

                [ // 8n set
                    "monsters_64x64_spritesheet_r8_c1.png",
                    "monsters_64x64_spritesheet_r8_c2.png",
                    "monsters_64x64_spritesheet_r8_c3.png",
                    "monsters_64x64_spritesheet_r8_c4.png",
                    "monsters_64x64_spritesheet_r8_c5.png",
                    "monsters_64x64_spritesheet_r8_c6.png",
                    "monsters_64x64_spritesheet_r8_c7.png",
                    "monsters_64x64_spritesheet_r8_c8.png",
                    "monsters_64x64_spritesheet_r8_c9.png",
                    "monsters_64x64_spritesheet_r8_c10.png",
                ],
            ]
        },
        // все img записываются как
        // NAME: {page: atlasPageName, name: imgName},
        Buttons: {
            BG: {page: 'alchemy-main', name: 'bt-bg.png'},
            OVERLAY: {page: 'alchemy-main', name: 'bt-overlay.png'},
            ICON_GIFT: {page: 'alchemy-main', name: 'bt-gift-icon.png'},
            ICON_HOME: {page: 'alchemy-main', name: 'bt-home-icon.png'},
            ICON_SCORE: {page: 'alchemy-main', name: 'bt-score-icon.png'},
            ICON_SETTINGS: {page: 'alchemy-main', name: 'bt-settings-icon.png'},
        },


        Potions: {
            p00_EMPTY: {page: 'alchemy-main', name: 'potion-00-empty.png'},
            p01_BLUE: {page: 'alchemy-main', name: 'potion-01-simple-blue.png'},
            p02_GREEN: {page: 'alchemy-main', name: 'potion-02-simple-green.png'},
            p03_PURPLE: {page: 'alchemy-main', name: 'potion-03-simple-purple.png'},
            p04_FIRE: {page: 'alchemy-main', name: 'potion-04-simple-firegold.png'},
            p05_LOVE: {page: 'alchemy-main', name: 'potion-5-love.png'},
            p06_YELLOW: {page: 'alchemy-main', name: 'potion-6-yellow.png'},
            p07_FLY: {page: 'alchemy-main', name: 'potion-7-fly.png'},
            p08_POISON: {page: 'alchemy-main', name: 'potion-8-poison.png'},
            p09_PURPLE: {page: 'alchemy-main', name: 'potion-9-purple.png'},
            p10_SNAKE: {page: 'alchemy-main', name: 'potion-10-snake.png'},
            p11_JOLLY: {page: 'alchemy-main', name: 'potion-11-jolly.png'},
            p12_POISON: {page: 'alchemy-main', name: 'potion-12-poison.png'},
            p13_FIRE: {page: 'alchemy-main', name: 'potion-13-fire.png'},
            p14_SNOW: {page: 'alchemy-main', name: 'potion-14-snow.png'},
            p15_PLAGUE: {page: 'alchemy-main', name: 'potion-15-plague.png'},
            p16_GODLIGHT: {page: 'alchemy-main', name: 'potion-16-godlight.png'},
            p17_EFIR: {page: 'alchemy-main', name: 'potion-17-efir.png'},
        },

    },

    style: { // -------------------- стили для текста -------------------------
        uiIconLabel: {font: "22px Arial", fill: "#FFFFFF", align: "left"},
        levelBarLabel: {font: "16px Arial", fill: "#FFFFFF", align: "center"},
        levelBarTitle: {font: "24px Arial", fill: "#FFFFFF", align: "center"},
        healthBarLabel: {font: "16px Arial", fill: "#FFFFFF", align: "center"},
        healthBarTitle: {font: "16px Arial", fill: "#FFFFFF", align: "center"},
        monsterTitle: {font: "32px Arial", fill: "#354048", align: "left"},
        monsterDesc: {font: "16px Arial", fill: "#354048", align: "left"},
        monsterHealthBar: {font: "16px Arial", fill: "#354048", align: "right"},
        monsterDamageFloater: {font: "24px Arial", fill: "#DD2200", align: "right"},
    },

    colors: {
        MASK_OPACITY_1: "#ffffff",
        WHITE: "#ffffff",
        BG_DARK: "#333333",
        PROGRESS_BAR: "#9966CC",
        PROGRESS_BAR_BG: "#525855",
        SHADOW_BAR: "#222222",
        HEALTH_BAR: "#CC3300",
        DAMAGE_BAR: "#56221F",
        DEATH_EFFECT_BAR: "#CC3300"
    },

    strings: { // -------------------- строковые переменные -------------------------
        en: {
            levelBarLevel: "Level",
            healthBarTitle: "Your health",
            monsterLevelLabel: "Level",
//            menuStartTitle: "GAME PAUSED",
//            menuStartNewGameItem: "New Game",
        },
        ru: {
            levelBarLevel: "Уровень",
            healthBarTitle: "Твое здоровье",
            monsterLevelLabel: "Уровень",
//            menuStartTitle: "ПАУЗА",
//            menuStartNewGameItem: "Новая игра",

        },
    }
};