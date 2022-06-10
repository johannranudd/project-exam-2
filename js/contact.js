// mobile menu variables and functionality
const mobileMenu = document.querySelector('.mobile-menu');
const menuBtn = document.querySelector('.menu-btn');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('show-menu');
  menuBtn.classList.toggle('menu-is-open');
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 768 && mobileMenu.className.includes('show-menu')) {
    mobileMenu.classList.remove('show-menu');
    menuBtn.classList.remove('menu-is-open');
  }
});

// form
const form = document.querySelector('.contact-form');
const section = document.querySelector('.section-center');
const labels = form.querySelectorAll('label');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  //   expressions
  const nameRegEx = /^[a-zA-Z \Wæøå]+$/;
  const emailRegEx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //   inputs
  const name = form.querySelector('#name');
  const email = form.querySelector('#email');
  const subject = form.querySelector('#subject');
  const message = form.querySelector('#message');

  labels.forEach((label) => {
    label.className = '';
  });

  let nameValidated = false;
  let emailValidated = false;
  let subjectValidated = false;
  let messageValidated = false;

  //   validation
  if (!nameRegEx.test(name.value) || name.value.length <= 5) {
    displayWarning(name, 'must be more than 5 characters', 'danger');
  } else {
    displayWarning(name, '', 'input-success');
    nameValidated = true;
  }
  if (!emailRegEx.test(email.value)) {
    displayWarning(email, 'must be a valid email address', 'danger');
  } else {
    displayWarning(email, '', 'input-success');
    emailValidated = true;
  }
  if (subject.value.length <= 15) {
    displayWarning(subject, 'must be more than 15 characters', 'danger');
  } else {
    displayWarning(subject, '', 'input-success');
    subjectValidated = true;
  }
  if (message.value.length <= 25) {
    displayWarning(message, 'must be more than 25 characters', 'danger');
  } else {
    displayWarning(message, '', 'input-success');
    messageValidated = true;
  }

  if (nameValidated && emailValidated && subjectValidated && messageValidated) {
    section.innerHTML = `<div class="message-success">
    <h1>Thank you for your message</h1>
    <a href="./">&lt;&lt;Back to homepage</a>
    </div>`;
  }
});

function displayWarning(name, message, type) {
  const label = name.previousElementSibling;
  label.classList.add(type);
  label.innerHTML = `${name.id} ${message}`;
}
