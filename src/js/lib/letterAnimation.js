let WIDTH; // px
let HEIGHT; // px
let LETTER_WIDTH = 431; // px
let LETTER_HEIGHT = 351; // px
const SECS_PER_FRAME = 10; // sec/frame
const GRAVITY = 3; // pixels/sec^2
const DAMPENING = 0.9;

class Letter {
	constructor(ctx, image, shadow, x, y) {
		this._ctx = ctx;
		this._image = image;
		this._shadow = shadow;
		this.x = x;
		this.y = y;
		this._positions = [];
	}

	_logLetterPosition(x, y) {
		this._positions.push([x, y]);
	}

	draw() {
		this._ctx.clearRect(0,0, WIDTH,HEIGHT);
		this._logLetterPosition(this.x, this.y);
		this.drawShadow();
		this._ctx.drawImage(this._image, this.x, this.y, LETTER_WIDTH, LETTER_HEIGHT);
	}

	drawShadow() {
		for (let i = 0; i < this._positions.length; i += 2) {
			this._ctx.drawImage(this._shadow, this._positions[i][0], this._positions[i][1], LETTER_WIDTH, LETTER_HEIGHT);
		}
	}

	isOffscreen() {
		return this.x <= -LETTER_WIDTH || this.x < 10;
	}
}

class LetterAnimation {
	constructor(letter, dx, dy) {
		this.letter = letter;
		this.dx = dx;
		this.dy = dy;
	}
	/**
   * Take a step of animation (frame).
   * @returns true if the letter's animation is done, false otherwise
   */
	step() {
		// Return false to indicate that the letter should no longer be animated
		if (this.letter.isOffscreen()) {
			return false;
		}
		// Update letter position with velocity
		this.letter.x += this.dx;
		this.letter.y += this.dy;

		// If we've hit (or passed) the floor, bounce
		if (this.letter.y + LETTER_HEIGHT >= HEIGHT) {
			this.dy *= -DAMPENING;

			// Prevent letter from getting stuck below the floor (which very
			// quickly dampens dy to 0)
			this.letter.y = HEIGHT - LETTER_HEIGHT;
		} else {
			// Otherwise, apply gravity
			this.dy += GRAVITY / SECS_PER_FRAME;
		}

		this.letter.draw();

		// The letter moved in this frame, so we may have more to animate
		return true;
	}
}

class Animation {
	constructor(remainingLetters) {
		this._remainingLetters = remainingLetters;
		this._remainder = 0;
	}

	/**
   * Update the individual letter animations one at a time (frame by frame)
   * until complete (or there isn't enough delta left to proceed to the
   * next frame). Keeps track of remainder delta for next call to update.
   *.
   * @returns true if there still are letters to animate
   */
	update(delta) {
		// Include sub SEC_PER_FRAME time from last update
		delta += this._remainder;

		while (this._remainingLetters.length > 0 && delta >= SECS_PER_FRAME) {
			const letter = this._remainingLetters[this._remainingLetters.length - 1];

			if (!letter.step()) {
				// When letters don't animate, they are offscreen. So, we can
				// proceed to animating the next letter
				this._remainingLetters.pop();
			} else {
				// We discretize the delta into frames of length SEC_PER_FRAME
				delta -= SECS_PER_FRAME;
			}
		}

		// Keep track of any leftover time for the next update
		this._remainder = delta;
		return this._remainingLetters.length > 0;
	}
}

/**
 * Starts the letter bounce animation.
 * @param letter that will be animated.
 */
function startAnimation(letter) {
	let dx = -5;
	let dy = 0;
	const letterAnimations = new LetterAnimation(letter, dx, dy);
	const animation = new Animation([letterAnimations]);

	// Start updating the animation
	let last = null;

	window.requestAnimationFrame(function update(now) {
		const delta = now - (last === null ? now : last);
		last = now;

		// Continue animating if there are cards left
		if (animation.update(delta)) {
			window.requestAnimationFrame(update);
		}
	});
}

export default function drawCanvas(w, h) {
	WIDTH = w;
	HEIGHT = h;
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	// Setup canvas
	canvas.width = WIDTH;
	canvas.height = HEIGHT;

	// Original art is very pixel-y
	ctx.imageSmoothingEnabled = false;

	// Create main letter image and shadow letter image:
	const image = new Image();
	const shadow = new Image();
	// Depending on canvas size letter must have different sizes
	if(w > 770) {
		image.src = './img/canvas/b_colored.png';
		shadow.src = './img/canvas/b_white.png';
	}
	if(w > 500 && w <= 770) {
		image.src = './img/canvas/b_colored.png';
		shadow.src = './img/canvas/b_white.png';
		LETTER_WIDTH = 300;
		LETTER_HEIGHT = 245;
	}
	if(w <= 500) {
		LETTER_WIDTH = 174;
		LETTER_HEIGHT = 142;
		image.src = './img/canvas/b_colored_sm.png';
		shadow.src = './img/canvas/b_white_sm.png';
	}

	const letter = new Letter(ctx, image, shadow, WIDTH, 0);
	startAnimation(letter);
}
