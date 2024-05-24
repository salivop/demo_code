import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { ClaimDisruptionReasonStateInterface } from '../types';

const initialState: ClaimDisruptionReasonStateInterface = {
	userReason: null,
	airlineReason: null,
	details: '',
};

export const claimDisruptionReasonFormSlice = createSlice({
	name: 'claimDisruptionReasonForm',
	initialState,
	reducers: {
		setUserReasonOption: (
			state: ClaimDisruptionReasonStateInterface,
			action: PayloadAction<string>
		) => {
			state.userReason = action.payload;
		},
		setAirlineReasonOption: (
			state: ClaimDisruptionReasonStateInterface,
			action: PayloadAction<string>
		) => {
			state.airlineReason = action.payload;
		},
		setDetailsDescription: (
			state: ClaimDisruptionReasonStateInterface,
			action: PayloadAction<string>
		) => {
			state.details = action.payload;
		},
		initDisruptionReason: (
			state: ClaimDisruptionReasonStateInterface,
			action: PayloadAction<ClaimDisruptionReasonStateInterface>
		) => {
			state.userReason = action.payload.userReason;
			state.airlineReason = action.payload.airlineReason;
			state.details = action.payload.details;
		},
	},
});

export const {
	setUserReasonOption,
	setAirlineReasonOption,
	setDetailsDescription,
	initDisruptionReason,
} = claimDisruptionReasonFormSlice.actions;

export default claimDisruptionReasonFormSlice.reducer;
