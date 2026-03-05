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
    Assigns 1~4 actions to each non-obstacle, non-terminal state.
    Strategy: always include ≥1 action that moves toward the goal
    (by row or column), then randomly append 0-3 more unique actions.
    This guarantees a meaningful V(s) gradient in the value matrix
    while keeping the policy visually random and varied.

    Args:
        n           : grid dimension
        obstacle_set: set of (row, col) tuples
        end_state   : (row, col) tuple of the goal

    Returns:
        policy: dict mapping (row, col) -> list of action strings
    """
    end_row, end_col = end_state
    policy = {}

    for row in range(n):
        for col in range(n):
            state = (row, col)
            if state in obstacle_set or state == end_state:
                policy[state] = []
                continue

            # ---------- Compute "useful" directions (toward goal) ----------
            useful = []
            if row > end_row:
                useful.append('up')
            elif row < end_row:
                useful.append('down')
            if col > end_col:
                useful.append('left')
            elif col < end_col:
                useful.append('right')

            # Fallback: if already at goal's row AND col (shouldn't happen, but guard)
            if not useful:
                useful = random.sample(ALL_ACTIONS, 1)

            # Pick 1 useful action as the "core" direction
            core = [random.choice(useful)]

            # Randomly add 0-3 more distinct actions from the rest
            remaining = [a for a in ALL_ACTIONS if a not in core]
            extra_count = random.randint(0, min(3, len(remaining)))
            extra = random.sample(remaining, extra_count)

            policy[state] = core + extra

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
    actual_iter = max_iter

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
            actual_iter = iteration + 1
            break

    return V, actual_iter
