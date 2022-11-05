require('dotenv').config();  // dando o require no dotenv para chamarmos as chaves definidas nele
const express = require('express');  // importa o express do pacote 
const app = express();  // padrão usar app no express


const mongoose = require('mongoose');  // instanciamos o mongoose para fazer a conexão
mongoose.connect(process.env.CONNECTIONSTRING, 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    })   // conectamos o mongoose  // o objeto serve apenas para não mostrar erro no log
    .then(() => {  // o connect retorna uma promise, então usamos o .then
        console.log('Conectei a base de dados.');  // printa isso antes de iniciar a aplicação
        app.emit('pronto');  // app.emit faz com que o app emita uma notificação de que já está conectado a base, precisamos conectar a base de dados antes de iniciar a aplicação // entre aspas é o sinal que será emitido
    })
    .catch(err => console.log(err));


const session = require('express-session');  // instanciando os pacotes baixados
const MongoStore = require('connect-mongo');  // salva as sessões na base de dados para não ocupar memória local
const flash = require('connect-flash');  // mensagens que somem depois de serem mostradas, geralmente é bom para mandar um feedback ou algo do tipo 


const routes = require('./routes');  // importa os routes do arquivo routes.js para o express usar no app.use
const path = require('path');
const helmet = require('helmet');  // importa o helmet do pacote node_modules
const csrf = require('csurf');  // importa a segurança para formulário do express
const { middlewareGlobal, outroMiddleware, checkCsrfError, csrfMiddlewares } = require('./src/middlewares/middleware');

app.use(helmet());

app.use(express.urlencoded({extended: true}));  // função que trata o body, podemos ver no terminal o body que foi enviado na requisição

app.use(express.static(path.resolve(__dirname, 'public')));  // express vai usar a pasta public como conteúdo estático(onde ficam imagens, html, bundle e coisas estáticas do código)

// SESSIONS
const sessionOptions = session({  // seta as opções da sessão 
    secret: 'aakajkdjskdhihfkff sjdh hdhfjfh sjhdjhf shjdh()',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,  // duração da sessão // 7 dias em milésimos de segundos
        httpOnly: true
    }
});
app.use(sessionOptions);  // usa o sessionOptions   
app.use(flash());  // usa o flash


// SETANDO OS VIEWS
app.set('views', path.resolve(__dirname, 'src', 'views'));  // seta o caminho absoluto dos views  // arquivos que podemos renderizar
// app.set('views', './src/views');  // seta o caminho relativo dos views -> menos seguro!

app.set('view engine', 'ejs');  // este view engine juntamente do "ejs" faz com que possamos usar algumas funções como if, for dentro do HTML // instalar ejs com -> npm i ejs e usar como extensão -> Ex: index.ejs, com isso, podemos renderizar a página HTML criada no res.render() dos controllers

app.use(csrf());  // usando o csrf  // previne que outras pessoas usem a sua rota para postar no seu nome-> sistema de segurança do express

// Nossos próprios middlewares
app.use(middlewareGlobal);  // faz com que todas as requisições em todas as rotas passem pelo middleware criado
app.use(outroMiddleware);  // faz com que todas as requisições em todas as rotas passem pelo middleware criado
app.use(checkCsrfError);
app.use(csrfMiddlewares);

app.use(routes);  // fala para o express usar as rotas criadas


// mongoose
app.on('pronto', () => {  // app.on verifica se o sinal já foi emitido e deixa iniciar a aplicação. Entre aspas está o sinal que ele espera ser emitido
    app.listen(3000, () => {  // rodar o localhost na porta 3000
        console.log('Acessar http://localhost:3000');
        console.log('Servidor executando na porta 3000');   
    })
});
