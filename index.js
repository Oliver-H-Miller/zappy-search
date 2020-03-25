const express = require('express');
const bodyParser = require('body-parser');
const bent = require('bent');
const request = require('request');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// you can find your (C)ustom (S)earch (E)ngine ID by going to https://cse.google.com/cse/all
// make a new search engine, and make sure to check
const cseID = process.env.SEARCH_ENGINE_ID;
const cseAPIkey= process.env.CUSTOM_SEARCH_API_KEY;

const baseURL = `https://www.googleapis.com/customsearch/v1?cx=${cseID}&key=${cseAPIkey}`;

app.get('/', async function (req, res) {
    const q = req.query["q"];
    if ("q" in req.query && req.query["q"] !== undefined && req.query["q"] !== " ") await res.render('results.ejs', await showResults(urlencode(q)));
    else res.sendFile("./public/start.html", { root: __dirname });
});

app.get('/favicofinder', function (req, res) {
    // quick little proxy to get thumbnail from without having user actually contact Google
    if ("src" in req.query && req.query["src"] !== undefined && req.query["src"] !== " ") {
        const url = `https://s2.googleusercontent.com/s2/favicons?domain=${req.query["src"]}`;
        request(url).pipe(res);
    }
    else {
        request("https://s2.googleusercontent.com/s2/favicons?domain=www.example.com").pipe(res);
    }
});

function urlencode(str) {
    str = (str + '').toString();
    str = str.replace('%', '%25');

    // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
    // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
    return decodeURIComponent(str)
        .replace('%21', '!')
        .replace('%27', '\'')
        .replace('%28', '(')
        .replace('%29', ')')
        .replace('%2A', '*')
        .replace('+', ' ');
}

async function showResults(q) {
    const getJSON = bent('json');
    let req = await getJSON(baseURL + "&q=" + encodeURIComponent(q));

    let obj = await req;


    const searchResult = {
        query: obj["queries"]["request"][0]["searchTerms"],
        numOfResults: obj["queries"]["request"][0]["count"],
        searchTime: obj["searchInformation"]["formattedSearchTime"],
        results: obj["items"],
    };
    return(searchResult);
}

app.use(express.static( "public" ));

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
