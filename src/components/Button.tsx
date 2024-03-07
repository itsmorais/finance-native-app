import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native"

type Props = TouchableOpacityProps & {
  title: string,
  color:string
}

export function Button({ title,color, ...rest }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`h-12 w-full ${color} items-center justify-center rounded-sm mt-4`}
      {...rest}
    >
      <Text className="text-white text-sm font-semiBold uppercase">
        {title}
      </Text>
    </TouchableOpacity>
  )
}
