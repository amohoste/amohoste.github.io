// Gets the last updated date of the page
function getLastUpdated() {
    const lastUpdated = new Date(document.lastModified);
    const day = lastUpdated.getDate();
    const month = lastUpdated.toLocaleString('default', { month: 'short' });
    const year = lastUpdated.getYear() - 100;

    if (day < 10) { day = "0" + day; }
    if (month < 10) { month = "0" + month; }
    const dateStr = "Last updated " + day + '-' + month + '-' + year;
    return dateStr;
}

// Live date and time
function updateDateTime() {
    // Update tmux date
    document.querySelector('#curdate').textContent = getLastUpdated();
}

// Calculates the window height and window current scroll position
function getWindowScrollPostion() {
    const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop || 0;
    const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
    return [Math.min(scrollPosition, maxHeight), maxHeight]
}

// Calculates the height of an element and the current scroll position within that element
function getElementScrollPosition(el) {
    const scrollPosition = el.scrollTop || 0;
    const maxHeight = el.scrollHeight - window.innerHeight;
    return [Math.min(scrollPosition, maxHeight), maxHeight]
}

// Calculates the current scroll position and max scroll size
function getScrollPosition() {
    // Depending on screensize, need to calculate screen size based on window or div
    const screenSize = window.getComputedStyle(document.body, ':before').content.replace(/\"/g, '');
    if (screenSize === "large" || screenSize == "xlarge") {
        const el = document.getElementById("content");
        return getElementScrollPosition(el);
    } else {
        return getWindowScrollPostion();
    }
}

// Updates the current scroll position
function updateScrollPosition() {
    let [curHeight, maxHeight] = getScrollPosition();

    let percentage = 100;
    if (maxHeight > 0) {
        percentage = Math.floor((curHeight / maxHeight) * 100);
    }
    
    const scrollStr = '[' + percentage + '%]';

    document.querySelector('#curscroll').textContent = scrollStr;
}

// Creates event listener which updaters scroll position on scrolling
function addScrollEventListener() {
    // Depending on screensize, need to calculate screen size based on window or div
    const screenSize = window.getComputedStyle(document.body, ':before').content.replace(/\"/g, '');
    const windowElement = document.getElementById('all-content');
    const contentElement = document.getElementById('content');

    if (screenSize === "large" || screenSize == "xlarge") {
        // If event listener not already set
        if (contentElement.getAttribute('listener') !== 'true') {
            contentElement.setAttribute('listener', 'true');
            // Add right div event listener
            contentElement.addEventListener("scroll", updateScrollPosition);

            // Remove window event listener
            window.removeEventListener("scroll", updateScrollPosition);
            windowElement.setAttribute('listener', 'false');
        }
    } else {
        // If event listener not already set
        if (windowElement.getAttribute('listener') !== 'true') {
            windowElement.setAttribute('listener', 'true');
            // Add window event listener if necessary
            window.addEventListener('scroll', updateScrollPosition)

            // Remove window event listener
            contentElement.removeEventListener("scroll", updateScrollPosition);
            contentElement.setAttribute('listener', 'false');
        }
    }
}

// Calculates the difference (in months) between two dates
function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12 + 1;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

// Parses a text date range (m/y - m/y) into a date
function parseDateRange(text) {
    const regexp = /(.*) - (.*)/g;
    const matches = regexp.exec(text);

    if (matches) {
        const from = matches[1];
        const to = matches[2];
        const fromDate = new Date(from.split("/")[1], from.split("/")[0] - 1);

        let toDate;
        let present = false;
        if (to === "Present") {
            toDate = new (Date);
            present = true;
        } else {
            toDate = new Date(to.split("/")[1], to.split("/")[0] - 1);
        }

        const diff = monthDiff(fromDate, toDate);
        return [fromDate, toDate, diff, present]
    }
}

// Parses a text date (m/y) into a date
function parseDate(text) {
    const singleRegexp = /(.*)/g;
    const matches = singleRegexp.exec(text);
    const from = matches[1];
    const fromDate = new Date(from.split("/")[1], from.split("/")[0] - 1);
    const diff = 1;
    return [fromDate, null, diff, false]
}

// Formats a date range in human format and adds the duration
function formatDateRange(text) {
    let res = parseDateRange(text);
    if (! res) {
        // Not a range, try to parse as single date
        res = parseDate(text);
    }

    let [fromDate, toDate, diff, present] = res;
    const months = diff % 12;
    const years = Math.floor(diff / 12);

    let result = fromDate.toLocaleString('default', { month: 'short' }) + " " + fromDate.getFullYear();

    if (present) {
        result += " - " + "Present";
    } else if (toDate) {
        result += " - " + toDate.toLocaleString('default', { month: 'short' }) + " " + toDate.getFullYear();
    }
    result += " · ";
    if (years == 1) {
        result += years + " yr ";
    }

    if (years > 1) {
        result += years + " yrs ";
    }

    if (months == 1) {
        result += months + " mo";
    }

    if (months > 1) {
        result += months + " mos";
    }

    return result;
}

document.getElementById('content').setAttribute('listener', 'false');
document.getElementById('all-content').setAttribute('listener', 'false');

// Update scroll indicator on scroll
addScrollEventListener();
updateScrollPosition();
window.addEventListener('resize', addScrollEventListener);

// Update date
updateDateTime();

// Calculate resume date durations
var elements = document.getElementsByClassName("date-item-date date-item-calc");
for (let el of elements) {
    el.textContent = formatDateRange(el.textContent);
}
