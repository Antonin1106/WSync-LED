/**
 * Logs an error message to the console with a red [ERROR].
 * @param message - The error message to log.
 */
export default function error(message) {
    console.error(`[\x1b[31mERROR\x1b[0m] ${message}`);
}