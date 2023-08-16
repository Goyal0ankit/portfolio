
const firebaseConfig = {
  apiKey: "AIzaSyA0X2OKT4SFSQSJmIDy1ZN0kOurGcGwBlg",
  authDomain: "contact-form-c6d8a.firebaseapp.com",
  databaseURL: "https://contact-form-c6d8a-default-rtdb.firebaseio.com",
  projectId: "contact-form-c6d8a",
  storageBucket: "contact-form-c6d8a.appspot.com",
  messagingSenderId: "80438273352",
  appId: "1:80438273352:web:518a0e2bedba0291b0bf7d",
  measurementId: "G-2JRC7PXNQR"
};
// initialize firebase
firebase.initializeApp(firebaseConfig);

// reference your database
var contactFormDB = firebase.database().ref("contactForm");

document.getElementById("contactForm").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  var name = getElementVal("name");
  var emailid = getElementVal("emailid");
  var msgContent = getElementVal("msgContent");

  saveMessages(name, emailid, msgContent);

  //   enable alert
  document.querySelector(".alert").style.display = "block";

  //   remove the alert
  setTimeout(() => {
    document.querySelector(".alert").style.display = "none";
  }, 3000);

  //   reset the form
  document.getElementById("contactForm").reset();
}

const saveMessages = (name, emailid, msgContent) => {
  var newContactForm = contactFormDB.push();

  newContactForm.set({
    name: name,
    emailid: emailid,
    msgContent: msgContent,
  });
};

const getElementVal = (id) => {
  return document.getElementById(id).value;
};



/*===== MENU SHOW =====*/
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId);

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show");
    });
  }
};
showMenu("nav-toggle", "nav-menu");

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll(".nav__link");

function linkAction() {
  const navMenu = document.getElementById("nav-menu");
  // When we click on each nav__link, we remove the show-menu class
  navMenu.classList.remove("show");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 50;
    sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.add("active");
    } else {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.remove("active");
    }
  });
}
window.addEventListener("scroll", scrollActive);

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
  origin: "top",
  distance: "60px",
  duration: 2000,
  delay: 200,
  //     reset: true
});

const btn = document.querySelector(".btn-toggle");
const theme = document.querySelector("#theme-link");
btn.addEventListener("click", function () {
  // Swap out the URL for the different stylesheets
  if (theme.getAttribute("href") == "assets/css/styles-day.css") {
    theme.href = "assets/css/styles-night.css";
  } else {
    theme.href = "assets/css/styles-day.css";
  }
});

sr.reveal(".home__data, .about__img, .skills__subtitle, .skills__text", {});
sr.reveal(".home__img, .about__subtitle, .about__text, .skills__img", {
  delay: 400,
});
sr.reveal(".home__social-icon", { interval: 200 });
sr.reveal(".skills__data, .work__img, .contact__input", { interval: 200 });

//weather api

// import dotenv from 'dotenv';
// dotenv.config();
// console.log(process.env);

let temp1save,
  temp2save = 0,
  showTime;
let weather = {
  apiKey: "e1b292964b3c86ad361260f80c9496e0",
  fetchWrapper: async function (url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      this.displayAlert(error.message, () => location.reload());
    }
  },
  fetchWeather: async function (city, lat = null, lon = null) {
    if (lat && lon) {
      const data = await this.fetchWrapper(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`
      );
      this.displayWeather(data);
    } else if (city) {
      //if user searched for a country
      // fetching data from restcountries API
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${city}`
      );
      const data = await response.json();
      if (data.status !== 404) {
        this.fetchWeather(city, data[0].latlng[0], data[0].latlng[1]);
        return;
      }
      const dataWeather = await this.fetchWrapper(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`
      );
      this.displayWeather(dataWeather);
    }
  },
  displayWeather: function (data) {
    const {
      name,
      timezone,
      main: { temp, humidity },
      wind: { speed },
      weather: [{ icon, description }],
      sys: { country },
    } = data;
    console.log(data);

    document.querySelector(".weather").style.display = "flex";
    const temp2 = temp * 1.8 + 32;
    document.querySelector(".city").innerText = `${name}`;
    document.querySelector(
      ".icon"
    ).src = `https://openweathermap.org/img/wn/${icon}.png`;

    !document.querySelector("#checkbox").checked
      ? (document.querySelector(".temp").innerText = `${temp.toFixed(2)}℃`)
      : (document.querySelector(".temp").innerText = `${temp2.toFixed(2)}℉`);
    temp1save = temp.toFixed(2);
    temp2save = temp2.toFixed(2);
    speed1 = speed.toFixed(2);
    speed2 = (speed * 0.62137).toFixed(2);

    document.querySelector(".weather").classList.remove("loading");
    // console.log(process.env.APIKEY);
    document.querySelector(
      ".flag"
    ).src = `./assets/flags/${country.toLowerCase()}.svg`;
  },
};

// ask for location permission
// if granted: show user's location weather data
// if blocked: show default location weather data
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    weather.fetchWeather(null, latitude, longitude);
  },
  () => weather.fetchWeather("jaipur")
);

function onTempChange() {
  !document.querySelector("#checkbox").checked
    ? (document.querySelector(".temp").innerText = `${temp1save}℃`)
    : (document.querySelector(".temp").innerText = `${temp2save}℉`);
}
