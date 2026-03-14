// ===== SUPABASE CONFIGURATION =====
const SUPABASE_URL = "https://xzptxrarzdgawilymmhu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cHR4cmFyemRnYXdpbHltbWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzODc0NjYsImV4cCI6MjA4ODk2MzQ2Nn0.5n833vgZmdN3Rr4s_jja8R6qLy4DN34DPbRw6DzuDbg";

// Initialize Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== GLOBAL VARIABLES =====
let currentUser = null;
let currentUserData = null;
let countdownInterval = null;
let currentFlashcardIndex = 0;
let currentFlashcardSet = [];
let cardMastery = {}; // Tracks how well user knows each card
let currentQuizQuestions = [];
let currentQuizIndex = 0;
let quizScore = 0;
let selectedQuizOption = null;
let userXP = 0;
let userLevel = 1;

// ===== RICH COURSE CONTENT =====
const courseContent = {
    forex: {
        title: "Forex Trading Mastery",
        icon: "chart-line",
        color: "#4CAF50",
        lessons: [
            {
                title: "Chapter 1: What is Forex?",
                description: "Understanding the largest financial market",
                pages: [
                    {
                        title: "Introduction to Forex",
                        content: `
                            <div class="lesson-page">
                                <h2>🌍 The Foreign Exchange Market</h2>
                                <p>Forex (Foreign Exchange) is the global marketplace for trading national currencies against one another.</p>
                                
                                <div class="highlight-box">
                                    <h3>📊 Key Facts:</h3>
                                    <ul>
                                        <li><strong>Daily Volume:</strong> $6.6 TRILLION (largest market in the world)</li>
                                        <li><strong>Market Hours:</strong> 24 hours a day, 5 days a week</li>
                                        <li><strong>Participants:</strong> Banks, institutions, hedge funds, retail traders</li>
                                        <li><strong>Liquidity:</strong> Extremely high - you can buy/sell instantly</li>
                                    </ul>
                                </div>
                                
                                <div class="image-placeholder" style="background: linear-gradient(135deg, #667eea, #764ba2); height: 200px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white;">
                                    <i class="fas fa-chart-line" style="font-size: 4rem;"></i>
                                    <span style="margin-left: 1rem;">Forex Market Chart Visualization</span>
                                </div>
                                
                                <h3>🎯 Why Trade Forex?</h3>
                                <ul>
                                    <li>✅ Low barriers to entry (start with as little as $10)</li>
                                    <li>✅ Trade from anywhere in the world</li>
                                    <li>✅ Profit in rising OR falling markets</li>
                                    <li>✅ Leverage available (but be careful!)</li>
                                </ul>
                            </div>
                        `
                    },
                    {
                        title: "Currency Pairs Explained",
                        content: `
                            <div class="lesson-page">
                                <h2>💱 Understanding Currency Pairs</h2>
                                <p>Currencies are always traded in pairs. You're buying one and selling the other simultaneously.</p>
                                
                                <div class="example-box" style="background: #f0f8ff; padding: 20px; border-radius: 10px;">
                                    <h3>📝 Example: EUR/USD</h3>
                                    <p><strong>Base Currency:</strong> EUR (the one you're buying/selling)</p>
                                    <p><strong>Quote Currency:</strong> USD (the one you're using to buy)</p>
                                    <p>If EUR/USD = 1.1000, it means 1 Euro = 1.10 US Dollars</p>
                                </div>
                                
                                <h3>Major Currency Pairs:</h3>
                                <table style="width:100%; border-collapse: collapse;">
                                    <tr style="background: #667eea; color: white;">
                                        <th style="padding: 10px;">Pair</th>
                                        <th style="padding: 10px;">Nickname</th>
                                        <th style="padding: 10px;">Spread</th>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #ddd;">
                                        <td style="padding: 10px;">EUR/USD</td>
                                        <td style="padding: 10px;">"Fiber"</td>
                                        <td style="padding: 10px;">Lowest</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #ddd;">
                                        <td style="padding: 10px;">GBP/USD</td>
                                        <td style="padding: 10px;">"Cable"</td>
                                        <td style="padding: 10px;">Low</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #ddd;">
                                        <td style="padding: 10px;">USD/JPY</td>
                                        <td style="padding: 10px;">"Gopher"</td>
                                        <td style="padding: 10px;">Low</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px;">USD/CHF</td>
                                        <td style="padding: 10px;">"Swissie"</td>
                                        <td style="padding: 10px;">Low</td>
                                    </tr>
                                </table>
                                
                                <div class="warning-box" style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px;">
                                    <i class="fas fa-exclamation-triangle" style="color: #856404;"></i>
                                    <strong>Remember:</strong> The first currency is the BASE. You're always buying/selling the base currency.
                                </div>
                            </div>
                        `
                    },
                    {
                        title: "Pips and Lots",
                        content: `
                            <div class="lesson-page">
                                <h2>📏 Understanding Pips and Lots</h2>
                                
                                <div class="definition-box" style="background: #e3f2fd; padding: 20px; border-radius: 10px;">
                                    <h3>🔍 What is a PIP?</h3>
                                    <p>PIP = Percentage in Point. It's the smallest price movement in Forex.</p>
                                    <p><strong>For most pairs:</strong> 1 pip = 0.0001</p>
                                    <p><strong>For JPY pairs:</strong> 1 pip = 0.01</p>
                                    <p class="example">Example: If EUR/USD moves from 1.1000 to 1.1001, that's 1 pip.</p>
                                </div>
                                
                                <h3>💰 Calculating Pip Value</h3>
                                <p>For a standard lot (100,000 units):</p>
                                <ul>
                                    <li>EUR/USD: 1 pip = $10</li>
                                    <li>USD/JPY: 1 pip = ~$9.09 (varies with rate)</li>
                                </ul>
                                
                                <div class="interactive-example" style="background: #f3e5f5; padding: 20px; border-radius: 10px;">
                                    <h4>🎮 Try It Yourself:</h4>
                                    <p>If you buy 1 standard lot of EUR/USD at 1.1000 and it moves to 1.1010:</p>
                                    <p>Movement = 10 pips</p>
                                    <p>Profit = 10 pips × $10 = <strong>$100</strong></p>
                                </div>
                                
                                <h3>📊 Lot Sizes:</h3>
                                <table style="width:100%;">
                                    <tr><td>Standard Lot</td><td>100,000 units</td><td>$10 per pip</td></tr>
                                    <tr><td>Mini Lot</td><td>10,000 units</td><td>$1 per pip</td></tr>
                                    <tr><td>Micro Lot</td><td>1,000 units</td><td>$0.10 per pip</td></tr>
                                    <tr><td>Nano Lot</td><td>100 units</td><td>$0.01 per pip</td></tr>
                                </table>
                            </div>
                        `
                    }
                ],
                questionBank: [
                    {
                        question: "What is the daily trading volume of the Forex market?",
                        options: ["$660 billion", "$6.6 trillion", "$66 trillion", "$660 million"],
                        correct: 1,
                        explanation: "Forex trades $6.6 TRILLION daily - it's the world's largest financial market!"
                    },
                    {
                        question: "In the currency pair EUR/USD, which is the base currency?",
                        options: ["USD", "EUR", "Both", "Neither"],
                        correct: 1,
                        explanation: "EUR is the base currency. You're buying or selling Euros, using US Dollars."
                    },
                    {
                        question: "What is a pip in most currency pairs?",
                        options: ["0.1", "0.01", "0.001", "0.0001"],
                        correct: 3,
                        explanation: "For most pairs, 1 pip = 0.0001. For JPY pairs, it's 0.01."
                    },
                    {
                        question: "How much is 1 pip worth on a standard lot of EUR/USD?",
                        options: ["$1", "$10", "$100", "$1000"],
                        correct: 1,
                        explanation: "A standard lot is 100,000 units, so each pip movement is worth $10."
                    },
                    {
                        question: "Which of these is NOT a major currency pair?",
                        options: ["EUR/USD", "GBP/USD", "USD/TRY", "USD/JPY"],
                        correct: 2,
                        explanation: "USD/TRY (Turkish Lira) is an exotic pair, not a major."
                    },
                    {
                        question: "When does the Forex market open?",
                        options: ["Monday 12am", "Sunday 5pm EST", "24/7", "Weekdays 9-5"],
                        correct: 1,
                        explanation: "Forex opens Sunday 5pm EST and runs until Friday 5pm EST."
                    },
                    {
                        question: "What is a micro lot size?",
                        options: ["100,000 units", "10,000 units", "1,000 units", "100 units"],
                        correct: 2,
                        explanation: "Micro lot = 1,000 units, worth about $0.10 per pip."
                    },
                    {
                        question: "If EUR/USD moves from 1.1050 to 1.1075, how many pips did it move?",
                        options: ["25 pips", "2.5 pips", "250 pips", "0.25 pips"],
                        correct: 0,
                        explanation: "1.1075 - 1.1050 = 0.0025 = 25 pips"
                    }
                ]
            },
            {
                title: "Chapter 2: Technical Analysis",
                description: "Reading charts and identifying trends",
                pages: [
                    {
                        title: "Introduction to Charts",
                        content: `
                            <div class="lesson-page">
                                <h2>📊 Types of Charts</h2>
                                
                                <h3>1. Line Charts</h3>
                                <p>Simply connect closing prices. Good for seeing overall trends.</p>
                                
                                <div class="chart-example" style="height: 150px; background: linear-gradient(45deg, #667eea20, #764ba220); margin: 10px 0; position: relative;">
                                    <svg width="100%" height="150" viewBox="0 0 300 150">
                                        <polyline points="20,130 70,100 120,110 170,80 220,90 270,40" stroke="#667eea" stroke-width="3" fill="none"/>
                                    </svg>
                                </div>
                                
                                <h3>2. Bar Charts</h3>
                                <p>Show open, high, low, close for each period.</p>
                                
                                <h3>3. Candlestick Charts</h3>
                                <p>Most popular. Green/white = price went up, Red/black = price went down.</p>
                                
                                <div class="candlestick-demo" style="display: flex; gap: 10px; justify-content: center;">
                                    <div style="width: 20px; height: 60px; background: #4CAF50; border-radius: 3px;"></div>
                                    <div style="width: 20px; height: 40px; background: #f44336; border-radius: 3px;"></div>
                                    <div style="width: 20px; height: 55px; background: #4CAF50; border-radius: 3px;"></div>
                                </div>
                            </div>
                        `
                    }
                ],
                questionBank: [
                    {
                        question: "What does a green candlestick indicate?",
                        options: ["Price went down", "Price went up", "Price didn't change", "Market closed"],
                        correct: 1,
                        explanation: "Green/white candlesticks mean the closing price was higher than the opening price."
                    },
                    {
                        question: "What is support in technical analysis?",
                        options: ["Price ceiling", "Price floor", "Trading volume", "Market news"],
                        correct: 1,
                        explanation: "Support is a price level where buying pressure is strong enough to prevent price from falling further."
                    }
                ]
            }
        ],
        flashcardBank: [
            { front: "What is Forex?", back: "Foreign Exchange - trading currencies globally", difficulty: 1 },
            { front: "What is a Pip?", back: "Percentage in Point - smallest price movement (0.0001 for most pairs)", difficulty: 1 },
            { front: "Major currency pairs?", back: "EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, USD/CAD", difficulty: 1 },
            { front: "What is a standard lot?", back: "100,000 units of base currency", difficulty: 2 },
            { front: "What is leverage?", back: "Borrowed capital to increase potential returns (and losses)", difficulty: 2 },
            { front: "What is a stop loss?", back: "Order to close trade at predetermined loss level", difficulty: 2 },
            { front: "What is RSI?", back: "Relative Strength Index - measures overbought/oversold conditions", difficulty: 3 },
            { front: "What is MACD?", back: "Moving Average Convergence Divergence - trend-following momentum indicator", difficulty: 3 },
            { front: "What is a bullish market?", back: "Prices are rising or expected to rise", difficulty: 1 },
            { front: "What is a bearish market?", back: "Prices are falling or expected to fall", difficulty: 1 }
        ]
    },
    webdev: {
        title: "Web Development Bootcamp",
        icon: "laptop-code",
        color: "#2196F3",
        lessons: [
            {
                title: "Chapter 1: HTML Fundamentals",
                description: "Build the structure of websites",
                pages: [
                    {
                        title: "HTML Document Structure",
                        content: `
                            <div class="lesson-page">
                                <h2>🏗️ Basic HTML Template</h2>
                                
                                <pre style="background: #1e1e1e; color: #d4d4d4; padding: 20px; border-radius: 10px;">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;My First Page&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
        &lt;h1&gt;Hello World!&lt;/h1&gt;
        &lt;p&gt;This is my first paragraph.&lt;/p&gt;
    &lt;/body&gt;
&lt;/html&gt;
                                </pre>
                                
                                <h3>📝 Explanation:</h3>
                                <ul>
                                    <li><strong>&lt;!DOCTYPE html&gt;</strong> - Tells browser it's HTML5</li>
                                    <li><strong>&lt;html&gt;</strong> - Root element of the page</li>
                                    <li><strong>&lt;head&gt;</strong> - Contains meta information</li>
                                    <li><strong>&lt;body&gt;</strong> - Contains visible content</li>
                                </ul>
                                
                                <div class="code-playground" style="background: #f0f0f0; padding: 20px; border-radius: 10px;">
                                    <h4>🎮 Try it yourself:</h4>
                                    <textarea id="htmlPlayground" style="width:100%; height:150px; font-family: monospace; padding:10px;">
&lt;h1&gt;My Heading&lt;/h1&gt;
&lt;p&gt;My paragraph&lt;/p&gt;
                                    </textarea>
                                    <button onclick="previewHTML()" class="btn-primary" style="margin-top:10px;">Preview</button>
                                    <div id="htmlPreview" style="background:white; padding:20px; margin-top:10px; border-radius:5px;"></div>
                                </div>
                            </div>
                        `
                    }
                ],
                questionBank: [
                    {
                        question: "What does HTML stand for?",
                        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
                        correct: 0,
                        explanation: "HTML = HyperText Markup Language, the standard language for creating web pages."
                    },
                    {
                        question: "Which tag is used for the largest heading?",
                        options: ["<h1>", "<heading>", "<h6>", "<head>"],
                        correct: 0,
                        explanation: "<h1> is the largest heading, <h6> is the smallest."
                    }
                ]
            }
        ],
        flashcardBank: [
            { front: "What is HTML?", back: "HyperText Markup Language - structure of web pages", difficulty: 1 },
            { front: "What is CSS?", back: "Cascading Style Sheets - makes websites beautiful", difficulty: 1 },
            { front: "What is JavaScript?", back: "Programming language for interactive websites", difficulty: 1 },
            { front: "What is a tag?", back: "<div>, <p>, <h1> - elements that define content", difficulty: 1 },
            { front: "What is the DOM?", back: "Document Object Model - programming interface for HTML", difficulty: 2 },
            { front: "What is responsive design?", back: "Websites that work on all devices", difficulty: 2 }
        ]
    }
};

// ===== SMART FLASHCARD SYSTEM (Spaced Repetition) =====
function loadFlashcards() {
    const cards = courseContent[currentUserData.course]?.flashcardBank || [];
    
    // Initialize mastery from localStorage or database
    if (!cardMastery[currentUserData.course]) {
        cardMastery[currentUserData.course] = {};
        cards.forEach((_, index) => {
            cardMastery[currentUserData.course][index] = 0; // 0 = never seen, 1 = learning, 2 = almost there, 3 = mastered
        });
    }
    
    // Sort cards by mastery (lowest mastery first) for spaced repetition
    currentFlashcardSet = [...cards].sort((a, b) => {
        const masteryA = cardMastery[currentUserData.course][cards.indexOf(a)] || 0;
        const masteryB = cardMastery[currentUserData.course][cards.indexOf(b)] || 0;
        return masteryA - masteryB;
    });
    
    currentFlashcardIndex = 0;
    displayFlashcard();
}

function displayFlashcard() {
    if (currentFlashcardSet.length === 0) return;
    
    const card = currentFlashcardSet[currentFlashcardIndex];
    const originalIndex = courseContent[currentUserData.course].flashcardBank.indexOf(card);
    const mastery = cardMastery[currentUserData.course][originalIndex] || 0;
    
    // Show mastery stars
    const stars = '★'.repeat(mastery) + '☆'.repeat(3 - mastery);
    
    document.getElementById('flashcardContainer').innerHTML = `
        <div class="flashcard" onclick="flipCard()">
            <div class="flashcard-content" id="flashcardContent">
                ${card.front}
            </div>
            <div class="flashcard-difficulty">${stars}</div>
        </div>
    `;
    
    updateFlashcardProgress();
}

function markKnown() {
    const card = currentFlashcardSet[currentFlashcardIndex];
    const originalIndex = courseContent[currentUserData.course].flashcardBank.indexOf(card);
    
    // Increase mastery (max 3)
    cardMastery[currentUserData.course][originalIndex] = Math.min(3, (cardMastery[currentUserData.course][originalIndex] || 0) + 1);
    
    // Add XP
    addXP(10);
    
    nextFlashcard();
}

function markReview() {
    const card = currentFlashcardSet[currentFlashcardIndex];
    const originalIndex = courseContent[currentUserData.course].flashcardBank.indexOf(card);
    
    // Decrease mastery if needed
    cardMastery[currentUserData.course][originalIndex] = Math.max(0, (cardMastery[currentUserData.course][originalIndex] || 1) - 1);
    
    nextFlashcard();
}

function updateFlashcardProgress() {
    const total = currentFlashcardSet.length;
    const mastered = Object.values(cardMastery[currentUserData.course] || {}).filter(m => m >= 3).length;
    document.getElementById('flashcardProgress').innerHTML = `
        <div class="progress-bar" style="height: 10px;">
            <div class="progress-fill" style="width: ${(mastered/total)*100}%"></div>
        </div>
        <p>Mastered: ${mastered}/${total} cards</p>
    `;
}

// ===== DYNAMIC QUIZ SYSTEM (Always different) =====
function loadQuiz() {
    const questionBank = courseContent[currentUserData.course]?.lessons[currentUserData.completed_lessons?.length || 0]?.questionBank || 
                        courseContent[currentUserData.course]?.lessons[0]?.questionBank || [];
    
    // Randomly select 5 questions from the bank
    const shuffled = [...questionBank].sort(() => 0.5 - Math.random());
    currentQuizQuestions = shuffled.slice(0, 5);
    currentQuizIndex = 0;
    quizScore = 0;
    displayQuiz();
}

function displayQuiz() {
    if (currentQuizQuestions.length === 0) return;
    
    const quiz = currentQuizQuestions[currentQuizIndex];
    let optionsHtml = '';
    
    // Randomize options order
    const optionsWithIndices = quiz.options.map((opt, idx) => ({ text: opt, originalIndex: idx }));
    const shuffledOptions = [...optionsWithIndices].sort(() => 0.5 - Math.random());
    
    shuffledOptions.forEach((option, displayIndex) => {
        optionsHtml += `
            <div class="quiz-option" onclick="selectQuizOption(${displayIndex}, ${option.originalIndex})" id="opt_${displayIndex}">
                ${option.text}
            </div>
        `;
    });
    
    document.getElementById('quizContainer').innerHTML = `
        <div class="quiz-header">
            <span class="quiz-progress">Question ${currentQuizIndex + 1}/${currentQuizQuestions.length}</span>
            <span class="quiz-score">Score: ${quizScore}/${currentQuizQuestions.length}</span>
        </div>
        <div class="quiz-question">${quiz.question}</div>
        <div class="quiz-options">
            ${optionsHtml}
        </div>
        <div class="quiz-explanation" id="quizExplanation"></div>
    `;
    
    selectedQuizOption = null;
}

function selectQuizOption(displayIndex, originalIndex) {
    // Remove previous selection
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selection
    document.getElementById(`opt_${displayIndex}`).classList.add('selected');
    selectedQuizOption = { displayIndex, originalIndex };
}

function checkQuizAnswer() {
    if (selectedQuizOption === null) {
        showToast("Please select an answer", "error");
        return;
    }
    
    const quiz = currentQuizQuestions[currentQuizIndex];
    const selectedEl = document.getElementById(`opt_${selectedQuizOption.displayIndex}`);
    const isCorrect = selectedQuizOption.originalIndex === quiz.correct;
    
    // Show correct/incorrect
    if (isCorrect) {
        selectedEl.classList.add('correct');
        quizScore++;
        
        // Add XP
        addXP(20);
        
        // Show explanation
        document.getElementById('quizExplanation').innerHTML = `
            <div class="correct-explanation">
                <i class="fas fa-check-circle"></i> ✅ Correct! ${quiz.explanation || ''}
            </div>
        `;
    } else {
        selectedEl.classList.add('wrong');
        
        // Highlight correct answer
        document.querySelectorAll('.quiz-option').forEach((opt, idx) => {
            if (idx === quiz.correct) {
                opt.classList.add('correct');
            }
        });
        
        document.getElementById('quizExplanation').innerHTML = `
            <div class="wrong-explanation">
                <i class="fas fa-times-circle"></i> ❌ Not quite. ${quiz.explanation || 'Try again next time!'}
            </div>
        `;
    }
    
    document.getElementById('quizScore').textContent = `Score: ${quizScore}/${currentQuizQuestions.length}`;
}

// ===== XP AND LEVELING SYSTEM =====
function addXP(amount) {
    userXP += amount;
    
    // Level up every 100 XP
    const newLevel = Math.floor(userXP / 100) + 1;
    if (newLevel > userLevel) {
        userLevel = newLevel;
        showToast(`🎉 Level Up! You're now level ${userLevel}!`, "success");
    }
    
    // Update UI
    updateXPDisplay();
}

function updateXPDisplay() {
    const xpElement = document.getElementById('xpDisplay');
    if (xpElement) {
        const nextLevelXP = userLevel * 100;
        const currentLevelXP = (userLevel - 1) * 100;
        const progress = ((userXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
        
        xpElement.innerHTML = `
            <div class="xp-bar">
                <div class="xp-fill" style="width: ${progress}%"></div>
            </div>
            <span>Level ${userLevel} • ${userXP} XP</span>
        `;
    }
}

// ===== RENDER LESSONS WITH MULTIPLE PAGES =====
function renderLessons() {
    const course = courseContent[currentUserData.course];
    const lessons = course?.lessons || [];
    const completed = currentUserData.completed_lessons || [];
    
    let html = '';
    lessons.forEach((lesson, lessonIndex) => {
        const isCompleted = completed.includes(lessonIndex);
        const isLocked = lessonIndex > 0 && !completed.includes(lessonIndex - 1) && !completed.includes(lessonIndex);
        
        // Get current page for this lesson (stored in user progress)
        const currentPage = currentUserData[`lesson_${lessonIndex}_page`] || 0;
        
        html += `
            <div class="lesson-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}">
                <div class="lesson-header" onclick="toggleLesson(${lessonIndex})">
                    <div class="lesson-icon">
                        <i class="fas fa-${course.icon}"></i>
                    </div>
                    <div class="lesson-title">
                        <h4>${lesson.title}</h4>
                        <p>${lesson.description}</p>
                    </div>
                    <div class="lesson-status">
                        <span class="status-badge ${isCompleted ? 'status-completed' : isLocked ? 'status-locked' : 'status-pending'}">
                            ${isCompleted ? '✓ Completed' : isLocked ? '🔒 Locked' : `Page ${currentPage + 1}/${lesson.pages.length}`}
                        </span>
                    </div>
                </div>
                
                <div class="lesson-content" id="lesson_${lessonIndex}_content" style="display: ${lessonIndex === 0 ? 'block' : 'none'};">
                    ${lesson.pages[currentPage]?.content || ''}
                    
                    <div class="lesson-navigation">
                        ${currentPage > 0 ? `<button class="btn-secondary" onclick="prevPage(${lessonIndex})">◀ Previous</button>` : ''}
                        ${currentPage < lesson.pages.length - 1 ? 
                            `<button class="btn-primary" onclick="nextPage(${lessonIndex})">Next Page ▶</button>` : 
                            `<button class="btn-success" onclick="completeLesson(${lessonIndex})">Complete Lesson ✓</button>`
                        }
                    </div>
                </div>
            </div>
        `;
    });
    
    document.getElementById('lessonsGrid').innerHTML = html;
}

// ===== PAGE NAVIGATION =====
async function nextPage(lessonIndex) {
    const currentPage = currentUserData[`lesson_${lessonIndex}_page`] || 0;
    const newPage = currentPage + 1;
    
    await supabaseClient
        .from("users")
        .update({ [`lesson_${lessonIndex}_page`]: newPage })
        .eq("email", currentUser);
    
    currentUserData[`lesson_${lessonIndex}_page`] = newPage;
    renderLessons();
}

async function prevPage(lessonIndex) {
    const currentPage = currentUserData[`lesson_${lessonIndex}_page`] || 0;
    const newPage = Math.max(0, currentPage - 1);
    
    await supabaseClient
        .from("users")
        .update({ [`lesson_${lessonIndex}_page`]: newPage })
        .eq("email", currentUser);
    
    currentUserData[`lesson_${lessonIndex}_page`] = newPage;
    renderLessons();
}

// ===== COMPLETE LESSON =====
async function completeLesson(lessonIndex) {
    try {
        const completed = currentUserData.completed_lessons || [];
        
        if (completed.includes(lessonIndex)) {
            showToast("Lesson already completed!", "info");
            return;
        }
        
        const newCompleted = [...completed, lessonIndex].sort((a, b) => a - b);
        const totalLessons = courseContent[currentUserData.course]?.lessons.length || 4;
        const newProgress = Math.round((newCompleted.length / totalLessons) * 100);
        
        // Add XP for completing lesson
        addXP(50);
        
        const { error } = await supabaseClient
            .from("users")
            .update({ 
                completed_lessons: newCompleted,
                progress: newProgress
            })
            .eq("email", currentUser);
            
        if (error) throw error;
        
        currentUserData.completed_lessons = newCompleted;
        currentUserData.progress = newProgress;
        
        updateProgress();
        renderLessons();
        loadQuiz(); // Load next lesson's quiz
        
        showToast(`🎉 Lesson ${lessonIndex + 1} completed! +50 XP`, "success");
        
    } catch (error) {
        console.error('Error:', error);
        showToast("Failed to complete lesson", "error");
    }
}

// ===== RENDER DASHBOARD (Updated with XP) =====
function renderDashboard() {
    showDashboard();
    
    const access = checkAccess(currentUserData);
    
    // Update header
    document.getElementById('userAvatar').textContent = currentUserData.name.charAt(0).toUpperCase();
    document.getElementById('welcome').innerHTML = `Welcome, ${currentUserData.name}! <span id="xpDisplay"></span>`;
    
    // Initialize XP display
    updateXPDisplay();
    
    const courseInfo = courseContent[currentUserData.course] || courseContent.webdev;
    document.getElementById('courseTitle').innerHTML = `<i class="fas fa-${courseInfo.icon}" style="color: ${courseInfo.color}"></i> ${courseInfo.title}`;
    
    // Show/hide trial timer
    if (access.status === 'trial') {
        document.getElementById('trialTimer').style.display = 'flex';
        document.getElementById('trialHeaderBadge').style.display = 'block';
        startCountdown(new Date(currentUserData.trial_end));
    } else {
        document.getElementById('trialTimer').style.display = 'none';
        document.getElementById('trialHeaderBadge').style.display = 'none';
    }
    
    // Show/hide payment wall
    if (access.status === 'locked') {
        document.getElementById('paymentWall').style.display = 'block';
        document.getElementById('dashboardContent').style.display = 'none';
        renderLockedProgress();
    } else {
        document.getElementById('paymentWall').style.display = 'none';
        document.getElementById('dashboardContent').style.display = 'block';
        
        // Show/hide YouTube section (only after payment)
        if (access.showYouTube) {
            document.getElementById('youtubeSection').style.display = 'block';
            renderYouTubeTeachers();
        } else {
            document.getElementById('youtubeSection').style.display = 'none';
        }
        
        // Render regular content
        renderLessons();
        updateProgress();
        loadFlashcards();
        loadQuiz();
        
        // Show certificate section if course completed
        if (currentUserData.progress === 100) {
            document.getElementById('certificateSection').style.display = 'block';
        }
    }
}

// Add this CSS to your style.css
const additionalStyles = `
    .lesson-page {
        padding: 20px;
        line-height: 1.8;
    }
    
    .lesson-page h2 {
        color: #667eea;
        margin-bottom: 20px;
    }
    
    .lesson-page h3 {
        color: #764ba2;
        margin: 20px 0 10px;
    }
    
    .highlight-box {
        background: linear-gradient(135deg, #667eea10, #764ba210);
        border-left: 4px solid #667eea;
        padding: 20px;
        margin: 20px 0;
        border-radius: 0 10px 10px 0;
    }
    
    .example-box {
        background: #f0f8ff;
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
    }
    
    .warning-box {
        background: #fff3cd;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
    }
    
    .interactive-example {
        background: #f3e5f5;
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
    }
    
    th {
        background: #667eea;
        color: white;
        padding: 12px;
    }
    
    td {
        padding: 10px;
        border-bottom: 1px solid #ddd;
    }
    
    .lesson-header {
        display: flex;
        align-items: center;
        gap: 15px;
        cursor: pointer;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 10px;
    }
    
    .lesson-navigation {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 30px;
    }
    
    .quiz-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 8px;
    }
    
    .quiz-explanation {
        margin-top: 20px;
        padding: 15px;
        border-radius: 8px;
    }
    
    .correct-explanation {
        background: #d4edda;
        color: #155724;
        padding: 15px;
        border-radius: 8px;
    }
    
    .wrong-explanation {
        background: #f8d7da;
        color: #721c24;
        padding: 15px;
        border-radius: 8px;
    }
    
    .xp-bar {
        width: 100px;
        height: 6px;
        background: #e0e0e0;
        border-radius: 3px;
        display: inline-block;
        margin: 0 10px;
    }
    
    .xp-fill {
        height: 100%;
        background: linear-gradient(90deg, #ffd700, #ffa500);
        border-radius: 3px;
    }
    
    .flashcard-difficulty {
        text-align: center;
        margin-top: 10px;
        color: #ffc107;
        font-size: 1.2rem;
    }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
