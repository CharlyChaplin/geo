import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from '../images/icon-location.svg';
import { validateIPaddress } from './helpers';


const input = document.querySelector(".search-bar__input");
const btn = document.querySelector(".search-bar__btn");
const API = "at_B53PpBJHLxY5znQUhtxGeLnLn23Dg";
const maxboxAPI = "pk.eyJ1IjoiY2hhcmx5Y2hhcGxpbiIsImEiOiJjbGRtbjN1YmswMmttM29zNHFwcndrMTltIn0.YdrnrfESYlzYByVpUjUqFw";
const ipAddress = document.getElementById("ip");
const local = document.getElementById("location");
const zone = document.getElementById("timezone");
const provider = document.getElementById("isp");
const mapArea = document.querySelector(".map");
const map = L.map(mapArea, {
	center: [51.505, -0.09],
	zoom: 13,
	zoomControl: false
});

const geoIcon = L.icon({
	iconUrl: icon,
	iconSize: [30, 40],
});
const initGeo = { lat: 51.505, lng: -0.09 }
showMap(initGeo);

input.addEventListener("keypress", handleKeypress);
btn.addEventListener("click", getIP);

function handleKeypress(e) {
	if (e.key === "Enter") getIP();
}

async function getIP() {
	if (validateIPaddress(input.value)) {
		const resp = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${API}&ipAddress=${input.value}`);
		if (resp.ok) {
			const responce = await resp.json();
			updateFields(responce);
		}
	}
}

function updateFields({ ip, location, isp }) {
	ipAddress.textContent = ip;
	local.innerText = `${location.country}, ${location.region}`;
	zone.textContent = location.timezone;
	provider.textContent = isp;
	showMap(location);
}

function showMap({ lat, lng }) {
	map.setView([lat, lng], 13);
	L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${maxboxAPI}`, {
		attribution: 'Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">Frontend Mentor</a>. Coded by <a href="#">Crash</a>.',
		maxZoom: 18,
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1,
	}).addTo(map);

	L.marker([lat, lng], { icon: geoIcon }).addTo(map);
}