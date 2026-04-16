import {
  Navigate,
  Outlet,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../components/Header";
import { Bounce, ToastContainer } from "react-toastify";
import { useCompany } from "../store/company.store";
import { useEffect } from "react";
import { useAuth } from "../store/auth.store";

const RootLayout = () => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const { getCompanySlug, isCompanySlugLoading, isCompanySlugInvalid } =
    useCompany();
  const { refreshToken } = useAuth();

  useEffect(() => {
    getCompanySlug();
  }, [getCompanySlug]);

  useEffect(() => {
    refreshToken();
  }, [refreshToken]);

  if (isCompanySlugLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-sm text-slate-500">Carregando...</span>
      </div>
    );
  }

  const isCompanyNotFoundPage = pathname === "/errors/companyNotFound";

  if (isCompanySlugInvalid && !isCompanyNotFoundPage) {
    return <Navigate to="/errors/companyNotFound" replace />;
  }

  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ecfeff,#f8fafc_40%,#eef2ff)]">
        <Header />
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });
