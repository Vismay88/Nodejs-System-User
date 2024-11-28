const Crypter = require("cryptr");
const Crypto = require("crypto-js");
const shortUniqueId = require("short-unique-id");
const jwt = require("jsonwebtoken");
const { AES, enc } = require("crypto-js");

require("dotenv").config({ path: `../${process.env.NODE_ENV}.env` });

const jwtTokenSecret = process.env.JWT_TOKEN_SECRET;
if (!jwtTokenSecret) {
  throw new Error("JWT_TOKEN_SECRET is missing from environment variables.");
}

const cryptr = new Crypter(jwtTokenSecret);
const userid = new shortUniqueId({ length: 16 });

const getPassword = (value) => cryptr.decrypt(value);
const generatePassword = (value) => cryptr.encrypt(value);

const encryptValue = (value) => Crypto.AES.encrypt(value, jwtTokenSecret).toString();
const decryptValue = (value) => Crypto.AES.decrypt(value, jwtTokenSecret).toString(Crypto.enc.Utf8);



const passwordEncrypt = (data) => AES.encrypt(data, jwtTokenSecret).toString();

const passwordDecrypt = (data) => {
  const bytes = AES.decrypt(data, jwtTokenSecret);
  return bytes.toString(enc.Utf8);
};


module.exports = {
  getPassword,
  generatePassword,
  jwt,
  jwtTokenSecret,
  encryptValue,
  decryptValue,
  userid,
  passwordDecrypt,
  passwordEncrypt
};
