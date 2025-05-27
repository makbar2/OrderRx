import {createContext, useContext} from "react";
const noop: SetTitleContext = () => {
  throw new Error("useTitle must be used within a DashboardTitleContext.Provider");
};

type SetTitleContext = React.Dispatch<React.SetStateAction<string>>;
export const DashboardTitleContext = createContext<SetTitleContext>(noop);
export const useTitle = () => useContext(DashboardTitleContext);