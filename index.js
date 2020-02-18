const express = require('express');
const bodyParser = require('body-parser');
const bent = require('bent');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const baseURL = "https://www.googleapis.com/customsearch/v1?cx=001740279159328743821:7iae50xhvn1&key=AIzaSyA2I-1Dt3W4cHgM4Eb-YQuSUiNlbNYUA6Y";
app.get('/', async function (req, res) {
    const q = req.query["q"];
    if ("q" in req.query && req.query["q"] !== undefined && req.query["q"] !== " ") await res.render('results.ejs', await showResults(urlencode(q)));
    else res.sendFile("./html/start.html", { root: __dirname });
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

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
