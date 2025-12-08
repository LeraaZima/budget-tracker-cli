import { v4 as uuidv4 } from 'uuid';
export class Transaction {
    id;
    amount;
    type;
    date;
    description;
    constructor(amount, type, date, description) {
        this.id = uuidv4().split('-')[0];
        this.amount = amount;
        this.type = type;
        this.date = date;
        this.description = description;
    }
}
