# import sys

# # Print all arguments
# print("All arguments:", sys.argv)

# # Print individual arguments
# for i, arg in enumerate(sys.argv):
#     print(f"Argument {i}: {arg}")

# open data.json and print first 20 characters (replace \n with space and spaces with one space)
with open("data.json", "r") as f:
    data = f.read()
    print(data[:20].replace("\n", " ").replace("  ", " "))