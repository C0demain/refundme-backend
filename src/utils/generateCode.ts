export default function generateCode(length: number) {
  const characters =
    '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let code: string = '';

  for (let x = 0; x < length; x++) {
    const index = Math.floor(Math.random() * characters.length);
    code += characters[index];
  }
  return code;
}
