// server/middlewares/fakeAuth.js (ESM)
export function fakeAuth(req, _res, next) {
  req.user = { id: 1 }; // 개발용 가짜 로그인
  next();
}
export default fakeAuth;

