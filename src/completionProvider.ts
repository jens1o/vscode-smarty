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

        let wordRange = document.getWordRangeAtPosition(position, /{(\s+)}/i);
        const currentText = document.getText(wordRange);
        console.log(currentText, triggerCharacter);

        // if there is no left delimiter, handle as HTML
        if (currentText.substring(0, 1) !== this.delimiter.left) {
            console.log('No smarty-tag detected!');
            // pass the response to the Emmet provider
            // TODO: This causes an infinite loop, because vscode is the request passing back to us!
            return vscode.commands.executeCommand('vscode.executeCompletionItemProvider', document.uri, position, context.triggerCharacter);
        }

        if (triggerCharacter === void 0) {
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
        if (this.builtInModifiersCache.length) {
            return this.builtInModifiersCache;
        }

        const results: vscode.ProviderResult<vscode.CompletionItem[]> = [];

        // TODO: Add schema to settings to ensure validation.
        for (const modifier of (vscode.workspace.getConfiguration('smarty').get('modifiers') as BuiltinModifier[])) {
            let completionItem = new vscode.CompletionItem(modifier.name);
            completionItem.documentation = new vscode.MarkdownString(modifier.description);

            results.push(completionItem);
        }

        return this.builtInModifiersCache = results;
    }

    builtInModifiersCache: vscode.CompletionItem[] = [];
}