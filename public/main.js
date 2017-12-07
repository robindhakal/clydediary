// JavaScript Document

var dogNameDB = "";
var dogPicURL = "" ;
var notes="";
var userName="";
var time="";

var globalCount = 0;

const fbDatabase = firebase.database();
const fbStorage = firebase.storage();

    var userData ={};

    var userID, name, email, photoUrl, emailVerified;
    var dogID;
    var selectedFile;

    function getFilename(event){
        selectedFile = event.target.files[0];
        //console.log(selectedFile);
    };

	function addDogButton(){
        var select = document.getElementById('genderSelect');
        var gender = select.options[select.selectedIndex].value;
        var newPostKey = fbDatabase.ref().child('dogsInfo').push().key;
        addPhoto(newPostKey);
		var dogdata = {
            name: document.getElementById('dogName').value,
            gender: gender,
            dateOfBirth: document.getElementById('birthday').value,
            weight: document.getElementById('weight').value,
            NeuteredOrSpayed: document.getElementById('neutSpay').checked,
            picFileName: selectedFile.name
        }; 
        saveDog(dogdata,newPostKey);
       // displayDatas(userID);
		$('#addDog').modal('hide');
    }
        
        function addPhoto(key){
            // var folder = fbDatabase.ref('/dogsList/'+ userID);
            // folder.once('value',function(snapshot){
            //     dogKey = snapshot.exportVal();
            //     dogKey = Object.keys(dogKey)[0];
            //     dogID = dogKey;

            var storeRef = fbStorage.ref('dogProfilePics/' + key + '/' + selectedFile.name);
            var uploadTask = storeRef.put(selectedFile);

            // Register three observers:
            // 1. 'state_changed' observer, called any time the state changes
            // 2. Error observer, called on failure
            // 3. Completion observer, called on successful completion
            uploadTask.on('state_changed', function(snapshot){
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            }, function(error) {
                // Handle unsuccessful uploads
            }, function() {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                var downloadURL = uploadTask.snapshot.downloadURL;
                displayDatas(userID);
            });
        }

function saveDog(dogdata, newPostKey){
    dogID = newPostKey;
    // var updates = {};
    // updates['/dogsInfo/' + newPostKey] = dogdata;
    // updates['/eventList/'+ newPostKey]
    // updates['/dogsList/' + uid + '/' ] = newPostKey;
  
    fbDatabase.ref('/dogsInfo/' + newPostKey).set(dogdata);
    fbDatabase.ref('/eventList/'+ newPostKey).set({name:dogdata.name});
    fbDatabase.ref('/dogsList/' + userID + '/'+newPostKey).set({name:dogdata.name});

}


function displayDatas(userID){
    var folder = fbDatabase.ref('/dogsList/'+ userID);
    var dogKey;
    folder.once('value',function(snapshot){
        dogKey = snapshot.exportVal();
        if(dogKey){
            dogKey = Object.keys(dogKey)[0];
            dogID = dogKey;
            folder = fbDatabase.ref('/dogsInfo/'+ dogKey);
            folder.once('value',function(snapshot){
            //  console.log(snapshot.val());
                document.getElementById("dogNameMenu").innerHTML = snapshot.val().name;
                var starsRef = firebase.storage().ref().child('dogProfilePics/' + dogID + '/' + snapshot.val().picFileName);            
                // Get the download URL
                starsRef.getDownloadURL().then(function(url){
                    document.getElementById("dogPic").src = url;
                });
                //console.log(snapshot.val().name);
            });
                // var reftoDIV = 	document.getElementById("innerDIV");
                // reftoDIV.innerHTML = myCode;
            var folder = fbDatabase.ref('/eventList/'+ dogID);
            folder.on('value',function(snapshot){
                displayAllNotes(snapshot);
            });
        }
    });
    //console.log(dogID);
    return dogID;
    // folder = fbDatabase.ref('/dogsInfo/'+ dogKey);
    // folder.once('value',function(snapshot){
    //     console.log(snapshot.val());
    //     document.getElementById("dogName").innerHTML = snapshot.val().name;
    //     })
    
}

function displayAllNotes(snapshot){

   
    var inDIV = document.getElementById("innerDIV");
    inDIV.innerHTML="";
    snapshot.forEach(function(childSnapshot){
        var childData = childSnapshot.val();
         if(childData.note != null){
            var reftoDIV = 	document.createElement("div");
            reftoDIV.innerHTML = '<div class="card bg-info text-white text-center">\
                <div class="card-header">\
                <h1>Walk</h1>\
                <h2>' + childData.time + '</h2>\
                </div>\<div class="card-body">\
                <h4 class="card-title">Note: ' + childData.note + '</h4>\
                <p id="notes" class="card-text"></p>\
                </div>\
                <div class="card-footer">By: Robin Dhakal </div>\
                </div>\<br>';
            
            if(!inDIV.childNodes.isEmpty){
                inDIV.insertBefore(reftoDIV, inDIV.childNodes[0]);
            }else{
                inDIV.appendChild(reftoDIV);
            }
            //  console.log(childData.note);
            //  console.log(childData.time);
            //  console.log("next:");
         }
        // return true;
     })

}

function addEvent(){
	 var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
   // s = checkTime(s);

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

	var thenote = document.getElementById('message-text2').value;

    var event ={
        type : 'Walk',
        time : h + ":" + m,
        date : today,
		note: thenote
    }

	$('#addEventModal').modal('hide');
	
    saveEvents(event);
    
	//document.getElementById("notes").innerHTML = thenote;
	//document.getElementById("userName").innerHTML = "Robin Dhakal pt 2";
    //document.getElementById("time").innerHTML = event.time;


	
}

    function displayEvents(dogID){

        var reftoDIV = 	document.getElementById("innerDIV");
        reftoDIV.innerHTML = myCode;

        var folder = fbDatabase.ref('/eventList/'+ dogID);

        folder.once('value',function(snapshot){
            snapshot.forEach(function(childSnapshot){
               var childData = childSnapshot.val();
                //console.log(key);
                // document.getElementById("notes").innerHTML = childData.note.toString();
                // document.getElementById("userName").innerHTML = "Robin Dhakal"
                // document.getElementById("time").innerHTML = childData.time.toString();

                console.log(childData.notes);
                console.log(childData.time);
                console.log("next:");
                //return true;
            })
           
        })
        
       
        
    }

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        
            userData = {
            name : user.displayName,
            email : user.email,
            photoUrl : user.photoURL,
            emailVerified : user.emailVerified
            };

            userID = user.uid;

            var updates = {};
            updates['/userInfo/' + userID] = userData;
            firebase.database().ref().update(updates);

            var dog = displayDatas(userID);
           // console.log(dog)
            //displayEvents(dog);
           // console.log(dog);

            
        }
        else {
          // No user is signed in.
        }
      });

function code() {
	document.getElementById("dogPic").src = dogPicURL;

        }
window.onload = code;




function saveEvents(event){

    var newPostKey = fbDatabase.ref().child('eventList').push().key;
    fbDatabase.ref('/eventList/' + dogID + '/' + newPostKey).set(event);

}

function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

function addFamilyMember(){
    var folder = fbDatabase.ref('/dogsList/'+ userID);
   // var dogKey;
   console.log(userID);
    folder.once('value',function(snapshot){ 
        var inSelect = document.getElementById("dogSelect");
        inSelect.innerHTML = "";
        var reftoSelect = document.createElement("option");
        reftoSelect.value = snapshot.key;
        reftoSelect.innerHTML = 'All Dogs';
        inSelect.appendChild(reftoSelect);
        snapshot.forEach(function(childSnapshot){
                var reftoSelect = 	document.createElement("option");
                reftoSelect.value = childSnapshot.key;
                reftoSelect.innerHTML = childSnapshot.val().name;
                console.log(childSnapshot.val().name);
                inSelect.appendChild(reftoSelect);
        })
    })

}

function generateInviteCode(){
    var select = document.getElementById('dogSelect');
    var invite;
    if(select.selectedIndex == 0){
        console.log("All Dogs" + select.options[select.selectedIndex].value);
        invite = {
            inviteType : "All Dogs",
            dogID: select.options[select.selectedIndex].value
        };
    }
    else{
        console.log(select.options[select.selectedIndex].value);  
        invite = {
            inviteType : "Dog",
            dogID: select.options[select.selectedIndex].value,
            name: select.options[select.selectedIndex].innerHTML
        };
    }
    var newPostKey = fbDatabase.ref().child('inviteList').push().key;
    fbDatabase.ref('/inviteList/' + newPostKey).set(invite);
    console.log("inviteCode: " + newPostKey);
    /**
     * TODO: show invite code
     */

}

function addDogInvite(){
    var inviteCode = document.getElementById('inviteCode').value;
    console.log(inviteCode);

    var folder = fbDatabase.ref('/inviteList/'+ inviteCode);
    folder.once('value',function(snapshot){
        if(snapshot.val().inviteType == "All Dogs"){
            console.log("All Dogs: "+ snapshot.val().dogID);
            fbDatabase.ref('/dogsList/' + snapshot.val().dogID).once('value',function(snapshot2){
                fbDatabase.ref('/dogsList/' + userID + '/').set(snapshot2.val());
            })
        }
        else{
            console.log("Dog: "+ snapshot.val().dogID);
            fbDatabase.ref('/dogsList/' + userID + '/'+ snapshot.val().dogID).set({name:snapshot.val().name});
        }
    });
    displayDatas(userID);

}

function signOut(){
    firebase.auth().signOut().then(function() {
       window.location.href = "index.html";
      }, function(error) {
        
      });
}
