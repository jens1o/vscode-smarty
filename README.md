# Smarty syntax highlighting

This extensions adds support for syntax highlighting and snippets for the Smarty 3 templating language.

If you see a bug or have a feature request of what could be added feel free to let me know or create an issue.

## Snippets available:

- assign
- block
- break
- capture
- case
- comment
- debug
- else
- elseif
- extends
- foreach
- if
- ifelse
- include
- literal

## HTML Intellisense and Suggestions
This is planned as an 'out of the box' feature, but it may take some time to achieve.

As a workaround use these settings in VS Code:
```
"emmet.syntaxProfiles": {
  "tpl": "html"
},
"emmet.triggerExpansionOnTab": true,
```
