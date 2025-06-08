function waitForElement(selector, callback, timeout = 10000) {
    const startTime = performance.now();

    function check() {
        const $elt = $(selector);
        if ($elt.length > 0) {
            callback($elt);
        } else if (performance.now() - startTime < timeout) {
            requestAnimationFrame(check);
        } else {
            console.warn(`waitForElement: élément '${selector}' introuvable après ${timeout / 1000}s`);
        }
    }

    check();
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function idExistsInAssignments(assignments, id) {
    for (const folder in assignments) {
        if (assignments[folder].hasOwnProperty(id)) {
            return { folder, found: true };
        }
    }
    return { folder: null, found: false };
}

function checkAndInsertElements() {
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