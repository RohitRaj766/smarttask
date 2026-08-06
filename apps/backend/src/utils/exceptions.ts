export class HttpException extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestException extends HttpException {
  constructor(message = "Bad Request") {
    super(400, message);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = "Resource Not Found") {
    super(404, message);
  }
}

export class ConflictException extends HttpException {
  constructor(message = "Conflict Occurred") {
    super(409, message);
  }
}

export class InternalServerException extends HttpException {
  constructor(message = "Internal Server Error") {
    super(500, message);
  }
}
