document.getElementById('whatsapp').addEventListener('click', (e) => {
    chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
        function (tabs) {
            // console.log(tabs[0].url)
            if (tabs[0].url === "https://web.whatsapp.com/") {
                let sk = document.getElementById('key').value;
                // console.log(sk)
                // localStorage.setItem("key", sk);
                // console.log(localStorage.getItem('key'))
                chrome.tabs.getSelected(null, function (tab) {
                    // alert(document.activeElement.tabIndex);
                    chrome.tabs.executeScript(tab.id, {
                        code: 'var keyy ="' + sk + '"'
                    }, function () {
                        chrome.tabs.executeScript(tab.id, { file: './scripts/whatsapp.js' });
                    });
                })
            }
        }
    );
})

document.getElementById('search').addEventListener('click', (e) => {
    let Http = new XMLHttpRequest();
    const url = 'http://localhost:9000/search?keys=' + document.getElementById('txt').value;
    console.log(url)
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (e) => {
        console.log(Http.responseText)
        var respt = JSON.parse(Http.responseText);
        var st = '<ul>'
        console.log(respt)
        console.log(respt)
        if (Object.keys(respt).length !== 0) {
            for (var x in respt) {
                st += '<li align="left">' + '<a target="_target" href="' + x + '">' + x + '</a>' + '</li>'
            }
        }
        else {
            st += '<li align="left">' + 'No Bookmarks found..Modify your search..' + '</li>'
        }
        st += '</ul>'
        console.log(st)
        document.getElementById('search').innerHTML = st;
    }
});

document.getElementById('book').addEventListener('click', (e) => {
    console.log(document.getElementById('tags').value)
    chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
        function (tabs) {
            let Http = new XMLHttpRequest();
            const url = 'http://localhost:3000/savebook?url=' + tabs[0].url + '&tags=' + document.getElementById('tags').value;
            console.log(url)
            Http.open("GET", url);
            Http.send();
            document.getElementById('book_div').innerHTML = '<div class="alert alert-success" role="alert"> Website Marked </div >'
            Http.onreadystatechange = (e) => {
                console.log(Http.responseText)
            }
        }
    );
})

document.getElementById('report').addEventListener('click', (e) => {
    let Http = new XMLHttpRequest();
    const url = 'http://localhost:9000/sms'
    console.log(url)
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (e) => {
        console.log(Http.responseText)
    }
})

document.getElementById('bookmark').addEventListener('click', (e) => {
    chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
        function (tabs) {
            let Http = new XMLHttpRequest();
            const url = 'http://localhost:3000/?url=' + tabs[0].url;
            console.log(url)
            Http.open("GET", url);
            Http.send();
            document.getElementById('bookmark_div').innerHTML = '<div class="alert alert-danger" role="alert"> Website Blocked </div >'
            Http.onreadystatechange = (e) => {
                console.log(Http.responseText)
            }
        }
    );
})


document.getElementById('reviews_button').addEventListener('click', (e) => {
    console.log(document.getElementById('reviews_input').value)
    chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
        function (tabs) {
            let Http = new XMLHttpRequest();
            const url = 'http://localhost:3000/uploadreviews?reviews=' + document.getElementById('reviews_input').value + '&url=' + tabs[0].url;
            console.log(url)
            Http.open("GET", url);
            Http.send();
            document.getElementById('post_div').innerHTML = '<div class="alert alert-success" role="alert"> Review Posted Successfully  </div >'
            console.log('chlo review button ke ander')
            Http.onreadystatechange = (e) => {
                if (Http.readyState == 4 && Http.status == 200)
                    console.log(Http.responseText)
            }
        }
    );
})


document.getElementById('disp').addEventListener('click', (e) => {
    chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
        function (tabs) {
            let Http = new XMLHttpRequest();
            const url = 'http://localhost:3000/displayreviews?url=' + tabs[0].url;
            console.log(url)
            Http.open("GET", url);
            Http.send();
            Http.onreadystatechange = function () {
                if (Http.readyState == 4 && Http.status == 200) {
                    console.log(Http.responseText);
                    var respt = JSON.parse(Http.responseText);
                    var st = '<ul class="list-group">'
                    console.log(respt)
                    if (respt.length) {
                        for (var x in respt) {
                            st += '<li class="list-group-item" align="left">' + respt[x] + '</li>'
                        }
                    }
                    else {
                        st += '<li class="list-group-item">' + 'Be the 1st one to review..' + '</li>'
                    }
                    st += '</ul>'
                    console.log(st)
                    document.getElementById('fetch_div').innerHTML = st;
                }
            }
        }
    );
})

document.getElementById('get_rating').addEventListener('click', (e) => {
    chrome.tabs.executeScript({
        file: 'ratingdisplay.js'
    });
})

var star;
document.getElementById('new-rate').addEventListener('click', (e) => {
    console.log("hi");
    if ($("input[type='radio']").is(':checked')) {
        var star = $("input[type='radio']:checked").val();
        // alert(star);
    }
    if (star) {
        chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
            function (tabs) {
                let Http = new XMLHttpRequest();
                const url = 'http://localhost:3000/rate?star=' + star + '&url=' + tabs[0].url;
                console.log(url)
                Http.open("GET", url);
                Http.send();
                Http.onreadystatechange = (e) => {
                    console.log(Http.responseText)
                }
            }
        );
    }
})

const togglehandler = () => {
    $('#pills-home-tab').removeClass('active');
    $('#pills-book-tab').removeClass('active');
    $('#pills-bookmark-tab').removeClass('active');
    $('#pills-review-tab').removeClass('active');
    $('#pills-rating-tab').removeClass('active');
    $('#pills-report-tab').removeClass('active');
    $('#pills-home').removeClass('show active');
    $('#pills-book').removeClass('show active');
    $('#pills-bookmark').removeClass('show active');
    $('#pills-review').removeClass('show active');
    $('#pills-rating').removeClass('show active');
    $('#pills-report').removeClass('show active');
}

document.getElementById('pills-home-tab').addEventListener('click', () => {
    $('#myTab a[href = "#pills-home"]').tab('show');
    togglehandler();
    $('#pills-home-tab').addClass('active');
    $('#pills-home').addClass('show active');
});
document.getElementById('pills-book-tab').addEventListener('click', () => {
    $('#myTab a[href = "#pills-book"]').tab('show');
    togglehandler();
    $('#pills-book-tab').addClass('active');
    $('#pills-book').addClass('show active');
});
document.getElementById('pills-bookmark-tab').addEventListener('click', () => {
    $('#myTab a[href = "#pills-bookmark"]').tab('show');
    togglehandler();
    $('#pills-bookmark-tab').addClass('active');
    $('#pills-bookmark').addClass('show active');
});
document.getElementById('pills-review-tab').addEventListener('click', () => {
    $('#myTab a[href = "#pills-review"]').tab('show');
    togglehandler();
    $('#pills-review-tab').addClass('active');
    $('#pills-review').addClass('show active');
});

document.getElementById('pills-rating-tab').addEventListener('click', () => {
    $('#myTab a[href = "#pills-rating"]').tab('show');
    togglehandler();
    $('#pills-rating-tab').addClass('active');
    $('#pills-rating').addClass('show active');
});

document.getElementById('pills-report-tab').addEventListener('click', () => {
    $('#myTab a[href = "#pills-report"]').tab('show');
    togglehandler();
    $('#pills-report-tab').addClass('active');
    $('#pills-report').addClass('show active');
});
