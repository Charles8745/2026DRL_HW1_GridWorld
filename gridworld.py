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


def value_iteration(n, obstacle_set, end_state, gamma=0.9, theta=1e-6, max_iter=10000):
    """
    Value Iteration algorithm to find the optimal policy and value function.
        V(s) = max_a [R + γ * V(s')]
    
    Reward: -1 per step, terminal state V = 0.

    Args:
        n           : grid dimension
        obstacle_set: set of (row, col) tuples
        end_state   : (row, col) tuple of the goal
        gamma       : discount factor (default 0.9)
        theta       : convergence threshold (default 1e-6)
        max_iter    : maximum iterations

    Returns:
        V: dict mapping (row, col) -> float value
        policy: dict mapping (row, col) -> list of optimal action strings
        iterations: actual number of iterations until convergence
    """
    # Initialize all state values to 0
    V = {(r, c): 0.0 for r in range(n) for c in range(n)}
    actual_iter = 0

    for iteration in range(max_iter):
        delta = 0.0
        for row in range(n):
            for col in range(n):
                state = (row, col)

                # Skip terminal and obstacle states
                if state in obstacle_set or state == end_state:
                    continue

                old_v = V[state]
                max_v = float('-inf')

                # Calculate value for all possible actions
                for action in ALL_ACTIONS:
                    next_state = get_next_state(row, col, action, n, obstacle_set)
                    v_a = -1.0 + gamma * V[next_state]
                    if v_a > max_v:
                        max_v = v_a

                V[state] = max_v
                delta = max(delta, abs(old_v - max_v))
                
        actual_iter = iteration + 1
        # Check convergence
        if delta < theta:
            break

    # Extract optimal policy
    policy = {}
    for row in range(n):
        for col in range(n):
            state = (row, col)
            if state in obstacle_set or state == end_state:
                policy[state] = []
                continue

            max_v = float('-inf')
            best_actions = []

            for action in ALL_ACTIONS:
                next_state = get_next_state(row, col, action, n, obstacle_set)
                v_a = -1.0 + gamma * V[next_state]
                
                # Use a tiny tolerance for floating point comparisons to find ties
                if v_a > max_v + 1e-9:
                    max_v = v_a
                    best_actions = [action]
                elif v_a >= max_v - 1e-9:
                    best_actions.append(action)

            policy[state] = best_actions

    return V, policy, actual_iter
