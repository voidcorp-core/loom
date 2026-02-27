export class NotFoundError extends Error {
  constructor(entity: string, identifier: string) {
    super(`${entity} not found: ${identifier}`);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
