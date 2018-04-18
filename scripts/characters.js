/*  ======================================================
    =   Inject html content into page
    ====================================================== */
document.getElementById("new_character_btn").addEventListener("click", function() {
    let body = document.getElementById("new_character_options");
    body.innerHTML =
        "<button id='import_character_btn' class='btn btn-success btn-lg " +
        "new-character-btn'>Import Character</button>" +
        "<button id='create_character_btn' class='btn btn-success btn-lg " +
        "new-character-btn'>Create Character</button>";

    document.getElementById("import_character_btn").addEventListener("click", function() {
        /* Provide file selection window for character sheet */
    });
});
