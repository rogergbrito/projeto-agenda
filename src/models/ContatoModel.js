const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({  // cria o schema do que será enviado a base de dados
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },  // default deixa uma string vazia se não for enviado
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    criadoEm: { type: Date, default: Date.now },  // na hora que registrar o contato, vai salvar a data daquele momento por padrão
})

const ContatoModel = mongoose.model('Contato', ContatoSchema);  // ContatoModel recebe mongoose.model com o nome do model e o schema dele

function Contato(body) {  // fazendo com constructor function
    this.body = body;
    this.errors = [];
    this.contato = null;
}

Contato.prototype.register = async function() {
    this.valida();
    if(this.errors.length > 0 ) return;
    this.contato = await ContatoModel.create(this.body);
};

Contato.prototype.valida = function() {
    this.cleanUp();

    // Validação
    // O e-mail precisa ser válido
    if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
    if(!this.body.nome) this.errors.push('Nome é um campo obrigatório.');
    if(!this.body.email && !this.body.telefone) {
        this.errors.push('Pelo menos um contato precisa ser enviado: E-mail ou Telefone.');
    }
};

Contato.prototype.cleanUp = function() {
    for(const key in this.body) {
        if(typeof this.body[key] !== 'string') {
            this.body[key] = '';
        }
    }

    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone,
    };
};

Contato.prototype.edit = async function(id) {
    if(typeof id !== 'string') return;
    this.valida();
    if(this.errors.length > 0) return;
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });  // new: true retorna os dados atualizados e não os antigos
};

// Métodos estáticos
Contato.buscaPorId = async function(id) {
    if(typeof id !== 'string') return;
    const contato = await ContatoModel.findById(id);  // busca o id do usuário na base de dados, logo, retorna uma promise
    return contato;
};

Contato.buscaContatos = async function(id) {
    const contatos = await ContatoModel.find()  // podemos colocar o filtro em objeto do que queremos, mas neste caso, não queremos nenhum
        .sort({ criadoEm: -1 });  // vai pegar os contatos com base no parâmetro "criadoEm" da base de dados em ordem decrescente 
    return contatos;
};

Contato.delete = async function(id) {
    if(typeof id !== 'string') return;
    const contato = await ContatoModel.findOneAndDelete({ _id: id });  // acha o contato com o id específico e apaga ele da base de dados, o trecho de código tem que ter a chave _id
    return contato;
};

module.exports = Contato;