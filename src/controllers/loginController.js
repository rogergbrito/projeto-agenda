const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    if(req.session.user) return res.render('login-logado');
    return res.render('login');
};

exports.register = async function(req, res) {
    try {
        const login = new Login(req.body);
        await login.register();  // vai esperar ele executar o register

        if (login.errors.length > 0) {  // tratando possível erro 
            req.flash('errors', login.errors);  // flash messages para mostrar o erro que tivemos ao usuário
            req.session.save(function() {  // salva na sessão para mostrar na página login
                return res.redirect('/login/index');  // redirect envia o usuário de volta a página anterior com a mensagem de erro 
            });
            return;
        }

        req.flash('success', 'Seu usuário foi criado com sucesso.');  // flash messages para mostrar o erro que tivemos ao usuário
        req.session.save(function() {  // salva na sessão para mostrar na página login
            return res.redirect('/login/index');
        });
    } catch(err) {
        console.log(err);
        return res.render('404');
    }
};
exports.login = async function(req, res) {
    try {
        const login = new Login(req.body);
        await login.login();  // vai esperar ele executar o register

        if (login.errors.length > 0) {  // tratando possível erro 
            req.flash('errors', login.errors);  // flash messages para mostrar o erro que tivemos ao usuário
            req.session.save(function() {  // salva na sessão para mostrar na página login
                return res.redirect('/login/index');  // redirect envia o usuário de volta a página anterior com a mensagem de erro 
            });
            return;
        }

        req.flash('success', 'Você entrou no sistema.');  // flash messages para mostrar que o usuário logou
        req.session.user = login.user;
        req.session.save(function() {  // salva na sessão as flash messages para mostrar na página login
            return res.redirect('/login/index');
        });
    } catch(err) {
        console.log(err);
        return res.render('404');
    }
};

exports.logout = function(req, res) {
    req.session.destroy();  // destrói a sessão do usuário, ou seja, ele é deslogado
    res.redirect('/');
}
