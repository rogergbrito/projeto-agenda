const Contato = require('../models/ContatoModel');

exports.index = (req, res) => {
    res.render('contato', {
        contato: {}  // setamos um "contato fake"(vazio) para burlar o erro "contato is not defined"
    });
};

exports.register = async (req, res) => {
    try {
        const contato = new Contato(req.body);
        await contato.register();
        
        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect('/contato/index'));
            return;
        }
    
        req.flash('success', 'Contato registrado com sucesso.');
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));  // renderiza a página do contato criado
        return;
    
    } catch(err) {
        console.log(err);
        return res.render('404');
    }
};

exports.editIndex = async function(req, res) {
    if(!req.params.id) return res.render('404');

    const contato = await Contato.buscaPorId(req.params.id);  // chamamos direto na função sem instanciar por ser uma função estática, sem prototypes
    if(!contato) return res.render('404');

    res.render('contato', { contato });
};

exports.edit = async function(req, res) {
    try {
        if(!req.params.id) return res.render('404');
        const contato = new Contato(req.body);
        await contato.edit(req.params.id);

    if(contato.errors.length > 0) {
        req.flash('errors', contato.errors);
        req.session.save(() => res.redirect('/contato/index'));
        return;
    }

    req.flash('success', 'Contato editado com sucesso.');
    req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));  // renderiza a página do contato criado
    return;
    } catch (err) {
        console.log(err);
        res.render('404');
    }
};

exports.delete = async function(req, res) {
    if(!req.params.id) return res.render('404');

    const contato = await Contato.delete(req.params.id);  // chamamos direto na função sem instanciar por ser uma função estática, sem prototypes
    if(!contato) return res.render('404');

    req.flash('success', 'Contato apagado com sucesso.');
    req.session.save(() => res.redirect('/'));  // renderiza a página do contato criado
    return;
}