export const SUCCESS_MESSAGES = {
    WALLET_CREATED: (user_id: string) => `New wallet created for user ${user_id} created successfully.`,
    TRANSACTION_CREATED: (id: string) => `New transaction added with id: ${id}.`,
    BENEFICIARY_CREATED: (user_id: string, beneficiary: string) => `New beneficiary created for user ${user_id}. Beneficiary uid: ${beneficiary}`,
    CARD_CREATED: (user_id: string, card_id: string) => `New card created for user ${user_id}. Card id: ${card_id}`,

    OBJECT_CREATED: (user_id: string, obj_id: string, name: string) => `New ${name} created for user ${user_id}. ${name} id: ${obj_id}`,

  };

  export const TRANSACTION_MESSAGES = {
    PENDING: () => `Transaction pending.`,
    FAILED: () => `Transaction failed.`,
    SUCCESS: () => `Transaction success`,
    TRANSACTION_CREATED: (id: string) => `New transaction added with id: ${id}.`,
  };
  
  export const ERROR_MESSAGES = {
    
    WALLET_CREATED: (user_id: string) => `Error occurred while creating new wallet for user ${user_id}.`,

    OBJECT_CREATED: (user_id: string, name: string) => `Error occurred while creating new ${name} for user ${user_id}.`,
    FETCHING_OBJECT: (user_id: string, name: string) => `Error occurred while fetching ${name} for user ${user_id}.`,

    FETCHING_WALLET: (user_id: string) => `Error occurred while fetching wallet for user ${user_id}.`,
    FETCHING_ALL_USERS: () => `Error occurred while fetching all users.`,
    FETCHING_USER: (user_id: string) => `Error occurred while fetching user ${user_id}.`,
    FETCHING_TRANSACTION: (user_id: string) => `Error occurred while fetching transactions for user ${user_id}.`,
    FETCHING_BENEFICIARY: (user_id) => `Error occurred while fetching all beneficiaries for user ${user_id}.`,
    FETCHING_CARD: (user_id) => `Error occurred while fetching all cards for user ${user_id}.`,
    FETCHING_DEPOSIT: (user_id) => `Error occurred while fetching all deposits for user ${user_id}.`,
    FETCHING_WITHDRAW: (user_id) => `Error occurred while fetching all withdrawals for user ${user_id}.`,


    UPDATING_TRANSACTION: (id: string) => `Error occurred while updating transaction with id ${id}.`,
    
    DELETING_BENEFICIARY: (user_id: string) => `Error occurred while deleting beneficiary for user ${user_id}.`,
    DELETING_CARD: (user_id: string) => `Error occurred while deleting card for user ${user_id}.`,

  };

  export const DB_TABLES = {
    HEADER_IMAGES: `HeaderImages`,
    USERS: `Users`,
    PRODUCTS: `Products`,
    TRANSACTION: `Transactions`,
    CARDS: `Cards`,
    CATEGORY: `Category`,
    CART: `Cart`,
    ORDER: "Order",
    REVIEW: `Reviews`,

    CURRENCY_TYPES: "currency_types",
    BENEFICIARY: `beneficiaries`,
    DEPOSIT: `deposits`,
    WITHDRAW: `withdraws`,
    TRANSFERS: `transfers`,
    TIERS: `tiers`,
    KYC: `kyc`,
    SETTINGS: `settings`,
  }

  /**
   * TODO: Test
   * category, 
   * review (edit and delete)
   */

  /**
   * blog,
   * search
   *! recommendation,
   * 
   * tracking
   */
  