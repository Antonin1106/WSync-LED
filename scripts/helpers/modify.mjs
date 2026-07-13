/**
 * Logs a message to the console with a yellow [MODIFY].
 * @param message - The message to log.
 */
export default function modify(message) {
    console.log(`[\x1b[33mMODIFY\x1b[0m] ${message}`);
}