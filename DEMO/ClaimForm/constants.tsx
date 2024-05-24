import { ReasonOption } from './types';
import { IntlShape } from 'react-intl';

export const userDisruptionReasons = (
	intl: IntlShape
): Record<string, ReasonOption> => ({
	'1': {
		id: '1',
		reason: intl.formatMessage({
			id: 'claim.form.disruption.what.flight.delay',
		}),
	},
	'2': {
		id: '2',
		reason: intl.formatMessage({
			id: 'claim.form.disruption.what.flight.cancelled',
		}),
	},
	'3': {
		id: '3',
		reason: intl.formatMessage({
			id: 'claim.form.disruption.what.flight.denied.boarding',
		}),
	},
	'4': {
		id: '4',
		reason: intl.formatMessage({
			id: 'claim.form.disruption.what.flight.something.else',
		}),
	},
});

export const airlineDisruptionReasons = (
	intl: IntlShape
): Record<string, ReasonOption> => ({
	'1': {
		id: '1',
		reason: intl.formatMessage({
			id: 'claim.form.disruption.airline.reason.technical',
		}),
		icon: 'construction',
	},
	'2': {
		id: '2',
		reason: intl.formatMessage({
			id: 'claim.form.disruption.airline.reason.weather',
		}),

		icon: 'thunderstorm',
	},
	'3': {
		id: '3',
		reason: intl.formatMessage({
			id: 'claim.form.disruption.airline.reason.strike',
		}),

		icon: 'campaign',
	},
	'4': {
		id: '4',
		reason: intl.formatMessage({
			id: 'claim.form.disruption.airline.reason.airport',
		}),

		icon: 'connecting_airports',
	},
	'5': {
		id: '5',
		reason: intl.formatMessage({
			id: 'claim.form.disruption.airline.reason.other',
		}),
		icon: 'pending',
	},
});

export const informedReason = (
	intl: IntlShape
): Record<string, ReasonOption> => ({
	'1': {
		id: '1',
		reason: intl.formatMessage({
			id: 'claim.form.additional.information.when.informed.less.than.24',
		}),
	},
	'2': {
		id: '2',
		reason: intl.formatMessage({
			id: 'claim.form.additional.information.when.informed.up.to.14.d',
		}),
	},
	'3': {
		id: '3',
		reason: intl.formatMessage({
			id: 'claim.form.additional.information.when.informed.more.than.14.d',
		}),
	},
});

export const delayedReason = (
	intl: IntlShape
): Record<string, ReasonOption> => ({
	'1': {
		id: '1',
		reason: intl.formatMessage({
			id: 'claim.form.additional.information.fly.late.time.less.than.2.h',
		}),
	},
	'2': {
		id: '2',
		reason: intl.formatMessage({
			id: 'claim.form.additional.information.fly.late.time.2.3.h',
		}),
	},
	'3': {
		id: '3',
		reason: intl.formatMessage({
			id: 'claim.form.additional.information.fly.late.time.more.than.3.h',
		}),
	},
	'4': {
		id: '4',
		reason: intl.formatMessage({
			id: 'claim.form.additional.information.fly.late.time.missed.connecting',
		}),
	},
	'5': {
		id: '5',
		reason: intl.formatMessage({
			id: 'claim.form.additional.information.fly.late.time.never.arrived',
		}),
	},
});
