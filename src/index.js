function init() {
    const pathMatch = window.location.href.match(/\/c\/([^\/]+)/);
    if (pathMatch) {
        const $container = $("#conversation-header-actions");
        if ($container.length > 0 && $container.find("#addToFolder, #removeFromFolder").length === 0) {
            insertChatFolderButton();
        }
    }

    const $promptsBtn = $('[data-testid="composer-footer-actions"] #viewPrompts')
    if ($promptsBtn.length === 0) {
        insertPromptBtn()
    }

    const $nav = $("nav").first().find("aside").first();
    if ($nav.length > 0 && $("#addFolderBtn").length === 0) {
        insertButtonFolder();
    }

    const $history = $("#history");
    if ($history.length > 0 && $("#folders").length === 0) {
        loadFolders();
    }
}

setInterval(init, 2000);