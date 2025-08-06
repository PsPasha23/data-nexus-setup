import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: 'hsl(262, 90%, 50%)',
          colorPrimaryHover: 'hsl(262, 100%, 70%)',
          colorBgContainer: 'hsl(0, 0%, 100%)',
          colorBgContainerDisabled: 'hsl(220, 15%, 96%)',
          colorText: 'hsl(222.2, 84%, 4.9%)',
          colorTextSecondary: 'hsl(215.4, 16.3%, 46.9%)',
          colorBorder: 'hsl(220, 13%, 91%)',
          colorBorderSecondary: 'hsl(220, 15%, 96%)',
          borderRadius: 12,
          borderRadiusLG: 16,
          boxShadow: '0 4px 12px hsl(262, 90%, 50% / 0.15)',
          boxShadowSecondary: '0 2px 8px hsl(0, 0%, 0% / 0.06)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontSize: 14,
          lineHeight: 1.5,
        },
        components: {
          Button: {
            primaryShadow: '0 4px 12px hsl(262, 90%, 50% / 0.3)',
            defaultShadow: '0 2px 8px hsl(0, 0%, 0% / 0.06)',
            borderRadius: 8,
            fontWeight: 500,
          },
          Card: {
            headerBg: 'hsl(0, 0%, 100%)',
            boxShadowTertiary: '0 2px 12px hsl(0, 0%, 0% / 0.04)',
            borderRadiusLG: 16,
          },
          Steps: {
            colorPrimary: 'hsl(262, 90%, 50%)',
            colorText: 'hsl(215.4, 16.3%, 46.9%)',
            fontSizeSM: 13,
          },
          Input: {
            borderRadius: 8,
            paddingInline: 12,
            paddingBlock: 8,
          },
          Checkbox: {
            borderRadius: 4,
          },
          Radio: {
            borderRadius: 4,
          },
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  </QueryClientProvider>
);

export default App;
