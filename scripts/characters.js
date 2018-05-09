/*  ======================================================
    =   Require packages & constants
    ====================================================== */
var fs = require('fs');
var Chart = require("chart.js");

const CHAR_PATH = "C:/repos/Dungeon_Tracker/presets/new_preset/characters.json";
const FORM_SKILLS = ["form_acrobatics", "form_animalhandling", "form_arcana", "form_athletics", "form_deception",
                    "form_history", "form_insight", "form_intimidation", "form_investigation", "form_medicine",
                    "form_nature", "form_perception", "form_performance", "form_persuasion", "form_religion",
                    "form_sleightofhand", "form_stealth", "form_survival"]; 

/*  ======================================================
    =   Inject html content into page
    ====================================================== */
loadCharacterList();

document.getElementById("new_character_btn").addEventListener("click", function() {
    let body = document.getElementById("content_body");
    body.innerHTML =
        "<button id='import_character_btn' class='btn btn-success btn-lg " +
        "new-character-btn'>Import Character</button>" +
        "<button id='create_character_btn' class='btn btn-success btn-lg " +
        "new-character-btn'>Create Character</button>";

    document.getElementById("create_character_btn").addEventListener("click", function() {
        body.innerHTML = "<div include-html='../views/character_partials/new_custom_character.html'></div>";
        includeHTML();
    });
});

/*  ======================================================
    =   Validate new character form
    ====================================================== */
function validate() {
    let inputs = document.getElementsByTagName("input");
    for (idx=0; idx<inputs.length; idx++) {
        if (inputs[idx].value == "") {
            document.getElementById("submit_msg").innerHTML = "Please fill in all of the fields.";
            return false;
        }
    }
    generateCharacterJSON(inputs);
    return true;
}

/*  ======================================================
    =   Append input character details into file as JSON
    ====================================================== */
function generateCharacterJSON(attributes) {
    let char = {
        "name"              : getValue("form_name"),
        "level"             : getValue("form_lvl"),
        "max_hp"            : getValue("form_hp"),
        "curr_hp"           : getValue("form_hp"),
        "ac"                : getValue("form_ac"),
        "alignment"         : getValue("form_align"),
        "strength"          : getValue("form_str"),
        "dexterity"         : getValue("form_dex"),
        "constitution"      : getValue("form_con"),
        "intelligence"      : getValue("form_int"),
        "wisdom"            : getValue("form_wis"),
        "charisma"          : getValue("form_cha"),
        "acrobatics"        : getChecked("form_acrobatics"),
        "animalhandling"    : getChecked("form_animalhandling"),
        "arcana"            : getChecked("form_arcana"),
        "athletics"         : getChecked("form_athletics"),
        "deception"         : getChecked("form_deception"),
        "history"           : getChecked("form_history"),
        "insight"           : getChecked("form_insight"),
        "intimidation"      : getChecked("form_intimidation"),
        "investigation"     : getChecked("form_investigation"),
        "medicine"          : getChecked("form_medicine"),
        "nature"            : getChecked("form_nature"),
        "perception"        : getChecked("form_perception"),
        "performance"       : getChecked("form_performance"),
        "persuasion"        : getChecked("form_persuasion"),
        "religion"          : getChecked("form_religion"),
        "sleightofhand"     : getChecked("form_sleightofhand"),
        "stealth"           : getChecked("form_stealth"),
        "survival"          : getChecked("form_survival"),
        "str_prof"          : getChecked("form_strprof"),
        "dex_prof"          : getChecked("form_dexprof"),
        "con_prof"          : getChecked("form_conprof"),
        "int_prof"          : getChecked("form_intprof"),
        "wis_prof"          : getChecked("form_wisprof"),
        "cha_prof"          : getChecked("form_chaprof"),
        "proficiency"       : getValue("form_proficiency"),
        "passive_wisdom"    : getValue("form_passwis"),
        "spell_save"        : getValue("form_spellsave")
    };

    let raw_chars = fs.readFileSync(CHAR_PATH, 'utf8');
    if (raw_chars.length < 1) {
        fs.writeFileSync(CHAR_PATH, "[" + JSON.stringify(char, null, 4) + "]", "utf-8");
    }
    else {
        raw_chars = "[" + JSON.stringify(char, null, 4) + "," + raw_chars.slice(1);
        fs.writeFileSync(CHAR_PATH, raw_chars, "utf-8");
    }
}

/*  ======================================================
    =   Load a button for each saved character
    ====================================================== */
function loadCharacterList() {
    let raw_chars = fs.readFileSync(CHAR_PATH, 'utf-8');
    if (raw_chars.length > 0) {
        let char_list = JSON.parse(raw_chars);
        let char_container = document.getElementById("character_list");
        char_container.innerHTML = "";
        for (var idx in char_list) {
            let name = char_list[idx].name;
            char_container.innerHTML += "<div id='" + name + "' onclick='createCharacterItem(" + JSON.stringify(char_list[idx])
                + ")' class='btn btn-outline-primary w-100 character-btn'>" + name + "</div>";
        }
    }
}

/*  ======================================================
    =   Generate character details page
    ====================================================== */
function createCharacterItem(char) {
    document.getElementById("content_body").innerHTML =
        '<div class="row"><h2 class="w-100">'+char.name+'</h2></div>'
        + '<div class="row w-100 character-hp"><div class="progress center-div hp-bar hp-container shadow"><div id="hp_bar" '
        + 'class="progress-bar bg-success hp-bar" role="progressbar" aria-valuenow="' + char.curr_hp 
        + '" aria-valuemin="0" aria-valuemax="' + char.max_hp + '">' + char.curr_hp + '/' + char.max_hp + '</div></div></div>'
        + '<div class="row w-100 stat-row">'
            + '<div class="col-sm-4"><h3 id="char_lvl"><img src="../images/level_icon/res/mipmap-hdpi/level_icon.png">' + char.level + '</h3></div>'
            + '<div class="col-sm-4"><h3 id="char_ac"><img src="../images/ac_icon/res/mipmap-hdpi/ac_icon.png">' + char.ac + '</h3></div>'
            + '<div class="col-sm-4"><h3 id="char_prof"><img src="../images/alignment_icon/res/mipmap-hdpi/alignment_icon.png">' + char.alignment + '</h3></div>'
        + '</div>'
        + '<div class="row w-100">'
            + '<div class="col-sm-4">'
                + '<canvas id="attribute_chart" width="400" height="400"></canvas>'
            + '</div><div class="col-sm-4">'
                + '<h3>Saving Throws</h3>'
                + '<ul class="list-group">'
                    + '<li class="list-group-item">' + dispSave("Strength", char.str_prof, "strength", char) + '</li>'
                    + '<li class="list-group-item">' + dispSave("Dexterity", char.dex_prof, "dexterity", char) + '</li>'
                    + '<li class="list-group-item">' + dispSave("Constitution", char.con_prof, "constitution", char) + '</li>'
                    + '<li class="list-group-item">' + dispSave("Intelligence", char.int_prof, "intelligence", char) + '</li>'
                    + '<li class="list-group-item">' + dispSave("Wisdom", char.wis_prof, "wisdom", char) + '</li>'
                    + '<li class="list-group-item">' + dispSave("Charisma", char.cha_prof, "charisma", char) + '</li>'
                + '</ul>'
                + '<div class="row push-down">'
                    + '<div class="col-sm-6 fill-right">'
                        + '<ul class="list-group">'
                            + '<li class="list-group-item">Passive Wisdom: +' + char.passive_wisdom + '</li>'
                        + '</ul></div>'
                    + '<div class="col-sm-6 fill-left"><ul class="list-group">'
                            + '<li class="list-group-item">Spell Save DC: ' + char.spell_save + '</li>'
                        + '</ul></div>'
                + '</div>'
            + '</div><div class="col-sm-4">'
                + '<h3>Skills</h3>'
                + '<div class="row"><div class="col-sm-6">'
                    + '<ul class="list-group">'
                        + '<li class="list-group-item">' 
                            + dispSkill("Acrobatics", char.acrobatics, "dexterity", char) + '</li>'
                        + '<li class="list-group-item">' 
                            + dispSkill("Animal Handling", char.animalhandling, "wisdom", char) + '</li>'
                        + '<li class="list-group-item">' 
                            + dispSkill("Arcana", char.arcana, "intelligence", char) + '</li>'
                        + '<li class="list-group-item">' 
                            + dispSkill("Athletics", char.athletics, "strength", char) + '</li>'
                        + '<li class="list-group-item">' 
                            + dispSkill("Deception", char.deception, "charisma", char) + '</li>'
                        + '<li class="list-group-item">' 
                            + dispSkill("History", char.history, "intelligence", char) + '</li>'
                        + '<li class="list-group-item">' 
                            + dispSkill("Insight", char.insight, "wisdom", char) + '</li>'
                        + '<li class="list-group-item">' 
                            + dispSkill("Intimidation", char.intimidation, "charisma", char) + '</li>'
                        + '<li class="list-group-item">' 
                            + dispSkill("Investigation", char.investigation, "intelligence", char) + '</li>'
                    + '</ul>'
                + '</div><div class="col-sm-6">'
                    + '<ul class="list-group">'
                        + '<li class="list-group-item">' 
                            + dispSkill("Medicine", char.medicine, "wisdom", char) + '</li>'
                        + '<li class="list-group-item">' 
                            + dispSkill("Nature", char.nature, "intelligence", char) + '</li>'
                        + '<li class="list-group-item">' 
                            + dispSkill("Perception", char.perception, "wisdom", char) + '</li>'
                        + '<li class="list-group-item">' 
                            + dispSkill("Performance", char.performance, "charisma", char) + '</li>'
                        + '<li class="list-group-item">' 
                            + dispSkill("Persuasion", char.persuasion, "charisma", char) + '</li>'
                        + '<li class="list-group-item">' 
                            + dispSkill("Religion", char.religion, "intelligence", char) + '</li>'
                        + '<li class="list-group-item">' 
                            + dispSkill("Sleight of Hand", char.sleightofhand, "dexterity", char) + '</li>'
                        + '<li class="list-group-item">' 
                            + dispSkill("Stealth", char.stealth, "dexterity", char) + '</li>'
                        + '<li class="list-group-item">' 
                            + dispSkill("Survival", char.survival, "wisdom", char) + '</li>'
            + '</ul></div></div></div>'
        + '</div>';
    /* Populate the polar area chart */
    updateHP(char);
    let data = {
        datasets: [{
            data: [char.strength, char.dexterity, char.constitution, char.intelligence, char.wisdom, char.charisma],
            backgroundColor: [
                "rgba(255, 0, 0, 0.5)",
                "rgba(100, 255, 0, 0.5)",
                "rgba(255, 255, 0, 0.5)",
                "rgba(0, 0, 255, 0.5)",
                "rgba(255, 0, 255, 0.5)",
                "rgba(0, 255, 255, 0.5)"
              ]
        }],
        labels: ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"]
    };
    let options = {
        legend: {
            display: false,
            position: "left"
        },
        title: {
            display: true,
            text: 'Attributes',
            fontSize: 24
        }
    };
    let ctx = document.getElementById("attribute_chart");
    let chart = new Chart(ctx, {
        data: data,
        type: "polarArea",
        options: options
    });
}

/*  ======================================================
    =   Calculate the modifier for a given attribute value
    ====================================================== */
function modifier(attribute, prof) {
    let value = (~~((attribute - 10) / 2)) + prof;
    if (value >= 0) {
        value = "+" + value;
    }
    return value;
}

/*  ======================================================
    =   Calculate the HP % and update the HP display
    ====================================================== */
function updateHP(char) {
    let percent = char.curr_hp / char.max_hp * 100;
    document.getElementById("hp_bar").setAttribute("style", 'width: ' + percent + '%');
    if (percent < 20) {
        document.getElementById("hp_bar").setAttribute("class", 'progress-bar bg-danger hp-bar');
    }
    else if (percent < 50) {
        document.getElementById("hp_bar").setAttribute("class", 'progress-bar bg-warning hp-bar');
    }
    else {
        document.getElementById("hp_bar").setAttribute("class", 'progress-bar bg-success hp-bar');
    }
}

function getValue(id) {
    return document.getElementById(id).value;
}

function getChecked(id) {
    return document.getElementById(id).checked;
}

function dispSave(name, prof, attribute, char) {
    let root = name + ": ";
    if (prof) {
        root = "<b>" + root + modifier(char[attribute], parseInt(char.proficiency)) + "</b>";
    }
    else {
        root = root + modifier(char[attribute], 0);
    }
    return root;
}

function dispSkill(name, prof, attribute, char) {
    let root = name + ": ";
    if (prof) {
        root = "<b>" + root + modifier(char[attribute], parseInt(char.proficiency)) + "</b>";
    }
    else {
        root = root + modifier(char[attribute], 0);
    }
    return root;
}