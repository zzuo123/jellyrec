import sys

# # Print all arguments
# print("All arguments:", sys.argv)

# # Print individual arguments
# for i, arg in enumerate(sys.argv):
#     print(f"Argument {i}: {arg}")

# open data.json and print first 20 characters (replace \n with space and spaces with one space)
# with open("data.json", "r") as f:
#     data = f.read()
#     print(data[:20].replace("\n", " ").replace("  ", " "))

# open data.json and print it out
# with open("data.json", "r") as f:
#     data = f.read()
#     print(data)

import json

with open('data.json', 'r') as file:
    # Load the JSON data into a Python dictionary
    data = json.load(file)

stuff = data[sys.argv[1]]

stuff_json = json.dumps(stuff)

print(stuff_json)