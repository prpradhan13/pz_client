import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./context/AuthContext";
import Loaders from "./components/loaders/Loaders";

const MainLayout = lazy(() => import("./layouts/MainLayout"));
const RegisterLayout = lazy(() => import("./layouts/RegisterLayout"));
const RegisterPage = lazy(() => import("./pages/Register"));
const PrivateRoute = lazy(() => import("./components/auth/PrivateRoute"));
const HomePage = lazy(() => import("./pages/Home"));
const ExpensePage = lazy(() => import("./pages/Expense"));
const TrainingPage = lazy(() => import("./pages/Training"));
const ProfilePage = lazy(() => import("./pages/Profile"));
const TodoPage = lazy(() => import("./pages/Todo"));

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <BrowserRouter>
        <AuthProvider>
          <Toaster />

          <Suspense fallback={<Loaders />}>
            <Routes>
              
              <Route element={<RegisterLayout />}>
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              <Route element={<MainLayout />}>
                <Route path="/" element={<PrivateRoute />}>
                  <Route path="" element={<HomePage />} />
                  <Route path="user-expense" element={<ExpensePage />} />
                  <Route path="user-training" element={<TrainingPage />} />
                  <Route path="user-profile" element={<ProfilePage />} />
                  <Route path="user-todo" element={<TodoPage />} />
                </Route>
              </Route>

            </Routes>
          </Suspense>

        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
