import { Authenticated, Refine } from '@refinedev/core';
import { DevtoolsPanel, DevtoolsProvider } from '@refinedev/devtools';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';

import {
  ErrorComponent,
  ThemedLayout,
  ThemedSider,
  useNotificationProvider,
} from '@refinedev/antd';
import '@refinedev/antd/dist/reset.css';

import {
  CrownOutlined,
  DatabaseOutlined,
  FallOutlined,
  ProductOutlined,
  RiseOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  ShopOutlined,
  UserOutlined,
} from '@ant-design/icons';
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router';
import { App as AntdApp } from 'antd';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router';
import { ShowRedirectDrawer } from './components';
import { Header } from './components/header';
import { ColorModeContextProvider } from './contexts/color-mode';

import { useTranslation } from 'react-i18next';
import { Customer } from './pages/customers';
import { ForgotPassword } from './pages/forgotPassword';
import { InventoryTransaction } from './pages/inventory-transactions';
import { Login } from './pages/login';
import { Permission } from './pages/permissions';
import { ProductCategory } from './pages/product-categories';
import { Product } from './pages/products';
import { Purchase } from './pages/purchases';
import { Register } from './pages/register';
import { Role } from './pages/roles';
import { Sale } from './pages/sales';
import { Supplier } from './pages/suppliers';
import { User } from './pages/users';
import { authProvider, dataProvider } from './providers';

function App() {
  const API_URL = import.meta.env.VITE_API_URL;
  const dp = dataProvider(API_URL);

  const { t } = useTranslation();

  const i18nProvider = {
    translate: (key: string, options?: unknown, defaultMessage?: string) => {
      if (typeof options === 'string' && defaultMessage === undefined) {
        return String(t(key, { defaultValue: options }));
      }
      const interpolation =
        options && typeof options === 'object' && !Array.isArray(options)
          ? (options as Record<string, unknown>)
          : {};
      return String(
        t(key, {
          ...interpolation,
          ...(defaultMessage !== undefined
            ? { defaultValue: defaultMessage }
            : {}),
        }),
      );
    },
    changeLocale: () => Promise.resolve(),
    getLocale: () => 'vi',
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
                    name: 'suppliers',
                    list: '/suppliers',
                    show: '/suppliers/show/:id',
                    meta: { canDelete: true, icon: <ShopOutlined /> },
                  },
                  {
                    name: 'purchases',
                    list: '/purchases',
                    create: '/purchases/create',
                    edit: '/purchases/edit/:id',
                    show: '/purchases/show/:id',
                    meta: { canDelete: true, icon: <FallOutlined /> },
                  },
                  {
                    name: 'customers',
                    list: '/customers',
                    show: '/customers/show/:id',
                    meta: { canDelete: true, icon: <UserOutlined /> },
                  },
                  {
                    name: 'sales',
                    list: '/sales',
                    create: '/sales/create',
                    edit: '/sales/edit/:id',
                    show: '/sales/show/:id',
                    meta: { canDelete: true, icon: <RiseOutlined /> },
                  },
                  {
                    name: 'product-categories',
                    list: '/product-categories',
                    meta: { canDelete: true },
                  },
                  {
                    name: 'products',
                    list: '/products',
                    show: '/products/show/:id',
                    meta: { canDelete: true, icon: <ProductOutlined /> },
                  },
                  {
                    name: 'inventory-transactions',
                    list: '/inventory-transactions',
                    show: '/inventory-transactions/show/:id',
                    meta: { icon: <DatabaseOutlined /> },
                  },
                  {
                    name: 'management',
                    meta: {
                      label: 'Quản lý',
                      icon: <SettingOutlined />,
                    },
                  },
                  {
                    name: 'users',
                    list: '/users',
                    create: '/users/create',
                    edit: '/users/edit/:id',
                    show: '/users/show/:id',
                    meta: {
                      canDelete: true,
                      parent: 'management',
                      icon: <UserOutlined />,
                    },
                  },
                  {
                    name: 'roles',
                    list: '/roles',
                    create: '/roles/create',
                    edit: '/roles/edit/:id',
                    show: '/roles/show/:id',
                    meta: {
                      canDelete: true,
                      parent: 'management',
                      icon: <SafetyCertificateOutlined />,
                    },
                  },
                  {
                    name: 'permissions',
                    list: '/permissions',
                    create: '/permissions/create',
                    edit: '/permissions/edit/:id',
                    show: '/permissions/show/:id',
                    meta: {
                      canDelete: true,
                      parent: 'management',
                      icon: <CrownOutlined />,
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: 'a5WoM1-ByiDqe-Fged8O',
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
                      element={<NavigateToResource resource="suppliers" />}
                    />
                    <Route path="/suppliers">
                      <Route index element={<Supplier.List />} />
                      <Route path="show/:id" element={<Supplier.Show />} />
                    </Route>
                    <Route path="/purchases">
                      <Route index element={<Purchase.List />} />
                      <Route path="create" element={<Purchase.Create />} />
                      <Route path="edit/:id" element={<Purchase.Edit />} />
                      <Route path="show/:id" element={<Purchase.Show />} />
                    </Route>
                    <Route path="/sales">
                      <Route index element={<Sale.List />} />
                      <Route path="create" element={<Sale.Create />} />
                      <Route path="edit/:id" element={<Sale.Edit />} />
                      <Route path="show/:id" element={<Sale.Show />} />
                    </Route>
                    <Route path="/customers">
                      <Route index element={<Customer.List />} />
                      <Route path="show/:id" element={<Customer.Show />} />
                    </Route>
                    <Route path="/products">
                      <Route index element={<Product.List />} />
                      <Route path="show/:id" element={<Product.Show />} />
                    </Route>
                    <Route path="/inventory-transactions">
                      <Route index element={<InventoryTransaction.List />} />
                      <Route
                        path="show/:id"
                        element={<InventoryTransaction.Show />}
                      />
                    </Route>
                    <Route path="/users">
                      <Route index element={<User.List />} />
                      <Route path="create" element={<User.Create />} />
                      <Route path="edit/:id" element={<User.Edit />} />
                      <Route path="show/:id" element={<User.Show />} />
                    </Route>
                    <Route path="/roles">
                      <Route index element={<Role.List />} />
                      <Route path="create" element={<Role.Create />} />
                      <Route path="edit/:id" element={<Role.Edit />} />
                      <Route path="show/:id" element={<Role.Show />} />
                    </Route>
                    <Route path="/permissions">
                      <Route index element={<Permission.List />} />
                      <Route path="create" element={<Permission.Create />} />
                      <Route path="edit/:id" element={<Permission.Edit />} />
                      <Route path="show/:id" element={<Permission.Show />} />
                    </Route>
                    <Route path="/product-categories">
                      <Route index element={<ProductCategory.List />} />
                      <Route
                        path="show/:id"
                        element={
                          <ShowRedirectDrawer listPath="/product-categories" />
                        }
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
