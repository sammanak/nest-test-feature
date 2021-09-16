import { HttpException, HttpStatus } from '@nestjs/common';

export class PaymentException extends HttpException {
  constructor() {
    super('Payment Required', HttpStatus.PAYMENT_REQUIRED);
  }
}
