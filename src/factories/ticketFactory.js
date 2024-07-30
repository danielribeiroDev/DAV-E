import TicketRepository from "../repositories/ticketRepository.js"
import TicketService from "../services/platform/ticketService.js"

const generateTicketInstance = ({
  db /* dependencias */
}) => {
  const ticketRepository = new TicketRepository({
    db, table: 'tickets'
  })
  const ticketService = new TicketService({
    ticketRepository
  })

  return ticketService
}

export {
  generateTicketInstance
}