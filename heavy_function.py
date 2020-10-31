
import sys

sys.setrecursionlimit(100000)


class memoized:
    def __init__(self, func):
        self.func = func
        self.cache = {}
    def __call__(self, *args):
        if args in self.cache:
            return self.cache[args]
        else:
            value = self.func(*args)
            self.cache[args] = value
        return value

@memoized
def f(a, b, h):
    if a == 0:
        return b+1
    if b == 0:
        return f(a-1, h, h)
    return f(a-1, f(a, b-1, h), h)


def powers_of_h(h, n):
    powers = [1]
    value = 1
    for _ in range(n+1):
        value = (value * (h+1)) % 32768
        powers.append(value)
    return powers

def g(h):
    powers = powers_of_h(h, h)
    X = (h * powers[-1] + (2*h+1) * sum(powers[:-1])) % 32768

    powers_X = powers_of_h(h, X)
    return (h*powers_X[-1] + (2*h+1) * sum(powers_X[:-1])) % 32768

for i in range(2**15):
    if g(i) == 6:
        print("\nFound! i = ", i)
    if i % 1000 == 0:
        print(i, end='\r')

