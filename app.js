let response;

$( document ).ready(function() {
    let type = "Title"
    let apiCall = ""
    const currentPages = []


    $(".dropdown-item").on("click", function(event){
        let choice = event.target.text;
        $("#dropdownMenuButton").text(choice);
        type = choice;
    })

    $("#search-input").keypress(function(event){
        if (event.which === 13){
            event.preventDefault();
            input = $("#search-input").val()
            apiCall = buildGoogleApiCall(type, input)
            makeApiCall(apiCall, currentPages)
            
        }
    })

    $(".page-items").on("click", function(event){
        let pageNum = parseInt(event.target.text)
        paginationClick(pageNum, response)
    })
});

function buildBookCards(bookJson){
    const card = $("<div>", {
        "class": "card"
    })

    const img = $("<img>", {
        "class": "card-img-top",
        alt: "...",
        src: bookJson.volumeInfo.imageLinks.smallThumbnail
    }).appendTo(card)

    const cardBody = $("<div>", {
        "class": "card-body"
    }).appendTo(card)

    const title = $("<h5>", {
        "class":"card-title",
        text: bookJson.volumeInfo.title
    }).appendTo(cardBody)


    return card
    
}

function buildGoogleApiCall(type, input){
    const googleBookApiCall = `https://www.googleapis.com/books/v1/volumes?q=${type}:${input}&maxResults=40&key=AIzaSyChR8C915OXSRTVk8X4-8UTIovZtcVLpGY`;
    return googleBookApiCall;
}

function buildPaginationButtons(amount, currentPages){
    const amountOfPages = Math.ceil(amount / 8);

    for (let i=0; i<amountOfPages; i++){
        let pageNum = i + 1;
        currentPages.push(pageNum)

        if(currentPages.length < 8){
            const paginateItem = $(`<li class="page-item"><a class="page-link" href="#">${pageNum}</a></li>`)
            paginateItem.appendTo($(".page-items"))
        }else {
            const paginateContinue = $('<li class="page-item"><a class="page-link" id="ellipsis" href="#">...</a></li>')
        }
    }
}

function makeApiCall(apiCall, currentPages){


    fetch(apiCall)
    .then((response)=> response.json())
    .then(data => {
        
        buildPaginationButtons(data.totalItems, currentPages)
        for (let i=0; i<4; i++){
            let newCard = buildBookCards(data.items[i])
            newCard.appendTo($(".row-one"))
        }
        for (let i=4; i<8;i++){
            let newCard = buildBookCards(data.items[i])
            newCard.appendTo($(".row-two"))
        }
        response = data;
    })


}

function paginationClick(pageNum, responseData){
    let pageNumStart = 8 * (pageNum - 1)
    let pageNumEnd = 8 * pageNum

    $(".row-one").empty();
    $(".row-two").empty();

    for (let i = pageNumStart; i < pageNumEnd; i++ ){
        if (i % 2 == 0){
            let card = buildBookCards(responseData.items[i])
            $(".row-one").append(card)
        }
        else {
            let card = buildBookCards(responseData.items[i])
            $(".row-two").append(card)
        }
    }
}