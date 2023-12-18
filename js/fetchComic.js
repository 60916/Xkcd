// Variabel för att hålla reda på den högsta (senaste) comic-numret
var maxComic = -1;

// Variabel för att hålla reda på det aktuella comic-numret
let currentComicNumber;

// Funktion som körs när webbsidan laddas
window.onload = function() {
    
    // Hämta senaste comic-numret från XKCD API
    fetch("https://xkcd.vercel.app/?comic=latest")
        .then(function(response) {
            if(response.status === 200) {
                return response.json();
            }
        })
        .then(function(data) {
            // Sätt det aktuella comic-numret till det senaste
            currentComicNumber = data.num;
            // Hämta och visa den senaste comicen
            getComic(currentComicNumber);
        });

    // Funktion för att hämta en specifik comic baserat på dess nummer
    function getComic(which) {
        // Rensa innehållet i elementen för titel och comic
        let mainComic = document.getElementById("mainComic");
        mainComic.innerText = "";
        let mainTitle = document.getElementById("mainTitle");
        mainTitle.innerText = "";
        let mainDate = document.getElementById("mainDate");
        mainDate.innerText = "";

        // Hämta data för den specifika comicen från XKCD API
        fetch("https://xkcd.vercel.app/?comic=" + which)
        .then(function(response) {
            if(response.status == 200) {
                return response.json();
            }
        })
        .then(function(data) {
            // Uppdatera maxComic om det nya comic-numret är större
            if (maxComic < data.num) {
                maxComic = data.num;
            }
            // Lägg till titel och comic-bild i HTML-dokumentet
            appendTitle(data);
            appendComic(data);
            appendDate(data)
        });
    }

    // Funktion för att lägga till datum i HTML-dokumentet
function appendDate(data) {
    let mainDate = document.getElementById("mainDate");
    let dateElement = document.createElement("p");
    let comicDate = new Date(data.year, data.month-1, data.day);
    let DateFormat = comicDate.toLocaleDateString();
    dateElement.innerHTML = DateFormat;
    mainDate.appendChild(dateElement);
    }

    // Funktion för att lägga till titel i HTML-dokumentet
    function appendTitle(data) {
        let mainTitle = document.getElementById("mainTitle");
        let titleElement = document.createElement("H1");
        titleElement.innerHTML = data.title;
        mainTitle.appendChild(titleElement);
    }

    // Funktion för att lägga till comic-bild i HTML-dokumentet
    function appendComic(data) {
        let mainComic = document.getElementById("mainComic");
        let imageElement = document.createElement("img");
        let figcaption = document.createElement("figcaption")
        imageElement.src = data.img;
        mainComic.appendChild(imageElement);
        figcaption.innerHTML = data.num
        mainComic.appendChild(figcaption);
    }

    // Funktion för att gå till nästa comic
    function nextComic() {
        if (currentComicNumber < maxComic) {
            currentComicNumber++;
            getComic(currentComicNumber);
        }
    }

    // Funktion för att gå till föregående comic
    function prevComic() {
        if (currentComicNumber > 1) {
            currentComicNumber--;
            getComic(currentComicNumber);
        }
    }

    // Funktion för att gå till den första comicen
    function firstComic() {
        if (currentComicNumber !== 1) {
            currentComicNumber = 1;
            getComic(currentComicNumber);
        }
    }

// Funktion för att gå till den senaste comicen
function latestComic() {
    // Check if the current comic is already the latest
    if (currentComicNumber === maxComic) {
        return;
    }

    fetch("https://xkcd.vercel.app/?comic=latest")
        .then(function(response) {
            if (response.status === 200) {
                return response.json();
            }
        })
        .then(function(data) {
            // Uppdatera maxComic om det nya comic-numret är större
            if (maxComic < data.num) {
                maxComic = data.num;
            }

            // Uppdatera det aktuella comic-numret och hämta den senaste comicen
            currentComicNumber = data.num;
            getComic(currentComicNumber);
        });
    }

    // Funktion för att visa en slumpmässig comic
function randomComic() {
    if (!maxComic) {
        fetch("https://xkcd.vercel.app/?comic=latest")
            .then(function(response) {
                if (response.status === 200) {
                    return response.json();
                }
            })
            .then(function(data) {
                // Uppdatera maxComic om det nya comic-numret är större
                if (maxComic < data.num) {
                    maxComic = data.num;
                }
    
                // Uppdatera det aktuella comic-numret och visa den slumpmässiga comicen
                currentComicNumber = Math.floor(Math.random() * maxComic) + 1;
                getComic(currentComicNumber);
            });
    } else {
        // Visa en slumpmässig comic om maxComic är redan satt
        currentComicNumber = Math.floor(Math.random() * maxComic) + 1;
        getComic(currentComicNumber);
    }
}

    // Lägg till event listeners för knapparna i HTML-dokumentet
    document.getElementById("First").addEventListener("click", firstComic);
    document.getElementById("Latest").addEventListener("click", latestComic);
    document.getElementById("Prev").addEventListener("click", prevComic);
    document.getElementById("Next").addEventListener("click", nextComic);
    document.getElementById("Random").addEventListener("click", randomComic);

};
