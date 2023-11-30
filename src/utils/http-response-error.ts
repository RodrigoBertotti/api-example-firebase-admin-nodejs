

export class HttpResponseError extends Error {
    constructor(
        public readonly status:number,
        public readonly code:string = 'UNKNOWN',
        public readonly description:string = `An error occurred with status "${status}" and code "${code}"`,
        public readonly internalLog:string = description,
    ) {
        super(`(HttpResponseError) status: "${status}" code: "${code}" description: "${description}"`);
    }
}

export class ErrorResponseBody {
    constructor(
        public error: {
            status: number,
            code: string,
            description: string,
            internal?:string
        },
    ) {}
}
