"""
app.py - Flask main application for HW1 GridWorld
"""

from flask import Flask, render_template, request, jsonify
from gridworld import generate_random_policy, policy_evaluation

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

    # Phase 2: Generate random policy and evaluate
    policy = generate_random_policy(n, obstacle_set, end_state)
    V, iterations = policy_evaluation(n, policy, obstacle_set, end_state)

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


if __name__ == '__main__':
    app.run(debug=True)
