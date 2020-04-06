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

export class HTTP500Error extends HTTPCsmClientError {
  readonly statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

  constructor(message: string | object = "Internal Server Error") {
    super(message);
  }
}

export class HTTP499Error extends HTTPCsmClientError {
  readonly statusCode = 499;

  constructor(message: string | object = "Call cancelled by client") {
    super(message);
  }
}

export class HTTP501Error extends HTTPCsmClientError {
  readonly statusCode = HttpStatus.NOT_IMPLEMENTED;

  constructor(message: string | object = "Not Implemented") {
    super(message);
  }
}

export class HTTP409Error extends HTTPCsmClientError {
  readonly statusCode = HttpStatus.CONFLICT;

  constructor(message: string | object = "Conflict") {
    super(message);
  }
}

export class HTTP422Error extends HTTPCsmClientError {
  readonly statusCode = HttpStatus.UNPROCESSABLE_ENTITY;

  constructor(message: string | object = "Unprocessable entity") {
    super(message);
  }
}