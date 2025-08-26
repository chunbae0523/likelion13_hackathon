export type User = {
  id: string;
  email: string;
  username: string; // 선택적 필드
  avatar_url?: string;
  password: string;
  isSajang: boolean;
};
