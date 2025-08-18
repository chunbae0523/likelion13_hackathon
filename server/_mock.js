// server/_mock.js  (경로가 server 폴더 바로 아래임을 확인!)
export const MOCK_STORES = [
  { id: 1, name: "소문난 카페", category: "카페", address: "인천 연수구", lat: 37.4105, lng: 126.678, thumbnail: "" },
  { id: 2, name: "연수동 분식", category: "분식", address: "인천 연수구", lat: 37.4090, lng: 126.682, thumbnail: "" },
  { id: 3, name: "바다뷰 치킨", category: "치킨", address: "인천 연수구", lat: 37.4120, lng: 126.675, thumbnail: "" }
];

export const MOCK_POSTS = [
  { id: "p1", storeId: 1, content: "주말 30% 할인!" },
  { id: "p2", storeId: 2, content: "신메뉴 라떼 출시" },
  { id: "p3", storeId: 3, content: "떡볶이 1+1 이벤트" }
];
