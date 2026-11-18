import type { MaybeRefOrGetter } from 'vue'


/** Относительное время в локали i18n: «вчера», «14 ч назад» */
export function useRelativeTime(value: MaybeRefOrGetter<Date | number | string>) {
	const { $getLocale } = useI18n()

	return useTimeAgoIntl(() => new Date(toValue(value)), {
		locale: $getLocale(),
		relativeTimeFormatOptions: { numeric: 'auto', style: 'short' },
	})
}
