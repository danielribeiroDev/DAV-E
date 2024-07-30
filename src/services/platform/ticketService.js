export default class TicketService {
  constructor({
    ticketRepository
  }) {
    this.ticketRepository = ticketRepository
  }

  find() {
    return this.ticketRepository.find()
  }

  create(data) {
    return this.heroRepository.create(data)
  }
}