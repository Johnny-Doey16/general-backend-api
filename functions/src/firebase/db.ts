import firebaseApp from "../config/firebase";
import { getFirestore, collection, getDocs, runTransaction,
  doc, setDoc,limit, query, where, updateDoc, deleteDoc} from 'firebase/firestore/lite';
// import Logger from "../services/logger";
import { DB_TABLES } from "constants/variables";

class DB {
  // private logger: Logger;
  private db;
  constructor() {
      this.db = getFirestore(firebaseApp.app());
      // this.logger = new Logger("logs/app.log");
      // this.logger.log("info", "DB connection established");
  }

  public async insert(table: string, data: any): Promise<string> {
      const dbRef = collection(this.db, table); // collectionRef
      const docRef = doc(dbRef); // docRef
      const id = docRef.id; // a docRef has an id property
      data['id'] = id;
      
      setDoc(docRef, data)
      .then((pos) => console.log("info", `Object inserted into DB. POS: ${pos}. Table: ${table} Object: ${JSON.stringify(data)}`))
      .catch((e) => console.log("fatal", `Error occurred while inserting object. Table: ${table}. Error: ${e.message}.`));
      return id;
  }

  public async insertWithId(table: string, id: string, data: any): Promise<any> {
      await setDoc(doc(this.db, table, id), data)
      .then((pos) => console.log("info", `Object inserted into DB. POS: ${pos}. Table: ${id} Object: ${JSON.stringify(data)}`))
      .catch((e) => console.log("fatal", `Error occurred while inserting object. Table: ${id}. Error: ${e.message}.`));
  }

  public async findAll(table: string, length?: number): Promise<any> {
    console.log("info", `Attempting to retrieve all data from table ${table}`);
    
    try {
      const q = query(collection(this.db, table), limit(length));
      const querySnapshot = await getDocs(q);
      const result = querySnapshot.docs.map((doc) => {            
        return doc.data();
      });
      return result;
    } catch (e) {
      console.log("fatal", `Error occurred while retrieving all data, from table ${table}. Error: ${e.message}.`);
      return null;
    }
  }

  public async findAllInArray(table: string, column: string, searchId: string, length?: number): Promise<any> {
    console.log("info", `Attempting to retrieve all data from table ${table}`);
    
    try {
      const q = query(collection(this.db, table), where(column, 'array-contains', searchId), limit(length));
      const querySnapshot = await getDocs(q);
      const result = querySnapshot.docs.map((doc) => {            
        return doc.data();
      });
      return result;
    } catch (e) {
      console.log("fatal", `Error occurred while retrieving all data, from table ${table}. Error: ${e.message}.`);
      return null;
    }
  }

  public async findAllWithArray(table: string, column: string, ids: string[], length?: number): Promise<any> {
    
    console.log("info", `Attempting to retrieve all data from table ${table} with values ${ids}`);
    
    try {
      const q = query(collection(this.db, table), where(column, 'in', ids), limit(length));
      const querySnapshot = await getDocs(q);
      const result = querySnapshot.docs.map((doc) => {            
        return doc.data();
      });
      
      return result;
    } catch (e) {
      console.log("fatal", `Error occurred while retrieving all data, from table ${table}. Error: ${e.message}.`);
      return null;
    }
  }

  public async findAllById(table: string, column: string, searchId: string, length?: number): Promise<any> {
    console.log("info", `Attempting to retrieve all data from table ${table}`);
    
    try {
      const q = query(collection(this.db, table), where(column, '==', searchId), limit(length));
      const querySnapshot = await getDocs(q);
      const result = querySnapshot.docs.map((doc) => {            
        return doc.data();
      });
      return result;
    } catch (e) {
      console.log("fatal", `Error occurred while retrieving all data, from table ${table}. Error: ${e.message}.`);
      return null;
    }
  }

  // TODO: Fix null issue
  public async findById(table: string, column: string, id: string): Promise<any> {
    // console.log("info", `Attempting to retrieve Object with id, from table ${table}: ${id}`);
    console.log(`Attempting to retrieve Object with id, from table ${table}: ${id}`);
  
    try {
      const q = query(collection(this.db, table), where(column, "==", id));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const firstDocument = querySnapshot.docs[0];
        const result = firstDocument.data();
        return result;
      } else {
        return null;
      }
    } catch (e) {
      // console.log("fatal", `Error occurred while retrieving data with id: ${id}, from table ${table}. Error: ${e.message}.`);
      console.log(`Error occurred while retrieving data with id: ${id}, from table ${table}. Error: ${e.message}.`);
      return null;
    }
  }
  
  public async update(table: string, id: string, data: any) {
    try {
      console.log("info", `Updating object with id ${id}, in table ${table} new data: ${JSON.stringify(data)}`)
      await updateDoc(doc(this.db, table, id), data);
    } catch (e) {
      console.log("fatal", `Error occurred while Updating data with id: ${id}, in table ${table}, using object ${data}. Error: ${e.message}.`);
    }
  }

  public async delete(table: string, id: string) {
    try {
      console.log("info", `Deleting data with id ${id}, from table ${table}`);
      const deleteDocRef = doc(this.db, table, id);
      await deleteDoc(deleteDocRef);
    } catch (e) {
      console.log("fatal", `Error occurred while deleting data with id ${id}, from table ${table}. Error: ${e.message}.`);
    }
  }

  public async increase(table: string, id: any, amount: number, column_name: string): Promise<string> {
    try {
      console.log("info", `Running transaction to add ${amount} to ${column_name} with id ${id} in table ${table}`);

      const docRef = doc(this.db, table, id);
      await runTransaction(this.db, async (transaction) => {

        const doc = await transaction.get(docRef);
        if (!doc.exists()) {
          return "error";
        }
  
        const newVal = doc.data()[column_name] + amount;

        const newData = {};
        newData[column_name] = newVal;

        transaction.update(docRef, newData);
      });

      console.log("Wallet increased");
      return "success";

    } catch (e) {
      console.log("fatal", `Error occurred while adding ${amount} to ${column_name} with an id of ${id}, in table ${table}. Error: ${e.message}.`)
    }
  }

  public async decrease(table: string, id: any, amount: number, column_name: string, limit?: number): Promise<string> {
    try {
      const breakPoint = !limit ? 0 : limit;
      let msg = "";
      console.log("info", `Running transaction to subtract ${amount} from ${column_name} with id ${id} in table ${table}`)

      const docRef = doc(this.db, table, id);
      await runTransaction(this.db, async (transaction) => {

        const doc = await transaction.get(docRef);
        if (!doc.exists()) {
          msg = "Object not found";
        }

        if (doc.data()[column_name] - amount < breakPoint) {
          msg = "Insufficient funds";
          console.log("Insufficient funds");
          return;
        }
  
        const newVal = doc.data()[column_name] - amount;

        const newData = {};
        newData[column_name] = newVal;

        transaction.update(docRef, newData);
        msg = "Success";
      });
      return msg;


    } catch (e) {
      console.log("fatal", `Error occurred while subtracting ${amount} from ${column_name} with an id of ${id}, in table ${table}. Error: ${e.message}.`)
    }
  }

  public async decreaseMultiple(table: string, prods: any[],): Promise<string[]> {
    const results: string[] = [];

    try {
      for (let i = 0; i < prods.length; i++) {
          const id = prods[i].id;
          const qty = prods[i].qty;
          const msg = await this.decrease(table, id, qty, "qty");
          results.push(`ID: ${id}, Result: ${msg}`);
      }

      return results;
    } catch (e) {
        console.log("fatal", `Error occurred while processing multiple decreases. Error: ${e.message}.`);
        return results;
    }
}


  // public async findAllBy(table: string, filter?: { column: string; value: any }[], length?: number): Promise<any> {
  //   try {
  //     let queryRef: Query<DocumentData> = collection(this.db, table);
  
  //     if (filter) {
  //       filter.forEach((f) => {
  //         queryRef = query(queryRef, where(f.column, "==", f.value));
  //       });
  //     }
  
  //     // if (length) {
  //     //   queryRef = limit(queryRef, length);
  //     // }
  
  //     const querySnapshot = await getDocs(queryRef);
  //     const result = querySnapshot.docs.map((doc) => {
  //       return doc.data();
  //     });
  
  //     return result;
  //   } catch (e) {
  //     this.logger.log("fatal", `Error occurred while retrieving all data, from table ${table}. Error: ${e.message}.`);
  //     return null;
  //   }
  // }

  /*  public async findAllByIdForTransaction(table: string, uid: string, filter?: any, limit?: number): Promise<any> {
        this.logger.log("info", `Attempting to retrieve Transactions for user ${uid}, from table ${table}`);

        let query = this.db(table).where({'receiver': uid}).orWhere({'sender': uid});
        if (filter) {
            query = query.andWhere(filter);
        }

        if (limit) {
            query = query.limit(limit);
        }

        return await query
        .select("*")
        .catch((e) => this.logger.log("fatal", `Error occurred while retrieving data with id ${uid}, from table ${table}. Error: ${e.message}.`));
    }

    public async findAllByIdForTransactionWallet(table: string, wallet_id: string, limit?: number): Promise<any> {
        this.logger.log("info", `Attempting to retrieve Transactions for wallet ${wallet_id}, from table ${table}`);

        let query = this.db(table).where({'sender_wallet_id': wallet_id}).orWhere({'receiver_wallet_id': wallet_id});

        if (limit) {
            query = query.limit(limit);
        }

        return await query
        .select("*")
        .catch((e) => this.logger.log("fatal", `Error occurred while retrieving data with id ${wallet_id}, from table ${table}. Error: ${e.message}.`));
    }

    public async findAllByIdForTransactionTime(table: string, uid: string, filter?: ITransactionTime, limit?: number): Promise<any> {
      this.logger.log("info", `Attempting to retrieve Transactions for user ${uid}, from table ${table}`);
      
      let query = this.db(table).where({ 'receiver': uid }).orWhere({ 'sender': uid });
    
      if (filter && filter.startTime && filter.endTime) {
        // Adjust the column name as per your table schema
        query = query.whereBetween('transaction_date', [filter.startTime, filter.endTime]);
      }
    
      if (limit) {
        query = query.limit(limit);
      }
      
      try {
        const result = await query.select("*");
        return result;
      } catch (e) {
        this.logger.log("fatal", `Error occurred while retrieving data with id ${uid}, from table ${table}. Error: ${e.message}.`);
        throw e;
      }
    }
    */

}


export default DB;

