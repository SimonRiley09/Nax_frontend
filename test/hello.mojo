import time

start_time = time.time()

def add(a: Int, b:Int) -> Int:
    return a+b

result = add(5, 10)
print("Result: ", result, "Time: ", time.time() - start_time)