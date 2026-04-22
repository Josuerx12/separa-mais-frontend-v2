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
import LoadingProfile from "../components/LoadingProfile";
import AppSidebar from "../components/AppSidebar";

const RootLayout = () => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const { getCompanySlug, isCompanySlugLoading, isCompanySlugInvalid } =
    useCompany();
  const { refreshToken, isUserLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    getCompanySlug();
  }, [getCompanySlug]);

  useEffect(() => {
    refreshToken();
  }, [refreshToken]);

  if (isCompanySlugLoading || isUserLoading) {
    return <LoadingProfile />;
  }

  const isCompanyNotFoundPage = pathname === "/errors/companyNotFound";

  if (isCompanySlugInvalid && !isCompanyNotFoundPage) {
    return <Navigate to="/errors/companyNotFound" replace />;
  }

  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ecfeff,#f8fafc_40%,#eef2ff)]">
        <Header />
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
          {isAuthenticated ? (
            <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
              <AppSidebar />
              <main className="min-w-0">
                <Outlet />
              </main>
            </div>
          ) : (
            <main className="mx-auto w-full max-w-6xl">
              <Outlet />
            </main>
          )}
        </div>
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
