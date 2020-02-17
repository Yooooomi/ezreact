// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ezreact" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.create', function (file) {
		// The code you place here will be executed every time your command is executed
		let content = fs.readFileSync(path.join(__dirname, 'assets', 'index.js')).toString();

		fs.writeFileSync(path.join(file.fsPath, 'index.js'), content.replace(/__NAME__/g, path.basename(file.fsPath)));
		fs.copyFileSync(path.join(__dirname, 'assets', 'index.module.css'), path.join(file.fsPath, 'index.module.css'));
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
