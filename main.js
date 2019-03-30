var db = firebase.firestore();

var userPicElement = document.querySelector('.user-icon');
var userPicFormElement = document.querySelector('.user-icon-form');
var userPicSidenavElement = document.querySelector('.user-pic-sidenav');

var displayNameElement = document.querySelector('.display-name');

var signInButtonElement = document.querySelector('#sign-in');
var signInSidenavElement = document.querySelector('#sign-in-sidenav');
var signOutButtonElement = document.querySelector('#sign-out');
var signOutSidenavElement = document.querySelector('#sign-out-sidenav');
var editButton = document.querySelector('#edit-button');
var editSidenavElement = document.querySelector('#edit-sidenav');

var main = document.querySelector('main');

var hideOnLogOutElements = document.querySelectorAll('.hide-on-log-out');

signOutButtonElement.addEventListener('click', signOut);
signInButtonElement.addEventListener('click', signIn);
signOutSidenavElement.addEventListener('click', signOut);
signInSidenavElement.addEventListener('click', signIn);

// var portfolioPopUpElement = document.querySelector('#portfolio-pop-up');

//Initialize Sidebar
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
});

// Initiate Firebase Auth.
function initFirebaseAuth() {
    // Listen to auth state changes.
    firebase.auth().onAuthStateChanged(authStateObserver);
}

function signIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
}

function signOut() {
    // Sign out of Firebase.
    firebase.auth().signOut();
}

// Returns the signed-in user's profile pic URL.
function getProfilePicUrl() {
    return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
}

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url, size) {
    if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
        return url + '?sz=' + size;
    }
    return url;
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
    if (user) { // User is signed in!
        // Get the signed-in user's profile pic and name.
        var profilePicUrl = getProfilePicUrl();

        // Set the user's profile pic and name.
        displayNameElement.textContent = user.displayName;
        userPicElement.src = addSizeToGoogleProfilePic(profilePicUrl, 150);
        userPicSidenavElement.src = addSizeToGoogleProfilePic(profilePicUrl, 150);

        if (userPicFormElement)
            userPicFormElement.src = addSizeToGoogleProfilePic(profilePicUrl, 200);

        // Show user's profile and sign-out  and edit buttons.
        userPicElement.classList.remove('hide');
        userPicSidenavElement.style.visibility = 'visible';

        hideOnLogOutElements[0].classList.remove('hide');
        hideOnLogOutElements[1].classList.remove('hide');

        // Hide sign-in button.
        signInButtonElement.classList.add('hide');
        signInSidenavElement.classList.add('hide');
        loadFormData();
    } else { // User is signed out!
        if (window.location.pathname.indexOf('form.html') != -1) {     //redirect to main page
            window.location.href = 'index.html';
        }
        // Hide user's profile and sign-out button.
        userPicElement.classList.add('hide');
        userPicSidenavElement.style.visibility = 'hidden';

        displayNameElement.textContent = '';

        hideOnLogOutElements[0].classList.add('hide');
        hideOnLogOutElements[1].classList.add('hide');

        // Show sign-in button.
        signInButtonElement.classList.remove('hide');
        signInSidenavElement.classList.remove('hide');
    }
}



function displayPortfolioByUID(uid) {
    var docRef = db.collection("portfolios").doc(uid);

    docRef.get().then(function (doc) {
        if (doc.exists) {
            var portfolioWindow = window.open('./portfolio.html');
            portfolioWindow.onload = function () {
                portfolioWindow.document.getElementById('portfolio-pic').src = doc.data().photoURL;
                portfolioWindow.document.getElementById('name').textContent = doc.data().firstName + ' ' + doc.data().lastName;
                portfolioWindow.document.getElementById('about').textContent = doc.data().about;
                portfolioWindow.document.getElementById('discipline-program').textContent = doc.data().discipline + ' (' + doc.data().program + ')';
                portfolioWindow.document.getElementById('email-link').href = 'mailto:' + doc.data().email;
                portfolioWindow.document.getElementById('github-link').href = 'https://github.com/' + doc.data().github;
                portfolioWindow.document.getElementById('achievements').textContent = doc.data().achievements;
                portfolioWindow.document.getElementById('projects').textContent = doc.data().projects;
                portfolioWindow.document.getElementById('experience').textContent = doc.data().experience;
            }
            console.log(doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

function displayPortfolioOfCurrentUser() {
    displayPortfolioByUID(firebase.auth().currentUser.uid);
}

// initialize Firebase
initFirebaseAuth();