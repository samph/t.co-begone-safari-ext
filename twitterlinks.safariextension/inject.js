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
					links[i].href = links[i].title
				}
			}
		}
	}else{
		console.log("This isn't twitter!")
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


safari.self.addEventListener("message", handleMessage, false);