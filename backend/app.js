const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const HttpError = require('./HttpError');



const usersRoutes = require('./routes/userRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const placesRoutes=require('./routes/placesRoutes');


const app = express();

fs=require('fs');
const https = require('https');
var key = fs.readFileSync('server.key');
var cert = fs.readFileSync('server.crt');
var options = {
  key: key,
  cert: cert
};
var server = https.createServer(options, app);

const port = process.env.PORT || 5000;
// bodyparser is used to parse the body to make connection smoother
app.use(bodyParser.json());

// headers ar set to make transfer of JSON data from frontend to backend even in different ports like 3000 and 5000
app.use((req,res,next)=>{

    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With,Content-Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,PATCH');
    next();
});

// will redirect all users logged in with doctor's portal
app.use('/api/doctors',doctorRoutes);

// will redirect all users logged in with user's portal
app.use('/api/users', usersRoutes);

// will redirect all doctors and users to diiferent diiferent places in website accordingly
app.use('/api/places', placesRoutes);

const io = require('socket.io')(server);
//const port = process.env.PORT || 4000;
const {v4:uuidv4} = require('uuid');
const {ExpressPeerServer} = require('peer')
const peer = ExpressPeerServer(server , {
  debug:true
});


app.use('/peerjs', peer);
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.get('/' , (req,res)=>{
  res.send(uuidv4());
});
app.get('/room1/:room' , (req,res)=>{
    console.log(req.params);
    res.render('index' , {RoomId:req.params.room});
});
io.on("connection" , (socket)=>{
  socket.on('newUser' , (id , room)=>{
    //   console.log(id);
    //   console.log(room);
    socket.join(room);
    socket.to(room).broadcast.emit('userJoined' , id);
    socket.on('disconnect' , ()=>{
        socket.to(room).broadcast.emit('userDisconnect' , id);
    })
  })
})
// io.on("createmeeting",(msg)=>{
//     var cc =JSON.parse(msg);
//     // id: caller ; id: person to called ;meeting id;
//     io.emit(cc.callerid,"abc")
//     io.emit(cc.personid,"abc")
// })
// error message is thrown if the route user want to access is not present
app.use((req,res,next)=>{ 
    const error = new HttpError('Could not find this shit' , 404);
    throw error;

}
);
app.use(express.json({ extended: false }));
//sends the error if present
app.use((error,req,res,next)=> {
    if(res.headerSent)
    {
        return next(error);
    }

    res.status(error.code || 500)
    res.json({message: error.message || 'unknown error'})

});


// it will connect the node server with mongoDB database
mongoose
.connect('mongodb+srv://jyotirmay:jyotirmay27@cluster0.8su5b.mongodb.net/meditech?retryWrites=true&w=majority')
.then(()=> {
    server.listen(port, () => console.log(`server started on port ${port}`));
})
.catch(err => {
console.log(err);
});

