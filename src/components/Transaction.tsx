import { Pressable, PressableProps, Text } from "react-native"

import { currencyFormat } from "@/utils/currencyFormat"
import { colors } from "@/styles/colors"
import { MaterialCommunityIcons } from "@expo/vector-icons"

export type TransactionProps = {
  date: string
  amount: number
  id: number,
}

type Props = PressableProps & {
  transaction: TransactionProps,
  onDeleteTransaction?: (idTransaction: number) => void;

}
export function Transaction({ transaction, onDeleteTransaction, ...rest }: Props) {
  return (
    <Pressable
      className="w-full h-16 bg-gray-500 rounded-sm border border-gray-400 p-4 flex-row items-center justify-between"
      {...rest}
    >
      <Text
        className="font-regular text-sm"
        style={{
          color: transaction.amount < 0 ? colors.red[500] : colors.green[500],
        }}
      >
        {transaction.amount < 0 ? "- " : "+ "}
        {currencyFormat(transaction.amount).replace("-", "")}
      </Text>

      <Text className="text-gray-300 font-regular text-sm">
        {transaction.date}

      </Text>

      {onDeleteTransaction ? <MaterialCommunityIcons name="close-circle" size={20} color={colors.red[500]}
        onPress={() => onDeleteTransaction(transaction.id)} />
        :
        <></>}


    </Pressable>
  )
}
