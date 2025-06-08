function insertChatFolderButton() {
    const pathMatch = window.location.href.match(/\/c\/([^\/]+)/);
    if (!pathMatch) return;

    const chatId = pathMatch[1];
    const chatName = $("a[data-active] span").text();

    waitForElement('#conversation-header-actions', function($container) {
        if ($container.find("#addToFolder, #removeFromFolder").length > 0) return;

        const icons = {
            add: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C12.5523 3 13 3.44772 13 4L13 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13L13 13L13 20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20L11 13L4 13C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11L11 11L11 4C11 3.44772 11.4477 3 12 3Z" fill="#ffffff"></path></svg>`,
            remove: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,256,256" style="fill:currentColor;" class="icon-md"><g fill="currentColor"><g transform="scale(5.33333,5.33333)"><path d="M24,4c-3.50831,0-6.4296,2.62143-6.91992,6h-6.8418c-.08516-.01457-.17142-.02176-.25781-.02148-.07465.00161-.14908.00879-.22266.02148h-3.25781c-.54095-.00765-1.04412.27656-1.31683.74381s-.27271 1.04514 0 1.51238.77588.75146 1.31683.74381h2.13867l2.51758 26.0293c.27108 2.80663 2.65553 4.9707 5.47461 4.9707h14.73633c2.81922 0 5.20364-2.16383 5.47461-4.9707l2.51953-26.0293h2.13867c.54095.00765 1.04412-.27656 1.31683-.74381s.27271-1.04514 0-1.51238-.77588-.75146-1.31683-.74381h-3.25586c-.15912-.02581-.32135-.02581-.48047 0h-6.84375c-.49032-3.37857-3.41161-6-6.91992-6zM24 7c1.87916 0 3.42077 1.26816 3.86133 3h-7.72266c.44056-1.73184 1.98217-3 3.86133-3zM11.65039 13h24.69727l-2.49219 25.74023c-.12503 1.29513-1.18751 2.25977-2.48828 2.25977H16.631c-1.29892 0-2.36336-.96639-2.48828-2.25977zM20.47656 17.97852c-.82766.01293-1.48843.69381-1.47656 1.52148v15c-.00765.54095.27656 1.04412.74381 1.31683.46725.27271 1.04514.27271 1.51238 0 .46725-.27271.75146-.77588.74381-1.31683v-15c.00582-.40562-.15288-.7963-.43991-1.08296-.28703-.28666-.67792-.44486-1.08353-.43852zM27.47656 17.97852c-.82766.01293-1.48843.69381-1.47656 1.52148v15c-.00765.54095.27656 1.04412.74381 1.31683.46725.27271 1.04514.27271 1.51238 0 .46725-.27271.75146-.77588.74381-1.31683v-15c.00582-.40562-.15288-.7963-.43991-1.08296-.28703-.28666-.67792-.44486-1.08353-.43852z"/></g></g></svg>`
        };

        const createFolderButton = ({ id, label, onClick }) => $(`
            <button id="${id}" class="btn btn-secondary ml-2">
                <div class="flex min-w-0 items-center gap-1.5">
                    <div class="flex shrink-0 items-center justify-center h-[18px] w-[18px]">${icons[id === "addToFolder" ? "add" : "remove"]}</div>
                    <div class="flex min-w-0 grow items-center gap-2">
                        <div class="truncate">${label}</div>
                    </div>
                </div>
            </button>
        `).on("click", onClick);

        const reloadAndPrompt = (actionType) => {
            chrome.storage.local.get({ assignments: {}, folders: {} }, ({ assignments, folders }) => {
                if (actionType === "add") {
                    const folderName = prompt("Dans quel dossier ajouter cette conversation ?")?.trim();
                    if (!folderName) return;

                    const folderId = Object.keys(folders).find(id => folders[id].trim().toLowerCase() === folderName.toLowerCase());
                    if (!folderId) return alert("Ce dossier n'existe pas.");

                    assignments[folderId] ||= {};
                    assignments[folderId][chatId] = { id: chatId, name: chatName };
                    chrome.storage.local.set({ assignments }, updateChats);
                } else {
                    const folderId = $("a[data-active]").closest(".folder[id^='folder-']").attr("id")?.replace("folder-", "");
                    if (!folderId) return alert("Le dossier n'existe pas.");

                    if (assignments[folderId]?.[chatId]) {
                        delete assignments[folderId][chatId];
                        if (Object.keys(assignments[folderId]).length === 0) delete assignments[folderId];
                        chrome.storage.local.set({ assignments }, () => {
                            alert(`Supprimé de "${folders[folderId]}"`);
                            window.location.reload();
                        });
                    } else {
                        alert(`Ce chat n'est pas dans le dossier.`);
                    }
                }
            });
        };

        chrome.storage.local.get({ assignments: {} }, ({ assignments }) => {
            const isAssigned = Object.values(assignments).some(folder => folder[chatId]);
            const buttonConfig = isAssigned
                ? { id: "removeFromFolder", label: "Supprimer du dossier", onClick: () => reloadAndPrompt("remove") }
                : { id: "addToFolder", label: "Ajouter à un dossier", onClick: () => reloadAndPrompt("add") };
            $container.prepend(createFolderButton(buttonConfig));
        });
    });
}

function insertButtonFolder() {
    const $nav = $("nav").first().find("aside").first();
    if ($nav.length === 0 || $("#addFolderBtn").length > 0) return;

    const $btn = $(`
        <a id="addFolderBtn" class="group __menu-item justify-between gap-6 data-fill:gap-2">
            <div class="flex min-w-0 items-center gap-1.5">
                <div class="flex shrink-0 items-center justify-center h-[18px] w-[18px]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C12.5523 3 13 3.44772 13 4L13 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13L13 13L13 20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20L11 13L4 13C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11L11 11L11 4C11 3.44772 11.4477 3 12 3Z" fill="#ffffff"></path>
                    </svg>
                </div>
                <div class="flex min-w-0 grow items-center gap-2">
                    <div class="truncate">Nouveau dossier</div>
                </div>
            </div>
        </a>
    `);

    $btn.on("click", async (e) => {
        e.preventDefault();
        const folderName = prompt("Nom du nouveau dossier :");
        if (!folderName) return;

        const { folders } = await chrome.storage.local.get({ folders: {} });
        if (Object.values(folders).includes(folderName.toLowerCase())) {
            alert("Ce dossier existe déjà !");
            return;
        }

        folders[generateUUID()] = folderName;
        await chrome.storage.local.set({ folders });
        loadFolders();
    });

    $nav.prepend($btn);
}

function updateChats() {
    waitForElement('#history', async function($history) {
        const { assignments } = await chrome.storage.local.get({ assignments: {} });

        for (const [folderId, chatsObj] of Object.entries(assignments)) {
            const $folderChats = $(`#folder-${folderId} .folder-chats`);
            if ($folderChats.length === 0) continue;

            for (const chatId of Object.keys(chatsObj)) {
                const $chat = $history.find(`a[href*="/c/${chatId}"]`).first();
                if ($chat.length) $folderChats.append($chat);
            }
        }
    });
}

function loadFolders() {
    waitForElement('#history', async function($history) {
        const { folders, assignments } = await chrome.storage.local.get({ folders: {}, assignments: {} });

        $("#folders, .folder").remove();
        const $folders = $('<div id="folders" class="folders"></div>');
        $history.before($folders);

        for (const [folderId, folderName] of Object.entries(folders)) {
            const $folderDiv = folderModel(folderId, folderName);

            $folderDiv.find(".folder-header").on("click", () => $folderDiv.toggleClass("open"));

            $folderDiv.find(".delete-folder").on("click", async (e) => {
                e.stopPropagation();
                if (confirm(`Supprimer le dossier "${folderName}" ?`)) {
                    delete folders[folderId];
                    delete assignments[folderId];
                    await chrome.storage.local.set({ folders, assignments });
                    window.location.reload();
                }
            });

            $folders.append($folderDiv);
        }

        $history.find("a[href*='/c/']").each(function () {
            const $a = $(this);
            const id = $a.attr("href").split("/c/")[1];
            const result = idExistsInAssignments(assignments, id);

            if (result.found) {
                const $targetFolder = $folders.find(`#folder-${result.folder}`);
                const $clone = $a.clone(true, true);
                $targetFolder.find(".folder-chats").append($clone);
            }
        });

        const $notListed = $(`
            <div class="folder">
                <div class="folder-header btn relative btn-secondary shrink-0">
                    <div class="folder-name">Non répertoriés</div>
                    <div class="folder-arrow">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 9.29289C5.68342 8.90237 6.31658 8.90237 6.70711 9.29289L12 14.5858L17.2929 9.29289C17.6834 8.90237 18.3166 8.90237 18.7071 9.29289C19.0976 9.68342 19.0976 10.3166 18.7071 10.7071L12.7071 16.7071C12.5196 16.8946 12.2652 17 12 17C11.7348 17 11.4804 16.8946 11.2929 16.7071L5.29289 10.7071C4.90237 10.3166 4.90237 9.68342 5.29289 9.29289Z" fill="#ffffff"></path>
                        </svg>
                    </div>
                </div>
            </div>
        `);

        $notListed.find(".folder-header").on("click", () => {
            $notListed.toggleClass("open");
            $history.toggleClass("open");
        });

        $folders.append($notListed);
    });
}