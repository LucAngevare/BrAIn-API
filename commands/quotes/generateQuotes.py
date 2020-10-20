# import json
import markovify
#
# with open("./quotes.json") as f:
#     quotes = json.loads(f.read())
#
# otherFile = open('./quotes.txt', 'a')
with open("./quotes.txt") as f:
    text = f.read()
#
# for i in range(len(quotes)):
#     otherFile.write(quotes[i]["Quote"].encode('utf-8') + "\n")

text_model = markovify.Text(text)
newQuotesFile = open('./newQuotes.txt', 'a')

for i in range(100000):
    newQuotesFile.write(text_model.make_sentence() + "\n")
