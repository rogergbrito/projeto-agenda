const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({  // cria o schema do que será enviado a base de dados
    titulo: { type: String, required: true },
    descricao: String
})

const HomeModel = mongoose.model('Home', HomeSchema);  // HomeModel recebe mongoose.model com o nome do model e o schema dele

class Home {

}

module.exports = Home;