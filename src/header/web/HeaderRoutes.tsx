import { Route, Routes } from "react-router-dom";
import ReportHeader from "./ReportHeader";

export default function HeaderRoutes() {
  return (
    <Routes>
      <Route path="/:lat,:lon" element={<ReportHeader />} />
    </Routes>
  );
}
