def EyePolicy(result):
    type_name = max(result, key=result.get)
    print(result)
    return type_name
