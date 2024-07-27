export interface PaymentDTO{
    amount : number,
    email : string,
    billId:string,
    reference?: string,
    callback_url?: string
}

export interface PaymentApiResponse {
    status: boolean;
    message: string;
    data: {
      authorization_url: string;
      access_code: string;
      reference: string;
    };
  }

  export interface ProcessBillPayment{
    billId:string;
    paymentRef:string;
  }