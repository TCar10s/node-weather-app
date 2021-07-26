import axios from 'axios';
import fs from 'fs';

import { City } from './city.interface';
import { Site } from './site.interface';
import { WeatherSite } from './weather.interface';

export class Searches {
	history: string[] = [];
	dbPath = './db/database.json';

	constructor() {
		// TODO: Read DB
		this.readDb();
	}

	get paramsMapbox(): unknown {
		return {
			access_token: process.env.MAPBOX_KEY,
			limit: 5,
		};
	}

	get paramsWeather(): unknown {
		return {
			appid: process.env.OPEN_WEATHER,
			units: 'metric',
		};
	}

	get capitalizedHistory(): string[] {
		return this.history.map(site => {
			let words = site.split(' ');
			words = words.map(w => w[0].toUpperCase() + w.substring(1));

			return words.join(' ');
		});
	}

	async city(city: string): Promise<Site[]> {
		try {
			// Http request
			const instance = axios.create({
				baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json`,
				params: this.paramsMapbox,
			});

			const data: City = await (await instance.get('')).data;

			return data.features.map(feature => ({
				id: feature.id,
				name: feature.place_name,
				lng: feature.center[0],
				lat: feature.center[1],
			}));
		} catch (error) {
			return [];
		}
	}

	async weatherSite(lat: number, lon: number): Promise<WeatherSite> {
		try {
			const instance = axios.create({
				baseURL: 'https://api.openweathermap.org/data/2.5/weather?',
				// eslint-disable-next-line @typescript-eslint/ban-types
				params: { ...(this.paramsWeather as {}), lat, lon },
			});

			const { data } = await instance.get('');

			return data;
		} catch (error) {
			throw new Error(error);
		}
	}

	addHistory(siteName: string): void {
		if (this.history.includes(siteName.toLowerCase())) return;

		this.history = this.history.splice(0, 4);

		this.history.unshift(siteName.toLowerCase());

		// Save in DB
		this.saveInDb();
	}

	saveInDb(): void {
		const payload = {
			history: this.history,
		};

		fs.writeFileSync(this.dbPath, JSON.stringify(payload));
	}

	readDb(): void {
		if (!fs.readFileSync(this.dbPath)) return;

		const info = fs.readFileSync(this.dbPath, { encoding: 'utf8' });
		this.history = JSON.parse(info).history;
	}
}
