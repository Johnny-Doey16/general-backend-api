"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_TABLES = exports.ERROR_MESSAGES = exports.TRANSACTION_MESSAGES = exports.SUCCESS_MESSAGES = void 0;
exports.SUCCESS_MESSAGES = {
    WALLET_CREATED: (user_id) => `New wallet created for user ${user_id} created successfully.`,
    TRANSACTION_CREATED: (id) => `New transaction added with id: ${id}.`,
    BENEFICIARY_CREATED: (user_id, beneficiary) => `New beneficiary created for user ${user_id}. Beneficiary uid: ${beneficiary}`,
    CARD_CREATED: (user_id, card_id) => `New card created for user ${user_id}. Card id: ${card_id}`,
    OBJECT_CREATED: (user_id, obj_id, name) => `New ${name} created for user ${user_id}. ${name} id: ${obj_id}`,
};
exports.TRANSACTION_MESSAGES = {
    PENDING: () => `Transaction pending.`,
    FAILED: () => `Transaction failed.`,
    SUCCESS: () => `Transaction success`,
    TRANSACTION_CREATED: (id) => `New transaction added with id: ${id}.`,
};
exports.ERROR_MESSAGES = {
    WALLET_CREATED: (user_id) => `Error occurred while creating new wallet for user ${user_id}.`,
    OBJECT_CREATED: (user_id, name) => `Error occurred while creating new ${name} for user ${user_id}.`,
    FETCHING_OBJECT: (user_id, name) => `Error occurred while fetching ${name} for user ${user_id}.`,
    FETCHING_WALLET: (user_id) => `Error occurred while fetching wallet for user ${user_id}.`,
    FETCHING_ALL_USERS: () => `Error occurred while fetching all users.`,
    FETCHING_USER: (user_id) => `Error occurred while fetching user ${user_id}.`,
    FETCHING_TRANSACTION: (user_id) => `Error occurred while fetching transactions for user ${user_id}.`,
    FETCHING_BENEFICIARY: (user_id) => `Error occurred while fetching all beneficiaries for user ${user_id}.`,
    FETCHING_CARD: (user_id) => `Error occurred while fetching all cards for user ${user_id}.`,
    FETCHING_DEPOSIT: (user_id) => `Error occurred while fetching all deposits for user ${user_id}.`,
    FETCHING_WITHDRAW: (user_id) => `Error occurred while fetching all withdrawals for user ${user_id}.`,
    UPDATING_TRANSACTION: (id) => `Error occurred while updating transaction with id ${id}.`,
    DELETING_BENEFICIARY: (user_id) => `Error occurred while deleting beneficiary for user ${user_id}.`,
    DELETING_CARD: (user_id) => `Error occurred while deleting card for user ${user_id}.`,
};
exports.DB_TABLES = {
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
};
//# sourceMappingURL=variables.js.map