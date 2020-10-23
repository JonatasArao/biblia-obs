// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

// Chamando API Electron
const app = require('electron').remote.app;
const { remote } = require('electron');

// Chamando API de Fontes
const fontList = require('font-list')

window.addEventListener('DOMContentLoaded', () => {
    // Obtendo variáveis da janela BrowserWindow
    let btnMinimize = document.getElementById('btnMinimize');
    let btnClose = document.getElementById('btnClose');

    // Adicionando Evento btnMinimize - Minimizar Janela
    btnMinimize.addEventListener('click', () => {
        remote.BrowserWindow.getFocusedWindow().minimize();
    });

    //Adicionando Evento btnClose - Fechar Janela
    btnClose.addEventListener('click', () => {
        remote.BrowserWindow.getFocusedWindow().close();
    });

    // Obtendo variáveis da janela BrowserWindow
    let font = document.getElementById('font');

    
    fontList.getFonts()
        .then(fonts => {
            fontValue = '';
            fonts.map((font) => {
                font = font.replace(/"/g,'');
                fontValue += `<option value='${font}' style="font-family:'${font}'">${font}</option>`
            });
            font.innerHTML += fontValue;
        })
});