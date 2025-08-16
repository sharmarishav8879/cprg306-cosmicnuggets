"use client";
import { usePathname } from "next/navigation";
import { AuthContextProvider, useUserAuth } from "./_utils/auth-context";
import NavBar from "./component/navBar";
export default function ClientLayout({ children }) {
  return (
    <AuthContextProvider>
      <AuthWrapper>{children}</AuthWrapper>
    </AuthContextProvider>
  );
}

function AuthWrapper({ children }) {
  const { user } = useUserAuth();
  const pathName = usePathname();

  const hideNavBarPaths = ["/login", "/", "/signUp"];

  const shouldShowNavBar = user && !hideNavBarPaths.includes(pathName);
  return (
    <div className="flex flex-col min-h-screen">
      {shouldShowNavBar && <NavBar />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
