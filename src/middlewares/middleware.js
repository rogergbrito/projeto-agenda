exports.middlewareGlobal = (req, res, next) => {  // O next faz com que ele passe a executar a próxima função
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next();
};
exports.outroMiddleware = (req, res, next) => {
    next();
};

exports.checkCsrfError = (err, req, res, next) => {
    if(err) {  // nome do erro que o csrf.code retorna
        return res.render('404');  // renderiza o arquivo 404.ejs dos views
    }

    next();
};

exports.csrfMiddlewares = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
};

exports.loginRequired = (req, res, next) => {
    if (!req.session.user) {
        req.flash('errors', 'Você precisa fazer login.');
        req.session.save(() => res.redirect('/'));
        return;
    }

    next();
};