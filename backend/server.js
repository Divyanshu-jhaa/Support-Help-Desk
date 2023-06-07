const express=require('express');
const cors=require('cors');
const app=express();
require('dotenv').config;
app.use(express.json);
app.use(cors);
const PORT=process.env.PORT || 5000;


app.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT}`);
})
