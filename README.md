# Bíblia OBS
Bíblia OBS é uma ferramenta criada para auxiliar na exibição dos versos da Bíblia em uma transmissão ao-vivo via OBS

## Dependências

* [Socket.io](https://socket.io/)
* [axios](https://github.com/axios/axios)
* [bibleAPI](https://bibleapi.co/)

## Dependências de Desenvoldedor
* [Node.js](https://nodejs.org/en/)
* [Electron](https://www.electronjs.org/)
* [electron.builder](https://www.electron.build/)
* [nodemon](https://nodemon.io/)

## Iniciando
1. Clone esse repositório
2. `cd '.\Using API\'`
3. Execute o comando `npm install` para instalar dependências
4. Execute o comando `npm run start`

#### Observações
> bibleAPI tem o limite de 20 requisições/hora/ip sem Autenticação.<br>
Para obter o Token de Autenticação siga os passos na documentação do [bibleApi](https://github.com/marciovsena/bibleapi/blob/dev/DOCUMENTATION.md).<br>
Após insira o Token na váriavel `authToken` em `.\Using API\renderer.js`
```javascript
(...)
const authToken = ''; //Insira o Token de Autenticação aqui
const api = axios.create({
    baseURL: ' https://bibleapi.co/api',
    headers: { 'Authorization': authToken }
});
(...)
```
