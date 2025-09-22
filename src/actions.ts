import { commands, TextLine, window } from 'vscode';

import { render } from './renders';
import { getConfig } from './config';
import { GAP_SYM } from './constants';
import { Action, ILimiters, IConfig } from './types';

type StripLimitersResult = {
  inner: string;
  hasLimiter: boolean;
  limiters?: ILimiters;
};

type StripLimitersOptions = {
  strict?: boolean;
};

const extractIndent = (text: string): string => text.match(/^\s*/)?.[0] ?? '';
const removeTrailingWhitespace = (value: string): string => value.replace(/[\s\u00A0]+$/, '');

const cStyleLanguages = new Set<string>([
  'c',
  'cpp',
  'csharp',
  'go',
  'groovy',
  'java',
  'javascript',
  'javascriptreact',
  'jsonc',
  'kotlin',
  'less',
  'objective-c',
  'php',
  'sass',
  'scala',
  'stylus',
  'swift',
  'typescript',
  'typescriptreact'
]);

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getAlternativeLimiters = (lang: string, current: ILimiters): ILimiters[] => {
  const alternatives: ILimiters[] = [];

  if (current.right) {
    alternatives.push({ left: current.left, right: '' });
  }

  if (cStyleLanguages.has(lang)) {
    alternatives.push({ left: '//', right: '' }, { left: '/*', right: '*/' });
  }

  return alternatives;
};

const uniqueLimiters = (limitersList: ILimiters[]): ILimiters[] => {
  const seen = new Set<string>();

  return limitersList.filter((limiters) => {
    const key = `${limiters.left}:${limiters.right}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

const stripLimiters = (
  text: string,
  limiters: ILimiters,
  lang: string,
  options: StripLimitersOptions = {}
): StripLimitersResult => {
  const candidates = uniqueLimiters(
    options.strict ? [limiters] : [limiters, ...getAlternativeLimiters(lang, limiters)]
  );
  const trimmed = text.trim();

  for (const candidate of candidates) {
    let inner = trimmed;

    if (candidate.left) {
      if (!inner.startsWith(candidate.left)) {
        continue;
      }

      inner = inner.slice(candidate.left.length);
    }

    inner = inner.trim();

    if (candidate.right) {
      if (!inner.endsWith(candidate.right)) {
        continue;
      }

      inner = inner.slice(0, inner.length - candidate.right.length).trim();
    }

    return { inner, hasLimiter: true, limiters: candidate };
  }

  return { inner: trimmed, hasLimiter: false };
};

const isSolidLine = (text: string, config: IConfig, lang: string): boolean => {
  const trimmed = text.trim();
  if (!trimmed) {
    return false;
  }

  const { inner, hasLimiter } = stripLimiters(trimmed, config.limiters, lang);
  if (!hasLimiter || !inner) {
    return false;
  }

  return inner.split('').every((char) => char === config.sym);
};

const isCommentDividerSubheader = (text: string, config: IConfig, lang: string): boolean => {
  const { inner, hasLimiter } = stripLimiters(text, config.limiters, lang, { strict: true });
  if (!hasLimiter || !inner) {
    return false;
  }

  if (!inner.includes(GAP_SYM)) {
    return false;
  }

  const fillerPattern = new RegExp(`^${escapeRegExp(config.sym)}+.*${escapeRegExp(config.sym)}+$`);
  return fillerPattern.test(inner);
};

const extractSubheaderContent = (inner: string, sym: string): string => {
  const symPattern = new RegExp(`^${escapeRegExp(sym)}+`);
  const trailingPattern = new RegExp(`${escapeRegExp(sym)}+$`);
  return inner.replace(symPattern, '').replace(trailingPattern, '').trim();
};

const replaceLine = async (line: TextLine, newText: string): Promise<void> => {
  const editor = window.activeTextEditor;
  if (!editor) {
    return;
  }

  await editor.edit((editBuilder) => {
    editBuilder.replace(line.range, newText);
  });

  await commands.executeCommand('cursorEnd');
};

const getPlainCommentLimiters = (lang: string, headerLimiters: ILimiters): ILimiters => {
  if (cStyleLanguages.has(lang)) {
    return { left: '//', right: '' };
  }

  return headerLimiters;
};

const buildPlainComment = (
  indent: string,
  text: string,
  lang: string,
  headerLimiters: ILimiters
): string => {
  const limiters = getPlainCommentLimiters(lang, headerLimiters);

  if (!text) {
    return indent + limiters.left;
  }

  if (limiters.right && limiters.right !== limiters.left) {
    return removeTrailingWhitespace(`${indent}${limiters.left} ${text} ${limiters.right}`);
  }

  return `${indent}${limiters.left} ${text}`;
};

const buildRawHeaderText = (indent: string, content: string): string => {
  if (!content) {
    return indent;
  }

  return `${indent}${content}`;
};

export const insertDividerAction: Action = async (type, line, lang) => {
  const isHeader = type === 'mainHeader' || type === 'subheader';
  const lineConfig = getConfig('line', lang);

  if (isHeader && isSolidLine(line.text, lineConfig, lang)) {
    return replaceLine(line, extractIndent(line.text));
  }

  if (isHeader && line.isEmptyOrWhitespace) {
    return replaceLine(line, render('line', line.text, lang));
  }

  let rawText = line.text;

  if (isHeader) {
    const headerConfig = getConfig(type, lang);

    if (type === 'subheader' && isCommentDividerSubheader(rawText, headerConfig, lang)) {
      const stripped = stripLimiters(rawText, headerConfig.limiters, lang, { strict: true });
      const indent = extractIndent(rawText);
      const content = extractSubheaderContent(stripped.inner, headerConfig.sym);
      return replaceLine(line, buildPlainComment(indent, content, lang, headerConfig.limiters));
    }

    if (type === 'mainHeader') {
      const subConfig = getConfig('subheader', lang);

      if (isCommentDividerSubheader(rawText, subConfig, lang)) {
        const stripped = stripLimiters(rawText, subConfig.limiters, lang, { strict: true });
        const indent = extractIndent(rawText);
        const content = extractSubheaderContent(stripped.inner, subConfig.sym);
        rawText = buildRawHeaderText(indent, content);
      }
    }

    const { inner, hasLimiter } = stripLimiters(rawText, headerConfig.limiters, lang);

    if (hasLimiter) {
      if (!inner) {
        return replaceLine(line, render('line', extractIndent(rawText), lang));
      }

      rawText = `${extractIndent(rawText)}${inner}`;
    }
  }

  return replaceLine(line, render(type, rawText, lang));
};
