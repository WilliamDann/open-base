import { Chess } from '../../../node_modules/chess.js/dist/esm/chess.js'

export default class Editor
{
    /**
     * Manage the PGN editor
     * @param {HTMLElement} elem The html element container for the editor
     */
    constructor(elem)
    {
        this.elem = elem;
    }

    drawPly(moveText)
    {
        if (!moveText)
            moveText = "__";

        let ply = document.createElement('div');
        ply.className = 'ply';
        ply.appendChild(document.createTextNode(moveText));
        return ply;
    }

    drawMove(number, whiteMove, blackMove)
    {
        let moveContainer = document.createElement('div');
        moveContainer.className = 'move';
        moveContainer.id        = `move_${number}`

        moveContainer.appendChild(this.drawPly(whiteMove));
        moveContainer.appendChild(this.drawPly(blackMove));
        
        return moveContainer;
    }

    drawComments()
    {
        for (let comment of window.chess.getComments())
        {
            let move = new Chess(comment.fen).moveNumber();
            let elem = document.querySelector(`#move_${move}`)
            elem.appendChild(document.createElement('br'));
            elem.appendChild(document.createTextNode(comment.comment.replace('\n', '<br>')));
        }
    }

    draw()
    {
        let moves = window.chess.history();
        let move  = 1;
        for (let i = 0; i < moves.length; i+=2, move++)
            this.elem.appendChild(this.drawMove(move, moves[i], moves[i+1]));
        this.drawComments();
    }

    clear()
    {
        this.elem.innerHTML = "";
    }
}