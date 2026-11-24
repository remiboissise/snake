export default function Instructions() {
  return (
    <section className="panel instructions" aria-labelledby="instructions-title">
      <h2 id="instructions-title">Instructions</h2>
      <p>
        Eat as many apples as you can without biting yourself. Leave the board
        on one side and you come back on the other.
      </p>
      <p>
        Steer with the arrow keys or Z Q S D (W A S D on QWERTY). The space bar
        starts and pauses the game.
      </p>
      <p>On a touch screen, swipe to steer and tap the board to start or pause.</p>
      <p>
        Have fun{" "}
        <span role="img" aria-label="grinning face">
          😁
        </span>
      </p>
    </section>
  )
}