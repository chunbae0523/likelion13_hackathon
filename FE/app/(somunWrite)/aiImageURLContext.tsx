import React from "react";

type aiImageURLContextType = {
  imageURL: string | null;
  setImageURL: React.Dispatch<React.SetStateAction<string | null>>;
};

export const ImageURLContext =
  React.createContext<aiImageURLContextType | null>(null);

export const ImageURLProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [imageURL, setImageURL] = React.useState<string | null>(null);

  return (
    <ImageURLContext.Provider value={{ imageURL, setImageURL }}>
      {children}
    </ImageURLContext.Provider>
  );
};
