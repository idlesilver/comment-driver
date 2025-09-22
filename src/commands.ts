import { Selection, TextEditor, window } from 'vscode';

import { handleError } from './errors';
import { insertDividerAction } from './actions';
import { PresetId } from './types';

const getLineNumbersFromSelection = (selection: Selection): number[] => {
  if (selection.isEmpty) {
    return [selection.active.line];
  }

  let startLine = selection.start.line;
  let endLine = selection.end.line;

  if (selection.end.character === 0 && selection.end.line > selection.start.line) {
    endLine -= 1;
  }

  const lines: number[] = [];

  for (let line = startLine; line <= endLine; line += 1) {
    lines.push(line);
  }

  return lines.length ? lines : [selection.active.line];
};

const getTargetLineNumbers = (editor: TextEditor): number[] => {
  const lineNumbers = new Set<number>();

  for (const selection of editor.selections) {
    getLineNumbersFromSelection(selection).forEach((line) => lineNumbers.add(line));
  }

  return Array.from(lineNumbers).sort((a, b) => b - a);
};

const generateCommand = (type: PresetId) => async () => {
  try {
    const editor = window.activeTextEditor;
    if (!editor) return;

    const document = editor.document;
    const lang = document.languageId;
    const lineNumbers = getTargetLineNumbers(editor);

    for (const lineNumber of lineNumbers) {
      const line = document.lineAt(lineNumber);
      await insertDividerAction(type, line, lang);
    }
  } catch (e) {
    handleError(e);
  }
};

export const mainHeaderCommand = generateCommand('mainHeader');
export const subHeaderCommand = generateCommand('subheader');
export const solidLineCommand = generateCommand('line');
