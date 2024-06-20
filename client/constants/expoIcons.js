import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";

export const icons = {
    home: (props)=> <AntDesign name="home" size={26} {...props} />,
    chat: (props)=> <MaterialCommunityIcons name="brain" size={26} {...props} />,
    create: (props)=> <AntDesign name="pluscircleo" size={26} {...props} />,
    profile: (props)=> <AntDesign name="user" size={26} {...props} />,
    calendar: (props)=> <AntDesign name="calendar" size={26} {...props} />,
}