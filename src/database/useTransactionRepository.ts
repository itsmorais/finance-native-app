import { useSQLiteContext } from "expo-sqlite/next";

export type TransactionCreateDatabase = {
    goal_id: number,
    amount: number
}
export type TransactionResponseDatabase = {
    id: number,
    amount: number,
    goal_id: string,
    created_ate: string
}

export function useTransactionRepository() {
    const database = useSQLiteContext();

    function create(transaction: TransactionCreateDatabase) {
        try {
            const statement = database.prepareSync(
                "INSERT INTO transactions(goal_id,amount) VALUES ($goal_id, $amount);"
            )

            statement.executeSync({
                $goal_id: transaction.goal_id,
                $amount: transaction.amount
            });

            console.log("CADASTROU!")




        } catch (error) {
            console.log(error)
            throw error
        }
    }

    function all() {
        return database.getAllSync<TransactionResponseDatabase>(
            `SELECT *
            FROM transactions
            ORDER BY created_ate
           `
        )
    }

    function show(id: number) {
        return database.getAllSync<TransactionResponseDatabase>(
            `SELECT *
        FROM transactions
        WHERE goal_id = ${id}
        ORDER BY created_ate
       `
        )

    }

    function deleteTransaction(idTransaction: number) {
        try {
            const statement = database.prepareSync(
                "DELETE from transactions WHERE id = $id;"
            )

            statement.executeSync({
                $id: idTransaction

            });

        } catch (error) {
            console.log(error)
            throw error
        }
    }

    return {
        create,
        all,
        show,
        deleteTransaction
    }
}