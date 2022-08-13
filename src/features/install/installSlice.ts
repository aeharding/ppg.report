import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IBeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface InstallState {
  beforeInstallEvent: IBeforeInstallPromptEvent | undefined;
}

// Define the initial state using that type
const initialState: InstallState = {
  beforeInstallEvent: undefined,
};

/**
 * User preferences
 */
export const userReducer = createSlice({
  name: "install",
  initialState,
  reducers: {
    saveInstallProposalEvent(
      state,
      action: PayloadAction<IBeforeInstallPromptEvent>
    ) {
      state.beforeInstallEvent = action.payload;
    },
    promptToAddToHomeScreen(state) {
      state.beforeInstallEvent = undefined;
    },
  },
});

export const { saveInstallProposalEvent, promptToAddToHomeScreen } =
  userReducer.actions;

export default userReducer.reducer;
