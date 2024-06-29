export interface User {
    _id: string,
    email: string,
    firstName: string,
    lastName: string,
    hash: string,
    salt: string,
    role: string,
    image: string
}