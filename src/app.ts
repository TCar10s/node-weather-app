import dotenv from 'dotenv';

import { inquirerMenu, listSites, pause, readInput } from './helpers/inquirer';
import { Searches } from './models/search';

dotenv.config();

const main = async () => {
	const searches = new Searches();
	let opt: number;

	do {
		opt = await inquirerMenu();

		switch (opt) {
			case 1:
				// Show message
				const searchTerm = await readInput('City: ');

				// Search sites
				const sites = await searches.city(searchTerm);

				// Select site
				const id = await listSites(sites);
				if (id === '0') continue;

				// Save in DB
				const selectedSite = sites.find(site => site.id === id);
				searches.addHistory(selectedSite.name);

				// Weather
				const weather = await searches.weatherSite(
					selectedSite.lat,
					selectedSite.lng
				);

				// Show results
				console.clear();
				console.log('\nCity information\n'.green);
				console.log('City:', selectedSite.name.green);
				console.log('Lat:', selectedSite.lat);
				console.log('Lng:', selectedSite.lng);
				console.log('Temperature:', weather.main.temp);
				console.log('Min:', weather.main.temp_min);
				console.log('Max:', weather.main.temp_max);
				console.log('Description:', weather.weather[0].description.green);
				break;
			case 2:
				searches.capitalizedHistory.forEach((name, i) => {
					const idx = `${i + 1}.`.green;
					console.log(idx, name);
				});
				break;

			default:
				break;
		}

		if (opt !== 0) await pause();
	} while (opt !== 0);
};

main();
