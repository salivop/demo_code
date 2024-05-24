import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { AdditionalInformationStateInterface } from '../types';

const initialState: AdditionalInformationStateInterface = {
	informed: null,
	delayed: null,
};

export const claimAdditionalInformationFormSlice = createSlice({
	name: 'claimAdditionalInformationForm',
	initialState,
	reducers: {
		setInformedOption: (
			state: AdditionalInformationStateInterface,
			action: PayloadAction<string>
		) => {
			state.informed = action.payload;
		},
		setDelayedOption: (
			state: AdditionalInformationStateInterface,
			action: PayloadAction<string>
		) => {
			state.delayed = action.payload;
		},
		initAdditionalInfo: (
			state: AdditionalInformationStateInterface,
			action: PayloadAction<AdditionalInformationStateInterface>
		) => {
			state.informed = action.payload.informed;
			state.delayed = action.payload.delayed;
		},
	},
});

export const { setInformedOption, setDelayedOption, initAdditionalInfo } =
	claimAdditionalInformationFormSlice.actions;

export default claimAdditionalInformationFormSlice.reducer;
