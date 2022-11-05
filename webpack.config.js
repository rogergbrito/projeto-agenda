const path = require('path');  // CommonJS - padrão do NodeJS

module.exports = {  // exporta só o que queremos
    mode: 'development',  
    entry: './frontend/main.js',  // pasta de entrada onde será inserido o código
    output: {  // caminho da pasta de saída
        path: path.resolve(__dirname, 'public', 'assets', 'js'),  // como estamos usando o resolve, ele já resolve e acha o caminho da pasta para você, não precisa de barras
        filename: 'bundle.js'  // arquivo que será gerado pelo webpack e babel  // o bundle vai armazenar o código de vários arquivos diferentes que você criar no projeto 
    },
    module: {
        rules: [{  // regras 
            exclude: /node_modules/,  // exclui o node_modules para não ter que carregar toda vez e deixar o sistema lento
            test: /\.js$/,
            use: {
                loader: 'babel-loader',  //usa o loader babel-loader definido no package.json
                options: {
                    presets: ['@babel/env']  // usa os presets do @babel/env
                } 
            }
        }]
    },
    devtool: 'source-map'  // mapeia algum possível erro no arquivo original
};