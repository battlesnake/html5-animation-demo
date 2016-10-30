(function(){
'use strict';

	// Useful sites if you're new to animation:
	//  * MDN
	//    - https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations
	//    - https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
	//  * CSS-Tricks
	//    - https://css-tricks.com/snippets/css/keyframe-animation-syntax/
	//    - https://css-tricks.com/almanac/properties/a/animation/
	//    - https://css-tricks.com/myth-busting-css-animations-vs-javascript/
	//    - https://css-tricks.com/snippets/css/keyframe-animation-syntax/

	/* When the page has loaded, initialise the animation */
	window.addEventListener('load', initAnimation);

	/* Angles are in RADIANS! */
	var angle;
	/* Speed (radians per second, to increase angle) */
	var speed;
	/* Time of previous frame */
	var previous_frame_time;
	/* Drawing context */
	var context;
	/* Canvas */
	var canvas;
	/* Speed control */
	var speedEntryBox;

	/* Return timestamp in seconds */
	function getTime() {
		return new Date().getTime() / 1000;
	}

	/* This function initialises the animation */
	function initAnimation() {
		/* Set initial angle */
		angle = 0;
		/* Set initial speed (radians per second) */
		speed = 2;
		/* Set time of last frame to current time */
		previous_frame_time = getTime();
		/* Bind speed control and set initial value */
		speedEntryBox = document.getElementById('speed');
		speedEntryBox.value = speed;
		speedEntryBox.addEventListener('input', speedChanged);
		speedEntryBox.addEventListener('paste', speedChanged);
		/* Get drawing stuff */
		canvas = document.querySelector('canvas');
		context = canvas.getContext('2d');
		/* Render first frame */
		renderFrame();
	}

	/* Called when value of speed box changes */
	function speedChanged() {
		var value = speedEntryBox.value;
		if (+value > 0) {
			speed = value;
		}
	}

	/* Renders a frame of the animation */
	function renderFrame() {
		/* Update canvas size, also causes canvas to clear */
		/*
		 * The animation is designed to be a certain size, but the canvas may
		 * be a different size since we allow the user to resize it, so we need
		 * to calculate the canvas buffer size in such a way that it:
		 *  - is the smallest size which can still completely fit the animation.
		 *  - is the same aspect as the canvas itself, so that the animation
		 *    does not appear stretched or squashed.
		 */

		var animationWidth = 800;
		var animationHeight = 800;
		var animationAspect = animationWidth / animationHeight;

		var realWidth = canvas.offsetWidth;
		var realHeight = canvas.offsetHeight;
		var realAspect = realWidth / realHeight;

		var canvasWidth = realAspect > animationAspect ? realAspect * animationWidth : animationWidth;
		var canvasHeight = realAspect < animationAspect ? animationHeight / realAspect : animationHeight;

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		/* Current time */
		var now = getTime();
		/* Time since previous frame */
		var delta_t = now - previous_frame_time;

		/* Step animation forward, wrap around at 2*PI radians */
		angle = (angle + speed * delta_t) % (2 * Math.PI);

		// Draw your stuff here.


		/*** Begin example animation code ***/

		/* Set the line style */
		context.lineCap = 'round';
		context.lineJoin = 'round';

		/* Start the path in the middle of the canvas */
		var x = canvasWidth / 2, y = canvasHeight / 2;
		context.moveTo(x, y);

		/* In this case, I just trace out a circle by using sine+cosine */
		var cs = Math.cos(angle), sn = Math.sin(angle);
		context.strokeStyle = 'blue';
		context.lineWidth = 25;
		x += 80 * cs;
		y += 80 * sn;
		context.lineTo(x, y);
		context.stroke();

		/* For fun, I added two more arms to the end which spin faster */
		/* These should draw an Estonian flag on the first arm */

		var cs2 = Math.cos(angle*3), sn2 = Math.sin(angle*3);
		context.strokeStyle = 'black';
		context.lineWidth = 15;
		x += 60 * sn2;
		y += 60 * cs2;
		context.lineTo(x, y);
		context.stroke();

		var cs3 = Math.cos(angle*6), sn3 = Math.sin(angle*6);
		context.strokeStyle = '#ddd';
		context.lineWidth = 5;
		x += 40 * cs3;
		y += 40 * sn3;
		context.lineTo(x, y);
		context.stroke();

		/*** End example animation code ***/


		/* Store time of this frame */
		previous_frame_time = now;

		/* Request the next frame */
		window.requestAnimationFrame(renderFrame);
	}

})();
