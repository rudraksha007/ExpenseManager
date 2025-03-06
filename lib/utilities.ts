export function errorMsg(status: number, placeholder: string| string[]|null) {
    const errorMap = {
        401: "Unauthorized or Invalid Credentials",
        404: `${placeholder? placeholder: ''} not found`,
        500: "Internal Server Error",
    }
}