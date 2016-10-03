/**
 * Created by alexandre on 03.10.2016.
 */


/**
 * keys handling
 *
 * document.onkeydown = function (e) {
    e = e || window.event;//Get event
    if (e.ctrlKey) {
        var c = e.which || e.keyCode;//Get key code
        switch (c) {
            case 83://Block Ctrl+S
                e.preventDefault();
                e.stopPropagation();
                console.log(c);
                break;
        }
    }
};


 $('#id').keydown(function(event){
    console.log(event.key);
    console.log(event.keyCode);
    event.preventDefault();
    event.stopPropagation();
});
 */