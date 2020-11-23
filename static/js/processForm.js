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

            const liItem = document.createElement('LI');
            liItem.innerHTML = jsonResponse['description'];
            document.getElementById('todos').appendChild(liItem);
        })
        .catch(function (error) {
            alert('ERROR: Could not fetch todos/create.  Msg: ' + error)
        })
}