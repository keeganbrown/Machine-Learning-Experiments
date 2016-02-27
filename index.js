'use strict';
const synaptic = require('synaptic');
const Architect = synaptic.Architect;


const input = 9;
const pool = 10;
const output = 1;
const connections = 30;
const gates = 10;

const TRAINING_SET = ([0,1,2,3,4,5,6,7,8,9]).map((num, index, arr) => {
  let _narr = arr.slice();
  _narr.splice(index, 1);
  return {
    input: _narr,
    output: [ num/10 ]
  };
});

console.log(TRAINING_SET);

var LSM = new Architect.Liquid(input, pool, output, connections, gates);

console.log(LSM);
//[ 0, 1, 2, 3, 5, 6, 7, 8, 9 ] => 4

let total = 0;
let right = 0;
function train () {
  LSM.trainer.train(TRAINING_SET, {
    iterations: 200000,
    schedule: {
      every: 5000,
      do: (data) => {
        //console.log(data);
        //if (data.iterations > 250000) {
        //  return true;
        //}
      }
    }
  });

  let precision = 5;
  [1,1,1,1,1]
    .map((num)=>{
      return TRAINING_SET[Math.floor(Math.random()*TRAINING_SET.length)]
    })
    .forEach((setItem)=>{
      let trained = LSM.activate(setItem.input);
      total += 1;
      //console.log( trained, 'expected:', setItem.output, 'similarity:'  );
      if (Math.floor(trained[0]*precision) == Math.floor(setItem.output[0]*precision)) {
        right += 1;
        total && right && console.log(Math.floor((right/total)*100), right, total);
      }
      LSM.propagate(0.1, setItem.output)
    });

  process.nextTick(train);
}

train();
