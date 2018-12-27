//back reference
let s, r;
 s = 'appleapple';
 r = /(apple)\1/;
 console.log(r.test(s));

 s = 'bba';
 r = /.*/;

 //backtracking catastrophy
r=/(a+)*b/;
s = 'aaaaaaaaaaaaaaaaaaaaaaaaaac';

//don't run it!!!
// r.test(s);
r = /(?=(a+)*)b/;
r.test(s);
/*
用原子组避免回溯灾难
JavaScript不支持原子组，也不提供其他方法消除不必要的回溯。不过，可以利用前瞻过程中一项鲜为人知的行为来模拟原子组：前瞻也是原子组。不同的是，前瞻在整个匹配过程中不消耗字符，前瞻只是检查自己包含的模板是否能在当前位置匹配。

* https://www.regular-expressions.info/lookaround.html
*
* The fact that lookaround is zero-length automatically makes it atomic. As soon as the lookaround condition is satisfied, the regex engine forgets about everything inside the lookaround. It will not backtrack inside the lookaround to try different permutations.

The only situation in which this makes any difference is when you use capturing groups inside the lookaround. Since the regex engine does not backtrack into the lookaround, it will not try different permutations of the capturing groups.

For this reason, the regex (?=(\d+))\w+\1 never matches 123x12. First the lookaround captures 123 into \1. \w+ then matches the whole string and backtracks until it matches only 1. Finally, \w+ fails since \1 cannot be matched at any position. Now, the regex engine has nothing to backtrack to, and the overall regex fails. The backtracking steps created by \d+ have been discarded. It never gets to the point where the lookahead captures only 12.

Obviously, the regex engine does try further positions in the string. If we change the subject string, the regex (?=(\d+))\w+\1 does match 56x56 in 456x56.

If you don't use capturing groups inside lookaround, then all this doesn't matter. Either the lookaround condition can be satisfied or it cannot be. In how many ways it can be satisfied is irrelevant.
* */
