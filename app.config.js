import "dotenv/config"; // .env 변수 불러오기

export default ({ config }) => {
  return {
    ...config,
    extra: {
      AI_API_TOKEN: process.env.AI_API_TOKEN || "fallback_token",
      // 필요시 다른 환경 변수들도 추가
    },
  };
};
