export class RequestNotFoundError extends Error {
    public name = "RequestNotFoundError"
    constructor(public message?: string) {
      super(message)
    }
}

export class RequestForbiddenError extends Error {
    public name = "RequestForbiddenError"
    constructor(public message?: string) {
      super(message)
    }
}

export class RequestOfflineError extends Error {
    public name = "RequestOfflineError"
    constructor(public message?: string) {
      super(message)
    }
}

export class RequestServerError extends Error {
    public name = "RequestServerError"
    constructor(public message?: string) {
      super(message)
    }
}
