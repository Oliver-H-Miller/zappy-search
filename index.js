const express = require('express');
const bodyParser = require('body-parser');
const bent = require('bent');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// respond with "hello world" when a GET request is made to the homepage
const baseURL = "https://www.googleapis.com/customsearch/v1?cx=001740279159328743821:7iae50xhvn1&key=AIzaSyA2I-1Dt3W4cHgM4Eb-YQuSUiNlbNYUA6Y";
app.get('/', async function (req, res) {
    const q = decodeURI(req.query["q"]);
    if ("q" in req.query && req.query["q"] !== undefined && req.query["q"] !== " ") await res.json(await showResults(q));
    else res.sendFile("./html/start.html", { root: __dirname });
});

async function showResults(q) {
    const getJSON = bent('json');
    let req = await getJSON(baseURL + "&q=" + q);
    let obj = await req;


    // THIS IS WHERE I LEFT OFF
    // let badSpelling = obj.hasOwnProperty("spelling");
    // if (badSpelling)
    //
    const searchResult = {
        query: obj["queries"]["request"][0]["searchTerms"],
        numOfResults: obj["queries"]["request"][0]["count"],
        searchTime: obj["searchInformation"]["formattedSearchTime"],
        //spelling: {}

    };
    return(searchResult);
}

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
