import colors = require('colors');
import inquirer from 'inquirer';

import { Site } from '../models/site.interface';

export const questions = [
	{
		type: 'list',
		name: 'option',
		message: 'What would you like to do?',
		choices: [
			{
				value: 1,
				name: `${colors.green('1.').green} Search city`,
			},
			{
				value: 2,
				name: `${'2.'.green} History`,
			},
			{
				value: 0,
				name: `${'0.'.green} Leave`,
			},
		],
	},
];

export const inquirerMenu = async (): Promise<number> => {
	// Title
	console.log('┌─────── •✧✧• ───────┐'.green);
	console.log('   Select an option');
	console.log('└─────── •✧✧• ───────┘\n'.green);

	const { option } = await inquirer.prompt(questions);

	return option;
};

export const pause = async (): Promise<void> => {
	console.log('');
	const question = [
		{
			type: 'input',
			name: 'message',
			message: `Press ${'ENTER'.green} to continue`,
		},
	];

	await inquirer.prompt(question);
};

export const readInput = async (message: string): Promise<string> => {
	const question = [
		{
			type: 'input',
			name: 'desc',
			message,
			validate(value) {
				if (value.length === 0) throw 'Please enter a value';
				return true;
			},
		},
	];

	const { desc } = await inquirer.prompt(question);
	return desc;
};

export const listSites = async (sites: Site[]): Promise<string> => {
	const choices = sites.map((site, i) => {
		const idx = `${i + 1}.`.green;
		return { value: site.id, name: `${idx} ${site.name}` };
	});

	choices.unshift({ value: '0', name: '0.'.green + ' Cancel' });

	const questions = [
		{
			type: 'list',
			name: 'id',
			message: 'Select site',
			choices,
		},
	];

	const { id } = await inquirer.prompt(questions);

	return id;
};

export const confirmation = async (message: string): Promise<string> => {
	const question = [
		{
			type: 'confirm',
			name: 'ok',
			message,
		},
	];

	const { ok } = await inquirer.prompt(question);

	return ok;
};
