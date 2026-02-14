import { Suspense } from "react";
import LoginView from "./LoginView";

export const metadata = {
  title: "Login | Cuci Sepatu App",
  description: "Login ke admin dashboard",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Suspense fallback={null}>
        <LoginView />
      </Suspense>
    </div>
  );
}
