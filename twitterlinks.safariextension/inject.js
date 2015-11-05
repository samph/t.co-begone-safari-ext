function handleMessage(msgEvent){
	var messageName = msgEvent.name;
	var messageData = msgEvent.message;
	if(messageName === "activateMyScript"){
		if(messageData === "stop"){
			//stop
		}
		if(messageData === "start"){
			startIt();
		}
	}
	if(messageName === "theAnswer"){
		var url = window.location.href;
		if(containsTwitterDomain(url)){
			console.log("long url is " + messageData[1] + " for " + messageData[0] );
			//There is almost certainly a better way to do this.
			//Going through every link again is madness.

			var links = document.querySelectorAll("a[href=\""+messageData[0]+"\"]");
			for(j =0; j<links.length; j++){
				console.log("swapping " + messageData[0] + " for " + messageData[1] );
				links[j].href = messageData[1];
				links[j].title = messageData[1];
			}
		}
	}
}

function startIt(){
	//Check that we're on twitter
	var url = window.location.href;
	if(containsTwitterDomain(url)){
		var links = document.body.getElementsByTagName("a");
		if(links.length>0){
			for (i =0, len = links.length; i< len; i++ ){
				if(links[i].href && links[i].title && startsWithHTTP(links[i].title) && startsWithHTTP(links[i].href)){
					console.log("title - " + links[i].title + " href - " + links[i].href)
					var domain = extractDomain(links[i].title);

					if(shorteners.indexOf(domain)>0)	{
						console.log("Supported shortener " + domain + " seen! " + links[i].title);
						var requestUrl = "http://api.longurl.org/v2/expand?format=json&url=" + encodeURIComponent(links[i].title);
						console.log("Sending request for long version of " + links[i].title)
						var input = [requestUrl, links[i].title];
						safari.self.tab.dispatchMessage("sendQuestion",input);
					}	
					links[i].href = links[i].title
				}
			}
		}
	}else{
		//console.log("This isn't twitter!")
	}
}

function startsWithHTTP(data){
	if((/^http/).test(data))
		return true
}

function containsTwitterDomain(data){
	//Figure out how to escape in js regex.
	if((/twitter.com/).test(data))
		return true
}

function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}

//not using full list supported by longurl.org yet.
var shorteners = ["ow.ly", "bit.ly", "wp.me", "j.mp"];


safari.self.addEventListener("message", handleMessage, false);
