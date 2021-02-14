const request = require('request')
const axios = require('axios')
var express = require('express')
var unirest = require("unirest");
const pdf = require('pdf-parse');
const app = express()
const fs = require('fs');
var tr = require('textrank');
const port = 3000
const base64Credentials = Buffer.from('rajshah9914@gmail.com:BjSkTKLT1ge2xa5yhpDs').toString('base64')

var uu;
var tags;
var reviews;

app.get('/', (req, res) => {
    // console.log(req.query.url)

    uu = req.query.url
    axios.post('https://boogle-e8231-default-rtdb.firebaseio.com/blacklist.json', {
        url: uu
    })
        .then((response) => {
            console.log(response.status);
        }, (error) => {
            console.log(error);
        });
})

app.get('/savebook', (req, res) => {
    // console.log(req.query.url)

    uu = req.query.url
    tags = req.query.tags
    const options = {
        url: 'https://api.urlmeta.org/?url=' + req.query.url,
        headers: {
            'Authorization': 'Basic ' + base64Credentials
        }
    }
    request(options, callback);
})


app.get('/uploadreviews', (req, res) => {
    // console.log(req.query.url)

    uu = req.query.url
    console.log(req.query)
    console.log(uu)
    reviews = req.query.reviews
    console.log(reviews)

    axios.post('https://boogle-e8231-default-rtdb.firebaseio.com/reviews.json', {
        url: uu,
        reviews
    })
        .then((response) => {
            console.log(response.status);
        }, (error) => {
            console.log(error);
        });
    res.send('done')
})

app.get('/displayreviews', (req, res) => {
    // console.log(req.query.url)

    uu = req.query.url
    var reviews_disp = []
    axios.get('https://boogle-e8231-default-rtdb.firebaseio.com/reviews.json')
        .then((response) => {
            for (let key in response.data) {
                reviews_disp.push({
                    ...response.data[key]
                });
            }
            var cc = reviews_disp.filter(rr => {
                return rr.url === uu
            })
            cc = cc.map(rr =>
                rr.reviews
            )
            console.log(cc)
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

            res.send(cc)

        }, (error) => {
            console.log(error);
        });
})


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.get('/search', (req, res) => {
    // console.log(req.query.url)

    var keys = req.query.keys
    var bookmarks = []
    axios.get('https://boogle-e8231-default-rtdb.firebaseio.com/bookmarks.json')
        .then((response) => {
            for (let key in response.data) {
                bookmarks.push({
                    ...response.data[key]
                });
            }

            // console.log(response.data);
        }, (error) => {
            console.log(error);
        });
})

function callback(error, response, body) {
    if (!error && response.statusCode === 200) {
        let data = JSON.parse(body)

        if (data.result.status == 'OK') {
            console.log(data.meta)
            // return data.meta;
            axios.post('https://boogle-e8231-default-rtdb.firebaseio.com/bookmarks.json', {
                url: uu,
                description: data.meta.description,
                title: data.meta.title,
                keywords: data.meta.keywords,
                tags
            })
                .then((response) => {
                    console.log(response.status);
                }, (error) => {
                    console.log(error);
                });
        } else {
            console.log(data.result.reason)
        }
    } else {
        console.log(error, body)
    }
}

// request(options, callback)
app.get('/rate', (req, res) => {
    console.log("inside rating server..")
    axios.post('https://boogle-e8231-default-rtdb.firebaseio.com/ratings.json', {
        url: req.query.url,
        star: req.query.star
    }).then((response) => {
        console.log(response.status);
    }, (error) => {
        console.log(error);
    });
    res.send('rating posted');
});

app.get('/getRating', (req, res) => {
    var ratings = []
    axios.get('https://boogle-e8231-default-rtdb.firebaseio.com/ratings.json')
        .then((response) => {
            console.log(response.data)
            res.send(response.data)
        }, (error) => {
            console.log(error);
        });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

