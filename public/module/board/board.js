class Board
{
    constructor(x=8, y=8)
    {
        this.x = x;
        this.y = y;
    }

    /**
     * Draws a file of a chessbaord
     * @param {boolean} white If the first square of the file is white
     * @returns {HTMLElement} HTML Element container for the file's squares
     */
    drawFile(white)
    {
        let file = document.createElement('div');
        file.className = 'file';

        for (let i = 0; i < this.y; i++)
        {
            let square = document.createElement('div');
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
            elem.appendChild(this.drawFile(white));
            white = !white;
        }
    }
}