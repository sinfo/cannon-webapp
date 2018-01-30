$(document).on('ready', function () {
  fetchFromDeck('speakers','sort=name&event=25-sinfo&&participations=true', processSpeaker);
  fetchFromDeck('members','sort=name&event=25-sinfo&&participations=true', processMember);
  fetchFromDeck('sessions', 'sort=date&event=24-sinfo', processSessions)
  //fetchFromDeck('companies','event=24-sinfo&&participations=true', processSponsors);
});

function fetchFromDeck(field, params, processDataFromDeck) {
  var  deck = 'https://deck.sinfo.org:443/api/';
  var request = new XMLHttpRequest();
  request.open('GET', deck + field + '?' + params);
  request.responseType = 'json';
  request.send();
  request.onload = function() {
    request.response.forEach(function(el){
      processDataFromDeck(el);
    });
  }
}

var keynotesCounter = 0;
var workshopsCounter = 0;
var presentationsCounter = 0;

function processSessions(session) {
  dates = {
    '20': 'day1',
    '21': 'day2',
    '22': 'day3',
    '23': 'day4',
    '24': 'day5'
  };

  date = new Date(Date.parse(session.date));
  duration = new Date(Date.parse(session.duration));
  day = dates[date.getDate()];
  hour = date.getHours()
  minute = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
  speakers = ''

  session.speakers.forEach( function (speaker) {
    name = speaker.id.replace(/-/g, ' ');

    if (speakers.length !== 0) {
      speakers += ', ';
    }
    speakers += name;
  });

  if (session.kind === 'Keynote') {
    keynotesCounter += 1;
    html = `
      <div class="panel schedule-item">
        <div class="lecture-icon-wrapper">
          <span class="fa fa-cutlery"></span>
        </div>
        <a data-toggle="collapse" data-parent="#${day}_keynotes_timeline" href="#${day}_keynotes_time${keynotesCounter}" class="schedule-item-toggle">
          <strong class="time highlight"><span class="icon icon-office-24"></span>${hour}:${minute}</strong>
          <h6 class="title">${session.name}<i class="icon icon-arrows-06"></i></h6>
        </a>
        <div id="${day}_keynotes_time${keynotesCounter}" class="panel-collapse collapse in schedule-item-body">
          <article>
            <p class="description">${session.description}</p>
            <strong class="highlight speaker-name">${speakers}</strong>
          </article>
        </div>
      </div>
    `;

    $(`#${day}_keynotes > div`).append(html);
  }
}

function processMember(member) {
  // Dom Load hack
  setTimeout(function() {
    if( member.name !== "ToolBot!" )
      $("#team > div").append(html);
  }, 1);

  var html = `
  <div class="col-sm-2">
    <div class="speaker member">
      <div class="photo-wrapper rounded">
        <img src=${member.img} alt=${member.name} class="img-responsive">
          <ul class="speaker-socials">
            ${getSocial()}
          </ul>
      </div>
      <h3 class="name">${member.name}</h3>
    </div>
  </div>
  `;

  function getSocial(){
    var socialNav = "";
    
    if (member["mail"])
    socialNav += `<li><a href='mailto:${member["mail"]}'><span class="fa fa-envelope"></span></a></li>`;
    
    if (member["twitter"])
      socialNav += `<li><a href='https://twitter.com/${member["twitter"]}'><span class="fa fa-twitter"></span></a></li>`;

    if (member["facebook"])
      socialNav += `<li><a href='https://facebook.com/${member["facebook"]}'><span class="fa fa-facebook"></span></a></li>`;

    if (member["github"])
      socialNav += `<li><a href='https://github.com/${member["github"]}'><span class="fa fa-github"></span></a></li>`;

    return socialNav;
  }
}

function processSpeaker (speaker) {
  $("#speakers > div").append(`
    <div class="col-sm-3">
      <div class="speaker">
        <div class="photo-wrapper square">
          <div class="view view-first"
            style="background-image:url('https://static.sinfo.org/SINFO_25/speakersCompanies/${speaker.name.replace(/\s/g, '')}.png');">
            <img src=${speaker.img} alt="${speaker.name}" class="img-responsive">
          </div>
        </div>
        <h3 class="name">${speaker.name}</h3>
        <p class="text-alt"><small>${speaker.title}</small></p>
      </div>
    </div>
  `)
}

function processSponsors(sponsor) {
  var platinumPerLine = 4;

  /* diamond */
  if (sponsor.advertisementLvl == 'exclusive') {
    $("#sponsors-diamond").append(
      `<div class="sponsor big"><img src=${sponsor.img} alt=""></div>`
    );
  }

  /* platinum */
  else if (sponsor.advertisementLvl == 'max') {
    var loadedPlatinum = $(".platinum");
    var lastPlatinum = loadedPlatinum[loadedPlatinum.length - 1];

    /* if this div has fewer than 6 sponsors */
    if (lastPlatinum && $(lastPlatinum).children().length < platinumPerLine) {

      $(lastPlatinum).append(
        `<div class="sponsor"><img src=${sponsor.img} alt=""></div>`
      );
    }

    /* else, create new div */
    else {
      $('#sponsors > div').append(
        `<div class="sponsors platinum">
        <div class="sponsor"><img src=${sponsor.img} alt=""></div>
        </div>`
      );
    }
  }
}
