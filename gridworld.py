"""
gridworld.py - Core logic for GridWorld HW1
Handles random policy generation and policy evaluation.
"""

import random

# Action definitions: name -> (row_delta, col_delta)
ACTION_DELTAS = {
    'up':    (-1,  0),
    'down':  ( 1,  0),
    'left':  ( 0, -1),
    'right': ( 0,  1),
}

# Unicode arrows for display
ACTION_ARROWS = {
    'up':    '↑',
    'down':  '↓',
    'left':  '←',
    'right': '→',
}

ALL_ACTIONS = list(ACTION_DELTAS.keys())


def get_next_state(row, col, action, n, obstacle_set):
    """
    Returns the next (row, col) given an action.
    If the move goes out of bounds or into an obstacle, the agent stays put.
    """
    dr, dc = ACTION_DELTAS[action]
    nr, nc = row + dr, col + dc
    if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in obstacle_set:
        return (nr, nc)
    return (row, col)  # Stay in place


def generate_random_policy(n, obstacle_set, end_state):
    """
    Randomly assigns 1~4 actions to each non-obstacle, non-terminal state.
    Obstacles and the terminal (end) state receive empty action lists.

    Args:
        n           : grid dimension
        obstacle_set: set of (row, col) tuples
        end_state   : (row, col) tuple of the goal

    Returns:
        policy: dict mapping (row, col) -> list of action strings
    """
    policy = {}
    for row in range(n):
        for col in range(n):
            state = (row, col)
            if state in obstacle_set or state == end_state:
                policy[state] = []
            else:
                num_actions = random.randint(1, 4)
                chosen = random.sample(ALL_ACTIONS, num_actions)
                policy[state] = chosen
    return policy


def policy_evaluation(n, policy, obstacle_set, end_state,
                      gamma=0.9, theta=1e-6, max_iter=10000):
    """
    Iterative policy evaluation using the Bellman expectation equation:
        V(s) = Σ_a π(a|s) * [R + γ * V(s')]
    
    Reward: -1 per step, terminal state V = 0.
    Uniform probability over chosen actions in policy.

    Args:
        n           : grid dimension
        policy      : dict from generate_random_policy
        obstacle_set: set of (row, col) tuples
        end_state   : (row, col) tuple of the goal
        gamma       : discount factor (default 0.9)
        theta       : convergence threshold (default 1e-6)
        max_iter    : maximum iterations

    Returns:
        V: dict mapping (row, col) -> float value
    """
    # Initialize all state values to 0
    V = {(r, c): 0.0 for r in range(n) for c in range(n)}

    for iteration in range(max_iter):
        delta = 0.0
        for row in range(n):
            for col in range(n):
                state = (row, col)

                # Skip terminal and obstacle states
                if state in obstacle_set or state == end_state:
                    continue

                actions = policy.get(state, [])
                if not actions:
                    continue

                # Uniform distribution over chosen actions
                prob = 1.0 / len(actions)
                new_v = 0.0
                for action in actions:
                    next_state = get_next_state(row, col, action, n, obstacle_set)
                    new_v += prob * (-1.0 + gamma * V[next_state])

                delta = max(delta, abs(new_v - V[state]))
                V[state] = new_v

        if delta < theta:
            break

    return V
