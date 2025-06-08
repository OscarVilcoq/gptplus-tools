function folderModel(folderId, folderName) {
    return $(`
        <div class="folder" id="folder-${folderId}">
            <div class="folder-header btn relative btn-secondary shrink-0">
                <div class="folder-icon">
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_iconCarrier"><path d="M440,432H72a40,40,0,0,1-40-40V120A40,40,0,0,1,72,80h75.89a40,40,0,0,1,22.19,6.72l27.84,18.56A40,40,0,0,0,220.11,112H440a40,40,0,0,1,40,40V392A40,40,0,0,1,440,432Z" style="fill:none;stroke:#ffffff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path><line x1="32" y1="192" x2="480" y2="192" style="fill:none;stroke:#ffffff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></line></g></svg>
                </div>
                <div class="folder-name">${folderName}</div>
                <div class="folder-extra">
                    <button class="delete-folder" title="Supprimer le dossier">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0,0,256,256" style="fill:currentColor;"><g fill="currentColor" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.33333,5.33333)"><path d="M24,4c-3.50831,0 -6.4296,2.62143 -6.91992,6h-6.8418c-0.08516,-0.01457 -0.17142,-0.02176 -0.25781,-0.02148c-0.07465,0.00161 -0.14908,0.00879 -0.22266,0.02148h-3.25781c-0.54095,-0.00765 -1.04412,0.27656 -1.31683,0.74381c-0.27271,0.46725 -0.27271,1.04514 0,1.51238c0.27271,0.46725 0.77588,0.75146 1.31683,0.74381h2.13867l2.51758,26.0293c0.27108,2.80663 2.65553,4.9707 5.47461,4.9707h14.73633c2.81922,0 5.20364,-2.16383 5.47461,-4.9707l2.51953,-26.0293h2.13867c0.54095,0.00765 1.04412,-0.27656 1.31683,-0.74381c0.27271,-0.46725 0.27271,-1.04514 0,-1.51238c-0.27271,-0.46725 -0.77588,-0.75146 -1.31683,-0.74381h-3.25586c-0.15912,-0.02581 -0.32135,-0.02581 -0.48047,0h-6.84375c-0.49032,-3.37857 -3.41161,-6 -6.91992,-6zM24,7c1.87916,0 3.42077,1.26816 3.86133,3h-7.72266c0.44056,-1.73184 1.98217,-3 3.86133,-3zM11.65039,13h24.69727l-2.49219,25.74023c-0.12503,1.29513 -1.18751,2.25977 -2.48828,2.25977h-14.73633c-1.29892,0 -2.36336,-0.96639 -2.48828,-2.25977zM20.47656,17.97852c-0.82766,0.01293 -1.48843,0.69381 -1.47656,1.52148v15c-0.00765,0.54095 0.27656,1.04412 0.74381,1.31683c0.46725,0.27271 1.04514,0.27271 1.51238,0c0.46725,-0.27271 0.75146,-0.77588 0.74381,-1.31683v-15c0.00582,-0.40562 -0.15288,-0.7963 -0.43991,-1.08296c-0.28703,-0.28666 -0.67792,-0.44486 -1.08353,-0.43852zM27.47656,17.97852c-0.82766,0.01293 -1.48843,0.69381 -1.47656,1.52148v15c-0.00765,0.54095 0.27656,1.04412 0.74381,1.31683c0.46725,0.27271 1.04514,0.27271 1.51238,0c0.46725,-0.27271 0.75146,-0.77588 0.74381,-1.31683v-15c0.00582,-0.40562 -0.15288,-0.7963 -0.43991,-1.08296c-0.28703,-0.28666 -0.67792,-0.44486 -1.08353,-0.43852z"></path></g></g></svg>
                    </button>
                </div>
                <div class="folder-arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 9.29289C5.68342 8.90237 6.31658 8.90237 6.70711 9.29289L12 14.5858L17.2929 9.29289C17.6834 8.90237 18.3166 8.90237 18.7071 9.29289C19.0976 9.68342 19.0976 10.3166 18.7071 10.7071L12.7071 16.7071C12.5196 16.8946 12.2652 17 12 17C11.7348 17 11.4804 16.8946 11.2929 16.7071L5.29289 10.7071C4.90237 10.3166 4.90237 9.68342 5.29289 9.29289Z" fill="#ffffff"></path></svg>
                </div>
            </div>
            <div class="folder-chats"></div>
        </div>
    `);
}