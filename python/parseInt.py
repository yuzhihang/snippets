def parseInt(s):
    res = 0
    base = ord('0')
    for c in s:
        if not ('0' <= c <= '9'):
            break
        res *= 10
        res += ord(c) - base
    return res

var1 = '1234abc';
print parseInt(var1)