import { ExpenseClaimLine } from "./expense-claim-line";

export interface ExpenseClaim {
  id: number;
  userId: number;
  claimDate: Date;
  bankAccountName: string;
  bankAccountNumber: string;
  bankCode: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  expenseClaimLines: ExpenseClaimLine[];
  totalAmount: number;
}
