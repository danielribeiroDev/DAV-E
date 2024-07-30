
export default class TicketRepository {
  constructor({
    db, table
  }) {
    
    this.db = db
    this.table = table
  }


  async find() {
    const findAllQuery = `SELECT * FROM ${this.table}`
    const result = await this.db.query(findAllQuery)
    return result.rows
  }
  
}

