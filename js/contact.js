/* ==========================================================================
   COMEPTY — contact.js
   Validates the contact form and composes a mailto link.

   The address below is the official Comepty contact. To change it, edit
   CONTACT_EMAIL and the matching rows in contact.html.
   ========================================================================== */

(function () {
  "use strict";

  var CONTACT_EMAIL = "comepty.org@gmail.com";

  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function fieldWrap(name) {
    return form.querySelector('[data-field="' + name + '"]');
  }

  function setError(name, hasError) {
    var wrap = fieldWrap(name);
    if (!wrap) return;
    wrap.classList.toggle("has-error", hasError);

    var input = wrap.querySelector("input, textarea, select");
    if (input) {
      input.setAttribute("aria-invalid", hasError ? "true" : "false");
    }
  }

  function value(name) {
    var el = form.elements[name];
    return el && typeof el.value === "string" ? el.value.trim() : "";
  }

  function validate() {
    var failures = [];

    var name = value("name");
    if (name.length < 2) failures.push("name");

    var email = value("email");
    if (!emailPattern.test(email)) failures.push("email");

    if (!value("category")) failures.push("category");

    if (value("subject").length < 2) failures.push("subject");

    if (value("message").length < 10) failures.push("message");

    ["name", "email", "category", "subject", "message"].forEach(function (key) {
      setError(key, failures.indexOf(key) !== -1);
    });

    return failures;
  }

  function showStatus(message, state) {
    if (!status) return;
    status.hidden = false;
    status.textContent = message;
    if (state) {
      status.setAttribute("data-state", state);
    } else {
      status.removeAttribute("data-state");
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var failures = validate();
    if (failures.length) {
      var first = fieldWrap(failures[0]);
      var input = first && first.querySelector("input, textarea, select");
      if (input) input.focus();
      showStatus("Please correct the highlighted fields and try again.", "error");
      return;
    }

    var lines = [
      "Name: " + value("name"),
      "Email: " + value("email"),
      "Organisation: " + (value("organisation") || "Not provided"),
      "Category: " + value("category"),
      "",
      value("message")
    ];

    var subject = "Comepty enquiry: " + value("subject");

    var href =
      "mailto:" +
      encodeURIComponent(CONTACT_EMAIL) +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(lines.join("\n"));

    window.location.href = href;

    showStatus(
      "Your email application should open with the message ready to send. If nothing happens, write to " +
        CONTACT_EMAIL +
        " directly and paste the message you drafted.",
      null
    );
  });

  // Clear the error state as soon as the user edits a field.
  ["name", "email", "category", "subject", "message"].forEach(function (key) {
    var wrap = fieldWrap(key);
    if (!wrap) return;
    var input = wrap.querySelector("input, textarea, select");
    if (!input) return;
    input.addEventListener("input", function () {
      if (wrap.classList.contains("has-error")) {
        setError(key, false);
      }
    });
    input.addEventListener("change", function () {
      if (wrap.classList.contains("has-error")) {
        setError(key, false);
      }
    });
  });
})();