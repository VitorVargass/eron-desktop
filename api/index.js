import express from "express";
import userRoutes from "./routes/users.js";
import cors from "cors";

const app = express();


 const corsOptions = {
     origin: '*', // Permitir todas as origens. Para produção, restrinja para origens específicas.
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     allowedHeaders: ['Content-Type', 'Authorization']
 };

app.use(cors(corsOptions));
app.use(express.json());
app.use(cors());

 //Rota de teste
 app.get('/test', (req, res) => {
     res.json({ message: 'API está funcionando!' });
 });

app.use("/", userRoutes);

const port = 8800;

//app.listen(8800);
const server = app.listen(port, () => {
     console.log(`Server is running on port ${port}`);
 });

// Função para lidar com a terminação limpa do servidor
const shutdown = (signal) => {
    console.log(`Received ${signal}. Shutting down gracefully.`);
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
};

// Escutar sinais de término
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));