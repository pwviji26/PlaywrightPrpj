// ─── Shared Types ─────────────────────────────────────────────────────────────

export interface UserEntry {
  username:     string;
  expectLogin:  boolean;
  timeout:      number;
  errorMessage?: string;
}

export interface Product {
  name:       string;
  dataTestId: string;
  removeId:   string;
  price:      number;
}

export interface Customer {
  firstName:  string;
  lastName:   string;
  postalCode: string;
}

export interface CheckoutData {
  customer:          Customer;
  taxRate:           number;
  expectedSubtotal:  string;
  expectedTax:       string;
  expectedTotal:     string;
  payment:           string;
  shipping:          string;
}

export interface Messages {
  loginError:         string;
  emptyUsernameError: string;
  emptyFirstName:     string;
  orderConfirmHeader: string;
  orderConfirmText:   string;
}

export interface TestData {
  baseUrl:  string;
  password: string;
  users:    Record<string, UserEntry>;
  products: Product[];
  checkout: CheckoutData;
  messages: Messages;
}