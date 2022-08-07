import { Suspense, lazy } from "react";
import type { BottomSheetProps } from "./BottomSheetInternals";

const BottomSheetInternals = lazy(() => import("./BottomSheetInternals"));

export default function BottomSheet(props: BottomSheetProps) {
  return (
    <Suspense fallback>
      <BottomSheetInternals {...props} />
    </Suspense>
  );
}
