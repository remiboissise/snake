export const CONTROLS = {
    UP : { x : 0, y : -1, key : 'UP' },
    DOWN : { x : 0, y : 1, key : 'DOWN' },
    LEFT : { x : -1, y : 0, key: 'LEFT' },
    RIGHT : { x : 1, y : 0, key: 'RIGHT' } 
};

export function handleKeyboard(event) {
    switch(event.key){
        case 'ArrowUp' : 
        case 'z' : {
            return CONTROLS.UP;
        }
        case 'ArrowDown' :
        case 's' : {
            return CONTROLS.DOWN;
        }
        case 'ArrowLeft' :
        case 'q' : {
            return CONTROLS.LEFT;
        }
        case 'ArrowRight':
        case 'd' : {
            return CONTROLS.RIGHT;
        }
        default : {
            return;
        }
    } 
}

export function isNotOpposite(newkey, keypressed) {
    if((keypressed.key === 'RIGHT' && newkey.key === 'LEFT') 
        || (keypressed.key === 'UP' && newkey.key === 'DOWN') 
        || (keypressed.key === 'LEFT' && newkey.key === 'RIGHT') 
        || (keypressed.key === 'DOWN' && newkey.key === 'UP')) {
            return false;
        } 
    return true;
}