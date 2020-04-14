// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function getConfig() {
	return vscode.workspace.getConfiguration('ezreact', vscode.ConfigurationTarget.Global);
}

async function firstConfig() {
	const config = getConfig();
	let type = await vscode.window.showInformationMessage('Do you want to use hooks or classes ?', 'Hooks', 'Classes');

	if (type) {
		await config.update('componentType', type === 'Hooks' ? 'hooks' : 'classes', true);
	}
	type = await vscode.window.showInformationMessage('Do you want to use JS (material-ui) or CSS for styling ?', 'JS', 'CSS');

	if (type) {
		await config.update('styleType', type === 'JS' ? 'js' : 'css', true);
	}
}

const styleToFilename = {
	js: 'style.js',
	css: 'index.module.css',
};

async function onCreate(file) {
	let config = getConfig();

	if (!config.componentType || !config.styleType) {
		const resp = await vscode.window.showInformationMessage('You did not configure ezreact, do it now ?', 'Yes', 'No');
		if (resp === 'Yes') {
			await firstConfig();
			config = getConfig();
		} else {
			return;
		}
	}

	const assetsFolder = path.join(__dirname, 'assets');
	const componentType = config.get('componentType');
	const styleType = config.get('styleType');
	const componentName = path.basename(file.fsPath);

	let component = fs.readFileSync(path.join(assetsFolder, 'component', `${componentType}.js`)).toString();
	let style = fs.readFileSync(path.join(assetsFolder, 'style', `${styleType}.js`)).toString();

	let content = style.replace('__COMPONENT__', component).replace(/__NAME__/g, componentName);

	fs.writeFileSync(path.join(file.fsPath, 'index.js'), content);
	fs.copyFileSync(path.join(assetsFolder, 'styleFiles', styleType), path.join(file.fsPath, styleToFilename[styleType]));
}

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
	let disposable = vscode.commands.registerCommand('extension.create', onCreate);

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
