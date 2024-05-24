import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { AirportInterface } from 'features/Airport';
import { ClaimSearchStateInterface, ClaimSearchAirports } from '../types';

const initialState: ClaimSearchStateInterface = {
	purchaseCode: null,
	destination: {
		arrivalAirport: null,
		departureAirport: null,
	},
};

export const claimSearchFormSlice = createSlice({
	name: 'claimSearchForm',
	initialState,
	reducers: {
		setDestinationFormValues: (
			state: ClaimSearchStateInterface,
			action: PayloadAction<ClaimSearchStateInterface>
		) => {
			state.purchaseCode = action.payload.purchaseCode;
			state.destination = action.payload.destination;
		},
		setPurchaseId: (
			state: ClaimSearchStateInterface,
			action: PayloadAction<string | null>
		) => {
			state.purchaseCode = action.payload;
		},
		setDepartureAirport: (
			state: ClaimSearchStateInterface,
			action: PayloadAction<AirportInterface>
		) => {
			state.destination.departureAirport = action.payload;
		},
		setArrivalAirport: (
			state: ClaimSearchStateInterface,
			action: PayloadAction<AirportInterface>
		) => {
			state.destination.arrivalAirport = action.payload;
		},
		initDestination: (
			state: ClaimSearchStateInterface,
			action: PayloadAction<ClaimSearchAirports>
		) => {
			state.destination.arrivalAirport =
				action.payload.destination.arrivalAirport;
			state.destination.departureAirport =
				action.payload.destination.departureAirport;
		},
	},
});

export const {
	setPurchaseId,
	setDepartureAirport,
	setArrivalAirport,
	setDestinationFormValues,
	initDestination,
} = claimSearchFormSlice.actions;

export default claimSearchFormSlice.reducer;
