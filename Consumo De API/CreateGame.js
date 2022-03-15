const axios = require("axios");

class CreateGame{

    createGame(){
        var titleInput = document.getElementById("title");
        var yearInput = document.getElementById("year");
        var priceInput = document.getElementById("price");
        
        var game = {
            title: titleInput.value,
            year: yearInput.value,
            price: priceInput.value
        }

        axios.post("http://localhost:8080/game", game).then(response => {
            if(response.status == 200){
                alert("Game Cadastrado!")
            }
        }).catch(error => {
            console.log(error)
        })
    }
}

module.exports = CreateGame;