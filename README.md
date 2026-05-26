<p align="center">
  <img alt="Smart Separators" src="https://github.com/idlesilver/smart-separators/raw/master/img/logo_256.png" width="20%"  />
</p>

<h1 align="center">
  Smart Separators
</h1>

**Smart Separators** is a **[Visual Studio Code](https://github.com/Microsoft/vscode)** extension for turning selected lines into formatted comment separators.

## Fork notice

**Smart Separators is a fork of [Comment Divider](https://github.com/stackbreak/comment-divider). It is not the original Comment Divider extension.**

This fork keeps the original idea of language-aware section dividers, but changes the extension identity, command namespace, settings namespace, logo, README, and editing behavior so it is clearly distinguishable on the VS Code Marketplace.

## How this fork differs from Comment Divider

- Multi-cursor and multi-line selections are handled in one command run.
- Rerunning commands on existing dividers toggles or upgrades them instead of stacking more filler text.
- Whitespace-only lines are treated as solid divider insertion targets.
- Settings and commands use the `smart-separators` namespace, so they can live beside the original extension without sharing configuration keys.
- Marketplace identity uses the name **Smart Separators** and the extension ID `idlesilver.smart-separators`.

See **[CHANGELOG](./CHANGELOG.md)** for release details.

**[Supports all common languages](#language-support).**

## Install

https://marketplace.visualstudio.com/items?itemName=idlesilver.smart-separators

## Demo

![Subheader Demo](img/sub-header.gif)

## Smart behavior added by this fork

- Commands run on every line covered by the current selections or cursors.
- Running a header command on a whitespace-only line inserts a solid divider instead.
- Repeating **Make Subheader** on one of its own dividers collapses it back to a plain comment.
- Running **Make Main Header** on a subheader divider upgrades it to the main header style without duplicating fillers.
- Running a header command on a solid divider removes the divider, leaving just the indentation.

---

## Reference documentation copied from Comment Divider

The sections below describe the original command styles, language support, and configuration model inherited from **[Comment Divider](https://github.com/stackbreak/comment-divider)**. They are copied or adapted from the original Comment Divider README, with names and setting keys updated for **Smart Separators**.

## Commands

### Make main header

- Default Shortcut:

  **`Shift`** + **`Alt`** + **`X`**

- Default Style:

  ```
  /* -------------------------------------------------------------------------- */
  /*                                Example text                                */
  /* -------------------------------------------------------------------------- */
  ```

### Make subheader

- Default Shortcut:

  **`Alt`** + **`X`**

- Default Style:

  ```
  /* ------------------------------ Example text ------------------------------ */
  ```

### Insert solid line

- Default Shortcut:

  **`Alt`** + **`Y`**

* Default Style:

  ```
  /* -------------------------------------------------------------------------- */
  ```

## Language Support

Extension uses relevant comment characters for all common languages.

For example, in python files subheader looks like

```python
# ------------------------------ python example ------------------------------ #
```

or in html files

```html
<!-- ---------------------------- html example ----------------------------- -->
```

**Also, you can easily [add support](#languages-configuration) for any missing language or override the default preset.**

## Default Configuration

### Common

```json
  // Set line length for all dividers.
  "smart-separators.length": 80,
```

```json
  // Set whether the divider will be shrink consider indent size, or will be always fixed length.
  "smart-separators.shouldLengthIncludeIndent": false,
```

- **if `shouldLengthIncludeIndent: false`**

  ```js
  /* --------------------------------- indent0 -------------------------------- */

      /* --------------------------------- indent1 -------------------------------- */

          /* --------------------------------- indent2 -------------------------------- */
  ```

- **if `shouldLengthIncludeIndent: true`**

  ```js
  /* --------------------------------- indent0 -------------------------------- */

      /* ------------------------------- indent1 ------------------------------ */

          /* ----------------------------- indent2 ---------------------------- */
  ```


### Main Header

```json
  // "Set symbol for main header line filling (only one).
  "smart-separators.mainHeaderFiller": "-",

  // Set main header vertical style.
  "smart-separators.mainHeaderHeight": "block",

  // Set main header text align.
  "smart-separators.mainHeaderAlign": "center",

  // Set main header text transform style.
  "smart-separators.mainHeaderTransform": "none",
```

### Subheader

```json
  // "Set symbol for subheader line filling (only one).
  "smart-separators.subheaderFiller": "-",

  // Set subheader vertical style.
  "smart-separators.subheaderHeight": "line",

  // Set subheader text align.
  "smart-separators.subheaderAlign": "center",

  // Set subheader text transform style.
  "smart-separators.subheaderTransform": "none",
```

### Solid Line

```json
  // Set symbol for solid line filling.
  "smart-separators.lineFiller": "-",
```

## Languages Configuration

If some language is not supported out of the box, or you want to change default comment characters for an already supported language, it is possible to do it in the settings.

```json
"smart-separators.languagesMap": {
      "toml": ["#", "#"],
      "scss": ["//"]
}
```

The item name is the language mode name and is associated with an array of 1 or 2 elements. The first element is the start of the line. The second, if defined, is the end.

The example above defines the right characters for `toml` and overrides `scss` defaults. As a result, the subheaders for these languages look like this:

```toml
# ------------------------------ toml subheader ------------------------------ #
```

```scss
// ----------------------------- scss subheader --------------------------------
```

## Issues

Request features and report bugs using [GitHub](https://github.com/idlesilver/smart-separators/issues).

---

The command, language support, and configuration documentation above is copied or adapted from **Comment Divider** documentation and updated for the **Smart Separators** fork.
