import { Tabs } from "expo-router";
import { Dimensions, Image, ImageSourcePropType, ImageStyle, StyleProp, Text, View } from "react-native";

const scale = 1;
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const defaultBottomMargin = 47;

interface TabIconProps {
  icon: ImageSourcePropType;
  activeIcon: ImageSourcePropType;
  style: StyleProp<ImageStyle>
  name: string;
  color: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({icon, activeIcon, name, color, style, focused}) => (
  <View style={{alignItems: "center", justifyContent: "center"}}>
    <Image source={focused ? activeIcon : icon} style={style} resizeMode="contain"/>
    <Text style={{fontSize: 12, color, width: 55,marginTop: 6.5, textAlign:"center", fontFamily: "Pretendard-Regular"}} numberOfLines={1}>{name}</Text>
  </View>
)

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarStyle: {
        width: screenWidth,
        height: 100,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        // iOS 그림자
        shadowColor: '#9A9A9A',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 4,

        // Android 그림자
        elevation: 10,
        justifyContent: 'flex-end',
        zIndex: 10,
        position: 'fixed',
      },
      tabBarActiveTintColor: "#EA6844",
      tabBarInactiveTintColor: "#aaa",
      tabBarShowLabel: false,
    }}>
      <Tabs.Screen name="home" options={{
        title: "홈",
        headerShown: false,
        headerRight: undefined,
        tabBarButton: undefined,
        tabBarIcon: ({color, focused}) => (
          <TabIcon
            icon={require("../../assets/images/home_off.png")}
            activeIcon={require("../../assets/images/home_on.png")}
            name="홈"
            color={color}
            focused={focused}
            style={{width: 21.25*scale, height: 23.24*scale, marginTop: defaultBottomMargin}}
          />
        )
      }}/>

      <Tabs.Screen name="community" options={{
        title: "커뮤니티",
        headerShown: false,
        tabBarIcon: ({ color, focused}) => (
          <TabIcon
            icon={require("../../assets/images/community_off.png")}
            activeIcon={require("../../assets/images/community_on.png")}
            name="커뮤니티"
            color={color}
            focused={focused}
            style={{width: 33.3*scale, height: 24.99*scale, marginTop: defaultBottomMargin-1}}
          />
        ),
      }}/>

      <Tabs.Screen name="map" options={{
        title: "지도",
        headerShown: false,
        tabBarIcon: ({ color, focused}) => (
          <TabIcon
            icon={require("../../assets/images/location_off.png")}
            activeIcon={require("../../assets/images/location_on.png")}
            name="지도"
            color={color}
            focused={focused}
            style={{width: 22.67*scale, height: 28.33*scale, marginTop: defaultBottomMargin-4}}
          />
        ),
      }}/>

      <Tabs.Screen name="myPage" options={{
        title: "마이페이지",
        headerShown: false,
        tabBarIcon: ({ color, focused}) => (
          <TabIcon
            icon={require("../../assets/images/my_off.png")}
            activeIcon={require("../../assets/images/my_on.png")}
            name="마이페이지"
            color={color}
            focused={focused}
            style={{width: 25.5*scale, height: 25.5*scale, marginTop: defaultBottomMargin}}
          />
        ),
      }}/>
      
    </Tabs>
  );
}