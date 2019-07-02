import React from 'react'
import ReactGA from 'react-ga';
import configuration from '../config/configuration';
import * as FontFaceObserver from 'fontfaceobserver';
import UIfx from 'uifx';
import eatMp3 from '../sounds/eat.mp3';
import failMp3 from '../sounds/fail.mp3';
import Canvas, { clearCanvas, showText } from '../components/Canvas';
import { renderSnake, isInside, generateSnake, collision } from '../components/Snake';
import { handleKeyboard, isNotOpposite, CONTROLS } from '../components/Controls';
import { generateFood, renderFood, eat } from '../components/Food';
import { DIFFICULTY, difficulty } from '../components/Difficulty';
import Ranking from '../components/Ranking';
import Instruction from '../components/Instruction';
import { Firebase } from '../api/Firebase';

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
        this.fb = new Firebase();
        this.state = {
            snake: generateSnake(),
            food: generateFood(),
            score: 0,
            keypressed: CONTROLS.RIGHT,
            delay: DIFFICULTY,
            status: Status.PLAY,
            name: '',
            ranking: [],
            save: false
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
            status: Status.PAUSE,
            save: false,
            name: ""
        });
    }

    add() {
        let { name, score } = this.state;
        if(name === "" || score < 0) { return };
        this.fb.ranking().add({
            name: this.state.name,
            score: this.state.score,
            date: Date.now()
        });
        this.setState({
            name: "",
            score: 0,
            save: true
        })
    }

    componentDidMount = async () => {
        // Récupération du classement
        this.fb.ranking().orderBy("score", "desc").onSnapshot((snapshot) => {
            let ranking = [];
            snapshot.forEach((doc) => {
                ranking.push({ ...doc.data(), uid: doc.id })
            });
            this.setState({
                ranking: ranking
            });
        });

        // Configuration Google Analytics
        ReactGA.initialize(configuration.googleAnalyticsTrackingId);
        ReactGA.pageview(window.location.pathname + window.location.search);

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
            // On génère un nouveau fruit
            food = generateFood();
            // On incrémente le score
            score += 1;
            // On modifie la difficulté du jeu
            delay = difficulty(score);
            // On lance le son (eat)
            eatSound.play(0.15);
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
        let { score, status, name, save, ranking } = this.state, html_save_score;
        if(save) {
            html_save_score = <div className="test2"><button onClick={this.retry.bind(this)}>Try again</button></div>;
        }
        if(status === Status.GAMEOVER && !save) {
            html_save_score = <div className="test2">
            <p>Congratulations &nbsp;
                <input type="text" name="name" value={name} onChange={this.handleChange.bind(this)} />
                , your score is {score}. &nbsp; <button onClick={this.add.bind(this)}>Save</button> <button onClick={this.retry.bind(this)}>Try again</button>
            </p>
        </div>
        }
        return (
            <div className="game">
                <h1 className="title">Snake</h1>
                <div className="container"> 
                    <Instruction />
                    <div className="board">
                        <Canvas />
                        {html_save_score}
                    </div>
                    <Ranking ranking={ranking} />
                </div>
            </div>
        )
    }
}
