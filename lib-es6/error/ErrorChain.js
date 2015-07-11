/**
 * A chained error
 */
export default class ErrorChain extends Error
{
    /**
     * Constructor
     *
     * @param   {Error}  previousError  The previous error
     * @param   {string} message        The message
     */
    constructor(previousError:Error, message:string)
    {
        super(message);

        this.name = "ErrorChain";
        this.currentMessage = message;
        this.capturedStack = {};
        Error.captureStackTrace(this.capturedStack, ErrorChain);

        this.previousError = previousError;
        this.previousMessage = previousError.message;
        this.previousStack = previousError.stack;
    }

    /**
     * The chained message
     *
     * @return  {string}    The message
     */
    get message()
    {
        return this.currentMessage + " > " + this.previousMessage;
    }

    /**
     * The chained stack
     *
     * @return  {string}    The stack
     */
    get stack()
    {
        let stack = "-".repeat(50) + "\n";
        stack += this.capturedStack.stack + "\n";
        stack += "-".repeat(50) + "\n";
        stack += this.previousStack + "\n";
        return stack;
    }
}
