/*  ======================================================
    =   Require packages & constants
    ====================================================== */
var fs = require('fs');
var Chart = require("chart.js");

let CHAR_PATH = "C:/repos/Dungeon_Tracker/presets/new_preset/characters.json";

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
        "name": document.getElementById("form_name").value,
        "level": document.getElementById("form_lvl").value,
        "max_hp": document.getElementById("form_hp").value,
        "curr_hp": document.getElementById("form_hp").value,
        "ac": document.getElementById("form_ac").value,
        "alignment": document.getElementById("form_align").value,
        "strength": document.getElementById("form_str").value,
        "dexterity": document.getElementById("form_dex").value,
        "constitution": document.getElementById("form_con").value,
        "intelligence": document.getElementById("form_int").value,
        "wisdom": document.getElementById("form_wis").value,
        "charisma": document.getElementById("form_cha").value
    };

    let raw_chars = fs.readFileSync(CHAR_PATH, 'utf8');
    if (raw_chars.length < 1) {
        fs.writeFileSync(CHAR_PATH, "[" + JSON.stringify(char) + "]", "utf-8");
    }
    else {
        raw_chars = "[" + JSON.stringify(char) + "," + raw_chars.slice(1);
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
            + '</div><div class="col-sm-4">'
                + '<h3>Skills (no proficiency)</h3>'
                + '<div class="row"><div class="col-sm-6">'
                    + '<ul class="list-group">'
                        + '<li class="list-group-item">Acrobatics: ' + modifier(char.dexterity) + '</li>'
                        + '<li class="list-group-item">Animal Handling: ' + modifier(char.wisdom) + '</li>'
                        + '<li class="list-group-item">Arcana: ' + modifier(char.intelligence) + '</li>'
                        + '<li class="list-group-item">Athletics: ' + modifier(char.strength) + '</li>'
                        + '<li class="list-group-item"><b>Deception: ' + modifier(char.charisma) + '</b></li>'
                        + '<li class="list-group-item">History: ' + modifier(char.intelligence) + '</li>'
                        + '<li class="list-group-item">Insight: ' + modifier(char.wisdom) + '</li>'
                        + '<li class="list-group-item">Intimidation: ' + modifier(char.charisma) + '</li>'
                        + '<li class="list-group-item">Investigation: ' + modifier(char.intelligence) + '</li>'
                    + '</ul>'
                + '</div><div class="col-sm-6">'
                    + '<ul class="list-group">'
                        + '<li class="list-group-item">Medicine: ' + modifier(char.wisdom) + '</li>'
                        + '<li class="list-group-item">Nature: ' + modifier(char.intelligence) + '</li>'
                        + '<li class="list-group-item">Perception: ' + modifier(char.wisdom) + '</li>'
                        + '<li class="list-group-item">Performance: ' + modifier(char.charisma) + '</li>'
                        + '<li class="list-group-item">Persuasion: ' + modifier(char.charisma) + '</li>'
                        + '<li class="list-group-item">Religion: ' + modifier(char.intelligence) + '</li>'
                        + '<li class="list-group-item">Sleight of Hand: ' + modifier(char.dexterity) + '</li>'
                        + '<li class="list-group-item">Stealth: ' + modifier(char.dexterity) + '</li>'
                        + '<li class="list-group-item">Survival: ' + modifier(char.wisdom) + '</li>'
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
function modifier(attribute) {
    let value = (~~((attribute - 10) / 2));
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