import { Chess } from '../../../node_modules/chess.js/dist/esm/chess.js'

export default class Board
{
    constructor(x=8, y=8)
    {
        this.x = x;
        this.y = y;
    }

    drawPieces(fen)
    {
        let chess = new Chess(fen);
        for (let piece of chess.board().flat().filter(x => x!= null))
        {   
            let elem = document.createElement('img');
            elem.className = 'piece';
            elem.src = `../img/alpha/${piece.color}${piece.type.charAt(0).toUpperCase()}.svg` // TODO themes
            elem.width = "64";
            elem.height = "64";

            document.querySelector(`#square_${piece.square}`).appendChild(elem);
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

        for (let i = 0; i < this.y; i++)
        {
            let square = document.createElement('div');
            square.id  = `square_${fileName}${i+1}`;

            square.className = 'square ' + (white ? 'light' : 'dark');
            white = !white;
            file.appendChild(square);
        }

        return file;
    }

    /**
     * Draws an HTML board inside a container element
     * @param {HTMLElement} elem HTML element container for the board
     */
    draw(elem)
    {
        let white = true;

        for (let i = 0; i < this.x; i++)
        {
            elem.appendChild(this.drawFile(String.fromCharCode(97+i), white));
            white = !white;
        }
    }
}