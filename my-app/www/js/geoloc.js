$(function(){
    // addEventListener support for IE8
    function bindEvent(element, eventName, eventHandler) {
        if (element.addEventListener) {
            console.log('Added Event');
            element.addEventListener(eventName, eventHandler, false);
        } else if (element.attachEvent) {
            console.log('Event Attached');
            element.attachEvent('on' + eventName, eventHandler);
        }else{        
            console.log('Not attached');
        }
    }

    // Send a message to the parent
    var sendMessage = function (msg) {
        // Make sure you are sending a string, and to stringify JSON
        window.parent.postMessage(msg, '*');
    };

    var results = document.getElementById('results'),
        messageButton = document.getElementById('message_button');

    checking_location = false;
    // Listen to messages from parent window
    bindEvent(window, 'message', function (e) {
        //results.innerHTML = e.data;
        console.log(JSON.stringify(e.data));
        //$('#testtest').html(e.data);
        try{
            if(!checking_location){
                const coord = e.data;
                checking_location = true;
                $.ajax({
                    url: "http://34.74.113.124/telco_user/user/save_user_location",
                    method: "POST",
                    data: { 
                        latitude: coord['coords']['latitude'], 
                        longitude: coord['coords']['longitude'], 
                        speed: coord['coords']['speed'], 
                        timestamp: coord['timestamp']
                    },
                    success: function (data) {
                        checking_location = false;
                    },
                    error: function(e){
                        console.log(e);
                        checking_location = false;
                    }
                });
            }
        }catch(ex){
            checking_location = false;
            console.log(ex);
        }
    });
    
});