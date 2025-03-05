/*
    Export from script.js
*/

import { sidebarOpen, sidebarClose } from './script.mjs';

document.querySelector('.tab_toggle').addEventListener('click', () => {
    sidebarOpen();
});

document.querySelector('.close_sidebar_container').addEventListener('click', () => {
    sidebarClose();
});

/*
    start of three.js part
*/