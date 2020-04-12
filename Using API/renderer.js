//  Acessando Servidor Socket Local
var socket = io('http://localhost:3000');
const authToken = ''; //Insira o Token de Autenticação aqui
 // Obtendo acesso à API
const api = axios.create({
    baseURL: ' https://bibleapi.co/api',
    headers: { 'Authorization': authToken }
});

window.addEventListener('DOMContentLoaded', () => {
    // Enviar para Tela

    // Obtendo variáveis da janela BrowserWindow
    let version = document.getElementById('version');
    let book = document.getElementById('book');
    let chapter = document.getElementById('chapter');
    let verse = document.getElementById('verse');
    let prevVerse = document.getElementById('prevVerse');
    let nextVerse = document.getElementById('nextVerse');
    let sendScreen = document.getElementById('sendScreen');

    //Adicionando Eventos
    book.addEventListener('change', changeBook);
    chapter.addEventListener('change', changeChapter);
    verse.addEventListener('change', changeVerse);
    version.addEventListener('change', sendVerse);
    sendScreen.addEventListener('click', sendVerse);
    
    // Obtendo Lista de Livros
    api.get('books')
    .then(({ data }) => {
        books = '';
        data.map(({ name, abbrev }) => {
            books += `<option value=${abbrev.pt}>${name}</option>`
        });
        book.innerHTML += books;
        changeBook();
    });

    // Função ChangeBook - Mudar de Livro
    function changeBook(option){
        // Obtendo Lista de Capítulos
        api.get(`books/${book.value}`)
            .then(({ data }) => {
                let { chapters } = data;
                chapter.innerHTML = '';
                for(let i = 1; i <= chapters; i++){
                    if(i == 1){
                        chapter.innerHTML += `<option value=${i} selected>${i}</option>`
                    }else{
                        chapter.innerHTML += `<option value=${i}>${i}</option>`
                    }
                }
                if(option == 'prev'){ 
                    chapter.value = chapters;
                    changeChapter(option);
                }else if(option == 'next' || option == 'change'){
                    changeChapter(option);
                }else{
                    changeChapter();
                }
            });
    }

    // Função ChangeChapter - Mudar Capítulo
    function changeChapter(option){
        // Obtendo Lista de Versículos
        api.get(`verses/${version.value}/${book.value}/${chapter.value}`)
            .then(({ data }) => {
                let { chapter } = data;
                var { verses } = chapter;
                verse.innerHTML = '';
                for(let i = 1; i <= verses; i++){
                    if(i == 1){
                        verse.innerHTML += `<option value=${i} selected>${i}</option>`
                    }else{
                        verse.innerHTML += `<option value=${i}>${i}</option>`
                    }
                }
                if(option == 'prev'){
                    verse.value = verses;
                    changeVerse(option);
                }else if(option == 'next' || option == 'change'){
                    changeVerse(option);
                }
                changeVerse();
            });
    }

    // Função ChangeVerse - Mudar Versículo
    function changeVerse(option){
        // Mostrando no Controle
        let actualVerse = document.getElementById('actualVerse');
        actualVerse.innerHTML = `${book.options[book.selectedIndex].text} ${chapter.value}:${verse.value}`;
        if(option == 'prev' || option == 'next' || option == 'change'){
            sendVerse();
        }
    }

    // Adicionando Evento prevVerse - Versículo Anterior
    prevVerse.addEventListener('click', () => {
        let actualBook = parseInt(book.options.selectedIndex);
        let actualChapter = parseInt(chapter.value);
        let actualVerse = parseInt(verse.value);
        if(actualVerse > 1){
            verse.value = actualVerse - 1;
            changeVerse('change');
        }
        else if((actualBook > 1) && (actualChapter  == 1) && (actualVerse  == 1)){
            book.options.selectedIndex = actualBook - 1;
            changeBook('prev');
        }
        else if((actualChapter > 1) && (actualVerse == 1)){
            chapter.value = actualChapter - 1;
            changeChapter('prev');
        }
    });

    // Adicionando Evento nextVerse - Próximo Versículo
    nextVerse.addEventListener('click', () => {
        let actualBook = parseInt(book.options.selectedIndex);
        let actualChapter = parseInt(chapter.value);
        let actualVerse = parseInt(verse.value);
        if(actualVerse < verse.length){
            verse.value = actualVerse + 1;
            changeVerse('change');
        }
        else if((actualBook < book.length) && (actualChapter == chapter.length) && (actualVerse  == verse.length)){
            book.options.selectedIndex = actualBook + 1;
            changeBook('next');
        }
        else if((actualChapter < chapter.length) && (actualVerse  == verse.length)){
            chapter.value = actualChapter + 1;
            changeChapter('next');
        }
    });

    // Função sendVerse - Mandar para http://localhost:3000/BibliaOBS via Socket.io
    function sendVerse(){
        api.get(`verses/${version.value}/${book.value}/${chapter.value}/${verse.value}`)
        .then(({ data }) => {
            var { text } = data;
            let showVerse = {
                book: book.options[book.selectedIndex].text,
                chapterNumber: chapter.value,
                verseNumber: verse.value,
                verse: text
            }
            socket.emit('showVerse', showVerse);
        });
    }

    //Estilos da Tela

    // Obtendo variáveis da janela BrowserWindow
    let backgroundColor = document.getElementById('backgroundColor');
    let textSize = document.getElementById('textSize');
    let sendStyle = document.getElementById('sendStyle');
    let textColor = document.getElementById('textColor');
    let textAlign = document.getElementById('textAlign');

    // Adicionando Evento sendStyle - Mandar para http://localhost:3000/BibliaOBS via Socket.io
    sendStyle.addEventListener('click', () => {
        let styles = {
            backgroundColor: backgroundColor.value,
            color: textColor.value,
            fontSize: textSize.value + 'px',
            textAlign: textAlign.value
        }
        socket.emit('style', styles);
    });
});