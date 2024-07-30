import express from 'express';
import { initializeServices } from './src/loader.js';
import ticketRoutes from './src/routes/ticketRoutes.js'; // Certifique-se de que o caminho esteja correto
import { initializeDatabase } from './src/database.js';

const app = express();
const PORT = process.env.PORT || 3000;

///:: Middlewares  
app.use(express.json());

async function startServer() {
  try {

    const credentials = {
      user: 'ADMIN',
      host: 'localhost', // Use 'localhost' if running outside Docker or 'postgres' if within the Docker network
      database: 'postgres',
      password: 'ADMIN',
      port: 5432,
    } 

    ///:: Initialize Database
    const db = await initializeDatabase({
      credentials
    })

    ///:: Initialize services
    const services = await initializeServices(db);

    ///:: Configure routes
    app.use('/tickets', ticketRoutes(services.ticketService));

    ///: Init express server 
    app.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server', error);
  }
}

startServer();
