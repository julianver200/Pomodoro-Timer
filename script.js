// Timer duration variables (in seconds)
let workTime = 30 * 60;        // 30 minutes
let breakTime = 5 * 60;        // 5 minutes  
let longBreakTime = 15 * 60;   // 15 minutes

// Timer state variables
let isRunning = false;         // Is timer currently running?
let timerInterval;             // Stores the interval ID
let currentMode = 'pomodoro';  // Current mode: 'pomodoro', 'shortBreak', 'longBreak'
let currentTime = workTime;    // Current countdown time remaining
let pomodoroCounter = 0;
let shortBreakCounter = 0;
let longBreakCounter = 0;



const countP = document.getElementById("pomodoroCounter");
const countS = document.getElementById("sCounter");
const countL = document.getElementById("lCounter");
const completedTasksCounter = 0;


// References to HTML elements
const timerDisplay = document.querySelector('.timer');
const startButton = document.querySelector('.start-button');
const resetButton = document.querySelector('.reset-button');
const modeButtons = document.querySelectorAll('.modes');

const formatTime= (seconds) =>{
    const m = Math.floor(seconds/60);
    const s = seconds%60;

    const min = String(m).padStart(2, 0);
    const sec = String(s).padStart(2,0);

    return `${min}:${sec}`;

}

const updateDisplay = () =>{
    timerDisplay.textContent = formatTime(currentTime);

}

const getCurrentModeTime= () => {
    switch(currentMode){
        case 'pomodoro': 
            return workTime;
        case 'shortBreak':
           return breakTime;
        case 'longBreak':
            return longBreakTime;
        default:
            return workTime;

    }

}

const startTimer= ()=>{
    
    if(!isRunning){

        isRunning = true;
        startButton.textContent='Pause';

        timerInterval = 
            setInterval(()=>{
                if(currentTime > 0){
                    currentTime--;
                    updateDisplay();
                }else{
                    startButton.textContent = "Start";
                    isRunning = false;
                    clearInterval(timerInterval);

                    

                    // Auto-switch logic
                    if(currentMode === "pomodoro"){
                        pomodoroCounter++;
                        countP.textContent = `Pomodoros: ${pomodoroCounter}`;

                        // After 3 Pomodoros, go to Long Break, otherwise Short Break
                        if(pomodoroCounter % 3 === 0){
                            switchMode("longBreak");
                        } else {
                            switchMode("shortBreak");
                        }

                    } else if(currentMode === "shortBreak"){
                        shortBreakCounter++;
                        countS.textContent = `Short Breaks: ${shortBreakCounter}`;
                        switchMode("pomodoro");

                    } else if(currentMode === "longBreak"){
                        longBreakCounter++;
                        countL.textContent = `Long Breaks: ${longBreakCounter}`;
                        switchMode("pomodoro");
                    }

                    // Restart automatically after switching
                    startTimer();
                    
                }
              
            },1000);
            
            skipTimer();
            
    }
}

let skipbutton = document.querySelector(".skip-button"); // single element

const skipTimer = () => {
        if (skipbutton) {
            skipbutton.style.display = "flex";
            startButton.style.marginLeft = "79px";
            skipbutton.onclick = () => {
                
                clearInterval(timerInterval);
                isRunning = false;
                startButton.textContent = "Start";
                if(currentMode === 'pomodoro'){
                    pomodoroCounter++;
                    switchMode('shortBreak');
                    countP.textContent = `Pomodoros: ${pomodoroCounter}`;
                }else if(currentMode === 'shortBreak'){
                    
                    shortBreakCounter++;
                    switchMode('pomodoro');
                    countS.textContent = `Short Breaks: ${pomodoroCounter}`;
                    if (pomodoroCounter % 3 === 0) {
                        switchMode("longBreak");
                    } else {
                        switchMode("pomodoro");
                    }
                    
                } else if(currentMode === 'longBreak'){
                    longBreakCounter++;
                    switchMode('pomodoro');
                    countL.textContent = `Long Breaks: ${longBreakCounter}`;
                }
                skipbutton.style.display = "none"; // hide skip button again
                startButton.style.marginLeft= "0";
            }
        }
        
    }


const pauseTimer = () => {
    isRunning = false;
    startButton.textContent = "Start";
    clearInterval(timerInterval);
   
}



const toggleTimer = () => {
    
        
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
   
}

const resetTimer = () => {
     if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    isRunning = false;
    
    if(startButton.textContent === "Pause"){
        startButton.textContent = "Start"
    }

    pomodoroCounter = 0;
    shortBreakCounter = 0;
    longBreakCounter = 0;

    countP.textContent = `Pomodoros: ${pomodoroCounter}`;
    countS.textContent = `Short Breaks: ${shortBreakCounter}`;
    countL.textContent = `Long Breaks: ${longBreakCounter}`;
    
    skipbutton.style.display = "none";
    startButton.style.marginLeft= "0";
    currentMode = 'pomodoro';
    currentTime = getCurrentModeTime();
    updateDisplay();
    
} 
const switchMode = (modes) => {
    
    if (modes !== 'pomodoro' && modes !== 'shortBreak' && modes !== 'longBreak') {
        return;
    }
    if(timerInterval){ // if time is running 
    // stops it
        clearInterval(timerInterval);
        timerInterval =null;
    }

    currentMode = modes;
    currentTime = getCurrentModeTime();
    updateDisplay();
       
};

const attachEventListeners = () => {
    startButton.addEventListener("click", toggleTimer); // fixed for Start/Pause
    resetButton.addEventListener("click", resetTimer);
    addButton.addEventListener("click", addTask);
    

    modeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const text = button.textContent.trim().toLowerCase();

            if (text === "pomodoro") switchMode("pomodoro");
            else if (text === "short break") switchMode("shortBreak");
            else if (text === "long break") switchMode("longBreak");
        });
    });
};

const addButton = document.getElementById("addTaskBtn");
let taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
 
const addTask = () =>{
    let taskText = taskInput.value.trim();   
    if(taskText===""){window.alert("Input cannot be empty!")};

    let newListItem = document.createElement('li');
    newListItem.classList.add("task-item");

        // checkbox
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("task-checkbox");

    // task text
    let taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;
    taskSpan.classList.add("task-text");

    // delete button
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.classList.add("delete-btn");

    // append them all inside li
    newListItem.appendChild(checkbox);
    newListItem.appendChild(taskSpan);
    newListItem.appendChild(deleteButton);

    // then add li into taskList
    taskList.appendChild(newListItem);

    taskInput.value = "";
     taskCounter();

    deleteButton.addEventListener("click", ()=>{
        newListItem.remove();
        taskCounter();
    }); 

    const deleteAll = document.getElementById("deletedTasks");
    deleteAll.addEventListener("click", () => {
    

        if(checkbox && checkbox.checked){
            newListItem.remove();
            taskCounter();
        }}

        
    )
            checkbox.addEventListener("change", () => {
                completedTotal++;
            completedTaskCounter();
            });
            
    }



const counter = document.getElementById("totalTasks");

const taskCounter = () => {
    let tasks = taskList.querySelectorAll("li");
    counter.textContent = `Total: ${tasks.length}`;
}

let completedTotal = 0;
const completedTaskCounter = () => {
    

    const completedT = document.getElementById("completedTasks");
    completedT.textContent = `Completed: ${completedTotal}`;
}


document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    attachEventListeners();
});



/*
Implementation Order (Learning Path):
Start with variables - Declare all your state variables
Create formatTime() - Learn to format numbers as time
Create updateDisplay() - Learn to update DOM elements
Create getCurrentModeTime() - Learn switch statements
Create startTimer() - Learn setInterval and countdown logic
Create pauseTimer() - Learn clearInterval
Create toggleTimer() - Learn conditional logic
Create resetTimer() - Learn to reset state
Create switchMode() - Learn DOM manipulation and styling
Create attachEventListeners() - Learn event handling
Create initializeTimer() - Learn initialization patterns
Add DOMContentLoaded listener - Learn when to run code
*/
