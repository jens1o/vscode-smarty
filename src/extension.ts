import * as vscode from 'vscode';
import CompletionProvider from './completionProvider';

let completionProvider: vscode.Disposable;

function getTriggerCharacters(): string[] {
    const delimiter = vscode.workspace.getConfiguration('smarty.delimiter');

    return [delimiter.left, '|'];
}

function registerCompletionProvider(): void {
    completionProvider = vscode.languages.registerCompletionItemProvider(
        [
            { language: 'smarty', scheme: 'file' },
            { language: 'smarty', scheme: 'untitled' },
        ],
        new CompletionProvider(),
        ...getTriggerCharacters()
    );

}

export function activate(context: vscode.ExtensionContext) {
    console.log('The Smarty extension is active!');

    vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('smarty') && completionProvider !== null) {
            completionProvider.dispose();
            completionProvider = null;
            registerCompletionProvider();
        }
    })
    registerCompletionProvider();

    context.subscriptions.push(completionProvider);
}
