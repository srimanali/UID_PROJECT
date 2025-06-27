// LOGIN FUNCTIONALITY
const loginOverlay = document.getElementById("login-overlay");
const mainContainer = document.getElementById("main-container");
const loginBtn = document.getElementById("login-btn");
const loginError = document.getElementById("login-error");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const logoutBtn = document.getElementById("logout-btn");
// Demo login
const validUsername = "Idhika", validPassword = "password";
loginBtn.addEventListener("click", tryLogin);
[usernameInput, passwordInput].forEach(input => input.addEventListener("keypress", e => { if (e.key === "Enter") loginBtn.click(); }));
logoutBtn.addEventListener("click", () => {
  mainContainer.style.display = "none";
  loginOverlay.style.display = "flex";
  setActiveMenu(""); // Remove menu highlight
  document.getElementById("right-panel").innerHTML = `<div class="game-card"><h2>Welcome to Typing Fun!</h2><p>Select an option from the left menu to begin.</p></div>`;
});
function tryLogin() {
  const username = usernameInput.value.trim(), password = passwordInput.value.trim();
  if (username === validUsername && password === validPassword) {
    loginError.textContent = "";
    loginOverlay.style.display = "none";
    mainContainer.style.display = "grid";
    setActiveMenu("home");
    loadContent("home");
    usernameInput.value = "";
    passwordInput.value = "";
  } else {
    loginError.textContent = "Invalid username or password.";
  }
}
// MENU HIGHLIGHT
function setActiveMenu(menu) {
  ["home","typing","scramble","speed","memory","balloon","tutorial","about","contact"].forEach(id=>{
    let el = document.getElementById("menu-"+id);
    if (el) el.classList.toggle("active", id===menu);
  });
}

// PAGE/GAME LOADING
function loadContent(section) {
  setActiveMenu(section);
  const panel = document.getElementById("right-panel");
  clearInterval(window.balloonInterval); // Stop balloon if running

  if (section === "home") {
    panel.innerHTML = `
      <div class="game-card" style="margin-top:40px;">
        <h1>Welcome to Typing Trainer!</h1>
        <p>
          This beginner-friendly app helps you improve your typing skills with fun games and real-time feedback.<br>
          Use the sidebar to get started!
        </p>
        <ul style="text-align:left">
          <li>Practice typing full sentences (Typing Trainer)</li>
          <li>Unscramble words (Word Scramble)</li>
          <li>Type as many words as possible in 30 seconds (Speed Typing)</li>
          <li>Challenge your memory (Memory Sequence)</li>
          <li>Balloon Typing Game</li>
          <li>Tutorial and About Us</li>
        </ul>
        <p><b>Logged in as:</b> Idhika</p>
      </div>
    `;

  } else if (section === "typing") {
    panel.innerHTML = `
      <div class="game-card">
        <h1>Typing Trainer</h1>
        <div id="tt-quote" style="font-size:22px;margin-bottom:10px;background:#fff;padding:10px 8px;border-radius:8px;border:2px solid #ccc;">Click "Start" to begin.</div>
        <textarea id="tt-input" rows="3" disabled placeholder="Start typing here..."></textarea>
        <div class="stats" id="tt-stats">Time: 0s | Accuracy: 0% | WPM: 0</div>
        <button onclick="ttStart()">Start</button>
      </div>
    `;
    window.ttQuotes = [
      "The quick brown fox jumps over the lazy dog.",
      "Typing fast is a valuable skill for programmers.",
      "Practice makes perfect.",
      "Speed and accuracy go hand in hand.",
      "Welcome to your typing trainer."
    ];
    let ttQuote = "", ttStartTime = null, ttInterval = null;
    const quoteDiv = document.getElementById("tt-quote");
    const inputArea = document.getElementById("tt-input");
    const stats = document.getElementById("tt-stats");
    window.ttStart = function() {
      ttQuote = ttQuotes[Math.floor(Math.random() * ttQuotes.length)];
      quoteDiv.innerHTML = ttQuote;
      inputArea.value = "";
      inputArea.disabled = false;
      inputArea.focus();
      ttStartTime = new Date();
      clearInterval(ttInterval);
      ttInterval = setInterval(ttUpdateStats, 1000);
    };
    inputArea.oninput = function() {
      const input = inputArea.value;
      let display = "";
      for (let i = 0; i < ttQuote.length; i++) {
        if (i < input.length) {
          if (input[i] === ttQuote[i]) display += `<span class="correct">${ttQuote[i]}</span>`;
          else display += `<span class="wrong">${ttQuote[i]}</span>`;
        } else {
          display += ttQuote[i];
        }
      }
      quoteDiv.innerHTML = display;
      if (input === ttQuote) {
        clearInterval(ttInterval);
        ttUpdateStats(true);
        inputArea.disabled = true;
      }
    };
    window.ttUpdateStats = function(finished = false) {
      const input = inputArea.value;
      const timeElapsed = Math.floor((new Date() - ttStartTime) / 1000);
      const correctChars = [...input].filter((ch, i) => ch === ttQuote[i]).length;
      const accuracy = ((correctChars / input.length) * 100) || 0;
      const wordsTyped = input.trim().split(" ").filter(Boolean).length;
      const wpm = timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0;
      stats.innerText = `Time: ${timeElapsed}s | Accuracy: ${accuracy.toFixed(1)}% | WPM: ${wpm}`;
      if (finished) stats.innerText += " ✅ Done!";
    };

  } else if (section === "scramble") {
    panel.innerHTML = `
      <div class="game-card">
        <h1>Word Scramble</h1>
        <div style="font-size:20px;margin-bottom:6px;">Unscramble the word:</div>
        <div id="ws-scrambled" style="font-size:28px;font-weight:bold;margin:10px 0;background:#fff;padding:10px 12px;border-radius:8px;display:inline-block;border:2px solid #ccc;">Click "New Word"</div>
        <input type="text" id="ws-input" placeholder="Type the word..." disabled>
        <div class="stats" id="ws-result"></div>
        <button onclick="wsNewWord()">New Word</button>
        <button onclick="wsCheck()" style="margin-left:10px;">Check</button>
      </div>
    `;
    window.wsWords = ["javascript", "computer", "scramble", "challenge", "keyboard", "internet", "official", "trainer", "memory"];
    let wsAnswer = "";
    const scrDiv = document.getElementById("ws-scrambled");
    const input = document.getElementById("ws-input");
    const result = document.getElementById("ws-result");
    window.wsNewWord = function() {
      wsAnswer = wsWords[Math.floor(Math.random() * wsWords.length)];
      let arr = wsAnswer.split("");
      do { arr = wsAnswer.split("").sort(() => Math.random() - 0.5); }
      while (arr.join("") === wsAnswer);
      scrDiv.textContent = arr.join("");
      input.value = "";
      input.disabled = false;
      result.textContent = "";
      input.focus();
    };
    window.wsCheck = function() {
      if (input.disabled) return;
      if (input.value.trim().toLowerCase() === wsAnswer) {
        result.innerHTML = `<span class="success">Correct! 🎉</span>`;
        input.disabled = true;
      } else {
        result.innerHTML = `<span class="error">Try again!</span>`;
      }
    };
    input.onkeydown = function(e) { if (e.key === "Enter") wsCheck(); }
  } else if (section === "speed") {
    panel.innerHTML = `
      <div class="game-card">
        <h1>Speed Typing Challenge</h1>
        <div style="margin-bottom:10px;">Type as many correct words as you can in <b>30 seconds</b>!</div>
        <input type="text" id="st-input" placeholder="Type the next word..." disabled autocomplete="off">
        <div class="stats" id="st-word"></div>
        <div class="stats" id="st-timer"></div>
        <div class="stats" id="st-score"></div>
        <button onclick="stStart()">Start</button>
      </div>
    `;
    window.stWords = ["apple","banana","orange","laptop","mouse","screen","window","train","ocean","python","javascript","typing","game","challenge","speed"];
    const input = document.getElementById("st-input");
    const wordDiv = document.getElementById("st-word");
    const timerDiv = document.getElementById("st-timer");
    const scoreDiv = document.getElementById("st-score");
    let stScore = 0, stTimeLeft = 30, stInterval = null, stCurrentWord = "";
    window.stStart = function() {
      stScore = 0;
      stTimeLeft = 30;
      input.value = "";
      input.disabled = false;
      input.focus();
      stNextWord();
      stUpdateDisplay();
      clearInterval(stInterval);
      stInterval = setInterval(() => {
        stTimeLeft--;
        stUpdateDisplay();
        if (stTimeLeft <= 0) {
          clearInterval(stInterval);
          input.disabled = true;
          wordDiv.innerHTML = `<span class="success">Time's up!</span>`;
        }
      }, 1000);
    };
    function stNextWord() {
      stCurrentWord = window.stWords[Math.floor(Math.random() * window.stWords.length)];
      wordDiv.innerHTML = `<b>${stCurrentWord}</b>`;
      input.value = "";
    }
    window.stNextWord = stNextWord;
    input.onkeydown = function(e) {
      if (e.key === "Enter" && !input.disabled && stTimeLeft > 0) {
        if (input.value.trim().toLowerCase() === stCurrentWord) {
          stScore++;
          stNextWord();
        } else {
          wordDiv.innerHTML += `<span class="error" style="margin-left:10px;">Incorrect!</span>`;
        }
        stUpdateDisplay();
      }
    };
    function stUpdateDisplay() {
      timerDiv.textContent = `Time Left: ${stTimeLeft}s`;
      scoreDiv.textContent = `Score: ${stScore}`;
    }
    window.stUpdateDisplay = stUpdateDisplay;
  } else if (section === "memory") {
    panel.innerHTML = `
      <div class="game-card">
        <h1>Memory Sequence</h1>
        <div style="margin-bottom:10px;">Memorize the sequence and type it!</div>
        <div id="ms-seq" style="font-size:24px;font-weight:bold;background:#fff;padding:10px 12px;border-radius:8px;display:inline-block;border:2px solid #ccc;">Click "Show Sequence"</div>
        <input type="text" id="ms-input" placeholder="Type the sequence..." disabled autocomplete="off">
        <div class="stats" id="ms-result"></div>
        <button onclick="msShowSeq()">Show Sequence</button>
        <button onclick="msCheck()" style="margin-left:10px;">Check</button>
      </div>
    `;
    let msSeq = "";
    const seqDiv = document.getElementById("ms-seq");
    const input = document.getElementById("ms-input");
    const result = document.getElementById("ms-result");
    window.msShowSeq = function() {
      const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
      msSeq = Array.from({length: Math.floor(Math.random()*3)+6}, () => chars[Math.floor(Math.random()*chars.length)]).join("");
      seqDiv.textContent = msSeq;
      input.value = "";
      input.disabled = true;
      result.textContent = "";
      setTimeout(() => {
        seqDiv.textContent = "Now type it!";
        input.disabled = false;
        input.focus();
      }, 5000); // 5 seconds
    };
    window.msCheck = function() {
      if (input.value === msSeq) {
        result.innerHTML = `<span class="success">Correct! 🎉</span>`;
        input.disabled = true;
      } else {
        result.innerHTML = `<span class="error">Incorrect. Try again!</span>`;
      }
    };
    input.onkeydown = function(e) { if (e.key === "Enter") msCheck(); }
  } else if (section === "balloon") {
    panel.innerHTML = `
      <div class="game-card">
        <h1>Balloon Typing Game</h1>
        <div id="balloon-area">
          <div id="balloon"><span id="balloon-word">start</span></div>
        </div>
        <input type="text" id="balloon-input" placeholder="Type the word above" autocomplete="off" />
        <p>Score: <span id="balloon-score">0</span></p>
        <button id="balloon-reset">Reset</button>
      </div>
    `;
    // Balloon Typing Game logic
    const balloonWords = [
      "fun", "code", "type", "fast", "game",
      "keyboard", "practice", "speed", "learn", "skills"
    ];
    let balloonScore, balloonTop, balloonMovingUp;
    let balloon, balloonWord, balloonInput, balloonScoreDisplay;
    function getRandomBalloonWord() {
      return balloonWords[Math.floor(Math.random() * balloonWords.length)];
    }
    function startBalloonGame() {
      balloonScore = 0;
      balloonTop = 140;
      balloonMovingUp = true;
      balloon = document.getElementById("balloon");
      balloonWord = document.getElementById("balloon-word");
      balloonInput = document.getElementById("balloon-input");
      balloonScoreDisplay = document.getElementById("balloon-score");
      balloonWord.textContent = getRandomBalloonWord();
      balloon.style.top = balloonTop + "px";
      balloonScoreDisplay.textContent = balloonScore;
      balloonInput.value = "";
      balloonInput.disabled = false;
      balloonInput.focus();
      balloonInput.oninput = () => {
        const typed = balloonInput.value.trim();
        if (typed.toLowerCase() === balloonWord.textContent.toLowerCase()) {
          balloonInput.value = "";
          balloonScore++;
          balloonScoreDisplay.textContent = balloonScore;
          balloonWord.textContent = getRandomBalloonWord();
          balloonTop = 140;
          balloon.style.top = balloonTop + "px";
          balloonMovingUp = true;
        }
      };
      clearInterval(window.balloonInterval);
      window.balloonInterval = setInterval(() => {
        if (balloonMovingUp) {
          balloonTop -= 2;
          if (balloonTop <= 10) {
            balloonTop = 10;
            balloon.style.top = balloonTop + "px";
            clearInterval(window.balloonInterval);
            balloonInput.disabled = true;
            alert("Time over! The balloon flew away!");
            return;
          }
        } else {
          balloonTop += 2;
          if (balloonTop >= 140) balloonMovingUp = true;
        }
        balloon.style.top = balloonTop + "px";
      }, 50);
    }
    document.getElementById("balloon-reset").onclick = function() {
      clearInterval(window.balloonInterval);
      startBalloonGame();
    };
    startBalloonGame();
  } else if (section === "tutorial") {
    panel.innerHTML = `
      <div class="game-card">
        <h1>Typing Tutorial</h1>
        <div class="tutorial-container">
          <div class="keyboard-image">
            <img src="typing.webp" alt="Keyboard" />
          </div>
          <div class="sentences">
            <p>Practice typing the following sentences:</p>
            <ul>
              <li>The quick brown fox jumps over the lazy dog.</li>
              <li>Practice makes perfect.</li>
              <li>Typing fast and accurately takes time.</li>
              <li>Focus on accuracy before speed.</li>
            </ul>
            <textarea placeholder="Type here to practice..." rows="6"></textarea>
          </div>
        </div>
      </div>
    `;
  } else if (section === "about") {
    panel.innerHTML = `
      <div class="game-card" style="max-width: 700px;">
        <h1>About Typing Trainer</h1>
        <p>
          <b>Typing Trainer</b> is a beginner-friendly web app for enhancing your typing skills through fun and interactive games.
          <br/><br/>
          <b>Features:</b>
          <ul style="text-align:left;">
            <li>Diverse games: Typing Trainer, Word Scramble, Speed Typing, Memory Sequence, Balloon Typing</li>
            <li>Instant feedback on speed and accuracy</li>
            <li>Progress tracking and motivation</li>
            <li>Practice sentences, tutorials, and tips</li>
            <li>Modern, responsive design for all devices</li>
            <li>Leaderboard for friendly competition (coming soon)</li>
            <li>Dark mode for late-night practice (coming soon!)</li>
          </ul>
          <b>Why use us?</b>
          <ul style="text-align:left;">
            <li>Perfect for students, programmers, and anyone who wants to type faster!</li>
            <li>All features are free and require no installation</li>
          </ul>
        </p>
      </div>
    `;
  } else if (section === "contact") {
  panel.innerHTML = `
  <div class="game-card">
    <h1>Contact Us</h1>
    <!-- ... -->
    <form id="contactForm" style="margin-top:20px;text-align:left;">
      <div style="margin-bottom:10px;">
        <label for="contactName">Name:</label><br>
        <input type="text" id="contactName" name="contactName" required>
        <small id="nameError" style="color:#dc3545;display:none;"></small>
      </div>
      <div style="margin-bottom:10px;">
        <label for="contactEmail">Email:</label><br>
        <input type="email" id="contactEmail" name="contactEmail" required>
        <small id="emailError" style="color:#dc3545;display:none;"></small>
      </div>
      <div style="margin-bottom:10px;">
        <label for="contactMsg">Message:</label><br>
        <textarea id="contactMsg" name="contactMsg" required rows="4"></textarea>
        <small id="msgError" style="color:#dc3545;display:none;"></small>
      </div>
      <button type="submit">Send Message</button>
      <div id="formSuccess" style="color:#28a745; margin-top:10px; display:none; text-align:center;">Thank you for contacting us!</div>
    </form>
  </div>
`;

    // Form validation on submit
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.onsubmit = function(e) {
        e.preventDefault();
        let valid = true;
        // Name validation
        const name = document.getElementById('contactName').value.trim();
        const nameError = document.getElementById('nameError');
        if (!name) {
          nameError.innerText = "Name is required.";
          nameError.style.display = "block";
          valid = false;
        } else {
          nameError.style.display = "none";
        }
        // Email validation
        const email = document.getElementById('contactEmail').value.trim();
        const emailError = document.getElementById('emailError');
        const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!email) {
          emailError.innerText = "Email is required.";
          emailError.style.display = "block";
          valid = false;
        } else if (!emailPattern.test(email)) {
          emailError.innerText = "Enter a valid email address.";
          emailError.style.display = "block";
          valid = false;
        } else {
          emailError.style.display = "none";
        }
        // Message validation
        const msg = document.getElementById('contactMsg').value.trim();
        const msgError = document.getElementById('msgError');
        if (!msg) {
          msgError.innerText = "Message is required.";
          msgError.style.display = "block";
          valid = false;
        } else {
          msgError.style.display = "none";
        }

        // If valid, display success and reset
        const formSuccess = document.getElementById('formSuccess');
        if (valid) {
          formSuccess.style.display = "block";
          setTimeout(() => { formSuccess.style.display = "none"; }, 4000);
          contactForm.reset();
        }
      }
    }
  }
}
// On first load show login overlay
setActiveMenu("home");
loadContent("home");