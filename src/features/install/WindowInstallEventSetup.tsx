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

    window.addEventListener("beforeinstallprompt", ready as any);

    return () => {
      window.removeEventListener("beforeinstallprompt", ready as any);
    };
  }, [dispatch]);

  return <></>;
}
