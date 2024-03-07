import { useSQLiteContext } from "expo-sqlite/next";

export type GoalCreateDatabase = {
    name: string,
    total: number
}
export type GoalResponseDatabase = {
    id: string,
    name: string,
    total: number,
    current: number
}

export function useGoalRepository() {
    const database = useSQLiteContext();

    function create(goal: GoalCreateDatabase) {
        try {
            const statement = database.prepareSync(
                "INSERT INTO goals(name,total) VALUES ($name, $total);"
            )

            statement.executeSync({
                $name: goal.name,
                $total: goal.total
            })




        } catch (error) {
            console.log(error)
            throw error
        }
    }

    function all() {
        return database.getAllSync<GoalResponseDatabase>(
            `SELECT g.id,g.name,g.total, COALESCE(SUM(t.amount), 0) AS current
            FROM goals as g
            LEFT JOIN transactions as t 
            ON t.goal_id = g.id
            GROUP BY g.id, g.name, g.total`
        )
    }

    function show(id: number) {
        const statement = database.prepareSync(`
        SELECT g.id,g.name,g.total, COALESCE(SUM(t.amount), 0) AS current
            FROM goals as g
            LEFT JOIN transactions as t 
            ON t.goal_id = g.id
            WHERE g.id = $id
            GROUP BY g.id, g.name, g.total
            `)

        const result = statement.executeSync<GoalResponseDatabase>({ $id: id })
        return result.getFirstSync()
    }

    function DeleteGoal(idGoal: number) {
        try {
            const statement = database.prepareSync(
                "DELETE from goals WHERE id = $id;"
            )

            statement.executeSync({
                $id: idGoal
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
        DeleteGoal
    }
}