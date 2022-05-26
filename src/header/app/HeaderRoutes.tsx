import { Route, Routes } from "react-router-dom";
import ReportHeader from "./ReportHeader";
import HomeHeader from "./HomeHeader";

export default function HeaderRoutes() {
  return (
    <Routes>
      <Route path="/:lat,:lon/*" element={<ReportHeader />} />
      <Route path="/" element={<HomeHeader />} />
    </Routes>
  );
}
