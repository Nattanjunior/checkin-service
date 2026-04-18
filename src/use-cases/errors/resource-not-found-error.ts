export class ResourceNotFoundError extends Error {
    constructor() {
        super('Resoucer not found.');
    }
}