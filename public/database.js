
//     //initialize Firebase
//     const config = {
//         apiKey: "AIzaSyDdR3v7z2R6Y913rv9bnZoGImaIW2sk_vM",
//         authDomain: "clyde-diary.firebaseapp.com",
//         databaseURL: "https://clyde-diary.firebaseio.com",
//         projectId: "clyde-diary",
//         storageBucket: "clyde-diary.appspot.com"
//       //  messagingSenderId: "532713680020"
//     };

//     firebase.initializeApp(config);

//     const note = document.getElementById('note');
//     const other = document.getElementById('other');
//     const submit = document.getElementById('submit');
//     const otherSubmit = document.getElementById('otherSubmit');
    
//     const head1 = document.getElementById('head1');
//     const head2 = document.getElementById('head2');
//     const head3 = document.getElementById('head3');


//     const fbDatabase = firebase.database();
    
    




// });

//initialize Firebase
// const config = {
//         apiKey: "AIzaSyDdR3v7z2R6Y913rv9bnZoGImaIW2sk_vM",
//         authDomain: "clyde-diary.firebaseapp.com",
//         databaseURL: "https://clyde-diary.firebaseio.com",
//         projectId: "clyde-diary",
//         storageBucket: "clyde-diary.appspot.com",
//         messagingSenderId: "532713680020"
//     };
//     firebase.initializeApp(config);
      
    const fbDatabase = firebase.database();

    var userData ={};

    var userID, name, email, photoUrl, emailVerified;
    var dogID = 1234;

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.

          //var user = firebase.auth().currentUser;
         // var name, email, photoUrl, emailVerified;
          
         // if (user != null) {
            userData = {
            name : user.displayName,
            email : user.email,
            photoUrl : user.photoURL,
            emailVerified : user.emailVerified
            };
            userID = user.uid;
         // }
        //  console.log("Sign-in provider: " + user.providerId);
        //  console.log("  Provider-specific UID: " + userID);
        //  console.log("  Name: " + name);
        //  console.log("  Email: " + email);
        //  console.log("  Photo URL: " + photoUrl);
           // var ref = fbDatabase.ref(); 
          // var newPostKey = fbDatabase.ref().child('userInfo').push().key;
           var updates = {};
           updates['/userInfo/' + userID] = userData;
            firebase.database().ref().update(updates);

            
        }
        else {
          // No user is signed in.
        }
      });



document.getElementById('form').addEventListener('submit', submitData);

function submitData(e){
    e.preventDefault();
   var note = document.getElementById('note').value;
    saveNotes(note, "FoodNotes");
    
}

function saveNotes(data, type){
    if(type == "FoodNotes"){
        var folder = fbDatabase.ref('Notes');
    }
    var notePlace = folder.push();
    notePlace.set({
        notes: data
    });

    
    var key = folder.once('value',function(snapshot){
        snapshot.forEach(function(childSnapshot){
            var key = childSnapshot.key;
            console.log(key);
            var value = childSnapshot.val().notes;
            console.log(value);
            document.getElementById("other").innerHTML = value;
        })
        
    });
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);

    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    
    if(dd<10) {
        dd = '0'+dd
    } 
    
    if(mm<10) {
        mm = '0'+mm
    } 
    
    today = mm + '/' + dd + '/' + yyyy;

    var event ={
        type : 'Walk',
        time : h + ":" + m + ":" + s,
        date : today
    }
   
    
   var dogdata = {
       name: 'Clyde',
       age: 21,
       weight: 56
   };
   saveDog(dogdata);
   saveEvents(event);
    
}

function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  

const otherSubmit = document.getElementById('otherSubmit');

document.getElementById('form').addEventListener('otherSubmit', function(){
    firebase.auth().signOut().then(function() {
        
      }).catch(function(error) {
        // An error happened.
      });
});

function saveEvents(event){

    var newPostKey = fbDatabase.ref().child('eventList').push().key;
    fbDatabase.ref('/eventList/' + dogID + '/' + newPostKey).set(event);

}

function saveDog(dogdata){

    var newPostKey = fbDatabase.ref().child('dogsInfo').push().key;
    dogID = newPostKey;
    // var updates = {};
    // updates['/dogsInfo/' + newPostKey] = dogdata;
    // updates['/eventList/'+ newPostKey]
    // updates['/dogsList/' + uid + '/' ] = newPostKey;
  
    
    fbDatabase.ref('/dogsInfo/' + newPostKey).set(dogdata);
    fbDatabase.ref('/eventList/'+ newPostKey).set({isEmpty:true});
    fbDatabase.ref('/dogsList/' + userID + '/'+newPostKey).set({isEmpty:true});

}
