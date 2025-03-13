import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
// import PageA from "./PageA";

const PageA = lazy(() => import("./PageA"));

function AppRouter() {
  return (
    <BrowserRouter basename="/react18/">
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/pageA"
          element={
            <Suspense fallback={<div>loading</div>}>
              <PageA />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
