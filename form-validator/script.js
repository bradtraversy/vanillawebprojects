const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword"); // **changed (was password2)

// Show input error message
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = "form-control error";
  const small = formControl.querySelector("small");
  small.innerText = message;
}

// Show success outline
function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
}

// Check email is valid
function checkEmail(input) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // *** changed: simplified and cleaner email regex
  if (re.test(input.value.trim())) {
    showSuccess(input);
  } else {
    showError(input, "Email is not valid");
  }
}

// Check required fields
function checkRequired(inputArr) {
  let isRequired = false;
  inputArr.forEach(function (input) {
    if (input.value.trim() === "") {
      showError(input, `${getFieldName(input)} is required`);
      isRequired = true;
      console.log(getFieldName(input));
    } else {
      showSuccess(input);
    }
  });

  return isRequired;
}

// Check input length
function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(
      input,
      `${getFieldName(input)} must be at least ${min} characters`
    );
  } else if (input.value.length > max) {
    showError(
      input,
      `${getFieldName(input)} must be less than ${max} characters`
    );
  } else {
    showSuccess(input);
  }
}

// Check passwords match // ** changed: improved password match with auto-clear when empty
function checkPasswordsMatch(input1, input2) {
  const val1 = input1.value.trim();
  const val2 = input2.value.trim();

  if (val2 === "") {    // ** new: clear styling if confirmPassword empty
    input2.parentElement.classList.remove("error", "success");
    const small = input2.parentElement.querySelector("small");
    small.innerText = "";
    return;
  }

  if (val1 === val2) {
    showSuccess(input2);
  } else {
    showError(input2, "Passwords do not match");
  }
}

// Get fieldname
function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// Event listeners
form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!checkRequired([username, email, password, confirmPassword])) { // *** changed (added ! for logic fix)
    checkLength(username, 3, 15);
    checkLength(password, 6, 25);
    checkEmail(email);
    checkPasswordsMatch(password, confirmPassword);

    const formControls = document.querySelectorAll(".form-control");
    const allValid = Array.from(formControls).every((control) =>
      control.classList.contains("success")
    );

    if (allValid) {
      alert("Registration successful!");
      form.reset();
            //**** remove green/red outlines and clear messages after reset
      formControls.forEach((control) =>{
        control.classList.remove("success", "error");
const small = control.querySelector("small");
      small.innerText = "";
     } );
      
    }
  }
});

// ***Real-time validation listeners
username.addEventListener("input", () => checkLength(username, 3, 15));
password.addEventListener("input", () => checkLength(password, 6, 25));
email.addEventListener("input", () => checkEmail(email));

// ** Confirm password validation runs when focus leaves
confirmPassword.addEventListener("blur", () =>
  checkPasswordsMatch(password, confirmPassword)
);
//*** */ Also check match again if user edits password field after confirm

password.addEventListener("blur", () => {
  if (confirmPassword.value.trim() !== "") {
    checkPasswordsMatch(password, confirmPassword);
  }
});
