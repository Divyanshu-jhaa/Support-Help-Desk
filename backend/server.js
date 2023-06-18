const express=require('express');
const user =require('./Routes/user');
const questions=require('./Routes/questions');
const support=require('./Routes/support');
const cors=require('cors');
const app=express();
const client=require('./db');
const {Server}=require('socket.io');
const auth=require('./Middlewares/auth');
const helmet=require('helmet');
require('dotenv').config;
app.use(express.json());
app.use(cors());
app.use(helmet());
const PORT=process.env.PORT || 5000;
const server=require('http').createServer(app);
const io=new Server(server,{
    cors:{
        origin:`http://localhost:3000`,
       
    },
});
io.on("connection",(socket)=>{
    console.log(socket.id);
    socket.on("join_room",(data)=>{
        socket.join(data);
        console.log(`User with id ${socket.id} joined the room ${data}`)

    })
    socket.on("send_message",(msg_data)=>{
        console.log(msg_data);
        console.log("send message called",msg_data.room);
        socket.to(msg_data.room).emit("receive_message",msg_data);

    })
    // socket.on("disconnect",()=>{
    //     console.log("User Disconnected",socket.id);
    // })
    socket.emit("me", socket.id)

	socket.on("disconnect", () => {
         console.log("User Disconnected",socket.id);
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
})
app.use('/api/v1/users',user);
io.on("connect",socket=>{});
app.use(auth);
app.use('/api/v1/questions',questions);
app.use('/api/v1/support',support);
server.listen(PORT,async()=>{
    const res=await client.connect((err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("Database connected Successfully");
        }

    });
    console.log(`Server is listening on port ${PORT}`);
})
