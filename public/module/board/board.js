import { Chess } from '../../../node_modules/chess.js/dist/esm/chess.js'

/**
 * Called when a square has a mouse down event
 * @param {Event} e 
 */
function onSquareDown(e)
{
    e.preventDefault();
    window.boardclick = e.target.parentElement.id;

    let hover = document.querySelector('.pieceGrab')
    if (e.target.src)
    {
        hover.src = e.target.src;
        hover.style.display = 'block';
    }
}

/**
 * Called when a square has a mouse up event
 * @param {Event} e 
 */
function onSquareUp(e)
{
    e.preventDefault();

    let to;
    if (!e.target.id)
        to = e.target.parentElement.id;
    else
        to = e.target.id;

    let hover = document.querySelector('.pieceGrab')
    hover.src = '';
    hover.style.display = 'none';

    // make move and update state
    if (window.position.addMove(`${window.boardclick}${to}`))
    {
        // advance to the new move
        window.position = window.position.children[0];

        // fire update event
        window.dispatchEvent(new Event('boardupdate'));
    }
    
    window.redo = [];
}

export default class Board
{
    /**
     * Class to control a board
     * @param {HTMLElement} board The board container element
     * @param {number} x x size of the board (default 8)
     * @param {number} y y size of the board (default 8)
     */
    constructor(board, x=8, y=8)
    {
        this.board = board;
        this.x = x;
        this.y = y;
        this.flipped = false;
    }

    /**
     * Clear the board container
     */
    clear()
    {
        this.board.innerHTML = "";
    }

    /**
     * Sets the board to a given position using a fen string
     * @param {string} fen FEN string of the desired position
     */
    setFEN(fen)
    {
        let chess = new Chess(fen);
        for (let piece of chess.board().flat().filter(x => x!= null))
        {   
            let elem = document.createElement('img');
            elem.className = 'piece';
            elem.src = `../img/alpha/${piece.color}${piece.type.charAt(0).toUpperCase()}.svg` // TODO themes
            elem.width = "64";
            elem.height = "64";

            document.querySelector(`#${piece.square}`).appendChild(elem);
        }
    }

    /**
     * Draws a file of a chessbaord
     * @param {string} file The name of the current file
     * @param {boolean} white If the first square of the file is white
     * @returns {HTMLElement} HTML Element container for the file's squares
     */
    drawFile(fileName, white)
    {
        let file = document.createElement('div');
        file.className = 'file';

        for (let i = this.y; i > 0; i--)
        {
            file.appendChild(this.drawSquare(`${fileName}${i}`, white));
            white = !white;
        }

        return file;
    }

    /**
     * Create an html element for a square
     * @param {string} name Name of the square
     * @param {boolean} white if the square is white
     * @returns {HTMLElement}
     */
    drawSquare(name, white)
    {
        let square = document.createElement('div');
        square.id  = name;

        square.addEventListener('mousedown', onSquareDown);
        square.addEventListener('mouseup', onSquareUp);

        square.className = 'square ' + (white ? 'light' : 'dark');
        return square
    }

    /**
     * Draws an HTML board inside a container element
     * @param {HTMLElement} elem HTML element container for the board
     */
    draw()
    {
        let white = true;
        for (let i = 0; i < this.x; i++)
        {
            this.board.appendChild(this.drawFile(String.fromCharCode(97+i), white));
            white = !white;
        }

        if (this.flipped)
            this.flipBoard();
    }

    /**
     * spins the board around after it's drawn
     */
    flipBoard()
    {
        let files = [];

        const flipFile = file => {
            let squares = [];
            
            for (let square of file.childNodes)
                squares.push(square);
            file.innerHTML = "";

            while (squares.length > 0)
                file.appendChild(squares.pop());

            return file;
        }

        for (let file of this.board.childNodes)
            files.push(flipFile(file));
        this.board.innerHTML = '';
        
        while (files.length > 0)
            this.board.appendChild(files.pop());
    }

    /**
     * Sets the board to flipped position
     */
    flip()
    {
        this.flipBoard();
        this.flipped = !this.flipped;
    }
}