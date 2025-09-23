# Change Log

All notable changes to the "Comment Driver" & "Comment Divider" extension will be documented in this file.

## [0.5.0] - 2025-09-23

### Enhancement

- Multi-selection support for divider commands so every selected line is updated in one pass.
- Smart handling for existing dividers: re-running subheader commands collapses to plain comments, main headers upgrade subheaders, and header commands clear solid divider lines.
- Automatic solid divider insertion when header commands run on empty or whitespace-only lines.

comment style transition matrix
| curser line type  |  alt+x | alt+shift+x  |
|---|---|---|
| empty  |  solid line |  solid line |
| solid line  |  empty |  empty |
| code  |  sub-header |  main-header |
| plain comment  | sub-header  |  main-header |
| sub-header  |  plain comment |  main-header |
| main-header  | above rules for each line  | above rules for each line  |

in short:
- empty <--> solid line
- code --> comment header
- comment --alt+x--> sub-header
- comment --alt+shift+x--> main-header

## [0.4.0] - 2020-05-18

### Enhancement

- Added consideration of indents. Thanks to [PR](https://github.com/stackbreak/comment-divider/pull/20) by [poenitet](https://github.com/poenitet)

## [0.3.0] - 2020-12-07

- Added the ability to customize comment characters for any language. PR by [mrvkino](https://github.com/mrvkino/)

## [0.2.2] - 2020-07-19

### Enhancement

- Include [alryaz](https://github.com/alryaz) patch for support `*.home-assistant` files.

## [0.2.1] - 2019-07-31

### Fixed

- Fix typo in `README.md`
- Fix vulnerabilities in dependencies

### Enhancement

- Include [infeeeee](https://github.com/infeeeee) patch for support `*.ini` files

## [0.2.0] - 2019-04-07

### Fixed

- Restrict filler length.
- Refactor some logic.
- Remove unused `node_modules`.

### Features

- New settings for both header types.
- Text transform options.
- Text align options.

## [0.1.1] - 2018-12-17

### Fixed

- Update `README`.

## [0.1.0] - 2018-12-16

### Initial release

- Support all standard languages.
- Added Commands:
  - `Make Main Header`
  - `Make Subheader`
  - `Insert Solid Line`
- Added settings section.
- Added hotkeys for commands.
