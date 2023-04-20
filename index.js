const apiUrl = 'https://jsonplaceholder.typicode.com';

async function searchPostById(postId) {
    if (postId < 1 || postId > 100) {
        throw new Error('Invalid post ID');
    }

    const response = await fetch(`${apiUrl}/posts/${postId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const post = await response.json();
    return post;
}


async function getCommentsByPostId(postId) {
    const response = await fetch(`${apiUrl}/posts/${postId}/comments`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const comments = await response.json();
    return comments;
}

async function displayPostAndComments(postId) {
    const post = await searchPostById(postId);
    const comments = await getCommentsByPostId(postId);

    const postContainer = document.createElement('div');
    postContainer.innerHTML = `
    <h2>${post.title}</h2>
    <p>${post.body}</p>
    <button id="show-comments">Show comments</button>
    <ul id="comments" style="display:none;"></ul>
  `;

    const showCommentsButton = postContainer.querySelector('#show-comments');
    showCommentsButton.addEventListener('click', async () => {
        const commentsContainer = postContainer.querySelector('#comments');
        if (commentsContainer.style.display === 'none') {
            commentsContainer.style.display = 'block';

            try {
                const comments = await getCommentsByPostId(postId);
                const commentsHtml = comments.map(({ name, body }) => `
          <li>
            <h3>${name}</h3>
            <p>${body}</p>
          </li>
        `).join('');

                commentsContainer.innerHTML = commentsHtml;
            } catch (error) {
                console.error(`Error fetching comments: ${error.message}`);
            }
        } else {
            commentsContainer.style.display = 'none';
        }
    });

    const postElement = document.getElementById('post');
    postElement.innerHTML = '';
    postElement.appendChild(postContainer);
}

const searchButton = document.getElementById('search');
searchButton.addEventListener('click', async () => {
    const postId = document.getElementById('post-id').value;
    try {
        await displayPostAndComments(postId);
    } catch (error) {
        console.error(`Error searching for post: ${error.message}`);
    }
});


displayPostAndComments(1);
