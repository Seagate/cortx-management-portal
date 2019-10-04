import HttpStatus from 'http-status-codes';
export abstract class HTTPCsmClientError extends Error {
  readonly statusCode!: number;
  readonly name!: string;

  constructor(message: object | string) {
    if (message instanceof Object) {
      super(JSON.stringify(message));
    } else {
      super(message);
    }
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class HTTP400Error extends HTTPCsmClientError {
  readonly statusCode = HttpStatus.BAD_REQUEST;

  constructor(message: string | object = "Bad Request") {
    super(message);
  }
}

export class HTTP401Error extends HTTPCsmClientError {
  readonly statusCode = HttpStatus.UNAUTHORIZED;

  constructor(message: string | object = "Unauthorized") {
    super(message);
  }
}

export class HTTP403Error extends HTTPCsmClientError {
  readonly statusCode = HttpStatus.FORBIDDEN;

  constructor(message: string | object = "Forbidden") {
    super(message);
  }
}

export class HTTP404Error extends HTTPCsmClientError {
  readonly statusCode = HttpStatus.NOT_FOUND;

  constructor(message: string | object = "Not found") {
    super(message);
  }
}