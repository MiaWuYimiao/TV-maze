"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm( term ) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const results = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);
  let shows = []
  for(let result of results.data){
      const newShow = {
        id : result.show.id,
        name : result.show.name,
        summary : result.show.summary,
        image : result.show.image.medium
      }
      shows.push(newShow);
  }
  console.log(shows);
  return shows;

  // return [
  //   {
  //     id: 1767,
  //     name: "The Bletchley Circle",
  //     summary:
  //       `<p><b>The Bletchley Circle</b> follows the journey of four ordinary 
  //          women with extraordinary skills that helped to end World War II.</p>
  //        <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their 
  //          normal lives, modestly setting aside the part they played in 
  //          producing crucial intelligence, which helped the Allies to victory 
  //          and shortened the war. When Susan discovers a hidden code behind an
  //          unsolved murder she is met by skepticism from the police. She 
  //          quickly realises she can only begin to crack the murders and bring
  //          the culprit to justice with her former friends.</p>`,
  //     image:
  //         "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
  //   }
  // ]
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    let imgSrc;
    try{
      imgSrc = show.image;
    }catch{
      imgSrc = "https://tinyurl.com/tv-missing";
    }
    
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src=${imgSrc}
              alt="Bletchly Circle San Francisco" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) { 
  const results = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  let episodes = []
  for(let result of results.data){
      const newEpisode = {
        id : result.id,
        name : result.name,
        season : result.season,
        number : result.number
      }
      episodes.push(newEpisode);
  }
  console.log(episodes);
  return episodes;
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) { 
  $("#episodes-list").empty();

  for (let episode of episodes) {
    let $li = $(`<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`);
    $("#episodes-list").append($li);  }

  console.log($("#episodes-list"));
  $episodesArea.show();
}

$("#shows-list").on("click", ".Show-getEpisodes", async function handleClick(e) {
  console.log($(e.target))
  let id = $(e.target).closest(".Show").data("show-id");
  let episodes = await getEpisodesOfShow(id);
  populateEpisodes(episodes);
});
