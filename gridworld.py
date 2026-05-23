"""
gridworld.py - Core logic for GridWorld HW1
Handles random policy generation, policy evaluation (HW1-2),
and value iteration (HW1-3).
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


def random_policy(n, obstacle_set, end_state, seed=None):
    """
    HW1-2: Generate a random stochastic policy.
    For each non-terminal, non-obstacle cell, pick 1~2 random actions
    uniformly at random and assign them equal probability.

    Returns:
        policy: dict mapping (row, col) -> dict {action: probability}
    """
    if seed is not None:
        random.seed(seed)

    policy = {}
    for row in range(n):
        for col in range(n):
            state = (row, col)
            if state in obstacle_set or state == end_state:
                policy[state] = {}
                continue

            k = random.randint(1, 2)
            chosen = random.sample(ALL_ACTIONS, k)
            prob = 1.0 / k
            policy[state] = {a: prob for a in chosen}
    return policy


def policy_evaluation(n, obstacle_set, end_state, policy,
                      gamma=0.9, theta=1e-6, max_iter=10000):
    """
    HW1-2: Iterative policy evaluation using the Bellman expectation equation
        V_pi(s) = sum_a pi(a|s) * [ R + gamma * V_pi(s') ]

    Reward: -1 per step, terminal state V = 0.

    Args:
        policy: dict mapping (row, col) -> dict {action: probability}

    Returns:
        V: dict mapping (row, col) -> float value
        iterations: actual number of sweeps until convergence
    """
    V = {(r, c): 0.0 for r in range(n) for c in range(n)}
    actual_iter = 0

    for iteration in range(max_iter):
        delta = 0.0
        for row in range(n):
            for col in range(n):
                state = (row, col)
                if state in obstacle_set or state == end_state:
                    continue

                old_v = V[state]
                new_v = 0.0
                for action, prob in policy[state].items():
                    next_state = get_next_state(row, col, action, n, obstacle_set)
                    new_v += prob * (-1.0 + gamma * V[next_state])

                V[state] = new_v
                delta = max(delta, abs(old_v - new_v))

        actual_iter = iteration + 1
        if delta < theta:
            break

    return V, actual_iter


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

    # Extract optimal policy (Deterministic)
    policy = {}
    for row in range(n):
        for col in range(n):
            state = (row, col)
            if state in obstacle_set or state == end_state:
                policy[state] = []
                continue

            max_v = float('-inf')
            best_action = None

            for action in ALL_ACTIONS:
                next_state = get_next_state(row, col, action, n, obstacle_set)
                v_a = -1.0 + gamma * V[next_state]
                
                if v_a > max_v + 1e-9:
                    max_v = v_a
                    best_action = action

            policy[state] = [best_action] if best_action else []

    return V, policy, actual_iter
