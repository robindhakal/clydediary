// JavaScript Document





var dogNameDB = "fuck";
var dogPicURL = '/clyde.png';
var notes = "this is tjlaksfjdlkasdf";
var userName = "Fuck Robin";
var time = "7:34 AM";


var myCode = '<div class="card bg-info text-white text-center">\<div class="card-header">\<h1>Walk</h1>\<h2 id="time"></h2>\</div>\<div class="card-body">\<h4 class="card-title">Note:</h4>\<p id="notes" class="card-text"></p>\</div>\<div class="card-footer" id="userName">By: </div>\</div>\<br>';

const fbDatabase = firebase.database();

    var userData ={};

    var userID, name, email, photoUrl, emailVerified;
    var dogID;
	
	function addDogButton(){
	//console.log(document.getElementById('message-text').value);
		var dogName = document.getElementById('message-text').value;
			document.getElementById("dogName").innerHTML = dogName;
		var dogdata = {
			name: dogName
//
      // age: 21,
//      // weight: 56
		};
            //saveDog(dogdata);
            //readDog(userID);
            displayEvents(dogID)
		$('#addDog').modal('hide');
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

function displayDatas(userID){
   // console.log(userID)
    var folder = fbDatabase.ref('/dogsList/'+ userID);
    var dogKey;
    folder.once('value',function(snapshot){
        dogKey = snapshot.exportVal();
        dogKey = Object.keys(dogKey)[0];
        dogID = dogKey;
        //console.log(dogID);
        folder = fbDatabase.ref('/dogsInfo/'+ dogKey);
        folder.once('value',function(snapshot){
          //  console.log(snapshot.val());
            document.getElementById("dogName").innerHTML = snapshot.val().name;
            })

            var reftoDIV = 	document.getElementById("innerDIV");
            reftoDIV.innerHTML = myCode;
    
            var folder = fbDatabase.ref('/eventList/'+ dogID);
    
            folder.once('value',function(snapshot){
                snapshot.forEach(function(childSnapshot){
                   var childData = childSnapshot.val();
                    //console.log(key);
                    document.getElementById("notes").innerHTML = childData.note.toString();
                    document.getElementById("userName").innerHTML = "Robin Dhakal"
                    document.getElementById("time").innerHTML = childData.time.toString();
    
                    //console.log(childData.notes);
                    //console.log(childData.time);
                    return true;
                })
               
            })
        })
        //console.log(dogID);
        return dogID;
    // folder = fbDatabase.ref('/dogsInfo/'+ dogKey);
    // folder.once('value',function(snapshot){
    //     console.log(snapshot.val());
    //     document.getElementById("dogName").innerHTML = snapshot.val().name;
    //     })
    
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
	displayEvents(dogID);
	
}

    function displayEvents(dogID){

        var reftoDIV = 	document.getElementById("innerDIV");
        reftoDIV.innerHTML = myCode;

        var folder = fbDatabase.ref('/eventList/'+ dogID);

        folder.once('value',function(snapshot){
            snapshot.forEach(function(childSnapshot){
               var childData = childSnapshot.val();
                //console.log(key);
                document.getElementById("notes").innerHTML = childData.note.toString();
                document.getElementById("userName").innerHTML = "Robin Dhakal"
                document.getElementById("time").innerHTML = childData.time.toString();

                console.log(childData.notes);
                console.log(childData.time);
                return true;
            })
           
        })
        
       
        
    }

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

            /*
             * TODO: display user data somewhere in front end
             *
             */
            var dog = displayDatas(userID);
           // console.log(dog)
          // displayEvents(dog);
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

//
//function hello(){
//document.getElementById("innerDIV").innerHTML = myCode;
//}