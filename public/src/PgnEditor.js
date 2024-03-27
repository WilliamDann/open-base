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

    moveText(text)
    {
        let e = document.createElement('span')
        e.innerHTML = text;
        return e;
    }

    /**
     * Creates an HTML element for a move
     * @param {MoveTreeNode} node Node in the tree
     */
    drawMove(node)
    {
        // draw move text
        let move = document.createElement('span');

        move.innerHTML = node.move.replace(/\d{1,}\.\.\.\s/g, '') + ' ';
        move.className = 'moveText';

        this.elem.appendChild(move);
        if (node.getBoard().turn() == 'w')
            this.elem.appendChild(document.createElement('br'));

        // draw comment
        if (node.comment)
        {
            let comment = document.createElement('span');
    
            comment.innerHTML = `{${node.comment}} `;
            comment.className = 'commentText';
            
            this.elem.appendChild(comment);
        }
    }

    drawMoves()
    {
        let cursor = window.moveTree;
        while (cursor.children.length != 0)
        {
            if (cursor.move)
                this.drawMove(cursor);
            cursor = cursor.children[0];
        }
        this.drawMove(cursor);
    }

    draw()
    {
        this.drawMoves(this.elem)
    }

    clear()
    {
        this.elem.innerHTML = "";
    }
}