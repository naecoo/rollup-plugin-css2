import { Plugin } from 'rollup';
import { FilterPattern } from '@rollup/pluginutils';

declare type outputFunction = (
	css: string,
	styles: Map<string, string>
) => void;

declare interface CSSPluginOptins {
	/** The filename of CSS output. */
	output?: string | outputFunction;

	/** Which files need to be processed. */
	include?: FilterPattern;

	/** Which files do not need to be processed. */
	exclude?: FilterPattern;

	/** `@parcel/css` transform options, detail in https://github.com/parcel-bundler/parcel-css/blob/master/node/index.d.ts. */
	transformOptions?: {
		/** Whether to enable minification. */
		minify?: boolean;

		/** The browser targets for the generated code. */
		targets?: {
			android?: number;
			chrome?: number;
			edge?: number;
			firefox?: number;
			ie?: number;
			ios_saf?: number;
			opera?: number;
			safari?: number;
			samsung?: number;
		};

		/** Whether to enable various draft syntax. */
		drafts?: {
			nesting: boolean;
		};
	};
}

export default function (options: CSSPluginOptins): Plugin;
