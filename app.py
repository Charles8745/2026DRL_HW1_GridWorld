"""
app.py - Flask main application for HW1 GridWorld
"""

from flask import Flask, render_template, request, jsonify
from gridworld import value_iteration, random_policy, policy_evaluation

app = Flask(__name__)


@app.route('/')
def index():
    """Render the main grid world page."""
    return render_template('index.html')


@app.route('/evaluate', methods=['POST'])
def evaluate():
    """
    Receive grid configuration and return policy + value matrices.

    Expected JSON body:
    {
        "n": 5,
        "start": [row, col],
        "end":   [row, col],
        "obstacles": [[row, col], ...]
    }
    """
    data = request.get_json()
    n = int(data['n'])
    start_state = tuple(data['start'])
    end_state   = tuple(data['end'])
    obstacle_set = set(tuple(o) for o in data.get('obstacles', []))

    # HW1-3: Bellman optimality (max over actions)
    V, policy, iterations = value_iteration(n, obstacle_set, end_state)

    # Format output for the frontend
    policy_out = {}
    value_out  = {}

    for row in range(n):
        for col in range(n):
            state = (row, col)
            key   = f"{row},{col}"

            if state in obstacle_set:
                policy_out[key] = 'obstacle'
                value_out[key]  = None
            elif state == end_state:
                policy_out[key] = 'goal'
                value_out[key]  = 0.0
            elif state == start_state:
                policy_out[key] = policy[state]   # list of action strings
                value_out[key]  = round(V[state], 2)
            else:
                policy_out[key] = policy[state]   # list of action strings
                value_out[key]  = round(V[state], 2)

    return jsonify({
        'policy': policy_out,
        'values': value_out,
        'iterations': iterations,
    })


@app.route('/random_evaluate', methods=['POST'])
def random_evaluate():
    """
    HW1-2: Generate a random policy and evaluate it via the
    Bellman expectation equation (iterative policy evaluation).

    Expected JSON body: same as /evaluate.
    """
    data = request.get_json()
    n = int(data['n'])
    start_state = tuple(data['start'])
    end_state   = tuple(data['end'])
    obstacle_set = set(tuple(o) for o in data.get('obstacles', []))

    # 1) Generate random stochastic policy
    policy = random_policy(n, obstacle_set, end_state)

    # 2) Evaluate it (Bellman expectation, NOT max)
    V, iterations = policy_evaluation(n, obstacle_set, end_state, policy)

    policy_out = {}
    value_out  = {}

    for row in range(n):
        for col in range(n):
            state = (row, col)
            key   = f"{row},{col}"

            if state in obstacle_set:
                policy_out[key] = 'obstacle'
                value_out[key]  = None
            elif state == end_state:
                policy_out[key] = 'goal'
                value_out[key]  = 0.0
            else:
                # Front-end expects a list of action strings for arrow drawing
                policy_out[key] = list(policy[state].keys())
                value_out[key]  = round(V[state], 2)

    return jsonify({
        'policy': policy_out,
        'values': value_out,
        'iterations': iterations,
        'mode': 'random',
    })


if __name__ == '__main__':
    app.run(debug=True)
