import express,{urlencoded} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './Routes/user_routes.js';
import connectDB from './utils/db.js';
import postRoutes from './Routes/post_routes.js';
import messageRoutes from './Routes/message_routes.js';


const app= express();
//  middlewares
app.use(express.json());
app.use(cookieParser());
dotenv.config({
    });
// for parsing the form data
app.use(urlencoded({extended:true})); 
const corsOptions ={
    origin:'http://localhost:5173',
    credentials:true,
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.get("/",(req,res)=>{
    res.send("Hello world");
});

app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/messages",messageRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    connectDB();
console.log(`Server working on the ${PORT} port`);
});

