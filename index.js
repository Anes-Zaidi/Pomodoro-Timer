// Selection of elements  
const pomodoro = document.getElementById("pomodorobtn")
const shortBreakBtn = document.getElementById("shortbreakbtn")
const longBreakBtn = document.getElementById("longbreakbtn")
const pausebtn = document.getElementById("pausebtn")
const timer = document.getElementById("time")
const timerButtons = document.querySelectorAll(".button")
const reloadbtn = document.getElementById("rotate")
const settingbtn = document.getElementById("gear")
const exitModal = document.getElementById("exit-modal")
const modal = document.getElementById("setting-modal")
const settingButtons = document.querySelectorAll(".settingsBtn")
const themes = document.getElementById("themes")
const saveButton = document.getElementById("save-button")
const expandButton = document.getElementById("expand")
let soundsBtn = document.getElementById("sounds")
let soundsModal = document.querySelector(".sounds-modal")
let closeSoundsModalBtn = document.querySelector(".close-sounds-modal")
const settingSections = document.querySelectorAll('.setting-content > div')
const notificationSound = document.getElementById("sound-option")
const resetBtn = document.getElementById("reset-button")
let NSvolume = document.getElementById("volume-control")
let mainContentTimer = document.querySelector(".mainContent-Timer") 
let mainContentPage = document.querySelector(".mainContent-home")
let TimerPagebtn = document.querySelector("#timerPage")
let HomePageBtn = document.querySelector("#HomePage")
let mainContent = document.querySelector(".mainContent")
let CTime = document.querySelector("#Current-Time")
const bottomBtns = document.querySelectorAll(".btm")
const AmPm = document.querySelector("#ampm")
const userNameModal = document.querySelector(".userNameModal")
const submitBtn = document.querySelector("#submitBtn")
const userInput = document.querySelector("#userNameInput")
const userForm = document.querySelector("#userForm")
const GreetingText = document.querySelector("#greeting")
let repeatAlarmNumber = document.querySelector("#repeatAlarm")
const editUserNameBtn =  document.querySelector("#editUserNameBtn")
let UserN = localStorage.getItem("userName")
let profileName = document.querySelector("#profile-name")
const soundContainer = document.querySelector(".sounds-main")
const Mtext = document.querySelector("#MT")



// declaration of constants and variables
let mainTimer = 3
let longTimer = document.getElementById("longBreakTime").value *60
let shortTimer = document.getElementById("shortBreakTime").value *60
let countdown
let currentTimeHolder
let remainingTime
let isPaused = true
let isFullScreen = false
let selectedTheme
let y
let isPlaying = false
let i = 0  ; let j = 0 ; let counter
let soundArray = []
let soundName = []
let notificationArray = []
let isNSPlaying = false




// Objects

let Settings = {
    MainTimer : { time :25*60} ,
    ShortTimer : {time : 5*60} ,
    LongTimer : {time : 600},
    Background : {bg : "pinkClouds"},

    Alarm : {alarm : "goodVibe",
        volume : 0.5},

    Repeat : {Rp : 1}
}


let soundConfig = [
    {
        id: "AirPlaneCabin" ,
        audiosrc : "backgroundSounds/AirPlaneCabin.mp3" ,
        icon : "soundIcons/airplane.png" ,
        label : "Air plane cabin"
    } ,
    {
        id: "Waterfall" ,
        audiosrc : "backgroundSounds/waterfall-in-the-mountains_nature-sound-161925.mp3" ,
        icon : "soundIcons/ocean.png" ,
        label : "Waterfall"
    } ,
    {
        id: "Cat purs" ,
        audiosrc : "backgroundSounds/cat-purring-58181.mp3" ,
        icon : "soundIcons/cat2.png" ,
        label : "Cat purs"
    } ,
    {
        id: "Rain & thunder" ,
        audiosrc : "backgroundSounds/RainThunder.mp3" ,
        icon : "soundIcons/thunder_cloud_and_rain.png" ,
        label : "Rain & Thunder"
    } ,
    {
        id: "Birds in Nature" ,
        audiosrc : "backgroundSounds/bird-sounds-in-the-forest-223177.mp3" ,
        icon : "soundIcons/bird.png" ,
        label : "Birds in Nature"
    } ,
    {
        id: "Wind" ,
        audiosrc : "backgroundSounds/cold-wind-sound-effect-127448.mp3" ,
        icon : "soundIcons/wind_blowing_face.png" ,
        label : "Wind"
    } ,
    {
        id: "Camp Fire" ,
        audiosrc : "backgroundSounds/campfire-crackling-fireplace-sound-119594.mp3" ,
        icon : "soundIcons/fire.png" ,
        label : "Camp Fire"
    } ,
    {
        id: "Clock ticking" ,
        audiosrc : "backgroundSounds/ticking-clock-sound-effect-1-mp3-edition-264451.mp3" ,
        icon : "soundIcons/mantelpiece_clock.png" ,
        label : "Clock ticking"
    } ,
    {
        id: "Forest" ,
        audiosrc : "backgroundSounds/Forest.mp3" ,
        icon : "soundIcons/evergreen_tree.png" ,
        label : "Forest"
    } ,

    
]

let sounds = {}


let userSettings = JSON.parse(localStorage.getItem("userSettings", Settings))

document.addEventListener("DOMContentLoaded", () => {
    // These if statements should always be before the checkActiveClass
    if(!userSettings){
        localStorage.setItem("userSettings",JSON.stringify(Settings))
         if (pomodoro.classList.contains("active")) {
        formatTime(Settings.MainTimer.time)
        remainingTime = Settings.MainTimer.time
    } else if (shortBreakBtn.classList.contains("active")) {
        formatTime(Settings.ShortTimer.time)
        remainingTime = Settings.ShortTimer.time
    } else if (longBreakBtn.classList.contains("active")) {
        formatTime(Settings.LongTimer.time)
        remainingTime = Settings.LongTimer.time
    }
    }
    else{
        checkActiveClass()}

    // checks if there is a userName already
    if(!UserN){
         userNameModal.showModal()
    }
    
    setInterval(UpdateHomeTime,1000)
    // Selects the home page
    HomePageBtn.classList.add("activeBtn")

    profileName.innerHTML = `Your name : ${UserN}`
    setSetting()
    themes.value = userSettings.Background.bg
    console.log(userSettings)
    // Plays the home page animation when the page loads
    mainContentPage.classList.add("page-enter-left")
    setTimeout(() => {
        mainContentPage.classList.remove("page-enter-left");
    }, 320);


})

window.onload = function(){
    displaySavedName()
}

// Functions ---------------------------------------------------

// localStorage.removeItem("userSettings")
function verifyIfPaused(state) {
    pausebtn.textContent = state ? "Start" : "Pause"
}

// checks the active class and changes the timer accordingly
function checkActiveClass() {
    clearInterval(countdown)
    isPaused = true

    if (pomodoro.classList.contains("active")) {
        formatTime(userSettings.MainTimer.time)
        remainingTime = userSettings.MainTimer.time
    } else if (shortBreakBtn.classList.contains("active")) {
        formatTime(userSettings.ShortTimer.time)
        remainingTime = userSettings.ShortTimer.time
    } else if (longBreakBtn.classList.contains("active")) {
        formatTime(userSettings.LongTimer.time)
        remainingTime = userSettings.LongTimer.time
    }

    verifyIfPaused(isPaused)
}

// Formates the time
function formatTime(seconds) {
    const formattedSeconds = seconds % 60
    const minutes = Math.floor(seconds/60)      
    timer.textContent = `${minutes.toString().padStart(2, "0")}:${formattedSeconds.toString().padStart(2, "0")}`;
}

function setSetting(){
    document.body.style.backgroundImage = `url(backgrounds/${userSettings.Background.bg}.jpg)`;
    NSvolume.value = userSettings.Alarm.volume
    repeatAlarmNumber = userSettings.Repeat.Rp
    notificationSound.value = userSettings.Alarm.alarm
    document.getElementById("pomodoroTime").value = userSettings.MainTimer.time / 60
    document.getElementById("longBreakTime").value = userSettings.LongTimer.time / 60
    document.getElementById("shortBreakTime").value = userSettings.ShortTimer.time / 60
}

// update the time 
function updateTime(x) {
    currentTimeHolder = x
    clearInterval(countdown)
    formatTime(x)

    countdown = setInterval(() => {
        x -= 1
        remainingTime = x
        formatTime(x)

        const hours = Math.floor(x / 3600)    
        const formattedSeconds = x % 60
        if(hours != 0){
            const minutes = Math.floor((x - (hours * 3600))/60)
            document.title =`⚡${hours.toString().padStart(2 , "0")}:${minutes.toString().padStart(2, "0")}:${formattedSeconds.toString().padStart(2, "0")}`;   
            timer.textContent = `${hours}:${minutes.toString().padStart(2, "0")}:${formattedSeconds.toString().padStart(2, "0")}`;        
        }
        else{
            const minutes = Math.floor(x /60)
            document.title =`⚡ ${minutes.toString().padStart(2, "0")}:${formattedSeconds.toString().padStart(2, "0")}`;
            timer.textContent = `${minutes.toString().padStart(2, "0")}:${formattedSeconds.toString().padStart(2, "0")}`;
        }

        if (x < 0) {
            clearInterval(countdown);
            checkActiveClass()
            x = 0
            isPaused = true;
            verifyIfPaused(isPaused);
            PlayCurrentNS(notificationSound.value) 

            for(counter = 1 ; counter <= repeatAlarmNumber.value ; counter++){
                setTimeout(() => {
                    PlayCurrentNS(notificationSound.value)   
                }, (counter - 1) * 5000)
            }
            document.title = "Pomodoro"

        } else {
            isPaused = false;
            verifyIfPaused(isPaused);
        }

    }, 1000);


}

// set the background based on the selected theme
function updateBackground() {
    selectedTheme = themes.value;
    document.body.style.backgroundImage = `url(backgrounds/${selectedTheme}.jpg)`;
}

// enter and exit fullscreen
function enterFullScreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
}

function closeFullscreen() {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
}


// Reset to intial values
function reset(){
    document.getElementById("pomodoroTime").value = 25
    document.getElementById("longBreakTime").value = 10
    document.getElementById("shortBreakTime").value = 5
    NSvolume = 0.5

    userSettings.MainTimer.time = 25*60
    userSettings.LongTimer.time = 10*60
    userSettings.ShortTimer.time = 5*60
    userSettings.Alarm.volume = 0.5

    notificationSound.value ="goodVibe"
    themes.value = "pinkClouds";
    document.body.style.backgroundImage = `url(backgrounds/pinkClouds.jpg)`;
}

// Play the selected notification sound
function PlayCurrentNS(sound){
    const Sound = new Audio(`notificationSounds/${sound}.mp3`)
    notificationArray[j] = Sound

    if(!isNSPlaying){
        Sound.volume = NSvolume.value
        Sound.play() 
        isNSPlaying = true
    }
    else{
        if(notificationArray[j-1]){
            notificationArray[j-1].pause()
            notificationArray[j-1].currentTime = 0          
        }

        Sound.volume = NSvolume.value
        Sound.play()
    }
    j++
}


function audioVolume(sound){
    return document.getElementById(`volume-control-${sound}`).value
}


// Update home page time
function UpdateHomeTime(){
    const now = new Date()
    let hours = now.getHours()
    let minutes = now.getMinutes().toString().padStart(2 , "0")
    const ampm = now.getHours() >= 12 ? "PM" : "AM" 
    if(hours > 12){
        hours %= 12
    }
    CTime.innerHTML = `${hours}:${minutes}`
    AmPm.innerHTML = `${ampm}`
}


// Closes the modal
function closeModal(currentModal) {
    currentModal.setAttribute("close", "");
    currentModal.addEventListener("animationend", () => {
        currentModal.removeAttribute('close');
        currentModal.close();
    }, { once: true });
}

function displaySavedName(){
    const savedName = localStorage.getItem("userName")
    const date = new Date
    if(savedName){
        if(date.getHours() <= 4){
          GreetingText.innerHTML = `Remember ${savedName.toUpperCase()}!,`
          Mtext.innerHTML = "good sleep = productive day"
        }
        else if(date.getHours() <= 11){
            GreetingText.innerHTML = `Good morning ${savedName.toUpperCase()}!,`  
            Mtext.innerHTML = "Let's make this day count"
        }else if(date.getHours() <= 17){
            GreetingText.innerHTML = `Good Afternoon ${savedName.toUpperCase()}!,`  
            Mtext.innerHTML = "Gotta keep working!"

        }else if(date.getHours() <= 22){
            GreetingText.innerHTML = `Good Evening ${savedName.toUpperCase()}!,`  
            Mtext.innerHTML = "You did good so far, keep it going!"

        }
        else if(date.getHours() <= 24){
            GreetingText.innerHTML = `Good Night ${savedName.toUpperCase()}!,`  
            Mtext.innerHTML = "Time to recharge for tomorow"
        }
        
        
        profileName.innerHTML = `Your name : ${savedName.toUpperCase()}`
    }
    else{
        console.warn("There is no username")
    }
}


function createSoundControl(){
    soundConfig.forEach(({id , audiosrc , icon , label}) =>{
        const soundDiv = document.createElement("div")
        soundDiv.classList.add("S")

        //Create button img and its label
        const button = document.createElement("button")
        button.id = id
        button.dataset.active = "false" 

        const img = document.createElement("img")
        img.src = icon
        img.alt = `${label} icon`

        const text = document.createElement("p")
        text.textContent = label

        // append img and label to button
        button.appendChild(img)
        button.appendChild(text)

        const volumeSlider = document.createElement("input")
        volumeSlider.type = "range"
        volumeSlider.id = "volume-control" // this id might cause problems
        volumeSlider.classList.add("VC")
        volumeSlider.max = 1
        volumeSlider.min = 0
        volumeSlider.step = 0.01
        volumeSlider.value = 0.5

        // Adds every thing to the container
        soundDiv.appendChild(button)
        soundDiv.appendChild(volumeSlider)
        soundContainer.appendChild(soundDiv)

        const audio = new Audio(audiosrc)
        sounds[id] = {audio}
        audio.volume = 0.5
        

        button.addEventListener("click" , function(){
            if(this.classList.contains("active")){
                this.classList.remove("active")
                volumeSlider.classList.remove("active")
            }
            else{
                this.classList.add("active")
                volumeSlider.classList.add("active")
            }

            if(button.dataset.active === "false"){
                audio.currentTime = 0
                audio.loop = true
                audio.play()
                button.dataset.active = "true"
            }else if(button.dataset.active === "true"){
                audio.pause()
                audio.currentTime = 0
                button.dataset.active = "false"
            }
        })

        volumeSlider.addEventListener("input" , ()=>{
            audio.volume = parseFloat(volumeSlider.value)
        })


    })
}




/* Event listeners ------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------*/





UpdateHomeTime()
createSoundControl()

 localStorage.removeItem("userName")
localStorage.removeItem("userSettings")

pausebtn.addEventListener('click', () => {
    isPaused = !isPaused;

    if (!isPaused) {
        if (currentTimeHolder !== remainingTime && remainingTime > 0) {
            clearInterval(countdown);
            updateTime(remainingTime);
        } else {
            if (pomodoro.classList.contains('active')) updateTime(userSettings.MainTimer.time);
            else if (shortBreakBtn.classList.contains('active')) updateTime(userSettings.ShortTimer.time);
            else if (longBreakBtn.classList.contains('active')) updateTime(userSettings.LongTimer.time);
        }
    } else {
        clearInterval(countdown);
        formatTime(remainingTime);
    }
    verifyIfPaused(isPaused);
});

// Timer button functionality
timerButtons.forEach(button => {
    button.addEventListener('click', function() {
        timerButtons.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
        checkActiveClass();
    });
});

// Setting button functionality

settingButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        settingButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        settingSections.forEach(section => section.style.display = 'none');
        settingSections[index].style.display = 'block';
    });
});


// Reset timer button functionality and animation
reloadbtn.addEventListener("click", function() {
    this.classList.add("rotate");
    document.title = "pomodoro"

    setTimeout(() => {
        this.classList.remove("rotate");
    }, 1200);

    console.log(userSettings.MainTimer.time)
    clearInterval(countdown);
    checkActiveClass();
    verifyIfPaused(isPaused);
});

// Show/Hide settings modal
settingbtn.addEventListener('click', () => {
    modal.showModal();
});

exitModal.addEventListener('click',()=>{
  closeModal(modal)  
} );

document.addEventListener("click",(event)=>{
    if(event.target === soundsModal){
        closeModal(soundsModal)
    }
    else if(event.target === modal){
        closeModal(modal)
    }
})

// Toggle fullscreen mode
expandButton.addEventListener('click', () => {
    if (!isFullScreen) {
        enterFullScreen();
        isFullScreen = true;
    } else {
        closeFullscreen();
        isFullScreen = false;
    }
});

soundsBtn.addEventListener('click',()=>{
    soundsModal.showModal()
})

closeSoundsModalBtn.addEventListener('click', ()=>{
    closeModal(soundsModal)
})

//change the theme instantly
themes.addEventListener('change', ()=>{
    updateBackground()
    Settings.Background.bg = themes.value
});

notificationSound.addEventListener("change" ,()=>{
    PlayCurrentNS(notificationSound.value)
})

//saves the changes and close the modal
saveButton.addEventListener("click", ()=>{
    Settings.MainTimer.time = userSettings.MainTimer.time = document.getElementById("pomodoroTime").value *60
    Settings.LongTimer.time = userSettings.LongTimer.time =  document.getElementById("longBreakTime").value *60
    Settings.ShortTimer.time = userSettings.ShortTimer.time =  document.getElementById("shortBreakTime").value *60

    Settings.Background.bg = themes.value
    Settings.Alarm.alarm = notificationSound.value
    Settings.Alarm.volume = NSvolume.value
    // Settings.Repeat.Rp =  repeatAlarmNumber.value


    localStorage.setItem("userSettings",JSON.stringify(Settings))

    console.log(Settings)
    checkActiveClass()
    updateBackground()
    closeModal(modal)
})

// reset to deufault values
resetBtn.addEventListener("click", ()=>{
    reset()
})

// 
NSvolume.addEventListener("input",()=>{
    PlayCurrentNS(notificationSound.value)
})



// Function to switch to Timer Page
function showTimerPage() {
    if (mainContent.dataset.page === "home") {
        // Apply exit animation to the home page
        mainContentPage.classList.add("page-exit-left");
        mainContent.dataset.page = "timer";

        // Wait for the page exit animation to finish
        setTimeout(() => {
            // Now, show the timer page and start its entry animation
            mainContentTimer.classList.remove("hidden");
            mainContentTimer.classList.add("page-fadeIn");

            // Hide the home page and remove exit animation class
            mainContentPage.classList.add("hidden");
            mainContentPage.classList.remove("page-exit-left");

            // Clean up the timer page entry class after the animation completes
            setTimeout(() => {
                mainContentTimer.classList.remove("page-fadeIn");
            }, 320); // Match the duration of page-fadeIn animation
        }, 320); // Match the duration of page-exit-left animation
    }
}

// Function to switch to Home Page
function showHomePage() {
    if (mainContent.dataset.page === "timer") {
        // Apply exit animation to the timer page
        mainContentTimer.classList.add("page-fadeOut");
        mainContent.dataset.page = "home"; 

        // Wait for the page fadeOut animation to finish
        setTimeout(() => {
            // Now, show the home page and start its entry animation
            mainContentPage.classList.remove("hidden");
            mainContentPage.classList.add("page-enter-left");

            // Hide the timer page and remove fadeOut class
            mainContentTimer.classList.add("hidden");
            mainContentTimer.classList.remove("page-fadeOut");

            // Clean up the home page entry class after the animation completes
            setTimeout(() => {
                mainContentPage.classList.remove("page-enter-left");
            }, 320); // Match the duration of page-enter-left animation
        }, 320); // Match the duration of page-fadeOut animation
    }
}


// Event listeners
TimerPagebtn.addEventListener("click", ()=>{
    showTimerPage()
    HomePageBtn.classList.remove("activeBtn")
    TimerPagebtn.classList.add("activeBtn")
});
HomePageBtn.addEventListener("click", ()=>{
    showHomePage()
    TimerPagebtn.classList.remove("activeBtn")
    HomePageBtn.classList.add("activeBtn")
});


userForm.addEventListener("submit",function(event){
    event.preventDefault()

    const userName = userInput.value

    if(userName){
        localStorage.setItem("userName" , userName)
        userNameModal.close()
    }

    displaySavedName()
})

editUserNameBtn.addEventListener('click',()=>{
    if(UserN){
        userNameModal.showModal()
        localStorage.removeItem("userName")
    }
})



  

// to do ---------------------------------------------------------------


// fix the sounds styling

//dir functionement ta3 sound bar 

