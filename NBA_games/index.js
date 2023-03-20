// NBA SCOREBOARD APP

function createMatchupContainers(games) {

  // Console log to view structure of json
  console.log(games)

  var container = document.getElementById('matchupContainer')

  if (games['Ccd'] != 'nba'){
    container.innerHTML = "There are no NBA games today"
  } else {

    // iterate through every matchup in the Events array and create the HTML
    for(var i=0; i<games['Events'].length; i++){

      var game = document.createElement('div')
      game.classList.add('game')

      var team1 = games['Events'][i]['T1'][0]
      var team2 = games['Events'][i]['T2'][0]

      var startTime = document.createElement('h6')
      startTime.classList.add('start-time')
      startTime.innerHTML = startTimeFormat(games['Events'][i]['Esd'])
      
      game.appendChild(startTime)

      // Creating the inner HTML of each matchup using a string literal (gets the job done)
      // Team 1 Div

      var t1Div = document.createElement('div')
      t1Div.classList.add("team")
      t1Div.id = team1['ID']
      var t1Img = document.createElement('img')
      t1Img.classList.add("logo")
      t1Img.src = `https://lsm-static-prod.livescore.com/medium/${team1['Img']}`
      var t1Abr = document.createElement('h1')
      t1Abr.innerText = team1['Abr']

      // Team 2 Div

      var t2Div = document.createElement('div')
      t2Div.classList.add("team")
      t2Div.id = team2['ID']
      var t2Img = document.createElement('img')
      t2Img.classList.add("logo")
      t2Img.src = `https://lsm-static-prod.livescore.com/medium/${team2['Img']}`
      var t2Abr = document.createElement('h1')
      t2Abr.innerText = team2['Abr']

      /*
      game.innerHTML += 
        `<div id=${team1['ID']} class="team">
            <img class="logo" src=https://lsm-static-prod.livescore.com/medium/${team1['Img']}>
            <h1>${team1['Abr']}</h1>
        </div>
        <div id=${team2['ID']} class="team">
          <img class="logo" src=https://lsm-static-prod.livescore.com/medium/${team2['Img']}>
          <h1>${team2['Abr']}</h1>
        </div>`
      */
      // Add the overall scores if the game has started
      t1Div.appendChild(t1Img)
      t1Div.appendChild(t1Abr)

      t2Div.appendChild(t2Img)
      t2Div.appendChild(t2Abr)

      //Add scores if game has started
      if (games['Events'][i]['Tr1OR'] >= 0){
        //change start time to LIVE
        startTime.innerHTML = games['Events'][i]['Eps']
        startTime.classList.add('live')

        var t1Score = document.createElement('h1')
        t1Score.classList.add('score')

        t1Score.textContent = games['Events'][i]['Tr1OR']
        t1Div.appendChild(t1Score)

        var t2Score = document.createElement('h1')
        t2Score.classList.add('score')

        t2Score.textContent = games['Events'][i]['Tr2OR']
        t2Div.appendChild(t2Score)
      }

      game.appendChild(t2Div)
      game.appendChild(t1Div)

      // Add each matchup to the matchup container element
      container.appendChild(game)
    }
  }
}

function startTimeFormat(startTime) {
    // recieves string in yyyymmddhhmmss
    // hhmm is in military time. Also want to remove the seconds
    var startsAt = (+startTime % 1000000) / 100
    var hour = Math.floor(startsAt / 100)
    var hh = hour;
    var mm = startsAt % 100
    var ampm;
    if (hh >= 12){
      ampm = "pm"
      hh = hour - 12
    }
    else {
      ampm = "am"
    }

    if (mm == 0){
      mm = String(mm) + "0"
    }
    return (`${String(hh)}:${String(mm)} ${ampm} ET`)
}

async function fetchNBAGames(date){

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'cc4125f9damsh3c42dad34b69902p1ce90fjsn2f1917d46e12',
      'X-RapidAPI-Host': 'livescore6.p.rapidapi.com'
    }
  };

  var url = `https://livescore6.p.rapidapi.com/matches/v2/list-by-date?Category=basketball&Date=${date}&Timezone=-5`

  const response = await fetch(url, options)
  const nbaGames = await response.json()
  console.log(nbaGames)
  //call a function that will set up match up
  createMatchupContainers(nbaGames['Stages'][0])
}

// get today's date and formate as yyyymmdd
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = yyyy + mm + dd

// Call the API
fetchNBAGames(today)

// Would like to have a function that will update scores every 30 seconds
// But won't implement becuase of limited number of calls to API allowed /mo
// at free subscription level.

const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navLinks = document.getElementsByClassName('main-nav-links')[0]

toggleButton.addEventListener('click', () => {
    navLinks.classList.toggle('active')
})