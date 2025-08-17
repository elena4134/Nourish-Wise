document.addEventListener("DOMContentLoaded", () => {
    const quizzes = {
      healthy: {
        title: "How do you eat healthy?",
        questions: [
          { 
            q: "Which of these is a fruit?", 
            options: ["Carrot", "Apple", "Potato"], 
            answer: "Apple",
            explanation: "Apple is a fruit because it grows from a flower and contains seeds. Carrots and potatoes are root vegetables."
          },
          { 
            q: "Which nutrient helps build muscles?", 
            options: ["Protein", "Sugar", "Fat"], 
            answer: "Protein",
            explanation: "Proteins are made of amino acids, which are the building blocks of muscle growth and repair."
          },
          { 
            q: "How many glasses of water should you drink daily?", 
            options: ["2-3", "6-8", "10-12"], 
            answer: "6-8",
            explanation: "Most health experts recommend 6-8 glasses daily for optimal hydration."
          }
        ]
      },
      facts: {
        title: "Nutrition Facts",
        questions: [
          { 
            q: "What does 'Calories' measure?", 
            options: ["Energy", "Sugar", "Vitamins"], 
            answer: "Energy",
            explanation: "Calories are units of energy. They measure how much fuel your body gets from food."
          },
          { 
            q: "Which vitamin is high in carrots?", 
            options: ["Vitamin C", "Vitamin A", "Vitamin D"], 
            answer: "Vitamin A",
            explanation: "Carrots are rich in beta-carotene, which your body converts into Vitamin A — essential for eye health."
          },
          { 
            q: "What is the main source of calcium?", 
            options: ["Milk", "Bread", "Fish"], 
            answer: "Milk",
            explanation: "Dairy products like milk are rich in calcium, vital for strong bones and teeth."
          }
        ]
      }
    };
  
    const modal = document.getElementById("quizModal");
    const quizTitle = document.getElementById("quizTitle");
    const quizQuestions = document.getElementById("quizQuestions");
    const closeBtn = document.querySelector(".quiz-close-btn");
    const submitBtn = document.getElementById("submitQuiz");
    const scoreDisplay = document.getElementById("quizScore");
  
    let currentQuiz = null;
  
    // Open quiz
    document.querySelectorAll(".play-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const quizKey = btn.dataset.quiz;
        currentQuiz = quizzes[quizKey];
  
        quizTitle.innerText = currentQuiz.title;
        scoreDisplay.innerText = "";
        quizQuestions.innerHTML = currentQuiz.questions.map((q, i) => `
          <div class="question">
            <p><strong>${i+1}.</strong> ${q.q}</p>
            ${q.options.map(opt => `
              <label>
                <input type="radio" name="q${i}" value="${opt}"> ${opt}
              </label>
            `).join("<br>")}
          </div>
        `).join("");
  
        modal.style.display = "flex";
      });
    });
  
    // Close quiz
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  
    // Submit quiz
    submitBtn.addEventListener("click", () => {
      let score = 0;
      let feedback = "";
  
      currentQuiz.questions.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected) {
          if (selected.value === q.answer) {
            score++;
          } else {
            feedback += `<p><strong>Question ${i+1}:</strong> You answered "${selected.value}" — Incorrect.<br>
            ✅ Correct answer: <strong>${q.answer}</strong><br>
            📖 Explanation: ${q.explanation}</p><hr>`;
          }
        } else {
          feedback += `<p><strong>Question ${i+1}:</strong> You did not answer this question.<br>
          ✅ Correct answer: <strong>${q.answer}</strong><br>
          📖 Explanation: ${q.explanation}</p><hr>`;
        }
      });
  
      scoreDisplay.innerHTML = `
        <strong>You scored ${score} out of ${currentQuiz.questions.length}</strong><br><br>
        ${feedback || "🎉 Perfect score! Well done!"}
      `;
    });
  
    // Close when clicking outside
    window.addEventListener("click", e => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });

  //other
  document.addEventListener('DOMContentLoaded', () => {
    // === QUESTION SETS ===
    const farmingQuestions = [
      {
        question: "What is crop rotation?",
        options: [
          "Planting the same crop repeatedly",
          "Alternating different crops between seasons",
          "Irrigating fields more than once daily",
          "Planting only one plant type per farm"
        ],
        correct: 1,
        explanation: "Crop rotation alternates crops to protect soil fertility and reduce pests and diseases."
      },
      {
        question: "Which nutrient is especially important for leaf growth?",
        options: ["Nitrogen", "Calcium", "Potassium", "Phosphorus"],
        correct: 0,
        explanation: "Nitrogen promotes leaf and vegetative growth; plants deficient in nitrogen show yellowing leaves."
      }
    ];
  
    const fwSets = {
      fw1: [
        {
          question: "Roughly what share of food is wasted globally every year?",
          options: ["About 10%", "About 33%", "About 60%"],
          correct: 1,
          explanation: "Approximately one-third of all food produced is lost or wasted globally."
        },
        {
          question: "Which household habit reduces food waste the most?",
          options: ["Meal planning", "Buying in bulk without planning", "Throwing leftovers"],
          correct: 0,
          explanation: "Meal planning helps reduce overbuying and mismatched purchases, leading to less waste."
        }
      ],
      fw2: [
        {
          question: "Which storage method lengthens shelf-life for many foods?",
          options: ["Freezing", "Leaving at room temp", "Placing in direct sunlight"],
          correct: 0,
          explanation: "Freezing drastically slows decay and microbial growth, extending food life."
        }
      ],
      fw3: [
        {
          question: "Best way to minimise banana waste?",
          options: ["Keep in fridge immediately", "Use overripe bananas in baking", "Throw them"],
          correct: 1,
          explanation: "Using overripe bananas in baking avoids waste and transforms them into tasty recipes."
        }
      ]
    };
  
    // === UTILS: start quiz in container ===
    function startQuiz(containerEl, questions, modalEl) {
      if (!containerEl) return;
      let idx = 0, score = 0;
      containerEl.innerHTML = '';
      modalEl.style.display = 'flex';
      modalEl.setAttribute('aria-hidden','false');
  
      function renderQuestion() {
        const q = questions[idx];
        containerEl.innerHTML = `
          <div class="question"><p>${idx+1}. ${q.question}</p></div>
          <div class="options">${q.options.map((opt, i) => `<button class="option-btn" data-index="${i}">${opt}</button>`).join('')}</div>
          <div class="quiz-feedback" aria-live="polite"></div>
        `;
        const optionBtns = containerEl.querySelectorAll('.option-btn');
        const feedback = containerEl.querySelector('.quiz-feedback');
  
        optionBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const chosen = Number(btn.dataset.index);
            // disable all buttons
            optionBtns.forEach(b => b.disabled = true);
            if (chosen === q.correct) {
              score++;
              btn.classList.add('correct');
              feedback.innerHTML = `<span style="color:green">✅ Correct.</span> ${q.explanation}`;
            } else {
              btn.classList.add('wrong');
              feedback.innerHTML = `<span style="color:red">❌ Incorrect.</span> <br><strong>Correct:</strong> ${q.options[q.correct]}<br>${q.explanation}`;
              // also mark the correct button visually
              const correctBtn = containerEl.querySelector(`.option-btn[data-index="${q.correct}"]`);
              if (correctBtn) correctBtn.classList.add('correct');
            }
  
            // next question after short pause
            setTimeout(() => {
              idx++;
              if (idx < questions.length) renderQuestion();
              else showResult();
            }, 1700);
          });
        });
      }
  
      function showResult() {
        containerEl.innerHTML = `
          <div class="quiz-result">
            <h4>Your score: ${score} / ${questions.length}</h4>
            <p>Well done — you can retry anytime to improve.</p>
            <div style="margin-top:12px;"><button class="btn close-after">Close</button></div>
          </div>
        `;
        const closeBtn = containerEl.querySelector('.close-after');
        closeBtn.addEventListener('click', () => {
          closeModal(modalEl);
        });
      }
  
      renderQuestion();
    }
  
    // === OPEN LISTENERS (safe attach) ===
    const farmPlay = document.querySelector('.play-btn-farm');
    if (farmPlay) {
      farmPlay.addEventListener('click', () => {
        const modal = document.getElementById('modal-farm');
        const container = document.getElementById('farmQuizContainer');
        startQuiz(container, farmingQuestions, modal);
      });
    }
  
    // food-waste play buttons
    document.querySelectorAll('.play-btn-fw').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.fw;
        const quiz = fwSets[key];
        if (!quiz) { console.warn('No quiz for', key); return; }
        const modal = document.getElementById('modal-fw');
        const container = document.getElementById('fwQuizContainer');
        startQuiz(container, quiz, modal);
      });
    });
  
    // === CLOSE LOGIC ===
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
      closeBtn.addEventListener('click', () => {
        const id = closeBtn.dataset.target;
        const modal = document.getElementById(id);
        if (modal) closeModal(modal);
      });
    });
  
    function closeModal(modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden','true');
      // clear container content
      const inner = modal.querySelector('.quiz-container');
      if (inner) inner.innerHTML = '';
    }
  
    // Click outside to close
    window.addEventListener('click', (e) => {
      const modals = document.querySelectorAll('.quiz-modal');
      modals.forEach(m => {
        if (m.style.display === 'flex' && e.target === m) closeModal(m);
      });
    });
  });
  