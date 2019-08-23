// Render Google Sign-in button

    function renderButton() {
        gapi.signin2.render('gSignIn', {
            'scope': 'profile email',
            'width': 240,
            'height': 50,
            'longtitle': true,
            'theme': 'dark',
            'onsuccess': onSuccess,
            'onfailure': onFailure
        });
    }

// Sign-in success callback
    function onSuccess(googleUser) {
        // Get the Google profile data (basic)
        //var profile = googleUser.getBasicProfile();
        
        // Retrieve the Google account data
        gapi.client.load('oauth2', 'v2', function () {
            let request = gapi.client.oauth2.userinfo.get({
                'userId': 'me'
            });
            request.execute(function (resp) {
                // Display the user details
                let profileHTML = '<h3>Welcome '+resp.given_name+'! <a href="javascript:void(0);" onclick="signOut();">Sign out</a></h3>';
                profileHTML += '<p>Hello,'+resp.name+'</p>';
                document.getElementsByClassName("userContent")[0].innerHTML = profileHTML;
                document.getElementById("gSignIn").style.display = "none";
                document.getElementsByClassName("userContent")[0].style.display = "block";
                document.getElementById('start').style.display = "inline-block";
            });
        });
    }

// Sign-in failure callback
    function onFailure(error) {
        alert(error);
    }

// Sign out the user
    function signOut() {
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            document.getElementsByClassName("userContent")[0].innerHTML = '';
            document.getElementsByClassName("userContent")[0].style.display = "none";
            document.getElementById("gSignIn").style.display = "block";
        });
        
        auth2.disconnect();
        document.getElementById('start').style.display = "none";
    }
    



