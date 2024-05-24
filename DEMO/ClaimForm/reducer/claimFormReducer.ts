import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { ClaimFormStateInterface } from '../types';

const initialState: ClaimFormStateInterface = {
	steps: null,
	claimFormId: null,
};

export const claimFormStepSlice = createSlice({
	name: 'claimFormStep',
	initialState,
	reducers: {
		setClaimForStep: (
			state: ClaimFormStateInterface,
			action: PayloadAction<Record<string, number>>
		) => {
			state.steps = { ...state.steps, ...action.payload };
		},
		resetClaimFormStep: (state: ClaimFormStateInterface) => {
			state.steps = null;
		},
		setClaimFormId: (
			state: ClaimFormStateInterface,
			action: PayloadAction<string | null>
		) => {
			state.claimFormId = action.payload;
		},
	},
});

export const { setClaimForStep, resetClaimFormStep, setClaimFormId } =
	claimFormStepSlice.actions;
export default claimFormStepSlice.reducer;
