import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
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
        path="/:location"
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
