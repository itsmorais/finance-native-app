// LIBS
import { useEffect, useRef, useState } from "react"
import { Alert, View, Keyboard } from "react-native"
import Bottom from "@gorhom/bottom-sheet"
import { router } from "expo-router"
import dayjs from "dayjs"

// COMPONENTS
import { Input } from "@/components/Input"
import { Header } from "@/components/Header"
import { Button } from "@/components/Button"
import { BottomSheet } from "@/components/BottomSheet"
import { Goals, GoalsProps } from "@/components/Goals"
import { Transactions, TransactionsProps } from "@/components/Transactions"

// DATABASE
import { useGoalRepository } from "@/database/useGoalRepository"
import { useTransactionRepository } from "@/database/useTransactionRepository"

export default function Home() {
  // LISTS
  const [transactions, setTransactions] = useState<TransactionsProps>([])
  const [goals, setGoals] = useState<GoalsProps>([])

  // FORM
  const [name, setName] = useState("")
  const [total, setTotal] = useState("")

  // DATABASE

  const useGoal = useGoalRepository();
  const useTransaction = useTransactionRepository();

  // BOTTOM SHEET
  const bottomSheetRef = useRef<Bottom>(null)
  const handleBottomSheetOpen = () => bottomSheetRef.current?.expand()
  const handleBottomSheetClose = () => bottomSheetRef.current?.snapToIndex(0)

  function handleDetails(id: string) {
    try {
      router.navigate("/details/" + id)

    } catch (error) {
      console.log(error)
    }
  }

  async function handleCreate() {
    try {
      const totalAsNumber = Number(total.toString().replace(",", "."))

      if (isNaN(totalAsNumber)) {
        return Alert.alert("Erro", "Valor inválido.")
      }

      useGoal.create({ name, total: totalAsNumber })

      Keyboard.dismiss()
      handleBottomSheetClose()
      Alert.alert("Sucesso", "Meta cadastrada!")
      fetchGoals()

      setName("")
      setTotal("")
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar.")
      console.log(error)
    }
  }


  async function fetchGoals() {
    try {
      const response = useGoal.all()
      setGoals(response)
    } catch (error) {
      console.log(error)
    }
  }

  async function fetchTransactions() {
    try {
      const response = useTransaction.all()

      setTransactions(
        response.map((item) => ({
          ...item,
          date: dayjs(item.created_ate).format("DD/MM/YYYY [às] HH:mm"),
        }))
      )
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchGoals()
    fetchTransactions()
  }, [])

  return (
    <View className="flex-1 p-8">
      <Header
        title="Suas metas"
        subtitle="Poupe hoje para colher os frutos amanhã."
      />

      <Goals
        goals={goals}
        onAdd={handleBottomSheetOpen}
        onPress={handleDetails}
      />

      <Transactions transactions={transactions} />

      <BottomSheet
        ref={bottomSheetRef}
        title="Nova meta"
        snapPoints={[0.01, 600]}
        onClose={handleBottomSheetClose}
      >
        <Input placeholder="Nome da meta" onChangeText={setName} value={name} />

        <Input
          placeholder="Valor"
          keyboardType="numeric"
          onChangeText={setTotal}
          value={total}
        />

        <Button color="bg-blue-500" title="Criar" onPress={handleCreate} />
      </BottomSheet>
    </View>
  )
}
