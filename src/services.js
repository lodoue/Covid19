import axios from 'axios';

export function getCovid19DataService(){
	return axios
	.get(`https://pomber.github.io/covid19/timeseries.json`)
	.then(res => res.data)
}