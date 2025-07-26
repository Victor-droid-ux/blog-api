const generateCode = (codelength = 6) => {
    let code = '';
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < codelength; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Ensure the code is exactly the specified length
    if (code.length < codelength) {
        code = code.padEnd(codelength, '0'); // Pad with zeros if shorter
    }

    if (code.length > codelength) {
        code = code.substring(0, codelength); // Trim if longer
    }

    // Return the generated code
    if (code.length !== codelength) {
        throw new Error(`Generated code length mismatch: expected ${codelength}, got ${code.length}`);
    }
    if (!/^[0-9A-Z]+$/.test(code)) {
        throw new Error('Generated code contains invalid characters');
    }
    if (code.length === 0) {
        throw new Error('Generated code is empty');
    }
    
    return code;
}
module.exports = generateCode;