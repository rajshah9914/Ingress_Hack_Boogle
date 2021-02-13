from flask import Flask
from flask import request,make_response
import os
app = Flask(__name__)
import requests
import geocoder
import json
from base64 import b64encode
from base64 import b64decode
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import unpad

from newspaper import fulltext
from bs4 import BeautifulSoup
import sys
import textract
import json
import inflect

from nltk.corpus import stopwords
from nltk.corpus import wordnet 
from nltk.tokenize import word_tokenize 
from nltk.stem.porter import PorterStemmer 
from nltk.stem import WordNetLemmatizer
p = inflect.engine()

lemmatizer = WordNetLemmatizer()
stemmer = PorterStemmer() 

def text_lowercase(text): 
	return text.lower() 
  
# convert number into words 
def convert_number(text): 
    # split string into list of words 
    temp_str = text.split() 
    # initialise empty list 
    new_string = [] 
  
    for word in temp_str: 
        # if word is a digit, convert the digit 
        # to numbers and append into the new_string list 
        if word.isdigit(): 
            temp = p.number_to_words(word) 
            new_string.append(temp) 
  
        # append the word as it is 
        else: 
            new_string.append(word) 
  
    # join the words of new_string to form a string 
    temp_str = ' '.join(new_string) 
    return temp_str 

# remove punctuation 
def remove_punctuation(text): 
    translator = str.maketrans('', '', string.punctuation) 
    return text.translate(translator) 

# remove whitespace from text 
def remove_whitespace(text): 
    return  " ".join(text.split()) 
  
# remove stopwords function 
def remove_stopwords(text): 
    stop_words = set(stopwords.words("english")) 
    word_tokens = word_tokenize(text) 
    filtered_text = [word for word in word_tokens if word not in stop_words] 
    return ' '.join(filtered_text)

# stem words in the list of tokenised words 
def stem_words(text): 
    word_tokens = word_tokenize(text) 
    stems = [stemmer.stem(word) for word in word_tokens] 
    return ' '.join(stems)

# lemmatize string 
def lemmatize_word(text): 
    word_tokens = word_tokenize(text) 
    # provide context i.e. part-of-speech 
    lemmas = [lemmatizer.lemmatize(word) for word in word_tokens] 
    return ' '.join(lemmas)

def getTextFromURL(url):
    r = requests.get(url)
    soup = BeautifulSoup(r.text, "html.parser")
    text = ' '.join(map(lambda p: p.text, soup.find_all('p')))
    return text

def summarizeURL(url, total_pars):
    url_text = getTextFromURL(url).replace(u"Â", u"").replace(u"â", u"")
    fs = FrequencySummarizer()
    final_summary = fs.summarize(url_text.replace("\n"," "), total_pars)
    return " ".join(final_summary)

def getfr(final_text,key):
    cnt=int(0)
    ll=key.split(' ')
    # ft=final_text.split(' ')
    syn=[]
    for x in ll:
        for synset in wordnet.synsets(x):
            for lemma in synset.lemmas():
                syn.append(lemma.name())
    syn=set(syn)
    for x in syn:
        cnt+=final_text.count(x)
    return cnt

@app.route('/search')
def search():
    keys=request.args.get('keys').split(',')
    keys=' '.join(keys)
    print(keys)
    keys=lemmatize_word(keys)
    keys=stem_words(keys)
    l=[]
    ans=[]
    ref = requests.get('https://boogle-e8231-default-rtdb.firebaseio.com/bookmarks.json').content
    ref=json.loads(ref)
    for x in ref:
        p=[]
        title=ref[x].get('title',"")
        desc=ref[x].get('description',"")
        url=ref[x].get('url',"")
        keywords=ref[x].get('keywords',[])
        tags=ref[x].get('tags',"").split(',')
        tags=' '.join(tags)
        final_text=title+" "+desc+" "+tags+" "
        for kk in keywords:
            final_text+=kk+" "
        hh=final_text
        final_text=text_lowercase(final_text)
        final_text=convert_number(final_text)
        # final_text=remove_punctuation(final_text)
        final_text=remove_stopwords(final_text)
        final_text=stem_words(final_text)
        final_text=lemmatize_word(final_text)
        final_text+=" "+hh
        print(final_text)
        f=getfr(final_text,keys)
        print(f)
        if(f>0):
            pp=[]
            pp.append(f)
            pp.append(url)
            ans.append(pp)
    ans.sort()
    ans.reverse()
    res=dict()
    for val in ans:
        res[val[1]]=val[0]
    
    ans=json.dumps(res)
    resp=make_response(ans)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Headers']= "Origin, X-Requested-With, Content-Type, Accept"
    return resp
    print(ans)
    
    return "chal re"

@app.route('/encrypt')
def encrypt():
    msg=request.args.get('msg')
    msg=str(msg)
    data = bytes(msg, 'utf-8') 
    # key=b'aaaaaaaaaaaaaaaa'
    key=request.args.get('key')
    print(key)
    key=bytes(key, 'utf-8')
    print(key)
    cipher = AES.new(key, AES.MODE_CBC)
    ct_bytes = cipher.encrypt(pad(data, AES.block_size))
    iv = b64encode(cipher.iv).decode('utf-8')
    ct = b64encode(ct_bytes).decode('utf-8')
    result = json.dumps({'iv':iv, 'ciphertext':ct})
    print(result)
    resp=make_response(result)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Headers'] = "Origin, X-Requested-With, Content-Type, Accept"
    # print(msg)
    return resp

@app.route('/decrypt')
def decrypt():
    msg=request.args.get('msg')
    # msg=str(msg)
    msg=b64decode(msg)
    print(msg) 
    # key=b'aaaaaaaaaaaaaaaa'
    key=request.args.get('key')
    print(key)
    key=bytes(key, 'utf-8')
    b64 = json.loads(msg)
    iv = b64decode(b64['iv'])
    ct = b64decode(b64['ciphertext'])
    cipher = AES.new(key, AES.MODE_CBC, iv)
    pt = unpad(cipher.decrypt(ct), AES.block_size)
    print("The message was: ", pt)
    # # print(result)
    pt=pt.decode("utf-8") 
    resp=make_response(pt)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Headers'] = "Origin, X-Requested-With, Content-Type, Accept"
    # print(msg)
    return resp

@app.route('/sms')
def sms():
    g = geocoder.ip('me')
    url_to_hit = "https://www.fast2sms.com/dev/bulk"
    loc=[g.latlng[0],g.latlng[1]]
    querystring = {"authorization":"SpAench6zXZlebGIMH1Tnw41rl9SJwL0TEve75yp1kuVITkbZQOUz4HGFLfc","sender_id":"FSTSMS","message":"Cyber fraud has been detected at location ("+str(loc[0])+","+str(loc[1])+"). Require assistance at the earliest..","language":"english","route":"p","numbers":"9081885750"}

    headers = {
        'cache-control': "no-cache"
    }

    response = requests.request("GET", url_to_hit, headers=headers, params=querystring)
    return "sms"

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 9000))
    app.run(host='0.0.0.0', port=port,debug=True)
