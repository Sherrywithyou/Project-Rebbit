/*global $*/
/*global firebase*/
/*global moment*/
$(document).ready(function() {
    //initialize firebase
    const config={
      apiKey: "AIzaSyCA5s_nQhuIx_IDnMICakN0tFwSaI0A2mo",
      authDomain: "test-490bb.firebaseapp.com",
      databaseURL: "https://test-490bb.firebaseio.com",
      storageBucket: "test-490bb.appspot.com",
      messagingSenderId: "1070161818002"
    };
    firebase.initializeApp(config);
  
    //usr login
    $(document).on('click',"#signin",function(){
      var email= this.form.usr.value;
	  	var password= this.form.pwd.value;
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        
        var errorMessage = error.message;
        alert(errorMessage);
        // ...
      });
    });  
    
    //gitHub signin
    $(document).on('click',"#gitHub",function(){
       var provider = new firebase.auth.GithubAuthProvider();
       firebase.auth().signInWithPopup(provider).then(function(result) {
       // This gives you a GitHub Access Token. You can use it to access the GitHub API.
       var token = result.credential.accessToken;
       var user = result.user;
       // ...
    }).catch(function(error) {
       // Handle Errors here.
       var errorCode = error.code;
       var errorMessage = error.message;
       // The email of the user's account used.
       var email = error.email;
       // The firebase.auth.AuthCredential type that was used.
       var credential = error.credential;
       // ...
       });
    });
    
    
    //google signin
    $(document).on('click',"#google",function(){
       var provider = new firebase.auth.GoogleAuthProvider();
       firebase.auth().signInWithPopup(provider).then(function(result) {
       // This gives you a Google Access Token. You can use it to access the Google API.
       var token = result.credential.accessToken;
       // The signed-in user info.
       var user = result.user;
       // ...
    }).catch(function(error) {
       // Handle Errors here.
       var errorCode = error.code;
       var errorMessage = error.message;
       // The email of the user's account used.
       var email = error.email;
       // The firebase.auth.AuthCredential type that was used.
       var credential = error.credential;
       // ...
       });
    });  


    //facebook signin
    $(document).on('click',"#facebook",function(){
       var provider = new firebase.auth.FacebookAuthProvider();
       firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
      });
    });      
    
    //twitter signin
    $(document).on('click',"#twitter",function(){
       var provider = new firebase.auth.TwitterAuthProvider();
       firebase.auth().signInWithPopup(provider).then(function(result) {
         // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
         // You can use these server side with your app's credentials to access the Twitter API.
         var token = result.credential.accessToken;
         var secret = result.credential.secret;
         // The signed-in user info.
         var user = result.user;
         // ...
         
       }).catch(function(error) {
         // Handle Errors here.
         var errorCode = error.code;
         var errorMessage = error.message;
         // The email of the user's account used.
         var email = error.email;
         // The firebase.auth.AuthCredential type that was used.
         var credential = error.credential;
         // ...
       });
    });  
    
    //create user account
    $(document).on('click',"#signup",function(){
      var email= this.form.usr.value;
	  	var password= this.form.pwd.value;
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorMessage = error.message;
        alert(errorMessage);
        // ...
      });
    });  
    
    //user signout
    $("#signout").click(function(){
      firebase.auth().signOut();
    }); 


    //send message
    $(document).on('click','#sendMsg',function(){
      if(this.form.msg.value==0){
        alert('Message cant be void');
      }else{
      var user = firebase.auth().currentUser;
      var uid;
      var email;
      var current = document.querySelectorAll('.current');
      var tid=$(current[0]).attr('id').split('_');
      var selectedTopicId=tid[1];
      if (user != null){
        uid=user.uid;
        email=user.email;
      }
      firebase.database().ref().child('topics').child(selectedTopicId.toString()).child('messages').push({
          sender : uid,
          content : this.form.msg.value ,
          emailAddress : email,
          time : firebase.database.ServerValue.TIMESTAMP
      }); 
      $("input:text").val("");
      document.getElementById('myModal2').style.display = "none";
      }
    }); 
    
    // edit message
    $(document).on('click','#update',function(){
      if (this.form.edit.value==0){
        alert('Message cant be void');
      }else{
      var user = firebase.auth().currentUser;
      var uid;
      var email;
      var current = document.querySelectorAll('.current');
      var tid=$(current[0]).attr('id').split('_');
      var mid=$(current[1]).attr('id');
      var selectedTopicId=tid[1];
      var selectedMsgId=mid;
      current[0].classList.toggle('record');
      var updatedContent= this.form.edit.value;
      if (user != null){
        uid=user.uid;
        email=user.email;
      }
      var senderPath = firebase.database().ref().child('topics').child(selectedTopicId.toString()).child('messages').child(selectedMsgId.toString());
      senderPath.once('value').then(function(snapshot) {
        var senderID = snapshot.val().sender;
        if(uid==senderID){
          firebase.database().ref().child('topics').child(selectedTopicId.toString()).child('messages').child(selectedMsgId.toString()).set({
              content : updatedContent,
              sender : uid,
              emailAddress : email,
              time : firebase.database.ServerValue.TIMESTAMP
          });
          $("input:text").val("");
          document.getElementById('myModal1').style.display = "none";
          current[1].classList.toggle('current');
        }else{
          alert("It's not your message!");
        }        
      });
      }
    }); 
    
    // delete message
    $(document).on('click','#delete',function(){
      var user = firebase.auth().currentUser;
      var uid;
      var current = document.querySelectorAll('.current');
      var tid=$(current[0]).attr('id').split('_');
      var mid=$(current[1]).attr('id');
      var selectedTopicId=tid[1];
      var selectedMsgId=mid;
      if (user != null){
        uid=user.uid;
      }
      var senderPath = firebase.database().ref().child('topics').child(selectedTopicId.toString()).child('messages').child(selectedMsgId.toString());
      senderPath.once('value').then(function(snapshot) {
        var senderID = snapshot.val().sender;
        if(uid==senderID){
          firebase.database().ref().child('topics').child(selectedTopicId.toString()).child('messages').child(selectedMsgId.toString()).remove();
          document.getElementById('myModal1').style.display = "none";
          current[1].classList.toggle('current');
        }else{
          alert("It's not your message!");
        }        
      });
    });     
  
  //disable guess form input from refresh
  $("input").bind("keypress", function(e) {
    if (e.keyCode == 13) {
      return false;
    }
  });  
  $("#msg").bind("keypress", function(e) {
    if (e.keyCode == 13) {
      $("#sendMsg").click();
      return false;
    }
  });   
  $("#edit").bind("keypress", function(e) {
    if (e.keyCode == 13) {
      $("#update").click();
      return false;
    }
  });  

  //toggle message
  //only display one topic content at a time
  $(document).on('click','.topicBox',function(){
    var x = document.querySelectorAll('.topicBox');
    var i;
    /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
    for(i=0;i<x.length;i++){
      if(x[i].classList.contains('active')){
        x[i].classList.toggle('active');
        x[i].classList.toggle('current');
        var msgs=x[i].nextElementSibling;
        if (msgs.style.display === "block") {
            msgs.style.display = "none";
        } 
            
      }
    }
    this.classList.toggle("active");
    this.classList.toggle('current');
    /* Toggle between hiding and showing  the active panel */
    var messages = this.nextElementSibling;
    if (messages.style.display === "block") {
        messages.style.display = "none";
    } else {
        messages.style.display = "block";
        $(messages).css('background-color', 'transparent');
    }
  });
  
  //modal for update and delete message
  $(document).on('click','.msgBox',function(){
    // Get the modal
    var current = this;
    current.classList.toggle('current');
    var modal = document.getElementById('myModal1');
    // Get the button that opens the modal
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks on the button, open the modal 
    modal.style.display = "block";
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        current.classList.toggle('current');
        modal.style.display = "none";
        
    };
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            current.classList.toggle('current');
        }
    };
  }); 
  
  //modal for add message to topic
  $(document).on('click','.addButton',function(){
    // Get the modal
    var current = this;
    current.classList.toggle('current');
    var modal = document.getElementById('myModal2');
    // Get the button that opens the modal
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[1];
    // When the user clicks on the button, open the modal 
    modal.style.display = "block";
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        current.classList.toggle('current');
        modal.style.display = "none";
        
    };
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            current.classList.toggle('current');
        }
    };
  }); 

      

      
      
  // Event onAuthStateChanged
  firebase.auth().onAuthStateChanged(firebaseUser =>{
    if(firebaseUser){
      
      var loggedinHtml=`<h1 id="loggedinHtml" style='margin: auto;text-align:center; font-size: 2em'>Welcome Back, ${firebaseUser.email}</h1>`;
      $('#loginForm').html(loggedinHtml);
      $("#signout").show();
      $("#signup").hide();
      $("#signin").hide();
      $("#loggedIn").show();
      $("#usr").hide();
      $("#pwd").hide();
      //load firebase database
      const topics = firebase.database().ref().child('topics');
      topics.on('value', function(snapshot) {
        document.querySelector("#realTopics").innerHTML="";
        var topic=[snapshot.val()];
        display_topics(topic);

        
      });
      


    }else{
      var formHtml='<div class="imgcontainer"><img src="image/forumlogo.png" alt="Avatar" class="avatar"></div> Email: <input type="text"   id ="usr"><br> password: <input type="password"   id = "pwd"><br> <input type="button" value="Sign Up" id="signup"><input type="button" value="Sign In" id="signin"><div style="text-align: center;"><i id="gitHub" class="fa fa-github fa-4x fa-inverse"></i><i id="facebook" class="fa fa-facebook-official fa-4x fa-inverse"></i><i id="google" class="fa fa-google-plus-official fa-4x fa-inverse"></i><i id="twitter" class="fa fa-twitter fa-4x fa-inverse"></i></div>';
      $('#loginForm').html(formHtml);
      console.log("not logged in");
      $("#usr").show();
      $("#pwd").show();
      $("#signout").hide();
      $("#signup").show();
      $("#signin").show();
      $("#loggedIn").hide();
      $("#topics").empty();
      
      
    }
  });

  
  
  //nodejs REST API
  //userless right now
  $("#test").click(function(){
		var data = {};
		data.usr = this.form.usr.value;
		data.pwd = this.form.pwd.value;
    $.ajax({url: "/signUp", 
    type: "POST",
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function(result){
        console.log(JSON.stringify(result));
        $("p").text(JSON.stringify(result));
    }});
  });
});


//functions
//display topics and message

var display_topics = function(topic){
    //code here for displaying topics    
    var array=topic[0];

    
    for (var key in array) {
      // skip loop if the property is from prototype
      if (!array.hasOwnProperty(key)) continue;
      var obj = array[key];
      // skip loop if the property is from prototype
      var name = obj.tname;
      var li_template;
      li_template = `<button id = 'topic_${key}' class="topicBox" >${ name }</button><ul id = 'ul_${key}'  class='messages' style='background-color: transparent;'>`;
      
      var messages=obj.messages;
      //display messages
      for (var msg in messages){
        var mid=msg;
        var content=messages[mid].content;
        var email = messages[mid].emailAddress;
        var usrname=email.split('@');
        var timestamp = messages[mid].time;
        var date = moment(timestamp).format('LLL');
        li_template +=`<li><button  class="msgBox" id="${mid}">${usrname[0]}: <span style="font-weight:bold;font-size: 2em;">${content}</span><span style="font-size: 0.8em"> at ${date}</span></button>`;
      }
      li_template += `<li><button class="addButton" id="add_${key}"><span style="font-weight:bold;font-size: 2em;">Add Message</span></button>`;
      li_template += `</ul>`;
      document.querySelector("#realTopics").innerHTML += li_template;
      li_template = '';
    }    
};

