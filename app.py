from flask import Flask, render_template, request, redirect, url_for, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
import sys

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres@localhost:5432/hoobs'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Link db to app
db = SQLAlchemy(app)


class Todo(db.Model):

    __tablename__ = 'todos'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(), nullable=False)

    def __repr__(self):
        return 'Todo item: {}, {}'.format(self.id, self.description)


# Sync up models in the db
# Tables are created for the all the models declared
db.create_all()


@app.route('/todos/create', methods=['POST'])
def create_todo():

    error = False
    body = {}

    try:
        # If cannot get, '' empty string gets returned as default
        # description = request.form.get('description', '')
        description = request.get_json()['description']

        todo = Todo(description=description)

        db.session.add(todo)
        db.session.commit()

        body['description'] = todo.description

    except:
        error = True
        db.session.rollback()
        print(sys.exc_info())

    finally:
        db.session.close()

    if error:
        abort(400)

    else:
        # return redirect(url_for('index'))

        # Don't want to do it this way as we are trying to access the todo object description outside of the session
        # I.e. todo is bound to session and is unbounded after db.session.close() above
        # Also expire_on_commit in SQLAlchemy is set to true, meaning all instances will expire upon commit
        # It is good practice to leave it as true, otherwise unintended side-effects will occur.
        # return jsonify({
        #     'description': todo.description
        # })

        return body


@app.route('/')
def index():

    return render_template('index.html', data=Todo.query.all())

    # Hardcoded data sample
    # return render_template('index.html', data=[
    #     {'description': 'Todo 1'},
    #     {'description': 'Todo 2'},
    #     {'description': 'Todo 3'},
    # ])