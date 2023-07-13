function showLogin() {
    if (sessionStorage.getItem('userID')) {
        let searchDiv = document.getElementById('search');
        searchDiv.style.display = 'block';
        let signOut = document.getElementById("signOut");
        signOut.style.display = 'block';
        showCourses();
    } else {
        let searchDiv = document.getElementById('search');
        searchDiv.style.display = 'none';
        let signOut = document.getElementById("signOut");
        signOut.style.display = 'none';
        showLoginForm();
    }
}

function showLoginForm() {
    let formContainerDiv = document.getElementById('mainDiv');
    formContainerDiv.innerHTML = `<div id="form-container"> 
                                            <form onsubmit="login(event)">
                                                <input type="text" placeholder="Username" id="username-input" required>
                                                <input type="password" placeholder="Password" id="password-input" required>
                                                <input type="submit" value="Login">
                                            </form>
                                      <p class="register-link">Don't have an account? <a href="#" id="register-btn" onclick="register(event)">Register</a></p>
                                       </div>`;
}

function login(e) {
    e.preventDefault();
    showLoadingSpinner();

    let formContainerDiv = document.getElementById('form-container');

    let username = document.getElementById('username-input').value.trim();
    let password = document.getElementById('password-input').value.trim();

    const xmlhttp = new XMLHttpRequest();

    xmlhttp.open('GET', 'https://jscoursefinalassignment-default-rtdb.europe-west1.firebasedatabase.app/users.json', true);

    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                hideLoadingSpinner();
                let response = JSON.parse(this.responseText);
                const users = Object.keys(response).map((key) => {
                    const user = response[key];
                    user.id = key;
                    return user;
                });
                users.forEach(user => {
                    if (username === user.username && password === user.password) {

                        let signOut = document.getElementById("signOut");
                        signOut.style.display = 'block';

                        let searchDiv = document.getElementById('search');
                        searchDiv.style.display = 'block';

                        showCourses();
                        sessionStorage.setItem('userID', user.id);
                    } else {
                        if (!document.getElementById('error-message-label')) {
                            let errorMessage = document.createElement('label');
                            errorMessage.id = "error-message-label"
                            errorMessage.innerText = 'Wrong credentials!';
                            formContainerDiv.appendChild(errorMessage);
                        }
                    }
                });
            }
        }
    }
    xmlhttp.send();
}

function showCourses() {
    let formContainerDiv = document.getElementById('mainDiv');
    formContainerDiv.innerHTML = `<div id="courses-tab">
                                    <tab id="tab1" onclick="getAvailableCourses()">Available Courses</tab>
                                    <div class="savedAndRegistredCourses">
                                    <tab  id="tab2" onclick="getSavedCourses()">Saved Courses</tab>
                                    <tab id="tab3" onclick="getRegisteredCourses() ">Registered Courses</tab>
 
                                    
</div>
                                    </div>
                                  <div id="available-courses"></div>`;
    getAvailableCourses();
}

function register(e) {
    e.preventDefault();
    let formContainerDiv = document.getElementById('form-container');
    formContainerDiv.innerHTML = `<form onsubmit="registerUser(event)">
                                    <input type="text" placeholder="Username" id="username-input" required>
                                    <input type="password" placeholder="Password (min 6 characters)" id="password-input" required minlength="6">
                                    <input type="email" placeholder="E-mail" id="email-input" required>
                                    <input type="text" placeholder="Name" id="name-input" required>
                                    <input type="text" placeholder="Phone Number" id="phone-input" required>
                                    <input type="submit" value="Sign Up">
                                    <div class="alreadyHaveAccount"><p>Already registered? <span onclick="showLoginForm();"> Log in</span></p></div>
                                 </div>`
}

function registerUser(e) {
    e.preventDefault();
    showLoadingSpinner();
    const xmlhttp = new XMLHttpRequest();
    let username = document.getElementById('username-input').value.trim();
    let password = document.getElementById('password-input').value.trim();
    let email = document.getElementById('email-input').value.trim();
    let name = document.getElementById('name-input').value.trim();
    let phone = document.getElementById('phone-input').value.trim();

    xmlhttp.open('POST', 'https://jscoursefinalassignment-default-rtdb.europe-west1.firebasedatabase.app/users.json', true);
    xmlhttp.setRequestHeader("Content-type", "application/JSON");

    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                hideLoadingSpinner();
                // alert("User registered");
                openModal();
                let modalBody = document.getElementById('modalBody');
                modalBody.innerHTML = `<h1>User registered.</h1>`;
                showLoginForm();
            } else {
                alert("Error!");
            }
        }
    }

    let user = {
        username: username, password: password, email: email, name: name, phone: phone
    }

    xmlhttp.send(JSON.stringify(user));

}

function getAvailableCourses() {
    document.getElementById('tab1').style.backgroundColor = "#EE9B00";
    document.getElementById('tab2').style.backgroundColor = "white";
    document.getElementById('tab3').style.backgroundColor = "white";

    showLoadingSpinner();
    const xmlhttp = new XMLHttpRequest();
    let coursesContainer = document.getElementById('available-courses');
    coursesContainer.innerHTML = ``;

    xmlhttp.open('GET', 'https://jscoursefinalassignment-default-rtdb.europe-west1.firebasedatabase.app/available-courses.json', true);

    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                hideLoadingSpinner();
                let searchDiv = document.getElementById('search');
                searchDiv.style.display = 'block';
                let response = JSON.parse(this.responseText);
                for (let key in response) {
                    let course = response[key];
                    const coursesTable = document.createElement('tr');
                    coursesTable.className = 'card';
                    coursesTable.innerHTML = `<tr>
                                                    <h3>${course.courseName}</h3>
                                                    <p>${course.courseDescription}</p>
                                                    <p class="price">${course.coursePrice} KM</p>
                                                    <div class="buttons">
                                                     <button onclick="applyFromModal(${key})" id="apply">Register</button>
                                                    <button onclick="saveCourse(${key})" id="save">Save course</button>
                                                    <button onclick="openCourse(${key})" id="details">More details</button>
</div>
                                                   
                                            </tr>`;
                    coursesContainer.append(coursesTable);
                }
            } else {
                alert("Response not found!")
            }
        }
    }
    xmlhttp.send();
}

function getSavedCourses() {
    document.getElementById('tab2').style.backgroundColor = "#EE9B00";
    document.getElementById('tab1').style.backgroundColor = "white";
    document.getElementById('tab3').style.backgroundColor = "white";


    showLoadingSpinner();
    const xmlhttp = new XMLHttpRequest();
    let coursesContainer = document.getElementById('available-courses');
    coursesContainer.innerHTML = ``;

    xmlhttp.open('GET', 'https://jscoursefinalassignment-default-rtdb.europe-west1.firebasedatabase.app/users/' + sessionStorage.getItem('userID') + '/savedCourses/.json', true);

    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                hideLoadingSpinner();
                let response = JSON.parse(this.responseText);
                for (let key in response) {
                    let course = response[key];
                    const xmlhttp = new XMLHttpRequest();
                    xmlhttp.open('GET', 'https://jscoursefinalassignment-default-rtdb.europe-west1.firebasedatabase.app/available-courses/' + course + '.json', true);

                    xmlhttp.onreadystatechange = function () {
                        if (this.readyState === 4) {
                            if (this.status === 200) {
                                let response = JSON.parse(this.responseText);
                                const coursesTable = document.createElement('tr');
                                coursesTable.className = 'card';
                                coursesTable.innerHTML = `<tr>
                                                            <h3>${response.courseName}</h3>
                                                            <p>${response.courseDescription}</p>
                                                            <p>${response.coursePrice} KM</p>
                                                             <div class="buttons">
                                                            <button onclick="applyFromModal(${course})" id="apply">Register</button>
                                                            <button onclick="removeSavedCourse(${key})" id="save">Remove saved</button>
                                                            <button onclick="openCourse(${course})" id="details">More details</button>
                                                            </div>
                                                        </tr>`;
                                coursesContainer.append(coursesTable);
                            } else {
                                alert("Response not found!")
                            }
                        }
                    }
                    xmlhttp.send();
                }

            } else {
                alert("Response not found!")
            }
        }
    }
    xmlhttp.send();
}

function getRegisteredCourses() {
    document.getElementById('tab3').style.backgroundColor = "#EE9B00";
    document.getElementById('tab1').style.backgroundColor = "white";
    document.getElementById('tab2').style.backgroundColor = "white";

    showLoadingSpinner();
    const xmlhttp = new XMLHttpRequest();
    let coursesContainer = document.getElementById('available-courses');
    coursesContainer.innerHTML = ``;

    xmlhttp.open('GET', 'https://jscoursefinalassignment-default-rtdb.europe-west1.firebasedatabase.app/users/' + sessionStorage.getItem('userID') + '/registeredCourses/.json', true);

    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                hideLoadingSpinner();
                let response = JSON.parse(this.responseText);
                for (let key in response) {
                    let courseRegistered = response[key];
                    if (courseRegistered) {
                        const courseIndex = courseRegistered[0];
                        const courseDate = courseRegistered[1];

                        const xmlhttp = new XMLHttpRequest();
                        xmlhttp.open('GET', 'https://jscoursefinalassignment-default-rtdb.europe-west1.firebasedatabase.app/available-courses/' + courseIndex + '.json', true);

                        xmlhttp.onreadystatechange = function () {
                            if (this.readyState === 4) {
                                if (this.status === 200) {
                                    let response = JSON.parse(this.responseText);
                                    const coursesTable = document.createElement('tr');
                                    coursesTable.className = 'card';
                                    coursesTable.innerHTML = `<tr>
                                                    <h3>${response.courseName}</h3>
                                                    <p>${response.courseDescription}</p>
                                                    <p class="price">${response.coursePrice} KM</p>
                                                     <div class="buttons">
                                                    <button onclick="removeRegistedCourse(${key})" id="save">Unregister</button>
                                                    <button onclick="openCourse(${courseIndex})" id="details">More details</button>
                                                    </div>
                                            </tr>`;
                                    coursesContainer.append(coursesTable);

                                } else {
                                    alert("Response not found!")
                                }
                            }
                        }
                        xmlhttp.send();
                    }
                }

            } else {
                alert("Response not found!")
            }
        }
    }
    xmlhttp.send();
}

function getSearchedCourses() {
    showLoadingSpinner();
    document.getElementById('tab1').style.backgroundColor = "#EE9B00";
    document.getElementById('tab2').style.backgroundColor = "white";
    document.getElementById('tab3').style.backgroundColor = "white";
    const search = document.getElementById('searchInput').value.trim().toLowerCase();
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://jscoursefinalassignment-default-rtdb.europe-west1.firebasedatabase.app/available-courses.json', true);
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            hideLoadingSpinner();
            let response = JSON.parse(this.responseText);
            let availableCoursesDiv = document.getElementById('available-courses');
            availableCoursesDiv.innerHTML = '';
            for (let key in response) {
                let course = response[key];
                let courseDiv = document.createElement('tr');
                courseDiv.className = 'card';
                if (course.courseName.toLowerCase().includes(search)) {
                    courseDiv.innerHTML = `<tr>
                                                    <h3>${course.courseName}</h3>
                                                    <p>${course.courseDescription}</p>
                                                    <p class="price">${course.coursePrice} KM</p>
                                                     <div class="buttons">
                                                    <button onclick="applyFromModal(${key})" id="apply">Register</button>
                                                    <button onclick="saveCourse(${key})" id="save">Save course</button>
                                                    <button onclick="openCourse(${key})" id="details">More details</button>
                                                    </div>
                                            </tr>`;
                    availableCoursesDiv.appendChild(courseDiv);
                }
            }
        }
    };
    document.getElementById('searchInput').value = '';
    xmlhttp.send();
}

function applyToCourse(courseIndex) {
    showLoadingSpinner();
    let startDateComponent = document.getElementById('date-select');
    let startDate = startDateComponent.value;

    let user = getUser(sessionStorage.userID);
    user.registeredCourses = !user.registeredCourses ? [] : user.registeredCourses;

    let alreadyRegisteredCourses = user.registeredCourses.some(course => course && course[0] === courseIndex);

    if (alreadyRegisteredCourses) {
        alert('Course is already registered.');
    } else {
        user.registeredCourses.push([courseIndex, startDate]);
    }
    const xmlhttp = new XMLHttpRequest();

    xmlhttp.open('PUT', 'https://jscoursefinalassignment-default-rtdb.europe-west1.firebasedatabase.app/users/' + sessionStorage.getItem('userID') + '.json', true);
    xmlhttp.setRequestHeader("Content-type", "application/JSON");

    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                hideLoadingSpinner();
                if (!alreadyRegisteredCourses) {
                    alert('Course successfully registered.');
                    getRegisteredCourses();
                    closeModal();
                }
            } else {
                alert("Error!");
            }
        }
    }
    xmlhttp.send(JSON.stringify(user));
}

function getUser(userID) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://jscoursefinalassignment-default-rtdb.europe-west1.firebasedatabase.app/users/' + userID + '.json', false);
    xmlhttp.setRequestHeader("Content-type", "application/JSON");

    let user;

    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                user = JSON.parse(this.responseText);
                console.log("User retrieved");
            } else {
                alert("Error getting user!");
            }
        }
    }
    xmlhttp.send();
    return user;
}

function saveCourse(courseIndex) {
    showLoadingSpinner();
    let user = getUser(sessionStorage.userID);

    user.savedCourses = !user.savedCourses ? [] : user.savedCourses;

    let alreadySaved = user.savedCourses.some(course => course && course === courseIndex);

    if (alreadySaved) {
        alert("Course is already saved.");
    } else {
        user.savedCourses.push(courseIndex);
    }
    const xmlhttp = new XMLHttpRequest();

    xmlhttp.open('PUT', 'https://jscoursefinalassignment-default-rtdb.europe-west1.firebasedatabase.app/users/' + sessionStorage.getItem('userID') + '.json', true);
    xmlhttp.setRequestHeader("Content-type", "application/JSON");

    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                hideLoadingSpinner();
                if (!alreadySaved) {
                    alert("Course saved.");
                }
            } else {
                alert("Error!");
            }
        }
    }
    xmlhttp.send(JSON.stringify(user));
}

function openCourse(courseIndex) {
    closeModal();
    showLoadingSpinner();
    let searchDiv = document.getElementById('search');
    searchDiv.style.display = 'none';

    let coursesContainer = document.getElementById('mainDiv');

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://jscoursefinalassignment-default-rtdb.europe-west1.firebasedatabase.app/available-courses/' + courseIndex + '.json', true);

    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                hideLoadingSpinner();
                let response = JSON.parse(this.responseText);
                coursesContainer.innerHTML = `<div class="cardDetailed">
                                                    <h3>${response.courseName}</h3>
                                                    <p>${response.courseDescription}</p>
                                                    <p>${response.courseDetailedDescription}</p>
                                                    <p>Teacher: ${response.teacher}</p>
                                                    <p class="price">Price: ${response.coursePrice} KM</p>
                                                    <select id="date-select"></select>
                                                     <div class="buttonsInOpenCourse">
                                                    <button onclick="applyToCourse(${courseIndex})" id="registerInModal">Register</button>
                                                    <button onclick="saveCourse(${courseIndex})" id="saveInModal">Save course</button>
                                                    <button onclick="showCourses()" id="allCourses">All Courses</button> 
                                                    </div>
                                            <div id="leaveComment">
                                                <textarea id="leaveCommentTextArea" placeholder="Leave comment"></textarea>
                                                <button onclick="leaveComment(${courseIndex})" id="leaveComment">Leave Comment</button>
                                            </div>                   
                                                                     <p class="commentsP">Comments:</p><div id="commentSection"></div>
                                            <div id="commentSection"></div>
</div>`;
                let dateSelect = document.getElementById('date-select');
                let commentSection = document.getElementById('commentSection');
                let comments = response.comments;
                if (comments) {
                    comments.forEach(comment => {
                        let user = getUser(comment.user);
                        const commentComponent = document.createElement('li');
                        commentComponent.innerHTML = `
<h3>${user.name}</h3>
                                                        <p>${comment.commentText}</p>`;
                        commentSection.append(commentComponent);
                    })
                }
                let dates = response.startDate;
                dates.forEach(date => {
                    const dateOptions = document.createElement('option');
                    dateOptions.innerText = date;
                    dateSelect.append(dateOptions);
                });
            } else {
                alert("Response not found!")
            }
        }
    }
    xmlhttp.send();
}

function openModal() {
    let modalDiv = document.getElementById('modalDialog');
    modalDiv.style.display = 'block';
}

function closeModal() {
    let modalDiv = document.getElementById('modalDialog');
    modalDiv.style.display = 'none';
}

function removeSavedCourse(courseID) {
    const userID = sessionStorage.getItem('userID');
    const xmlhttp = new XMLHttpRequest();
    let text = "Are you sure you want to remove saved course?";
    if (confirm(text) === true) {
        xmlhttp.open('DELETE', `https://jscoursefinalassignment-default-rtdb.europe-west1.firebasedatabase.app/users/${userID}/savedCourses/${courseID}.json`, true);
    }
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            getSavedCourses();
        }
    };
    xmlhttp.send();
}

function removeRegistedCourse(key) {
    const userID = sessionStorage.getItem('userID');
    const xmlhttp = new XMLHttpRequest();
    let text = "Are you sure you want to remove registered course?";
    if (confirm(text) === true) {
        xmlhttp.open('DELETE', `https://jscoursefinalassignment-default-rtdb.europe-west1.firebasedatabase.app/users/${userID}/registeredCourses/${key}.json`, true);
    }
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            getRegisteredCourses();
        }
    };
    xmlhttp.send();
}

function applyFromModal(courseID) {
    openModal();
    showLoadingSpinner();
    let coursesContainer = document.getElementById('modalBody');

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://jscoursefinalassignment-default-rtdb.europe-west1.firebasedatabase.app/available-courses/' + courseID + '.json', true);

    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                hideLoadingSpinner();
                let response = JSON.parse(this.responseText);
                coursesContainer.innerHTML = `<div class="cardModal">
                                                    <h3>${response.courseName}</h3>
                                                    <p>${response.courseDescription}</p>
                                                    <p>${response.courseDetailedDescription}</p>
                                                    <p>Teacher: ${response.teacher}</p>
                                                    <p class="price">Price: ${response.coursePrice} KM</p>
                                                    <select id="date-select"></select>
                                            </div>`;
                let dateSelect = document.getElementById('date-select');
                let dates = response.startDate;
                dates.forEach(date => {
                    const dateOptions = document.createElement('option');
                    dateOptions.innerText = date;
                    dateSelect.append(dateOptions);
                });

                let buttonContainer = document.createElement('div');
                buttonContainer.innerHTML = `<div class="buttonsInModal">
                                                    <button onclick="applyToCourse(${courseID})" id="registerInModal">Register</button>
                                                    <button onclick="saveCourse(${courseID})" id="saveInModal">Save course</button>
                                                    <button onclick="openCourse(${courseID})" id="openCourseInModal">Otvori kurs</button>
                                                    <button onclick="closeModal()" id="cancelModal">Cancel</button>
                                                    
                                                
                                            </div>`;
                coursesContainer.append(buttonContainer);
            } else {
                alert("Response not found!")
            }
        }
    }
    xmlhttp.send();

}

function getCourse(courseID) {
    showLoadingSpinner();
    let course;
    const xmlhttp = new XMLHttpRequest();

    xmlhttp.open('GET', 'https://jscoursefinalassignment-default-rtdb.europe-west1.firebasedatabase.app/available-courses/' + courseID + '.json', false);
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                hideLoadingSpinner();
                course = JSON.parse(this.responseText);
            } else {
                alert("Error!");
            }
        }
    }
    xmlhttp.send();
    return course;
}

function leaveComment(courseID) {
    showLoadingSpinner();
    let course = getCourse(courseID);

    course.comments = !course.comments ? [] : course.comments;

    let commentText = document.getElementById('leaveCommentTextArea').value.trim();

    if (commentText) {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open('PUT', 'https://jscoursefinalassignment-default-rtdb.europe-west1.firebasedatabase.app/available-courses/' + courseID + '.json', true);
        xmlhttp.setRequestHeader("Content-type", "application/JSON");

        let comment = {
            user: sessionStorage.userID, commentText: commentText
        }
        course.comments.push(comment);

        xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    hideLoadingSpinner();
                    alert("Comment saved.");
                    openCourse(courseID);
                } else {
                    alert("Error!");
                }
            }
        }
        xmlhttp.send(JSON.stringify(course));
    } else {
        alert("There is nothing in the comment.")
    }
}

function signOut() {
    sessionStorage.removeItem("userID");
    let searchDiv = document.getElementById('search');
    searchDiv.style.display = 'none';
    let signOut = document.getElementById("signOut");
    signOut.style.display = 'none';
    showLoginForm();

}

function showLoadingSpinner() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoadingSpinner() {
    document.getElementById('loading-overlay').style.display = 'none';
}
