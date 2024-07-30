import { randomUUID } from "node:crypto"

export default class Ticket {
  constructor({
    description,
    type,
    softwares,
    workInstruction,
    message,
    files,
    baseResume,
    difficultyLevel,
    
  }) {
    this.id = randomUUID()
    this.description = description
    this.type = type
    this.softwares = softwares
    this.workInstruction = workInstruction
    this.message = message
    this.files = files  
    this,baseResume = baseResume
    this.difficultyLevel = difficultyLevel
  }
}