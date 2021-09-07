// function loginUser() {
//     let options = {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             email: document.getElementById('email').value,
//             password: document.getElementById('password').value,
//         }),
//     };
//     fetch(`/login`, options)
//         .then(res => res.json())
//         .then(res => {
//             const alertError = document.getElementsByClassName('alertError')[0];
//
//             if (res.error) {
//                 const errorMessage = document.createElement('p');
//                 errorMessage.innerText = `${res.error}`;
//                 errorMessage.className = 'alert alert-danger';
//                 alertError.appendChild(errorMessage);
//             }
//             if (res.message) {
//                 window.location.href = '/home';
//             }
//         });
// }

function registerUser() {
    let options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fullName: document.getElementById('fullName').value,
            nickname: document.getElementById('nickname').value,
            webSite: document.getElementById(`webSite`).value,
            bio: document.getElementById(`bio`).value,
            email: document.getElementById(`email`).value,
            password: document.getElementById('password').value,
        }),
    };

    fetch(`/register`, options)
        .then(res => res.json())
        .then(res => {
            const alertError = document.getElementsByClassName('alertError')[0];

            if (res.error) {
                const errorMessage = document.createElement('p');
                errorMessage.innerText = `${res.error}`;
                errorMessage.className = 'alert alert-danger';
                alertError.appendChild(errorMessage);
            }
            if (res.message) {
                window.location.href = '/login';
            }
        });
}
