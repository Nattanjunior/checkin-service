export class DuplicateCheckInError extends Error {
  constructor() {
    super('Daily check-in limit reached..');
  }
}