const Contato = require('../models/ContatoModel');

exports.index = async (req, res) => {
    const contatos = await Contato.buscaContatos();  // função estática, chamamos com o nome da classe mesmo
    res.render('index', { contatos });  // renderiza a página index com os objetos contatos já nela
};
