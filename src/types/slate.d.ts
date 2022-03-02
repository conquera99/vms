import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type ParagraphElement = {
	type:
		| 'paragraph'
		| 'block-quote'
		| 'bulleted-list'
		| 'heading-one'
		| 'heading-two'
		| 'numbered-list'
		| 'list-item';
	children: CustomText[];
};

export type HeadingElement = {
	type: string;
	level?: number;
	children: CustomText[];
};

export type CustomElement = ParagraphElement | HeadingElement;

export type FormattedText = {
	text: string;
	bold?: true;
	code?: true;
	italic?: true;
	underline?: true;
};

export type CustomText = FormattedText;

declare module 'slate' {
	interface CustomTypes {
		Editor: CustomEditor;
		Element: CustomElement;
		Text: CustomText;
	}
}
