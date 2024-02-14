function getData() {

    var form = document.getElementById("search-events");
    function handleForm(event) { event.preventDefault(); } 
    form.addEventListener('submit', handleForm);

    var keyword = document.getElementById("keyword").value;
    var location = document.getElementById("location").value;
    var distance = document.getElementById("distance").value;
    var category = document.getElementById("category").value;

    if (keyword==""){
        const norecord = document.getElementById("norecord");
        norecord.style.display = "inline-block";
    } else {
        let url = "https://yunyiztktapi.wl.r.appspot.com/search?keyword=" + keyword + "&distance=" + distance + "&category=" + category + "&location=" + location;
        fetch (url)
            .then(x => x.json())
            .then(data => displayEventData(data));
    }
}

function Checkfunc() {
    var checkBox = document.getElementById("check-detect");
    var location = document.getElementById("location");

    if (checkBox.checked == true){
        location.style.display = "none";
        location.removeAttribute("required"); 
        }
         else {
        location.style.display = "block";
    }
}

function showEventDetail(eventData){
  
    const evtid=eventData.id;

    const localDate = eventData.dates.start.localDate;
    const localTime = eventData.dates.start.localTime;
    const name = eventData.name;
    const segment = eventData.classifications[0].segment.name;
    const venueName = eventData._embedded.venues[0].name;
    const status=eventData.dates.status.code;
    const buy=eventData.url
    const address=eventData._embedded.venues[0].address.line1;
    const city=eventData._embedded.venues[0].city.name;
    const state=eventData._embedded.venues[0].state.stateCode;
    const postalCode=eventData._embedded.venues[0].postalCode;
    const moreevt=eventData._embedded.venues[0].url;

    const dtStatus = document.getElementById("dt-status");
    dtStatus.classList.remove("on", "re", "off", "canceled", "postponed");
            
    switch (status) {
    case "onsale":
        dtStatus.classList.add("on");
        break;
    case "rescheduled":
        dtStatus.classList.add("re");
        break;
    case "offsale":
        dtStatus.classList.add("off");
        break;
    case "canceled":
        dtStatus.classList.add("canceled");
        break;
    case "postponed":
        dtStatus.classList.add("postponed");
        break;
    default:
        break;
    }


    if (Array.isArray(eventData.priceRanges)) {
        maxPrice = eventData.priceRanges[0].max;
        minPrice = eventData.priceRanges[0].min;
        document.getElementById("dt-price").style.display= "initial";
        document.getElementById("pricelb").style.display= "initial";
        document.getElementById("dt-price").innerHTML=`${maxPrice} - ${minPrice} USD`;
        } else {
        maxPrice = "none";
        minPrice = "none";
        document.getElementById("dt-price").style.display="none";
        document.getElementById("pricelb").style.display="none";
    }
    
    const seatmap = eventData.seatmap && eventData.seatmap.staticUrl ? eventData.seatmap.staticUrl : "Seatmap Missing";

    document.getElementById("dt-head").innerHTML=name;
    document.getElementById("dt-date").innerHTML=`${localDate} ${localTime}`;
    document.getElementById("dt-venue").innerHTML=venueName;
    document.getElementById("dt-genres").innerHTML=segment;
    document.getElementById("dt-status").innerHTML=status;

    
    const attractions = eventData._embedded.attractions;
    const dtArt = document.getElementById("dt-art");

    if (attractions) {
    const names = attractions.map(attraction => {
        const name = attraction.name;
        const art_url = attraction.url;
        const link = `<a href=${art_url} target="_blank" style="color: skyblue; text-decoration: none">${name}</a>`;
        return link;
    });
    const concatenatedNames = names.join(" | ");
    dtArt.innerHTML = concatenatedNames;
    } else {
    dtArt.innerHTML = "No Artist/Team Message";
    }

    const ticketmasterLink = document.getElementById("buylink");
    ticketmasterLink.href = buy;

    const showmap = document.getElementById("showmap");
    showmap.src = seatmap;

    const showEventDetail = document.getElementById("showEventDetail");
    showEventDetail.style.display = "inline-grid";

    const showVenueDetailtext = document.getElementById("showVenueDetail-text");
    showVenueDetailtext.style.display = "inline-block";

    const showVenueDetail = document.getElementById("showVenueDetail");
    showVenueDetail.style.display = "inline-block";

    const VenueDetailTable = document.getElementById("VenueDetailTable");
    VenueDetailTable.style.display = "none";

    //show venue detail but display none
    try {
        const venueicon = eventData._embedded.venues[0].images[0].url;
        const venueiconshow = document.getElementById("venueicon");
        venueiconshow.src = venueicon;
        venueiconshow.style.display = "inline-block";
      } catch(error) {
      }

    document.getElementById("vd-head").innerHTML=venueName;
    document.getElementById("vd-address1").innerHTML=`${address}`;
    document.getElementById("vd-address2").innerHTML=`${city},${state}&nbsp${postalCode}`;

    const moreevtLink = document.getElementById("vd-link");
    moreevtLink.href = moreevt;

    document.getElementById("gmaplink").href = `https://www.google.com/maps/search/?api=1&query=${address}+${city}`;
    }


function displayEventData(data) {

    try {
            const norecord = document.getElementById("norecord");
            norecord.style.display = "none";

            const events = data._embedded.events;
            

            const tableBody = document.getElementById("backdata");
            tableBody.innerHTML = "";

            for (let i = 0; i < events.length; i++) {
                const eventData = data._embedded.events[i];

                const localDate = eventData.dates.start.localDate;
                const localTime = eventData.dates.start.localTime;
                const images = eventData.images[0].url; 
                const name = eventData.name;
                const segment = eventData.classifications[0].segment.name;
                const venueName = eventData._embedded.venues[0].name;

                const dtStatus = document.getElementById("dt-status");

                //Creat Table
                const tableRow = document.createElement("tr");

                // Create the Date and Time cell
                const dateTimeCell = document.createElement("td");
                dateTimeCell.innerText = `${localDate}\n${localTime}`;
                tableRow.appendChild(dateTimeCell);
                dateTimeCell.classList.add("addborder");

                // Create the Icon cell
                const imageCell = document.createElement("td");
                const imageElement = document.createElement("img");
                imageElement.src = images;
                imageElement.alt = "Event image";
                imageElement.width = 100;
                imageCell.appendChild(imageElement);
                tableRow.appendChild(imageCell);
                imageCell.classList.add("addborder");

                // Create the Event cell
                const nameCell = document.createElement("td");
                nameCell.innerText = name;
                tableRow.appendChild(nameCell);
                nameCell.classList.add("name-cell")
                nameCell.addEventListener("click", () => showEventDetail(eventData)); //这里的event data只取了一个
                
                // Create the Genre cell
                const segmentCell = document.createElement("td");
                segmentCell.innerText = segment;
                tableRow.appendChild(segmentCell);
                segmentCell.classList.add("addborder");

                // Create the Venue cell
                const venueCell = document.createElement("td");
                venueCell.innerText = venueName;
                tableRow.appendChild(venueCell);
                tableBody.appendChild(tableRow);
                venueCell.classList.add("addborder");
            }

            const showtb = document.getElementById("showtb");
            showtb.style.display = "inline-block";

        } catch (error) {
                const norecord = document.getElementById("norecord");
                norecord.style.display = "inline-block";
            }
    }
    

function VenueDetailFunc(){
    const VenueDetailTable = document.getElementById("VenueDetailTable");
    VenueDetailTable.style.display = "block";

    const showVenueDetailtext = document.getElementById("showVenueDetail-text");
    showVenueDetailtext.style.display = "none";

    const showVenueDetail = document.getElementById("showVenueDetail");
    showVenueDetail.style.display = "none";
    
}


var sortOrder = 'asc'; // initialize sorting order to ascending
function sortColumn1() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("showtb");
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[2];
            y = rows[i + 1].getElementsByTagName("TD")[2];
            if (sortOrder === 'asc') {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
    if (sortOrder === 'asc') {
        sortOrder = 'desc';
    } else {
        sortOrder = 'asc';
    }
}

function sortColumn2() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("showtb");
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[3];
            y = rows[i + 1].getElementsByTagName("TD")[3];
            if (sortOrder === 'asc') {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
    if (sortOrder === 'asc') {
        sortOrder = 'desc';
    } else {
        sortOrder = 'asc';
    }
}

function sortColumn3() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("showtb");
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[4];
            y = rows[i + 1].getElementsByTagName("TD")[4];
            if (sortOrder === 'asc') {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
    if (sortOrder === 'asc') {
        sortOrder = 'desc';
    } else {
        sortOrder = 'asc';
    }
}