export type PasswordCheck = { length: boolean; mix: boolean }

// Checks the password rules. The form shows them live, and the server action runs the same check.
export function checkPassword(password: string): PasswordCheck {
    return {
        length: password.length >= 12,
        mix: /[A-Za-z]/.test(password) && /\d/.test(password),
    }
}

// Returns 0 to 4 for the strength bar under the password field.
export function passwordStrength(password: string) {
    const check = checkPassword(password)
    return [check.length, check.mix, password.length >= 16, /[^A-Za-z0-9]/.test(password)].filter(Boolean).length
}