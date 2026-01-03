export class RecordNotFoundError extends Error {
  constructor(message = "Record not found") {
    super(message);
    this.name = "RecordNotFoundError";
  }
}
