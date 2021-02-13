import json
from base64 import b64encode
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
from Crypto.Random import get_random_bytes
data = "jai hind 12 3"
data=bytes(data, 'utf-8') 
# key = get_random_bytes(16)
key=b'aaaaaaaaaaaaaaaa'
print(key)
cipher = AES.new(key, AES.MODE_CBC)
ct_bytes = cipher.encrypt(pad(data, AES.block_size))
iv = b64encode(cipher.iv).decode('utf-8')
ct = b64encode(ct_bytes).decode('utf-8')
result = json.dumps({'iv':iv, 'ciphertext':ct})
print(result)

# b'Z&\xe64Cf?\xc7\x12\x99\xa5\x15\xc8\xfc\xf9>'

import json
from base64 import b64decode
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
# We assume that the key was securely shared beforehand
# try:
b64 = json.loads(result)
iv = b64decode(b64['iv'])
ct = b64decode(b64['ciphertext'])
cipher = AES.new(key, AES.MODE_CBC, iv)
pt = unpad(cipher.decrypt(ct), AES.block_size)
print("The message was: ", pt)
# except ValueError, KeyError:
#     print("Incorrect decryption")