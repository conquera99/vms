import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { createEditor, Descendant, Transforms, Editor, Element as SlateElement } from 'slate';
import {
	Slate,
	Editable,
	withReact,
	useSlate,
	RenderLeafProps,
	RenderElementProps,
} from 'slate-react';
import { withHistory } from 'slate-history';
import isHotkey from 'is-hotkey';

const HOTKEYS: Record<string, string> = {
	'mod+b': 'bold',
	'mod+i': 'italic',
	'mod+u': 'underline',
	'mod+`': 'code',
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const isMarkActive = (editor: Editor, format: string) => {
	const marks = Editor.marks(editor) as Record<string, boolean>;
	return marks ? marks[format] === true : false;
};

const isBlockActive = (editor: Editor, format: string) => {
	const { selection } = editor;
	if (!selection) return false;

	const [match] = Array.from(
		Editor.nodes(editor, {
			at: Editor.unhangRange(editor, selection),
			match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
		}),
	);

	return !!match;
};

const toggleMark = (editor: Editor, format: string) => {
	const isActive = isMarkActive(editor, format);

	if (isActive) {
		Editor.removeMark(editor, format);
	} else {
		Editor.addMark(editor, format, true);
	}
};

const toggleBlock = (editor: Editor, format: string) => {
	const isActive = isBlockActive(editor, format);
	const isList = LIST_TYPES.includes(format);

	Transforms.unwrapNodes(editor, {
		match: (n) =>
			!Editor.isEditor(n) && SlateElement.isElement(n) && LIST_TYPES.includes(n.type),
		split: true,
	});
	const newProperties: Partial<SlateElement> = {
		type: isActive ? 'paragraph' : isList ? 'list-item' : format,
	};
	Transforms.setNodes<SlateElement>(editor, newProperties);

	if (!isActive && isList) {
		const block = { type: format, children: [] };
		Transforms.wrapNodes(editor, block);
	}
};

const MarkButton = ({ format, icon }: { format: string; icon: string }) => {
	const editor = useSlate();
	return (
		<span
			className={`${
				isMarkActive(editor, format) ? 'text-black' : 'text-gray-400'
			} mr-1 cursor-pointer inline-block`}
			onMouseDown={(event) => {
				event.preventDefault();
				toggleMark(editor, format);
			}}
		>
			<span className={`material-icons ${icon}`}>{icon}</span>
		</span>
	);
};

const BlockButton = ({ format, icon }: { format: string; icon: string }) => {
	const editor = useSlate();
	return (
		<span
			className={`${
				isBlockActive(editor, format) ? 'text-black' : 'text-gray-400'
			} mr-1 cursor-pointer inline-block`}
			onMouseDown={(event) => {
				event.preventDefault();
				toggleBlock(editor, format);
			}}
		>
			<span className={`material-icons ${icon}`}>{icon}</span>
		</span>
	);
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
	if (leaf.bold) {
		children = <strong>{children}</strong>;
	}

	if (leaf.code) {
		children = <code>{children}</code>;
	}

	if (leaf.italic) {
		children = <em>{children}</em>;
	}

	if (leaf.underline) {
		children = <u>{children}</u>;
	}

	return <span {...attributes}>{children}</span>;
};

const Element = ({ attributes, children, element }: RenderElementProps) => {
	switch (element.type) {
		case 'block-quote':
			return <blockquote {...attributes}>{children}</blockquote>;
		case 'bulleted-list':
			return (
				<ul className="list-disc list-inside" {...attributes}>
					{children}
				</ul>
			);
		case 'heading-one':
			return (
				<h1 className="text-xl" {...attributes}>
					{children}
				</h1>
			);
		case 'heading-two':
			return (
				<h2 className="text-lg" {...attributes}>
					{children}
				</h2>
			);
		case 'list-item':
			return <li {...attributes}>{children}</li>;
		case 'numbered-list':
			return (
				<ol className="list-decimal list-inside" {...attributes}>
					{children}
				</ol>
			);
		default:
			return <p {...attributes}>{children}</p>;
	}
};

const TextEditor: FC<{ value: Descendant[]; onChange: (value: Descendant[]) => void }> = ({
	value,
	onChange,
}) => {
	const editor = useMemo(() => withHistory(withReact(createEditor())), []);
	const renderElement = useCallback((props) => <Element {...props} />, []);
	const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

	useEffect(() => {
		const editorEl = document.querySelector<HTMLDivElement>('[data-slate-editor="true"]');

		if (editorEl) {
			editorEl.style.minHeight = '200px';
		}
	}, []);

	useEffect(() => {
		// console.log('change', value);
		editor.children = value;
	}, [editor, value]);

	return (
		<div className="px-4 border border-gray-600 rounded-md">
			<Slate editor={editor} value={value} onChange={onChange}>
				<div className="relative pt-3 py-2 border-b">
					<MarkButton format="bold" icon="format_bold" />
					<MarkButton format="italic" icon="format_italic" />
					<MarkButton format="underline" icon="format_underlined" />
					<MarkButton format="code" icon="code" />
					<BlockButton format="heading-one" icon="looks_one" />
					<BlockButton format="heading-two" icon="looks_two" />
					<BlockButton format="block-quote" icon="format_quote" />
					<BlockButton format="numbered-list" icon="format_list_numbered" />
					<BlockButton format="bulleted-list" icon="format_list_bulleted" />
				</div>
				<Editable
					className="py-3"
					renderElement={renderElement}
					renderLeaf={renderLeaf}
					placeholder="Tulis disini"
					onKeyDown={(event) => {
						for (const hotkey in HOTKEYS) {
							if (isHotkey(hotkey, event as any)) {
								event.preventDefault();
								const mark = HOTKEYS[hotkey];
								toggleMark(editor, mark);
							}
						}
					}}
				/>
			</Slate>
		</div>
	);
};

export default TextEditor;
