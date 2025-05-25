export function generateHash(number: number) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const base = alphabet.length;
  let code = '';
  let num = number;

  for (let i = 0; i < 3; i++) {
    code = alphabet[num % base] + code;
    num = Math.floor(num / base);
  }

  return code.toUpperCase();
}
