const app = require('express')();
const cors = require('cors')
var bodyParser = require('body-parser');
const server = require('http').createServer(app);
const porta = 3000;
const io = require('socket.io')(server);
const ngrok = require('ngrok');


//Cors
app.use(cors())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method',
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


async function ativarNgrok() {
    const url = await ngrok.connect(porta);
    return console.log(url);
}
ativarNgrok();

app.use(bodyParser.json({
  extended: true,
  limit: '100000kb',
}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '100000kb',
}));

app.io = io;

app.io.on('connection', socket => {
    console.log(`Socket conectado ${socket.id}`);
    socket.on('sendMsg', data => {
      console.log(data);
      socket.broadcast.emit('receivedMsg', data);
    });
  });

  app.post("/webhook", function(req, res) {

    var json = req.body;
    console.log(json);

    app.io.emit('webhook', json);
    return res.send('Enviado com sucesso');

  });


server.listen(porta);
