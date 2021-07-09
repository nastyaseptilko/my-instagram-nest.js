function resultSearch() {
    let search = document.getElementsByName('search')[0].value;

    fetch(`/api/search?search=${search}`, { headers: { 'Content-Type': 'application/json' } })
        .then(response => response.json())
        .then(async search => {
            const listLinks = document.getElementsByName('link')[0];
            const textNoFound = document.getElementsByName('text')[0];
            listLinks.innerHTML = '';

            if (search.length === 0) {
                const noFound = document.createElement('p');
                noFound.innerText = 'No matches found on users';
                textNoFound.appendChild(noFound);
            }

            const link = document.createElement('li');

            if (search) {
                await search.forEach(el => {
                    const a = document.createElement('a');
                    const empty = document.createElement('p');
                    const buttonFollow = document.createElement('button');
                    buttonFollow.innerText = 'follow';
                    buttonFollow.className = 'btn btn-success';
                    buttonFollow.onclick = () => follow(el.id);

                    a.setAttribute('value', el.id);
                    if (el.nickname) {
                        a.setAttribute('href', `/api/profile/${el.id}`);
                        a.innerText = el.nickname;
                        empty.innerText = ' ';
                    }

                    link.appendChild(a);
                    link.appendChild(buttonFollow);
                    link.appendChild(empty);
                });
            }

            listLinks.appendChild(link);
        });
}

function updatePhoto(photoId) {
    let options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            caption: document.getElementById(`caption-${photoId}`).value,
        }),
    };
    fetch(`/api/photo/${photoId}`, options);
}

function deletePhoto(photoId) {
    let options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    };
    fetch(`/api/photo/${photoId}`, options);
}

function updateProfile(userId) {
    let options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fullName: document.getElementById(`fullName-${userId}`).value,
            nickname: document.getElementById(`nickname-${userId}`).value,
            webSite: document.getElementById(`webSite-${userId}`).value,
            bio: document.getElementById(`bio-${userId}`).value,
        }),
    };
    fetch(`/api/profile/${userId}`, options);
}

function follow(publisherId) {
    let options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    };
    fetch(`/api/follow/${publisherId}`, options);
}

function unfollow(followingId) {
    let options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    };
    fetch(`/api/unfollow/${followingId}`, options);
}

async function getLikes(photoId) {
    await fetch(`/api/likes/${photoId}`, { headers: { 'Content-Type': 'application/json' } })
        .then(response => response.json())
        .then(response => {
            const div = document.getElementById(`countLikes-${photoId}`);

            const likes = document.createElement('span');
            likes.innerText = `Likes: ${response.likesCount}`;
            div.appendChild(likes);
        });
}
