"use strict";

const $showsList = $("#shows-list");
const $episodesList = $("#episodes-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(q) {
	// ADD: Remove placeholder & make request to TVMaze search shows API.
	const response = await axios.get(
		`https://api.tvmaze.com/search/shows?q=${q}`
	);
	console.log(response.data);
	return response.data.map((result) => {
		const show = result.show;
		return {
			id: show.id,
			name: show.name,
			summary: show.summary,
			image: show.image ? show.image.medium : "https://tinyurl.com/tv-missing"
		};
	});
	// console.log(response);
	// return shows;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
	$showsList.empty();

	for (let show of shows) {
		const $show = $(
			`<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img class="w-25 mr-3" src="${show.image}">

           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `
		);

		$showsList.append($show);
	}
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
	const term = $("#searchForm-term").val();
	const shows = await getShowsByTerm(term);

	$episodesArea.hide();
	populateShows(shows);
}

$searchForm.on("submit", async function (e) {
	e.preventDefault();
	await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
	const response = await axios.get(
		`https://api.tvmaze.com/shows/${id}/episodes`
	);
	console.log(response.data);
	return response.data.map((episode) => ({
		id: episode.id,
		name: episode.name,
		season: episode.season,
		number: episode.number
	}));
	console.log(episodes);
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
	$episodesList.empty();

	for (let episode of episodes) {
		const $li = $(`
      <li>${episode.name} (season ${episode.season}, episode ${episode.number})</li>
    `);

		$episodesList.append($li);
	}
	$episodesArea.show();
}

async function searchForEpisodesAndDisplay(e) {
	const showId = $(e.target).closest(".Show").data("show-id");
	const episodes = await getEpisodesOfShow(showId);
	populateEpisodes(episodes);
}

$showsList.on("click", ".Show-getEpisodes", searchForEpisodesAndDisplay);
