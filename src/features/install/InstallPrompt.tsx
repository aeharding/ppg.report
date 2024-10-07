import BottomSheet from "../../bottomSheet/BottomSheet";
import { isInstalled, isMobile } from "../../helpers/device";
import { useAppDispatch, useAppSelector } from "../../hooks";
import InstallInstructions from "./InstallInstructions";
import { promptToAddToHomeScreen } from "./installSlice";
import Promo from "./Promo";

const open = (() => {
  const url = new URL(window.location.href);

  if (url.searchParams.get("installApp")) {
    url.searchParams.delete("installApp");
    window.history.replaceState(null, "", url.href);
    return true;
  }

  return false;
})();

export default function InstallPrompt() {
  const dispatch = useAppDispatch();
  const beforeInstallEvent = useAppSelector(
    (state) => state.install.beforeInstallEvent,
  );

  function renderiPhonePromo() {
    return (
      <>
        <BottomSheet openButton={<Promo />} title="Install the app" open={open}>
          <InstallInstructions />
        </BottomSheet>
      </>
    );
  }

  if (isInstalled()) return <></>;
  if (navigator.userAgent.match(/iPhone|iPad/i)) return renderiPhonePromo();
  if (!beforeInstallEvent) return <></>;
  if (!isMobile()) return <></>;

  return (
    <Promo
      onClick={() => {
        beforeInstallEvent.prompt();
        dispatch(promptToAddToHomeScreen());
      }}
    />
  );
}
