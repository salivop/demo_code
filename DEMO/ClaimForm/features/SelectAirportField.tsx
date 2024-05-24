import * as React from 'react';
import { useField, useFormikContext } from 'formik';
import { FormattedMessage } from 'react-intl';

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { AirportInterface } from 'features/Airport';
interface Props {
	name: string;
	label: string;
	helperText?: string;
	options: AirportInterface[];
	startIcon?: React.ReactNode;
	placeholder?: string;
	onOptionChange: (value: string, name: string) => void;
	onSelectedChange: (value: AirportInterface, name: string) => void;
	optionRender: React.ReactNode;
	value: AirportInterface;
	loading: boolean;
	handleLoadMore: () => void;
}

export const SelectAirportField: React.FC<Props> = ({
	name,
	label,
	helperText,
	startIcon,
	placeholder,
	options = [],
	onOptionChange,
	onSelectedChange,
	optionRender,
	loading,
	handleLoadMore,
	...otherProps
}) => {
	const [field, meta] = useField(name);
	const formikProps = useFormikContext();

	const configTextField = {
		fullWidth: true,
		...field,
		...otherProps,
	};

	const error = !!(meta && meta.touched && meta.error);
	const helperT = error ? meta.error : helperText;

	const filterOptions = createFilterOptions({
		stringify: (airport: AirportInterface) =>
			`${airport.code.iata} ${airport.title}`,
	});

	return (
		<Autocomplete
			ListboxProps={{
				role: 'list-box',
				onScroll: (event) => {
					const listboxNode = event.currentTarget;

					if (
						listboxNode.scrollTop + listboxNode.clientHeight ===
						listboxNode.scrollHeight
					) {
						if (handleLoadMore) {
							handleLoadMore();
						}
					}
				},
			}}
			size="small"
			id={name}
			{...configTextField}
			onChange={(_, newValue) => {
				formikProps.setFieldValue(name, newValue);
				onSelectedChange(newValue as AirportInterface, name);
			}}
			filterOptions={filterOptions}
			getOptionLabel={(option: AirportInterface) => option.title || ''}
			loading={loading}
			loadingText={<FormattedMessage id="skyknight.fetching.data" />}
			renderOption={(props, option: AirportInterface) => (
				<Box component="li" {...props}>
					<LocationOnIcon />
					{option.title} ({option.code.iata})
				</Box>
			)}
			disablePortal
			options={options}
			renderInput={(params) => (
				<TextField
					{...params}
					name={name}
					onChange={(e) =>
						onOptionChange ? onOptionChange(e.target.value, name) : {}
					}
					label={label}
					error={error}
					helperText={helperT}
					placeholder={placeholder}
					InputProps={{
						...params.InputProps,
						startAdornment: (
							<InputAdornment position="start">{startIcon}</InputAdornment>
						),
					}}
				/>
			)}
		/>
	);
};
