import * as vscode from 'vscode';

interface BuiltinModifier {
    name: string,
    description: string
}

export default class CompletionProvider implements vscode.CompletionItemProvider {

    private delimiter: {
        left: string,
        right: string
    };

    constructor() {
        this.initConfig();
    }

    private initConfig(): void {
        let config = vscode.workspace.getConfiguration('smarty.delimiter');

        this.delimiter = {
            left: config.get('left'),
            right: config.get('right')
        };
    }

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[]> {
        const triggerCharacter = context.triggerCharacter;

        if (triggerCharacter === null) {
            // TODO: Try to find matching selector and then delegate as usual.
            return [];
        } else if (triggerCharacter === '|') {
            // suggest modifiers
            return this.provideModifierCompletionItems(context);
        } else if (triggerCharacter === this.delimiter.left) {
            // TODO: Suggest blocks and variables
            return [];
        } else {
            console.error('Unknown Smarty CompletionProvider situation to handle something. Trigger Character:', triggerCharacter);
            return [];
        }
    }

    protected provideModifierCompletionItems(context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[]> {
        const result: vscode.ProviderResult<vscode.CompletionItem[]> = [];

        for (const modifier of CompletionProvider.builtInModifiers) {
            let completionItem = new vscode.CompletionItem(modifier.name);
            completionItem.documentation = new vscode.MarkdownString(modifier.description);

            result.push(completionItem);
        }

        return result;
    }

    // TODO: Move this to the settings and provide parameter completion.
    // TODO: Add "Note" styling.
    static builtInModifiers: BuiltinModifier[] = [{
        name: 'capitalize',
        description: 'This is used to capitalize the first letter of all words in a variable. This is similar to the PHP `ucwords()` function.'
    },
    {
        name: 'cat',
        description: 'This value is concatenated to the given variable.'
    },
    {
        name: 'count_characters',
        description: 'This is used to count the number of characters in a variable.'
    },
    {
        name: 'count_paragraphs',
        description: 'This is used to count the number of paragraphs in a variable.'
    },
    {
        name: 'count_sentences',
        description: 'This is used to count the number of sentences in a variable. A sentence being delimited by a dot, question- or exclamation-mark (.?!).'
    },
    {
        name: 'count_words',
        description: 'This is used to count the number of words in a variable.'
    },
    {
        name: 'date_format',
        description: 'This formats a date and time into the given `strftime()` format. Dates can be passed to Smarty as unix timestamps, DateTime objects, mysql timestamps or any string made up of month day year, parsable by php\'s `strtotime()`.\nDesigners can then use `date_format` to have complete control of the formatting of the date. If the date passed to `date_format` is empty and a second parameter is passed, that will be used as the date to format.'
    },
    {
        name: 'default',
        description: 'This is used to set a default value for a variable. If the variable is unset or an empty string, the given default value is printed instead. Default takes the one argument.'
    },
    {
        name: 'escape',
        description: '`escape` is used to encode or escape a variable to `html`, `url`, `single quotes`, `hex`, `hexentity`, `javascript` and `mail`. By default its `html`.'
    },
    {
        name: 'from_charset',
        description: '`from_charset` is used to transcode a string from a given charset to the internal charset. This is the exact opposite of the `to_charset` modifier.'
    },
    {
        name: 'indent',
        description: 'This indents a string on each line, default is 4. As an optional parameter, you can specify the number of characters to indent. As an optional second parameter, you can specify the character to use to indent with eg use "\\t" for a tab.'
    },
    {
        name: 'lower',
        description: 'This is used to lowercase a variable. This is equivalent to the PHP `strtolower()` function.'
    },
    {
        name: 'nl2br',
        description: 'All `"\\n"` line breaks will be converted to html `<br />` tags in the given variable. This is equivalent to the PHP\'s `nl2br()` function.'
    },
    {
        name: 'regex_replace',
        description: 'A regular expression search and replace on a variable. Use the `preg_replace()` syntax from the PHP manual.'
    },
    {
        name: 'replace',
        description: 'A simple search and replace on a variable. This is equivalent to the PHP\'s `str_replace()` function.'
    },
    {
        name: 'spacify',
        description: '`spacify` is a way to insert a space between every character of a variable. You can optionally pass a different character or string to insert.'
    },
    {
        name: 'string_format',
        description: 'This is a way to format strings, such as decimal numbers and such. Use the syntax for `sprintf()` for the formatting.'
    },
    {
        name: 'strip',
        description: 'This replaces all spaces, newlines and tabs with a single space, or with the supplied string.'
    },
    {
        name: 'strip_tags',
        description: 'This strips out markup tags, basically anything between `<` and `>`.'
    },
    {
        name: 'to_charset',
        description: '`to_charset` is used to transcode a string from the internal charset to a given charset. This is the exact opposite of the `from_charset` modifier.'
    },
    {
        name: 'truncate',
        description: 'This truncates a variable to a character length, the default is 80. As an optional second parameter, you can specify a string of text to display at the end if the variable was truncated. The characters in the string are included with the original truncation length. By default, `truncate` will attempt to cut off at a word boundary. If you want to cut off at the exact character length, pass the optional third parameter of `TRUE`.'
    },
    {
        name: 'unescape',
        description: '`unescape` is used to decode `entity`, `html` and `htmlall`. It counters the effects of the `escape` modifier for the given types.'
    },
    {
        name: 'upper',
        description: 'This is used to uppercase a variable. This is equivalent to the PHP `strtoupper()` function. '
    },
    {
        name: 'wordwrap',
        description: 'Wraps a string to a column width, the default is 80. As an optional second parameter, you can specify a string of text to wrap the text to the next line, the default is a carriage return `"\\n"`. By default, `wordwrap` will attempt to wrap at a word boundary. If you want to cut off at the exact character length, pass the optional third parameter as `TRUE`. This is equivalent to the PHP `wordwrap()` function.'
    },
    ];
}