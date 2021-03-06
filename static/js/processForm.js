document.getElementById('form').onsubmit = function (e) {
    e.preventDefault();

    fetch('/todos/create', {
        method: 'POST',
        body: JSON.stringify({
            'description': document.getElementById('description').value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonResponse) {
            console.log(jsonResponse);

            const liItem = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.className = 'check-completed';
            checkbox.type = 'checkbox';
            checkbox.setAttribute('data-id', jsonResponse.id)

            liItem.appendChild(checkbox);
            const text = document.createTextNode(' ' + jsonResponse.description);
            liItem.appendChild(text);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'remove-todo';
            deleteButton.setAttribute('data-id', jsonResponse.id);
            deleteButton.innerHTML = 'x';
            liItem.appendChild(deleteButton);

            document.getElementById('todos').appendChild(liItem);

            // This allows a newly created item to be deleted
            deleteButton.addEventListener('click', handleDelete);
        })
        .catch(function (error) {
            alert('ERROR: Could not fetch todos/create.  Msg: ' + error)
        })
}

function handleDelete(e) {

    fetch('/todos/' + e.target.dataset['id'], {
        method: 'DELETE'
    })
        .then(function () {
            const item = e.target.parentElement;
            item.remove();
        })
        .catch(function (error) {
            alert('ERROR: Could not fetch /remove/' + e.target.dataset['id'] + '.  Msg: ' + error)
        })
}

function updateCheckboxes() {
    const checkboxes = document.querySelectorAll('.check-completed');

    for (let checkbox of checkboxes) {
        checkbox.onchange = function (e) {

            fetch('/todos/' + e.target.dataset['id'] + '/set-completed', {
                method: 'POST',
                body: JSON.stringify({
                    'completed': e.target.checked
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .catch(function (error) {
                    alert('ERROR: Could not fetch /todos/' + e.target.dataset['id'] + '/set-completed.  Msg: ' + error)
                })
        }
    }
}

updateCheckboxes();