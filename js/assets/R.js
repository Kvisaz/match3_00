/**
 *  Компактное обозначение ресурсов
 */
var R = {
    dir: { // -------------------- пути к ресурсам -------------------------
        images: "img",
    },

    fonts: { // -------------------- bitmap fonts -------------------------
        fedoka: {name: "fedoka", png: "fedoka_one_numeric_0.png", xml: "fedoka_one_numeric.fnt"},
        robotoBold: {name: "robotoBold", png: "robotoBold_0.png", xml: "robotoBold.fnt"}
    },

    sounds: {
        winteryLoop: {name: "winteryLoop", files: ['sounds/winteryloop.mp3', 'sounds/winteryloop.ogg']},
        click: {name: "click", files: ['sounds/click.mp3', 'sounds/click.ogg']},
        fall: {name: "switch23", files: ['sounds/switch23.mp3', 'sounds/switch23.ogg']},
        blast: {name: "steamhiss", files: ['sounds/steamhiss.mp3', 'sounds/steamhiss.ogg']},
        undoSwap: {name: "undowall", files: ['sounds/undowall.mp3', 'sounds/undowall.ogg']},
        gameover: {name: "gameover", files: ['sounds/gameover.mp3', 'sounds/gameover.ogg']},
    },

    atlas: { // -------------------- атласы для загрузки -------------------------
        common: ["cristmas_tiles"/*"monsters", "buttons", "items"*/]
    },

    effects: {
        explosion: {name: "explosion", file: "img/exposions_match3_001.png",
            frameWidth: 256, frameHeight: 256, frameMax: -1
        }
    },

    images: {
        bg: {
            cristmas: "bg_first.png"
        },

        overlay: {
            snowTop: {page: "cristmas_tiles", name: "snow_r1_c1.png"},
            snowBottom: {page: "cristmas_tiles", name: "snow_r3_c1.png"},
        },
        ui: {
            scoreBg: {page: "cristmas_tiles", name: "score_bg.png"},
            popupBg: {page: "cristmas_tiles", name: "popup_bg.png"},
        },

        slider: {
            line: {page: "cristmas_tiles", name: "slider_r1_c1.png"},
            pointer: {page: "cristmas_tiles", name: "slider_r3_c2.png"},
        },

        buttons: {
            settingsIdle: {page: "cristmas_tiles", name: "buttons_r1_c1.png"},
            settingsPressed: {page: "cristmas_tiles", name: "buttons_r1_c3.png"},
            newGameIdle: {page: "cristmas_tiles", name: "buttons_r3_c1.png"},
            newGamePressed: {page: "cristmas_tiles", name: "buttons_r3_c10.png"},
            scoreIdle: {page: "cristmas_tiles", name: "buttons_r5_c1.png"},
            scorePressed: {page: "cristmas_tiles", name: "buttons_r5_c11.png"},
            checkBox: {page: "cristmas_tiles", name: "buttons_r7_c2.png"},
            checkMark: {page: "cristmas_tiles", name: "buttons_r8_c5.png"},
        },

        jewels: {
            snow: {page: "cristmas_tiles", name: "chips_68x68_size_r1_c1.png"},
            sockGreen: {page: "cristmas_tiles", name: "chips_68x68_size_r1_c2.png"},
            candyMan: {page: "cristmas_tiles", name: "chips_68x68_size_r1_c3.png"},
            blueBall: {page: "cristmas_tiles", name: "chips_68x68_size_r1_c4.png"},
            sockPink: {page: "cristmas_tiles", name: "chips_68x68_size_r1_c5.png"},
            boxGift: {page: "cristmas_tiles", name: "chips_68x68_size_r1_c6.png"},
            candyHeart: {page: "cristmas_tiles", name: "chips_68x68_size_r1_c7.png"},
            jewelOrange: {page: "cristmas_tiles", name: "chips_68x68_size_r1_c8.png"},
            gloves: {page: "cristmas_tiles", name: "chips_68x68_size_r2_c1.png"},
            candyStick: {page: "cristmas_tiles", name: "chips_68x68_size_r2_c2.png"},
            candyRound: {page: "cristmas_tiles", name: "chips_68x68_size_r2_c3.png"},
            cap: {page: "cristmas_tiles", name: "chips_68x68_size_r2_c4.png"},
            star: {page: "cristmas_tiles", name: "chips_68x68_size_r2_c5.png"},
            snowFoot: {page: "cristmas_tiles", name: "chips_68x68_size_r2_c6.png"},
            ice: {page: "cristmas_tiles", name: "chips_68x68_size_r2_c7.png"},
            boxWood: {page: "cristmas_tiles", name: "chips_68x68_size_r2_c8.png"},
        }
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
            newGame: "NEW GAME",
            scoreTable: "SCORE TABLE",
            musicOn: "Music On",
            musicOff: "Music Off",
            soundOn: "Sounds On",
            soundOff: "Sounds Off",
        },
        ru: {
            newGame: "НОВАЯ ИГРА",
            scoreTable: "РЕКОРДЫ",
            musicOn: "Музыка",
            musicOff: "Музыка",
            soundOn: "Звуки",
            soundOff: "Звуки",
        },
    }
};