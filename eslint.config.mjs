import { antfu } from '@antfu/eslint-config'

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default antfu({
	ignores: ['**/*.json'],
	stylistic: {
		indent: 'tab',
		overrides: {
			'style/quotes': ['error', 'single', { avoidEscape: true }],
			'style/jsx-quotes': ['error', 'prefer-single'],
			'style/no-multiple-empty-lines': ['error', { max: 2, maxBOF: 0, maxEOF: 1 }],
			'style/arrow-parens': ['error', 'as-needed'],
			'style/indent': ['error', 'tab', {
				offsetTernaryExpressions: false,
				SwitchCase: 1,
				VariableDeclarator: 'first',
			}],
			'no-template-curly-in-string': 'off',
			'node/prefer-global/process': 'off',
			'no-console': ['warn'],

			'import/newline-after-import': ['error', { count: 2 }],
			'perfectionist/sort-imports': [
				'error',
				{
					newlinesBetween: 1,
					tsconfig: { rootDir: '.' },
					groups: [
						'type-import',
						['value-builtin', 'value-external'],
						'type-internal',
						'value-internal',
						['type-parent', 'type-sibling', 'type-index'],
						['value-parent', 'value-sibling', 'value-index'],
						'ts-equals-import',
						'unknown',
					],
				},
			],
		},
	},
	typescript: {
		overrides: {
			'ts/consistent-type-imports': [
				'error',
				{
					fixStyle: 'separate-type-imports',
					prefer: 'type-imports',
				},
			],
			'ts/no-explicit-any': 'off',
			'ts/ban-ts-comment': 'off',
			'ts/no-unnecessary-type-constraint': 'off',
			'ts/no-unused-vars': ['error', {
				args: 'all',
				argsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_',
				destructuredArrayIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				enableAutofixRemoval: { imports: true },
			}],
			'ts/no-non-null-asserted-optional-chain': 'off',
		},
	},
	vue: {
		overrides: {
			'vue/html-quotes': ['error', 'single', { avoidEscape: true }],
			'vue/component-name-in-template-casing': ['error', 'PascalCase'],
			'vue/max-attributes-per-line': ['error', {
				singleline: {
					max: 5,
				},
				multiline: {
					max: 1,
				},
			}],
			'vue/html-closing-bracket-newline': ['error', {
				singleline: 'never',
				multiline: 'always',
				selfClosingTag: {
					singleline: 'never',
					multiline: 'always',
				},
			}],
			'vue/multiline-html-element-content-newline': ['error', {
				ignoreWhenEmpty: true,
				allowEmptyLines: false,
			}],
		},
	},
})
