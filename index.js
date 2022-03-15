const express = require("express");
const app = express();

const bodyParser = require("body-parser");

const cors = require("cors")

const jwt = require("jsonwebtoken");


const jwtSecret = "klkshliapkmciajskdnviasjkdfjelikgj"

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


function auth(req, res, next){
   const authToken = req.headers['authorization'];
   
    if(authToken != undefined){
        const bearer = authToken.split(' '); 
        var token = bearer[1];

        jwt.verify(token ,jwtSecret, (err, data) => {
            if(err){
                res.status(400).json({err: "Token invalido"})
            }else{
                req.token = token
                req.loggedUser = ({id: data.id, email: data.email})
                next();
            }
        })
    }else{
        res.status(400).json({err: "Token invalido"});
    }

}


var DB = {
    games:[
        {
            id: 50,
            title: "Call of duty",
            year: 2000,
            price: 70
        },
        { 
            id: 90,
            title: "Hulk",
            year: 2005,
            price: 100
        },
        {
            id: 78, 
            title: "Roblox",
            year: 2078,
            price: 400
        }
    ],
    users: [
        {
            id: 1,
            name: "Theo Vinicius",
            email: "TheoVini@email.com",
            password: "1234"
        },
        {
            id: 2,
            name: "Isabela",
            email: "Bela@email.com",
            password: "1234567"
        }
    ]
}

app.get("/games",auth, (req, res) => {
    res.statusCode = 200;
    res.json(DB.games);
});

app.get("/game/:id", (req, res) => {
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{

        var id = parseInt(req.params.id);

        var game = DB.games.find(g => g.id == id);

        if(game != undefined){
            res.statusCode = 200;
            res.json(game);
        }else{
            res.sendStatus(404);
        }
    }
   
});

app.post("/game",(req,res)=>{
    var { title, price , year } = req.body;

    DB.games.push({
        id: 2323,
        title,
        price,
        year
    });
    res.sendStatus(200);
});

app.delete("/game/:id", (req,res)=>{
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
        var id = parseInt(req.params.id);
        var index = DB.games.findIndex(g => g.id == id);

        if(index == -1){
            res.sendStatus(404)
        }else{
            DB.games.splice(index,1);
            res.sendStatus(200);

        }
    }
});

app.put("/game/:id", (req, res) => {
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{

        var id = parseInt(req.params.id);

        var game = DB.games.find(g => g.id == id);

        if(game != undefined){
          
            var { title, price, year } = req.body;
            
            if(title != undefined){
                game.title = title;
            }

            if(price != undefined){
                game.price = price;
            }

            if(year != undefined){
                game.year = year;
            }

          
          
            res.statusCode = 200;  
        }else{
            res.sendStatus(404);
        }
    }
});

app.post("/auth", (req, res) => {
    const {email, password} = req.body;

    if( email != undefined){

        var user = DB.users.find(u => u.email == email);

        if(user != undefined){

            if(user.password == password){
                jwt.sign({id: user.id, email: user.email}, jwtSecret, {expiresIn: "48h"}, (err, token) => {
                    if(err){
                        res.status(400).json({err: "Falha interna"})
                    }else{
                        res.status(200).json({token: token})
                    }
                });
        
            }else{
                res.status(401).json({err: "Invalid password"})
            }
        }else{
            res.status(400).json({err: "User not found"})
        }

    }else{
        res.status(400).json({err: "Invalid email"})
    }
})

app.listen(8080,() => {
    console.log("APP RODANDO!");
});
