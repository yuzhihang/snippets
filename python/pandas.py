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


#filter使用正则过滤以“d”开头的列

df.filter(regex=("d.*"))
>>
   d1  d2
0  2   3
1  3   4
2  4   5
select

#除了使用filter的正则外，也可以使用select来选择以“d”开头的列：

df.select(lambda col: col.startswith('d'), axis=1)
>>
   d1  d2
0  2   3
1  3   4
2  4   5