/**
 * Logs a success message to the console with a green [OK].
 * @param message - The success message to log.
 */
export default function success(message) {
    console.log(`[\x1b[32mOK\x1b[0m] ${message}`);
}