// Chamando API Electron
const {app, BrowserWindow} = require('electron')
// Chamando Path
const path = require('path')

// Função createWindow - Criar janelaBrowserWindow
function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 470,
    height: 440,
    maximizable: false,
    frame: false,
    transparent: true,
    resizable: false,
    icon: path.join(__dirname, '/assets/icon/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: true
    }
  });

  // Abrir arquivo - index.html
  mainWindow.loadFile('index.html');

}

// Abrir janela após inicializar Electron
app.whenReady().then(createWindow)

// Fechar processos ao fechar todas as janelas
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// Abrir Janela
app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// Iniciando Servidor Local Express
var express = require('express');
var server = express();
var http = require('http').Server(server);

//Iniciando Socket Local
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

// Assets Servidor Local
server.use(express.static(__dirname + '/localWeb/assets'));

// Servindo página para OBS no endereço /BibliaOBS
server.get('/BibliaOBS', function(req, res){
  res.sendFile(__dirname + '/localWeb/index.html');
});

// Ouvindo Sockets e enviando para Janela BrowserWindow e Servidor Local
io.on('connection', function(socket){
  socket.on('showVerse', function(e){
    io.emit('showVerse', e);
  });
  socket.on('style', function(e){
    io.emit('style', e)
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
