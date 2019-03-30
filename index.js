function displayCard(doc) {
    var cardHTML = '<div class="card hoverable profile-card" onclick="displayPortfolioByUID(\'' + doc.id + '\');"> <a href="#"> <div class="row valign-wrapper"> <div class="col s4"> <img class="circle card-user-pic" src="' + doc.data().photoURL + '" style="width: 100%;"> </div> <div class="col s8"> <span class="black-text card-name">' + doc.data().firstName + ' ' + doc.data().lastName + '</span><br> <span class="grey-text text-darken-1 card-prog-discipline">' + doc.data().program + ' (' + doc.data().discipline + ')' + '</span> </div> </div> <div class="card-content grey-text card-about" style="padding: 0px 0.75rem;">' + doc.data().about + '</div> </a> </div>';
    var card = document.createElement('span');
    card.innerHTML = cardHTML;
    main.appendChild(card);
}

db.collection("portfolios").get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        displayCard(doc);
    });
});