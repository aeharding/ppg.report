import { useEffect } from "react";
import { useAppDispatch } from "../../hooks";
import {
  IBeforeInstallPromptEvent,
  saveInstallProposalEvent,
} from "./installSlice";

export default function WindowInstallEventSetup() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const ready = (e: IBeforeInstallPromptEvent) => {
      e.preventDefault();
      dispatch(saveInstallProposalEvent(e));
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.addEventListener("beforeinstallprompt", ready as any);

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.removeEventListener("beforeinstallprompt", ready as any);
    };
  }, [dispatch]);

  return <></>;
}
