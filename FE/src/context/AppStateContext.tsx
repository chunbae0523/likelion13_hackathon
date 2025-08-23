import React, { createContext, useReducer, ReactNode, Dispatch } from "react";

// 상태 타입 정의
type State = {
  imageURL: string | null;
  // 추가 상태들...
};

type Action = { type: "SET_IMAGE_URL"; payload: string | null };

// 기본값 설정
const initialState: State = {
  imageURL: null,
};

// 리듀서 정의
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_IMAGE_URL":
      return { ...state, imageURL: action.payload };
    // 추가 액션들...
    default:
      return state;
  }
}

// Context 타입
type AppStateContextType = {
  state: State;
  dispatch: Dispatch<Action>;
};

// Context 생성
export const AppStateContext = createContext<AppStateContextType | undefined>(
  undefined
);

// Provider 컴포넌트
export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};
