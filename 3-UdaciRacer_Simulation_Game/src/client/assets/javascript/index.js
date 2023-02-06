// PROVIDED CODE BELOW (LINES 1 - 80) DO NOT REMOVE

// The store will hold all information needed globally
const store = {
	track_id: undefined,
	player_id: undefined,
	race_id: undefined,
};

const trackNames = {
	"Track 1": "Atlanta Motor Speedway",
	"Track 2": "Indianapolis Motor Speedway",
	"Track 3": "Bristol Motor Speedway",
	"Track 4": "Charlotte Motor Speedway",
	"Track 5": "Circuit of the Americas",
	"Track 6": "Darlington Raceway",
};

const racerNames = {
	"Racer 1": "No. 1 Monster Energy Chevrolet",
	"Racer 2": "No. 2 Discount Tire Ford",
	"Racer 3": "No. 3 Bass Pro Shops/Tracker Off Road Chevrolet",
	"Racer 4": "No. 4 Hunt Brothers Pizza Ford",
}

// helper function
// get all parents' elements
function getParentTag(startTag, parentTagList = []) {
	// check if the startTag is DOM object
	if(!(startTag instanceof HTMLElement)) return console.error('receive only HTMLElement');
	if(startTag === "NULL") return;
	// if the parent element is body, stop recursion
	// otherwise, continue
	if (startTag.parentElement.nodeName !== 'BODY') {
		// store the parent element
		parentTagList.push(startTag.parentElement)
		// move up a layer
		return getParentTag(startTag.parentElement, parentTagList)
	}
	// return parents List
	else return parentTagList;
}

// We need our javascript to wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
	onPageLoad();
	setupClickHandlers();
});

// get info of tracks and racers and render them on the page
function onPageLoad() {
	try {
		getTracks().then((tracks) => {
			const html = renderTrackCards(tracks);
			renderAt("#tracks", html);
		});

		getRacers().then((racers) => {
			const html = renderRacerCars(racers);
			renderAt("#racers", html);
		});
	} catch (error) {
		console.log("Problem getting tracks and racers ::", error.message);
		console.error(error);
	}
}

// click specific places on page will trigger different handlers
function setupClickHandlers() {
	document.addEventListener(
		"click",
		function (event) {
			const { target } = event;
			const parentElements = getParentTag(target);
			// add target element at the beginning of the array
			parentElements.unshift(target);

			parentElements.forEach(e => {
				// ensure add 'selected' class to li element
				if(e.nodeName === "LI" && e.matches(".card.track")){
					handleSelectTrack(e);
				}

				// ensure add 'selected' class to li element
				if(e.nodeName === "LI" && e.matches(".card.podracer")){
					handleSelectPodRacer(e);
				}

				if(e.nodeName === "BUTTON" && e.matches("#submit-create-race")){
					// prevent browser from jumping to other webpages
					event.preventDefault();

					// start race
					handleCreateRace();
				}

				// Handle acceleration click
				if (e.nodeName === "BUTTON" && e.matches("#gas-peddle")) {
					handleAccelerate();
				}

			})
		},
		false
	);
}

async function delay(ms) {
	try {
		return await new Promise((resolve) => setTimeout(resolve, ms));
	} catch (error) {
		console.log("an error shouldn't be possible here");
		console.log(error);
	}
}
// ^ PROVIDED CODE ^ DO NOT REMOVE

// This async function controls the flow of the race, add the logic and error handling
async function handleCreateRace() {

	// TODO - Get player_id and track_id from the store
	const playerID = store.player_id;
	const trackID = store.track_id;

	if(playerID === undefined || trackID === undefined){
		alert('Please select a track and a racer before starting a game!');
		return;
	}

	try {
		// const race = TODO - invoke the API call to create the race, then save the result
		const race = await createRace(playerID, trackID);
		console.log("race: ", race);
		// TODO - update the store with the race id
		// For the API to work properly, the race id should be race id - 1
		store.race_id = parseInt(race.ID) - 1;

		// render starting UI
		renderAt("#race", renderRaceStartView(race.Track));

		// The race has been created, now start the countdown
		// TODO - call the async function runCountdown
		await runCountdown();

		// TODO - call the async function startRace
		await startRace(store.race_id);

		// TODO - call the async function runRace
		const raceFinalResult = await runRace(store.race_id);
		console.log('Final Result: ', raceFinalResult);
	} catch (error) {
		console.log("Problem with handleCreateRace request::", error);
	}


}

function runRace(raceID) {
	return new Promise(async (resolve) => {
		// TODO - use Javascript's built in setInterval method to get race info every 500ms
		/*
				TODO - if the race info status property is "in-progress", update the leaderboard by calling:

				renderAt('#leaderBoard', raceProgress(res.positions))
				*/
		/*
		TODO - if the race info status property is "finished", run the following:

		clearInterval(raceInterval) // to stop the interval from repeating
		renderAt('#race', resultsView(res.positions)) // to render the results view
		resolve(res) // resolve the promise
		*/

		const interval = setInterval(async ()  => {
			const race = await getRace(raceID);
			// if the race info status property is "in-progress", update the leaderboard
			if(race.status === "in-progress"){
				renderAt('#leaderBoard', raceProgress(race.positions));
			}

			// if the race info status property is "finished",
			if(race.status === "finished"){
				// to stop the interval from repeating
				clearInterval(interval);
				// to render the results view
				renderAt('#race', resultsView(race.positions))
				// resolve the promise
				resolve(race);
			}
		}, 500)

	}).catch(error =>{
		// remember to add error handling for the Promise
		console.log("Problem with runRace request::", error);
	})
}

// start game after 3 seconds
async function runCountdown() {
	try {
		// wait for the DOM to load
		await delay(1000);
		let timer = 3;

		return new Promise((resolve) => {
			// TODO - use Javascript's built in setInterval method to count down once per second
			const interval = setInterval(()=>{
				if(timer !== 0){
					// run this DOM manipulation to decrement the countdown for the user
					document.getElementById("big-numbers").innerHTML = --timer;
				} else{
					// TODO - if the countdown is done, clear the interval, resolve the promise, and return
					clearInterval(interval);
					resolve();
				}
			}, 1000)
		});
	} catch (error) {
		console.log(error);
	}
}

function handleSelectPodRacer(target) {
	console.log("selected a pod: ", target.id);

	// remove class selected from all racer options
	const selected = document.querySelector("#racers .selected");
	// get the element whose classList contains 'selected'
	if (selected) {
		selected.classList.remove("selected");
	}

	// add class selected to current target
	target.classList.add("selected");

	// TODO - save the selected racer to the store
	store.player_id = parseInt(target.id.slice(-1));
}

function handleSelectTrack(target) {
	console.log("selected a track: ", target.id);

	// remove class selected from all track options
	const selected = document.querySelector("#tracks .selected");
	// get the element whose classList contains 'selected'
	if (selected) {
		selected.classList.remove("selected");
	}

	// add class selected to current target
	target.classList.add("selected");

	// TODO - save the selected track id to the store
	store.track_id = parseInt(target.id.slice(-1));
}

async function handleAccelerate() {
	console.log("accelerate button clicked");
	// TODO - Invoke the API call to accelerate

	await accelerate(store.race_id);
}

// HTML VIEWS ------------------------------------------------
// Provided code - do not remove

// multiple racers
function renderRacerCars(racers) {
	if (!racers.length) {
		return `<h4>Loading Racers...</4>`;
	}

	const results = racers.map(renderRacerCard).join("");

	return `${results}`;
}

function renderRacerCard(racer) {
	const { id, driver_name, top_speed, acceleration, handling } = racer;
	const elementID = `racer${id}`;

	return `
		<li id="${elementID}" class="cell small-6 medium-4 large-2 card podracer">
			<div class="card-divider">
				<h3>${driver_name}</h3>
			</div>
			<img src="assets/images/${elementID}.jpeg">
			<div class="card-section">
				<p>Top Speed: ${top_speed}</p>
				<p>Acceleration: ${acceleration}</p>
				<p>Handling: ${handling}</p>
			</div>
		</li>
	`;
}

// multiple tracks
function renderTrackCards(tracks) {
	// if request is successful,
	// the array tracks is not empty
	if (!tracks.length) {
		return `<h4>Loading Tracks...</4>`;
	}

	const results = tracks.map(renderTrackCard).join("");

	return `${results}`;
}

// a single track
function renderTrackCard(track) {
	const { id, name } = track;
	const elementID = `track${id}`;

	return `
		<li id="${elementID}" class="cell small-6 medium-4 large-2 card track">
			<img style="height:90px" src="assets/images/${elementID}.jpeg">
			<div class="card-section">
				<h4>${trackNames[`${name}`]}</h4>
			</div>
		</li>
	`;
}

function renderCountdown(count) {
	return `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`;
}


// when the race starts, whole webpage reconstruct
function renderRaceStartView(track, racers) {
	return `
		<header class="grid-x grid-padding-x">
			<h1 class="cell text-center">Race: ${track.name}</h1>
		</header>
		<main id="two-columns" class="grid-x grid-padding-x align-spaced">
			<section id="leaderBoard" class="cell small-12 medium-6 large-6 text-center">
				${renderCountdown(3)}
			</section>

			<section id="accelerate" class="cell small-12 medium-6 large-6">
				<h2>Acceleration</h2>
				<p>Click the button as fast as you can to make your racer go faster!</p>
				<button id="gas-peddle">Click Me To Win!</button>
			</section>
		</main>
		<footer class="grid-x grid-padding-x grid-padding-y">
			<div class="cell text-center">&copy; 2022 Copyright Yu Li</div>
		</footer>
	`;
}

// render result page
function resultsView(positions) {
	positions.sort((a, b) => (a.final_position > b.final_position ? 1 : -1));

	return `
		<header class="grid-x grid-padding-x">
			<h1 class="cell text-center">Race Results</h1>
		</header>
		<main class="grid-x grid-padding-x">
			<section class="cell small-12">
				${raceProgress(positions)}
				<a class="button primary" href="/race">Start a new race</a>
			</section>
		</main>
		<footer class="grid-x grid-padding-x grid-padding-y">
			<div class="cell text-center">&copy; 2022 Copyright Yu Li</div>
		</footer>
	`;
}

// render when race is progressing
function raceProgress(positions) {

	const userPlayer = positions.find((e) => e.id === store.player_id);
	userPlayer.driver_name += " (you)";

	positions = positions.sort((a, b) => (a.segment > b.segment ? -1 : 1));
	let count = 1;

	const results = positions.map((p) => {
		return `
			<li>${count++} - ${p.driver_name}</li>
		`;
	}).join("");

	return `
		<h2>Leaderboard</h2>
		<ul class="no-bullet ranking">${results}</ul>
	`;
}

// render html content at the element
function renderAt(element, html) {
	const node = document.querySelector(element);

	node.innerHTML = html;
}

// ^ Provided code ^ do not remove

// API CALLS ------------------------------------------------

const SERVER = "http://localhost:8000";

function defaultFetchOpts() {
	return {
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": SERVER,
		},
	};
}

// TODO - Make a fetch call (with error handling!) to each of the following API endpoints

async function getTracks() {
	// GET request to `${SERVER}/api/tracks`
	try {
		const response = await fetch(`${SERVER}/api/tracks`);
		return await response.json();
	} catch (error) {
		console.log("Problem with getTracks request::", error);
	}
}

async function getRacers() {
	// GET request to `${SERVER}/api/cars`
	try {
		const response = await fetch(`${SERVER}/api/cars`);
		return await response.json();
	} catch (error) {
		console.log("Problem with getRacers request::", error);
	}
}

function createRace(player_id, track_id) {
	player_id = parseInt(player_id);
	track_id = parseInt(track_id);
	const body = { player_id, track_id };

	return fetch(`${SERVER}/api/races`, {
		method: "POST",
		...defaultFetchOpts(),
		dataType: "jsonp",
		body: JSON.stringify(body),
	})
		.then((res) => res.json())
		.catch((err) => console.log("Problem with createRace request::", err));
}

async function getRace(id) {
	// GET request to `${SERVER}/api/races/${id}`
	try {
		const response = await fetch(`${SERVER}/api/races/${id}`);
		return await response.json();
	} catch (error) {
		console.log("Problem with getRace request::", error);
	}
}

function startRace(id) {
	return fetch(`${SERVER}/api/races/${id}/start`, {
		method: "POST",
		...defaultFetchOpts(),
	})
		.then((res) => res)
		.catch((err) => console.log("Problem with startRace request::", err));
}

function accelerate(id) {
	// POST request to `${SERVER}/api/races/${id}/accelerate`
	// options parameter provided as defaultFetchOpts
	// no body or datatype needed for this request
	return fetch(`${SERVER}/api/races/${id}/accelerate`, {
		method: "POST",
		...defaultFetchOpts(),
	})
		.then((res) => res)
		.catch((err) => console.log("Problem with accelerate request::", err));
}
