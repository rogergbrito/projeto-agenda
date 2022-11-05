const mongoose = require('mongoose');
const validator = require('validator');  // importa um validador do pacote, para instalar, basta rodar o npm i validator
const bcryptjs = require('bcryptjs');  // importa o bcryptjs do pacote para "criptografar" a senha no base de dados

const LoginSchema = new mongoose.Schema({  // cria o schema do que será enviado a base de dados
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];  // controla para ver se o usuário pode ou não ser criado na base de dados, se a array tiver erros, não roda
        this.user = null;
    }

    async login() {
        this.valida();
        if (this.errors.length > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email });  // / await para esperar o LoginModel ocorrer // "findOne()" verifica se o email enviado nos parâmetros já existe na base de dados

        if (!this.user) {
            this.errors.push('Usuário não existe.');
            return;
        }

        if (!bcryptjs.compareSync(this.body.password, this.user.password)) {  // compara o body do código com o hash(dados enviados) da base de dados
            this.errors.push('Senha inválida.');
            this.user = null;
            return;
        }
    }

    async register() {  // register é async porque vai ser o responsável por jogar os dados na base de dados, logo, ele retorna uma promise
        this.valida();
        if (this.errors.length > 0) return;

        await this.userExists();  // espera ele verificar na base de dados se o usuário já existe

        if (this.errors.length > 0) return;  // verifica de novo, só que agora vê se tem o erro "Usuário já existe" na array

        const salt = bcryptjs.genSaltSync();  // salva a função genSaltSync() na variável salt 
        this.body.password = bcryptjs.hashSync(this.body.password, salt);  // usa ela no hashSync para "criptografar" a password no mongoDB

        this.user = await LoginModel.create(this.body)  // já envia o this.body, o objeto foi limpo na função cleanUp, retorna promise
    }

    async userExists() {  // vai mexer na base de dados, logo, retorna promise
        this.user = await LoginModel.findOne({ email: this.body.email });  // await para esperar o LoginModel ocorrer // "findOne()" verifica se o email enviado nos parâmetros já existe na base de dados
        if(this.user) this.errors.push('Usuário já existe.');
    }

    valida() {
        this.cleanUp();
        // Validação
        // O e-mail precisa ser válido
        if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');

        // A senha precisa ter entre 3 e 50 caracteres
        if (this.body.password.length < 3 || this.body.password.length > 50) {
            this.errors.push('A senha precisa ter entre 3 e 50 caracteres.');
        }
    }

    cleanUp() {
        for(const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    }
}

module.exports = Login;