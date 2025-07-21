let startingTurn = true;
let excluded = [];
let userMoves = [];
let computerMoves = [];

// Buttons
const cell1 = document.getElementById("1");
const cell2 = document.getElementById("2");
const cell3 = document.getElementById("3");
const cell4 = document.getElementById("4");
const cell5 = document.getElementById("5");
const cell6 = document.getElementById("6");
const cell7 = document.getElementById("7");
const cell8 = document.getElementById("8");
const cell9 = document.getElementById("9");

// ID to element map for convenience
const cells = {
	1: cell1, 2: cell2, 3: cell3,
	4: cell4, 5: cell5, 6: cell6,
	7: cell7, 8: cell8, 9: cell9
};

// Reset and change who starts
const changeStartTurn = () => {
	startingTurn = !startingTurn;
	excluded = [];
	userMoves = [];
	computerMoves = [];

	for (let i = 1; i <= 9; i++) {
		cells[i].innerText = "";
		cells[i].disabled = false;
	}

	if (!startingTurn) {
		setTimeout(computerPress, 300);
	}
};

// When user presses
const pressed = (cellNumber) => {
	if (excluded.includes(cellNumber)) return;

	cells[cellNumber].innerText = "X";
	cells[cellNumber].disabled = true;
	excluded.push(cellNumber);
	userMoves.push(cellNumber);

	if (checkWin(userMoves)) {
		alert("You win!");
		disableAll();
		return;
	}

	if (excluded.length === 9) {
		alert("Draw!");
		return;
	}

	setTimeout(computerPress, 500);
};

// When computer plays
const computerPress = () => {
	let move = determineDanger();

	if (!move) move = getRandomExcluding(excluded);
	if (!move) return;

	cells[move].innerText = "O";
	cells[move].disabled = true;
	excluded.push(move);
	computerMoves.push(move);

	if (checkWin(computerMoves)) {
		alert("Computer wins!");
		disableAll();
	}
};

// Checks for win
const checkWin = (moves) => {
	const wins = [
		[1,2,3],[4,5,6],[7,8,9],
		[1,4,7],[2,5,8],[3,6,9],
		[1,5,9],[3,5,7]
	];
	return wins.some(combo => combo.every(n => moves.includes(n)));
};

// Try to block user
const determineDanger = () => {
	const wins = [
		[1,2,3],[4,5,6],[7,8,9],
		[1,4,7],[2,5,8],[3,6,9],
		[1,5,9],[3,5,7]
	];

	for (let combo of wins) {
		const userHits = combo.filter(c => userMoves.includes(c));
		const empty = combo.filter(c => !excluded.includes(c));
		if (userHits.length === 2 && empty.length === 1) {
			return empty[0];
		}
	}

	return null;
};

// Random move
function getRandomExcluding(excluded) {
	let available = [];
	for (let i = 1; i <= 9; i++) {
		if (!excluded.includes(i)) {
			available.push(i);
		}
	}
	if (available.length === 0) return null;
	return available[Math.floor(Math.random() * available.length)];
}

// Disable all buttons
function disableAll() {
	for (let i = 1; i <= 9; i++) {
		cells[i].disabled = true;
	}
}



