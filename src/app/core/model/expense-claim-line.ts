export interface ExpenseClaimLine {
  _id: string;
  transactionDate: Date;
  costCenter: string;
  claimItem: string;
  description: string;
  currencyCode: string;
  amount: number;
  gst: number;
  exchangeRate: number;
  totalAmount: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
