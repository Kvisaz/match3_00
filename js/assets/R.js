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
            snowTop: {page: "cristmas_tiles", name: "snow_r1_c1"},
            snowBottom: {page: "cristmas_tiles", name: "snow_r3_c1"},
        },
        ui: {
            scoreBg: {page: "cristmas_tiles", name: "score_bg"},
            popupBg: {page: "cristmas_tiles", name: "popup-bg"},
        },

        slider: {
            line: {page: "cristmas_tiles", name: "slider_r1_c1"},
            pointer: {page: "cristmas_tiles", name: "slider_r3_c2"},
        },

        buttons: {
            settingsIdle: {page: "cristmas_tiles", name: "buttons-settings-idle"},
            settingsPressed: {page: "cristmas_tiles", name: "buttons-settings-pressed"},
            bigGreenIdle: {page: "cristmas_tiles", name: "button-green-big-idle"},
            bigGreenPressed: {page: "cristmas_tiles", name: "button-green-big-pressed"},
            midGreenIdle: {page: "cristmas_tiles", name: "button-green-240-idle"},
            midGreenPressed: {page: "cristmas_tiles", name: "button-green-240-pressed"},
            midBlueIdle: {page: "cristmas_tiles", name: "button-blue-240-idle"},
            midBluePressed: {page: "cristmas_tiles", name: "button-blue-240-pressed"},
            midRedIdle: {page: "cristmas_tiles", name: "button-red-240-idle"},
            midRedPressed: {page: "cristmas_tiles", name: "button-red-240-pressed"},
            checkBox: {page: "cristmas_tiles", name: "buttons-checkbox"},
            checkMark: {page: "cristmas_tiles", name: "buttons-checkmark"},
        },

        jewels: {
            snow: {page: "cristmas_tiles", name: "chips_68x68_size_r1_c1"},
            sockGreen: {page: "cristmas_tiles", name: "chips_68x68_size_r1_c2"},
            candyMan: {page: "cristmas_tiles", name: "chips_68x68_size_r1_c3"},
            blueBall: {page: "cristmas_tiles", name: "chips_68x68_size_r1_c4"},
            sockPink: {page: "cristmas_tiles", name: "chips_68x68_size_r1_c5"},
            boxGift: {page: "cristmas_tiles", name: "chips_68x68_size_r1_c6"},
            candyHeart: {page: "cristmas_tiles", name: "chips_68x68_size_r1_c7"},
            jewelOrange: {page: "cristmas_tiles", name: "chips_68x68_size_r1_c8"},
            gloves: {page: "cristmas_tiles", name: "chips_68x68_size_r2_c1"},
            candyStick: {page: "cristmas_tiles", name: "chips_68x68_size_r2_c2"},
            candyRound: {page: "cristmas_tiles", name: "chips_68x68_size_r2_c3"},
            cap: {page: "cristmas_tiles", name: "chips_68x68_size_r2_c4"},
            star: {page: "cristmas_tiles", name: "chips_68x68_size_r2_c5"},
            snowFoot: {page: "cristmas_tiles", name: "chips_68x68_size_r2_c6"},
            ice: {page: "cristmas_tiles", name: "chips_68x68_size_r2_c7"},
            boxWood: {page: "cristmas_tiles", name: "chips_68x68_size_r2_c8"},
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
            backSettings: "BACK",
            newGame: "NEW GAME",
            scoreTable: "SCORE TABLE",
            musicOn: "Music On",
            musicOff: "Music Off",
            soundOn: "Sounds On",
            soundOff: "Sounds Off",
        },
        ru: {
            backSettings: "ПРОДОЛЖИТЬ",
            newGame: "НОВАЯ ИГРА",
            scoreTable: "РЕКОРДЫ",
            musicOn: "Музыка",
            musicOff: "Музыка",
            soundOn: "Звуки",
            soundOff: "Звуки",
        },
    }
};