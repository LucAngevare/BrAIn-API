import json

with open("riddles.txt", "r", encoding="ISO-8859-1") as f:
    linesToAppend = f.readlines()
    for i in range(len(linesToAppend)):
        linesToAppend[i].strip("\n")
        linesToAppend[i].strip("\r")
        linesToAppend[i].strip("\\n")

with open("riddles.json", "a", encoding="utf8") as r:
    for i in range(len(linesToAppend)):
        if i %2 != 0:
            print("Passing solution {}".format(i))
            continue
        exampleObj = {}
        exampleObj["riddle"] = linesToAppend[i]
        exampleObj["solution"] = linesToAppend[i+1]
        print(exampleObj)
        r.write(json.dumps(exampleObj))
        print("Riddle {} written".format(i))
