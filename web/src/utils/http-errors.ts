/*
* CORTX-CSM: CORTX Management web and CLI interface.
* Copyright (c) 2020 Seagate Technology LLC and/or its Affiliates
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
* You should have received a copy of the GNU Affero General Public License
* along with this program. If not, see <https://www.gnu.org/licenses/>.
* For any questions about this software or licensing,
* please email opensource@seagate.com or cortx-questions@seagate.com.
*/
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
export class HTTP503Error extends HTTPCsmClientError {
  readonly statusCode = HttpStatus.SERVICE_UNAVAILABLE ;

  constructor(message: string | object = "Service unavailable") {
    super(message);
  }
} 