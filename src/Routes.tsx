import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import Terms from "./routes/Terms";
import Loading from "./shared/Loading";

const Report = lazy(() => import("./routes/Report"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/:lat,:lon"
        element={
          <Suspense fallback={<Loading />}>
            <Report />
          </Suspense>
        }
      />
      <Route path="/terms" element={<Terms />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
