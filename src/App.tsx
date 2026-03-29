import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  ThemedLayout,
  ThemedSider,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";

import { useTranslation } from "react-i18next";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { ProductCategory } from "./pages/product-categories";
import { Register } from "./pages/register";
import { authProvider, dataProvider } from "./providers";

function App() {
  const API_URL = import.meta.env.VITE_API_URL;
  const dp = dataProvider(API_URL);

  const { t } = useTranslation();

  const i18nProvider = {
    translate: (key: string, options?: unknown, defaultMessage?: string) => {
      if (typeof options === "string" && defaultMessage === undefined) {
        return String(t(key, { defaultValue: options }));
      }
      const interpolation =
        options && typeof options === "object" && !Array.isArray(options)
          ? (options as Record<string, unknown>)
          : {};
      return String(
        t(key, {
          ...interpolation,
          ...(defaultMessage !== undefined
            ? { defaultValue: defaultMessage }
            : {}),
        })
      );
    },
    changeLocale: () => Promise.resolve(),
    getLocale: () => "vi",
  };

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dp}
                notificationProvider={useNotificationProvider}
                routerProvider={routerProvider}
                authProvider={authProvider}
                i18nProvider={i18nProvider}
                resources={[
                  {
                    name: "product-categories",
                    list: "/product-categories",
                    create: "/product-categories/create",
                    edit: "/product-categories/edit/:id",
                    show: "/product-categories/show/:id",
                    meta: {
                      canDelete: true,
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "a5WoM1-ByiDqe-Fged8O",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayout
                          Header={Header}
                          Sider={(props) => <ThemedSider {...props} fixed />}
                        >
                          <Outlet />
                        </ThemedLayout>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={
                        <NavigateToResource resource="product-categories" />
                      }
                    />
                    <Route path="/product-categories">
                      <Route index element={<ProductCategory.List />} />
                      <Route
                        path="create"
                        element={<ProductCategory.Create />}
                      />
                      <Route
                        path="edit/:id"
                        element={<ProductCategory.Edit />}
                      />
                      <Route
                        path="show/:id"
                        element={<ProductCategory.Show />}
                      />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
