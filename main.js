navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

var window.AudioContext = window.AudioContext || window.webkitAudioContext;

var context = new window.AudioContext();
navigator.getUserMedia({audio: true}, gotUserAudio, userAudioDenied);

function autoCorrelate(buf, sampleRate) {
	var MIN_SAMPLES = 4;
	var MAX_SAMPLES = 1000;
	var SIZE = 1000;
	var best_offset = -1;
	var best_correlation = 0;
	var rms = 0;
	var foundGoodCorrelation = false;

	if (buf.length < (SIZE + MAX_SAMPLES - MIN_SAMPLES))
		return -1; //not enough data

	for (var i =0;i<SIZE;i++) {
		var val = (buf[i] - 128)/128;
	}
	var lastCorrelation=1;
	for (var offset=MIN_SAMPLES;offset <= MAX_SAMPLES; offset++) {
		var correlation = 0;
		for (var i = 0;i<SIZE;i++) {
			correlation += Math.abs(((buf[i]-128)/128)-((buf[i+offset] - 128)/128));
		}
		correlation = 1 - (correlation/SIZE);
		if ((correlation>0.9) && (correlation > lastCorrelation))
			foundGoodCorrelation = true;
		else if (foundGoodCorrelation) {
			return sampleRate/best_offset;
		}
		lastCorrelation = correlation;
		if (correlation > best_correlation) {
			best_correlation = correlation;
			best_offset = offset;
		}
	}
	if (best_correlation > 0.01) {
		return sampleRate/best_offset;
	}
	return -1;
}

function gotUserAudio(stream) {
	sendMessage('Give us a whistle');
	var microphone = context.createMediaStreamSource(stream);
	var analyser = context.createAnalyser();
	microphone.connect(analyser);
	var freqDomain = new Float32Array(analyser.frequencyBinCount);
	analyser.getByteTimeDomainData(freqDomain);
	var pitch;
	window.setInterval(function(){
	    array = new Uint8Array(2048);
	    analyser.getByteTimeDomainData(array);

	    pitch = autoCorrelate(array, context.sampleRate)

	    if (pitch != 11025) {
	    	var pitchScore = Math.floor((pitch - 1000) / 100);
	    	//sendMessage(pitchScore); 
	    	if (pitchScore <= 11) {
	    		moveButterfly(pitchScore);                          
	    	};
	    };
	},50);
}

function userAudioDenied() {
	sendMessage('We can\'t hear you');
}

function moveButterfly(score) {


		sendMessage('');
		function drawBubbles(x,y,direction) {
			for (var i=0;i<20;i++) {
				var addX = Math.random() * 40;
				var addY = Math.random() * 100;
				if (direction==='down') {
					var circle = s.circle(x-addX,y-addY,20);
				} else {
					var circle = s.circle(x+addX,y+addY,20);
				}
				var color = '#'+Math.floor(Math.random()*16777215).toString(16);
				circle.attr({
				    fill: color,
				});
				circle.animate({r: 0},1000)				
			}

			var circle = s.circle(x,y,20);
			circle.attr({
			    fill: "#bada55",
			});
			circle.animate({r: 0},1000)
		}

		function move(y,direction) {
			var moveUp = true;
			var moveDown = true;
			var moveRight = true;
			var moveLeft = true;
			if (score >= 4) {
				var rotation = Math.floor(Math.random() * 140 - 70);
				//var calcRotation = rotation;
				var calcRotation = rotation;
			} else {
				var rotation = Math.floor(Math.random() * 140 + 110);
				var calcRotation = rotation - 110;
			}
			//if going up, calculate angle between -90/180 and 90
			//if going down, find angle between 90 and 180
			var y = 80;
			var rotationRadians = calcRotation * (Math.PI / 180);
			var moveX = Math.tan(rotationRadians) * y;
			//moveX = 0;
			if (($('.butterfly_box').offset().top + $('.butterfly_box').height() + y) > $(window).height()) {
				var moveDown = false;
				console.log('went off bottom');
				sendMessage('Whistle higher to ascend');
			} else if ($('.butterfly_box').offset().top - y < 0) {
				var moveUp = false;
				console.log('went off top');
				sendMessage('Whistle lower to go down');
			}
			if ($('.butterfly_box').offset().left + moveX < 0) {
				var moveLeft = false;
				console.log('went off left');			
			}
			if ($('.butterfly_box').offset().left + $('.butterfly_box').width() + moveX > $(window).width()) {
				var moveRight = false;
				console.log('went off left');
			}

			console.log($('.butterfly_box').queue('fx').length);
			if ($('.butterfly_box').queue('fx').length) {
				return;
			}
			console.log('new move added');
			y = 80;
			if (moveLeft === false || moveRight === false) {
				console.log('cancelling left or right move');
				moveX = 0;
			}
			if (direction === 'down' && moveDown) {
				$('.butterfly').transition({rotate:rotation,duration:100});
				$('.butterfly_box').transition({y:'+='+y,x:'+='+moveX,duration:500},'linear');	
				drawBubbles($('.butterfly_box').offset().left + $('.butterfly_box').width() / 2,$('.butterfly_box').offset().top + $('.butterfly_box').height() / 2, 'down');						
			} else if (direction === 'up' && moveUp) {
				drawBubbles($('.butterfly_box').offset().left + $('.butterfly_box').width() / 2,$('.butterfly_box').offset().top + $('.butterfly_box').height() / 2, 'up');
				$('.butterfly').transition({rotate:rotation,duration:100});
				$('.butterfly_box').transition({y:'-='+y,x:'+='+moveX,duration:500},'linear');
			}
		}
		switch (score) {
			case -1:
				move(10,'down')
			case 0:
				move(10,'down')
			case 1:
				move(10,'down')
				break;
			case 2:
				move(10,'down')
				break;
			case 3:
				move(10,'down')
				break;
			case 4:
				move(10,'up')
				break;
			case 5:
				move(10,'up')
				break;																
			case 6:
				move(10,'up')
				break;
			case 7:
				move(10,'up')
				break;
			case 8:
				move(10,'up')
				break;
			case 9:
				move(10,'up')
				break;		
			case 10:
				move(10,'up')			
				break;
			case 11:
				move(10,'up')			
				break;			
		}
}

function sendMessage(message) {	
	$('.message').fadeOut('slow', function() {
		$('.message').text(message).fadeIn('slow');
	});
}

var s;

$(document).ready(function() {
	sendMessage('We need to hear you');

	s = Snap('#canvas');	
});