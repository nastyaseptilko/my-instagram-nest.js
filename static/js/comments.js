function updateComment(commentId) {
    let options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            text: document.getElementById(`comment-${commentId}`).value,
        }),
    };
    fetch(`/api/comment/${commentId}`, options);
}

function deleteComment(commentId) {
    let options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    };
    fetch(`/api/comment/${commentId}`, options);
}
