// import supabase client
import { supabase } from "../lib/supabase";

import { User } from "../types/user";

export async function fetchUserProfiles() {
  const { data, error } = await supabase.from("user_profiles").select("*");
  if (error) {
    console.error("Error fetching profiles:", error);
  } else {
    console.log(data);
  }
}

export async function getUserProfileByEmail(email: string) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    // 이메일 조회 안됨 -> 회원가입 필요
    return null;
  }
  return data;
}

export async function registerProfile(
  email: string,
  username: string,
  password: string
) {
  const data = await getUserProfileByEmail(email);
  if (data === null) {
    // 데이터가 존재하지 않으면
    const profileData = {
      email: email,
      username: username,
      password: password,
    };
    const { data, error } = await supabase
      .from("user_profiles")
      .insert([profileData]); // 배열 형태로 넣어야 함
    if (error) {
      // 프로필 생성에 실패
      return null;
    }
    return profileData; // 삽입된 데이터 반환
  } else {
    // 데이터가 존재하면(이메일이 존재하면)
    return null;
  }
}

export async function checkUserLoginByEmail(email: string, pwd: string) {
  const data: User = await getUserProfileByEmail(email);
  if (data) {
    // 존재하는 유저라면
    if (pwd === data.password) {
      return data;
    } else {
      return false;
    }
  } else {
    // 존재하지 않는 유저라면
    return false;
  }
}
