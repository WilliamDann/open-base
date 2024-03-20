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

    formatTags(base)
    {
        const re = /\[(.*?)\]/gm
        return base.replaceAll(re, '<span class="tagText">$&</span>');
    }

    formatMoves(base)
    {
        const re = /((\d{1,}\.\s?)?(([Oo0](-[Oo0]){1,2}|[KQRBN]?[a-h]?[1-8]?x?[a-h][1-8](\=[QRBN])?[+#]?(\s(1-0|0-1|1\/2-1\/2))?)\s?){1,2})+(?![^{]*})/g
        return base.replaceAll(re, '<span class="moveText">$&</span>')
    }

    draw()
    {
        let base = window.position.getGame().pgn();
        base     = this.formatTags(base);
        base     = this.formatMoves(base);
        
        this.elem.innerHTML = base;
    }

    clear()
    {
        this.elem.innerHTML = "";
    }
}