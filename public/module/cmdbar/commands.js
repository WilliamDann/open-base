import { Chess } from '../../../node_modules/chess.js/dist/esm/chess.js'

class Command
{
    constructor(desc, func)
    {
        this.desc = desc;
        this.func = func;
    }
}

export let commands = 
{
    'Reset'  : new Command(
        'Reset the board position',
        () => {
            if (confirm("Reset the board position?"))
                window.chess = new Chess();
                window.dispatchEvent(new Event('boardupdate'))
        }
    ),

    'Refresh': new Command(
        'Emit a boardupdate event',
        () => {
            window.dispatchEvent(new Event('boardupdate'))
        }
    ),

    'Exit': new Command(
        'Exit the program',
        () => {
            close();
        }
    ),

    'Flip': new Command(
        'Flips the board',
        () => {
            window.board.flip();
        }
    ),

    'Undo': new Command(
        'Undo the last move',
        () =>
        {
            if (!window.redo)
                window.redo = [];
            window.redo.push(window.chess.undo());

            window.dispatchEvent(new Event('boardupdate'));
        }
    ),

    'Redo': new Command(
        'Undo the last undo',
        () =>
        {
            if (!window.redo || window.redo.length == 0)
                return;
            window.chess.move(window.redo.pop());
            window.dispatchEvent(new Event('boardupdate'));
        }
    )
}