import React from 'react'
import ReactGA from 'react-ga';
import configuration from '../config/configuration';
import Canvas, { clearCanvas, showText } from '../components/Canvas';
import { renderSnake, isInside, generateSnake, collision } from '../components/Snake';
import { handleKeyboard, isNotOpposite, CONTROLS } from '../components/Controls';
import { generateFood, renderFood, eat } from '../components/Food';
import { DIFFICULTY, difficulty } from '../components/Difficulty';
import Score from '../components/Score';
import UIfx from 'uifx';
import * as FontFaceObserver from 'fontfaceobserver';
import eatMp3 from '../sounds/eat.mp3';
import failMp3 from '../sounds/fail.mp3';
import * as firebase from 'firebase';

const eatSound = new UIfx({ asset : eatMp3 });
const failSound = new UIfx({ asset : failMp3 });

export const Status  = {
    PAUSE : { value : 'PAUSE', key : "'space'", text: "pause"},
    PLAY : { value : 'PLAY', key : "'space'", text: "play"},
    GAMEOVER : { value : 'GAME OVER', key : "'r'", text: "replay"},
}

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            snake: generateSnake(),
            food: generateFood(),
            score: 0,
            keypressed: CONTROLS.RIGHT,
            delay: DIFFICULTY,
            status: Status.PLAY,
            name: ''
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.delay !== this.state.delay) {
            clearInterval(this.intervalID);
            this.intervalID = setInterval(this.tick, this.state.delay);
        }
    }

    retry = () => {
        ReactGA.event({
            category: 'Game',
            action: 'Replay'
        });
        this.intervalID = setInterval(this.tick, this.state.delay);
        this.setState({ 
            snake: generateSnake(),
            food: generateFood(),
            score: 0,
            keypressed: CONTROLS.RIGHT,
            delay: DIFFICULTY,
            status: Status.PAUSE
        });
    }

    componentDidMount = async () => {
        // Init Firebase configuration
        let fbConfig = {
            apiKey: configuration.apiKeyFirebase,
            authDomain: configuration.authDomainFirebase,
            databaseURL: configuration.databaseURLFirebase,
            storageBucket: configuration.storageBucketFirebase,
            messagingSenderId: configuration.messagingSenderIdFirebase
        };

        // Init Firebase
        firebase.initializeApp(fbConfig);

        // Configuration Google Analytics
        ReactGA.initialize(configuration.googleAnalyticsTrackingId);
        ReactGA.pageview(window.location.pathname + window.location.search);

        // Récupération
        const rootRef = firebase.database().ref();
        this.messagesRef = rootRef.child('scores');
        console.log('mess', this.messagesRef);

        // Permet de charger ma police d'écriture personnalisé
        this.font = await new FontFaceObserver('nokiafc22').load();
        // Personnalisation de notre canvas (titre)
        showText(this.font, "🐍 | Press the space bar to play | 🐍");

        // Event listener Keyboard
        document.addEventListener('keydown', (event) => {
            if(this.state.status === Status.GAMEOVER) { return };
            
            if([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
                event.preventDefault();
            };

            if(event.key === " ") {
                if(this.state.status === Status.PLAY) {
                    this.intervalID = setInterval(this.tick, this.state.delay);
                    this.setState({
                        status: Status.PAUSE
                    });
                } else {
                    clearInterval(this.intervalID);
                    this.setState({
                        status: Status.PLAY
                    });
                }
            } else {
                this.newkey = handleKeyboard(event);
            }
        }, false);
    }

    componentWillUnmount = () => {
        clearInterval(this.intervalID);
    }

    tick = () => {
        // Si le jeu est terminé
        if(this.state.status === Status.GAMEOVER.value) { return }
        // Le jeu n'est pas terminé, on réucpère l'état de notre jeu
        var { snake, food, score, keypressed, delay } = this.state;
        // On vérifie que le serpent ne peut revenir sur son chemin
        if(this.newkey != null && isNotOpposite(this.newkey, keypressed)) {
            keypressed = this.newkey
        };
        // On fait avancer notre serpent
        var head = { x : snake[0].x + (10 * keypressed.x), y : snake[0].y + (10 * keypressed.y) };
        // Permet de vérifier si notre serpent est dans le canvas.
        isInside(head, keypressed);
        // En cas de colission, le jeu s'arrête
        var c = collision(snake, head);
        if(c) { 
            clearCanvas();
            // Personnalisation de notre canvas (fail)
            showText(this.font, "🐍 | GAME OVER | 🐍");
            // Lancement du son lorsque l'on a perdu
            failSound.play(0.15);
            this.setState({ status : Status.GAMEOVER });
            return clearInterval(this.intervalID); 
        }
        // On regarde si notre serpent mange un fruit
        var e = eat(food, snake);
        // Permet de faire avancer notre serpent (on ajoute sa tête)
        snake.unshift(head);
        // S'il mange un fruit
        if(e) {
            // On lance le son (eat)
            eatSound.play(0.15);
            // On génère un nouveau fruit
            food = generateFood();
            // On incrémente le score
            score += 1;
            // On modifie la difficulté du jeu
            delay = difficulty(score);
        } else {
            // S'il ne mange pas de fruit (on supprime la queue de notre serpent)
            snake.pop();
        }
        this.setState({ 
            snake: snake,
            food: food,
            score: score,
            keypressed: keypressed,
            delay: delay
        });

        // Affichage de notre jeu
        clearCanvas();
        renderSnake(snake);
        renderFood(food);
        showText(this.font, score);
    }

    handleChange(event) {
        this.setState({
            name : event.target.value
        });
    }

    render() {
        let { score, status, name } = this.state;
        if(status === Status.GAMEOVER) {
            var save_score = <div className="test2">
            <p>Congratulations &nbsp;
                <input type="text" name="name" value={name} onChange={this.handleChange.bind(this)}/>
                , your score is {score}. &nbsp; <button>Send</button> <button onClick={this.retry.bind(this)}>Try again</button>
            </p>
        </div>
        }
        return (
            <div className="game">
                <h1 className="title">Snake</h1>
                {save_score}
                <div className="container"> 
                    <div className="instructions">
                        <h4>Instructions</h4>
                        <div className="instructions-wrap">
                            <p>Thanks to your snake catch a maximum of apple without biting you. If you get to one edge you come out of the other.</p>
                            <p>Controllable entirely on the keyboard with the arrow keys and 'z', 's', 'q', 'd'. Press the space bar to start the game and pause it.</p>
                            <p>Have fun 😁</p>
                        </div>
                    </div>
                    <div className="test1">
                        <Canvas />
                    </div>
                    <div className="ranking">
                    <h4>Classement</h4>
                        <div className="ranking-wrap">
                            <div className='row'>
                                <p className='column'>1.</p>
                                <p className='column'>Rémi</p>
                                <p className='column'>20</p>
                            </div>
                            <div className='row'>
                                <p className='column'>2.</p>
                                <p className='column'>Rémi</p>
                                <p className='column'>20</p>
                            </div>
                            <div className='row'>
                                <p className='column'>3.</p>
                                <p className='column'>Rémi</p>
                                <p className='column'>20</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
