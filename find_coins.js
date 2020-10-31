
let coins = [2, 3, 5, 7, 9];

function permutator(inputArr) {
  var results = [];

  function permute(arr, memo) {
    var cur, memo = memo || [];

    for (var i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1);
      if (arr.length === 0) {
        results.push(memo.concat(cur));
      }
      permute(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }

    return results;
  }

  return permute(inputArr);
}

function eval_perm(p) {
    return (p[0] + p[1] * p[2]**2 + p[3]**3 - p[4] == 399);
}

for (let perm of permutator(coins)) {
    if (eval_perm(perm))
        console.log(perm);
}
