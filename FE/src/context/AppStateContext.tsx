import React, { createContext, useReducer, ReactNode, Dispatch } from "react";
import { User } from "../types/user";

// 상태 타입 정의
type State = {
  imageURL: string | null;
  isUploading?: boolean;
  // 추가 상태들...
};

type Action = 
  | { type: "SET_IMAGE_URL"; payload: string | null }
  | { type: "SET_IS_UPLOADING"; payload: boolean }

// 기본값 설정
const initialState: State = {
  imageURL: null,
  isUploading: false,
};

// 리듀서 정의
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_IMAGE_URL":
      return { ...state, imageURL: action.payload };
    // 추가 액션들...
    case "SET_IS_UPLOADING":
      return { ...state, isUploading: action.payload };
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
