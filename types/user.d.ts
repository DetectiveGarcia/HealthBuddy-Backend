export type RegisterUserInput = {
    firstName: string;
    lastName: string;
    password: string;
    email: string
}

export type LoginUserInput = {
    email: string;
    password: string;
}