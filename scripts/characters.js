var fs = require('fs');

let CHAR_PATH = "C:/repos/Dungeon_Tracker/presets/new_preset/characters.json";

loadCharacterList();

/*  ======================================================
    =   Inject html content into page
    ====================================================== */
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

function generateCharacterJSON(attributes) {
    /* just throw all the attributes into a json, and add that to the characters.json for the current preset */
    let char = {
        "name": document.getElementById("form_name").value,
        "level": document.getElementById("form_lvl").value,
        "hp": document.getElementById("form_hp").value,
        "ac": document.getElementById("form_ac").value,
        "proficiency": document.getElementById("form_prof").value,
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

function loadCharacterList() {
    let char_list = JSON.parse(fs.readFileSync(CHAR_PATH, 'utf-8'));
    let char_container = document.getElementById("character_list");
    char_container.innerHTML = "";
    for (var idx in char_list) {
        let name = char_list[idx].name;
        char_container.innerHTML += "<div id='" + name + "' onclick='createCharacterItem(" + JSON.stringify(char_list[idx])
            + ")' class='btn btn-outline-primary w-100'>" + name + "</div>";
    }
}

function createCharacterItem(char) {
    console.log(char);
    /* Generate character details page HTML and fill it with data form the "char" JSON object */
    document.getElementById("content_body").innerHTML =
        '<div class="row"><h2 class="w-100">'+char.name+'</h2></div>'
        + '<div class="row w-100"><div class="progress w-75"><div class="progress-bar" role="progressbar" style="width: 100%" '
        + ' aria-valuenow="' + char.hp + '" aria-valuemin="0" aria-valuemax="'+ char.hp + '"></div></div></div>'
        + '<div class="row w-100">'
            + '<div class="col-sm-4"><h3 id="char_lvl"></h3></div>'
            + '<div class="col-sm-4"><h3 id="char_ac"></h3></div>'
            + '<div class="col-sm-4"><h3 id="char_prof"></h3></div>'
        + '</div>';
}