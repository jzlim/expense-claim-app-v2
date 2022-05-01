import { ClaimItem } from "./claim-item";

export interface ExpenseClaimLine {
  id: number;
  transactionDate: Date;
  costCenter: string;
  claimItem: ClaimItem;
  currencyCode: string;
  amount: number;
  gst: number;
  exchangeRate: number;
  totalAmount: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
