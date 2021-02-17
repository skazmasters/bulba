// utility fn to get a random character
// const randomChar = function() {
// 	return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1);
// }
function randomChar() {
	const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
	return letters[Math.floor(Math.random() * letters.length)];
}
// utility fn to get a random delay time
function randomTime() {
	return (Math.random() * (1 - 3500) + 3000);
}

// main fn
function scrambleFn(element) {
	let truth = element.textContent.split(''); // get letters
	let truthHTML = element.innerHTML;
	let newLetters = element.textContent.split('');
	let revert = []; // init empty kill switch array

	const ticker = setInterval( function() {
		// map over letters and replace with random or revert back to truth
		truth.map( (letter, i) => {
			// break if a space
			if (' \t\n\r\v'.indexOf(letter) > -1) return;
			// set new random letter
			newLetters[i] = randomChar();
			// set random timeout to make letters reset at different times
			setTimeout( function() {
				revert[i] = true;
			}, randomTime() );
			// reset individual letter if kill switch
			if ( revert[i] === true ) {
				newLetters[i] = truth[i];
			}
			// set html
			element.textContent = newLetters.join('');
		});
		// kill interval after all letter returned to normal to save stack
		let killCheck = (newLetters.length === truth.length) && newLetters.every(function(e, i) {
			return e === truth[i];
		});
		if ( killCheck ) {
			clearInterval(ticker); // stop looping
			element.innerHTML = truthHTML;
		}
	}, 40);
}
export default scrambleFn;
