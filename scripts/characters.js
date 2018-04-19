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
