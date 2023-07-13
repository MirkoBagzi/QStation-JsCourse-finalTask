# Technical Documentation - Course Registration Page

## Project Description

The aim of the project is to create a web page for course registration. Users will be able to register and enroll in available courses. After logging in, users will be shown a list of available courses as well as the courses they have already enrolled in.

The page will be implemented using HTML, CSS, and JavaScript. User and course data will be stored in JavaScript objects and generated dynamically through JavaScript code.

## Functionalities

1. User Login and Registration

    - The homepage is a login page that contains a standard login form.
    - Users can enter their username and password to log in.
    - Below the login form, there is a "Don't have an account? Register here" button that takes users to the registration form.
    - Clicking the registration button will display a registration form containing fields for entering the username, password, and other necessary information.
    - After entering all the required data, users can click the "Register" button to complete the registration.

2. Display List of Available Courses

    - After successful login, users will be shown a list of available courses.
    - The list of courses will be generated through JavaScript code and displayed on the page.
    - Basic information such as the course name, description, and schedule will be shown for each course.
    - Each course will have a "Details" button that opens a page with complete information about that course.
    - Each course will also have a "Save Course" button that adds the course to the saved courses list.

3. Course Enrollment

    - On the "Available Courses" page, users will have the option to enroll in courses.
    - Each course will have an "Enroll" button displayed.
    - Clicking this button will open a modal dialog with basic information about the course and a select element for choosing the course schedule.
    - The modal dialog will display information such as the course name, description, schedule, and available slots.
    - Users can select their preferred schedule from the select element.
    - The modal dialog will have an "Enroll" button that submits the course enrollment and a "Cancel" button that closes the dialog.

4. Managing Saved Courses

    - On the "My Courses" page, users will see the courses they have enrolled in.
    - The page will contain two tabs: "Available Courses" and "My Courses."
    - The "My Courses" tab will display the courses the user has enrolled in with the selected dates.
    - The "My Courses" tab will also have a sub-tab called "Saved Courses" where the user's saved courses will be displayed.
    - Users will have the option to cancel their enrollment or reschedule it for a later date.
    - Each saved course can be removed from the list.

## Technologies and Tools

- HTML
- CSS
- JavaScript

## Project Structure

- `index.html` - the main page with the login form, list of available courses, and course enrollment functionalities.
- `style.css` - CSS styles for page design.
- `script.js` - JavaScript code for generating dynamic elements on the page and managing functionalities.

## Conclusion

This technical documentation provides a description of the project and the functionalities of the course registration page. The implementation of the page will be based on HTML, CSS, and JavaScript. JavaScript code will be used to generate dynamic elements on the page and manage functionalities such as course enrollment, enrollment management, and course overview.
