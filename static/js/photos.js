function setFilter(selectObject) {
    const result = document.querySelector('#figure');
    result.className = selectObject.value;
}

function uploadPhoto(inputFile) {
    if (inputFile.files && inputFile.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            const newPhoto = document.getElementById('newPhoto');
            newPhoto.setAttribute('src', e.target.result);
            newPhoto.setAttribute('data-name', inputFile.files[0].name);
            newPhoto.classList.remove('photo-hidden');
        };
        reader.readAsDataURL(inputFile.files[0]);
    }
}

async function createPhoto() {
    const newPhoto = document.getElementById(`newPhoto`);
    if (!newPhoto.getAttribute('data-name')) {
        return;
    }
    const caption = document.getElementById(`caption`);
    const figure = document.getElementById(`figure`);

    const formData = new FormData();
    formData.append(
        'image',
        await urlToBase64(newPhoto.getAttribute('src')),
        newPhoto.getAttribute('data-name'),
    );
    formData.append('caption', caption.value);
    formData.append('filter', figure.className);

    await fetch(`/api/photo/upload`, {
        method: 'POST',
        body: formData,
    });
}

async function urlToBase64(url) {
    return fetch(url).then(res => res.blob());
}

function likeAndDislike(id) {
    fetch('/api/like', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            photoId: Number(id),
        }),
    })
        .then(response => response.json())
        .then(response => {
            alert(response.message);
        });
}
