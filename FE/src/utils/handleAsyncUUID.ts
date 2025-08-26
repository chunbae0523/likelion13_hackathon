import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
import { User } from "../types/user";

export const saveUUID = async (uuid: string) => {
  try {
    await AsyncStorage.setItem("uuid", uuid);
  } catch (e) {
    console.log("AsyncStorage 저장 실패:", e);
  }
};

export const getUUID = async (): Promise<string> => {
  try {
    const value = await AsyncStorage.getItem("uuid");
    if (value !== null) {
      return value;
    }
  } catch (e) {
    throw new Error("! AsyncStorage 불러오기 에러");
  }
  throw new Error("! 해당 UUID는 AsyncStorage에 존재하지 않습니다");
};

export const removeUUID = async () => {
  try {
    await AsyncStorage.removeItem("uuid");
  } catch (e) {
    console.log("AsyncStorage 삭제 에러:", e);
  }
};

export const getUserByUUID = async (uuid: string): Promise<User> => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", uuid)
    .single();
  if (error || !data) {
    throw new Error("No user found for this UUID");
    // 해당 UUID 조회 안됨
  }
  return data as User;
};
