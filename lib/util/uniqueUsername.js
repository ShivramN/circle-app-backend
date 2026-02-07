// program to generate random strings

// declare all characters
const characters ='0123456789';
const specialCharacter ='@#$&_-';
const uniqueUsername = (data) => {
  let result = data.split('@')[0];
  result += specialCharacter.charAt(Math.floor(Math.random() * specialCharacter.length))
  const charactersLength = characters.length;
  for ( let i = 0; i < 5; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

module.exports = uniqueUsername