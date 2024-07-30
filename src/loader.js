import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateTicketInstance } from './factories/ticketFactory.js';

const currentDir = dirname(fileURLToPath(import.meta.url));
const filePath = join(currentDir, './../database', 'data.json');

///:: Generate service instances
export async function initializeServices(db) {
  const ticketService = generateTicketInstance({ db });
  return { ticketService };
}

export default {
  initializeServices,
};
