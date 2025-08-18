import axios from "axios";

// ⚠️ 중요한 부분!! 
// 여기 "localhost"는 컴퓨터에서만 되고, 
// 휴대폰에서 돌릴 땐 PC의 로컬 IP(예: 192.168.0.12)로 바꿔야 돼!
// (IP 확인법: 윈도우는 PowerShell -> ipconfig, 맥은 터미널 -> ipconfig getifaddr en0)

export const api = axios.create({
  baseURL: "http://192.168.45.100",
});
