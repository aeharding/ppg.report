import { FloatingContext, ReferenceType } from "@floating-ui/react";
import { useEffect } from "react";

interface GestureCloseOptions {
  interactive?: boolean;
}

export default function useGestureClose<
  RT extends ReferenceType = ReferenceType,
>(
  context: FloatingContext<RT>,
  { interactive }: GestureCloseOptions = { interactive: false },
) {
  const { open, onOpenChange } = context;

  useEffect(() => {
    if (!open) return;

    const handleTouchStart = () => {
      onOpenChange(false);
    };

    document.body.addEventListener("touchmove", handleTouchStart);
    if (!interactive)
      document.body.addEventListener("touchstart", handleTouchStart);

    return () => {
      document.body.removeEventListener("touchmove", handleTouchStart);
      if (!interactive)
        document.body.removeEventListener("touchstart", handleTouchStart);
    };
  }, [open, onOpenChange, interactive]);
}
