var firstNameElement = document.getElementById('first-name');
var lastNameElement = document.getElementById('last-name');
var aboutElement = document.getElementById('about');
var emailElement = document.getElementById('email');
var githubElement = document.getElementById('github');
var disciplineElement = document.getElementById('discipline');
var programElement = document.getElementById('program');
var achievementsElement = document.getElementById('achievements');
var projectsElement = document.getElementById('projects');
var experienceElement = document.getElementById('experience');

function saveProfile() {
    if (document.getElementById('first-name').value === "") {
        M.toast({ html: 'First Name is required' });
        return;
    }

    if (document.getElementById('last-name').value === "") {
        M.toast({ html: 'Last Name is required' });
        return;
    }

    var profile = {
        firstName: firstNameElement.value,
        lastName: lastNameElement.value,
        about: aboutElement.value,
        email: emailElement.value,
        github: githubElement.value,
        discipline: disciplineElement.value,
        program: programElement.value,
        achievements: achievementsElement.value,
        projects: projectsElement.value,
        experience: experienceElement.value,
        photoURL: firebase.auth().currentUser.photoURL
    };

    db.collection("portfolios").doc(firebase.auth().currentUser.uid).set(profile)
        .then(function () {
            console.log("Document successfully written!");
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });

    M.toast({ html: 'Saved' })
    displayPortfolio(profile);
    console.log(profile);
}

document.getElementById('save-profile-btn').addEventListener('click', saveProfile);

function loadFormData() {
    var docRef = db.collection("portfolios").doc(firebase.auth().currentUser.uid);

    docRef.get().then(function (doc) {
        if (doc.exists) {
            var data = doc.data();
            firstNameElement.value = data.firstName;
            lastNameElement.value = data.lastName;
            aboutElement.value = data.about;
            emailElement.value = data.email;
            githubElement.value = data.github;

            achievementsElement.value = data.achievements;
            M.textareaAutoResize(achievementsElement);

            projectsElement.value = data.projects;
            M.textareaAutoResize(projectsElement);

            experienceElement.value = data.experience;
            M.textareaAutoResize(experienceElement);
            
            M.updateTextFields();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
   
    console.log('form loaded')
}