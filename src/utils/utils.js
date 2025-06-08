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