import { propertyGroups } from 'stylelint-config-clean-order'


const propertiesOrder = propertyGroups.map(properties => ({
	noEmptyLineBetween: false,
	emptyLineBefore: 'always', // Don't add empty lines between order groups.
	properties,
}))

export default {
	customSyntax: 'postcss-html',
	extends: ['stylelint-config-recommended-vue', 'stylelint-config-clean-order'],
	rules: {
		'order/properties-order': [
			[
				...propertiesOrder,
				{
					noEmptyLineBetween: false,
					emptyLineBefore: 'always',
					properties: ['@mixin', '@define-mixin'],
				},
			],
			{
				severity: 'warning',
				unspecified: 'bottomAlphabetical',
			},
		],
		'order/order': [
			['custom-properties', 'dollar-variables', 'declarations', 'rules', 'at-rules'],
			{
				severity: 'warning',
			},
		],
		'at-rule-no-unknown': [null, { ignoreAtRules: ['@mixin', '@define-mixin'] }],
		'function-no-unknown': [true, { ignoreFunctions: ['alpha'] }],
		'no-descending-specificity': [null],
		'declaration-property-value-no-unknown': null,
	},
}
