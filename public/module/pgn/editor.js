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

    drawMove(whiteMove, blackMove)
    {
        let moveContainer = document.createElement('div');
        moveContainer.className = 'move';

        moveContainer.appendChild(this.drawPly(whiteMove));
        moveContainer.appendChild(this.drawPly(blackMove));
        
        return moveContainer;
    }

    draw()
    {
        let moves = window.chess.history();
        for (let i = 0; i < moves.length; i+=2)
            this.elem.appendChild(this.drawMove(moves[i], moves[i+1]));
    }

    clear()
    {
        this.elem.innerHTML = "";
    }
}